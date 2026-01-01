const https = require('https');

const VERCEL_URL = 'https://ai-jukebox-hackathon.vercel.app';

console.log('🔍 Vérification du déploiement Vercel...');
console.log('=======================================\n');

const endpoints = [
  { path: '/api/config', name: 'Configuration' },
  { path: '/api/generate', name: 'Gemini API' },
  { path: '/api/paiement', name: 'Circle API' },
];

let testsPassed = 0;
let testsFailed = 0;

function testEndpoint(url, name) {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    
    https.get(url, { timeout: 10000 }, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        const responseTime = Date.now() - startTime;
        
        try {
          const jsonData = JSON.parse(data);
          
          console.log(`✅ ${name}:`);
          console.log(`   URL: ${url}`);
          console.log(`   Temps: ${responseTime}ms`);
          console.log(`   Statut: ${res.statusCode}`);
          
          // Analyse spécifique selon l'endpoint
          if (url.includes('/api/config')) {
            const geminiStatus = jsonData.gemini?.configured ? '✅ ACTIF' : '❌ INACTIF';
            const circleStatus = jsonData.circle?.configured ? '✅ ACTIF' : '❌ INACTIF';
            console.log(`   Gemini: ${geminiStatus}`);
            console.log(`   Circle: ${circleStatus}`);
            console.log(`   Mode: ${jsonData.application?.mode || 'inconnu'}`);
          }
          
          if (url.includes('/api/generate')) {
            console.log(`   Gemini: ${jsonData.geminiConfigured ? '✅ CONFIGURÉ' : '❌ NON CONFIGURÉ'}`);
            console.log(`   Modèle: ${jsonData.model || 'inconnu'}`);
          }
          
          if (url.includes('/api/paiement')) {
            console.log(`   Circle: ${jsonData.circleConfigured ? '✅ CONFIGURÉ' : '❌ NON CONFIGURÉ'}`);
            console.log(`   Mode: ${jsonData.mode || 'inconnu'}`);
          }
          
          console.log('');
          testsPassed++;
          resolve();
        } catch (error) {
          console.log(`❌ ${name}: Réponse JSON invalide`);
          console.log(`   Erreur: ${error.message}`);
          console.log('');
          testsFailed++;
          resolve();
        }
      });
    }).on('error', (error) => {
      console.log(`❌ ${name}: Échec de connexion`);
      console.log(`   Erreur: ${error.message}`);
      console.log('');
      testsFailed++;
      resolve();
    }).on('timeout', () => {
      console.log(`❌ ${name}: Timeout (10s)`);
      console.log('');
      testsFailed++;
      resolve();
    });
  });
}

async function runAllTests() {
  console.log(`🌐 URL de base: ${VERCEL_URL}`);
  console.log('');
  
  for (const endpoint of endpoints) {
    await testEndpoint(`${VERCEL_URL}${endpoint.path}`, endpoint.name);
  }
  
  // Test de génération de chanson
  console.log('🧪 Test de génération de chanson...');
  await testSongGeneration();
  
  // Résumé
  console.log('📊 RÉSULTATS DES TESTS :');
  console.log('========================');
  console.log(`✅ Tests réussis: ${testsPassed}`);
  console.log(`❌ Tests échoués: ${testsFailed}`);
  console.log(`📈 Taux de succès: ${Math.round((testsPassed / (testsPassed + testsFailed)) * 100)}%`);
  
  if (testsFailed === 0) {
    console.log('\n🎉 DÉPLOIEMENT VERCEL RÉUSSI !');
    console.log('✅ Application prête pour le hackathon');
    console.log(`🌐 Accès: ${VERCEL_URL}`);
  } else {
    console.log('\n⚠️  PROBLÈMES DÉTECTÉS');
    console.log('❌ Vérifiez les variables d\'environnement sur Vercel');
    console.log('❌ Vérifiez les logs de déploiement');
  }
  
  console.log('\n🏆 Pour le hackathon :');
  console.log('=====================');
  console.log('1. Présenter la génération AI en direct');
  console.log('2. Montrer les transactions USDC simulées');
  console.log('3. Expliquer l\'intégration Arc blockchain');
  console.log('4. Démontrer le mode réel avec APIs actives');
}

async function testSongGeneration() {
  return new Promise((resolve) => {
    const data = JSON.stringify({
      prompt: 'synthwave for hackathon demo'
    });
    
    const options = {
      hostname: 'ai-jukebox-hackathon.vercel.app',
      path: '/api/generate',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
      },
      timeout: 15000
    };
    
    const req = https.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(responseData);
          
          if (jsonData.isReal) {
            console.log('✅ Génération AI réussie !');
            console.log(`   Titre: ${jsonData.title}`);
            console.log(`   Artiste: ${jsonData.artist}`);
            console.log(`   Modèle: ${jsonData.model}`);
            testsPassed++;
          } else {
            console.log('⚠️  Mode démo activé');
            console.log(`   Raison: ${jsonData.error || 'Gemini non configuré'}`);
            console.log(`   Titre: ${jsonData.title}`);
            testsFailed++;
          }
        } catch (error) {
          console.log('❌ Erreur d\'analyse de réponse');
          testsFailed++;
        }
        console.log('');
        resolve();
      });
    });
    
    req.on('error', (error) => {
      console.log('❌ Échec de génération:', error.message);
      testsFailed++;
      console.log('');
      resolve();
    });
    
    req.on('timeout', () => {
      console.log('❌ Timeout de génération (15s)');
      testsFailed++;
      console.log('');
      resolve();
    });
    
    req.write(data);
    req.end();
  });
}

runAllTests();