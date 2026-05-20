import { Link } from 'react-router-dom'

const CATEGORIES = [
  { name: 'Women Western', slug: 'women-western', gender: 'Women',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&auto=format&fit=crop',
    color: 'from-pink-500 to-rose-600' },
  { name: 'Men\'s Shirts', slug: 'men-shirts', gender: 'Men',
    image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&auto=format&fit=crop',
    color: 'from-blue-600 to-indigo-700' },
  { name: 'Ethnic Wear', slug: 'women-ethnic', gender: 'Women',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&auto=format&fit=crop',
    color: 'from-amber-500 to-orange-600' },
  { name: 'Sneakers', slug: 'sports-footwear', gender: null,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&auto=format&fit=crop',
    color: 'from-gray-700 to-gray-900' },
  { name: 'Sports', slug: 'sports-activewear', gender: null,
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&auto=format&fit=crop',
    color: 'from-green-500 to-emerald-700' },
  { name: 'Kids Wear', slug: 'kids', gender: 'Kids',
    image: 'https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?w=400&auto=format&fit=crop',
    color: 'from-purple-500 to-violet-700' },
  { name: 'Women Footwear', slug: 'women-footwear', gender: 'Women',
    image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&auto=format&fit=crop',
    color: 'from-red-500 to-rose-700' },
  { name: 'Men Jeans', slug: 'men-jeans', gender: 'Men',
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&auto=format&fit=crop',
    color: 'from-slate-600 to-slate-800' },
]

export default function CategoryGrid() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="section-title">Shop by Category</h2>
          <p className="text-gray-500 text-sm mt-1">Explore our curated collections</p>
        </div>
        <Link to="/products" className="text-brand-600 font-semibold text-sm hover:underline">
          View All →
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.slug}
            to={`/products?category=${cat.slug}${cat.gender ? `&gender=${cat.gender}` : ''}`}
            className="group relative overflow-hidden rounded-2xl aspect-[3/4] card-hover cursor-pointer"
          >
            {/* Image */}
            <div className="product-img-wrapper absolute inset-0">
              <img
                src={cat.image}
                alt={cat.name}
                className="product-img"
                loading="lazy"
              />
            </div>
            {/* Gradient overlay */}
            <div className={`absolute inset-0 bg-gradient-to-t ${cat.color} opacity-50 group-hover:opacity-60 transition-opacity`} />
            {/* Label */}
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <h3 className="text-white font-bold text-base leading-tight drop-shadow">{cat.name}</h3>
              <span className="text-white/70 text-xs group-hover:text-white transition-colors">Shop Now →</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
