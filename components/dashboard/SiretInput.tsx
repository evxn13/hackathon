'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { formatSiret, validateSiret } from '@/lib/utils';
import { Building2, Search } from 'lucide-react';

interface SiretInputProps {
  onCompanyFound: (company: any) => void;
}

export function SiretInput({ onCompanyFound }: SiretInputProps) {
  const [siret, setSiret] = useState('');
  const [emploiHandicap, setEmploiHandicap] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
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
        body: JSON.stringify({ siret, emploi_handicap: emploiHandicap }),
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

  const handleSiretChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s/g, '');
    if (value.length <= 14 && /^\d*$/.test(value)) {
      setSiret(value);
      setError('');
    }
  };

  return (
    <Card variant="elevated">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary-100 rounded-lg">
            <Building2 className="w-6 h-6 text-primary-600" />
          </div>
          <div>
            <CardTitle>Analysez votre entreprise</CardTitle>
            <CardDescription>
              Entrez votre numéro SIRET pour découvrir les aides adaptées
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Numéro SIRET"
            value={formatSiret(siret)}
            onChange={handleSiretChange}
            placeholder="123 456 789 01234"
            error={error}
            helperText="14 chiffres - Trouvez votre SIRET sur vos documents officiels"
            disabled={isLoading}
          />

          <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <input
              type="checkbox"
              id="emploi_handicap"
              checked={emploiHandicap}
              onChange={(e) => setEmploiHandicap(e.target.checked)}
              className="mt-1 w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              disabled={isLoading}
            />
            <label htmlFor="emploi_handicap" className="flex-1 cursor-pointer">
              <span className="font-medium text-gray-900 block">
                Emploi de travailleurs en situation de handicap
              </span>
              <span className="text-sm text-gray-600 mt-1 block">
                Cochez si votre entreprise emploie ou souhaite employer des travailleurs handicapés (aides AGEFIPH, adaptation de postes, etc.)
              </span>
            </label>
          </div>

          <Button
            type="submit"
            className="w-full"
            isLoading={isLoading}
          >
            <Search className="w-5 h-5 mr-2" />
            Analyser mon entreprise
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
