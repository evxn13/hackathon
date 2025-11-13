'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { ArrowRight, Building2, Sparkles, TrendingUp, CheckCircle2 } from 'lucide-react';

// Mots qui tournent
const rotatingWords = [
  'subventions publiques',
  'aides régionales',
  'financements BPI',
  'accompagnements experts',
];

export default function HomePage() {
  // État du typewriter
  const [wordIndex, setWordIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  // ALGORITHME TYPEWRITER
  useEffect(() => {
    const currentWord = rotatingWords[wordIndex];

    const typingSpeed = 80;  
    const deletingSpeed = 50;    
    const holdTime = 1000;      

    let timeout: ReturnType<typeof setTimeout>;

    if (!isDeleting && displayText.length < currentWord.length) {
      // On écrit le mot
      timeout = setTimeout(() => {
        setDisplayText(currentWord.slice(0, displayText.length + 1));
      }, typingSpeed);
    } else if (!isDeleting && displayText.length === currentWord.length) {
      // Mot complet → petite pause
      timeout = setTimeout(() => setIsDeleting(true), holdTime);
    } else if (isDeleting && displayText.length > 0) {
      // On efface
      timeout = setTimeout(() => {
        setDisplayText(currentWord.slice(0, displayText.length - 1));
      }, deletingSpeed);
    } else if (isDeleting && displayText.length === 0) {
      // Mot effacé → passer au suivant
      setIsDeleting(false);
      setWordIndex((prev) => (prev + 1) % rotatingWords.length);
    }

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, wordIndex]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-blue-50 to-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building2 className="w-8 h-8 text-primary-600" />
              <h1 className="text-2xl font-bold text-primary-700">Assistant Aides</h1>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/auth/login">
                <Button variant="ghost" size="sm">Connexion</Button>
              </Link>
              <Link href="/auth/register">
                <Button size="sm">Créer un compte</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-4xl mx-auto text-center lg:text-left">

          {/* Badge */}
          <div className="flex items-center justify-center lg:justify-start gap-3 mb-6">
            <span className="hidden sm:inline-block h-[2px] w-10 rounded-full bg-primary-400" />
            <span className="inline-flex items-center rounded-full bg-primary-600 px-4 py-1 text-sm font-medium text-white shadow-lg">
              Développement Web & Aides aux Entreprises
            </span>
          </div>

          {/* TITRE PRINCIPAL */}
          <h1 className="text-4xl md:text-6xl font-bold mb-2 leading-tight">
            <span className="block text-gray-900">Solutions</span>

            {/* Ligne animée façon WebCoreDB */}
            <span className="text-primary-600 font-extrabold block text-5xl md:text-7xl my-2 drop-shadow-md whitespace-nowrap">

              {/* Texte animé */}
              <span className="inline-block whitespace-nowrap">
                {displayText}
              </span>

              {/* Curseur */}
              <span className="inline-block text-primary-500 animate-pulse ml-1">|</span>
            </span>

            <span className="block text-gray-900">pour votre entreprise</span>
          </h1>

          <p className="text-xl text-gray-600 mt-4 mb-10 leading-relaxed max-w-2xl mx-auto lg:mx-0">
            Notre assistant intelligent analyse automatiquement votre entreprise
            et vous propose les subventions, accompagnements et financements les plus pertinents.
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Link href="/auth/register">
              <Button size="lg" className="text-lg px-8">
                Commencer l’analyse
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button size="lg" variant="outline" className="text-lg px-8">
                Se connecter
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURES — (inchangé) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          <Card variant="elevated" className="transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
            <CardContent className="pt-8 pb-8 text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building2 className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Analyse automatique
              </h3>
              <p className="text-gray-600">
                Entrez votre <strong>SIRET</strong> et nous récupérons automatiquement vos données via l’API INSEE.
              </p>
            </CardContent>
          </Card>

          <Card variant="elevated" className="transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
            <CardContent className="pt-8 pb-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                IA personnalisée
              </h3>
              <p className="text-gray-600">
                Analyse intelligente de votre profil et recommandation d’aides pertinentes.
              </p>
            </CardContent>
          </Card>

          <Card variant="elevated" className="transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
            <CardContent className="pt-8 pb-8 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Projection financière
              </h3>
              <p className="text-gray-600">
                Visualisez l’impact des aides sur votre chiffre d’affaires.
              </p>
            </CardContent>
          </Card>

        </div>
      </section>

      {/* BENEFICES – inchangé */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Card variant="bordered" className="bg-white">
          <CardContent className="p-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  Toutes les aides en un seul endroit
                </h2>
                <p className="text-gray-600 mb-6">
                  Nous centralisons subventions, accompagnements, financements et aides fiscales.
                </p>

                <div className="space-y-4">
                  {[
                    ['Aides locales', 'Métropole Aix-Marseille-Provence'],
                    ['Aides régionales', 'Région Sud - PACA'],
                    ['Aides nationales', 'BPI France, ADEME, France 2030...'],
                    ['Aides européennes', 'FEDER, FSE+, Horizon Europe...'],
                  ].map(([title, subtitle]) => (
                    <div className="flex items-start gap-3" key={title}>
                      <CheckCircle2 className="w-6 h-6 text-green-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900">{title}</p>
                        <p className="text-sm text-gray-600">{subtitle}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-br from-primary-50 to-blue-50 rounded-lg p-8 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-6xl font-bold text-primary-600 mb-2">100+</p>
                  <p className="text-xl text-gray-700 font-medium">Dispositifs d'aides</p>
                  <p className="text-gray-600 mt-2">analysés par notre IA</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <Card variant="elevated" className="bg-gradient-to-r from-primary-600 to-blue-600 text-white">
          <CardContent className="py-16 text-center">
            <h2 className="text-4xl font-bold mb-4">Prêt à booster votre entreprise ?</h2>
            <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              Créez votre compte gratuitement et découvrez toutes les aides auxquelles vous êtes éligible.
            </p>

            <Link href="/auth/register">
            <Button
  size="lg"
  className="
    text-lg px-8 
    bg-white/20 backdrop-blur-md text-white border border-white/40 
    hover:bg-white/30 hover:border-white/60 
    transition-all duration-300
  "
>
  Créer mon compte gratuitement
  <ArrowRight className="w-5 h-5 ml-2" />
</Button>

            </Link>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-gray-600">
          <p className="mb-1">Projet réalisé pour le hackathon Code4Sud</p>
          <p className="text-sm">Solution propulsée par IA • Données officielles INSEE</p>
        </div>
      </footer>
    </div>
  );
}