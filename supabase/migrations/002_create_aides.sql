-- Create aides_recommendations table
CREATE TABLE IF NOT EXISTS aides_recommendations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  titre TEXT NOT NULL,
  description TEXT NOT NULL,
  type_aide TEXT NOT NULL CHECK (type_aide IN ('subvention', 'accompagnement', 'incubateur', 'pret')),
  niveau TEXT NOT NULL CHECK (niveau IN ('local', 'départemental', 'régional', 'national', 'européen')),
  montant_estime TEXT,
  organisme TEXT NOT NULL,
  criteres_eligibilite TEXT[] NOT NULL DEFAULT '{}',
  lien_externe TEXT,
  score_pertinence DECIMAL(3, 2) NOT NULL CHECK (score_pertinence >= 0 AND score_pertinence <= 1),
  generated_by_ai BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_aides_company_id ON aides_recommendations(company_id);
CREATE INDEX idx_aides_user_id ON aides_recommendations(user_id);
CREATE INDEX idx_aides_score ON aides_recommendations(score_pertinence DESC);
CREATE INDEX idx_aides_type ON aides_recommendations(type_aide);
CREATE INDEX idx_aides_niveau ON aides_recommendations(niveau);

-- Enable Row Level Security
ALTER TABLE aides_recommendations ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own aides"
  ON aides_recommendations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own aides"
  ON aides_recommendations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own aides"
  ON aides_recommendations FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own aides"
  ON aides_recommendations FOR DELETE
  USING (auth.uid() = user_id);
