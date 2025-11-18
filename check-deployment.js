#!/usr/bin/env node

/**
 * Script de vérification avant déploiement Vercel
 * Vérifie que toutes les variables d'environnement nécessaires sont présentes
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Vérification de la configuration de déploiement...\n');

// Charger .env.local
const envPath = path.join(__dirname, '.env.local');
if (!fs.existsSync(envPath)) {
  console.error('❌ Fichier .env.local introuvable!');
  process.exit(1);
}

const envContent = fs.readFileSync(envPath, 'utf-8');
const envVars = {};

envContent.split('\n').forEach(line => {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith('#')) {
    const [key, ...valueParts] = trimmed.split('=');
    if (key && valueParts.length > 0) {
      envVars[key.trim()] = valueParts.join('=').trim();
    }
  }
});

// Variables requises
const requiredVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'ANTHROPIC_API_KEY',
  'INSEE_API_KEY',
  'INSEE_API_SECRET',
  'NEXT_PUBLIC_APP_URL'
];

let allGood = true;
let warnings = [];

console.log('📋 Variables d\'environnement:');
console.log('─'.repeat(60));

requiredVars.forEach(varName => {
  const value = envVars[varName];
  const status = value ? '✅' : '❌';

  if (!value) {
    allGood = false;
    console.log(`${status} ${varName}: MANQUANT`);
  } else {
    // Masquer les valeurs sensibles
    const displayValue = value.substring(0, 20) + '...';
    console.log(`${status} ${varName}: ${displayValue}`);

    // Vérifications spécifiques
    if (varName === 'NEXT_PUBLIC_APP_URL') {
      if (value.includes('localhost')) {
        warnings.push('⚠️  NEXT_PUBLIC_APP_URL pointe vers localhost - Changez-le pour votre URL Vercel!');
      }
    }

    if (varName === 'NEXT_PUBLIC_SUPABASE_URL' && !value.includes('supabase.co')) {
      warnings.push('⚠️  NEXT_PUBLIC_SUPABASE_URL ne semble pas être une URL Supabase valide');
    }
  }
});

console.log('─'.repeat(60));
console.log('');

// Vérifier les fichiers importants
console.log('📁 Fichiers du projet:');
console.log('─'.repeat(60));

const importantFiles = [
  'package.json',
  'next.config.mjs',
  'tsconfig.json',
  'tailwind.config.ts',
  'middleware.ts',
  'app/layout.tsx',
  'app/page.tsx',
  'app/dashboard/page.tsx',
  'app/api/insee-data/route.ts',
  'app/api/analyze-company/route.ts',
  'components/dashboard/AidesCarousel.tsx',
];

importantFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  const exists = fs.existsSync(filePath);
  const status = exists ? '✅' : '❌';
  console.log(`${status} ${file}`);
  if (!exists) {
    allGood = false;
  }
});

console.log('─'.repeat(60));
console.log('');

// Afficher les warnings
if (warnings.length > 0) {
  console.log('⚠️  Avertissements:');
  console.log('─'.repeat(60));
  warnings.forEach(warning => console.log(warning));
  console.log('─'.repeat(60));
  console.log('');
}

// Vérifier le .gitignore
const gitignorePath = path.join(__dirname, '.gitignore');
if (fs.existsSync(gitignorePath)) {
  const gitignoreContent = fs.readFileSync(gitignorePath, 'utf-8');
  if (!gitignoreContent.includes('.env.local')) {
    console.log('⚠️  ATTENTION: .env.local n\'est pas dans .gitignore!');
    console.log('   Ajoutez-le pour éviter de committer vos secrets!\n');
  }
}

// Résumé
console.log('📊 Résumé:');
console.log('─'.repeat(60));

if (allGood && warnings.length === 0) {
  console.log('✅ Tout est prêt pour le déploiement sur Vercel!');
  console.log('');
  console.log('Prochaines étapes:');
  console.log('1. Committez votre code: git add . && git commit -m "Ready for deployment"');
  console.log('2. Poussez sur GitHub: git push origin main');
  console.log('3. Importez sur Vercel et ajoutez les variables d\'environnement');
  console.log('4. Après le déploiement, changez NEXT_PUBLIC_APP_URL pour votre URL Vercel');
  console.log('5. Configurez les Redirect URLs dans Supabase');
  console.log('');
  console.log('📚 Guide complet: voir VERCEL_DEPLOYMENT.md');
} else {
  console.log('❌ Des problèmes ont été détectés. Corrigez-les avant de déployer.');
}

console.log('─'.repeat(60));

process.exit(allGood ? 0 : 1);
