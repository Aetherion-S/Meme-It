'use client'

import { useEffect, useState } from 'react'

export function ThemeToggleLogo() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = (event: React.MouseEvent) => {
    const isDark = document.documentElement.classList.contains('dark')
    
    // Fallback for browsers that don't support View Transitions
    if (!document.startViewTransition) {
      document.documentElement.classList.toggle('dark')
      return
    }

    const x = event.clientX
    const y = event.clientY
    const endRadius = Math.hypot(
      Math.max(x, innerWidth - x),
      Math.max(y, innerHeight - y)
    )

    const transition = document.startViewTransition(() => {
      document.documentElement.classList.toggle('dark')
    })

    transition.ready.then(() => {
      const clipPath = [
        `circle(0px at ${x}px ${y}px)`,
        `circle(${endRadius}px at ${x}px ${y}px)`
      ]

      document.documentElement.animate(
        {
          clipPath: clipPath,
        },
        {
          duration: 500,
          easing: 'ease-in-out',
          pseudoElement: '::view-transition-new(root)',
        }
      )
    })
  }

  if (!mounted) {
    return (
      <img 
        src="/logo.jpg" 
        alt="MemeIt Logo" 
        className="w-10 h-10 rounded-xl cursor-pointer" 
      />
    )
  }

  return (
    <img 
      src="/logo.jpg" 
      alt="MemeIt Logo" 
      onClick={toggleTheme}
      className="w-10 h-10 rounded-xl hover:rotate-[360deg] transition-transform duration-700 ease-in-out cursor-pointer relative z-[100]" 
    />
  )
}
