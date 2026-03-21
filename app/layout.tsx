import type { Metadata } from 'next'
import { Poppins, Inter, Playfair_Display } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from 'sonner'
import Navbar from '@/components/shared/Navbar'
import Footer from '@/components/shared/Footer'
import ScrollToTop from '@/components/shared/ScrollToTop'
import ChatbotFloat from '@/components/shared/ChatbotFloat'
import BottomNav from '@/components/shared/BottomNav'
import AuthGate from '@/components/shared/AuthGate'
import './globals.css'

const _poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: '--font-poppins' });
const _inter = Inter({ subsets: ["latin"], variable: '--font-inter' });
const _playfair = Playfair_Display({ subsets: ["latin"], weight: ["600", "700"], variable: '--font-playfair' });

export const metadata: Metadata = {
  title: 'Stuffed Happiness Hub | Emotional Gifting Store',
  description: 'Make every moment special with premium stuffed toys and emotional gifts for girlfriend, kids, friends, and family.',
  icons: {
    icon: '/favicon.ico?v=2',
    shortcut: '/favicon.ico?v=2',
    apple: '/favicon.png?v=2',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${_poppins.variable} ${_inter.variable} ${_playfair.variable}`}>
      <body className="bg-background text-foreground">
        <AuthGate>
          <Navbar />
          <main className="min-h-screen pb-20 lg:pb-0">
            {children}
          </main>
          <Footer />
          <BottomNav />
        </AuthGate>
        <ChatbotFloat />
        <ScrollToTop />
        <Toaster richColors position="top-right" />
        <Analytics />
      </body>
    </html>
  )
}
