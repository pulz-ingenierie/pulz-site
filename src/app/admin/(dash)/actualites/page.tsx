import Link from 'next/link';
import { createClient } from '@/lib/supabase-server';
import { dateFr } from '@/lib/slug';
import DeleteActuButton from './DeleteActuButton';
import DeleteAllActusButton from './DeleteAllActusButton';

export const dynamic = 'force-dynamic';

export default async function AdminActualites() {
  const sb = createClient();
  const { data: actus } = await sb
    .from('actualites')
    .select('id, titre, categorie, date_publication, statut, updated_at')
    .order('date_publication', { ascending: false });

  const list = actus ?? [];

  return (
    <>
      <div className="adm-top">
        <div>
          <h1>Actualités</h1>
          <div className="sub">{list.length} article{list.length > 1 ? 's' : ''}</div>
        </div>
        <div className="actions">
          <DeleteAllActusButton count={list.length} />
          <Link className="abtn primary" href="/admin/actualites/new">+ Nouvelle actualité</Link>
        </div>
      </div>
      <div className="adm-body">
        {list.length === 0 ? (
          <div className="acard"><p className="hint" style={{ margin: 0 }}>Aucune actualité pour le moment.</p></div>
        ) : (
          <table className="atable">
            <thead>
              <tr><th>Titre</th><th>Catégorie</th><th>Date</th><th>Statut</th><th></th></tr>
            </thead>
            <tbody>
              {list.map((a: any) => (
                <tr key={a.id}>
                  <td className="t-title">{a.titre}</td>
                  <td>{a.categorie}</td>
                  <td>{a.date_publication ? dateFr(a.date_publication) : '—'}</td>
                  <td><span className={`badge ${a.statut}`}>{a.statut}</span></td>
                  <td>
                    <div style={{ display: 'flex', gap: 14, justifyContent: 'flex-end' }}>
                      <Link className="rowlink" href={`/admin/actualites/${a.id}`}>Éditer</Link>
                      <DeleteActuButton id={a.id} titre={a.titre} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
