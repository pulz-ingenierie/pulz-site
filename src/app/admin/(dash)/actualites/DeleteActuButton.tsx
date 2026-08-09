'use client';
// Bouton de suppression d'une actualité (liste admin).
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase-browser';

export default function DeleteActuButton({ id, titre }: { id: string; titre: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function del() {
    if (!confirm(`Supprimer l'actualité « ${titre} » ?\n\nCette action est définitive.`)) return;
    setBusy(true);
    const sb = createClient();
    const { error } = await sb.from('actualites').delete().eq('id', id);
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
