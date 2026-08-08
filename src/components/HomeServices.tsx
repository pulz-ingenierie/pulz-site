'use client';

import { useEffect, useState } from 'react';
import type { Metier } from '@/content/societes/types';
import type { SvcCard } from '@/content/home';

export default function HomeServices({
  cards,
  services,
}: {
  cards: SvcCard[];
  services: Record<string, Metier>;
}) {
  const [openKey, setOpenKey] = useState<string | null>(null);
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());
  const active = openKey ? services[openKey] : null;

  useEffect(() => {
    document.body.style.overflow = openKey ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [openKey]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpenKey(null);
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  const open = (k: string) => {
    setOpenItems(new Set());
    setOpenKey(k);
  };
  const toggle = (i: number) =>
    setOpenItems((prev) => {
      const n = new Set(prev);
      n.has(i) ? n.delete(i) : n.add(i);
      return n;
    });

  return (
    <>
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

      <div className={`mv-ov${openKey ? ' on' : ''}`} onClick={() => setOpenKey(null)} />
      <aside className={`mv${openKey ? ' on' : ''}`} aria-hidden={!openKey}>
        <div className="mv-head">
          <button className="x" onClick={() => setOpenKey(null)} aria-label="Fermer">
            ×
          </button>
          <div className="lbl">Service</div>
          <h3>{active?.titre}</h3>
          <p className="intro">{active?.intro}</p>
        </div>
        <div className="mv-body">
          {active?.items.map((it, i) => (
            <div key={i} className={`mv-item${openItems.has(i) ? ' open' : ''}`}>
              <button className="mv-q" onClick={() => toggle(i)}>
                {it.t}
                <span className="plus">+</span>
              </button>
              <div className="mv-a" style={{ maxHeight: openItems.has(i) ? 600 : 0 }}>
                <p>{it.p}</p>
              </div>
            </div>
          ))}
        </div>
      </aside>
    </>
  );
}
