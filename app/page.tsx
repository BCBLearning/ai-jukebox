"use client";

import { useState } from 'react';

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [song, setSong] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const generateSong = async () => {
    if (!prompt.trim()) {
      setError("🎵 Décris d'abord la chanson de tes rêves !");
      return;
    }

    setLoading(true);
    setError('');
    setSong(null);

    try {
      console.log("Envoi à Gemini:", prompt);
      
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.details || data.error || `Erreur ${response.status}`);
      }

      setSong(data);
      
    } catch (err: any) {
      console.error("Erreur frontend:", err);
      
      // Affiche l'erreur, mais montre aussi une chanson de secours
      setError(`⚠️ ${err.message || "Problème de connexion à l'IA"}`);
      
      if (!song) {
        // Chanson de secours
        setSong({
          title: "AI Connection Lost",
          artist: "System Recovery",
          genre: "Ambient Glitch",
          bpm: 80,
          mood: "mystérieux réparateur",
          coverDescription: "Des câbles de données qui se reconnectent dans l'espace digital",
          colorScheme: "blue-gray",
          isReal: false,
          debugTip: "Vérifie ta clé API sur Vercel Settings → Environment Variables"
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-900 to-black text-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* En-tête */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            🎵 AI Jukebox <span className="text-blue-400">Hackathon Edition</span>
          </h1>
          <p className="text-gray-300 mb-2">
            Génère des chansons avec <span className="font-semibold text-blue-300">Gemini AI</span> et 
            priorise-les avec <span className="font-semibold text-green-300">USDC sur Arc</span>
          </p>
          <p className="text-sm text-gray-500">
            Hackathon Agentic Commerce on Arc • LabLab.ai
          </p>
        </div>

        {/* Zone principale */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Colonne gauche : Génération */}
          <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-800">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <span className="bg-blue-900/30 p-2 rounded-lg">1</span>
              Génère ta chanson IA
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Décris l'ambiance musicale :
                </label>
                <textarea 
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Ex: 'Une vibe electro chill pour coder tard le soir, avec des influences synthwave...'"
                  className="w-full h-32 p-4 rounded-xl bg-gray-800 border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none text-white resize-none"
                  disabled={loading}
                />
              </div>
              
              <button 
                onClick={generateSong}
                disabled={loading}
                className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
                  loading 
                    ? 'bg-blue-800 cursor-wait' 
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 active:scale-[0.98]'
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-3">
                    <svg className="animate-spin h-6 w-6" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Génération avec Gemini...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <span className="text-xl">✨</span>
                    Générer avec Gemini (Gratuit)
                  </span>
                )}
              </button>
              
              {error && (
                <div className="p-4 bg-red-900/30 border border-red-800 rounded-xl">
                  <p className="text-red-300 font-medium">⚠️ {error}</p>
                  <details className="mt-2">
                    <summary className="text-sm text-red-400 cursor-pointer">Détails techniques</summary>
                    <p className="text-xs text-red-500 mt-2">
                      Vérifie : 1) Clé API sur Vercel 2) Compte Google AI Studio 3) Quota Gemini API
                    </p>
                  </details>
                </div>
              )}
            </div>
          </div>

          {/* Colonne droite : Résultat */}
          <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-800">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <span className="bg-green-900/30 p-2 rounded-lg">2</span>
              {song ? `"${song.title}"` : 'Ta chanson générée'}
            </h2>
            
            {song ? (
              <div className="space-y-6">
                {/* En-tête de la chanson */}
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-3xl font-bold">{song.title}</h3>
                      {song.isReal === false && (
                        <span className="text-xs bg-yellow-900/50 text-yellow-300 px-2 py-1 rounded">
                          Mode démo
                        </span>
                      )}
                    </div>
                    <p className="text-xl text-gray-300">par <span className="font-semibold">{song.artist}</span></p>
                    <div className="flex items-center gap-4 mt-4 text-sm">
                      <span className="px-3 py-1 bg-gray-800 rounded-full">{song.genre}</span>
                      <span className="px-3 py-1 bg-gray-800 rounded-full">{song.bpm} BPM</span>
                      <span className="px-3 py-1 bg-gray-800 rounded-full">{song.mood}</span>
                    </div>
                  </div>
                </div>

                {/* Visualisation de la cover */}
                <div className="relative">
                  <div className={`h-48 rounded-xl bg-gradient-to-r ${
                    song.colorScheme === 'purple-blue' ? 'from-purple-900 to-blue-900' :
                    song.colorScheme === 'green-black' ? 'from-green-900 to-black' :
                    'from-purple-800 to-pink-800'
                  } flex items-center justify-center`}>
                    <div className="text-center p-6">
                      <div className="text-5xl mb-4">🎵</div>
                      <p className="text-gray-300 italic">"{song.coverDescription}"</p>
                    </div>
                  </div>
                  <div className="absolute top-4 right-4 text-xs text-gray-400">
                    Cover AI générée
                  </div>
                </div>

                {/* Bouton USDC */}
                <div className="pt-4 border-t border-gray-800">
                  <button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 p-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all active:scale-[0.98]">
                    <span className="text-xl">💰</span>
                    Prioriser cette chanson - 0.001 USDC
                    <span className="text-xs bg-white/20 px-2 py-1 rounded">Arc Blockchain</span>
                  </button>
                  <p className="text-center text-sm text-gray-400 mt-3">
                    Micropaiement via Circle Wallets • Finalité en &lt;1s sur Arc
                  </p>
                </div>

                {/* Debug info (seulement en dev) */}
                {song.debugTip && (
                  <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                    <p className="text-sm text-gray-400">💡 {song.debugTip}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center py-12 text-gray-500">
                <div className="text-6xl mb-4">🎧</div>
                <p className="text-center">Génère ta première chanson avec Gemini</p>
                <p className="text-sm text-center mt-2">L'IA créera un titre, un artiste et une cover</p>
              </div>
            )}
          </div>
        </div>

        {/* Instructions pour les juges */}
        <div className="mt-10 p-6 bg-black/40 rounded-2xl border border-gray-800">
          <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
            <span className="text-blue-400">⚡</span>
            Stack Technique pour le Hackathon
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-3 bg-gray-900/50 rounded-lg text-center">
              <div className="font-bold text-blue-400">Gemini AI</div>
              <div className="text-xs text-gray-400">Génération créative</div>
            </div>
            <div className="p-3 bg-gray-900/50 rounded-lg text-center">
              <div className="font-bold text-green-400">USDC on Arc</div>
              <div className="text-xs text-gray-400">Paiements stables</div>
            </div>
            <div className="p-3 bg-gray-900/50 rounded-lg text-center">
              <div className="font-bold text-purple-400">Circle Wallets</div>
              <div className="text-xs text-gray-400">Portefeuilles sécurisés</div>
            </div>
            <div className="p-3 bg-gray-900/50 rounded-lg text-center">
              <div className="font-bold text-pink-400">Next.js 14</div>
              <div className="text-xs text-gray-400">Full-stack React</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}