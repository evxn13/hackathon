// Utility pour combiner des classes CSS (similaire à cn() de shadcn)
export function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}

// Validation SIRET (14 chiffres)
export function validateSiret(siret: string): boolean {
  const cleaned = siret.replace(/\s/g, '');
  return /^\d{14}$/.test(cleaned);
}

// Formater le SIRET avec des espaces
export function formatSiret(siret: string): string {
  const cleaned = siret.replace(/\s/g, '');
  return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{5})/, '$1 $2 $3 $4');
}

// Parser un montant depuis une string (ex: "10 000 €" -> 10000)
export function parseMontant(montantStr: string): number {
  const cleaned = montantStr.replace(/[^\d]/g, '');
  return parseInt(cleaned, 10) || 0;
}

// Formater un montant en euros
export function formatEuro(amount: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// Formater une date en français
export function formatDate(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(dateObj);
}

// Calculer l'ancienneté en années
export function calculateAnciennete(dateCreation: string): number {
  const creation = new Date(dateCreation);
  const now = new Date();
  const diff = now.getTime() - creation.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24 * 365));
}

// Obtenir la couleur du badge selon le type d'aide
export function getAideTypeColor(type: string): string {
  const colors: Record<string, string> = {
    subvention: 'bg-green-100 text-green-800 border-green-300',
    accompagnement: 'bg-blue-100 text-blue-800 border-blue-300',
    incubateur: 'bg-purple-100 text-purple-800 border-purple-300',
    pret: 'bg-orange-100 text-orange-800 border-orange-300',
  };
  return colors[type] || 'bg-gray-100 text-gray-800 border-gray-300';
}

// Obtenir la couleur du badge selon le niveau
export function getNiveauColor(niveau: string): string {
  const colors: Record<string, string> = {
    local: 'bg-indigo-100 text-indigo-800 border-indigo-300',
    départemental: 'bg-cyan-100 text-cyan-800 border-cyan-300',
    régional: 'bg-teal-100 text-teal-800 border-teal-300',
    national: 'bg-blue-100 text-blue-800 border-blue-300',
    européen: 'bg-violet-100 text-violet-800 border-violet-300',
  };
  return colors[niveau] || 'bg-gray-100 text-gray-800 border-gray-300';
}

// Obtenir un emoji selon le type d'aide
export function getAideTypeIcon(type: string): string {
  const icons: Record<string, string> = {
    subvention: '💰',
    accompagnement: '🤝',
    incubateur: '🚀',
    pret: '🏦',
  };
  return icons[type] || '📋';
}
