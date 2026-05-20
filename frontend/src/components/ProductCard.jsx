import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Heart, Star, ShoppingBag, Eye } from 'lucide-react'
import useStore from '../store/useStore'

function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map(s => (
        <Star
          key={s}
          size={11}
          className={s <= Math.round(rating) ? 'star-filled fill-amber-400' : 'star-empty'}
          fill={s <= Math.round(rating) ? '#f59e0b' : 'none'}
        />
      ))}
    </div>
  )
}

export default function ProductCard({ product }) {
  const { addToCart, setAuthModalOpen, user, showToast } = useStore()
  const [wishlisted, setWishlisted] = useState(false)
  const [addingToCart, setAddingToCart] = useState(false)

  const handleAddToCart = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!user) { setAuthModalOpen(true); return }
    setAddingToCart(true)
    const defaultSize = product.sizes?.[2] || product.sizes?.[0] || null
    const ok = await addToCart(product.id, defaultSize, product.colors?.[0] || null)
    if (ok) showToast(`${product.name} added to cart!`)
    else showToast('Failed to add to cart', 'error')
    setAddingToCart(false)
  }

  const handleWishlist = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setWishlisted(v => !v)
    showToast(wishlisted ? 'Removed from wishlist' : 'Added to wishlist ❤️')
  }

  return (
    <Link
      to={`/products/${product.id}`}
      className="group relative bg-white rounded-2xl overflow-hidden border border-gray-100 card-hover animate-fade-in flex flex-col"
      id={`product-${product.id}`}
    >
      {/* Image */}
      <div className="product-img-wrapper relative overflow-hidden bg-gray-50 aspect-[3/4]">
        <img
          src={product.image_url}
          alt={product.name}
          className="product-img"
          loading="lazy"
          onError={e => { e.target.src = 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=400' }}
        />

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.discount_percentage >= 30 && (
            <span className="badge-discount">{Math.round(product.discount_percentage)}% OFF</span>
          )}
          {product.is_new_arrival && <span className="badge-new">NEW</span>}
          {product.is_best_seller && (
            <span className="bg-amber-500 text-white text-xs font-bold px-2 py-0.5 rounded">BEST</span>
          )}
        </div>

        {/* Wishlist */}
        <button
          onClick={handleWishlist}
          className="absolute top-2 right-2 w-8 h-8 bg-white/80 backdrop-blur rounded-full flex items-center justify-center shadow hover:bg-white transition-all opacity-0 group-hover:opacity-100"
          aria-label="Add to wishlist"
        >
          <Heart
            size={15}
            className={wishlisted ? 'text-brand-600 fill-brand-600' : 'text-gray-600'}
            fill={wishlisted ? 'currentColor' : 'none'}
          />
        </button>

        {/* Quick actions */}
        <div className="absolute bottom-0 left-0 right-0 flex gap-1 p-2 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
          <button
            onClick={handleAddToCart}
            disabled={addingToCart}
            className="flex-1 flex items-center justify-center gap-1.5 bg-gray-900/90 backdrop-blur text-white text-xs font-semibold py-2 rounded-xl hover:bg-gray-900 transition-all disabled:opacity-60"
          >
            <ShoppingBag size={13} />
            {addingToCart ? 'Adding...' : 'Add to Bag'}
          </button>
          <Link
            to={`/products/${product.id}`}
            onClick={e => e.stopPropagation()}
            className="w-9 h-9 bg-white/90 backdrop-blur rounded-xl flex items-center justify-center text-gray-700 hover:bg-white transition-all"
          >
            <Eye size={15} />
          </Link>
        </div>
      </div>

      {/* Info */}
      <div className="p-3 flex flex-col flex-1">
        <p className="text-xs font-semibold text-brand-600 uppercase tracking-wide mb-0.5">{product.brand}</p>
        <h3 className="text-sm font-medium text-gray-800 line-clamp-2 flex-1">{product.name}</h3>

        <div className="mt-2 flex items-center gap-1">
          <StarRating rating={product.rating} />
          <span className="text-xs text-gray-400">({product.review_count})</span>
        </div>

        <div className="mt-2 flex items-center gap-2 flex-wrap">
          <span className="text-base font-bold text-gray-900">₹{product.price.toLocaleString('en-IN')}</span>
          {product.original_price > product.price && (
            <>
              <span className="text-xs text-gray-400 line-through">₹{product.original_price.toLocaleString('en-IN')}</span>
              <span className="text-xs font-bold text-green-600">{Math.round(product.discount_percentage)}% off</span>
            </>
          )}
        </div>

        {/* Sizes */}
        {product.sizes?.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {product.sizes.slice(0, 4).map(s => (
              <span key={s} className="text-xs text-gray-500 border border-gray-200 px-1.5 py-0.5 rounded">{s}</span>
            ))}
            {product.sizes.length > 4 && (
              <span className="text-xs text-gray-400">+{product.sizes.length - 4}</span>
            )}
          </div>
        )}
      </div>
    </Link>
  )
}
