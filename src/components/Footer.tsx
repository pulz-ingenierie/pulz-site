import Link from 'next/link';
import { createClient } from '@/lib/supabase-server';
import { IMG } from '@/lib/images';

export default async function Footer() {
  const sb = createClient();
  const { data: params } = await sb.from('parametres').select('cle, valeur');
  const p = Object.fromEntries((params ?? []).map((r: any) => [r.cle, r.valeur]));
  const annee = new Date().getFullYear();

  return (
    <footer className="foot">
      <div className="wrap">
        <div className="top">
          <div className="brand">
            <Link href="/">
              <img src={IMG.logoDetoure} alt="PULZ" />
            </Link>
            <p>Groupement de maîtres d'œuvre indépendants et solidaires. La force du groupe, l'agilité de l'individu.</p>
            {p.email && <a href={`mailto:${p.email}`} style={{ color: '#C4CDD6', fontSize: 14 }}>{p.email}</a>}
          </div>
          <div>
            <h4>Navigation</h4>
            <ul>
              <li><Link href="/groupe">Le groupe</Link></li>
              <li><Link href="/references">Références</Link></li>
              <li><Link href="/actualites">Actualités</Link></li>
              <li><Link href="/contact">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4>Membres</h4>
            <ul>
              <li><Link href="/membres/buscot">Buscot Energies</Link></li>
              <li><Link href="/membres/arteix">Arteix</Link></li>
              <li><Link href="/membres/gradient">Gradient</Link></li>
              <li><Link href="/membres/therac">Therac</Link></li>
            </ul>
          </div>
        </div>
        <div className="bottom">
          <span>© PULZ {annee} — {p.adresse ?? "99 rue de l'Union, 59118 Wambrechies"}</span>
          <span>Mentions légales</span>
        </div>
      </div>
    </footer>
  );
}
