import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
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

function MainLayout({ children }) {
  const { cartItems, cartOpen, setCartOpen, updateQty, removeFromCart, totalItems } = useCart();
  const navigate = useNavigate();

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
      <Navbar 
        cartCount={totalItems} 
        onCartClick={handleCartClick} 
      />
      
      <main className="flex-grow">
        {children}
      </main>

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
      
      <Footer />
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
          </Routes>
        </MainLayout>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;