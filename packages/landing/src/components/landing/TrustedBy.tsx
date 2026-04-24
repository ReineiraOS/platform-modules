'use client'

import { m, useInView, useReducedMotion } from 'framer-motion'
import { useRef } from 'react'
import { site } from '@/content/site'

export default function TrustedBy() {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-50px' })
  const prefersReducedMotion = useReducedMotion()
  const trusted = site.home.trustedBy

  if (trusted.logos.length === 0) return null

  return (
    <section
      ref={sectionRef}
      className="relative py-8 sm:py-10 lg:py-12 bg-black border-b"
      style={{ borderColor: 'var(--border-dark)' }}
    >
      <div className="container">
        <p className="text-center text-sm font-medium text-white/40 tracking-widest uppercase mb-6">
          {trusted.title ?? 'Trusted by'}
        </p>
        <m.div
          className="grid grid-cols-3 sm:flex sm:flex-wrap items-center justify-center gap-x-6 gap-y-5 sm:gap-x-10 lg:gap-x-12"
          initial={prefersReducedMotion ? false : { opacity: 0 }}
          animate={isInView || prefersReducedMotion ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.4, ease: 'easeOut' }}
        >
          {trusted.logos.map((logo) => (
            <div
              key={logo.name}
              className="flex items-center justify-center h-8 px-3 text-[13px] font-medium text-white/40 border border-white/10 rounded"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              {logo.name}
            </div>
          ))}
        </m.div>
      </div>
    </section>
  )
}
