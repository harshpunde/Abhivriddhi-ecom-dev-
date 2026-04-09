import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import './products.css';
import { PRODUCTS_DATA, CATEGORIES } from '../../data/products';
import { useCart } from '../../context/CartContext';
import Navbar, { CartDrawer } from '../Navbar/Navbar';
import Footer from '../Footer/Footer';

// ─── Filter Dropdown ──────────────────────────────────────────
function FilterDropdown({ label, value, options, onChange }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="filter-dropdown">
      <button
        className={`filter-dropdown-btn ${open ? 'active' : ''}`}
        onClick={() => setOpen(!open)}
      >
        <span className="filter-label-text">{label}</span>
        <svg
          className={`chevron ${open ? 'rotated' : ''}`}
          width="16" height="16" viewBox="0 0 24 24"
          fill="none" stroke="currentColor" strokeWidth="2"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      {open && (
        <ul className="filter-options">
          {options.map(opt => (
            <li key={opt.value}>
              <button
                className={`filter-option ${value === opt.value ? 'selected' : ''}`}
                onClick={() => { onChange(opt.value); setOpen(false); }}
              >
                {value === opt.value && (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
                {opt.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ─── Filters Sidebar ──────────────────────────────────────────
function Sidebar({ availability, setAvailability, sortBy, setSortBy, category, setCategory, onClear }) {
  const hasFilters = availability !== 'all' || sortBy !== 'default' || category !== 'all';

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h3 className="sidebar-title">Filters</h3>
        {hasFilters && (
          <button className="clear-filters" onClick={onClear}>Clear all</button>
        )}
      </div>

      <FilterDropdown
        label="Availability"
        value={availability}
        options={[
          { value: 'all',          label: 'All' },
          { value: 'in-stock',     label: 'In Stock' },
          { value: 'out-of-stock', label: 'Out of Stock' },
        ]}
        onChange={setAvailability}
      />

      <FilterDropdown
        label="Sort By"
        value={sortBy}
        options={[
          { value: 'default',    label: 'Default' },
          { value: 'price-asc',  label: 'Price: Low to High' },
          { value: 'price-desc', label: 'Price: High to Low' },
          { value: 'name-asc',   label: 'Name: A to Z' },
        ]}
        onChange={setSortBy}
      />

      <FilterDropdown
        label="Category"
        value={category}
        options={CATEGORIES.map(c => ({ value: c === 'All' ? 'all' : c, label: c }))}
        onChange={setCategory}
      />
    </aside>
  );
}

// ─── Product Card ─────────────────────────────────────────────
function ProductCard({ product }) {
  const navigate = useNavigate();
  const { addToCart, cartItems } = useCart();
  const [adding, setAdding] = useState(false);

  const inCart = cartItems.some(i => i.id === product.id);

  const handleAdd = (e) => {
    e.stopPropagation(); // prevent card click from firing
    setAdding(true);
    addToCart(product);
    setTimeout(() => setAdding(false), 800);
  };

  return (
    <div
      className={`product-card ${!product.inStock ? 'out-of-stock' : ''}`}
      onClick={() => navigate(`/product/${product.id}`)}
      style={{ cursor: 'pointer' }}
    >
      {!product.inStock && <span className="badge-out">Out of Stock</span>}
      <div className="product-img-wrap">
        <img src={product.img} alt={product.name} className="product-img" />
      </div>
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-desc">{product.description}</p>
        <p className="product-price">Price: ₹{product.price}/-</p>
        <button
          className={`btn-add-cart ${adding ? 'adding' : ''} ${inCart ? 'in-cart' : ''}`}
          onClick={handleAdd}
          disabled={!product.inStock}
        >
          {adding ? '✓ Added!' : inCart ? 'Add More' : 'Add to cart'}
        </button>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────
export default function AllProducts() {
  const navigate = useNavigate();
  const { cartItems, cartOpen, setCartOpen, updateQty, removeFromCart, totalItems } = useCart();

  const [availability, setAvailability] = useState('all');
  const [sortBy, setSortBy]             = useState('default');
  const [category, setCategory]         = useState('all');
  const [onlineCount]                   = useState(15);

  const clearFilters = () => {
    setAvailability('all');
    setSortBy('default');
    setCategory('all');
  };

  const filteredProducts = useMemo(() => {
    let list = [...PRODUCTS_DATA];

    if (availability === 'in-stock')     list = list.filter(p => p.inStock);
    if (availability === 'out-of-stock') list = list.filter(p => !p.inStock);
    if (category !== 'all')              list = list.filter(p => p.category === category);

    if (sortBy === 'price-asc')  list.sort((a, b) => a.price - b.price);
    if (sortBy === 'price-desc') list.sort((a, b) => b.price - a.price);
    if (sortBy === 'name-asc')   list.sort((a, b) => a.name.localeCompare(b.name));

    return list;
  }, [availability, sortBy, category]);

  return (
    <div className="page-wrapper">
      <Navbar cartCount={totalItems} onCartClick={() => setCartOpen(true)} />

      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cartItems}
        onUpdate={updateQty}
        onRemove={removeFromCart}
        onCheckout={() => navigate('/checkout')}
      />

      <main className="main-content">
        <div className="page-header">
          <h1 className="page-title">
            {category === 'all' ? 'All Products' : category}
          </h1>
          <p className="page-subtitle">Our Products</p>
        </div>

        <div className="products-layout">
          <Sidebar
            availability={availability} setAvailability={setAvailability}
            sortBy={sortBy}             setSortBy={setSortBy}
            category={category}         setCategory={setCategory}
            onClear={clearFilters}
          />

          <section className="products-section">
            <div className="products-meta">
              <span className="online-customers">
                <span className="online-dot" />
                Online Customers: {onlineCount}
              </span>
              <span className="product-count">{filteredProducts.length} Products</span>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="no-products">
                <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5">
                  <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <p>No products match your filters.</p>
                <button className="btn-primary" onClick={clearFilters}>Clear Filters</button>
              </div>
            ) : (
              <div className="product-grid">
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
