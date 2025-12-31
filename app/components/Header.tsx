export default function Header() {
  return (
    <header className="w-full bg-gradient-to-r from-blue-900/90 to-purple-900/90 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-black/30 p-3 rounded-xl">
              <span className="text-3xl">🎵</span>
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">
                AI Jukebox - Agentic Commerce
              </h1>
              <p className="text-gray-300 text-sm">
                Hackathon Submission for Agentic Commerce on Arc
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:block text-right">
              <p className="text-sm text-gray-400">Powered by</p>
              <div className="flex gap-2 mt-1">
                <span className="px-3 py-1 bg-blue-900/50 rounded-lg text-xs font-semibold">
                  Gemini AI
                </span>
                <span className="px-3 py-1 bg-green-900/50 rounded-lg text-xs font-semibold">
                  USDC
                </span>
                <span className="px-3 py-1 bg-purple-900/50 rounded-lg text-xs font-semibold">
                  Arc
                </span>
                <span className="px-3 py-1 bg-gray-800 rounded-lg text-xs font-semibold">
                  Circle
                </span>
              </div>
            </div>
            
            <a
              href="https://lablab.ai/event/agentic-commerce-on-arc"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-black/40 hover:bg-black/60 border border-gray-700 rounded-lg text-sm transition-colors"
            >
              Hackathon Page
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}