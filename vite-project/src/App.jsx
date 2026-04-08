// import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import { CartProvider } from './context/CartContext';
// import AllProducts from './components/Allproducts/products';
// import ProductDetail from './components/ProductDetail/ProductDetail';

// function App() {
//   return (
//     <CartProvider>
//       <BrowserRouter>
//         <Routes>
//           <Route path="/"            element={<AllProducts />} />
//           <Route path="/product/:id" element={<ProductDetail />} />
//         </Routes>
//       </BrowserRouter>
//     </CartProvider>
//   );
// }

// export default App;


import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import LandingPage from './components/Landing_Page/LandingPage';
import AllProducts from './components/Allproducts/products';
import ProductDetail from './components/ProductDetail/ProductDetail';
import Terms from './components/TermsAndConditions/Terms';
import CartPage from './components/CartPage';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import Dashboard from './components/Dashboard/Dashboard';
import CheckoutPage from './components/CheckoutPage/CheckoutPage';

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
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
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;