'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { m, useInView, useReducedMotion } from 'framer-motion'
import { site } from '@/content/site'

export default function MobileCTA() {
  const cta = site.mobile.cta
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' })
  const prefersReducedMotion = useReducedMotion()

  const primary = cta.primaryCta
  const secondary = cta.secondaryCta

  return (
    <section
      ref={sectionRef}
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
          <m.h2
            className="text-[28px] sm:text-3xl md:text-4xl lg:text-5xl font-semibold leading-[1.1] tracking-tight mb-4 sm:mb-5 text-white"
            initial={prefersReducedMotion ? false : { opacity: 0 }}
            animate={isInView || prefersReducedMotion ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.5, ease: 'easeOut' }}
          >
            {cta.title}
          </m.h2>
          {cta.subtitle ? (
            <m.p
              className="text-base sm:text-lg lg:text-xl leading-relaxed mb-8 sm:mb-10 text-white/50"
              initial={prefersReducedMotion ? false : { opacity: 0 }}
              animate={isInView || prefersReducedMotion ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.5, ease: 'easeOut' }}
            >
              {cta.subtitle}
            </m.p>
          ) : null}

          <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
            {primary.external ? (
              <a
                href={primary.href}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 text-base font-medium whitespace-nowrap transition-all hover:opacity-90 cursor-pointer bg-accent-teal text-foreground rounded-full"
              >
                {primary.label}
              </a>
            ) : (
              <Link
                href={primary.href}
                className="px-6 py-3.5 text-base font-medium whitespace-nowrap transition-all hover:opacity-90 cursor-pointer bg-accent-teal text-foreground rounded-full text-center"
              >
                {primary.label}
              </Link>
            )}
            {secondary ? (
              <Link
                href={secondary.href}
                className="px-6 py-3.5 text-base font-medium whitespace-nowrap transition-colors text-white/70 hover:text-white border border-white/20 hover:border-white/40 rounded-full text-center"
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
