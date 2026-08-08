import { createClient } from '@/lib/supabase-server';
import { dateFr } from '@/lib/slug';

export const dynamic = 'force-dynamic';

export default async function AdminMessages() {
  const sb = createClient();
  const { data: messages } = await sb
    .from('messages')
    .select('id, nom, societe, email, telephone, sujet, message, lu, created_at')
    .order('created_at', { ascending: false });

  const list = messages ?? [];

  return (
    <>
      <div className="adm-top">
        <div>
          <h1>Messages</h1>
          <div className="sub">{list.length} message{list.length > 1 ? 's' : ''} du formulaire de contact</div>
        </div>
      </div>
      <div className="adm-body">
        {list.length === 0 ? (
          <div className="acard"><p className="hint" style={{ margin: 0 }}>Aucun message pour le moment.</p></div>
        ) : (
          list.map((m: any) => (
            <div className="acard" key={m.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
                <div>
                  <h2 style={{ marginBottom: 6 }}>
                    {m.nom} {m.societe && <span style={{ color: 'var(--grey)', fontWeight: 600 }}>· {m.societe}</span>}
                  </h2>
                  <div className="hint" style={{ margin: 0 }}>
                    <a href={`mailto:${m.email}`} style={{ color: 'var(--blue)' }}>{m.email}</a>
                    {m.telephone && <> · {m.telephone}</>}
                    {m.sujet && <> · <b>{m.sujet}</b></>}
                  </div>
                </div>
                <span className="hint" style={{ margin: 0, whiteSpace: 'nowrap' }}>{m.created_at ? dateFr(m.created_at) : ''}</span>
              </div>
              <p style={{ marginTop: 14, fontSize: 14.5, lineHeight: 1.65, color: 'var(--ink)', whiteSpace: 'pre-wrap' }}>{m.message}</p>
            </div>
          ))
        )}
      </div>
    </>
  );
}
