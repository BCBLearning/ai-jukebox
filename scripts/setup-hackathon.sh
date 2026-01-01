#!/bin/bash
echo "🚀 Script de configuration Hackathon - AI Jukebox"
echo "================================================"

# Vérifier les prérequis
echo "🔍 Vérification des prérequis..."

# Vérifier Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js n'est pas installé"
    echo "   Installez Node.js 18+ : https://nodejs.org"
    exit 1
fi
echo "✅ Node.js $(node -v)"

# Vérifier npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm n'est pas installé"
    exit 1
fi
echo "✅ npm $(npm -v)"

# Vérifier Git
if ! command -v git &> /dev/null; then
    echo "⚠️  Git n'est pas installé (optionnel)"
else
    echo "✅ Git $(git --version)"
fi

echo ""
echo "📦 Installation des dépendances..."
npm install

echo ""
echo "🔧 Vérification de la configuration..."
if [ ! -f ".env.local" ]; then
    echo "⚠️  .env.local non trouvé, création du template..."
    cat > .env.local << EOF
# ===========================================
# CONFIGURATION HACKATHON - AI JUKEBOX
# ===========================================
# Obtenez vos clés API pour le mode réel

# Gemini AI (gratuit) : https://aistudio.google.com/app/apikey
GEMINI_API_KEY=AIzaSyD...votre_clé_ici

# Circle Sandbox : https://console.circle.com/wallets
CIRCLE_API_KEY=SANDBOX_API_KEY
CIRCLE_APP_ID=APP_ID
CIRCLE_ENTITY_SECRET=ENTITY_SECRET

# Configuration application
NEXT_PUBLIC_APP_NAME="AI Jukebox - Hackathon"
NEXT_PUBLIC_HACKATHON_NAME="Agentic Commerce on Arc"
NEXT_PUBLIC_HACKATHON_URL="https://lablab.ai/event/agentic-commerce-on-arc"

# Mode hackathon
DEMO_MODE=false
ENABLE_GEMINI=true
ENABLE_CIRCLE=true
EOF
    echo "✅ Template .env.local créé"
    echo "⚠️  IMPORTANT: Remplissez vos vraies clés API dans .env.local"
else
    echo "✅ .env.local trouvé"
fi

echo ""
echo "🧪 Test de configuration..."
npm run check-env

echo ""
echo "🚀 Démarrage de l'application..."
echo "   L'application sera disponible sur: http://localhost:3000"
echo "   Appuyez sur Ctrl+C pour arrêter"
echo ""
echo "📋 Commandes utiles :"
echo "   npm run dev           - Démarrer en développement"
echo "   npm run check-env     - Vérifier la configuration"
echo "   npm run test:gemini   - Tester Gemini API"
echo "   npm run test:circle   - Tester Circle API"
echo "   npm run build         - Build pour production"
echo "   npm run deploy        - Déployer sur Vercel"
echo ""
echo "🏆 Pour le hackathon :"
echo "   1. Testez la génération AI : npm run test:gemini"
echo "   2. Testez les paiements : npm run test:circle"
echo "   3. Vérifiez la config : npm run check-env"
echo "   4. Déployez : npm run deploy"

# Lancer l'application
npm run dev