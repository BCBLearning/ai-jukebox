'use client';
import {useState} from 'react';

interface SongDisplayProps {
  song: any;
  loadingUSDC: boolean;
  onPrioritize: () => void;
}

export default function SongDisplay({ song, loadingUSDC, onPrioritize }: SongDisplayProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);
  
  // Fonction pour jouer un aperçu audio basé sur le genre
  const getAudioPreview = (genre: string) => {
    const audioMap: Record<string, string> = {
      'Chillwave': 'https://assets.mixkit.co/music/preview/mixkit-chillwave-1-95.mp3',
      'Synthwave': 'https://assets.mixkit.co/music/preview/mixkit-synthwave-1-39.mp3',
      'Glitch Hop': 'https://assets.mixkit.co/music/preview/mixkit-glitch-hop-1-104.mp3',
      'Techno': 'https://assets.mixkit.co/music/preview/mixkit-driving-ambition-32.mp3',
      'Lofi': 'https://assets.mixkit.co/music/preview/mixkit-lofi-study-1-196.mp3',
      'Ambient': 'https://assets.mixkit.co/music/preview/mixkit-ambient-1-799.mp3',
      'Electronic': 'https://assets.mixkit.co/music/preview/mixkit-electronic-1-246.mp3',
      'House': 'https://assets.mixkit.co/music/preview/mixkit-house-1-151.mp3',
    };
    
    // Trouver le genre correspondant (insensible à la casse)
    const normalizedGenre = genre.toLowerCase();
    for (const [key, url] of Object.entries(audioMap)) {
      if (normalizedGenre.includes(key.toLowerCase())) {
        return url;
      }
    }
    
    // Par défaut, retourner un audio d'ambient
    return 'https://assets.mixkit.co/music/preview/mixkit-ambient-1-799.mp3';
  };

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
        <div className="relative">
          <div
            className={`h-48 rounded-xl bg-gradient-to-r ${
              song.colorScheme === 'purple-blue'
                ? 'from-purple-900 to-blue-900'
                : song.colorScheme === 'green-black'
                ? 'from-green-900 to-black'
                : song.colorScheme === 'pink-cyan'
                ? 'from-pink-900 to-cyan-900'
                : 'from-purple-800 to-pink-800'
            } flex items-center justify-center`}
          >
            <div className="text-center p-6">
              <div className="text-5xl mb-4">🎵</div>
              <p className="text-gray-300 italic">"{song.coverDescription}"</p>
            </div>
          </div>
          <div className="absolute top-4 right-4 text-xs text-gray-400">
            AI Generated Cover
          </div>
        </div>

        {/* Audio Player Section - Seulement si pas d'erreur Gemini */}
        {!song.error && song.isReal && (
          <div className="p-4 bg-gray-800/50 rounded-xl border border-gray-700">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold flex items-center gap-2">
                <span className="text-xl">🎵</span> Audio Preview
              </h4>
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center gap-2"
              >
                {isPlaying ? '⏸️ Pause' : '▶️ Play Preview'}
              </button>
            </div>
            
            {audioError ? (
              <div className="p-3 bg-red-900/30 rounded-lg">
                <p className="text-sm text-red-300">Audio preview unavailable</p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-1000"
                      style={{ width: isPlaying ? '70%' : '0%' }}
                    />
                  </div>
                  <span className="text-sm text-gray-400">
                    {isPlaying ? 'Playing...' : 'Ready'}
                  </span>
                </div>
                
                {isPlaying && (
                  <audio
                    autoPlay
                    onEnded={() => setIsPlaying(false)}
                    onError={(e) => {
                      console.error('Audio error:', e);
                      setAudioError('Failed to load audio preview');
                      setIsPlaying(false);
                    }}
                    className="hidden"
                  >
                    <source src={getAudioPreview(song.genre)} type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </audio>
                )}
                
                <p className="text-xs text-gray-400">
                  Playing a genre-matched preview. Real music generation requires additional audio AI.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Gemini Error Display */}
        {song.error && (
          <div className="p-4 bg-red-900/30 border border-red-800 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">⚠️</span>
              <h4 className="font-semibold text-red-300">Gemini API Error</h4>
            </div>
            <p className="text-sm text-red-200 mb-2">{song.error}</p>
            <details className="text-xs text-red-300">
              <summary className="cursor-pointer mb-1">Troubleshooting steps</summary>
              <ul className="list-disc pl-4 mt-2 space-y-1">
                <li>Check if GEMINI_API_KEY is set in Vercel environment variables</li>
                <li>Verify the API key is valid and has quota available</li>
                <li>Ensure Google AI Studio account is active</li>
                <li>Fallback demo song has been loaded instead</li>
              </ul>
            </details>
          </div>
        )}

        {/* USDC Payment Button */}
        <div className="pt-4 border-t border-gray-800">
          <button
            onClick={onPrioritize}
            disabled={loadingUSDC}
            className={`w-full p-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-3 ${
              loadingUSDC
                ? 'bg-gray-600 cursor-not-allowed'
                : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 active:scale-[0.98]'
            }`}
          >
            {loadingUSDC ? (
              <>
                <svg
                  className="animate-spin h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Processing USDC Payment...
              </>
            ) : (
              <>
                <span className="text-xl">💰</span>
                Prioritize this Song - 0.001 USDC
                <span className="text-xs bg-white/20 px-2 py-1 rounded">
                  Arc Blockchain
                </span>
              </>
            )}
          </button>
          <p className="text-center text-sm text-gray-400 mt-3">
            Micropayment via Circle Wallets • Sub-second finality on Arc
          </p>
        </div>

        {/* Technical Info */}
        {song.debug && (
          <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
            <p className="text-sm text-gray-400">💡 {song.debug}</p>
            {song.error && (
              <p className="text-sm text-red-400 mt-2">
                ⚠️ Gemini API error: Falling back to demo song
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}