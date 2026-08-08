import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase-server';
import ActuForm, { type ActuRecord } from '@/components/admin/ActuForm';

export const dynamic = 'force-dynamic';

export default async function EditActualite({ params }: { params: { id: string } }) {
  const isNew = params.id === 'new';
  let initial: ActuRecord | null = null;

  if (!isNew) {
    const sb = createClient();
    const { data } = await sb.from('actualites').select('*').eq('id', params.id).single();
    if (!data) notFound();
    initial = {
      id: data.id,
      slug: data.slug,
      titre: data.titre,
      categorie: data.categorie,
      date_publication: data.date_publication,
      extrait: data.extrait,
      contenu: data.contenu,
      image_url: data.image_url,
      statut: data.statut,
      seo_titre: data.seo_titre,
      seo_description: data.seo_description,
    };
  }

  return (
    <>
      <div className="adm-top">
        <div>
          <h1>{isNew ? 'Nouvelle actualité' : 'Éditer l\'actualité'}</h1>
          <div className="sub">{isNew ? 'Le fil PULZ' : initial?.titre}</div>
        </div>
        <div className="actions">
          <Link className="abtn ghost" href="/admin/actualites">← Retour</Link>
        </div>
      </div>
      <div className="adm-body">
        <ActuForm initial={initial} />
      </div>
    </>
  );
}
