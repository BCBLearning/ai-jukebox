import { NextResponse } from 'next/server';

// Liste de chansons de démo de haute qualité
function getFallbackSong(prompt: string, error: string = '') {
  const songs = [
    {
      title: 'Digital Dreams',
      artist: 'Neural Echo',
      genre: 'Chillwave',
      bpm: 110,
      mood: 'calm digital',
      coverDescription: 'A digital brain with colorful sound waves in purple nebula',
      colorScheme: 'purple-blue',
      isReal: false,
    },
    {
      title: 'Neon Sunrise',
      artist: 'Circuit Mind',
      genre: 'Synthwave',
      bpm: 128,
      mood: 'nostalgic energetic',
      coverDescription: 'Retro-futuristic cityscape with neon palm trees under purple sky',
      colorScheme: 'pink-cyan',
      isReal: false,
    },
    {
      title: 'Quantum Beats',
      artist: 'AI Symphony',
      genre: 'Future Bass',
      bpm: 140,
      mood: 'euphoric futuristic',
      coverDescription: 'Quantum particles dancing in a cyberspace matrix',
      colorScheme: 'blue-cyan',
      isReal: false,
    },
    {
      title: 'Arc Transaction',
      artist: 'Blockchain Beats',
      genre: 'Glitch Hop',
      bpm: 95,
      mood: 'futuristic glitch',
      coverDescription: 'Visualization of USDC transaction flow on Arc blockchain',
      colorScheme: 'green-black',
      isReal: false,
    },
    {
      title: 'Hackathon Hustle',
      artist: 'Code Crusaders',
      genre: 'Synthpop',
      bpm: 125,
      mood: 'energetic focused',
      coverDescription: 'Developers coding with neon keyboards in dark room',
      colorScheme: 'neon-green',
      isReal: false,
    },
  ];
  
  // Si un prompt est fourni, choisir une chanson thématique
  let selectedSong;
  const promptLower = prompt.toLowerCase();
  
  if (promptLower.includes('chill') || promptLower.includes('calm')) {
    selectedSong = songs[0];
  } else if (promptLower.includes('retro') || promptLower.includes('80s')) {
    selectedSong = songs[1];
  } else if (promptLower.includes('future') || promptLower.includes('quantum')) {
    selectedSong = songs[2];
  } else if (promptLower.includes('blockchain') || promptLower.includes('crypto')) {
    selectedSong = songs[3];
  } else if (promptLower.includes('hack') || promptLower.includes('code')) {
    selectedSong = songs[4];
  } else {
    selectedSong = songs[Math.floor(Math.random() * songs.length)];
  }
  
  return {
    ...selectedSong,
    promptUsed: prompt || 'Random demo prompt',
    error: error || 'Demo mode - Using fallback song',
    debug: 'Fallback mode active - Configure GEMINI_API_KEY for AI-generated songs',
    demoMode: true,
  };
}

// Modèles Gemini gratuits à essayer dans l'ordre
const FREE_GEMINI_MODELS = [
  'gemini-1.5-flash',      // Gratuit, rapide, 1 RPM, 15 QPM
  'gemini-1.5-pro',        // Gratuit, meilleure qualité, 2 RPM, 60 QPM
  'gemini-1.0-pro',        // Ancien mais stable
  'gemini-pro',            // Version générale
];

// Test simple d'une clé API
function isValidApiKey(apiKey: string | undefined): boolean {
  if (!apiKey) return false;
  if (apiKey.length < 20) return false;
  if (!apiKey.startsWith('AIza')) return false;
  return true;
}

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();
    const apiKey = process.env.GEMINI_API_KEY;
    
    // Mode démo forcé pour le hackathon (commenter cette ligne pour utiliser Gemini)
    const FORCE_DEMO_MODE = true;
    
    if (FORCE_DEMO_MODE || !isValidApiKey(apiKey)) {
      console.log('Using demo mode (no valid Gemini API key)');
      const demoSong = getFallbackSong(prompt, 'Demo mode active for hackathon');
      return NextResponse.json(demoSong);
    }

    // Essayer chaque modèle gratuit jusqu'à ce qu'un fonctionne
    let lastError = '';
    
    for (const model of FREE_GEMINI_MODELS) {
      try {
        console.log(`Trying Gemini model: ${model}`);
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        
        const geminiPrompt = `You are an expert electronic music DJ and producer.
Generate a song JSON with these exact fields:
- title: string (creative electronic song title)
- artist: string (AI artist name)
- genre: string (electronic music genre like Chillwave, Synthwave, Future Bass, Techno, House, Ambient)
- bpm: number (60-180)
- mood: string (2-3 descriptive words)
- coverDescription: string (vivid album cover description)
- colorScheme: string ('purple-blue', 'pink-cyan', 'green-black', 'blue-cyan', 'neon-green')

For: "${prompt || 'electronic music for coding'}"

Respond ONLY with JSON, no other text.`;

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 10000);

        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: geminiPrompt }] }],
            generationConfig: { 
              temperature: 0.9, 
              maxOutputTokens: 300,
            },
          }),
          signal: controller.signal,
        });

        clearTimeout(timeout);

        if (response.ok) {
          const data = await response.json();
          const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
          
          // Essayer d'extraire le JSON
          try {
            const jsonMatch = textResponse.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
              throw new Error('No JSON found in response');
            }
            
            const songData = JSON.parse(jsonMatch[0]);
            
            // Validation des données
            const validSong = {
              title: songData.title || 'Untitled',
              artist: songData.artist || 'AI Artist',
              genre: songData.genre || 'Electronic',
              bpm: Number(songData.bpm) || 120,
              mood: songData.mood || 'electronic',
              coverDescription: songData.coverDescription || 'Abstract digital art',
              colorScheme: songData.colorScheme || 'purple-blue',
            };
            
            return NextResponse.json({
              ...validSong,
              isReal: true,
              model: model,
              promptUsed: prompt,
              geminiSuccess: true,
              note: `Generated with ${model} (free tier)`,
            });
            
          } catch (parseError) {
            lastError = `Failed to parse response from ${model}`;
            continue; // Essayer le modèle suivant
          }
          
        } else {
          const errorText = await response.text();
          lastError = `${model}: ${response.status} ${errorText.substring(0, 100)}`;
          console.log(`Model ${model} failed: ${lastError}`);
          // Continuer avec le modèle suivant
        }
        
      } catch (modelError: any) {
        lastError = `${model}: ${modelError.message}`;
        continue;
      }
    }
    
    // Si aucun modèle n'a fonctionné, retourner une chanson de démo
    console.log('All Gemini models failed, using demo mode');
    return NextResponse.json(
      getFallbackSong(prompt, `All Gemini models failed: ${lastError}`)
    );

  } catch (error: any) {
    console.error('General error in generate endpoint:', error);
    return NextResponse.json(
      getFallbackSong('', `Server error: ${error.message}`),
      { status: 500 }
    );
  }
}

export async function GET() {
  const apiKey = process.env.GEMINI_API_KEY;
  const isValid = isValidApiKey(apiKey);
  
  return NextResponse.json({
    geminiConfigured: isValid,
    freeModels: FREE_GEMINI_MODELS,
    currentModel: isValid ? 'gemini-1.5-flash (free)' : 'demo-mode',
    status: isValid ? 'ready' : 'demo_mode',
    instructions: isValid 
      ? '✅ Gemini API is configured with free models'
      : '⚠️ Add GEMINI_API_KEY to use AI generation, or enjoy demo mode',
    hackathonMode: true,
  });
}