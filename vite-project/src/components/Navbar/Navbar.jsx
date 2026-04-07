import { useState, useEffect } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import './Navbar.css';

// ─── Announcement Bar ─────────────────────────────────────────
function AnnouncementBar() {
  const items = [
    '100% Organic',
    'Gluten Free',
    '15% Discount on first purchase',
    'Chemical Free',
    'No Sugar Added',
  ];
  return (
    <div className="announcement-bar">
      <div className="announcement-track">
        {[...items, ...items].map((item, i) => (
          <span key={i} className="announcement-item">
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Cart Drawer ──────────────────────────────────────────────
function CartDrawer({ open, onClose, items, onUpdate, onRemove }) {
  const total = items.reduce((sum, i) => sum + i.price * i.qty, 0);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <>
      <div className={`cart-overlay ${open ? 'visible' : ''}`} onClick={onClose} />
      <aside className={`cart-drawer ${open ? 'open' : ''}`}>
        <div className="cart-header">
          <h2>Your Cart</h2>
          <button className="cart-close" onClick={onClose} aria-label="Close cart">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {items.length === 0 ? (
          <div className="cart-empty">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5">
              <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            <p>Your cart is empty</p>
            <button className="nav-btn-primary" onClick={onClose}>Continue Shopping</button>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {items.map(item => (
                <div key={item.id} className="cart-item">
                  <img src={item.img} alt={item.name} className="cart-item-img" />
                  <div className="cart-item-info">
                    <p className="cart-item-name">{item.name}</p>
                    <p className="cart-item-price">₹{item.price}/-</p>
                    <div className="qty-control">
                      <button onClick={() => onUpdate(item.id, item.qty - 1)}>−</button>
                      <span>{item.qty}</span>
                      <button onClick={() => onUpdate(item.id, item.qty + 1)}>+</button>
                    </div>
                  </div>
                  <button className="remove-btn" onClick={() => onRemove(item.id)} aria-label="Remove item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" />
                      <path d="M10 11v6" /><path d="M14 11v6" /><path d="M9 6V4h6v2" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
            <div className="cart-footer">
              <div className="cart-total">
                <span>Subtotal</span>
                <span>₹{total}/-</span>
              </div>
              <p className="cart-note">Shipping &amp; taxes calculated at checkout</p>
              <button className="nav-btn-primary cart-checkout">Proceed to Checkout</button>
              <button className="nav-btn-secondary" onClick={onClose}>Continue Shopping</button>
            </div>
          </>
        )}
      </aside>
    </>
  );
}

// ─── Navbar ───────────────────────────────────────────────────
export default function Navbar({ cartCount = 0, onCartClick, cartItems = [], onCartUpdate, onCartRemove }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartOpen, setCartOpen]     = useState(false);
  const navigate = useNavigate();

  const handleCartOpen = () => {
    if (onCartClick) onCartClick();
    else setCartOpen(true);
  };

  return (
    <>
      <AnnouncementBar />
      <nav className="navbar">
        <div className="navbar-inner">
          <button className="navbar-logo" onClick={() => navigate('/')} aria-label="Go to home">
            <span className="logo-hindi">अभिवृद्धि</span>
            <span className="logo-en">Organics</span>
          </button>

          <button
            className="hamburger"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <span /><span /><span />
          </button>

          <div className={`navbar-links ${mobileOpen ? 'open' : ''}`}>
            <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`}>Products</NavLink>
            <NavLink to="/makings" className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`}>Makings</NavLink>
            <button className="cart-btn" onClick={handleCartOpen} aria-label="Open cart">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              {cartCount > 0 && (
                <span className="cart-badge">{cartCount}</span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Internal cart drawer (used when no external onCartClick is provided) */}
      {!onCartClick && (
        <CartDrawer
          open={cartOpen}
          onClose={() => setCartOpen(false)}
          items={cartItems}
          onUpdate={onCartUpdate || (() => {})}
          onRemove={onCartRemove || (() => {})}
        />
      )}
    </>
  );
}

// Also export CartDrawer so products.jsx can use it with shared state
export { CartDrawer };
