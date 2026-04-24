import type { Metadata } from 'next'
import LegalLayout from '@/components/legal/LegalLayout'
import { site } from '@/content/site'

const siteUrl = site.meta.siteUrl
const brandName = site.meta.brandName

export const metadata: Metadata = {
  title: site.terms.title,
  description: `${brandName} — ${site.terms.title}`,
  openGraph: {
    title: `${site.terms.title} | ${brandName}`,
    description: `${brandName} — ${site.terms.title}`,
    url: `${siteUrl}/terms`,
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: `${brandName} — ${site.terms.title}` }],
  },
  alternates: { canonical: `${siteUrl}/terms` },
}

export default function TermsPage() {
  const legal = site.terms
  return (
    <LegalLayout
      title={legal.title}
      lastUpdated={legal.effectiveDate ?? '[LOREM: effective date]'}
      tableOfContents={[]}
    >
      <div dangerouslySetInnerHTML={{ __html: legal.markdown }} />
    </LegalLayout>
  )
}
