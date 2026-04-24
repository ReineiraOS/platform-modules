'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { m, useInView, useReducedMotion } from 'framer-motion'
import { site } from '@/content/site'

export default function Hero() {
  const prefersReducedMotion = useReducedMotion()
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-50px' })
  const hero = site.home.hero

  const renderCta = (
    cta: { label: string; href: string; external?: boolean } | null | undefined,
    variant: 'primary' | 'secondary',
  ) => {
    if (!cta) return null
    const className =
      variant === 'primary'
        ? 'inline-flex items-center px-8 py-3.5 text-base font-medium rounded-full transition-all hover:opacity-90 cursor-pointer bg-accent-teal text-foreground'
        : 'inline-flex items-center justify-center px-8 py-3.5 text-base font-medium rounded-full whitespace-nowrap transition-colors text-white/70 hover:text-white border border-white/20 hover:border-white/40'

    const isExternal = cta.external || cta.href.startsWith('http')
    if (isExternal) {
      return (
        <a href={cta.href} target="_blank" rel="noopener noreferrer" className={className}>
          {cta.label}
        </a>
      )
    }
    return (
      <Link href={cta.href} className={className}>
        {cta.label}
      </Link>
    )
  }

  return (
    <section ref={sectionRef} className="relative pt-28 sm:pt-28 lg:pt-36 pb-20 sm:pb-24 lg:pb-28 bg-black">
      <div className="container">
        <div className="max-w-4xl mx-auto text-center">
          <m.h1
            className="text-[36px] sm:text-[56px] md:text-[72px] lg:text-[84px] font-semibold text-white leading-[1.12] sm:leading-[1.05] tracking-[-0.035em] mb-6 sm:mb-8"
            initial={prefersReducedMotion ? false : { opacity: 0 }}
            animate={isInView || prefersReducedMotion ? { opacity: 1 } : { opacity: 0 }}
            transition={{
              duration: prefersReducedMotion ? 0 : 0.5,
              ease: 'easeOut',
            }}
          >
            {hero.title}
          </m.h1>

          {hero.subtitle ? (
            <m.p
              className="text-[20px] sm:text-[22px] lg:text-[26px] text-white/60 leading-[1.5] mb-10 sm:mb-12 max-w-2xl mx-auto"
              initial={prefersReducedMotion ? false : { opacity: 0 }}
              animate={isInView || prefersReducedMotion ? { opacity: 1 } : { opacity: 0 }}
              transition={{
                duration: prefersReducedMotion ? 0 : 0.5,
                ease: 'easeOut',
              }}
            >
              {hero.subtitle}
            </m.p>
          ) : null}

          <m.div
            className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4"
            initial={prefersReducedMotion ? false : { opacity: 0 }}
            animate={isInView || prefersReducedMotion ? { opacity: 1 } : { opacity: 0 }}
            transition={{
              duration: prefersReducedMotion ? 0 : 0.5,
              ease: 'easeOut',
            }}
          >
            {renderCta(hero.primaryCta, 'primary')}
            {renderCta(hero.secondaryCta, 'secondary')}
          </m.div>
        </div>
      </div>
    </section>
  )
}
