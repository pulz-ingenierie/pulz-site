import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase-server';
import RefForm, { type RefRecord } from '@/components/admin/RefForm';

export const dynamic = 'force-dynamic';

export default async function EditReference({ params }: { params: { id: string } }) {
  const isNew = params.id === 'new';
  let initial: RefRecord | null = null;

  if (!isNew) {
    const sb = createClient();
    const { data } = await sb.from('references_projets').select('*').eq('id', params.id).single();
    if (!data) notFound();
    initial = {
      id: data.id,
      slug: data.slug,
      titre: data.titre,
      categorie: data.categorie,
      localisation: data.localisation,
      description: data.description,
      maitrise_ouvrage: data.maitrise_ouvrage,
      intervenants: Array.isArray(data.intervenants) ? data.intervenants : [],
      specificites: Array.isArray(data.specificites) ? data.specificites : [],
      statut: data.statut,
      seo_titre: data.seo_titre,
      seo_description: data.seo_description,
      client_logo_url: data.client_logo_url,
    };
  }

  return (
    <>
      <div className="adm-top">
        <div>
          <h1>{isNew ? 'Nouvelle référence' : 'Éditer la référence'}</h1>
          <div className="sub">{isNew ? 'Projet du groupement' : initial?.titre}</div>
        </div>
        <div className="actions">
          <Link className="abtn ghost" href="/admin/references">← Retour</Link>
        </div>
      </div>
      <div className="adm-body">
        <RefForm initial={initial} />
      </div>
    </>
  );
}
