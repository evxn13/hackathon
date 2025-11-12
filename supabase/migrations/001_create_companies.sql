-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create companies table
CREATE TABLE IF NOT EXISTS companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  siret TEXT UNIQUE NOT NULL,
  denomination TEXT NOT NULL,
  secteur TEXT NOT NULL,
  code_ape TEXT NOT NULL,
  effectif TEXT NOT NULL,
  localisation TEXT NOT NULL,
  code_postal TEXT NOT NULL,
  ca_actuel DECIMAL(12, 2),
  date_creation DATE NOT NULL,
  forme_juridique TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on user_id for faster lookups
CREATE INDEX idx_companies_user_id ON companies(user_id);

-- Create index on siret for faster lookups
CREATE INDEX idx_companies_siret ON companies(siret);

-- Enable Row Level Security
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;

-- Create policies for companies
-- Users can only see their own companies
CREATE POLICY "Users can view their own companies"
  ON companies FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own companies
CREATE POLICY "Users can insert their own companies"
  ON companies FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own companies
CREATE POLICY "Users can update their own companies"
  ON companies FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own companies
CREATE POLICY "Users can delete their own companies"
  ON companies FOR DELETE
  USING (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_companies_updated_at
  BEFORE UPDATE ON companies
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
