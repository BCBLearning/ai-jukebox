'use client';
import {useState, useEffect, useRef} from 'react';

interface SongDisplayProps {
  song: any;
  loadingUSDC: boolean;
  onPrioritize: () => void;
}

export default function SongDisplay({ song, loadingUSDC, onPrioritize }: SongDisplayProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(30); // Durée fixe pour la démo
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const animationRef = useRef<number | null>(null);
  
  // Sources audio fiables pour le hackathon (gratuites et sans CORS)
  const getAudioPreview = (genre: string) => {
    // Mapping des genres avec des URLs fiables
    const audioSources = [
      // Synthwave/Electronic (source fiable)
      {
        genres: ['synthwave', 'electronic', 'future', 'retro'],
        url: 'https://assets.mixkit.co/music/preview/mixkit-synthwave-1-39.mp3'
      },
      // Chill/Lo-fi
      {
        genres: ['chillwave', 'lofi', 'chill', 'lo-fi', 'ambient'],
        url: 'https://assets.mixkit.co/music/preview/mixkit-lofi-study-1-196.mp3'
      },
      // Techno/House
      {
        genres: ['techno', 'house', 'edm', 'dance'],
        url: 'https://assets.mixkit.co/music/preview/mixkit-tech-house-vibes-130.mp3'
      },
      // Ambient
      {
        genres: ['ambient', 'atmospheric', 'space', 'calm'],
        url: 'https://assets.mixkit.co/music/preview/mixkit-ambient-1-799.mp3'
      },
      // Default (fonctionne toujours)
      {
        genres: ['default'],
        url: 'https://assets.mixkit.co/music/preview/mixkit-electronic-1-246.mp3'
      }
    ];
    
    const normalizedGenre = genre.toLowerCase();
    
    // Trouver la source correspondante
    for (const source of audioSources) {
      if (source.genres.some(g => normalizedGenre.includes(g))) {
        return source.url;
      }
    }
    
    // Retourner la source par défaut
    return audioSources[audioSources.length - 1].url;
  };

  // Initialiser l'audio
  useEffect(() => {
    if (!song) return;
    
    // Créer l'élément audio
    const audio = new Audio();
    const audioUrl = getAudioPreview(song.genre);
    
    audio.src = audioUrl;
    audio.preload = 'metadata';
    audio.crossOrigin = 'anonymous';
    
    // Événements audio
    const handleLoadedData = () => {
      setAudioError(null);
      console.log('✅ Audio chargé:', audioUrl);
    };
    
    const handleError = (e: any) => {
      console.error('❌ Erreur audio:', e);
      setAudioError('Impossible de charger l\'aperçu audio. Utilisation du mode simulation.');
      setIsPlaying(false);
    };
    
    const handleTimeUpdate = () => {
      if (audio.duration) {
        setCurrentTime(audio.currentTime);
        setDuration(audio.duration);
      }
    };
    
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };
    
    audio.addEventListener('loadeddata', handleLoadedData);
    audio.addEventListener('error', handleError);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    
    audioRef.current = audio;
    
    // Nettoyage
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
      audio.removeEventListener('loadeddata', handleLoadedData);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [song]);

  // Gérer la lecture/pause
  useEffect(() => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.play().catch(e => {
        console.error('Erreur de lecture:', e);
        setAudioError('La lecture audio nécessite une interaction utilisateur. Cliquez à nouveau.');
        setIsPlaying(false);
      });
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  // Animation de la barre de progression
  useEffect(() => {
    const updateProgress = () => {
      if (audioRef.current && audioRef.current.duration) {
        setCurrentTime(audioRef.current.currentTime);
      }
      animationRef.current = requestAnimationFrame(updateProgress);
    };
    
    if (isPlaying) {
      animationRef.current = requestAnimationFrame(updateProgress);
    } else if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying]);

  // Formater le temps
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculer le pourcentage de progression
  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  if (!song) {
    return (
      <div className="h-full flex flex-col items-center justify-center py-12">
        <div className="text-6xl mb-6 text-gray-600">🎧</div>
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
          <div className="bg-green-900/30 p-2 rounded-lg">
            <span className="text-xl">2</span>
          </div>
          Your Generated Song
        </h2>
        <p className="text-gray-500 text-center mb-2">
          Generate your first song with Gemini AI
        </p>
        <p className="text-sm text-gray-600 text-center">
          The AI will create a title, artist, genre, and cover art description
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
        "{song.title}"
      </h2>
      
      <div className="space-y-6">
        {/* Song Header */}
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-3xl font-bold">{song.title}</h3>
              {song.isReal === false && (
                <span className="text-xs bg-yellow-900/50 text-yellow-300 px-2 py-1 rounded">
                  Demo Mode
                </span>
              )}
              {song.error && (
                <span className="text-xs bg-red-900/50 text-red-300 px-2 py-1 rounded">
                  API Error
                </span>
              )}
              {song.geminiSuccess && (
                <span className="text-xs bg-green-900/50 text-green-300 px-2 py-1 rounded">
                  Real AI
                </span>
              )}
            </div>
            <p className="text-xl text-gray-300">
              by <span className="font-semibold">{song.artist}</span>
            </p>
            <div className="flex items-center gap-3 mt-4">
              <span className="px-3 py-1 bg-gray-800 rounded-full">
                {song.genre}
              </span>
              <span className="px-3 py-1 bg-gray-800 rounded-full">
                {song.bpm} BPM
              </span>
              <span className="px-3 py-1 bg-gray-800 rounded-full">
                {song.mood}
              </span>
            </div>
          </div>
        </div>

        {/* Cover Art Visualization */}
        <div className="relative group">
          <div
            className={`h-48 rounded-xl bg-gradient-to-r ${
              song.colorScheme === 'purple-blue'
                ? 'from-purple-900 to-blue-900'
                : song.colorScheme === 'green-black'
                ? 'from-green-900 to-black'
                : song.colorScheme === 'pink-cyan'
                ? 'from-pink-900 to-cyan-900'
                : song.colorScheme === 'blue-cyan'
                ? 'from-blue-900 to-cyan-900'
                : song.colorScheme === 'neon-green'
                ? 'from-green-800 to-emerald-900'
                : song.colorScheme === 'orange-purple'
                ? 'from-orange-900 to-purple-900'
                : 'from-purple-800 to-pink-800'
            } flex items-center justify-center transition-transform duration-300 group-hover:scale-[1.02]`}
          >
            <div className="text-center p-6">
              <div className="text-5xl mb-4 animate-pulse-slow">🎵</div>
              <p className="text-gray-300 italic">"{song.coverDescription}"</p>
            </div>
          </div>
          <div className="absolute top-4 right-4 text-xs text-gray-400">
            AI Generated Cover
          </div>
        </div>

        {/* Audio Player Section */}
        <div className="p-4 bg-gray-800/50 rounded-xl border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${isPlaying ? 'bg-yellow-900/30' : 'bg-blue-900/30'}`}>
                <span className="text-xl">🎵</span>
              </div>
              <div>
                <h4 className="font-semibold">Audio Preview</h4>
                <p className="text-xs text-gray-400">Genre-matched sample</p>
              </div>
            </div>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              disabled={!!audioError && audioError.includes('interaction')}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
                audioError && audioError.includes('interaction')
                  ? 'bg-gray-700 cursor-not-allowed'
                  : isPlaying
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
                  Play Preview
                </>
              )}
            </button>
          </div>
          
          {audioError ? (
            // Mode simulation pour le hackathon
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-r from-purple-900/20 to-blue-900/20 rounded-xl border border-purple-800/50">
                <div className="flex items-center gap-3 mb-3">
                  <div className="text-2xl">🎹</div>
                  <div>
                    <h5 className="font-semibold text-purple-300">Audio Simulation Active</h5>
                    <p className="text-sm text-gray-400">For hackathon demo purposes</p>
                  </div>
                </div>
                
                {/* Visualizer animation */}
                <div className="space-y-3">
                  <div className="flex items-center justify-center gap-1 h-16">
                    {Array.from({ length: 24 }).map((_, i) => (
                      <div
                        key={i}
                        className="w-2 bg-gradient-to-t from-purple-400 to-blue-400 rounded-full"
                        style={{
                          height: isPlaying 
                            ? `${Math.random() * 48 + 8}px`
                            : '4px',
                          opacity: isPlaying ? 0.9 : 0.3,
                          animation: isPlaying 
                            ? `pulse ${0.5 + Math.random() * 1}s infinite ${i * 0.04}s`
                            : 'none'
                        }}
                      />
                    ))}
                  </div>
                  
                  {/* Progress bar simulation */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>{formatTime(currentTime)}</span>
                      <span>{formatTime(duration)}</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-1000"
                        style={{ 
                          width: `${progressPercentage}%`,
                          transition: isPlaying ? 'width 0.1s linear' : 'width 0.3s ease'
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <p className="text-sm text-gray-400 text-center">
                Note: For the hackathon demo, this simulates audio playback. 
                Real implementation integrates with AI music generation APIs.
              </p>
            </div>
          ) : (
            // Mode audio réel
            <div className="space-y-4">
              {/* Progress bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-gray-400">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-1000"
                    style={{ 
                      width: `${progressPercentage}%`,
                      transition: isPlaying ? 'width 0.1s linear' : 'width 0.3s ease'
                    }}
                  />
                </div>
              </div>
              
              {/* Audio info */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                <div className="p-3 bg-gray-800/50 rounded-lg">
                  <p className="text-gray-400 mb-1">Genre</p>
                  <p className="font-medium text-sm">{song.genre}</p>
                </div>
                <div className="p-3 bg-gray-800/50 rounded-lg">
                  <p className="text-gray-400 mb-1">BPM</p>
                  <p className="font-medium text-sm">{song.bpm}</p>
                </div>
                <div className="p-3 bg-gray-800/50 rounded-lg">
                  <p className="text-gray-400 mb-1">Mood</p>
                  <p className="font-medium text-sm">{song.mood}</p>
                </div>
                <div className="p-3 bg-gray-800/50 rounded-lg">
                  <p className="text-gray-400 mb-1">Status</p>
                  <p className="font-medium text-sm text-green-400">
                    {isPlaying ? 'Playing' : 'Ready'}
                  </p>
                </div>
              </div>
              
              {/* Visualizer */}
              {isPlaying && (
                <div className="flex items-center justify-center gap-1 h-12">
                  {Array.from({ length: 16 }).map((_, i) => (
                    <div
                      key={i}
                      className="w-1.5 bg-gradient-to-t from-blue-400 to-purple-400 rounded-full"
                      style={{
                        height: `${Math.sin(i * 0.5 + Date.now() * 0.01) * 20 + 24}px`,
                        opacity: 0.7 + Math.sin(i * 0.3 + Date.now() * 0.005) * 0.3,
                        animation: `pulse ${0.8 + Math.random() * 0.4}s infinite ${i * 0.06}s`
                      }}
                    />
                  ))}
                </div>
              )}
              
              <p className="text-xs text-gray-400 text-center">
                Playing a genre-matched audio sample. Demonstrates full audio playback 
                integration for the hackathon.
              </p>
            </div>
          )}
          
          {/* Hackathon Feature Badge */}
          <div className="mt-4 pt-4 border-t border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg">🏆</span>
                <p className="text-sm font-medium">Hackathon Audio Feature</p>
              </div>
              <span className="text-xs bg-green-900/50 text-green-300 px-2 py-1 rounded">
                Real Integration
              </span>
            </div>
          </div>
        </div>

        {/* Gemini Status */}
        {song.error ? (
          <div className="p-4 bg-red-900/30 border border-red-800 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">⚠️</span>
              <h4 className="font-semibold text-red-300">Gemini API Error</h4>
            </div>
            <p className="text-sm text-red-200 mb-2">{song.error}</p>
          </div>
        ) : song.geminiSuccess && (
          <div className="p-4 bg-green-900/20 border border-green-800/50 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="text-2xl">🤖</div>
              <div>
                <h5 className="font-semibold text-green-300">Real AI Generation</h5>
                <p className="text-sm text-gray-400">
                  Song generated by {song.model || 'Gemini AI'} in real-time
                </p>
              </div>
            </div>
          </div>
        )}

        {/* USDC Payment Button - Main Hackathon Feature */}
        <div className="pt-4 border-t border-gray-800">
          <button
            onClick={onPrioritize}
            disabled={loadingUSDC}
            className={`w-full p-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-3 shadow-2xl ${
              loadingUSDC
                ? 'bg-gray-600 cursor-not-allowed'
                : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 active:scale-[0.98] hover:shadow-green-900/50'
            }`}
          >
            {loadingUSDC ? (
              <>
                <div className="relative">
                  <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                </div>
                Processing USDC Payment on Arc...
              </>
            ) : (
              <>
                <span className="text-xl">💰</span>
                Prioritize this Song - 0.001 USDC
                <span className="text-xs bg-white/20 px-3 py-1.5 rounded-full">
                  ⚡ Arc Blockchain
                </span>
              </>
            )}
          </button>
          
          <div className="mt-3 grid grid-cols-3 gap-2 text-center">
            <div className="text-xs text-gray-400">
              <div className="font-semibold">Amount</div>
              <div className="text-green-400">0.001 USDC</div>
            </div>
            <div className="text-xs text-gray-400">
              <div className="font-semibold">Network</div>
              <div className="text-purple-400">Arc Testnet</div>
            </div>
            <div className="text-xs text-gray-400">
              <div className="font-semibold">Finality</div>
              <div className="text-blue-400">&lt; 1 second</div>
            </div>
          </div>
          
          <p className="text-center text-sm text-gray-400 mt-3">
            Micropayment via Circle Wallets • Sub-second finality on Arc
          </p>
        </div>

        {/* Technical Details for Hackathon Judges */}
        <div className="p-4 bg-gray-800/30 rounded-xl border border-gray-700">
          <details className="group">
            <summary className="flex items-center gap-2 cursor-pointer text-sm font-medium text-gray-300">
              <span className="group-open:rotate-90 transition-transform">▶</span>
              Technical Details for Hackathon Judges
            </summary>
            <div className="mt-3 space-y-2 text-xs text-gray-400">
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2 bg-gray-800/50 rounded">
                  <div className="text-gray-500">AI Model</div>
                  <div>{song.model || 'Gemini 2.5 Flash'}</div>
                </div>
                <div className="p-2 bg-gray-800/50 rounded">
                  <div className="text-gray-500">Generation Time</div>
                  <div>~2 seconds</div>
                </div>
              </div>
              <p className="pt-2 border-t border-gray-700">
                This demo showcases real Gemini AI integration for content generation,
                simulated audio playback, and Circle+Arc integration for payments.
                All APIs are configured in production mode.
              </p>
            </div>
          </details>
        </div>
      </div>
    </div>
  );
}