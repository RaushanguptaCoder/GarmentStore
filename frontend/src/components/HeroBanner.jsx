import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const SLIDES = [
  {
    id: 1,
    title: 'New Season,\nNew You',
    subtitle: 'Up to 70% OFF on Women\'s Western Wear',
    cta: 'Shop Women',
    href: '/products?gender=Women&category=women-western',
    bg: 'from-rose-900 via-pink-800 to-purple-900',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1802?w=1400&auto=format&fit=crop',
    badge: '70% OFF',
  },
  {
    id: 2,
    title: 'Men\'s Edit\nSS 2026',
    subtitle: 'Curated styles for the modern man',
    cta: 'Shop Men',
    href: '/products?gender=Men',
    bg: 'from-slate-900 via-gray-800 to-zinc-900',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1400&auto=format&fit=crop',
    badge: 'NEW IN',
  },
  {
    id: 3,
    title: 'Sneaker\nDrop 2026',
    subtitle: 'Top brands — Nike, Puma, Adidas starting ₹999',
    cta: 'Shop Footwear',
    href: '/products?category=sports-footwear',
    bg: 'from-orange-900 via-amber-800 to-yellow-900',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1400&auto=format&fit=crop',
    badge: 'EXCLUSIVE',
  },
  {
    id: 4,
    title: 'Ethnic Luxe\nCollection',
    subtitle: 'Sarees, Kurtas & Lehengas for every occasion',
    cta: 'Explore Now',
    href: '/products?category=women-ethnic',
    bg: 'from-emerald-900 via-teal-800 to-cyan-900',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1400&auto=format&fit=crop',
    badge: 'LUXE EDIT',
  },
]

export default function HeroBanner() {
  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)

  const next = useCallback(() => setCurrent(c => (c + 1) % SLIDES.length), [])
  const prev = useCallback(() => setCurrent(c => (c - 1 + SLIDES.length) % SLIDES.length), [])

  useEffect(() => {
    if (paused) return
    const t = setInterval(next, 5000)
    return () => clearInterval(t)
  }, [next, paused])

  const slide = SLIDES[current]

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{ height: 'clamp(340px, 55vw, 600px)' }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Background image */}
      {SLIDES.map((s, i) => (
        <div
          key={s.id}
          className={`absolute inset-0 transition-opacity duration-700 ${i === current ? 'opacity-100' : 'opacity-0'}`}
        >
          <img
            src={s.image}
            alt={s.title}
            className="w-full h-full object-cover object-top"
            loading={i === 0 ? 'eager' : 'lazy'}
          />
          <div className={`absolute inset-0 bg-gradient-to-r ${s.bg} opacity-75`} />
        </div>
      ))}

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-6 md:px-12 w-full">
          <div className="max-w-lg animate-fade-in" key={current}>
            <span className="inline-block bg-white/20 backdrop-blur text-white text-xs font-bold tracking-widest px-3 py-1 rounded-full mb-4 border border-white/30">
              {slide.badge}
            </span>
            <h1 className="text-4xl md:text-6xl font-black text-white leading-tight whitespace-pre-line mb-3 drop-shadow-lg">
              {slide.title}
            </h1>
            <p className="text-white/80 text-base md:text-lg mb-8 font-light">{slide.subtitle}</p>
            <Link
              to={slide.href}
              className="inline-flex items-center gap-2 bg-white text-gray-900 font-bold px-8 py-3.5 rounded-full hover:bg-gray-100 transition-all active:scale-95 shadow-xl text-sm md:text-base"
            >
              {slide.cta} →
            </Link>
          </div>
        </div>
      </div>

      {/* Arrows */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/20 hover:bg-white/40 backdrop-blur rounded-full flex items-center justify-center text-white transition-all"
        aria-label="Previous slide"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/20 hover:bg-white/40 backdrop-blur rounded-full flex items-center justify-center text-white transition-all"
        aria-label="Next slide"
      >
        <ChevronRight size={20} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`dot ${i === current ? 'active' : ''}`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
