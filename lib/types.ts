// Types pour les données INSEE
export interface InseeData {
  siret: string;
  denomination: string;
  activitePrincipale: string; // Code APE
  activitePrincipaleLibelle?: string;
  trancheEffectifsEtablissement: string;
  adresseEtablissement: {
    codePostal: string;
    libelleCommuneEtablissement: string;
    numeroVoieEtablissement?: string;
    typeVoieEtablissement?: string;
    libelleVoieEtablissement?: string;
  };
  dateCreationEtablissement: string;
  uniteLegale: {
    denominationUniteLegale?: string;
    categorieJuridiqueUniteLegale?: string;
    dateCreationUniteLegale?: string;
  };
}

// Types pour la base de données
export interface Company {
  id: string;
  user_id: string;
  siret: string;
  denomination: string;
  secteur: string;
  code_ape: string;
  effectif: string;
  localisation: string;
  code_postal: string; // Deprecated: kept for backward compatibility
  code_postaux?: string[]; // Array of postal codes where company operates
  ca_actuel?: number;
  date_creation: string;
  forme_juridique?: string;
  emploi_handicap?: boolean;
  created_at: string;
  updated_at: string;
}

export type TypeAide = 'subvention' | 'accompagnement' | 'incubateur' | 'pret';
export type NiveauAide = 'local' | 'départemental' | 'régional' | 'national' | 'européen';

export interface AideRecommendation {
  id?: string;
  company_id?: string;
  user_id?: string;
  titre: string;
  description: string;
  type_aide: TypeAide;
  niveau: NiveauAide;
  montant_estime?: string;
  organisme: string;
  criteres_eligibilite: string[];
  lien_externe?: string;
  score_pertinence: number;
  generated_by_ai?: boolean;
  created_at?: string;
}

export interface RevenueProjection {
  id?: string;
  company_id: string;
  ca_actuel: number;
  ca_projete: number;
  periode: string;
  avec_aides: boolean;
  created_at?: string;
}

// Types pour les requêtes API
export interface AnalyzeCompanyRequest {
  companyId: string;
}

export interface AnalyzeCompanyResponse {
  aides: AideRecommendation[];
  projection?: RevenueProjection;
}

export interface GetInseeDataRequest {
  siret: string;
}

export interface GetInseeDataResponse {
  company: Partial<Company>;
  inseeData: InseeData;
}
