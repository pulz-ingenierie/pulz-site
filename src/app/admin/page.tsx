// TABLEAU DE BORD ADMIN — compte le contenu réel
import Link from 'next/link';
import { createClient } from '@/lib/supabase-server';

export default async function AdminDashboard() {
  const sb = createClient();
  const [refs, actus, photos, messages] = await Promise.all([
    sb.from('references_projets').select('id', { count: 'exact', head: true }),
    sb.from('actualites').select('id', { count: 'exact', head: true }),
    sb.from('photos').select('id', { count: 'exact', head: true }),
    sb.from('messages').select('id', { count: 'exact', head: true }).eq('lu', false),
  ]);

  const stats = [
    { n: refs.count ?? 0, l: 'Références', href: '/admin/references' },
    { n: actus.count ?? 0, l: 'Actualités', href: '/admin/actualites' },
    { n: photos.count ?? 0, l: 'Photos', href: '/admin/photos' },
    { n: messages.count ?? 0, l: 'Messages non lus', href: '/admin/messages' },
  ];

  return (
    <div style={{ padding: 40, fontFamily: 'Inter, sans-serif' }}>
      <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 30 }}>Tableau de bord</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 18 }}>
        {stats.map(s => (
          <Link key={s.l} href={s.href} style={{ background: '#fff', border: '1px solid #E2E8EF', borderRadius: 14, padding: 24, display: 'block' }}>
            <div style={{ fontSize: 30, fontWeight: 900, color: '#0A2540' }}>{s.n}</div>
            <div style={{ fontSize: 13, color: '#5B6673', fontWeight: 600, marginTop: 6 }}>{s.l}</div>
          </Link>
        ))}
      </div>
      <nav style={{ marginTop: 40, display: 'flex', gap: 20 }}>
        <Link href="/admin/references" style={{ color: '#1E63C4', fontWeight: 700 }}>Gérer les références</Link>
        <Link href="/admin/actualites" style={{ color: '#1E63C4', fontWeight: 700 }}>Gérer les actualités</Link>
        <Link href="/admin/contact" style={{ color: '#1E63C4', fontWeight: 700 }}>Formulaire contact</Link>
      </nav>
    </div>
  );
}
