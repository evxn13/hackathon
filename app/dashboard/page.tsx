'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { CompanyInput } from '@/components/dashboard/CompanyInput';
import { CompanyCard } from '@/components/dashboard/CompanyCard';
import { AidesGeoDisplay } from '@/components/dashboard/AidesGeoDisplay';
import { RevenueChart } from '@/components/dashboard/RevenueChart';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Company, AideRecommendation, RevenueProjection } from '@/lib/types';
import { LogOut, Sparkles, Loader2, GitCompare } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [aides, setAides] = useState<AideRecommendation[]>([]);
  const [projection, setProjection] = useState<RevenueProjection | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    checkUser();
  }, []);

  useEffect(() => {
    if (company && aides.length === 0) {
      loadExistingAides();
    }
  }, [company]);

  const checkUser = async () => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push('/auth/login');
      return;
    }

    setUser(user);
    setIsLoadingUser(false);

    // Charger l'entreprise existante si elle existe
    const { data: companies } = await supabase
      .from('companies')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1);

    if (companies && companies.length > 0) {
      setCompany(companies[0]);
    }
  };

  const loadExistingAides = async () => {
    if (!company) return;

    const supabase = createClient();
    const { data: existingAides } = await supabase
      .from('aides_recommendations')
      .select('*')
      .eq('company_id', company.id)
      .order('score_pertinence', { ascending: false });

    if (existingAides && existingAides.length > 0) {
      setAides(existingAides);
    }

    // Charger la projection
    const { data: projectionData } = await supabase
      .from('revenue_projections')
      .select('*')
      .eq('company_id', company.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (projectionData) {
      setProjection(projectionData);
    }
  };

  const handleCompanyFound = (foundCompany: Company) => {
    setCompany(foundCompany);
    setAides([]);
    setProjection(null);
  };

  const handleAnalyzeCompany = async () => {
    if (!company) return;

    setIsAnalyzing(true);

    try {
      const response = await fetch('/api/analyze-company', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ companyId: company.id }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de l\'analyse');
      }

      setAides(data.aides);
      if (data.projection) {
        setProjection(data.projection);
      }
    } catch (error) {
      console.error('Analysis error:', error);
      alert('Une erreur est survenue lors de l\'analyse. Veuillez réessayer.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/auth/login');
  };

  const handleAideDeleted = (aideId: string) => {
    // Retirer l'aide de la liste locale
    setAides((prevAides) => prevAides.filter((aide) => aide.id !== aideId));
  };

  const calculateTotalAides = () => {
    return aides
      .filter((a) => a.montant_estime)
      .reduce((sum, aide) => {
        const montant = aide.montant_estime || '';
        const matches = montant.match(/[\d\s]+/g);
        if (matches) {
          const cleanNumber = matches[0].replace(/\s/g, '');
          return sum + parseInt(cleanNumber, 10);
        }
        return sum;
      }, 0);
  };

  if (isLoadingUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-primary-700">Eligence.ai</h1>
              <p className="text-sm text-gray-600 mt-1">
                Découvrez les aides adaptées à votre entreprise
              </p>
            </div>
            <div className="flex items-center gap-4">
              <p className="text-sm text-gray-600">{user?.email}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push('/dashboard/compare')}
              >
                <GitCompare className="w-4 h-4 mr-2" />
                Comparer
              </Button>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Déconnexion
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Company Input Section */}
          {!company && (
            <div className="max-w-2xl mx-auto">
              <CompanyInput onCompanyFound={handleCompanyFound} />
            </div>
          )}

          {/* Company Profile Section */}
          {company && (
            <>
              <CompanyCard company={company} />

              {/* Analyze Button */}
              {aides.length === 0 && (
                <Card variant="bordered" className="bg-gradient-to-r from-primary-50 to-blue-50">
                  <CardContent className="py-8 text-center">
                    <Sparkles className="w-12 h-12 text-primary-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Prêt à découvrir vos aides ?
                    </h3>
                    <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                      Notre IA va analyser votre profil d'entreprise et identifier les meilleures opportunités
                      de subventions, accompagnements et financements adaptés à votre situation.
                    </p>
                    <Button
                      size="lg"
                      onClick={handleAnalyzeCompany}
                      isLoading={isAnalyzing}
                    >
                      <Sparkles className="w-5 h-5 mr-2" />
                      {isAnalyzing ? 'Analyse en cours...' : 'Lancer l\'analyse IA'}
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Revenue Chart */}
              {(company.ca_actuel || projection) && (
                <RevenueChart
                  caActuel={company.ca_actuel || projection?.ca_actuel || 0}
                  caProjecte={projection?.ca_projete}
                  totalAidesPotentielles={calculateTotalAides()}
                />
              )}

              {/* Aides Display */}
              {aides.length > 0 && (
                <AidesGeoDisplay aides={aides} company={company} onAideDeleted={handleAideDeleted} />
              )}

              {/* New Analysis Button */}
              {company && aides.length > 0 && (
                <div className="text-center">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setCompany(null);
                      setAides([]);
                      setProjection(null);
                    }}
                  >
                    Analyser une autre entreprise
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
