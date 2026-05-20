import { Link } from 'react-router-dom'
import { Instagram, Facebook, Twitter, Youtube, Mail, Phone, MapPin, Shield, Truck, RefreshCw, Headphones } from 'lucide-react'

const FOOTER_LINKS = {
  'About GUPTAJI': ['About Us', 'Press', 'Careers', 'Corporate Information'],
  'Help': ['FAQ', 'Track Order', 'Returns & Refunds', 'Shipping Policy', 'Contact Us'],
  'For Brands': ['Sell on GarmentStore', 'Advertise with Us', 'Brand Programs'],
  'Discover': ['New Arrivals', 'Best Sellers', 'Trending Now', 'Sale'],
}

const TRUST_BADGES = [
  { icon: Truck, title: 'Free Shipping', desc: 'On orders above ₹999' },
  { icon: RefreshCw, title: 'Easy Returns', desc: '30-day hassle-free returns' },
  { icon: Shield, title: 'Secure Payment', desc: '100% secure transactions' },
  { icon: Headphones, title: '24/7 Support', desc: 'Dedicated customer care' },
]

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      {/* Trust badges */}
      <div className="border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          {TRUST_BADGES.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex items-start gap-3">
              <div className="w-10 h-10 bg-brand-600/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <Icon size={18} className="text-brand-400" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm">{title}</p>
                <p className="text-gray-400 text-xs mt-0.5">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="bg-brand-600 text-white font-black text-2xl px-4 py-2 rounded tracking-widest inline-block mb-4">
              GUPTAJI
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              India's leading fashion destination with 3000+ brands and millions of styles for Men, Women & Kids.
            </p>
            <div className="flex gap-3">
              {[Instagram, Facebook, Twitter, Youtube].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 bg-gray-800 hover:bg-brand-600 rounded-lg flex items-center justify-center transition-colors">
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(FOOTER_LINKS).map(([heading, links]) => (
            <div key={heading}>
              <h4 className="text-white font-semibold text-sm mb-4">{heading}</h4>
              <ul className="space-y-2.5">
                {links.map(link => (
                  <li key={link}>
                    <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact */}
        <div className="mt-10 pt-8 border-t border-gray-700 grid md:grid-cols-3 gap-4">
          {[
            { icon: Mail, text: 'support@guptajigarments.com' },
            { icon: Phone, text: '+91-9876543210' },
            { icon: MapPin, text: 'Gurugram, Haryana, India' },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-2 text-sm text-gray-400">
              <Icon size={15} className="text-brand-400" />
              <span>{text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-700 py-4">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-500">
          <p>© 2026 GarmentStore. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-gray-300 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-gray-300 transition-colors">Terms of Use</a>
            <a href="#" className="hover:text-gray-300 transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
