-- ============================================================
--  DONNÉES INITIALES — à exécuter APRÈS schema.sql
--  Injecte les 4 sociétés, le routage contact et les paramètres.
-- ============================================================

-- Sociétés du groupement
insert into societes (slug, nom, domaine, couleur, ordre) values
  ('buscot',   'BUSCOT ENERGIES', 'Fluides & électricité',        '#016854', 1),
  ('arteix',   'ARTEIX',          'Maîtrise d''œuvre bâtiment',   '#0E3A5C', 2),
  ('gradient', 'GRADIENT',        'VRD & espaces verts',          '#2E4468', 3),
  ('therac',   'THERAC',          'Thermique & environnement',    '#11A8A2', 4)
on conflict (slug) do nothing;

-- Routage du formulaire de contact
insert into routage_contact (sujet, destinataire, ordre) values
  ('Fluides & électricité (Buscot)',      'buscot@pulz-ingenierie.fr',   1),
  ('Maîtrise d''œuvre bâtiment (Arteix)', 'arteix@pulz-ingenierie.fr',   2),
  ('VRD & espaces verts (Gradient)',      'gradient@pulz-ingenierie.fr', 3),
  ('Thermique & environnement (Therac)',  'therac@pulz-ingenierie.fr',   4),
  ('Autre / je ne sais pas',              'contact@pulz-ingenierie.fr',  5)
on conflict do nothing;

-- Paramètres du site
insert into parametres (cle, valeur) values
  ('adresse',            '99 rue de l''Union, 59118 Wambrechies'),
  ('email',              'contact@pulz-ingenierie.fr'),
  ('telephone',          ''),
  ('linkedin',           ''),
  ('seo_titre_accueil',  'PULZ Ingénierie — Maîtrise d''œuvre & bureaux d''études, Hauts-de-France'),
  ('seo_desc_accueil',   'Groupement de bureaux d''études et de maîtrise d''œuvre en Hauts-de-France : fluides, électricité, bâtiment, VRD, thermique et environnement.'),
  ('villes_ciblees',     'Lille, Wambrechies, Roubaix, Tourcoing, Villeneuve-d''Ascq, Douai, Béthune')
on conflict (cle) do nothing;
