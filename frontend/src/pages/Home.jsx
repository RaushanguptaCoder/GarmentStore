import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Zap, TrendingUp, Star } from 'lucide-react'
import HeroBanner from '../components/HeroBanner'
import CategoryGrid from '../components/CategoryGrid'
import ProductCard from '../components/ProductCard'
import { productsApi } from '../services/api'

function SkeletonCard() {
  return (
    <div className="rounded-2xl overflow-hidden border border-gray-100">
      <div className="skeleton aspect-[3/4]" />
      <div className="p-3 space-y-2">
        <div className="skeleton h-3 w-1/3" />
        <div className="skeleton h-4 w-3/4" />
        <div className="skeleton h-3 w-1/2" />
      </div>
    </div>
  )
}

function ProductSection({ title, icon: Icon, products, loading, viewAllHref }) {
  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          {Icon && <Icon size={22} className="text-brand-600" />}
          <h2 className="section-title">{title}</h2>
        </div>
        <Link to={viewAllHref} className="flex items-center gap-1 text-brand-600 font-semibold text-sm hover:underline">
          View All <ArrowRight size={15} />
        </Link>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {loading
          ? Array(10).fill(0).map((_, i) => <SkeletonCard key={i} />)
          : products.map(p => <ProductCard key={p.id} product={p} />)
        }
      </div>
    </section>
  )
}

const PROMO_BANNERS = [
  {
    title: 'FLAT 50% OFF',
    subtitle: 'On 500+ Women\'s Styles',
    cta: 'Shop Now',
    href: '/products?gender=Women&min_discount=50',
    bg: 'bg-gradient-to-br from-pink-500 to-rose-600',
    img: 'https://images.unsplash.com/photo-1483985988355-763728e1802?w=600&auto=format&fit=crop',
  },
  {
    title: 'MEN\'S ESSENTIALS',
    subtitle: 'Starting at just ₹499',
    cta: 'Explore',
    href: '/products?gender=Men',
    bg: 'bg-gradient-to-br from-slate-700 to-gray-900',
    img: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&auto=format&fit=crop',
  },
]

export default function Home() {
  const [featured, setFeatured] = useState([])
  const [newArrivals, setNewArrivals] = useState([])
  const [bestSellers, setBestSellers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const [f, n, b] = await Promise.all([
          productsApi.featured(10),
          productsApi.newArrivals(10),
          productsApi.bestSellers(10),
        ])
        setFeatured(f.data)
        setNewArrivals(n.data)
        setBestSellers(b.data)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <main>
      <HeroBanner />

      {/* Category Grid */}
      <CategoryGrid />

      {/* Promo Banners */}
      <section className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid md:grid-cols-2 gap-4">
          {PROMO_BANNERS.map(b => (
            <Link
              key={b.title}
              to={b.href}
              className={`${b.bg} relative rounded-2xl overflow-hidden h-44 flex items-center group card-hover`}
            >
              <img
                src={b.img}
                alt={b.title}
                className="absolute inset-0 w-full h-full object-cover object-top opacity-30 group-hover:opacity-40 transition-opacity"
              />
              <div className="relative z-10 px-8">
                <p className="text-white/80 text-xs font-semibold tracking-widest uppercase mb-1">{b.subtitle}</p>
                <h3 className="text-white text-3xl font-black mb-3">{b.title}</h3>
                <span className="inline-flex items-center gap-1 bg-white text-gray-900 text-xs font-bold px-4 py-2 rounded-full group-hover:bg-gray-100 transition-colors">
                  {b.cta} <ArrowRight size={12} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured */}
      <ProductSection
        title="Featured Collection"
        icon={Zap}
        products={featured}
        loading={loading}
        viewAllHref="/products?featured=true"
      />

      {/* Sale Banner */}
      <section className="max-w-7xl mx-auto px-4 py-4">
        <Link
          to="/products?min_discount=40"
          className="block bg-gradient-to-r from-brand-600 via-brand-700 to-red-800 rounded-2xl p-8 text-center group card-hover"
        >
          <p className="text-white/80 text-sm font-semibold tracking-widest mb-2">LIMITED TIME OFFER</p>
          <h2 className="text-white text-4xl md:text-5xl font-black mb-3">
            🔥 UP TO 70% OFF
          </h2>
          <p className="text-white/80 mb-4">On thousands of styles across all categories</p>
          <span className="inline-flex items-center gap-2 bg-white text-brand-700 font-bold px-8 py-3 rounded-full group-hover:bg-gray-100 transition-colors">
            Shop Sale <ArrowRight size={16} />
          </span>
        </Link>
      </section>

      {/* New Arrivals */}
      <ProductSection
        title="New Arrivals"
        icon={TrendingUp}
        products={newArrivals}
        loading={loading}
        viewAllHref="/products?new_arrival=true"
      />

      {/* Best Sellers */}
      <ProductSection
        title="Best Sellers"
        icon={Star}
        products={bestSellers}
        loading={loading}
        viewAllHref="/products?best_seller=true"
      />
    </main>
  )
}
