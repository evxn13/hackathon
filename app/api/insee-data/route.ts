import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { validateSiret } from '@/lib/utils';
import { z } from 'zod';

const requestSchema = z.object({
  siret: z.string().refine(validateSiret, {
    message: 'SIRET invalide (doit contenir 14 chiffres)',
  }),
});

// Note: L'API INSEE nécessite un token d'authentification Bearer
// Obtenir un token sur https://api.insee.fr
async function getInseeAccessToken(): Promise<string> {
  const apiKey = process.env.INSEE_API_KEY;
  const apiSecret = process.env.INSEE_API_SECRET;

  if (!apiKey || !apiSecret) {
    throw new Error('INSEE API credentials not configured');
  }

  const credentials = Buffer.from(`${apiKey}:${apiSecret}`).toString('base64');

  const response = await fetch('https://api.insee.fr/token', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  if (!response.ok) {
    throw new Error('Failed to get INSEE access token');
  }

  const data = await response.json();
  return data.access_token;
}

async function fetchInseeData(siret: string, accessToken: string) {
  const cleanSiret = siret.replace(/\s/g, '');

  const response = await fetch(
    `https://api.insee.fr/entreprises/sirene/V3.11/siret/${cleanSiret}`,
    {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json',
      },
    }
  );

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('SIRET introuvable dans la base INSEE');
    }
    throw new Error('Erreur lors de la récupération des données INSEE');
  }

  return response.json();
}

export async function POST(request: NextRequest) {
  try {
    // Vérifier l'authentification
    const supabase = createClient();
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

    // Valider la requête
    const body = await request.json();
    const validation = requestSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    const { siret } = validation.data;

    // Vérifier si l'entreprise existe déjà
    const { data: existingCompany } = await supabase
      .from('companies')
      .select('*')
      .eq('siret', siret.replace(/\s/g, ''))
      .eq('user_id', user.id)
      .single();

    if (existingCompany) {
      return NextResponse.json({
        company: existingCompany,
        source: 'database',
      });
    }

    // MODE MOCK pour le hackathon (API INSEE temporairement désactivée)
    // TODO: Réactiver l'API INSEE une fois le problème d'authentification résolu

    // Données mock basées sur le SIRET
    const mockData: Record<string, any> = {
      '32737442200053': {
        denomination: 'MICROSOFT FRANCE',
        code_ape: '6201Z',
        secteur: 'Programmation informatique',
        effectif: '21',
        localisation: 'ISSY-LES-MOULINEAUX',
        code_postal: '92130',
        forme_juridique: '5499',
      },
      '73282932000074': {
        denomination: 'APPLE FRANCE',
        code_ape: '4741Z',
        secteur: 'Commerce de détail d\'ordinateurs',
        effectif: '22',
        localisation: 'PARIS 8',
        code_postal: '75008',
        forme_juridique: '5499',
      },
      '44306194400047': {
        denomination: 'GOOGLE FRANCE',
        code_ape: '6201Z',
        secteur: 'Programmation informatique',
        effectif: '22',
        localisation: 'PARIS 9',
        code_postal: '75009',
        forme_juridique: '5499',
      },
    };

    const cleanSiret = siret.replace(/\s/g, '');
    const mock = mockData[cleanSiret];

    if (!mock) {
      return NextResponse.json(
        { error: 'SIRET non trouvé dans la base de démonstration. Utilisez: 32737442200053, 73282932000074, ou 44306194400047' },
        { status: 404 }
      );
    }

    // Construire l'objet entreprise
    const companyData = {
      user_id: user.id,
      siret: cleanSiret,
      denomination: mock.denomination,
      secteur: mock.secteur,
      code_ape: mock.code_ape,
      effectif: mock.effectif,
      localisation: mock.localisation,
      code_postal: mock.code_postal,
      date_creation: '2010-01-01',
      forme_juridique: mock.forme_juridique,
    };

    // Enregistrer dans la base de données
    const { data: company, error: insertError } = await supabase
      .from('companies')
      .insert(companyData)
      .select()
      .single();

    if (insertError) {
      console.error('Insert error:', insertError);
      return NextResponse.json(
        { error: 'Erreur lors de l\'enregistrement de l\'entreprise' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      company,
      source: 'mock',
    });
  } catch (error) {
    console.error('INSEE API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erreur serveur' },
      { status: 500 }
    );
  }
}
