import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import ProductModal from './ProductModal';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchProductsList = async () => {
    try {
      setLoading(true);
      const data = await api.get('/products');
      if (data.success) {
        setProducts(data.products);
      }
    } catch (err) {
      console.error('Failed to fetch products', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductsList();
  }, []);

  const handleToggleStock = async (product) => {
    try {
      const data = await api.put(`/admin/products/${product._id}`, { inStock: !product.inStock });
      if (data.success) {
        setProducts(products.map(p => p._id === product._id ? data.product : p));
      }
    } catch (err) {
      alert('Failed to update stock status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you certain you want to remove this product? This cannot be undone.')) return;
    try {
      const data = await api.delete(`/admin/products/${id}`);
      if (data.success) {
        setProducts(products.filter(p => p._id !== id));
      }
    } catch (err) {
      alert('Failed to delete product');
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Product Catalog</h1>
          <p className="text-gray-500 font-medium mt-1">Manage your inventory and pricing</p>
        </div>
        <button 
          onClick={() => { setCurrentProduct(null); setShowModal(true); }}
          className="bg-[#1a3d0c] text-white px-8 py-4 rounded-2xl font-black text-sm shadow-lg hover:shadow-2xl hover:bg-[#2C7700] hover:-translate-y-1 transition-all duration-300"
        >
          + Add New Product
        </button>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          <input 
            type="text"
            placeholder="Search by name or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-6 py-4 rounded-2xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-[#4a7c23]/20 font-semibold text-gray-700"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-40">
          <div className="w-12 h-12 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 text-gray-400 font-black text-[10px] uppercase tracking-[0.2em] border-b border-gray-100">
                  <th className="px-10 py-6">Product Information</th>
                  <th className="px-10 py-6">Classification</th>
                  <th className="px-10 py-6">Stock Level</th>
                  <th className="px-10 py-6">Valuation</th>
                  <th className="px-10 py-6 text-right">Control</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredProducts.map(product => (
                  <tr key={product._id || Math.random()} className="hover:bg-emerald-50/30 transition-all duration-300 group">
                    <td className="px-10 py-7">
                      <div className="flex items-center gap-6">
                        <div className="w-16 h-16 rounded-3xl overflow-hidden bg-gray-50 border border-gray-100 shadow-inner flex-shrink-0 group-hover:scale-105 transition-transform duration-500">
                          <img src={product.img || '/placeholder.png'} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div className="min-w-0">
                          <div className="font-black text-gray-900 text-lg leading-tight truncate">{product.name}</div>
                          <div className="text-[10px] text-emerald-600 font-black mt-2 uppercase tracking-[0.15em] bg-emerald-50 px-2.5 py-1 rounded-lg inline-block">
                            REF: {product._id ? product._id.slice(-8).toUpperCase() : 'NEW-ITEM'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-7">
                      <span className="px-4 py-1.5 rounded-xl text-[10px] font-black bg-gray-100 text-gray-500 border border-gray-200 uppercase tracking-widest group-hover:bg-emerald-600 group-hover:text-white group-hover:border-transparent transition-all">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-10 py-7">
                      <button 
                        onClick={() => handleToggleStock(product)}
                        className={`group/btn flex items-center gap-2.5 px-4 py-2 rounded-2xl text-[10px] font-black transition-all border ${
                          product.inStock 
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-100' 
                            : 'bg-red-50 text-red-700 border-red-100 hover:bg-red-100'
                        }`}
                      >
                        <div className={`w-2 h-2 rounded-full animate-pulse ${product.inStock ? 'bg-emerald-500' : 'bg-red-500'}`} />
                        {product.inStock ? 'DASHBOARD ACTIVE' : 'HIDDEN'}
                      </button>
                    </td>
                    <td className="px-10 py-7">
                      <div className="font-black text-gray-900 text-xl tracking-tighter">₹{product.price?.toLocaleString()}</div>
                      <div className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-1">Per Unit</div>
                    </td>
                    <td className="px-10 py-7 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0 transition-transform duration-300">
                        <button 
                          onClick={() => { setCurrentProduct(product); setShowModal(true); }}
                          className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-2xl transition-all border border-transparent hover:border-emerald-100"
                          title="Edit Portfolio"
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                        </button>
                        <button 
                          onClick={() => handleDelete(product._id)}
                          className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all border border-transparent hover:border-red-100"
                          title="Evict Product"
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredProducts.length === 0 && (
                  <tr>
                    <td colSpan="5" className="px-10 py-40 text-center">
                      <div className="text-7xl mb-6 grayscale opacity-20 filter drop-shadow-xl">📦</div>
                      <div className="text-gray-400 font-black text-2xl tracking-tight">No Inventory Matches</div>
                      <p className="text-gray-300 font-bold mt-2">Adjust your filters or add a fresh product to the vault.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showModal && (
        <ProductModal 
          product={currentProduct} 
          onClose={() => setShowModal(false)} 
          onSuccess={() => { setShowModal(false); fetchProductsList(); }} 
        />
      )}
    </div>
  );
};

export default AdminProducts;
