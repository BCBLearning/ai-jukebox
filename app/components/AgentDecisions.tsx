'use client';

interface AgentDecisionsProps {
  decisions: any[];
  autoMode: boolean;
  onClear?: () => void;
}

export default function AgentDecisions({ decisions, autoMode, onClear }: AgentDecisionsProps) {
  const getEventIcon = (event: string) => {
    if (event.includes('GENERATED')) return '🎵';
    if (event.includes('ANALYZED')) return '📊';
    if (event.includes('PAYMENT')) return '💰';
    if (event.includes('AGENT')) return '🤖';
    if (event.includes('AUTO')) return '⚡';
    if (event.includes('COMPLETED')) return '✅';
    if (event.includes('FAILED')) return '❌';
    return '📝';
  };

  const getEventColor = (event: string) => {
    if (event.includes('COMPLETED') || event.includes('SUCCESS')) return 'text-green-400';
    if (event.includes('FAILED') || event.includes('ERROR')) return 'text-red-400';
    if (event.includes('STARTED') || event.includes('ANALYZED')) return 'text-blue-400';
    if (event.includes('AUTO') || event.includes('AGENT')) return 'text-purple-400';
    return 'text-gray-400';
  };

  const getEventBgColor = (event: string) => {
    if (event.includes('COMPLETED') || event.includes('SUCCESS')) return 'bg-green-900/20';
    if (event.includes('FAILED') || event.includes('ERROR')) return 'bg-red-900/20';
    if (event.includes('STARTED') || event.includes('ANALYZED')) return 'bg-blue-900/20';
    if (event.includes('AUTO') || event.includes('AGENT')) return 'bg-purple-900/20';
    return 'bg-gray-900/20';
  };

  return (
    <div className="bg-gray-900/70 backdrop-blur-sm border-2 border-gray-800 rounded-2xl p-6 shadow-2xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${autoMode ? 'bg-purple-900/30' : 'bg-blue-900/30'}`}>
            <span className="text-xl">🤖</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold">AI Agent Decision Log</h2>
            <p className="text-gray-400 text-sm">
              {autoMode ? 'Autonomous agent making decisions' : 'Manual mode - agent logs actions'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-xs px-3 py-1.5 rounded-full ${autoMode ? 
            'bg-purple-900/50 text-purple-300' : 'bg-blue-900/50 text-blue-300'
          }`}>
            {autoMode ? '🤖 AUTONOMOUS' : '👤 MANUAL'}
          </span>
          {decisions.length > 0 && onClear && (
            <button
              onClick={onClear}
              className="text-xs bg-gray-800 hover:bg-gray-700 px-3 py-1.5 rounded-lg transition-colors"
            >
              Clear Log
            </button>
          )}
        </div>
      </div>
      
      {decisions.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-5xl mb-4 text-gray-600">🤖</div>
          <p className="text-gray-500 mb-2">No agent decisions yet</p>
          <p className="text-sm text-gray-600 max-w-md mx-auto">
            Generate a song to see the AI agent in action. In autonomous mode, the agent will analyze and prioritize songs automatically.
          </p>
        </div>
      ) : (
        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
          {decisions.map((decision, index) => (
            <div
              key={decision.id || index}
              className={`p-4 rounded-xl border ${getEventBgColor(decision.event)} ${
                decision.mode === 'AUTONOMOUS' 
                  ? 'border-purple-800/50' 
                  : 'border-gray-700'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${decision.mode === 'AUTONOMOUS' ? 
                    'bg-purple-900/30' : 'bg-blue-900/30'
                  }`}>
                    <span className="text-lg">{getEventIcon(decision.event)}</span>
                  </div>
                  <div className="max-w-[300px]">
                    <h3 className={`font-semibold ${getEventColor(decision.event)}`}>
                      {decision.event.replace(/_/g, ' ')}
                    </h3>
                    <p className="text-xs text-gray-400">
                      {new Date(decision.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
                <span className={`text-xs px-2 py-1 rounded ${
                  decision.mode === 'AUTONOMOUS' 
                    ? 'bg-purple-900/50 text-purple-300' 
                    : 'bg-blue-900/50 text-blue-300'
                }`}>
                  {decision.mode}
                </span>
              </div>
              
              {decision.details && (
                <div className="mt-3 pl-11">
                  {decision.details.title && (
                    <div className="flex items-center gap-2 text-sm mb-2">
                      <span className="text-gray-500">Song:</span>
                      <span className="font-medium truncate">{decision.details.title}</span>
                      {decision.details.artist && (
                        <span className="text-gray-400 truncate">by {decision.details.artist}</span>
                      )}
                    </div>
                  )}
                  
                  {decision.details.score && (
                    <div className="flex items-center gap-4 text-xs mb-2">
                      <div className="flex items-center gap-1">
                        <span className="text-gray-500">AI Score:</span>
                        <span className="font-bold text-green-400">{decision.details.score}/100</span>
                      </div>
                      {decision.details.estimatedEngagement && (
                        <div className="flex items-center gap-1">
                          <span className="text-gray-500">Engagement:</span>
                          <span className="font-bold text-blue-400">{decision.details.estimatedEngagement}%</span>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {decision.details.reasoning && (
                    <p className="text-xs text-gray-400 mt-2 italic">"{decision.details.reasoning}"</p>
                  )}
                  
                  {decision.details.transactionId && (
                    <div className="mt-2 p-2 bg-gray-900/50 rounded text-xs">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <span className="text-gray-500">TX ID:</span>
                          <p className="font-mono text-xs truncate">{decision.details.transactionId}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Network:</span>
                          <p className="font-medium">{decision.details.network || 'Arc Testnet'}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      
      <div className="mt-6 pt-6 border-t border-gray-800">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-3 bg-gray-800/30 rounded-lg">
            <p className="text-xs text-gray-400 mb-1">Total Decisions</p>
            <p className="text-2xl font-bold">{decisions.length}</p>
          </div>
          <div className="p-3 bg-gray-800/30 rounded-lg">
            <p className="text-xs text-gray-400 mb-1">Autonomous Actions</p>
            <p className="text-2xl font-bold text-purple-400">
              {decisions.filter(d => d.mode === 'AUTONOMOUS').length}
            </p>
          </div>
          <div className="p-3 bg-gray-800/30 rounded-lg">
            <p className="text-xs text-gray-400 mb-1">Current Mode</p>
            <p className="text-xl font-bold flex items-center gap-2">
              {autoMode ? (
                <>
                  <span>🤖</span>
                  <span className="text-purple-400">AGENTIC</span>
                </>
              ) : (
                <>
                  <span>👤</span>
                  <span>MANUAL</span>
                </>
              )}
            </p>
          </div>
        </div>
        
        <p className="text-xs text-gray-500 text-center mt-4">
          This log demonstrates the trustless AI agent making autonomous commerce decisions.
          Each entry represents an agent action in the agentic commerce flow.
        </p>
      </div>
    </div>
  );
}