"use client";

import { useState, useEffect } from 'react';
import Header from './components/Header';
import SongGenerator from './components/SongGenerator';
import SongDisplay from './components/SongDisplay';
import Playlist from './components/Playlist';
import TechStack from './components/TechStack';
import ConfigPanel from './components/ConfigPanel';

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [song, setSong] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [loadingUSDC, setLoadingUSDC] = useState(false);
  const [error, setError] = useState('');
  const [playlist, setPlaylist] = useState<string[]>([]);
  const [config, setConfig] = useState<any>(null);
  const [geminiError, setGeminiError] = useState<string>('');

  // Vérifier la configuration au chargement
  useEffect(() => {
    const checkConfig = async () => {
      try {
        const res = await fetch('/api/config');
        if (res.ok) {
          const data = await res.json();
          setConfig(data);
        }
      } catch (err) {
        console.log('Config check failed:', err);
      }
    };
    checkConfig();
  }, []);

  // Générer une chanson avec Gemini
  const generateSong = async () => {
    if (!prompt.trim()) {
      setError('Please describe a song first!');
      return;
    }

    setLoading(true);
    setError('');
    setGeminiError('');
    setSong(null);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}`);
      }

      // Vérifier si Gemini a généré une erreur
      if (data.error) {
        setGeminiError(data.error);
        // Charger quand même la chanson de fallback pour l'afficher
        setSong(data);
      } else {
        setSong(data);
        // Si pas d'erreur et chanson réelle, on pourrait lancer la lecture automatique
        if (data.isReal && !data.error) {
          // La lecture audio se fera dans SongDisplay via le bouton play
          console.log('Gemini song generated successfully');
        }
      }
    } catch (err: any) {
      console.error('Generation error:', err);
      setError(err.message || 'Failed to generate song');

      // Fallback - charger une chanson demo
      try {
        const fallbackResponse = await fetch('/api/generate', { 
          method: 'POST', 
          body: JSON.stringify({ prompt: '' }), 
          headers: { 'Content-Type': 'application/json' }
        });
        const fallbackData = await fallbackResponse.json();
        setSong(fallbackData);
        setGeminiError('Gemini API error - Demo song loaded');
      } catch (fallbackErr) {
        console.error('Fallback also failed:', fallbackErr);
      }
    } finally {
      setLoading(false);
    }
  };

  // Charger une chanson de démonstration aléatoire
  const loadDemoSong = async () => {
    setLoading(true);
    setError('');
    setGeminiError('');
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: '' }), // aucun prompt -> fallback song
      });
      const data = await response.json();
      setSong(data);
      setGeminiError('Demo mode - Gemini not configured');
    } catch (err: any) {
      console.error('Demo generation error:', err);
      setError('Failed to load demo song');
    } finally {
      setLoading(false);
    }
  };

  // Prioriser avec USDC
  const prioritizeWithUSDC = async () => {
    if (!song) {
      alert('Generate a song first!');
      return;
    }

    setLoadingUSDC(true);

    try {
      const response = await fetch('/api/paiement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          songTitle: song.title,
          artist: song.artist,
          amount: '0.001',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Payment failed');
      }

      // Ajouter à la playlist
      setPlaylist(prev => [`${song.title} - ${song.artist}`, ...prev]);

      // Afficher la modal de succès
      showPaymentModal(data);
    } catch (err: any) {
      console.error('Payment error:', err);
      alert(`Payment error: ${err.message}`);
    } finally {
      setLoadingUSDC(false);
    }
  };

  // Afficher la modal de paiement
  const showPaymentModal = (data: any) => {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4';
    modal.innerHTML = `
      <div class="bg-gray-900 border border-gray-800 rounded-2xl p-6 max-w-md w-full animate-fade-in">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-2xl font-bold">🎉 Payment Successful!</h3>
          <button onclick="this.closest('div.fixed').remove()" class="text-gray-500 hover:text-white text-2xl">&times;</button>
        </div>
        
        <div class="space-y-4">
          <div class="p-4 bg-gray-800/50 rounded-xl">
            <p class="text-gray-400 text-sm">Song prioritized</p>
            <p class="text-xl font-bold">"${song.title}"</p>
            <p class="text-gray-300">${song.artist}</p>
          </div>
          
          <div class="grid grid-cols-2 gap-3">
            <div class="p-3 bg-blue-900/30 rounded-lg">
              <p class="text-sm text-blue-300">Amount</p>
              <p class="font-bold">0.001 USDC</p>
            </div>
            <div class="p-3 bg-green-900/30 rounded-lg">
              <p class="text-sm text-green-300">Network</p>
              <p class="font-bold">Arc Testnet</p>
            </div>
          </div>
          
          <div class="p-3 bg-purple-900/30 rounded-lg">
            <p class="text-sm text-purple-300">Settlement Time</p>
            <p class="font-bold">0.8 seconds</p>
            <p class="text-xs text-gray-400">Deterministic finality</p>
          </div>
          
          ${data.demo ? `
            <div class="p-4 bg-yellow-900/20 border border-yellow-800 rounded-lg">
              <p class="text-sm font-semibold text-yellow-300 mb-2">🔧 Demo Mode Active</p>
              <p class="text-xs text-yellow-200">To enable real USDC payments:</p>
              <ol class="text-xs text-yellow-200 mt-2 space-y-1 pl-4 list-decimal">
                <li>Create Circle account at console.circle.com</li>
                <li>Get API keys from Wallets section</li>
                <li>Add to Vercel Environment Variables</li>
              </ol>
            </div>
          ` : ''}
          
          <button onclick="this.closest('div.fixed').remove()" 
            class="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 p-4 rounded-xl font-bold text-lg transition-all active:scale-[0.98]">
            ✅ Close
          </button>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
  };

  return (
    <main className="min-h-screen">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Gemini Error Banner */}
        {geminiError && (
          <div className="mb-6 p-4 bg-yellow-900/30 border border-yellow-800 rounded-xl animate-fade-in">
            <div className="flex items-center gap-3">
              <div className="text-2xl">⚠️</div>
              <div>
                <p className="font-semibold text-yellow-300">Gemini API Issue</p>
                <p className="text-sm text-yellow-200">{geminiError}</p>
                <p className="text-xs text-yellow-300/70 mt-1">
                  Demo song loaded with audio preview. Configure GEMINI_API_KEY for AI-generated songs.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Left Column - Generation */}
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6">
            <SongGenerator
              prompt={prompt}
              setPrompt={setPrompt}
              loading={loading}
              error={error}
              onGenerate={generateSong}
              onDemo={loadDemoSong}
            />
          </div>
          
          {/* Right Column - Song Display */}
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6">
            <SongDisplay
              song={song}
              loadingUSDC={loadingUSDC}
              onPrioritize={prioritizeWithUSDC}
            />
          </div>
        </div>
        
        {/* Playlist Section */}
        <div className="mb-12">
          <Playlist songs={playlist} />
        </div>
        
        {/* Tech Stack & Hackathon Compliance */}
        <div className="mb-12">
          <TechStack config={config} />
        </div>
      </div>
      
      {/* Config Panel */}
      <ConfigPanel config={config} />
    </main>
  );
}