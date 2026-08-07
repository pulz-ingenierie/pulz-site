// PAGE D'ACCUEIL — version dynamique de base (à enrichir avec le design des maquettes)
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { createClient } from '@/lib/supabase-server';

export const revalidate = 60;

export default async function Home() {
  const sb = createClient();
  const { data: societes } = await sb.from('societes').select('*').order('ordre');
  const { data: refsCount } = await sb.from('references_projets').select('id', { count: 'exact', head: true }).eq('statut', 'publie');

  return (
    <>
      <Nav />
      <header style={{ background: 'linear-gradient(180deg,#fff,var(--paper-2))', padding: '92px 0 74px' }}>
        <div className="wrap">
          <span className="eyebrow">Groupement de maîtres d'œuvre · Hauts-de-France</span>
          <div className="fluo" style={{ marginTop: 16 }} />
          <h1 style={{ fontSize: 56, fontWeight: 900, letterSpacing: '-.035em', lineHeight: 1.05, color: 'var(--deep)', maxWidth: '16ch' }}>
            Le groupe de maîtres d'œuvre de <span style={{ color: 'var(--blue)', display: 'inline-block', filter: 'drop-shadow(0 10px 10px rgba(30,99,196,.28))' }}>toutes vos réussites.</span>
          </h1>
          <p style={{ fontSize: 20, color: 'var(--grey)', maxWidth: '60ch', lineHeight: 1.65, marginTop: 22 }}>
            Quatre bureaux d'études indépendants et solidaires, réunis pour porter vos projets de construction et de rénovation — de la conception au suivi de l'exécution.
          </p>
          <div style={{ marginTop: 30, display: 'flex', gap: 14 }}>
            <Link href="/references" style={{ background: 'var(--blue)', color: '#fff', fontWeight: 700, padding: '15px 30px', borderRadius: 6 }}>Nos réalisations</Link>
            <Link href="/contact" style={{ border: '1px solid var(--line)', color: 'var(--deep)', fontWeight: 700, padding: '15px 30px', borderRadius: 6 }}>Nous contacter</Link>
          </div>
        </div>
      </header>

      <section className="wrap" style={{ padding: '70px 48px' }}>
        <span className="eyebrow">Le groupement</span>
        <div className="fluo" style={{ marginTop: 14 }} />
        <h2 style={{ fontSize: 38, fontWeight: 900, color: 'var(--deep)', marginBottom: 30 }}>Quatre expertises complémentaires</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 20 }}>
          {(societes ?? []).map((s: any) => (
            <Link key={s.slug} href={`/membres/${s.slug}`} style={{ border: '1px solid var(--line)', borderRadius: 12, padding: '26px 28px', display: 'block' }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: s.couleur, marginBottom: 14 }} />
              <h3 style={{ fontSize: 19, fontWeight: 800, color: 'var(--deep)' }}>{s.nom}</h3>
              <p style={{ fontSize: 14, color: 'var(--grey)', marginTop: 6 }}>{s.domaine}</p>
            </Link>
          ))}
        </div>
      </section>
      <Footer />
    </>
  );
}
