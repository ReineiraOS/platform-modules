import { site } from '@/content/site'

interface LogoProps {
  size?: number
  variant?: 'with-background' | 'icon-only'
  className?: string
}

export default function Logo({ size = 40, variant = 'with-background', className = '' }: LogoProps) {
  const initial = site.branding.faviconInitial ?? site.meta.brandName.charAt(0).toUpperCase()
  const fontSize = Math.round(size * 0.48)

  if (variant === 'icon-only') {
    return (
      <span
        className={`inline-flex items-center justify-center font-semibold ${className}`}
        style={{
          width: size,
          height: size,
          fontSize,
          color: 'currentColor',
          letterSpacing: '-0.02em',
        }}
        role="img"
        aria-label={`${site.meta.brandName} logo`}
      >
        {initial}
      </span>
    )
  }

  return (
    <span
      className={`inline-flex items-center justify-center font-semibold ${className}`}
      style={{
        width: size,
        height: size,
        fontSize,
        borderRadius: '16%',
        backgroundColor: 'var(--accent)',
        color: '#fff',
        letterSpacing: '-0.02em',
      }}
      role="img"
      aria-label={`${site.meta.brandName} logo`}
    >
      {initial}
    </span>
  )
}
