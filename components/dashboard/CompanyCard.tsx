'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Company } from '@/lib/types';
import { formatDate, calculateAnciennete, formatSiret } from '@/lib/utils';
import { Building2, MapPin, Users, Calendar, Briefcase, Hash } from 'lucide-react';

interface CompanyCardProps {
  company: Company;
}

export function CompanyCard({ company }: CompanyCardProps) {
  const anciennete = calculateAnciennete(company.date_creation);

  const effectifLabels: Record<string, string> = {
    'NN': 'Non renseigné',
    '00': '0 salarié',
    '01': '1 ou 2 salariés',
    '02': '3 à 5 salariés',
    '03': '6 à 9 salariés',
    '11': '10 à 19 salariés',
    '12': '20 à 49 salariés',
    '21': '50 à 99 salariés',
    '22': '100 à 199 salariés',
    '31': '200 à 249 salariés',
    '32': '250 à 499 salariés',
    '41': '500 à 999 salariés',
    '42': '1000 à 1999 salariés',
    '51': '2000 à 4999 salariés',
    '52': '5000 à 9999 salariés',
    '53': '10000 salariés et plus',
  };

  return (
    <Card variant="elevated">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary-100 rounded-lg">
              <Building2 className="w-8 h-8 text-primary-600" />
            </div>
            <div>
              <CardTitle className="text-xl">{company.denomination}</CardTitle>
              <p className="text-sm text-gray-500 mt-1">
                SIRET : {formatSiret(company.siret)}
              </p>
            </div>
          </div>
          <Badge variant="success">
            Vérifié INSEE
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-700">Localisation</p>
              <p className="text-sm text-gray-600">
                {company.localisation}
                <br />
                {company.code_postal}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Briefcase className="w-5 h-5 text-gray-400 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-700">Secteur d'activité</p>
              <p className="text-sm text-gray-600">
                Code APE : {company.code_ape}
                <br />
                {company.secteur}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Users className="w-5 h-5 text-gray-400 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-700">Effectif</p>
              <p className="text-sm text-gray-600">
                {effectifLabels[company.effectif] || company.effectif}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-700">Date de création</p>
              <p className="text-sm text-gray-600">
                {formatDate(company.date_creation)}
                <br />
                <span className="text-gray-500">
                  ({anciennete} {anciennete > 1 ? 'ans' : 'an'} d'ancienneté)
                </span>
              </p>
            </div>
          </div>

          {company.forme_juridique && (
            <div className="flex items-start gap-3">
              <Hash className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-700">Forme juridique</p>
                <p className="text-sm text-gray-600">{company.forme_juridique}</p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
