import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import CompareCompanies from '@/components/dashboard/CompareCompanies';

export const metadata = {
  title: 'Comparer des Entreprises - Assistant IA Aides',
  description: 'Comparez les aides éligibles entre deux entreprises',
};

export default async function ComparePage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Récupérer toutes les entreprises de l'utilisateur
  const { data: companies } = await supabase
    .from('companies')
    .select('id, denomination, siret, secteur, effectif, localisation, code_postal')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (!companies || companies.length < 2) {
    return (
      <div className="container max-w-4xl py-8">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold">Comparer des Entreprises</h1>
          <div className="p-6 border-2 border-dashed rounded-lg">
            <p className="text-muted-foreground">
              Vous devez avoir au moins 2 entreprises enregistrées pour utiliser la comparaison.
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Actuellement : {companies?.length || 0} entreprise(s) enregistrée(s)
            </p>
            <a
              href="/dashboard"
              className="inline-block mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              Retour au dashboard
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <a
            href="/dashboard"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Retour au dashboard
          </a>
          <h1 className="text-3xl font-bold mb-2">Comparer des Entreprises</h1>
          <p className="text-muted-foreground">
            Comparez les aides éligibles entre deux entreprises et découvrez les opportunités stratégiques
          </p>
        </div>

        <CompareCompanies companies={companies} />
      </div>
    </div>
  );
}
