'use client'

import { m, useReducedMotion } from 'framer-motion'
import { getIcon } from '@/lib/icons'
import { site } from '@/content/site'

export default function ComplianceSection() {
  const prefersReducedMotion = useReducedMotion()
  const block = site.home.compliance

  return (
    <section className="py-20 sm:py-28 lg:py-36 bg-black">
      <div className="container">
        <div className="max-w-3xl mb-12">
          {block.eyebrow ? (
            <p className="text-sm sm:text-base font-semibold tracking-widest uppercase mb-3 text-[var(--accent-teal)]">
              {block.eyebrow}
            </p>
          ) : null}
          <m.h2
            initial={prefersReducedMotion ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="text-[28px] sm:text-[36px] lg:text-[44px] font-medium text-white leading-[1.15] tracking-[-0.02em] mb-6 sm:mb-8"
          >
            {block.title}
          </m.h2>
          {block.subtitle ? <p className="text-base sm:text-lg text-white/60 leading-[1.7]">{block.subtitle}</p> : null}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
          {block.items.map((item) => {
            const Icon = getIcon(item.icon)
            return (
              <div key={item.title} className="p-8 bg-[var(--color-surface-card)] rounded-2xl border border-white/10">
                <div className="w-11 h-11 flex items-center justify-center rounded-lg mb-5 bg-white/5 text-white/70">
                  <Icon size={22} weight="duotone" />
                </div>
                <h3 className="text-xl font-medium text-white leading-[1.25] mb-3">{item.title}</h3>
                <p className="text-[15px] leading-[1.65] text-white/60">{item.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
