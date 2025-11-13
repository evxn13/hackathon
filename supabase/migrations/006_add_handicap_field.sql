-- Ajouter un champ pour indiquer si l'entreprise emploie des travailleurs en situation de handicap
-- Cela permet de proposer des aides spécifiques (AGEFIPH, aides à l'embauche, etc.)

ALTER TABLE companies
ADD COLUMN emploi_handicap BOOLEAN DEFAULT false;

-- Commentaire pour documentation
COMMENT ON COLUMN companies.emploi_handicap IS 'Indique si l''entreprise emploie des travailleurs en situation de handicap (permet aides AGEFIPH)';
