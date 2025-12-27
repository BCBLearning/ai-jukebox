"use client";

import { useState, useEffect } from 'react';

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [song, setSong] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [loadingUSDC, setLoadingUSDC] = useState(false);
  const [error, setError] = useState<string>('');
  const [playlistPriority, setPlaylistPriority] = useState<string[]>([]);
  const [config, setConfig] = useState<any>(null);

  // Vérifie la configuration au chargement
  useEffect(() => {
    const checkConfig = async () => {
      try {
        const res = await fetch('/api/payment/config');
        const data = await res.json();
        setConfig(data);
      } catch (err) {
        console.log("Config check failed");
      }
    };
    checkConfig();
  }, []);

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
      
      setError(`⚠️ ${err.message || "Problème de connexion à l'IA"}`);
      
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
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour prioriser avec USDC
  const prioritizeWithUSDC = async (song: any) => {
    if (!song) {
      alert("Génère d'abord une chanson !");
      return;
    }

    setLoadingUSDC(true);
    
    try {
      // Appel à notre endpoint de démonstration
      const res = await fetch('/api/payment', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ 
          songTitle: song.title,
          artist: song.artist,
          prompt: prompt
        })
      });
      
      const data = await res.json();
      
      // Crée un popup de simulation
      const modal = document.createElement('div');
      modal.className = 'fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4';
      modal.innerHTML = `
        <div class="bg-gray-900 border border-gray-800 rounded-2xl p-6 max-w-md w-full">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-xl font-bold">💎 Transaction USDC Simulée</h3>
            <button onclick="this.closest('div.fixed').remove()" class="text-gray-500 hover:text-white">×</button>
          </div>
          
          <div class="space-y-4">
            <div class="p-3 bg-gray-800/50 rounded-lg">
              <p class="text-sm text-gray-400">Chanson priorisée</p>
              <p class="font-bold text-lg">"${song.title}"</p>
              <p class="text-sm text-gray-300">${song.artist}</p>
            </div>
            
            <div class="grid grid-cols-2 gap-3">
              <div class="p-3 bg-blue-900/30 rounded-lg">
                <p class="text-sm text-blue-300">Montant</p>
                <p class="font-bold">0.001 USDC</p>
              </div>
              <div class="p-3 bg-green-900/30 rounded-lg">
                <p class="text-sm text-green-300">Réseau</p>
                <p class="font-bold">Arc Testnet</p>
              </div>
            </div>
            
            <div class="p-3 bg-purple-900/30 rounded-lg">
              <p class="text-sm text-purple-300">Temps de règlement</p>
              <p class="font-bold">0.8 secondes</p>
              <p class="text-xs text-gray-400">Finalité déterministe</p>
            </div>
            
            ${data.demo ? `
            <div class="p-4 bg-gray-800 rounded-lg">
              <p class="text-sm font-semibold mb-2">📋 Pour une vraie intégration :</p>
              <ol class="text-xs text-gray-300 space-y-1 pl-4 list-decimal">
                <li>Crée une app sur console.circle.com/wallets</li>
                <li>Configure Arc comme blockchain cible</li>
                <li>Utilise USDC comme token natif</li>
                <li>Teste avec le testnet Arc</li>
              </ol>
            </div>
            ` : ''}
            
            <button onclick="this.closest('div.fixed').remove()" 
              class="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 p-3 rounded-lg font-bold">
              ✅ Transaction ${data.demo ? 'simulée' : ''} réussie
            </button>
          </div>
        </div>
      `;
      
      document.body.appendChild(modal);
      
      // Ajoute à la playlist prioritaire
      setPlaylistPriority(prev => [`${song.title} - ${song.artist}`, ...prev]);
      
    } catch (error) {
      console.error("Payment error:", error);
      alert("Erreur lors de la simulation de paiement");
    } finally {
      setLoadingUSDC(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-900 to-black text-white p-4 md:p-8">
      {/* Header Hackathon */}
      <header className="w-full bg-gradient-to-r from-blue-900/80 to-purple-900/80 border-b border-gray-800 mb-8">
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-black/40 p-2 rounded-lg">
              <span className="text-2xl">🎵</span>
            </div>
            <div>
              <h1 className="font-bold text-lg">AI Jukebox - Agentic Commerce on Arc</h1>
              <p className="text-xs text-gray-300">Hackathon Submission • Circle + Arc + Gemini</p>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-4">
            <div className="text-right">
              <div className="text-xs text-gray-400">Stack Technique</div>
              <div className="flex gap-2">
                <span className="px-2 py-1 bg-blue-900/50 rounded text-xs">Gemini AI</span>
                <span className="px-2 py-1 bg-green-900/50 rounded text-xs">USDC</span>
                <span className="px-2 py-1 bg-purple-900/50 rounded text-xs">Arc</span>
                <span className="px-2 py-1 bg-gray-800 rounded text-xs">Circle</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto">
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
                  <button 
                    onClick={() => prioritizeWithUSDC(song)}
                    disabled={!song || loadingUSDC}
                    className={`w-full p-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-3 ${
                      !song || loadingUSDC
                        ? 'bg-gray-600 cursor-not-allowed' 
                        : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 active:scale-[0.98]'
                    }`}
                  >
                    {loadingUSDC ? (
                      <>
                        <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Transaction en cours...
                      </>
                    ) : (
                      <>
                        <span className="text-xl">💰</span>
                        Prioriser cette chanson - 0.001 USDC
                        <span className="text-xs bg-white/20 px-2 py-1 rounded">Arc Testnet</span>
                      </>
                    )}
                  </button>
                  <p className="text-center text-sm text-gray-400 mt-3">
                    Micropaiement via Circle Wallets • Finalité en &lt;1s sur Arc
                  </p>
                </div>

                {/* Debug info */}
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

        {/* Section Playlist Prioritaire */}
        <div className="mt-10 bg-black/40 rounded-2xl p-6 border border-gray-800">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span className="text-green-400">🎧</span>
            Playlist Prioritaire (USDC Boost)
          </h3>
          
          {playlistPriority.length > 0 ? (
            <div className="space-y-3">
              {playlistPriority.map((songTitle, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-green-900/20 border border-green-800 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-green-400 font-bold">#{index + 1}</span>
                    <span className="font-medium">{songTitle}</span>
                  </div>
                  <div className="text-xs px-2 py-1 bg-green-900/50 rounded">
                    <span className="text-green-300">💎 0.001 USDC</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-4">🎵</div>
              <p>Aucune chanson priorisée pour l'instant</p>
              <p className="text-sm mt-2">Utilise le bouton USDC pour booster une chanson</p>
            </div>
          )}
          
          <div className="mt-6 pt-4 border-t border-gray-800 text-sm text-gray-400">
            <p><span className="text-green-400">💡</span> Chaque paiement USDC priorise une chanson dans la playlist</p>
            <p><span className="text-blue-400">⚡</span> Transactions réglées en &lt;1s sur Arc avec finalité déterministe</p>
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
          
          <div className="mt-6 pt-4 border-t border-gray-800">
            <h4 className="font-bold mb-2">🎯 Conformité Hackathon</h4>
            <ul className="text-sm text-gray-400 space-y-1">
              <li>✅ <strong>Agentic Commerce</strong> : AI agents + autonomous payments</li>
              <li>✅ <strong>Arc Settlement</strong> : USDC as native gas, sub-second finality</li>
              <li>✅ <strong>Circle Infrastructure</strong> : Wallets + Gateway + App Builder</li>
              <li>✅ <strong>Google Gemini</strong> : AI-powered content generation</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Panneau de configuration */}
      <div className="fixed bottom-4 left-4 bg-gray-900 border border-gray-700 p-4 rounded-lg z-50 max-w-xs">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-bold text-sm">⚙️ Configuration Hackathon</h4>
          <button 
            onClick={() => window.open('https://console.circle.com/wallets', '_blank')}
            className="text-xs bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded"
          >
            Circle Console
          </button>
        </div>
        
        <div className="text-xs space-y-2">
          <div className="flex justify-between">
            <span>Gemini API:</span>
            <span className={song?.isReal ? "text-green-400" : "text-yellow-400"}>
              {song?.isReal ? "✓ Réel" : "⚠️ Mock"}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Circle Wallets:</span>
            <span className="text-yellow-400">
              Mode démo
            </span>
          </div>
          
          <div className="mt-2 p-2 bg-gray-800 rounded text-xs">
            <p className="font-semibold">Pour activer USDC réel:</p>
            <ol className="list-decimal pl-4 mt-1 space-y-1">
              <li>Circle Console → <strong>Wallets</strong></li>
              <li>Create App → <strong>Sandbox</strong></li>
              <li>Récupère <strong>API Key</strong></li>
              <li>Vercel → Settings → Environment Variables</li>
            </ol>
          </div>
        </div>
      </div>
    </main>
  );
}