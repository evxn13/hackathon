import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

const manualCompanySchema = z.object({
  denomination: z.string().min(1, 'Le nom de l\'entreprise est requis'),
  secteur: z.string().min(1, 'Le secteur d\'activité est requis'),
  code_ape: z.string().optional(),
  effectif: z.string().optional(),
  localisation: z.string().optional(),
  code_postaux: z.array(z.string().regex(/^\d{5}$/, 'Code postal invalide'))
    .min(1, 'Au moins un code postal est requis'),
  forme_juridique: z.string().optional(),
  emploi_handicap: z.boolean().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();

    // Vérifier l'authentification
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    // Valider les données
    const body = await request.json();
    const validation = manualCompanySchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    const data = validation.data;

    // Créer l'entreprise dans Supabase
    const companyData = {
      user_id: user.id,
      siret: null, // Pas de SIRET pour saisie manuelle
      denomination: data.denomination,
      secteur: data.secteur || 'Non renseigné',
      code_ape: data.code_ape || null,
      effectif: data.effectif || 'Non renseigné',
      localisation: data.localisation || 'Non renseigné',
      code_postal: data.code_postaux[0], // Keep first for backward compatibility
      code_postaux: data.code_postaux, // New array field
      forme_juridique: data.forme_juridique || 'Non renseignée',
      emploi_handicap: data.emploi_handicap || false,
      date_creation: new Date().toISOString().split('T')[0],
      created_at: new Date().toISOString(),
    };

    const { data: company, error: insertError } = await supabase
      .from('companies')
      .insert([companyData])
      .select()
      .single();

    if (insertError) {
      console.error('Insert error:', insertError);
      return NextResponse.json(
        { error: 'Erreur lors de la création de l\'entreprise' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      company,
      source: 'manual',
    });
  } catch (error) {
    console.error('Manual company creation error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erreur serveur' },
      { status: 500 }
    );
  }
}
