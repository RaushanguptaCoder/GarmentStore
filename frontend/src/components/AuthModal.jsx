import { useState } from 'react'
import { X, Mail, Lock, User, Phone, Eye, EyeOff, ShoppingBag } from 'lucide-react'
import useStore from '../store/useStore'
import { authApi } from '../services/api'

export default function AuthModal() {
  const { authModalOpen, setAuthModalOpen, setAuth, fetchCart, showToast } = useStore()
  const [mode, setMode] = useState('login') // login | register
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({ email: '', password: '', full_name: '', phone: '' })
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      let res
      if (mode === 'login') {
        res = await authApi.login({ email: form.email, password: form.password })
      } else {
        res = await authApi.register({ email: form.email, password: form.password, full_name: form.full_name, phone: form.phone })
      }
      setAuth(res.data.user, res.data.access_token)
      await fetchCart()
      setAuthModalOpen(false)
      showToast(`Welcome${mode === 'login' ? ' back' : ''}, ${res.data.user.full_name}! 👋`)
    } catch (err) {
      setError(err.response?.data?.detail || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const fillDemo = () => {
    setMode('login')
    setForm(f => ({ ...f, email: 'demo@garmentstore.com', password: 'demo1234' }))
  }

  if (!authModalOpen) return null

  return (
    <>
      <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setAuthModalOpen(false)}>
        <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl animate-fade-in overflow-hidden" onClick={e => e.stopPropagation()}>
          {/* Header */}
          <div className="bg-gradient-to-br from-brand-600 to-brand-800 p-8 text-center relative">
            <button
              onClick={() => setAuthModalOpen(false)}
              className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <ShoppingBag size={28} className="text-white" />
            </div>
            <h2 className="text-2xl font-black text-white">
              {mode === 'login' ? 'Welcome Back!' : 'Create Account'}
            </h2>
            <p className="text-white/70 text-sm mt-1">
              {mode === 'login' ? 'Sign in to your GarmentStore account' : 'Join millions of happy shoppers'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {mode === 'register' && (
              <>
                <div className="relative">
                  <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={form.full_name}
                    onChange={e => set('full_name', e.target.value)}
                    required
                    className="input-field pl-10"
                  />
                </div>
                <div className="relative">
                  <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="tel"
                    placeholder="Phone (optional)"
                    value={form.phone}
                    onChange={e => set('phone', e.target.value)}
                    className="input-field pl-10"
                  />
                </div>
              </>
            )}

            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                placeholder="Email address"
                value={form.email}
                onChange={e => set('email', e.target.value)}
                required
                className="input-field pl-10"
              />
            </div>

            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type={showPass ? 'text' : 'password'}
                placeholder="Password"
                value={form.password}
                onChange={e => set('password', e.target.value)}
                required
                minLength={6}
                className="input-field pl-10 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPass(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>

            {/* Demo credentials */}
            {mode === 'login' && (
              <button
                type="button"
                onClick={fillDemo}
                className="w-full text-center text-xs text-gray-500 hover:text-brand-600 border border-dashed border-gray-300 rounded-lg py-2 transition-colors"
              >
                🎭 Use Demo Account (demo@garmentstore.com)
              </button>
            )}

            <p className="text-center text-sm text-gray-500">
              {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
              <button
                type="button"
                onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError('') }}
                className="text-brand-600 font-semibold hover:underline"
              >
                {mode === 'login' ? 'Register' : 'Sign In'}
              </button>
            </p>
          </form>
        </div>
      </div>
    </>
  )
}
