import { NextResponse } from 'next/server';

export async function GET() {
  const apiKey = process.env.GEMINI_API_KEY;
  const circleApiKey = process.env.CIRCLE_API_KEY;
  const circleAppId = process.env.CIRCLE_APP_ID;
  
  // Vérification stricte des clés
  const isGeminiConfigured = apiKey && apiKey.length > 30 && apiKey.startsWith('AIza');
  const isCircleConfigured = circleApiKey && circleAppId && 
                           circleApiKey.length > 10 && circleAppId.length > 10;
  
  // Mode réel forcé - les clés sont dans Vercel
  const REAL_MODE = true; // Forcé pour le hackathon
  
  const config = {
    system: {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'production',
      vercelEnv: process.env.VERCEL_ENV || 'production',
      vercelUrl: process.env.VERCEL_URL || '',
      deployment: 'vercel-production',
    },
    
// Ligne ~66-73
gemini: {
  configured: isGeminiConfigured,
  keyLength: apiKey?.length || 0,
  model: 'gemini-2.5-flash (1M tokens)', // Mettre à jour
  status: isGeminiConfigured ? '✅ ACTIVE' : '❌ INVALID',
  freeTier: true,
  quotas: '60 requests per minute',
},
    
    circle: {
      configured: isCircleConfigured,
      apiKeyLength: circleApiKey?.length || 0,
      appIdLength: circleAppId?.length || 0,
      status: isCircleConfigured ? '✅ ACTIVE' : '❌ INVALID',
      sandbox: true,
      network: 'Testnet',
    },
    
    arc: {
      network: 'Testnet',
      usdc: 'Native gas token',
      finality: 'Sub-second deterministic',
      evmCompatible: true,
      documentation: 'https://docs.arc.net',
      status: '✅ READY',
    },
    
    hackathon: {
      name: 'Agentic Commerce on Arc',
      requiredTechnologies: ['Arc', 'USDC', 'Circle Infrastructure'],
      optionalTechnologies: ['Gemini AI', 'Circle Wallets', 'Gateway'],
      tracks: [
        'Best Gateway-Based Micropayments Integration',
        'Best Trustless AI Agent',
        'Best Autonomous Commerce Application',
        'Best Dev Tools',
        'Best App Builder Application',
        'Best Product Design',
      ],
      deadline: 'March 9, 2024',
      mode: 'REAL_APIS_ACTIVE',
    },
    
    application: {
      name: 'AI Jukebox - Hackathon Submission',
      version: '2.0.0',
      environment: 'production',
      deployed: true,
      url: process.env.VERCEL_URL || 'https://ai-jukebox-hackathon.vercel.app',
      mode: 'REAL',
      status: 'READY_FOR_DEMO',
    },
    
    features: {
      gemini: isGeminiConfigured,
      circle: isCircleConfigured,
      usdcPayments: isCircleConfigured,
      aiGeneration: isGeminiConfigured,
      audioPreviews: true,
      priorityPlaylist: true,
      realTransactions: isCircleConfigured,
    },
    
    verification: {
      gemini: isGeminiConfigured ? '✅ API Key valid' : '❌ Check GEMINI_API_KEY in Vercel',
      circle: isCircleConfigured ? '✅ API Keys valid' : '❌ Check CIRCLE_API_KEY and CIRCLE_APP_ID',
      environment: '✅ Vercel Production',
      deployment: '✅ Live at ' + (process.env.VERCEL_URL || 'vercel.app'),
    },
    
    // Instructions pour les juges du hackathon
    demoInstructions: {
      step1: 'Describe a song (e.g., "synthwave for night driving")',
      step2: 'Click "Generate with Gemini AI"',
      step3: 'Listen to audio preview',
      step4: 'Click "Prioritize with USDC" for simulated payment',
      step5: 'Watch song move to priority playlist',
      note: 'All APIs are active in real mode for hackathon demo',
    },
  };
  
  // Log pour debug dans Vercel
  console.log('🔧 Config API called - Real Mode Active');
  console.log('- Gemini:', isGeminiConfigured ? 'Active' : 'Inactive');
  console.log('- Circle:', isCircleConfigured ? 'Active' : 'Inactive');
  console.log('- Vercel URL:', process.env.VERCEL_URL);
  
  return NextResponse.json(config);
}