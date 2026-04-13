import React, { useEffect, useState } from 'react';
import api from '../../services/api';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchUsers = async () => {
    try {
      const data = await api.get('/admin/users');
      if (data.success) {
        setUsers(data.users);
      }
    } catch (err) {
      console.error('Failed to fetch users', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleStatusToggle = async (userId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'Active' ? 'Deactivated' : 'Active';
      const data = await api.put(`/admin/users/${userId}/status`, { status: newStatus });
      if (data.success) {
        setUsers(users.map(u => u._id === userId ? { ...u, status: newStatus } : u));
      }
    } catch (err) {
      alert('Failed to update user status');
    }
  };

  const handleDeleteUser = async (user) => {
    if (!window.confirm(`Are you sure you want to PERMANENTLY delete user "${user.name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const data = await api.delete(`/admin/users/${user._id}`);
      if (data.success) {
        setUsers(users.filter(u => u._id !== user._id));
      }
    } catch (err) {
      console.error('Failed to delete user', err);
      alert(err.message || 'Failed to delete user');
    }
  };

  const filteredUsers = users.filter(u => 
    u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="w-10 h-10 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">User Base</h1>
          <p className="text-gray-500 font-medium mt-1">Manage customer accounts and access levels</p>
        </div>
        
        <div className="relative w-full lg:w-96">
          <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          <input 
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-6 py-4 rounded-2xl bg-white border border-gray-100 shadow-sm outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 transition-all font-semibold"
          />
        </div>
      </div>
      
      <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 text-gray-400 font-black text-xs uppercase tracking-widest border-b border-gray-100">
                <th className="px-10 py-6">Customer Identity</th>
                <th className="px-10 py-6">Contact Details</th>
                <th className="px-10 py-6">Status & Access</th>
                <th className="px-10 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.map(user => (
                <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-10 py-7">
                    <div className="flex items-center gap-5">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm shadow-inner ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-emerald-50 text-emerald-700'}`}>
                        {user.name?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <div className="font-black text-gray-800 text-lg leading-tight">{user.name}</div>
                        <div className="text-xs text-gray-400 font-bold mt-1 uppercase tracking-widest leading-none">ID: #{String(user._id).slice(-8).toUpperCase()}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-7">
                    <div className="text-sm font-bold text-gray-700">{user.email}</div>
                    <div className="text-xs text-gray-400 font-medium mt-1 uppercase tracking-tighter">{user.mobile}</div>
                  </td>
                  <td className="px-10 py-7">
                    <div className="flex flex-col gap-2">
                      <span className={`w-fit px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${user.role === 'admin' ? 'bg-purple-50 text-purple-600 border border-purple-100' : 'bg-blue-50 text-blue-600 border border-blue-100'}`}>
                        {user.role}
                      </span>
                      <span className={`w-fit px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${user.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
                        {user.status || 'Active'}
                      </span>
                    </div>
                  </td>
                  <td className="px-10 py-7 text-right">
                    <div className="flex items-center justify-end gap-3">
                      {user.role !== 'admin' && (
                        <>
                          <button 
                             onClick={() => handleStatusToggle(user._id, user.status || 'Active')}
                             className={`text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl transition-all shadow-sm border ${
                               user.status === 'Active' 
                                 ? 'bg-white border-yellow-100 text-yellow-600 hover:bg-yellow-50' 
                                 : 'bg-emerald-600 border-transparent text-white hover:bg-emerald-700 shadow-md'
                             }`}
                           >
                             {user.status === 'Active' ? 'Deactivate' : 'Activate'}
                           </button>
                           
                           <button 
                             onClick={() => handleDeleteUser(user)}
                             className="text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl bg-white border border-red-100 text-red-600 hover:bg-red-50 transition-all shadow-sm"
                             title="Delete Permanently"
                           >
                             Delete
                           </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-10 py-32 text-center text-gray-400">
                    <div className="text-6xl mb-6 grayscale opacity-20">👥</div>
                    <div className="text-gray-400 font-black text-xl tracking-tight">No customers found</div>
                    <p className="text-gray-300 font-bold mt-2">Try searching for a different name or email</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;

