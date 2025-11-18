import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import Anthropic from '@anthropic-ai/sdk';
import { z } from 'zod';

const requestSchema = z.object({
  companyAId: z.string().uuid(),
  companyBId: z.string().uuid(),
});

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

function buildComparisonPrompt(companyA: any, companyB: any, aidesA: any[], aidesB: any[]): string {
  // Identifier les aides communes et uniques
  const titresA = new Set(aidesA.map(a => a.titre.toLowerCase().trim()));
  const titresB = new Set(aidesB.map(a => a.titre.toLowerCase().trim()));

  const aidesCommunes = aidesA.filter(a => titresB.has(a.titre.toLowerCase().trim()));
  const aidesUniquesA = aidesA.filter(a => !titresB.has(a.titre.toLowerCase().trim()));
  const aidesUniquesB = aidesB.filter(a => !titresA.has(a.titre.toLowerCase().trim()));

  return `Tu es un expert en stratégie d'entreprise et en aides publiques. Compare ces deux entreprises et génère une analyse stratégique complète.

**ENTREPRISE A :**
- Dénomination : ${companyA.denomination}
- SIRET : ${companyA.siret || 'Non renseigné'}
- Secteur : ${companyA.secteur} (${companyA.code_ape || 'N/A'})
- Effectif : ${companyA.effectif}
- Localisation : ${companyA.localisation}, ${companyA.code_postal}
- Forme juridique : ${companyA.forme_juridique || 'N/A'}
- Date création : ${companyA.date_creation || 'N/A'}
- Catégorie : ${companyA.categorie_entreprise || 'N/A'}
- Nombre d'aides éligibles : ${aidesA.length}

**ENTREPRISE B :**
- Dénomination : ${companyB.denomination}
- SIRET : ${companyB.siret || 'Non renseigné'}
- Secteur : ${companyB.secteur} (${companyB.code_ape || 'N/A'})
- Effectif : ${companyB.effectif}
- Localisation : ${companyB.localisation}, ${companyB.code_postal}
- Forme juridique : ${companyB.forme_juridique || 'N/A'}
- Date création : ${companyB.date_creation || 'N/A'}
- Catégorie : ${companyB.categorie_entreprise || 'N/A'}
- Nombre d'aides éligibles : ${aidesB.length}

**STATISTIQUES DES AIDES :**
- Aides communes aux deux : ${aidesCommunes.length}
- Aides uniques à l'entreprise A : ${aidesUniquesA.length}
- Aides uniques à l'entreprise B : ${aidesUniquesB.length}

**AIDES UNIQUES À L'ENTREPRISE A :**
${aidesUniquesA.length > 0 ? aidesUniquesA.slice(0, 5).map(a => `- ${a.titre} (${a.organisme}) - ${a.montant_estime || 'Montant variable'}`).join('\n') : 'Aucune aide unique'}

**AIDES UNIQUES À L'ENTREPRISE B :**
${aidesUniquesB.length > 0 ? aidesUniquesB.slice(0, 5).map(a => `- ${a.titre} (${a.organisme}) - ${a.montant_estime || 'Montant variable'}`).join('\n') : 'Aucune aide unique'}

**INSTRUCTIONS :**

Génère une analyse comparative complète et structurée. Concentre-toi sur :

1. **Différences clés** : Quelles sont les différences principales entre ces deux entreprises qui expliquent leurs aides différentes ?
2. **Avantages de A vs B** : Quels avantages l'entreprise A a-t-elle par rapport à B ?
3. **Avantages de B vs A** : Quels avantages l'entreprise B a-t-elle par rapport à A ?
4. **Opportunités pour A** : Que peut faire l'entreprise A pour accéder aux mêmes aides que B ?
5. **Insights stratégiques** : Quelles conclusions stratégiques l'utilisateur (qui est l'entreprise A) devrait-il tirer de cette comparaison ?

**IMPORTANT** : Sois précis, concret et actionnable. Donne des recommandations pratiques.

Réponds UNIQUEMENT avec un JSON valide (sans markdown, sans backticks) :
{
  "analysis_summary": "Résumé global de la comparaison en 3-4 phrases",
  "key_differences": [
    {
      "aspect": "Taille/Effectif/Secteur/Localisation/Âge",
      "company_a": "Description pour A",
      "company_b": "Description pour B",
      "impact": "Impact sur les aides disponibles"
    }
  ],
  "advantages_a": [
    "Avantage 1 de A par rapport à B",
    "Avantage 2 de A par rapport à B"
  ],
  "advantages_b": [
    "Avantage 1 de B par rapport à A",
    "Avantage 2 de B par rapport à A"
  ],
  "opportunities_a": [
    {
      "action": "Action concrète à entreprendre",
      "benefit": "Bénéfice attendu",
      "difficulty": "Facile/Moyen/Difficile"
    }
  ],
  "opportunities_b": [
    {
      "action": "Action concrète à entreprendre",
      "benefit": "Bénéfice attendu",
      "difficulty": "Facile/Moyen/Difficile"
    }
  ],
  "strategic_insights": "Conclusions stratégiques et recommandations pour l'utilisateur (entreprise A) en 4-5 phrases. Sois actionnable et concret."
}`;
}

export async function POST(request: NextRequest) {
  try {
    // Authentification
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

    // Validation
    const body = await request.json();
    const validation = requestSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    const { companyAId, companyBId } = validation.data;

    if (companyAId === companyBId) {
      return NextResponse.json(
        { error: 'Impossible de comparer une entreprise avec elle-même' },
        { status: 400 }
      );
    }

    // Vérifier si une comparaison existe déjà
    const { data: existingComparison } = await supabase
      .from('company_comparisons')
      .select('*')
      .eq('user_id', user.id)
      .eq('company_a_id', companyAId)
      .eq('company_b_id', companyBId)
      .single();

    if (existingComparison) {
      return NextResponse.json({
        comparison: existingComparison,
        source: 'database',
      });
    }

    // Récupérer les deux entreprises
    const { data: companyA, error: errorA } = await supabase
      .from('companies')
      .select('*')
      .eq('id', companyAId)
      .eq('user_id', user.id)
      .single();

    const { data: companyB, error: errorB } = await supabase
      .from('companies')
      .select('*')
      .eq('id', companyBId)
      .eq('user_id', user.id)
      .single();

    if (errorA || !companyA || errorB || !companyB) {
      return NextResponse.json(
        { error: 'Une ou plusieurs entreprises introuvables' },
        { status: 404 }
      );
    }

    // Récupérer les aides pour chaque entreprise
    const { data: aidesA } = await supabase
      .from('aides_recommendations')
      .select('*')
      .eq('company_id', companyAId)
      .order('score_pertinence', { ascending: false });

    const { data: aidesB } = await supabase
      .from('aides_recommendations')
      .select('*')
      .eq('company_id', companyBId)
      .order('score_pertinence', { ascending: false });

    // Générer l'analyse avec Claude AI
    const prompt = buildComparisonPrompt(
      companyA,
      companyB,
      aidesA || [],
      aidesB || []
    );

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

    // Parser la réponse
    const responseText = message.content[0].type === 'text'
      ? message.content[0].text
      : '';

    let analysisData;
    try {
      const cleanJson = responseText
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();
      analysisData = JSON.parse(cleanJson);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      throw new Error('Erreur lors du parsing de la réponse IA');
    }

    // Calculer les statistiques
    const titresA = new Set((aidesA || []).map(a => a.titre.toLowerCase().trim()));
    const titresB = new Set((aidesB || []).map(a => a.titre.toLowerCase().trim()));

    const aidesCommunes = (aidesA || []).filter(a => titresB.has(a.titre.toLowerCase().trim()));
    const aidesUniquesA = (aidesA || []).filter(a => !titresB.has(a.titre.toLowerCase().trim()));
    const aidesUniquesB = (aidesB || []).filter(a => !titresA.has(a.titre.toLowerCase().trim()));

    // Enregistrer la comparaison
    const comparisonData = {
      user_id: user.id,
      company_a_id: companyAId,
      company_b_id: companyBId,
      analysis_summary: analysisData.analysis_summary,
      key_differences: analysisData.key_differences,
      opportunities_a: analysisData.opportunities_a,
      opportunities_b: analysisData.opportunities_b,
      strategic_insights: analysisData.strategic_insights,
      total_aides_a: (aidesA || []).length,
      total_aides_b: (aidesB || []).length,
      aides_common: aidesCommunes.length,
      aides_unique_a: aidesUniquesA.length,
      aides_unique_b: aidesUniquesB.length,
    };

    const { data: comparison, error: insertError } = await supabase
      .from('company_comparisons')
      .insert(comparisonData)
      .select()
      .single();

    if (insertError) {
      console.error('Insert error:', insertError);
      throw new Error('Erreur lors de l\'enregistrement de la comparaison');
    }

    return NextResponse.json({
      comparison,
      companyA,
      companyB,
      aidesA: aidesA || [],
      aidesB: aidesB || [],
      aidesCommunes,
      aidesUniquesA,
      aidesUniquesB,
      advantages_a: analysisData.advantages_a,
      advantages_b: analysisData.advantages_b,
      source: 'ai',
    });
  } catch (error) {
    console.error('Comparison error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erreur serveur' },
      { status: 500 }
    );
  }
}
