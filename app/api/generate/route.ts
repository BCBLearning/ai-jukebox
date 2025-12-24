// app/api/generate/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();
    
    // SIMULATION pour tester - en attendant Gemini
    const mockSongs = [
      {
        title: "Digital Dreams",
        artist: "Neural Echo", 
        genre: "Chillwave/Electronic",
        coverDescription: "Un cerveau numérique avec des ondes sonores colorées"
      },
      {
        title: "Neon Sunrise",
        artist: "Circuit Mind",
        genre: "Synthwave",
        coverDescription: "Paysage urbain rétro-futuriste"
      }
    ];
    
    const randomSong = mockSongs[Math.floor(Math.random() * mockSongs.length)];
    
    return NextResponse.json(randomSong);
    
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to generate song" },
      { status: 500 }
    );
  }
}