'use client'

import { useRef } from 'react'
import { m, useInView, useReducedMotion } from 'framer-motion'
import { site } from '@/content/site'

export default function BlogHero() {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' })
  const prefersReducedMotion = useReducedMotion()
  const hero = site.blog.hero

  return (
    <section ref={sectionRef} className="pt-20 sm:pt-28 lg:pt-36 pb-16 sm:pb-20 bg-black">
      <div className="container">
        <m.div
          className="max-w-3xl mx-auto text-center"
          initial={{ opacity: prefersReducedMotion ? 1 : 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          {hero.eyebrow ? (
            <p className="text-sm font-semibold tracking-widest uppercase mb-4 text-[var(--accent-teal)]">{hero.eyebrow}</p>
          ) : null}
          <h1 className="text-[36px] sm:text-[56px] md:text-[72px] font-semibold text-white leading-[1.12] sm:leading-[1.05] tracking-[-0.035em] mb-6 sm:mb-8">
            {hero.title}
          </h1>
          <p className="text-[20px] sm:text-[22px] lg:text-[26px] text-white/60 leading-[1.5] max-w-xl mx-auto">
            {hero.subtitle}
          </p>
        </m.div>
      </div>
    </section>
  )
}
