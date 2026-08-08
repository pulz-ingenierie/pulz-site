// TABLEAU DE BORD ADMIN
import Link from 'next/link';
import { createClient } from '@/lib/supabase-server';
import LogoutButton from '@/components/admin/LogoutButton';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const sb = createClient();
  const [refs, refsPub, actus, actusPub, photos, messages] = await Promise.all([
    sb.from('references_projets').select('id', { count: 'exact', head: true }),
    sb.from('references_projets').select('id', { count: 'exact', head: true }).eq('statut', 'publie'),
    sb.from('actualites').select('id', { count: 'exact', head: true }),
    sb.from('actualites').select('id', { count: 'exact', head: true }).eq('statut', 'publie'),
    sb.from('photos').select('id', { count: 'exact', head: true }),
    sb.from('messages').select('id', { count: 'exact', head: true }).eq('lu', false),
  ]);

  const stats = [
    { n: `${refsPub.count ?? 0}/${refs.count ?? 0}`, l: 'Références publiées', href: '/admin/references' },
    { n: `${actusPub.count ?? 0}/${actus.count ?? 0}`, l: 'Actualités publiées', href: '/admin/actualites' },
    { n: photos.count ?? 0, l: 'Photos', href: '/admin/references' },
    { n: messages.count ?? 0, l: 'Messages non lus', href: '/admin/messages' },
  ];

  return (
    <>
      <div className="adm-top">
        <div>
          <h1>Tableau de bord</h1>
          <div className="sub">Bienvenue dans l'administration PULZ</div>
        </div>
        <div className="actions">
          <LogoutButton />
        </div>
      </div>
      <div className="adm-body">
        <div className="stat-grid">
          {stats.map((s) => (
            <Link key={s.l} href={s.href} className="stat">
              <div className="n">{s.n}</div>
              <div className="l">{s.l}</div>
            </Link>
          ))}
        </div>

        <div className="acard">
          <h2>Que voulez-vous faire ?</h2>
          <p className="hint">Gérez le contenu qui évolue souvent : les références (projets) et les actualités.</p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link className="abtn primary" href="/admin/references/new">+ Nouvelle référence</Link>
            <Link className="abtn primary" href="/admin/actualites/new">+ Nouvelle actualité</Link>
            <Link className="abtn ghost" href="/admin/references">Gérer les références</Link>
            <Link className="abtn ghost" href="/admin/actualites">Gérer les actualités</Link>
          </div>
        </div>
      </div>
    </>
  );
}
