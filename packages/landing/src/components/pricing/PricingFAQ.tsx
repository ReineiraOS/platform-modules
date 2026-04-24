'use client'

import Accordion from '@/components/shared/Accordion'
import type { AccordionItem } from '@/components/shared/Accordion'
import { site } from '@/content/site'

function getIconClassName(isOpen: boolean): string {
  return isOpen ? 'border-white bg-white text-black' : 'border-white/20 bg-transparent text-white'
}

export default function PricingFAQ() {
  const faq = site.pricing.faq
  const items: AccordionItem[] = faq.items.map((item, i) => ({
    id: `pricing-faq-${i}`,
    question: item.question,
    answer: item.answer,
  }))

  return (
    <Accordion
      items={items}
      title={faq.title}
      subtitle={faq.subtitle ?? faq.eyebrow ?? undefined}
      classNames={{
        section: 'bg-black border-t',
        subtitle: 'text-white/50',
        title: 'text-white',
        border: 'border-white/10',
        button: 'focus-visible:ring-white/50',
        question: 'text-white',
        answer: 'text-white/50',
      }}
      iconClassName={getIconClassName}
    />
  )
}
