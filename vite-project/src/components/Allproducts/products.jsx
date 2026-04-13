import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './products.css';
import { fetchProducts } from '../../services/api';
import { useCart } from '../../context/CartContext';
const CATEGORIES = ['All', 'Atta', 'Millets', 'Rice', 'Honey']; // Local copy for UI filters

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
          { value: 'all', label: 'All' },
          { value: 'in-stock', label: 'In Stock' },
          { value: 'out-of-stock', label: 'Out of Stock' },
        ]}
        onChange={setAvailability}
      />

      <FilterDropdown
        label="Sort By"
        value={sortBy}
        options={[
          { value: 'default', label: 'Default' },
          { value: 'price-asc', label: 'Price: Low to High' },
          { value: 'price-desc', label: 'Price: High to Low' },
          { value: 'name-asc', label: 'Name: A to Z' },
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
      className={`product-card ${!product.inStock ? 'out-of-stock' : ''} flex flex-col justify-between cursor-pointer`}
      onClick={() => navigate(`/product/${product.id || product._id}`)}
    >
      <div>
        <div className="product-img-wrap relative overflow-hidden group">
          <img 
            src={product.img || product.imageUrl} 
            alt={product.name} 
            className="product-img main" 
            loading="lazy" 
          />
        </div>
        <div className="product-info px-4 pt-4 pb-2">
          <h3 className="product-name font-bold text-gray-900 border-b-none mb-1">{product.name}</h3>
          <p className="product-desc text-xs text-gray-500 line-clamp-2 min-h-[32px]">{product.description}</p>
          
          <div className="flex items-end justify-between mt-4">
             <div className="flex flex-col">
               <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{hasVariants ? 'Base Price' : 'Today\'s Price'}</span>
               <span className="font-black text-[#1a3d0c] text-xl leading-none">₹{product.price}</span>
             </div>
          </div>
        </div>
      </div>
      
      <div className="px-4 pb-4 mt-auto">
        <button
          className={`w-full py-3 rounded-xl font-bold transition-all shadow-sm flex items-center justify-center gap-2 ${adding ? 'bg-[#4a7c23] text-white' : 'bg-[#1a3d0c] hover:bg-[#2C7700] text-white hover:-translate-y-0.5 hover:shadow-md'} ${!product.inStock ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={handleAdd}
          disabled={!product.inStock || adding}
        >
          {adding ? (
            <>✓ <span className="text-sm">Added</span></>
          ) : (
            <><span className="text-lg leading-none">+</span> <span className="text-sm">Add to Cart</span></>
          )}
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
              { value: 'default', label: 'Default' },
              { value: 'price-asc', label: 'Price: Low' },
              { value: 'price-desc', label: 'Price: High' },
            ]}
            onChange={setSortBy}
          />
          <FilterDropdown
            label="Availability"
            value={availability}
            options={[
              { value: 'all', label: 'All' },
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
            sortBy={sortBy} setSortBy={setSortBy}
            category={category} setCategory={setCategory}
            onClear={clearFilters}
          />
        )}

        <section className="products-section">
          <div className="products-meta">
            {/* <span className="online-customers">Online Customers: {Math.floor(Math.random() * 20) + 10}</span> */}
            <span className="product-count">{filteredProducts.length} Products</span>
          </div>

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
