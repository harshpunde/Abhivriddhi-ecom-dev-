import { useRef, useState, useCallback } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useCart } from "../../context/CartContext"
import { PRODUCTS_DATA } from "../../data/products"

export function ProductsSection() {
  const scrollRef = useRef(null)
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const [addedId, setAddedId] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const dragStart = useRef({ x: 0, scrollLeft: 0 })
  const isMouseDown = useRef(false)        // ← only true when mouse held on track

  /* ── Arrow scroll ── */
  const scroll = (dir) => {
    if (!scrollRef.current) return
    scrollRef.current.scrollBy({ left: dir * 300, behavior: "smooth" })
  }

  /* ── Mouse drag scroll ── */
  const onMouseDown = (e) => {
    isMouseDown.current = true
    dragStart.current = { x: e.pageX, scrollLeft: scrollRef.current.scrollLeft }
  }
  const onMouseMove = useCallback((e) => {
    if (!isMouseDown.current) return       // ← only drag when button is held
    const dx = e.pageX - dragStart.current.x
    if (Math.abs(dx) < 5) return
    setIsDragging(true)
    e.preventDefault()
    scrollRef.current.scrollLeft = dragStart.current.scrollLeft - dx
  }, [])
  const onMouseUp = () => {
    isMouseDown.current = false
    setIsDragging(false)
  }

  /* ── Add to cart with feedback ── */
  const handleAdd = (product) => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    addToCart({ id: product.id, name: product.name, price: product.price, img: product.img })
    setAddedId(product.id)
    setTimeout(() => setAddedId(null), 1200)
  }

  return (
    <section style={styles.section}>
      <div style={styles.container}>
        {/* Header — title only */}
        <div style={styles.header}>
          <div>
            <p style={styles.eyebrow}>Farm to Table</p>
            <h2 style={styles.heading}>Our Products</h2>
          </div>
        </div>

        {/* Scroll Track with side arrows */}
        <div style={styles.trackWrapper}>
          {/* Left Arrow */}
          <button style={{ ...styles.sideArrow, left: "8px" }} onClick={() => scroll(-1)} aria-label="Scroll left">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
          </button>

          <div
            ref={scrollRef}
            style={{ ...styles.track, cursor: isDragging ? "grabbing" : "grab" }}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseUp}
          >
            {PRODUCTS_DATA.map((product, i) => (
              <div key={product.id} style={{ ...styles.card, animationDelay: `${i * 60}ms` }} className="product-scroll-card">
                {/* Badge */}
                {!product.inStock && <span style={styles.badge}>Out of Stock</span>}
                {product.inStock && i < 3 && <span style={{ ...styles.badge, background: "linear-gradient(135deg,#f59e0b,#d97706)" }}>Bestseller</span>}

              {/* Image */}
              <div style={styles.imgWrap}>
                <img
                  src={product.img}
                  alt={product.name}
                  style={styles.img}
                  draggable={false}
                />
              </div>

              {/* Info */}
              <div style={styles.cardBody}>
                <span style={styles.category}>{product.category}</span>
                <h3 style={styles.name}>{product.name}</h3>
                <p style={styles.desc}>{product.description}</p>
                <div style={styles.footer}>
                  <span style={styles.price}>₹{product.price}</span>
                  <button
                    style={{
                      ...styles.addBtn,
                      ...(addedId === product.id ? styles.addedBtn : {}),
                      ...(product.inStock ? {} : styles.disabledBtn),
                    }}
                    onMouseDown={(e) => e.stopPropagation()}  // ← don't start drag on button click
                    onClick={() => product.inStock && handleAdd(product)}
                    disabled={!product.inStock}
                  >
                    {addedId === product.id ? "✓ Added" : product.inStock ? "Add to Cart" : "Sold Out"}
                  </button>
                </div>
              </div>
            </div>
          ))}
          </div>

          {/* Right Arrow */}
          <button style={{ ...styles.sideArrow, right: "8px" }} onClick={() => scroll(1)} aria-label="Scroll right">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </div>

        {/* View All — below, centered */}
        <div style={styles.viewAllWrap}>
          <Link to="/products" style={styles.viewAllBtn}>
            View All Products →
          </Link>
        </div>
      </div>

      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .product-scroll-card {
          animation: fadeSlideIn 0.45s ease both;
        }
        .product-scroll-card:hover {
          transform: translateY(-6px) !important;
          box-shadow: 0 20px 48px rgba(74,124,35,0.18) !important;
        }
        .product-scroll-card:hover img {
          transform: scale(1.07);
        }
      `}</style>
    </section>
  )
}

/* ── Inline styles ── */
const styles = {
  section: {
    padding: "56px 0 64px",
    background: "linear-gradient(180deg,#f0f7e8 0%,#fafff4 100%)",
    overflow: "hidden",
  },
  container: {
    maxWidth: "1100px",
    margin: "0 auto",
    overflow: "hidden",
  },
  header: {
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "flex-start",
    padding: "0 24px 24px",
  },
  eyebrow: {
    fontSize: "13px",
    fontWeight: 600,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: "#4a7c23",
    marginBottom: "6px",
  },
  heading: {
    fontSize: "clamp(26px,4vw,38px)",
    fontWeight: 800,
    color: "#1a3d0c",
    margin: 0,
    lineHeight: 1.15,
  },
  sideArrow: {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    zIndex: 10,
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    border: "none",
    background: "rgba(255,255,255,0.95)",
    boxShadow: "0 2px 12px rgba(0,0,0,0.15)",
    color: "#4a7c23",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  trackWrapper: {
    position: "relative",
  },
  viewAllWrap: {
    display: "flex",
    justifyContent: "center",
    paddingTop: "28px",
  },
  viewAllBtn: {
    display: "inline-flex",
    alignItems: "center",
    padding: "12px 28px",
    borderRadius: "999px",
    background: "#4a7c23",
    color: "#fff",
    fontSize: "15px",
    fontWeight: 600,
    textDecoration: "none",
    transition: "background 0.2s",
    letterSpacing: "0.02em",
  },
  track: {
    display: "flex",
    gap: "16px",
    overflowX: "auto",
    scrollSnapType: "x mandatory",
    scrollbarWidth: "none",
    msOverflowStyle: "none",
    padding: "12px 24px 24px",
    userSelect: "none",
  },
  card: {
    flexShrink: 0,
    width: "200px",
    background: "#fff",
    borderRadius: "16px",
    overflow: "hidden",
    boxShadow: "0 4px 16px rgba(0,0,0,0.07)",
    scrollSnapAlign: "start",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: "12px",
    left: "12px",
    zIndex: 2,
    background: "linear-gradient(135deg,#4a7c23,#2d5a14)",
    color: "#fff",
    fontSize: "10px",
    fontWeight: 700,
    padding: "3px 10px",
    borderRadius: "999px",
    letterSpacing: "0.04em",
    textTransform: "uppercase",
  },
  imgWrap: {
    width: "100%",
    aspectRatio: "1/1",
    overflow: "hidden",
    background: "#f0f7e8",
  },
  img: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transition: "transform 0.4s ease",
  },
  cardBody: {
    padding: "16px",
  },
  category: {
    fontSize: "10px",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    color: "#4a7c23",
    opacity: 0.8,
  },
  name: {
    fontSize: "16px",
    fontWeight: 700,
    color: "#1a3d0c",
    margin: "4px 0 6px",
  },
  desc: {
    fontSize: "12px",
    color: "#6b7280",
    lineHeight: 1.5,
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
    marginBottom: "14px",
  },
  footer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "8px",
  },
  price: {
    fontSize: "18px",
    fontWeight: 800,
    color: "#1a3d0c",
  },
  addBtn: {
    padding: "8px 14px",
    borderRadius: "999px",
    border: "none",
    background: "linear-gradient(135deg,#4a7c23,#3d6a1c)",
    color: "#fff",
    fontSize: "12px",
    fontWeight: 700,
    cursor: "pointer",
    transition: "all 0.25s ease",
    whiteSpace: "nowrap",
  },
  addedBtn: {
    background: "linear-gradient(135deg,#16a34a,#15803d)",
    transform: "scale(0.96)",
  },
  disabledBtn: {
    background: "#d1d5db",
    color: "#9ca3af",
    cursor: "not-allowed",
  },
}
