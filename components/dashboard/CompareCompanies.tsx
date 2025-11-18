'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { Loader2, GitCompare, TrendingUp, TrendingDown, Lightbulb, Target, Zap, ExternalLink } from 'lucide-react';

interface Company {
  id: string;
  denomination: string;
  siret: string;
  secteur: string;
  effectif: string;
  localisation: string;
}

interface CompareCompaniesProps {
  companies: Company[];
  currentCompanyId?: string;
}

export default function CompareCompanies({ companies, currentCompanyId }: CompareCompaniesProps) {
  const [companyAId, setCompanyAId] = useState<string>(currentCompanyId || '');
  const [companyBId, setCompanyBId] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [comparison, setComparison] = useState<any>(null);
  const [error, setError] = useState<string>('');

  const handleCompare = async () => {
    if (!companyAId || !companyBId) {
      setError('Veuillez sélectionner deux entreprises');
      return;
    }

    if (companyAId === companyBId) {
      setError('Veuillez sélectionner deux entreprises différentes');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/compare-companies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ companyAId, companyBId }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erreur lors de la comparaison');
      }

      const data = await response.json();
      setComparison(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur serveur');
    } finally {
      setLoading(false);
    }
  };

  const companyA = companies.find(c => c.id === companyAId);
  const companyB = companies.find(c => c.id === companyBId);

  return (
    <div className="space-y-6">
      {/* Sélection des entreprises */}
      <Card>
        <CardContent className="pt-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <GitCompare className="h-5 w-5" />
              Comparer deux entreprises
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Comparez les aides éligibles entre votre entreprise et une autre pour identifier les opportunités
            </p>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Entreprise A (Votre entreprise)"
                value={companyAId}
                onChange={(e) => setCompanyAId(e.target.value)}
              >
                <option value="">Sélectionner une entreprise</option>
                {companies.map((company) => (
                  <option key={company.id} value={company.id}>
                    {company.denomination} - {company.siret || 'Saisie manuelle'}
                  </option>
                ))}
              </Select>

              <Select
                label="Entreprise B (Entreprise à comparer)"
                value={companyBId}
                onChange={(e) => setCompanyBId(e.target.value)}
              >
                <option value="">Sélectionner une entreprise</option>
                {companies.filter(c => c.id !== companyAId).map((company) => (
                  <option key={company.id} value={company.id}>
                    {company.denomination} - {company.siret || 'Saisie manuelle'}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-800 text-sm">
              {error}
            </div>
          )}

          <Button
            onClick={handleCompare}
            disabled={loading || !companyAId || !companyBId}
            className="w-full mt-4"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyse en cours...
              </>
            ) : (
              <>
                <GitCompare className="mr-2 h-4 w-4" />
                Lancer la comparaison
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Résultats de la comparaison */}
      {comparison && (
        <div className="space-y-6">
          {/* Résumé avec statistiques intégrées */}
          <Card className="border-2 border-primary-200">
            <CardContent className="pt-6">
              <p className="text-gray-700 leading-relaxed mb-6">
                {comparison.comparison.analysis_summary}
              </p>

              <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                <div className="text-center">
                  <p className="text-3xl font-bold text-blue-600">
                    {comparison.comparison.aides_common}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Aides communes</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-green-600">
                    {comparison.comparison.aides_unique_a}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Aides uniques à {companyA?.denomination}</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-orange-600">
                    {comparison.comparison.aides_unique_b}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Aides uniques à {companyB?.denomination}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Différences clés - Simplifié */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-base font-semibold mb-4 flex items-center gap-2">
                <Target className="h-4 w-4" />
                Différences clés
              </h3>
              <div className="space-y-3">
                {comparison.comparison.key_differences?.map((diff: any, idx: number) => (
                  <div key={idx} className="border-l-2 border-primary-400 pl-3 py-1">
                    <p className="font-medium text-sm mb-1">{diff.aspect}</p>
                    <div className="grid grid-cols-2 gap-3 text-xs text-gray-600">
                      <p><span className="font-medium">{companyA?.denomination}:</span> {diff.company_a}</p>
                      <p><span className="font-medium">{companyB?.denomination}:</span> {diff.company_b}</p>
                    </div>
                    <p className="mt-1 text-xs italic text-primary-600">→ {diff.impact}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Passage à l'action - Aides prioritaires */}
          {comparison.comparison.opportunities_a && comparison.comparison.opportunities_a.length > 0 && (
            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200">
              <CardContent className="pt-6">
                <h3 className="text-lg font-bold mb-2 flex items-center gap-2 text-green-900">
                  <Zap className="h-5 w-5 text-green-600" />
                  Passage à l'action pour {companyA?.denomination}
                </h3>
                <p className="text-sm text-green-800 mb-4">
                  Voici les aides prioritaires à explorer en premier basées sur votre comparaison
                </p>
                <div className="space-y-3">
                  {comparison.comparison.opportunities_a.slice(0, 3).map((opp: any, idx: number) => (
                    <div key={idx} className="bg-white p-4 rounded-lg border-2 border-green-300 shadow-sm">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-green-600 text-white text-xs font-bold">
                              {idx + 1}
                            </span>
                            <p className="font-bold text-base text-gray-900">{opp.action}</p>
                          </div>
                          <p className="text-sm text-gray-700 ml-8">{opp.benefit}</p>
                        </div>
                        <Badge
                          size="sm"
                          variant={
                            opp.difficulty === 'Facile'
                              ? 'success'
                              : opp.difficulty === 'Moyen'
                              ? 'warning'
                              : 'danger'
                          }
                        >
                          {opp.difficulty}
                        </Badge>
                      </div>
                      <div className="ml-8">
                        <Button
                          onClick={() => window.location.href = '/dashboard'}
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <ExternalLink className="w-3 h-3 mr-1" />
                          Voir les aides éligibles
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Opportunités - Reste des opportunités */}
          {comparison.comparison.opportunities_a && comparison.comparison.opportunities_a.length > 3 && (
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50">
              <CardContent className="pt-6">
                <h3 className="text-base font-semibold mb-3 flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-yellow-600" />
                  Autres opportunités pour {companyA?.denomination}
                </h3>
                <div className="space-y-2">
                  {comparison.comparison.opportunities_a.slice(3).map((opp: any, idx: number) => (
                    <div key={idx} className="bg-white p-3 rounded-lg border border-gray-200 hover:shadow-sm transition-shadow">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <p className="font-medium text-sm">{opp.action}</p>
                          <p className="text-xs text-gray-600 mt-1">{opp.benefit}</p>
                        </div>
                        <Badge
                          size="sm"
                          variant={
                            opp.difficulty === 'Facile'
                              ? 'success'
                              : opp.difficulty === 'Moyen'
                              ? 'warning'
                              : 'danger'
                          }
                        >
                          {opp.difficulty}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Insights stratégiques - Plus visible */}
          <Card className="border-2 border-blue-300 bg-gradient-to-r from-blue-50 to-blue-100">
            <CardContent className="pt-6">
              <h3 className="text-base font-semibold mb-3 text-blue-900 flex items-center gap-2">
                💡 Conclusion
              </h3>
              <p className="text-sm leading-relaxed text-blue-900">
                {comparison.comparison.strategic_insights}
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
