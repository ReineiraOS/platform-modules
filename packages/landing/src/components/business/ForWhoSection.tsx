'use client'

import { m, useReducedMotion } from 'framer-motion'
import { getIcon } from '@/lib/icons'
import { site } from '@/content/site'

export default function ForWhoSection() {
  const prefersReducedMotion = useReducedMotion()
  const block = site.home.forWho

  return (
    <section
      id="use-cases"
      className="relative py-20 sm:py-28 lg:py-36 bg-black border-y"
      style={{ borderColor: 'var(--border-dark)' }}
    >
      <div className="container relative z-10">
        <m.h2
          className="text-[28px] sm:text-[36px] lg:text-[44px] font-medium leading-[1.2] tracking-[-0.02em] mb-12 sm:mb-16 lg:mb-20 text-white"
          initial={prefersReducedMotion ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          {block.title}
          {block.subtitle ? <span className="text-white/50"> {block.subtitle}</span> : null}
        </m.h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-6 sm:gap-x-8 sm:gap-y-8 lg:gap-y-10">
          {block.items.map((item) => {
            const Icon = getIcon(item.icon)
            return (
              <div key={item.title} className="border-l-2 border-white/20 pl-5">
                <div className="flex items-center gap-2 mb-1 text-white/60">
                  <Icon size={16} weight="regular" />
                </div>
                <p className="text-xl sm:text-2xl lg:text-[28px] font-semibold text-white leading-tight tracking-tight mb-1">
                  {item.title}
                </p>
                <p className="text-sm text-white/50">{item.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
