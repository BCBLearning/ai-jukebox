interface TechStackProps {
  config: any;
}

export default function TechStack({ config }: TechStackProps) {
  const technologies = [
    {
      name: 'Arc Blockchain',
      description: 'Settlement layer with USDC as native gas',
      color: 'bg-purple-900/30',
      textColor: 'text-purple-400',
      required: true,
      status: 'ready',
    },
    {
      name: 'USDC',
      description: 'Stablecoin for payments and gas fees',
      color: 'bg-green-900/30',
      textColor: 'text-green-400',
      required: true,
      status: 'ready',
    },
    {
      name: 'Circle Wallets',
      description: 'User onboarding and payment infrastructure',
      color: 'bg-blue-900/30',
      textColor: 'text-blue-400',
      required: true,
      status: config?.circle?.configured ? 'configured' : 'demo',
    },
    {
      name: 'Gemini AI',
      description: 'Content generation and AI capabilities',
      color: 'bg-yellow-900/30',
      textColor: 'text-yellow-400',
      required: false,
      status: config?.gemini?.configured ? 'configured' : 'demo',
    },
    {
      name: 'Circle Gateway',
      description: 'Unified USDC balance cross-chain',
      color: 'bg-cyan-900/30',
      textColor: 'text-cyan-400',
      required: false,
      status: 'available',
    },
    {
      name: 'x402 Protocol',
      description: 'Web-native payment standard',
      color: 'bg-pink-900/30',
      textColor: 'text-pink-400',
      required: false,
      status: 'available',
    },
  ];

  const hackathonTracks = [
    'Best Autonomous Commerce Application',
    'Best Trustless AI Agent',
    'Best Product Design',
    'Best Gateway-Based Micropayments Integration',
  ];

  return (
    <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6">
      <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
        <div className="bg-blue-900/30 p-2 rounded-lg">
          <span className="text-xl">⚡</span>
        </div>
        Hackathon Compliance & Tech Stack
      </h3>
      
      <div className="space-y-8">
        {/* Technologies Grid */}
        <div>
          <h4 className="font-semibold text-gray-300 mb-4">
            Required Technologies:
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {technologies.map((tech, index) => (
              <div
                key={index}
                className={`p-4 ${tech.color} border border-gray-800 rounded-xl`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h5 className={`font-bold ${tech.textColor}`}>
                    {tech.name}
                  </h5>
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      tech.status === 'configured' || tech.status === 'ready'
                        ? 'bg-green-900/50 text-green-300'
                        : tech.status === 'demo'
                        ? 'bg-yellow-900/50 text-yellow-300'
                        : 'bg-gray-800 text-gray-300'
                    }`}
                  >
                    {tech.status}
                  </span>
                </div>
                <p className="text-sm text-gray-400">{tech.description}</p>
                {tech.required && (
                  <p className="text-xs text-gray-500 mt-2">✅ Required</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Hackathon Tracks */}
        <div>
          <h4 className="font-semibold text-gray-300 mb-4">
            Relevant Hackathon Tracks:
          </h4>
          <div className="space-y-3">
            {hackathonTracks.map((track, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 bg-gray-800/30 rounded-lg"
              >
                <div className="bg-purple-900/50 p-2 rounded-lg">
                  <span className="text-sm">🏆</span>
                </div>
                <div>
                  <p className="font-medium">{track}</p>
                  <p className="text-xs text-gray-400">
                    Our project qualifies for this category
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Technical Specifications */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-4 bg-gray-800/30 rounded-xl">
            <h5 className="font-semibold text-gray-300 mb-3">
              🏗️ Architecture
            </h5>
            <ul className="text-sm text-gray-400 space-y-2">
              <li className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                Full-stack Next.js 14 application
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                Serverless API endpoints
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                TypeScript for type safety
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                Tailwind CSS for styling
              </li>
            </ul>
          </div>

          <div className="p-4 bg-gray-800/30 rounded-xl">
            <h5 className="font-semibold text-gray-300 mb-3">
              🔧 Integration Points
            </h5>
            <ul className="text-sm text-gray-400 space-y-2">
              <li className="flex items-center gap-2">
                <span className="text-blue-400">↔</span>
                Gemini API for AI content generation
              </li>
              <li className="flex items-center gap-2">
                <span className="text-blue-400">↔</span>
                Circle Wallets for payment processing
              </li>
              <li className="flex items-center gap-2">
                <span className="text-blue-400">↔</span>
                Arc blockchain for settlement
              </li>
              <li className="flex items-center gap-2">
                <span className="text-blue-400">↔</span>
                Vercel for deployment and hosting
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}