'use client'

import { m } from 'framer-motion'
import { getIcon } from '@/lib/icons'
import { site } from '@/content/site'

export default function ModernTeamsSection() {
  const block = site.home.modernTeams

  return (
    <section id="modern-teams" className="relative bg-black py-24 sm:py-32 lg:py-36">
      <div className="container">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 lg:gap-16 mb-12 sm:mb-16 lg:mb-20">
          <m.h2
            className="text-[32px] sm:text-[40px] lg:text-[48px] xl:text-[56px] font-medium text-white leading-[1.1] tracking-[-0.03em] max-w-md lg:max-w-lg"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            {block.title}
          </m.h2>
          {block.subtitle ? (
            <m.p
              className="text-base sm:text-lg lg:text-[22px] text-white/50 leading-[1.6] max-w-md lg:max-w-lg lg:pt-2"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            >
              {block.subtitle}
            </m.p>
          ) : null}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
          {block.items.map((item) => {
            const Icon = getIcon(item.icon)
            return (
              <article
                key={item.title}
                className="group relative bg-[var(--color-surface-card)] rounded-2xl border border-white/10 overflow-hidden min-h-[260px] sm:min-h-[300px] flex flex-col p-8 hover:border-white/20 transition-all duration-500"
              >
                <div className="w-11 h-11 flex items-center justify-center rounded-lg mb-5 bg-white/5 text-white/70">
                  <Icon size={22} weight="duotone" />
                </div>
                <h3 className="text-xl sm:text-2xl font-medium text-white leading-[1.25] tracking-[-0.02em] mb-3">
                  {item.title}
                </h3>
                <p className="text-[15px] leading-[1.65] text-white/60">{item.description}</p>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
