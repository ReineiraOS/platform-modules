'use client'

import Link from 'next/link'
import ImagePlaceholder from '@/components/placeholders/ImagePlaceholder'
import { site } from '@/content/site'

export default function CTA() {
  const cta = site.home.cta
  const primary = cta.primaryCta
  const secondary = cta.secondaryCta

  return (
    <section
      id="request-access"
      className="relative overflow-hidden flex items-center justify-center py-20 sm:py-24 lg:py-28"
    >
      <div className="absolute inset-0 z-[1] overflow-hidden" aria-hidden="true">
        <div className="absolute inset-[-8%]">
          <ImagePlaceholder description="CTA background visual" fill />
        </div>
      </div>

      <div
        className="absolute inset-0 z-[2] pointer-events-none"
        style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.15) 50%, rgba(0,0,0,0.25) 100%)' }}
        aria-hidden="true"
      />
      <div
        className="absolute top-0 left-0 right-0 h-16 sm:h-24 lg:h-32 z-[3] pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, var(--color-surface-elevated) 0%, var(--color-surface-elevated) 20%, transparent 100%)' }}
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 left-0 right-0 h-16 sm:h-24 z-[3] pointer-events-none"
        style={{ background: 'linear-gradient(to top, var(--color-surface-elevated) 0%, transparent 100%)' }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 z-[4] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 30%, var(--accent-bg) 0%, transparent 55%)',
          opacity: 0.55,
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 flex items-center justify-center px-6">
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto">
          <h2 className="text-[36px] sm:text-[44px] lg:text-[52px] font-medium leading-[1.1] tracking-[-0.03em] mb-5 sm:mb-6">
            {cta.title}
          </h2>
          {cta.subtitle ? (
            <p className="text-base sm:text-lg leading-relaxed mb-10 sm:mb-12" style={{ color: 'var(--text-muted)' }}>
              {cta.subtitle}
            </p>
          ) : null}

          <div className="flex flex-wrap items-center justify-center gap-4">
            {primary.external ? (
              <a href={primary.href} className="btn-cta-outline px-10 sm:px-12 py-4 text-lg font-medium">
                {primary.label}
              </a>
            ) : (
              <Link href={primary.href} className="btn-cta-outline px-10 sm:px-12 py-4 text-lg font-medium">
                {primary.label}
              </Link>
            )}
            {secondary ? (
              secondary.external ? (
                <a
                  href={secondary.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-10 py-4 text-lg font-medium transition-colors duration-200 text-text-muted hover:text-accent-teal"
                >
                  {secondary.label}
                </a>
              ) : (
                <Link
                  href={secondary.href}
                  className="inline-flex items-center gap-2 px-10 py-4 text-lg font-medium transition-colors duration-200 text-text-muted hover:text-accent-teal"
                >
                  {secondary.label}
                </Link>
              )
            ) : null}
          </div>
        </div>
      </div>
    </section>
  )
}
