# 📝 Changelog - Carousel & Déploiement

## 🎠 Nouveau Carousel des Aides

### Fichiers créés
1. **`components/dashboard/AidesCarousel.tsx`** - Composant carousel moderne
2. **`CAROUSEL_INFO.md`** - Documentation du carousel
3. **`VERCEL_DEPLOYMENT.md`** - Guide de déploiement complet
4. **`check-deployment.js`** - Script de vérification pre-déploiement

### Fichiers modifiés
1. **`app/dashboard/page.tsx`**
   - Import de `AidesCarousel` au lieu de `AidesRecommendations`
   - Utilisation du nouveau carousel dans le JSX

2. **`app/api/analyze-company/route.ts`**
   - Ajout de la section "Organismes officiels" dans le prompt
   - Guide l'IA pour utiliser uniquement les noms d'organismes reconnus

3. **`app/page.tsx`**
   - Augmentation du padding du footer (py-12 au lieu de py-8)
   - Ajout de margin-top (mt-16)
   - Amélioration de l'espacement des textes

4. **`package.json`**
   - Ajout du script `check-deploy`

## ✨ Fonctionnalités du Carousel

### Navigation
- ✅ Boutons fléchés gauche/droite
- ✅ Points de navigation cliquables
- ✅ Affichage 3 cartes sur desktop (preview left + center + preview right)
- ✅ Affichage 1 carte sur mobile (responsive)
- ✅ Animations smooth

### Affichage des Aides
- ✅ Design moderne avec gradient bleu/indigo
- ✅ Carte centrale avec border bleue épaisse
- ✅ Badge de score de pertinence (en %)
- ✅ Badges colorés pour type_aide et niveau
- ✅ Montant estimé dans encart vert
- ✅ Description complète de l'aide
- ✅ Organisme gestionnaire
- ✅ Critères d'éligibilité avec checkmarks

### Liens Officiels Gouvernementaux
La fonction `getOfficialLink()` mappe automatiquement vers:

| Organisme détecté | URL officielle |
|-------------------|----------------|
| BPI France / Bpifrance | https://www.bpifrance.fr/catalogue-offres |
| ADEME | https://agirpourlatransition.ademe.fr/entreprises/ |
| France 2030 | https://www.gouvernement.fr/france-2030 |
| Région Sud | https://www.maregionsud.fr/aides-et-appels-a-projets |
| Métropole AMP | https://www.ampmetropole.fr/ |
| Pôle Emploi | https://www.pole-emploi.fr/employeur/vos-aides-financieres.html |
| URSSAF | https://www.urssaf.fr/portail/home/employeur/beneficier-dune-exoneration/les-aides-a-lembauche.html |
| Aides européennes | https://europa.eu/european-union/contact/meet-us_fr |
| Par défaut | https://entreprendre.service-public.fr/vosdroits/N24264 |

### Actions
- ✅ **Bouton "Visiter le site officiel"** - Ouvre le site gouvernemental dans un nouvel onglet
- ✅ **Bouton "Supprimer"** - Retire l'aide avec confirmation

### Compteur
- ✅ "Aide X sur Y" affiché en bas du carousel

## 🚀 Préparation au Déploiement

### Nouveaux Outils

#### Script `check-deploy`
```bash
npm run check-deploy
```

Vérifie:
- ✅ Présence de toutes les variables d'environnement
- ✅ Présence des fichiers critiques du projet
- ✅ Configuration du .gitignore
- ⚠️ Avertit si NEXT_PUBLIC_APP_URL pointe vers localhost
- ✅ Donne les étapes suivantes à suivre

### Variables d'Environnement pour Vercel

**À ajouter dans Vercel → Settings → Environment Variables:**

```env
NEXT_PUBLIC_SUPABASE_URL=https://fkumjwfkxqqeyqnkykjf.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
ANTHROPIC_API_KEY=sk-ant-api03-1YKkkInMW0YKynZOgDVUalrv65pIpr3ideJtDLfrcZVOdIwRYhZ...
INSEE_API_KEY=4678a69d-e747-44ae-bdbd-eed2fbb0dc01
INSEE_API_SECRET=0apA3hPs6QiE8MamjpcS0Hy5LTS0EvE5
NEXT_PUBLIC_APP_URL=https://votre-app.vercel.app
```

### Configuration Supabase Post-Déploiement

⚠️ **CRUCIAL pour l'authentification!**

Dans Supabase Dashboard → Authentication → URL Configuration:
- **Site URL**: `https://votre-app.vercel.app`
- **Redirect URLs**:
  - `https://votre-app.vercel.app/auth/callback`
  - `http://localhost:3000/auth/callback`

## 📊 Métriques du Carousel

### Performance
- ⚡ Aucune dépendance externe (carousel natif)
- ⚡ Pas de re-render inutile
- ⚡ Optimisé pour mobile et desktop
- ⚡ Transitions CSS smooth

### Accessibilité
- ✅ aria-labels sur les boutons
- ✅ Navigation au clavier possible
- ✅ Contraste des couleurs WCAG AA

### Responsive
- 📱 Mobile: 1 carte visible
- 💻 Desktop: 3 cartes (preview + active + preview)
- 📐 Breakpoint: md (768px)

## 🐛 Bugs Corrigés

1. **Footer coupé sur landing page**
   - Ajout de `mt-16` sur le footer
   - Augmentation du padding à `py-12`

2. **Erreur MIDDLEWARE_INVOCATION_FAILED sur Vercel**
   - Cause: `NEXT_PUBLIC_APP_URL` avec localhost
   - Solution: Documenté dans VERCEL_DEPLOYMENT.md

## 🎯 Prochaines Étapes

### Avant le Hackathon
- [ ] Tester le carousel localement
- [ ] Exécuter `npm run check-deploy`
- [ ] Pousser le code sur GitHub
- [ ] Déployer sur Vercel
- [ ] Configurer les Redirect URLs dans Supabase
- [ ] Tester l'authentification en production
- [ ] Tester l'analyse IA en production
- [ ] Préparer la démo pour le jury

### Améliorations Futures
- [ ] Swipe sur mobile
- [ ] Raccourcis clavier (flèches)
- [ ] Animation de transition entre cartes
- [ ] Export PDF de l'aide affichée
- [ ] Partage social
- [ ] Système de favoris

## 📚 Documentation Ajoutée

1. **CAROUSEL_INFO.md** - Documentation technique du carousel
2. **VERCEL_DEPLOYMENT.md** - Guide complet de déploiement
3. **CHANGELOG_CAROUSEL.md** - Ce fichier

## 💡 Notes Techniques

### Mapping des Liens
Le mapping vers les sites officiels se fait via analyse de chaînes:
- Détection du nom de l'organisme (case-insensitive)
- Détection de mots-clés dans le titre
- Vérification du niveau (européen, national, etc.)
- Fallback vers service-public.fr

### Normalisation des Données IA
Les fonctions `normalizeTypeAide()` et `normalizeNiveau()` garantissent que les données générées par Claude respectent les contraintes de la base de données.

---

**Version**: 1.1.0
**Date**: 2025-01-12
**Auteur**: Assistant IA + Équipe Code4Sud
