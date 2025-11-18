-- Vérification que les politiques DELETE existent bien pour toutes les tables
-- Ces politiques permettent aux utilisateurs de supprimer leurs propres données

-- Vérifier la politique DELETE pour companies
-- (Déjà créée dans 001_create_companies.sql)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE tablename = 'companies'
        AND policyname = 'Users can delete their own companies'
    ) THEN
        CREATE POLICY "Users can delete their own companies"
          ON companies FOR DELETE
          USING (auth.uid() = user_id);
    END IF;
END $$;

-- Vérifier la politique DELETE pour aides_recommendations
-- (Déjà créée dans 002_create_aides.sql)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE tablename = 'aides_recommendations'
        AND policyname = 'Users can delete their own aides'
    ) THEN
        CREATE POLICY "Users can delete their own aides"
          ON aides_recommendations FOR DELETE
          USING (auth.uid() = user_id);
    END IF;
END $$;

-- Vérifier la politique DELETE pour revenue_projections
-- (Déjà créée dans 003_create_revenue_projections.sql)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE tablename = 'revenue_projections'
        AND policyname = 'Users can delete projections for their companies'
    ) THEN
        CREATE POLICY "Users can delete projections for their companies"
          ON revenue_projections FOR DELETE
          USING (
            EXISTS (
              SELECT 1 FROM companies
              WHERE companies.id = revenue_projections.company_id
              AND companies.user_id = auth.uid()
            )
          );
    END IF;
END $$;

-- Note: Ces politiques DELETE existent déjà dans les migrations précédentes.
-- Ce fichier sert uniquement de vérification et de documentation.
-- Vous n'avez PAS besoin d'exécuter ce fichier dans Supabase si vous avez
-- déjà exécuté les 3 premières migrations.
