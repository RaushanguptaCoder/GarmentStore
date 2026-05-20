import axios from 'axios'

const api = axios.create({
  baseURL: '',
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
})

// Response interceptor for unified error handling
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      // Clear stale token from localStorage
      const stored = localStorage.getItem('garmentstore')
      if (stored) {
        const parsed = JSON.parse(stored)
        parsed.state.token = null
        parsed.state.user = null
        localStorage.setItem('garmentstore', JSON.stringify(parsed))
      }
    }
    return Promise.reject(err)
  }
)

export const authApi = {
  register: (data) => api.post('/api/auth/register', data),
  login: (data) => api.post('/api/auth/login', data),
  me: () => api.get('/api/auth/me'),
}

export const productsApi = {
  list: (params) => api.get('/api/products', { params }),
  get: (id) => api.get(`/api/products/${id}`),
  featured: (limit = 12) => api.get('/api/products/featured', { params: { limit } }),
  newArrivals: (limit = 12) => api.get('/api/products/new-arrivals', { params: { limit } }),
  bestSellers: (limit = 12) => api.get('/api/products/best-sellers', { params: { limit } }),
  brands: (category) => api.get('/api/products/brands', { params: { category } }),
}

export const categoriesApi = {
  list: () => api.get('/api/categories'),
  get: (slug) => api.get(`/api/categories/${slug}`),
}

export const cartApi = {
  get: () => api.get('/api/cart'),
  add: (data) => api.post('/api/cart', data),
  update: (id, data) => api.put(`/api/cart/${id}`, data),
  remove: (id) => api.delete(`/api/cart/${id}`),
  clear: () => api.delete('/api/cart'),
}

export const ordersApi = {
  checkout: (data) => api.post('/api/orders', data),
  list: () => api.get('/api/orders'),
  get: (id) => api.get(`/api/orders/${id}`),
}

export default api
