-- ============================================================
--  PULZ INGÉNIERIE — Schéma de base de données (Supabase / PostgreSQL)
--  À exécuter dans l'éditeur SQL de Supabase (SQL Editor > New query)
-- ============================================================

-- Extension pour générer des UUID
create extension if not exists "uuid-ossp";

-- ------------------------------------------------------------
--  SOCIÉTÉS DU GROUPEMENT (Buscot, Arteix, Gradient, Therac)
-- ------------------------------------------------------------
create table if not exists societes (
  id          uuid primary key default uuid_generate_v4(),
  slug        text unique not null,          -- 'buscot', 'arteix'...
  nom         text not null,                 -- 'BUSCOT ENERGIES'
  domaine     text not null,                 -- 'Fluides & électricité'
  couleur     text not null,                 -- '#016854'
  ordre       int  default 0,
  created_at  timestamptz default now()
);

-- ------------------------------------------------------------
--  MEMBRES D'ÉQUIPE (pour les volets CV)
-- ------------------------------------------------------------
create table if not exists membres (
  id          uuid primary key default uuid_generate_v4(),
  societe_id  uuid references societes(id) on delete cascade,
  slug        text not null,                 -- 'sylvain', 'florian'...
  nom         text not null,                 -- 'Sylvain BUSCOT'
  role        text not null,                 -- 'Dirigeant'
  photo_url   text,
  accroche    text,
  profil      text,
  experiences jsonb default '[]',            -- [{d,t,desc}, ...]
  formation   text,
  competences jsonb default '[]',            -- ['skill1', 'skill2', ...]
  ordre       int  default 0,
  visible     boolean default true,
  created_at  timestamptz default now(),
  unique (societe_id, slug)
);

-- ------------------------------------------------------------
--  RÉFÉRENCES (projets)
-- ------------------------------------------------------------
create table if not exists references_projets (
  id             uuid primary key default uuid_generate_v4(),
  slug           text unique not null,
  titre          text not null,
  categorie      text not null,              -- 'Bureaux et tertiaires'...
  localisation   text,
  description    text,
  maitrise_ouvrage text,
  intervenants   jsonb default '[]',         -- ['Architecte — X', ...]
  specificites   jsonb default '[]',
  client_logo_url text,
  a_la_une       boolean default false,      -- mise en avant accueil
  statut         text default 'brouillon',   -- 'brouillon' | 'publie'
  seo_titre      text,
  seo_description text,
  created_at     timestamptz default now(),
  updated_at     timestamptz default now()
);

-- Missions des membres sur une référence (relation N-N enrichie)
create table if not exists reference_membres (
  reference_id uuid references references_projets(id) on delete cascade,
  societe_id   uuid references societes(id) on delete cascade,
  mission      text,
  primary key (reference_id, societe_id)
);

-- Photos d'une référence (galerie ordonnée, 1re = couverture)
create table if not exists reference_photos (
  id           uuid primary key default uuid_generate_v4(),
  reference_id uuid references references_projets(id) on delete cascade,
  photo_id     uuid,                          -- référence vers photos.id
  ordre        int default 0,
  couverture   boolean default false
);

-- ------------------------------------------------------------
--  ACTUALITÉS
-- ------------------------------------------------------------
create table if not exists actualites (
  id             uuid primary key default uuid_generate_v4(),
  slug           text unique not null,
  titre          text not null,
  categorie      text not null,              -- 'Chantier'...
  date_publication date not null default current_date,
  image_url      text,
  extrait        text,
  contenu        text,                        -- paragraphes séparés par \n\n
  statut         text default 'brouillon',
  seo_titre      text,
  seo_description text,
  created_at     timestamptz default now(),
  updated_at     timestamptz default now()
);

-- ------------------------------------------------------------
--  BIBLIOTHÈQUE PHOTOS
-- ------------------------------------------------------------
create table if not exists photos (
  id          uuid primary key default uuid_generate_v4(),
  url         text not null,                 -- URL Supabase Storage
  nom_fichier text not null,                 -- 'chantier-bdf-01.jpg'
  description text,                           -- alt / description SEO
  categorie   text,                          -- 'chantiers', 'equipes', 'logos'
  taille_ko   int,
  a_renommer  boolean default false,         -- badge "à renommer" (nom type IMG_xxxx)
  created_at  timestamptz default now()
);

-- ------------------------------------------------------------
--  MESSAGES DU FORMULAIRE DE CONTACT
-- ------------------------------------------------------------
create table if not exists messages (
  id          uuid primary key default uuid_generate_v4(),
  nom         text not null,
  societe     text,
  email       text not null,
  telephone   text,
  sujet       text,                          -- détermine le routage
  message     text not null,
  lu          boolean default false,
  created_at  timestamptz default now()
);

-- ------------------------------------------------------------
--  ROUTAGE DU FORMULAIRE (sujet -> destinataire)
-- ------------------------------------------------------------
create table if not exists routage_contact (
  id           uuid primary key default uuid_generate_v4(),
  sujet        text not null,                -- 'Fluides & électricité (Buscot)'
  destinataire text not null,                -- 'buscot@pulz-ingenierie.fr'
  ordre        int default 0
);

-- ------------------------------------------------------------
--  PARAMÈTRES DU SITE (clé-valeur : coordonnées, SEO global, etc.)
-- ------------------------------------------------------------
create table if not exists parametres (
  cle    text primary key,                   -- 'adresse', 'email', 'seo_titre_accueil'...
  valeur text
);

-- ------------------------------------------------------------
--  TRIGGER : mise à jour automatique de updated_at
-- ------------------------------------------------------------
create or replace function touch_updated_at() returns trigger as $$
begin new.updated_at = now(); return new; end;
$$ language plpgsql;

drop trigger if exists trg_ref_updated on references_projets;
create trigger trg_ref_updated before update on references_projets
  for each row execute function touch_updated_at();

drop trigger if exists trg_actu_updated on actualites;
create trigger trg_actu_updated before update on actualites
  for each row execute function touch_updated_at();

-- ============================================================
--  SÉCURITÉ (Row Level Security)
--  Lecture publique du contenu publié ; écriture réservée aux
--  utilisateurs authentifiés (l'admin). À affiner ensuite.
-- ============================================================
alter table references_projets enable row level security;
alter table actualites          enable row level security;
alter table societes            enable row level security;
alter table membres             enable row level security;
alter table photos              enable row level security;
alter table messages            enable row level security;

-- Lecture publique du contenu publié
create policy "lecture publique refs publiees" on references_projets
  for select using (statut = 'publie');
create policy "lecture publique actus publiees" on actualites
  for select using (statut = 'publie');
create policy "lecture publique societes" on societes for select using (true);
create policy "lecture publique membres" on membres for select using (visible = true);
create policy "lecture publique photos" on photos for select using (true);

-- Écriture (tout) réservée aux authentifiés
create policy "admin gere refs"     on references_projets for all using (auth.role() = 'authenticated');
create policy "admin gere actus"    on actualites          for all using (auth.role() = 'authenticated');
create policy "admin gere societes" on societes            for all using (auth.role() = 'authenticated');
create policy "admin gere membres"  on membres             for all using (auth.role() = 'authenticated');
create policy "admin gere photos"   on photos              for all using (auth.role() = 'authenticated');
-- Les messages : insertion publique (formulaire), lecture réservée admin
create policy "public envoie message" on messages for insert with check (true);
create policy "admin lit messages"    on messages for select using (auth.role() = 'authenticated');
