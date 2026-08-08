'use client';

import { useEffect, useState } from 'react';

// Rail de partage vertical : construit les liens à partir de l'URL courante.
export default function ShareRail({ titre }: { titre: string }) {
  const [url, setUrl] = useState('');
  useEffect(() => {
    setUrl(window.location.href);
  }, []);

  const u = encodeURIComponent(url);
  const t = encodeURIComponent(titre);

  return (
    <div className="ad-rail">
      <span className="rl">Partager</span>
      <a className="sh" href={`https://www.linkedin.com/sharing/share-offsite/?url=${u}`} target="_blank" rel="noopener noreferrer" aria-label="Partager sur LinkedIn">
        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM2.4 21h5.16V9H2.4v12zM9.7 9h4.94v1.64h.07c.69-1.24 2.37-2.55 4.88-2.55 5.22 0 6.18 3.28 6.18 7.55V21h-5.15v-4.36c0-1.04-.02-2.38-1.45-2.38-1.45 0-1.67 1.13-1.67 2.3V21H9.7V9z" /></svg>
      </a>
      <a className="sh" href={`https://www.facebook.com/sharer/sharer.php?u=${u}`} target="_blank" rel="noopener noreferrer" aria-label="Partager sur Facebook">
        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M13.5 21v-8h2.7l.4-3.1h-3.1V7.9c0-.9.25-1.5 1.55-1.5H17V3.6c-.3-.04-1.3-.13-2.47-.13-2.44 0-4.11 1.49-4.11 4.23v2.36H7.7V13h2.72v8h3.08z" /></svg>
      </a>
      <a className="sh" href={`mailto:?subject=${t}&body=${u}`} aria-label="Partager par e-mail">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M4 4h16v16H4z" /><path d="m4 6 8 6 8-6" /></svg>
      </a>
    </div>
  );
}
