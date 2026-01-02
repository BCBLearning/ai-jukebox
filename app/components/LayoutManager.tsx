'use client';

interface LayoutManagerProps {
  children: React.ReactNode;
  showConfigPanel: boolean;
  autoMode: boolean;
  onToggleAutoMode: () => void;
  onToggleConfigPanel: () => void;
}

export default function LayoutManager({
  children,
  showConfigPanel,
  autoMode,
  onToggleAutoMode,
  onToggleConfigPanel
}: LayoutManagerProps) {
  return (
    <>
      {children}
      
      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-40">
        {/* Agent Mode Toggle */}
        <div className="relative group">
          <button
            onClick={onToggleAutoMode}
            className={`${
              autoMode 
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-lg shadow-purple-900/50' 
                : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
            } text-white p-4 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95`}
          >
            <span className="text-2xl">{autoMode ? '🤖' : '👤'}</span>
          </button>
          <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
            {autoMode ? 'Switch to Manual Mode' : 'Activate Agentic Mode'}
          </div>
        </div>
        
        {/* Config Panel Toggle */}
        {!showConfigPanel && (
          <div className="relative group">
            <button
              onClick={onToggleConfigPanel}
              className="bg-gray-800 hover:bg-gray-700 text-white p-4 rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 active:scale-95"
            >
              <span className="text-2xl">⚙️</span>
            </button>
            <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
              Show Configuration Panel
            </div>
          </div>
        )}
      </div>
    </>
  );
}