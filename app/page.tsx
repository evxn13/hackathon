import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { ArrowRight, Building2, Sparkles, TrendingUp, CheckCircle2 } from 'lucide-react';

export default function HomePage() {
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
                <Button variant="ghost" size="sm">
                  Connexion
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button size="sm">
                  Créer un compte
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-primary-100 text-primary-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            Code4Sud Hackathon - Solution IA
          </div>

          <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Trouvez les aides adaptées à votre entreprise en quelques secondes
          </h1>

          <p className="text-xl text-gray-600 mb-10 leading-relaxed">
            Notre assistant intelligent analyse automatiquement le profil de votre entreprise
            et vous propose les subventions, accompagnements et financements les plus pertinents.
          </p>

          <div className="flex items-center justify-center gap-4">
            <Link href="/auth/register">
              <Button size="lg" className="text-lg px-8">
                Commencer l'analyse
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

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card variant="elevated">
            <CardContent className="pt-8 pb-8 text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building2 className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Analyse automatique
              </h3>
              <p className="text-gray-600">
                Entrez simplement votre SIRET et nous récupérons automatiquement
                les données de votre entreprise via l'API INSEE.
              </p>
            </CardContent>
          </Card>

          <Card variant="elevated">
            <CardContent className="pt-8 pb-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                IA personnalisée
              </h3>
              <p className="text-gray-600">
                Notre IA Claude analyse votre profil et identifie les aides les plus
                pertinentes parmi des centaines de dispositifs.
              </p>
            </CardContent>
          </Card>

          <Card variant="elevated">
            <CardContent className="pt-8 pb-8 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Projection financière
              </h3>
              <p className="text-gray-600">
                Visualisez l'impact potentiel des aides sur votre chiffre d'affaires
                avec des projections claires.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Card variant="bordered" className="bg-white">
          <CardContent className="p-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  Toutes les aides en un seul endroit
                </h2>
                <p className="text-gray-600 mb-6">
                  Nous centralisons les dispositifs d'aides de tous niveaux pour vous
                  faire gagner un temps précieux.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">Aides locales</p>
                      <p className="text-sm text-gray-600">Métropole Aix-Marseille-Provence</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">Aides régionales</p>
                      <p className="text-sm text-gray-600">Région Sud - PACA</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">Aides nationales</p>
                      <p className="text-sm text-gray-600">BPI France, ADEME, France 2030...</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">Aides européennes</p>
                      <p className="text-sm text-gray-600">FEDER, FSE+, Horizon Europe...</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-primary-50 to-blue-50 rounded-lg p-8 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-6xl font-bold text-primary-600 mb-2">100+</p>
                  <p className="text-xl text-gray-700 font-medium">Dispositifs d'aides</p>
                  <p className="text-gray-600 mt-2">référencés et analysés par notre IA</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <Card variant="elevated" className="bg-gradient-to-r from-primary-600 to-blue-600 text-white">
          <CardContent className="py-16 text-center">
            <h2 className="text-4xl font-bold mb-4">
              Prêt à booster votre entreprise ?
            </h2>
            <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              Créez votre compte gratuitement et découvrez en quelques minutes
              toutes les aides auxquelles vous êtes éligible.
            </p>
            <Link href="/auth/register">
              <Button size="lg" variant="secondary" className="text-lg px-8 bg-white text-primary-600 hover:bg-gray-100">
                Créer mon compte gratuitement
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center text-gray-600">
            <p className="mb-3 text-base">
              Projet réalisé pour le hackathon Code4Sud
            </p>
            <p className="text-sm text-gray-500">
              Solution propulsée par Claude AI • Données officielles INSEE
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
