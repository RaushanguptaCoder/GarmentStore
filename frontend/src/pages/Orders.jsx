import { useState, useEffect } from 'react'
import { Package, ChevronRight, ShoppingBag } from 'lucide-react'
import { Link } from 'react-router-dom'
import useStore from '../store/useStore'
import { ordersApi } from '../services/api'

const STATUS_COLORS = {
  pending:   'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  shipped:   'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
}

export default function Orders() {
  const { user, setAuthModalOpen } = useStore()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    ordersApi.list()
      .then(r => setOrders(r.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [user])

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <Package size={60} className="text-gray-200 mb-4" />
        <h2 className="text-xl font-bold text-gray-700 mb-2">Please sign in to view orders</h2>
        <button onClick={() => setAuthModalOpen(true)} className="btn-primary mt-2">Sign In</button>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-4">
        {[1,2,3].map(i => <div key={i} className="skeleton h-32 rounded-2xl" />)}
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <ShoppingBag size={60} className="text-gray-200 mb-4" />
        <h2 className="text-xl font-bold text-gray-700 mb-2">No orders yet</h2>
        <Link to="/products" className="btn-primary mt-2">Start Shopping</Link>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <Package size={24} className="text-brand-600" /> My Orders
      </h1>
      <div className="space-y-4">
        {orders.map(order => (
          <div key={order.id} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="font-bold text-gray-900 text-sm">{order.order_number}</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {new Date(order.created_at).toLocaleDateString('en-IN', { day:'numeric', month:'long', year:'numeric' })}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-600'}`}>
                  {order.status}
                </span>
              </div>
            </div>

            {/* Items preview */}
            <div className="flex gap-2 mb-3 overflow-x-auto scrollbar-hide">
              {order.items?.slice(0,4).map(item => (
                <img
                  key={item.id}
                  src={item.product?.image_url}
                  alt={item.product?.name}
                  className="w-14 h-16 rounded-lg object-cover bg-gray-100 flex-shrink-0"
                  onError={e => { e.target.src = 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=100' }}
                />
              ))}
              {order.items?.length > 4 && (
                <div className="w-14 h-16 rounded-lg bg-gray-100 flex items-center justify-center text-xs text-gray-500 flex-shrink-0">
                  +{order.items.length - 4}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">{order.items?.length} item{order.items?.length !== 1 ? 's' : ''}</span>
              <div className="flex items-center gap-4">
                <span className="font-bold text-gray-900">₹{order.total_amount?.toLocaleString('en-IN')}</span>
                <ChevronRight size={16} className="text-gray-400" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
