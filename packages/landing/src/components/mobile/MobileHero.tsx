'use client'

import { useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { m, useInView, useReducedMotion } from 'framer-motion'
import ImagePlaceholder from '@/components/placeholders/ImagePlaceholder'
import { site } from '@/content/site'

export default function MobileHero() {
  const hero = site.mobile.hero
  const prefersReducedMotion = useReducedMotion()
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })

  const primary = hero.primaryCta
  const secondary = hero.secondaryCta

  return (
    <section ref={sectionRef} className="relative flex items-center overflow-hidden min-h-screen">
      <div className="absolute inset-0 z-0" aria-hidden="true">
        <ImagePlaceholder description="Mobile hero background" fill />
      </div>
      <div
        className="absolute inset-0 z-[1]"
        style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.45) 50%, rgba(0,0,0,0.65) 100%)' }}
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 left-0 right-0 h-40 z-[2]"
        style={{ background: 'linear-gradient(to top, var(--background), transparent)' }}
        aria-hidden="true"
      />

      <div className="container relative z-10 py-24 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <m.div
            className="text-center lg:text-left order-2 lg:order-1"
            initial={prefersReducedMotion ? false : { opacity: 0 }}
            animate={isInView || prefersReducedMotion ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.5, ease: 'easeOut' }}
          >
            {hero.eyebrow ? (
              <p className="text-sm font-semibold tracking-widest uppercase mb-3 text-[var(--accent-teal)]">
                {hero.eyebrow}
              </p>
            ) : null}
            <h1
              className="text-[32px] sm:text-4xl md:text-5xl lg:text-[56px] font-semibold leading-[1.05] mb-6 text-white tracking-[-0.04em]"
              style={{ textShadow: '0 2px 20px rgba(0,0,0,0.3)' }}
            >
              {hero.title}
            </h1>
            <p
              className="text-base sm:text-lg lg:text-xl leading-[1.5] mb-10 max-w-lg mx-auto lg:mx-0 text-white/70"
              style={{ textShadow: '0 1px 12px rgba(0,0,0,0.4)' }}
            >
              {hero.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto lg:mx-0">
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
          </m.div>

          <div className="order-1 lg:order-2 flex justify-center items-center">
            <div className="relative w-[min(280px,85vw)] h-[min(560px,170vw)] sm:w-[300px] sm:h-[600px] lg:w-[320px] lg:h-[640px] rounded-[44px] overflow-hidden border border-white/10">
              {hero.image?.src ? (
                <Image src={hero.image.src} alt={hero.image.alt} fill className="object-cover" sizes="320px" />
              ) : (
                <ImagePlaceholder description={hero.image?.description ?? 'Mobile app screenshot'} fill />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
