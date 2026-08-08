import Link from 'next/link';
import { IMG } from '@/lib/images';

export default function Nav() {
  return (
    <nav className="nav">
      <div className="in">
        <Link className="brand" href="/">
          <img src={IMG.pulzSymbol} alt="PULZ" />
          <b>PULZ</b>
        </Link>
        <div className="lks">
          <Link href="/groupe">Le groupe</Link>
          <Link href="/references">Références</Link>
          <Link href="/actualites">Actualités</Link>
        </div>
        <Link className="cta" href="/contact">Nous contacter</Link>
      </div>
    </nav>
  );
}
