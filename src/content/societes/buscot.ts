import type { SocieteContent } from './types';
import { metiers } from './buscot.metiers';

// Contenu fixe de la page BUSCOT ENERGIES (repris de pulz-buscot.html).
// Modifiable directement ici (change ~1-2×/an, non géré depuis l'admin).
export const buscot: SocieteContent = {
  slug: 'buscot',

  eyebrow: "Bureau d'études fluides & électricité",
  titre: 'BUSCOT ENERGIES, expert en ',
  titreAccent: 'énergies du bâtiment',
  lead:
    "Bureau d'études techniques implanté dans la métropole lilloise, BUSCOT ENERGIES conçoit et pilote les lots fluides et électricité de vos projets de construction et de rénovation, partout en Hauts-de-France.",

  presentationTitre: 'Une ingénierie humaine au service de la performance énergétique',
  presentation: [
    "Fondé en 2022 par Sylvain Buscot, ingénieur diplômé de l'ICAM Lille, BUSCOT ENERGIES est un bureau d'études techniques spécialisé dans les énergies du bâtiment. Nous accompagnons maîtres d'ouvrage publics et privés dans la conception, l'optimisation et le suivi de leurs installations de génie électrique et de génie climatique.",
    "Notre approche se veut résolument humaine : un management bienveillant et transversal, des collaborateurs impliqués, et une ingénierie sur mesure pensée pour la singularité de chaque projet et la sensibilité de chaque client. Cette exigence nous permet de conduire vos opérations dans le respect des délais, du budget et de la qualité attendue.",
    "Implantés au cœur de la métropole européenne de Lille, nous intervenons sur l'ensemble des Hauts-de-France, du logement collectif au tertiaire, de l'industrie aux établissements de santé, en lien étroit avec le décret tertiaire et le décret BACS.",
  ],

  approcheTitre: 'Un bureau d\'études qui conçoit, optimise et accompagne',
  approcheIntro:
    "De l'esquisse à la réception des travaux, nous mettons notre expertise technique et réglementaire au service de la réussite de vos projets. Voici les principes qui guident chacune de nos missions.",
  approche: [
    {
      white: true,
      titre: 'Expertise technique',
      texte:
        'Une maîtrise complète du génie électrique, du génie climatique et de la plomberie, appuyée sur des notes de calcul rigoureuses (CANECO, dimensionnement aéraulique et hydraulique).',
    },
    {
      titre: 'Conformité réglementaire',
      texte:
        'Un accompagnement précis sur le décret tertiaire et le décret BACS, pour garantir la mise en conformité de vos bâtiments et le pilotage de leurs consommations.',
    },
    {
      titre: 'Proximité & réactivité',
      texte:
        "Une équipe implantée dans la MEL, disponible et à l'écoute, qui suit vos chantiers de près sur tout le territoire des Hauts-de-France.",
    },
  ],

  metiersTitre: 'Génie électrique, génie climatique & fluides',
  metiersIntro:
    "BUSCOT ENERGIES couvre l'ensemble des lots techniques du bâtiment. Chaque expertise est conduite en conception comme en exécution, avec des solutions adaptées à la performance énergétique de vos ouvrages.",
  metiersCards: [
    {
      key: 'ef',
      titre: 'Électricité courants forts',
      texte:
        'Adduction, transformateurs HT/BT, tableaux, onduleurs, groupe électrogène, éclairages avec notes de calcul CANECO.',
      icon: '<path d="M13 2L4.5 12.5a1 1 0 0 0 .8 1.6H11l-1 7.9 8.5-11.9a1 1 0 0 0-.8-1.6H12l1-6.4z"/>',
    },
    {
      key: 'cf',
      titre: 'Électricité courants faibles',
      texte:
        'GTB et décret BACS, sécurité incendie SSI, VDI, sûreté, interphonie, sonorisation et gestion de parking.',
      icon: '<path d="M5 12.5a7 7 0 0 1 14 0"/><path d="M8 15a4 4 0 0 1 8 0"/><circle cx="12" cy="18" r="1.2"/>',
    },
    {
      key: 'cvc',
      titre: 'Chauffage, ventilation, climatisation',
      texte:
        "Pompe à chaleur, groupe d'eau glacée, réseau de chaleur, froid, CTA, VMC, désenfumage et régulation.",
      icon: '<path d="M9.5 3a2.5 2.5 0 0 0 0 5H12"/><path d="M14 6a2 2 0 1 1 2 2H4"/><path d="M15.5 21a2.5 2.5 0 0 0 0-5H12"/><path d="M13 18a2 2 0 1 0 2-2"/><path d="M4 12h16"/>',
    },
    {
      key: 'plomb',
      titre: 'Plomberie & sanitaire',
      texte:
        "Eau chaude sanitaire, réseaux EF/ECS, assainissement, traitement d'eau, désembouage, fluides spéciaux et gaz médicaux.",
      icon: '<path d="M7 3v5a3 3 0 0 0 3 3h1v10"/><path d="M7 6h4"/><path d="M14 8h3a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-3"/>',
    },
    {
      key: 'enr',
      titre: 'Énergies renouvelables',
      texte:
        'Photovoltaïque, solaire thermique et géothermie pour la performance énergétique de vos bâtiments.',
      icon: '<circle cx="12" cy="12" r="3.5"/><path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8"/>',
    },
    {
      key: 'reg',
      titre: 'Conformité & pilotage',
      texte: 'Décret tertiaire, décret BACS, audit énergétique, suivi et pilotage des consommations.',
      icon: '<path d="M4 5a2 2 0 0 1 2-2h9l5 5v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z"/><path d="M14 3v5h5"/><path d="M9 14l2 2 4-4"/>',
    },
  ],
  metiers,

  refsTitre: 'Des projets fluides & électricité à forte exigence',
  refsIntro:
    "Banque de France, EDF, Decathlon, Dalkia : nous intervenons sur des opérations variées, du tertiaire sensible à l'industrie, en passant par les établissements de santé.",
  refs: [
    { cat: 'Tertiaire · Lille', titre: 'Banque de France', texte: 'Réhabilitation et rénovation des espaces tertiaires de la succursale rue Royale, en site occupé.' },
    { cat: 'Industrie · Chooz', titre: 'EDF — Centrale nucléaire', texte: 'Réhabilitation du bâtiment SUC Les Chênes au sein du CNPE de Chooz, en zone protégée (ZPR).' },
    { cat: 'Restauration · Saint-André', titre: 'Dalkia — RIE', texte: 'Conception des lots techniques du restaurant inter-entreprises de Dalkia.' },
    { cat: "GTB · Villeneuve d'Ascq", titre: 'Decathlon Campus', texte: 'Refonte complète du système de gestion technique du bâtiment du siège.' },
    { cat: 'Santé · Ronchin', titre: 'EHPAD de Ronchin', texte: "Mise en œuvre d'un système de rafraîchissement adapté aux résidents." },
    { cat: 'Santé · Lille', titre: 'Hôpital Saint Vincent', texte: "Création d'un local scanner et de l'ensemble de ses installations techniques." },
  ],

  ctaTitre: 'Un projet fluides ou électricité ?',
  ctaTexte:
    'Contactez BUSCOT ENERGIES et le groupement PULZ pour étudier votre besoin et construire ensemble la solution la plus adaptée.',
};
