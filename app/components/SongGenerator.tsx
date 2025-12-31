

interface SongGeneratorProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  loading: boolean;
  error: string;
  onGenerate: () => void;
  onDemo?: () => void; // <- callback optionnel pour charger une démo
}

export default function SongGenerator({
  prompt,
  setPrompt,
  loading,
  error,
  onGenerate,
  onDemo,
}: SongGeneratorProps) {
  const examplePrompts = [
    'synthwave for night driving',
    'chill lofi for studying',
    'energetic techno for workout',
    'ambient electronic for coding',
    'retro video game soundtrack',
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
        <div className="bg-blue-900/30 p-2 rounded-lg">
          <span className="text-xl">1</span>
        </div>
        Generate AI Song
      </h2>

      <div className="space-y-6">
        {/* Textarea pour le prompt */}
        <div>
          <label className="block text-sm text-gray-400 mb-3">
            Describe your perfect song:
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Example: 'A chillwave track with nostalgic 80s synths and atmospheric pads'"
            className="w-full h-40 p-4 rounded-xl bg-gray-800/50 border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none text-white resize-none placeholder-gray-500"
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
                onClick={() => setPrompt(example)}
                className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm transition-colors"
                disabled={loading}
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
            className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
              loading || !prompt.trim()
                ? 'bg-blue-800/50 cursor-not-allowed'
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
                Generating with Gemini AI...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <span className="text-xl">✨</span>
                Generate with Gemini AI (Free)
              </span>
            )}
          </button>

          {onDemo && (
            <button
              onClick={onDemo}
              disabled={loading}
              className="w-full py-4 rounded-xl font-bold text-lg bg-blue-600 hover:bg-blue-700 transition-all"
            >
              🎵 Load Demo Song
            </button>
          )}
        </div>

        {/* Message d'erreur */}
        {error && (
          <div className="p-4 bg-red-900/30 border border-red-800 rounded-xl">
            <p className="text-red-300 font-medium">⚠️ {error}</p>
            <details className="mt-2">
              <summary className="text-sm text-red-400 cursor-pointer">
                Technical details
              </summary>
              <p className="text-xs text-red-500 mt-2">
                Check: 1) API key on Vercel 2) Google AI Studio account 3) Gemini API quota
              </p>
            </details>
          </div>
        )}

        <div className="p-4 bg-gray-800/30 rounded-xl">
          <h4 className="font-semibold text-sm text-gray-300 mb-2">
            💡 How it works:
          </h4>
          <ul className="text-xs text-gray-400 space-y-1">
            <li>• Uses Google's Gemini AI for creative generation</li>
            <li>• Returns song metadata in structured JSON format</li>
            <li>• Includes cover art description for visualization</li>
            <li>• Part of Google DeepMind challenge for hackathon</li>
          </ul>
        </div>
      </div>
    </div>
  );
}