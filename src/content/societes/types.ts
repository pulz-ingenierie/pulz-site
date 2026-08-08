// Types du contenu "fixe" (via code) des pages société.

export type MetierItem = { t: string; p: string };
export type Metier = { titre: string; intro: string; items: MetierItem[] };

export type ApprocheCard = { titre: string; texte: string; white?: boolean };
export type SvcCard = { key: string; titre: string; texte: string; icon: string };
export type RefCard = { cat: string; titre: string; texte: string };

export type SocieteContent = {
  slug: string;
  // Hero
  eyebrow: string;        // ex. "Bureau d'études fluides & électricité"
  titre: string;          // ex. "BUSCOT ENERGIES, expert en "
  titreAccent: string;    // mot(s) en relief, ex. "énergies du bâtiment"
  titreSuffix?: string;   // texte après l'accent, ex. " du bâtiment"
  lead: string;
  // Présentation
  presentationTitre: string;
  presentation: string[]; // paragraphes
  // Approche
  approcheTitre: string;
  approcheIntro: string;
  approche: ApprocheCard[];
  // Métiers
  metiersEyebrow?: string; // ex. "Les métiers de Gradient" (défaut : "Nos métiers")
  metiersTitre: string;
  metiersIntro: string;
  metiersCards: SvcCard[];       // vignettes cliquables (icône SVG path + libellé)
  metiers: Record<string, Metier>; // détail ouvert dans le volet latéral
  // Références (exemples fixes de la société)
  refsTitre: string;
  refsIntro: string;
  refs: RefCard[];
  // CTA
  ctaTitre: string;
  ctaTexte: string;
};
