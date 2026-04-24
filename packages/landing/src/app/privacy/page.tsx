import type { Metadata } from 'next'
import LegalLayout from '@/components/legal/LegalLayout'
import { site } from '@/content/site'

const siteUrl = site.meta.siteUrl
const brandName = site.meta.brandName

export const metadata: Metadata = {
  title: site.privacy.title,
  description: `${brandName} — ${site.privacy.title}`,
  openGraph: {
    title: `${site.privacy.title} | ${brandName}`,
    description: `${brandName} — ${site.privacy.title}`,
    url: `${siteUrl}/privacy`,
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: `${brandName} — ${site.privacy.title}` }],
  },
  alternates: { canonical: `${siteUrl}/privacy` },
}

export default function PrivacyPage() {
  const legal = site.privacy
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
