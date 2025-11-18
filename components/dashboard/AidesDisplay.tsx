'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { AideRecommendation, TypeAide } from '@/lib/types';
import { getAideTypeColor, getNiveauColor } from '@/lib/utils';
import { ExternalLink, Trash2, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';

interface AidesDisplayProps {
  aides: AideRecommendation[];
  onAideDeleted?: (aideId: string) => void;
}

// Fonction pour générer les liens officiels vers les sites gouvernementaux
function getOfficialLink(aide: AideRecommendation): string {
  const titre = aide.titre.toLowerCase();
  const organisme = aide.organisme.toLowerCase();

  // AGEFIPH
  if (organisme.includes('agefiph') || titre.includes('agefiph') || titre.includes('handicap') || titre.includes('handicapé')) {
    return 'https://www.agefiph.fr/aides-handicap';
  }

  // BPI France
  if (organisme.includes('bpi') || organisme.includes('bpifrance')) {
    return 'https://www.bpifrance.fr/catalogue-offres';
  }

  // ADEME
  if (organisme.includes('ademe')) {
    return 'https://agirpourlatransition.ademe.fr/entreprises/';
  }

  // France 2030
  if (titre.includes('france 2030') || organisme.includes('france 2030')) {
    return 'https://www.gouvernement.fr/france-2030';
  }

  // Région Sud / PACA
  if (organisme.includes('région sud') || organisme.includes('region sud') || organisme.includes('paca')) {
    return 'https://www.maregionsud.fr/aides-et-appels-a-projets/detail/toutes-les-aides';
  }

  // Métropole Aix-Marseille-Provence
  if (organisme.includes('métropole') || organisme.includes('aix-marseille')) {
    return 'https://www.ampmetropole.fr/';
  }

  // Pôle Emploi
  if (organisme.includes('pôle emploi') || organisme.includes('pole emploi')) {
    return 'https://www.pole-emploi.fr/employeur/vos-aides-financieres.html';
  }

  // URSSAF
  if (titre.includes('embauche') || organisme.includes('urssaf')) {
    return 'https://www.urssaf.fr/portail/home/employeur/beneficier-dune-exoneration/les-aides-a-lembauche.html';
  }

  // Programmes européens
  if (aide.niveau === 'européen' || organisme.includes('europe') || organisme.includes('feder') || organisme.includes('horizon')) {
    return 'https://europa.eu/european-union/contact/meet-us_fr';
  }

  // Par défaut
  return 'https://entreprendre.service-public.fr/vosdroits/N24264';
}

const TYPE_LABELS: Record<TypeAide, string> = {
  subvention: '💰 Subventions',
  accompagnement: '🤝 Accompagnement',
  incubateur: '🚀 Incubateurs',
  pret: '💳 Prêts',
};

const TYPE_DESCRIPTIONS: Record<TypeAide, string> = {
  subvention: 'Aides financières directes sans remboursement',
  accompagnement: 'Conseils, formation et expertise',
  incubateur: 'Programmes d\'accélération et de soutien',
  pret: 'Financements avec remboursement',
};

export function AidesDisplay({ aides, onAideDeleted }: AidesDisplayProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<TypeAide>>(new Set());
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Grouper les aides par type
  const aidesByType = aides.reduce((acc, aide) => {
    if (!acc[aide.type_aide]) {
      acc[aide.type_aide] = [];
    }
    acc[aide.type_aide].push(aide);
    return acc;
  }, {} as Record<TypeAide, AideRecommendation[]>);

  // Trier les aides dans chaque catégorie par score
  Object.keys(aidesByType).forEach((type) => {
    aidesByType[type as TypeAide].sort((a, b) => b.score_pertinence - a.score_pertinence);
  });

  const toggleCategory = (type: TypeAide) => {
    setExpandedCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(type)) {
        newSet.delete(type);
      } else {
        newSet.add(type);
      }
      return newSet;
    });
  };

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

  if (aides.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-gray-600">Aucune aide disponible</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header avec statistiques */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Vos Aides Personnalisées</h2>
        <p className="text-blue-100 mb-4">
          {aides.length} aide{aides.length > 1 ? 's' : ''} identifiée{aides.length > 1 ? 's' : ''} pour votre entreprise
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(TYPE_LABELS).map(([type, label]) => {
            const count = aidesByType[type as TypeAide]?.length || 0;
            if (count === 0) return null;
            return (
              <div key={type} className="bg-white/10 backdrop-blur rounded-lg p-3">
                <div className="text-2xl font-bold">{count}</div>
                <div className="text-sm text-blue-100">{label}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Catégories d'aides */}
      <div className="space-y-4">
        {(Object.keys(aidesByType) as TypeAide[]).map((type) => {
          const aidesOfType = aidesByType[type];
          const isExpanded = expandedCategories.has(type);
          const topAide = aidesOfType[0]; // Meilleure aide de la catégorie

          return (
            <Card key={type} variant="bordered" className="overflow-hidden">
              {/* Header de la catégorie */}
              <div
                onClick={() => toggleCategory(type)}
                className="cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">{TYPE_LABELS[type].split(' ')[0]}</span>
                        <CardTitle className="text-xl">
                          {TYPE_LABELS[type].split(' ').slice(1).join(' ')}
                        </CardTitle>
                        <Badge className="bg-primary-100 text-primary-700 border-primary-200">
                          {aidesOfType.length} aide{aidesOfType.length > 1 ? 's' : ''}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{TYPE_DESCRIPTIONS[type]}</p>
                    </div>
                    <Button variant="ghost" size="sm">
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5" />
                      ) : (
                        <ChevronDown className="w-5 h-5" />
                      )}
                    </Button>
                  </div>

                  {/* Aperçu de la meilleure aide (si non étendu) */}
                  {!isExpanded && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 mb-1">{topAide.titre}</h4>
                          <p className="text-sm text-gray-600 line-clamp-2">{topAide.description}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-gray-500 mb-1">Pertinence</div>
                          <div className="text-lg font-bold text-primary-600">
                            {Math.round(topAide.score_pertinence * 100)}%
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardHeader>
              </div>

              {/* Liste des aides (si étendu) */}
              {isExpanded && (
                <CardContent className="pt-0 space-y-4">
                  {aidesOfType.map((aide) => (
                    <div
                      key={aide.id}
                      className="p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                    >
                      {/* En-tête de l'aide */}
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 mb-1">{aide.titre}</h4>
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className={getNiveauColor(aide.niveau)} size="sm">
                              {aide.niveau}
                            </Badge>
                            <span className="text-xs text-gray-500">• {aide.organisme}</span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <div className="text-xs text-gray-500">Pertinence</div>
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-primary-600 rounded-full"
                                style={{ width: `${aide.score_pertinence * 100}%` }}
                              />
                            </div>
                            <span className="text-sm font-semibold text-primary-600">
                              {Math.round(aide.score_pertinence * 100)}%
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-sm text-gray-700 mb-3">{aide.description}</p>

                      {/* Montant */}
                      {aide.montant_estime && (
                        <div className="mb-3 p-2 bg-green-50 border border-green-200 rounded">
                          <div className="text-xs text-green-700 font-medium mb-0.5">Montant estimé</div>
                          <div className="text-base font-bold text-green-900">{aide.montant_estime}</div>
                        </div>
                      )}

                      {/* Critères d'éligibilité */}
                      <div className="mb-3">
                        <div className="text-xs font-medium text-gray-700 mb-2">Critères d'éligibilité</div>
                        <ul className="space-y-1">
                          {aide.criteres_eligibilite.slice(0, 3).map((critere, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-xs text-gray-600">
                              <CheckCircle2 className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                              <span>{critere}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          className="flex-1"
                          onClick={() => window.open(getOfficialLink(aide), '_blank')}
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Visiter le site officiel
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => aide.id && handleDelete(aide.id)}
                          disabled={!aide.id || deletingId === aide.id}
                          className="text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
