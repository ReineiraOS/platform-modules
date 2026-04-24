'use client'

import { useEffect, useRef, useState } from 'react'

export function useScrolled(threshold = 50): boolean {
  const [isScrolled, setIsScrolled] = useState(false)
  const ticking = useRef(false)

  useEffect(() => {
    const update = () => {
      setIsScrolled(window.scrollY > threshold)
      ticking.current = false
    }

    const onScroll = () => {
      if (!ticking.current) {
        ticking.current = true
        requestAnimationFrame(update)
      }
    }

    // Check initial scroll position
    update()

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [threshold])

  return isScrolled
}
