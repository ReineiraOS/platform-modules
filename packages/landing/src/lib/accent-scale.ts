export type AccentScale = Record<'50' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900', string>

function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace('#', '').trim()
  const full = clean.length === 3 ? clean.split('').map((c) => c + c).join('') : clean
  const n = parseInt(full.slice(0, 6), 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  const rn = r / 255
  const gn = g / 255
  const bn = b / 255
  const max = Math.max(rn, gn, bn)
  const min = Math.min(rn, gn, bn)
  const l = (max + min) / 2
  let h = 0
  let s = 0
  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case rn:
        h = (gn - bn) / d + (gn < bn ? 6 : 0)
        break
      case gn:
        h = (bn - rn) / d + 2
        break
      case bn:
        h = (rn - gn) / d + 4
        break
    }
    h /= 6
  }
  return [h * 360, s * 100, l * 100]
}

function hslToHex(h: number, s: number, l: number): string {
  const sn = s / 100
  const ln = l / 100
  const c = (1 - Math.abs(2 * ln - 1)) * sn
  const hp = h / 60
  const x = c * (1 - Math.abs((hp % 2) - 1))
  let r = 0
  let g = 0
  let b = 0
  if (hp >= 0 && hp < 1) [r, g, b] = [c, x, 0]
  else if (hp < 2) [r, g, b] = [x, c, 0]
  else if (hp < 3) [r, g, b] = [0, c, x]
  else if (hp < 4) [r, g, b] = [0, x, c]
  else if (hp < 5) [r, g, b] = [x, 0, c]
  else [r, g, b] = [c, 0, x]
  const m = ln - c / 2
  const toHex = (v: number) =>
    Math.round((v + m) * 255)
      .toString(16)
      .padStart(2, '0')
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

const STEPS: Array<{ key: keyof AccentScale; l: number; satMul: number }> = [
  { key: '50', l: 96, satMul: 0.45 },
  { key: '100', l: 90, satMul: 0.55 },
  { key: '200', l: 80, satMul: 0.7 },
  { key: '300', l: 68, satMul: 0.82 },
  { key: '400', l: 58, satMul: 0.92 },
  { key: '500', l: 50, satMul: 1 },
  { key: '600', l: 42, satMul: 0.96 },
  { key: '700', l: 34, satMul: 0.9 },
  { key: '800', l: 26, satMul: 0.8 },
  { key: '900', l: 18, satMul: 0.7 },
]

export function buildAccentScale(hex: string): AccentScale {
  const [r, g, b] = hexToRgb(hex)
  const [h, s] = rgbToHsl(r, g, b)
  const scale = {} as AccentScale
  for (const { key, l, satMul } of STEPS) {
    scale[key] = hslToHex(h, Math.min(100, s * satMul), l)
  }
  return scale
}

export function accentRgba(hex: string, alpha: number): string {
  const [r, g, b] = hexToRgb(hex)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

function lighten(hex: string, deltaL: number): string {
  const [r, g, b] = hexToRgb(hex)
  const [h, s, l] = rgbToHsl(r, g, b)
  return hslToHex(h, s, Math.min(100, Math.max(0, l + deltaL)))
}

export interface AccentTokens {
  accent: string
  accentHover: string
  accentBright: string
  accentBg: string
  accentBgHover: string
  accentBorder: string
  shadowGlow: string
  shadowGlowStrong: string
}

export function buildAccentTokens(hex: string): AccentTokens {
  return {
    accent: hex,
    accentHover: lighten(hex, 6),
    accentBright: lighten(hex, 15),
    accentBg: accentRgba(hex, 0.12),
    accentBgHover: accentRgba(hex, 0.18),
    accentBorder: accentRgba(hex, 0.2),
    shadowGlow: `0 0 40px ${accentRgba(hex, 0.08)}`,
    shadowGlowStrong: `0 0 20px ${accentRgba(hex, 0.15)}`,
  }
}

/**
 * Produces a CSS string (for inline <style>) that overrides every accent-related
 * CSS variable so the whole template re-colors from a single hex.
 *
 * Uses the `--accent-teal*` variable names used by the upstream web-landing-app —
 * component classes reference those names directly, and this keeps them working
 * without edits to the components.
 */
export function accentCssOverrides(hex: string): string {
  const t = buildAccentTokens(hex)
  return `:root {
  --accent: ${t.accent};
  --accent-hover: ${t.accentHover};
  --accent-bright: ${t.accentBright};
  --accent-bg: ${t.accentBg};
  --accent-bg-hover: ${t.accentBgHover};
  --accent-border: ${t.accentBorder};
  --accent-glow: ${t.shadowGlow};
  --accent-teal: ${t.accent};
  --accent-teal-hover: ${t.accentHover};
  --accent-teal-bright: ${t.accentBright};
  --accent-primary: ${t.accent};
  --accent-secondary: ${t.accentHover};
  --accent-warm: ${t.accentHover};
  --accent-teal-bg: ${t.accentBg};
  --accent-teal-bg-hover: ${t.accentBgHover};
  --accent-teal-border: ${t.accentBorder};
  --shadow-teal-glow: ${t.shadowGlow};
  --shadow-teal-glow-strong: ${t.shadowGlowStrong};
}`
}
