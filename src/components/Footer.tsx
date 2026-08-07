import { createClient } from '@/lib/supabase-server';

export default async function Footer() {
  const sb = createClient();
  const { data: params } = await sb.from('parametres').select('cle, valeur');
  const p = Object.fromEntries((params ?? []).map((r: any) => [r.cle, r.valeur]));

  return (
    <footer className="footer">
      <div className="in">
        <div className="col">
          <h4>PULZ Ingénierie</h4>
          <p>{p.adresse ?? '99 rue de l\'Union, 59118 Wambrechies'}</p>
          {p.email && <a href={`mailto:${p.email}`}>{p.email}</a>}
          {p.telephone && <p>{p.telephone}</p>}
        </div>
        <div className="col">
          <h4>Le groupement</h4>
          <a href="/membres/buscot">Buscot Energies</a>
          <a href="/membres/arteix">Arteix</a>
          <a href="/membres/gradient">Gradient</a>
          <a href="/membres/therac">Therac</a>
        </div>
        <div className="col">
          <h4>Navigation</h4>
          <a href="/references">Références</a>
          <a href="/actualites">Actualités</a>
          <a href="/contact">Contact</a>
        </div>
      </div>
      <div className="bottom">© {new Date().getFullYear()} PULZ Ingénierie — Tous droits réservés.</div>
    </footer>
  );
}
