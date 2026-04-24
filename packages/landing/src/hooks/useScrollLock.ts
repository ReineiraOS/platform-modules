'use client'

import { useEffect } from 'react'

export function useScrollLock(isLocked: boolean): void {
  useEffect(() => {
    if (!isLocked) return

    const scrollY = window.scrollY
    const { body } = document

    body.style.position = 'fixed'
    body.style.top = `-${scrollY}px`
    body.style.left = '0'
    body.style.right = '0'
    body.style.overflow = 'hidden'

    return () => {
      body.style.position = ''
      body.style.top = ''
      body.style.left = ''
      body.style.right = ''
      body.style.overflow = ''
      window.scrollTo(0, scrollY)
    }
  }, [isLocked])
}
