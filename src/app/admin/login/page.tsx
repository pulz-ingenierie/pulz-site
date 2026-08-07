'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase-browser';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr('');
    const sb = createClient();
    const { error } = await sb.auth.signInWithPassword({ email, password });
    if (error) setErr('Identifiants incorrects');
    else router.push('/admin');
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--paper-2)' }}>
      <form onSubmit={submit} style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: 16, padding: '40px 44px', width: 400 }}>
        <div style={{ fontWeight: 900, fontSize: 24, color: 'var(--deep)', marginBottom: 4 }}>PULZ</div>
        <div style={{ fontSize: 13, color: 'var(--grey-lt)', marginBottom: 28 }}>Administration</div>
        <label style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 8 }}>E-mail</label>
        <input value={email} onChange={e => setEmail(e.target.value)} type="email" required style={{ width: '100%', padding: '12px 14px', border: '1px solid var(--line)', borderRadius: 9, marginBottom: 18 }} />
        <label style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 8 }}>Mot de passe</label>
        <input value={password} onChange={e => setPassword(e.target.value)} type="password" required style={{ width: '100%', padding: '12px 14px', border: '1px solid var(--line)', borderRadius: 9, marginBottom: 24 }} />
        {err && <p style={{ color: '#C0392B', fontSize: 13, marginBottom: 16 }}>{err}</p>}
        <button type="submit" style={{ width: '100%', background: 'var(--blue)', color: '#fff', fontWeight: 700, padding: '13px', border: 'none', borderRadius: 9, cursor: 'pointer' }}>Se connecter</button>
      </form>
    </div>
  );
}
