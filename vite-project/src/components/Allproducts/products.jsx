import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './products.css';
import { fetchProducts } from '../../services/api';
import { useCart } from '../../context/CartContext';
const CATEGORIES = ['All', 'Atta', 'Millets', 'Rice', 'Honey']; // Local copy for UI filters

// ─── Filter Dropdown ─────────────────────────────────────────
// Accepts openId + activeFilter so only one can be open at a time
function FilterDropdown({ id, label, value, options, onChange, activeFilter, setActiveFilter }) {
  const open = activeFilter === id;
  return (
    <div className="filter-dropdown">
      <button
        className={`filter-dropdown-btn ${open ? 'active' : ''}`}
        onClick={() => setActiveFilter(open ? null : id)}
      >
        <span>{label}</span>
        <svg
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0)', transition: '0.2s' }}
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
                onClick={() => { onChange(opt.value); setActiveFilter(null); }}
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

// ─── Filters Sidebar (Desktop) ────────────────────────────────────
function Sidebar({ availability, setAvailability, sortBy, setSortBy, category, setCategory, onClear }) {
  const [activeFilter, setActiveFilter] = useState(null);
  return (
    <aside className="sidebar desktop-only">
      <div className="sidebar-header">
        <h3 className="sidebar-title">Filters</h3>
      </div>

      <FilterDropdown
        id="availability" label="Availability" value={availability}
        options={[
          { value: 'all', label: 'All' },
          { value: 'in-stock', label: 'In Stock' },
          { value: 'out-of-stock', label: 'Out of Stock' },
        ]}
        onChange={setAvailability}
        activeFilter={activeFilter} setActiveFilter={setActiveFilter}
      />

      <FilterDropdown
        id="sortby" label="Sort By" value={sortBy}
        options={[
          { value: 'default', label: 'Default' },
          { value: 'price-asc', label: 'Price: Low to High' },
          { value: 'price-desc', label: 'Price: High to Low' },
          { value: 'name-asc', label: 'Name: A to Z' },
        ]}
        onChange={setSortBy}
        activeFilter={activeFilter} setActiveFilter={setActiveFilter}
      />

      <FilterDropdown
        id="category" label="Products Category" value={category}
        options={CATEGORIES.map(c => ({ value: c === 'All' ? 'all' : c, label: c }))}
        onChange={setCategory}
        activeFilter={activeFilter} setActiveFilter={setActiveFilter}
      />
    </aside>
  );
}

// ─── Mobile Filters (with accordion) ─────────────────────────
function MobileFilters({ category, setCategory, sortBy, setSortBy, availability, setAvailability }) {
  const [activeFilter, setActiveFilter] = useState(null);
  return (
    <div className="mobile-filters">
      <FilterDropdown
        id="cat" label="Category" value={category}
        options={CATEGORIES.map(c => ({ value: c === 'All' ? 'all' : c, label: c }))}
        onChange={setCategory}
        activeFilter={activeFilter} setActiveFilter={setActiveFilter}
      />
      <FilterDropdown
        id="sort" label="Sort By" value={sortBy}
        options={[
          { value: 'default', label: 'Default' },
          { value: 'price-asc', label: 'Price: Low' },
          { value: 'price-desc', label: 'Price: High' },
        ]}
        onChange={setSortBy}
        activeFilter={activeFilter} setActiveFilter={setActiveFilter}
      />
      <FilterDropdown
        id="avail" label="Availability" value={availability}
        options={[
          { value: 'all', label: 'All' },
          { value: 'in-stock', label: 'In Stock' },
        ]}
        onChange={setAvailability}
        activeFilter={activeFilter} setActiveFilter={setActiveFilter}
      />
    </div>
  );
}

// ─── Product Card (Redesigned for Figma) ──────────────────────
function ProductCard({ product }) {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [adding, setAdding] = useState(false);

  let parsedWeights = product.weights;
  if (typeof parsedWeights === 'string') {
    try { parsedWeights = JSON.parse(parsedWeights); }
    catch (err) { parsedWeights = []; }
  }
  const hasVariants = parsedWeights && parsedWeights.length > 0;

  const handleAdd = (e) => {
    e.stopPropagation();
    setAdding(true);

    const defaultVariant = hasVariants ? parsedWeights[0].label : null;
    const defaultPrice = hasVariants ? parsedWeights[0].price : product.price;

    // Default to the first available variant for quick 'Add to Cart' action
    const productToAdd = {
      ...product,
      cartVariant: defaultVariant,
      cartPrice: Number(defaultPrice)
    };

    addToCart(productToAdd);
    setTimeout(() => setAdding(false), 800);
  };

  return (
    <div
      className={`product-card ${!product.inStock ? 'out-of-stock' : ''}`}
      onClick={() => navigate(`/product/${product.id || product._id}`)}
    >
      <div className="product-img-wrap">
        <img
          src={product.img || product.imageUrl}
          alt={product.name}
          className="product-img"
          loading="lazy"
        />
      </div>

      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-desc">{product.description}</p>
        <p className="product-price">Price: ₹{product.price}/-</p>
        <button
          className="btn-add-cart"
          onClick={handleAdd}
          disabled={!product.inStock || adding}
        >
          {adding ? '✓ Added' : '+ Add to cart'}
        </button>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────
export default function AllProducts() {
  const [availability, setAvailability] = useState('all');
  const [sortBy, setSortBy] = useState('default');
  const [category, setCategory] = useState('all');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const data = await fetchProducts({ category, availability });
        if (data.success) {
          setProducts(data.products);
        }
      } catch (err) {
        console.error('Failed to load products:', err);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, [category, availability]);

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
    let list = [...products];
    if (sortBy === 'price-asc') list.sort((a, b) => a.price - b.price);
    if (sortBy === 'price-desc') list.sort((a, b) => b.price - a.price);
    if (sortBy === 'name-asc') list.sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [products, sortBy]);

  return (
    <main className="main-content">
      <div className="page-header">
        <h1 className="page-title">All Products</h1>
        <p className="page-subtitle">Our Products</p>
      </div>

      {isMobile && (
        <>
          <div className="mobile-meta">
            <span>Online Customers: {Math.floor(Math.random() * 20) + 15}</span>
            <span>{filteredProducts.length} Products</span>
          </div>

          <MobileFilters
            category={category} setCategory={setCategory}
            sortBy={sortBy} setSortBy={setSortBy}
            availability={availability} setAvailability={setAvailability}
          />
        </>
      )}

      <div className="products-layout">
        {!isMobile && (
          <Sidebar
            availability={availability} setAvailability={setAvailability}
            sortBy={sortBy} setSortBy={setSortBy}
            category={category} setCategory={setCategory}
            onClear={clearFilters}
          />
        )}

        <section className="products-section">
          {!isMobile && (
            <div className="products-meta">
              <span className="online-customers">Online Customers: {Math.floor(Math.random() * 20) + 15}</span>
              <span className="product-count">{filteredProducts.length} Products</span>
            </div>
          )}

          <div className="product-grid">
            {loading ? (
              [...Array(6)].map((_, i) => (
                <div key={i} className="product-card skeleton shadow-none">
                  <div className="product-img-wrap bg-gray-100 animate-pulse h-48 rounded-xl" />
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-gray-100 rounded animate-pulse w-3/4" />
                    <div className="h-3 bg-gray-100 rounded animate-pulse w-1/2" />
                  </div>
                </div>
              ))
            ) : filteredProducts.length > 0 ? (
              filteredProducts.map(product => (
                <ProductCard key={product._id} product={product} />
              ))
            ) : (
              <div className="col-span-full py-20 text-center">
                <p className="text-gray-400 font-bold text-lg">No products found match your criteria.</p>
                <button onClick={clearFilters} className="mt-4 text-[#4a7c23] underline font-bold">Clear All Filters</button>
              </div>
            )}
          </div>

        </section>
      </div>
    </main>
  );
}
