interface PlaylistProps {
  songs: string[];
  autoMode?: boolean;
}

export default function Playlist({ songs, autoMode = false }: PlaylistProps) {
  return (
    <div className="bg-gray-900/70 backdrop-blur-sm border-2 border-gray-800 rounded-2xl p-6 shadow-2xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${autoMode ? 'bg-purple-900/30' : 'bg-emerald-900/30'}`}>
            <span className="text-xl">🎧</span>
          </div>
          <div>
            <h3 className="text-2xl font-bold">Priority Playlist</h3>
            <p className="text-gray-400 text-sm">
              {autoMode ? '🤖 Agent-curated with USDC' : 'USDC-boosted songs'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-xs px-3 py-1.5 rounded-full ${autoMode ? 'bg-purple-900/50 text-purple-300' : 'bg-green-900/50 text-green-300'}`}>
            {autoMode ? '🤖 AGENT MODE' : '💰 USDC PRIORITY'}
          </span>
        </div>
      </div>
      
      {songs.length > 0 ? (
        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
          {songs.map((song, index) => {
            const [title, artist] = song.split(' - ');
            return (
              <div
                key={index}
                className={`flex items-center justify-between p-4 rounded-xl border transition-all ${autoMode ? 
                  'bg-gradient-to-r from-purple-900/20 to-indigo-900/10 border-purple-800/30 hover:border-purple-700/50' : 
                  'bg-gradient-to-r from-green-900/20 to-emerald-900/10 border-green-800/30 hover:border-green-700/50'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`font-bold w-8 h-8 rounded-full flex items-center justify-center ${autoMode ? 
                    'bg-purple-900/50 text-purple-300' : 'bg-green-900/50 text-green-300'
                  }`}>
                    #{index + 1}
                  </div>
                  <div>
                    <p className="font-semibold text-lg truncate max-w-[200px]">{title}</p>
                    <p className="text-sm text-gray-400 truncate max-w-[200px]">{artist}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-3 py-1 rounded-full ${autoMode ? 
                    'bg-purple-900/50 text-purple-300' : 'bg-green-900/50 text-green-300'
                  }`}>
                    💎 0.001 USDC
                  </span>
                  <span className="text-xs px-3 py-1 bg-blue-900/50 text-blue-300 rounded-full">
                    ⚡ Arc
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-5xl mb-4 text-gray-600">🎵</div>
          <p className="text-gray-500 mb-2">No prioritized songs yet</p>
          <p className="text-sm text-gray-600 max-w-md mx-auto">
            {autoMode ? 
              "🤖 Agent will automatically prioritize high-quality songs" : 
              "Use the USDC button to boost a song to the priority playlist"
            }
          </p>
        </div>
      )}
      
      <div className="mt-8 pt-6 border-t border-gray-800">
        <h4 className="font-semibold text-gray-300 mb-4 flex items-center gap-2">
          <span className="text-lg">⚙️</span>
          How Priority Playlist Works:
        </h4>
        <div className="grid md:grid-cols-2 gap-4">
          <div className={`p-4 rounded-lg ${autoMode ? 
            'bg-purple-900/20 border border-purple-800/30' : 
            'bg-green-900/20 border border-green-800/30'
          }`}>
            <p className={`text-sm font-semibold mb-2 ${autoMode ? 'text-purple-400' : 'text-green-400'}`}>
              {autoMode ? '🤖 AI Agent Analysis' : '💰 USDC Micropayments'}
            </p>
            <p className="text-xs text-gray-400">
              {autoMode ? 
                'AI agent analyzes song quality and engagement potential to make autonomous prioritization decisions' :
                'Pay 0.001 USDC to prioritize any song. Each payment moves the song to the top of the playlist.'
              }
            </p>
          </div>
          <div className="p-4 bg-blue-900/20 border border-blue-800/30 rounded-lg">
            <p className="text-sm font-semibold text-blue-400 mb-2">⚡ Arc Settlement</p>
            <p className="text-xs text-gray-400">
              Transactions settle in under 1 second on Arc with deterministic finality and USDC as native gas token.
            </p>
          </div>
        </div>
        
        {/* Hackathon Compliance */}
        <div className="mt-6 p-4 bg-gradient-to-r from-gray-900/50 to-gray-800/30 rounded-lg border border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">🏆</span>
            <p className="text-sm font-semibold text-gray-300">Hackathon Requirement</p>
          </div>
          <p className="text-xs text-gray-400">
            Priority playlist demonstrates agentic commerce by allowing AI agents to autonomously manage content prioritization through on-chain payments.
          </p>
        </div>
      </div>
    </div>
  );
}