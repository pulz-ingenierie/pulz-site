import { createClient } from '@/lib/supabase-server';
import StatsEditor, { type Stat } from './StatsEditor';

export const dynamic = 'force-dynamic';

export default async function AdminCompteurs() {
  const sb = createClient();
  const { data } = await sb
    .from('statistiques')
    .select('id, ordre, valeur, suffixe, label')
    .order('ordre');

  return (
    <>
      <div className="adm-top">
        <div>
          <h1>Compteurs</h1>
          <div className="sub">Les chiffres animés de la page d'accueil</div>
        </div>
      </div>
      <div className="adm-body">
        <StatsEditor initial={(data ?? []) as Stat[]} />
      </div>
    </>
  );
}
