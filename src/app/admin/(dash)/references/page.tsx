import Link from 'next/link';
import { createClient } from '@/lib/supabase-server';
import { dateFr } from '@/lib/slug';
import ImportPanel from './ImportPanel';
import DeleteRefButton from './DeleteRefButton';
import DeleteAllRefsButton from './DeleteAllRefsButton';

export const dynamic = 'force-dynamic';

export default async function AdminReferences() {
  const sb = createClient();
  const { data: refs } = await sb
    .from('references_projets')
    .select('id, titre, categorie, localisation, statut, updated_at')
    .order('updated_at', { ascending: false });

  const list = refs ?? [];

  return (
    <>
      <div className="adm-top">
        <div>
          <h1>Références</h1>
          <div className="sub">{list.length} projet{list.length > 1 ? 's' : ''}</div>
        </div>
        <div className="actions">
          <DeleteAllRefsButton count={list.length} />
          <Link className="abtn primary" href="/admin/references/new">+ Nouvelle référence</Link>
        </div>
      </div>
      <ImportPanel />
      <div className="adm-body">
        {list.length === 0 ? (
          <div className="acard"><p className="hint" style={{ margin: 0 }}>Aucune référence pour le moment. Créez-en une, ou lancez la migration SQL des 30 références.</p></div>
        ) : (
          <table className="atable">
            <thead>
              <tr><th>Titre</th><th>Catégorie</th><th>Localisation</th><th>Statut</th><th>Modifié</th><th></th></tr>
            </thead>
            <tbody>
              {list.map((r: any) => (
                <tr key={r.id}>
                  <td className="t-title">{r.titre}</td>
                  <td>{r.categorie}</td>
                  <td>{r.localisation || '—'}</td>
                  <td><span className={`badge ${r.statut}`}>{r.statut}</span></td>
                  <td>{r.updated_at ? dateFr(r.updated_at) : '—'}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 14, justifyContent: 'flex-end' }}>
                      <Link className="rowlink" href={`/admin/references/${r.id}`}>Éditer</Link>
                      <DeleteRefButton id={r.id} titre={r.titre} />
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
