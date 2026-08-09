'use client';
// Bouton de suppression EN MASSE de toutes les références (double confirmation).
//  Les liens membres/photos partent en cascade (FK on delete cascade).
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase-browser';

export default function DeleteAllRefsButton({ count }: { count: number }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function delAll() {
    if (count === 0) return;
    if (!confirm(`Supprimer les ${count} référence(s) ?\n\nCette action est DÉFINITIVE : toutes les fiches, leurs liens membres et leurs photos seront supprimés.`)) return;
    if (!confirm('Dernière confirmation — tout supprimer ?')) return;
    setBusy(true);
    const sb = createClient();
    // `.not('id','is',null)` = filtre qui matche toutes les lignes (delete exige un filtre).
    const { error } = await sb.from('references_projets').delete().not('id', 'is', null);
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
      title={count === 0 ? 'Aucune référence à supprimer' : undefined}
    >
      {busy ? 'Suppression…' : 'Supprimer toutes les références'}
    </button>
  );
}
