'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

interface SongDisplayProps {
  song: any;
  loadingUSDC: boolean;
  onPrioritize: () => void;
  onAgentAnalysis?: () => void;
  autoMode?: boolean;
  isAlreadyProcessed?: boolean;
}

export default function SongDisplay({
  song,
  loadingUSDC,
  onPrioritize,
  onAgentAnalysis,
  autoMode = false,
  isAlreadyProcessed = false
}: SongDisplayProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration] = useState(30);
  const [agentAnalysis, setAgentAnalysis] = useState<any>(null);
  const [hasAnalyzed, setHasAnalyzed] = useState(false); // Nouvel état pour suivre l'analyse
  const animationRef = useRef<number | null>(null);

  // Réinitialiser l'analyse quand la chanson change
  useEffect(() => {
    setAgentAnalysis(null);
    setHasAnalyzed(false);
    setIsPlaying(false);
    setCurrentTime(0);
  }, [song]);

  // Simulation de l'agent AI d'analyse - UNE SEULE FOIS par chanson
  const analyzeSong = useCallback(() => {
    if (!song || hasAnalyzed) return; // Ne pas analyser si déjà fait
    
    const analysis = {
      songId: `${song.title}_${Date.now()}`,
      title: song.title,
      artist: song.artist,
      genre: song.genre,
      bpm: song.bpm,
      mood: song.mood,
      score: Math.floor(Math.random() * 30) + 70, // Score 70-100
      recommendation: 'RECOMMENDED_FOR_PRIORITY',
      reasoning: `Based on genre ${song.genre} at ${song.bpm} BPM with ${song.mood} mood`,
      estimatedEngagement: Math.floor(Math.random() * 30) + 60,
      suggestedPrice: '0.001 USDC',
      agentVersion: 'AI-Jukebox-Agent-v1.0',
      analyzedAt: new Date().toISOString()
    };
    
    setAgentAnalysis(analysis);
    setHasAnalyzed(true); // Marquer comme analysé
    
    if (onAgentAnalysis) {
      onAgentAnalysis();
    }
    
    return analysis;
  }, [song, hasAnalyzed, onAgentAnalysis]);

  // Analyser automatiquement en mode agentique - UNE SEULE FOIS
  useEffect(() => {
    if (autoMode && song && !hasAnalyzed && !isAlreadyProcessed) {
      const timer = setTimeout(() => {
        console.log('🤖 Agent: Analyzing song for the first time');
        analyzeSong();
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [autoMode, song, hasAnalyzed, isAlreadyProcessed, analyzeSong]);

  // Simulation de lecture
  useEffect(() => {
    if (isPlaying) {
      const startTime = Date.now() - currentTime * 1000;
      
      const updateProgress = () => {
        const elapsed = (Date.now() - startTime) / 1000;
        if (elapsed >= duration) {
          setCurrentTime(0);
          setIsPlaying(false);
        } else {
          setCurrentTime(elapsed);
          animationRef.current = requestAnimationFrame(updateProgress);
        }
      };
      
      animationRef.current = requestAnimationFrame(updateProgress);
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, currentTime, duration]);

  // Mode automatique (Agentic Commerce) - UNE SEULE FOIS
  useEffect(() => {
    if (autoMode && song && agentAnalysis && agentAnalysis.score > 80 && !isAlreadyProcessed) {
      console.log('🤖 Agent: Ready for auto-prioritization, waiting 3 seconds');
      
      const timer = setTimeout(() => {
        console.log('🤖 Agent: Auto-prioritizing now');
        onPrioritize();
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [autoMode, song, agentAnalysis, onPrioritize, isAlreadyProcessed]);

  const handlePlayClick = () => {
    setIsPlaying(!isPlaying);
  };

  const handleManualAnalysis = () => {
    if (!song) return;
    if (hasAnalyzed) {
      console.log('🔄 Song already analyzed, showing existing analysis');
      return;
    }
    console.log('🔍 Manual analysis triggered');
    analyzeSong();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = (currentTime / duration) * 100;

  if (!song) {
    return (
      <div className="h-full flex flex-col items-center justify-center py-12">
        <div className="text-6xl mb-6 text-gray-600">🎧</div>
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
          <div className="bg-green-900/30 p-2 rounded-lg">
            <span className="text-xl">2</span>
          </div>
          Agentic Song Analysis
        </h2>
        <p className="text-gray-500 text-center mb-2">
          Generate a song for AI agent analysis
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
        <div className="bg-green-900/30 p-2 rounded-lg">
          <span className="text-xl">2</span>
        </div>
        "{song.title}" - AI Agent Analysis
      </h2>
      
      <div className="space-y-6">
        {/* Already Processed Warning */}
        {isAlreadyProcessed && (
          <div className="p-4 bg-gradient-to-r from-blue-900/30 to-cyan-900/20 border-2 border-blue-700 rounded-xl animate-fade-in">
            <div className="flex items-center gap-3">
              <div className="bg-blue-900/50 p-3 rounded-lg">
                <span className="text-xl">🛡️</span>
              </div>
              <div>
                <h3 className="font-bold text-blue-300">Song Already Prioritized</h3>
                <p className="text-sm text-gray-300">
                  This song has already been prioritized with USDC to prevent duplicate transactions.
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Generate a new song to perform additional agentic commerce actions.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Agent AI Analysis Card */}
        {agentAnalysis && (
          <div className={`p-4 rounded-xl border-2 ${
            autoMode ? 'border-purple-700 bg-gradient-to-r from-purple-900/30 to-indigo-900/20' : 
            'border-blue-700 bg-gradient-to-r from-blue-900/30 to-cyan-900/20'
          }`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="bg-black/30 p-2 rounded-lg">
                  <span className="text-xl">🤖</span>
                </div>
                <div>
                  <h3 className="font-bold text-lg">Trustless AI Agent Analysis</h3>
                  <p className="text-xs text-gray-400">
                    {hasAnalyzed ? 'Analysis completed' : 'Analyzing...'}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-400">{agentAnalysis.score}/100</div>
                <div className="text-xs text-gray-400">AI Score</div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="p-3 bg-gray-800/50 rounded-lg">
                <p className="text-xs text-gray-400">Recommendation</p>
                <p className="font-semibold text-green-300">{agentAnalysis.recommendation}</p>
              </div>
              <div className="p-3 bg-gray-800/50 rounded-lg">
                <p className="text-xs text-gray-400">Engagement</p>
                <p className="font-semibold text-blue-300">{agentAnalysis.estimatedEngagement}%</p>
              </div>
            </div>
            
            <div className="mt-3 p-3 bg-black/30 rounded-lg">
              <p className="text-sm text-gray-300">{agentAnalysis.reasoning}</p>
            </div>
            
            {autoMode && agentAnalysis.score > 80 && !isAlreadyProcessed && (
              <div className="mt-3 p-3 bg-purple-900/30 border border-purple-700 rounded-lg">
                <div className="flex items-center gap-2">
                  <span className="text-lg">⚡</span>
                  <p className="text-sm font-semibold text-purple-300">
                    Agentic Mode: Auto-prioritizing in 3s...
                  </p>
                </div>
                <div className="w-full bg-purple-800/30 h-2 rounded-full mt-2">
                  <div 
                    className="h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-300"
                    style={{ width: '100%' }}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Manual Analysis Trigger */}
        {!agentAnalysis && !isAlreadyProcessed && (
          <div className="p-4 bg-gradient-to-r from-gray-900/30 to-gray-800/20 border-2 border-gray-700 rounded-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-gray-800/50 p-2 rounded-lg">
                  <span className="text-xl">🔍</span>
                </div>
                <div>
                  <h3 className="font-bold text-lg">Ready for Analysis</h3>
                  <p className="text-sm text-gray-400">
                    {autoMode ? 'Agent will analyze automatically...' : 'Click to analyze'}
                  </p>
                </div>
              </div>
              {!autoMode && (
                <button
                  onClick={handleManualAnalysis}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 rounded-lg font-medium transition-all"
                >
                  Analyze with AI Agent
                </button>
              )}
            </div>
          </div>
        )}

        {/* Song Metadata */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-gray-800/50 rounded-xl">
            <h4 className="font-semibold text-gray-300 mb-3">Song Metadata</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">Title</span>
                <span className="font-medium">{song.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Artist</span>
                <span className="font-medium">{song.artist}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Genre</span>
                <span className="font-medium">{song.genre}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">BPM</span>
                <span className="font-medium">{song.bpm}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Mood</span>
                <span className="font-medium">{song.mood}</span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-gray-800/50 rounded-xl">
            <h4 className="font-semibold text-gray-300 mb-3">Arc Settlement Layer</h4>
            <div className="space-y-3">
              <div className="p-3 bg-gray-900/50 rounded-lg">
                <p className="text-xs text-gray-400">Network</p>
                <p className="font-semibold text-purple-300">Arc Testnet</p>
              </div>
              <div className="p-3 bg-gray-900/50 rounded-lg">
                <p className="text-xs text-gray-400">Gas Token</p>
                <p className="font-semibold text-green-300">USDC Native</p>
              </div>
              <div className="p-3 bg-gray-900/50 rounded-lg">
                <p className="text-xs text-gray-400">Finality</p>
                <p className="font-semibold text-blue-300">&lt; 1 second</p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-gray-800/50 rounded-xl">
            <h4 className="font-semibold text-gray-300 mb-3">Circle Integration</h4>
            <div className="space-y-3">
              <div className="p-3 bg-gray-900/50 rounded-lg">
                <p className="text-xs text-gray-400">Payment Method</p>
                <p className="font-semibold">USDC Micropayments</p>
              </div>
              <div className="p-3 bg-gray-900/50 rounded-lg">
                <p className="text-xs text-gray-400">Wallet Type</p>
                <p className="font-semibold">Developer-Controlled</p>
              </div>
              <div className="p-3 bg-gray-900/50 rounded-lg">
                <p className="text-xs text-gray-400">Amount</p>
                <p className="font-semibold text-yellow-300">0.001 USDC</p>
              </div>
            </div>
          </div>
        </div>

        {/* Audio Simulation */}
        <div className="p-4 bg-gray-800/50 rounded-xl border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${isPlaying ? 'bg-yellow-900/30' : 'bg-blue-900/30'}`}>
                <span className="text-xl">🎵</span>
              </div>
              <div>
                <h4 className="font-semibold">Audio Preview Simulation</h4>
                <p className="text-xs text-gray-400">Agent analyzes audio characteristics</p>
              </div>
            </div>
            <button
              onClick={handlePlayClick}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
                isPlaying
                  ? 'bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700'
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
              }`}
            >
              {isPlaying ? (
                <>
                  <span className="text-lg">⏸️</span>
                  Pause
                </>
              ) : (
                <>
                  <span className="text-lg">▶️</span>
                  Simulate Playback
                </>
              )}
            </button>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-1 h-16">
              {Array.from({ length: 16 }).map((_, i) => (
                <div
                  key={i}
                  className="w-2 rounded bg-gradient-to-t from-blue-400 to-purple-400"
                  style={{
                    height: isPlaying 
                      ? `${Math.sin(i * 0.5 + currentTime * 8) * 20 + 24}px`
                      : '4px',
                    opacity: isPlaying ? 0.8 : 0.3,
                  }}
                />
              ))}
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs text-gray-400">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Agentic Commerce Decision */}
        <div className={`p-4 rounded-xl border-2 ${
          autoMode ? 
            'border-purple-700 bg-gradient-to-r from-purple-900/20 to-indigo-900/10' : 
            'border-green-700 bg-gradient-to-r from-green-900/20 to-emerald-900/10'
        } ${isAlreadyProcessed ? 'opacity-80' : ''}`}>
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-black/30 p-2 rounded-lg">
              <span className="text-xl">🤖</span>
            </div>
            <div>
              <h3 className="font-bold text-lg">Agentic Commerce Decision</h3>
              <p className="text-sm text-gray-400">
                {autoMode ? 'AI Agent autonomously manages commerce flow' : 'Manual commerce decision'}
              </p>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 bg-gray-800/50 rounded-lg text-center">
                <p className="text-xs text-gray-400">Step 1</p>
                <p className="font-semibold">AI Analysis</p>
                <p className="text-xs text-gray-500 mt-1">{hasAnalyzed ? '✅ Completed' : 'Pending'}</p>
              </div>
              <div className="p-3 bg-gray-800/50 rounded-lg text-center">
                <p className="text-xs text-gray-400">Step 2</p>
                <p className="font-semibold">Agent Decision</p>
                <p className="text-xs text-gray-500 mt-1">
                  {autoMode ? '🤖 Autonomous' : '👤 Manual'}
                </p>
              </div>
              <div className="p-3 bg-gray-800/50 rounded-lg text-center">
                <p className="text-xs text-gray-400">Step 3</p>
                <p className="font-semibold">Arc Settlement</p>
                <p className="text-xs text-gray-500 mt-1">USDC on Arc blockchain</p>
              </div>
            </div>
            
            <button
              onClick={onPrioritize}
              disabled={loadingUSDC || isAlreadyProcessed || !hasAnalyzed}
              className={`w-full p-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-3 ${
                loadingUSDC
                  ? 'bg-gray-600 cursor-not-allowed'
                  : isAlreadyProcessed
                  ? 'bg-gray-700 cursor-not-allowed opacity-70'
                  : !hasAnalyzed
                  ? 'bg-gray-600 cursor-not-allowed'
                  : autoMode 
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700' 
                    : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700'
              } active:scale-[0.98]`}
            >
              {loadingUSDC ? (
                <>
                  <div className="animate-spin h-6 w-6 border-2 border-white border-t-transparent rounded-full" />
                  Processing USDC Payment...
                </>
              ) : isAlreadyProcessed ? (
                <>
                  <span className="text-xl">✅</span>
                  Already Prioritized
                  <span className="text-xs bg-blue-500/20 px-2 py-1 rounded text-blue-300">
                    No Duplicates
                  </span>
                </>
              ) : !hasAnalyzed ? (
                <>
                  <span className="text-xl">🔍</span>
                  Analyze First
                  <span className="text-xs bg-gray-500/20 px-2 py-1 rounded text-gray-300">
                    Requires AI Analysis
                  </span>
                </>
              ) : (
                <>
                  <span className="text-xl">🤖</span>
                  {autoMode ? 'Agent: Auto-Prioritize' : 'Prioritize with'} 0.001 USDC
                  <span className={`text-xs px-2 py-1 rounded ${autoMode ? 
                    'bg-purple-500/20 text-purple-300' : 'bg-green-500/20 text-green-300'
                  }`}>
                    {autoMode ? 'Autonomous' : 'Manual'}
                  </span>
                </>
              )}
            </button>
            
            {/* Analysis Status */}
            {!hasAnalyzed && !isAlreadyProcessed && (
              <div className="p-3 bg-yellow-900/20 border border-yellow-800 rounded-lg">
                <div className="flex items-center gap-2">
                  <span className="text-lg">⚠️</span>
                  <p className="text-sm text-yellow-300">
                    {autoMode ? 'Agent analyzing... (1s delay)' : 'Click "Analyze with AI Agent" first'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}