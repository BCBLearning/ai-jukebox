import { NextResponse } from 'next/server';

// Modèle garanti de fonctionner avec tous les comptes
const GEMINI_MODEL = "gemini-pro";

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();
    
    // Clé API Vérification
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      console.error("❌ GEMINI_API_KEY manquante sur Vercel");
      return NextResponse.json(getFallbackSong(prompt, "Clé API non configurée"));
    }

    console.log(`🚀 Appel Gemini avec modèle: ${GEMINI_MODEL}`);
    console.log(`📝 Prompt: ${prompt.substring(0, 50)}...`);

    // URL API CORRECTE pour gemini-pro
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`;

    // Prompt OPTIMISÉ pour gemini-pro
    const geminiPrompt = `Tu es un DJ expert. Crée une fausse chanson.
Format JSON SEULEMENT :
{
  "title": "Nom de la chanson",
  "artist": "Nom de l'artiste", 
  "genre": "Genre musical",
  "bpm": 100,
  "mood": "Ambiance",
  "coverDescription": "Description visuelle pour une image",
  "colorScheme": "couleur1-couleur2"
}

Thème : "${prompt}"
`;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: geminiPrompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 300,
          topP: 0.8,
          topK: 40
        }
      }),
      timeout: 10000 // 10 secondes max
    });

    // Vérification réponse
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ Gemini API error ${response.status}:`, errorText.substring(0, 200));
      
      // Analyse l'erreur
      let errorMsg = `API error ${response.status}`;
      try {
        const errorJson = JSON.parse(errorText);
        errorMsg = errorJson.error?.message || errorText.substring(0, 100);
      } catch {}
      
      return NextResponse.json(
        getFallbackSong(prompt, `Gemini API: ${errorMsg}`),
        { status: 200 } // Toujours 200 pour le frontend
      );
    }

    // Traitement réponse
    const data = await response.json();
    console.log("✅ Réponse Gemini reçue");
    
    const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!textResponse) {
      console.error("Réponse vide:", data);
      return NextResponse.json(getFallbackSong(prompt, "Réponse vide de l'IA"));
    }

    // Nettoyage et extraction JSON
    const cleanText = textResponse
      .trim()
      .replace(/^```json\s*/, '')
      .replace(/\s*```$/, '')
      .replace(/^JSON:\s*/i, '');
    
    let songData;
    try {
      songData = JSON.parse(cleanText);
      console.log("✅ JSON parsé avec succès");
    } catch (parseError) {
      console.error("❌ Erreur parsing JSON:", cleanText.substring(0, 100));
      
      // Fallback: crée un objet depuis le texte brut
      songData = extractSongFromText(cleanText, prompt);
    }

    // Construction réponse finale
    const finalSong = {
      title: songData.title?.trim() || `AI Track ${Date.now().toString().slice(-4)}`,
      artist: songData.artist?.trim() || "Gemini AI",
      genre: songData.genre?.trim() || "Electronic",
      bpm: Number(songData.bpm) || 120,
      mood: songData.mood?.trim() || "expérimental",
      coverDescription: songData.coverDescription?.trim() || "Art numérique généré par IA",
      colorScheme: songData.colorScheme?.trim() || "purple-blue",
      generatedAt: new Date().toISOString(),
      isReal: true,
      model: GEMINI_MODEL,
      promptUsed: prompt
    };

    console.log(`🎵 Chanson générée: "${finalSong.title}" par ${finalSong.artist}`);
    return NextResponse.json(finalSong);
    
  } catch (error: any) {
    console.error("💥 Erreur globale:", error);
    return NextResponse.json(
      getFallbackSong("erreur système", error.message),
      { status: 200 }
    );
  }
}

// Fonction d'extraction depuis texte brut
function extractSongFromText(text: string, prompt: string) {
  const lines = text.split('\n').filter(line => line.trim());
  
  return {
    title: lines[0]?.replace(/["']/g, '').trim() || `Song for: ${prompt.substring(0, 20)}`,
    artist: lines.find(l => l.toLowerCase().includes('artist') || l.toLowerCase().includes('par')) 
      || "AI Composer",
    genre: lines.find(l => l.toLowerCase().includes('genre') || l.toLowerCase().includes('style'))
      || "Electronic",
    bpm: 120,
    mood: "mystérieux",
    coverDescription: "Une visualisation musicale abstraite",
    colorScheme: "blue-purple"
  };
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
      coverDescription: "Un cerveau avec des ondes sonores dans l'espace digital, nébuleuse violette",
      colorScheme: "purple-blue",
      isReal: false
    },
    {
      title: "Circuit Breaker",
      artist: "AI Symphony",
      genre: "Glitch Hop", 
      bpm: 95,
      mood: "énergétique glitch",
      coverDescription: "Circuit électronique animé avec des étincelles de données colorées",
      colorScheme: "green-black",
      isReal: false
    },
    {
      title: "Neon Sunrise",
      artist: "Synthwave Collective",
      genre: "Synthwave",
      bpm: 128,
      mood: "nostalgique énergique",
      coverDescription: "Paysage urbain rétro-futuriste avec palmiers néon sous ciel violet",
      colorScheme: "pink-cyan",
      isReal: false
    }
  ];
  
  const randomSong = fallbacks[Math.floor(Math.random() * fallbacks.length)];
  
  return {
    ...randomSong,
    promptUsed: prompt,
    error: error,
    debug: "Mode fallback activé - Frontend fonctionnel pour le hackathon",
    tip: "Focus sur Circle Wallets + USDC pour gagner le hackathon"
  };
}