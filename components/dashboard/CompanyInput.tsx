'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { formatSiret, validateSiret } from '@/lib/utils';
import { Building2, Search, Edit3 } from 'lucide-react';

interface CompanyInputProps {
  onCompanyFound: (company: any) => void;
}

export function CompanyInput({ onCompanyFound }: CompanyInputProps) {
  const [mode, setMode] = useState<'siret' | 'manual'>('siret');
  const [siret, setSiret] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Champs pour saisie manuelle
  const [manualData, setManualData] = useState({
    denomination: '',
    secteur: '',
    code_ape: '',
    effectif: '',
    localisation: '',
    code_postal: '',
    forme_juridique: '',
  });

  const handleSiretSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateSiret(siret)) {
      setError('Le SIRET doit contenir 14 chiffres');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/insee-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ siret }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Erreur lors de la récupération des données');
        return;
      }

      onCompanyFound(data.company);
    } catch (err) {
      setError('Une erreur est survenue. Veuillez réessayer.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation des champs obligatoires
    if (!manualData.denomination || !manualData.secteur) {
      setError('Veuillez remplir au minimum le nom et le secteur de l\'entreprise');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/company-manual', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(manualData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Erreur lors de la création de l\'entreprise');
        return;
      }

      onCompanyFound(data.company);
    } catch (err) {
      setError('Une erreur est survenue. Veuillez réessayer.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSiretChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s/g, '');
    if (value.length <= 14 && /^\d*$/.test(value)) {
      setSiret(value);
      setError('');
    }
  };

  const handleManualChange = (field: keyof typeof manualData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setManualData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
    setError('');
  };

  return (
    <Card variant="elevated">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary-100 rounded-lg">
            <Building2 className="w-6 h-6 text-primary-600" />
          </div>
          <div className="flex-1">
            <CardTitle>Analysez votre entreprise</CardTitle>
            <CardDescription>
              {mode === 'siret'
                ? 'Entrez votre numéro SIRET pour découvrir les aides adaptées'
                : 'Renseignez les informations de votre entreprise'}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Toggle Mode */}
        <div className="flex gap-2 mb-6">
          <Button
            type="button"
            variant={mode === 'siret' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setMode('siret')}
            className="flex-1"
          >
            <Search className="w-4 h-4 mr-2" />
            Recherche SIRET
          </Button>
          <Button
            type="button"
            variant={mode === 'manual' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setMode('manual')}
            className="flex-1"
          >
            <Edit3 className="w-4 h-4 mr-2" />
            Saisie manuelle
          </Button>
        </div>

        {/* Mode SIRET */}
        {mode === 'siret' && (
          <form onSubmit={handleSiretSubmit} className="space-y-4">
            <Input
              label="Numéro SIRET"
              value={formatSiret(siret)}
              onChange={handleSiretChange}
              placeholder="123 456 789 01234"
              error={error}
              helperText="14 chiffres - Trouvez votre SIRET sur vos documents officiels"
              disabled={isLoading}
            />

            <Button type="submit" className="w-full" isLoading={isLoading}>
              <Search className="w-5 h-5 mr-2" />
              Analyser mon entreprise
            </Button>

            <p className="text-xs text-center text-gray-500">
              Pas de SIRET ?{' '}
              <button
                type="button"
                onClick={() => setMode('manual')}
                className="text-primary-600 hover:underline font-medium"
              >
                Saisir manuellement
              </button>
            </p>
          </form>
        )}

        {/* Mode Manuel */}
        {mode === 'manual' && (
          <form onSubmit={handleManualSubmit} className="space-y-4">
            <Input
              label="Nom de l'entreprise *"
              value={manualData.denomination}
              onChange={handleManualChange('denomination')}
              placeholder="Ex: Ma Société SARL"
              disabled={isLoading}
              required
            />

            <Input
              label="Secteur d'activité *"
              value={manualData.secteur}
              onChange={handleManualChange('secteur')}
              placeholder="Ex: Commerce de détail, Services numériques..."
              disabled={isLoading}
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Code APE"
                value={manualData.code_ape}
                onChange={handleManualChange('code_ape')}
                placeholder="Ex: 6201Z"
                disabled={isLoading}
                helperText="Si vous le connaissez"
              />

              <Input
                label="Effectif"
                value={manualData.effectif}
                onChange={handleManualChange('effectif')}
                placeholder="Ex: 5"
                disabled={isLoading}
                helperText="Nombre d'employés"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Ville"
                value={manualData.localisation}
                onChange={handleManualChange('localisation')}
                placeholder="Ex: Marseille"
                disabled={isLoading}
              />

              <Input
                label="Code postal"
                value={manualData.code_postal}
                onChange={handleManualChange('code_postal')}
                placeholder="Ex: 13001"
                disabled={isLoading}
              />
            </div>

            <Input
              label="Forme juridique"
              value={manualData.forme_juridique}
              onChange={handleManualChange('forme_juridique')}
              placeholder="Ex: SARL, SAS, Auto-entrepreneur..."
              disabled={isLoading}
            />

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <Button type="submit" className="w-full" isLoading={isLoading}>
              <Building2 className="w-5 h-5 mr-2" />
              Créer mon profil d'entreprise
            </Button>

            <p className="text-xs text-center text-gray-500">
              Vous avez un SIRET ?{' '}
              <button
                type="button"
                onClick={() => setMode('siret')}
                className="text-primary-600 hover:underline font-medium"
              >
                Recherche automatique
              </button>
            </p>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
