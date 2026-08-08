import type { SocieteContent } from './types';
import { metiers } from './arteix.metiers';

// Contenu fixe de la page ARTEIX Ingénierie (repris de pulz-arteix.html).
export const arteix: SocieteContent = {
  slug: 'arteix',

  eyebrow: "Maîtrise d'œuvre & ingénierie du bâtiment",
  titre: 'ARTEIX Ingénierie, votre ',
  titreAccent: "maître d'œuvre",
  titreSuffix: ' du bâtiment',
  lead:
    "Bureau d'études techniques implanté dans la métropole lilloise, ARTEIX vous accompagne dans la conception et l'exécution de vos projets de bâtiment, de la faisabilité à la livraison, en Hauts-de-France et Île-de-France.",

  presentationTitre: "Une maîtrise d'œuvre exigeante, du diagnostic à la livraison",
  presentation: [
    "ARTEIX Ingénierie est un bureau d'études techniques et de maîtrise d'œuvre implanté dans le secteur de la métropole européenne de Lille, expert dans le domaine du bâtiment. Nous accompagnons maîtres d'ouvrage publics et privés dans la bonne réalisation de leurs projets, de la conception à l'exécution.",
    "Nous avons à cœur d'accompagner nos clients et partenaires dans leurs projets en leur partageant notre savoir-faire, nos valeurs et nos compétences. Cette exigence nous permet de conduire vos opérations dans le respect des délais, du budget et de la qualité attendue.",
    "Nous intervenons sur l'ensemble des Hauts-de-France et d'Île-de-France, du logement au tertiaire, en passant par les équipements publics et les établissements de santé. Membre du groupement PULZ, nous mobilisons quand il le faut l'ensemble des expertises du groupe.",
  ],

  approcheTitre: "Une maîtrise d'œuvre globale, tous corps d'état",
  approcheIntro:
    "Du clos couvert aux corps d'état techniques, nous concevons et coordonnons l'ensemble des lots de votre projet. Voici les principes qui guident chacune de nos missions.",
  approche: [
    {
      white: true,
      titre: 'Vision tous corps d\'état',
      texte:
        "Une maîtrise d'œuvre généraliste qui pense le bâtiment dans sa globalité : structure, clos couvert, second œuvre et corps d'états techniques, dans une cohérence d'ensemble.",
    },
    {
      titre: 'Maîtrise des coûts et des délais',
      texte:
        'Du diagnostic à la réception, nous sécurisons vos enveloppes budgétaires, optimisons les solutions techniques et pilotons le planning pour tenir vos engagements.',
    },
    {
      titre: 'Proximité & réactivité',
      texte:
        "Une équipe implantée dans la MEL, disponible et à l'écoute, qui suit vos chantiers de près en Hauts-de-France et Île-de-France.",
    },
  ],

  metiersEyebrow: "Les métiers d'Arteix Ingénierie",
  metiersTitre: "Une expertise sur l'ensemble du bâtiment",
  metiersIntro:
    "Du clos couvert aux réseaux extérieurs, ARTEIX couvre l'ensemble des corps d'état de votre projet. Cliquez sur chaque métier pour découvrir le détail de nos prestations.",
  metiersCards: [
    {
      key: 'clos',
      titre: 'Clos et Couvert',
      texte:
        'Structures, charpentes bois et métalliques, couvertures, étanchéités, menuiseries extérieures, bardages et serrureries.',
      icon: '<path d="M3 21h18M4 21V10l8-6 8 6v11M9 21v-5a3 3 0 0 1 6 0v5"/>',
    },
    {
      key: 'second',
      titre: 'Second œuvre',
      texte:
        'Plâtrerie, cloisonnement, faux-plafonds, menuiseries intérieures, revêtements de sols et muraux, ascenseurs.',
      icon: '<path d="M3 3h18v18H3zM3 9h18M9 9v12M3 15h6"/>',
    },
    {
      key: 'cet',
      titre: "Corps d'état techniques",
      texte: 'Lots électriques, chauffage, ventilation, sanitaires et sécurité incendie, du logement au tertiaire.',
      icon: '<path d="M13 2L4.5 12.5a1 1 0 0 0 .8 1.6H11l-1 7.9 8.5-11.9a1 1 0 0 0-.8-1.6H12l1-6.4z"/>',
    },
  ],
  metiers,

  refsTitre: 'Des réalisations variées, publiques et privées',
  refsIntro:
    "Roland Garros, CARSAT, Open'R, Parc Silo : nous intervenons sur des opérations variées, du tertiaire au logement, en passant par le sport et les établissements de santé.",
  refs: [
    { cat: 'Tertiaire · Douai', titre: 'Parc Silo', texte: "Opération de réhabilitation et d'aménagement tertiaire sur le site du Parc Silo à Douai." },
    { cat: 'Tertiaire · Lille', titre: "Open'R", texte: "Projet de bureaux et d'espaces tertiaires au cœur de la métropole lilloise." },
    { cat: 'Sport · Paris', titre: 'Roland Garros', texte: "Interventions sur le stade Roland Garros, dont l'aménagement du Court 14." },
    { cat: 'Tertiaire · Hauts-de-France', titre: 'CARSAT HDF', texte: "Accompagnement en maîtrise d'œuvre pour la CARSAT Hauts-de-France." },
    { cat: 'Santé · Magnanville', titre: 'EHPAD', texte: "Conception et suivi d'un établissement d'hébergement pour personnes âgées dépendantes." },
    { cat: 'Logement · Croix', titre: 'Marignan', texte: 'Opération de logements pour le promoteur Marignan à Croix.' },
  ],

  ctaTitre: 'Un projet de construction ou de rénovation ?',
  ctaTexte:
    "Confiez votre maîtrise d'œuvre à ARTEIX Ingénierie et au groupement PULZ : nous vous accompagnons de la conception à la livraison.",
};
