// PAGE D'ACCUEIL — design maquette (pulz-home.html).
//  Compteurs + références = base de données ; le reste est fixe (src/content/home.ts).
//  Seule animation au scroll : les compteurs.
import Link from 'next/link';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import Counters, { type Stat } from '@/components/Counters';
import HomeServices from '@/components/HomeServices';
import ContactForm from './contact/ContactForm';
import { createClient } from '@/lib/supabase-server';
import { coverPhotoMap } from '@/lib/reference-photos';
import { IMG } from '@/lib/images';
import { services } from '@/content/home.services';
import { HERO, BRIEF, STATS_FALLBACK, LOGOBAND, SOCS, SERVICES_CARDS, REFS_FALLBACK, CLIENTS } from '@/content/home';

export const revalidate = 60;

export default async function Home() {
  const sb = createClient();
  const [statsRes, refsRes, routesRes, paramsRes] = await Promise.all([
    sb.from('statistiques').select('valeur, suffixe, label').order('ordre'),
    sb
      .from('references_projets')
      .select('id, slug, titre, categorie, localisation, description, a_la_une')
      .eq('statut', 'publie')
      .order('a_la_une', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(6),
    sb.from('routage_contact').select('sujet').order('ordre'),
    sb.from('parametres').select('cle, valeur'),
  ]);

  const stats: Stat[] = statsRes.data && statsRes.data.length ? (statsRes.data as Stat[]) : STATS_FALLBACK;
  const refs = refsRes.data ?? [];
  const refCovers = await coverPhotoMap(sb, refs.map((r: any) => r.id));
  const sujets = (routesRes.data ?? []).map((r: any) => r.sujet);
  const p = Object.fromEntries((paramsRes.data ?? []).map((r: any) => [r.cle, r.valeur]));

  return (
    <>
      <Nav />

      {/* HERO */}
      <header className="hero">
        <div className="wrap">
          <span className="eyebrow">{HERO.eyebrow}</span>
          <h1>
            {HERO.titre}
            <span>{HERO.titreAccent}</span>
          </h1>
          <p className="sub">{HERO.sub}</p>
          <p className="sig">{HERO.sig}</p>
          <div className="btns">
            <Link className="btn p" href="/references">Voir nos références</Link>
            <Link className="btn g" href="/groupe">Découvrir le groupe</Link>
          </div>
        </div>
      </header>

      {/* BANDEAU photo d'équipe */}
      <div className="band">
        <img className="photo" src={IMG.homeEquipe} alt="L'équipe PULZ" />
      </div>

      {/* LE GROUPE EN BREF + COMPTEURS */}
      <section className="brief">
        <div className="wrap brief-c">
          <span className="eyebrow">{BRIEF.eyebrow}</span>
          <h2>{BRIEF.titre}</h2>
          <p>{BRIEF.texte}</p>
          <Counters stats={stats} />
        </div>
      </section>

      {/* BANDE LOGO / CITATION */}
      <section className="logoband">
        <img className="lb-ghost" src="/pulz-watermark.svg" alt="" />
        <div className="wrap lb-inner">
          <img className="lb-logo" src="/pulz-logo-white.svg" alt="PULZ" />
          <div className="lb-txt">
            <div className="lb-accent" />
            <div className="lb-eyebrow">{LOGOBAND.eyebrow}</div>
            <p className="lb-quote">{LOGOBAND.quote}</p>
          </div>
        </div>
      </section>

      {/* MEMBRES DU GROUPE */}
      <section className="sec socs" id="socs">
        <div className="wrap">
          <div className="head">
            <span className="eyebrow">Les membres du groupe</span>
            <h2>Quatre bureaux d'études, une même exigence</h2>
            <p className="lead">
              Choisir PULZ, c'est opter pour une approche humaine et innovante de la maîtrise d'œuvre. Chaque
              membre reste maître de son métier ; ensemble, nous couvrons l'intégralité d'une mission.
            </p>
          </div>
          <div className="scards">
            {SOCS.map((s) => (
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

      {/* MÉTIERS & SERVICES */}
      <section className="sec services" id="services">
        <div className="wrap">
          <div className="head">
            <span className="eyebrow">Nos métiers & services</span>
            <h2>De la conception au suivi de chantier</h2>
            <p className="lead">
              Quel que soit votre projet, PULZ vous accompagne avec un service personnalisé, en conception
              comme en réalisation.
            </p>
          </div>
          <HomeServices cards={SERVICES_CARDS} services={services} />
        </div>
      </section>

      {/* RÉFÉRENCES */}
      <section className="sec refs" id="refs">
        <div className="wrap">
          <div className="head">
            <span className="eyebrow">Nos références</span>
            <h2>La preuve par les projets</h2>
            <p className="lead">
              Logement, tertiaire, industrie, équipements publics : nos compétences au service de votre
              réussite, partout en région.
            </p>
          </div>
          <div className="rgrid">
            {refs.length > 0
              ? refs.map((r: any) => (
                  <Link key={r.slug} className="rcard" href={`/references/${r.slug}`}>
                    <div className="ph">
                      {refCovers[r.id] && <img src={refCovers[r.id]} alt={r.titre} />}
                      <span className="tag">{r.categorie}{r.localisation ? ` · ${r.localisation}` : ''}</span>
                    </div>
                    <div className="bd">
                      <h3>{r.titre}</h3>
                      <p>{r.description}</p>
                    </div>
                  </Link>
                ))
              : REFS_FALLBACK.map((r, i) => (
                  <div key={i} className="rcard" style={{ cursor: 'default' }}>
                    <div className="ph">
                      <span className="tag">{r.tag}</span>
                    </div>
                    <div className="bd">
                      <h3>{r.titre}</h3>
                      <p>{r.texte}</p>
                    </div>
                  </div>
                ))}
          </div>
          <div className="more">
            <Link className="btn acc" href="/references">Découvrir toutes nos références</Link>
          </div>
        </div>
      </section>

      {/* CLIENTS */}
      <section className="clients">
        <div className="wrap">
          <div className="lbl">Ils nous font confiance</div>
          <div className="row">
            {CLIENTS.map((c) => (
              <span key={c} className="c">{c}</span>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section className="contact" id="contact">
        <div className="wrap">
          <div className="contact-grid">
            <div className="left" style={{ background: 'var(--deep)', color: '#fff', padding: '48px 44px', borderRadius: 16 }}>
              <span className="eyebrow" style={{ color: 'var(--accent)', display: 'block', marginBottom: 18 }}>Contact</span>
              <h2 style={{ color: '#fff', fontSize: 32, marginBottom: 16, maxWidth: '14ch' }}>Transformez vos idées en réalité</h2>
              <p style={{ color: '#B8CEE4', marginBottom: 30, fontSize: 16, lineHeight: 1.65 }}>
                Contactez-nous pour discuter de votre projet et découvrir comment nous pouvons vous accompagner.
              </p>
              <div style={{ fontSize: 15, lineHeight: 2.1, color: '#D6E2EE' }}>
                <b style={{ color: '#fff' }}>PULZ</b> — Groupement de maîtres d'œuvre<br />
                {p.adresse ?? "99 rue de l'Union, 59118 Wambrechies"}<br />
                {p.telephone && (<><b style={{ color: '#fff' }}>{p.telephone}</b><br /></>)}
                {p.email ?? 'contact@pulz-ingenierie.fr'}
              </div>
            </div>
            <ContactForm sujets={sujets} />
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
