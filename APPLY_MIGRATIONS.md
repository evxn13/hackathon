# 🚀 Guide d'Application des Migrations Supabase

## 🚨 Problème Actuel

**Erreur** : `500 Internal Server Error` lors de l'ajout d'une entreprise via SIRET

**Cause** : Le champ `emploi_handicap` n'existe pas dans la table `companies` en production (Supabase).

**Solution** : Appliquer la migration `006_add_handicap_field.sql`

## 📋 Migrations en Attente

Les migrations suivantes doivent être appliquées dans Supabase :

| # | Fichier | Description | Status |
|---|---------|-------------|--------|
| 006 | 006_add_handicap_field.sql | Ajoute champ `emploi_handicap` | ❌ Non appliquée |
| 007 | 007_multiple_postal_codes.sql | Support codes postaux multiples | ❌ À vérifier |
| 008 | 008_add_insee_enriched_fields.sql | Ajoute 15 champs enrichis INSEE | ❌ À vérifier |
| 009 | 009_create_comparisons.sql | Table comparaisons | ❌ À vérifier |

## 🔧 Méthode 1 : Via l'Interface Supabase (Recommandée)

### Étape 1 : Accéder au SQL Editor

1. Aller sur [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Sélectionner votre projet
3. Cliquer sur **"SQL Editor"** dans le menu de gauche

### Étape 2 : Appliquer la Migration 006 (PRIORITAIRE)

1. Cliquer sur **"New query"**
2. Copier-coller le contenu de `supabase/migrations/006_add_handicap_field.sql` :

```sql
-- Ajouter un champ pour indiquer si l'entreprise emploie des travailleurs en situation de handicap
-- Cela permet de proposer des aides spécifiques (AGEFIPH, aides à l'embauche, etc.)

ALTER TABLE companies
ADD COLUMN emploi_handicap BOOLEAN DEFAULT false;

-- Commentaire pour documentation
COMMENT ON COLUMN companies.emploi_handicap IS 'Indique si l''entreprise emploie des travailleurs en situation de handicap (permet aides AGEFIPH)';
```

3. Cliquer sur **"Run"**
4. Vérifier qu'il n'y a pas d'erreur

### Étape 3 : Vérifier que la Migration a Réussi

Exécuter cette requête dans le SQL Editor :

```sql
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'companies'
AND column_name = 'emploi_handicap';
```

**Résultat attendu** :
```
column_name      | data_type | column_default
emploi_handicap  | boolean   | false
```

### Étape 4 : Appliquer les Autres Migrations (Optionnel mais Recommandé)

#### Migration 007 : Codes Postaux Multiples

```sql
-- Migration 007: Support pour plusieurs codes postaux (multi-sites)
-- Permet à une entreprise d'avoir plusieurs zones géographiques d'activité

-- Ajouter colonne code_postaux (array)
ALTER TABLE companies
ADD COLUMN code_postaux TEXT[] DEFAULT ARRAY[]::TEXT[];

-- Migrer les données existantes : code_postal → code_postaux
UPDATE companies
SET code_postaux = ARRAY[code_postal]
WHERE code_postal IS NOT NULL AND code_postaux = ARRAY[]::TEXT[];

-- Commentaire
COMMENT ON COLUMN companies.code_postaux IS 'Liste des codes postaux (zones géographiques d''activité de l''entreprise)';

-- Index pour recherche par code postal
CREATE INDEX IF NOT EXISTS idx_companies_code_postaux ON companies USING GIN (code_postaux);
```

#### Migration 008 : Champs Enrichis INSEE

```sql
-- Migration 008: Ajouter les champs enrichis de l'API INSEE
-- Ces champs permettent une meilleure analyse et recommandation d'aides

ALTER TABLE companies
ADD COLUMN IF NOT EXISTS categorie_entreprise TEXT,
ADD COLUMN IF NOT EXISTS tranche_effectif_code TEXT,
ADD COLUMN IF NOT EXISTS annee_effectif INTEGER,
ADD COLUMN IF NOT EXISTS est_siege_social BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS etat_administratif TEXT,
ADD COLUMN IF NOT EXISTS date_debut_activite DATE,
ADD COLUMN IF NOT EXISTS caractere_employeur TEXT,
ADD COLUMN IF NOT EXISTS nomenclature_activite TEXT,
ADD COLUMN IF NOT EXISTS adresse_complete TEXT,
ADD COLUMN IF NOT EXISTS complement_adresse TEXT,
ADD COLUMN IF NOT EXISTS code_commune TEXT,
ADD COLUMN IF NOT EXISTS departement TEXT,
ADD COLUMN IF NOT EXISTS economie_sociale_solidaire BOOLEAN DEFAULT false;

-- Commentaires
COMMENT ON COLUMN companies.categorie_entreprise IS 'PME, ETI, GE (Grande Entreprise)';
COMMENT ON COLUMN companies.tranche_effectif_code IS 'Code INSEE de la tranche d''effectif';
COMMENT ON COLUMN companies.economie_sociale_solidaire IS 'Entreprise de l''économie sociale et solidaire (ESS)';

-- Index pour recherches fréquentes
CREATE INDEX IF NOT EXISTS idx_companies_departement ON companies(departement);
CREATE INDEX IF NOT EXISTS idx_companies_ess ON companies(economie_sociale_solidaire) WHERE economie_sociale_solidaire = true;
```

#### Migration 009 : Table Comparaisons

```sql
-- Migration 009: Table pour stocker les comparaisons d'entreprises
CREATE TABLE IF NOT EXISTS company_comparisons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  company_a_id UUID REFERENCES companies(id) ON DELETE CASCADE NOT NULL,
  company_b_id UUID REFERENCES companies(id) ON DELETE CASCADE NOT NULL,

  -- Analyse IA
  analysis_summary TEXT NOT NULL,
  key_differences JSONB,
  opportunities_a JSONB,
  opportunities_b JSONB,
  strategic_insights TEXT,

  -- Statistiques
  total_aides_a INTEGER DEFAULT 0,
  total_aides_b INTEGER DEFAULT 0,
  aides_common INTEGER DEFAULT 0,
  aides_unique_a INTEGER DEFAULT 0,
  aides_unique_b INTEGER DEFAULT 0,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS
ALTER TABLE company_comparisons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own comparisons"
  ON company_comparisons FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create comparisons"
  ON company_comparisons FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comparisons"
  ON company_comparisons FOR DELETE
  USING (auth.uid() = user_id);

-- Index
CREATE INDEX idx_comparisons_user ON company_comparisons(user_id);
CREATE INDEX idx_comparisons_created ON company_comparisons(created_at DESC);
```

## 🔧 Méthode 2 : Via Supabase CLI (Avancé)

### Prérequis

```bash
npm install -g supabase
```

### Étapes

1. **Login Supabase** :
```bash
supabase login
```

2. **Lier au projet** :
```bash
supabase link --project-ref your-project-ref
```

3. **Appliquer toutes les migrations** :
```bash
supabase db push
```

4. **Vérifier le status** :
```bash
supabase migration list
```

## ✅ Vérification Post-Migration

### Test 1 : Vérifier la Structure

```sql
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'companies'
ORDER BY ordinal_position;
```

### Test 2 : Tester l'Insertion

```sql
INSERT INTO companies (
  user_id,
  siret,
  denomination,
  secteur,
  emploi_handicap
) VALUES (
  (SELECT id FROM auth.users LIMIT 1),
  '12345678901234',
  'Test Company',
  'Services',
  true
);
```

**Résultat attendu** : Pas d'erreur

### Test 3 : Tester via l'Interface

1. Aller sur votre app : https://hackathon-zeta-rose.vercel.app
2. Saisir un SIRET
3. Cocher "Emploi handicap"
4. Cliquer "Analyser"

**Résultat attendu** : Entreprise créée sans erreur 500

## 🚨 Troubleshooting

### Erreur : "column emploi_handicap already exists"

**Cause** : La migration a déjà été appliquée

**Solution** : Vérifier avec :
```sql
SELECT column_name FROM information_schema.columns
WHERE table_name = 'companies' AND column_name = 'emploi_handicap';
```

Si le champ existe, la migration est déjà appliquée. Passer à la migration suivante.

### Erreur : "permission denied"

**Cause** : Droits insuffisants

**Solution** : Utiliser l'interface Supabase (SQL Editor) qui a les droits admin.

### Erreur persistante 500

**Cause possible** : Autre champ manquant ou problème API

**Solution** :
1. Vérifier les logs Vercel : https://vercel.com/votre-projet/logs
2. Chercher "Insert error" pour voir le détail
3. Vérifier que TOUS les champs utilisés dans `companyData` existent dans la table

## 📊 État Actuel vs État Souhaité

### Avant Migration

```
Table companies:
- user_id
- siret
- denomination
- secteur
- code_ape
- effectif
- localisation
- code_postal
- date_creation
- forme_juridique
❌ emploi_handicap (MANQUANT)
```

### Après Migration 006

```
Table companies:
- user_id
- siret
- denomination
- secteur
- code_ape
- effectif
- localisation
- code_postal
- date_creation
- forme_juridique
✅ emploi_handicap (AJOUTÉ)
```

### Après Toutes les Migrations

```
Table companies:
- Champs de base (voir ci-dessus)
✅ emploi_handicap
✅ code_postaux (array)
✅ 13 champs enrichis INSEE
✅ economie_sociale_solidaire
✅ departement
```

```
Table company_comparisons:
✅ Nouvelle table créée
```

## 🎯 Action Immédiate Requise

**PRIORITÉ 1** : Appliquer la migration 006

```sql
ALTER TABLE companies
ADD COLUMN emploi_handicap BOOLEAN DEFAULT false;
```

Cela résoudra l'erreur 500 immédiatement.

**PRIORITÉ 2** : Appliquer les migrations 007, 008, 009

Pour activer toutes les fonctionnalités (multi-sites, enrichissement INSEE, comparaisons).

---

**Note** : Une fois les migrations appliquées, **redéployer l'application** sur Vercel pour s'assurer que les changements de code sont aussi en production.

## 📞 Support

Si problème persistant après migration :
1. Vérifier les logs Vercel
2. Vérifier la structure de la table dans Supabase
3. Tester une insertion manuelle via SQL Editor
