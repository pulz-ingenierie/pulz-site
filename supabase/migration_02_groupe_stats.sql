-- ============================================================
--  MIGRATION 02 — À exécuter dans Supabase (SQL Editor > New query)
--  1) Membre "groupe" (assistante commune affichée sur les 4 sociétés)
--  2) Table des compteurs de la home, éditables depuis l'admin
-- ============================================================

-- ------------------------------------------------------------
-- 1) Membre transverse au groupement (ex. Charlotte, assistante)
-- ------------------------------------------------------------
alter table membres add column if not exists groupe_wide boolean default false;

-- Charlotte est l'assistante de direction du groupement : visible partout
update membres set groupe_wide = true where slug = 'charlotte';

-- ------------------------------------------------------------
-- 2) Compteurs de la page d'accueil (chiffres-clés)
-- ------------------------------------------------------------
create table if not exists statistiques (
  id      uuid primary key default uuid_generate_v4(),
  ordre   int     default 0,
  valeur  numeric not null,          -- ex. 6, 1.4, 129, 12
  suffixe text    default '',        -- ex. ' M€'
  label   text    not null,          -- ex. 'collaborateurs'
  created_at timestamptz default now()
);

alter table statistiques enable row level security;

-- Lecture publique (affichage sur la home)
drop policy if exists "lecture publique statistiques" on statistiques;
create policy "lecture publique statistiques" on statistiques for select using (true);

-- Écriture réservée à l'admin authentifié
drop policy if exists "admin gere statistiques" on statistiques;
create policy "admin gere statistiques" on statistiques for all using (auth.role() = 'authenticated');

-- Valeurs initiales (identiques aux maquettes) — ignorées si déjà présentes
insert into statistiques (ordre, valeur, suffixe, label)
select * from (values
  (1, 6::numeric,   '',     'collaborateurs'),
  (2, 1.4::numeric, ' M€',  'de chiffre d''affaires'),
  (3, 129::numeric, '',     'projets'),
  (4, 12::numeric,  '',     'expertises')
) as v(ordre, valeur, suffixe, label)
where not exists (select 1 from statistiques);
