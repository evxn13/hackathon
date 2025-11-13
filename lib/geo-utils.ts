// Utilitaires pour déterminer la localisation géographique

export function getDepartementFromCodePostal(codePostal: string): string {
  if (!codePostal) return 'Non renseigné';
  const dept = codePostal.substring(0, 2);
  return dept;
}

export function getDepartementName(code: string): string {
  const depts: Record<string, string> = {
    '13': 'Bouches-du-Rhône',
    '83': 'Var',
    '84': 'Vaucluse',
    '04': 'Alpes-de-Haute-Provence',
    '05': 'Hautes-Alpes',
    '06': 'Alpes-Maritimes',
    // Ajoutez d'autres si nécessaire
  };
  return depts[code] || `Département ${code}`;
}

export function getRegionFromDepartement(dept: string): string {
  const sudDepts = ['04', '05', '06', '13', '83', '84'];
  if (sudDepts.includes(dept)) {
    return 'Région Sud - Provence-Alpes-Côte d\'Azur';
  }
  return 'France';
}

export function getMetropoleFromCodePostal(codePostal: string): string | null {
  if (!codePostal) return null;

  // Aix-Marseille-Provence Métropole
  const ampCodes = [
    '13001', '13002', '13003', '13004', '13005', '13006', '13007', '13008',
    '13009', '13010', '13011', '13012', '13013', '13014', '13015', '13016',
    // Marseille arrondissements
    '13090', '13100', '13110', '13120', // Aix-en-Provence
    // Autres communes de la métropole
    '13127', '13170', '13240', '13290', '13390', '13480', '13540', '13580',
  ];

  if (ampCodes.some(code => codePostal.startsWith(code.substring(0, 5)))) {
    return 'Métropole Aix-Marseille-Provence';
  }

  return null;
}

export function getNiveauLabel(niveau: string): string {
  const labels: Record<string, string> = {
    'local': '🏘️ Métropole',
    'départemental': '🗺️ Département',
    'régional': '🌄 Région',
    'national': '🇫🇷 National',
    'européen': '🇪🇺 Européen',
  };
  return labels[niveau] || niveau;
}

export interface GeoContext {
  codePostal: string;
  departement: string;
  departementName: string;
  region: string;
  metropole: string | null;
}

export function getGeoContext(codePostal: string): GeoContext {
  const dept = getDepartementFromCodePostal(codePostal);
  return {
    codePostal,
    departement: dept,
    departementName: getDepartementName(dept),
    region: getRegionFromDepartement(dept),
    metropole: getMetropoleFromCodePostal(codePostal),
  };
}
