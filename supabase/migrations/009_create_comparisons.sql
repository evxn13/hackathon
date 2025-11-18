-- Table pour stocker les comparaisons d'entreprises
CREATE TABLE IF NOT EXISTS company_comparisons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,

  -- Entreprises comparées
  company_a_id UUID REFERENCES companies(id) ON DELETE CASCADE NOT NULL,
  company_b_id UUID REFERENCES companies(id) ON DELETE CASCADE NOT NULL,

  -- Analyse IA de la comparaison
  analysis_summary TEXT NOT NULL, -- Résumé global de la comparaison
  key_differences JSONB, -- Différences clés entre les deux entreprises
  opportunities_a JSONB, -- Opportunités spécifiques pour A
  opportunities_b JSONB, -- Opportunités spécifiques pour B
  strategic_insights TEXT, -- Insights stratégiques

  -- Statistiques
  total_aides_a INTEGER DEFAULT 0,
  total_aides_b INTEGER DEFAULT 0,
  aides_common INTEGER DEFAULT 0, -- Aides communes aux deux
  aides_unique_a INTEGER DEFAULT 0, -- Aides uniques à A
  aides_unique_b INTEGER DEFAULT 0, -- Aides uniques à B

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour performances
CREATE INDEX idx_comparisons_user_id ON company_comparisons(user_id);
CREATE INDEX idx_comparisons_company_a ON company_comparisons(company_a_id);
CREATE INDEX idx_comparisons_company_b ON company_comparisons(company_b_id);

-- Index composé pour éviter les doublons (même comparaison dans les deux sens)
CREATE UNIQUE INDEX idx_comparisons_unique ON company_comparisons(user_id, company_a_id, company_b_id);

-- RLS
ALTER TABLE company_comparisons ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own comparisons"
  ON company_comparisons FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own comparisons"
  ON company_comparisons FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comparisons"
  ON company_comparisons FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comparisons"
  ON company_comparisons FOR DELETE
  USING (auth.uid() = user_id);

-- Trigger pour updated_at
CREATE TRIGGER update_comparisons_updated_at
  BEFORE UPDATE ON company_comparisons
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Commentaires
COMMENT ON TABLE company_comparisons IS 'Comparaisons d''entreprises avec analyse IA';
COMMENT ON COLUMN company_comparisons.analysis_summary IS 'Résumé global généré par IA';
COMMENT ON COLUMN company_comparisons.key_differences IS 'JSON avec les différences principales';
COMMENT ON COLUMN company_comparisons.strategic_insights IS 'Insights stratégiques pour l''utilisateur';
