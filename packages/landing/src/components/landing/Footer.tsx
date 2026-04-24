'use client'

import Link from 'next/link'
import { LogoWithText } from '@/components/ui'
import { site } from '@/content/site'

function FooterLink({ href, external, children }: { href: string; external?: boolean; children: React.ReactNode }) {
  const isExternal = external || href.startsWith('http')

  if (isExternal) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[14px] text-white/50 hover:text-white transition-colors duration-200"
      >
        {children}
      </a>
    )
  }

  return (
    <Link href={href} className="text-[14px] text-white/50 hover:text-white transition-colors duration-200">
      {children}
    </Link>
  )
}

function FooterGroupBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-sm font-medium text-white/50 mb-4">{title}</h3>
      <ul className="space-y-3">{children}</ul>
    </div>
  )
}

export default function Footer() {
  const footer = site.footer
  const brandName = site.meta.brandName

  return (
    <footer className="bg-black border-t" style={{ borderColor: 'var(--border-dark)' }}>
      <div className="container">
        <div className="pt-16 sm:pt-20 lg:pt-24 pb-12 sm:pb-14 lg:pb-16">
          <div className="flex flex-col lg:flex-row">
            <div className="lg:w-[28%] shrink-0 mb-12 lg:mb-0">
              <Link href="/" className="inline-block" aria-label={`${brandName} Home`}>
                <LogoWithText height={26} />
              </Link>
              {footer.tagline ? <p className="text-sm text-white/40 mt-4 max-w-xs">{footer.tagline}</p> : null}
            </div>

            <div
              className={`grid grid-cols-2 gap-x-8 lg:gap-x-12 gap-y-10 flex-1 ${
                footer.groups.length === 1 ? 'sm:grid-cols-1' :
                footer.groups.length === 2 ? 'sm:grid-cols-2' :
                footer.groups.length === 3 ? 'sm:grid-cols-3' :
                footer.groups.length === 4 ? 'sm:grid-cols-4' :
                'sm:grid-cols-5'
              }`}
            >
              {footer.groups.map((group) => (
                <div key={group.title}>
                  <FooterGroupBlock title={group.title}>
                    {group.links.map((link) => (
                      <li key={link.label}>
                        <FooterLink href={link.href} external={link.external}>
                          {link.label}
                        </FooterLink>
                      </li>
                    ))}
                  </FooterGroupBlock>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="py-6 border-t border-white/[0.06] flex flex-col-reverse sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            {footer.social.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${brandName} on ${social.label}`}
                className="w-11 h-11 flex items-center justify-center text-white/50 hover:text-white transition-colors duration-200"
              >
                <span className="text-[13px]">{social.label}</span>
              </a>
            ))}
          </div>

          <div className="flex items-center gap-4 sm:gap-6 text-[12px] text-white/40">
            <span>{footer.legal.copyright}</span>
            {footer.legal.links.map((link) => (
              <Link key={link.label} href={link.href} className="hover:text-white/50 transition-colors">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
