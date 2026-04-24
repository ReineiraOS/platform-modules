'use client'

import Image from 'next/image'
import ImagePlaceholder from '@/components/placeholders/ImagePlaceholder'
import { getIcon } from '@/lib/icons'
import { site } from '@/content/site'

const OVERLAY_STYLE = {
  background:
    'linear-gradient(to top, rgba(0, 8, 8, 0.92) 0%, rgba(0, 8, 8, 0.55) 40%, rgba(0, 8, 8, 0.15) 70%, transparent 100%)',
}

const HOVER_OVERLAY_STYLE = {
  background: 'linear-gradient(135deg, var(--accent-bg) 0%, transparent 60%)',
}

export default function Features() {
  const features = site.home.features

  return (
    <section id="features" className="relative bg-[var(--background)] py-36">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-16 lg:mb-20">
          {features.eyebrow ? (
            <p className="text-sm sm:text-base font-semibold tracking-widest uppercase mb-3 sm:mb-4 text-[var(--accent-teal)]">
              {features.eyebrow}
            </p>
          ) : null}
          <h2 className="text-[28px] sm:text-3xl md:text-4xl lg:text-5xl font-semibold leading-[1.1] tracking-tight mb-4 sm:mb-5">
            {features.title}
          </h2>
          {features.subtitle ? (
            <p className="text-base sm:text-lg lg:text-xl leading-[1.6] max-w-2xl mx-auto text-[var(--text-muted)]">
              {features.subtitle}
            </p>
          ) : null}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 lg:gap-7">
          {features.items.map((feature, index) => {
            const Icon = getIcon(feature.icon)
            return (
              <article
                key={feature.id}
                className={`group relative p-8 sm:p-10 lg:p-12 transition-all duration-300 overflow-hidden flex flex-col justify-end
                  rounded-2xl border border-[var(--border-dark)]
                  ${index === 0 ? 'md:col-span-2 min-h-[280px] sm:min-h-[320px] lg:min-h-[400px]' : 'min-h-[240px] sm:min-h-[280px] lg:min-h-[320px]'}`}
              >
                <div className="absolute inset-0" aria-hidden="true">
                  {feature.image?.src ? (
                    <Image
                      src={feature.image.src}
                      alt={feature.image.alt ?? ''}
                      fill
                      sizes={index === 0 ? '(max-width: 768px) 100vw, 100vw' : '(max-width: 768px) 100vw, 50vw'}
                      className="object-cover"
                      priority={index === 0}
                    />
                  ) : (
                    <ImagePlaceholder
                      description={feature.image?.description ?? feature.title}
                      fill
                    />
                  )}
                </div>

                <div className="absolute inset-0 transition-opacity duration-300" style={OVERLAY_STYLE} aria-hidden="true" />
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={HOVER_OVERLAY_STYLE}
                  aria-hidden="true"
                />

                <div className="relative">
                  <div className="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center mb-4 rounded-lg transition-colors duration-300 text-white bg-white/10 group-hover:bg-white group-hover:text-black">
                    <Icon size={20} weight="duotone" />
                  </div>

                  <h3 className="text-xl sm:text-2xl font-semibold mb-3 tracking-[-0.01em] transition-colors duration-300 group-hover:text-white">
                    {feature.title}
                  </h3>
                  <p className="text-[15px] sm:text-base leading-[1.7] transition-colors duration-300 text-gray-300 group-hover:text-gray-200">
                    {feature.description}
                  </p>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
