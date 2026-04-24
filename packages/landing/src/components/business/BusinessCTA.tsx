'use client'

import Link from 'next/link'
import { site } from '@/content/site'

const BUTTON_STYLE = { borderRadius: 'var(--radius-button)' }

export default function BusinessCTA() {
  const cta = site.business.cta
  const primary = cta.primaryCta
  const secondary = cta.secondaryCta

  return (
    <section
      id="request-access"
      className="relative overflow-hidden py-20 sm:py-28 lg:py-32 bg-[var(--color-surface-elevated)]"
    >
      <div
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 0%, var(--accent-bg) 0%, transparent 60%)' }}
        aria-hidden="true"
      />

      <div className="container relative z-10">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-[28px] sm:text-3xl md:text-4xl lg:text-5xl font-semibold leading-[1.1] tracking-tight mb-4 sm:mb-5 text-white">
            {cta.title}
          </h2>
          {cta.subtitle ? (
            <p className="text-base sm:text-lg lg:text-xl leading-relaxed mb-8 sm:mb-10 text-white/50">{cta.subtitle}</p>
          ) : null}

          <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
            {primary.external ? (
              <a
                href={primary.href}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline-white px-6 py-3.5 text-base font-medium whitespace-nowrap"
                style={BUTTON_STYLE}
              >
                {primary.label}
              </a>
            ) : (
              <Link
                href={primary.href}
                className="btn-outline-white px-6 py-3.5 text-base font-medium whitespace-nowrap"
                style={BUTTON_STYLE}
              >
                {primary.label}
              </Link>
            )}
            {secondary ? (
              <Link
                href={secondary.href}
                className="px-6 py-3.5 text-base font-medium text-white/70 hover:text-white border border-white/20 hover:border-white/40 rounded-full text-center"
              >
                {secondary.label}
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  )
}
