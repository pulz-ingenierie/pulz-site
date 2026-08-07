'use client';
import { useState } from 'react';

export default function ContactForm({ sujets }: { sujets: string[] }) {
  const [status, setStatus] = useState<'idle' | 'sending' | 'ok' | 'error'>('idle');
  const [form, setForm] = useState({ nom: '', societe: '', email: '', telephone: '', sujet: '', message: '', consent: false });

  const set = (k: string, v: any) => setForm({ ...form, [k]: v });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.consent) return;
    setStatus('sending');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      setStatus(res.ok ? 'ok' : 'error');
    } catch { setStatus('error'); }
  }

  const inp = { width: '100%', padding: '13px 15px', border: '1px solid var(--line)', borderRadius: 9, fontFamily: 'inherit', fontSize: 15 } as const;
  const lbl = { display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--deep)', marginBottom: 8 } as const;

  if (status === 'ok') return <div style={{ background: 'var(--paper-2)', padding: 40, borderRadius: 16, textAlign: 'center' }}><h2 style={{ color: 'var(--deep)' }}>Merci pour votre message.</h2><p style={{ color: 'var(--grey)', marginTop: 10 }}>L'équipe PULZ vous répondra sous 48 heures ouvrées.</p></div>;

  return (
    <form onSubmit={submit} style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: 16, padding: '38px 40px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginBottom: 20 }}>
        <div><label style={lbl}>Nom *</label><input style={inp} required value={form.nom} onChange={e => set('nom', e.target.value)} /></div>
        <div><label style={lbl}>Société</label><input style={inp} value={form.societe} onChange={e => set('societe', e.target.value)} /></div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginBottom: 20 }}>
        <div><label style={lbl}>E-mail *</label><input style={inp} type="email" required value={form.email} onChange={e => set('email', e.target.value)} /></div>
        <div><label style={lbl}>Téléphone</label><input style={inp} value={form.telephone} onChange={e => set('telephone', e.target.value)} /></div>
      </div>
      <div style={{ marginBottom: 20 }}>
        <label style={lbl}>Sujet *</label>
        <select style={inp} required value={form.sujet} onChange={e => set('sujet', e.target.value)}>
          <option value="">Choisissez un sujet…</option>
          {sujets.map(s => <option key={s}>{s}</option>)}
        </select>
      </div>
      <div style={{ marginBottom: 24 }}>
        <label style={lbl}>Votre message *</label>
        <textarea style={{ ...inp, minHeight: 140, resize: 'vertical' }} required value={form.message} onChange={e => set('message', e.target.value)} />
      </div>
      <label style={{ display: 'flex', gap: 11, alignItems: 'flex-start', marginBottom: 24, fontSize: 12.5, color: 'var(--grey)' }}>
        <input type="checkbox" checked={form.consent} onChange={e => set('consent', e.target.checked)} style={{ marginTop: 2 }} />
        J'accepte que ces informations soient utilisées pour me recontacter. Elles ne seront ni cédées ni revendues.
      </label>
      <button type="submit" disabled={status === 'sending'} style={{ background: 'var(--blue)', color: '#fff', fontWeight: 700, fontSize: 15, padding: '15px 34px', border: 'none', borderRadius: 9, cursor: 'pointer' }}>
        {status === 'sending' ? 'Envoi…' : 'Envoyer ma demande'}
      </button>
      {status === 'error' && <p style={{ color: '#C0392B', marginTop: 14, fontSize: 14 }}>Une erreur est survenue. Réessayez ou écrivez-nous directement.</p>}
    </form>
  );
}
