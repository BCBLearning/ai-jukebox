import { NextResponse } from 'next/server';

// Modèle garanti de fonctionner
const GEMINI_MODEL = "gemini-pro";

export async function POST(request: Request) {
  // Contrôleur pour timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 secondes

  try {
    const { prompt } = await request.json();
    
    // Vérification clé API
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      console.error("❌ GEMINI_API_KEY manquante");
      return NextResponse.json(getFallbackSong(prompt, "Clé API non configurée"));
    }

    console.log(`🚀 Appel Gemini avec: ${GEMINI_MODEL}`);

    // URL API correcte
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`;

    // Prompt simple et efficace
    const geminiPrompt = `Crée une fausse chanson au format JSON :
{
  "title": "titre",
  "artist": "artiste",
  "genre": "genre",
  "bpm": 120,
  "mood": "ambiance",
  "coverDescription": "description",
  "colorScheme": "couleurs"
}

Pour : "${prompt}"
Réponds UNIQUEMENT le JSON.`;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: geminiPrompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 300,
        }
      }),
      signal: controller.signal // Timeout avec AbortController
    });

    clearTimeout(timeoutId);

    // Gestion des erreurs HTTP
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ Gemini error ${response.status}`);
      
      return NextResponse.json(
        getFallbackSong(prompt, `API error ${response.status}`),
        { status: 200 }
      );
    }

    // Traitement réponse
    const data = await response.json();
    const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!textResponse) {
      return NextResponse.json(getFallbackSong(prompt, "Réponse vide"));
    }

    // Nettoyage
    const cleanText = textResponse
      .trim()
      .replace(/```json|```/g, '')
      .replace(/^JSON:\s*/i, '');

    let songData;
    try {
      songData = JSON.parse(cleanText);
      console.log("✅ JSON parsé");
    } catch {
      // Fallback parsing
      songData = {
        title: cleanText.split('\n')[0] || "AI Track",
        artist: "Gemini AI",
        genre: "Electronic",
        bpm: 120,
        mood: "expérimental",
        coverDescription: "Généré par IA",
        colorScheme: "blue-gray"
      };
    }

    // Réponse finale
    const finalSong = {
      title: songData.title || `Track ${Date.now().toString().slice(-4)}`,
      artist: songData.artist || "AI Composer",
      genre: songData.genre || "Electronic",
      bpm: Number(songData.bpm) || 120,
      mood: songData.mood || "mystérieux",
      coverDescription: songData.coverDescription || "Art numérique",
      colorScheme: songData.colorScheme || "purple-blue",
      generatedAt: new Date().toISOString(),
      isReal: true,
      model: GEMINI_MODEL,
    };

    return NextResponse.json(finalSong);
    
  } catch (error: any) {
    clearTimeout(timeoutId);
    
    // Gestion spécifique du timeout
    if (error.name === 'AbortError') {
      console.error("⏱️  Timeout Gemini API");
      return NextResponse.json(
        getFallbackSong("timeout", "Gemini trop lent (>10s)"),
        { status: 200 }
      );
    }
    
    console.error("💥 Erreur:", error.message);
    return NextResponse.json(
      getFallbackSong("error", error.message),
      { status: 200 }
    );
  }
}

// Fallback garanti
function getFallbackSong(prompt: string, error: string) {
  const fallbacks = [
    {
      title: "Digital Dreams",
      artist: "Neural Echo",
      genre: "Chillwave",
      bpm: 110,
      mood: "calme numérique",
      coverDescription: "Cerveau digital avec ondes sonores dans l'espace",
      colorScheme: "purple-blue",
      isReal: false
    },
    {
      title: "Neon Sunrise", 
      artist: "Circuit Mind",
      genre: "Synthwave",
      bpm: 128,
      mood: "nostalgique",
      coverDescription: "Ville futuriste avec néons sous ciel violet",
      colorScheme: "pink-cyan",
      isReal: false
    }
  ];
  
  const song = fallbacks[Math.floor(Math.random() * fallbacks.length)];
  
  return {
    ...song,
    promptUsed: prompt,
    error: error,
    debug: "Mode fallback - Frontend fonctionnel",
    tip: "Le hackathon se joue sur USDC + Arc, pas sur Gemini"
  };
}