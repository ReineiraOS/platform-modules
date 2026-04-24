'use client'

import Link from 'next/link'
import { LogoWithText } from '@/components/ui'
import { site } from '@/content/site'

function BackArrow() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function BusinessHeader() {
  const brandName = site.meta.brandName
  const primary = site.header.primaryCta

  return (
    <header
      className="sticky top-0 left-0 right-0 z-50 h-[72px]"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.85)', backdropFilter: 'blur(20px)', borderBottom: '1px solid var(--border-dark)' }}
    >
      <nav className="container flex items-center h-full" aria-label="Business navigation">
        <Link href="/" className="flex items-center shrink-0" aria-label={`${brandName} Home`}>
          <LogoWithText height={26} />
        </Link>

        <div className="hidden lg:flex items-center gap-3 ml-auto">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors"
          >
            <BackArrow />
            Back to Home
          </Link>
          {primary.external ? (
            <a
              href={primary.href}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline-white px-5 py-2.5 text-sm font-medium rounded-full"
            >
              {primary.label}
            </a>
          ) : (
            <Link href={primary.href} className="btn-outline-white px-5 py-2.5 text-sm font-medium rounded-full">
              {primary.label}
            </Link>
          )}
        </div>

        <Link
          href="/"
          className="lg:hidden ml-auto inline-flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors"
          aria-label="Back to Home"
        >
          <BackArrow />
          <span className="hidden sm:inline">Home</span>
        </Link>
      </nav>
    </header>
  )
}
