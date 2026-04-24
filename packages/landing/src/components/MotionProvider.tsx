'use client'

import { LazyMotion, domAnimation } from 'framer-motion'
import { ReactNode } from 'react'

// LazyMotion with domAnimation reduces bundle size by ~50%
// domAnimation includes: animate, exit, initial, whileHover, whileTap, whileFocus, whileDrag
// It excludes: layout animations, drag gestures, SVG path animations
export default function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      {children}
    </LazyMotion>
  )
}
