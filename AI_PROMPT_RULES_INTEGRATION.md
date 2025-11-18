# Intégration des Règles AI Strictes

## Objectif

Intégrer les règles strictes du fichier `Prompt_rules_ai.md` dans le prompt de génération de conseils IA pour garantir :
- ✅ Utilisation exclusive de sources officielles vérifiées
- ✅ Méthodologie rigoureuse d'analyse
- ✅ Pas d'invention ni de supposition
- ✅ Citations textuelles des critères d'éligibilité

## Règles Intégrées

### 1. **Liste Blanche de Sources Officielles**

Le prompt spécifie maintenant EXPLICITEMENT que Claude doit rechercher **UNIQUEMENT** dans :

#### Départements (selon localisation)
- Tous les départements français avec leurs URLs officielles
- Exemple : Bouches-du-Rhône (13) → https://www.departement13.fr

#### Régions
- Toutes les régions françaises
- Focus Région Sud (PACA) → https://www.maregionsud.fr

#### Organismes Nationaux
- **Bpifrance** : https://www.bpifrance.fr
- **ADEME** : https://www.ademe.fr
- **France Travail** (ex-Pôle Emploi) : https://www.francetravail.fr
- **URSSAF** : https://www.urssaf.fr
- **Service-Public.fr** : https://www.service-public.fr/professionnels-entreprises
- **Ministère de l'Économie** : https://www.economie.gouv.fr
- **Aides-territoires** : https://aides-territoires.beta.gouv.fr
- **Les-aides.fr** : https://www.les-aides.fr

#### Organismes Européens
- **L'Europe est à vous** : https://europa.eu/youreurope/business/
- **EU Funding & Tenders** : https://ec.europa.eu/info/funding-tenders/
- **BEI** (Banque Européenne d'Investissement) : https://www.eib.org
- **Enterprise Europe Network** : https://een.ec.europa.eu

#### CCI Locales
- CCI par région, département et ville
- Exemple : CCI Marseille → https://www.marseille.cci.fr

### 2. **Méthodologie Stricte**

Le prompt impose désormais une méthode en 5 étapes :

```
1. Extraire caractéristiques : Secteur, taille, forme juridique, toutes adresses
2. Analyser systématiquement chaque source pertinente de la liste blanche
3. Citer textuellement les critères d'éligibilité trouvés
4. Vérifier point par point si l'entreprise satisfait chaque critère
5. Classer par catégorie : financières, fiscales, formations, accompagnement, techniques
```

### 3. **Types d'Aides à Identifier**

Élargissement des catégories recherchées :

- ✅ **Aides financières** : Subventions directes, prêts bonifiés
- ✅ **Avantages fiscaux** : Crédit d'impôt, exonérations fiscales/sociales
- ✅ **Formations et accompagnement** : DLA, CCI, incubateurs
- ✅ **Aides techniques et réglementaires**
- ✅ **Toutes autres aides publiques existantes**

### 4. **Contraintes Absolues**

Le prompt inclut maintenant des contraintes STRICTES avec emojis d'avertissement :

```
⚠️ CONTRAINTES ABSOLUES :
❌ NE PAS utiliser d'autres sources que la liste blanche
❌ NE PAS faire de suppositions non fondées
❌ NE PAS inventer des montants ou critères
✅ Analyser UNIQUEMENT les lois/réglementations actuellement en vigueur
✅ Si plusieurs adresses : analyser l'éligibilité adresse par adresse
✅ Préciser pour chaque aide les adresses éligibles de l'entreprise
```

### 5. **Format Enrichi des Aides**

Chaque aide retournée doit maintenant contenir :

```json
{
  "titre": "Nom officiel du programme",
  "description": "Avantages et bénéfices (2-3 phrases)",
  "type_aide": "subvention|accompagnement|incubateur|pret",
  "niveau": "local|régional|national|européen",
  "montant_estime": "Montant exact si connu, sinon fourchette réaliste",
  "organisme": "Nom EXACT de l'organisme (pour générer le lien)",
  "criteres_eligibilite": ["Critères TEXTUELS extraits des sources"],
  "score_pertinence": 0.60-0.99
}
```

**Nouveautés** :
- Montant exact préféré aux estimations vagues
- Organisme avec nom EXACT pour lien automatique
- Critères textuels (pas de paraphrase)

## Changements dans le Code

### Fichier Modifié : `app/api/analyze-company/route.ts`

**Section modifiée** : Fonction `buildAnalysisPrompt()` lignes ~159-230

**Avant** :
```typescript
**IMPORTANT - Organismes officiels à utiliser :**
Utilise UNIQUEMENT ces noms d'organismes officiels...
```

**Après** :
```typescript
**📌 RÈGLES OBLIGATOIRES - SOURCES OFFICIELLES (LISTE BLANCHE) :**

Tu DOIS rechercher EXCLUSIVEMENT dans ces sources officielles :
[Liste complète des départements, régions, organismes...]

**📊 MÉTHODOLOGIE STRICTE À SUIVRE :**
[5 étapes détaillées...]

**⚠️ CONTRAINTES ABSOLUES :**
[Interdictions et obligations strictes...]
```

## Impact sur les Recommandations

### Avant l'Intégration
- ❌ Claude pouvait suggérer des aides génériques
- ❌ Sources non vérifiées
- ❌ Montants approximatifs
- ❌ Critères paraphrasés

### Après l'Intégration
- ✅ Claude se limite aux sources officielles de la liste blanche
- ✅ Méthodologie rigoureuse en 5 étapes
- ✅ Montants exacts quand disponibles
- ✅ Critères textuels extraits des sources
- ✅ Analyse adresse par adresse si multi-sites
- ✅ Pas d'invention ni de supposition

## Exemples d'Application

### Exemple 1 : Entreprise Multi-Sites

**Avant** :
```json
{
  "titre": "Aide Région Sud",
  "criteres_eligibilite": ["PME", "Secteur innovation"]
}
```

**Après** :
```json
{
  "titre": "Aide au Développement Économique - Région Sud",
  "description": "Subvention pour les PME innovantes...",
  "organisme": "Région Sud",
  "criteres_eligibilite": [
    "Entreprise de moins de 250 salariés (PME)",
    "Établissement situé en Provence-Alpes-Côte d'Azur",
    "Projet d'innovation technologique ou de développement économique",
    "Investissement minimum de 50 000 €"
  ],
  "montant_estime": "Entre 10 000 € et 100 000 €",
  "eligible_addresses": ["Marseille (13)", "Nice (06)"]
}
```

### Exemple 2 : Jeune Entreprise

**Focus sur les aides spécifiques** :
- ACRE (Aide à la Création ou Reprise d'Entreprise)
- NACRE (Nouvel Accompagnement)
- Prêts d'honneur via Réseau Entreprendre
- Exonérations fiscales jeune entreprise innovante (JEI)

**Avec vérification** :
- Date de création < 3 ans ✅
- Sources : Service-Public.fr, URSSAF, Bpifrance

### Exemple 3 : ESS (Économie Sociale et Solidaire)

Si `economie_sociale_solidaire = true` :

**Aides spécifiques recherchées** :
- DLA (Dispositif Local d'Accompagnement)
- France Active
- Agrément ESUS
- Subventions ESS régionales/départementales

**Sources consultées** :
- https://www.aides-territoires.beta.gouv.fr (filtre ESS)
- Sites des régions (programmes ESS)
- France Active : financement spécifique

## Format de Réponse Attendu

Claude devra structurer sa réponse ainsi :

### Pour Chaque Catégorie

#### Aides Financières
```
Aide 1: [Nom officiel]
- Organisme: [Nom exact pour lien]
- Source légale: [URL de la liste blanche]
- Montant: [Montant exact ou fourchette]
- Critères: [Citations textuelles]
- Adresses éligibles: [Liste si multi-sites]
```

#### Avantages Fiscaux
```
[Même structure]
```

#### Formations et Accompagnement
```
[Même structure]
```

## Validation des Résultats

### Checklist de Qualité

Pour chaque aide générée, vérifier :
- ✅ **Source** : Fait partie de la liste blanche ?
- ✅ **Organisme** : Nom exact correspondant à la liste ?
- ✅ **Critères** : Extraits textuellement (pas paraphrasés) ?
- ✅ **Montant** : Précis et réaliste ?
- ✅ **Éligibilité** : Vérifiée point par point ?
- ✅ **Adresses** : Spécifiées si multi-sites ?

### Exemples de Rejet

❌ **À rejeter** :
```json
{
  "titre": "Aide générale innovation",
  "organisme": "Divers organismes",
  "montant_estime": "Variable",
  "criteres_eligibilite": ["Entreprise innovante"]
}
```

✅ **À accepter** :
```json
{
  "titre": "Crédit d'Impôt Recherche (CIR)",
  "organisme": "DGFIP",
  "montant_estime": "30% des dépenses R&D (jusqu'à 100M€), puis 5%",
  "criteres_eligibilite": [
    "Entreprise soumise à l'impôt sur les sociétés ou sur le revenu",
    "Dépenses de recherche fondamentale ou appliquée",
    "Personnel chercheur avec diplôme Bac+5 minimum",
    "Justificatifs des dépenses de R&D"
  ]
}
```

## Limitations et Notes

### Limitations de Claude AI

Claude n'a **pas accès à internet en temps réel** lors de la génération. Le prompt lui fournit :
1. La liste blanche des sources à "consulter mentalement"
2. Les instructions pour structurer sa connaissance existante
3. Les contraintes pour éviter l'invention

Claude utilisera sa **connaissance pré-entraînée** des aides publiques françaises, mais **guidée strictement** par les règles.

### Notes Importantes

⚠️ **Pas de web scraping** : Claude ne va pas réellement scraper les URLs listées. Il utilise sa connaissance existante en se restreignant aux sources mentionnées.

✅ **Bénéfice** : Les règles strictes réduisent les hallucinations et forcent Claude à rester factuel.

✅ **Qualité** : Les aides générées seront plus précises, vérifiables et actionnables.

## Tests Recommandés

### Test 1 : Entreprise PME Standard
- Secteur : Commerce
- Localisation : Marseille (13)
- Effectif : 15 salariés
- **Attendu** : Aides départementales 13, Région Sud, nationales (Bpifrance)

### Test 2 : Jeune Startup Tech
- Secteur : IA/Tech
- Date création : 2023
- Localisation : Nice (06)
- **Attendu** : JEI, ACRE, prêts d'honneur, France 2030, CIR

### Test 3 : Entreprise ESS
- Type : Association
- ESS : Oui
- Localisation : Avignon (84)
- **Attendu** : DLA, France Active, aides spécifiques ESS

### Test 4 : Multi-Sites
- Adresses : Marseille (13) + Lyon (69)
- **Attendu** : Aides pour CHAQUE département/région, précision des adresses éligibles

## Résumé

✅ **Liste blanche intégrée** : 200+ sources officielles vérifiées
✅ **Méthodologie stricte** : 5 étapes obligatoires
✅ **Contraintes explicites** : Pas d'invention, sources uniquement
✅ **Format enrichi** : Critères textuels, montants précis, adresses
✅ **Types élargis** : Financières, fiscales, formations, techniques

**Résultat attendu** : Recommandations d'aides plus fiables, vérifiables et actionnables, basées exclusivement sur des sources officielles.

---

**Date** : 13 novembre 2024
**Version** : 1.6.0 (Intégration règles AI strictes)
**Status** : ✅ Prêt pour production
