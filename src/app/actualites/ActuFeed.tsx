'use client';

import { useState } from 'react';
import Link from 'next/link';
import { slugify, dateFr } from '@/lib/slug';

export type Actu = {
  slug: string;
  titre: string;
  categorie: string;
  date_publication: string;
  extrait?: string | null;
  image_url?: string | null;
};

export default function ActuFeed({ actus }: { actus: Actu[] }) {
  const [filter, setFilter] = useState('toutes');

  const cats = Array.from(new Set(actus.map((a) => a.categorie)));
  const filters = [{ label: 'Toutes', slug: 'toutes' }, ...cats.map((c) => ({ label: c, slug: slugify(c) }))];

  const shown = actus.filter((a) => filter === 'toutes' || slugify(a.categorie) === filter);
  const feat = shown[0];
  const rest = shown.slice(1);

  return (
    <>
      <div className="ac-filters">
        {filters.map((f) => (
          <button
            key={f.slug}
            type="button"
            className={`ac-filter${filter === f.slug ? ' active' : ''}`}
            onClick={() => setFilter(f.slug)}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="ac-feed">
        {feat && (
          <Link className="post-feat" href={`/actualites/${feat.slug}`}>
            <div className="pf-ph">
              {feat.image_url && <img src={feat.image_url} alt={feat.titre} />}
              <span className="cat">{feat.categorie}</span>
            </div>
            <div className="pf-bd">
              <div className="meta">{dateFr(feat.date_publication)}</div>
              <h2>{feat.titre}</h2>
              {feat.extrait && <p>{feat.extrait}</p>}
              <span className="more">Lire la suite <span className="arr">→</span></span>
            </div>
          </Link>
        )}

        {rest.length > 0 && (
          <div className="post-grid">
            {rest.map((a) => (
              <Link key={a.slug} className="post-card" href={`/actualites/${a.slug}`}>
                <div className="pc-ph">
                  {a.image_url && <img src={a.image_url} alt={a.titre} />}
                  <span className="cat">{a.categorie}</span>
                </div>
                <div className="pc-bd">
                  <div className="meta">{dateFr(a.date_publication)}</div>
                  <h3>{a.titre}</h3>
                  {a.extrait && <p>{a.extrait}</p>}
                </div>
              </Link>
            ))}
          </div>
        )}

        {shown.length === 0 && <div className="ac-empty">Aucune actualité dans cette catégorie pour le moment.</div>}
      </div>
    </>
  );
}
