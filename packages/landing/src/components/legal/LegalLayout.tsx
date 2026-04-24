'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { LogoWithText } from '@/components/ui'
import { Footer } from '@/components/landing'

interface TableOfContentsItem {
  id: string
  title: string
}

interface LegalLayoutProps {
  title: string
  lastUpdated: string
  tableOfContents: TableOfContentsItem[]
  children: React.ReactNode
}

export default function LegalLayout({ title, lastUpdated, tableOfContents, children }: LegalLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState<string>('')

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMobileMenuOpen(false)
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // When rapid scrolling causes multiple entries to intersect in one batch,
        // pick the one closest to the top of the viewport.
        const intersecting = entries.filter((e) => e.isIntersecting)
        if (intersecting.length === 0) return

        const closest = intersecting.reduce((a, b) => (a.boundingClientRect.top <= b.boundingClientRect.top ? a : b))
        setActiveSection(closest.target.id)
      },
      { rootMargin: '-100px 0px -66% 0px' }
    )

    tableOfContents.forEach((item) => {
      const element = document.getElementById(item.id)
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [tableOfContents])

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      const offset = 100
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.scrollY - offset
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      })
    }
    setIsMobileMenuOpen(false)
  }

  return (
    <div className="min-h-screen bg-black">
      <header className="fixed top-0 left-0 right-0 z-50 header-backdrop">
        <nav className="container flex items-center justify-between h-16 sm:h-[72px]">
          <Link href="/">
            <LogoWithText height={26} />
          </Link>

          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M10 12L6 8L10 4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="hidden sm:inline">Back to Home</span>
            <span className="sm:hidden">Back</span>
          </Link>
        </nav>
      </header>

      <main className="pt-20 sm:pt-24">
        <div className="container pt-12 sm:pt-16 lg:pt-20 pb-10 sm:pb-12 lg:pb-16 border-b border-white/[0.06]">
          <p className="text-[13px] font-medium text-white/40 uppercase tracking-wider mb-4">Legal</p>
          <h1 className="text-[32px] sm:text-[40px] lg:text-[48px] font-medium text-white tracking-tight leading-[1.1] mb-4">
            {title}
          </h1>
          <p className="text-[15px] text-white/40">Last updated: {lastUpdated}</p>
        </div>

        <div className="container py-10 sm:py-12 lg:py-16">
          {/* Mobile TOC */}
          <div className="lg:hidden mb-8">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="w-full flex items-center justify-between py-4 px-5 bg-white/[0.03] border border-white/[0.06] rounded-xl text-sm font-medium text-white"
            >
              <span>Table of Contents</span>
              <svg
                className={`w-4 h-4 text-white/40 transition-transform ${isMobileMenuOpen ? 'rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isMobileMenuOpen && (
              <div className="mt-2 py-2 bg-white/[0.03] border border-white/[0.06] rounded-xl">
                {tableOfContents.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`w-full text-left px-5 py-2.5 text-[15px] transition-colors ${
                      activeSection === item.id
                        ? 'text-white bg-white/[0.04]'
                        : 'text-white/50 hover:text-white hover:bg-white/[0.02]'
                    }`}
                  >
                    {item.title}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-12 gap-8 lg:gap-16">
            {/* Sidebar TOC - Desktop */}
            <aside className="hidden lg:block lg:col-span-3">
              <nav className="sticky top-28">
                <p className="text-[13px] font-medium text-white/40 uppercase tracking-wider mb-6">On this page</p>
                <div className="space-y-1">
                  {tableOfContents.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => scrollToSection(item.id)}
                      className={`block w-full text-left py-2 text-[15px] transition-colors ${
                        activeSection === item.id ? 'text-white' : 'text-white/40 hover:text-white/70'
                      }`}
                    >
                      {item.title}
                    </button>
                  ))}
                </div>
              </nav>
            </aside>

            <article className="col-span-12 lg:col-span-9 lg:max-w-[720px]">
              <div className="legal-content">{children}</div>
            </article>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
