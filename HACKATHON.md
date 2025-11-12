# 🏆 Présentation Hackathon Code4Sud

## 📌 Projet : Assistant IA pour Aides aux Entreprises

### Problématique Identifiée

Les dirigeants de TPE/PME font face à plusieurs défis majeurs :
- 🤯 **Complexité** : Des centaines de dispositifs d'aides dispersés
- ⏰ **Temps perdu** : Recherches manuelles longues et fastidieuses
- 😕 **Méconnaissance** : Aides méconnues, notamment au niveau local/métropolitain
- 📊 **Manque de visibilité** : Difficulté à évaluer l'impact financier potentiel

**Impact** : Sous-utilisation massive des aides publiques disponibles

### Notre Solution : Assistant IA Intelligent

Une plateforme web qui **automatise et simplifie** l'accès aux aides publiques grâce à l'intelligence artificielle.

## ✨ Fonctionnalités Clés

### 1️⃣ Récupération Automatique des Données
- Saisie simple du SIRET (14 chiffres)
- Récupération instantanée via **API INSEE officielle**
- Profil complet de l'entreprise sans ressaisie

### 2️⃣ Analyse IA Personnalisée
- **Claude AI (Anthropic)** analyse le profil entreprise
- Identification des aides pertinentes selon :
  - Secteur d'activité (Code APE)
  - Taille de l'entreprise (effectif)
  - Localisation géographique
  - Ancienneté
  - Forme juridique

### 3️⃣ Recommandations Multi-Niveaux
Aides identifiées à tous les niveaux :
- 🏙️ **Local** : Métropole Aix-Marseille-Provence
- 🗺️ **Régional** : Région Sud - PACA
- 🇫🇷 **National** : BPI France, ADEME, France 2030...
- 🇪🇺 **Européen** : FEDER, FSE+, Horizon Europe...

### 4️⃣ Dashboard Intelligent
- **Filtrage avancé** par type et niveau d'aide
- **Scores de pertinence** (0-100%)
- **Critères d'éligibilité** clairement affichés
- **Montants estimés** pour chaque aide

### 5️⃣ Projection Financière
- Graphiques de **CA actuel vs CA projeté**
- Calcul de l'**impact des aides**
- **Montant total** des aides potentielles
- Visualisation claire du gain estimé

## 🛠 Stack Technique Moderne

### Frontend
- **Next.js 14** (App Router) - Framework React de dernière génération
- **TypeScript** - Sécurité et maintenabilité du code
- **Tailwind CSS** - Design moderne et responsive
- **Recharts** - Visualisations interactives

### Backend
- **Next.js API Routes** - API serverless
- **Supabase** - Base de données PostgreSQL + Auth
- **Row Level Security** - Sécurité des données utilisateur

### Intelligence Artificielle
- **Claude 3.5 Sonnet (Anthropic)** - Modèle IA de pointe
- Analyse contextuelle avancée
- Génération de recommandations personnalisées

### Intégrations
- **API INSEE Sirene V3** - Données officielles entreprises
- **Supabase Auth** - Authentification sécurisée

## 🎯 Valeur Ajoutée

### Pour les Entreprises
✅ **Gain de temps** : De plusieurs heures à quelques minutes
✅ **Exhaustivité** : Aucune aide oubliée
✅ **Pertinence** : Seulement les aides adaptées
✅ **Simplicité** : Interface intuitive
✅ **Gratuit** : Accessible à tous

### Pour la Métropole & Collectivités
✅ **Visibilité accrue** des dispositifs locaux
✅ **Augmentation du taux de recours** aux aides
✅ **Meilleure allocation** des ressources
✅ **Impact économique territorial** renforcé

### Pour l'Écosystème
✅ **Démocratisation** de l'accès aux aides
✅ **Boost économique** pour les TPE/PME
✅ **Innovation** facilitée
✅ **Développement local** stimulé

## 📊 Cas d'Usage Concret

**Exemple : PME de 15 salariés dans le secteur tech à Marseille**

1. **Saisie SIRET** → 5 secondes
2. **Récupération données** → 2 secondes
3. **Analyse IA** → 15 secondes
4. **Résultats** :
   - 10 aides identifiées
   - 3 aides métropolitaines
   - 2 aides régionales
   - 3 aides nationales
   - 2 aides européennes
   - **Total estimé : 120 000 €** d'aides potentielles

**Avant** : 8-10 heures de recherche manuelle
**Maintenant** : 22 secondes
**ROI** : **Énorme** 🚀

## 🔒 Sécurité & Conformité

- ✅ Authentification sécurisée (Supabase Auth)
- ✅ Row Level Security (RLS) sur toutes les données
- ✅ Données INSEE publiques (RGPD compliant)
- ✅ Chiffrement des données en transit et au repos
- ✅ Validation côté serveur (Zod)

## 📈 Évolutivité Future

### Phase 2 (Post-MVP)
- 📄 Export PDF des recommandations
- 🔔 Alertes nouvelles aides
- 📧 Notifications email
- ⭐ Système de favoris
- 📊 Suivi des candidatures

### Phase 3 (Long terme)
- 🤖 Chatbot assistance
- 📝 Aide au remplissage des dossiers
- 🔗 Connexion directe aux plateformes de candidature
- 📊 Analytics pour collectivités
- 🌐 Base de données d'aides exhaustive et mise à jour

## 💰 Modèle Économique Potentiel

### Freemium
- **Gratuit** : Analyse de base + 5 premières aides
- **Premium** (29€/mois) : Illimité + Export PDF + Alertes
- **Entreprise** (99€/mois) : Multi-utilisateurs + API + Support

### B2G (Business to Government)
- Licence pour collectivités locales
- Personnalisation par territoire
- Analytics et reporting

## 🎬 Démo Live

1. **Landing Page** → Design moderne et attractif
2. **Inscription** → Simple et rapide
3. **Dashboard** → Interface claire
4. **Analyse SIRET** → Récupération données INSEE
5. **IA en action** → Génération recommandations
6. **Résultats** → Liste personnalisée avec filtres
7. **Projections** → Graphiques impactants

## 🏅 Points Forts du Projet

1. **🎯 Répond parfaitement au problème** identifié dans le hackathon
2. **🚀 MVP fonctionnel** prêt à déployer
3. **💡 Innovation technologique** (IA + API officielles)
4. **🎨 UX/UI soignée** et professionnelle
5. **📈 Scalable** et évolutif
6. **💰 Modèle économique** viable
7. **🌍 Impact social** positif
8. **⚡ Performance** optimale

## 📦 Livrables

- ✅ Code source complet et commenté
- ✅ Documentation détaillée (README.md)
- ✅ Guide de démarrage rapide (QUICK_START.md)
- ✅ Schéma base de données SQL
- ✅ Scripts de migration Supabase
- ✅ Configuration complète
- ✅ Application fonctionnelle déployable

## 🎓 Technologies Apprises/Utilisées

- Next.js 14 App Router
- Anthropic Claude AI SDK
- API INSEE Sirene
- Supabase (PostgreSQL + Auth + RLS)
- TypeScript avancé
- Tailwind CSS
- Recharts
- Middleware Next.js
- Server Components vs Client Components

## 📞 Prochaines Étapes

1. **Déploiement Vercel** → En production
2. **Beta testing** → Avec vraies entreprises
3. **Feedback utilisateurs** → Itération
4. **Partenariats** → Métropole, CCI, incubateurs
5. **Extension BDD aides** → Crawling + Curation
6. **Mobile app** → React Native

## 🎉 Conclusion

Notre solution **transforme radicalement** l'accès aux aides publiques :
- De **complexe** → **simple**
- De **manuel** → **automatique**
- De **heures** → **secondes**
- De **approximatif** → **précis**

Un **vrai impact** pour les entreprises et les territoires ! 🚀

---

**Merci au jury et à l'organisation du Code4Sud ! 🙏**
