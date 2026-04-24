import type { Metadata } from 'next'
import { site } from '@/content/site'

export const metadata: Metadata = {
  title: 'Pricing',
  alternates: { canonical: `${site.meta.siteUrl}/pricing` },
}

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
