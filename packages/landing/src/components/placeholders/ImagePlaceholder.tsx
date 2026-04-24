interface ImagePlaceholderProps {
  description: string
  width?: number
  height?: number
  className?: string
  fill?: boolean
}

export default function ImagePlaceholder({ description, width, height, className, fill }: ImagePlaceholderProps) {
  const style = fill
    ? { position: 'absolute' as const, inset: 0 }
    : width && height
      ? { aspectRatio: `${width}/${height}` }
      : undefined

  return (
    <div
      className={`flex items-center justify-center text-center p-6 ${className ?? ''}`}
      style={{
        ...style,
        background:
          'repeating-linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.04) 12px, rgba(255,255,255,0.02) 12px, rgba(255,255,255,0.02) 24px)',
        border: '1px dashed rgba(255,255,255,0.15)',
        color: 'rgba(255,255,255,0.45)',
        fontFamily: 'var(--font-mono)',
        fontSize: '12px',
        letterSpacing: '0.04em',
      }}
      role="img"
      aria-label={description}
    >
      <span>[IMAGE: {description}{width && height ? ` — ${width}×${height}` : ''}]</span>
    </div>
  )
}
