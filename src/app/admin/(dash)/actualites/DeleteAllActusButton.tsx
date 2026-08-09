'use client';
// Bouton de suppression EN MASSE de toutes les actualités (double confirmation).
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase-browser';

export default function DeleteAllActusButton({ count }: { count: number }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function delAll() {
    if (count === 0) return;
    if (!confirm(`Supprimer les ${count} actualité(s) ?\n\nCette action est DÉFINITIVE.`)) return;
    if (!confirm('Dernière confirmation — tout supprimer ?')) return;
    setBusy(true);
    const sb = createClient();
    const { error } = await sb.from('actualites').delete().not('id', 'is', null);
    setBusy(false);
    if (error) { alert('Suppression impossible : ' + error.message); return; }
    router.refresh();
  }

  return (
    <button
      type="button"
      className="abtn"
      onClick={delAll}
      disabled={busy || count === 0}
      style={{ color: '#C0392B', borderColor: '#E7B7B0' }}
      title={count === 0 ? 'Aucune actualité à supprimer' : undefined}
    >
      {busy ? 'Suppression…' : 'Supprimer toutes les actualités'}
    </button>
  );
}
