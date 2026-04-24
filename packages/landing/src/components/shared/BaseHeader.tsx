'use client'

import { useState, useCallback, useRef, useEffect, type ReactNode } from 'react'
import Link from 'next/link'
import { LogoWithText } from '@/components/ui'
import { useScrolled } from '@/hooks/useScrolled'
import { useScrollLock } from '@/hooks/useScrollLock'
import { useEscapeKey } from '@/hooks/useEscapeKey'
import { site } from '@/content/site'

// Extracted style constants
const HEADER_SCROLLED_STYLE = {
  backgroundColor: 'rgba(0, 0, 0, 0.8)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  borderBottom: '1px solid var(--border-dark)',
}

const HEADER_DEFAULT_STYLE = {
  backgroundColor: 'transparent',
  backdropFilter: 'blur(0px)',
  WebkitBackdropFilter: 'blur(0px)',
  borderBottom: '1px solid transparent',
}

export interface NavLink {
  href: string
  label: string
}

interface BaseHeaderProps {
  navLinks: NavLink[]
  desktopCTA: ReactNode
  mobileCTA: ReactNode
  ariaLabel: string
  logoHref: string
}

export default function BaseHeader({ navLinks, desktopCTA, mobileCTA, ariaLabel, logoHref }: BaseHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const isScrolled = useScrolled(50)
  const hamburgerRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const previousIsMenuOpenRef = useRef(false)

  useScrollLock(isMenuOpen)
  useEscapeKey(useCallback(() => setIsMenuOpen(false), []))

  // Focus trap: move focus into menu on open, restore on close
  useEffect(() => {
    if (isMenuOpen) {
      const menu = menuRef.current
      if (menu) {
        const focusable = menu.querySelectorAll<HTMLElement>(
          'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
        )
        if (focusable.length > 0) {
          focusable[0].focus()
        }
      }
    } else if (previousIsMenuOpenRef.current) {
      hamburgerRef.current?.focus()
    }
    previousIsMenuOpenRef.current = isMenuOpen
  }, [isMenuOpen])

  const handleMenuKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key !== 'Tab') return
    const menu = menuRef.current
    if (!menu) return

    const focusable = menu.querySelectorAll<HTMLElement>(
      'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
    )
    if (focusable.length === 0) return

    const first = focusable[0]
    const last = focusable[focusable.length - 1]

    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault()
        last.focus()
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
  }, [])

  const handleLinkClick = () => {
    setIsMenuOpen(false)
  }

  return (
    <>
      <header
        className="sticky top-0 left-0 right-0 z-50 transition-[background-color,backdrop-filter,border-color] duration-300"
        style={isScrolled ? HEADER_SCROLLED_STYLE : HEADER_DEFAULT_STYLE}
      >
        <nav className="container flex items-center justify-between h-[72px]" aria-label={ariaLabel}>
          <Link href={logoHref} className="flex items-center" aria-label={`${site.meta.brandName} Home`}>
            <LogoWithText height={26} />
          </Link>

          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-sm font-medium transition-colors rounded-lg hover:bg-white/5 text-text-muted"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-3">{desktopCTA}</div>

          <button
            ref={hamburgerRef}
            className="lg:hidden flex items-center justify-center w-11 h-11 rounded-lg transition-colors hover:bg-white/5"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          >
            <div className="relative w-5 h-4">
              <span
                className={`absolute left-0 w-5 h-0.5 bg-white transition-all duration-300 ease-out ${
                  isMenuOpen ? 'top-[7px] rotate-45' : 'top-0 rotate-0'
                }`}
              />
              <span
                className={`absolute left-0 top-[7px] w-5 h-0.5 bg-white transition-all duration-300 ease-out ${
                  isMenuOpen ? 'opacity-0 scale-0' : 'opacity-100 scale-100'
                }`}
              />
              <span
                className={`absolute left-0 w-5 h-0.5 bg-white transition-all duration-300 ease-out ${
                  isMenuOpen ? 'top-[7px] -rotate-45' : 'top-[14px] rotate-0'
                }`}
              />
            </div>
          </button>
        </nav>
      </header>

      {/* Mobile Menu - Full Screen Drawer */}
      <div
        ref={menuRef}
        id="mobile-menu"
        className={`fixed inset-0 z-[60] lg:hidden transition-transform duration-300 ease-out bg-[var(--color-surface-elevated)] ${
          isMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-hidden={!isMenuOpen}
        onKeyDown={handleMenuKeyDown}
      >
        <div className="flex items-center justify-between px-5 sm:px-6 h-[72px] border-b border-white/[0.08]">
          <Link href={logoHref} onClick={handleLinkClick} aria-label={`${site.meta.brandName} Home`}>
            <LogoWithText height={24} />
          </Link>
          <button
            onClick={() => setIsMenuOpen(false)}
            className="flex items-center justify-center w-11 h-11 rounded-full transition-colors bg-white/[0.06]"
            aria-label="Close menu"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        <nav className="px-5 sm:px-6 pt-8">
          <ul className="space-y-2">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={handleLinkClick}
                  className="block py-3 text-[22px] font-medium text-white transition-opacity hover:opacity-70"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-10 pt-8 space-y-3 border-t border-white/[0.08]" onClick={handleLinkClick}>
            {mobileCTA}
          </div>
        </nav>
      </div>
    </>
  )
}
