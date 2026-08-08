-- ============================================================
--  MIGRATION 04 — Politiques Storage pour l'upload admin
--  À exécuter dans Supabase (SQL Editor). Autorise les utilisateurs
--  authentifiés (l'admin) à téléverser/gérer les fichiers du bucket "photos".
--  La lecture publique existe déjà (bucket public).
-- ============================================================

-- Lecture publique (au cas où elle ne serait pas déjà en place)
drop policy if exists "photos lecture publique" on storage.objects;
create policy "photos lecture publique" on storage.objects
  for select using (bucket_id = 'photos');

-- Écriture réservée aux utilisateurs authentifiés (admin)
drop policy if exists "photos upload authentifie" on storage.objects;
create policy "photos upload authentifie" on storage.objects
  for insert to authenticated with check (bucket_id = 'photos');

drop policy if exists "photos update authentifie" on storage.objects;
create policy "photos update authentifie" on storage.objects
  for update to authenticated using (bucket_id = 'photos');

drop policy if exists "photos delete authentifie" on storage.objects;
create policy "photos delete authentifie" on storage.objects
  for delete to authenticated using (bucket_id = 'photos');
