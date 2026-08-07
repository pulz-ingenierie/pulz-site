# PULZ Ingénierie — Site web

Site dynamique du groupement PULZ (Next.js + Supabase).

**Pour démarrer, suis le guide : `docs/GUIDE-DEMARRAGE.md`**

## Stack
- Next.js 14 (App Router)
- Supabase (base de données, stockage, authentification)
- API Claude (fonctions IA : renommage photos, SEO)
- Resend (emails du formulaire de contact)
- Déploiement : Vercel

## Structure
- `src/app/` — pages publiques + admin + API
- `src/components/` — Nav, Footer partagés
- `src/lib/` — clients Supabase
- `supabase/` — schéma SQL + données initiales + import du contenu
- `docs/` — guide de mise en route
