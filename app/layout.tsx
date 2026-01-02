import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AI Jukebox - Agentic Commerce on Arc Hackathon',
  description: 'Next-gen agentic commerce system with Gemini AI, USDC payments, and Arc blockchain',
  keywords: ['hackathon', 'Arc', 'Circle', 'USDC', 'Gemini AI', 'blockchain', 'agentic commerce'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-sans bg-gray-950 text-white antialiased">
        {children}
      </body>
    </html>
  )
}