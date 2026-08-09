// ============================================================
//  CATALOGUE D'IMAGES — pointe vers Supabase Storage (bucket public "photos")
//  Ne JAMAIS mettre d'images en base64 dans le code : tout passe par ici.
//
//  - IMG      : images "fixes" du site (logos, symbole, photos d'équipe)
//  - photoUrl : helper pour construire l'URL d'une photo dynamique
//               (références / actualités gérées depuis l'admin)
// ============================================================

// Base publique du bucket "photos" sur Supabase Storage.
// Exemple : https://xxxx.supabase.co/storage/v1/object/public/photos
// (URL normalisée : tolère un NEXT_PUBLIC_SUPABASE_URL en .../rest/v1)
import { storageBase } from './supabase-url';
const BASE = storageBase('photos');

/**
 * Construit l'URL publique d'une photo stockée dans le bucket.
 * @param dossier  sous-dossier du bucket ('logos' | 'equipe' | 'references' | 'chantiers' | 'actus')
 * @param nom      nom du fichier ('sylvain.jpg', 'ref-1.jpg'...)
 */
export function photoUrl(dossier: string, nom: string): string {
  return `${BASE}/${dossier}/${encodeURIComponent(nom)}`;
}

const equipe = (prenom: string) => photoUrl('equipe', `${prenom}.jpg`);

// Catalogue des images fixes.
export const IMG = {
  // Logos & symbole du groupe
  logo: photoUrl('logos', 'pulz.png'),               // logo horizontal fond clair
  logoColor: photoUrl('logos', 'pulz-color.png'),    // logo couleur
  logoDetoure: photoUrl('logos', 'pulz-detoure.png'),// logo détouré (fond foncé)
  pulzSymbol: photoUrl('logos', 'pulz-symbol.png'),  // symbole « P » (lévitation /groupe)

  // Photo d'équipe du bandeau d'accueil
  homeEquipe: photoUrl('home', 'pulz-equipe.jpg'),

  // Fond vidéo du hero de la page Groupe (+ poster de repli)
  groupeHeroVideo: photoUrl('home', 'pulz-hero-v7.mp4'),
  groupeHeroPoster: photoUrl('home', 'poster-v7.jpg'),

  // Logos des 4 sociétés (version bloc)
  societes: {
    buscot: photoUrl('logos', 'buscot.png'),
    arteix: photoUrl('logos', 'arteix.png'),
    gradient: photoUrl('logos', 'gradient.svg'),
    therac: photoUrl('logos', 'therac.png'),
  } as Record<string, string>,

  // Logos "membre" (badges carrés pour les cartes société)
  membres: {
    buscot: photoUrl('logos', 'member-buscot.png'),
    arteix: photoUrl('logos', 'member-arteix.png'),
    gradient: photoUrl('logos', 'member-gradient.png'),
    therac: photoUrl('logos', 'member-therac.png'),
  } as Record<string, string>,

  // Photos de l'équipe (volets CV), clé = prénom en minuscules
  equipe: {
    sylvain: equipe('sylvain'),
    maxence: equipe('maxence'),
    duncan: equipe('duncan'),
    charlotte: equipe('charlotte'),
    florian: equipe('florian'),
    alexis: equipe('alexis'),
    guillaume: equipe('guillaume'),
    damien: equipe('damien'),
    noann: equipe('noann'),
  } as Record<string, string>,

  // Logos clients
  clients: {
    banqueDeFrance: photoUrl('logos', 'client-banque-de-france.png'),
  } as Record<string, string>,
};

// Photos « casque » (visuel de présentation par société), dans logos/.
// Noms de fichiers tels quels dans Supabase (espaces / casse variables).
const CASQUE: Record<string, string> = {
  buscot: 'Casque buscot.png',
  arteix: 'casque arteix.png',
  gradient: 'casque gradient.png',
  therac: 'casque therac.png',
};
export function casquePhoto(slug?: string | null): string | undefined {
  if (!slug) return undefined;
  const f = CASQUE[slug.toLowerCase()];
  return f ? photoUrl('logos', f) : undefined;
}

/** Photo d'un membre à partir de son slug (prénom), avec repli undefined. */
export function membrePhoto(slug?: string | null): string | undefined {
  if (!slug) return undefined;
  return IMG.equipe[slug.toLowerCase()];
}

/** Logo bloc d'une société à partir de son slug. */
export function societeLogo(slug?: string | null): string | undefined {
  if (!slug) return undefined;
  return IMG.membres[slug.toLowerCase()] ?? IMG.societes[slug.toLowerCase()];
}

// Dégradé neutre affiché en repli quand une photo dynamique est absente.
export const FALLBACK_GRADIENT = 'linear-gradient(135deg,var(--blue),var(--deep))';
