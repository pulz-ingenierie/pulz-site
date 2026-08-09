'use client';
import { useState } from 'react';
import Link from 'next/link';

const SOCIETES = [
  { slug: 'buscot', nom: 'Buscot Energies', role: 'Fluides & Électricité' },
  { slug: 'arteix', nom: 'Arteix', role: "Maîtrise d'œuvre bâtiment" },
  { slug: 'gradient', nom: 'Gradient', role: 'VRD & Espaces verts' },
  { slug: 'therac', nom: 'Therac', role: 'Thermique & Environnement' },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <nav className="nav">
      <div className="in">
        <Link className="brand" href="/" onClick={close}>
          <img src="/pulz-nav.svg" alt="PULZ" />
          <b>PULZ</b>
        </Link>

        {/* Navigation desktop */}
        <div className="lks">
          <Link href="/groupe">Le groupe</Link>
          <div className="drop">
            <Link href="/groupe#membres" className="dl">
              Membres
              <svg className="car" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </Link>
            <div className="menu">
              {SOCIETES.map((s) => (
                <Link key={s.slug} href={`/membres/${s.slug}`}>
                  {s.nom}
                  <span className="r">{s.role}</span>
                </Link>
              ))}
            </div>
          </div>
          <Link href="/#services">Métiers</Link>
          <Link href="/references">Références</Link>
          <Link href="/actualites">Actualités</Link>
        </div>

        <Link className="cta" href="/contact">Nous contacter</Link>

        {/* Bouton menu mobile */}
        <button
          className="burger"
          aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span /><span /><span />
        </button>
      </div>

      {/* Panneau de navigation mobile */}
      <div className={`mnav${open ? ' open' : ''}`}>
        <Link href="/groupe" onClick={close}>Le groupe</Link>
        <div className="mnav-lbl">Membres</div>
        <div className="mnav-sub">
          {SOCIETES.map((s) => (
            <Link key={s.slug} href={`/membres/${s.slug}`} onClick={close}>
              {s.nom}
              <span className="r">{s.role}</span>
            </Link>
          ))}
        </div>
        <Link href="/#services" onClick={close}>Métiers</Link>
        <Link href="/references" onClick={close}>Références</Link>
        <Link href="/actualites" onClick={close}>Actualités</Link>
        <Link className="mnav-cta" href="/contact" onClick={close}>Nous contacter</Link>
      </div>
    </nav>
  );
}
