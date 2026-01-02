```markdown
# Deployment Guide

## Prerequisites
- Node.js 18+
- npm or yarn
- Git
- Vercel account (for production)

## Local Development

### 1. Clone Repository
```bash
git clone https://github.com/BCBLearning/ai-jukebox.git
cd ai-jukebox
```

2. Install Dependencies

```bash
npm install
# or
yarn install
```

3. Environment Setup

```bash
cp .env.example .env.local
```

Edit .env.local:

```env
# Required for full functionality
GEMINI_API_KEY=your_gemini_key_here

# Optional - enables real payment simulation
CIRCLE_API_KEY=your_circle_key_here
CIRCLE_APP_ID=your_circle_app_id_here

# Optional - blockchain configuration
ARC_RPC_URL=https://rpc.arc-testnet.io
USDC_CONTRACT_ADDRESS=0x...

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. Run Development Server

```bash
npm run dev
# or
yarn dev
```

Visit: http://localhost:3000

Production Deployment

Option 1: Vercel (Recommended)

1. Import Repository

· Go to vercel.com
· Click "Add New" → "Project"
· Import from GitHub

2. Configure Project

· Framework: Next.js
· Root Directory: .
· Build Command: npm run build
· Output Directory: .next

3. Environment Variables

Add in Vercel dashboard:

```
GEMINI_API_KEY=your_key_here
CIRCLE_API_KEY=your_key_here (optional)
CIRCLE_APP_ID=your_app_id_here (optional)
ARC_RPC_URL=https://rpc.arc-testnet.io
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
NODE_ENV=production
```

4. Deploy

· Click "Deploy"
· Wait for build to complete
· Get your live URL

Option 2: Docker

1. Build Image

```bash
docker build -t ai-jukebox .
```

2. Run Container

```bash
docker run -p 3000:3000 \
  -e GEMINI_API_KEY=your_key \
  -e CIRCLE_API_KEY=your_key \
  -e CIRCLE_APP_ID=your_app_id \
  -e NODE_ENV=production \
  ai-jukebox
```

3. Docker Compose

```yaml
version: '3.8'
services:
  ai-jukebox:
    build: .
    ports:
      - "3000:3000"
    environment:
      - GEMINI_API_KEY=${GEMINI_API_KEY}
      - CIRCLE_API_KEY=${CIRCLE_API_KEY}
      - NODE_ENV=production
    restart: unless-stopped
```

Option 3: Manual Server

1. Build Application

```bash
npm run build
```

2. Start Production Server

```bash
npm start
```

3. Configure Reverse Proxy (Nginx)

```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Environment Variables Reference

Required for Full Functionality

Variable Description Example
GEMINI_API_KEY Google Gemini API key AIzaSy...
NEXT_PUBLIC_APP_URL Public URL of app https://ai-jukebox.vercel.app

Optional (Enhanced Features)

Variable Description Example
CIRCLE_API_KEY Circle API key for payments sandbox_...
CIRCLE_APP_ID Circle application ID app_...
ARC_RPC_URL Arc blockchain RPC URL https://rpc.arc-testnet.io
USDC_CONTRACT_ADDRESS USDC contract address 0x...
WALLET_PRIVATE_KEY Wallet for transactions 0x...

Application Settings

Variable Description Default
NODE_ENV Environment development
PORT Server port 3000
RATE_LIMIT_PER_MINUTE API rate limit 60
ENABLE_DEMO_MODE Demo mode without API keys true

Testing Deployment

1. Health Check

```bash
curl https://your-domain.vercel.app/api/config
```

Expected response:

```json
{"status":"operational","version":"1.0.0"}
```

2. Functionality Test

1. Visit your deployed URL
2. Try generating a song
3. Test payment simulation
4. Verify agent decisions are logged

3. Performance Test

```bash
# Test API response time
time curl -s https://your-domain.vercel.app/api/config > /dev/null

# Load test (using apache benchmark)
ab -n 100 -c 10 https://your-domain.vercel.app/api/config
```

Troubleshooting

Common Issues

1. Build Fails on Vercel

Error: Module not found
Solution:

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
git add .
git commit -m "Fix dependencies"
git push
```

2. API Keys Not Working

Error: Invalid API key
Solution:

· Verify keys in Vercel environment variables
· Check for typos
· Ensure keys have correct permissions

3. CORS Errors

Error: Access-Control-Allow-Origin
Solution:

· Update NEXT_PUBLIC_APP_URL to match your domain
· Check Vercel headers configuration

4. Memory Issues

Error: JavaScript heap out of memory
Solution:

```json
// package.json
{
  "scripts": {
    "build": "NODE_OPTIONS='--max-old-space-size=4096' next build"
  }
}
```

Monitoring & Maintenance

1. Logs

Vercel: Dashboard → Logs
Custom: Add logging service

```typescript
// Example: Logging middleware
export async function logRequest(req: Request, res: Response) {
  console.log({
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.url,
    status: res.statusCode,
    duration: Date.now() - startTime
  });
}
```

2. Analytics

· Vercel Analytics (built-in)
· Google Analytics
· Custom event tracking

3. Backup

· GitHub repository (code)
· Vercel deployments (auto-versioned)
· Database backup (if added)

Scaling Considerations

1. Database

Currently using in-memory storage. For production:

· Add PostgreSQL/MySQL
· Use Redis for caching
· Implement connection pooling

2. API Rate Limiting

· Implement Redis-based rate limiting
· Add API key authentication tiers
· Monitor and adjust limits

3. Blockchain Transactions

· Batch transactions where possible
· Implement transaction queue
· Add retry logic for failed transactions

Security Checklist

· API keys stored in environment variables
· HTTPS enforced
· CORS properly configured
· Input validation on all endpoints
· Rate limiting implemented
· Error messages don't leak sensitive info
· DDoS protection enabled (Vercel Pro)
· Regular dependency updates

Cost Optimization

· Vercel Hobby: Free for personal projects
· Gemini API: Pay-per-use, $0.0005/1K tokens
· Circle Sandbox: Free for testing
· Arc Testnet: Free transactions

Support

For deployment issues:

1. Check Vercel documentation
2. Review Next.js deployment guide
3. Open GitHub issue
4. Contact: your.email@example.com

```
