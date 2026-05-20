import { X, Plus, Minus, ShoppingBag, Trash2, Tag } from 'lucide-react'
import { Link } from 'react-router-dom'
import useStore from '../store/useStore'

export default function CartDrawer() {
  const { cart, cartOpen, cartLoading, setCartOpen, updateCartItem, removeCartItem, user, setAuthModalOpen } = useStore()

  if (!cartOpen) return null

  const isEmpty = !cart.items || cart.items.length === 0

  return (
    <>
      <div className="cart-overlay" onClick={() => setCartOpen(false)} />
      <div className="fixed inset-y-0 right-0 w-full sm:w-[420px] bg-white z-50 flex flex-col shadow-2xl animate-slide-in">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <ShoppingBag size={20} className="text-brand-600" />
            <h2 className="font-bold text-gray-900 text-lg">My Bag</h2>
            {!isEmpty && (
              <span className="bg-brand-100 text-brand-700 text-xs font-bold px-2 py-0.5 rounded-full">
                {cart.total_items} {cart.total_items === 1 ? 'item' : 'items'}
              </span>
            )}
          </div>
          <button
            onClick={() => setCartOpen(false)}
            className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Savings banner */}
        {cart.savings > 0 && (
          <div className="bg-green-50 border-b border-green-100 px-5 py-2 flex items-center gap-2">
            <Tag size={14} className="text-green-600" />
            <span className="text-green-700 text-sm font-medium">
              You're saving <strong>₹{cart.savings.toLocaleString('en-IN')}</strong> on this order!
            </span>
          </div>
        )}

        {/* Items */}
        <div className="flex-1 overflow-y-auto">
          {isEmpty ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center px-8">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
                <ShoppingBag size={40} className="text-gray-300" />
              </div>
              <div>
                <p className="font-semibold text-gray-700 text-lg">Your bag is empty</p>
                <p className="text-gray-400 text-sm mt-1">Add items you love to your bag</p>
              </div>
              <button
                onClick={() => setCartOpen(false)}
                className="btn-primary mt-2"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {cart.items.map((item) => (
                <div key={item.id} className="flex gap-3 p-4 hover:bg-gray-50/50 transition-colors">
                  {/* Product image */}
                  <Link
                    to={`/products/${item.product.id}`}
                    onClick={() => setCartOpen(false)}
                    className="flex-shrink-0 w-20 h-24 rounded-xl overflow-hidden bg-gray-100"
                  >
                    <img
                      src={item.product.image_url}
                      alt={item.product.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform"
                      onError={e => { e.target.src = 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=200' }}
                    />
                  </Link>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-brand-600 font-semibold">{item.product.brand}</p>
                    <p className="text-sm font-medium text-gray-800 line-clamp-2 mt-0.5">{item.product.name}</p>

                    <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                      {item.size && <span className="bg-gray-100 px-2 py-0.5 rounded">Size: {item.size}</span>}
                      {item.color && <span className="bg-gray-100 px-2 py-0.5 rounded">{item.color}</span>}
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      {/* Price */}
                      <div>
                        <span className="font-bold text-gray-900 text-sm">
                          ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                        </span>
                        {item.quantity > 1 && (
                          <span className="text-xs text-gray-400 ml-1">
                            (₹{item.product.price.toLocaleString('en-IN')} each)
                          </span>
                        )}
                      </div>

                      {/* Qty controls */}
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => updateCartItem(item.id, item.quantity - 1)}
                          disabled={cartLoading}
                          className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center hover:border-brand-400 transition-colors disabled:opacity-40"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="w-6 text-center text-sm font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => updateCartItem(item.id, item.quantity + 1)}
                          disabled={cartLoading || item.quantity >= 10}
                          className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center hover:border-brand-400 transition-colors disabled:opacity-40"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => removeCartItem(item.id)}
                    disabled={cartLoading}
                    className="self-start p-1.5 text-gray-300 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
                    aria-label="Remove item"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {!isEmpty && (
          <div className="border-t border-gray-100 p-5 space-y-3 bg-gray-50/50">
            {/* Order summary */}
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal ({cart.total_items} items)</span>
                <span>₹{cart.subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className={cart.subtotal >= 999 ? 'text-green-600 font-medium' : ''}>
                  {cart.subtotal >= 999 ? 'FREE' : '₹99'}
                </span>
              </div>
              {cart.savings > 0 && (
                <div className="flex justify-between text-green-600 font-medium">
                  <span>Total Savings</span>
                  <span>-₹{cart.savings.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-gray-900 text-base pt-2 border-t border-gray-200">
                <span>Total</span>
                <span>₹{(cart.subtotal + (cart.subtotal >= 999 ? 0 : 99)).toLocaleString('en-IN')}</span>
              </div>
            </div>

            <Link
              to="/checkout"
              onClick={() => setCartOpen(false)}
              className="btn-primary w-full text-center block text-sm"
            >
              Proceed to Checkout →
            </Link>
            <button
              onClick={() => setCartOpen(false)}
              className="w-full text-center text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  )
}
