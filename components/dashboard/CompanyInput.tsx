'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { formatSiret, validateSiret } from '@/lib/utils';
import { Building2, Search, Edit3, MapPin } from 'lucide-react';

interface CompanyInputProps {
  onCompanyFound: (company: any) => void;
}

export function CompanyInput({ onCompanyFound }: CompanyInputProps) {
  const [mode, setMode] = useState<'siret' | 'manual'>('siret');
  const [siret, setSiret] = useState('');
  const [emploiHandicapSiret, setEmploiHandicapSiret] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Champs pour saisie manuelle
  const [manualData, setManualData] = useState({
    denomination: '',
    secteur: '',
    code_ape: '',
    effectif: '',
    localisation: '',
    forme_juridique: '',
    emploi_handicap: false,
  });

  // Multiple postal codes support
  const [codePostaux, setCodePostaux] = useState<string[]>([]);
  const [currentCodePostal, setCurrentCodePostal] = useState('');

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
        body: JSON.stringify({ siret, emploi_handicap: emploiHandicapSiret }),
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

    // Validation: au moins un code postal requis
    if (codePostaux.length === 0) {
      setError('Veuillez ajouter au moins un code postal');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/company-manual', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...manualData,
          code_postaux: codePostaux,
        }),
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

  const validateCodePostal = (code: string): boolean => {
    // Must be exactly 5 digits
    return /^\d{5}$/.test(code);
  };

  const handleAddCodePostal = () => {
    const trimmed = currentCodePostal.trim();

    if (!trimmed) {
      setError('Veuillez entrer un code postal');
      return;
    }

    if (!validateCodePostal(trimmed)) {
      setError('Le code postal doit contenir exactement 5 chiffres (ex: 75000, 13001)');
      return;
    }

    if (codePostaux.includes(trimmed)) {
      setError('Ce code postal est déjà ajouté');
      return;
    }

    setCodePostaux([...codePostaux, trimmed]);
    setCurrentCodePostal('');
    setError('');
  };

  const handleRemoveCodePostal = (code: string) => {
    setCodePostaux(codePostaux.filter(c => c !== code));
  };

  const handleCodePostalKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddCodePostal();
    }
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
            variant={mode === 'siret' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setMode('siret')}
            className="flex-1"
          >
            <Search className="w-4 h-4 mr-2" />
            Recherche SIRET
          </Button>
          <Button
            type="button"
            variant={mode === 'manual' ? 'primary' : 'outline'}
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

            {/* Checkbox Emploi Handicap pour SIRET */}
            <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <input
                type="checkbox"
                id="emploi_handicap_siret"
                checked={emploiHandicapSiret}
                onChange={(e) => setEmploiHandicapSiret(e.target.checked)}
                disabled={isLoading}
                className="mt-1 h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <div className="flex-1">
                <label
                  htmlFor="emploi_handicap_siret"
                  className="text-sm font-medium text-gray-900 cursor-pointer"
                >
                  J'emploie ou je souhaite employer des travailleurs en situation de handicap
                </label>
                <p className="text-xs text-gray-600 mt-1">
                  Accédez à des aides spécifiques (AGEFIPH, aides à l'embauche, adaptation de poste...)
                </p>
              </div>
            </div>

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

            <Input
              label="Ville"
              value={manualData.localisation}
              onChange={handleManualChange('localisation')}
              placeholder="Ex: Marseille"
              disabled={isLoading}
            />

            {/* Multiple Postal Codes Input */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Codes postaux * <span className="text-xs text-gray-500">(zones géographiques d'activité)</span>
              </label>

              <div className="flex gap-2">
                <Input
                  value={currentCodePostal}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 5);
                    setCurrentCodePostal(value);
                    setError('');
                  }}
                  onKeyPress={handleCodePostalKeyPress}
                  placeholder="Ex: 13001"
                  disabled={isLoading}
                  helperText="5 chiffres - Appuyez sur Entrée ou cliquez sur Ajouter"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddCodePostal}
                  disabled={isLoading || !currentCodePostal}
                  className="mt-0"
                >
                  Ajouter
                </Button>
              </div>

              {/* Liste des codes postaux ajoutés */}
              {codePostaux.length > 0 && (
                <div className="flex flex-wrap gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  {codePostaux.map((code) => (
                    <div
                      key={code}
                      className="flex items-center gap-2 px-3 py-1 bg-white border border-blue-300 rounded-md"
                    >
                      <MapPin className="w-3 h-3 text-blue-600" />
                      <span className="text-sm font-medium text-gray-900">{code}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveCodePostal(code)}
                        disabled={isLoading}
                        className="text-red-500 hover:text-red-700"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Input
              label="Forme juridique"
              value={manualData.forme_juridique}
              onChange={handleManualChange('forme_juridique')}
              placeholder="Ex: SARL, SAS, Auto-entrepreneur..."
              disabled={isLoading}
            />

            {/* Checkbox Emploi Handicap */}
            <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <input
                type="checkbox"
                id="emploi_handicap"
                checked={manualData.emploi_handicap}
                onChange={(e) =>
                  setManualData((prev) => ({
                    ...prev,
                    emploi_handicap: e.target.checked,
                  }))
                }
                disabled={isLoading}
                className="mt-1 h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <div className="flex-1">
                <label
                  htmlFor="emploi_handicap"
                  className="text-sm font-medium text-gray-900 cursor-pointer"
                >
                  J'emploie ou je souhaite employer des travailleurs en situation de handicap
                </label>
                <p className="text-xs text-gray-600 mt-1">
                  Accédez à des aides spécifiques (AGEFIPH, aides à l'embauche, adaptation de poste...)
                </p>
              </div>
            </div>

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
