import type { SocieteContent } from './types';
import { metiers } from './therac.metiers';

// Contenu fixe de la page THERAC (repris de pulz-therac.html).
export const therac: SocieteContent = {
  slug: 'therac',

  eyebrow: 'Bureau d\'études thermique & environnement',
  titre: 'THERAC, bureau d\'études & AMO ',
  titreAccent: 'environnement',
  lead:
    "Bureau d'études technique expert de l'environnement et du génie thermique, THERAC vous accompagne dans la performance énergétique et environnementale de vos projets, en Hauts-de-France et Île-de-France.",

  presentationTitre: 'Une ingénierie environnementale efficace et pragmatique',
  presentation: [
    "THERAC est né de la réflexion de plusieurs professionnels réunis autour de valeurs communes — honnêteté, efficacité, professionnalisme — et d'une volonté de relever les défis environnementaux actuels. Bureau d'études technique implanté dans la MEL, nous proposons des solutions efficaces et pragmatiques pour chaque projet.",
    "Notre souhait est de faire évoluer le métier de bureau d'études au-delà de son intervention actuelle, en cherchant des solutions techniques toujours plus efficaces, loin des modes constructifs génériques. Nous privilégions une relation de partenariat gagnant-gagnant plutôt que client-fournisseur.",
    "L'équipe intervient dans les domaines du génie thermique, bas carbone et du génie environnemental, avec des solutions personnalisées. Un management bienveillant et transversal, où les collaborateurs sont valorisés, au service d'une ingénierie adaptée à la singularité de chaque projet.",
  ],

  approcheTitre: "Relever les défis environnementaux d'aujourd'hui",
  approcheIntro: 'Trois valeurs guident chacune de nos missions et notre relation avec nos clients et partenaires.',
  approche: [
    {
      white: true,
      titre: 'Honnêteté',
      texte:
        'Une relation de partenariat transparente, fondée sur la confiance, où nous privilégions le conseil juste plutôt que la solution de facilité.',
    },
    {
      titre: 'Efficacité',
      texte:
        'Des solutions techniques pragmatiques et performantes, pensées pour la réalité de chaque projet, loin des modes constructifs génériques.',
    },
    {
      titre: 'Professionnalisme',
      texte:
        'Une expertise pointue en thermique et environnement, portée par des collaborateurs valorisés et impliqués dans chaque mission.',
    },
  ],

  metiersEyebrow: 'Les métiers de Therac',
  metiersTitre: 'Thermique, environnement & économie circulaire',
  metiersIntro:
    'Du calcul réglementaire au réemploi des matériaux, THERAC couvre l\'ensemble des enjeux environnementaux du bâtiment. Cliquez sur chaque métier pour découvrir le détail de nos prestations.',
  metiersCards: [
    {
      key: 'thermique',
      titre: 'Thermique',
      texte: 'Calculs réglementaires RT/RE 2020, STD, SED, ACV, audits énergétiques et calculs biosourcés.',
      icon: '<path d="M12 3v10.5M12 3a2.5 2.5 0 0 1 2.5 2.5v8a4 4 0 1 1-5 0v-8A2.5 2.5 0 0 1 12 3z"/><circle cx="12" cy="17" r="2"/>',
    },
    {
      key: 'environnement',
      titre: 'Environnement',
      texte: 'Certifications Prestaterre, Cerqual NF Habitat, Lille Bas Carbone, biodiversité et diagnostic PEMD.',
      icon: '<path d="M12 22c5-3 8-7 8-12a8 8 0 0 0-8-4 8 8 0 0 0-8 4c0 5 3 9 8 12zM12 10v12"/>',
    },
    {
      key: 'circulaire',
      titre: 'Économie circulaire',
      texte: 'Diagnostic PEMD, AMO réemploi, accompagnement déconstruction et mobilisation des filières.',
      icon: '<path d="M4 12a8 8 0 0 1 13-6.2L20 8M20 3v5h-5M20 12a8 8 0 0 1-13 6.2L4 16M4 21v-5h5"/>',
    },
  ],
  metiers,

  refsTitre: 'Des projets variés, du logement au tertiaire',
  refsIntro:
    'Logement, bâtiments tertiaires, réhabilitations patrimoniales : THERAC intervient sur des opérations variées, en neuf comme en rénovation.',
  refs: [
    { cat: 'Logement · Bertincourt', titre: '40 logements intergénérationnels', texte: 'Construction de 40 logements intergénérationnels (Tisserin et Maisons de Marianne).' },
    { cat: 'Logement · Béthune', titre: 'Optimisation 60 logements', texte: "Optimisation d'un dossier de 60 logements en R+5 pour le compte de Réalités." },
    { cat: 'Logement · Emmerin', titre: '50 logements RT2012 BEE+', texte: 'Construction de 50 logements en deux bâtiments, certifiés RT2012 BEE+.' },
    { cat: 'Réhabilitation · Hem', titre: 'Château de la Roseraie', texte: "Réhabilitation lourde d'un château en 20 logements collectifs." },
    { cat: 'Tertiaire · Lille', titre: 'Agence Marignan', texte: "Rénovation et agencement de l'agence Marignan Immobilier à Lille." },
    { cat: 'Formation · Wasquehal', titre: 'Château Blanc CFTL', texte: 'Réhabilitation d\'un bâtiment de bureaux en centre de formation (AFTRAL, ISTELI).' },
  ],

  ctaTitre: 'Un projet à forte ambition environnementale ?',
  ctaTexte:
    'Confiez votre étude thermique et environnementale à THERAC et au groupement PULZ : nous vous accompagnons vers des bâtiments performants et durables.',
};
