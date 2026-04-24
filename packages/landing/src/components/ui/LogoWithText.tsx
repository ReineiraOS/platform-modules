import { site } from '@/content/site'

interface LogoWithTextProps {
  height?: number
  className?: string
}

export default function LogoWithText({ height = 32, className = '' }: LogoWithTextProps) {
  const brandName = site.meta.brandName
  const fontSize = Math.round(height * 0.72)

  return (
    <span
      className={`inline-flex items-center font-semibold tracking-[-0.01em] ${className}`}
      style={{
        height,
        fontSize,
        color: 'var(--foreground)',
        lineHeight: 1,
        letterSpacing: '-0.015em',
      }}
      aria-label={brandName}
    >
      {brandName}
    </span>
  )
}
