'use client'

import { useState, useEffect, useRef } from 'react'
import { Eye as EyeIcon, EyeOff } from 'lucide-react'
import Link from 'next/link'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

// Animated Eye Component that follows the cursor
const AnimatedEye = ({ mouseX, mouseY, size = 16 }: { mouseX: number, mouseY: number, size?: number }) => {
  const eyeRef = useRef<HTMLDivElement>(null)
  const [pupilStyle, setPupilStyle] = useState({ transform: 'translate(0px, 0px)' })

  useEffect(() => {
    if (!eyeRef.current) return
    
    const rect = eyeRef.current.getBoundingClientRect()
    const eyeCenterX = rect.left + rect.width / 2
    const eyeCenterY = rect.top + rect.height / 2

    const deltaX = mouseX - eyeCenterX
    const deltaY = mouseY - eyeCenterY
    const angle = Math.atan2(deltaY, deltaX)
    
    const maxDistance = size / 3.5 
    const distance = Math.min(maxDistance, Math.hypot(deltaX, deltaY) / 15) 

    const pupilX = Math.cos(angle) * distance
    const pupilY = Math.sin(angle) * distance

    setPupilStyle({ transform: `translate(${pupilX}px, ${pupilY}px)` })
  }, [mouseX, mouseY, size])

  return (
    <div 
      ref={eyeRef} 
      className="bg-white rounded-full flex items-center justify-center shadow-inner relative transition-all duration-200"
      style={{ width: size, height: size }}
    >
      <div 
        className="bg-[#111] rounded-full absolute" 
        style={{ 
          width: size / 2, 
          height: size / 2, 
          ...pupilStyle 
        }}
      >
        <div className="absolute top-[10%] right-[10%] w-[30%] h-[30%] bg-white rounded-full opacity-80"></div>
      </div>
    </div>
  )
}

// The hands that slide up to cover the face
const CoveringHands = ({ isHiding, color, size = 5 }: { isHiding: boolean, color: string, size?: number }) => {
  return (
    <div 
      className={`absolute inset-0 flex items-center justify-center space-x-[2px] z-50 transition-all duration-300 pointer-events-none
        ${isHiding ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}
      `}
    >
      <div 
        className="rounded-full shadow-md border-[1.5px] border-[#111]" 
        style={{ width: `${size}rem`, height: `${size}rem`, backgroundColor: color, transform: 'rotate(15deg)' }}
      ></div>
      <div 
        className="rounded-full shadow-md border-[1.5px] border-[#111]" 
        style={{ width: `${size}rem`, height: `${size}rem`, backgroundColor: color, transform: 'rotate(-15deg)' }}
      ></div>
    </div>
  )
}

// Wrapper to make characters lean/stretch towards the mouse, or lean away if hiding
const AnimatedCharacter = ({ mouseX, mouseY, children, className = '', maxOffset = 12, isHiding = false }: { mouseX: number, mouseY: number, children: React.ReactNode, className?: string, maxOffset?: number, isHiding?: boolean }) => {
  const charRef = useRef<HTMLDivElement>(null)
  const [style, setStyle] = useState({ transform: 'translate(0px, 0px) rotate(0deg) skewX(0deg)' })

  useEffect(() => {
    if (!charRef.current) return

    if (isHiding) {
      // Lean away to the left slightly as they cover their eyes
      setStyle({ transform: `translate(-10px, 2px) rotate(-5deg) skewX(1deg)` })
      return
    }

    const rect = charRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.bottom

    const deltaX = mouseX - centerX
    const deltaY = mouseY - centerY
    const angle = Math.atan2(deltaY, deltaX)
    
    const distance = Math.min(maxOffset, Math.hypot(deltaX, deltaY) / 25) 
    const offsetX = Math.cos(angle) * distance
    const offsetY = Math.sin(angle) * (distance * 0.5) 

    const rotate = (offsetX / maxOffset) * 4 
    const skew = (offsetX / maxOffset) * -2 

    setStyle({ transform: `translate(${offsetX}px, ${offsetY}px) rotate(${rotate}deg) skewX(${skew}deg)` })
  }, [mouseX, mouseY, maxOffset, isHiding])

  return (
    <div 
      ref={charRef} 
      className={`absolute bottom-0 flex flex-col items-center transition-transform duration-300 ease-out origin-bottom ${className}`} 
      style={style}
    >
      {children}
    </div>
  )
}

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  
  const router = useRouter()

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
    } else {
      router.push('/')
      router.refresh()
    }
    
    setLoading(false)
  }

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${location.origin}/auth/callback`
      }
    })
  }

  return (
    <div className="min-h-screen bg-[#1c1c1e] flex items-center justify-center p-4" style={{ perspective: '2000px' }}>
      {/* Main Card */}
      <motion.div 
        initial={{ rotateY: -90, opacity: 0 }}
        animate={{ rotateY: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="bg-white rounded-[32px] w-full max-w-[1000px] min-h-[600px] flex overflow-hidden shadow-2xl origin-center"
      >
        
        {/* Left Side - Animated People Area */}
        <div className="hidden md:flex w-1/2 bg-[#f0f0f2] relative items-end justify-center pb-8 overflow-hidden">
          
          <div className="relative w-[320px] h-[300px] flex items-end justify-center">
            
            {/* 1. Girl 1 (Left - Pink/Purple, space buns) */}
            <AnimatedCharacter mouseX={mousePos.x} mouseY={mousePos.y} className="left-4 z-10" maxOffset={15} isHiding={showPassword}>
              <div className="flex space-x-6 absolute -top-3 z-0">
                <div className="w-5 h-5 bg-[#d946ef] rounded-full"></div>
                <div className="w-5 h-5 bg-[#d946ef] rounded-full"></div>
              </div>
              <div className="w-16 h-16 bg-[#fcd34d] rounded-full flex space-x-1 items-center justify-center z-10 border-b border-orange-200 relative">
                <AnimatedEye mouseX={mousePos.x} mouseY={mousePos.y} size={14} />
                <AnimatedEye mouseX={mousePos.x} mouseY={mousePos.y} size={14} />
                <CoveringHands isHiding={showPassword} color="#fcd34d" size={1.25} />
              </div>
              <div className="w-20 h-28 bg-[#d946ef] rounded-t-3xl relative mt-[-10px] z-20">
                 <div className="absolute top-4 left-1/2 -translate-x-1/2 w-4 h-[2px] bg-white opacity-50 rounded-full"></div>
              </div>
            </AnimatedCharacter>

            {/* 2. Man 1 (Center Left - Tall, Blue) */}
            <AnimatedCharacter mouseX={mousePos.x} mouseY={mousePos.y} className="left-24 z-30" maxOffset={10} isHiding={showPassword}>
              <div className="w-16 h-6 bg-[#1e1e1e] rounded-t-xl absolute -top-2 z-0"></div>
              <div className="w-14 h-16 bg-[#fed7aa] rounded-full flex space-x-2 items-center justify-center z-10 border-b border-orange-200 relative">
                <AnimatedEye mouseX={mousePos.x} mouseY={mousePos.y} size={12} />
                <AnimatedEye mouseX={mousePos.x} mouseY={mousePos.y} size={12} />
                <CoveringHands isHiding={showPassword} color="#fed7aa" size={1.1} />
              </div>
              <div className="w-16 h-40 bg-[#3b82f6] rounded-t-3xl relative mt-[-12px] z-20 shadow-lg">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-4 bg-white rounded-b-full opacity-80"></div>
              </div>
            </AnimatedCharacter>

            {/* 3. Girl 2 (Center Right - Green, Long hair) */}
            <AnimatedCharacter mouseX={mousePos.x} mouseY={mousePos.y} className="right-20 z-20" maxOffset={12} isHiding={showPassword}>
              <div className="w-20 h-32 bg-[#b45309] rounded-t-3xl absolute -top-2 z-0"></div>
              <div className="w-14 h-14 bg-[#ffedd5] rounded-full flex space-x-1.5 items-center justify-center z-10 mt-2 relative">
                <AnimatedEye mouseX={mousePos.x} mouseY={mousePos.y} size={16} />
                <AnimatedEye mouseX={mousePos.x} mouseY={mousePos.y} size={16} />
                <CoveringHands isHiding={showPassword} color="#ffedd5" size={1.3} />
              </div>
              <div className="w-16 h-24 bg-[#10b981] rounded-t-[2rem] relative mt-[-5px] z-20"></div>
            </AnimatedCharacter>

            {/* 4. Man 2 (Right - Orange, Short/Stout) */}
            <AnimatedCharacter mouseX={mousePos.x} mouseY={mousePos.y} className="right-2 z-10" maxOffset={14} isHiding={showPassword}>
               <div className="w-18 h-8 bg-[#ef4444] rounded-t-full absolute -top-4 z-10 rotate-12"></div>
              <div className="w-20 h-20 bg-[#fbcfe8] rounded-full flex space-x-3 items-center justify-center z-10 relative">
                <AnimatedEye mouseX={mousePos.x} mouseY={mousePos.y} size={18} />
                <AnimatedEye mouseX={mousePos.x} mouseY={mousePos.y} size={18} />
                <CoveringHands isHiding={showPassword} color="#fbcfe8" size={1.5} />
              </div>
              <div className="w-24 h-20 bg-[#f97316] rounded-t-[2.5rem] relative mt-[-15px] z-20">
                <div className="absolute top-5 left-1/2 -translate-x-1/2 w-6 h-[3px] bg-white opacity-40 rounded-full"></div>
              </div>
            </AnimatedCharacter>

          </div>
        </div>

        {/* Right Side - Form Area */}
        <div className="w-full md:w-1/2 p-10 md:p-14 flex flex-col justify-center items-center relative">
          
          {/* Logo */}
          <div className="w-8 h-8 mb-8 text-black">
            <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 0C12 6.627 17.373 12 24 12C17.373 12 12 17.373 12 24C12 17.373 6.627 12 0 12C6.627 12 12 6.627 12 0Z" />
            </svg>
          </div>

          <div className="w-full max-w-[320px] mx-auto text-center">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">Welcome back!</h1>
            <p className="text-sm text-gray-500 mb-8">Please enter your details</p>

            {error && (
              <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm mb-4 text-left">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5 text-left">
              {/* Email Input */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-700 ml-1">Email</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border-b border-gray-300 px-1 py-2 text-sm focus:outline-none focus:border-black transition-colors"
                  required
                />
              </div>

              {/* Password Input */}
              <div className="space-y-1 relative">
                <label className="text-xs font-semibold text-gray-700 ml-1">Password</label>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border-b border-gray-300 px-1 py-2 text-sm focus:outline-none focus:border-black transition-colors"
                    required
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-1 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={16} /> : <EyeIcon size={16} />}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input type="checkbox" className="w-3.5 h-3.5 rounded border-gray-300 text-black focus:ring-black accent-black" />
                  <span className="text-xs text-gray-500">Remember for 30 days</span>
                </label>
                <Link href="#" className="text-xs text-gray-500 hover:text-black">
                  Forgot password?
                </Link>
              </div>

              {/* Buttons */}
              <div className="pt-4 space-y-3">
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-[#111111] hover:bg-black text-white font-medium py-3 rounded-full text-sm transition-transform active:scale-[0.98] disabled:opacity-70"
                >
                  {loading ? 'Logging in...' : 'Log In'}
                </button>
                
                <button 
                  type="button"
                  onClick={handleGoogleLogin}
                  className="w-full bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium py-3 rounded-full text-sm flex items-center justify-center space-x-2 transition-transform active:scale-[0.98]"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  <span>Log in with Google</span>
                </button>
              </div>
            </form>

            <div className="mt-8 text-center text-xs text-gray-500">
              Don't have an account? <Link href="/signup" className="text-black font-medium hover:underline">Sign Up</Link>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
