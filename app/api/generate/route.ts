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
          details: "La clé API Gemini n'est pas configurée sur Vercel. Va dans Settings → Environment Variables"
        },
        { status: 500 }
      );
    }

    // Prompt optimisé
    const geminiPrompt = `Tu es un DJ et producteur de musique électronique.
Génère UNIQUEMENT un objet JSON avec ces champs :
{
  "title": "titre créatif (3-5 mots)",
  "artist": "nom d'artiste plausible",
  "genre": "genre musical principal",
  "bpm": nombre entre 60 et 180,
  "mood": "2-3 mots d'humeur",
  "coverDescription": "description visuelle détaillée pour une IA générative",
  "colorScheme": "couleur1-couleur2"
}

Exemple :
{
  "title": "Neon Dreams",
  "artist": "Synthwave Collective", 
  "genre": "Synthwave",
  "bpm": 128,
  "mood": "nostalgic energetic",
  "coverDescription": "A retro-futuristic cityscape with neon palm trees under a purple sky",
  "colorScheme": "purple-pink"
}

Crée une nouvelle chanson pour : "${prompt}"
RÉPONDS UNIQUEMENT LE JSON, SANS AUTRE TEXTE.`;

    console.log("Appel de Gemini avec :", prompt);

    // ⚠️ CHANGE ICI : Utilise gemini-1.5-pro ou gemini-pro
    const modelName = "gemini-1.5-pro"; // ou "gemini-pro"
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: geminiPrompt }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 300,
          responseMimeType: "application/json" // Force le format JSON
        }
      }),
    });

    // Vérifie la réponse HTTP
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Erreur Gemini API:", response.status, errorText);
      
      // Essaie gemini-pro si gemini-1.5-pro échoue
      if (modelName === "gemini-1.5-pro" && response.status === 404) {
        console.log("Essaie avec gemini-pro...");
        // Tu pourrais implémenter une retry automatique ici
      }
      
      return NextResponse.json(
        { 
          error: "API Gemini indisponible",
          details: `Modèle ${modelName} non trouvé. Essaie 'gemini-pro'`,
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
      console.error("Réponse vide:", data);
      throw new Error("Réponse vide de Gemini");
    }

    // Parse le JSON
    let songData;
    try {
      songData = JSON.parse(textResponse.trim());
    } catch (parseError) {
      console.error("Erreur parsing JSON:", textResponse);
      // Essaie d'extraire le JSON si entouré de texte
      const jsonMatch = textResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        songData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("Réponse non-JSON: " + textResponse.substring(0, 100));
      }
    }

    // Validation des données
    if (!songData.title || !songData.artist || !songData.genre) {
      throw new Error("Données incomplètes de l'IA");
    }

    // Données finales
    const finalSong = {
      title: songData.title,
      artist: songData.artist,
      genre: songData.genre,
      bpm: songData.bpm || 120,
      mood: songData.mood || "mystérieux",
      coverDescription: songData.coverDescription || "Un design abstrait coloré",
      colorScheme: songData.colorScheme || "purple-blue",
      generatedAt: new Date().toISOString(),
      isReal: true,
      modelUsed: modelName
    };

    return NextResponse.json(finalSong);
    
  } catch (error: any) {
    console.error("Erreur complète:", error);
    
    // Fallback avec une vraie API différente (optionnel)
    const fallbackSongs = [
      {
        title: "Digital Resonance",
        artist: "AI Symphony",
        genre: "Electronic",
        bpm: 125,
        mood: "futuristic calm",
        coverDescription: "Holographic sound waves in a digital void, glowing with cyan and magenta light",
        colorScheme: "cyan-magenta",
        isReal: false,
        error: error.message,
        tip: "Utilise 'gemini-pro' au lieu de 'gemini-1.5-pro'"
      }
    ];
    
    return NextResponse.json(
      fallbackSongs[0],
      { status: 200 } // Toujours retourner 200 pour le frontend
    );
  }
}