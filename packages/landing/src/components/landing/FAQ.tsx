'use client'

import Accordion from '@/components/shared/Accordion'
import type { AccordionItem } from '@/components/shared/Accordion'
import { site } from '@/content/site'

function getIconClassName(isOpen: boolean): string {
  return isOpen ? 'border-white bg-white text-black' : 'border-white/20 bg-transparent text-white'
}

export default function FAQ() {
  const faq = site.home.faq
  const items: AccordionItem[] = faq.items.map((item, i) => ({
    id: `faq-${i}`,
    question: item.question,
    answer: item.answer,
  }))

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <Accordion
        items={items}
        title={faq.title}
        subtitle={faq.subtitle ?? faq.eyebrow ?? undefined}
        classNames={{
          section: 'bg-black',
          subtitle: 'text-white/50',
          title: 'text-white',
          border: 'border-white/10',
          button: 'focus-visible:ring-white/50',
          question: 'text-white',
          answer: 'text-white/50',
        }}
        iconClassName={getIconClassName}
      />
    </>
  )
}
