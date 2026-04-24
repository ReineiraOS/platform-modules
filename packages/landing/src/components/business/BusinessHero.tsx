'use client'

import Link from 'next/link'
import { m, useReducedMotion } from 'framer-motion'
import { site } from '@/content/site'

const DESKTOP_IMAGE_FADE_STYLE = {
  background: 'linear-gradient(to right, var(--color-bg-primary) 0%, transparent 40%)',
}

const MOBILE_HERO_GRADIENT_STYLE = {
  background: 'radial-gradient(ellipse at 50% 100%, var(--accent-bg) 0%, transparent 60%)',
}

const BUTTON_STYLE = { borderRadius: 'var(--radius-button)' }

export default function BusinessHero() {
  const prefersReducedMotion = useReducedMotion()
  const hero = site.business.hero
  const primary = hero.primaryCta
  const secondary = hero.secondaryCta

  return (
    <div className="relative overflow-hidden pt-[72px] min-h-svh flex flex-col lg:block">
      <div className="lg:hidden absolute inset-0 bg-[var(--color-surface-elevated)]" aria-hidden="true" />
      <div
        className="lg:hidden absolute inset-0 opacity-30 pointer-events-none z-[1]"
        style={MOBILE_HERO_GRADIENT_STYLE}
        aria-hidden="true"
      />

      <m.div
        className="hidden lg:block absolute top-1/2 -translate-y-1/2 -right-[10%] xl:-right-[5%] w-[800px] xl:w-[900px] 2xl:w-[1000px] aspect-square"
        initial={prefersReducedMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: prefersReducedMotion ? 0 : 0.5, ease: 'easeOut' }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-surface-card)] to-[var(--color-bg-secondary)] rounded-full" />
        <div className="absolute inset-0" style={DESKTOP_IMAGE_FADE_STYLE} aria-hidden="true" />
      </m.div>

      <div className="relative z-10 lg:bg-transparent flex-1 flex flex-col">
        <div className="container flex-1 flex flex-col">
          <div className="lg:min-h-[calc(100vh-72px)] flex-1 flex items-center pt-10 sm:pt-16 lg:pt-0 pb-6 sm:pb-12 lg:pb-0">
            <div className="max-w-2xl w-full">
              {hero.eyebrow ? (
                <p className="text-sm font-semibold tracking-widest uppercase mb-4 text-[var(--accent-teal)]">{hero.eyebrow}</p>
              ) : null}
              <h1 className="text-[28px] sm:text-[36px] lg:text-[44px] xl:text-[52px] font-medium text-white leading-[1.15] tracking-[-0.02em] mb-4 sm:mb-6">
                {hero.title}
              </h1>
              <p className="text-lg lg:text-xl text-white/60 leading-[1.5] mb-8 sm:mb-10 max-w-lg">{hero.subtitle}</p>

              <div className="flex flex-col sm:flex-row gap-3">
                {primary.external ? (
                  <a
                    href={primary.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-outline-white inline-flex items-center justify-center px-8 py-3.5 text-base font-medium whitespace-nowrap"
                    style={BUTTON_STYLE}
                  >
                    {primary.label}
                  </a>
                ) : (
                  <Link
                    href={primary.href}
                    className="btn-outline-white inline-flex items-center justify-center px-8 py-3.5 text-base font-medium whitespace-nowrap"
                    style={BUTTON_STYLE}
                  >
                    {primary.label}
                  </Link>
                )}
                {secondary ? (
                  <Link
                    href={secondary.href}
                    className="inline-flex items-center justify-center px-8 py-3.5 text-base font-medium text-white/70 hover:text-white border border-white/20 hover:border-white/40 rounded-full"
                  >
                    {secondary.label}
                  </Link>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
