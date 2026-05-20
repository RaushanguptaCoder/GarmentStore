import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import api from '../services/api'

const useStore = create(
  persist(
    (set, get) => ({
      // ── Auth ──────────────────────────────────────────────
      user: null,
      token: null,
      authLoading: false,

      setAuth: (user, token) => {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`
        set({ user, token })
      },
      logout: () => {
        delete api.defaults.headers.common['Authorization']
        set({ user: null, token: null, cart: { items: [], subtotal: 0, total_items: 0, savings: 0 } })
      },

      // ── Cart ──────────────────────────────────────────────
      cart: { items: [], subtotal: 0, total_items: 0, savings: 0 },
      cartOpen: false,
      cartLoading: false,

      setCartOpen: (open) => set({ cartOpen: open }),

      fetchCart: async () => {
        const { token } = get()
        if (!token) return
        try {
          const res = await api.get('/api/cart')
          set({ cart: res.data })
        } catch {}
      },

      addToCart: async (product_id, size, color, quantity = 1) => {
        const { token } = get()
        if (!token) return false
        set({ cartLoading: true })
        try {
          const res = await api.post('/api/cart', { product_id, quantity, size, color })
          set({ cart: res.data, cartOpen: true })
          return true
        } catch { return false }
        finally { set({ cartLoading: false }) }
      },

      updateCartItem: async (item_id, quantity) => {
        set({ cartLoading: true })
        try {
          const res = await api.put(`/api/cart/${item_id}`, { quantity })
          set({ cart: res.data })
        } catch {}
        finally { set({ cartLoading: false }) }
      },

      removeCartItem: async (item_id) => {
        set({ cartLoading: true })
        try {
          const res = await api.delete(`/api/cart/${item_id}`)
          set({ cart: res.data })
        } catch {}
        finally { set({ cartLoading: false }) }
      },

      // ── Filters ───────────────────────────────────────────
      filters: {
        category: '',
        gender: '',
        brands: [],
        minPrice: '',
        maxPrice: '',
        minDiscount: '',
        colors: [],
        sizes: [],
        sort: 'newest',
      },
      setFilter: (key, value) =>
        set((s) => ({ filters: { ...s.filters, [key]: value } })),
      resetFilters: () =>
        set({ filters: { category: '', gender: '', brands: [], minPrice: '', maxPrice: '', minDiscount: '', colors: [], sizes: [], sort: 'newest' } }),

      // ── UI ────────────────────────────────────────────────
      authModalOpen: false,
      setAuthModalOpen: (open) => set({ authModalOpen: open }),

      toast: null,
      showToast: (message, type = 'success') => {
        set({ toast: { message, type, id: Date.now() } })
        setTimeout(() => set({ toast: null }), 3000)
      },
    }),
    {
      name: 'garmentstore',
      partialize: (s) => ({ user: s.user, token: s.token }),
      onRehydrateStorage: () => (state) => {
        if (state?.token) {
          api.defaults.headers.common['Authorization'] = `Bearer ${state.token}`
        }
      },
    }
  )
)

export default useStore
