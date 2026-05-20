import { useState } from 'react'
import { ChevronDown, ChevronUp, X, SlidersHorizontal } from 'lucide-react'
import useStore from '../store/useStore'

const PRICE_RANGES = [
  { label: 'Under ₹500',     min: 0,    max: 500   },
  { label: '₹500 – ₹1,000', min: 500,  max: 1000  },
  { label: '₹1,000 – ₹2,000',min:1000, max: 2000  },
  { label: '₹2,000 – ₹5,000',min:2000, max: 5000  },
  { label: 'Above ₹5,000',  min: 5000, max: null   },
]

const DISCOUNT_OPTIONS = [
  { label: '10% and above', value: 10 },
  { label: '20% and above', value: 20 },
  { label: '30% and above', value: 30 },
  { label: '40% and above', value: 40 },
  { label: '50% and above', value: 50 },
]

const COLORS = ['Black','White','Red','Blue','Green','Yellow','Pink','Beige','Grey','Navy','Orange','Purple']
const SIZES  = ['XS','S','M','L','XL','XXL','26','28','30','32','34','36','38','7','8','9','10']

function FilterSection({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border-b border-gray-100 py-4">
      <button
        className="flex items-center justify-between w-full text-sm font-semibold text-gray-800 mb-3"
        onClick={() => setOpen(v => !v)}
      >
        {title}
        {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      {open && children}
    </div>
  )
}

export default function ProductFilters({ brands = [], onApply, mobileOpen, onMobileClose }) {
  const { filters, setFilter, resetFilters } = useStore()

  const toggleArray = (key, val) => {
    const arr = filters[key] || []
    setFilter(key, arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val])
  }

  const activeCount =
    (filters.brands?.length || 0) +
    (filters.colors?.length || 0) +
    (filters.sizes?.length  || 0) +
    (filters.minPrice ? 1 : 0) +
    (filters.minDiscount ? 1 : 0)

  const content = (
    <div className="bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={16} className="text-gray-600" />
          <span className="font-bold text-gray-900">Filters</span>
          {activeCount > 0 && (
            <span className="bg-brand-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
              {activeCount}
            </span>
          )}
        </div>
        {activeCount > 0 && (
          <button onClick={resetFilters} className="text-xs text-brand-600 font-semibold hover:underline flex items-center gap-1">
            <X size={12} /> Clear all
          </button>
        )}
        {mobileOpen && (
          <button onClick={onMobileClose} className="lg:hidden p-1"><X size={20} /></button>
        )}
      </div>

      <div className="p-4 space-y-0 overflow-y-auto max-h-[calc(100vh-200px)] lg:max-h-none">
        {/* Brands */}
        {brands.length > 0 && (
          <FilterSection title="Brand">
            <div className="space-y-2 max-h-48 overflow-y-auto scrollbar-hide">
              {brands.map(b => (
                <label key={b} className="filter-check flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={filters.brands?.includes(b) || false}
                    onChange={() => toggleArray('brands', b)}
                  />
                  <span className="text-sm text-gray-700 group-hover:text-brand-600">{b}</span>
                </label>
              ))}
            </div>
          </FilterSection>
        )}

        {/* Price Range */}
        <FilterSection title="Price Range">
          <div className="space-y-2">
            {PRICE_RANGES.map(r => (
              <label key={r.label} className="filter-check flex items-center gap-2 cursor-pointer group">
                <input
                  type="radio"
                  name="price"
                  checked={String(filters.minPrice) === String(r.min) && String(filters.maxPrice) === String(r.max ?? '')}
                  onChange={() => {
                    setFilter('minPrice', r.min || '')
                    setFilter('maxPrice', r.max || '')
                  }}
                  style={{ accentColor: '#ed1515' }}
                />
                <span className="text-sm text-gray-700 group-hover:text-brand-600">{r.label}</span>
              </label>
            ))}
            {(filters.minPrice || filters.maxPrice) && (
              <button
                onClick={() => { setFilter('minPrice',''); setFilter('maxPrice','') }}
                className="text-xs text-brand-600 hover:underline mt-1"
              >
                Clear price
              </button>
            )}
          </div>
        </FilterSection>

        {/* Discount */}
        <FilterSection title="Discount" defaultOpen={false}>
          <div className="space-y-2">
            {DISCOUNT_OPTIONS.map(d => (
              <label key={d.value} className="filter-check flex items-center gap-2 cursor-pointer group">
                <input
                  type="radio"
                  name="discount"
                  checked={String(filters.minDiscount) === String(d.value)}
                  onChange={() => setFilter('minDiscount', filters.minDiscount === d.value ? '' : d.value)}
                  style={{ accentColor: '#ed1515' }}
                />
                <span className="text-sm text-gray-700 group-hover:text-brand-600">{d.label}</span>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Color */}
        <FilterSection title="Color" defaultOpen={false}>
          <div className="flex flex-wrap gap-2">
            {COLORS.map(c => (
              <button
                key={c}
                onClick={() => toggleArray('colors', c)}
                className={`tag text-xs ${filters.colors?.includes(c) ? 'bg-brand-100 text-brand-700 ring-1 ring-brand-400' : ''}`}
              >
                {c}
              </button>
            ))}
          </div>
        </FilterSection>

        {/* Size */}
        <FilterSection title="Size" defaultOpen={false}>
          <div className="flex flex-wrap gap-2">
            {SIZES.map(s => (
              <button
                key={s}
                onClick={() => toggleArray('sizes', s)}
                className={`w-10 h-10 text-xs font-medium border rounded-lg transition-all
                  ${filters.sizes?.includes(s)
                    ? 'border-brand-600 bg-brand-600 text-white'
                    : 'border-gray-200 text-gray-700 hover:border-brand-400'}`}
              >
                {s}
              </button>
            ))}
          </div>
        </FilterSection>

        {/* Sort */}
        <FilterSection title="Sort By" defaultOpen={false}>
          <div className="space-y-2">
            {[
              { val: 'newest',     label: 'Newest First'       },
              { val: 'price_asc',  label: 'Price: Low to High' },
              { val: 'price_desc', label: 'Price: High to Low' },
              { val: 'rating',     label: 'Customer Rating'    },
              { val: 'discount',   label: 'Best Discount'      },
            ].map(s => (
              <label key={s.val} className="filter-check flex items-center gap-2 cursor-pointer group">
                <input
                  type="radio"
                  name="sort"
                  checked={filters.sort === s.val}
                  onChange={() => setFilter('sort', s.val)}
                  style={{ accentColor: '#ed1515' }}
                />
                <span className="text-sm text-gray-700 group-hover:text-brand-600">{s.label}</span>
              </label>
            ))}
          </div>
        </FilterSection>
      </div>

      {/* Mobile apply btn */}
      {mobileOpen && (
        <div className="p-4 border-t">
          <button onClick={onMobileClose} className="btn-primary w-full">Apply Filters</button>
        </div>
      )}
    </div>
  )

  if (mobileOpen) {
    return (
      <>
        <div className="cart-overlay lg:hidden" onClick={onMobileClose} />
        <div className="fixed inset-y-0 left-0 w-80 z-50 bg-white shadow-2xl animate-slide-in overflow-auto lg:hidden">
          {content}
        </div>
      </>
    )
  }

  return <div className="sticky top-24 rounded-xl border border-gray-100 overflow-hidden shadow-sm">{content}</div>
}
