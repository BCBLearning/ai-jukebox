import { NextResponse } from 'next/server';

export async function GET() {
  const apiKey = process.env.GEMINI_API_KEY;
  const isValidApiKey = apiKey && apiKey.length > 20 && apiKey.startsWith('AIza');
  
  const config = {
    // Mode hackathon - toujours en démo pour la présentation
    hackathon: {
      mode: 'demo_presentation',
      allowRealApi: false,
      showInstructions: true,
    },
    
    gemini: {
      configured: !!isValidApiKey,
      keyLength: apiKey?.length || 0,
      model: 'gemini-1.5-flash (free)',
      status: isValidApiKey ? 'active_free_tier' : 'demo_mode',
      freeModelsAvailable: ['gemini-1.5-flash', 'gemini-1.5-pro'],
      quotas: {
        'gemini-1.5-flash': '1 RPM, 15 QPM - Free',
        'gemini-1.5-pro': '2 RPM, 60 QPM - Free',
      },
    },
    
    circle: {
      configured: !!(process.env.CIRCLE_API_KEY && process.env.CIRCLE_APP_ID),
      apiKeyPresent: !!process.env.CIRCLE_API_KEY,
      appIdPresent: !!process.env.CIRCLE_APP_ID,
      entitySecretPresent: !!process.env.CIRCLE_ENTITY_SECRET,
      status: process.env.CIRCLE_API_KEY ? 'active' : 'demo_mode',
    },
    
    arc: {
      network: 'Testnet',
      usdc: 'Native gas token',
      finality: 'Sub-second deterministic',
      evmCompatible: true,
      documentation: 'https://docs.arc.net',
      hackathonReady: true,
    },
    
    hackathonInfo: {
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
    },
    
    application: {
      name: 'AI Jukebox',
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      deployed: !!process.env.VERCEL_URL,
      url: process.env.VERCEL_URL || 'http://localhost:3000',
      features: ['AI Song Generation', 'USDC Payments', 'Arc Settlement', 'Demo Mode'],
    },
    
    instructions: {
      gemini: isValidApiKey 
        ? '✅ Gemini is configured with free models'
        : '🎵 Demo Mode Active - Songs are pre-generated\nTo enable AI: Get free API key from Google AI Studio',
      circle: process.env.CIRCLE_API_KEY
        ? '✅ Circle is configured'
        : '💰 Demo Payments - Configure Circle for real USDC transactions',
      arc: '⚡ Arc Testnet ready - USDC as native gas token',
    },
    
    demoMode: {
      enabled: true,
      highQualitySongs: 5,
      audioPreviews: true,
      simulatedPayments: true,
      hackathonReady: true,
    },
  };
  
  return NextResponse.json(config);
}