'use client';

import { useState } from 'react';

interface SongGeneratorProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  loading: boolean;
  error: string;
  onGenerate: () => void;
  onDemo?: () => void;
}

export default function SongGenerator({
  prompt,
  setPrompt,
  loading,
  error,
  onGenerate,
  onDemo,
}: SongGeneratorProps) {
  const [selectedExample, setSelectedExample] = useState<string | null>(null);

  const examplePrompts = [
    'synthwave for night driving in neon city',
    'chill lofi beats for coding session',
    'energetic techno for workout motivation',
    'ambient electronic for deep focus',
    'retro video game soundtrack with 8-bit sounds',
    'cyberpunk music for futuristic metropolis',
    'space ambient for interstellar travel',
    'glitch hop for digital art exhibition',
  ];

  const selectExample = (example: string) => {
    setPrompt(example);
    setSelectedExample(example);
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 p-3 rounded-xl">
          <span className="text-2xl">✨</span>
        </div>
        <div>
          <h2 className="text-2xl font-bold">Generate AI Song</h2>
          <p className="text-gray-400 text-sm">Powered by Gemini AI • Real Mode Active</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Textarea pour le prompt */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm text-gray-400">
              Describe your perfect song:
            </label>
            <span className="text-xs bg-green-900/50 text-green-300 px-2 py-1 rounded">
              Real AI
            </span>
          </div>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Example: 'A chillwave track with nostalgic 80s synths and atmospheric pads'"
            className="w-full h-40 p-4 rounded-xl bg-gray-800/70 border-2 border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 focus:outline-none text-white resize-none placeholder-gray-500 transition-all"
            disabled={loading}
          />
        </div>

        {/* Exemples de prompts */}
        <div>
          <p className="text-sm text-gray-400 mb-2">Try these examples:</p>
          <div className="flex flex-wrap gap-2">
            {examplePrompts.map((example, index) => (
              <button
                key={index}
                onClick={() => selectExample(example)}
                disabled={loading}
                className={`px-3 py-2 rounded-lg text-sm transition-all ${
                  selectedExample === example
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                    : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                }`}
              >
                {example}
              </button>
            ))}
          </div>
        </div>

        {/* Boutons Generate & Demo */}
        <div className="flex flex-col gap-3">
          <button
            onClick={onGenerate}
            disabled={loading || !prompt.trim()}
            className={`w-full py-4 rounded-xl font-bold text-lg transition-all shadow-lg ${
              loading || !prompt.trim()
                ? 'bg-blue-800/40 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 active:scale-[0.98]'
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-3">
                <svg
                  className="animate-spin h-6 w-6"
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
                Generating with Gemini AI (Real API)...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-3">
                <span className="text-2xl">🤖</span>
                Generate with Gemini AI (Real Mode)
              </span>
            )}
          </button>

          {onDemo && (
            <button
              onClick={onDemo}
              disabled={loading}
              className="w-full py-4 rounded-xl font-bold text-lg bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 transition-all border border-gray-700"
            >
              <span className="flex items-center justify-center gap-2">
                <span className="text-xl">🎵</span>
                Load Example Song
              </span>
            </button>
          )}
        </div>

        {/* Message d'erreur */}
        {error && (
          <div className="p-4 bg-red-900/40 border-2 border-red-800 rounded-xl animate-fade-in">
            <div className="flex items-center gap-3">
              <span className="text-2xl">⚠️</span>
              <div>
                <p className="font-semibold text-red-300">API Error</p>
                <p className="text-sm text-red-200">{error}</p>
                <details className="mt-3">
                  <summary className="text-xs text-red-400 cursor-pointer">
                    Troubleshooting for Hackathon
                  </summary>
                  <ul className="text-xs text-red-300/80 mt-2 space-y-1 pl-4">
                    <li>• Check GEMINI_API_KEY in Vercel environment variables</li>
                    <li>• Verify the API key is active and has quota</li>
                    <li>• Ensure Google AI Studio account is active</li>
                    <li>• Application will use fallback songs for demo</li>
                  </ul>
                </details>
              </div>
            </div>
          </div>
        )}

        {/* Hackathon Info Box */}
        <div className="p-4 bg-gradient-to-r from-blue-900/20 to-purple-900/20 border-2 border-blue-800/30 rounded-xl">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-xl">🏆</span>
            <h4 className="font-semibold text-blue-300">Hackathon Feature</h4>
          </div>
          <ul className="text-xs text-blue-200/80 space-y-1">
            <li>• Real Gemini AI integration (free tier)</li>
            <li>• JSON parsing from AI responses</li>
            <li>• Structured song metadata generation</li>
            <li>• Part of Google DeepMind challenge</li>
            <li>• Ready for production deployment</li>
          </ul>
        </div>
      </div>
    </div>
  );
}