import type { Metadata, Viewport } from 'next'
import './globals.css'
import MotionProvider from '@/components/MotionProvider'
import { site } from '@/content/site'
import { design } from '@/content/design'
import { buildAccentTokens } from '@/lib/accent-scale'

const siteUrl = site.meta.siteUrl
const brandName = site.meta.brandName

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#000000',
}

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${brandName} | ${site.meta.tagline}`,
    template: `%s | ${brandName}`,
  },
  description: site.meta.description,
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32', type: 'image/x-icon' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: { url: '/favicon.svg', sizes: '180x180' },
  },
  keywords: site.meta.keywords,
  authors: [{ name: brandName }],
  creator: brandName,
  publisher: brandName,
  formatDetection: { telephone: false },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: `${brandName} | ${site.meta.tagline}`,
    description: site.meta.description,
    type: 'website',
    url: siteUrl,
    siteName: brandName,
    locale: 'en_US',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: `${brandName} — ${site.meta.tagline}`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${brandName} | ${site.meta.tagline}`,
    description: site.meta.description,
    images: ['/og-image.jpg'],
    ...(site.meta.twitterHandle ? { creator: site.meta.twitterHandle, site: site.meta.twitterHandle } : {}),
  },
  alternates: { canonical: siteUrl },
  other: { 'msapplication-TileColor': '#000000' },
}

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: brandName,
  description: site.meta.description,
  url: siteUrl,
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Web',
  creator: {
    '@type': 'Organization',
    name: brandName,
    url: siteUrl,
    sameAs: site.meta.social.map((s) => s.href),
  },
}

function brandingStyle(): Record<string, string> {
  const o = design.overrides ?? {}
  const b = site.branding
  const fontSans = o.fontSans ?? b.fontSans
  const fontMono = o.fontMono ?? b.fontMono
  const radius = { ...(b.borderRadius ?? {}), ...(o.borderRadius ?? {}) }
  const borderWidth = o.borderWidth ?? b.borderWidth
  const s: Record<string, string> = {}

  const t = buildAccentTokens(site.branding.accent)
  s['--accent'] = t.accent
  s['--accent-hover'] = t.accentHover
  s['--accent-bright'] = t.accentBright
  s['--accent-bg'] = t.accentBg
  s['--accent-bg-hover'] = t.accentBgHover
  s['--accent-border'] = t.accentBorder
  s['--accent-glow'] = t.shadowGlow
  s['--accent-teal'] = t.accent
  s['--accent-teal-hover'] = t.accentHover
  s['--accent-teal-bright'] = t.accentBright
  s['--accent-primary'] = t.accent
  s['--accent-secondary'] = t.accentHover
  s['--accent-warm'] = t.accentHover
  s['--accent-teal-bg'] = t.accentBg
  s['--accent-teal-bg-hover'] = t.accentBgHover
  s['--accent-teal-border'] = t.accentBorder
  s['--shadow-teal-glow'] = t.shadowGlow
  s['--shadow-teal-glow-strong'] = t.shadowGlowStrong

  if (fontSans) s['--font-sans'] = fontSans
  if (fontMono) s['--font-mono'] = fontMono
  if (radius.button) s['--radius-button'] = radius.button
  if (radius.block) s['--radius-block'] = radius.block
  if (radius.xl) s['--radius-xl'] = radius.xl
  if (borderWidth) s['--border-width'] = borderWidth

  return s
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const style = brandingStyle() as React.CSSProperties

  return (
    <html lang="en" style={style}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className="antialiased">
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  )
}
