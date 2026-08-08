// Contenu fixe de la page d'accueil (repris de pulz-home.html).
// Les compteurs (statistiques) et les références viennent de la base ;
// le reste est éditable ici.

export type SvcCard = { key: string; titre: string; texte: string; icon: string };

export const HERO = {
  eyebrow: "Groupement de maîtres d'œuvre · Hauts-de-France",
  titre: 'Le groupe de maîtres d\'œuvre de ',
  titreAccent: 'toutes vos réussites.',
  sub: "Quatre bureaux d'études indépendants et solidaires, réunis pour porter vos projets de construction et de rénovation — de la conception technique au suivi de l'exécution.",
  sig: "« La force du groupe, l'agilité de l'individu. »",
};

export const BRIEF = {
  eyebrow: 'Le groupe en bref',
  titre: "Un groupement de maîtres d'œuvre indépendants et solidaires",
  texte:
    "PULZ embarque toutes les expertises du bâtiment dans un groupement de maîtres d'œuvre partageant des valeurs fortes et communes, centré sur l'expression du potentiel humain. De la conception technique au suivi de l'exécution, nous conduisons vos projets dans le respect des délais, du budget et de la qualité.",
};

// Repli si la table `statistiques` est vide / non migrée.
export const STATS_FALLBACK = [
  { valeur: 6, suffixe: '', label: 'Collaborateurs' },
  { valeur: 1.4, suffixe: '', label: "Chiffre d'affaires en M€ HT" },
  { valeur: 129, suffixe: '', label: 'Projets menés' },
  { valeur: 12, suffixe: '', label: 'Expertises métier' },
];

export const LOGOBAND = {
  eyebrow: "Assembleur d'avenir",
  quote:
    "Chaque collaborateur, chaque client, chaque partenaire est une pièce essentielle d'un puzzle plus vaste — conçu pour inspirer et rayonner.",
};

export const SOCS = [
  { slug: 'buscot', nom: 'BUSCOT ENERGIES', role: 'Fluides & Électricité', texte: "Bureau d'études technique expert en énergies du bâtiment. Accompagnement décret Tertiaire et décret BACS, pilotage des consommations." },
  { slug: 'arteix', nom: 'ARTEIX INGÉNIERIE', role: 'Généraliste & Structure', texte: "Maîtrise d'œuvre et économie de la construction. Sécurisation des coûts, optimisation des DCE, suivi VISA / DET / OPC." },
  { slug: 'therac', nom: 'THERAC', role: 'Thermique & Environnement', texte: 'Génie thermique, bas carbone et génie environnemental. Implanté dans la MEL, actif en Hauts-de-France et Île-de-France.' },
  { slug: 'gradient', nom: 'GRADIENT', role: 'VRD & Espaces Verts', texte: 'Conception et gestion des infrastructures de voirie, réseaux divers et aménagements paysagers, sur mesure.' },
];

export const SERVICES_CARDS: SvcCard[] = [
  { key: 'conception', titre: 'Conception', texte: 'Expression du besoin, choix des solutions techniques, pièces marchés, budgétisation, planning.', icon: '<path d="M3 21h18M5 21V7l7-4 7 4v14M9 9h2M9 13h2M13 9h2M13 13h2M9 21v-4h6v4"/>' },
  { key: 'execution', titre: 'Exécution', texte: 'Suivi de chantier, pilotage des entreprises. Respect du programme en qualité, coûts et délais.', icon: '<path d="M4 20h16M6 20V10l6-5 6 5v10M2 10l10-7 10 7"/><circle cx="12" cy="13" r="2"/>' },
  { key: 'opc', titre: 'OPC', texte: 'Organisation, planification et coordination des entreprises.', icon: '<rect x="3" y="4" width="18" height="16" rx="1"/><path d="M3 9h18M8 4v16M12 13l2 2 3-3"/>' },
  { key: 'audit', titre: 'Audit énergétique', texte: 'Leviers de performance et actions correctives en lien avec le décret tertiaire.', icon: '<path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z"/>' },
  { key: 'optimisation', titre: 'Optimisation', texte: 'Solutions techniques pour réduire les coûts travaux et valoriser le prix de vente.', icon: '<path d="M3 17l6-6 4 4 8-8M14 7h7v7"/>' },
  { key: 'faisabilite', titre: 'Faisabilité', texte: "Possibilités techniques et économiques en vue d'une décision éclairée.", icon: '<path d="M9 11l3 3 8-8M20 12v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h9"/>' },
  { key: 'diagnostic', titre: 'Diagnostic technique', texte: "Évaluation de l'état des installations, points de vigilance, recommandations.", icon: '<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3M8 11h6M11 8v6"/>' },
  { key: 'amo', titre: 'Assistance MOA', texte: 'Expertise, conseil et support technique garantissant le succès du projet.', icon: '<path d="M12 2a5 5 0 0 0-5 5c0 2 1 3 2 4v3h6v-3c1-1 2-2 2-4a5 5 0 0 0-5-5zM9 20h6M10 22h4"/>' },
];

// Références d'exemple affichées tant qu'aucune référence n'est publiée en base.
export const REFS_FALLBACK = [
  { tag: 'Tertiaire · Lille', titre: 'Banque de France', texte: 'Réhabilitation et rénovation des espaces tertiaires de la succursale.' },
  { tag: 'Sport · Paris', titre: 'Roland Garros', texte: 'Extension des tribunes Est et Ouest, +1 000 places de jauge.' },
  { tag: 'Industrie · Chooz', titre: 'EDF — Centrale nucléaire', texte: 'Réhabilitation du bâtiment SUC Les Chênes au sein du CNPE, en ZPR.' },
  { tag: "GTB · Villeneuve d'Ascq", titre: 'Decathlon Campus', texte: 'Refonte du système de gestion technique du bâtiment.' },
  { tag: 'Restauration · Saint-André', titre: 'Dalkia — RIE', texte: "Aménagement du restaurant d'entreprise." },
  { tag: 'Logement · Bertincourt', titre: '40 logements intergénérationnels', texte: 'Construction neuve sur la commune de Bertincourt.' },
];

export const CLIENTS = [
  'Banque de France', 'EDF', 'SNCF Immo', 'Fédération Française de Tennis', 'Decathlon', 'Dalkia',
  'Amazon', 'Bouygues Immobilier', 'Nexity', 'Marignan', 'Nacarat', 'Réalités',
];
