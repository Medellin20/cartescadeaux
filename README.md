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
1. `POST /api/checkout` valide le montant (20–500 €) côté serveur, crée la commande (`pending`) puis un checkout SumUp hébergé.
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

Le catalogue contient 28 enseignes et propose les montants 20, 25, 50, 100, 150, 200,
250 et 500 €. Le formulaire permet aussi un montant entier personnalisé
entre 20 et 500 €. L'enseigne est validée côté serveur et enregistrée dans
`orders.brand`, puis affichée dans les dernières commandes de l'administration.
Pour une base déjà créée, appliquer `supabase/migrations/20261015_add_order_brand.sql`
avant le déploiement. Une nouvelle base utilise directement `supabase/schema.sql`.

Le mécanisme existant émet des codes internes P2P. Il ne fournit pas de codes
redeemables auprès des enseignes du catalogue : une intégration avec un fournisseur
est nécessaire pour commercialiser et livrer ces cartes de marque.

### Quantité de cartes cadeaux

Chaque commande accepte de 1 à 20 cartes du même montant. Le total correspond au montant unitaire multiplié par la quantité ; chaque carte reçoit son propre code.
Pour une base existante, appliquer `supabase/migrations/20261015_add_order_quantity.sql` avant de déployer cette version. Les commandes existantes conservent une quantité de 1. Le paiement reste désactivé tant que la configuration SumUp n’est pas activée.

### Langues du site

Le bouton globe de l’en-tête propose le français, l’anglais, l’allemand, l’espagnol, l’italien et le néerlandais. Le choix est conservé dans le stockage local du navigateur. Les traductions de l’interface publique sont intégrées dans `src/lib/i18n/translations.json`, sans service de traduction externe à l’exécution. Pour ajouter un texte, utiliser `T` ou `t` depuis `LanguageProvider` et ajouter sa traduction dans les cinq dictionnaires (le français est le texte source). Conserver les paramètres entre accolades, les marques, les codes et les valeurs envoyées aux API. L’administration, les e-mails et la page de paiement SumUp suivent leur propre langue.

Pour autoriser les montants de 20 € et 25 € dans une base existante, appliquer `supabase/migrations/20261015_add_20_25_amounts.sql` après la migration des quantités.

Le plafond d’achat est de 500 € par carte, contrôlé par le formulaire et l’API de commande. Les contraintes de base existantes restent compatibles avec les anciennes commandes supérieures à 500 €.
