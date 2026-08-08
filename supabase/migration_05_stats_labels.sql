-- ============================================================
--  migration_05_stats_labels.sql
--  Corrige l'affichage des compteurs de la home :
--   - le chiffre d'affaires affiche « 1,4 » seul (plus de « M€ » collé au nombre)
--   - l'unité passe dans le libellé : « Chiffre d'affaires en M€ HT »
--  À exécuter dans l'éditeur SQL de Supabase.
-- ============================================================

-- Chiffre d'affaires : on vide le suffixe et on met l'unité dans le label.
update statistiques
set suffixe = '',
    label   = 'Chiffre d''affaires en M€ HT'
where suffixe ilike '%M€%'
   or label ilike '%chiffre%';

-- Libellés propres (majuscule) pour les autres compteurs.
update statistiques set label = 'Collaborateurs'   where label ilike 'collaborateurs';
update statistiques set label = 'Projets menés'    where label ilike 'projets%';
update statistiques set label = 'Expertises métier' where label ilike 'expertises%';
