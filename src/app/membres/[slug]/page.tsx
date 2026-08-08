// PAGE SOCIÉTÉ /membres/[slug] — un gabarit dynamique pour les 4 bureaux d'études.
//  - Société + équipe : lues en base (societes, membres)
//  - Contenu marketing (hero, approche, métiers, refs) : fixe, via le code (src/content/societes)
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import { createClient } from '@/lib/supabase-server';
import { IMG, membrePhoto, societeLogo } from '@/lib/images';
import { getSocieteContent } from '@/content/societes';
import Metiers from './Metiers';
import Equipe, { type Membre } from './Equipe';
import './membres.css';

export const revalidate = 60;

async function getSociete(slug: string) {
  const sb = createClient();
  const { data: societe } = await sb.from('societes').select('*').eq('slug', slug).single();
  if (!societe) return null;
  // On récupère tous les membres visibles puis on filtre : membres de la société
  // OU membres "groupe" (ex. l'assistante de direction commune). Robuste même si
  // la colonne groupe_wide n'existe pas encore (elle vaut alors undefined).
  const { data: all } = await sb
    .from('membres')
    .select('*')
    .eq('visible', true)
    .order('ordre')
    .order('created_at');
  const membres = (all ?? []).filter(
    (m: any) => m.societe_id === societe.id || m.groupe_wide === true,
  );
  return { societe, membres };
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const data = await getSociete(params.slug);
  if (!data) return {};
  const c = getSocieteContent(params.slug);
  return {
    title: `${data.societe.nom} — ${data.societe.domaine} | PULZ`,
    description: c?.lead ?? `${data.societe.nom}, ${data.societe.domaine}. Membre du groupement de maîtrise d'œuvre PULZ.`,
  };
}

export default async function SocietePage({ params }: { params: { slug: string } }) {
  const data = await getSociete(params.slug);
  if (!data) notFound();
  const { societe, membres: membresDb } = data;
  const content = getSocieteContent(params.slug);

  const soc = societe.couleur || '#1E63C4';
  const styleVars = {
    ['--soc']: soc,
    ['--soc-dk']: `color-mix(in srgb, ${soc} 60%, #000)`,
    ['--soc-lt']: `color-mix(in srgb, ${soc} 10%, #fff)`,
    // Accent du volet latéral générique (globals.css)
    ['--panel-accent']: soc,
    ['--panel-soft']: `color-mix(in srgb, ${soc} 10%, #fff)`,
  } as React.CSSProperties;

  // Ordre d'affichage : d'abord le champ `ordre`, puis les dirigeants/fondateurs
  // en tête (repli tant que `ordre` n'est pas renseigné en base). Tri stable.
  const rang = (role: string) => {
    if (/dirigeant|directeur|fondateur/i.test(role || '')) return 0;
    if (/assistant/i.test(role || '')) return 2; // assistante de direction en dernier
    return 1;
  };
  const membresTri = [...membresDb].sort((a: any, b: any) => rang(a.role) - rang(b.role));

  // DB membres -> forme attendue par le volet CV
  const membres: Membre[] = membresTri.map((m: any) => ({
    slug: m.slug,
    nom: m.nom,
    role: m.role,
    accroche: m.accroche,
    profil: m.profil,
    experiences: Array.isArray(m.experiences) ? m.experiences : [],
    formation: m.formation,
    competences: Array.isArray(m.competences) ? m.competences : [],
    photo: membrePhoto(m.slug),
    groupe: /groupement|PULZ/i.test(m.accroche ?? ''),
  }));

  const logo = societeLogo(params.slug) ?? IMG.logo;

  return (
    <div className="soc-page" style={styleVars}>
      <Nav />

      {/* HERO société */}
      <header className="soc-intro">
        <div className="in">
          <div className="intro-txt">
            <div className="bc">
              <Link href="/">PULZ</Link> · <Link href="/groupe">Membres</Link> · {societe.nom}
            </div>
            <span className="eyebrow">{content?.eyebrow ?? societe.domaine}</span>
            {content ? (
              <h1>
                {content.titre}
                <span>{content.titreAccent}</span>
                {content.titreSuffix}
              </h1>
            ) : (
              <h1>
                {societe.nom}, <span>{societe.domaine}</span>
              </h1>
            )}
            {content?.lead && <p className="lead">{content.lead}</p>}
            <div className="btns">
              {content && (
                <a className="btn p" href="#metiers">Nos métiers</a>
              )}
              <a className="btn g" href="#refs">Nos références</a>
            </div>
          </div>
          <div className="intro-logo">
            <img src={logo} alt={`Logo ${societe.nom}`} />
          </div>
        </div>
      </header>

      {/* PRÉSENTATION */}
      {content && (
        <section className="founder">
          <div className="in">
            <div>
              <span className="eyebrow">Présentation</span>
              <h2>{content.presentationTitre}</h2>
              {content.presentation.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            <div className="casque" style={{ background: 'linear-gradient(140deg,var(--soc),var(--soc-dk))' }} />
          </div>
        </section>
      )}

      {/* APPROCHE */}
      {content && (
        <section className="approche">
          <div className="in">
            <div className="head">
              <span className="eyebrow">Notre approche</span>
              <h2>{content.approcheTitre}</h2>
              <p>{content.approcheIntro}</p>
            </div>
            <div className="approche-grid">
              {content.approche.map((c, i) => (
                <div key={i} className={`app-card${c.white ? ' white' : ''}`}>
                  <h3>{c.titre}</h3>
                  <p>{c.texte}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* MÉTIERS (client, volet latéral) */}
      {content && (
        <Metiers
          eyebrow={content.metiersEyebrow}
          titre={content.metiersTitre}
          intro={content.metiersIntro}
          cards={content.metiersCards}
          metiers={content.metiers}
        />
      )}

      {/* ÉQUIPE (client, volet CV) */}
      {membres.length > 0 && <Equipe membres={membres} />}

      {/* RÉFÉRENCES société */}
      {content && content.refs.length > 0 && (
        <section className="srefs" id="refs">
          <div className="in">
            <div className="head">
              <span className="eyebrow">Références</span>
              <h2>{content.refsTitre}</h2>
              <p>{content.refsIntro}</p>
            </div>
            <div className="sref-grid">
              {content.refs.map((r, i) => (
                <div key={i} className="sref">
                  <div className="ph">
                    <span className="cat">{r.cat}</span>
                  </div>
                  <div className="bd">
                    <h3>{r.titre}</h3>
                    <p>{r.texte}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="more">
              <Link className="btn g" href="/references">Toutes les références du groupe</Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="soc-cta">
        <div className="wrap">
          <h2>{content?.ctaTitre ?? `Un projet en ${societe.domaine.toLowerCase()} ?`}</h2>
          <p>
            {content?.ctaTexte ??
              `Contactez ${societe.nom} et le groupement PULZ pour étudier votre besoin et construire ensemble la solution la plus adaptée.`}
          </p>
          <Link className="btn p" href="/contact">Nous contacter</Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
