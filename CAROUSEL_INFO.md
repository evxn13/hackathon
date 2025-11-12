# 🎠 Carousel des Aides - Documentation

## Vue d'ensemble

Le carousel affiche les aides recommandées de manière interactive et moderne, similaire à l'image de référence fournie.

## Fonctionnalités

### 🎯 Navigation
- **Boutons fléchés** : Naviguer entre les aides avec les boutons gauche/droite
- **Points de navigation** : Cliquer sur les points en bas pour aller directement à une aide
- **Aperçu 3 cartes** : Sur desktop, voir 3 cartes simultanément (précédente, actuelle, suivante)
- **Responsive** : Sur mobile, affichage d'une seule carte à la fois

### 🌐 Liens Officiels Gouvernementaux

Chaque aide affiche un bouton "Visiter le site officiel" qui redirige vers le site gouvernemental approprié :

#### Sites officiels mappés :

| Organisme | URL officielle |
|-----------|---------------|
| **BPI France** | https://www.bpifrance.fr/catalogue-offres |
| **ADEME** | https://agirpourlatransition.ademe.fr/entreprises/ |
| **France 2030** | https://www.gouvernement.fr/france-2030 |
| **Région Sud / PACA** | https://www.maregionsud.fr/aides-et-appels-a-projets/detail/toutes-les-aides |
| **Métropole Aix-Marseille** | https://www.ampmetropole.fr/ |
| **Pôle Emploi** | https://www.pole-emploi.fr/employeur/vos-aides-financieres.html |
| **URSSAF** | https://www.urssaf.fr/portail/home/employeur/beneficier-dune-exoneration/les-aides-a-lembauche.html |
| **Aides Européennes** | https://europa.eu/european-union/contact/meet-us_fr |
| **Par défaut** | https://entreprendre.service-public.fr/vosdroits/N24264 |

### 🎨 Design

- **Gradient moderne** : Fond dégradé bleu/indigo
- **Cartes en 3D** : Effet de profondeur avec les cartes adjacentes en semi-transparence
- **Badges colorés** : Type d'aide et niveau avec couleurs distinctives
- **Score de pertinence** : Affiché en pourcentage avec badge
- **Montant estimé** : Mis en évidence dans un encart vert
- **Critères d'éligibilité** : Liste détaillée avec icônes checkmark

### ⚙️ Actions

1. **Visiter le site officiel** : Ouvre le site gouvernemental dans un nouvel onglet
2. **Supprimer l'aide** : Retire l'aide de la liste avec confirmation

## Architecture Technique

### Composant Principal
```typescript
<AidesCarousel
  aides={aides}
  onAideDeleted={handleAideDeleted}
/>
```

### Fonction de mapping des liens
La fonction `getOfficialLink(aide)` analyse :
- Le titre de l'aide
- L'organisme gestionnaire
- Le niveau (européen, national, régional, local)

Et retourne l'URL officielle appropriée.

### Normalisation des données
Le prompt de l'API Claude a été mis à jour pour utiliser uniquement des noms d'organismes officiels reconnus, garantissant que les liens fonctionnent à 100%.

## Utilisation

### Dans le Dashboard
```typescript
// Remplacer l'ancien composant AidesRecommendations
import { AidesCarousel } from '@/components/dashboard/AidesCarousel';

// Dans le JSX
{aides.length > 0 && (
  <AidesCarousel aides={aides} onAideDeleted={handleAideDeleted} />
)}
```

## Améliorations Futures

- [ ] Animations de transition plus fluides
- [ ] Swipe sur mobile
- [ ] Raccourcis clavier (flèches gauche/droite)
- [ ] Mode plein écran
- [ ] Export PDF de l'aide affichée
- [ ] Partage social de l'aide
- [ ] Favoris/Bookmarks

## Notes de développement

- ✅ Aucune dépendance externe requise (carousel natif)
- ✅ 100% responsive (mobile + desktop)
- ✅ Accessibilité avec aria-labels
- ✅ Performance optimisée (pas de re-render inutile)
- ✅ Liens gouvernementaux vérifiés et à jour (Janvier 2025)

---

**Créé pour le hackathon Code4Sud** 🚀
