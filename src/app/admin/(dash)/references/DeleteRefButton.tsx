'use client';
// Bouton de suppression d'une référence (liste admin).
//  Les liens membres/photos partent en cascade (FK on delete cascade).
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase-browser';

export default function DeleteRefButton({ id, titre }: { id: string; titre: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function del() {
    if (!confirm(`Supprimer la référence « ${titre} » ?\n\nCette action est définitive (la fiche et ses liens sont supprimés).`)) return;
    setBusy(true);
    const sb = createClient();
    const { error } = await sb.from('references_projets').delete().eq('id', id);
    setBusy(false);
    if (error) { alert('Suppression impossible : ' + error.message); return; }
    router.refresh();
  }

  return (
    <button
      type="button"
      className="rowlink"
      onClick={del}
      disabled={busy}
      style={{ color: '#C0392B', background: 'none', border: 'none', cursor: busy ? 'wait' : 'pointer', padding: 0, font: 'inherit' }}
    >
      {busy ? 'Suppression…' : 'Supprimer'}
    </button>
  );
}
