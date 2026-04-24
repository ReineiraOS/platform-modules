import type { Metadata } from 'next'
import { site } from '@/content/site'

export const metadata: Metadata = {
  title: 'Contact',
  alternates: { canonical: `${site.meta.siteUrl}/contact` },
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
