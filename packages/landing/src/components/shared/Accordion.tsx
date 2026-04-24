'use client'

import { useState, type ReactNode } from 'react'
import { m, AnimatePresence, useReducedMotion } from 'framer-motion'

export interface AccordionItem {
  id: string
  question: string
  answer: ReactNode
}

interface AccordionClassNames {
  section?: string
  subtitle?: string
  title?: string
  border?: string
  button?: string
  question?: string
  answer?: string
}

interface AccordionStyles {
  section?: React.CSSProperties
  subtitle?: React.CSSProperties
  border?: React.CSSProperties
  button?: React.CSSProperties
  answer?: React.CSSProperties
  icon?: (isOpen: boolean) => React.CSSProperties
}

interface AccordionProps {
  items: AccordionItem[]
  title: string
  subtitle?: string
  classNames?: AccordionClassNames
  styles?: AccordionStyles
  iconClassName?: (isOpen: boolean) => string
}

export default function Accordion({ items, title, subtitle, classNames, styles, iconClassName }: AccordionProps) {
  const [openId, setOpenId] = useState<string | null>(null)
  const prefersReducedMotion = useReducedMotion()

  const toggleItem = (id: string) => {
    setOpenId(openId === id ? null : id)
  }

  return (
    <section id="faq" className={`py-20 sm:py-28 lg:py-36 ${classNames?.section ?? ''}`} style={styles?.section}>
      <div className="container">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14 sm:mb-16 lg:mb-20">
            {subtitle ? (
              <p
                className={`text-base sm:text-lg font-medium mb-4 ${classNames?.subtitle ?? ''}`}
                style={styles?.subtitle}
              >
                {subtitle}
              </p>
            ) : null}
            <h2
              className={`text-[32px] sm:text-4xl md:text-5xl lg:text-[56px] font-semibold leading-[1.05] tracking-tight ${classNames?.title ?? ''}`}
            >
              {title}
            </h2>
          </div>

          <div className={`border-t ${classNames?.border ?? ''}`} style={styles?.border}>
            {items.map((item) => {
              const isOpen = openId === item.id

              return (
                <div key={item.id} className={`border-b ${classNames?.border ?? ''}`} style={styles?.border}>
                  <button
                    onClick={() => toggleItem(item.id)}
                    className={`w-full flex items-center justify-between py-6 sm:py-7 text-left cursor-pointer group focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-black ${classNames?.button ?? ''}`}
                    style={styles?.button}
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${item.id}`}
                  >
                    <span
                      className={`text-lg sm:text-xl lg:text-[22px] font-medium pr-6 transition-opacity duration-200 group-hover:opacity-60 ${classNames?.question ?? ''}`}
                    >
                      {item.question}
                    </span>

                    {/* Plus/Close icon */}
                    <span
                      className={`flex-shrink-0 w-11 h-11 flex items-center justify-center rounded-full border transition-all duration-300 ${iconClassName?.(isOpen) ?? ''}`}
                      style={styles?.icon?.(isOpen)}
                      aria-hidden="true"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        className="transition-transform duration-300"
                        style={{ transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)' }}
                      >
                        <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <m.div
                        id={`faq-answer-${item.id}`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{
                          height: { duration: prefersReducedMotion ? 0 : 0.3, ease: 'easeOut' },
                          opacity: { duration: prefersReducedMotion ? 0 : 0.25, ease: 'easeOut' },
                        }}
                        className="overflow-hidden"
                      >
                        <div
                          className={`pb-6 sm:pb-7 pr-14 sm:pr-16 text-base leading-relaxed ${classNames?.answer ?? ''}`}
                          style={styles?.answer}
                        >
                          {item.answer}
                        </div>
                      </m.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
