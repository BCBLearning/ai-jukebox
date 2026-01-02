const fs = require('fs');
const path = require('path');

const PUBLIC_DIR = path.join(process.cwd(), 'public');

console.log('🚀 Génération des favicons (sans canvas, sans dépendances)');

// -----------------------------------------------------------------------------
// Utils
// -----------------------------------------------------------------------------
function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function write(file, content) {
  fs.writeFileSync(path.join(PUBLIC_DIR, file), content);
  console.log(`✅ ${file} créé`);
}

// -----------------------------------------------------------------------------
// Init
// -----------------------------------------------------------------------------
ensureDir(PUBLIC_DIR);

// -----------------------------------------------------------------------------
// 1. favicon.svg (source principale)
// -----------------------------------------------------------------------------
const faviconSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="100" height="100" viewBox="0 0 100 100"
  xmlns="http://www.w3.org/2000/svg" role="img" aria-label="AI Jukebox">
  <defs>
    <radialGradient id="g" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#8b5cf6"/>
      <stop offset="100%" stop-color="#3b82f6"/>
    </radialGradient>
    <filter id="s" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="4" stdDeviation="6"
        flood-color="#000" flood-opacity="0.35"/>
    </filter>
  </defs>

  <rect width="100" height="100" rx="20" fill="#1e1b4b"/>
  <g filter="url(#s)">
    <circle cx="50" cy="50" r="34" fill="url(#g)"/>
  </g>

  <!-- Icon center -->
  <g fill="#fff" stroke="#fff" stroke-width="3" stroke-linecap="round">
    <circle cx="50" cy="50" r="9"/>
    <line x1="60" y1="30" x2="60" y2="65"/>
    <path d="M60 30 Q76 40 66 50" fill="none"/>
  </g>
</svg>`;

write('favicon.svg', faviconSvg);

// -----------------------------------------------------------------------------
// 2. Safari pinned tab
// -----------------------------------------------------------------------------
const safariPinned = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
  <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0z"/>
</svg>`;

write('safari-pinned-tab.svg', safariPinned);

// -----------------------------------------------------------------------------
// 3. Apple touch icon (SVG fallback)
// -----------------------------------------------------------------------------
const appleTouchSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 180">
  <rect width="180" height="180" rx="40" fill="#1e1b4b"/>
  <circle cx="90" cy="90" r="60" fill="#8b5cf6"/>
  <circle cx="90" cy="90" r="18" fill="#ffffff"/>
</svg>`;

write('apple-touch-icon.svg', appleTouchSvg);

// -----------------------------------------------------------------------------
// 4. PWA manifest (SVG-first, sans PNG)
// -----------------------------------------------------------------------------
const manifest = {
  name: 'AI Jukebox – Agentic Commerce',
  short_name: 'AI Jukebox',
  description:
    'Next-gen agentic commerce platform with Gemini AI, USDC payments and Arc blockchain',
  start_url: '/',
  scope: '/',
  display: 'standalone',
  orientation: 'portrait',
  background_color: '#1e1b4b',
  theme_color: '#8b5cf6',
  icons: [
    {
      src: '/favicon.svg',
      sizes: 'any',
      type: 'image/svg+xml',
      purpose: 'any maskable'
    }
  ],
  categories: ['business', 'finance', 'music', 'technology']
};

write('site.webmanifest', JSON.stringify(manifest, null, 2));

// -----------------------------------------------------------------------------
// 5. Browserconfig (Windows tiles)
// -----------------------------------------------------------------------------
const browserConfig = `<?xml version="1.0" encoding="utf-8"?>
<browserconfig>
  <msapplication>
    <tile>
      <TileColor>#1e1b4b</TileColor>
    </tile>
  </msapplication>
</browserconfig>`;

write('browserconfig.xml', browserConfig);

// -----------------------------------------------------------------------------
// 6. favicon.ico (placeholder propre, non vide)
// -----------------------------------------------------------------------------
const icoPlaceholder = Buffer.from([
  0x00,0x00,0x01,0x00,0x01,0x00,
  0x10,0x10,0x00,0x00,0x01,0x00,
  0x04,0x00,0x28,0x01,0x00,0x00,
  0x16,0x00,0x00,0x00
]);

fs.writeFileSync(path.join(PUBLIC_DIR, 'favicon.ico'), icoPlaceholder);
console.log('✅ favicon.ico créé (placeholder valide)');

// -----------------------------------------------------------------------------
// Done
// -----------------------------------------------------------------------------
console.log('\n✨ Génération terminée');
console.log('📁 public/');
console.log('  • favicon.svg');
console.log('  • favicon.ico');
console.log('  • safari-pinned-tab.svg');
console.log('  • apple-touch-icon.svg');
console.log('  • site.webmanifest');
console.log('  • browserconfig.xml');