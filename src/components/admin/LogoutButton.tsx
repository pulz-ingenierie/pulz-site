'use client';

import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase-browser';

export default function LogoutButton() {
  const router = useRouter();
  async function logout() {
    await createClient().auth.signOut();
    router.push('/admin/login');
    router.refresh();
  }
  return (
    <button className="abtn ghost" onClick={logout} type="button">
      Déconnexion
    </button>
  );
}
