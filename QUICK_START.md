# Guide de Démarrage Rapide

Ce guide vous permettra de lancer l'application en **moins de 10 minutes**.

## ⚡ Installation Rapide

### 1. Installer Node.js (si pas déjà fait)
Téléchargez et installez depuis : https://nodejs.org/
Choisissez la version LTS (recommandée)

### 2. Installer les dépendances
Ouvrez un terminal dans le dossier du projet et exécutez :
```bash
npm install
```

## 🔑 Configuration des API (Obligatoire)

### Supabase (Base de données + Authentification)

1. **Créer un compte gratuit :** https://supabase.com/
2. **Créer un nouveau projet**
3. **Aller dans Settings > API** et copier :
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - anon/public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - service_role key → `SUPABASE_SERVICE_ROLE_KEY`

4. **Créer les tables** : Aller dans **SQL Editor** et coller le contenu de :
   - `supabase/migrations/001_create_companies.sql`
   - `supabase/migrations/002_create_aides.sql`
   - `supabase/migrations/003_create_revenue_projections.sql`

   Exécutez chaque fichier SQL en cliquant sur "Run"

### Anthropic Claude AI (Intelligence Artificielle)

1. **Créer un compte :** https://console.anthropic.com/
2. **Créer une API Key** dans "API Keys"
3. **Copier la clé** → `ANTHROPIC_API_KEY`
4. **Ajouter des crédits** (environ $5 suffisent pour tester)

### INSEE API (Données entreprises)

1. **Créer un compte :** https://api.insee.fr/
2. **Créer une application** dans "Mes applications"
3. **S'abonner à l'API Sirene** (gratuit)
4. **Récupérer les clés** :
   - Consumer Key → `INSEE_API_KEY`
   - Consumer Secret → `INSEE_API_SECRET`

## 📝 Fichier .env.local

Créez un fichier `.env.local` à la racine avec vos clés :

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Anthropic
ANTHROPIC_API_KEY=sk-ant-api03-xxxxx

# INSEE
INSEE_API_KEY=votre_consumer_key
INSEE_API_SECRET=votre_consumer_secret

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 🚀 Lancer l'Application

```bash
npm run dev
```

Ouvrez votre navigateur sur : **http://localhost:3000**

## 🎯 Test du Flux Complet

1. **Créer un compte** sur la page d'accueil
2. **Se connecter** avec vos identifiants
3. **Entrer un SIRET de test** : `73282932000074` (Apple France)
4. **Cliquer sur "Analyser mon entreprise"**
5. **Lancer l'analyse IA**
6. **Découvrir les aides personnalisées !**

## 🐛 Problèmes Fréquents

### "Cannot find module..."
```bash
npm install
```

### "INSEE API credentials not configured"
Vérifiez que votre `.env.local` contient bien `INSEE_API_KEY` et `INSEE_API_SECRET`

### "Non authentifié"
Vérifiez que les migrations Supabase ont été exécutées correctement

### Page blanche
Vérifiez la console du navigateur (F12) pour voir les erreurs

## 📊 Exemples de SIRET pour Tests

- **Apple France** : 73282932000074
- **Google France** : 44306194400047
- **Microsoft France** : 32737442200053

## 💡 Conseils

- Utilisez le mode incognito si vous avez des problèmes de cache
- Vérifiez que vous avez bien redémarré le serveur après avoir modifié `.env.local`
- Les migrations SQL doivent être exécutées dans l'ordre

## 🆘 Besoin d'Aide ?

Consultez le fichier `README.md` pour plus de détails ou vérifiez :
- Les logs dans le terminal
- La console du navigateur (F12)
- Les logs Supabase dans le dashboard

---

**Bon développement ! 🚀**
