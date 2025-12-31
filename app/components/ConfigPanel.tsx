'use client';

interface ConfigPanelProps {
  config: any;
}

export default function ConfigPanel({ config }: ConfigPanelProps) {
  const openGoogleAIStudio = () => {
    window.open('https://aistudio.google.com/app/apikey', '_blank');
  };

  const openHackathonPage = () => {
    window.open('https://lablab.ai/event/agentic-commerce-on-arc', '_blank');
  };

  const openArcDocs = () => {
    window.open('https://docs.arc.net', '_blank');
  };

  const testDemoSong = async () => {
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: 'test demo song' }),
      });
      const data = await response.json();
      
      alert(`🎵 Demo Song: "${data.title}"\nby ${data.artist}\nGenre: ${data.genre}\nMode: ${data.isReal ? 'AI Generated' : 'Demo'}`);
    } catch (error: any) {
      alert(`Test failed: ${error.message}`);
    }
  };

  return (
    <div className="fixed bottom-4 left-4 bg-gray-900/90 backdrop-blur-sm border border-gray-800 rounded-xl p-4 max-w-xs z-50">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-bold text-sm">⚙️ Hackathon Mode</h4>
        <div className="text-xs bg-purple-600 px-2 py-1 rounded">Active</div>
      </div>

      <div className="space-y-3">
        {/* Gemini Status */}
        <div className="flex justify-between items-center">
          <div>
            <p className="text-xs font-medium">Gemini AI</p>
            <p className="text-xs text-gray-400">Free tier models</p>
          </div>
          <div className="text-xs px-2 py-1 rounded bg-yellow-900/50 text-yellow-300">
            {config?.gemini?.status === 'active_free_tier' ? 'Free Tier' : 'Demo'}
          </div>
        </div>

        {/* Circle Status */}
        <div className="flex justify-between items-center">
          <div>
            <p className="text-xs font-medium">Circle Wallets</p>
            <p className="text-xs text-gray-400">USDC payments</p>
          </div>
          <div className="text-xs px-2 py-1 rounded bg-yellow-900/50 text-yellow-300">
            Demo
          </div>
        </div>

        {/* Arc Status */}
        <div className="flex justify-between items-center">
          <div>
            <p className="text-xs font-medium">Arc Blockchain</p>
            <p className="text-xs text-gray-400">Testnet ready</p>
          </div>
          <div className="text-xs px-2 py-1 rounded bg-green-900/50 text-green-300">
            Active
          </div>
        </div>

        {/* Hackathon Demo Info */}
        <div className="mt-3 p-3 bg-purple-900/30 border border-purple-800 rounded-lg">
          <p className="text-xs font-semibold text-purple-300 mb-1">
            🏆 Hackathon Submission
          </p>
          <p className="text-[10px] text-purple-200">
            AI Jukebox - Agentic Commerce on Arc
          </p>
          <p className="text-[10px] text-purple-300/70 mt-1">
            Demo mode with 5 high-quality songs + audio previews
          </p>
        </div>

        {/* Configuration Instructions */}
        <div className="mt-4 pt-4 border-t border-gray-800">
          <p className="text-xs font-semibold text-blue-300 mb-2">
            🔧 To enable real APIs:
          </p>
          <div className="space-y-2">
            <button
              onClick={openGoogleAIStudio}
              className="w-full text-xs bg-blue-900/30 hover:bg-blue-900/50 border border-blue-800/50 p-2 rounded text-blue-300 text-left"
            >
              <span className="font-semibold">1. Get Free Gemini API Key</span>
              <p className="text-[10px] mt-1">
                Google AI Studio → Free API key → 60 QPM quota
              </p>
            </button>

            <button
              onClick={testDemoSong}
              className="w-full text-xs bg-green-900/30 hover:bg-green-900/50 border border-green-800/50 p-2 rounded text-green-300 text-left"
            >
              <span className="font-semibold">2. Test Demo Mode</span>
              <p className="text-[10px] mt-1">
                Click to generate a high-quality demo song
              </p>
            </button>

            <button
              onClick={openHackathonPage}
              className="w-full text-xs bg-gray-800 hover:bg-gray-700 border border-gray-700 p-2 rounded text-gray-300 text-left"
            >
              <span className="font-semibold">3. Hackathon Details</span>
              <p className="text-[10px] mt-1">
                LabLab.ai • Circle • Arc • Google DeepMind
              </p>
            </button>
          </div>
        </div>

        {/* Demo Features */}
        <div className="mt-3">
          <p className="text-xs font-semibold text-gray-400 mb-1">
            🎵 Demo Features:
          </p>
          <ul className="text-[10px] text-gray-500 space-y-1">
            <li>• 5 High-quality pre-generated songs</li>
            <li>• Genre-matched audio previews</li>
            <li>• Simulated USDC payments</li>
            <li>• Arc blockchain integration demo</li>
            <li>• Ready for hackathon presentation</li>
          </ul>
        </div>

        {/* Quick Actions */}
        <div className="mt-4 pt-4 border-t border-gray-800">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => window.location.reload()}
              className="text-xs bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded"
            >
              Refresh
            </button>
            <button
              onClick={openArcDocs}
              className="text-xs bg-purple-600 hover:bg-purple-700 px-2 py-1 rounded"
            >
              Arc Docs
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}