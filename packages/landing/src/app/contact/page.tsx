'use client'

import { useRef } from 'react'
import { m, useInView, useReducedMotion } from 'framer-motion'
import { ArrowRight } from '@phosphor-icons/react'
import TopBanner from '@/components/landing/TopBanner'
import Header from '@/components/landing/Header'
import { Footer } from '@/components/landing'
import { getIcon } from '@/lib/icons'
import { site } from '@/content/site'

export default function ContactPage() {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-50px' })
  const prefersReducedMotion = useReducedMotion()
  const contact = site.contact

  return (
    <div className="min-h-screen bg-black">
      <TopBanner />
      <Header />

      <main ref={sectionRef} className="py-24 sm:py-32 lg:py-36">
        <section className="container">
          <m.div
            className="max-w-2xl mx-auto text-center mb-12 sm:mb-16 lg:mb-20"
            initial={prefersReducedMotion ? false : { opacity: 0 }}
            animate={isInView || prefersReducedMotion ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.8, ease: 'easeOut' }}
          >
            {contact.hero.eyebrow ? (
              <p className="text-sm font-semibold tracking-widest uppercase mb-3 sm:mb-4 text-[var(--accent-teal)]">
                {contact.hero.eyebrow}
              </p>
            ) : null}
            <h1 className="text-[28px] sm:text-3xl md:text-4xl lg:text-5xl font-semibold leading-[1.1] tracking-tight mb-4 sm:mb-5 text-white">
              {contact.hero.title}
            </h1>
            <p className="text-base sm:text-lg lg:text-xl leading-[1.6] max-w-lg mx-auto text-[var(--text-muted)]">
              {contact.hero.subtitle}
            </p>
          </m.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 lg:gap-6 max-w-3xl mx-auto">
            {contact.departments.map((dept, index) => {
              const Icon = getIcon(dept.icon)
              return (
                <m.a
                  key={dept.email}
                  href={`mailto:${dept.email}`}
                  className="group block p-6 sm:p-8 rounded-2xl border border-[var(--border-dark)] hover:border-[var(--border-dark-hover)] bg-[var(--color-bg-primary)] hover:bg-[var(--color-bg-secondary)] transition-colors duration-200"
                  initial={prefersReducedMotion ? false : { opacity: 0 }}
                  animate={isInView || prefersReducedMotion ? { opacity: 1 } : { opacity: 0 }}
                  transition={{
                    delay: prefersReducedMotion ? 0 : 0.1 + index * 0.1,
                    duration: prefersReducedMotion ? 0 : 0.6,
                    ease: 'easeOut',
                  }}
                >
                  <div
                    className="w-10 h-10 flex items-center justify-center rounded-xl mb-5"
                    style={{ backgroundColor: 'var(--accent-teal-bg)', color: 'var(--accent-teal)' }}
                  >
                    <Icon size={24} weight="duotone" />
                  </div>

                  <h2 className="text-base sm:text-lg font-medium text-white mb-2">{dept.label}</h2>
                  <p className="text-sm sm:text-[15px] leading-relaxed text-[var(--text-muted)] mb-4">
                    {dept.description}
                  </p>

                  <span className="inline-flex items-center gap-1.5 text-sm font-medium text-white/70 group-hover:text-white transition-colors break-all">
                    {dept.email}
                    <ArrowRight size={14} weight="regular" className="shrink-0" />
                  </span>
                </m.a>
              )
            })}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
