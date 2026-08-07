// LISTE DES RÉFÉRENCES — lit la base, filtrable par catégorie
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { createClient } from '@/lib/supabase-server';

export const revalidate = 60; // regénère au max toutes les 60s

export default async function ReferencesPage() {
  const sb = createClient();
  const { data: refs } = await sb
    .from('references_projets')
    .select('slug, titre, categorie, localisation, description')
    .eq('statut', 'publie')
    .order('created_at', { ascending: false });

  const categories = ['Tous', ...Array.from(new Set((refs ?? []).map((r: any) => r.categorie)))];

  return (
    <>
      <Nav />
      <header style={{ background: 'linear-gradient(180deg,#fff,var(--paper-2))', padding: '76px 0 44px' }}>
        <div className="wrap">
          <span className="eyebrow">Nos réalisations</span>
          <div className="fluo" style={{ marginTop: 16 }} />
          <h1 style={{ fontSize: 48, fontWeight: 900, letterSpacing: '-.03em', color: 'var(--deep)', maxWidth: '18ch' }}>
            Des projets qui font notre <span style={{ color: 'var(--blue)' }}>fierté</span>
          </h1>
        </div>
      </header>

      <section className="wrap" style={{ padding: '40px 48px 90px' }}>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 30 }}>
          {categories.map((c) => (
            <span key={c} style={{ padding: '9px 16px', border: '1px solid var(--line)', borderRadius: 20, fontSize: 13.5, fontWeight: 600, color: 'var(--grey)' }}>{c}</span>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(320px,1fr))', gap: 24 }}>
          {(refs ?? []).map((r: any) => (
            <Link key={r.slug} href={`/references/${r.slug}`} style={{ border: '1px solid var(--line)', borderRadius: 14, overflow: 'hidden', display: 'block', background: '#fff' }}>
              <div style={{ height: 180, background: 'linear-gradient(135deg,var(--blue),var(--deep))' }} />
              <div style={{ padding: '20px 24px' }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--blue)', textTransform: 'uppercase', letterSpacing: '.04em', marginBottom: 8 }}>{r.categorie}</div>
                <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--deep)', marginBottom: 6 }}>{r.titre}</h3>
                <p style={{ fontSize: 14, color: 'var(--grey)' }}>{r.localisation}</p>
              </div>
            </Link>
          ))}
        </div>
        {(!refs || refs.length === 0) && (
          <p style={{ color: 'var(--grey-lt)', padding: 40, textAlign: 'center' }}>Aucune référence publiée pour le moment.</p>
        )}
      </section>
      <Footer />
    </>
  );
}
