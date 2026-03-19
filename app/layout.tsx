import type { Metadata } from 'next'
import { Poppins, Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from 'sonner'
import Navbar from '@/components/shared/Navbar'
import Footer from '@/components/shared/Footer'
import ScrollToTop from '@/components/shared/ScrollToTop'
import './globals.css'

const _poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: '--font-poppins' });
const _inter = Inter({ subsets: ["latin"], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Stuffed Happiness Hub | Emotional Gifting Store',
  description: 'Make every moment special with premium stuffed toys and emotional gifts for girlfriend, kids, friends, and family.',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${_poppins.variable} ${_inter.variable}`}>
      <body className="bg-background text-foreground">
        <Navbar />
        <main className="min-h-screen pb-16 lg:pb-0">
          {children}
        </main>
        <Footer />
        <ScrollToTop />
        <Toaster richColors position="top-right" />
        <Analytics />
      </body>
    </html>
  )
}
