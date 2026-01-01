require('dotenv').config({ path: '.env.local' });

console.log('🔍 Vérification de la configuration Hackathon...\n');
console.log('===============================================');

// Variables critiques pour le hackathon
const hackathonVars = [
  { 
    name: 'GEMINI_API_KEY', 
    required: true,
    check: (val) => val && val.length > 30 && val.startsWith('AIza'),
    description: 'Clé API Gemini AI (Google AI Studio)',
    help: 'https://aistudio.google.com/app/apikey'
  },
  { 
    name: 'CIRCLE_API_KEY', 
    required: true,
    check: (val) => val && val.length > 10,
    description: 'Clé API Circle Sandbox',
    help: 'https://console.circle.com/wallets'
  },
  { 
    name: 'CIRCLE_APP_ID', 
    required: true,
    check: (val) => val && val.length > 10,
    description: 'App ID Circle',
    help: 'https://console.circle.com/wallets'
  },
  { 
    name: 'NEXT_PUBLIC_HACKATHON_NAME', 
    required: true,
    check: (val) => val && val.includes('Agentic Commerce'),
    description: 'Nom du hackathon',
    help: 'Agentic Commerce on Arc'
  }
];

// Variables optionnelles
const optionalVars = [
  { 
    name: 'CIRCLE_ENTITY_SECRET', 
    required: false,
    description: 'Secret Circle (optionnel)' 
  },
  { 
    name: 'ARC_RPC_URL', 
    required: false,
    description: 'URL RPC Arc (optionnel, testnet par défaut)' 
  }
];

console.log('🎯 Variables requises pour le hackathon :');
console.log('----------------------------------------');

let allRequiredGood = true;
let totalConfigured = 0;

hackathonVars.forEach(varInfo => {
  const value = process.env[varInfo.name];
  const isSet = value && value.trim().length > 0;
  const isValid = varInfo.check ? varInfo.check(value) : isSet;
  
  if (isSet && isValid) {
    const preview = varInfo.name.includes('KEY') || varInfo.name.includes('SECRET') 
      ? `${value.substring(0, 15)}...${value.substring(value.length - 4)}`
      : value;
    
    console.log(`✅ ${varInfo.name}:`);
    console.log(`   ${varInfo.description}`);
    console.log(`   Valeur: ${preview}`);
    totalConfigured++;
  } else if (isSet && !isValid) {
    console.log(`⚠️  ${varInfo.name}: PRÉSENTE MAIS INVALIDE`);
    console.log(`   ${varInfo.description}`);
    console.log(`   Problème: Format incorrect`);
    allRequiredGood = false;
  } else {
    console.log(`❌ ${varInfo.name}: MANQUANTE`);
    console.log(`   ${varInfo.description}`);
    console.log(`   Aide: ${varInfo.help}`);
    allRequiredGood = false;
  }
  console.log('');
});

console.log('🎯 Variables optionnelles :');
console.log('----------------------------');

optionalVars.forEach(varInfo => {
  const value = process.env[varInfo.name];
  if (value && value.trim().length > 0) {
    console.log(`✅ ${varInfo.name}: Configurée`);
    totalConfigured++;
  } else {
    console.log(`⚪ ${varInfo.name}: Non configurée (optionnel)`);
  }
});

console.log('\n📊 Résumé de configuration :');
console.log('============================');
console.log(`Variables configurées: ${totalConfigured}/${hackathonVars.length + optionalVars.length}`);

if (allRequiredGood) {
  console.log('\n🎉 PARFAIT POUR LE HACKATHON !');
  console.log('✅ Toutes les variables requises sont correctement configurées.');
  console.log('✅ Mode réel activé avec Gemini AI et Circle.');
  console.log('✅ Prêt pour la démonstration et la présentation.');
} else {
  console.log('\n⚠️  CONFIGURATION INCOMPLÈTE');
  console.log('❌ Certaines variables requises manquent ou sont invalides.');
  console.log('❌ L\'application fonctionnera en mode démo limité.');
}

console.log('\n🚀 Instructions de test :');
console.log('========================');
console.log('1. Démarrer l\'application : npm run dev');
console.log('2. Tester Gemini AI :');
console.log('   curl -X POST http://localhost:3000/api/generate \\');
console.log('     -H "Content-Type: application/json" \\');
console.log('     -d \'{"prompt":"synthwave for coding"}\'');
console.log('3. Tester les paiements :');
console.log('   curl -X POST http://localhost:3000/api/paiement \\');
console.log('     -H "Content-Type: application/json" \\');
console.log('     -d \'{"songTitle":"Test","artist":"AI","amount":"0.001"}\'');
console.log('4. Vérifier la config : http://localhost:3000/api/config');

console.log('\n🏆 Pour le hackathon :');
console.log('=====================');
console.log('✅ Présentation : Démontrer la génération AI et les paiements USDC');
console.log('✅ Technologies : Gemini AI + Circle + Arc Blockchain');
console.log('✅ Tracks éligibles :');
console.log('   - Best Autonomous Commerce Application');
console.log('   - Best Trustless AI Agent');
console.log('   - Best Gateway-Based Micropayments Integration');
console.log('   - Best Product Design');

if (!allRequiredGood) {
  console.log('\n🔧 Correction nécessaire :');
  console.log('=========================');
  console.log('1. Récupérer GEMINI_API_KEY sur https://aistudio.google.com/app/apikey');
  console.log('2. Créer un compte Circle Sandbox sur https://console.circle.com');
  console.log('3. Ajouter les clés au fichier .env.local :');
  console.log('   GEMINI_API_KEY=AIzaSyD...');
  console.log('   CIRCLE_API_KEY=SANDBOX_...');
  console.log('   CIRCLE_APP_ID=APP_...');
  console.log('4. Redémarrer l\'application');
}

console.log('\n🌐 Déploiement Vercel :');
console.log('======================');
console.log('1. Pousser le code sur GitHub');
console.log('2. Vérifier les variables dans Vercel Dashboard → Settings → Environment Variables');
console.log('3. Déployer : vercel --prod');
console.log('4. Tester : https://ai-jukebox-hackathon.vercel.app');