'use client'

import { useRef } from 'react'
import { m, useInView, useReducedMotion } from 'framer-motion'
import { getIcon } from '@/lib/icons'
import { site } from '@/content/site'

export default function PricingFeatures() {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' })
  const prefersReducedMotion = useReducedMotion()
  const block = site.pricing.features

  return (
    <section
      ref={sectionRef}
      className="py-20 sm:py-28 lg:py-36 bg-black border-t"
      style={{ borderColor: 'var(--border-dark)' }}
    >
      <div className="container">
        <div className="max-w-4xl mx-auto">
          <m.div
            className="text-center mb-14 sm:mb-16 lg:mb-20"
            initial={{ opacity: prefersReducedMotion ? 1 : 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            {block.eyebrow ? (
              <p className="text-sm font-semibold tracking-widest uppercase mb-4 text-[var(--accent-teal)]">{block.eyebrow}</p>
            ) : null}
            <h2 className="text-[32px] sm:text-[40px] lg:text-[48px] font-medium text-white leading-[1.1] tracking-[-0.03em] mb-5">
              {block.title}
            </h2>
            {block.subtitle ? (
              <p className="text-base sm:text-lg text-white/50 max-w-xl mx-auto">{block.subtitle}</p>
            ) : null}
          </m.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
            {block.items.map((item) => {
              const Icon = getIcon(item.icon)
              return (
                <div key={item.title} className="p-6 bg-[var(--color-surface-card)] rounded-2xl border border-white/10">
                  <div className="w-10 h-10 flex items-center justify-center rounded-lg mb-4 bg-white/5 text-white/70">
                    <Icon size={18} weight="duotone" />
                  </div>
                  <h3 className="text-lg font-medium text-white leading-[1.25] mb-2">{item.title}</h3>
                  <p className="text-[14px] leading-[1.65] text-white/60">{item.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
