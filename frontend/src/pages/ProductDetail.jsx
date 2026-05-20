import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Star, Heart, ShoppingBag, Truck, RefreshCw, Shield, ChevronRight, Minus, Plus } from 'lucide-react'
import useStore from '../store/useStore'
import { productsApi } from '../services/api'

function StarRow({ rating, reviewCount }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex bg-green-500 text-white text-sm font-bold px-2 py-0.5 rounded gap-1 items-center">
        {rating.toFixed(1)} <Star size={12} fill="white" />
      </div>
      <span className="text-gray-500 text-sm">({reviewCount.toLocaleString()} reviews)</span>
    </div>
  )
}

export default function ProductDetail() {
  const { id } = useParams()
  const { addToCart, setAuthModalOpen, user, showToast } = useStore()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedSize, setSelectedSize] = useState(null)
  const [selectedColor, setSelectedColor] = useState(null)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [addingToCart, setAddingToCart] = useState(false)
  const [wishlisted, setWishlisted] = useState(false)
  const [sizeError, setSizeError] = useState(false)
  const [related, setRelated] = useState([])

  useEffect(() => {
    setLoading(true)
    productsApi.get(id)
      .then(r => {
        setProduct(r.data)
        setSelectedColor(r.data.colors?.[0] || null)
        setSelectedImage(0)
        // Fetch related
        if (r.data.category?.slug) {
          productsApi.list({ category: r.data.category.slug, page_size: 4 })
            .then(rr => setRelated(rr.data.products.filter(p => p.id !== r.data.id).slice(0,4)))
            .catch(() => {})
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [id])

  const handleAddToCart = async () => {
    if (!user) { setAuthModalOpen(true); return }
    if (product.sizes?.length > 0 && !selectedSize) {
      setSizeError(true)
      document.getElementById('size-select')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }
    setSizeError(false)
    setAddingToCart(true)
    const ok = await addToCart(product.id, selectedSize, selectedColor, quantity)
    if (ok) showToast('Added to bag! 🛍️')
    else showToast('Please sign in to add items', 'error')
    setAddingToCart(false)
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-10">
          <div className="skeleton rounded-2xl aspect-square" />
          <div className="space-y-4">
            <div className="skeleton h-4 w-1/4 rounded" />
            <div className="skeleton h-8 w-3/4 rounded" />
            <div className="skeleton h-6 w-1/2 rounded" />
            <div className="skeleton h-12 w-full rounded" />
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-gray-500 text-lg mb-4">Product not found</p>
        <Link to="/products" className="btn-primary">Continue Shopping</Link>
      </div>
    )
  }

  const allImages = [product.image_url, ...(product.images || [])].filter(Boolean)
  const savings = product.original_price - product.price

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-xs text-gray-500 mb-6 flex items-center gap-1">
        <Link to="/" className="hover:text-brand-600">Home</Link>
        <ChevronRight size={12} />
        <Link to="/products" className="hover:text-brand-600">Products</Link>
        {product.category && (
          <>
            <ChevronRight size={12} />
            <Link to={`/products?category=${product.category.slug}`} className="hover:text-brand-600 capitalize">
              {product.category.name}
            </Link>
          </>
        )}
        <ChevronRight size={12} />
        <span className="text-gray-800 font-medium truncate max-w-xs">{product.name}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-10">
        {/* Image Gallery */}
        <div className="flex gap-3">
          {/* Thumbnails */}
          {allImages.length > 1 && (
            <div className="flex flex-col gap-2">
              {allImages.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`w-14 h-16 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0
                    ${i === selectedImage ? 'border-brand-600' : 'border-transparent'}`}
                >
                  <img src={img} alt={`View ${i+1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Main image */}
          <div className="flex-1 relative rounded-2xl overflow-hidden bg-gray-50 aspect-square">
            <img
              src={allImages[selectedImage] || product.image_url}
              alt={product.name}
              className="w-full h-full object-cover"
              onError={e => { e.target.src = 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=600' }}
            />
            {product.discount_percentage > 0 && (
              <div className="absolute top-4 left-4">
                <span className="badge-discount text-sm px-3 py-1">{Math.round(product.discount_percentage)}% OFF</span>
              </div>
            )}
            <button
              onClick={() => setWishlisted(v => !v)}
              className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow hover:shadow-md transition-all"
            >
              <Heart size={18} className={wishlisted ? 'text-brand-600 fill-brand-600' : 'text-gray-600'} fill={wishlisted ? 'currentColor' : 'none'} />
            </button>
          </div>
        </div>

        {/* Product Info */}
        <div className="flex flex-col gap-5">
          {/* Brand + badges */}
          <div className="flex items-center gap-2">
            <span className="text-brand-600 font-bold text-lg">{product.brand}</span>
            {product.is_new_arrival && <span className="badge-new">NEW</span>}
            {product.is_best_seller && <span className="bg-amber-500 text-white text-xs font-bold px-2 py-0.5 rounded">BESTSELLER</span>}
          </div>

          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">{product.name}</h1>

          {/* Rating */}
          <StarRow rating={product.rating} reviewCount={product.review_count} />

          {/* Price */}
          <div className="flex items-baseline gap-3 flex-wrap">
            <span className="text-3xl font-black text-gray-900">₹{product.price.toLocaleString('en-IN')}</span>
            {product.original_price > product.price && (
              <>
                <span className="text-lg text-gray-400 line-through">₹{product.original_price.toLocaleString('en-IN')}</span>
                <span className="text-green-600 font-bold text-lg">{Math.round(product.discount_percentage)}% off</span>
              </>
            )}
          </div>
          {savings > 0 && (
            <p className="text-green-600 text-sm font-medium bg-green-50 px-3 py-1.5 rounded-lg inline-fit">
              You save ₹{savings.toLocaleString('en-IN')} on this item 🎉
            </p>
          )}

          {/* Color Select */}
          {product.colors?.length > 0 && (
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-2">
                Color: <span className="font-normal text-gray-500">{selectedColor}</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {product.colors.map(c => (
                  <button
                    key={c}
                    onClick={() => setSelectedColor(c)}
                    className={`tag text-xs ${selectedColor === c ? 'bg-brand-100 text-brand-700 ring-1 ring-brand-400' : ''}`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size Select */}
          {product.sizes?.length > 0 && (
            <div id="size-select">
              <div className="flex items-center justify-between mb-2">
                <p className={`text-sm font-semibold ${sizeError ? 'text-red-500' : 'text-gray-700'}`}>
                  {sizeError ? '⚠ Please select a size' : 'Select Size'}
                </p>
                <button className="text-xs text-brand-600 underline">Size Guide</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map(s => (
                  <button
                    key={s}
                    onClick={() => { setSelectedSize(s); setSizeError(false) }}
                    className={`min-w-[48px] h-11 text-sm font-medium border-2 rounded-xl transition-all
                      ${selectedSize === s
                        ? 'border-brand-600 bg-brand-600 text-white shadow-md'
                        : 'border-gray-200 text-gray-700 hover:border-brand-400'}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-gray-700">Qty:</span>
            <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden">
              <button
                onClick={() => setQuantity(q => Math.max(1, q-1))}
                className="px-3 py-2 hover:bg-gray-100 transition-colors"
              >
                <Minus size={14} />
              </button>
              <span className="px-4 py-2 font-semibold text-sm min-w-[40px] text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(q => Math.min(10, q+1))}
                className="px-3 py-2 hover:bg-gray-100 transition-colors"
              >
                <Plus size={14} />
              </button>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex gap-3">
            <button
              onClick={handleAddToCart}
              disabled={addingToCart}
              id="add-to-cart-btn"
              className="flex-1 btn-primary flex items-center justify-center gap-2"
            >
              <ShoppingBag size={18} />
              {addingToCart ? 'Adding...' : 'Add to Bag'}
            </button>
            <button
              onClick={() => setWishlisted(v => !v)}
              className={`px-4 py-3 border-2 rounded-lg transition-all
                ${wishlisted ? 'border-brand-600 bg-brand-50 text-brand-600' : 'border-gray-200 text-gray-600 hover:border-brand-400'}`}
            >
              <Heart size={18} fill={wishlisted ? 'currentColor' : 'none'} />
            </button>
          </div>

          {/* Trust chips */}
          <div className="grid grid-cols-3 gap-2 pt-2">
            {[
              { icon: Truck,     text: 'Free Delivery above ₹999' },
              { icon: RefreshCw, text: '30-Day Easy Returns'       },
              { icon: Shield,    text: '100% Genuine Product'      },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex flex-col items-center text-center gap-1 p-3 bg-gray-50 rounded-xl">
                <Icon size={18} className="text-brand-600" />
                <span className="text-xs text-gray-600 leading-tight">{text}</span>
              </div>
            ))}
          </div>

          {/* Description */}
          {product.description && (
            <div className="border-t pt-4">
              <h3 className="text-sm font-bold text-gray-800 mb-2">Product Description</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>
              <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                {product.material && (
                  <div><span className="text-gray-400">Material:</span> <span className="text-gray-700 font-medium">{product.material}</span></div>
                )}
                {product.fit_type && (
                  <div><span className="text-gray-400">Fit:</span> <span className="text-gray-700 font-medium">{product.fit_type}</span></div>
                )}
                {product.gender && (
                  <div><span className="text-gray-400">Gender:</span> <span className="text-gray-700 font-medium">{product.gender}</span></div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="section-title mb-6">You May Also Like</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {related.map(p => (
              <Link key={p.id} to={`/products/${p.id}`} className="group block">
                <div className="rounded-2xl overflow-hidden border border-gray-100 hover:-translate-y-1 hover:shadow-xl transition-all">
                  <div className="aspect-[3/4] bg-gray-50 overflow-hidden">
                    <img src={p.image_url} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-3">
                    <p className="text-xs text-brand-600 font-semibold">{p.brand}</p>
                    <p className="text-sm text-gray-700 line-clamp-2 mt-0.5">{p.name}</p>
                    <p className="font-bold text-gray-900 mt-1">₹{p.price.toLocaleString('en-IN')}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
