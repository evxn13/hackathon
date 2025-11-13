import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import Anthropic from '@anthropic-ai/sdk';
import { z } from 'zod';
import { AideRecommendation } from '@/lib/types';

const requestSchema = z.object({
  companyId: z.string().uuid(),
});

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

// Fonction pour normaliser les valeurs selon les contraintes DB
function normalizeTypeAide(type: string): string {
  const normalized = type.toLowerCase().trim();
  const mapping: Record<string, string> = {
    'subvention': 'subvention',
    'subventions': 'subvention',
    'aide financière': 'subvention',
    'aide_financiere': 'subvention',
    'financement': 'subvention',
    'accompagnement': 'accompagnement',
    'conseil': 'accompagnement',
    'formation': 'accompagnement',
    'incubateur': 'incubateur',
    'incubation': 'incubateur',
    'accelerateur': 'incubateur',
    'accélérateur': 'incubateur',
    'pret': 'pret',
    'prêt': 'pret',
    'crédit': 'pret',
    'credit': 'pret',
    'emprunt': 'pret',
  };
  return mapping[normalized] || 'accompagnement'; // Par défaut: accompagnement
}

function normalizeNiveau(niveau: string): string {
  const normalized = niveau.toLowerCase().trim();
  const mapping: Record<string, string> = {
    'local': 'local',
    'locale': 'local',
    'métropolitain': 'local',
    'metropolitain': 'local',
    'communal': 'local',
    'départemental': 'départemental',
    'departemental': 'départemental',
    'département': 'départemental',
    'departement': 'départemental',
    'régional': 'régional',
    'regional': 'régional',
    'région': 'régional',
    'region': 'régional',
    'national': 'national',
    'nationale': 'national',
    'français': 'national',
    'francais': 'national',
    'france': 'national',
    'européen': 'européen',
    'europeen': 'européen',
    'europe': 'européen',
    'ue': 'européen',
  };
  return mapping[normalized] || 'national'; // Par défaut: national
}

function buildAnalysisPrompt(company: any): string {
  return `Tu es un expert en aides aux entreprises en France, spécialisé dans les dispositifs de la Métropole Aix-Marseille-Provence, de la Région Sud, nationaux et européens.

Analyse le profil de cette entreprise et génère une liste d'aides pertinentes :

**Profil de l'entreprise :**
- SIRET : ${company.siret || 'Non renseigné (saisie manuelle)'}
- Dénomination : ${company.denomination}
- Secteur d'activité : ${company.secteur} (Code APE: ${company.code_ape || 'Non renseigné'})
- Effectif : ${company.effectif}
- Localisation : ${company.localisation}, ${company.code_postal}
- Forme juridique : ${company.forme_juridique || 'Non renseignée'}
- Date de création : ${company.date_creation || 'Non renseignée'}
- Emploi de travailleurs handicapés : ${company.emploi_handicap ? 'OUI - IMPORTANT: Inclure impérativement des aides AGEFIPH et liées au handicap' : 'Non'}

**Instructions :**
Génère une liste de 8 à 12 aides pertinentes adaptées à ce profil.

${company.emploi_handicap ? '⚠️ PRIORITÉ ABSOLUE: Cette entreprise emploie ou souhaite employer des travailleurs en situation de handicap. INCLURE OBLIGATOIREMENT au moins 2-3 aides spécifiques:\n- Aides AGEFIPH (aide à l\'embauche, maintien dans l\'emploi)\n- Aides à l\'adaptation du poste de travail\n- Reconnaissance Travailleur Handicapé (RQTH)\n- Contrats aidés pour travailleurs handicapés\n\n' : ''}Priorise :
1. Les aides métropolitaines (Métropole Aix-Marseille-Provence)
2. Les aides régionales (Région Sud - PACA)
3. Les aides nationales (BPI France, ADEME, etc.)
4. Les aides européennes si pertinent

Pour chaque aide, fournis :
- **titre** : Nom officiel de l'aide
- **description** : Description claire en 2-3 phrases de l'aide et ses bénéfices
- **type_aide** : "subvention", "accompagnement", "incubateur" ou "pret"
- **niveau** : "local", "régional", "national" ou "européen"
- **montant_estime** : Montant estimé avec unité (ex: "10 000 €", "Jusqu'à 50 000 €", "Variable")
- **organisme** : Organisme gestionnaire
- **criteres_eligibilite** : Array de 3-5 critères principaux
- **score_pertinence** : Score entre 0.60 et 0.99 (plus c'est pertinent, plus c'est proche de 1)

**Exemples d'aides à considérer :**
- Subventions métropolitaines pour la transition écologique
- Accompagnement Région Sud pour l'innovation
- Prêts BPI France
- Aides France 2030
- Programmes européens (FEDER, FSE+, Horizon Europe)
- Dispositifs sectoriels spécifiques

**IMPORTANT - Organismes officiels à utiliser :**
Utilise UNIQUEMENT ces noms d'organismes officiels (pour que les liens fonctionnent) :
- "BPI France" ou "Bpifrance" (pour les prêts et garanties)
- "ADEME" (pour transition écologique)
- "Région Sud" (pour aides régionales PACA)
- "Métropole Aix-Marseille-Provence" (pour aides locales)
- "Pôle Emploi" (pour aides à l'embauche)
- "URSSAF" (pour exonérations de charges)
- "France 2030" (pour innovation et transition)
- "Commission Européenne" ou "FEDER" ou "Horizon Europe" (pour aides européennes)

Réponds UNIQUEMENT avec un JSON valide au format suivant (sans markdown, sans backticks) :
{
  "aides": [
    {
      "titre": "...",
      "description": "...",
      "type_aide": "...",
      "niveau": "...",
      "montant_estime": "...",
      "organisme": "...",
      "criteres_eligibilite": ["...", "..."],
      "score_pertinence": 0.95
    }
  ]
}`;
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

    const { companyId } = validation.data;

    // Récupérer les données de l'entreprise
    const { data: company, error: companyError } = await supabase
      .from('companies')
      .select('*')
      .eq('id', companyId)
      .eq('user_id', user.id)
      .single();

    if (companyError || !company) {
      return NextResponse.json(
        { error: 'Entreprise introuvable' },
        { status: 404 }
      );
    }

    // Vérifier si des aides existent déjà pour cette entreprise
    const { data: existingAides, error: aidesError } = await supabase
      .from('aides_recommendations')
      .select('*')
      .eq('company_id', companyId)
      .order('score_pertinence', { ascending: false });

    if (!aidesError && existingAides && existingAides.length > 0) {
      // Retourner les aides existantes
      return NextResponse.json({
        aides: existingAides,
        source: 'database',
      });
    }

    // Générer les aides avec Claude AI
    const prompt = buildAnalysisPrompt(company);

    const message = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 4096,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    // Extraire le JSON de la réponse
    const responseText = message.content[0].type === 'text'
      ? message.content[0].text
      : '';

    // Parser la réponse JSON
    let aidesData;
    try {
      // Nettoyer la réponse (enlever les backticks markdown si présents)
      const cleanJson = responseText
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();
      aidesData = JSON.parse(cleanJson);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      console.error('Response text:', responseText);
      throw new Error('Erreur lors du parsing de la réponse IA');
    }

    const aides: AideRecommendation[] = aidesData.aides;

    // Enregistrer les aides dans la base de données avec normalisation
    const aidesWithIds = aides.map((aide) => ({
      company_id: companyId,
      user_id: user.id,
      titre: aide.titre,
      description: aide.description,
      type_aide: normalizeTypeAide(aide.type_aide),
      niveau: normalizeNiveau(aide.niveau),
      montant_estime: aide.montant_estime || null,
      organisme: aide.organisme,
      criteres_eligibilite: aide.criteres_eligibilite,
      score_pertinence: Math.min(0.99, Math.max(0.60, aide.score_pertinence)), // Clamp entre 0.60 et 0.99
      generated_by_ai: true,
    }));

    const { data: insertedAides, error: insertError } = await supabase
      .from('aides_recommendations')
      .insert(aidesWithIds)
      .select();

    if (insertError) {
      console.error('Insert error:', insertError);
      throw new Error('Erreur lors de l\'enregistrement des aides');
    }

    // Calculer la projection de CA si un CA actuel est renseigné
    let projection = null;
    if (company.ca_actuel) {
      const totalAidesPotentielles = aides
        .filter((a) => a.montant_estime)
        .reduce((sum, aide) => {
          const montant = aide.montant_estime || '';
          // Extraire les chiffres de la chaîne
          const matches = montant.match(/[\d\s]+/g);
          if (matches) {
            const cleanNumber = matches[0].replace(/\s/g, '');
            return sum + parseInt(cleanNumber, 10);
          }
          return sum;
        }, 0);

      const caProjecte = company.ca_actuel + totalAidesPotentielles * 0.7;

      const { data: projectionData } = await supabase
        .from('revenue_projections')
        .insert({
          company_id: companyId,
          ca_actuel: company.ca_actuel,
          ca_projete: caProjecte,
          periode: 'année',
          avec_aides: true,
        })
        .select()
        .single();

      projection = projectionData;
    }

    return NextResponse.json({
      aides: insertedAides,
      projection,
      source: 'ai',
    });
  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erreur serveur' },
      { status: 500 }
    );
  }
}
