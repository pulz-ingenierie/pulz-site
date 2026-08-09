// Client Supabase PUBLIC — lecture seule, SANS cookies.
//  Utilisé par les pages publiques (accueil, groupe, références, actualités,
//  membres, contact) et le Footer. Comme il ne lit pas cookies(), les pages
//  restent en rendu STATIQUE (ISR via `export const revalidate`), donc servies
//  depuis le cache : navigation quasi instantanée, Supabase interrogé seulement
//  lors de la revalidation en arrière-plan.
//  ⚠️ À NE PAS utiliser pour l'admin (qui a besoin de la session via cookies).
import { createClient as createSb } from '@supabase/supabase-js';
import { supabaseUrl } from './supabase-url';

export function createPublicClient() {
  return createSb(supabaseUrl(), process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
