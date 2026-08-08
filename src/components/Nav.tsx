import Link from 'next/link';

const SOCIETES = [
  { slug: 'buscot', nom: 'Buscot Energies', role: 'Fluides & Électricité' },
  { slug: 'arteix', nom: 'Arteix', role: "Maîtrise d'œuvre bâtiment" },
  { slug: 'gradient', nom: 'Gradient', role: 'VRD & Espaces verts' },
  { slug: 'therac', nom: 'Therac', role: 'Thermique & Environnement' },
];

export default function Nav() {
  return (
    <nav className="nav">
      <div className="in">
        <Link className="brand" href="/">
          <img src="/pulz-nav.svg" alt="PULZ" />
          <b>PULZ</b>
        </Link>
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
      </div>
    </nav>
  );
}
