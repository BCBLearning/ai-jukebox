"use client"; // ESSENTIEL : Ce composant s'exécute côté client

import { useState } from 'react';

export default function Home() {
  // États pour gérer l'application
  const [prompt, setPrompt] = useState('');
  const [song, setSong] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  // Fonction qui appelle ton API
  const generateSong = async () => {
    if (!prompt.trim()) {
      setError("Veuillez décrire une chanson !");
      return;
    }

    setLoading(true);
    setError('');
    setSong(null);

    try {
      console.log("Envoi du prompt:", prompt);
      
      // Appelle TON endpoint API (celui que tu as créé)
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          prompt: prompt || "une chanson electro chill" 
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || `Erreur ${response.status}`);
      }

      console.log("Réponse reçue:", data);
      setSong(data);
      
    } catch (err: any) {
      console.error("Erreur détaillée:", err);
      setError(`Échec : ${err.message}`);
      
      // Pour le debug, montre une fausse chanson
      setSong({
        title: "Digital Dreams",
        artist: "Neural Echo",
        genre: "Chillwave/Electronic",
        bpm: 110,
        mood: "calme et concentré",
        coverDescription: "Un cerveau numérique avec des ondes sonores colorées",
        isMock: true // Pour indiquer que c'est un mock
      });
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour le bouton USDC (pour plus tard)
  const prioritizeWithUSDC = () => {
    alert("Bouton USDC - À implémenter avec Circle Wallets !");
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-900 to-black text-white p-8">
      <h1 className="text-4xl font-bold text-center mb-8">🎵 AI Jukebox</h1>
      <p className="text-center mb-8">Demande une chanson générée par IA, priorise-la avec un micropaiement USDC</p>
      
      <div className="max-w-md mx-auto">
        {/* Champ de texte */}
        <input 
          type="text" 
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && generateSong()}
          placeholder="Décris ta chanson idéale (ex: 'electro chill pour coder')"
          className="w-full p-3 rounded-lg bg-gray-800 text-white mb-4 border border-gray-700 focus:border-blue-500 focus:outline-none"
        />
        
        {/* Bouton Générer */}
        <button 
          onClick={generateSong}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-900 disabled:cursor-not-allowed p-3 rounded-lg font-semibold transition-colors"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Génération en cours...
            </span>
          ) : "Générer avec Gemini (Gratuit)"}
        </button>
        
        {/* Bouton USDC */}
        <button 
          onClick={prioritizeWithUSDC}
          className="w-full bg-green-600 hover:bg-green-700 p-3 rounded-lg font-semibold mt-2 transition-colors"
        >
          Prioriser pour 0.001 USDC (Payant)
        </button>
        
        {/* Affichage des erreurs */}
        {error && (
          <div className="mt-4 p-3 bg-red-900/50 border border-red-700 rounded-lg">
            <p className="text-red-300">⚠️ {error}</p>
            <p className="text-sm text-red-400 mt-1">
              Vérifie que ta clé API est configurée sur Vercel (Settings → Environment Variables)
            </p>
          </div>
        )}
        
        {/* Affichage de la chanson générée */}
        {song && (
          <div className="mt-8 p-6 bg-gray-900/70 border border-gray-700 rounded-xl">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold text-white">{song.title}</h2>
                <p className="text-gray-300">Artiste : {song.artist}</p>
                <p className="text-gray-300">Genre : {song.genre}</p>
                {song.bpm && <p className="text-gray-300">BPM : {song.bpm}</p>}
                {song.mood && <p className="text-gray-300">Ambiance : {song.mood}</p>}
              </div>
              {song.isMock && (
                <span className="bg-yellow-900 text-yellow-200 text-xs px-2 py-1 rounded">
                  Données de test
                </span>
              )}
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-800">
              <h3 className="font-semibold mb-2">🎨 Cover Art :</h3>
              <p className="text-gray-400 italic">{song.coverDescription}</p>
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-800">
              <p className="text-sm text-gray-500">
                {song.isMock 
                  ? "L'API Gemini ne répond pas. Vérifie ta clé API sur Vercel."
                  : "Pour mettre cette chanson en tête de playlist, utilise le bouton USDC !"
                }
              </p>
            </div>
          </div>
        )}
        
        {/* Instructions de debug */}
        <div className="mt-8 text-sm text-gray-500">
          <h3 className="font-semibold mb-2">🔍 Pour déboguer :</h3>
          <ol className="list-decimal pl-5 space-y-1">
            <li>Ouvre la console (F12 → Console)</li>
            <li>Clique sur "Générer avec Gemini"</li>
            <li>Regarde les messages d'erreur</li>
            <li>Vérifie Vercel → Settings → Environment Variables</li>
          </ol>
        </div>
      </div>
    </main>
  );
}