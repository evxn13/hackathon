# 📧 Corriger les Emails de Confirmation Supabase

## Problème

Les emails de confirmation Supabase contiennent des liens qui pointent vers `localhost:3000` au lieu de votre URL de production Vercel.

## Solution

### Étape 1: Configurer l'URL du site

1. **Allez sur Supabase Dashboard**: https://app.supabase.com
2. **Sélectionnez votre projet**: `fkumjwfkxqqeyqnkykjf`
3. **Authentication → URL Configuration**
4. **Modifiez "Site URL"**:
   ```
   https://votre-app.vercel.app
   ```
   ⚠️ Remplacez par votre vraie URL Vercel!

5. **Ajoutez les "Redirect URLs"**:
   ```
   https://votre-app.vercel.app/**
   https://votre-app.vercel.app/auth/callback
   http://localhost:3000/**
   http://localhost:3000/auth/callback
   ```
   Note: `/**` permet tous les chemins sous ce domaine

6. **Cliquez sur "Save"**

### Étape 2: Vérifier les Templates d'Email

1. Toujours dans **Authentication**
2. Cliquez sur **Email Templates** (dans la barre latérale)
3. Vérifiez ces templates:

#### Template "Confirm signup"

Assurez-vous que le template contient `{{ .SiteURL }}` et pas une URL en dur:

```html
<h2>Confirm your signup</h2>

<p>Follow this link to confirm your user:</p>
<p><a href="{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email">Confirm your email</a></p>
```

Si vous voyez `localhost:3000` en dur dans le template, remplacez-le par `{{ .SiteURL }}`.

#### Template "Magic Link"

```html
<h2>Magic Link</h2>

<p>Follow this link to login:</p>
<p><a href="{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=magiclink">Log In</a></p>
```

#### Template "Reset Password"

```html
<h2>Reset Password</h2>

<p>Follow this link to reset your password:</p>
<p><a href="{{ .SiteURL }}/auth/reset-password?token_hash={{ .TokenHash }}&type=recovery">Reset Password</a></p>
```

### Étape 3: Créer la Route de Callback

Créez le fichier pour gérer la confirmation d'email:

**Fichier: `app/auth/confirm/route.ts`**

```typescript
import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get('token_hash');
  const type = searchParams.get('type');

  if (token_hash && type) {
    const supabase = createClient();

    const { error } = await supabase.auth.verifyOtp({
      type: type as any,
      token_hash,
    });

    if (!error) {
      // Rediriger vers le dashboard après confirmation
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  // En cas d'erreur, rediriger vers la page de login
  return NextResponse.redirect(new URL('/auth/login?error=confirmation_failed', request.url));
}
```

### Étape 4: Tester

1. **Créez un nouveau compte** depuis votre site en production
2. **Vérifiez l'email** que vous recevez
3. Le lien doit maintenant pointer vers `https://votre-app.vercel.app`
4. Cliquez sur le lien → vous devriez être redirigé vers le dashboard

## 🔍 Vérification

Pour vérifier que tout fonctionne:

```bash
# 1. Créer un nouveau compte sur votre site en production
# 2. Vérifier l'email reçu
# 3. Le lien doit contenir votre URL Vercel, pas localhost
# 4. Cliquer sur le lien doit confirmer le compte et rediriger vers /dashboard
```

## 🚨 Problèmes Courants

### "Invalid redirect URL"
**Cause**: L'URL de redirection n'est pas dans la liste autorisée
**Solution**: Vérifiez que vous avez bien ajouté `https://votre-app.vercel.app/**` dans les Redirect URLs

### "Token expired"
**Cause**: Le token de confirmation a expiré (valide 24h par défaut)
**Solution**: Demandez un nouvel email de confirmation

### Les emails contiennent toujours localhost
**Cause**: La "Site URL" n'a pas été changée dans Supabase
**Solution**:
1. Allez dans Authentication → URL Configuration
2. Changez "Site URL" pour votre URL Vercel
3. Sauvegardez
4. Testez avec un nouveau compte

### "Email not confirmed" mais j'ai cliqué sur le lien
**Cause**: La route `/auth/confirm` n'existe pas
**Solution**: Créez le fichier `app/auth/confirm/route.ts` (voir Étape 3)

## 🎯 Configuration Finale

Voici ce que vous devriez avoir dans Supabase:

### Authentication → URL Configuration

```
Site URL: https://votre-app.vercel.app

Redirect URLs:
  https://votre-app.vercel.app/**
  https://votre-app.vercel.app/auth/callback
  http://localhost:3000/**
  http://localhost:3000/auth/callback
```

### Email Templates

Tous les templates doivent utiliser `{{ .SiteURL }}` au lieu d'une URL en dur.

## 💡 Astuce Pro

Si vous voulez désactiver temporairement la confirmation d'email (pour le hackathon):

1. **Authentication → Providers → Email**
2. **Décochez "Confirm email"**
3. **Sauvegardez**

⚠️ **Attention**: Cela permet à n'importe qui de créer un compte sans vérification. À n'utiliser qu'en développement/hackathon!

## 📚 Ressources

- [Documentation Supabase - Email Templates](https://supabase.com/docs/guides/auth/auth-email-templates)
- [Documentation Supabase - Redirect URLs](https://supabase.com/docs/guides/auth/redirect-urls)

---

**Bon courage pour le hackathon! 🚀**
