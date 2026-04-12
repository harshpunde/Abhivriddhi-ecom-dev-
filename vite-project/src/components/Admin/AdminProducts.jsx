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
      const data = await api.put(`/admin/products/${product._id || product.id}`, { inStock: !product.inStock });
      if (data.success) {
        setProducts(products.map(p => (p._id === product._id || p.id === product.id) ? data.product : p));
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
        setProducts(products.filter(p => p._id !== id && p.id !== id));
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
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 font-sans text-slate-900 bg-slate-50 min-h-screen">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Products</h1>
          <p className="text-sm text-slate-500 mt-1">Manage inventory, pricing, and availability.</p>
        </div>
        <button 
          onClick={() => { setCurrentProduct(null); setShowModal(true); }}
          className="px-4 py-2 bg-slate-900 text-white font-medium text-sm rounded-lg shadow-sm hover:bg-slate-800 transition-colors inline-flex items-center gap-2"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          Add Product
        </button>
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
        
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-200">
           <div className="relative max-w-md">
             <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
             </span>
             <input 
               type="text"
               placeholder="Search by name or category..."
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="w-full pl-10 pr-4 py-2 rounded-lg bg-slate-50 border border-slate-300 text-sm outline-none focus:border-slate-400 focus:bg-white transition-colors"
             />
           </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {loading ? (
             <div className="flex items-center justify-center p-20">
                <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
             </div>
          ) : (
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 font-medium">Product</th>
                  <th className="px-6 py-3 font-medium">Category</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium">Pricing / Variants</th>
                  <th className="px-6 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProducts.map(product => (
                  <tr key={product._id || product.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 flex-shrink-0">
                          {/* Use proxy URL reliably. Default placeholder on broken image */}
                          <img 
                            src={product.imageUrl ? (product.imageUrl.startsWith('http') ? product.imageUrl : `${product.imageUrl}`) : '/placeholder.png'} 
                            alt="" 
                            className="w-full h-full object-cover" 
                            onError={(e) => { e.target.src = '/placeholder.png'; }}
                          />
                        </div>
                        <div>
                          <div className="font-medium text-slate-900">{product.name}</div>
                          <div className="text-xs text-slate-500 mt-0.5 max-w-[200px] truncate">{product.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-700">
                      <span className="bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-md text-xs font-medium">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => handleToggleStock(product)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-colors border ${
                          product.inStock 
                            ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100' 
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <div className={`w-1.5 h-1.5 rounded-full ${product.inStock ? 'bg-green-500' : 'bg-slate-400'}`} />
                        {product.inStock ? 'Active' : 'Draft'}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900">₹{product.price}</div>
                      {(() => {
                        let w = product.weights;
                        if (typeof w === 'string') {
                          try { w = JSON.parse(w); } catch(e) { w = []; }
                        }
                        return w?.length > 0 ? (
                          <div className="text-xs text-slate-500 mt-1">
                            {w.length} Variants Configured
                          </div>
                        ) : null;
                      })()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => { setCurrentProduct(product); setShowModal(true); }}
                          className="p-1.5 text-slate-500 hover:text-slate-900 bg-white border border-slate-200 hover:bg-slate-50 rounded-md transition-colors"
                          title="Edit Product"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                        </button>
                        <button 
                          onClick={() => handleDelete(product._id || product.id)}
                          className="p-1.5 text-slate-500 hover:text-red-700 bg-white border border-slate-200 hover:bg-red-50 hover:border-red-200 rounded-md transition-colors"
                          title="Delete Product"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredProducts.length === 0 && (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-slate-500 text-sm">
                       No products found matching your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

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
