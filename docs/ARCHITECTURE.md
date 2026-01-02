
# Technical Architecture

## System Overview
AI Jukebox is a full-stack Next.js application with serverless API endpoints, real-time frontend updates, and blockchain integration.

## Architecture Diagram
```

┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   API Layer     │    │   External      │
│   (Next.js 14)  │◄──►│   (Serverless)  │◄──►│   Services      │
│                 │    │                 │    │                 │
│  • Components   │    │  • /api/config  │    │  • Gemini AI    │
│  • State        │    │  • /api/generate│    │  • Circle API   │
│  • UI/UX        │    │  • /api/paiement│    │  • Arc RPC      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
│                       │                       │
▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   State         │    │   Blockchain    │    │   Deployment    │
│   Management    │    │   Layer         │    │   Platform      │
│                 │    │                 │    │                 │
│  • React State  │    │  • Arc Testnet  │    │  • Vercel       │
│  • LocalStorage │    │  • USDC         │    │  • Serverless   │
│  • Session      │    │  • Transactions │    │  • CDN          │
└─────────────────┘    └─────────────────┘    └─────────────────┘

Component Architecture

1. Frontend Components

· Header: Navigation and branding
· SongGenerator: AI prompt input and generation
· SongDisplay: Song visualization and agent analysis
· Playlist: Priority song listing
· AgentDecisions: Real-time agent log
· ConfigPanel: Settings and API status

2. API Endpoints

· GET /api/config: System configuration and health check
· POST /api/generate: Gemini AI song generation
· POST /api/paiement: USDC payment processing simulation

3. State Management

· React State: Local component state
· Context API: Cross-component state sharing
· LocalStorage: Persistence of user preferences
· URL State: Shareable application state

Data Flow

Song Generation Flow

1. User input → SongGenerator component
2. API call → /api/generate endpoint
3. Gemini AI → Song metadata generation
4. Response → SongDisplay component
5. State update → Global application state

Agentic Commerce Flow

1. Song data → Agent analysis
2. Scoring → 70-100 based on attributes
3. Decision → Autonomous/manual prioritization
4. Payment → /api/paiement simulation
5. Settlement → Arc blockchain (simulated)
6. Update → Playlist and agent log

Security Considerations

· API Keys: Environment variables, not in client code
· CORS: Properly configured for production
· Input Validation: All user inputs sanitized
· Error Handling: Graceful degradation

Performance Optimization

· Code Splitting: Dynamic imports for large components
· Image Optimization: Next.js Image component
· Caching: Strategic React memoization
· Bundle Analysis: Regular size monitoring

Database Schema (In-memory)

```typescript
interface Song {
  id: string;
  title: string;
  artist: string;
  genre: string;
  bpm: number;
  mood: string;
  score: number;
  coverArt: string;
  timestamp: Date;
  prioritized: boolean;
  transactionHash?: string;
}

interface AgentDecision {
  id: string;
  timestamp: Date;
  songId: string;
  action: 'analyze' | 'prioritize' | 'reject' | 'payment';
  score: number;
  reason: string;
  autonomous: boolean;
}

interface Transaction {
  id: string;
  timestamp: Date;
  songId: string;
  amount: number; // USDC
  status: 'pending' | 'confirmed' | 'failed';
  hash?: string;
  gasUsed?: number;
}
```

Environment Configuration

```env
# AI Services
GEMINI_API_KEY=your_gemini_api_key_here

# Circle & Blockchain
CIRCLE_API_KEY=your_circle_api_key_here
CIRCLE_APP_ID=your_circle_app_id_here
ARC_RPC_URL=https://rpc.arc-testnet.io
USDC_CONTRACT_ADDRESS=0x...

# Application
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://ai-jukebox-hackathon.vercel.app
```

Deployment Architecture

· Frontend: Vercel Edge Network (Global CDN)
· API: Vercel Serverless Functions (Auto-scaling)
· Static Assets: Vercel Blob Storage
· Monitoring: Vercel Analytics + Log Drain
· Security: Vercel Edge Firewall + DDoS Protection

```
