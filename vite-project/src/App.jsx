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
import AllProducts from './components/Allproducts/products';
import ProductDetail from './components/ProductDetail/ProductDetail';
import Terms from './components/TermsAndConditions/Terms';


function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AllProducts />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/terms" element={<Terms />} />   
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;