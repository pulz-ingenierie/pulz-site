// FICHE ARTICLE — gabarit retravaillé, depuis la base
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase-server';

export const revalidate = 60;

function dateFr(d: string) {
  return new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
}
function readTime(txt: string) {
  const words = (txt || '').split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const sb = createClient();
  const { data: a } = await sb.from('actualites').select('titre, seo_titre, seo_description, extrait').eq('slug', params.slug).single();
  if (!a) return {};
  return { title: a.seo_titre || `${a.titre} | Actualités PULZ`, description: a.seo_description || a.extrait };
}

export default async function ArticleDetail({ params }: { params: { slug: string } }) {
  const sb = createClient();
  const { data: a } = await sb.from('actualites').select('*').eq('slug', params.slug).eq('statut', 'publie').single();
  if (!a) notFound();

  const paras = (a.contenu || '').split('\n\n').filter(Boolean);
  const chapo = paras[0] || a.extrait;
  const body = paras.slice(1);
  const words = a.titre.split(' ');
  const rt = readTime(a.contenu || '');

  const { data: others } = await sb
    .from('actualites')
    .select('slug, titre, categorie, date_publication, image_url')
    .eq('statut', 'publie').neq('slug', params.slug)
    .order('date_publication', { ascending: false }).limit(3);

  return (
    <>
      <Nav />
      <header style={{ background: '#fff', padding: '52px 0 20px' }}>
        <div className="wrap" style={{ maxWidth: 1000 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--grey)', marginBottom: 20 }}>
            <Link href="/" style={{ color: 'var(--blue)' }}>PULZ</Link> · <Link href="/actualites" style={{ color: 'var(--blue)' }}>Actualités</Link> · {a.categorie}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 11.5, fontWeight: 800, letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--blue)', background: '#EAF1FB', padding: '7px 15px', borderRadius: 20 }}>{a.categorie}</span>
            <span style={{ fontSize: 12.5, color: 'var(--grey-lt)', fontWeight: 600 }}>{rt} min de lecture</span>
          </div>
          <h1 style={{ fontSize: 42, fontWeight: 900, letterSpacing: '-.03em', lineHeight: 1.12, color: 'var(--deep)', maxWidth: '22ch', marginBottom: 14 }}>
            {words.slice(0, -1).join(' ')} <span style={{ color: 'var(--blue)', display: 'inline-block', filter: 'drop-shadow(0 8px 8px rgba(30,99,196,.25))' }}>{words[words.length - 1]}</span>
          </h1>
          <div style={{ fontSize: 13.5, color: 'var(--grey)', fontWeight: 600 }}>Publié le {dateFr(a.date_publication)}</div>
        </div>
      </header>

      <div className="wrap" style={{ maxWidth: 1000, marginTop: 14 }}>
        <div style={{ width: '100%', height: 460, borderRadius: 18, boxShadow: '0 26px 55px rgba(10,37,64,.14)', background: a.image_url ? `url(${a.image_url}) center/cover` : 'linear-gradient(135deg,var(--blue),var(--deep))' }} />
      </div>

      <article className="wrap" style={{ maxWidth: 1000, padding: '44px 48px 60px' }}>
        <div style={{ fontSize: 21, color: 'var(--deep)', fontWeight: 500, lineHeight: 1.55, paddingLeft: 20, borderLeft: '4px solid var(--accent)', marginBottom: 30 }}>{chapo}</div>
        {body.map((p: string, i: number) => (
          <p key={i} style={{ fontSize: 17, color: 'var(--ink)', lineHeight: 1.85, marginBottom: 22 }}>{p}</p>
        ))}
        <Link href="/actualites" style={{ color: 'var(--blue)', fontWeight: 700 }}>← Retour aux actualités</Link>
      </article>

      {others && others.length > 0 && (
        <section style={{ background: 'var(--paper-2)', padding: '60px 0 70px' }}>
          <div className="wrap" style={{ maxWidth: 1000 }}>
            <span className="eyebrow">Le fil PULZ</span>
            <h2 style={{ fontSize: 26, fontWeight: 900, color: 'var(--deep)', margin: '16px 0 24px' }}>À lire aussi</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 22 }}>
              {others.map((o: any) => (
                <Link key={o.slug} href={`/actualites/${o.slug}`} style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: 12, overflow: 'hidden', display: 'block' }}>
                  <div style={{ height: 150, background: o.image_url ? `url(${o.image_url}) center/cover` : 'linear-gradient(135deg,var(--blue),var(--deep))' }} />
                  <div style={{ padding: '16px 18px' }}>
                    <div style={{ fontSize: 12, color: 'var(--grey-lt)', fontWeight: 600, marginBottom: 6 }}>{dateFr(o.date_publication)}</div>
                    <h3 style={{ fontSize: 15, fontWeight: 800, color: 'var(--deep)', lineHeight: 1.35 }}>{o.titre}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
      <Footer />
    </>
  );
}
