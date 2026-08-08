import type { SocieteContent } from './types';
import { metiers } from './gradient.metiers';

// Contenu fixe de la page GRADIENT (repris de pulz-gradient.html).
export const gradient: SocieteContent = {
  slug: 'gradient',

  eyebrow: 'Voiries & Réseaux Divers · Espaces verts',
  titre: "GRADIENT, l'expert des ",
  titreAccent: 'aménagements extérieurs',
  lead:
    "Bureau d'études spécialisé dans les voiries, les réseaux divers et les espaces verts, GRADIENT conçoit et coordonne les aménagements extérieurs de vos projets, de la viabilisation à la livraison.",

  presentationTitre: "L'expertise des aménagements extérieurs et de la viabilisation",
  presentation: [
    "GRADIENT est le bureau d'études du groupement PULZ dédié aux voiries et réseaux divers (VRD) et aux espaces verts. Nous concevons et pilotons les aménagements extérieurs qui rendent vos projets viables, accessibles et durables.",
    "De la gestion des eaux pluviales au dimensionnement des voiries, des réseaux secs aux espaces végétalisés, nous apportons une expertise technique complète sur l'ensemble des lots extérieurs, en cohérence avec le bâti.",
    "Membre du groupement PULZ, GRADIENT travaille main dans la main avec les autres bureaux du groupe pour assurer la cohérence entre le bâtiment et ses aménagements extérieurs, sur l'ensemble des Hauts-de-France.",
  ],

  approcheTitre: 'Des aménagements extérieurs cohérents et durables',
  approcheIntro:
    'De la voirie aux espaces verts, nous concevons des aménagements extérieurs pensés dans leur globalité. Voici les principes qui guident chacune de nos missions.',
  approche: [
    {
      white: true,
      titre: 'Vision globale des extérieurs',
      texte:
        'Voirie, réseaux, éclairage et espaces verts pensés ensemble, en cohérence avec le bâtiment et son usage.',
    },
    {
      titre: "Gestion durable de l'eau",
      texte:
        "Stockage, infiltration et tamponnement des eaux pluviales : nous intégrons la gestion de l'eau au cœur de chaque projet.",
    },
    {
      titre: 'Proximité & réactivité',
      texte:
        "Une équipe implantée dans la MEL, disponible et à l'écoute, qui suit vos chantiers de près en Hauts-de-France.",
    },
  ],

  metiersEyebrow: 'Les métiers de Gradient',
  metiersTitre: 'Voiries, réseaux & espaces verts',
  metiersIntro:
    'Du terrassement aux plantations, GRADIENT couvre l\'ensemble des aménagements extérieurs. Cliquez sur chaque métier pour découvrir le détail de nos prestations.',
  metiersCards: [
    {
      key: 'voirie',
      titre: 'Voirie & terrassement',
      texte: 'Revêtements minéraux et bois, terrassement, déblais/remblais, calcul des pentes, plans de voirie.',
      icon: '<path d="M4 19h16M7 19l3-14M17 19l-3-14M9.5 12h5"/>',
    },
    {
      key: 'humides',
      titre: 'Réseaux humides',
      texte: "Eaux pluviales, assainissement EU/EV/EP, drainage, ouvrages de stockage et d'infiltration.",
      icon: '<path d="M12 3s6 7 6 11a6 6 0 0 1-12 0c0-4 6-11 6-11z"/>',
    },
    {
      key: 'secs',
      titre: 'Réseaux secs & éclairage',
      texte: 'Réseaux CFO, CFA, fibre optique, éclairage extérieur et bornes de recharge IRVE.',
      icon: '<path d="M13 2L4.5 12.5a1 1 0 0 0 .8 1.6H11l-1 7.9 8.5-11.9a1 1 0 0 0-.8-1.6H12l1-6.4z"/>',
    },
    {
      key: 'verts',
      titre: 'Espaces verts & aménagement',
      texte: 'Espaces végétalisés, plantations, mobilier urbain, clôtures et aménagements extérieurs.',
      icon: '<path d="M12 22c5-3 8-7 8-12a8 8 0 0 0-8-4 8 8 0 0 0-8 4c0 5 3 9 8 12zM12 12v10"/>',
    },
  ],
  metiers,

  refsTitre: 'Des aménagements extérieurs variés',
  refsIntro:
    'Lotissements, viabilisations, espaces publics et aménagements paysagers : GRADIENT intervient sur des opérations variées, en neuf comme en réhabilitation.',
  refs: [
    { cat: 'Lotissement · Nord', titre: 'Viabilisation de lotissement', texte: 'Conception VRD complète : voirie, réseaux humides et secs, viabilisation de parcelles constructibles.' },
    { cat: 'Espace public · Lille', titre: 'Aménagement paysager', texte: "Création d'espaces verts, plantations et mobilier urbain pour un espace public de proximité." },
    { cat: 'Tertiaire · MEL', titre: 'Abords & parkings', texte: "Aménagement des abords, parkings, cheminements et gestion des eaux pluviales d'un site tertiaire." },
    { cat: 'Voirie · HDF', titre: 'Réfection de voirie', texte: "Réfection et dimensionnement de voirie, revêtements et calcul des pentes d'écoulement." },
    { cat: 'Réseaux · Nord', titre: 'Gestion des eaux pluviales', texte: "Ouvrages de stockage et d'infiltration pour la gestion durable des eaux pluviales à la parcelle." },
    { cat: 'Aménagement · MEL', titre: 'Espaces verts & IRVE', texte: 'Espaces végétalisés, éclairage extérieur et bornes de recharge pour véhicules électriques.' },
  ],

  ctaTitre: "Un projet d'aménagement extérieur ?",
  ctaTexte:
    'Confiez vos VRD et espaces verts à GRADIENT et au groupement PULZ : nous vous accompagnons de la viabilisation à la livraison.',
};
