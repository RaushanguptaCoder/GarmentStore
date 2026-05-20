import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CheckCircle, ShoppingBag, MapPin, CreditCard, Truck } from 'lucide-react'
import useStore from '../store/useStore'
import { ordersApi } from '../services/api'

const STATES = ['Andhra Pradesh','Assam','Bihar','Delhi','Goa','Gujarat','Haryana',
  'Karnataka','Kerala','Madhya Pradesh','Maharashtra','Odisha','Punjab','Rajasthan',
  'Tamil Nadu','Telangana','Uttar Pradesh','Uttarakhand','West Bengal']

export default function Checkout() {
  const { cart, user, setAuthModalOpen } = useStore()
  const navigate = useNavigate()
  const [step, setStep] = useState(1) // 1: address, 2: payment, 3: success
  const [loading, setLoading] = useState(false)
  const [orderNumber, setOrderNumber] = useState('')
  const [error, setError] = useState('')

  const [address, setAddress] = useState({
    name: user?.full_name || '',
    phone: user?.phone || '',
    street: '',
    city: '',
    state: 'Maharashtra',
    pincode: '',
    is_default: false,
  })
  const [payment, setPayment] = useState('cod')

  const setA = (k, v) => setAddress(a => ({ ...a, [k]: v }))

  const placeOrder = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await ordersApi.checkout({
        shipping_address: address,
        payment_method: payment,
      })
      setOrderNumber(res.data.order_number)
      setStep(3)
    } catch (e) {
      setError(e.response?.data?.detail || 'Order placement failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center px-4">
        <ShoppingBag size={60} className="text-gray-200 mb-4" />
        <h2 className="text-xl font-bold text-gray-700 mb-2">Please sign in to checkout</h2>
        <button onClick={() => setAuthModalOpen(true)} className="btn-primary mt-2">Sign In</button>
      </div>
    )
  }

  if (cart.items?.length === 0 && step !== 3) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center px-4">
        <ShoppingBag size={60} className="text-gray-200 mb-4" />
        <h2 className="text-xl font-bold text-gray-700 mb-2">Your cart is empty</h2>
        <Link to="/products" className="btn-primary mt-2">Start Shopping</Link>
      </div>
    )
  }

  // Success screen
  if (step === 3) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center px-4 max-w-md mx-auto">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 animate-fade-in">
          <CheckCircle size={48} className="text-green-500" />
        </div>
        <h1 className="text-3xl font-black text-gray-900 mb-2">Order Placed! 🎉</h1>
        <p className="text-gray-500 mb-4">Your order has been confirmed and will be delivered soon.</p>
        <div className="bg-gray-50 rounded-2xl p-6 w-full mb-6">
          <p className="text-xs text-gray-500 mb-1">ORDER NUMBER</p>
          <p className="text-2xl font-black text-brand-600 tracking-wider">{orderNumber}</p>
          <p className="text-sm text-gray-500 mt-2">You'll receive an email confirmation shortly.</p>
        </div>
        <div className="flex gap-3 w-full">
          <Link to="/orders" className="flex-1 btn-outline text-center text-sm">My Orders</Link>
          <Link to="/" className="flex-1 btn-primary text-center text-sm">Continue Shopping</Link>
        </div>
      </div>
    )
  }

  const shipping = cart.subtotal >= 999 ? 0 : 99
  const total = cart.subtotal + shipping

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Checkout</h1>

      {/* Progress */}
      <div className="flex items-center gap-2 mb-8">
        {[{ n:1, icon: MapPin, label:'Address' }, { n:2, icon: CreditCard, label:'Payment' }].map(({ n, icon: Icon, label }) => (
          <div key={n} className="flex items-center gap-2">
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold transition-colors
              ${step >= n ? 'bg-brand-600 text-white' : 'bg-gray-100 text-gray-500'}`}>
              <Icon size={14} /> {label}
            </div>
            {n < 2 && <div className={`h-0.5 w-8 ${step >= n+1 ? 'bg-brand-600' : 'bg-gray-200'}`} />}
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left */}
        <div className="lg:col-span-2 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg">{error}</div>
          )}

          {/* Step 1: Address */}
          {step === 1 && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <h2 className="font-bold text-gray-900 text-lg mb-4 flex items-center gap-2">
                <MapPin size={18} className="text-brand-600" /> Delivery Address
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Full Name *</label>
                  <input className="input-field" value={address.name} onChange={e => setA('name', e.target.value)} required />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Phone *</label>
                  <input className="input-field" value={address.phone} onChange={e => setA('phone', e.target.value)} required />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Street Address *</label>
                  <textarea className="input-field resize-none" rows={2} value={address.street} onChange={e => setA('street', e.target.value)} required />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">City *</label>
                  <input className="input-field" value={address.city} onChange={e => setA('city', e.target.value)} required />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Pincode *</label>
                  <input className="input-field" value={address.pincode} onChange={e => setA('pincode', e.target.value)} maxLength={6} required />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">State *</label>
                  <select className="input-field" value={address.state} onChange={e => setA('state', e.target.value)}>
                    {STATES.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <button
                onClick={() => {
                  if (!address.name || !address.phone || !address.street || !address.city || !address.pincode) {
                    setError('Please fill all required fields')
                    return
                  }
                  setError('')
                  setStep(2)
                }}
                className="btn-primary mt-6 w-full sm:w-auto"
              >
                Continue to Payment →
              </button>
            </div>
          )}

          {/* Step 2: Payment */}
          {step === 2 && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <h2 className="font-bold text-gray-900 text-lg mb-4 flex items-center gap-2">
                <CreditCard size={18} className="text-brand-600" /> Payment Method
              </h2>

              {/* Address summary */}
              <div className="bg-gray-50 rounded-xl p-4 mb-6 flex items-start justify-between">
                <div className="text-sm">
                  <p className="font-semibold text-gray-800">{address.name}</p>
                  <p className="text-gray-500">{address.street}, {address.city}</p>
                  <p className="text-gray-500">{address.state} — {address.pincode}</p>
                </div>
                <button onClick={() => setStep(1)} className="text-brand-600 text-xs font-semibold hover:underline">Change</button>
              </div>

              <div className="space-y-3">
                {[
                  { val: 'cod',  label: 'Cash on Delivery',  desc: 'Pay when your order arrives',          icon: '💵' },
                  { val: 'upi',  label: 'UPI / Net Banking',  desc: 'PhonePe, GPay, Paytm, NEFT',          icon: '📱' },
                  { val: 'card', label: 'Credit / Debit Card',desc: 'Visa, Mastercard, RuPay',             icon: '💳' },
                ].map(({ val, label, desc, icon }) => (
                  <label key={val} className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all
                    ${payment === val ? 'border-brand-500 bg-brand-50' : 'border-gray-200 hover:border-gray-300'}`}>
                    <input
                      type="radio"
                      name="payment"
                      value={val}
                      checked={payment === val}
                      onChange={() => setPayment(val)}
                      style={{ accentColor: '#ed1515' }}
                    />
                    <span className="text-2xl">{icon}</span>
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">{label}</p>
                      <p className="text-gray-500 text-xs">{desc}</p>
                    </div>
                  </label>
                ))}
              </div>

              <button
                onClick={placeOrder}
                disabled={loading}
                className="btn-primary mt-6 w-full flex items-center justify-center gap-2"
              >
                {loading ? 'Placing Order...' : `Place Order · ₹${total.toLocaleString('en-IN')}`}
              </button>
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className="lg:sticky lg:top-24 self-start">
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-4">Order Summary</h3>
            <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
              {cart.items?.map(item => (
                <div key={item.id} className="flex gap-3">
                  <img
                    src={item.product.image_url}
                    alt={item.product.name}
                    className="w-12 h-14 rounded-lg object-cover bg-gray-100"
                    onError={e => { e.target.src = 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=100' }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-700 line-clamp-2">{item.product.name}</p>
                    {item.size && <p className="text-xs text-gray-400">Size: {item.size}</p>}
                    <p className="text-xs font-bold text-gray-900 mt-1">
                      ₹{(item.product.price * item.quantity).toLocaleString('en-IN')} × {item.quantity}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span><span>₹{cart.subtotal?.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className={shipping === 0 ? 'text-green-600 font-medium' : ''}>
                  {shipping === 0 ? 'FREE' : `₹${shipping}`}
                </span>
              </div>
              {cart.savings > 0 && (
                <div className="flex justify-between text-green-600 font-medium">
                  <span>Savings</span><span>-₹{cart.savings?.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between font-black text-gray-900 text-base border-t pt-2">
                <span>Total</span><span>₹{total.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2 text-xs text-gray-500 bg-green-50 p-3 rounded-xl">
              <Truck size={14} className="text-green-600 flex-shrink-0" />
              {shipping === 0
                ? 'Congrats! You qualify for FREE shipping 🎉'
                : `Add ₹${(999 - cart.subtotal).toFixed(0)} more for FREE shipping`}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
