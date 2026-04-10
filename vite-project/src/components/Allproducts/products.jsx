import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './products.css';
import { PRODUCTS_DATA, CATEGORIES } from '../../data/products';
import { useCart } from '../../context/CartContext';

// ─── Filter Dropdown (Polished for Figma) ─────────────────────
function FilterDropdown({ label, value, options, onChange }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="filter-dropdown">
      <button
        className={`filter-dropdown-btn ${open ? 'active' : ''}`}
        onClick={() => setOpen(!open)}
      >
        <span>{label}</span>
        <svg
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0)' , transition: '0.2s' }}
          width="16" height="16" viewBox="0 0 24 24"
          fill="none" stroke="currentColor" strokeWidth="2.5"
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
                {opt.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ─── Filters Sidebar (Desktop) ────────────────────────────────
function Sidebar({ availability, setAvailability, sortBy, setSortBy, category, setCategory, onClear }) {
  return (
    <aside className="sidebar desktop-only">
      <div className="sidebar-header">
        <h3 className="sidebar-title">Filters</h3>
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
        label="Products Category"
        value={category}
        options={CATEGORIES.map(c => ({ value: c === 'All' ? 'all' : c, label: c }))}
        onChange={setCategory}
      />
    </aside>
  );
}

// ─── Product Card (Redesigned for Figma) ──────────────────────
function ProductCard({ product }) {
  const navigate = useNavigate();
  const { addToCart, cartItems } = useCart();
  const [adding, setAdding] = useState(false);

  const inCart = cartItems.some(i => i.id === product.id);

  const handleAdd = (e) => {
    e.stopPropagation();
    setAdding(true);
    addToCart(product);
    setTimeout(() => setAdding(false), 800);
  };

  return (
    <div
      className={`product-card ${!product.inStock ? 'out-of-stock' : ''}`}
      onClick={() => navigate(`/product/${product.id}`)}
    >
      <div className="product-img-wrap">
        <img src={product.img} alt={product.name} className="product-img" loading="lazy" decoding="async" />
      </div>
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-desc">{product.description}</p>
        <p className="product-price">Price: ₹{product.price}/-</p>
        <button
          className="btn-add-cart"
          onClick={handleAdd}
          disabled={!product.inStock}
        >
          {adding ? '✓ Added!' : 'Add to cart'}
        </button>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────
export default function AllProducts() {
  const [availability, setAvailability] = useState('all');
  const [sortBy, setSortBy]             = useState('default');
  const [category, setCategory]         = useState('all');
  const [onlineCount]                   = useState(15);
  const [isMobile, setIsMobile]         = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
    <main className="main-content">
      <div className="page-header">
        <h1 className="page-title">All Products</h1>
        <p className="page-subtitle">Our Products</p>
      </div>

      {isMobile && (
        <div className="mobile-filters">
          <FilterDropdown
            label="Category"
            value={category}
            options={CATEGORIES.map(c => ({ value: c === 'All' ? 'all' : c, label: c }))}
            onChange={setCategory}
          />
          <FilterDropdown
            label="Sort By"
            value={sortBy}
            options={[
              { value: 'default',    label: 'Default' },
              { value: 'price-asc',  label: 'Price: Low' },
              { value: 'price-desc', label: 'Price: High' },
            ]}
            onChange={setSortBy}
          />
          <FilterDropdown
            label="Availability"
            value={availability}
            options={[
              { value: 'all',  label: 'All' },
              { value: 'in-stock', label: 'In Stock' },
            ]}
            onChange={setAvailability}
          />
        </div>
      )}

      <div className="products-layout">
        {!isMobile && (
          <Sidebar
            availability={availability} setAvailability={setAvailability}
            sortBy={sortBy}             setSortBy={setSortBy}
            category={category}         setCategory={setCategory}
            onClear={clearFilters}
          />
        )}

        <section className="products-section">
          <div className="products-meta">
            <span className="online-customers">Online Customers: {Math.floor(Math.random() * 20) + 10}</span>
            <span className="product-count">{filteredProducts.length} Products</span>
          </div>

          <div className="product-grid">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="load-more-container">
            <button className="btn-load-more">Load more</button>
          </div>
        </section>
      </div>
    </main>
  );
}
