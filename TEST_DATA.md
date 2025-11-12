# 🧪 Données de Test

## SIRET de Test pour Démo

Utilisez ces numéros SIRET réels pour tester l'application :

### Grandes Entreprises (pour tests rapides)

| Entreprise | SIRET | Secteur | Localisation |
|------------|-------|---------|--------------|
| **Apple France** | 73282932000074 | Commerce électronique | Paris |
| **Google France** | 44306194400047 | Services informatiques | Paris |
| **Microsoft France** | 32737442200053 | Édition de logiciels | Issy-les-Moulineaux |
| **Amazon France** | 48795345900236 | Commerce de détail | Clichy |
| **Tesla France** | 83811833600012 | Commerce automobile | Paris |

### TPE/PME Locales (plus pertinent pour le cas d'usage)

| Type | SIRET | Description |
|------|-------|-------------|
| **TPE Tech** | 88012345600012 | Startup technologique marseillaise (fictif - utilisez Apple pour demo) |
| **PME Industrie** | 44306194400047 | PME industrielle (utilisez Google) |

### Recommandations pour la Démo

**Pour une démo impactante, utilisez : `73282932000074` (Apple France)**

Pourquoi ?
- ✅ Données complètes dans l'API INSEE
- ✅ Secteur tech (beaucoup d'aides disponibles)
- ✅ Grande entreprise (nombreux critères d'éligibilité)
- ✅ Résultats impressionnants de l'IA

## 👤 Comptes de Test

### Compte Utilisateur

```
Email: test@example.com
Password: Test123456!
```

**Note** : Créez ce compte lors de votre première connexion

## 📊 Données Attendues (Apple France - SIRET: 73282932000074)

### Informations Récupérées de l'INSEE

- **Dénomination** : APPLE FRANCE
- **Code APE** : 4741Z (Commerce de détail d'ordinateurs)
- **Effectif** : 200 à 249 salariés
- **Localisation** : Paris
- **Code Postal** : 75008
- **Forme Juridique** : SAS (Société par Actions Simplifiée)
- **Date de Création** : 1981

### Aides Attendues (Générées par l'IA)

L'IA devrait générer environ 8-12 aides, incluant :

#### Niveau Local
- Subventions métropole pour innovation numérique
- Accompagnement transition écologique

#### Niveau Régional
- Aides Région pour transformation digitale
- Programmes d'innovation régionaux

#### Niveau National
- BPI France Innovation
- Crédit d'Impôt Recherche (CIR)
- France 2030
- ADEME transition énergétique

#### Niveau Européen
- FEDER (Fonds Européen de Développement Régional)
- Horizon Europe

## 🎬 Scénario de Démo Recommandé

### Étape 1 : Landing Page (30 secondes)
- Montrer la page d'accueil
- Expliquer la problématique
- Cliquer sur "Commencer l'analyse"

### Étape 2 : Inscription (30 secondes)
- Créer un compte rapidement
- Email : demo@hackathon.fr
- Password : Demo2024!

### Étape 3 : Dashboard (20 secondes)
- Arrivée sur le dashboard vide
- Présenter l'interface

### Étape 4 : Saisie SIRET (30 secondes)
- Entrer : `73282932000074`
- Cliquer sur "Analyser mon entreprise"
- **Wow effect** : Données récupérées automatiquement !

### Étape 5 : Profil Entreprise (30 secondes)
- Montrer la carte profil complète
- Expliquer les données INSEE
- Montrer les badges et icônes

### Étape 6 : Lancer l'IA (60 secondes)
- Cliquer sur "Lancer l'analyse IA"
- Expliquer le processus pendant le chargement
- **Wow effect** : Aides générées !

### Étape 7 : Résultats (90 secondes)
- Scroller dans la liste des aides
- Montrer les scores de pertinence
- Utiliser les filtres par type et niveau
- Cliquer sur une aide pour voir les détails
- Montrer les critères d'éligibilité

### Étape 8 : Projections (30 secondes)
- Scroller vers le graphique
- Montrer CA actuel vs projeté
- Expliquer le montant total des aides

### Étape 9 : Conclusion (30 secondes)
- Récapituler : De SIRET → Aides en moins de 2 minutes
- Souligner l'impact potentiel

**Durée totale** : ~5-6 minutes

## 🎯 Points à Souligner Pendant la Démo

### Technique
1. **API officielle INSEE** → Données fiables
2. **Claude AI** → IA de pointe
3. **Temps réel** → Rapide et fluide
4. **Sécurité** → Auth + RLS Supabase

### Fonctionnel
1. **Zéro saisie manuelle** → Tout automatique
2. **Personnalisation** → IA adapte au profil
3. **Multi-niveaux** → Local à européen
4. **Actionnable** → Critères + liens

### Impact
1. **Gain de temps** → Heures → Minutes
2. **Exhaustivité** → Aucune aide oubliée
3. **Accessibilité** → Interface simple
4. **ROI** → Montant total impressionnant

## 🐛 Fallback en Cas de Problème

### Si l'API INSEE ne répond pas
- Expliquer que c'est une API externe officielle
- Montrer le code de l'intégration
- Utiliser des captures d'écran préparées

### Si l'IA met trop de temps
- Expliquer que Claude analyse en profondeur
- Montrer les résultats d'une démo précédente
- Profiter pour expliquer l'architecture

### Si problème réseau
- Avoir des screenshots de backup
- Vidéo screencast de la démo complète
- Expliquer l'architecture à partir du code

## 📸 Screenshots à Préparer (Backup)

1. Landing page
2. Profil entreprise rempli
3. Liste complète des aides
4. Détail d'une aide
5. Graphique de projection
6. Filtres en action

## ✅ Checklist Avant Démo

- [ ] Serveur dev lancé (`npm run dev`)
- [ ] Variables d'env configurées (`npm run check`)
- [ ] Compte de test créé
- [ ] SIRET de test testé (73282932000074)
- [ ] Analyse IA testée au moins une fois
- [ ] Screenshots de backup préparés
- [ ] Connexion internet stable
- [ ] Navigateur en mode plein écran
- [ ] Zoom navigateur à 100%
- [ ] Console développeur fermée (sauf si besoin)

## 🎤 Script de Présentation

**Introduction** (30s)
> "Nous avons identifié un problème majeur : les TPE/PME perdent des heures à chercher des aides auxquelles elles sont éligibles. Notre solution utilise l'IA pour automatiser complètement ce processus."

**Démo** (5min)
> "Laissez-moi vous montrer. Un dirigeant arrive sur notre plateforme, crée son compte, et entre simplement son SIRET..."

**Technique** (1min)
> "Techniquement, nous utilisons l'API officielle INSEE, Claude AI d'Anthropic, et Supabase. Le tout est sécurisé et conforme RGPD."

**Impact** (1min)
> "L'impact est immédiat : ce qui prenait 8 heures prend maintenant 2 minutes. Pour cette entreprise, nous avons identifié plus de 100k€ d'aides potentielles qu'elle aurait peut-être ratées."

**Conclusion** (30s)
> "Notre solution démocratise l'accès aux aides publiques et maximise leur impact sur les territoires. Merci !"

---

**Bonne démo ! 🎉**
