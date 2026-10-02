'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, Search, Loader2 } from 'lucide-react'

// Expects NEXT_PUBLIC_GIPHY_API_KEY in .env.local
const GIPHY_API_KEY = process.env.NEXT_PUBLIC_GIPHY_API_KEY || ''

interface GiphyImage {
  id: string
  title: string
  images: {
    fixed_width: {
      url: string
      width: string
      height: string
    }
    original: {
      url: string
    }
  }
}

export function GiphyFeed() {
  const [gifs, setGifs] = useState<GiphyImage[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const [submittedQuery, setSubmittedQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)

  const observerTarget = useRef<HTMLDivElement>(null)

  const fetchGifs = useCallback(async (pageNum: number, query: string) => {
    if (!GIPHY_API_KEY) {
      console.error("Giphy API Key is missing in .env.local")
      setLoading(false)
      setIsSearching(false)
      return
    }

    try {
      setLoading(true)
      const limit = 20
      const offset = pageNum * limit
      
      const endpoint = query 
        ? `https://api.giphy.com/v1/gifs/search?api_key=${GIPHY_API_KEY}&q=${encodeURIComponent(query)}&limit=${limit}&offset=${offset}`
        : `https://api.giphy.com/v1/gifs/trending?api_key=${GIPHY_API_KEY}&limit=${limit}&offset=${offset}`

      const response = await fetch(endpoint)
      const data = await response.json()

      if (data.data) {
        setGifs(prev => pageNum === 0 ? data.data : [...prev, ...data.data])
      }
    } catch (error) {
      console.error("Failed to fetch GIFs:", error)
    } finally {
      setLoading(false)
      setIsSearching(false)
    }
  }, [])

  // Initial load
  useEffect(() => {
    fetchGifs(0, submittedQuery)
  }, [])

  // Infinite Scroll Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && !loading) {
          const nextPage = page + 1
          setPage(nextPage)
          fetchGifs(nextPage, submittedQuery)
        }
      },
      { threshold: 1.0 }
    )

    if (observerTarget.current) {
      observer.observe(observerTarget.current)
    }

    return () => observer.disconnect()
  }, [loading, page, submittedQuery, fetchGifs])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setPage(0)
    setIsSearching(true)
    setSubmittedQuery(searchQuery)
    fetchGifs(0, searchQuery)
  }

  return (
    <div className="space-y-8">
      {/* Search Bar */}
      <div className="max-w-2xl mx-auto">
        <form onSubmit={handleSearch} className="relative group">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-muted-foreground group-focus-within:text-foreground transition-colors" />
          </div>
          <input
            type="text"
            placeholder="Search for memes, reactions, or emotions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-background/50 backdrop-blur-md border border-border rounded-full py-4 pl-12 pr-6 focus:outline-none focus:ring-2 focus:ring-foreground/5 shadow-sm text-lg transition-all"
          />
          <button 
            type="submit" 
            className="absolute inset-y-2 right-2 bg-primary text-primary-foreground px-6 rounded-full font-medium hover:bg-primary/90 transition-colors"
          >
            {isSearching ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Search'}
          </button>
        </form>
      </div>

      {!GIPHY_API_KEY && (
        <div className="text-center p-8 bg-red-50 border border-red-200 text-red-600 rounded-2xl">
          <p className="font-medium">Missing Giphy API Key</p>
          <p className="text-sm mt-1">Please add NEXT_PUBLIC_GIPHY_API_KEY to your .env.local file.</p>
        </div>
      )}

      {/* Masonry Grid */}
      <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
        <AnimatePresence>
          {gifs.map((gif, idx) => (
            <motion.div
              key={`${gif.id}-${idx}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: (idx % 10) * 0.05 }}
              className="break-inside-avoid relative group rounded-2xl overflow-hidden bg-muted shadow-sm hover:shadow-xl transition-all"
            >
              <img
                src={gif.images.fixed_width.url}
                alt={gif.title}
                width={gif.images.fixed_width.width}
                height={gif.images.fixed_width.height}
                className="w-full h-auto object-cover"
                loading="lazy"
              />
              
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                <div className="flex items-center justify-between">
                  <p className="text-white text-sm font-medium line-clamp-1 flex-1 pr-4">
                    {gif.title || 'Untitled Meme'}
                  </p>
                  <button className="bg-white/20 hover:bg-white/40 backdrop-blur p-2 rounded-full text-white transition-colors">
                    <Heart className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Loading & Infinite Scroll Target */}
      <div ref={observerTarget} className="h-20 flex items-center justify-center">
        {loading && GIPHY_API_KEY && (
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        )}
      </div>
    </div>
  )
}
