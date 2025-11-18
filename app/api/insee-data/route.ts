import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { validateSiret } from '@/lib/utils';
import { z } from 'zod';

const requestSchema = z.object({
  siret: z.string().refine(validateSiret, {
    message: 'SIRET invalide (doit contenir 14 chiffres)',
  }),
  emploi_handicap: z.boolean().optional(),
});

// Note: L'API INSEE Sirene V3.11 utilise le header X-INSEE-Api-Key-Integration
// Obtenir la clé sur https://portail-api.insee.fr/
async function fetchInseeData(siret: string) {
  const apiKey = process.env.INSEE_API_KEY;

  if (!apiKey) {
    console.error('❌ INSEE_API_KEY not configured in environment variables');
    throw new Error('INSEE_API_KEY not configured');
  }

  const cleanSiret = siret.replace(/\s/g, '');
  const url = `https://api.insee.fr/api-sirene/3.11/siret/${cleanSiret}`;

  const response = await fetch(url, {
    headers: {
      'X-INSEE-Api-Key-Integration': apiKey,
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    const errorText = await response.text();

    if (response.status === 404) {
      throw new Error('SIRET introuvable dans la base INSEE');
    }
    if (response.status === 401) {
      throw new Error('Clé API INSEE invalide ou expirée');
    }
    throw new Error(`Erreur API INSEE: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  return data;
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

    const { siret, emploi_handicap } = validation.data;

    const cleanSiret = siret.replace(/\s/g, '');

    // Vérifier si l'entreprise existe déjà
    const { data: existingCompany } = await supabase
      .from('companies')
      .select('*')
      .eq('siret', cleanSiret)
      .eq('user_id', user.id)
      .single();

    if (existingCompany) {
      return NextResponse.json({
        company: existingCompany,
        source: 'database',
      });
    }

    // Récupérer les données de l'API INSEE
    console.log('📡 Fetching INSEE data for SIRET:', cleanSiret);
    const inseeResponse = await fetchInseeData(cleanSiret);
    console.log('✅ INSEE API response received');

    // Parser la réponse INSEE (structure complète validée)
    const etablissement = inseeResponse.etablissement;
    console.log('🏢 Établissement data:', {
      siret: etablissement.siret,
      siege: etablissement.etablissementSiege,
      effectifs: etablissement.trancheEffectifsEtablissement
    });

    const uniteLegale = etablissement.uniteLegale;
    console.log('🏛️ Unité légale:', {
      denomination: uniteLegale.denominationUniteLegale,
      categorie: uniteLegale.categorieEntreprise,
      ess: uniteLegale.economieSocialeSolidaireUniteLegale
    });

    const adresse = etablissement.adresseEtablissement;
    console.log('📍 Adresse:', {
      commune: adresse.libelleCommuneEtablissement,
      codePostal: adresse.codePostalEtablissement
    });

    // Prendre la première période (la plus récente)
    const periodesEtablissement = etablissement.periodesEtablissement[0];
    console.log('📅 Période établissement:', {
      dateDebut: periodesEtablissement.dateDebut,
      activite: periodesEtablissement.activitePrincipaleEtablissement
    });

    // Fonction pour convertir tranche effectif INSEE en texte lisible
    const getEffectifLabel = (trancheCode: string | null): string => {
      const tranches: Record<string, string> = {
        '00': '0 salarié',
        '01': '1 ou 2 salariés',
        '02': '3 à 5 salariés',
        '03': '6 à 9 salariés',
        '11': '10 à 19 salariés',
        '12': '20 à 49 salariés',
        '21': '50 à 99 salariés',
        '22': '100 à 199 salariés',
        '31': '200 à 249 salariés (PME max)',
        '32': '250 à 499 salariés',
        '41': '500 à 999 salariés',
        '42': '1000 à 1999 salariés',
        '51': '2000 à 4999 salariés',
        '52': '5000 à 9999 salariés',
        '53': '10000 salariés et plus',
        'NN': 'Non renseigné',
      };
      return tranches[trancheCode || ''] || 'Non renseigné';
    };

    // Construire le nom complet (dénomination ou nom+prénom pour personne physique)
    let denomination = uniteLegale.denominationUniteLegale;
    if (!denomination && uniteLegale.nomUniteLegale) {
      // Personne physique
      const prenom = uniteLegale.prenom1UniteLegale || '';
      denomination = `${prenom} ${uniteLegale.nomUniteLegale}`.trim();
    }
    denomination = denomination || 'Dénomination non disponible';

    // Construire le nom de la ville
    const localisation = adresse.libelleCommuneEtablissement || 'Non renseigné';

    // Extraire le code postal (5 chiffres)
    const codePostal = adresse.codePostalEtablissement || '';

    // Récupérer la tranche effectif (soit de l'établissement soit de l'unité légale)
    const trancheEffectif = etablissement.trancheEffectifsEtablissement ||
                           uniteLegale.trancheEffectifsUniteLegale;

    // Construire l'adresse complète
    const numeroVoie = adresse.numeroVoieEtablissement || '';
    const typeVoie = adresse.typeVoieEtablissement || '';
    const libelleVoie = adresse.libelleVoieEtablissement || '';
    const adresseComplete = `${numeroVoie} ${typeVoie} ${libelleVoie}`.trim();

    // Extraire le code département depuis le code postal (2 premiers chiffres)
    const codeDepartement = codePostal ? codePostal.substring(0, 2) : null;

    // Construire l'objet entreprise avec champs de base uniquement
    const companyData: any = {
      user_id: user.id,
      siret: cleanSiret,
      denomination,
      secteur: periodesEtablissement.activitePrincipaleEtablissement || 'Non renseigné',
      code_ape: periodesEtablissement.activitePrincipaleEtablissement || null,
      effectif: getEffectifLabel(trancheEffectif),
      localisation,
      code_postal: codePostal,
      code_postaux: codePostal ? [codePostal] : [], // Array pour support multi-sites
      date_creation: uniteLegale.dateCreationUniteLegale ||
                     etablissement.dateCreationEtablissement ||
                     new Date().toISOString().split('T')[0],
      forme_juridique: uniteLegale.categorieJuridiqueUniteLegale || 'Non renseignée',
    };

    console.log('💾 Données à insérer dans Supabase:', {
      ...companyData,
      user_id: '***',
      emploi_handicap_fourni: emploi_handicap
    });

    // Enregistrer dans la base de données
    const { data: company, error: insertError } = await supabase
      .from('companies')
      .insert(companyData)
      .select()
      .single();

    if (insertError) {
      console.error('❌ Insert error:', insertError);
      console.error('❌ Error details:', {
        code: insertError.code,
        message: insertError.message,
        details: insertError.details,
        hint: insertError.hint
      });
      return NextResponse.json(
        { error: 'Erreur lors de l\'enregistrement de l\'entreprise' },
        { status: 500 }
      );
    }

    console.log('✅ Entreprise enregistrée avec succès:', company.id);

    return NextResponse.json({
      company,
      source: 'insee',
    });
  } catch (error) {
    console.error('INSEE API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erreur serveur' },
      { status: 500 }
    );
  }
}
