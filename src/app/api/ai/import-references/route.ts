// API IA : importe des références à partir des cahiers de références PDF.
//
//  Deux modes sur le même endpoint :
//   1) ANALYSE  (multipart/form-data, champ "files") : Claude lit chaque PDF
//      nativement et renvoie une liste structurée de références (aperçu).
//   2) IMPORT   (JSON { action:'import', references, statut }) : insère les
//      fiches validées dans references_projets (session admin -> RLS respectée)
//      et relie chaque fiche à sa société (reference_membres) quand elle est connue.
import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@/lib/supabase-server';
import { slugify } from '@/lib/slug';
import { extractPageImages, type PdfImage } from '@/lib/pdf-images';

export const runtime = 'nodejs';
export const maxDuration = 300; // extraction PDF = potentiellement longue

// Catégories autorisées (identiques à celles déjà utilisées sur le site).
const CATEGORIES = [
  'Logement',
  'Bureaux et tertiaires',
  'Industries et logistiques',
  'Hospitalier',
  'Equipements sportifs',
  'Hôtelleries et restaurations',
  'Autres ouvrages fonctionnels',
];
const SOCIETES = ['buscot', 'arteix', 'gradient', 'therac'];

type RefExtrait = {
  titre: string;
  categorie: string;
  localisation?: string | null;
  description?: string | null;
  maitrise_ouvrage?: string | null;
  intervenants?: string[];
  specificites?: string[];
  societes?: string[];       // slugs des bureaux intervenus (N-N)
  mission?: string | null;
  page?: number | null;      // page du PDF (pour rattacher les photos)
  photos?: { url: string; nom_fichier: string }[]; // photos extraites du PDF
};

// Récupère tous les objets JSON complets {...} de premier niveau.
// Tolère une réponse tronquée (garde les objets entiers, ignore le dernier coupé).
function extractObjects(s: string): any[] {
  const objs: any[] = [];
  let depth = 0, start = -1, inStr = false, esc = false;
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (inStr) {
      if (esc) esc = false;
      else if (c === '\\') esc = true;
      else if (c === '"') inStr = false;
      continue;
    }
    if (c === '"') { inStr = true; continue; }
    if (c === '{') { if (depth === 0) start = i; depth++; }
    else if (c === '}') {
      depth--;
      if (depth === 0 && start !== -1) {
        try { objs.push(JSON.parse(s.slice(start, i + 1))); } catch { /* objet illisible */ }
        start = -1;
      }
    }
  }
  return objs;
}

// Extrait le tableau JSON d'une réponse (tolère le texte, ```json, et la troncature).
function parseJsonArray(text: string): any[] {
  const clean = text.replace(/```json|```/g, '').trim();
  try {
    const direct = JSON.parse(clean);
    if (Array.isArray(direct)) return direct;
    if (Array.isArray(direct?.references)) return direct.references;
  } catch { /* on tente l'extraction ci-dessous */ }
  const a = clean.indexOf('[');
  const b = clean.lastIndexOf(']');
  if (a !== -1 && b > a) {
    try {
      const arr = JSON.parse(clean.slice(a, b + 1));
      if (Array.isArray(arr)) return arr;
    } catch { /* réponse probablement tronquée -> repli objet par objet */ }
  }
  return extractObjects(clean);
}

const PROMPT = `Tu analyses le CAHIER DE RÉFÉRENCES (PDF) d'un bureau d'études du groupement PULZ (maîtrise d'œuvre & ingénierie du bâtiment, Hauts-de-France).

Extrais TOUTES les fiches projet / références présentes dans le document. Pour chacune, renvoie un objet avec exactement ces champs :
- "titre" : intitulé court et clair du projet (string, obligatoire)
- "categorie" : UNE valeur parmi cette liste EXACTE : ${CATEGORIES.map((c) => `"${c}"`).join(', ')}. Choisis la plus proche.
- "localisation" : ville et/ou département (string) ou null
- "description" : 2 à 4 phrases factuelles décrivant le projet (nature, surface, nombre de logements, prestations…), tirées du PDF
- "maitrise_ouvrage" : maître d'ouvrage / client si mentionné, sinon null
- "intervenants" : tableau de strings ("Architecte — Nom", "BET structure — Nom"…) ou []
- "specificites" : tableau de strings courtes (surface, montant travaux, certifications, contraintes…) ou []
- "societes" : tableau des bureaux du groupe intervenus sur ce projet, uniquement parmi ${SOCIETES.map((s) => `"${s}"`).join(', ')} (si le document le précise), sinon []
- "mission" : la mission assurée par le(s) bureau(x) sur ce projet, si indiquée, sinon null
- "page" : le numéro de la page du PDF (entier, 1 = première page) où se trouve cette fiche, pour y rattacher les photos. Donne ta meilleure estimation si tu hésites.

Règles :
- N'invente RIEN : si une info est absente, mets null ou [].
- Ne crée pas de doublons.
- Réponds UNIQUEMENT avec un tableau JSON (commençant par [ et finissant par ]), sans texte autour.`;

// Devine la société d'après le nom de fichier (repli : null).
function guessSociete(filename: string): string | null {
  const f = filename.toLowerCase();
  return SOCIETES.find((s) => f.includes(s)) ?? null;
}

async function analyse(req: Request, sb: ReturnType<typeof createClient>) {
  const form = await req.formData();
  const files = form.getAll('files').filter((f): f is File => f instanceof File);
  if (files.length === 0) return NextResponse.json({ error: 'Aucun PDF fourni' }, { status: 400 });

  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });
  const references: RefExtrait[] = [];
  const errors: string[] = [];

  for (const file of files) {
    try {
      const bytes = new Uint8Array(await file.arrayBuffer());
      const b64 = Buffer.from(bytes).toString('base64');
      const societe = guessSociete(file.name);

      // 1) Extraction structurée par Claude (texte + n° de page).
      const msg = await anthropic.messages.create({
        model: 'claude-sonnet-4-6',
        max_tokens: 16000,
        messages: [{
          role: 'user',
          content: [
            { type: 'document', source: { type: 'base64', media_type: 'application/pdf', data: b64 } } as any,
            { type: 'text', text: PROMPT },
          ],
        }],
      });
      const text = msg.content.filter((c: any) => c.type === 'text').map((c: any) => c.text).join('\n') || '[]';
      const list = parseJsonArray(text);
      console.log(`[import] ${file.name}: stop=${(msg as any).stop_reason} textLen=${text.length} parsed=${list.length}`);
      if (list.length === 0) console.log('[import] apercu reponse IA:', text.slice(0, 600));

      const fileRefs: RefExtrait[] = [];
      for (const r of list) {
        if (!r?.titre) continue;
        // Sociétés : ce que l'IA a détecté (tableau ou valeur unique) + repli sur
        // la société devinée d'après le nom du fichier. On ne garde que les slugs connus.
        const rawSocs = Array.isArray(r.societes) ? r.societes : (r.societe ? [r.societe] : []);
        const socs = Array.from(new Set(
          [...rawSocs, societe].filter((s): s is string => !!s && SOCIETES.includes(s)),
        ));
        fileRefs.push({
          titre: String(r.titre).trim(),
          categorie: CATEGORIES.includes(r.categorie) ? r.categorie : 'Autres ouvrages fonctionnels',
          localisation: r.localisation ?? null,
          description: r.description ?? null,
          maitrise_ouvrage: r.maitrise_ouvrage ?? null,
          intervenants: Array.isArray(r.intervenants) ? r.intervenants : [],
          specificites: Array.isArray(r.specificites) ? r.specificites : [],
          societes: socs,
          mission: r.mission ?? null,
          page: Number.isFinite(Number(r.page)) ? Number(r.page) : null,
          photos: [],
        });
      }

      // 2) Extraction des photos du PDF, rattachées à la fiche par n° de page.
      try {
        const images = await extractPageImages(bytes);
        if (images.length) {
          const byPage = new Map<number, PdfImage[]>();
          for (const im of images) {
            const arr = byPage.get(im.page) ?? [];
            arr.push(im);
            byPage.set(im.page, arr);
          }
          for (const arr of byPage.values()) arr.sort((a, b) => b.width * b.height - a.width * a.height);

          for (const ref of fileRefs) {
            const imgs = ref.page ? (byPage.get(ref.page) ?? []) : [];
            const top = imgs.slice(0, 6); // photos + logo(s) de la page ; l'admin arbitre ensuite
            const uploaded: { url: string; nom_fichier: string }[] = [];
            for (let i = 0; i < top.length; i++) {
              const im = top[i];
              const mime = im.ext === 'png' ? 'image/png' : 'image/jpeg';
              const base = (slugify(ref.titre).slice(0, 50) || 'photo');
              const path = `references/import/${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${base}-${i + 1}.${im.ext}`;
              const blob = new Blob([im.bytes as unknown as BlobPart], { type: mime });
              const { error: upErr } = await sb.storage.from('photos').upload(path, blob, { contentType: mime, upsert: true });
              if (upErr) continue;
              const { data: pub } = sb.storage.from('photos').getPublicUrl(path);
              uploaded.push({ url: pub.publicUrl, nom_fichier: `${base}-${i + 1}.${im.ext}` });
            }
            ref.photos = uploaded;
          }
        }
      } catch (imgErr: any) {
        console.error('Extraction images échouée', file.name, imgErr?.message);
        errors.push(`${file.name} : photos non extraites (${imgErr?.message || 'erreur'})`);
      }

      references.push(...fileRefs);
    } catch (e: any) {
      console.error('Analyse PDF échouée', file.name, e?.message);
      errors.push(`${file.name} : ${e?.message || 'lecture impossible'}`);
    }
  }

  return NextResponse.json({ references, errors, categories: CATEGORIES });
}

async function importer(sb: ReturnType<typeof createClient>, body: any) {
  const refs: RefExtrait[] = Array.isArray(body.references) ? body.references : [];
  const statut = body.statut === 'publie' ? 'publie' : 'brouillon';
  if (refs.length === 0) return NextResponse.json({ error: 'Aucune référence à importer' }, { status: 400 });

  // Slugs déjà pris (pour éviter les collisions).
  const { data: existing } = await sb.from('references_projets').select('slug');
  const taken = new Set((existing ?? []).map((r: any) => r.slug));
  const uniqueSlug = (base: string) => {
    let s = base || 'reference';
    let i = 2;
    while (taken.has(s)) s = `${base}-${i++}`;
    taken.add(s);
    return s;
  };

  // Map société slug -> id (pour le lien reference_membres).
  const { data: socs } = await sb.from('societes').select('id, slug');
  const socMap = new Map((socs ?? []).map((s: any) => [s.slug, s.id]));

  let inserted = 0;
  const errors: string[] = [];

  for (const r of refs) {
    try {
      const slug = uniqueSlug(slugify(`${r.titre}${r.localisation ? '-' + r.localisation : ''}`));
      const { data: row, error } = await sb
        .from('references_projets')
        .insert({
          slug,
          titre: r.titre,
          categorie: CATEGORIES.includes(r.categorie as string) ? r.categorie : 'Autres ouvrages fonctionnels',
          localisation: r.localisation || null,
          description: r.description || null,
          maitrise_ouvrage: r.maitrise_ouvrage || null,
          intervenants: r.intervenants ?? [],
          specificites: r.specificites ?? [],
          statut,
        })
        .select('id')
        .single();
      if (error) throw error;
      inserted++;

      // Liens vers les sociétés intervenues (best-effort : n'interrompt pas l'import).
      const socSlugs = Array.from(new Set((r.societes ?? []).filter(Boolean)));
      const links = socSlugs
        .map((slug) => socMap.get(slug))
        .filter((id): id is string => !!id)
        .map((societe_id) => ({ reference_id: row!.id, societe_id, mission: r.mission || null }));
      if (links.length > 0) {
        await sb.from('reference_membres').insert(links);
      }

      // Photos extraites du PDF -> table photos + galerie reference_photos.
      const photos = Array.isArray(r.photos) ? r.photos : [];
      for (let i = 0; i < photos.length; i++) {
        const ph = photos[i];
        if (!ph?.url) continue;
        const { data: prow, error: pErr } = await sb
          .from('photos')
          .insert({ url: ph.url, nom_fichier: ph.nom_fichier || `photo-${i + 1}.jpg`, categorie: 'references', a_renommer: false })
          .select('id')
          .single();
        if (pErr || !prow) continue;
        await sb.from('reference_photos').insert({ reference_id: row!.id, photo_id: prow.id, ordre: i, couverture: i === 0 });
      }
    } catch (e: any) {
      console.error('Import référence échoué', r.titre, e?.message);
      errors.push(`${r.titre} : ${e?.message || 'insertion impossible'}`);
    }
  }

  return NextResponse.json({ inserted, total: refs.length, errors });
}

export async function POST(req: Request) {
  try {
    // Auth obligatoire (endpoint payant + écriture en base).
    const sb = createClient();
    const { data: { user } } = await sb.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

    const ct = req.headers.get('content-type') || '';
    if (ct.includes('multipart/form-data')) return await analyse(req, sb);

    const body = await req.json();
    if (body?.action === 'import') return await importer(sb, body);

    return NextResponse.json({ error: 'Requête invalide' }, { status: 400 });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: e?.message || 'Erreur serveur' }, { status: 500 });
  }
}
