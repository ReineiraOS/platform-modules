'use client'

import { useRef } from 'react'
import { m, useInView, useReducedMotion } from 'framer-motion'
import { Check } from '@phosphor-icons/react'
import Link from 'next/link'
import { site } from '@/content/site'

export default function PricingPlans() {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' })
  const prefersReducedMotion = useReducedMotion()
  const pricing = site.pricing.plans

  return (
    <section
      ref={sectionRef}
      className="py-24 sm:py-32 lg:py-36 bg-black border-t"
      style={{ borderColor: 'var(--border-dark)' }}
    >
      <div className="container">
        <m.div
          className="text-center mb-12 sm:mb-16 lg:mb-20"
          initial={{ opacity: prefersReducedMotion ? 1 : 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          {pricing.eyebrow ? (
            <p className="text-sm font-semibold tracking-widest uppercase mb-4 text-[var(--accent-teal)]">{pricing.eyebrow}</p>
          ) : null}
          <h2 className="text-[32px] sm:text-[40px] lg:text-[48px] font-medium text-white leading-[1.1] tracking-[-0.03em] mb-5">
            {pricing.title}
          </h2>
          {pricing.subtitle ? (
            <p className="text-base sm:text-lg text-white/50 max-w-xl mx-auto">{pricing.subtitle}</p>
          ) : null}
        </m.div>

        <div
          className={`grid grid-cols-1 sm:grid-cols-2 ${
            pricing.plans.length === 1 ? 'lg:grid-cols-1' :
            pricing.plans.length === 2 ? 'lg:grid-cols-2' :
            pricing.plans.length === 3 ? 'lg:grid-cols-3' :
            pricing.plans.length === 4 ? 'lg:grid-cols-4' :
            'lg:grid-cols-5'
          } gap-4 lg:gap-0 max-w-5xl mx-auto lg:border lg:border-white/10 lg:rounded-2xl lg:overflow-hidden`}
        >
          {pricing.plans.map((plan, index) => (
            <m.div
              key={plan.name}
              initial={{ opacity: prefersReducedMotion ? 1 : 0 }}
              animate={isInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className={`flex flex-col p-6 sm:p-8 ${
                plan.featured
                  ? 'border-2 border-[var(--accent-teal)] rounded-2xl lg:rounded-none relative bg-[var(--accent-bg)]'
                  : `border border-white/10 rounded-2xl lg:rounded-none lg:border-0 ${
                      index < pricing.plans.length - 1 ? 'lg:border-r lg:border-r-white/10' : ''
                    }`
              }`}
            >
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-white mb-4">{plan.name}</h3>
                <div className="flex items-baseline gap-1.5 mb-1">
                  <span className="text-[44px] font-semibold text-white leading-none tracking-tight">{plan.price}</span>
                </div>
                {plan.period ? <p className="text-sm text-white/40 mb-4">{plan.period}</p> : null}
                {plan.description ? (
                  <p className="text-[14px] text-white/50 leading-relaxed min-h-[40px]">{plan.description}</p>
                ) : null}
              </div>

              {plan.cta.external ? (
                <a
                  href={plan.cta.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center justify-center py-3.5 text-[15px] font-medium rounded-full transition-all cursor-pointer mb-6 ${
                    plan.featured
                      ? 'hover:opacity-90 bg-accent-teal text-foreground'
                      : 'text-white/70 hover:text-white border border-white/20 hover:border-white/40'
                  }`}
                >
                  {plan.cta.label}
                </a>
              ) : (
                <Link
                  href={plan.cta.href}
                  className={`flex items-center justify-center py-3.5 text-[15px] font-medium rounded-full transition-all cursor-pointer mb-6 ${
                    plan.featured
                      ? 'hover:opacity-90 bg-accent-teal text-foreground'
                      : 'text-white/70 hover:text-white border border-white/20 hover:border-white/40'
                  }`}
                >
                  {plan.cta.label}
                </Link>
              )}

              <ul className="space-y-3.5 flex-1 pt-6 border-t border-white/[0.06]">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check size={15} weight="bold" className="shrink-0 mt-0.5 text-accent-teal" />
                    <span className="text-[14px] text-white/60 leading-snug">{feature}</span>
                  </li>
                ))}
              </ul>
            </m.div>
          ))}
        </div>
      </div>
    </section>
  )
}
