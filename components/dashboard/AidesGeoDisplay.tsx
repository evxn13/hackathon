'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { AideRecommendation, NiveauAide, Company } from '@/lib/types';
import { getAideTypeColor, getNiveauColor } from '@/lib/utils';
import { getMultiGeoContext, getNiveauLabel } from '@/lib/geo-utils';
import { ExternalLink, Trash2, CheckCircle2, ChevronDown, ChevronUp, Sparkles, MapPin } from 'lucide-react';

interface AidesGeoDisplayProps {
  aides: AideRecommendation[];
  company: Company;
  onAideDeleted?: (aideId: string) => void;
}

// Fonction pour générer les liens officiels
function getOfficialLink(aide: AideRecommendation): string {
  const titre = aide.titre.toLowerCase();
  const organisme = aide.organisme.toLowerCase();

  if (organisme.includes('agefiph') || titre.includes('handicap')) {
    return 'https://www.agefiph.fr/aides-handicap';
  }
  if (organisme.includes('bpi') || organisme.includes('bpifrance')) {
    return 'https://www.bpifrance.fr/catalogue-offres';
  }
  if (organisme.includes('ademe')) {
    return 'https://agirpourlatransition.ademe.fr/entreprises/';
  }
  if (titre.includes('france 2030')) {
    return 'https://www.gouvernement.fr/france-2030';
  }
  if (organisme.includes('région sud') || organisme.includes('region sud')) {
    return 'https://www.maregionsud.fr/aides-et-appels-a-projets/detail/toutes-les-aides';
  }
  if (organisme.includes('métropole') || organisme.includes('aix-marseille')) {
    return 'https://www.ampmetropole.fr/';
  }
  if (organisme.includes('pôle emploi') || organisme.includes('pole emploi')) {
    return 'https://www.pole-emploi.fr/employeur/vos-aides-financieres.html';
  }
  if (organisme.includes('urssaf')) {
    return 'https://www.urssaf.fr/portail/home/employeur/beneficier-dune-exoneration/les-aides-a-lembauche.html';
  }
  if (aide.niveau === 'européen' || organisme.includes('europe')) {
    return 'https://europa.eu/european-union/contact/meet-us_fr';
  }
  return 'https://entreprendre.service-public.fr/vosdroits/N24264';
}

export function AidesGeoDisplay({ aides, company, onAideDeleted }: AidesGeoDisplayProps) {
  const [expandedLevels, setExpandedLevels] = useState<Set<string>>(new Set(['top']));
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Use code_postaux array if available, fallback to single code_postal for backward compatibility
  const postalCodes = company.code_postaux && company.code_postaux.length > 0
    ? company.code_postaux
    : company.code_postal ? [company.code_postal] : [];

  const geoContext = useMemo(() => getMultiGeoContext(postalCodes), [postalCodes]);

  // Meilleure aide (recommandation IA)
  const topAide = useMemo(() => {
    return [...aides].sort((a, b) => b.score_pertinence - a.score_pertinence)[0];
  }, [aides]);

  // Grouper les aides par niveau géographique
  const aidesByLevel = useMemo(() => {
    const grouped: Record<string, AideRecommendation[]> = {
      local: [],
      départemental: [],
      régional: [],
      national: [],
      européen: [],
    };

    aides.forEach((aide) => {
      if (grouped[aide.niveau]) {
        grouped[aide.niveau].push(aide);
      }
    });

    // Trier chaque groupe par pertinence
    Object.keys(grouped).forEach((level) => {
      grouped[level].sort((a, b) => b.score_pertinence - a.score_pertinence);
    });

    return grouped;
  }, [aides]);

  const getLevelDescription = (level: string): string => {
    switch (level) {
      case 'local':
        return geoContext.metropoles.length > 0
          ? geoContext.metropoles.join(', ')
          : 'Aides locales et métropolitaines';
      case 'départemental':
        return geoContext.departementsNames.join(', ');
      case 'régional':
        return geoContext.regions.join(', ');
      case 'national':
        return 'Aides nationales françaises';
      case 'européen':
        return 'Fonds et programmes européens';
      default:
        return '';
    }
  };

  const toggleLevel = (level: string) => {
    setExpandedLevels((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(level)) {
        newSet.delete(level);
      } else {
        newSet.add(level);
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

  const renderAideCard = (aide: AideRecommendation, featured: boolean = false) => (
    <div
      key={aide.id}
      className={`p-4 bg-white border rounded-lg hover:shadow-md transition-shadow ${
        featured ? 'border-2 border-primary-500' : 'border-gray-200'
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900 mb-1">{aide.titre}</h4>
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <Badge className={getAideTypeColor(aide.type_aide)} size="sm">
              {aide.type_aide}
            </Badge>
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

      {/* Critères */}
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
          Site officiel
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
  );

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
      {/* Contexte géographique */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white">
        <div className="flex items-center gap-2 mb-3">
          <MapPin className="w-5 h-5" />
          <h3 className="text-lg font-semibold">Votre zone d'activité</h3>
        </div>

        {/* Postal codes display */}
        <div className="mb-4 flex flex-wrap gap-2">
          {geoContext.codePostaux.map((cp) => (
            <div key={cp} className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium">
              {cp}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
          {geoContext.metropoles.length > 0 && (
            <div>
              <div className="text-blue-200">Métropole{geoContext.metropoles.length > 1 ? 's' : ''}</div>
              <div className="font-semibold">{geoContext.metropoles.join(', ')}</div>
            </div>
          )}
          <div>
            <div className="text-blue-200">Département{geoContext.departementsNames.length > 1 ? 's' : ''}</div>
            <div className="font-semibold">{geoContext.departementsNames.join(', ')}</div>
          </div>
          <div>
            <div className="text-blue-200">Région{geoContext.regions.length > 1 ? 's' : ''}</div>
            <div className="font-semibold">{geoContext.regions.join(', ')}</div>
          </div>
          <div>
            <div className="text-blue-200">Total aides</div>
            <div className="font-semibold text-2xl">{aides.length}</div>
          </div>
        </div>
      </div>

      {/* Recommandation IA en vedette */}
      {topAide && (
        <Card variant="elevated" className="border-2 border-primary-500 bg-gradient-to-br from-primary-50 to-blue-50">
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-6 h-6 text-primary-600" />
              <CardTitle className="text-xl">Recommandation de l'IA</CardTitle>
              <Badge className="bg-primary-600 text-white">
                Top Pick - {Math.round(topAide.score_pertinence * 100)}% de pertinence
              </Badge>
            </div>
            <p className="text-sm text-gray-600">
              L'aide la plus adaptée à votre profil selon notre analyse IA
            </p>
          </CardHeader>
          <CardContent>
            {renderAideCard(topAide, true)}
          </CardContent>
        </Card>
      )}

      {/* Aides par niveau géographique */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">Toutes les aides disponibles</h2>

        {(['local', 'départemental', 'régional', 'national', 'européen'] as const).map((level) => {
          const aidesOfLevel = aidesByLevel[level];
          if (aidesOfLevel.length === 0) return null;

          const isExpanded = expandedLevels.has(level);
          const levelLabel = getNiveauLabel(level);
          const levelDesc = getLevelDescription(level);

          return (
            <Card key={level} variant="bordered" className="overflow-hidden">
              <div
                onClick={() => toggleLevel(level)}
                className="cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-xl">{levelLabel.split(' ')[0]}</span>
                        <CardTitle className="text-lg">
                          {levelLabel.split(' ').slice(1).join(' ')}
                        </CardTitle>
                        <Badge className="bg-gray-100 text-gray-700">
                          {aidesOfLevel.length} aide{aidesOfLevel.length > 1 ? 's' : ''}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{levelDesc}</p>
                    </div>
                    <Button variant="ghost" size="sm">
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </Button>
                  </div>
                </CardHeader>
              </div>

              {isExpanded && (
                <CardContent className="pt-0 space-y-3">
                  {aidesOfLevel.map((aide) => renderAideCard(aide))}
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
