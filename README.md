# Drive Platform — Étape 1 : setup + base de données

C'est la première brique du projet, rien d'autre. Objectif : vérifier que le
projet démarre et que le schéma de base de données est correct, avant
d'ajouter la moindre fonctionnalité.

## Ce que contient cette étape
- Squelette Next.js 14 + TypeScript + Tailwind
- Schéma Prisma complet (11 tables, 3 enums) reflétant les décisions prises :
  - **pas de compte client** (table `Customer`, pas `User`) → commande "invité"
  - **pas de créneaux à capacité** → juste `prepMinutes` / `prepStartedAt` sur la commande
  - **un seul compte Stripe** → table `Payment` simple, pas de `stripeAccountId` par commerce
- Une page d'accueil qui vérifie juste que la connexion à la base fonctionne

## Comment tester

```bash
npm install
cp .env.example .env
```

Dans `.env`, mets l'URL de ta base PostgreSQL. Le plus simple pour tester
gratuitement : crée un projet sur [neon.tech](https://neon.tech) ou
[supabase.com](https://supabase.com) et colle l'URL de connexion fournie dans
`DATABASE_URL`.

```bash
npx prisma db push     # crée les 11 tables dans ta base
npm run dev
```

Ouvre http://localhost:3000 — tu dois voir :

> ✅ Setup étape 1 opérationnel
> Connexion base de données OK.
> 0 commerce(s) en base pour le moment.

Tu peux aussi lancer `npm run db:studio` pour voir les tables visuellement
dans l'interface Prisma Studio (pratique pour vérifier que tout est là).

## Si ça ne marche pas
- Erreur de connexion DB → vérifie `DATABASE_URL` dans `.env`
- `prisma db push` échoue → vérifie que ta base autorise les connexions
  externes (Neon/Supabase le font par défaut)

## Prochaine étape
Une fois que tu confirmes que ça fonctionne chez toi, on attaque l'étape 2 :
l'authentification (comptes commerçant/admin + protection des routes).
