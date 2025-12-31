interface PlaylistProps {
  songs: string[];
}

export default function Playlist({ songs }: PlaylistProps) {
  return (
    <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6">
      <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
        <div className="bg-purple-900/30 p-2 rounded-lg">
          <span className="text-xl">🎧</span>
        </div>
        Priority Playlist (USDC Boosted)
      </h3>
      
      {songs.length > 0 ? (
        <div className="space-y-3">
          {songs.map((song, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-gradient-to-r from-green-900/20 to-emerald-900/10 border border-green-800/30 rounded-xl"
            >
              <div className="flex items-center gap-4">
                <div className="bg-green-900/50 text-green-300 font-bold w-8 h-8 rounded-full flex items-center justify-center">
                  #{index + 1}
                </div>
                <div>
                  <p className="font-semibold">{song.split(' - ')[0]}</p>
                  <p className="text-sm text-gray-400">{song.split(' - ')[1]}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs px-3 py-1 bg-green-900/50 text-green-300 rounded-full">
                  💎 0.001 USDC
                </span>
                <span className="text-xs px-3 py-1 bg-blue-900/50 text-blue-300 rounded-full">
                  ⚡ Arc
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-5xl mb-4 text-gray-600">🎵</div>
          <p className="text-gray-500 mb-2">No songs prioritized yet</p>
          <p className="text-sm text-gray-600">
            Use the USDC button to boost a song to the top of the playlist
          </p>
        </div>
      )}
      
      <div className="mt-8 pt-6 border-t border-gray-800">
        <h4 className="font-semibold text-gray-300 mb-3">
          How Priority Playlist Works:
        </h4>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-3 bg-gray-800/30 rounded-lg">
            <p className="text-sm font-semibold text-green-400 mb-1">
              💰 USDC Micropayments
            </p>
            <p className="text-xs text-gray-400">
              Pay 0.001 USDC to prioritize any song. Each payment moves the song
              to the top.
            </p>
          </div>
          <div className="p-3 bg-gray-800/30 rounded-lg">
            <p className="text-sm font-semibold text-blue-400 mb-1">
              ⚡ Arc Settlement
            </p>
            <p className="text-xs text-gray-400">
              Transactions settle in under 1 second on Arc with deterministic
              finality.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}