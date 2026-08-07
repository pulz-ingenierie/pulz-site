import Link from 'next/link';

export default function Nav() {
  return (
    <nav className="nav">
      <div className="in">
        <Link href="/" className="brand">PULZ</Link>
        <div className="links">
          <Link href="/groupe">Le groupe</Link>
          <Link href="/membres">Membres</Link>
          <Link href="/references">Références</Link>
          <Link href="/actualites">Actualités</Link>
          <Link href="/contact" className="cta">Nous contacter</Link>
        </div>
      </div>
    </nav>
  );
}
