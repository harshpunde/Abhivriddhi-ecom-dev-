import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar, { CartDrawer } from "../Navbar/Navbar.jsx"
import { HeroSection } from "./hero-section.jsx"
import { FeaturesSection } from "./features-section.jsx"
import { PillarsSection } from "./pillars-section.jsx"
import { ProductsSection } from "./products-section.jsx"
import Footer from '../Footer/Footer';
import { useCart } from "../../context/CartContext"

export function LandingPage() {
  const { totalItems, cartItems, updateQty, removeFromCart } = useCart();
  const [cartOpen, setCartOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar cartCount={totalItems} onCartClick={() => setCartOpen(true)} />
      <main className="flex-grow mt-[34px]">
        <HeroSection />
        <FeaturesSection />
        <ProductsSection />
        <PillarsSection />
      </main>
      <Footer />
      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cartItems}
        onUpdate={updateQty}
        onRemove={removeFromCart}
        onCheckout={() => {
          setCartOpen(false);
          navigate('/checkout');
        }}
      />
    </div>
  )
}

export default LandingPage

