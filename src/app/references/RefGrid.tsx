'use client';

import { useState } from 'react';
import Link from 'next/link';
import { slugify } from '@/lib/slug';

export type Ref = {
  slug: string;
  titre: string;
  categorie: string;
  localisation?: string | null;
  description?: string | null;
  cover?: string | null;
};

export default function RefGrid({ refs }: { refs: Ref[] }) {
  const [filter, setFilter] = useState('tous');

  const cats = Array.from(new Set(refs.map((r) => r.categorie).filter(Boolean)));
  const filters = [{ label: 'Tous', slug: 'tous' }, ...cats.map((c) => ({ label: c, slug: slugify(c) }))];

  const shown = refs.filter((r) => filter === 'tous' || slugify(r.categorie) === filter);

  return (
    <>
      <div className="filters">
        {filters.map((f) => (
          <button
            key={f.slug}
            type="button"
            className={`filter${filter === f.slug ? ' active' : ''}`}
            onClick={() => setFilter(f.slug)}
          >
            {f.label}
          </button>
        ))}
      </div>
      <div className="refcount">
        {shown.length} {shown.length > 1 ? 'projets' : 'projet'}
      </div>

      <div className="refwrap">
        <div className="refgrid">
          {shown.map((r) => (
            <Link key={r.slug} className="rcard-l" href={`/references/${r.slug}`}>
              <div className="ph">
                {r.cover && <img src={r.cover} alt={r.titre} />}
                <span className="cat">{r.categorie}</span>
              </div>
              <div className="bd">
                <h3>{r.titre}</h3>
                {r.localisation && <div className="loc">{r.localisation}</div>}
                {r.description && <p>{r.description}</p>}
              </div>
            </Link>
          ))}
          {shown.length === 0 && <div className="noresult">Aucun projet dans cette catégorie pour le moment.</div>}
        </div>
      </div>
    </>
  );
}
