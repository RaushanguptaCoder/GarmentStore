import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import CartDrawer from './components/CartDrawer'
import AuthModal from './components/AuthModal'
import Toast from './components/Toast'
import Home from './pages/Home'
import ProductListing from './pages/ProductListing'
import ProductDetail from './pages/ProductDetail'
import Checkout from './pages/Checkout'
import Orders from './pages/Orders'
import useStore from './store/useStore'

function ScrollToTop() {
  // Scroll to top on route change
  useEffect(() => { window.scrollTo(0, 0) }, [])
  return null
}

function AppShell() {
  const { fetchCart, token } = useStore()

  useEffect(() => {
    if (token) fetchCart()
  }, [token])

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1">
        <Routes>
          <Route path="/"               element={<Home />} />
          <Route path="/products"        element={<ProductListing />} />
          <Route path="/products/:id"    element={<ProductDetail />} />
          <Route path="/checkout"        element={<Checkout />} />
          <Route path="/orders"          element={<Orders />} />
          <Route path="*"               element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      <Footer />

      {/* Global overlays */}
      <CartDrawer />
      <AuthModal />
      <Toast />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AppShell />
    </BrowserRouter>
  )
}
