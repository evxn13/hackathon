/**
 * Script de test pour l'API INSEE Sirene V3.11
 * Usage: node test-insee.js
 */

// Utiliser la variable d'environnement ou demander à l'utilisateur
const API_KEY = process.env.INSEE_API_KEY || 'VOTRE_CLE_API_INSEE';
const BASE_URL = 'https://api.insee.fr/api-sirene/3.11';

// SIRETs de test (validés avec l'API réelle)
const TEST_SIRETS = [
  { siret: '31256315800012', name: 'KALLISTE' },
  { siret: '49778445400041', name: 'Microsoft France (si accessible)' },
  { siret: '73282932000074', name: 'Apple France (si accessible)' },
];

async function testInseeAPI(siret) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`Testing SIRET: ${siret}`);
  console.log('='.repeat(60));

  try {
    const response = await fetch(`${BASE_URL}/siret/${siret}`, {
      headers: {
        'X-INSEE-Api-Key-Integration': API_KEY,
        'Accept': 'application/json',
      },
    });

    console.log(`Status: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      return null;
    }

    const data = await response.json();

    // Parse les données importantes
    const etablissement = data.etablissement;
    const uniteLegale = etablissement.uniteLegale;
    const adresse = etablissement.adresseEtablissement;
    const periode = etablissement.periodesEtablissement[0];

    // Fonction pour convertir tranche effectif
    const getEffectifLabel = (code) => {
      const tranches = {
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
        'NN': 'Non renseigné',
      };
      return tranches[code] || code || 'Non renseigné';
    };

    const trancheEffectif = etablissement.trancheEffectifsEtablissement ||
                           uniteLegale.trancheEffectifsUniteLegale;

    console.log('\n✓ Données récupérées avec succès:');
    console.log('  - Dénomination:', uniteLegale.denominationUniteLegale || uniteLegale.nomUniteLegale || 'N/A');
    console.log('  - Code APE:', periode.activitePrincipaleEtablissement || 'N/A');
    console.log('  - Tranche effectif:', `${trancheEffectif} = ${getEffectifLabel(trancheEffectif)}`);
    console.log('  - Ville:', adresse.libelleCommuneEtablissement || 'N/A');
    console.log('  - Code Postal:', adresse.codePostalEtablissement || 'N/A');
    console.log('  - Forme juridique:', uniteLegale.categorieJuridiqueUniteLegale || 'N/A');
    console.log('  - Date création:', uniteLegale.dateCreationUniteLegale || 'N/A');
    console.log('  - Catégorie entreprise:', uniteLegale.categorieEntreprise || 'N/A');

    return data;
  } catch (error) {
    console.error('✗ Erreur:', error.message);
    return null;
  }
}

async function main() {
  console.log('═'.repeat(60));
  console.log('TEST API INSEE SIRENE V3.11');
  console.log('═'.repeat(60));
  console.log(`API Key: ${API_KEY.substring(0, 12)}...`);
  console.log(`Endpoint: ${BASE_URL}/siret/{SIRET}`);

  let successCount = 0;
  let failCount = 0;

  for (const test of TEST_SIRETS) {
    const result = await testInseeAPI(test.siret);
    if (result) {
      successCount++;
    } else {
      failCount++;
    }
  }

  console.log('\n' + '═'.repeat(60));
  console.log('RÉSULTATS:');
  console.log('═'.repeat(60));
  console.log(`✓ Succès: ${successCount}/${TEST_SIRETS.length}`);
  console.log(`✗ Échecs: ${failCount}/${TEST_SIRETS.length}`);

  if (successCount === TEST_SIRETS.length) {
    console.log('\n🎉 Tous les tests ont réussi!');
    console.log('✓ L\'API INSEE est fonctionnelle');
    console.log('✓ La clé API est valide');
    console.log('✓ L\'application peut récupérer les données SIRET');
  } else {
    console.log('\n⚠️  Certains tests ont échoué');
    console.log('→ Vérifiez votre clé API sur https://portail-api.insee.fr/');
    console.log('→ Vérifiez votre abonnement à l\'API Sirene');
  }
}

main().catch(console.error);
