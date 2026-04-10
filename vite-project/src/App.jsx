import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { CartProvider, useCart } from './context/CartContext';
import Navbar, { CartDrawer } from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import LandingPage from './components/Landing_Page/LandingPage';
import AllProducts from './components/Allproducts/products';
import ProductDetail from './components/ProductDetail/ProductDetail';
import Terms from './components/TermsAndConditions/Terms';
import CartPage from './components/CartPage';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import Dashboard from './components/Dashboard/Dashboard';
import CheckoutPage from './components/CheckoutPage/CheckoutPage';
import PrivacyPolicy from './components/Policies/PrivacyPolicy';
import ShippingPolicy from './components/Policies/ShippingPolicy';
import CancellationPolicy from './components/Policies/CancellationPolicy';
import Makings from './components/Makings/Makings';

function MainLayout({ children }) {
  const { cartItems, cartOpen, setCartOpen, updateQty, removeFromCart, totalItems } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const isCheckout = location.pathname === '/checkout';

  const handleCartClick = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    } else {
      setCartOpen(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {!isCheckout && (
        <Navbar
          cartCount={totalItems}
          onCartClick={handleCartClick}
        />
      )}

      <main className={`flex-grow ${isCheckout ? '' : 'mt-[40px]'}`}>
        {children}
      </main>

      {!isCheckout && (
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
      )}

      {!isCheckout && <Footer />}
    </div>
  );
}

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <MainLayout>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/products" element={<AllProducts />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/shipping-policy" element={<ShippingPolicy />} />
            <Route path="/cancellation-policy" element={<CancellationPolicy />} />
            <Route path="/makings" element={<Makings />} />
          </Routes>
        </MainLayout>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;