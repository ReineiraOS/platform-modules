'use client'

import { m, useInView, useReducedMotion } from 'framer-motion'
import { useRef } from 'react'
import { site } from '@/content/site'

export default function TrustStats() {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-60px' })
  const prefersReducedMotion = useReducedMotion()
  const stats = site.home.trustStats.items

  return (
    <section
      ref={sectionRef}
      className="py-14 sm:py-16 lg:py-20 bg-black border-y"
      style={{ borderColor: 'var(--border-dark)' }}
    >
      <div className="container">
        <m.div
          className={`grid grid-cols-2 gap-6 lg:gap-0 max-w-5xl mx-auto ${
            stats.length === 1 ? 'lg:grid-cols-1' :
            stats.length === 2 ? 'lg:grid-cols-2' :
            stats.length === 3 ? 'lg:grid-cols-3' :
            stats.length === 4 ? 'lg:grid-cols-4' :
            stats.length === 5 ? 'lg:grid-cols-5' :
            'lg:grid-cols-6'
          }`}
          initial={prefersReducedMotion ? false : { opacity: 0 }}
          animate={isInView || prefersReducedMotion ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.4, ease: 'easeOut' }}
        >
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className={`text-center ${index < stats.length - 1 ? 'lg:border-r lg:border-white/10' : ''}`}
            >
              <p className="text-[32px] sm:text-[36px] lg:text-[40px] font-semibold text-white leading-none tracking-tight mb-2">
                {stat.value}
              </p>
              <p className="text-sm font-medium text-white/70">{stat.label}</p>
            </div>
          ))}
        </m.div>
      </div>
    </section>
  )
}
