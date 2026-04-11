import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import React, { Suspense, lazy } from 'react';
import { CartProvider, useCart } from './context/CartContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar, { CartDrawer } from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import ScrollToTop from './components/ScrollToTop';

// Lazy load components for performance
const LandingPage = lazy(() => import('./components/Landing_Page/LandingPage'));
const AllProducts = lazy(() => import('./components/Allproducts/products'));
const ProductDetail = lazy(() => import('./components/ProductDetail/ProductDetail'));
const Terms = lazy(() => import('./components/TermsAndConditions/Terms'));
const CartPage = lazy(() => import('./components/CartPage'));
const LoginPage = lazy(() => import('./components/LoginPage'));
const SignupPage = lazy(() => import('./components/SignupPage'));
const Profile = lazy(() => import('./components/Profile/Profile'));
const CheckoutPage = lazy(() => import('./components/CheckoutPage/CheckoutPage'));
const PrivacyPolicy = lazy(() => import('./components/Policies/PrivacyPolicy'));
const ShippingPolicy = lazy(() => import('./components/Policies/ShippingPolicy'));
const CancellationPolicy = lazy(() => import('./components/Policies/CancellationPolicy'));
const Makings = lazy(() => import('./components/Makings/Makings'));
const OrderHistory = lazy(() => import('./components/OrderHistory/OrderHistory'));
const ContactUs = lazy(() => import('./components/ContactUs/ContactUs'));
import ErrorBoundary from './components/ErrorBoundary';


function MainLayout({ children }) {
  const { cartItems, cartOpen, setCartOpen, updateQty, removeFromCart, totalItems } = useCart();
  const { loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isCheckout = location.pathname === '/checkout';

  if (authLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <div className="w-10 h-10 border-4 border-[#4a7c23]/20 border-t-[#4a7c23] rounded-full animate-spin"></div>
      </div>
    );
  }

  const handleCartClick = () => {
    setCartOpen(true);
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
        <Suspense fallback={
          <div className="flex h-screen items-center justify-center">
            <div className="w-10 h-10 border-4 border-[#4a7c23]/20 border-t-[#4a7c23] rounded-full animate-spin"></div>
          </div>
        }>
          {children}
        </Suspense>
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
            const token = localStorage.getItem('token');
            if (!token) {
              navigate('/login', { state: { from: '/checkout' } });
            } else {
              navigate('/checkout');
            }
          }}
        />
      )}

      {!isCheckout && <Footer />}
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <CartProvider>
          <BrowserRouter>
            <ScrollToTop />
            <MainLayout>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/products" element={<AllProducts />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/shipping-policy" element={<ShippingPolicy />} />
                <Route path="/cancellation-policy" element={<CancellationPolicy />} />
                <Route path="/makings" element={<Makings />} />
                <Route path="/orders" element={<OrderHistory />} />
                <Route path="/contact" element={<ContactUs />} />
              </Routes>
            </MainLayout>
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;