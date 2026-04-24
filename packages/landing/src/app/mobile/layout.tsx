import type { Metadata } from 'next'
import { site } from '@/content/site'

export const metadata: Metadata = {
  title: 'Mobile',
  alternates: { canonical: `${site.meta.siteUrl}/mobile` },
}

export default function MobileLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
