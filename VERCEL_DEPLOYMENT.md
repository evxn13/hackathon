# 🚀 Guide de Déploiement Vercel

## Étape 1: Préparer le projet pour le déploiement

### ✅ Pré-requis
- [ ] Compte GitHub (gratuit)
- [ ] Compte Vercel (gratuit)
- [ ] Projet Git initialisé

## Étape 2: Pousser le code sur GitHub

```bash
# Initialiser Git (si pas déjà fait)
git init

# Ajouter tous les fichiers
git add .

# Créer le commit
git commit -m "Initial commit - Hackathon Code4Sud"

# Créer un repository sur GitHub puis:
git remote add origin https://github.com/VOTRE_USERNAME/assistant-aides-entreprises.git
git branch -M main
git push -u origin main
```

## Étape 3: Déployer sur Vercel

### 3.1 Connecter GitHub à Vercel

1. Allez sur https://vercel.com
2. Cliquez sur "Sign Up" puis "Continue with GitHub"
3. Autorisez Vercel à accéder à vos repositories
4. Cliquez sur "Import Project"
5. Sélectionnez votre repository `assistant-aides-entreprises`

### 3.2 Configurer les variables d'environnement

⚠️ **IMPORTANT**: Avant de déployer, ajoutez toutes les variables d'environnement!

Dans Vercel, lors de l'import:
1. Cliquez sur "Environment Variables"
2. Ajoutez chaque variable une par une:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL
Valeur: https://fkumjwfkxqqeyqnkykjf.supabase.co

NEXT_PUBLIC_SUPABASE_ANON_KEY
Valeur: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZrdW1qd2ZreHFxZXlxbmt5a2pmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5NjEwMjMsImV4cCI6MjA3ODUzNzAyM30.FvY0Ov2Mf5uEupCv-cei7LWwbGuLwkBAqrRqEq9JhEk

SUPABASE_SERVICE_ROLE_KEY
Valeur: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZrdW1qd2ZreHFxZXlxbmt5a2pmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Mjk2MTAyMywiZXhwIjoyMDc4NTM3MDIzfQ.0xNmwK_USqe8YY-mhUwZW2pR_8YpXgeWXB-2ERZ9X_Q

# Anthropic Claude AI
ANTHROPIC_API_KEY
Valeur: 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

# INSEE API
INSEE_API_KEY
Valeur: 4678a69d-e747-44ae-bdbd-eed2fbb0dc01

INSEE_API_SECRET
Valeur: 0apA3hPs6QiE8MamjpcS0Hy5LTS0EvE5

# Application URL - LAISSER VIDE POUR L'INSTANT
NEXT_PUBLIC_APP_URL
Valeur: (laissez vide, on le mettra après le déploiement)
```

3. Cliquez sur "Deploy"

## Étape 4: Récupérer l'URL de déploiement

Une fois le déploiement terminé (2-3 minutes):
1. Notez votre URL Vercel (exemple: `https://assistant-aides-entreprises.vercel.app`)
2. Allez dans **Settings → Environment Variables**
3. Modifiez `NEXT_PUBLIC_APP_URL` avec votre vraie URL Vercel
4. **Redéployez** (onglet Deployments → menu trois points → Redeploy)

## Étape 5: Configurer Supabase pour Vercel

⚠️ **CRITIQUE pour l'authentification!**

1. Allez sur votre Supabase Dashboard: https://app.supabase.com
2. Sélectionnez votre projet
3. **Authentication → URL Configuration**
4. Modifiez:
   - **Site URL**: `https://votre-app.vercel.app`
   - **Redirect URLs**: Ajoutez ces 2 URLs:
     ```
     https://votre-app.vercel.app/auth/callback
     http://localhost:3000/auth/callback
     ```
5. Cliquez sur "Save"

## Étape 6: Tester l'application

1. Ouvrez votre URL Vercel
2. Créez un compte
3. Connectez-vous
4. Testez l'analyse avec un SIRET:
   - `32737442200053` (Microsoft France)
   - `73282932000074` (Apple France)
   - `44306194400047` (Google France)

## 🔧 Résolution des problèmes courants

### Erreur: "MIDDLEWARE_INVOCATION_FAILED"
**Cause**: Variables d'environnement manquantes ou incorrectes
**Solution**: Vérifiez que toutes les variables sont bien définies dans Vercel

### Erreur: "Failed to fetch" lors de l'authentification
**Cause**: Les Redirect URLs ne sont pas configurées dans Supabase
**Solution**: Suivez l'Étape 5 ci-dessus

### Erreur 500 lors de l'analyse IA
**Cause**: Clé API Anthropic manquante ou invalide
**Solution**: Vérifiez que `ANTHROPIC_API_KEY` est bien définie

### Le site ne se met pas à jour
**Solution**:
1. Allez dans l'onglet "Deployments" sur Vercel
2. Cliquez sur le menu (3 points) du dernier déploiement
3. Cliquez "Redeploy"

## 📊 Performance & Monitoring

Vercel fournit automatiquement:
- ✅ Analytics (trafic, pages vues)
- ✅ Logs en temps réel
- ✅ Alertes d'erreurs
- ✅ SSL/HTTPS automatique
- ✅ CDN global

Accédez-y via l'onglet "Analytics" et "Logs" sur Vercel.

## 💰 Coûts

### Plan Gratuit Vercel
- ✅ 100 GB de bande passante/mois
- ✅ Déploiements illimités
- ✅ SSL gratuit
- ✅ Domaines personnalisés
- ✅ Suffisant pour un hackathon/MVP

### Si vous dépassez les limites gratuites
- Plan Pro: $20/mois (peu probable pour un hackathon)

## 🎯 Checklist finale

Avant de présenter au jury:
- [ ] Application accessible via URL Vercel
- [ ] Authentification fonctionne (register + login)
- [ ] Analyse SIRET fonctionne
- [ ] Analyse IA génère des recommandations
- [ ] Carousel des aides s'affiche correctement
- [ ] Liens vers sites officiels fonctionnent
- [ ] Design responsive (testez sur mobile)
- [ ] Pas d'erreurs dans les logs Vercel

## 🚀 Pour aller plus loin

### Domaine personnalisé (optionnel)
1. Achetez un domaine (ex: `assistant-aides.fr`)
2. Dans Vercel → Settings → Domains
3. Ajoutez votre domaine et suivez les instructions DNS
4. Mettez à jour les Redirect URLs dans Supabase

### CI/CD automatique
Avec GitHub + Vercel:
- ✅ Push sur `main` → déploiement automatique
- ✅ Pull Request → preview deployment
- ✅ Rollback en un clic

---

**Bon déploiement! 🎉**

*Pour toute question, consultez la documentation Vercel: https://vercel.com/docs*
