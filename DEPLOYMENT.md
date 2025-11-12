# 🚀 Guide de Déploiement

Ce guide vous explique comment déployer l'application en production sur Vercel.

## 📋 Prérequis

- Compte GitHub (gratuit)
- Compte Vercel (gratuit)
- Configuration locale fonctionnelle

## 🔧 Préparation

### 1. Initialiser Git (si pas déjà fait)

```bash
git init
git add .
git commit -m "Initial commit - Assistant Aides Entreprises MVP"
```

### 2. Créer un Repository GitHub

1. Allez sur [github.com](https://github.com)
2. Créez un nouveau repository : `assistant-aides-entreprises`
3. Ne pas initialiser avec README (vous en avez déjà un)

### 3. Push vers GitHub

```bash
git remote add origin https://github.com/VOTRE_USERNAME/assistant-aides-entreprises.git
git branch -M main
git push -u origin main
```

## 🌐 Déploiement sur Vercel

### Méthode 1 : Via l'Interface Web (Recommandé pour MVP)

1. **Connectez-vous à Vercel**
   - Allez sur [vercel.com](https://vercel.com)
   - Connectez-vous avec votre compte GitHub

2. **Importer le Projet**
   - Cliquez sur "Add New" → "Project"
   - Sélectionnez votre repository `assistant-aides-entreprises`
   - Cliquez sur "Import"

3. **Configurer le Projet**
   - **Framework Preset** : Next.js (détecté automatiquement)
   - **Root Directory** : `./` (par défaut)
   - **Build Command** : `npm run build` (par défaut)
   - **Output Directory** : `.next` (par défaut)

4. **Ajouter les Variables d'Environnement**

   Dans la section "Environment Variables", ajoutez :

   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ANTHROPIC_API_KEY=sk-ant-api03-xxxxx
   INSEE_API_KEY=votre_consumer_key
   INSEE_API_SECRET=votre_consumer_secret
   NEXT_PUBLIC_APP_URL=https://votre-app.vercel.app
   ```

   ⚠️ **Important** : `NEXT_PUBLIC_APP_URL` doit être l'URL de votre projet Vercel

5. **Déployer**
   - Cliquez sur "Deploy"
   - Attendez 2-3 minutes
   - ✅ Application déployée !

### Méthode 2 : Via CLI Vercel

```bash
# Installer Vercel CLI
npm i -g vercel

# Se connecter
vercel login

# Déployer
vercel

# Suivre les instructions
# Déployer en production
vercel --prod
```

## 🔐 Configuration Post-Déploiement

### 1. Mettre à Jour Supabase

Dans votre projet Supabase :

1. Allez dans **Authentication** → **URL Configuration**
2. Ajoutez votre URL Vercel dans :
   - **Site URL** : `https://votre-app.vercel.app`
   - **Redirect URLs** :
     - `https://votre-app.vercel.app/auth/callback`
     - `http://localhost:3000/auth/callback` (pour dev)

### 2. Tester la Production

1. Visitez votre URL Vercel
2. Créez un compte
3. Testez le flux complet
4. Vérifiez les logs dans le dashboard Vercel

## 📊 Monitoring

### Dashboard Vercel

- **Analytics** : Activez Vercel Analytics (gratuit)
- **Speed Insights** : Activez Speed Insights
- **Logs** : Consultez les logs en temps réel
- **Deployments** : Historique des déploiements

### Logs en Temps Réel

```bash
vercel logs --follow
```

## 🔄 Redéploiement

### Automatique (Recommandé)

Chaque push sur la branche `main` déclenche un déploiement automatique :

```bash
git add .
git commit -m "Update: description des changements"
git push origin main
```

### Manuel

Via l'interface Vercel :
- Allez dans votre projet
- Cliquez sur "Redeploy"

## 🌍 Domaine Personnalisé (Optionnel)

### Ajouter un Domaine

1. Allez dans **Settings** → **Domains**
2. Ajoutez votre domaine : `monapp.com`
3. Suivez les instructions DNS

### Configuration DNS

Ajoutez ces enregistrements chez votre registrar :

```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

## 🔒 Sécurité en Production

### Variables Secrètes

✅ Toutes vos clés API sont sécurisées dans Vercel
✅ Jamais exposées côté client (sauf NEXT_PUBLIC_*)

### Headers de Sécurité

Ajoutez dans `next.config.mjs` :

```javascript
const nextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};
```

## 📈 Optimisations Production

### 1. Images

Next.js optimise automatiquement les images.
Pas de configuration supplémentaire nécessaire pour le MVP.

### 2. Caching

Vercel configure automatiquement le cache optimal pour Next.js.

### 3. Edge Network

Votre app est automatiquement distribuée sur le CDN global de Vercel.

## 🐛 Résolution de Problèmes

### Build Failed

**Erreur TypeScript** :
```bash
# Localement, vérifiez les erreurs
npm run build

# Corrigez et re-push
```

**Dépendances manquantes** :
```bash
# Vérifiez package.json
npm install
```

### Runtime Errors

**Consultez les logs** :
```bash
vercel logs
```

**Variables d'env manquantes** :
- Vérifiez dans Settings → Environment Variables
- Redéployez après ajout de variables

### API Routes Timeout

Par défaut, les API routes ont un timeout de 10s sur le plan gratuit.

Solution pour l'analyse IA (qui peut prendre >10s) :
- Passer au plan Pro Vercel ($20/mois)
- Ou implémenter une file d'attente (Redis)

## 💰 Coûts Estimés

### Plan Gratuit Vercel (Hobby)

✅ **Inclus** :
- 100 GB de bande passante
- Déploiements illimités
- HTTPS automatique
- Analytics de base
- Edge Network global

⚠️ **Limitations** :
- 10s timeout API Routes
- Pas de collaboration en équipe

### Plan Pro ($20/mois)

✅ **Avantages** :
- 60s timeout API Routes
- Analytics avancées
- Collaboration équipe
- Support prioritaire

## 📊 Monitoring des Coûts API

### Anthropic Claude

- Vérifiez votre usage : [console.anthropic.com](https://console.anthropic.com)
- Configurez des alertes de budget
- Modèle Sonnet : ~$3/million tokens (input) / ~$15/million tokens (output)

### Supabase

- Plan gratuit : 500 MB
- Monitoring : dashboard.supabase.com
- Upgrade vers Pro si dépassement ($25/mois)

### INSEE API

- Gratuit sans limite (service public)

## ✅ Checklist Finale

Avant de considérer le déploiement terminé :

- [ ] Application accessible sur URL Vercel
- [ ] Authentification fonctionne
- [ ] Récupération INSEE fonctionne
- [ ] Analyse IA fonctionne
- [ ] Dashboard s'affiche correctement
- [ ] Mobile responsive vérifié
- [ ] Logs propres (pas d'erreurs)
- [ ] Variables d'env toutes configurées
- [ ] URL callback Supabase configurée
- [ ] Domaine personnalisé configuré (optionnel)
- [ ] Analytics activées (optionnel)

## 🎉 Partage

Votre application est en ligne ! Partagez-la :

```
🚀 Assistant Aides Entreprises
Trouvez les aides pour votre entreprise en 2 minutes avec l'IA

👉 https://votre-app.vercel.app

#Code4Sud #IA #Innovation #Entreprise
```

## 📞 Support

En cas de problème :

1. **Docs Vercel** : [vercel.com/docs](https://vercel.com/docs)
2. **Docs Next.js** : [nextjs.org/docs](https://nextjs.org/docs)
3. **Communauté** : Discord Vercel

---

**Félicitations pour votre déploiement ! 🎊**
