import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PRODUCTS_DATA, WEIGHT_OPTIONS, SHIPPING_INFO } from '../../data/products';
import { useCart } from '../../context/CartContext';
import Navbar, { CartDrawer } from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import './ProductDetail.css';

// ─── Accordion ────────────────────────────────────────────────
function Accordion({ title, children }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="accordion">
      <button className="accordion-btn" onClick={() => setOpen(!open)}>
        <span>{title}</span>
        <span className={`accordion-icon ${open ? 'open' : ''}`}>
          {open ? '−' : '+'}
        </span>
      </button>
      {open && <div className="accordion-body">{children}</div>}
    </div>
  );
}

// ─── Related Product Mini Card ────────────────────────────────
function RelatedCard({ product }) {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [adding, setAdding] = useState(false);

  const handleAdd = (e) => {
    e.stopPropagation();
    setAdding(true);
    addToCart(product);
    setTimeout(() => setAdding(false), 800);
  };

  return (
    <div className="related-card" onClick={() => navigate(`/product/${product.id}`)}>
      <div className="related-img-wrap">
        <img src={product.img} alt={product.name} />
      </div>
      <div className="related-info">
        <h4 className="related-name">{product.name}</h4>
        <p className="related-desc">{product.description}</p>
        <p className="related-price">Price: ₹{product.price}/-</p>
        <button
          className={`related-add-btn ${adding ? 'adding' : ''}`}
          onClick={handleAdd}
          disabled={!product.inStock}
        >
          {adding ? '✓ Added!' : 'Add to cart'}
        </button>
      </div>
    </div>
  );
}

// ─── Product Detail Page ──────────────────────────────────────
export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { cartItems, cartOpen, setCartOpen, addToCart, updateQty, removeFromCart, totalItems } = useCart();

  const product = PRODUCTS_DATA.find(p => p.id === Number(id));

  const [selectedWeight, setSelectedWeight] = useState(WEIGHT_OPTIONS[0]);
  const [qty, setQty]                       = useState(1);
  const [activeThumb, setActiveThumb]       = useState(0);
  const [addedToCart, setAddedToCart]       = useState(false);

  if (!product) {
    return (
      <div className="pd-wrapper">
        <Navbar cartCount={totalItems} onCartClick={() => setCartOpen(true)} />
        <div className="pd-not-found">
          <p>Product not found.</p>
          <button className="pd-btn-outline" onClick={() => navigate('/')}>← Back to Products</button>
        </div>
        <Footer />
      </div>
    );
  }

  // Related products: same category, different id, max 3
  const related = PRODUCTS_DATA
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 3);

  const handleAddToCart = () => {
    for (let i = 0; i < qty; i++) addToCart(product);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 1200);
  };

  const handleCheckout = () => {
    for (let i = 0; i < qty; i++) addToCart(product);
    setCartOpen(true);
  };

  // Thumbnail images (use same image for demo — replace with real variants)
  const thumbnails = [product.img, product.img];

  return (
    <div className="pd-wrapper">
      <Navbar cartCount={totalItems} onCartClick={() => setCartOpen(true)} />

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

      <main className="pd-main">
        {/* ── Breadcrumb ── */}
        <nav className="pd-breadcrumb">
          <button onClick={() => navigate('/')}>All Products</button>
          <span>/</span>
          <span>{product.name}</span>
        </nav>

        {/* ── Product Section ── */}
        <div className="pd-content">
          {/* Left – Image Gallery */}
          <div className="pd-gallery">
            <div className="pd-main-img-wrap">
              <img src={thumbnails[activeThumb]} alt={product.name} className="pd-main-img" />
            </div>
            <div className="pd-thumbnails">
              {thumbnails.map((thumb, i) => (
                <button
                  key={i}
                  className={`pd-thumb ${activeThumb === i ? 'active' : ''}`}
                  onClick={() => setActiveThumb(i)}
                >
                  <img src={thumb} alt={`${product.name} view ${i + 1}`} />
                </button>
              ))}
            </div>
          </div>

          {/* Right – Product Info */}
          <div className="pd-info">
            <h1 className="pd-name">{product.name}</h1>
            <hr className="pd-divider" />

            {/* Accordions */}
            <Accordion title="Description">
              <p>{product.description}</p>
            </Accordion>
            <Accordion title="Shipping Information">
              <p>{SHIPPING_INFO}</p>
            </Accordion>

            {/* Weight Selector */}
            <div className="pd-section">
              <p className="pd-label">Weight</p>
              <div className="pd-weights">
                {WEIGHT_OPTIONS.map(w => (
                  <button
                    key={w}
                    className={`pd-weight-btn ${selectedWeight === w ? 'selected' : ''}`}
                    onClick={() => setSelectedWeight(w)}
                  >
                    {w}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="pd-section">
              <p className="pd-label">Quantity</p>
              <div className="pd-qty">
                <button
                  className="pd-qty-btn"
                  onClick={() => setQty(q => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                >
                  +
                </button>
                <span className="pd-qty-val">{qty}</span>
                <button
                  className="pd-qty-btn"
                  onClick={() => setQty(q => q + 1)}
                  aria-label="Increase quantity"
                >
                  −
                </button>
              </div>
            </div>

            {/* Price */}
            <p className="pd-price">Price: ₹{product.price}/-</p>

            {/* Actions */}
            <div className="pd-actions">
              <button
                className={`pd-btn-outline ${addedToCart ? 'added' : ''}`}
                onClick={handleAddToCart}
                disabled={!product.inStock}
              >
                {addedToCart ? '✓ Added to Cart' : 'Add to cart'}
              </button>
              <button
                className="pd-btn-solid"
                onClick={handleCheckout}
                disabled={!product.inStock}
              >
                Checkout
              </button>
            </div>

            {!product.inStock && (
              <p className="pd-out-label">⚠ This product is currently out of stock.</p>
            )}
          </div>
        </div>

        {/* ── You May Also Like ── */}
        {related.length > 0 && (
          <section className="pd-related">
            <h2 className="pd-related-title">You may also like</h2>
            <div className="pd-related-grid">
              {related.map(p => (
                <RelatedCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
