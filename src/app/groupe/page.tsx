// PAGE « LE GROUPE » — design fixe (modifiable via le code), repris de pulz-groupe.html
import type { Metadata } from 'next';
import Link from 'next/link';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import { IMG } from '@/lib/images';
import './groupe.css';

export const metadata: Metadata = {
  title: 'Le groupe PULZ — Groupement de maîtrise d\'œuvre en Hauts-de-France',
  description:
    "PULZ réunit quatre bureaux d'études indépendants et solidaires — Buscot Energies, Arteix, Gradient et Therac — pour porter vos projets de construction et de rénovation en Hauts-de-France.",
};

const SOCIETES = [
  {
    slug: 'buscot',
    nom: 'BUSCOT ENERGIES',
    role: 'Fluides & Électricité',
    texte:
      'Génie électrique, génie climatique et plomberie. Buscot conçoit et pilote les lots techniques de vos projets, avec une expertise en performance énergétique (décret tertiaire, décret BACS).',
  },
  {
    slug: 'arteix',
    nom: 'ARTEIX',
    role: "Maîtrise d'œuvre bâtiment",
    texte:
      "Bureau d'études généraliste du bâtiment : clos et couvert, second œuvre et corps d'état techniques. Arteix accompagne la conception et la réalisation de vos ouvrages.",
  },
  {
    slug: 'gradient',
    nom: 'GRADIENT',
    role: 'VRD & Espaces verts',
    texte:
      'Voiries et réseaux divers, réseaux humides et secs, éclairage et espaces verts. Gradient conçoit et coordonne les aménagements extérieurs de vos projets.',
  },
  {
    slug: 'therac',
    nom: 'THERAC',
    role: 'Thermique & Environnement',
    texte:
      'Génie thermique, bas carbone et génie environnemental : RE 2020, STD, ACV, certifications et économie circulaire. Therac accompagne vos ambitions environnementales.',
  },
];

export default function GroupePage() {
  return (
    <>
      <Nav />

      {/* HERO — fond vidéo + voile + contenu */}
      <header className="g-hero">
        <video
          className="g-hero-video"
          autoPlay
          muted
          loop
          playsInline
          poster={IMG.groupeHeroPoster}
        >
          <source src={IMG.groupeHeroVideo} type="video/mp4" />
        </video>
        <div className="g-hero-overlay" />
        <div className="wrap">
          <span className="eyebrow">Le groupe</span>
          <div className="fluo" />
          <h1>L'assembleur d'<span>avenir</span></h1>
          <p className="lead">
            PULZ réunit quatre bureaux d'études indépendants et solidaires pour assurer la conduite
            opérationnelle de vos projets de construction et de rénovation, de la conception technique au
            suivi de l'exécution des travaux.
          </p>
          <p className="sig">« La force du groupe, l'agilité de l'individu. »</p>
        </div>
      </header>

      {/* VOCATION + symbole en lévitation */}
      <section className="g-voc">
        <div className="wrap">
          <div>
            <span className="eyebrow">Notre vocation</span>
            <div className="fluo" />
            <h2>Embarquer toutes les expertises du bâtiment</h2>
            <p>
              PULZ a pour vocation de réunir l'ensemble des expertises du bâtiment au sein d'un groupement
              de maîtres d'œuvre partageant des valeurs fortes et communes, centré sur l'expression du
              potentiel humain.
            </p>
            <p>
              Au-delà d'un assemblage de compétences, PULZ est avant tout un groupe de jeunes chefs
              d'entreprises passionnés, au service de leurs clients. Chaque collaborateur, chaque client,
              chaque partenaire est une pièce essentielle d'un puzzle plus vaste, conçu pour inspirer et
              rayonner.
            </p>
            <p>
              Nous veillons au respect des délais, du budget et de la qualité à chaque étape, dans un
              environnement où l'agilité, la passion et l'intégrité sont essentielles.
            </p>
          </div>
          <div className="logo-stage">
            <div className="logo-stack">
              <img src={IMG.pulzSymbol} alt="Symbole PULZ Ingénierie" />
              <span>PULZ</span>
            </div>
          </div>
        </div>
      </section>

      {/* VALEURS */}
      <section className="g-val">
        <div className="wrap">
          <div className="head">
            <span className="eyebrow">Nos valeurs</span>
            <div className="fluo" />
            <h2>Agilité, passion, intégrité</h2>
            <p>Trois valeurs guident chacun de nos projets et notre relation avec nos clients et partenaires.</p>
          </div>
          <div className="g-val-grid">
            <div className="g-val-card">
              <div className="ic">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                </svg>
              </div>
              <h3>Agilité</h3>
              <p>
                Chaque projet est unique et chaque étape peut devenir un défi. Notre organisation à taille
                humaine nous permet de nous adapter, de réagir vite et de trouver la solution la plus juste.
              </p>
            </div>
            <div className="g-val-card">
              <div className="ic">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z" />
                </svg>
              </div>
              <h3>Passion</h3>
              <p>
                La passion nous pousse chaque jour à donner le meilleur de nous-mêmes. Un groupement à taille
                humaine où l'engagement de chacun est reconnu, au service d'un avenir plus durable.
              </p>
            </div>
            <div className="g-val-card">
              <div className="ic">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-4z" />
                  <path d="M9 12l2 2 4-4" />
                </svg>
              </div>
              <h3>Intégrité</h3>
              <p>
                L'intégrité est notre boussole. La confiance est la clé de toute relation réussie : nous nous
                engageons à être honnêtes, transparents et fidèles à nos valeurs en toutes circonstances.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* MEMBRES */}
      <section className="g-mem" id="membres">
        <div className="wrap">
          <div className="head">
            <span className="eyebrow">Les membres du groupe</span>
            <div className="fluo" />
            <h2>Quatre bureaux d'études, une même exigence</h2>
            <p>
              Chaque membre reste maître de son métier ; ensemble, nous couvrons l'intégralité d'une mission
              de maîtrise d'œuvre, de la conception au suivi de l'exécution.
            </p>
          </div>
          <div className="scards">
            {SOCIETES.map((s) => (
              <Link key={s.slug} className={`scard ${s.slug}`} href={`/membres/${s.slug}`}>
                <div className="logobox">
                  <img src={IMG.membres[s.slug]} alt={s.nom} />
                </div>
                <div className="bd">
                  <h3>{s.nom}</h3>
                  <div className="role">{s.role}</div>
                  <p>{s.texte}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="g-cta">
        <div className="wrap">
          <h2>Un projet de construction ou de rénovation ?</h2>
          <p>
            Quel que soit votre projet, PULZ vous accompagne et vous offre un service personnalisé.
            Parlons-en ensemble.
          </p>
          <Link href="/contact">Nous contacter</Link>
        </div>
      </section>

      <Footer />
    </>
  );
}
