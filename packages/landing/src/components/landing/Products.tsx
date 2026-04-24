'use client'

import Link from 'next/link'
import { ArrowRight } from '@phosphor-icons/react'
import { m, useInView, useReducedMotion } from 'framer-motion'
import { useRef } from 'react'
import ImagePlaceholder from '@/components/placeholders/ImagePlaceholder'
import { getIcon } from '@/lib/icons'
import { site } from '@/content/site'

export default function Products() {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' })
  const prefersReducedMotion = useReducedMotion()
  const products = site.home.products

  return (
    <section ref={sectionRef} id="products" className="relative py-24 sm:py-32 lg:py-36 bg-black">
      <div className="container">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 lg:gap-16 mb-12 sm:mb-16 lg:mb-20">
          <m.h2
            className="text-[32px] sm:text-[40px] lg:text-[48px] xl:text-[56px] font-medium text-white leading-[1.1] tracking-[-0.03em] max-w-md lg:max-w-lg"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            {products.title}
          </m.h2>
          {products.subtitle ? (
            <m.p
              className="text-base sm:text-lg lg:text-[22px] text-white/50 leading-[1.6] max-w-md lg:max-w-lg lg:pt-2"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            >
              {products.subtitle}
            </m.p>
          ) : null}
        </div>

        <div
          className={`grid grid-cols-1 gap-5 lg:gap-6 ${
            products.items.length === 1 ? 'lg:grid-cols-1' :
            products.items.length === 2 ? 'lg:grid-cols-2' :
            'lg:grid-cols-3'
          }`}
        >
          {products.items.map((product) => {
            const Icon = getIcon(product.icon)
            const href = product.href ?? '#'
            const isExternal = href.startsWith('http')
            const linkProps = isExternal
              ? { href, target: '_blank' as const, rel: 'noopener noreferrer' }
              : { href }

            return (
              <m.article
                key={product.id}
                className="group relative rounded-2xl overflow-hidden border border-white/10 min-h-[360px] sm:min-h-[480px] flex flex-col justify-end hover:border-white/20 transition-all duration-300"
                initial={prefersReducedMotion ? false : { opacity: 0 }}
                animate={isInView || prefersReducedMotion ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: prefersReducedMotion ? 0 : 0.5, ease: 'easeOut' }}
              >
                <div className="absolute inset-0" aria-hidden="true">
                  {product.image?.src ? null : (
                    <ImagePlaceholder description={product.image?.description ?? product.title} fill />
                  )}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" aria-hidden="true" />

                <div className="relative p-6 sm:p-8 lg:p-10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 flex items-center justify-center rounded-lg transition-colors duration-300 text-white bg-white/10 group-hover:bg-white group-hover:text-black">
                      <Icon size={20} weight="duotone" />
                    </div>
                    {product.badge ? <span className="text-sm font-medium text-white/50">{product.badge}</span> : null}
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-medium text-white leading-[1.2] tracking-[-0.02em] mb-3">
                    {product.title}
                  </h3>
                  <p className="text-[15px] sm:text-base leading-[1.7] text-white/60 mb-6">{product.description}</p>

                  {isExternal ? (
                    <a
                      {...linkProps}
                      className="group/link inline-flex items-center gap-2 text-sm font-medium transition-colors text-accent-teal"
                    >
                      Learn more
                      <ArrowRight size={14} weight="regular" className="shrink-0" />
                    </a>
                  ) : (
                    <Link
                      href={href}
                      className="group/link inline-flex items-center gap-2 text-sm font-medium transition-colors text-accent-teal"
                    >
                      Learn more
                      <ArrowRight size={14} weight="regular" className="shrink-0" />
                    </Link>
                  )}
                </div>
              </m.article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
