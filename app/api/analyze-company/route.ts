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
  // Calculer l'âge de l'entreprise
  const dateCreation = company.date_creation ? new Date(company.date_creation) : null;
  const ageEntreprise = dateCreation
    ? Math.floor((new Date().getTime() - dateCreation.getTime()) / (1000 * 60 * 60 * 24 * 365))
    : null;

  // Déterminer si jeune entreprise (< 3 ans) pour aides spécifiques
  const estJeuneEntreprise = ageEntreprise !== null && ageEntreprise < 3;

  // Formater les codes postaux multiples
  const codesPostaux = company.code_postaux && Array.isArray(company.code_postaux)
    ? company.code_postaux.join(', ')
    : company.code_postal;

  // Construire le contexte géographique enrichi
  const contextGeo = company.departement
    ? `Département ${company.departement}, ${company.localisation}`
    : `${company.localisation}`;

  return `Tu es un expert en aides aux entreprises en France, spécialisé dans les dispositifs de la Métropole Aix-Marseille-Provence, de la Région Sud, nationaux et européens.

Analyse le profil de cette entreprise et génère une liste d'aides pertinentes :

**Profil de l'entreprise :**
- SIRET : ${company.siret || 'Non renseigné (saisie manuelle)'}
- Dénomination : ${company.denomination}
- Secteur d'activité : ${company.secteur} (Code APE: ${company.code_ape || 'Non renseigné'})
- Effectif : ${company.effectif}${company.tranche_effectif_code ? ` (Code INSEE: ${company.tranche_effectif_code})` : ''}
- Localisation : ${contextGeo}
- Code(s) postal(aux) : ${codesPostaux}
- Forme juridique : ${company.forme_juridique || 'Non renseignée'}
- Date de création : ${company.date_creation || 'Non renseignée'}${ageEntreprise ? ` (${ageEntreprise} ans)` : ''}
${estJeuneEntreprise ? '- ⭐ **JEUNE ENTREPRISE** (< 3 ans) : Prioriser les aides à la création et au développement des jeunes entreprises\n' : ''}${company.categorie_entreprise ? `- Catégorie INSEE : ${company.categorie_entreprise}\n` : ''}${company.est_siege_social === false ? '- Type : Établissement secondaire (non siège social)\n' : ''}${company.caractere_employeur === 'O' ? '- Caractère employeur : OUI\n' : company.caractere_employeur === 'N' ? '- Caractère employeur : NON\n' : ''}${company.economie_sociale_solidaire ? '- ⭐ **ÉCONOMIE SOCIALE ET SOLIDAIRE (ESS)** : Inclure les aides spécifiques ESS\n' : ''}- Emploi de travailleurs handicapés : ${company.emploi_handicap ? 'OUI - IMPORTANT: Inclure impérativement des aides AGEFIPH et liées au handicap' : 'Non'}

**Instructions :**
Génère une liste de 5 à 12 aides **RÉELLEMENT ÉLIGIBLES** adaptées à ce profil.

⚠️ **PRIORITÉ ABSOLUE : ÉLIGIBILITÉ STRICTE**
- Vérifier TOUS les critères pour chaque aide AVANT de l'inclure
- Si UN SEUL critère n'est pas satisfait → NE PAS inclure l'aide
- Mieux vaut recommander 5 aides vraiment éligibles que 12 aides non pertinentes

🚨 **ATTENTION CRITIQUE - VÉRIFICATION GÉOGRAPHIQUE :**
- **Code postal de l'entreprise : ${codesPostaux}**
- **Département : ${company.departement || 'À vérifier'}**
- **Ville : ${company.localisation}**
- ❌ **NE PAS recommander d'aides métropolitaines/départementales d'autres territoires**
- ✅ **VÉRIFIER que CHAQUE aide locale correspond au département/métropole de l'entreprise**

${company.emploi_handicap ? '⚠️ PRIORITÉ ABSOLUE: Cette entreprise emploie ou souhaite employer des travailleurs en situation de handicap. INCLURE OBLIGATOIREMENT au moins 2-3 aides spécifiques:\n- Aides AGEFIPH (aide à l\'embauche, maintien dans l\'emploi)\n- Aides à l\'adaptation du poste de travail\n- Reconnaissance Travailleur Handicapé (RQTH)\n- Contrats aidés pour travailleurs handicapés\n\n' : ''}${estJeuneEntreprise ? '⚠️ JEUNE ENTREPRISE: Inclure des aides spécifiques à la création et au développement des jeunes entreprises (ACRE, exonérations, prêts d\'honneur, etc.)\n\n' : ''}${company.economie_sociale_solidaire ? '⚠️ ESS: Inclure des aides spécifiques à l\'économie sociale et solidaire (ESUS, France Active, etc.)\n\n' : ''}Priorise :
1. Les aides métropolitaines
2. Les aides régionales
3. Les aides nationales
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

**Exemples d'aides à considérer selon le profil :**

**Pour TOUTES les entreprises :**
- Prêts BPI France (garantie, croissance, innovation)
- Crédit d'impôt recherche (CIR) si applicable
- Exonérations de charges sociales selon le cas

**Si jeune entreprise (< 3 ans) :**
- ACRE (Aide à la Création ou Reprise d'Entreprise) - ⚠️ CRITÈRES STRICTS : < 1 an ET < 3 salariés
- NACRE (Nouvel Accompagnement pour la Création et la Reprise d'Entreprise)
- Prêts d'honneur (Réseau Entreprendre, Initiative France)
- Exonérations fiscales création entreprise

⚠️ **ATTENTION ACRE** : L'ACRE a des critères TRÈS RESTRICTIFS :
- Entreprise créée il y a MOINS DE 1 AN (pas 3 ans !)
- Moins de 3 salariés
- Si l'entreprise a plus de 1 an OU plus de 3 salariés → NE PAS recommander ACRE

**Si PME (< 250 salariés) :**
- Subventions France 2030 pour l'innovation
- Aides Région Sud pour le développement économique
- Dispositifs métropolitains spécifiques
- FEDER (Fonds Européen de Développement Régional)

**Si ESS (Économie Sociale et Solidaire) :**
- Dispositif Local d'Accompagnement (DLA)
- France Active
- Agrément ESUS
- Subventions spécifiques ESS

**Selon le secteur d'activité (Code APE) :**
- Transition écologique : ADEME, Métropole AMP
- Innovation/Tech : BPI, France 2030, Horizon Europe
- Commerce : Aides à la revitalisation commerciale
- Artisanat : Chambres des Métiers, Région Sud
- Agriculture : PAC, FEADER
- Tourisme : Atout France, Région Sud

**Si codes postaux multiples :**
- Considérer les aides de CHAQUE département/région concerné

**📌 RÈGLES OBLIGATOIRES - SOURCES OFFICIELLES (LISTE BLANCHE) :**

Tu DOIS rechercher EXCLUSIVEMENT dans ces sources officielles :

**Départements** (selon code postal de l'entreprise) :
- 13 Bouches-du-Rhône : https://www.departement13.fr
- 06 Alpes-Maritimes : https://www.departement06.fr
- 83 Var : https://www.var.fr
- 84 Vaucluse : https://www.vaucluse.fr
- [Adapter selon le département réel, voir liste blanche]

**Régions :**
- Provence-Alpes-Côte d'Azur (Sud) : https://www.maregionsud.fr
- Auvergne-Rhône-Alpes : https://www.auvergnerhonealpes.fr
- [Toutes régions françaises, voir liste blanche]

**Organismes nationaux :**
- Bpifrance : https://www.bpifrance.fr
- ADEME : https://www.ademe.fr
- France Travail : https://www.francetravail.fr
- URSSAF : https://www.urssaf.fr
- Service-Public.fr Professionnels : https://www.service-public.fr/professionnels-entreprises
- Ministère de l'Économie : https://www.economie.gouv.fr
- Aides-territoires : https://aides-territoires.beta.gouv.fr
- Les-aides.fr : https://www.les-aides.fr

**Organismes européens :**
- L'Europe est à vous : https://europa.eu/youreurope/business/
- EU Funding & Tenders : https://ec.europa.eu/info/funding-tenders/
- BEI : https://www.eib.org
- Enterprise Europe Network : https://een.ec.europa.eu

**CCI** (selon département) :
- CCI Provence-Alpes-Côte d'Azur : https://www.paca.cci.fr
- CCI Marseille : https://www.marseille.cci.fr
- CCI Nice : https://www.nicecotedazur.cci.fr
- [Adapter selon localisation]

**📊 MÉTHODOLOGIE STRICTE :**

1. **Extraire caractéristiques** : Secteur, taille, forme juridique, adresses
2. **Analyser sources** : Liste blanche uniquement
3. **Vérifier TOUS les critères** : Si UN critère non satisfait → NE PAS inclure
4. **Vérifier localisation** : Code postal + département doivent correspondre
5. **Citer critères textuellement**

**🚨 RÈGLES CRITIQUES :**

**Éligibilité** : Vérifier CHAQUE critère AVANT d'inclure une aide.
- ACRE : < 1 an ET < 3 salariés (PAS 3 ans !)
- Si entreprise 3 ans OU 10+ salariés → PAS ACRE

**Géographie** : Vérifier code postal/département pour aides locales.
- Métropole AMP = 13xxx (Marseille, Aix) - PAS Nice (06)
- Métropole Nice = 06xxx (Nice, Cannes) - PAS Marseille (13)
- Métropole TPM = 83xxx (Toulon) - PAS Marseille/Nice
- ❌ NE JAMAIS recommander aide géographique si localisation ≠

**TYPES D'AIDES À IDENTIFIER :**
- Aides financières (subventions directes, prêts bonifiés)
- Avantages fiscaux (crédit d'impôt, exonérations fiscales/sociales)
- Formations, accompagnement
- incubateurs pour les jeunes entreprise
- Aides techniques et réglementaires
- Toutes autres aides publiques existantes et adapté au type de l'entreprise

**⚠️ CONTRAINTES ABSOLUES :**
- ❌ NE PAS inventer montants/critères
- ❌ NE JAMAIS inclure si UN critère non satisfait
- ❌ NE JAMAIS recommander aide géographique si localisation ≠
- ✅ Sources liste blanche uniquement
- ✅ Précision > quantité : 5 aides éligibles > 12 aides approximatives

**FORMAT DES AIDES :**
Pour chaque aide identifiée, fournis :
- **titre** : Nom officiel du programme
- **description** : Avantages et bénéfices (2-3 phrases)
- **type_aide** : "subvention", "accompagnement", "incubateur" ou "pret"
- **niveau** : "local", "régional", "national" ou "européen"
- **montant_estime** : Montant exact si connu, sinon fourchette réaliste
- **organisme** : Nom EXACT de l'organisme (utilisé pour générer le lien)
- **criteres_eligibilite** : Liste des critères TEXTUELS extraits des sources officielles
- **score_pertinence** : 0.60-0.99 selon l'adéquation au profil

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
      let cleanJson = responseText
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();

      // Extraire le JSON s'il est entouré de texte
      const jsonMatch = cleanJson.match(/\{[\s\S]*"aides"[\s\S]*\}/);
      if (jsonMatch) {
        cleanJson = jsonMatch[0];
      }

      aidesData = JSON.parse(cleanJson);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      console.error('Response text:', responseText.substring(0, 500));
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
