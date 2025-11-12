'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { AideRecommendation, TypeAide, NiveauAide } from '@/lib/types';
import { getAideTypeColor, getNiveauColor } from '@/lib/utils';
import { Gift, ExternalLink, CheckCircle2, Filter, Trash2 } from 'lucide-react';

interface AidesRecommendationsProps {
  aides: AideRecommendation[];
  onAideDeleted?: (aideId: string) => void;
}

export function AidesRecommendations({ aides, onAideDeleted }: AidesRecommendationsProps) {
  const [selectedType, setSelectedType] = useState<TypeAide | 'all'>('all');
  const [selectedNiveau, setSelectedNiveau] = useState<NiveauAide | 'all'>('all');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (aideId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette aide ?')) {
      return;
    }

    setDeletingId(aideId);
    try {
      const response = await fetch(`/api/aides/${aideId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression');
      }

      // Notifier le parent pour rafraîchir la liste
      if (onAideDeleted) {
        onAideDeleted(aideId);
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Erreur lors de la suppression de l\'aide');
    } finally {
      setDeletingId(null);
    }
  };

  const filteredAides = aides.filter((aide) => {
    if (selectedType !== 'all' && aide.type_aide !== selectedType) return false;
    if (selectedNiveau !== 'all' && aide.niveau !== selectedNiveau) return false;
    return true;
  });

  const sortedAides = [...filteredAides].sort(
    (a, b) => b.score_pertinence - a.score_pertinence
  );

  const types: (TypeAide | 'all')[] = ['all', 'subvention', 'accompagnement', 'incubateur', 'pret'];
  const niveaux: (NiveauAide | 'all')[] = ['all', 'local', 'régional', 'national', 'européen'];

  const typeLabels: Record<string, string> = {
    all: 'Tous',
    subvention: 'Subventions',
    accompagnement: 'Accompagnements',
    incubateur: 'Incubateurs',
    pret: 'Prêts',
  };

  const niveauLabels: Record<string, string> = {
    all: 'Tous',
    local: 'Local',
    régional: 'Régional',
    national: 'National',
    européen: 'Européen',
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-gray-500" />
            <h3 className="font-medium text-gray-700">Filtres</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type d'aide
              </label>
              <div className="flex flex-wrap gap-2">
                {types.map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      selectedType === type
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {typeLabels[type]}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Niveau
              </label>
              <div className="flex flex-wrap gap-2">
                {niveaux.map((niveau) => (
                  <button
                    key={niveau}
                    onClick={() => setSelectedNiveau(niveau)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      selectedNiveau === niveau
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {niveauLabels[niveau]}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          {sortedAides.length} aide{sortedAides.length > 1 ? 's' : ''} trouvée{sortedAides.length > 1 ? 's' : ''}
        </p>
      </div>

      {/* Aides list */}
      <div className="grid grid-cols-1 gap-4">
        {sortedAides.map((aide, index) => (
          <Card key={aide.id || index} variant="bordered" className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Gift className="w-5 h-5 text-primary-600" />
                    <CardTitle className="text-lg">{aide.titre}</CardTitle>
                  </div>
                  <CardDescription className="text-base leading-relaxed">
                    {aide.description}
                  </CardDescription>
                </div>
                <div className="flex flex-col gap-2 items-end">
                  <Badge
                    className={getAideTypeColor(aide.type_aide)}
                    size="sm"
                  >
                    {aide.type_aide}
                  </Badge>
                  <Badge
                    className={getNiveauColor(aide.niveau)}
                    size="sm"
                  >
                    {aide.niveau}
                  </Badge>
                  <div className="flex items-center gap-1 mt-1">
                    <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary-600 rounded-full"
                        style={{ width: `${aide.score_pertinence * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500">
                      {Math.round(aide.score_pertinence * 100)}%
                    </span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Organisme gestionnaire
                  </p>
                  <p className="text-sm text-gray-600">{aide.organisme}</p>
                </div>

                {aide.montant_estime && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      Montant estimé
                    </p>
                    <p className="text-lg font-semibold text-primary-600">
                      {aide.montant_estime}
                    </p>
                  </div>
                )}

                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Critères d'éligibilité principaux
                  </p>
                  <ul className="space-y-1">
                    {aide.criteres_eligibilite.map((critere, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                        <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{critere}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center gap-2 mt-2">
                  {aide.lien_externe && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(aide.lien_externe, '_blank')}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      En savoir plus
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => aide.id && handleDelete(aide.id)}
                    disabled={!aide.id || deletingId === aide.id}
                    className="text-red-600 hover:bg-red-50 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    {deletingId === aide.id ? 'Suppression...' : 'Supprimer'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {sortedAides.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Gift className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">
              Aucune aide ne correspond aux filtres sélectionnés
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
