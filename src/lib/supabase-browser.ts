// Client Supabase côté navigateur (composants clients, admin)
import { createBrowserClient } from '@supabase/ssr';
import { supabaseUrl } from './supabase-url';

export function createClient() {
  return createBrowserClient(
    supabaseUrl(),
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
