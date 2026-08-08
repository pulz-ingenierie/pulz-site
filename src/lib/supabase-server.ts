// Client Supabase côté serveur (pages publiques, génération, API)
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { supabaseUrl } from './supabase-url';

export function createClient() {
  const cookieStore = cookies();
  return createServerClient(
    supabaseUrl(),
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll(list: { name: string; value: string; options?: any }[]) {
          try { list.forEach(({ name, value, options }) => cookieStore.set(name, value, options)); }
          catch { /* appelé depuis un Server Component : ignore */ }
        },
      },
    }
  );
}

// Client "admin" à privilèges élevés (service role) — SERVEUR UNIQUEMENT
import { createClient as createAdminSb } from '@supabase/supabase-js';
export function createAdminClient() {
  return createAdminSb(
    supabaseUrl(),
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}
