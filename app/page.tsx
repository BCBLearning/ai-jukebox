"use client";

import { useState } from 'react';

export default function Home() {
  // ÉTATS - Pour stocker les données
  const [prompt, setPrompt] = useState('');
  const [song, setSong] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // FONCTION QUI APPEL L'API
  const generateSong = async () => {
    setLoading(true);
    
    try {
      // 1. Appelle TON endpoint API
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          prompt: prompt || "electro chill pour coder" 
        }),
      });

      // 2. Récupère la réponse
      const data = await response.json();
      
      // 3. Affiche la chanson
      setSong(data);
      
    } catch (error) {
      console.error("Erreur:", error);
      // Montre une chanson de test en cas d'erreur
      setSong({
        title: "Digital Dreams",
        artist: "Neural Echo",
        genre: "Chillwave/Electronic",
        coverDescription: "Un cerveau numérique avec des ondes sonores"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-900 to-black text-white p-8">
      <h1 className="text-4xl font-bold text-center mb-8">🎵 AI Jukebox</h1>
      <p className="text-center mb-8">Demande une chanson générée par IA, priorise-la avec un micropaiement USDC</p>
      
      <div className="max-w-md mx-auto">
        {/* CHAMP TEXTE - Maintenant avec valeur et onChange */}
        <input 
          type="text" 
          value={prompt}  // Lie à l'état
          onChange={(e) => setPrompt(e.target.value)}  // Met à jour l'état
          placeholder="Décris ta chanson idéale (ex: 'electro chill pour coder')"
          className="w-full p-3 rounded-lg bg-gray-800 text-white mb-4"
        />
        
        {/* BOUTON - Maintenant avec onClick */}
        <button 
          onClick={generateSong}  // Appelle la fonction au clic
          className="w-full bg-blue-600 hover:bg-blue-700 p-3 rounded-lg font-semibold"
        >
          {loading ? "Génération..." : "Générer avec Gemini (Gratuit)"}
        </button>
        
        {/* BOUTON USDC */}
        <button className="w-full bg-green-600 hover:bg-green-700 p-3 rounded-lg font-semibold mt-2">
            Prioriser pour 0.001 USDC (Payant)
        </button>
        
        {/* AFFICHAGE DE LA CHANSON - Si une chanson existe */}
        {song && (
          <div className="mt-8 p-4 bg-gray-800 rounded-lg">
            <h2 className="text-xl font-bold">{song.title}</h2>
            <p className="text-gray-300">Artiste: {song.artist}</p>
            <p className="text-gray-300">Genre: {song.genre}</p>
            <p className="text-sm text-gray-400 mt-2">
              Cover: {song.coverDescription}
            </p>
          </div>
        )}
      </div>
    </main>
  );
}