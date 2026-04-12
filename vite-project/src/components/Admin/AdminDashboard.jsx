import React, { useEffect, useState } from 'react';
import api, { adminFetchStats } from '../../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [basicStats, setBasicStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAllStats = async () => {
      try {
        setLoading(true);
        const [basic, advanced] = await Promise.all([
          api.get('/admin/dashboard'),
          adminFetchStats()
        ]);

        if (basic.success) {
          setBasicStats(basic.stats);
          setRecentOrders(basic.recentOrders || []);
        }
        if (advanced.success) setStats(advanced.stats);
      } catch (err) {
        console.error('Failed to load dashboard data', err);
      } finally {
        setLoading(false);
      }
    };
    loadAllStats();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
         <div className="w-12 h-12 border-4 border-emerald-50 border-t-emerald-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  const cards = [
    { 
      label: 'Gross Portfolio Revenue', 
      value: `₹${(stats?.totalRevenue || 0).toLocaleString('en-IN')}`, 
      growth: '+14.2%', 
      color: 'bg-emerald-600 text-white',
      secondary: 'Revenue across all channels'
    },
    { 
      label: 'Fulfilment Velocity', 
      value: stats?.totalOrders || 0, 
      growth: '+9.1%', 
      color: 'bg-white text-gray-900',
      secondary: 'Total orders processed'
    },
    { 
      label: 'Customer Ecosystem', 
      value: basicStats?.totalUsers || 0, 
      growth: '+4.8%', 
      color: 'bg-white text-gray-900',
      secondary: 'Verified active accounts'
    },
  ];

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* Executive Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-4 border-b border-gray-100">
        <div>
          <div className="flex items-center gap-3 mb-3">
             <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-widest rounded-full border border-emerald-100 italic">Enterprise Edition</span>
          </div>
          <h1 className="text-5xl font-black text-gray-900 tracking-tight leading-none mb-1">Portfolio Intelligence</h1>
          <p className="text-gray-400 font-bold text-lg">Comprehensive overview of Abhivriddhi’s growth metrics.</p>
        </div>
        
        <div className="flex items-center gap-5">
           <div className="text-right hidden sm:block">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Global Status</p>
              <p className="text-emerald-600 font-black">Systems Operational</p>
           </div>
           <div className="w-px h-10 bg-gray-100 hidden sm:block"></div>
           <div className="flex items-center gap-3 bg-white p-4 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="relative">
                <div className="w-3 h-3 bg-emerald-500 rounded-full animate-ping absolute inset-0"></div>
                <div className="w-3 h-3 bg-emerald-500 rounded-full relative"></div>
              </div>
              <span className="text-sm font-black text-gray-800 uppercase tracking-tighter">Realtime: <span className="text-emerald-600">8 Active Leads</span></span>
           </div>
        </div>
      </div>

      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {cards.map((card, i) => (
          <div key={i} className={`p-10 rounded-[48px] shadow-sm border border-gray-100 transition-all duration-500 group relative overflow-hidden ${card.color}`}>
            {i === 0 && <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>}
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div className="flex justify-between items-start mb-10">
                <p className={`text-[10px] font-black uppercase tracking-[0.2em] ${i === 0 ? 'text-emerald-100' : 'text-gray-400'}`}>{card.label}</p>
                <div className={`px-3 py-1 rounded-full text-[10px] font-black italic ${i === 0 ? 'bg-white/20 text-white' : 'bg-emerald-50 text-emerald-600'}`}>
                   {card.growth}
                </div>
              </div>
              <div>
                <h3 className="text-5xl font-black tracking-tighter mb-2 group-hover:scale-105 transition-transform origin-left duration-500">
                  {card.value}
                </h3>
                <p className={`text-xs font-bold leading-relaxed ${i === 0 ? 'text-emerald-200' : 'text-gray-400'}`}>
                  {card.secondary}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Category Performance */}
        <div className="lg:col-span-1 bg-white p-10 rounded-[48px] shadow-sm border border-gray-100 flex flex-col">
          <div className="mb-10">
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">Market Segments</h2>
            <p className="text-sm font-bold text-gray-400 mt-1 uppercase tracking-widest">Revenue Allocation</p>
          </div>
          <div className="space-y-8 flex-1">
            {stats?.categorySales?.map((cat, i) => (
              <div key={i} className="space-y-3 group">
                <div className="flex justify-between items-end">
                  <span className="text-sm font-black text-gray-800 uppercase tracking-tighter group-hover:text-emerald-600 transition-colors">{cat._id || 'Organic Bulk'}</span>
                  <span className="text-xs font-black text-gray-900 italic">₹{cat.revenue.toLocaleString()}</span>
                </div>
                <div className="h-2 w-full bg-gray-50 rounded-full overflow-hidden border border-gray-100 p-0.5">
                  <div 
                    className="h-full bg-emerald-600 rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(5,150,105,0.4)]"
                    style={{ width: `${Math.min(100, (cat.revenue / (stats.totalRevenue || 1)) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
            {!stats?.categorySales?.length && (
              <div className="flex flex-col items-center justify-center h-40 opacity-20">
                 <div className="text-4xl">📉</div>
                 <p className="text-xs font-bold uppercase mt-4">Awaiting Data Points</p>
              </div>
            )}
          </div>
        </div>

        {/* Global Sales Leaderboard */}
        <div className="lg:col-span-2 bg-white rounded-[48px] shadow-sm border border-gray-100 overflow-hidden flex flex-col border-emerald-600/10">
          <div className="px-10 py-8 border-b border-gray-100 flex items-center justify-between bg-emerald-50/20">
            <div>
               <h2 className="text-2xl font-black text-gray-900 tracking-tight">Portfolio Leaders</h2>
               <p className="text-[10px] font-black text-emerald-700 uppercase tracking-widest mt-1">High Velocity Inventory</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-emerald-100 flex items-center justify-center text-xl">🏆</div>
          </div>
          <div className="p-10 flex-1">
             {stats?.topProducts?.length > 0 ? (
               <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                 {stats.topProducts.map((product, idx) => (
                   <div key={idx} className="space-y-4 group">
                     <div className="flex justify-between items-end">
                       <p className="font-black text-gray-900 text-base tracking-tighter truncate mr-4 italic group-hover:text-emerald-600 transition-colors">"{product.name}"</p>
                       <div className="text-right flex-shrink-0">
                         <span className="text-[9px] font-black text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg mr-2 uppercase border border-emerald-100">
                           {product.salesCount} Velocity
                         </span>
                         <span className="text-sm font-black text-gray-900">₹{product.revenue?.toLocaleString()}</span>
                       </div>
                     </div>
                     <div className="h-1.5 w-full bg-gray-50 rounded-full overflow-hidden">
                       <div 
                         className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full transition-all duration-1000"
                         style={{ width: `${Math.min((product.salesCount / (stats.topProducts[0]?.salesCount || 1)) * 100, 100)}%` }}
                       />
                     </div>
                   </div>
                 ))}
               </div>
             ) : (
               <div className="h-full flex flex-col items-center justify-center text-center py-10 opacity-20">
                  <p className="text-6xl mb-4">🏆</p>
                  <p className="text-sm font-black tracking-[0.2em] uppercase">Leaderboard Pending</p>
               </div>
             )}
          </div>
        </div>

        {/* Sales Feed - Full Width */}
        <div className="lg:col-span-3 bg-[#0a0f0d] rounded-[52px] shadow-2xl overflow-hidden text-white mt-4 border border-white/5">
          <div className="px-12 py-10 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
            <div>
               <h2 className="text-3xl font-black tracking-tight mb-1 font-serif italic text-emerald-400">Merchant Ledger</h2>
               <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Real-time Transaction Authority</p>
            </div>
            <button className="px-8 py-3 bg-white/5 hover:bg-white/10 text-xs font-black uppercase tracking-widest rounded-2xl border border-white/10 transition-all">Export Protocol →</button>
          </div>
          <div className="p-0 overflow-x-auto">
            {recentOrders.length > 0 ? (
              <table className="w-full text-left">
                <thead>
                  <tr className="text-gray-600 font-black text-[10px] uppercase tracking-[0.2em] border-b border-white/5 bg-white/[0.01]">
                    <th className="px-12 py-6">Customer Signature</th>
                    <th className="px-12 py-6">Transaction ID</th>
                    <th className="px-12 py-6">Valuation</th>
                    <th className="px-12 py-6">Status Indicator</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {recentOrders.map(order => (
                    <tr key={order._id} className="hover:bg-white/[0.03] transition-all duration-300">
                      <td className="px-12 py-8">
                        <div className="flex items-center gap-5">
                           <div className="w-10 h-10 rounded-full bg-emerald-950 flex items-center justify-center font-black text-emerald-500 text-xs border border-emerald-800/30">
                              {order.shippingAddress?.fullName?.charAt(0) || 'U'}
                           </div>
                           <span className="font-black text-gray-200 text-lg tracking-tight">{order.shippingAddress?.fullName || 'Anonymous Identity'}</span>
                        </div>
                      </td>
                      <td className="px-12 py-8">
                        <span className="font-mono text-[10px] text-gray-500 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5 tracking-widest">
                          {String(order._id).toUpperCase()}
                        </span>
                      </td>
                      <td className="px-12 py-8 font-black text-emerald-400 text-xl tracking-tighter">
                        ₹{order.totalAmount?.toLocaleString()}
                      </td>
                      <td className="px-12 py-8">
                        <span className={`px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                          ['Delivered', 'Completed'].includes(order.orderStatus) ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                          ['Cancelled', 'Failed'].includes(order.orderStatus) ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                          'bg-amber-500/10 text-amber-500 border-amber-500/20'
                        }`}>
                          {order.orderStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="py-32 text-center flex flex-col items-center opacity-30">
                 <div className="text-7xl mb-6">🏦</div>
                 <p className="text-gray-400 font-black text-xl tracking-widest uppercase">Ledger Awaiting Entry</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

