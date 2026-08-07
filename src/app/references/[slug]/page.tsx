// FICHE RÉFÉRENCE — page détail générée depuis la base
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase-server';

export const revalidate = 60;

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const sb = createClient();
  const { data: ref } = await sb.from('references_projets').select('titre, seo_titre, seo_description, description').eq('slug', params.slug).single();
  if (!ref) return {};
  return {
    title: ref.seo_titre || `${ref.titre} | PULZ Ingénierie`,
    description: ref.seo_description || ref.description,
  };
}

export default async function ReferenceDetail({ params }: { params: { slug: string } }) {
  const sb = createClient();
  const { data: ref } = await sb.from('references_projets').select('*').eq('slug', params.slug).eq('statut', 'publie').single();
  if (!ref) notFound();

  // membres impliqués + leur mission
  const { data: membres } = await sb
    .from('reference_membres')
    .select('mission, societes(nom, domaine, couleur, slug)')
    .eq('reference_id', ref.id);

  return (
    <>
      <Nav />
      <header style={{ background: 'linear-gradient(180deg,#fff,var(--paper-2))', padding: '56px 0 30px' }}>
        <div className="wrap" style={{ maxWidth: 1000 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--blue)', textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 14 }}>{ref.categorie}</div>
          <h1 style={{ fontSize: 44, fontWeight: 900, letterSpacing: '-.03em', lineHeight: 1.1, color: 'var(--deep)', marginBottom: 18 }}>{ref.titre}</h1>
          <p style={{ fontSize: 18, color: 'var(--grey)', maxWidth: '60ch', lineHeight: 1.65 }}>{ref.description}</p>
          <div style={{ marginTop: 26, display: 'flex', gap: 40, flexWrap: 'wrap', fontSize: 14 }}>
            {ref.maitrise_ouvrage && <div><div style={{ color: 'var(--grey-lt)', fontSize: 12, textTransform: 'uppercase', letterSpacing: '.04em', fontWeight: 700, marginBottom: 4 }}>Maîtrise d'ouvrage</div><div style={{ fontWeight: 600, color: 'var(--deep)' }}>{ref.maitrise_ouvrage}</div></div>}
            {ref.localisation && <div><div style={{ color: 'var(--grey-lt)', fontSize: 12, textTransform: 'uppercase', letterSpacing: '.04em', fontWeight: 700, marginBottom: 4 }}>Localisation</div><div style={{ fontWeight: 600, color: 'var(--deep)' }}>{ref.localisation}</div></div>}
          </div>
        </div>
      </header>

      {/* Membres impliqués */}
      {membres && membres.length > 0 && (
        <section className="wrap" style={{ maxWidth: 1000, padding: '50px 48px' }}>
          <span className="eyebrow">Le groupement</span>
          <div className="fluo" style={{ marginTop: 14 }} />
          <h2 style={{ fontSize: 30, fontWeight: 900, color: 'var(--deep)', marginBottom: 24 }}>Les membres PULZ impliqués</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 20 }}>
            {membres.map((m: any, i: number) => (
              <div key={i} style={{ border: '1px solid var(--line)', borderRadius: 12, padding: '22px 24px' }}>
                <div style={{ fontWeight: 800, color: 'var(--deep)', fontSize: 17 }}>{m.societes?.nom}</div>
                <div style={{ color: m.societes?.couleur, fontSize: 13, fontWeight: 700, marginBottom: 10 }}>{m.societes?.domaine}</div>
                {m.mission && <p style={{ fontSize: 14, color: 'var(--grey)' }}>{m.mission}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="wrap" style={{ maxWidth: 1000, paddingBottom: 60 }}>
        <Link href="/references" style={{ color: 'var(--blue)', fontWeight: 700 }}>← Retour aux références</Link>
      </div>
      <Footer />
    </>
  );
}
