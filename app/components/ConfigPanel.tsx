'use client';

import { useState, useEffect } from 'react';

interface ConfigPanelProps {
  config: any;
  onClose: () => void;
  autoMode: boolean;
}

export default function ConfigPanel({ config, onClose, autoMode }: ConfigPanelProps) {
  const [apiStatus, setApiStatus] = useState({
    gemini: 'checking',
    circle: 'checking',
    arc: 'ready',
  });
  const [lastUpdate, setLastUpdate] = useState('');

  useEffect(() => {
    const checkApiStatus = async () => {
      try {
        // Vérifier Gemini
        const geminiRes = await fetch('/api/generate', { method: 'GET' });
        const geminiData = await geminiRes.json();
        
        // Vérifier Circle
        const circleRes = await fetch('/api/paiement', { method: 'GET' });
        const circleData = await circleRes.json();
        
        setApiStatus({
          gemini: geminiData.geminiConfigured ? 'connected' : 'disconnected',
          circle: circleData.circleConfigured ? 'connected' : 'demo',
          arc: 'connected',
        });
        
        setLastUpdate(new Date().toLocaleTimeString());
      } catch (error) {
        console.error('Error checking API status:', error);
      }
    };

    checkApiStatus();
    const interval = setInterval(checkApiStatus, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'bg-green-900/70 text-green-300 border border-green-700';
      case 'ready': return 'bg-green-900/70 text-green-300 border border-green-700';
      case 'demo': return 'bg-yellow-900/70 text-yellow-300 border border-yellow-700';
      case 'checking': return 'bg-blue-900/70 text-blue-300 border border-blue-700';
      default: return 'bg-red-900/70 text-red-300 border border-red-700';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'connected': return '✅ Connected';
      case 'ready': return '✅ Ready';
      case 'demo': return '⚠️ Demo Mode';
      case 'checking': return '⏳ Checking...';
      default: return '❌ Disconnected';
    }
  };

  const testGeminiAPI = async () => {
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: 'test connection for hackathon' }),
      });
      const data = await response.json();
      
      if (data.geminiSuccess || data.title) {
        alert(`✅ Gemini API Connected!\nModel: ${data.model}\nSong: ${data.title}\nArtist: ${data.artist}`);
      } else {
        alert(`❌ Gemini API Error\nCheck Vercel environment variables\nError: ${data.error || 'Unknown'}`);
      }
    } catch (error: any) {
      alert(`❌ Test failed: ${error.message}`);
    }
  };

  const testCircleAPI = async () => {
    try {
      const response = await fetch('/api/paiement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          songTitle: 'Test Song',
          artist: 'Test Artist',
          amount: '0.001'
        }),
      });
      const data = await response.json();
      
      if (data.success) {
        alert(`✅ ${data.demo ? 'Demo Mode' : 'Real Mode'}\nTransaction ID: ${data.transaction?.id}\nStatus: ${data.transaction?.status}`);
      } else {
        alert(`❌ Error: ${data.error}`);
      }
    } catch (error: any) {
      alert(`❌ Test failed: ${error.message}`);
    }
  };

  const openVercelDashboard = () => {
    window.open('https://vercel.com/dashboard', '_blank');
  };

  const openHackathonPage = () => {
    window.open('https://lablab.ai/event/agentic-commerce-on-arc', '_blank');
  };

  return (
    <div className="fixed top-4 right-4 bg-gray-900/95 backdrop-blur-sm border-2 border-gray-700 rounded-2xl p-5 w-80 max-w-[90vw] z-50 shadow-2xl animate-fade-in-up max-h-[85vh] overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-lg ${autoMode ? 'bg-purple-900/50' : 'bg-blue-900/50'}`}>
            <span className="text-sm">⚙️</span>
          </div>
          <div>
            <h4 className="font-bold text-sm text-white">Config Panel</h4>
            <p className="text-xs text-gray-400">Real APIs Active</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white text-lg transition-colors"
        >
          ✕
        </button>
      </div>

      <div className="space-y-4">
        {/* Status Indicators */}
        <div className="space-y-3">
          {/* Gemini Status */}
          <div className="p-3 bg-gray-800/50 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${
                  apiStatus.gemini === 'connected' ? 'bg-green-500 animate-pulse' : 
                  apiStatus.gemini === 'demo' ? 'bg-yellow-500' : 'bg-blue-500'
                }`} />
                <span className="text-sm font-medium">Gemini AI</span>
              </div>
              <span className={`text-xs px-2 py-1 rounded ${getStatusColor(apiStatus.gemini)}`}>
                {getStatusText(apiStatus.gemini)}
              </span>
            </div>
            <p className="text-xs text-gray-400">Content generation & analysis</p>
            {config?.gemini?.model && (
              <p className="text-xs text-gray-500 mt-1">Model: {config.gemini.model}</p>
            )}
          </div>

          {/* Circle Status */}
          <div className="p-3 bg-gray-800/50 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${
                  apiStatus.circle === 'connected' ? 'bg-green-500 animate-pulse' : 
                  apiStatus.circle === 'demo' ? 'bg-yellow-500' : 'bg-blue-500'
                }`} />
                <span className="text-sm font-medium">Circle USDC</span>
              </div>
              <span className={`text-xs px-2 py-1 rounded ${getStatusColor(apiStatus.circle)}`}>
                {getStatusText(apiStatus.circle)}
              </span>
            </div>
            <p className="text-xs text-gray-400">Payment processing & USDC</p>
            {config?.circle?.network && (
              <p className="text-xs text-gray-500 mt-1">Network: {config.circle.network}</p>
            )}
          </div>

          {/* Arc Status */}
          <div className="p-3 bg-gray-800/50 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                <span className="text-sm font-medium">Arc Blockchain</span>
              </div>
              <span className="text-xs px-2 py-1 rounded bg-purple-900/70 text-purple-300 border border-purple-700">
                ✅ Connected
              </span>
            </div>
            <p className="text-xs text-gray-400">Settlement layer & finality</p>
            {config?.arc?.network && (
              <p className="text-xs text-gray-500 mt-1">Gas Token: {config.arc.usdc}</p>
            )}
          </div>
        </div>

        {/* Hackathon Badge */}
        <div className="p-3 bg-gradient-to-r from-purple-900/40 to-blue-900/40 border border-purple-800 rounded-xl">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg">🏆</span>
            <p className="text-sm font-semibold">Agentic Commerce on Arc</p>
          </div>
          <p className="text-xs text-gray-300">
            Hackathon submission • All APIs integrated
          </p>
          <p className="text-[10px] text-gray-400 mt-2">
            Last check: {lastUpdate || 'Just now'}
          </p>
        </div>

        {/* Test Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={testGeminiAPI}
            className="text-xs bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-2"
          >
            <span>🤖</span>
            Test Gemini
          </button>
          <button
            onClick={testCircleAPI}
            className="text-xs bg-green-600 hover:bg-green-700 px-3 py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-2"
          >
            <span>💰</span>
            Test Circle
          </button>
        </div>

        {/* Quick Links */}
        <div className="pt-3 border-t border-gray-800">
          <p className="text-xs font-semibold text-gray-400 mb-2">Quick Links:</p>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={openVercelDashboard}
              className="text-xs bg-gray-800 hover:bg-gray-700 px-2 py-1.5 rounded text-center transition-all"
            >
              Vercel Dashboard
            </button>
            <button
              onClick={openHackathonPage}
              className="text-xs bg-gray-800 hover:bg-gray-700 px-2 py-1.5 rounded text-center transition-all"
            >
              Hackathon Page
            </button>
          </div>
        </div>

        {/* Environment Info */}
        {config && (
          <div className="pt-3 border-t border-gray-800">
            <p className="text-xs text-gray-500 mb-2">Environment Info:</p>
            <div className="space-y-1 text-xs text-gray-400">
              <div className="flex justify-between">
                <span>Mode:</span>
                <span className="text-green-400">{config.application?.mode || 'Real'}</span>
              </div>
              <div className="flex justify-between">
                <span>Version:</span>
                <span>{config.application?.version || '2.0.0'}</span>
              </div>
              {config.application?.url && (
                <div className="flex justify-between">
                  <span>URL:</span>
                  <span className="text-blue-400 truncate ml-2">{config.application.url}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full text-xs bg-gray-800 hover:bg-gray-700 px-3 py-2.5 rounded-lg font-medium transition-all border border-gray-700"
        >
          Close Configuration Panel
        </button>
      </div>
    </div>
  );
}