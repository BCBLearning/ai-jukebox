```markdown
# API Documentation

## Overview
AI Jukebox provides RESTful API endpoints for song generation, payment processing, and system configuration.

## Base URL
- **Development**: `http://localhost:3000/api`
- **Production**: `https://ai-jukebox-hackathon.vercel.app/api`

## Authentication
Currently, API endpoints are public for the hackathon demo. In production, endpoints would use API keys or JWT tokens.

## Endpoints

### 1. GET `/api/config`
Get system configuration and health status.

**Request:**
```http
GET /api/config
```

Response:

```json
{
  "status": "operational",
  "version": "1.0.0",
  "services": {
    "gemini": "available",
    "circle": "simulated",
    "arc": "simulated"
  },
  "modes": {
    "autonomous": true,
    "demo": false
  },
  "timestamp": "2024-03-08T12:00:00Z"
}
```

Status Codes:

· 200: Success
· 500: Internal server error

2. POST /api/generate

Generate a song using Gemini AI.

Request:

```http
POST /api/generate
Content-Type: application/json

{
  "prompt": "synthwave night driving",
  "model": "gemini-pro" | "gemini-pro-vision",
  "includeImage": true
}
```

Parameters:

· prompt (string, required): Description of the song
· model (string, optional): Gemini model to use (default: gemini-pro)
· includeImage (boolean, optional): Generate album art (default: true)

Response:

```json
{
  "success": true,
  "song": {
    "id": "song_123456",
    "title": "Neon Highway",
    "artist": "AI Composer",
    "genre": "Synthwave",
    "bpm": 128,
    "mood": "nostalgic, energetic",
    "score": 87,
    "coverArt": "data:image/svg+xml;base64,...",
    "analysis": "High energy synthwave with retro influences...",
    "timestamp": "2024-03-08T12:00:00Z"
  },
  "metadata": {
    "model": "gemini-pro",
    "generationTime": "2.3s",
    "tokensUsed": 245
  }
}
```

Error Response:

```json
{
  "success": false,
  "error": "Invalid prompt",
  "message": "Prompt must be between 5 and 500 characters",
  "demoData": {
    "song": {
      "id": "demo_song_001",
      "title": "Demo Track",
      "artist": "Demo Artist",
      "genre": "Electronic",
      "bpm": 120,
      "mood": "energetic",
      "score": 85,
      "coverArt": "data:image/svg+xml;base64,...",
      "timestamp": "2024-03-08T12:00:00Z"
    }
  }
}
```

Status Codes:

· 200: Success
· 400: Bad request (invalid parameters)
· 429: Rate limit exceeded
· 500: AI service error

3. POST /api/paiement

Process USDC payment for song prioritization.

Request:

```http
POST /api/paiement
Content-Type: application/json

{
  "songId": "song_123456",
  "amount": 0.001,
  "priority": "high" | "medium" | "low",
  "autonomous": false,
  "agentReason": "Song scored above threshold"
}
```

Parameters:

· songId (string, required): ID of song to prioritize
· amount (number, required): USDC amount (default: 0.001)
· priority (string, optional): Priority level
· autonomous (boolean, optional): Whether initiated by agent
· agentReason (string, optional): Agent's reasoning

Response (Success):

```json
{
  "success": true,
  "transaction": {
    "id": "tx_789012",
    "songId": "song_123456",
    "amount": 0.001,
    "currency": "USDC",
    "status": "confirmed",
    "hash": "0x123abc...",
    "gasUsed": 45000,
    "gasPrice": "0.000000001",
    "timestamp": "2024-03-08T12:00:00Z",
    "blockNumber": 1234567,
    "finality": "sub-second"
  },
  "song": {
    "prioritized": true,
    "priorityLevel": "high",
    "boostedUntil": "2024-03-15T12:00:00Z"
  }
}
```

Response (Simulated - No API Key):

```json
{
  "success": true,
  "simulated": true,
  "transaction": {
    "id": "sim_tx_001",
    "songId": "song_123456",
    "amount": 0.001,
    "currency": "USDC",
    "status": "confirmed",
    "hash": "0xSIMULATED123...",
    "gasUsed": 42000,
    "timestamp": "2024-03-08T12:00:00Z",
    "network": "Arc Testnet",
    "finality": "0.8s"
  },
  "message": "Payment simulated - add Circle API key for real transactions"
}
```

Status Codes:

· 200: Success
· 400: Invalid payment request
· 402: Payment required (insufficient balance)
· 409: Duplicate transaction
· 500: Payment processing error

Rate Limiting

· Free tier: 10 requests/minute per IP
· With API key: 60 requests/minute
· Burst: Allow 5 requests in 10 seconds

Error Handling

All errors follow this format:

```json
{
  "error": "ERROR_CODE",
  "message": "Human readable message",
  "details": { ... },
  "timestamp": "2024-03-08T12:00:00Z"
}
```

Common Error Codes:

· INVALID_INPUT: Request validation failed
· AI_SERVICE_UNAVAILABLE: Gemini API is down
· PAYMENT_FAILED: Transaction failed
· RATE_LIMITED: Too many requests
· INSUFFICIENT_BALANCE: Not enough USDC

Webhook Events (Future Implementation)

```typescript
// Payment confirmed webhook
{
  "event": "payment.confirmed",
  "data": {
    "transactionId": "tx_123",
    "songId": "song_456",
    "amount": 0.001,
    "status": "confirmed",
    "timestamp": "2024-03-08T12:00:00Z"
  }
}

// Agent decision webhook
{
  "event": "agent.decision",
  "data": {
    "agentId": "agent_001",
    "action": "prioritize",
    "songId": "song_456",
    "score": 92,
    "reason": "High artistic merit",
    "autonomous": true,
    "timestamp": "2024-03-08T12:00:00Z"
  }
}
```

Testing

```bash
# Test config endpoint
curl https://ai-jukebox-hackathon.vercel.app/api/config

# Test song generation
curl -X POST https://ai-jukebox-hackathon.vercel.app/api/generate \
  -H "Content-Type: application/json" \
  -d '{"prompt": "ambient space music"}'

# Test payment (simulated)
curl -X POST https://ai-jukebox-hackathon.vercel.app/api/paiement \
  -H "Content-Type: application/json" \
  -d '{"songId": "test_song", "amount": 0.001}'
```

SDK Examples (Future)

```javascript
// JavaScript SDK
import { AIJukebox } from 'ai-jukebox-sdk';

const jukebox = new AIJukebox({
  apiKey: 'your_api_key',
  mode: 'production'
});

// Generate song
const song = await jukebox.generateSong({
  prompt: 'jazz fusion with electronic elements'
});

// Prioritize song
const transaction = await jukebox.prioritizeSong({
  songId: song.id,
  amount: 0.001
});
```

Versioning

API version is included in the URL path: /api/v1/generate

Current version: v1.0.0

```