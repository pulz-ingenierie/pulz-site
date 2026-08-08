'use client';

import { useEffect, useState } from 'react';
import type { Metier, SvcCard } from '@/content/societes/types';

type Props = {
  eyebrow?: string;
  titre: string;
  intro: string;
  cards: SvcCard[];
  metiers: Record<string, Metier>;
};

export default function Metiers({ eyebrow = 'Nos métiers', titre, intro, cards, metiers }: Props) {
  const [openKey, setOpenKey] = useState<string | null>(null);
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());

  const active = openKey ? metiers[openKey] : null;

  useEffect(() => {
    document.body.style.overflow = openKey ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [openKey]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenKey(null);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  const open = (k: string) => {
    setOpenItems(new Set());
    setOpenKey(k);
  };
  const toggleItem = (i: number) =>
    setOpenItems((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });

  return (
    <section className="metiers" id="metiers">
      <div className="in">
        <div className="head">
          <span className="eyebrow">{eyebrow}</span>
          <h2>{titre}</h2>
          <p>{intro}</p>
        </div>
        <div className="svc-grid">
          {cards.map((c) => (
            <button key={c.key} type="button" className="svc" onClick={() => open(c.key)}>
              <div className="svc-ic">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  dangerouslySetInnerHTML={{ __html: c.icon }}
                />
              </div>
              <h3>{c.titre}</h3>
              <p>{c.texte}</p>
              <span className="svc-more">
                Voir le détail <span className="arr">→</span>
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Volet latéral métier */}
      <div className={`mv-ov${openKey ? ' on' : ''}`} onClick={() => setOpenKey(null)} />
      <aside className={`mv${openKey ? ' on' : ''}`} aria-hidden={!openKey}>
        <div className="mv-head">
          <button className="x" onClick={() => setOpenKey(null)} aria-label="Fermer">
            ×
          </button>
          <div className="lbl">Métier</div>
          <h3>{active?.titre}</h3>
          <p className="intro">{active?.intro}</p>
        </div>
        <div className="mv-body">
          {active?.items.map((it, i) => (
            <div key={i} className={`mv-item${openItems.has(i) ? ' open' : ''}`}>
              <button className="mv-q" onClick={() => toggleItem(i)}>
                {it.t}
                <span className="plus">+</span>
              </button>
              <div className="mv-a" style={{ maxHeight: openItems.has(i) ? 400 : 0 }}>
                <p>{it.p}</p>
              </div>
            </div>
          ))}
        </div>
      </aside>
    </section>
  );
}
