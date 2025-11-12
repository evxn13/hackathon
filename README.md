# Assistant IA pour Aides aux Entreprises

**Projet Code4Sud Hackathon** - Solution intelligente pour simplifier l'accès aux aides publiques pour les TPE/PME.

## 🎯 Problématique

Les dirigeants de TPE/PME sont perdus parmi les nombreux dispositifs d'aides (subventions, accompagnements, incubateurs). Notre solution analyse automatiquement le profil d'une entreprise et propose les aides les plus pertinentes.

## ✨ Fonctionnalités MVP

- ✅ Authentification sécurisée (Supabase Auth)
- ✅ Saisie et validation de SIRET
- ✅ Récupération automatique des données INSEE
- ✅ Analyse IA personnalisée avec Claude AI
- ✅ Dashboard avec profil entreprise complet
- ✅ Liste d'aides personnalisées avec filtres
- ✅ Projection financière avec graphiques
- ✅ Interface responsive et moderne

## 🛠 Stack Technique

### Frontend
- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Lucide React** (icônes)
- **Recharts** (graphiques)

### Backend & Database
- **Next.js API Routes**
- **Supabase** (PostgreSQL + Auth)
- **Row Level Security** activé

### Intelligence Artificielle
- **Anthropic Claude AI** (claude-3-5-sonnet)
- Analyse contextuelle du profil entreprise
- Génération d'aides personnalisées

### APIs Externes
- **API INSEE Sirene V3** (données entreprises)

## 📋 Prérequis

Avant de commencer, assurez-vous d'avoir installé :

- [Node.js](https://nodejs.org/) (version 18 ou supérieure)
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)
- Un compte [Supabase](https://supabase.com/)
- Une clé API [Anthropic](https://console.anthropic.com/)
- Un compte développeur [INSEE API](https://api.insee.fr/)

## 🚀 Installation

### 1. Installer les dépendances

```bash
npm install
```

### 2. Configuration Supabase

1. Créez un projet sur [supabase.com](https://supabase.com)
2. Dans le dashboard Supabase, allez dans **SQL Editor**
3. Exécutez les migrations dans l'ordre :
   - `supabase/migrations/001_create_companies.sql`
   - `supabase/migrations/002_create_aides.sql`
   - `supabase/migrations/003_create_revenue_projections.sql`

### 3. Configuration des variables d'environnement

Créez un fichier `.env.local` à la racine du projet :

```bash
cp .env.local.example .env.local
```

Remplissez les variables suivantes :

```env
# Supabase (trouvez ces valeurs dans Settings > API de votre projet Supabase)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Anthropic Claude AI (depuis console.anthropic.com)
ANTHROPIC_API_KEY=sk-ant-api03-xxxxx

# INSEE API (depuis api.insee.fr - inscription gratuite)
INSEE_API_KEY=votre_consumer_key
INSEE_API_SECRET=votre_consumer_secret

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Obtenir les clés API

#### API INSEE
1. Créez un compte sur [api.insee.fr](https://api.insee.fr/)
2. Créez une application
3. Abonnez-vous à l'API "Sirene"
4. Récupérez votre `Consumer Key` et `Consumer Secret`

#### Anthropic Claude
1. Créez un compte sur [console.anthropic.com](https://console.anthropic.com/)
2. Créez une clé API dans l'onglet "API Keys"
3. Copiez la clé (elle commence par `sk-ant-api03-`)

#### Supabase
1. Dans votre projet Supabase, allez dans **Settings > API**
2. Copiez l'URL du projet (`NEXT_PUBLIC_SUPABASE_URL`)
3. Copiez la clé `anon/public` (`NEXT_PUBLIC_SUPABASE_ANON_KEY`)
4. Copiez la clé `service_role` (`SUPABASE_SERVICE_ROLE_KEY`)

## 🏃 Lancement

### Mode développement

```bash
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

### Mode production

```bash
npm run build
npm start
```

## 📱 Utilisation

### 1. Créer un compte
- Accédez à la page d'inscription
- Entrez votre email et mot de passe
- Cliquez sur "Créer mon compte"

### 2. Analyser votre entreprise
- Connectez-vous au dashboard
- Entrez votre numéro SIRET (14 chiffres)
- Cliquez sur "Analyser mon entreprise"
- Les données INSEE sont récupérées automatiquement

### 3. Découvrir les aides
- Cliquez sur "Lancer l'analyse IA"
- L'IA Claude analyse votre profil
- Recevez une liste personnalisée d'aides
- Filtrez par type et niveau

### 4. Visualiser les projections
- Consultez le graphique de CA
- Visualisez l'impact des aides
- Consultez le montant total des aides potentielles

## 📂 Structure du Projet

```
/app
  /api
    /analyze-company     # Analyse IA avec Claude
    /insee-data         # Récupération données INSEE
  /auth
    /login             # Page connexion
    /register          # Page inscription
    /callback          # Callback OAuth
  /dashboard           # Dashboard principal
  layout.tsx           # Layout global
  page.tsx             # Landing page
  globals.css          # Styles globaux

/components
  /dashboard
    CompanyCard.tsx           # Carte profil entreprise
    AidesRecommendations.tsx  # Liste des aides
    RevenueChart.tsx          # Graphique CA
    SiretInput.tsx            # Input SIRET
  /auth
    LoginForm.tsx             # Formulaire connexion
    RegisterForm.tsx          # Formulaire inscription
  /ui
    Button.tsx               # Composant bouton
    Card.tsx                 # Composant carte
    Input.tsx                # Composant input
    Badge.tsx                # Composant badge

/lib
  /supabase
    client.ts          # Client Supabase (client-side)
    server.ts          # Client Supabase (server-side)
    database.types.ts  # Types TypeScript
  types.ts             # Types métier
  utils.ts             # Fonctions utilitaires

/supabase
  /migrations
    001_create_companies.sql
    002_create_aides.sql
    003_create_revenue_projections.sql
```

## 🗄 Schéma de Base de Données

### Table `companies`
Stocke les informations des entreprises récupérées depuis l'API INSEE.

### Table `aides_recommendations`
Stocke les recommandations d'aides générées par l'IA.

### Table `revenue_projections`
Stocke les projections de chiffre d'affaires.

Toutes les tables utilisent **Row Level Security** pour garantir que chaque utilisateur n'accède qu'à ses propres données.

## 🔒 Sécurité

- Authentification sécurisée via Supabase Auth
- Row Level Security (RLS) activé sur toutes les tables
- Validation des données côté serveur avec Zod
- Protection CSRF native de Next.js
- Variables sensibles dans .env.local (jamais commitées)

## 🚢 Déploiement

### Déploiement sur Vercel

1. Créez un compte sur [vercel.com](https://vercel.com)
2. Connectez votre repository GitHub
3. Ajoutez les variables d'environnement dans les settings Vercel
4. Déployez avec `vercel --prod`

## 🐛 Résolution de Problèmes

### Erreur "INSEE API credentials not configured"
- Vérifiez que `INSEE_API_KEY` et `INSEE_API_SECRET` sont bien dans `.env.local`
- Redémarrez le serveur de développement

### Erreur "Non authentifié"
- Vérifiez votre configuration Supabase
- Vérifiez que les migrations ont bien été exécutées
- Vérifiez que RLS est activé

### Erreur d'analyse IA
- Vérifiez votre clé API Anthropic
- Vérifiez que vous avez des crédits API disponibles
- Consultez les logs dans la console

## 📊 Coûts Estimés

- **Supabase** : Gratuit (plan free jusqu'à 500 MB)
- **Claude AI** : ~$15/1M tokens (modèle Sonnet)
- **API INSEE** : Gratuit
- **Vercel** : Gratuit (plan hobby)

## 🤝 Contribution

Ce projet a été réalisé pour le hackathon Code4Sud. Les contributions sont les bienvenues !

## 📄 Licence

MIT License - Code4Sud Hackathon 2025

## 👥 Équipe

Projet développé pour résoudre la problématique de l'accès aux aides pour les TPE/PME.

---

**Bon hackathon ! 🚀**
# hackathon
