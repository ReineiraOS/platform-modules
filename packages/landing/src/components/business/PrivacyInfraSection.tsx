'use client'

import Image from 'next/image'
import { m, useReducedMotion } from 'framer-motion'
import ImagePlaceholder from '@/components/placeholders/ImagePlaceholder'
import { site } from '@/content/site'

export default function PrivacyInfraSection() {
  const prefersReducedMotion = useReducedMotion()
  const block = site.home.privacyInfra

  return (
    <section className="py-20 sm:py-28 lg:py-36 bg-black border-t border-white/[0.06]">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 xl:gap-20 items-center">
          <div className="relative aspect-[4/3] lg:aspect-[3/4] w-full max-w-md mx-auto lg:mx-0 rounded-2xl overflow-hidden">
            {block.image?.src ? (
              <>
                <Image src={block.image.src} alt={block.image.alt} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              </>
            ) : (
              <ImagePlaceholder description={block.image?.description ?? 'Privacy infrastructure visual'} fill />
            )}
          </div>

          <div className="lg:pl-4">
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

            <div className="space-y-5 text-base sm:text-lg text-white/60 leading-[1.7]">
              {block.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>

            {block.bullets && block.bullets.length > 0 ? (
              <div className="mt-8 sm:mt-10 pt-8 border-t border-white/10">
                <div className="grid grid-cols-2 gap-6">
                  {block.bullets.map((bullet) => (
                    <div key={bullet.title}>
                      <p className="text-2xl sm:text-3xl font-semibold text-white mb-1">{bullet.title}</p>
                      {bullet.description ? <p className="text-sm text-white/50">{bullet.description}</p> : null}
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  )
}
