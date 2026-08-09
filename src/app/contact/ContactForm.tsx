'use client';
import { useState } from 'react';

export default function ContactForm({ sujets, blue = false }: { sujets: string[]; blue?: boolean }) {
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

  // Champs toujours clairs (lisibles) ; le reste s'adapte au thème bleu.
  const inp = { width: '100%', padding: '13px 15px', border: '1px solid var(--line)', borderRadius: 9, fontFamily: 'inherit', fontSize: 15, background: '#fff', color: 'var(--deep)' } as const;
  const onFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(0,169,224,.20)'; };
  const onBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => { e.currentTarget.style.borderColor = 'var(--line)'; e.currentTarget.style.boxShadow = 'none'; };
  const lbl = { display: 'block', fontSize: 13, fontWeight: 700, color: blue ? '#EAF2FB' : 'var(--deep)', marginBottom: 8 } as const;

  const cardStyle = blue
    ? { background: 'linear-gradient(160deg,#0F2E52 0%,var(--deep) 100%)', border: '1px solid rgba(255,255,255,.12)', borderRadius: 16, boxShadow: '0 26px 60px rgba(10,37,64,.28)' }
    : { background: '#fff', border: '1px solid var(--line)', borderRadius: 16, boxShadow: '0 18px 50px rgba(10,37,64,.10)' };

  if (status === 'ok') return <div style={{ background: blue ? 'var(--deep)' : 'var(--paper-2)', padding: 40, borderRadius: 16, textAlign: 'center' }}><h2 style={{ color: blue ? '#fff' : 'var(--deep)' }}>Merci pour votre message.</h2><p style={{ color: blue ? '#B8CEE4' : 'var(--grey)', marginTop: 10 }}>L'équipe PULZ vous répondra sous 48 heures ouvrées.</p></div>;

  return (
    <form onSubmit={submit} className="cform" style={cardStyle}>
      <div className="cf-row">
        <div><label style={lbl}>Nom *</label><input style={inp} onFocus={onFocus} onBlur={onBlur} required value={form.nom} onChange={e => set('nom', e.target.value)} /></div>
        <div><label style={lbl}>Société</label><input style={inp} onFocus={onFocus} onBlur={onBlur} value={form.societe} onChange={e => set('societe', e.target.value)} /></div>
      </div>
      <div className="cf-row">
        <div><label style={lbl}>E-mail *</label><input style={inp} onFocus={onFocus} onBlur={onBlur} type="email" required value={form.email} onChange={e => set('email', e.target.value)} /></div>
        <div><label style={lbl}>Téléphone</label><input style={inp} onFocus={onFocus} onBlur={onBlur} value={form.telephone} onChange={e => set('telephone', e.target.value)} /></div>
      </div>
      <div style={{ marginBottom: 20 }}>
        <label style={lbl}>Sujet *</label>
        <select style={inp} onFocus={onFocus} onBlur={onBlur} required value={form.sujet} onChange={e => set('sujet', e.target.value)}>
          <option value="">Choisissez un sujet…</option>
          {sujets.map(s => <option key={s}>{s}</option>)}
        </select>
      </div>
      <div style={{ marginBottom: 24 }}>
        <label style={lbl}>Votre message *</label>
        <textarea style={{ ...inp, minHeight: 140, resize: 'vertical' }} onFocus={onFocus} onBlur={onBlur} required value={form.message} onChange={e => set('message', e.target.value)} />
      </div>
      <label style={{ display: 'flex', gap: 11, alignItems: 'flex-start', marginBottom: 24, fontSize: 12.5, color: blue ? '#B8CEE4' : 'var(--grey)' }}>
        <input type="checkbox" checked={form.consent} onChange={e => set('consent', e.target.checked)} style={{ marginTop: 2, flexShrink: 0, width: 16, height: 16 }} />
        J'accepte que ces informations soient utilisées pour me recontacter. Elles ne seront ni cédées ni revendues.
      </label>
      <button type="submit" disabled={status === 'sending'} style={{ background: blue ? 'var(--accent)' : 'var(--blue)', color: '#fff', fontWeight: 700, fontSize: 15, padding: '15px 34px', border: 'none', borderRadius: 9, cursor: 'pointer' }}>
        {status === 'sending' ? 'Envoi…' : 'Envoyer ma demande'}
      </button>
      {status === 'error' && <p style={{ color: blue ? '#FFB4A8' : '#C0392B', marginTop: 14, fontSize: 14 }}>Une erreur est survenue. Réessayez ou écrivez-nous directement.</p>}
    </form>
  );
}
