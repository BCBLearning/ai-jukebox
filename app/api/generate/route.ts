import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();
    
    // Vérifie que la clé API est configurée
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("ERREUR: GEMINI_API_KEY non définie");
      return NextResponse.json(
        { 
          error: "Configuration serveur manquante",
          details: "La clé API Gemini n'est pas configurée sur Vercel"
        },
        { status: 500 }
      );
    }

    // Prompt optimisé pour un JSON fiable
    const geminiPrompt = `TON RÔLE : Expert en création musicale pour un jukebox IA.
TA TÂCHE : Génère des métadonnées de chanson UNIQUEMENT au format JSON suivant :

{
  "title": "titre créatif (3-5 mots)",
  "artist": "nom d'artiste plausible",
  "genre": "genre musical principal",
  "bpm": nombre entre 60 et 180,
  "mood": "2-3 mots d'humeur",
  "coverDescription": "description visuelle détaillée pour une IA générative",
  "colorScheme": "couleur1-couleur2"
}

EXEMPLE :
{
  "title": "Neon Dreams",
  "artist": "Synthwave Collective",
  "genre": "Synthwave",
  "bpm": 128,
  "mood": "nostalgic energetic",
  "coverDescription": "A retro-futuristic cityscape with neon palm trees under a purple sky, viewed through a VHS filter",
  "colorScheme": "purple-pink"
}

CRÉE UNE NOUVELLE CHANSON POUR : "${prompt}"
RÉPONDS UNIQUEMENT EN JSON, SANS AUTRE TEXTE.`;

    console.log("Appel de l'API Gemini avec le prompt:", prompt.substring(0, 50) + "...");

    // Appel à l'API Gemini
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: geminiPrompt }]
          }],
          generationConfig: {
            temperature: 0.8,  // Créativité modérée
            maxOutputTokens: 500,
          }
        }),
      }
    );

    // Vérifie la réponse HTTP
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Erreur Gemini API:", response.status, errorText);
      
      // Essaye de récupérer les détails de l'erreur
      let errorDetails = `API Gemini erreur ${response.status}`;
      try {
        const errorJson = JSON.parse(errorText);
        errorDetails = errorJson.error?.message || errorText;
      } catch {
        errorDetails = errorText;
      }
      
      return NextResponse.json(
        { 
          error: "Échec de l'appel à l'IA",
          details: errorDetails,
          status: response.status
        },
        { status: 500 }
      );
    }

    const data = await response.json();
    console.log("Réponse Gemini reçue");
    
    // Extrait le texte de la réponse
    const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!textResponse) {
      throw new Error("Réponse vide de Gemini");
    }

    // Nettoie et parse le JSON
    const cleanText = textResponse.trim();
    
    // Essaie d'extraire le JSON (au cas où Gemini ajoute du texte autour)
    let jsonMatch;
    try {
      jsonMatch = cleanText.match(/\{[\s\S]*\}/);
    } catch (e) {
      throw new Error("Format de réponse invalide");
    }

    if (!jsonMatch) {
      console.error("Réponse non-JSON de Gemini:", cleanText);
      throw new Error("L'IA n'a pas retourné de JSON valide");
    }

    const songData = JSON.parse(jsonMatch[0]);
    
    // Validation des données requises
    if (!songData.title || !songData.artist || !songData.genre) {
      throw new Error("Données de chanson incomplètes");
    }

    // Données par défaut si manquantes
    const finalSong = {
      title: songData.title,
      artist: songData.artist,
      genre: songData.genre,
      bpm: songData.bpm || 120,
      mood: songData.mood || "mystérieux",
      coverDescription: songData.coverDescription || "Un design abstrait coloré",
      colorScheme: songData.colorScheme || "purple-blue",
      generatedAt: new Date().toISOString(),
      isReal: true  // Indique que c'est une vraie génération
    };

    return NextResponse.json(finalSong);
    
  } catch (error: any) {
    console.error("Erreur complète:", error);
    
    // Fallback en cas d'échec total
    const fallbackSongs = [
      {
        title: "Digital Dreams",
        artist: "Neural Echo",
        genre: "Chillwave",
        bpm: 110,
        mood: "calme contemplatif",
        coverDescription: "Un cerveau numérique avec des ondes sonores colorées dans une nébuleuse",
        colorScheme: "purple-blue",
        isReal: false,
        error: error.message
      },
      {
        title: "Circuit Breaker",
        artist: "AI Symphony",
        genre: "Glitch Hop",
        bpm: 95,
        mood: "energetic glitchy",
        coverDescription: "Un circuit électronique animé avec des étincelles de données",
        colorScheme: "green-black",
        isReal: false,
        error: error.message
      }
    ];
    
    return NextResponse.json(
      fallbackSongs[Math.floor(Math.random() * fallbackSongs.length)],
      { status: 500 }
    );
  }
}