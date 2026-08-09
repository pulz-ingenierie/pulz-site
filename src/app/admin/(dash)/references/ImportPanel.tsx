'use client';
// Panneau d'import : lit les cahiers de références PDF via l'IA et crée les fiches.
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const CATEGORIES = [
  'Logement',
  'Bureaux et tertiaires',
  'Industries et logistiques',
  'Hospitalier',
  'Equipements sportifs',
  'Hôtelleries et restaurations',
  'Autres ouvrages fonctionnels',
];
const SOCIETES = [
  { slug: 'buscot', nom: 'Buscot' },
  { slug: 'arteix', nom: 'Arteix' },
  { slug: 'gradient', nom: 'Gradient' },
  { slug: 'therac', nom: 'Therac' },
];

type Ref = {
  titre: string;
  categorie: string;
  localisation?: string | null;
  description?: string | null;
  maitrise_ouvrage?: string | null;
  intervenants?: string[];
  specificites?: string[];
  societes?: string[];
  mission?: string | null;
  page?: number | null;
  photos?: { url: string; nom_fichier: string }[];
  _include?: boolean;
};

export default function ImportPanel() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [phase, setPhase] = useState<'idle' | 'analysing' | 'preview' | 'importing' | 'done'>('idle');
  const [refs, setRefs] = useState<Ref[]>([]);
  const [statut, setStatut] = useState<'brouillon' | 'publie'>('brouillon');
  const [errors, setErrors] = useState<string[]>([]);
  const [msg, setMsg] = useState('');

  const upd = (i: number, patch: Partial<Ref>) =>
    setRefs((prev) => prev.map((r, j) => (j === i ? { ...r, ...patch } : r)));

  const toggleSoc = (i: number, slug: string) =>
    setRefs((prev) => prev.map((r, j) => {
      if (j !== i) return r;
      const cur = r.societes ?? [];
      const societes = cur.includes(slug) ? cur.filter((s) => s !== slug) : [...cur, slug];
      return { ...r, societes };
    }));

  async function analyse() {
    if (files.length === 0) return;
    setPhase('analysing'); setErrors([]); setMsg('');
    try {
      const fd = new FormData();
      files.forEach((f) => fd.append('files', f));
      const res = await fetch('/api/ai/import-references', { method: 'POST', body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Analyse impossible');
      const list: Ref[] = (data.references || []).map((r: Ref) => ({ ...r, societes: r.societes ?? [], _include: true }));
      setRefs(list);
      setErrors(data.errors || []);
      setPhase(list.length ? 'preview' : 'idle');
      if (!list.length) setMsg('Aucune référence détectée dans ces PDF.');
    } catch (e: any) {
      setMsg(e.message); setPhase('idle');
    }
  }

  async function importer() {
    const selected = refs.filter((r) => r._include);
    if (selected.length === 0) return;
    setPhase('importing'); setErrors([]);
    try {
      const res = await fetch('/api/ai/import-references', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'import', statut, references: selected }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Import impossible');
      setErrors(data.errors || []);
      setMsg(`${data.inserted} référence(s) importée(s) sur ${data.total}.`);
      setPhase('done');
      router.refresh();
    } catch (e: any) {
      setMsg(e.message); setPhase('preview');
    }
  }

  function reset() {
    setFiles([]); setRefs([]); setErrors([]); setMsg(''); setPhase('idle');
  }

  const nbSel = refs.filter((r) => r._include).length;

  if (!open) {
    return (
      <button className="abtn" onClick={() => setOpen(true)}>📄 Importer depuis les cahiers PDF</button>
    );
  }

  return (
    <div className="acard" style={{ marginTop: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <h3 style={{ margin: 0 }}>Import depuis les cahiers de références (PDF)</h3>
        <button className="abtn" onClick={() => { reset(); setOpen(false); }}>Fermer</button>
      </div>

      {(phase === 'idle' || phase === 'analysing') && (
        <>
          <p className="hint" style={{ marginTop: 0 }}>
            Sélectionnez un ou plusieurs cahiers de références en PDF (un par société idéalement — le nom du fichier aide à
            détecter la société : « buscot… », « arteix… », etc.). L'IA lit chaque document et propose les fiches à créer.
          </p>
          <input
            type="file"
            accept="application/pdf"
            multiple
            onChange={(e) => setFiles(Array.from(e.target.files || []))}
            disabled={phase === 'analysing'}
          />
          {files.length > 0 && (
            <ul style={{ fontSize: 13, color: 'var(--grey)', margin: '10px 0' }}>
              {files.map((f) => <li key={f.name}>{f.name} — {(f.size / 1024 / 1024).toFixed(1)} Mo</li>)}
            </ul>
          )}
          <div style={{ marginTop: 12 }}>
            <button className="abtn primary" onClick={analyse} disabled={files.length === 0 || phase === 'analysing'}>
              {phase === 'analysing' ? 'Analyse en cours… (peut prendre 1 à 2 min)' : 'Analyser les PDF'}
            </button>
          </div>
        </>
      )}

      {(phase === 'preview' || phase === 'importing') && (
        <>
          <p className="hint" style={{ marginTop: 0 }}>
            <b>{refs.length}</b> fiche(s) détectée(s) — <b>{nbSel}</b> sélectionnée(s). Vérifiez la catégorie et la société,
            décochez ce qui ne doit pas être importé, puis lancez l'import.
          </p>
          <div style={{ overflowX: 'auto' }}>
            <table className="atable">
              <thead>
                <tr><th></th><th>Titre</th><th>Photos</th><th>Catégorie</th><th>Localisation</th><th>Membres intervenus</th></tr>
              </thead>
              <tbody>
                {refs.map((r, i) => (
                  <tr key={i} style={{ opacity: r._include ? 1 : .45 }}>
                    <td><input type="checkbox" checked={!!r._include} onChange={(e) => upd(i, { _include: e.target.checked })} /></td>
                    <td className="t-title" title={r.description || ''}>{r.titre}</td>
                    <td>
                      {r.photos && r.photos.length > 0 ? (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                          <img src={r.photos[0].url} alt="" style={{ width: 44, height: 32, objectFit: 'cover', borderRadius: 4, border: '1px solid var(--line)' }} />
                          {r.photos.length > 1 && <span style={{ fontSize: 12, color: 'var(--grey)' }}>+{r.photos.length - 1}</span>}
                        </span>
                      ) : (
                        <span style={{ fontSize: 12, color: 'var(--grey-lt)' }}>—</span>
                      )}
                    </td>
                    <td>
                      <select value={r.categorie} onChange={(e) => upd(i, { categorie: e.target.value })}>
                        {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </td>
                    <td>{r.localisation || '—'}</td>
                    <td>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                        {SOCIETES.map((s) => {
                          const on = (r.societes ?? []).includes(s.slug);
                          return (
                            <label key={s.slug} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12.5, whiteSpace: 'nowrap' }}>
                              <input type="checkbox" checked={on} onChange={() => toggleSoc(i, s.slug)} />
                              {s.nom}
                            </label>
                          );
                        })}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ display: 'flex', gap: 20, alignItems: 'center', marginTop: 16, flexWrap: 'wrap' }}>
            <label style={{ fontSize: 14 }}>
              Statut à l'import :{' '}
              <select value={statut} onChange={(e) => setStatut(e.target.value as any)}>
                <option value="brouillon">Brouillon (recommandé)</option>
                <option value="publie">Publié</option>
              </select>
            </label>
            <button className="abtn primary" onClick={importer} disabled={nbSel === 0 || phase === 'importing'}>
              {phase === 'importing' ? 'Import en cours…' : `Importer ${nbSel} fiche(s)`}
            </button>
            <button className="abtn" onClick={reset} disabled={phase === 'importing'}>Recommencer</button>
          </div>
        </>
      )}

      {phase === 'done' && (
        <div>
          <p style={{ fontWeight: 700, color: 'var(--deep)' }}>✅ {msg}</p>
          <button className="abtn" onClick={reset}>Nouvel import</button>
        </div>
      )}

      {msg && phase !== 'done' && <p style={{ color: '#C0392B', marginTop: 12, fontSize: 14 }}>{msg}</p>}
      {errors.length > 0 && (
        <div style={{ marginTop: 12, fontSize: 13, color: '#C0392B' }}>
          <b>Avertissements :</b>
          <ul>{errors.map((e, i) => <li key={i}>{e}</li>)}</ul>
        </div>
      )}
    </div>
  );
}
