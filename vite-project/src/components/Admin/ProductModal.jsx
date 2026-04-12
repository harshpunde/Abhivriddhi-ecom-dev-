import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const ProductModal = ({ product, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: 'Atta',
    description: '',
    imageUrl: '',
    inStock: true
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        price: product.price,
        category: product.category,
        description: product.description,
        imageUrl: product.imageUrl,
        inStock: product.inStock
      });
    }
  }, [product]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (product) {
        await api.put(`/admin/products/${product._id}`, formData);
      } else {
        await api.post('/admin/products', formData);
      }
      onSuccess();
    } catch (err) {
      setError(err.message || 'Operation failed. Please check your data.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-10 backdrop-blur-xl bg-black/40 animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-8 sm:p-12">
          <div className="flex justify-between items-start mb-10">
            <div>
              <h2 className="text-3xl font-black text-gray-900 tracking-tight">
                {product ? 'Edit Product' : 'Add New Item'}
              </h2>
              <p className="text-gray-500 font-medium mt-1">
                Enter the details for your organic product catalog
              </p>
            </div>
            <button 
              onClick={onClose}
              className="w-12 h-12 flex items-center justify-center rounded-2xl bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-gray-900 transition-all font-bold text-xl"
            >
              ✕
            </button>
          </div>

          {error && (
            <div className="bg-red-50 text-red-700 p-5 rounded-3xl mb-8 border-l-4 border-red-500 font-bold flex items-center gap-3">
              <span>⚠️</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="md:col-span-2">
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3 ml-2">Product Name</label>
              <input 
                type="text" 
                required
                placeholder="e.g. Organic Jowar Atta"
                className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-[#4a7c23] focus:bg-white outline-none transition-all font-semibold text-gray-800"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3 ml-2">Category</label>
              <select 
                className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-[#4a7c23] focus:bg-white outline-none transition-all font-semibold text-gray-800 appearance-none"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
              >
                <option value="Atta">Atta</option>
                <option value="Millets">Millets</option>
                <option value="Rice">Rice</option>
                <option value="Honey">Honey</option>
                <option value="Oils">Oils</option>
                <option value="Specials">Specials</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3 ml-2">Base Price (₹)</label>
              <input 
                type="number" 
                required
                placeholder="0.00"
                className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-[#4a7c23] focus:bg-white outline-none transition-all font-semibold text-gray-800"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3 ml-2">Image URL</label>
              <input 
                type="text" 
                required
                placeholder="https://example.com/image.jpg"
                className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-[#4a7c23] focus:bg-white outline-none transition-all font-semibold text-gray-800"
                value={formData.imageUrl}
                onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3 ml-2">Description</label>
              <textarea 
                rows="3"
                required
                placeholder="Product narrative and benefits..."
                className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-[#4a7c23] focus:bg-white outline-none transition-all font-semibold text-gray-800 resize-none"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </div>

            <div className="md:col-span-2 flex items-center gap-4 py-2">
              <input 
                type="checkbox" 
                id="inStock"
                className="w-6 h-6 rounded-lg text-[#4a7c23] focus:ring-[#4a7c23] border-gray-100 bg-gray-50"
                checked={formData.inStock}
                onChange={(e) => setFormData({...formData, inStock: e.target.checked})}
              />
              <label htmlFor="inStock" className="font-bold text-gray-700">Display as "In Stock" in public shop</label>
            </div>

            <div className="md:col-span-2 pt-6">
              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-[#1a3d0c] text-white py-5 rounded-[24px] font-black text-lg shadow-xl hover:shadow-2xl hover:bg-[#2C7700] hover:-translate-y-1 transition-all duration-300 disabled:opacity-70 disabled:transform-none"
              >
                {loading ? 'Saving Changes...' : product ? 'Update Product Details' : 'Create Product Entry'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
