import type { Metadata } from 'next'
import { site } from '@/content/site'

export const metadata: Metadata = {
  title: 'Blog',
  alternates: { canonical: `${site.meta.siteUrl}/blog` },
}

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
