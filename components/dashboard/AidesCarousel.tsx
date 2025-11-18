'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { AideRecommendation } from '@/lib/types';
import { getAideTypeColor, getNiveauColor } from '@/lib/utils';
import { ChevronLeft, ChevronRight, ExternalLink, Trash2, CheckCircle2 } from 'lucide-react';

interface AidesCarouselProps {
  aides: AideRecommendation[];
  onAideDeleted?: (aideId: string) => void;
}

// Fonction pour générer les liens officiels vers les sites gouvernementaux
function getOfficialLink(aide: AideRecommendation): string {
  const titre = aide.titre.toLowerCase();
  const organisme = aide.organisme.toLowerCase();

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

  // AGEFIPH (Association de Gestion du Fonds pour l'Insertion Professionnelle des Personnes Handicapées)
  if (organisme.includes('agefiph') || titre.includes('agefiph') || titre.includes('handicap') || titre.includes('handicapé')) {
    return 'https://www.agefiph.fr/aides-handicap';
  }

  // URSSAF / Aide à l'embauche
  if (titre.includes('embauche') || organisme.includes('urssaf')) {
    return 'https://www.urssaf.fr/portail/home/employeur/beneficier-dune-exoneration/les-aides-a-lembauche.html';
  }

  // Programmes européens
  if (aide.niveau === 'européen' || organisme.includes('europe') || organisme.includes('feder') || organisme.includes('horizon')) {
    return 'https://europa.eu/european-union/contact/meet-us_fr';
  }

  // Par défaut: service-public.fr pour les aides entreprises
  return 'https://entreprendre.service-public.fr/vosdroits/N24264';
}

export function AidesCarousel({ aides, onAideDeleted }: AidesCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const sortedAides = [...aides].sort(
    (a, b) => b.score_pertinence - a.score_pertinence
  );

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? sortedAides.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === sortedAides.length - 1 ? 0 : prev + 1));
  };

  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
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

      // Ajuster l'index si nécessaire
      if (currentIndex >= sortedAides.length - 1) {
        setCurrentIndex(Math.max(0, currentIndex - 1));
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Erreur lors de la suppression de l\'aide');
    } finally {
      setDeletingId(null);
    }
  };

  if (sortedAides.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-gray-600">Aucune aide disponible</p>
        </CardContent>
      </Card>
    );
  }

  const currentAide = sortedAides[currentIndex];
  const officialLink = getOfficialLink(currentAide);

  return (
    <div className="relative">
      {/* Carousel Container */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-8 md:p-12 shadow-xl">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
          AIDES RECOMMANDÉES
        </h2>

        {/* Main Card Display */}
        <div className="relative flex items-center justify-center gap-4 md:gap-8 mb-8">
          {/* Previous Button */}
          <button
            onClick={handlePrevious}
            className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition-colors shadow-lg flex-shrink-0 z-10"
            aria-label="Aide précédente"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Cards Display */}
          <div className="flex-1 flex items-center justify-center gap-4 overflow-hidden max-w-5xl">
            {/* Show 3 cards on desktop, 1 on mobile */}
            <div className="hidden md:flex items-center justify-center gap-4 w-full">
              {/* Left card (preview) */}
              {sortedAides.length > 1 && (
                <div className="w-64 opacity-50 scale-90 transition-all">
                  <Card className="h-80 overflow-hidden">
                    <div className="h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-6">
                      <div className="text-center">
                        <p className="font-semibold text-gray-700 line-clamp-2">
                          {sortedAides[(currentIndex - 1 + sortedAides.length) % sortedAides.length].titre}
                        </p>
                      </div>
                    </div>
                  </Card>
                </div>
              )}

              {/* Center card (active) */}
              <div className="flex-1 max-w-xl transition-all">
                <Card className="h-80 overflow-hidden shadow-2xl border-4 border-blue-600">
                  <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white pb-4">
                    <div className="flex items-start justify-between gap-4">
                      <CardTitle className="text-xl line-clamp-2 flex-1">
                        {currentAide.titre}
                      </CardTitle>
                      <div className="flex gap-2 flex-shrink-0">
                        <Badge className="bg-white text-blue-600 font-semibold">
                          {Math.round(currentAide.score_pertinence * 100)}%
                        </Badge>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <Badge className={`${getAideTypeColor(currentAide.type_aide)} bg-opacity-90`} size="sm">
                        {currentAide.type_aide}
                      </Badge>
                      <Badge className={`${getNiveauColor(currentAide.niveau)} bg-opacity-90`} size="sm">
                        {currentAide.niveau}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4 h-48 overflow-y-auto">
                    <p className="text-gray-700 text-sm leading-relaxed mb-4">
                      {currentAide.description}
                    </p>
                    {currentAide.montant_estime && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-3">
                        <p className="text-xs text-green-700 font-medium mb-1">Montant estimé</p>
                        <p className="text-lg font-bold text-green-900">
                          {currentAide.montant_estime}
                        </p>
                      </div>
                    )}
                    <div className="text-xs text-gray-600 mb-2">
                      <span className="font-semibold">Organisme:</span> {currentAide.organisme}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right card (preview) */}
              {sortedAides.length > 2 && (
                <div className="w-64 opacity-50 scale-90 transition-all">
                  <Card className="h-80 overflow-hidden">
                    <div className="h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-6">
                      <div className="text-center">
                        <p className="font-semibold text-gray-700 line-clamp-2">
                          {sortedAides[(currentIndex + 1) % sortedAides.length].titre}
                        </p>
                      </div>
                    </div>
                  </Card>
                </div>
              )}
            </div>

            {/* Mobile view - single card */}
            <div className="md:hidden w-full max-w-md">
              <Card className="overflow-hidden shadow-2xl border-4 border-blue-600">
                <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white pb-4">
                  <div className="flex items-start justify-between gap-4">
                    <CardTitle className="text-lg line-clamp-2 flex-1">
                      {currentAide.titre}
                    </CardTitle>
                    <Badge className="bg-white text-blue-600 font-semibold flex-shrink-0">
                      {Math.round(currentAide.score_pertinence * 100)}%
                    </Badge>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Badge className={`${getAideTypeColor(currentAide.type_aide)} bg-opacity-90`} size="sm">
                      {currentAide.type_aide}
                    </Badge>
                    <Badge className={`${getNiveauColor(currentAide.niveau)} bg-opacity-90`} size="sm">
                      {currentAide.niveau}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <p className="text-gray-700 text-sm leading-relaxed mb-4">
                    {currentAide.description}
                  </p>
                  {currentAide.montant_estime && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-3">
                      <p className="text-xs text-green-700 font-medium mb-1">Montant estimé</p>
                      <p className="text-lg font-bold text-green-900">
                        {currentAide.montant_estime}
                      </p>
                    </div>
                  )}
                  <div className="text-xs text-gray-600">
                    <span className="font-semibold">Organisme:</span> {currentAide.organisme}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Next Button */}
          <button
            onClick={handleNext}
            className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition-colors shadow-lg flex-shrink-0 z-10"
            aria-label="Aide suivante"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Dots Navigation */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {sortedAides.map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentIndex
                  ? 'w-8 bg-blue-600'
                  : 'w-2 bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Aller à l'aide ${index + 1}`}
            />
          ))}
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-center gap-4">
          <Button
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold shadow-lg"
            onClick={() => window.open(officialLink, '_blank')}
          >
            <ExternalLink className="w-5 h-5 mr-2" />
            Visiter le site officiel
          </Button>

          <Button
            size="lg"
            variant="outline"
            onClick={() => currentAide.id && handleDelete(currentAide.id)}
            disabled={!currentAide.id || deletingId === currentAide.id}
            className="text-red-600 border-red-300 hover:bg-red-50 hover:border-red-400"
          >
            <Trash2 className="w-5 h-5 mr-2" />
            {deletingId === currentAide.id ? 'Suppression...' : 'Supprimer'}
          </Button>
        </div>

        {/* Additional Details */}
        <div className="mt-8 bg-white rounded-xl p-6 shadow-md">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            Critères d'éligibilité principaux
          </h3>
          <ul className="space-y-2">
            {currentAide.criteres_eligibilite.map((critere, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>{critere}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Counter */}
      <div className="text-center mt-4 text-gray-600 text-sm">
        Aide {currentIndex + 1} sur {sortedAides.length}
      </div>
    </div>
  );
}
