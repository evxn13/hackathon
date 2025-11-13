# Implémentation des Codes Postaux Multiples

## Résumé des Changements

Cette mise à jour permet aux utilisateurs d'entrer **plusieurs codes postaux** pour leur entreprise, correspondant aux différentes zones géographiques où ils opèrent. Les codes postaux sont maintenant **obligatoires** et doivent être au format complet **5 chiffres** (ex: 75000, 13001).

## Changements Effectués

### 1. Base de Données (Migration 007)

**Fichier**: `supabase/migrations/007_multiple_postal_codes.sql`

- ✅ Ajout d'une nouvelle colonne `code_postaux` (type JSONB array)
- ✅ Migration automatique des données existantes (`code_postal` → `code_postaux`)
- ✅ Contrainte: au moins un code postal obligatoire
- ✅ Contrainte: validation du format array
- ✅ Ancienne colonne `code_postal` conservée pour rétro-compatibilité

```sql
ALTER TABLE companies ADD COLUMN code_postaux JSONB DEFAULT '[]'::jsonb;
ALTER TABLE companies ADD CONSTRAINT code_postaux_not_empty
  CHECK (jsonb_array_length(code_postaux) > 0);
```

### 2. Interface Utilisateur - CompanyInput.tsx

**Fichier**: `components/dashboard/CompanyInput.tsx`

**Nouvelles fonctionnalités** :
- ✅ Input dynamique pour ajouter plusieurs codes postaux
- ✅ Validation stricte: exactement 5 chiffres requis
- ✅ Validation: pas de doublons
- ✅ Affichage des codes postaux sous forme de badges supprimables
- ✅ Touche "Entrée" pour ajouter rapidement
- ✅ Validation obligatoire: au moins 1 code postal

**Interface** :
```typescript
// État pour gérer plusieurs codes postaux
const [codePostaux, setCodePostaux] = useState<string[]>([]);
const [currentCodePostal, setCurrentCodePostal] = useState('');

// Validation 5 chiffres
const validateCodePostal = (code: string): boolean => {
  return /^\d{5}$/.test(code);
};
```

### 3. API Routes

#### 3.1 Company Manual Route
**Fichier**: `app/api/company-manual/route.ts`

- ✅ Schéma Zod mis à jour pour accepter un array de codes postaux
- ✅ Validation regex: chaque code doit être exactement 5 chiffres
- ✅ Minimum 1 code postal requis

```typescript
code_postaux: z.array(z.string().regex(/^\d{5}$/, 'Code postal invalide'))
  .min(1, 'Au moins un code postal est requis'),
```

#### 3.2 INSEE Data Route
**Fichier**: `app/api/insee-data/route.ts`

- ✅ Conversion automatique du code postal unique en array
- ✅ Rétro-compatibilité avec les données mock

```typescript
code_postaux: [mock.code_postal], // Convert to array
```

### 4. Utilitaires Géographiques

**Fichier**: `lib/geo-utils.ts`

**Nouvelle fonction**: `getMultiGeoContext()`

- ✅ Traite plusieurs codes postaux simultanément
- ✅ Retourne les départements/régions/métropoles uniques
- ✅ Gère les cas limites (array vide)

```typescript
export interface MultiGeoContext {
  codePostaux: string[];
  departements: string[];
  departementsNames: string[];
  regions: string[];
  metropoles: string[];
  primaryLocation: GeoContext;
}
```

**Logique** :
- Extrait les contextes géographiques de chaque code postal
- Déduplique les valeurs (départements, régions)
- Conserve la localisation primaire (premier code postal)

### 5. Affichage des Aides - AidesGeoDisplay.tsx

**Fichier**: `components/dashboard/AidesGeoDisplay.tsx`

**Améliorations** :
- ✅ Utilise `getMultiGeoContext()` au lieu de `getGeoContext()`
- ✅ Affiche tous les codes postaux sous forme de badges
- ✅ Affiche les départements/régions au pluriel si plusieurs
- ✅ Rétro-compatibilité avec `code_postal` unique

```typescript
// Utilise code_postaux si disponible, sinon fallback sur code_postal
const postalCodes = company.code_postaux && company.code_postaux.length > 0
  ? company.code_postaux
  : company.code_postal ? [company.code_postal] : [];

const geoContext = useMemo(() => getMultiGeoContext(postalCodes), [postalCodes]);
```

**Affichage amélioré** :
```tsx
<div className="mb-4 flex flex-wrap gap-2">
  {geoContext.codePostaux.map((cp) => (
    <div key={cp} className="px-3 py-1 bg-white/20 rounded-full">
      {cp}
    </div>
  ))}
</div>
```

### 6. Types TypeScript

**Fichier**: `lib/types.ts`

- ✅ Ajout de `code_postaux?: string[]` à l'interface `Company`
- ✅ Ajout de `emploi_handicap?: boolean`
- ✅ Documentation inline pour champs dépréciés

```typescript
export interface Company {
  // ...
  code_postal: string; // Deprecated: kept for backward compatibility
  code_postaux?: string[]; // Array of postal codes where company operates
  emploi_handicap?: boolean;
  // ...
}
```

## Fonctionnalités Clés

### ✅ Validation Stricte
- Format: exactement **5 chiffres** (ex: 75000, pas 75)
- Au moins **1 code postal obligatoire**
- Pas de doublons acceptés

### ✅ Interface Intuitive
- Ajout facile avec bouton "Ajouter" ou touche "Entrée"
- Badges visuels pour chaque code postal
- Suppression simple avec croix (×)

### ✅ Affichage Intelligent
- Agrégation automatique des zones (départements, régions)
- Pluralisation automatique ("Département" vs "Départements")
- Affichage clair de toutes les zones couvertes

### ✅ Rétro-compatibilité
- Support des anciennes données avec `code_postal` unique
- Migration automatique lors du déploiement
- Pas de perte de données

## Déploiement

### Étapes à suivre :

1. **Exécuter la migration SQL** dans Supabase :
   ```bash
   # Via Supabase Dashboard
   # SQL Editor → Nouvelle requête → Coller le contenu de 007_multiple_postal_codes.sql
   ```

2. **Tester localement** :
   ```bash
   npm run dev
   # Tester la saisie manuelle avec plusieurs codes postaux
   ```

3. **Déployer sur Vercel** :
   ```bash
   git add .
   git commit -m "feat: support multiple postal codes"
   # Push via Vercel CLI ou dashboard
   ```

4. **Vérifier en production** :
   - Créer une nouvelle entreprise avec plusieurs codes postaux
   - Vérifier l'affichage des zones géographiques
   - Tester les recommandations d'aides

## Cas d'Usage

### Exemple 1: Entreprise Multi-Régionale
```
Codes postaux: 13001, 75000, 69001
→ Départements: Bouches-du-Rhône, Paris, Rhône
→ Régions: PACA, Île-de-France, Auvergne-Rhône-Alpes
→ Aides affichées: toutes les aides pertinentes pour ces 3 zones
```

### Exemple 2: Entreprise Métropolitaine
```
Codes postaux: 13001, 13090, 13127
→ Départements: Bouches-du-Rhône
→ Région: PACA
→ Métropole: Aix-Marseille-Provence
→ Aides locales + départementales + régionales
```

## Notes Techniques

### Performance
- Utilisation de `useMemo()` pour éviter les recalculs inutiles
- Dédupplication efficace avec `Set()`
- Requêtes optimisées avec JSONB

### Sécurité
- Validation côté client ET serveur
- Schéma Zod pour toutes les entrées
- Contraintes SQL pour intégrité des données

### Accessibilité
- Labels clairs et descriptifs
- Messages d'erreur explicites
- Support clavier (Entrée pour ajouter)

## Améliorations Futures

- [ ] Autocomplétion des codes postaux
- [ ] Validation avec API gouvernementale
- [ ] Carte interactive pour sélection visuelle
- [ ] Import CSV pour entreprises avec nombreuses zones
- [ ] Détection automatique de métropoles adjacentes

## Fichiers Modifiés

1. ✅ `supabase/migrations/007_multiple_postal_codes.sql` - **NOUVEAU**
2. ✅ `components/dashboard/CompanyInput.tsx` - Saisie multiple
3. ✅ `app/api/company-manual/route.ts` - Validation array
4. ✅ `app/api/insee-data/route.ts` - Conversion array
5. ✅ `lib/geo-utils.ts` - Fonction multi-geo
6. ✅ `lib/types.ts` - Types mis à jour
7. ✅ `components/dashboard/AidesGeoDisplay.tsx` - Affichage multi-zones

---

**Date de mise en œuvre**: 13 novembre 2024
**Version**: 1.1.0
**Statut**: ✅ Prêt pour déploiement
