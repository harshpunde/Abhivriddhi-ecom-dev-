import { Link } from "react-router-dom"
import { ShoppingCart } from "lucide-react"

export default function Navbar() {
  return (
    <header className="absolute inset-x-0 top-0 z-50">

      {/* 🔝 Top Green Strip */}
      <div className="w-full bg-green-800 text-white text-xs md:text-sm">
        <div className="max-w-[2000px] mx-auto px-3 py-4 flex justify-between items-center">
          <span>100% Organic</span>
          <span>Gluten Free</span>
          <span>15% Discount on first purchase</span>
          <span>Chemical Free</span>
          <span>No Sugar Added</span>
        </div>
      </div>

      {/* 🌿 Main Navbar */}
      <nav className="w-full">
        <div className="max-w-[2500px] mx-auto px-4 mt-2">
          
          {/* Glass Container */}
          <div className="flex items-center justify-between 
                          bg-black/30 backdrop-blur-md 
                          px-6 py-7 rounded-md">

            {/* Logo */}
            <Link to="/" className="flex flex-col leading-tight">
              <span className="text-white text-2xl font-semibold">
                अभिवृद्धि
              </span>
              <span className="text-white/90 text-sm -mt-1">
                Organics
              </span>
            </Link>

            {/* Nav Links */}
            <div className="hidden md:flex items-center gap-6">
              <Link
                to="/products"
                className="text-white text-sm font-medium hover:text-white/80 transition"
              >
                Products
              </Link>

              <Link
                to="/makings"
                className="text-white text-sm font-medium hover:text-white/80 transition"
              >
                Makings
              </Link>
            </div>

            <div className="flex items-center gap-2 md:gap-3">
              <Link
                to="/login"
                className="rounded-full border border-white/20 bg-white/10 px-3 py-2 text-xs font-medium text-white transition hover:bg-white/20 md:px-4 md:py-2 md:text-sm"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="rounded-full bg-white px-3 py-2 text-xs font-medium text-[#1a3d0c] transition hover:bg-slate-100 md:px-4 md:py-2 md:text-sm"
              >
                Sign Up
              </Link>
            </div>

            {/* Cart Icon */}
            <Link to="/cart" className="text-white hover:text-white/80">
              <ShoppingCart className="w-5 h-5" />
            </Link>

          </div>
        </div>
      </nav>
    </header>
  )
}
