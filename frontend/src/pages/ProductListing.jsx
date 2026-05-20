import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SlidersHorizontal, Grid2X2, LayoutList, X } from 'lucide-react'
import ProductCard from '../components/ProductCard'
import ProductFilters from '../components/ProductFilters'
import { productsApi } from '../services/api'
import useStore from '../store/useStore'

function SkeletonCard() {
  return (
    <div className="rounded-2xl overflow-hidden border border-gray-100">
      <div className="skeleton aspect-[3/4]" />
      <div className="p-3 space-y-2">
        <div className="skeleton h-3 w-1/3 rounded" />
        <div className="skeleton h-4 w-3/4 rounded" />
        <div className="skeleton h-3 w-1/2 rounded" />
      </div>
    </div>
  )
}

export default function ProductListing() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { filters, setFilter, resetFilters } = useStore()
  const [products, setProducts] = useState([])
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [brands, setBrands] = useState([])
  const [mobileFilters, setMobileFilters] = useState(false)
  const [viewMode, setViewMode] = useState('grid') // grid | list

  // Sync URL params → filters
  useEffect(() => {
    const cat     = searchParams.get('category') || ''
    const gender  = searchParams.get('gender')   || ''
    const search  = searchParams.get('search')   || ''
    const minDisc = searchParams.get('min_discount') || ''
    if (cat)     setFilter('category', cat)
    if (gender)  setFilter('gender', gender)
    if (search)  setFilter('search', search)
    if (minDisc) setFilter('minDiscount', minDisc)
  }, [searchParams])

  // Fetch brands
  useEffect(() => {
    productsApi.brands(filters.category || undefined)
      .then(r => setBrands(r.data))
      .catch(() => {})
  }, [filters.category])

  // Fetch products
  const fetchProducts = useCallback(async () => {
    setLoading(true)
    try {
      const params = {
        page,
        page_size: 20,
        sort: filters.sort || 'newest',
      }
      if (filters.category)    params.category    = filters.category
      if (filters.gender)      params.gender      = filters.gender
      if (filters.brands?.length) params.brand    = filters.brands.join(',')
      if (filters.minPrice)    params.min_price   = filters.minPrice
      if (filters.maxPrice)    params.max_price   = filters.maxPrice
      if (filters.minDiscount) params.min_discount = filters.minDiscount
      if (filters.colors?.length)  params.color   = filters.colors.join(',')
      if (filters.sizes?.length)   params.size    = filters.sizes.join(',')
      if (filters.search)      params.search      = filters.search

      // Special flags from URL
      if (searchParams.get('featured'))    params.featured    = true
      if (searchParams.get('new_arrival')) params.new_arrival = true
      if (searchParams.get('best_seller')) params.best_seller = true

      const res = await productsApi.list(params)
      setProducts(res.data.products)
      setTotal(res.data.total)
      setTotalPages(res.data.total_pages)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [filters, page, searchParams])

  useEffect(() => {
    setPage(1)
  }, [filters])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  const activeFiltersCount =
    (filters.brands?.length || 0) +
    (filters.colors?.length || 0) +
    (filters.sizes?.length  || 0) +
    (filters.minPrice ? 1 : 0) +
    (filters.minDiscount ? 1 : 0)

  const pageTitle =
    searchParams.get('search') ? `Results for "${searchParams.get('search')}"` :
    filters.category ? filters.category.replace(/-/g,' ').replace(/\b\w/g, c=>c.toUpperCase()) :
    filters.gender || 'All Products'

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <nav className="text-xs text-gray-500 mb-4">
        <span>Home</span> <span className="mx-1">›</span>
        <span className="text-gray-800 font-medium capitalize">{pageTitle}</span>
      </nav>

      {/* Page header */}
      <div className="flex items-start justify-between mb-6 gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 capitalize">{pageTitle}</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            {loading ? 'Loading...' : `${total.toLocaleString()} products found`}
          </p>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-2">
          {/* Mobile filter btn */}
          <button
            onClick={() => setMobileFilters(true)}
            className="lg:hidden flex items-center gap-1.5 border border-gray-300 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:border-brand-400"
          >
            <SlidersHorizontal size={15} />
            Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
          </button>

          {/* View toggle */}
          <div className="flex border border-gray-200 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 ${viewMode === 'grid' ? 'bg-brand-600 text-white' : 'text-gray-500 hover:bg-gray-50'}`}
            >
              <Grid2X2 size={16} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 ${viewMode === 'list' ? 'bg-brand-600 text-white' : 'text-gray-500 hover:bg-gray-50'}`}
            >
              <LayoutList size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Active filters chips */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {filters.brands?.map(b => (
            <span key={b} className="tag">
              {b} <button onClick={() => setFilter('brands', filters.brands.filter(x=>x!==b))}><X size={11}/></button>
            </span>
          ))}
          {filters.minPrice && (
            <span className="tag">
              ₹{filters.minPrice}–{filters.maxPrice||'+'}{' '}
              <button onClick={() => { setFilter('minPrice',''); setFilter('maxPrice','') }}><X size={11}/></button>
            </span>
          )}
          {filters.minDiscount && (
            <span className="tag">
              {filters.minDiscount}%+ OFF <button onClick={() => setFilter('minDiscount','')}><X size={11}/></button>
            </span>
          )}
          {filters.colors?.map(c => (
            <span key={c} className="tag">
              {c} <button onClick={() => setFilter('colors', filters.colors.filter(x=>x!==c))}><X size={11}/></button>
            </span>
          ))}
          {filters.sizes?.map(s => (
            <span key={s} className="tag">
              {s} <button onClick={() => setFilter('sizes', filters.sizes.filter(x=>x!==s))}><X size={11}/></button>
            </span>
          ))}
          <button onClick={resetFilters} className="tag bg-brand-50 text-brand-700 font-semibold">
            Clear All
          </button>
        </div>
      )}

      <div className="flex gap-6">
        {/* Sidebar Filters — desktop */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <ProductFilters brands={brands} />
        </aside>

        {/* Mobile Filters */}
        {mobileFilters && (
          <ProductFilters
            brands={brands}
            mobileOpen={true}
            onMobileClose={() => setMobileFilters(false)}
          />
        )}

        {/* Product Grid */}
        <div className="flex-1 min-w-0">
          {!loading && products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">No products found</h3>
              <p className="text-gray-500 text-sm mb-4">Try adjusting your filters or search term</p>
              <button onClick={resetFilters} className="btn-primary">Clear Filters</button>
            </div>
          ) : (
            <>
              <div className={
                viewMode === 'list'
                  ? 'flex flex-col gap-4'
                  : 'grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'
              }>
                {loading
                  ? Array(20).fill(0).map((_, i) => <SkeletonCard key={i} />)
                  : products.map(p => <ProductCard key={p.id} product={p} />)
                }
              </div>

              {/* Pagination */}
              {!loading && totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-10">
                  <button
                    onClick={() => setPage(p => Math.max(1, p-1))}
                    disabled={page === 1}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm disabled:opacity-40 hover:border-brand-400"
                  >
                    ← Prev
                  </button>
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const p = Math.max(1, Math.min(page - 2, totalPages - 4)) + i
                    return (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors
                          ${p === page ? 'bg-brand-600 text-white' : 'border border-gray-300 hover:border-brand-400'}`}
                      >
                        {p}
                      </button>
                    )
                  })}
                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p+1))}
                    disabled={page === totalPages}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm disabled:opacity-40 hover:border-brand-400"
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
