# PULZ — Guide de mise en route du site dynamique

Ce guide t'accompagne pas à pas pour transformer les maquettes en site réel,
géré depuis l'administration. Suis les étapes **dans l'ordre**.

Tu as déjà des comptes Supabase, Vercel et GitHub — parfait, on part de là.

---

## Vue d'ensemble (les 3 briques)

- **Supabase** = la base de données + le stockage des photos + la connexion admin
- **Vercel** = héberge et publie le site (le met en ligne)
- **GitHub** = stocke le code (Vercel lit le code depuis GitHub)

Le code de ce projet est dans le dossier `pulz-app/`.

---

## Étape 1 — Installer le projet en local (10 min)

1. Récupère le dossier `pulz-app/` sur ton ordinateur.
2. Ouvre un terminal dans ce dossier.
3. Installe les dépendances :
   ```
   npm install
   ```

---

## Étape 2 — Créer la base Supabase (15 min)

1. Sur https://supabase.com, crée un **nouveau projet** (note le mot de passe de la base).
2. Une fois le projet prêt, va dans **SQL Editor** (menu de gauche).
3. Exécute les fichiers SQL **dans cet ordre** (copier-coller le contenu, puis "Run") :
   1. `supabase/schema.sql`      → crée toutes les tables
   2. `supabase/seed.sql`        → ajoute les 4 sociétés, le routage, les paramètres
   3. `supabase/import_contenu.sql` → ajoute les membres (CV) et les actualités
4. Va dans **Project Settings > API** et copie :
   - `Project URL`
   - la clé `anon public`
   - la clé `service_role` (secrète — ne jamais la partager)

---

## Étape 3 — Brancher les clés (5 min)

1. Dans `pulz-app/`, copie `.env.local.example` en `.env.local`.
2. Remplis les valeurs Supabase (URL + les 2 clés).
3. Les clés Anthropic (IA) et Resend (emails) peuvent attendre — mets-les
   quand tu activeras ces fonctions (voir étapes 6 et 7).

---

## Étape 4 — Créer ton compte administrateur (5 min)

1. Dans Supabase : **Authentication > Users > Add user**.
2. Mets ton e-mail + un mot de passe. Coche "Auto confirm user".
3. Ce sera ton identifiant pour te connecter à `/admin`.

---

## Étape 5 — Lancer le site en local et vérifier (5 min)

```
npm run dev
```
Ouvre http://localhost:3000

- La page d'accueil, les références, les actualités doivent afficher le
  contenu venu de Supabase.
- Va sur http://localhost:3000/admin → tu es redirigé vers le login →
  connecte-toi avec le compte de l'étape 4 → tu accèdes au tableau de bord.

Si le contenu s'affiche : **le reliage fonctionne.** 🎉

---

## Étape 6 — Le stockage des photos (10 min)

1. Dans Supabase : **Storage > New bucket**, nomme-le `photos`, coche "Public bucket".
2. Les photos que tu importeras depuis l'admin y seront stockées.
3. (À ce stade, l'upload depuis l'admin sera branché dans la prochaine session.)

---

## Étape 7 — Activer les fonctions IA (optionnel, quand tu veux)

1. Récupère une clé API sur https://console.anthropic.com
2. Mets-la dans `.env.local` : `ANTHROPIC_API_KEY=sk-ant-...`
3. Les boutons "Renommer avec l'IA" et "Optimiser SEO" utiliseront cette clé.

---

## Étape 8 — L'envoi des emails du formulaire (optionnel)

1. Crée un compte sur https://resend.com, vérifie ton domaine `pulz-ingenierie.fr`.
2. Récupère la clé API, mets-la dans `.env.local` : `RESEND_API_KEY=re_...`
3. Le formulaire de contact enverra les emails, routés selon le sujet choisi.

---

## Étape 9 — Mettre en ligne (Vercel) (15 min)

1. Pousse le dossier `pulz-app/` sur un dépôt **GitHub**.
2. Sur https://vercel.com : **New Project** → importe ce dépôt.
3. Dans les **Environment Variables** de Vercel, recopie TOUTES les variables
   de ton `.env.local`.
4. Déploie. Vercel te donne une URL (puis tu brancheras `pulz-ingenierie.fr`).

---

## Où en est le code (état actuel)

**Fait :**
- Schéma de base complet + données initiales + import du contenu
- Pages publiques dynamiques : accueil, références (liste + fiche),
  actualités (liste + fiche), contact
- Connexion admin sécurisée + tableau de bord
- API : envoi email du formulaire (routé), IA renommage photo, IA SEO

**À finir dans les prochaines sessions :**
- Les écrans d'édition complets de l'admin (créer/modifier une référence,
  publier une actu, gérer la bibliothèque photos avec upload)
- Le branchement des boutons IA dans l'interface admin
- Le design final des pages publiques (reprendre exactement les maquettes)
- Les pages société avec volets CV, la page Groupe
- SEO avancé : sitemap, données structurées, redirections depuis l'ancien site

---

## En cas de blocage

Note l'étape et le message d'erreur exact, et on débogue ensemble à la
prochaine session. Rien n'est irréversible : on peut tout recommencer.
