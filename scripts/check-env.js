// scripts/check-env.js
require('dotenv').config();

console.log('🔍 Vérification de la configuration...\n');

const requiredVars = [
  'GEMINI_API_KEY',
  'CIRCLE_API_KEY',
  'CIRCLE_APP_ID',
  'ARC_RPC_URL'
];

let allGood = true;

requiredVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    console.log(`✅ ${varName}: Présent (${value.substring(0, 10)}...)`);
  } else {
    console.log(`❌ ${varName}: MANQUANT`);
    allGood = false;
  }
});

console.log('\n' + (allGood ? '🎉 Toutes les variables sont configurées !' : '⚠️ Certaines variables manquent.'));
console.log('\nPour tester :');
console.log('1. Lancez: npm run dev');
console.log('2. Visitez: http://localhost:3000');