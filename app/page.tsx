export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-900 to-black text-white p-8">
      <h1 className="text-4xl font-bold text-center mb-8">🎵 AI Jukebox</h1>
      <p className="text-center mb-8">Demande une chanson générée par IA, priorise-la avec un micropaiement USDC</p>
      
      <div className="max-w-md mx-auto">
        <input 
          type="text" 
          placeholder="Décris ta chanson idéale (ex: 'electro chill pour coder')"
          className="w-full p-3 rounded-lg bg-gray-800 text-white mb-4"
        />
        <button className="w-full bg-blue-600 hover:bg-blue-700 p-3 rounded-lg font-semibold">
          Générer avec Gemini (Gratuit)
        </button>
        <button className="w-full bg-green-600 hover:bg-green-700 p-3 rounded-lg font-semibold mt-2">
            Prioriser pour 0.001 USDC (Payant)
        </button>
      </div>
    </main>
  );
}