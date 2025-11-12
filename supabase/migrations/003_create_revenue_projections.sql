-- Create revenue_projections table
CREATE TABLE IF NOT EXISTS revenue_projections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE NOT NULL,
  ca_actuel DECIMAL(12, 2) NOT NULL,
  ca_projete DECIMAL(12, 2) NOT NULL,
  periode TEXT NOT NULL CHECK (periode IN ('mois', 'trimestre', 'année')),
  avec_aides BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_projections_company_id ON revenue_projections(company_id);
CREATE INDEX idx_projections_created_at ON revenue_projections(created_at DESC);

-- Enable Row Level Security
ALTER TABLE revenue_projections ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view projections for their companies"
  ON revenue_projections FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM companies
      WHERE companies.id = revenue_projections.company_id
      AND companies.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert projections for their companies"
  ON revenue_projections FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM companies
      WHERE companies.id = revenue_projections.company_id
      AND companies.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update projections for their companies"
  ON revenue_projections FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM companies
      WHERE companies.id = revenue_projections.company_id
      AND companies.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete projections for their companies"
  ON revenue_projections FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM companies
      WHERE companies.id = revenue_projections.company_id
      AND companies.user_id = auth.uid()
    )
  );
