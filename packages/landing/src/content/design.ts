export interface DesignConfig {
  rationale: string
  overrides?: {
    borderRadius?: { button?: string; block?: string; xl?: string }
    borderWidth?: string
    fontSans?: string
    fontMono?: string
  }
}

export const design: DesignConfig = {
  rationale:
    'Default template — canonical Privara UI clone. Token system (accent, fonts, borders) is the only design-level variable; text and images vary per venture; structure, component sequence, and block roles are identical across every site.',
}
