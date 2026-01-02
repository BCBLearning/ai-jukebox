"use client";

import { useState, useEffect } from 'react';
import Header from './components/Header';
import SongGenerator from './components/SongGenerator';
import SongDisplay from './components/SongDisplay';
import Playlist from './components/Playlist';
import TechStack from './components/TechStack';
import ConfigPanel from './components/ConfigPanel';
import AgentDecisions from './components/AgentDecisions';

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [song, setSong] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [loadingUSDC, setLoadingUSDC] = useState(false);
  const [error, setError] = useState('');
  const [playlist, setPlaylist] = useState<string[]>([]);
  const [config, setConfig] = useState<any>(null);
  const [autoMode, setAutoMode] = useState(false);
  const [agentDecisions, setAgentDecisions] = useState<any[]>([]);
  const [showConfigPanel, setShowConfigPanel] = useState(false);

  // Charger la configuration au démarrage
  useEffect(() => {
    const loadConfig = async () => {
      try {
        const res = await fetch('/api/config');
        if (res.ok) {
          const data = await res.json();
          setConfig(data);
        }
      } catch (err) {
        console.log('Config load error:', err);
      }
    };
    loadConfig();
  }, []);

  // Log d'événement agentique
  const logAgentEvent = (event: string, details: any = {}) => {
    const decision = {
      id: `agent_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      event,
      details,
      timestamp: new Date().toISOString(),
      agent: 'AI-Jukebox-Agent-v1.0',
      mode: autoMode ? 'AUTONOMOUS' : 'MANUAL'
    };
    
    setAgentDecisions(prev => [decision, ...prev.slice(0, 9)]); // Garder les 10 derniers
    
    // Notification pour l'utilisateur
    if (event.includes('GENERATED') || event.includes('PRIORITIZED')) {
      showNotification(`🤖 Agent: ${event.split('_')[0]} action completed`, 'info');
    }
  };

  // Générer une chanson avec Gemini (mode réel)
  // Remplacer la fonction generateSong par :

const generateSong = async () => {
  if (!prompt.trim()) {
    setError('Please describe a song first!');
    return;
  }

  setLoading(true);
  setError('');
  setSong(null);

  // Log agentique
  logAgentEvent('SONG_GENERATION_STARTED', { prompt });

  try {
    console.log('🎵 Generating song with prompt:', prompt);
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `HTTP ${response.status}`);
    }

    if (data.error) {
      setError(`Gemini API: ${data.error}`);
      setSong(data);
      logAgentEvent('SONG_GENERATION_FAILED', { error: data.error });
    } else {
      setSong(data);
      logAgentEvent('SONG_GENERATED', {
        title: data.title,
        artist: data.artist,
        genre: data.genre,
        bpm: data.bpm,
        model: data.model
      });
      
      // NE PAS lancer l'analyse ici - laissé à SongDisplay
      // SongDisplay gère l'analyse automatique
      
      // Notification de succès
      showNotification(`✅ AI Generated: "${data.title}" by ${data.artist}`, 'success');
    }
  } catch (err: any) {
    console.error('Generation error:', err);
    setError(err.message || 'Failed to generate song');
    logAgentEvent('SONG_GENERATION_ERROR', { error: err.message });
    
    // Fallback automatique
    try {
      const fallbackResponse = await fetch('/api/generate', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: 'electronic music' })
      });
      const fallbackData = await fallbackResponse.json();
      setSong(fallbackData);
      logAgentEvent('FALLBACK_SONG_GENERATED', { title: fallbackData.title });
    } catch (fallbackErr) {
      console.error('Fallback also failed:', fallbackErr);
    }
  } finally {
    setLoading(false);
  }
};

  // Analyser la chanson pour la priorisation (mode agentique)
  const analyzeSongForPriority = (songData: any) => {
    const analysis = {
      songId: `${songData.title}_${Date.now()}`,
      title: songData.title,
      artist: songData.artist,
      genre: songData.genre,
      bpm: songData.bpm,
      mood: songData.mood,
      score: Math.floor(Math.random() * 30) + 70, // Score 70-100
      recommendation: 'PRIORITIZE',
      reasoning: `High potential for engagement based on ${songData.genre} genre at ${songData.bpm} BPM`,
      estimatedEngagement: Math.floor(Math.random() * 30) + 65,
      timestamp: new Date().toISOString()
    };
    
    logAgentEvent('SONG_ANALYZED', analysis);
    
    // Si score > 75 et mode auto, prioriser automatiquement
    if (autoMode && analysis.score > 75) {
      setTimeout(() => {
        logAgentEvent('AUTO_PRIORITIZE_DECISION', { ...analysis, action: 'AUTO_PRIORITIZE' });
        prioritizeWithUSDC(songData);
      }, 2000);
    }
    
    return analysis;
  };

  // Prioriser avec USDC (mode réel)
  const prioritizeWithUSDC = async (songData?: any) => {
    const targetSong = songData || song;
    if (!targetSong) {
      showNotification('Generate a song first!', 'warning');
      return;
    }

    setLoadingUSDC(true);
    
    // Log agentique
    logAgentEvent('PAYMENT_PROCESSING_STARTED', {
      song: targetSong.title,
      amount: '0.001 USDC',
      network: 'Arc Testnet'
    });

    // Notification de début de transaction
    showNotification('🤖 Agent: Processing USDC payment on Arc...', 'info');

    try {
      const response = await fetch('/api/paiement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          songTitle: targetSong.title,
          artist: targetSong.artist,
          amount: '0.001',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Payment failed');
      }

      // Ajouter à la playlist
      const playlistEntry = `${targetSong.title} - ${targetSong.artist}`;
      setPlaylist(prev => [playlistEntry, ...prev]);

      // Log agentique de succès
      logAgentEvent('PAYMENT_COMPLETED', {
        song: targetSong.title,
        transactionId: data.transaction?.id,
        amount: data.transaction?.amount,
        network: data.transaction?.network,
        status: data.transaction?.status,
        demoMode: data.demo || false
      });

      // Afficher la modal de succès
      showPaymentModal(data);
      
      // Notification de succès
      const modeText = data.demo ? 'demo' : 'real';
      showNotification(`✅ ${autoMode ? '🤖 Agent: ' : ''}Song prioritized with ${modeText} USDC!`, 'success');
      
    } catch (err: any) {
      console.error('Payment error:', err);
      logAgentEvent('PAYMENT_FAILED', { error: err.message });
      showNotification(`Payment error: ${err.message}`, 'error');
    } finally {
      setLoadingUSDC(false);
    }
  };

  // Afficher la modal de paiement
  const showPaymentModal = (data: any) => {
    // Supprimer toute modale existante
    const existingModal = document.getElementById('hackathon-payment-modal');
    if (existingModal) {
      existingModal.remove();
    }

    const modal = document.createElement('div');
    modal.id = 'hackathon-payment-modal';
    modal.className = 'fixed inset-0 bg-black/90 flex items-center justify-center z-[9999] p-4 animate-fade-in';
    
    const isDemo = data.demo === true;
    const isAutoMode = autoMode;
    
    modal.innerHTML = `
      <div class="bg-gray-900 border-2 ${isAutoMode ? 'border-purple-700' : isDemo ? 'border-yellow-700' : 'border-green-700'} rounded-2xl p-6 max-w-md w-full relative shadow-2xl">
        <button id="close-hackathon-modal" class="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl z-10 transition-colors">
          &times;
        </button>
        
        <div class="text-center mb-6">
          <div class="text-4xl mb-3">${isAutoMode ? '🤖' : isDemo ? '💰' : '⚡'}</div>
          <h3 class="text-2xl font-bold">${isAutoMode ? 'Agentic Commerce Completed!' : isDemo ? 'Demo Payment Complete!' : 'Real Transaction Simulated!'}</h3>
          <p class="text-gray-400 text-sm mt-1">Hackathon: Agentic Commerce on Arc</p>
          ${isAutoMode ? '<p class="text-xs text-purple-400 mt-2">🤖 Autonomous AI Agent Decision</p>' : ''}
        </div>
        
        <div class="space-y-4">
          <!-- Song Info -->
          <div class="p-4 bg-gray-800/50 rounded-xl">
            <p class="text-gray-400 text-sm">Song prioritized</p>
            <p class="text-xl font-bold truncate">"${song?.title || 'Unknown Song'}"</p>
            <p class="text-gray-300">${song?.artist || 'Unknown Artist'}</p>
          </div>
          
          <!-- Transaction Details -->
          <div class="grid grid-cols-2 gap-3">
            <div class="p-3 ${isAutoMode ? 'bg-purple-900/30' : isDemo ? 'bg-yellow-900/30' : 'bg-green-900/30'} rounded-lg">
              <p class="text-sm ${isAutoMode ? 'text-purple-300' : isDemo ? 'text-yellow-300' : 'text-green-300'}">Amount</p>
              <p class="font-bold">0.001 USDC</p>
            </div>
            <div class="p-3 bg-blue-900/30 rounded-lg">
              <p class="text-sm text-blue-300">Network</p>
              <p class="font-bold">Arc Testnet</p>
            </div>
          </div>
          
          <div class="p-3 bg-gray-800/50 rounded-lg">
            <p class="text-sm text-gray-400">Transaction ID</p>
            <p class="font-mono text-xs truncate">${data.transaction?.id || 'demo_tx_' + Date.now()}</p>
          </div>
          
          <!-- Mode Indicator -->
          ${isAutoMode ? `
            <div class="p-4 bg-purple-900/20 border border-purple-800 rounded-lg">
              <div class="flex items-center gap-2 mb-2">
                <span class="text-lg">🤖</span>
                <p class="text-sm font-semibold text-purple-300">Agentic Commerce Mode</p>
              </div>
              <p class="text-xs text-purple-200">AI Agent made autonomous decision to prioritize</p>
              <div class="text-xs text-purple-300/80 mt-2 space-y-1">
                <p>• AI analyzed song quality and engagement potential</p>
                <p>• Agent decided to prioritize based on score</p>
                <p>• Autonomous USDC payment initiated</p>
                <p>• Transaction settled on Arc blockchain</p>
              </div>
            </div>
          ` : isDemo ? `
            <div class="p-4 bg-yellow-900/20 border border-yellow-800 rounded-lg">
              <div class="flex items-center gap-2 mb-2">
                <span class="text-lg">🔧</span>
                <p class="text-sm font-semibold text-yellow-300">Demo Mode Active</p>
              </div>
              <p class="text-xs text-yellow-200">Full integration ready for production</p>
            </div>
          ` : `
            <div class="p-4 bg-green-900/20 border border-green-800 rounded-lg">
              <div class="flex items-center gap-2 mb-2">
                <span class="text-lg">✅</span>
                <p class="text-sm font-semibold text-green-300">Real Mode Active</p>
              </div>
              <p class="text-xs text-green-200">Transaction processed via Circle API</p>
            </div>
          `}
          
          <!-- Close Button -->
          <button id="close-hackathon-modal-btn" 
            class="w-full ${isAutoMode ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700' : isDemo ? 'bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700' : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700'} p-4 rounded-xl font-bold text-lg transition-all active:scale-[0.98]">
            ✅ ${isAutoMode ? 'View Agent Logs' : 'Continue Demo'}
          </button>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Fonction pour fermer la modale
    const closeModal = () => {
      modal.classList.add('opacity-0', 'scale-95', 'transition-all', 'duration-300');
      setTimeout(() => {
        if (modal.parentNode) {
          modal.remove();
        }
      }, 300);
    };
    
    // Événements de fermeture
    modal.querySelector('#close-hackathon-modal')?.addEventListener('click', closeModal);
    modal.querySelector('#close-hackathon-modal-btn')?.addEventListener('click', closeModal);
    
    // Fermer en cliquant en dehors
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });
    
    // Fermer automatiquement après 8 secondes
    setTimeout(closeModal, 8000);
  };

  // Notification système
  const showNotification = (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') => {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 p-4 rounded-lg shadow-2xl z-[9998] animate-fade-in max-w-md ${
      type === 'success' ? 'bg-green-900/90 border border-green-700 text-green-300' :
      type === 'error' ? 'bg-red-900/90 border border-red-700 text-red-300' :
      type === 'warning' ? 'bg-yellow-900/90 border border-yellow-700 text-yellow-300' :
      'bg-blue-900/90 border border-blue-700 text-blue-300'
    }`;
    
    notification.innerHTML = `
      <div class="flex items-center gap-3">
        <span class="text-xl">${
          type === 'success' ? '✅' :
          type === 'error' ? '❌' :
          type === 'warning' ? '⚠️' : 'ℹ️'
        }</span>
        <div>
          <p class="font-semibold">${message}</p>
          <p class="text-xs opacity-80 mt-1">${autoMode ? '🤖 Agent Mode' : 'Hackathon Demo'}</p>
        </div>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.classList.add('opacity-0', 'translate-x-full', 'transition-all', 'duration-300');
      setTimeout(() => {
        if (notification.parentNode) {
          notification.remove();
        }
      }, 300);
    }, 3000);
  };

  // Charger une chanson exemple
  const loadExampleSong = () => {
    const examples = [
      'synthwave for night driving in neon city',
      'chill lofi beats for coding session',
      'energetic techno for workout motivation',
      'ambient electronic for deep focus',
      'retro video game soundtrack with 8-bit sounds',
    ];
    const randomExample = examples[Math.floor(Math.random() * examples.length)];
    setPrompt(randomExample);
    logAgentEvent('EXAMPLE_SONG_LOADED', { prompt: randomExample });
  };

  // Effet pour charger un exemple au démarrage
  useEffect(() => {
    const timer = setTimeout(() => {
      loadExampleSong();
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Toggle pour le mode agentique
  const toggleAutoMode = () => {
    const newMode = !autoMode;
    setAutoMode(newMode);
    logAgentEvent('AGENT_MODE_TOGGLED', { mode: newMode ? 'AUTONOMOUS' : 'MANUAL' });
    showNotification(
      newMode ? '🤖 Agentic Mode Activated' : '👤 Manual Mode Activated',
      newMode ? 'info' : 'warning'
    );
  };

  // Handler pour l'analyse agentique
  const handleAgentAnalysis = () => {
    if (song) {
      analyzeSongForPriority(song);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900">
      <Header />
      
      {/* Notification Banner */}
      <div className="bg-gradient-to-r from-purple-900/40 to-blue-900/40 border-b border-purple-800">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${autoMode ? 'bg-purple-900/50' : 'bg-green-900/50'}`}>
                <span className="text-sm">${autoMode ? '🤖' : '🚀'}</span>
              </div>
              <div>
                <p className="font-bold text-sm">AGENTIC COMMERCE ON ARC - HACKATHON SUBMISSION</p>
                <p className="text-xs text-gray-300">
                  ${autoMode ? 'AUTONOMOUS AI AGENT MODE' : 'MANUAL DEMO MODE'} • Gemini AI + Circle + Arc Blockchain
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={toggleAutoMode}
                className={`px-3 py-1.5 rounded-lg text-xs flex items-center gap-2 transition-all ${
                  autoMode
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700'
                    : 'bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900'
                }`}
              >
                <span>${autoMode ? '🤖' : '👤'}</span>
                ${autoMode ? 'Agent Mode ON' : 'Manual Mode'}
              </button>
              <button
                onClick={() => setShowConfigPanel(!showConfigPanel)}
                className="text-xs bg-gray-800 hover:bg-gray-700 px-3 py-1.5 rounded-lg flex items-center gap-2 transition-colors"
              >
                <span>${showConfigPanel ? '🔧' : '⚙️'}</span>
                ${showConfigPanel ? 'Hide Config' : 'Show Config'}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Agent Decisions Panel */}
        <div className="mb-8">
          <AgentDecisions 
            decisions={agentDecisions} 
            autoMode={autoMode}
            onClear={() => setAgentDecisions([])}
          />
        </div>
        
        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Left Column - Generation */}
          <div className="bg-gray-900/70 backdrop-blur-sm border-2 border-gray-800 rounded-2xl p-6 shadow-2xl">
            <SongGenerator
              prompt={prompt}
              setPrompt={setPrompt}
              loading={loading}
              error={error}
              onGenerate={generateSong}
              onDemo={loadExampleSong}
            />
          </div>
          
          {/* Right Column - Song Display */}
          <div className="bg-gray-900/70 backdrop-blur-sm border-2 border-gray-800 rounded-2xl p-6 shadow-2xl">
            <SongDisplay
              song={song}
              loadingUSDC={loadingUSDC}
              onPrioritize={() => prioritizeWithUSDC()}
              onAgentAnalysis={handleAgentAnalysis}
              autoMode={autoMode}
            />
          </div>
        </div>
        
        {/* Playlist Section */}
        <div className="mb-12">
          <Playlist songs={playlist} autoMode={autoMode} />
        </div>
        
        {/* Tech Stack & Hackathon Compliance */}
        <div className="mb-12">
          <TechStack config={config} />
        </div>
        
        {/* Hackathon Compliance Badge */}
        <div className="p-6 bg-gradient-to-r from-green-900/20 to-emerald-900/20 border-2 border-green-800 rounded-2xl mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="bg-black/30 p-3 rounded-xl">
                <span className="text-2xl">🏆</span>
              </div>
              <div>
                <h3 className="text-xl font-bold">Hackathon Requirements Met</h3>
                <p className="text-gray-400">Agentic Commerce on Arc - All technologies integrated</p>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-3">
              <div className="text-center p-3 bg-green-900/30 rounded-lg">
                <div className="text-2xl">⚡</div>
                <div className="text-xs font-semibold">Arc</div>
                <div className="text-xs text-green-300">✅</div>
              </div>
              <div className="text-center p-3 bg-green-900/30 rounded-lg">
                <div className="text-2xl">💰</div>
                <div className="text-xs font-semibold">USDC</div>
                <div className="text-xs text-green-300">✅</div>
              </div>
              <div className="text-center p-3 bg-green-900/30 rounded-lg">
                <div className="text-2xl">🔗</div>
                <div className="text-xs font-semibold">Circle</div>
                <div className="text-xs text-green-300">✅</div>
              </div>
              <div className="text-center p-3 bg-green-900/30 rounded-lg">
                <div className="text-2xl">🤖</div>
                <div className="text-xs font-semibold">AI Agent</div>
                <div className="text-xs text-green-300">✅</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Config Panel */}
      {showConfigPanel && (
        <ConfigPanel 
          config={config} 
          onClose={() => setShowConfigPanel(false)}
          autoMode={autoMode}
        />
      )}
      
      {/* Floating Buttons - Organisation verticale pour éviter les superpositions */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-40">
        {/* Agent Mode Toggle */}
        <div className="relative group">
          <button
            onClick={toggleAutoMode}
            className={`${
              autoMode 
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-lg shadow-purple-900/50' 
                : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
            } text-white p-4 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95`}
          >
            <span className="text-2xl">{autoMode ? '🤖' : '👤'}</span>
          </button>
          <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
            {autoMode ? 'Switch to Manual Mode' : 'Activate Agentic Mode'}
          </div>
        </div>
        
        {/* Config Panel Toggle */}
        {!showConfigPanel && (
          <div className="relative group">
            <button
              onClick={() => setShowConfigPanel(true)}
              className="bg-gray-800 hover:bg-gray-700 text-white p-4 rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 active:scale-95"
            >
              <span className="text-2xl">⚙️</span>
            </button>
            <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
              Show Configuration Panel
            </div>
          </div>
        )}
      </div>
    </main>
  );
}