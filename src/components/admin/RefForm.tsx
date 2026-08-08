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

  const set = (k: keyof RefRecord, v: any) => setF((p) => ({ ...p, [k]: v }));
  const slug = slugTouched ? f.slug || '' : slugify(f.titre || '');

  useEffect(() => {
    if (!editing) return;
    (async () => {
      const sb = createClient();
      const { data: rp } = await sb
        .from('reference_photos')
        .select('ordre, couverture, photos(id, url, nom_fichier, a_renommer)')
        .eq('reference_id', initial!.id)
        .order('ordre');
      setPhotos(
        (rp ?? [])
          .filter((r: any) => r.photos)
          .map((r: any) => ({ ...r.photos, couverture: r.couverture, ordre: r.ordre })),
      );
    })();
  }, [editing, initial]);

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
      intervenants: f.intervenants ?? [],
      specificites: f.specificites ?? [],
      seo_titre: f.seo_titre || null,
      seo_description: f.seo_description || null,
      statut: publish === undefined ? f.statut : publish ? 'publie' : 'brouillon',
    };
    try {
      if (editing) {
        const { error } = await sb.from('references_projets').update(payload).eq('id', initial!.id);
        if (error) throw error;
        setF((p) => ({ ...p, statut: payload.statut }));
        setNotice({ t: 'ok', m: 'Référence enregistrée.' });
      } else {
        const { data, error } = await sb.from('references_projets').insert(payload).select('id').single();
        if (error) throw error;
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

  async function removePhoto(photoId: string) {
    const sb = createClient();
    await sb.from('reference_photos').delete().eq('reference_id', initial!.id).eq('photo_id', photoId);
    setPhotos((prev) => prev.filter((p) => p.id !== photoId));
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
              <textarea value={(f.intervenants ?? []).join('\n')} onChange={(e) => set('intervenants', e.target.value.split('\n').map((s) => s.trim()).filter(Boolean))} rows={4} placeholder={'Architecte — X\nBET — Y'} />
            </div>
            <div className="fld">
              <label>Spécificités (une par ligne)</label>
              <textarea value={(f.specificites ?? []).join('\n')} onChange={(e) => set('specificites', e.target.value.split('\n').map((s) => s.trim()).filter(Boolean))} rows={4} />
            </div>
          </div>
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
            <p className="hint">La première photo sert de couverture. L'IA peut renommer les fichiers « appareil photo » pour le SEO.</p>
            <PhotoUpload folder="references" multiple onUploaded={onUploaded} />
            {photos.length > 0 && (
              <div className="gallery">
                {photos.map((p) => (
                  <div className="gtile" key={p.id}>
                    <div className="im" style={{ backgroundImage: `url(${p.url})` }} />
                    <div className="meta">
                      <div className={`fn${p.a_renommer ? ' warn' : ''}`}>{p.nom_fichier}</div>
                      <div className="acts">
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
      </div>
    </>
  );
}
