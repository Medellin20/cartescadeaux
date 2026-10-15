# Cartes cadeaux — Cartes cadeaux (Next.js 14 · React · Tailwind · Supabase · SumUp)

## Installation

1. `npm install`
2. **Supabase** : créez un projet, puis exécutez `supabase/schema.sql` dans *SQL Editor*.
   Récupérez l'URL du projet et la clé `service_role` (Settings → API).
3. **SumUp** : créez une clé API (Developer → API keys) et notez votre *merchant code*.
4. **E-mail (Resend)** : créez une clé API et vérifiez votre domaine d'envoi.
5. `cp .env.example .env.local` puis renseignez toutes les valeurs.
6. Mot de passe admin : `npm run hash-password -- "VotreMotDePasseLong"` → collez la ligne `ADMIN_PASSWORD_HASH=...`.
   Secret de session : `openssl rand -base64 32` → `ADMIN_SESSION_SECRET`.
7. `npm run dev` → http://localhost:3000 — admin : http://localhost:3000/admin

### Tester le paiement en local
SumUp doit pouvoir appeler votre webhook : lancez un tunnel HTTPS (`ngrok http 3000`) et mettez l'URL dans `SITE_URL`.

## Flux de paiement
1. `POST /api/checkout` valide le montant (50–1000 €) côté serveur, crée la commande (`pending`) puis un checkout SumUp hébergé.
2. Le client paie chez SumUp, puis revient sur `/merci?order=<uuid>`.
3. Le **serveur** relit le checkout via l'API SumUp (webhook `POST /api/webhooks/sumup?token=…` et page `/merci`), vérifie statut `PAID`, montant, devise, référence.
4. Seulement alors : commande `paid`, carte créée (code aléatoire), e-mail envoyé **une seule fois** (traitement idempotent).
5. `/solde` : consultation du solde par code (limité en fréquence).

## Sécurité
- Clés secrètes uniquement dans `process.env` côté serveur (`server-only`) ; aucune variable `NEXT_PUBLIC_`.
- RLS Supabase activée sans politique : le navigateur n'a aucun accès direct aux tables.
- Admin : cookie JWT httpOnly/SameSite=Strict, middleware + contrôle dans chaque route, bcrypt, limitation des tentatives.
- Débits/crédits atomiques via la fonction SQL `adjust_card` (solde jamais négatif).
- Limiteur de débit en mémoire : en production multi-instances, utilisez Redis/Upstash.

## Déploiement (Netlify)

Reliez le dépôt Git au site Netlify. Le fichier `netlify.toml` définit la commande
`npm run build`, le dossier publié `.next` et Node.js 22. Le répertoire de base
doit être la racine de ce projet, où se trouve `package.json`.
Netlify détecte Next.js et installe automatiquement son adaptateur pour les pages,
les routes API et le middleware. Un dépôt manuel des sources ou du dossier `.next`
par glisser-déposer ne remplace pas cette compilation.

Ajoutez les variables de `.env.example` dans les variables d'environnement du site
Netlify, accessibles à la compilation et aux fonctions, avec
`SITE_URL=https://cartescadeaux.netlify.app`. Le fichier `.env` local n'est pas
transmis par Git.

Après avoir poussé cette configuration, relancez un déploiement de production
depuis Netlify. Si la page d'accueil affiche encore « Page not found », vérifiez
dans le journal du déploiement que la compilation Next.js et son adaptateur ont
bien été exécutés et que le dépôt et la branche publiés sont les bons.

Pour Vercel, ajoutez les mêmes variables dans les réglages du projet, avec
`SITE_URL=https://votre-domaine`.

## Catalogue des enseignes

Le catalogue contient 28 enseignes et propose les montants 50, 100, 150, 200,
250, 500 et 1 000 €. Le formulaire permet aussi un montant entier personnalisé
entre 50 et 1 000 €. L'enseigne est validée côté serveur et enregistrée dans
`orders.brand`, puis affichée dans les dernières commandes de l'administration.
Pour une base déjà créée, appliquer `supabase/migrations/20261015_add_order_brand.sql`
avant le déploiement. Une nouvelle base utilise directement `supabase/schema.sql`.

Le mécanisme existant émet des codes internes P2P. Il ne fournit pas de codes
redeemables auprès des enseignes du catalogue : une intégration avec un fournisseur
est nécessaire pour commercialiser et livrer ces cartes de marque.
