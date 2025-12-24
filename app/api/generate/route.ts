import { NextResponse } from "next/server";

export const runtime = "nodejs";

// Modèle Gemini
const GEMINI_MODEL = "gemini-pro";

export async function POST(request: Request) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10_000);

  try {
    const { prompt } = await request.json();

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        getFallbackSong("empty", "Prompt invalide"),
        { status: 200 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.error("GEMINI_API_KEY manquante");
      return NextResponse.json(
        getFallbackSong(prompt, "Clé API non configurée"),
        { status: 200 }
      );
    }

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`;

    // PROMPT STABLE (NE PAS METTRE DE JSON DANS LE TEXTE UTILISATEUR)
    const geminiPrompt = `
Tu es un générateur de métadonnées musicales fictives.

Réponds UNIQUEMENT avec un objet JSON valide, sans texte avant ni après.

Champs obligatoires :
- title (max 5 mots)
- artist (nom crédible)
- genre
- bpm (entre 80 et 160)
- mood (max 3 mots)
- coverDescription (1 phrase descriptive)
- colorScheme (couleur1-couleur2-couleur3)

Sujet musical :
"${prompt}"
`;

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: geminiPrompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 300,
        },
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.error("Erreur Gemini:", response.status);
      return NextResponse.json(
        getFallbackSong(prompt, `Erreur API ${response.status}`),
        { status: 200 }
      );
    }

    const data = await response.json();
    const textResponse =
      data?.candidates?.[0]?.content?.parts?.[0]?.text;

    let songData: any = {};

    if (textResponse) {
      try {
        const cleaned = textResponse
          .replace(/```json|```/gi, "")
          .replace(/^[^{]*|[^}]*$/g, "")
          .trim();

        songData = JSON.parse(cleaned);
      } catch {
        songData = {};
      }
    }

    // OBJET FINAL GARANTI
    const finalSong = {
      title: songData.title ?? "Untitled Track",
      artist: songData.artist ?? "AI Composer",
      genre: songData.genre ?? "Electronic",
      bpm: Number(songData.bpm) || 120,
      mood: songData.mood ?? "mystérieux",
      coverDescription:
        songData.coverDescription ?? "Artwork généré par intelligence artificielle",
      colorScheme: songData.colorScheme ?? "purple-blue",
      generatedAt: new Date().toISOString(),
      isReal: true,
      model: GEMINI_MODEL,
    };

    return NextResponse.json(finalSong);
  } catch (error: any) {
    clearTimeout(timeoutId);

    if (error?.name === "AbortError") {
      return NextResponse.json(
        getFallbackSong("timeout", "Gemini trop lent (>10s)"),
        { status: 200 }
      );
    }

    console.error("Erreur serveur:", error?.message);

    return NextResponse.json(
      getFallbackSong("error", error?.message || "Erreur inconnue"),
      { status: 200 }
    );
  }
}

// FALLBACK GARANTI (JAMAIS D’ÉCRAN VIDE)
function getFallbackSong(prompt: string, error: string) {
  const songs = [
    {
      title: "Digital Dreams",
      artist: "Neural Echo",
      genre: "Chillwave",
      bpm: 110,
      mood: "calme numérique",
      coverDescription: "Cerveau digital flottant dans un espace lumineux",
      colorScheme: "purple-blue",
    },
    {
      title: "Neon Sunrise",
      artist: "Circuit Mind",
      genre: "Synthwave",
      bpm: 128,
      mood: "nostalgique",
      coverDescription: "Ville futuriste éclairée par des néons roses",
      colorScheme: "pink-cyan",
    },
  ];

  const song = songs[Math.floor(Math.random() * songs.length)];

  return {
    ...song,
    promptUsed: prompt,
    error,
    isReal: false,
    debugTip:
      "Mode fallback actif — vérifie la clé Gemini sur Vercel (Environment Variables)",
  };
}