-- Migration: Support multiple postal codes for companies
-- Created: 2025-01-13

-- Add new column for multiple postal codes (JSONB array)
ALTER TABLE companies ADD COLUMN IF NOT EXISTS code_postaux JSONB DEFAULT '[]'::jsonb;

-- Migrate existing data: convert single code_postal to array format
UPDATE companies
SET code_postaux = jsonb_build_array(code_postal)
WHERE code_postal IS NOT NULL AND code_postal != '';

-- For companies with no postal code, initialize empty array
UPDATE companies
SET code_postaux = '[]'::jsonb
WHERE code_postal IS NULL OR code_postal = '';

-- Add constraint to ensure code_postaux is always an array
ALTER TABLE companies
ADD CONSTRAINT code_postaux_is_array
CHECK (jsonb_typeof(code_postaux) = 'array');

-- Add constraint to ensure at least one postal code is provided
ALTER TABLE companies
ADD CONSTRAINT code_postaux_not_empty
CHECK (jsonb_array_length(code_postaux) > 0);

-- Keep the old column for backward compatibility during transition
-- It will be deprecated but not dropped yet
COMMENT ON COLUMN companies.code_postal IS 'DEPRECATED: Use code_postaux array instead';
COMMENT ON COLUMN companies.code_postaux IS 'Array of postal codes (5 digits each) where the company operates';
