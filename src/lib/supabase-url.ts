// Normalise NEXT_PUBLIC_SUPABASE_URL vers l'URL PROJET attendue par supabase-js
// et par le Storage. Tolère qu'on ait collé l'URL REST (.../rest/v1/) : on la nettoie.
//   https://xxxx.supabase.co/rest/v1/  ->  https://xxxx.supabase.co
export function supabaseUrl(): string {
  let u = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? '').trim();
  u = u.replace(/\/+$/, '');            // slash(es) final(aux)
  u = u.replace(/\/rest\/v1$/, '');     // segment REST en trop
  u = u.replace(/\/+$/, '');            // au cas où
  return u;
}

// URL publique de base du bucket Storage "photos".
export function storageBase(bucket = 'photos'): string {
  return `${supabaseUrl()}/storage/v1/object/public/${bucket}`;
}
