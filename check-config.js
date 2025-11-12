#!/usr/bin/env node

/**
 * Script de vérification de configuration
 * Vérifie que toutes les variables d'environnement sont configurées
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Vérification de la configuration...\n');

// Vérifier si .env.local existe
const envPath = path.join(__dirname, '.env.local');
if (!fs.existsSync(envPath)) {
  console.log('❌ Fichier .env.local introuvable');
  console.log('📝 Créez le fichier .env.local à partir de .env.local.example');
  console.log('   cp .env.local.example .env.local');
  process.exit(1);
}

// Lire le fichier .env.local
const envContent = fs.readFileSync(envPath, 'utf-8');

// Variables requises
const requiredVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'ANTHROPIC_API_KEY',
  'INSEE_API_KEY',
  'INSEE_API_SECRET',
  'NEXT_PUBLIC_APP_URL',
];

let allConfigured = true;
const missing = [];
const configured = [];

// Vérifier chaque variable
requiredVars.forEach((varName) => {
  const regex = new RegExp(`^${varName}=(.+)$`, 'm');
  const match = envContent.match(regex);

  if (!match || match[1].includes('your_') || match[1].includes('xxxxx')) {
    missing.push(varName);
    allConfigured = false;
  } else {
    configured.push(varName);
  }
});

// Afficher les résultats
console.log('✅ Variables configurées:');
configured.forEach((varName) => {
  console.log(`   ✓ ${varName}`);
});

if (missing.length > 0) {
  console.log('\n❌ Variables manquantes ou non configurées:');
  missing.forEach((varName) => {
    console.log(`   ✗ ${varName}`);
  });
  console.log('\n📖 Consultez QUICK_START.md pour obtenir ces clés API');
}

console.log('\n' + '='.repeat(50));

if (allConfigured) {
  console.log('✅ Configuration complète ! Vous pouvez lancer l\'application');
  console.log('🚀 Exécutez: npm run dev');
  process.exit(0);
} else {
  console.log('⚠️  Configuration incomplète');
  console.log('📝 Complétez les variables manquantes dans .env.local');
  process.exit(1);
}
