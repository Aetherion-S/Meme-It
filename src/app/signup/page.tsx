'use client'

import { useState, useEffect, useRef } from 'react'
import { Eye as EyeIcon, EyeOff, ArrowRight, ArrowLeft } from 'lucide-react'
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
      setStyle({ transform: `translate(10px, 2px) rotate(5deg) skewX(-1deg)` }) // Lean right (away from form on left side)
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

export default function SignupPage() {
  const [step, setStep] = useState<1 | 2>(1)
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [otpCode, setOtpCode] = useState('')
  
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

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: username,
        }
      }
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      // Move to OTP verification step
      setStep(2)
      setLoading(false)
    }
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token: otpCode,
      type: 'signup'
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else if (data.session) {
      // User is verified!
      // Attempt to insert public user profile (Assuming RLS allows it, or you setup a Postgres trigger)
      const { error: profileError } = await supabase
        .from('users')
        .insert({ id: data.session.user.id, username, email })

      if (profileError) {
        console.error("Profile creation failed:", profileError)
        // Non-blocking error, user is still authenticated
      }
      
      router.push('/')
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen bg-[#1c1c1e] flex items-center justify-center p-4" style={{ perspective: '2000px' }}>
      {/* Main Card */}
      <motion.div 
        initial={{ rotateY: 90, opacity: 0 }}
        animate={{ rotateY: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="bg-white rounded-[32px] w-full max-w-[1000px] min-h-[600px] flex overflow-hidden shadow-2xl flex-row-reverse origin-center"
      >
        
        {/* Right Side - Animated People Area */}
        <div className="hidden md:flex w-1/2 bg-[#f0f0f2] relative items-end justify-center pb-8 overflow-hidden">
          
          <div className="relative w-[320px] h-[300px] flex items-end justify-center">
            
            {/* Same charming characters, but facing the left form */}
            
            {/* 1. Girl 1 */}
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

            {/* 2. Man 1 */}
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

            {/* 3. Girl 2 */}
            <AnimatedCharacter mouseX={mousePos.x} mouseY={mousePos.y} className="right-20 z-20" maxOffset={12} isHiding={showPassword}>
              <div className="w-20 h-32 bg-[#b45309] rounded-t-3xl absolute -top-2 z-0"></div>
              <div className="w-14 h-14 bg-[#ffedd5] rounded-full flex space-x-1.5 items-center justify-center z-10 mt-2 relative">
                <AnimatedEye mouseX={mousePos.x} mouseY={mousePos.y} size={16} />
                <AnimatedEye mouseX={mousePos.x} mouseY={mousePos.y} size={16} />
                <CoveringHands isHiding={showPassword} color="#ffedd5" size={1.3} />
              </div>
              <div className="w-16 h-24 bg-[#10b981] rounded-t-[2rem] relative mt-[-5px] z-20"></div>
            </AnimatedCharacter>

            {/* 4. Man 2 */}
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

        {/* Left Side - Form Area */}
        <div className="w-full md:w-1/2 p-10 md:p-14 flex flex-col justify-center items-center relative">
          
          <div className="w-full max-w-[320px] mx-auto text-center">
            
            {step === 1 && (
              <>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">Join Meme-It</h1>
                <p className="text-sm text-gray-500 mb-8">Create your account to start sharing</p>

                {error && (
                  <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm mb-4 text-left">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSignUp} className="space-y-5 text-left">
                  {/* Username Input */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700 ml-1">Username</label>
                    <input 
                      type="text" 
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full border-b border-gray-300 px-1 py-2 text-sm focus:outline-none focus:border-black transition-colors"
                      required
                    />
                  </div>

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
                        minLength={6}
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

                  {/* Buttons */}
                  <div className="pt-4">
                    <button 
                      type="submit" 
                      disabled={loading}
                      className="w-full bg-[#111111] hover:bg-black text-white font-medium py-3 rounded-full text-sm transition-transform active:scale-[0.98] disabled:opacity-70 flex items-center justify-center space-x-2"
                    >
                      <span>{loading ? 'Creating account...' : 'Continue'}</span>
                      {!loading && <ArrowRight size={16} />}
                    </button>
                  </div>
                </form>
              </>
            )}

            {step === 2 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300 text-left">
                <button 
                  onClick={() => setStep(1)}
                  className="mb-6 flex items-center space-x-1 text-sm text-gray-500 hover:text-black transition-colors"
                >
                  <ArrowLeft size={16} />
                  <span>Back</span>
                </button>
                
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">Check your email</h1>
                <p className="text-sm text-gray-500 mb-8">
                  We sent a 6-digit verification code to <br/>
                  <span className="font-medium text-black">{email}</span>
                </p>

                {error && (
                  <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm mb-4 text-left">
                    {error}
                  </div>
                )}

                <form onSubmit={handleVerifyOtp} className="space-y-6">
                  {/* OTP Input */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700 ml-1">Verification Code</label>
                    <input 
                      type="text" 
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      placeholder="000000"
                      className="w-full border-b border-gray-300 px-1 py-3 text-2xl tracking-[0.5em] font-medium text-center focus:outline-none focus:border-black transition-colors"
                      required
                      maxLength={6}
                    />
                  </div>

                  <button 
                    type="submit" 
                    disabled={loading || otpCode.length !== 6}
                    className="w-full bg-[#111111] hover:bg-black text-white font-medium py-3 rounded-full text-sm transition-transform active:scale-[0.98] disabled:opacity-70"
                  >
                    {loading ? 'Verifying...' : 'Verify & Sign Up'}
                  </button>
                </form>
              </div>
            )}

            <div className="mt-8 text-center text-xs text-gray-500">
              Already have an account? <Link href="/login" className="text-black font-medium hover:underline">Log In</Link>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
