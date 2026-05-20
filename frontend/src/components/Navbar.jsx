import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, ShoppingBag, User, Heart, ChevronDown, Menu, X, LogOut, Package } from 'lucide-react'
import useStore from '../store/useStore'
import { categoriesApi } from '../services/api'

const NAV_LINKS = [
  { label: 'Women', slug: 'women', gender: 'Women' },
  { label: 'Men',   slug: 'men',   gender: 'Men'   },
  { label: 'Kids',  slug: 'kids',  gender: 'Kids'  },
  { label: 'Sports',slug: 'sports',gender: null     },
  { label: 'Sale 🔥', slug: null,  gender: null, isSale: true },
]

export default function Navbar() {
  const { user, logout, cart, setAuthModalOpen, setCartOpen } = useStore()
  const [categories, setCategories] = useState([])
  const [megaMenu, setMegaMenu] = useState(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [userMenu, setUserMenu] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const navigate = useNavigate()
  const timerRef = useRef(null)

  useEffect(() => {
    categoriesApi.list().then(r => setCategories(r.data)).catch(() => {})
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (search.trim()) {
      navigate(`/products?search=${encodeURIComponent(search.trim())}`)
      setSearch('')
    }
  }

  const openMega = (slug) => {
    clearTimeout(timerRef.current)
    setMegaMenu(slug)
  }
  const closeMega = () => {
    timerRef.current = setTimeout(() => setMegaMenu(null), 150)
  }

  const getCategoryChildren = (slug) =>
    categories.find(c => c.slug === slug)?.children || []

  return (
    <header className={`sticky top-0 z-50 bg-white transition-shadow duration-300 ${scrolled ? 'shadow-lg' : 'shadow-sm'}`}>
      {/* Top promo bar */}
      <div className="bg-brand-600 text-white text-xs text-center py-1.5 font-medium tracking-wide">
        🎉 Free Shipping on orders above ₹999 &nbsp;|&nbsp; Up to 70% OFF on New Arrivals
      </div>

      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center h-16 gap-4">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0 flex items-center gap-1">
            <div className="bg-brand-600 text-white font-black text-xl px-3 py-1 rounded tracking-widest select-none">
              GUPTAJI
            </div>
            <span className="text-xs text-gray-400 font-light hidden sm:block">GarmentStore</span>
          </Link>

          {/* Nav Links — desktop */}
          <nav className="hidden lg:flex items-center gap-1 flex-1 justify-center">
            {NAV_LINKS.map(link => (
              <div
                key={link.label}
                className="relative"
                onMouseEnter={() => link.slug && openMega(link.slug)}
                onMouseLeave={closeMega}
              >
                <Link
                  to={link.isSale
                    ? '/products?min_discount=40'
                    : `/products?category=${link.slug || ''}${link.gender ? `&gender=${link.gender}` : ''}`
                  }
                  className={`flex items-center gap-1 px-3 py-2 text-sm font-semibold rounded-md transition-colors
                    ${link.isSale ? 'text-brand-600 hover:bg-brand-50' : 'text-gray-700 hover:text-brand-600 hover:bg-gray-50'}
                    ${megaMenu === link.slug ? 'text-brand-600 bg-gray-50' : ''}`}
                >
                  {link.label}
                  {link.slug && getCategoryChildren(link.slug).length > 0 && (
                    <ChevronDown size={14} className={`transition-transform ${megaMenu === link.slug ? 'rotate-180' : ''}`} />
                  )}
                </Link>

                {/* Mega menu */}
                {megaMenu === link.slug && getCategoryChildren(link.slug).length > 0 && (
                  <div
                    className="absolute top-full left-1/2 -translate-x-1/2 bg-white border border-gray-100 shadow-2xl rounded-xl p-5 min-w-[200px] animate-fade-in"
                    onMouseEnter={() => clearTimeout(timerRef.current)}
                    onMouseLeave={closeMega}
                  >
                    {getCategoryChildren(link.slug).map(child => (
                      <Link
                        key={child.id}
                        to={`/products?category=${child.slug}&gender=${link.gender || ''}`}
                        className="block px-3 py-2 text-sm text-gray-600 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors whitespace-nowrap"
                        onClick={() => setMegaMenu(null)}
                      >
                        {child.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1 max-w-sm hidden md:block">
            <div className="relative">
              <input
                type="text"
                placeholder="Search brands, products..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full bg-gray-100 rounded-full px-4 py-2 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 focus:bg-white transition-all"
              />
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </form>

          {/* Actions */}
          <div className="flex items-center gap-2 ml-auto lg:ml-0">
            {/* Wishlist */}
            <button className="p-2 text-gray-600 hover:text-brand-600 transition-colors hidden sm:flex">
              <Heart size={22} />
            </button>

            {/* Cart */}
            <button
              id="cart-btn"
              onClick={() => user ? setCartOpen(true) : setAuthModalOpen(true)}
              className="relative p-2 text-gray-600 hover:text-brand-600 transition-colors"
            >
              <ShoppingBag size={22} />
              {cart.total_items > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {cart.total_items > 9 ? '9+' : cart.total_items}
                </span>
              )}
            </button>

            {/* User */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenu(v => !v)}
                  className="flex items-center gap-2 p-2 text-gray-600 hover:text-brand-600 transition-colors"
                >
                  <div className="w-8 h-8 bg-brand-100 rounded-full flex items-center justify-center">
                    <span className="text-brand-700 font-bold text-sm">
                      {user.full_name?.[0]?.toUpperCase()}
                    </span>
                  </div>
                </button>
                {userMenu && (
                  <div className="absolute right-0 top-full mt-1 bg-white border border-gray-100 shadow-xl rounded-xl py-2 min-w-[180px] z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="font-semibold text-sm text-gray-900">{user.full_name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                    <Link
                      to="/orders"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setUserMenu(false)}
                    >
                      <Package size={15} /> My Orders
                    </Link>
                    <button
                      onClick={() => { logout(); setUserMenu(false) }}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-brand-600 hover:bg-brand-50 w-full"
                    >
                      <LogOut size={15} /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setAuthModalOpen(true)}
                className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-gray-700 hover:text-brand-600 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <User size={18} /> Sign In
              </button>
            )}

            {/* Mobile menu */}
            <button
              className="lg:hidden p-2 text-gray-600"
              onClick={() => setMobileOpen(v => !v)}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white shadow-lg">
          <form onSubmit={handleSearch} className="px-4 py-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full bg-gray-100 rounded-full px-4 py-2 pl-10 text-sm focus:outline-none"
              />
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </form>
          <nav className="px-4 pb-4 space-y-1">
            {NAV_LINKS.map(link => (
              <Link
                key={link.label}
                to={link.isSale
                  ? '/products?min_discount=40'
                  : `/products?category=${link.slug || ''}${link.gender ? `&gender=${link.gender}` : ''}`
                }
                className={`block px-3 py-2.5 rounded-lg font-semibold text-sm ${link.isSale ? 'text-brand-600' : 'text-gray-700'}`}
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {!user && (
              <button
                onClick={() => { setAuthModalOpen(true); setMobileOpen(false) }}
                className="w-full btn-primary mt-2 text-center"
              >
                Sign In / Register
              </button>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
