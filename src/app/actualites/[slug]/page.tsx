// FICHE ARTICLE — gabarit « B1 » (actualite-*.html), depuis la base.
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import { createPublicClient } from '@/lib/supabase-public';
import { dateFr } from '@/lib/slug';
import ShareRail from './ShareRail';
import './article.css';

export const revalidate = 60;

// Pré-génère au build les articles publiés (les nouveaux restent rendus à la demande puis mis en cache).
export async function generateStaticParams() {
  const sb = createPublicClient();
  const { data } = await sb.from('actualites').select('slug').eq('statut', 'publie');
  return (data ?? []).map((r: any) => ({ slug: r.slug }));
}

function readTime(txt: string) {
  const words = (txt || '').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const sb = createPublicClient();
  const { data: a } = await sb
    .from('actualites')
    .select('titre, seo_titre, seo_description, extrait')
    .eq('slug', params.slug)
    .single();
  if (!a) return {};
  return { title: a.seo_titre || `${a.titre} | Actualités PULZ`, description: a.seo_description || a.extrait };
}

export default async function ArticleDetail({ params }: { params: { slug: string } }) {
  const sb = createPublicClient();
  const { data: a } = await sb.from('actualites').select('*').eq('slug', params.slug).eq('statut', 'publie').single();
  if (!a) notFound();

  // Le contenu peut contenir de vrais retours à la ligne OU des « \n » littéraux
  // (selon la façon dont il a été saisi/importé) : on normalise avant de découper.
  const raw = (a.contenu || '').replace(/\\n/g, '\n');
  const paras = raw.split(/\n\n+/).map((s: string) => s.trim()).filter(Boolean);
  const chapo = paras[0] || a.extrait;
  const body = paras.slice(1);
  const mots = (a.titre as string).split(' ');
  const rt = readTime(a.contenu || '');

  const { data: others } = await sb
    .from('actualites')
    .select('slug, titre, categorie, date_publication, image_url')
    .eq('statut', 'publie')
    .neq('slug', params.slug)
    .order('date_publication', { ascending: false })
    .limit(3);

  return (
    <>
      <Nav />

      <header className="ad-hero">
        <div className="in">
          <div className="bc">
            <Link href="/">PULZ</Link> · <Link href="/actualites">Actualités</Link> · {a.categorie}
          </div>
          <div className="ad-tags">
            <span className="ad-cat">{a.categorie}</span>
            <span className="ad-readtime">{rt} min de lecture</span>
          </div>
          <h1>
            {mots.slice(0, -1).join(' ')} <span className="hl">{mots[mots.length - 1]}</span>
          </h1>
          <div className="date">Publié le {dateFr(a.date_publication)}</div>
        </div>
      </header>

      <div className="ad-cover">
        {a.image_url ? (
          <img className="img" src={a.image_url} alt={a.titre} style={{ display: 'block' }} />
        ) : (
          <div className="img" />
        )}
      </div>

      <div className="ad-grid">
        <ShareRail titre={a.titre} />
        <article className="ad-article">
          {chapo && <div className="ad-chapo">{chapo}</div>}
          {body.map((p: string, i: number) => (
            <p key={i}>{p}</p>
          ))}
        </article>
      </div>

      <div className="ad-back">
        <Link href="/actualites">← Retour aux actualités</Link>
      </div>

      {others && others.length > 0 && (
        <section className="ad-more">
          <div className="in">
            <span className="eyebrow">Le fil PULZ</span>
            <h2>À lire aussi</h2>
            <div className="ad-more-grid">
              {others.map((o: any) => (
                <Link key={o.slug} className="amini" href={`/actualites/${o.slug}`}>
                  <div className="ph">
                    {o.image_url && <img src={o.image_url} alt={o.titre} />}
                    <span className="cat">{o.categorie}</span>
                  </div>
                  <div className="bd">
                    <div className="meta">{dateFr(o.date_publication)}</div>
                    <h3>{o.titre}</h3>
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
