'use client';
// Sélecteur de logo client : choisir dans la bibliothèque partagée (photos/clients/)
//  ou en ajouter un (upload -> alimente la bibliothèque, réutilisable sur d'autres réfs).
//  La valeur (client_logo_url) stockée est l'URL PROPRE (sans ?v).
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase-browser';
import { listClientLogos, busted, type ClientLogo } from '@/lib/client-logos';
import { slugify } from '@/lib/slug';

export default function ClientLogoPicker({ value, onChange }: { value?: string | null; onChange: (url: string | null) => void }) {
  const [logos, setLogos] = useState<ClientLogo[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  async function reload() {
    try {
      const sb = createClient();
      setLogos(await listClientLogos(sb));
    } catch (e: any) {
      setErr(e?.message || 'Chargement de la bibliothèque impossible');
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => { reload(); }, []);

  const cleanValue = value ? value.split('?')[0] : null;
  const selected = cleanValue ? logos.find((l) => l.url === cleanValue) : undefined;

  async function uploadFiles(files: FileList | File[]) {
    const arr = Array.from(files).filter((f) => f.type.startsWith('image/'));
    if (arr.length === 0) return;
    setBusy(true); setErr('');
    let lastUrl: string | null = null;
    try {
      const sb = createClient();
      for (const file of arr) {
        const dot = file.name.lastIndexOf('.');
        const ext = (dot >= 0 ? file.name.slice(dot + 1) : 'png').toLowerCase();
        const base = slugify(dot >= 0 ? file.name.slice(0, dot) : file.name) || `logo-${Date.now()}`;
        const path = `clients/${base}.${ext}`;
        const { error } = await sb.storage.from('photos').upload(path, file, { upsert: true, contentType: file.type || undefined, cacheControl: '3600' });
        if (error) throw error;
        lastUrl = sb.storage.from('photos').getPublicUrl(path).data.publicUrl.split('?')[0];
      }
      await reload();
      if (lastUrl) onChange(lastUrl); // sélectionne le dernier logo ajouté
    } catch (e: any) {
      setErr(e?.message || 'Upload impossible (droits Storage ?)');
    } finally {
      setBusy(false);
    }
  }

  const shown = q.trim() ? logos.filter((l) => l.alt.toLowerCase().includes(q.trim().toLowerCase())) : logos;

  return (
    <div>
      <p className="hint" style={{ marginTop: 0 }}>
        Choisis un logo dans la bibliothèque, ou ajoutes-en un (il rejoint la bibliothèque partagée, réutilisable sur les autres références et affiché dans les bandes « Ils nous font confiance »).
      </p>

      {/* Sélection courante */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap', marginBottom: 16 }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--deep)' }}>Sélection :</span>
        {cleanValue ? (
          <>
            <img src={selected ? busted(selected) : cleanValue} alt="Logo client" style={{ height: 44, maxWidth: 170, objectFit: 'contain', border: '1px solid var(--line)', borderRadius: 8, padding: 6, background: '#fff' }} />
            <button type="button" className="mini del" onClick={() => onChange(null)}>Retirer</button>
          </>
        ) : (
          <span className="hint" style={{ margin: 0 }}>aucun logo sélectionné</span>
        )}
      </div>

      {/* Recherche */}
      <input type="text" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Rechercher un client…" style={{ width: '100%', padding: '9px 12px', border: '1px solid var(--line)', borderRadius: 8, fontFamily: 'inherit', fontSize: 14, marginBottom: 12 }} />

      {/* Ajout par glisser-déposer (ou clic) */}
      <label
        className="uploader"
        style={{ marginBottom: 14, padding: 18 }}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); uploadFiles(e.dataTransfer.files); }}
      >
        <div className="u-ic">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />
          </svg>
        </div>
        <p>{busy ? 'Ajout en cours…' : 'Glissez un ou plusieurs logos ici, ou cliquez pour choisir'}</p>
        <input type="file" accept="image/*" multiple disabled={busy} onChange={(e) => { if (e.target.files) uploadFiles(e.target.files); e.currentTarget.value = ''; }} />
      </label>

      {err && <div className="notice err" style={{ marginBottom: 12 }}>{err}</div>}

      {/* Grille de la bibliothèque */}
      {loading ? (
        <span className="hint">Chargement de la bibliothèque…</span>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(108px,1fr))', gap: 10, maxHeight: 320, overflowY: 'auto', padding: 2 }}>
          {shown.map((l) => {
            const on = l.url === cleanValue;
            return (
              <button
                type="button"
                key={l.name}
                onClick={() => onChange(l.url)}
                title={l.alt}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 70, padding: 8, background: '#fff', border: `2px solid ${on ? 'var(--blue)' : 'var(--line)'}`, borderRadius: 8, cursor: 'pointer' }}
              >
                <img src={busted(l)} alt={l.alt} style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
              </button>
            );
          })}
          {shown.length === 0 && <span className="hint">Aucun logo{q ? ' pour cette recherche' : ' dans la bibliothèque'}.</span>}
        </div>
      )}
    </div>
  );
}
