-- Modification pour permettre les entreprises sans SIRET (saisie manuelle)

-- 1. Rendre le SIRET nullable
ALTER TABLE companies ALTER COLUMN siret DROP NOT NULL;

-- 2. Supprimer la contrainte UNIQUE sur SIRET et la recréer en permettant les NULL multiples
ALTER TABLE companies DROP CONSTRAINT IF EXISTS companies_siret_key;

-- Créer un index unique partiel qui ignore les valeurs NULL
CREATE UNIQUE INDEX companies_siret_unique_when_not_null
  ON companies(siret)
  WHERE siret IS NOT NULL;

-- 3. Rendre certains champs optionnels pour la saisie manuelle
ALTER TABLE companies ALTER COLUMN code_ape DROP NOT NULL;
ALTER TABLE companies ALTER COLUMN code_postal DROP NOT NULL;
ALTER TABLE companies ALTER COLUMN date_creation DROP NOT NULL;

-- Note: Les champs essentiels restent obligatoires:
-- - denomination (nom de l'entreprise)
-- - secteur (secteur d'activité)
-- - effectif
-- - localisation

-- Commentaire pour documentation
COMMENT ON COLUMN companies.siret IS 'SIRET de l''entreprise (NULL si saisie manuelle)';
COMMENT ON TABLE companies IS 'Table des entreprises - Supporte à la fois recherche SIRET et saisie manuelle';
