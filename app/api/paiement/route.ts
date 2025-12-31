import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { songTitle, artist, amount = '0.001' } = await request.json();
    const apiKey = process.env.CIRCLE_API_KEY;
    const appId = process.env.CIRCLE_APP_ID;

    if (!apiKey || !appId) {
      await new Promise(resolve => setTimeout(resolve, 1500));
      return NextResponse.json({
        success: true,
        demo: true,
        transaction: {
          id: `demo_tx_${Date.now()}`,
          amount: amount,
          currency: 'USDC',
          network: 'Arc Testnet',
          status: 'confirmed',
        },
        song: { title: songTitle, artist: artist, priority: 'HIGH', position: 1 },
        instructions: 'Configure Circle API keys for real transactions',
      });
    }

    // Mode réel à configurer plus tard

    return NextResponse.json({ success: true, demo: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message, demo: true }, { status: 500 });
  }
}

export async function GET() {
  const hasCircleKeys = !!(process.env.CIRCLE_API_KEY && process.env.CIRCLE_APP_ID);
  return NextResponse.json({
    circleConfigured: hasCircleKeys,
    status: hasCircleKeys ? 'ready_for_real_transactions' : 'demo_mode',
  });
}