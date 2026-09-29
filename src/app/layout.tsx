import type { Metadata, Viewport } from 'next'
import localFont from 'next/font/local'
import { SITE_CONFIG } from '@/site.config'
import './globals.css'

// Self-hosted (Playfair Display and Figtree, SIL Open Font License) so builds never depend on Google Fonts.
const serif = localFont({
  src: [
    { path: '../fonts/playfair-display-latin-400-normal.woff2', weight: '400', style: 'normal' },
    { path: '../fonts/playfair-display-latin-400-italic.woff2', weight: '400', style: 'italic' },
    { path: '../fonts/playfair-display-latin-500-normal.woff2', weight: '500', style: 'normal' },
  ],
  variable: '--font-serif',
  display: 'swap',
  fallback: ['Georgia', 'Times New Roman', 'serif'],
})
const sans = localFont({
  src: [
    { path: '../fonts/figtree-latin-400-normal.woff2', weight: '400', style: 'normal' },
    { path: '../fonts/figtree-latin-500-normal.woff2', weight: '500', style: 'normal' },
    { path: '../fonts/figtree-latin-600-normal.woff2', weight: '600', style: 'normal' },
  ],
  variable: '--font-sans',
  display: 'swap',
  fallback: ['Helvetica', 'Arial', 'sans-serif'],
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.url),
  applicationName: SITE_CONFIG.name,
}

export const viewport: Viewport = {
  themeColor: '#F7F4EF',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-AU" className={`${serif.variable} ${sans.variable}`}>
      <body>{children}</body>
    </html>
  )
}
