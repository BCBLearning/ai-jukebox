import { NextResponse } from 'next/server';

// Chansons de fallback uniquement en cas d'erreur
function getFallbackSong(prompt: string, error: string = '') {
  const songs = [
    {
      title: 'Quantum Sync',
      artist: 'AI Symphony',
      genre: 'Future Bass',
      bpm: 140,
      mood: 'euphoric futuristic',
      coverDescription: 'Quantum particles dancing in cyberspace',
      colorScheme: 'blue-cyan',
      isReal: false,
    },
    {
      title: 'Neon Dreams',
      artist: 'Circuit Mind',
      genre: 'Synthwave',
      bpm: 128,
      mood: 'nostalgic energetic',
      coverDescription: 'Retro-futuristic cityscape with neon lights',
      colorScheme: 'pink-cyan',
      isReal: false,
    },
  ];
  
  const song = songs[Math.floor(Math.random() * songs.length)];
  return {
    ...song,
    promptUsed: prompt,
    error: error,
    debug: 'Fallback mode - Gemini API error',
    isReal: false,
  };
}

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();
    const apiKey = process.env.GEMINI_API_KEY;

    // VÉRIFICATION POUR LE HACKATHON - MODE RÉEL
    console.log('🎵 Generating song with REAL Gemini API');
    console.log('- Prompt:', prompt);
    console.log('- API Key exists:', !!apiKey);
    
    // Vérification stricte de la clé
    const isGeminiConfigured = apiKey && apiKey.length > 30;
    
    if (!isGeminiConfigured) {
      console.error('❌ Gemini API key invalid or missing');
      return NextResponse.json(
        getFallbackSong(prompt, 'GEMINI_API_KEY not properly configured in Vercel'),
        { status: 500 }
      );
    }

    // MODÈLES DISPONIBLES - basés sur votre liste
    const models = [
      'gemini-2.5-flash',          // Meilleur choix : stable et rapide
      'gemini-2.0-flash-001',      // Alternative stable
      'gemini-2.0-flash',          // Version standard
      'gemini-3-flash-preview',    // Dernière génération (preview)
      'gemini-2.5-flash-lite',     // Version légère
    ];
    
    let lastError = '';
    
    for (const model of models) {
      try {
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        
        console.log(`🔄 Tentative avec le modèle: ${model}`);
        console.log(`📡 URL: ${apiUrl.replace(apiKey, '[API_KEY]')}`);
        
        const geminiPrompt = `You are an expert electronic music DJ and producer.
Generate a song JSON with these exact fields:
- title: string (creative electronic song title)
- artist: string (AI artist name)
- genre: string (electronic music genre: Chillwave, Synthwave, Future Bass, Techno, House, Ambient, Glitch Hop, Lo-fi)
- bpm: number (60-180)
- mood: string (2-3 descriptive words like "nostalgic energetic" or "calm digital")
- coverDescription: string (vivid album cover description)
- colorScheme: string ('purple-blue', 'pink-cyan', 'green-black', 'blue-cyan', 'neon-green', 'orange-purple')

For: "${prompt || 'electronic music for coding'}"

Respond ONLY with valid JSON, no other text.`;

        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: geminiPrompt }] }],
            generationConfig: { 
              temperature: 0.9, 
              maxOutputTokens: 300,
            },
            safetySettings: [
              { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
              { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
              { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
              { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
            ],
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          lastError = `Model ${model} error (${response.status}): ${errorText.substring(0, 100)}`;
          console.warn(`❌ ${lastError}`);
          continue; // Try next model
        }

        const data = await response.json();
        const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        
        console.log(`✅ Model ${model} works!`);
        console.log(`📄 Response: ${textResponse.substring(0, 100)}...`);
        
        // Extract JSON from response
        const jsonMatch = textResponse.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
          throw new Error('No JSON found in response');
        }
        
        const songData = JSON.parse(jsonMatch[0]);
        
        // Validation and cleaning
        const validatedSong = {
          title: songData.title?.trim() || 'AI Generated Track',
          artist: songData.artist?.trim() || 'Digital Composer',
          genre: songData.genre?.trim() || 'Electronic',
          bpm: Math.min(180, Math.max(60, Number(songData.bpm) || 120)),
          mood: songData.mood?.trim() || 'electronic',
          coverDescription: songData.coverDescription?.trim() || 'Digital art visualization',
          colorScheme: songData.colorScheme?.trim() || 'purple-blue',
        };
        
        return NextResponse.json({
          ...validatedSong,
          isReal: true,
          model: model,
          promptUsed: prompt,
          geminiSuccess: true,
          hackathon: 'Agentic Commerce on Arc',
          generatedAt: new Date().toISOString(),
          credits: 'Powered by Gemini 2.5 Flash AI',
        });
        
      } catch (modelError: any) {
        console.warn(`❌ Error with model ${model}:`, modelError.message);
        lastError = modelError.message;
        continue;
      }
    }
    
    // All models failed
    console.error('❌ All Gemini models failed');
    return NextResponse.json(
      getFallbackSong(prompt, `All models failed: ${lastError}`),
      { status: 500 }
    );

  } catch (error: any) {
    console.error('❌ General error:', error);
    return NextResponse.json(
      getFallbackSong('', `Server error: ${error.message}`),
      { status: 500 }
    );
  }
}

export async function GET() {
  const apiKey = process.env.GEMINI_API_KEY;
  const isConfigured = apiKey && apiKey.length > 30;
  
  return NextResponse.json({
    endpoint: 'generate',
    geminiConfigured: isConfigured,
    status: isConfigured ? '✅ ACTIVE' : '❌ INACTIVE',
    availableModels: [
      'gemini-2.5-flash',
      'gemini-2.0-flash-001',
      'gemini-3-flash-preview'
    ],
    model: 'gemini-2.5-flash (recommended)',
    freeTier: true,
    hackathon: 'Agentic Commerce on Arc',
    environment: process.env.NODE_ENV || 'production',
  });
}