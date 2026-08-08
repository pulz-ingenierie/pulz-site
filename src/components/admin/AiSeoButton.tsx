'use client';

import { useState } from 'react';

type Props = {
  type: 'reference' | 'actualite';
  getPayload: () => { titre: string; contenu: string; localisation?: string };
  onResult: (seo: { seo_titre: string; seo_description: string }) => void;
};

// Bouton « Optimiser SEO avec l'IA » — appelle /api/ai/seo et remplit les champs.
export default function AiSeoButton({ type, getPayload, onResult }: Props) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [msg, setMsg] = useState('');

  async function run() {
    setStatus('loading');
    setMsg('');
    try {
      const res = await fetch('/api/ai/seo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, ...getPayload() }),
      });
      if (!res.ok) {
        setStatus('error');
        setMsg(res.status === 500 ? 'IA indisponible (clé ANTHROPIC_API_KEY manquante ?)' : 'Erreur IA');
        return;
      }
      const data = await res.json();
      onResult({ seo_titre: data.seo_titre ?? '', seo_description: data.seo_description ?? '' });
      setStatus('idle');
    } catch {
      setStatus('error');
      setMsg('Erreur réseau');
    }
  }

  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
      <button type="button" className="abtn ai" onClick={run} disabled={status === 'loading'}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1" />
        </svg>
        {status === 'loading' ? 'Optimisation…' : 'Optimiser le SEO avec l\'IA'}
      </button>
      {status === 'error' && <span style={{ fontSize: 12.5, color: '#C0392B', fontWeight: 600 }}>{msg}</span>}
    </span>
  );
}
