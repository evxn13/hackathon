export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      companies: {
        Row: {
          id: string
          user_id: string
          siret: string
          denomination: string
          secteur: string
          code_ape: string
          effectif: string
          localisation: string
          code_postal: string
          ca_actuel: number | null
          date_creation: string
          forme_juridique: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          siret: string
          denomination: string
          secteur: string
          code_ape: string
          effectif: string
          localisation: string
          code_postal: string
          ca_actuel?: number | null
          date_creation: string
          forme_juridique?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          siret?: string
          denomination?: string
          secteur?: string
          code_ape?: string
          effectif?: string
          localisation?: string
          code_postal?: string
          ca_actuel?: number | null
          date_creation?: string
          forme_juridique?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      aides_recommendations: {
        Row: {
          id: string
          company_id: string
          user_id: string
          titre: string
          description: string
          type_aide: string
          niveau: string
          montant_estime: string | null
          organisme: string
          criteres_eligibilite: string[]
          lien_externe: string | null
          score_pertinence: number
          generated_by_ai: boolean
          created_at: string
        }
        Insert: {
          id?: string
          company_id: string
          user_id: string
          titre: string
          description: string
          type_aide: string
          niveau: string
          montant_estime?: string | null
          organisme: string
          criteres_eligibilite: string[]
          lien_externe?: string | null
          score_pertinence: number
          generated_by_ai?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          company_id?: string
          user_id?: string
          titre?: string
          description?: string
          type_aide?: string
          niveau?: string
          montant_estime?: string | null
          organisme?: string
          criteres_eligibilite?: string[]
          lien_externe?: string | null
          score_pertinence?: number
          generated_by_ai?: boolean
          created_at?: string
        }
      }
      revenue_projections: {
        Row: {
          id: string
          company_id: string
          ca_actuel: number
          ca_projete: number
          periode: string
          avec_aides: boolean
          created_at: string
        }
        Insert: {
          id?: string
          company_id: string
          ca_actuel: number
          ca_projete: number
          periode: string
          avec_aides?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          company_id?: string
          ca_actuel?: number
          ca_projete?: number
          periode?: string
          avec_aides?: boolean
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
