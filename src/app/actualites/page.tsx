// LISTE ACTUALITÉS — à la une + grille, depuis la base
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { createClient } from '@/lib/supabase-server';

export const revalidate = 60;

function dateFr(d: string) {
  return new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default async function ActualitesPage() {
  const sb = createClient();
  const { data: actus } = await sb
    .from('actualites')
    .select('slug, titre, categorie, date_publication, extrait, image_url')
    .eq('statut', 'publie')
    .order('date_publication', { ascending: false });

  const list = actus ?? [];
  const feat = list[0];
  const rest = list.slice(1);

  return (
    <>
      <Nav />
      <header style={{ background: 'linear-gradient(180deg,#fff,var(--paper-2))', padding: '76px 0 40px' }}>
        <div className="wrap">
          <span className="eyebrow">Le fil PULZ</span>
          <div className="fluo" style={{ marginTop: 16 }} />
          <h1 style={{ fontSize: 48, fontWeight: 900, letterSpacing: '-.03em', color: 'var(--deep)' }}>Nos actualités</h1>
        </div>
      </header>

      <section className="wrap" style={{ maxWidth: 1160, padding: '36px 48px 90px', display: 'flex', flexDirection: 'column', gap: 30 }}>
        {feat && (
          <Link href={`/actualites/${feat.slug}`} style={{ display: 'grid', gridTemplateColumns: '1.15fr 1fr', border: '1px solid var(--line)', borderRadius: 16, overflow: 'hidden', background: '#fff' }}>
            <div style={{ minHeight: 320, background: feat.image_url ? `url(${feat.image_url}) center/cover` : 'linear-gradient(135deg,var(--blue),var(--deep))' }} />
            <div style={{ padding: '38px 40px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ fontSize: 12.5, color: 'var(--grey-lt)', fontWeight: 600, marginBottom: 12 }}>{dateFr(feat.date_publication)}</div>
              <h2 style={{ fontSize: 27, fontWeight: 900, color: 'var(--deep)', lineHeight: 1.2, marginBottom: 14 }}>{feat.titre}</h2>
              <p style={{ fontSize: 15, color: 'var(--grey)', lineHeight: 1.65, marginBottom: 18 }}>{feat.extrait}</p>
              <span style={{ color: 'var(--blue)', fontWeight: 700 }}>Lire la suite →</span>
            </div>
          </Link>
        )}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,minmax(0,362px))', gap: 22, justifyContent: 'start' }}>
          {rest.map((a: any) => (
            <Link key={a.slug} href={`/actualites/${a.slug}`} style={{ border: '1px solid var(--line)', borderRadius: 12, overflow: 'hidden', background: '#fff', display: 'block' }}>
              <div style={{ height: 160, background: a.image_url ? `url(${a.image_url}) center/cover` : 'linear-gradient(135deg,var(--blue),var(--deep))' }} />
              <div style={{ padding: '18px 20px' }}>
                <div style={{ fontSize: 12, color: 'var(--grey-lt)', fontWeight: 600, marginBottom: 6 }}>{dateFr(a.date_publication)}</div>
                <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--deep)', lineHeight: 1.35, marginBottom: 8 }}>{a.titre}</h3>
                <p style={{ fontSize: 13, color: 'var(--grey)', lineHeight: 1.55 }}>{a.extrait}</p>
              </div>
            </Link>
          ))}
        </div>
        {list.length === 0 && <p style={{ color: 'var(--grey-lt)', padding: 40, textAlign: 'center' }}>Aucune actualité publiée pour le moment.</p>}
      </section>
      <Footer />
    </>
  );
}
