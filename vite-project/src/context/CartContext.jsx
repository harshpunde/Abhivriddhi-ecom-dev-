import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

// Load cart from localStorage on startup
const loadCart = () => {
  try {
    const saved = localStorage.getItem('abhivriddhi_cart');
    if (!saved) return [];
    const items = JSON.parse(saved);
    // Sanitize: help migrate old items if they are missing properties
    return items.map(item => ({
      ...item,
      id: item.id || item._id, // Ensure we always have an 'id'
      img: item.img || item.imageUrl // Ensure we always have an 'img'
    }));
  } catch {
    return [];
  }
};

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(loadCart);
  const [cartOpen, setCartOpen]   = useState(false);

  // Persist cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('abhivriddhi_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product) => {
    const weight = product.cartVariant || product.weight || 'Standard Size';
    const unitPrice = product.cartPrice || product.unitPrice || product.price;
    // Map database fields to legacy fields if missing
    const pid = product.id || product._id;
    const pimg = product.img || product.imageUrl;

    setCartItems(prev => {
      const existing = prev.find(i => i.id === pid && i.weight === weight);
      if (existing) {
        return prev.map(i => {
          if (i.id === pid && i.weight === weight) {
            const newQty = i.qty + 1;
            return { ...i, qty: newQty, totalPrice: unitPrice * newQty };
          }
          return i;
        });
      }
      return [...prev, { ...product, id: pid, img: pimg, weight, unitPrice, qty: 1, totalPrice: unitPrice * 1 }];
    });
  };

  const updateQty = (id, weight, qty) => {
    if (qty < 1) {
      setCartItems(prev => prev.filter(i => !(i.id === id && i.weight === weight)));
    } else {
      setCartItems(prev => prev.map(i => {
        if (i.id === id && i.weight === weight) {
          return { ...i, qty, totalPrice: i.unitPrice * qty };
        }
        return i;
      }));
    }
  };

  const removeFromCart = (id, weight) => setCartItems(prev => prev.filter(i => !(i.id === id && i.weight === weight)));

  const clearCart = () => setCartItems([]);

  const totalItems = cartItems.reduce((sum, i) => sum + i.qty, 0);

  return (
    <CartContext.Provider value={{
      cartItems, cartOpen, setCartOpen,
      addToCart, updateQty, removeFromCart, clearCart, totalItems,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
