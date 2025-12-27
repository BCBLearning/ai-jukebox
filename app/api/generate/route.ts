import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();
    
    // 1. Vérifie la clé API
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.log("GEMINI_API_KEY manquante - mode fallback");
      return NextResponse.json(getFallbackSong(prompt, "Clé API manquante"));
    }

    // 2. Appel Gemini avec timeout
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `Crée une fausse chanson en 1 ligne pour: ${prompt}. Format: "Titre" par Artiste - Genre`
              }]
            }]
          }),
          signal: controller.signal
        }
      );

      clearTimeout(timeout);

      if (response.ok) {
        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "Digital Dreams par AI - Electronic";
        
        // Parse simple
        const parts = text.split(' par ');
        const title = parts[0]?.replace(/"/g, '').trim() || "Digital Dreams";
        const rest = parts[1] || "AI - Electronic";
        
        return NextResponse.json({
          title: title,
          artist: rest.split(' - ')[0]?.trim() || "AI",
          genre: rest.split(' - ')[1]?.trim() || "Electronic",
          bpm: 120,
          mood: "généré par IA",
          coverDescription: "Art numérique créé par Gemini AI",
          colorScheme: "purple-blue",
          isReal: true,
          response: text
        });
      } else {
        const error = await response.text();
        console.log("Gemini API error:", error);
        throw new Error(`API error ${response.status}`);
      }
    } catch (fetchError: any) {
      console.log("Fetch error:", fetchError.message);
      // Continue au fallback
    } finally {
      clearTimeout(timeout);
    }
    
  } catch (error) {
    console.log("Global error:", error);
  }

  // Fallback garanti
  return NextResponse.json(getFallbackSong("", "API temporairement indisponible"));
}

// Fonction helper doit être définie DANS le fichier mais HORS de la fonction POST
function getFallbackSong(prompt: string, error: string) {
  const songs = [
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
      title: "Arc Transaction",
      artist: "Blockchain Beats",
      genre: "Synthwave",
      bpm: 128,
      mood: "futuriste",
      coverDescription: "Visualisation de transaction USDC sur Arc",
      colorScheme: "green-black",
      isReal: false
    }
  ];
  
  const song = songs[Math.floor(Math.random() * songs.length)];
  return {
    ...song,
    promptUsed: prompt,
    error: error
  };
}