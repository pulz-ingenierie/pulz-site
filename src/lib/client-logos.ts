// Bibliothèque centrale des logos clients = dossier Supabase photos/clients/.
//  Source unique pour : la bande défilante de la home, la grille de la page Groupe,
//  et le sélecteur de logo dans le formulaire de référence.
//  `url` est l'URL PROPRE (sans ?v) — à stocker en base ; au rendu on ajoute
//  ?v=ver (date de modif) pour forcer le rechargement après remplacement d'un fichier.
import { photoUrl } from './images';

export type ClientLogo = { name: string; url: string; alt: string; ver: number };

function toAlt(name: string): string {
  return name.replace(/\.[^.]+$/, '').replace(/^\d+[_-]?/, '').replace(/[-_]+/g, ' ').trim();
}

/** Liste les logos clients (triés alpha) depuis photos/clients/. `sb` = client Supabase (public ou navigateur). */
export async function listClientLogos(sb: any): Promise<ClientLogo[]> {
  const { data } = await sb.storage
    .from('photos')
    .list('clients', { limit: 500, sortBy: { column: 'name', order: 'asc' } });
  return (data ?? [])
    .filter((f: any) => /\.(png|jpe?g|svg|webp|avif)$/i.test(f.name))
    .map((f: any) => ({
      name: f.name,
      url: photoUrl('clients', f.name),
      alt: toAlt(f.name),
      ver: f.updated_at ? Date.parse(f.updated_at) : 0,
    }));
}

/** URL d'affichage avec cache-bust (pour les grilles/bandes). */
export function busted(logo: ClientLogo): string {
  return logo.ver ? `${logo.url}?v=${logo.ver}` : logo.url;
}
