'use client';
// Éditeur des compteurs animés de la home (table statistiques).
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase-browser';

export type Stat = { id?: string; ordre: number; valeur: number | string; suffixe: string | null; label: string };

export default function StatsEditor({ initial }: { initial: Stat[] }) {
  const router = useRouter();
  const [rows, setRows] = useState<Stat[]>(initial);
  const [removed, setRemoved] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<{ t: 'ok' | 'err'; m: string } | null>(null);

  const upd = (i: number, patch: Partial<Stat>) => setRows((rs) => rs.map((r, j) => (j === i ? { ...r, ...patch } : r)));
  const add = () => setRows((rs) => [...rs, { ordre: rs.length, valeur: 0, suffixe: '', label: '' }]);
  const del = (i: number) =>
    setRows((rs) => {
      const r = rs[i];
      if (r.id) setRemoved((x) => [...x, r.id!]);
      return rs.filter((_, j) => j !== i);
    });
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= rows.length) return;
    const rs = [...rows];
    [rs[i], rs[j]] = [rs[j], rs[i]];
    setRows(rs);
  };

  async function save() {
    setSaving(true);
    setNotice(null);
    const sb = createClient();
    try {
      if (removed.length) {
        const { error } = await sb.from('statistiques').delete().in('id', removed);
        if (error) throw error;
      }
      for (let i = 0; i < rows.length; i++) {
        const r = rows[i];
        const payload = { ordre: i, valeur: Number(r.valeur) || 0, suffixe: (r.suffixe || '').trim(), label: (r.label || '').trim() };
        if (r.id) {
          const { error } = await sb.from('statistiques').update(payload).eq('id', r.id);
          if (error) throw error;
        } else {
          const { error } = await sb.from('statistiques').insert(payload);
          if (error) throw error;
        }
      }
      setRemoved([]);
      setNotice({ t: 'ok', m: 'Compteurs enregistrés. La home se mettra à jour d’ici ~1 min.' });
      router.refresh();
    } catch (e: any) {
      setNotice({ t: 'err', m: e?.message || "Erreur d'enregistrement" });
    } finally {
      setSaving(false);
    }
  }

  const inp = { width: '100%', padding: '10px 12px', border: '1px solid var(--line)', borderRadius: 8, fontFamily: 'inherit', fontSize: 14, background: 'var(--paper-2)' } as const;

  return (
    <>
      {notice && <div className={`notice ${notice.t}`}>{notice.m}</div>}
      <div className="acard">
        <p className="hint" style={{ marginTop: 0 }}>
          Chaque ligne = un chiffre animé. <b>Valeur</b> : le nombre (ex. <code>1.4</code> — utilisez un point pour les décimales, il s'affichera « 1,4 »).
          <b> Suffixe</b> : lettres collées au nombre (ex. « + » ou « % » ; laissez vide pour mettre l'unité dans le libellé).
          <b> Libellé</b> : le texte sous le chiffre (ex. « Chiffre d'affaires en M€ HT »).
        </p>

        <div style={{ overflowX: 'auto' }}>
          <table className="atable">
            <thead>
              <tr><th style={{ width: 70 }}>Ordre</th><th style={{ width: 120 }}>Valeur</th><th style={{ width: 110 }}>Suffixe</th><th>Libellé</th><th style={{ width: 130 }}></th></tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={r.id ?? `new-${i}`}>
                  <td>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <button type="button" className="mini" onClick={() => move(i, -1)} disabled={i === 0} title="Monter">↑</button>
                      <button type="button" className="mini" onClick={() => move(i, 1)} disabled={i === rows.length - 1} title="Descendre">↓</button>
                    </div>
                  </td>
                  <td><input style={inp} value={r.valeur} onChange={(e) => upd(i, { valeur: e.target.value })} inputMode="decimal" /></td>
                  <td><input style={inp} value={r.suffixe ?? ''} onChange={(e) => upd(i, { suffixe: e.target.value })} placeholder="+ / %" /></td>
                  <td><input style={inp} value={r.label} onChange={(e) => upd(i, { label: e.target.value })} placeholder="ex. Collaborateurs" /></td>
                  <td><button type="button" className="mini del" onClick={() => del(i)}>Supprimer</button></td>
                </tr>
              ))}
              {rows.length === 0 && <tr><td colSpan={5}><span className="hint">Aucun compteur. Ajoutez-en un.</span></td></tr>}
            </tbody>
          </table>
        </div>

        <div style={{ display: 'flex', gap: 12, marginTop: 18, alignItems: 'center' }}>
          <button type="button" className="abtn" onClick={add}>+ Ajouter un compteur</button>
          <button type="button" className="abtn primary" onClick={save} disabled={saving}>{saving ? 'Enregistrement…' : 'Enregistrer'}</button>
        </div>
      </div>
    </>
  );
}
