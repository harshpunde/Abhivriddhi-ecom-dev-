import React, { useEffect, useState } from 'react';
import { 
  UserPlus, 
  Trash2, 
  Mail, 
  Phone, 
  ShieldCheck, 
  X,
  Plus
} from 'lucide-react';
import { fetchSubAdmins, createSubAdmin, deleteSubAdmin } from '../../services/api';

const AdminSubAdmins = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    password: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const loadAdmins = async () => {
    try {
      setLoading(true);
      const data = await fetchSubAdmins();
      if (data.success) {
        setAdmins(data.admins);
      }
    } catch (err) {
      console.error('Failed to load sub-admins', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdmins();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    
    try {
      // Ensure mobile has +91 prefix if not present
      let mobile = formData.mobile;
      if (!mobile.startsWith('+91')) {
        mobile = `+91${mobile.replace(/\D/g, '')}`;
      }

      const data = await createSubAdmin({ ...formData, mobile });
      if (data.success) {
        alert(data.message || 'Access granted successfully');
        setShowModal(false);
        setFormData({ name: '', email: '', mobile: '', password: '' });
        loadAdmins();
      }
    } catch (err) {
      setError(err.message || 'Failed to create sub-admin');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this administrator? They will lose all access immediately.')) return;
    
    try {
      const data = await deleteSubAdmin(id);
      if (data.success) {
        setAdmins(admins.filter(a => a._id !== id));
      }
    } catch (err) {
      alert('Failed to remove sub-admin');
    }
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="w-10 h-10 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Team Management</h1>
          <p className="text-slate-500 font-medium mt-1">Manage administrative access and sub-admin roles.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="px-6 py-3 bg-slate-900 text-white font-black text-sm rounded-2xl shadow-lg hover:bg-slate-800 transition-all flex items-center gap-2"
        >
          <Plus size={18} />
          Add New Admin
        </button>
      </div>

      {/* Admin Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {admins.map((admin) => (
          <div key={admin._id} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-md transition-all group relative">
             <button 
               onClick={() => handleDelete(admin._id)}
               className="absolute top-4 right-4 p-2 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
             >
                <Trash2 size={18} />
             </button>

             <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-xl shadow-inner">
                   {admin.name?.charAt(0) || 'A'}
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-lg leading-tight">{admin.name}</h3>
                  <div className="flex items-center gap-1.5 mt-1">
                     <ShieldCheck size={14} className="text-emerald-500" />
                     <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Full Access Admin</span>
                  </div>
                </div>
             </div>

             <div className="space-y-3">
                <div className="flex items-center gap-3 text-slate-500">
                   <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                      <Mail size={14} />
                   </div>
                   <span className="text-sm font-bold truncate">{admin.email}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-500">
                   <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                      <Phone size={14} />
                   </div>
                   <span className="text-sm font-bold">{admin.mobile}</span>
                </div>
             </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-md rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
             <div className="bg-slate-50 px-8 py-6 border-b border-slate-100 flex items-center justify-between">
                <h2 className="text-xl font-black text-slate-900">Add Team Member</h2>
                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400"><X size={20}/></button>
             </div>
             
             <form onSubmit={handleCreate} className="p-8 space-y-6">
                {error && <div className="p-4 bg-red-50 text-red-600 text-xs font-bold rounded-2xl border border-red-100">{error}</div>}
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2 px-1">Full Name</label>
                    <input 
                      type="text" required value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-slate-900 transition-all"
                      placeholder="e.g. John Doe"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2 px-1">Email Address</label>
                    <input 
                      type="email" required value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-slate-900 transition-all"
                      placeholder="admin@abhivriddhi.com"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2 px-1">Mobile (+91...)</label>
                    <input 
                      type="text" required value={formData.mobile}
                      onChange={(e) => setFormData({...formData, mobile: e.target.value})}
                      className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-slate-900 transition-all"
                      placeholder="+919999999999"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2 px-1">Access Password</label>
                    <input 
                      type="password" value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-slate-900 transition-all"
                      placeholder="Required for new accounts only"
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <button 
                    disabled={submitting}
                    className="w-full py-4 bg-slate-900 text-white font-black text-sm rounded-2xl shadow-lg hover:bg-slate-800 transition-all disabled:opacity-50"
                  >
                    {submitting ? 'Creating Access...' : 'Finalize Access'}
                  </button>
                </div>
             </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminSubAdmins;
