import { lorem, imagePlaceholder } from '@/lib/lorem'

export interface ImageSlot {
  src: string | null
  alt: string
  description: string
  width?: number
  height?: number
}

export interface CtaSlot {
  label: string
  href: string
  external?: boolean
}

export interface NavItem {
  label: string
  href?: string
  items?: Array<{ label: string; description?: string; href: string; icon?: string; external?: boolean }>
}

export interface FooterGroup {
  title: string
  links: Array<{ label: string; href: string; external?: boolean; badge?: string }>
}

export interface SocialLink {
  label: string
  href: string
  icon: string
}

export interface HeroSlot {
  eyebrow?: string | null
  title: string
  subtitle: string
  primaryCta: CtaSlot
  secondaryCta?: CtaSlot | null
}

export interface StatsSlot {
  eyebrow?: string | null
  title?: string | null
  items: Array<{ value: string; label: string }>
}

export interface CardsSlot {
  eyebrow?: string | null
  title: string
  subtitle?: string | null
  items: Array<{
    id: string
    icon?: string
    title: string
    description: string
    href?: string
    image?: ImageSlot | null
    badge?: string
  }>
}

export interface LogoStripSlot {
  title?: string | null
  logos: Array<{ name: string; src?: string | null }>
}

export interface BulletsSlot {
  eyebrow?: string | null
  title: string
  subtitle?: string | null
  items: Array<{ icon?: string; title: string; description: string }>
}

export interface ProseSlot {
  eyebrow?: string | null
  title: string
  subtitle?: string | null
  paragraphs: string[]
  image?: ImageSlot | null
  bullets?: Array<{ title: string; description?: string }> | null
}

export interface FaqSlot {
  eyebrow?: string | null
  title: string
  subtitle?: string | null
  items: Array<{ question: string; answer: string }>
}

export interface CtaBlockSlot {
  eyebrow?: string | null
  title: string
  subtitle?: string | null
  primaryCta: CtaSlot
  secondaryCta?: CtaSlot | null
}

export interface PricingPlanSlot {
  name: string
  price: string
  period?: string | null
  description?: string | null
  features: string[]
  cta: CtaSlot
  featured?: boolean
}

export interface PricingSlot {
  eyebrow?: string | null
  title: string
  subtitle?: string | null
  plans: PricingPlanSlot[]
}

export interface StepsSlot {
  eyebrow?: string | null
  title: string
  subtitle?: string | null
  steps: Array<{ number: string; title: string; description: string }>
}

export interface PostCardSlot {
  slug: string
  category: string
  title: string
  description: string
  date: string
  readTime: string
  author: string
  image?: ImageSlot | null
}

export interface BlogGridSlot {
  eyebrow?: string | null
  title: string
  subtitle?: string | null
  posts: PostCardSlot[]
}

export interface DepartmentSlot {
  label: string
  email: string
  description: string
  icon: string
}

export interface LegalSlot {
  eyebrow: string
  title: string
  effectiveDate?: string | null
  markdown: string
}

export interface SiteConfig {
  meta: {
    brandName: string
    tagline: string
    description: string
    siteUrl: string
    email: {
      support: string
      sales: string
      media: string
      dev: string
    }
    social: SocialLink[]
    appUrl: string
    githubUrl?: string | null
    docsUrl?: string | null
    keywords: string[]
    twitterHandle?: string | null
  }
  branding: {
    accent: string
    fontSans?: string | null
    fontMono?: string | null
    borderRadius?: { button?: string; block?: string; xl?: string } | null
    borderWidth?: string | null
    faviconInitial?: string | null
  }
  header: {
    nav: NavItem[]
    primaryCta: CtaSlot
    secondaryCta?: CtaSlot | null
  }
  topBanner?: {
    enabled: boolean
    text: string
    href?: string | null
    linkLabel?: string | null
  } | null
  footer: {
    tagline: string
    groups: FooterGroup[]
    legal: { copyright: string; links: Array<{ label: string; href: string }> }
    social: SocialLink[]
  }
  home: {
    hero: HeroSlot
    trustStats: StatsSlot
    products: CardsSlot
    trustedBy: LogoStripSlot
    features: CardsSlot
    howItWorks: StepsSlot
    modernTeams: BulletsSlot
    privacyInfra: ProseSlot
    compliance: BulletsSlot
    blog: BlogGridSlot
    pricing: PricingSlot
    forWho: BulletsSlot
    faq: FaqSlot
    cta: CtaBlockSlot
  }
  mobile: {
    hero: HeroSlot & { image?: ImageSlot | null }
    features: CardsSlot
    howItWorks: StepsSlot
    faq: FaqSlot
    cta: CtaBlockSlot
  }
  business: {
    hero: HeroSlot
    forWho: BulletsSlot
    modernTeams: BulletsSlot
    privacyInfra: ProseSlot
    compliance: BulletsSlot
    trustStats: StatsSlot
    faq: FaqSlot
    cta: CtaBlockSlot
  }
  pricing: {
    hero: HeroSlot
    plans: PricingSlot
    features: BulletsSlot
    faq: FaqSlot
  }
  blog: {
    hero: HeroSlot
    grid: BlogGridSlot
  }
  contact: {
    hero: HeroSlot
    departments: DepartmentSlot[]
  }
  privacy: LegalSlot
  terms: LegalSlot
}

const BRAND = lorem('brand-name')

export const site: SiteConfig = {
  meta: {
    brandName: BRAND,
    tagline: lorem('subhead'),
    description: lorem('subhead'),
    siteUrl: 'https://example.com',
    email: {
      support: 'support@example.com',
      sales: 'sales@example.com',
      media: 'media@example.com',
      dev: 'dev@example.com',
    },
    social: [],
    appUrl: '#',
    githubUrl: null,
    docsUrl: null,
    keywords: [],
    twitterHandle: null,
  },
  branding: {
    accent: '#168e8e',
    fontSans: null,
    fontMono: null,
    borderRadius: null,
    borderWidth: null,
    faviconInitial: BRAND.charAt(0),
  },
  header: {
    nav: [
      {
        label: 'Products',
        items: [
          { label: 'Platform', description: lorem('item-description'), href: '#', icon: 'Monitor', external: true },
          { label: 'Mobile', description: lorem('item-description'), href: '/mobile', icon: 'DeviceMobile' },
          { label: 'API & SDK', description: lorem('item-description'), href: '#', icon: 'Code' },
        ],
      },
      {
        label: 'Developers',
        items: [
          { label: 'Documentation', description: lorem('item-description'), href: '#', icon: 'BookOpen', external: true },
          { label: 'GitHub', description: lorem('item-description'), href: '#', icon: 'GithubLogo', external: true },
          { label: 'Web Demo', description: lorem('item-description'), href: '#', icon: 'Browser', external: true },
        ],
      },
      {
        label: 'Resources',
        items: [
          { label: 'Blog', description: lorem('item-description'), href: '/blog', icon: 'Article' },
          { label: 'Contact', description: lorem('item-description'), href: '/contact', icon: 'EnvelopeSimple' },
        ],
      },
      { label: 'Pricing', href: '/pricing' },
    ],
    primaryCta: { label: lorem('cta-label'), href: '#', external: true },
    secondaryCta: { label: 'Sign in', href: '#', external: true },
  },
  topBanner: {
    enabled: true,
    text: lorem('subhead'),
    href: '/contact',
    linkLabel: 'Learn more',
  },
  footer: {
    tagline: lorem('subhead'),
    groups: [
      {
        title: 'Products',
        links: [
          { label: 'Mobile', href: '/mobile' },
          { label: 'Pricing', href: '/pricing' },
        ],
      },
      {
        title: 'Resources',
        links: [
          { label: 'Blog', href: '/blog' },
          { label: 'Contact', href: '/contact' },
          { label: 'FAQ', href: '/#faq' },
        ],
      },
      {
        title: 'Legal',
        links: [
          { label: 'Privacy Policy', href: '/privacy' },
          { label: 'Terms of Service', href: '/terms' },
        ],
      },
    ],
    legal: {
      copyright: `© ${new Date().getFullYear()} ${BRAND}. All rights reserved.`,
      links: [
        { label: 'Terms', href: '/terms' },
        { label: 'Privacy', href: '/privacy' },
      ],
    },
    social: [],
  },
  home: {
    hero: {
      title: lorem('headline'),
      subtitle: lorem('subhead'),
      primaryCta: { label: lorem('cta-label'), href: '#', external: true },
      secondaryCta: { label: 'Contact sales', href: '/contact' },
    },
    trustStats: {
      eyebrow: lorem('eyebrow'),
      items: [
        { value: lorem('stat-value'), label: lorem('stat-label') },
        { value: lorem('stat-value'), label: lorem('stat-label') },
        { value: lorem('stat-value'), label: lorem('stat-label') },
        { value: lorem('stat-value'), label: lorem('stat-label') },
      ],
    },
    products: {
      eyebrow: lorem('eyebrow'),
      title: lorem('headline'),
      subtitle: lorem('subhead'),
      items: [
        { id: 'p1', icon: 'Monitor', title: lorem('item-title'), description: lorem('item-description'), href: '#' },
        { id: 'p2', icon: 'DeviceMobile', title: lorem('item-title'), description: lorem('item-description'), href: '/mobile' },
        { id: 'p3', icon: 'Code', title: lorem('item-title'), description: lorem('item-description'), href: '#' },
      ],
    },
    trustedBy: {
      title: lorem('stat-label'),
      logos: [
        { name: 'Partner 1' },
        { name: 'Partner 2' },
        { name: 'Partner 3' },
        { name: 'Partner 4' },
        { name: 'Partner 5' },
      ],
    },
    features: {
      eyebrow: 'Features',
      title: lorem('headline'),
      subtitle: lorem('subhead'),
      items: [
        {
          id: 'f1',
          icon: 'ShieldCheck',
          title: lorem('item-title'),
          description: lorem('item-description'),
          image: imagePlaceholder('Hero feature visual', 1920, 1080),
        },
        {
          id: 'f2',
          icon: 'Wallet',
          title: lorem('item-title'),
          description: lorem('item-description'),
          image: imagePlaceholder('Feature 2 visual', 960, 720),
        },
        {
          id: 'f3',
          icon: 'CurrencyCircleDollar',
          title: lorem('item-title'),
          description: lorem('item-description'),
          image: imagePlaceholder('Feature 3 visual', 960, 720),
        },
        {
          id: 'f4',
          icon: 'Lightning',
          title: lorem('item-title'),
          description: lorem('item-description'),
          image: imagePlaceholder('Feature 4 visual', 960, 720),
        },
        {
          id: 'f5',
          icon: 'Code',
          title: lorem('item-title'),
          description: lorem('item-description'),
          image: imagePlaceholder('Feature 5 visual', 960, 720),
        },
      ],
    },
    howItWorks: {
      eyebrow: 'How it works',
      title: lorem('headline'),
      subtitle: lorem('subhead'),
      steps: [
        { number: '01', title: lorem('item-title'), description: lorem('item-description') },
        { number: '02', title: lorem('item-title'), description: lorem('item-description') },
        { number: '03', title: lorem('item-title'), description: lorem('item-description') },
      ],
    },
    modernTeams: {
      eyebrow: lorem('eyebrow'),
      title: lorem('headline'),
      subtitle: lorem('subhead'),
      items: [
        { icon: 'Users', title: lorem('item-title'), description: lorem('item-description') },
        { icon: 'Buildings', title: lorem('item-title'), description: lorem('item-description') },
        { icon: 'ChartLine', title: lorem('item-title'), description: lorem('item-description') },
      ],
    },
    privacyInfra: {
      eyebrow: lorem('eyebrow'),
      title: lorem('headline'),
      subtitle: lorem('subhead'),
      paragraphs: [lorem('long-paragraph'), lorem('paragraph')],
      image: imagePlaceholder('Infrastructure diagram', 1200, 800),
      bullets: [
        { title: lorem('item-title'), description: lorem('item-description') },
        { title: lorem('item-title'), description: lorem('item-description') },
        { title: lorem('item-title'), description: lorem('item-description') },
      ],
    },
    compliance: {
      eyebrow: 'Compliance',
      title: lorem('headline'),
      subtitle: lorem('subhead'),
      items: [
        { icon: 'ShieldCheck', title: lorem('item-title'), description: lorem('item-description') },
        { icon: 'ClipboardText', title: lorem('item-title'), description: lorem('item-description') },
        { icon: 'Scales', title: lorem('item-title'), description: lorem('item-description') },
      ],
    },
    blog: {
      eyebrow: 'Blog',
      title: lorem('headline'),
      subtitle: lorem('subhead'),
      posts: [
        {
          slug: 'post-one',
          category: 'Category',
          title: lorem('item-title'),
          description: lorem('item-description'),
          date: 'Jan 2026',
          readTime: '5 min read',
          author: lorem('brand-name'),
        },
        {
          slug: 'post-two',
          category: 'Category',
          title: lorem('item-title'),
          description: lorem('item-description'),
          date: 'Jan 2026',
          readTime: '4 min read',
          author: lorem('brand-name'),
        },
        {
          slug: 'post-three',
          category: 'Category',
          title: lorem('item-title'),
          description: lorem('item-description'),
          date: 'Jan 2026',
          readTime: '6 min read',
          author: lorem('brand-name'),
        },
      ],
    },
    pricing: {
      eyebrow: 'Pricing',
      title: lorem('headline'),
      subtitle: lorem('subhead'),
      plans: [
        {
          name: 'Starter',
          price: '$0',
          description: lorem('item-description'),
          features: [lorem('item-title'), lorem('item-title'), lorem('item-title')],
          cta: { label: lorem('cta-label'), href: '#' },
        },
        {
          name: 'Pro',
          price: '$49',
          period: '/month',
          description: lorem('item-description'),
          features: [lorem('item-title'), lorem('item-title'), lorem('item-title'), lorem('item-title')],
          cta: { label: lorem('cta-label'), href: '#' },
          featured: true,
        },
        {
          name: 'Enterprise',
          price: 'Custom',
          description: lorem('item-description'),
          features: [lorem('item-title'), lorem('item-title'), lorem('item-title'), lorem('item-title'), lorem('item-title')],
          cta: { label: 'Contact sales', href: '/contact' },
        },
      ],
    },
    forWho: {
      eyebrow: lorem('eyebrow'),
      title: lorem('headline'),
      subtitle: lorem('subhead'),
      items: [
        { icon: 'User', title: lorem('item-title'), description: lorem('item-description') },
        { icon: 'Buildings', title: lorem('item-title'), description: lorem('item-description') },
        { icon: 'Globe', title: lorem('item-title'), description: lorem('item-description') },
      ],
    },
    faq: {
      eyebrow: 'FAQ',
      title: lorem('headline'),
      subtitle: lorem('subhead'),
      items: [
        { question: lorem('faq-question'), answer: lorem('faq-answer') },
        { question: lorem('faq-question'), answer: lorem('faq-answer') },
        { question: lorem('faq-question'), answer: lorem('faq-answer') },
        { question: lorem('faq-question'), answer: lorem('faq-answer') },
      ],
    },
    cta: {
      eyebrow: null,
      title: lorem('headline'),
      subtitle: lorem('subhead'),
      primaryCta: { label: lorem('cta-label'), href: '#', external: true },
      secondaryCta: { label: 'Contact sales', href: '/contact' },
    },
  },
  mobile: {
    hero: {
      title: lorem('headline'),
      subtitle: lorem('subhead'),
      primaryCta: { label: lorem('cta-label'), href: '#' },
      secondaryCta: null,
      image: imagePlaceholder('Mobile app screenshot', 750, 1334),
    },
    features: {
      eyebrow: 'Mobile',
      title: lorem('headline'),
      subtitle: lorem('subhead'),
      items: [
        { id: 'mf1', icon: 'DeviceMobile', title: lorem('item-title'), description: lorem('item-description') },
        { id: 'mf2', icon: 'Fingerprint', title: lorem('item-title'), description: lorem('item-description') },
        { id: 'mf3', icon: 'Lock', title: lorem('item-title'), description: lorem('item-description') },
      ],
    },
    howItWorks: {
      eyebrow: 'How it works',
      title: lorem('headline'),
      subtitle: lorem('subhead'),
      steps: [
        { number: '01', title: lorem('item-title'), description: lorem('item-description') },
        { number: '02', title: lorem('item-title'), description: lorem('item-description') },
        { number: '03', title: lorem('item-title'), description: lorem('item-description') },
      ],
    },
    faq: {
      eyebrow: 'FAQ',
      title: lorem('headline'),
      subtitle: null,
      items: [
        { question: lorem('faq-question'), answer: lorem('faq-answer') },
        { question: lorem('faq-question'), answer: lorem('faq-answer') },
      ],
    },
    cta: {
      title: lorem('headline'),
      subtitle: lorem('subhead'),
      primaryCta: { label: lorem('cta-label'), href: '#' },
    },
  },
  business: {
    hero: {
      eyebrow: 'For Business',
      title: lorem('headline'),
      subtitle: lorem('subhead'),
      primaryCta: { label: 'Contact sales', href: '/contact' },
      secondaryCta: { label: 'See pricing', href: '/pricing' },
    },
    forWho: {
      eyebrow: lorem('eyebrow'),
      title: lorem('headline'),
      subtitle: lorem('subhead'),
      items: [
        { icon: 'Briefcase', title: lorem('item-title'), description: lorem('item-description') },
        { icon: 'Buildings', title: lorem('item-title'), description: lorem('item-description') },
        { icon: 'Globe', title: lorem('item-title'), description: lorem('item-description') },
      ],
    },
    modernTeams: {
      eyebrow: lorem('eyebrow'),
      title: lorem('headline'),
      subtitle: lorem('subhead'),
      items: [
        { icon: 'Users', title: lorem('item-title'), description: lorem('item-description') },
        { icon: 'ChartLine', title: lorem('item-title'), description: lorem('item-description') },
        { icon: 'Handshake', title: lorem('item-title'), description: lorem('item-description') },
      ],
    },
    privacyInfra: {
      eyebrow: lorem('eyebrow'),
      title: lorem('headline'),
      subtitle: lorem('subhead'),
      paragraphs: [lorem('long-paragraph')],
      image: imagePlaceholder('Infrastructure diagram', 1200, 800),
      bullets: [
        { title: lorem('item-title'), description: lorem('item-description') },
        { title: lorem('item-title'), description: lorem('item-description') },
      ],
    },
    compliance: {
      eyebrow: 'Compliance',
      title: lorem('headline'),
      subtitle: lorem('subhead'),
      items: [
        { icon: 'ShieldCheck', title: lorem('item-title'), description: lorem('item-description') },
        { icon: 'ClipboardText', title: lorem('item-title'), description: lorem('item-description') },
      ],
    },
    trustStats: {
      eyebrow: lorem('eyebrow'),
      items: [
        { value: lorem('stat-value'), label: lorem('stat-label') },
        { value: lorem('stat-value'), label: lorem('stat-label') },
        { value: lorem('stat-value'), label: lorem('stat-label') },
      ],
    },
    faq: {
      eyebrow: 'FAQ',
      title: lorem('headline'),
      items: [
        { question: lorem('faq-question'), answer: lorem('faq-answer') },
        { question: lorem('faq-question'), answer: lorem('faq-answer') },
      ],
    },
    cta: {
      title: lorem('headline'),
      subtitle: lorem('subhead'),
      primaryCta: { label: 'Contact sales', href: '/contact' },
    },
  },
  pricing: {
    hero: {
      eyebrow: 'Pricing',
      title: lorem('headline'),
      subtitle: lorem('subhead'),
      primaryCta: { label: lorem('cta-label'), href: '#' },
      secondaryCta: { label: 'Contact sales', href: '/contact' },
    },
    plans: {
      eyebrow: null,
      title: lorem('headline'),
      subtitle: null,
      plans: [
        {
          name: 'Starter',
          price: '$0',
          description: lorem('item-description'),
          features: [lorem('item-title'), lorem('item-title'), lorem('item-title')],
          cta: { label: lorem('cta-label'), href: '#' },
        },
        {
          name: 'Pro',
          price: '$49',
          period: '/month',
          description: lorem('item-description'),
          features: [lorem('item-title'), lorem('item-title'), lorem('item-title'), lorem('item-title')],
          cta: { label: lorem('cta-label'), href: '#' },
          featured: true,
        },
        {
          name: 'Enterprise',
          price: 'Custom',
          description: lorem('item-description'),
          features: [lorem('item-title'), lorem('item-title'), lorem('item-title'), lorem('item-title'), lorem('item-title')],
          cta: { label: 'Contact sales', href: '/contact' },
        },
      ],
    },
    features: {
      eyebrow: 'Features',
      title: lorem('headline'),
      subtitle: null,
      items: [
        { icon: 'Check', title: lorem('item-title'), description: lorem('item-description') },
        { icon: 'Check', title: lorem('item-title'), description: lorem('item-description') },
        { icon: 'Check', title: lorem('item-title'), description: lorem('item-description') },
      ],
    },
    faq: {
      eyebrow: 'FAQ',
      title: lorem('headline'),
      items: [
        { question: lorem('faq-question'), answer: lorem('faq-answer') },
        { question: lorem('faq-question'), answer: lorem('faq-answer') },
      ],
    },
  },
  blog: {
    hero: {
      eyebrow: 'Blog',
      title: lorem('headline'),
      subtitle: lorem('subhead'),
      primaryCta: { label: lorem('cta-label'), href: '#' },
    },
    grid: {
      eyebrow: null,
      title: lorem('headline'),
      posts: [],
    },
  },
  contact: {
    hero: {
      eyebrow: 'Contact',
      title: lorem('headline'),
      subtitle: lorem('subhead'),
      primaryCta: { label: 'Email us', href: 'mailto:hello@example.com' },
    },
    departments: [
      { icon: 'Lifebuoy', label: 'General', email: 'support@example.com', description: lorem('item-description') },
      { icon: 'Code', label: 'Technical', email: 'dev@example.com', description: lorem('item-description') },
      { icon: 'Handshake', label: 'Media & Partnerships', email: 'media@example.com', description: lorem('item-description') },
      { icon: 'Briefcase', label: 'Sales', email: 'sales@example.com', description: lorem('item-description') },
    ],
  },
  privacy: {
    eyebrow: 'Legal',
    title: 'Privacy Policy',
    effectiveDate: null,
    markdown: '<section><h2>[LOREM: section heading]</h2><p>[LOREM: legal paragraph — replace with real privacy policy content]</p></section>',
  },
  terms: {
    eyebrow: 'Legal',
    title: 'Terms of Service',
    effectiveDate: null,
    markdown: '<section><h2>[LOREM: section heading]</h2><p>[LOREM: legal paragraph — replace with real terms of service content]</p></section>',
  },
}
