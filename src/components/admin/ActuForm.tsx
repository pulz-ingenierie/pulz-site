'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase-browser';
import { slugify } from '@/lib/slug';
import AiSeoButton from './AiSeoButton';
import PhotoUpload, { type UploadedPhoto } from './PhotoUpload';

const CATEGORIES = ['Chantier', 'Vie du groupe', 'Certification', 'Événement'];

export type ActuRecord = {
  id?: string;
  slug?: string;
  titre?: string;
  categorie?: string;
  date_publication?: string;
  extrait?: string | null;
  contenu?: string | null;
  image_url?: string | null;
  statut?: string;
  seo_titre?: string | null;
  seo_description?: string | null;
};

export default function ActuForm({ initial }: { initial: ActuRecord | null }) {
  const router = useRouter();
  const editing = !!initial?.id;
  const today = new Date().toISOString().slice(0, 10);
  const [f, setF] = useState<ActuRecord>({
    titre: '', categorie: CATEGORIES[0], date_publication: today, extrait: '', contenu: '',
    image_url: '', statut: 'brouillon', seo_titre: '', seo_description: '', ...initial,
  });
  const [slugTouched, setSlugTouched] = useState(editing);
  const [notice, setNotice] = useState<{ t: 'ok' | 'err'; m: string } | null>(null);
  const [saving, setSaving] = useState(false);

  const set = (k: keyof ActuRecord, v: any) => setF((p) => ({ ...p, [k]: v }));
  const slug = slugTouched ? f.slug || '' : slugify(f.titre || '');

  async function save(publish?: boolean) {
    setSaving(true);
    setNotice(null);
    const sb = createClient();
    const payload = {
      slug: (slug || slugify(f.titre || '')).slice(0, 90),
      titre: f.titre,
      categorie: f.categorie,
      date_publication: f.date_publication || today,
      extrait: f.extrait || null,
      contenu: f.contenu || null,
      image_url: f.image_url || null,
      seo_titre: f.seo_titre || null,
      seo_description: f.seo_description || null,
      statut: publish === undefined ? f.statut : publish ? 'publie' : 'brouillon',
    };
    try {
      if (editing) {
        const { error } = await sb.from('actualites').update(payload).eq('id', initial!.id);
        if (error) throw error;
        setF((p) => ({ ...p, statut: payload.statut }));
        setNotice({ t: 'ok', m: payload.statut === 'publie' ? 'Actualité enregistrée et publiée.' : 'Actualité enregistrée (brouillon).' });
        router.refresh();
      } else {
        const { data, error } = await sb.from('actualites').insert(payload).select('id').single();
        if (error) throw error;
        router.push(`/admin/actualites/${data.id}`);
        router.refresh();
      }
    } catch (e: any) {
      setNotice({ t: 'err', m: e?.message || "Erreur d'enregistrement" });
    } finally {
      setSaving(false);
    }
  }

  function onCover(up: UploadedPhoto[]) {
    if (up[0]) set('image_url', up[0].url);
  }

  async function removeActu() {
    if (!editing) return;
    if (!confirm(`Supprimer l'actualité « ${f.titre} » ?\n\nCette action est définitive.`)) return;
    setSaving(true);
    const sb = createClient();
    const { error } = await sb.from('actualites').delete().eq('id', initial!.id);
    if (error) { setNotice({ t: 'err', m: error.message }); setSaving(false); return; }
    router.push('/admin/actualites');
    router.refresh();
  }

  const seoTLen = (f.seo_titre || '').length;
  const seoDLen = (f.seo_description || '').length;

  return (
    <>
      {notice && <div className={`notice ${notice.t}`}>{notice.m}</div>}

      <div className="acard">
        <h2>Article</h2>
        <div className="aform">
          <div className="fld">
            <label>Titre *</label>
            <input type="text" value={f.titre || ''} onChange={(e) => set('titre', e.target.value)} />
          </div>
          <div className="frow">
            <div className="fld">
              <label>Catégorie *</label>
              <select value={f.categorie} onChange={(e) => set('categorie', e.target.value)}>
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="fld">
              <label>Date de publication</label>
              <input type="date" value={f.date_publication || today} onChange={(e) => set('date_publication', e.target.value)} />
            </div>
          </div>
          <div className="fld">
            <label>Lien (slug)</label>
            <input type="text" value={slug} onChange={(e) => { setSlugTouched(true); set('slug', slugify(e.target.value)); }} />
            <div className="help">Adresse : /actualites/{slug || '…'}</div>
          </div>
          <div className="fld">
            <label>Extrait (chapô)</label>
            <textarea value={f.extrait || ''} onChange={(e) => set('extrait', e.target.value)} rows={2} />
          </div>
          <div className="fld">
            <label>Contenu</label>
            <textarea value={f.contenu || ''} onChange={(e) => set('contenu', e.target.value)} rows={9} />
            <div className="help">Séparez les paragraphes par une ligne vide.</div>
          </div>
        </div>
      </div>

      <div className="acard">
        <h2>Image de couverture</h2>
        <PhotoUpload folder="actus" onUploaded={onCover} />
        {f.image_url && (
          <div className="gallery" style={{ marginTop: 16 }}>
            <div className="gtile">
              <div className="im" style={{ backgroundImage: `url(${f.image_url})` }} />
              <div className="meta">
                <div className="fn">Couverture</div>
                <div className="acts"><button type="button" className="mini del" onClick={() => set('image_url', '')}>Retirer</button></div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="acard">
        <h2>Référencement (SEO)</h2>
        <p className="hint">L'assistant IA peut rédiger le titre et la description pour Google.</p>
        <div style={{ marginBottom: 16 }}>
          <AiSeoButton
            type="actualite"
            getPayload={() => ({ titre: f.titre || '', contenu: f.contenu || f.extrait || '' })}
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

      <div style={{ display: 'flex', gap: 12, position: 'sticky', bottom: 0, background: 'var(--paper-2)', padding: '14px 0', borderTop: '1px solid var(--line)' }}>
        <button type="button" className="abtn ghost" onClick={() => save(false)} disabled={saving || !f.titre}>Enregistrer le brouillon</button>
        <button type="button" className="abtn primary" onClick={() => save(true)} disabled={saving || !f.titre}>
          {f.statut === 'publie' ? 'Enregistrer (publié)' : 'Publier'}
        </button>
        {editing && (
          <button
            type="button"
            className="abtn"
            onClick={removeActu}
            disabled={saving}
            style={{ marginLeft: 'auto', color: '#C0392B', borderColor: '#E7B7B0' }}
          >
            Supprimer l'actualité
          </button>
        )}
      </div>
    </>
  );
}
