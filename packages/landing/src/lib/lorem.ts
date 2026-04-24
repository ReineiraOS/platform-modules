export type LoremKind =
  | 'headline'
  | 'subhead'
  | 'eyebrow'
  | 'paragraph'
  | 'long-paragraph'
  | 'item-title'
  | 'item-description'
  | 'cta-label'
  | 'stat-value'
  | 'stat-label'
  | 'faq-question'
  | 'faq-answer'
  | 'nav-label'
  | 'brand-name'

export function lorem(kind: LoremKind): string {
  switch (kind) {
    case 'headline':
      return '[LOREM: 6–8 word headline]'
    case 'subhead':
      return '[LOREM: subhead — one sentence, 15–20 words]'
    case 'eyebrow':
      return '[LOREM: eyebrow]'
    case 'paragraph':
      return '[LOREM: paragraph — 2–3 sentences, 40–60 words]'
    case 'long-paragraph':
      return '[LOREM: long paragraph — 4–6 sentences, 80–120 words]'
    case 'item-title':
      return '[LOREM: item title]'
    case 'item-description':
      return '[LOREM: item description — 1–2 sentences]'
    case 'cta-label':
      return '[LOREM: CTA]'
    case 'stat-value':
      return '[NUM]'
    case 'stat-label':
      return '[LOREM: stat label]'
    case 'faq-question':
      return '[LOREM: FAQ question]'
    case 'faq-answer':
      return '[LOREM: FAQ answer — 2–3 sentences]'
    case 'nav-label':
      return '[LOREM: nav]'
    case 'brand-name':
      return 'Brand'
    default:
      return '[LOREM]'
  }
}

export const imagePlaceholder = (description: string, width = 1200, height = 600) => ({
  src: null,
  alt: description,
  description,
  width,
  height,
})
