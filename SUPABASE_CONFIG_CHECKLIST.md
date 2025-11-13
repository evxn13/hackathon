# ✅ Checklist Configuration Supabase pour Production

## 🎯 Configuration Rapide (5 minutes)

### Étape 1: URL Configuration ⚙️

**Emplacement**: Authentication → URL Configuration

```
┌─────────────────────────────────────────────────┐
│ Site URL                                        │
│ https://votre-app.vercel.app                    │ ← CHANGEZ CECI!
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ Redirect URLs (add these)                       │
│ https://votre-app.vercel.app/**                 │
│ https://votre-app.vercel.app/auth/callback      │
│ http://localhost:3000/**                        │
│ http://localhost:3000/auth/callback             │
└─────────────────────────────────────────────────┘
```

**❗ Important**: Remplacez `https://votre-app.vercel.app` par votre vraie URL Vercel!

### Étape 2: Email Templates 📧

**Emplacement**: Authentication → Email Templates

Vérifiez que chaque template contient `{{ .SiteURL }}` et PAS `localhost:3000` en dur.

#### Confirm Signup
```html
<h2>Confirmez votre inscription</h2>
<p>Cliquez sur ce lien pour confirmer votre email:</p>
<p><a href="{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email">Confirmer mon email</a></p>
```

#### Magic Link
```html
<h2>Connexion Magique</h2>
<p>Cliquez sur ce lien pour vous connecter:</p>
<p><a href="{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=magiclink">Se connecter</a></p>
```

#### Reset Password
```html
<h2>Réinitialiser le mot de passe</h2>
<p>Cliquez sur ce lien pour réinitialiser:</p>
<p><a href="{{ .SiteURL }}/auth/reset-password?token_hash={{ .TokenHash }}&type=recovery">Réinitialiser</a></p>
```

### Étape 3: RLS Policies ✅

**Emplacement**: Database → Policies

Vérifiez que toutes vos tables ont les politiques RLS activées:

#### Table: companies
- ✅ RLS Enabled
- ✅ Users can view their own companies
- ✅ Users can insert their own companies
- ✅ Users can update their own companies
- ✅ Users can delete their own companies

#### Table: aides_recommendations
- ✅ RLS Enabled
- ✅ Users can view their own aides
- ✅ Users can insert their own aides
- ✅ Users can update their own aides
- ✅ Users can delete their own aides

#### Table: revenue_projections
- ✅ RLS Enabled
- ✅ Users can view projections for their companies
- ✅ Users can insert projections for their companies
- ✅ Users can update projections for their companies
- ✅ Users can delete projections for their companies

## 🔥 Solution Rapide pour le Hackathon

Si vous manquez de temps et que les emails de confirmation posent problème:

### Option 1: Désactiver la confirmation d'email

**Emplacement**: Authentication → Providers → Email

```
┌─────────────────────────────────────┐
│ ☐ Confirm email                     │ ← DÉCOCHEZ CECI
│ ☑ Enable sign-ups                   │
└─────────────────────────────────────┘
```

⚠️ **Attention**: Les utilisateurs pourront créer des comptes sans vérification d'email. Acceptable pour un hackathon/demo, mais pas pour la production réelle!

### Option 2: Utiliser un domaine email de test

Pour tester rapidement, utilisez des emails de test comme:
- `test+1@votredomaine.com`
- `test+2@votredomaine.com`
- etc.

Gmail et la plupart des services ignorent le `+quelquechose`, donc tous les emails arrivent dans la même boîte.

## 🧪 Test de Configuration

### Test 1: Créer un compte

1. Allez sur `https://votre-app.vercel.app`
2. Cliquez sur "Créer un compte"
3. Entrez email + mot de passe
4. Vérifiez votre boîte email

**✅ Succès si**: L'email de confirmation contient un lien vers `https://votre-app.vercel.app` (pas localhost)

### Test 2: Confirmer l'email

1. Cliquez sur le lien dans l'email
2. Vous devriez être redirigé vers le dashboard

**✅ Succès si**: Vous arrivez sur `/dashboard` et êtes connecté

### Test 3: Se connecter

1. Allez sur `https://votre-app.vercel.app/auth/login`
2. Connectez-vous avec vos identifiants
3. Vous devriez être redirigé vers le dashboard

**✅ Succès si**: Vous arrivez sur `/dashboard` avec votre profil

## 🚨 Dépannage Rapide

### Problème: "Invalid redirect URL"

**Solution**:
1. Vérifiez que vous avez ajouté `https://votre-app.vercel.app/**` dans les Redirect URLs
2. N'oubliez pas le `/**` à la fin
3. Sauvegardez et attendez 1 minute

### Problème: Les emails contiennent toujours localhost

**Solution**:
1. Changez la "Site URL" dans Authentication → URL Configuration
2. Vérifiez les Email Templates (ils doivent utiliser `{{ .SiteURL }}`)
3. Créez un NOUVEAU compte pour tester (pas un ancien)

### Problème: "Email not confirmed" après avoir cliqué sur le lien

**Solution**:
1. Vérifiez que le fichier `app/auth/confirm/route.ts` existe
2. Redéployez votre application sur Vercel
3. Testez avec un nouveau compte

### Problème: Le lien expire trop vite

**Solution**:
Dans Supabase → Authentication → Settings:
```
Email OTP Expiry: 86400 (24 heures)
```

## 📋 Checklist Finale

Avant de présenter au jury:

- [ ] Site URL changé pour URL Vercel
- [ ] Redirect URLs ajoutées (avec `/**`)
- [ ] Email templates vérifiés (utilisent `{{ .SiteURL }}`)
- [ ] Route `/auth/confirm` créée
- [ ] Test: Créer un nouveau compte fonctionne
- [ ] Test: Email de confirmation arrive
- [ ] Test: Le lien dans l'email pointe vers Vercel
- [ ] Test: Cliquer sur le lien confirme le compte
- [ ] Test: Se connecter après confirmation fonctionne
- [ ] Tables RLS configurées et testées

## 💡 Astuce Pro

Si vous présentez une démo en direct au jury:

1. **Créez 2-3 comptes de test à l'avance** (déjà confirmés)
2. **Notez les identifiants** dans un fichier sécurisé
3. **Utilisez ces comptes pour la démo** (pas de création en live)
4. **Ayez des données pré-remplies** (entreprises + aides déjà analysées)

Cela évite tout problème d'email pendant la présentation!

## 🎬 Scénario de Démo Parfait

```
1. Ouvrir https://votre-app.vercel.app
   → Landing page s'affiche ✅

2. Cliquer "Se connecter"
   → Page de login ✅

3. Se connecter avec compte de test
   → Redirection vers dashboard ✅

4. Afficher l'entreprise pré-enregistrée
   → Profil Microsoft/Apple/Google ✅

5. Montrer les aides recommandées dans le carousel
   → Carousel avec 8-12 aides ✅

6. Cliquer sur "Visiter le site officiel"
   → Ouverture du site BPI France/ADEME/etc. ✅

7. Naviguer entre les aides avec les flèches
   → Smooth transitions ✅

8. Montrer la projection financière
   → Graphique avec CA actuel vs projeté ✅
```

## 📞 Support

Si vous êtes bloqué:
1. Vérifiez les logs Vercel: https://vercel.com/dashboard → votre projet → Logs
2. Vérifiez les logs Supabase: Dashboard → Logs
3. Consultez les guides:
   - `SUPABASE_EMAIL_FIX.md` (guide détaillé)
   - `VERCEL_DEPLOYMENT.md` (guide de déploiement)

---

**Vous êtes prêt! Bonne chance pour le hackathon! 🚀🎉**
