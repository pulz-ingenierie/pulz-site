'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase-browser';
import { slugify } from '@/lib/slug';
import AiSeoButton from './AiSeoButton';
import PhotoUpload, { type UploadedPhoto } from './PhotoUpload';

const CATEGORIES = [
  'Logement',
  'Bureaux et tertiaires',
  'Industries et logistiques',
  'Hospitalier',
  'Hôtelleries et restaurations',
  'Equipements sportifs',
  'Autres ouvrages fonctionnels',
];

export type RefRecord = {
  id?: string;
  slug?: string;
  titre?: string;
  categorie?: string;
  localisation?: string | null;
  description?: string | null;
  maitrise_ouvrage?: string | null;
  intervenants?: string[];
  specificites?: string[];
  statut?: string;
  seo_titre?: string | null;
  seo_description?: string | null;
  client_logo_url?: string | null;
};

type Photo = { id: string; url: string; nom_fichier: string; a_renommer: boolean; couverture: boolean; ordre: number };

export default function RefForm({ initial }: { initial: RefRecord | null }) {
  const router = useRouter();
  const editing = !!initial?.id;
  const [f, setF] = useState<RefRecord>({
    titre: '', categorie: CATEGORIES[0], localisation: '', description: '',
    maitrise_ouvrage: '', intervenants: [], specificites: [], statut: 'brouillon',
    seo_titre: '', seo_description: '', ...initial,
  });
  const [slugTouched, setSlugTouched] = useState(editing);
  const [notice, setNotice] = useState<{ t: 'ok' | 'err'; m: string } | null>(null);
  const [saving, setSaving] = useState(false);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [socs, setSocs] = useState<{ id: string; slug: string; nom: string }[]>([]);
  // Membres intervenus : clé = societe_id, valeur = mission (présence de la clé = coché).
  const [members, setMembers] = useState<Record<string, string>>({});

  const set = (k: keyof RefRecord, v: any) => setF((p) => ({ ...p, [k]: v }));
  const slug = slugTouched ? f.slug || '' : slugify(f.titre || '');
  const toggleMember = (id: string) =>
    setMembers((prev) => {
      const next = { ...prev };
      if (id in next) delete next[id];
      else next[id] = '';
      return next;
    });
  const setMission = (id: string, mission: string) =>
    setMembers((prev) => ({ ...prev, [id]: mission }));

  // Liste des sociétés du groupe (pour la sélection des membres).
  useEffect(() => {
    (async () => {
      const sb = createClient();
      const { data } = await sb.from('societes').select('id, slug, nom').order('nom');
      setSocs(data ?? []);
    })();
  }, []);

  useEffect(() => {
    if (!editing) return;
    (async () => {
      const sb = createClient();
      // Deux requêtes (pas de FK déclarée entre reference_photos.photo_id et photos.id,
      // donc la jointure imbriquée échoue — on récupère les photos séparément).
      const { data: rp } = await sb
        .from('reference_photos')
        .select('photo_id, ordre, couverture')
        .eq('reference_id', initial!.id)
        .order('ordre');
      const ids = (rp ?? []).map((r: any) => r.photo_id).filter(Boolean);
      let pmap: Record<string, any> = {};
      if (ids.length) {
        const { data: ph } = await sb.from('photos').select('id, url, nom_fichier, a_renommer').in('id', ids);
        pmap = Object.fromEntries((ph ?? []).map((p: any) => [p.id, p]));
      }
      setPhotos(
        (rp ?? [])
          .map((r: any) => {
            const p = pmap[r.photo_id];
            return p ? { id: p.id, url: p.url, nom_fichier: p.nom_fichier, a_renommer: p.a_renommer, couverture: r.couverture, ordre: r.ordre } : null;
          })
          .filter(Boolean) as Photo[],
      );
      const { data: rm } = await sb
        .from('reference_membres')
        .select('societe_id, mission')
        .eq('reference_id', initial!.id);
      const rec: Record<string, string> = {};
      (rm ?? []).forEach((r: any) => { rec[r.societe_id] = r.mission ?? ''; });
      setMembers(rec);
    })();
  }, [editing, initial]);

  // Synchronise les liens reference_membres (avec leur mission) avec la sélection courante.
  async function syncMembers(refId: string) {
    const sb = createClient();
    await sb.from('reference_membres').delete().eq('reference_id', refId);
    const rows = Object.entries(members).map(([societe_id, mission]) => ({
      reference_id: refId,
      societe_id,
      mission: mission.trim() || null,
    }));
    if (rows.length) await sb.from('reference_membres').insert(rows);
  }

  async function save(publish?: boolean) {
    setSaving(true);
    setNotice(null);
    const sb = createClient();
    const payload = {
      slug: (slug || slugify(f.titre || '')).slice(0, 90),
      titre: f.titre,
      categorie: f.categorie,
      localisation: f.localisation || null,
      description: f.description || null,
      maitrise_ouvrage: f.maitrise_ouvrage || null,
      intervenants: (f.intervenants ?? []).map((s) => s.trim()).filter(Boolean),
      specificites: (f.specificites ?? []).map((s) => s.trim()).filter(Boolean),
      seo_titre: f.seo_titre || null,
      seo_description: f.seo_description || null,
      client_logo_url: f.client_logo_url || null,
      statut: publish === undefined ? f.statut : publish ? 'publie' : 'brouillon',
    };
    try {
      if (editing) {
        const { error } = await sb.from('references_projets').update(payload).eq('id', initial!.id);
        if (error) throw error;
        await syncMembers(initial!.id!);
        setF((p) => ({ ...p, statut: payload.statut }));
        setNotice({ t: 'ok', m: payload.statut === 'publie' ? 'Référence enregistrée et publiée.' : 'Référence enregistrée (brouillon).' });
        router.refresh(); // invalide le cache -> la liste admin affiche le bon statut
      } else {
        const { data, error } = await sb.from('references_projets').insert(payload).select('id').single();
        if (error) throw error;
        await syncMembers(data.id);
        setNotice({ t: 'ok', m: 'Référence créée.' });
        router.push(`/admin/references/${data.id}`);
        router.refresh();
      }
    } catch (e: any) {
      setNotice({ t: 'err', m: e?.message || "Erreur d'enregistrement" });
    } finally {
      setSaving(false);
    }
  }

  async function onUploaded(up: UploadedPhoto[]) {
    const sb = createClient();
    const startOrdre = photos.length;
    const rows = up.map((p, i) => ({
      reference_id: initial!.id,
      photo_id: p.id,
      ordre: startOrdre + i,
      couverture: startOrdre + i === 0,
    }));
    const { error } = await sb.from('reference_photos').insert(rows);
    if (error) { setNotice({ t: 'err', m: error.message }); return; }
    setPhotos((prev) => [
      ...prev,
      ...up.map((p, i) => ({ id: p.id, url: p.url, nom_fichier: p.nom_fichier, a_renommer: p.a_renommer, couverture: startOrdre + i === 0, ordre: startOrdre + i })),
    ]);
  }

  async function renameWithAI(photoId: string, url: string) {
    const res = await fetch('/api/ai/rename-photo', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ imageUrl: url }),
    });
    if (!res.ok) { setNotice({ t: 'err', m: 'IA indisponible (clé ANTHROPIC_API_KEY manquante ?)' }); return; }
    const data = await res.json();
    const sb = createClient();
    await sb.from('photos').update({ nom_fichier: data.nom_fichier, description: data.description, a_renommer: false }).eq('id', photoId);
    setPhotos((prev) => prev.map((p) => (p.id === photoId ? { ...p, nom_fichier: data.nom_fichier, a_renommer: false } : p)));
  }

  async function removeReference() {
    if (!editing) return;
    if (!confirm(`Supprimer la référence « ${f.titre} » ?\n\nCette action est définitive (la fiche et ses liens sont supprimés).`)) return;
    setSaving(true);
    const sb = createClient();
    const { error } = await sb.from('references_projets').delete().eq('id', initial!.id);
    if (error) { setNotice({ t: 'err', m: error.message }); setSaving(false); return; }
    router.push('/admin/references');
    router.refresh();
  }

  // Réordonne : ré-indexe ordre (0..n) et marque la 1re comme couverture, en base + à l'écran.
  async function applyOrder(list: Photo[]) {
    const reindexed = list.map((p, i) => ({ ...p, ordre: i, couverture: i === 0 }));
    setPhotos(reindexed);
    const sb = createClient();
    await Promise.all(
      reindexed.map((p) =>
        sb.from('reference_photos').update({ ordre: p.ordre, couverture: p.couverture })
          .eq('reference_id', initial!.id).eq('photo_id', p.id),
      ),
    );
  }

  function movePhoto(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= photos.length) return;
    const list = [...photos];
    [list[i], list[j]] = [list[j], list[i]];
    applyOrder(list);
  }

  function makeCover(i: number) {
    if (i <= 0) return;
    const list = [...photos];
    const [item] = list.splice(i, 1);
    list.unshift(item);
    applyOrder(list);
  }

  async function removePhoto(photoId: string) {
    const sb = createClient();
    await sb.from('reference_photos').delete().eq('reference_id', initial!.id).eq('photo_id', photoId);
    await applyOrder(photos.filter((p) => p.id !== photoId));
  }

  // Envoie une image de la galerie vers le champ « logo client » (et la retire de la galerie).
  async function setClientLogo(p: Photo) {
    const sb = createClient();
    await sb.from('references_projets').update({ client_logo_url: p.url }).eq('id', initial!.id);
    set('client_logo_url', p.url);
    await removePhoto(p.id);
  }

  async function clearClientLogo() {
    const sb = createClient();
    await sb.from('references_projets').update({ client_logo_url: null }).eq('id', initial!.id);
    set('client_logo_url', null);
  }

  const seoTLen = (f.seo_titre || '').length;
  const seoDLen = (f.seo_description || '').length;

  return (
    <>
      {notice && <div className={`notice ${notice.t}`}>{notice.m}</div>}

      <div className="acard">
        <h2>Informations du projet</h2>
        <div className="aform">
          <div className="fld">
            <label>Titre du projet *</label>
            <input type="text" value={f.titre || ''} onChange={(e) => set('titre', e.target.value)} placeholder="ex. Banque de France — Rue Royale" />
          </div>
          <div className="frow">
            <div className="fld">
              <label>Catégorie *</label>
              <select value={f.categorie} onChange={(e) => set('categorie', e.target.value)}>
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="fld">
              <label>Localisation</label>
              <input type="text" value={f.localisation || ''} onChange={(e) => set('localisation', e.target.value)} placeholder="ex. Lille" />
            </div>
          </div>
          <div className="fld">
            <label>Lien (slug)</label>
            <input type="text" value={slug} onChange={(e) => { setSlugTouched(true); set('slug', slugify(e.target.value)); }} />
            <div className="help">Adresse de la page : /references/{slug || '…'}</div>
          </div>
          <div className="fld">
            <label>Description</label>
            <textarea value={f.description || ''} onChange={(e) => set('description', e.target.value)} rows={3} />
          </div>
          <div className="fld">
            <label>Maîtrise d'ouvrage</label>
            <input type="text" value={f.maitrise_ouvrage || ''} onChange={(e) => set('maitrise_ouvrage', e.target.value)} />
          </div>
          <div className="frow">
            <div className="fld">
              <label>Intervenants (un par ligne)</label>
              <textarea value={(f.intervenants ?? []).join('\n')} onChange={(e) => set('intervenants', e.target.value.split('\n'))} rows={4} placeholder={'Architecte — X\nBET — Y'} />
            </div>
            <div className="fld">
              <label>Spécificités (une par ligne)</label>
              <textarea value={(f.specificites ?? []).join('\n')} onChange={(e) => set('specificites', e.target.value.split('\n'))} rows={4} />
            </div>
          </div>
        </div>
      </div>

      <div className="acard">
        <h2>Membres du groupe intervenus</h2>
        <p className="hint">Cochez les bureaux ayant participé à ce projet, puis précisez la mission de chacun.</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {socs.map((s) => {
            const on = s.id in members;
            return (
              <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 14, minWidth: 170 }}>
                  <input type="checkbox" checked={on} onChange={() => toggleMember(s.id)} />
                  {s.nom}
                </label>
                {on && (
                  <input
                    type="text"
                    value={members[s.id] || ''}
                    onChange={(e) => setMission(s.id, e.target.value)}
                    placeholder="Mission sur le projet (ex. Fluides & électricité, VRD…)"
                    style={{ flex: 1, minWidth: 260, padding: '9px 12px', border: '1px solid var(--line)', borderRadius: 8, fontFamily: 'inherit', fontSize: 14 }}
                  />
                )}
              </div>
            );
          })}
          {socs.length === 0 && <span className="hint">Chargement des sociétés…</span>}
        </div>
      </div>

      <div className="acard">
        <h2>Référencement (SEO)</h2>
        <p className="hint">Ce que Google affiche. L'assistant IA peut les rédiger pour vous.</p>
        <div style={{ marginBottom: 16 }}>
          <AiSeoButton
            type="reference"
            getPayload={() => ({ titre: f.titre || '', contenu: f.description || '', localisation: f.localisation || '' })}
            onResult={(seo) => setF((p) => ({ ...p, seo_titre: seo.seo_titre, seo_description: seo.seo_description }))}
          />
        </div>
        <div className="fld">
          <div className="lblrow"><label>Titre SEO</label><span className={`count${seoTLen > 60 ? ' over' : ''}`}>{seoTLen}/60</span></div>
          <input type="text" value={f.seo_titre || ''} onChange={(e) => set('seo_titre', e.target.value)} />
        </div>
        <div className="fld">
          <div className="lblrow"><label>Description SEO</label><span className={`count${seoDLen > 155 ? ' over' : ''}`}>{seoDLen}/155</span></div>
          <textarea value={f.seo_description || ''} onChange={(e) => set('seo_description', e.target.value)} rows={2} />
        </div>
      </div>

      <div className="acard">
        <h2>Photos du projet</h2>
        {editing ? (
          <>
            {/* Logo du client (champ dédié, affiché séparément sur la fiche publique) */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap', marginBottom: 18, paddingBottom: 18, borderBottom: '1px solid var(--line)' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--deep)' }}>Logo du client :</div>
              {f.client_logo_url ? (
                <>
                  <img src={f.client_logo_url} alt="Logo client" style={{ height: 46, maxWidth: 170, objectFit: 'contain', border: '1px solid var(--line)', borderRadius: 8, padding: 6, background: '#fff' }} />
                  <button type="button" className="mini del" onClick={clearClientLogo}>Retirer</button>
                </>
              ) : (
                <span className="hint" style={{ margin: 0 }}>aucun — clique « Logo client » sur l'image concernée ci-dessous.</span>
              )}
            </div>

            <p className="hint">La 1ʳᵉ photo est la couverture. Réordonne avec ↑/↓, choisis la couverture (★), ou envoie une image vers le logo client. L'IA peut renommer les fichiers « appareil photo ».</p>
            <PhotoUpload folder="references" multiple onUploaded={onUploaded} />
            {photos.length > 0 && (
              <div className="gallery">
                {photos.map((p, i) => (
                  <div className="gtile" key={p.id}>
                    <div className="im" style={{ backgroundImage: `url(${p.url})` }}>
                      {i === 0 && <span className="cover-badge">Couverture</span>}
                    </div>
                    <div className="meta">
                      <div className={`fn${p.a_renommer ? ' warn' : ''}`}>{p.nom_fichier}</div>
                      <div className="acts" style={{ flexWrap: 'wrap' }}>
                        <button type="button" className="mini" onClick={() => movePhoto(i, -1)} disabled={i === 0} title="Monter">↑</button>
                        <button type="button" className="mini" onClick={() => movePhoto(i, 1)} disabled={i === photos.length - 1} title="Descendre">↓</button>
                        {i !== 0 && <button type="button" className="mini" onClick={() => makeCover(i)} title="Définir comme couverture">★ Couv.</button>}
                        <button type="button" className="mini" onClick={() => setClientLogo(p)} title="Utiliser comme logo client">Logo client</button>
                        {p.a_renommer && <button type="button" className="mini ai" onClick={() => renameWithAI(p.id, p.url)}>IA</button>}
                        <button type="button" className="mini del" onClick={() => removePhoto(p.id)}>Suppr.</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="notice warn">Enregistrez d'abord la référence pour pouvoir ajouter des photos.</div>
        )}
      </div>

      <div style={{ display: 'flex', gap: 12, position: 'sticky', bottom: 0, background: 'var(--paper-2)', padding: '14px 0', borderTop: '1px solid var(--line)' }}>
        <button type="button" className="abtn ghost" onClick={() => save(false)} disabled={saving || !f.titre}>Enregistrer le brouillon</button>
        <button type="button" className="abtn primary" onClick={() => save(true)} disabled={saving || !f.titre}>
          {f.statut === 'publie' ? 'Enregistrer (publié)' : 'Publier'}
        </button>
        {editing && (
          <button
            type="button"
            className="abtn"
            onClick={removeReference}
            disabled={saving}
            style={{ marginLeft: 'auto', color: '#C0392B', borderColor: '#E7B7B0' }}
          >
            Supprimer la référence
          </button>
        )}
      </div>
    </>
  );
}
