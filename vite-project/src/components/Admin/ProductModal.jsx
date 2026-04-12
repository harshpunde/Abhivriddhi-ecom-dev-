import React, { useState, useEffect, useRef } from 'react';
import api from '../../services/api';

const ProductModal = ({ product, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: 'Atta',
    description: '',
    inStock: true
  });
  
  const [weights, setWeights] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        category: product.category || 'Atta',
        description: product.description || '',
        inStock: product.inStock !== undefined ? product.inStock : true
      });
      // Parse weights if returned as JSON string from backend
      let w = product.weights || [];
      if (typeof w === 'string') {
        try { w = JSON.parse(w); } catch(e) { w = []; }
      }
      setWeights(Array.isArray(w) ? w : []);
      setImagePreview(product.imageUrl || '');
    }
  }, [product]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const addWeightVariant = () => {
    setWeights([...weights, { label: '', price: '', isAvailable: true }]);
  };

  const removeWeightVariant = (index) => {
    setWeights(weights.filter((_, i) => i !== index));
  };

  const updateWeightVariant = (index, field, value) => {
    const newWeights = [...weights];
    newWeights[index][field] = value;
    setWeights(newWeights);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Derive price from the first weight variant (lowest price = default)
      const derivedPrice = weights.length > 0 ? Number(weights[0].price) || 0 : 0;

      const data = new FormData();
      data.append('name', formData.name);
      data.append('category', formData.category);
      data.append('description', formData.description);
      data.append('price', derivedPrice);
      data.append('inStock', formData.inStock);
      data.append('weights', JSON.stringify(weights));
      
      if (imageFile) {
        data.append('image', imageFile);
      } else if (product?.imageUrl && !product.imageUrl.startsWith('data:')) {
        data.append('imageUrl', product.imageUrl); 
      }

      if (product) {
        await api.put(`/admin/products/${product._id || product.id}`, data);
      } else {
        if (!imageFile && !product?.imageUrl) throw new Error('Product image is required.');
        await api.post('/admin/products', data);
      }
      
      onSuccess();
    } catch (err) {
      setError(err.message || 'Failed to save product. Ensure all required fields are valid.');
    } finally {
      setLoading(false);
    }
  };

  // Prevent background scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'auto'; };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200 font-sans">
      <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              {product ? 'Edit Product' : 'Add Product'}
            </h2>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-md transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          {error && (
            <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm mb-6 border border-red-100 flex items-center gap-2 font-medium">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Left Column */}
            <div className="space-y-6">
              
              {/* Image Upload Area */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Product Image</label>
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="aspect-square w-full sm:aspect-video md:aspect-square bg-slate-50 border-2 border-dashed border-slate-300 rounded-xl overflow-hidden cursor-pointer hover:border-slate-400 hover:bg-slate-100 transition-colors relative flex justify-center items-center group"
                >
                  {imagePreview ? (
                    <>
                      <img 
                        src={imagePreview.startsWith('data:') || imagePreview.startsWith('http') ? imagePreview : `${imagePreview}`} 
                        alt="Preview" 
                        className="w-full h-full object-cover" 
                        onError={(e) => { e.target.src = '/placeholder.png'; }}
                      />
                      <div className="absolute inset-0 bg-slate-900/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                         <span className="text-white text-sm font-medium">Change Image</span>
                      </div>
                    </>
                  ) : (
                    <div className="text-center p-6 flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full bg-white shadow-sm border border-slate-200 flex items-center justify-center mb-3 text-slate-400 group-hover:text-slate-600 transition-colors">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                      </div>
                      <span className="text-sm font-medium text-slate-600">Click to upload</span>
                      <span className="text-xs text-slate-500 mt-1">PNG, JPG up to 5MB</span>
                    </div>
                  )}
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Product Title <span className="text-red-500">*</span></label>
                <input 
                  type="text" required value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm outline-none focus:border-slate-500 transition-colors shadow-sm"
                  placeholder="e.g., Organic Jowar Atta"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Category <span className="text-red-500">*</span></label>
                <select 
                  value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm outline-none focus:border-slate-500 transition-colors shadow-sm"
                >
                  {['Atta', 'Millets', 'Rice', 'Honey', 'Oils', 'Specials'].map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

            </div>

            {/* Right Column */}
            <div className="space-y-6">
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description & Benefits <span className="text-red-500">*</span></label>
                <textarea 
                  rows="4" required value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm outline-none focus:border-slate-500 transition-colors shadow-sm resize-y"
                  placeholder="Describe the product and its organic benefits..."
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-200">
                   <label className="block text-sm font-medium text-slate-700">Weight Variants</label>
                   <button 
                     type="button" onClick={addWeightVariant}
                     className="text-xs font-medium text-blue-600 hover:text-blue-700 bg-blue-50 px-2 py-1 rounded"
                   >
                     + Add Variant
                   </button>
                </div>
                
                <div className="space-y-3 max-h-[200px] overflow-y-auto">
                  {weights.length === 0 ? (
                    <div className="py-6 text-center border border-dashed border-slate-300 rounded-lg bg-slate-50">
                       <p className="text-xs text-slate-500">Add at least one weight variant (e.g. 500gm, 1Kg) with its price.</p>
                    </div>
                  ) : (
                    weights.map((w, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <input 
                          type="text" placeholder="Size (e.g. 500gm)" value={w.label} required
                          onChange={(e) => updateWeightVariant(idx, 'label', e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm outline-none focus:border-slate-500 shadow-sm"
                        />
                        <input 
                          type="number" placeholder="Price (₹)" value={w.price} required
                          onChange={(e) => updateWeightVariant(idx, 'price', e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm outline-none focus:border-slate-500 shadow-sm"
                        />
                        <button 
                          type="button" onClick={() => removeWeightVariant(idx)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-slate-100 rounded-md transition-colors"
                        >
                           <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg flex items-center justify-between cursor-pointer" onClick={() => setFormData({...formData, inStock: !formData.inStock})}>
                 <div>
                    <div className="text-sm font-medium text-slate-900">Product Status</div>
                    <div className="text-xs text-slate-500 mt-0.5">{formData.inStock ? 'Active - Visible in store' : 'Draft - Hidden from customers'}</div>
                 </div>
                 <div className={`relative w-11 h-6 rounded-full transition-colors ${formData.inStock ? 'bg-green-600' : 'bg-slate-300'}`}>
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${formData.inStock ? 'translate-x-6' : 'translate-x-1'}`}></div>
                 </div>
              </div>

            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-white border border-slate-300 text-slate-700 font-medium text-sm rounded-lg shadow-sm hover:bg-slate-50 transition-colors">
             Cancel
          </button>
          <button 
            onClick={handleSubmit} disabled={loading}
            className="px-6 py-2 bg-slate-900 text-white font-medium text-sm rounded-lg shadow-sm hover:bg-slate-800 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading && <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg>}
            {product ? 'Save Changes' : 'Create Product'}
          </button>
        </div>

      </div>
    </div>
  );
};

export default ProductModal;
