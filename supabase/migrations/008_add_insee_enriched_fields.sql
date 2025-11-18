-- Ajout de champs enrichis depuis l'API INSEE pour améliorer les recommandations IA
-- Ces informations permettent à Claude de mieux comprendre le profil de l'entreprise

-- Informations sur l'unité légale
ALTER TABLE companies ADD COLUMN IF NOT EXISTS categorie_entreprise TEXT; -- PME, ETI, GE
ALTER TABLE companies ADD COLUMN IF NOT EXISTS tranche_effectif_code TEXT; -- Code INSEE (ex: "12", "31")
ALTER TABLE companies ADD COLUMN IF NOT EXISTS annee_effectif TEXT; -- Année de référence des effectifs

-- Informations sur l'établissement
ALTER TABLE companies ADD COLUMN IF NOT EXISTS est_siege_social BOOLEAN DEFAULT true; -- true = siège, false = secondaire
ALTER TABLE companies ADD COLUMN IF NOT EXISTS etat_administratif TEXT; -- A = Actif, F = Fermé
ALTER TABLE companies ADD COLUMN IF NOT EXISTS date_debut_activite DATE; -- Date début de l'activité actuelle
ALTER TABLE companies ADD COLUMN IF NOT EXISTS caractere_employeur TEXT; -- O = Oui, N = Non

-- Informations sectorielles
ALTER TABLE companies ADD COLUMN IF NOT EXISTS nomenclature_activite TEXT; -- NAFRev2, etc.
ALTER TABLE companies ADD COLUMN IF NOT EXISTS activite_principale_libelle TEXT; -- Libellé complet du code APE

-- Adresse complète (utile pour certains dispositifs locaux)
ALTER TABLE companies ADD COLUMN IF NOT EXISTS adresse_complete TEXT; -- Numéro + type + nom de voie
ALTER TABLE companies ADD COLUMN IF NOT EXISTS complement_adresse TEXT; -- Complément d'adresse
ALTER TABLE companies ADD COLUMN IF NOT EXISTS code_commune TEXT; -- Code INSEE de la commune
ALTER TABLE companies ADD COLUMN IF NOT EXISTS departement TEXT; -- Code département (ex: "13", "06")
ALTER TABLE companies ADD COLUMN IF NOT EXISTS region TEXT; -- Code région

-- Informations économiques additionnelles
ALTER TABLE companies ADD COLUMN IF NOT EXISTS economie_sociale_solidaire BOOLEAN DEFAULT false; -- ESS
ALTER TABLE companies ADD COLUMN IF NOT EXISTS nature_activite TEXT; -- Ex: "Commerce de détail", "Services"

-- Commentaires sur les colonnes pour documentation
COMMENT ON COLUMN companies.categorie_entreprise IS 'Catégorie INSEE: PME (< 250 sal), ETI (250-4999), GE (≥5000)';
COMMENT ON COLUMN companies.tranche_effectif_code IS 'Code INSEE de la tranche effectif (00-53, NN)';
COMMENT ON COLUMN companies.est_siege_social IS 'true si siège social, false si établissement secondaire';
COMMENT ON COLUMN companies.etat_administratif IS 'A = Actif, F = Fermé';
COMMENT ON COLUMN companies.caractere_employeur IS 'O = Employeur, N = Non employeur';
COMMENT ON COLUMN companies.economie_sociale_solidaire IS 'true si entreprise ESS';
COMMENT ON COLUMN companies.departement IS 'Code département à 2 chiffres (ex: 13, 06, 75)';
