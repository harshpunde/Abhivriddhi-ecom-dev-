import React, { useEffect, useState, useCallback, useRef } from 'react';
import { 
  TrendingUp, 
  Users, 
  Package, 
  ShoppingBag, 
  MessageSquare, 
  RefreshCcw, 
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  QrCode
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
} from 'recharts';
import api, { adminFetchStats, getWhatsAppStatus, relinkWhatsApp } from '../../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [basicStats, setBasicStats] = useState(null);
  const [waStatus, setWaStatus] = useState({ status: 'Disconnected', qr: null });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const pollingRef = useRef(null);
  const statsRef = useRef(null);

  const fetchDashboardData = useCallback(async (isSilent = false) => {
    try {
      if (!isSilent) setLoading(true);
      else setRefreshing(true);

      const [basic, advanced, wa] = await Promise.all([
        api.get('/admin/dashboard'),
        adminFetchStats(),
        getWhatsAppStatus().catch(() => ({ status: 'Disconnected', qr: null }))
      ]);

      if (basic.success) {
        setBasicStats(basic.stats);
        setRecentOrders(basic.recentOrders || []);
        setError(null);
      }
      if (advanced.success) {
        setStats(advanced.stats);
      }
      setWaStatus(wa);
    } catch (err) {
      console.error('Failed to load dashboard data', err);
      setError('Connection Error: Metrics might be outdated.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  const handleRelink = async () => {
    if (!window.confirm('Disconnect current WhatsApp and show new QR?')) return;
    try {
      setRefreshing(true);
      const res = await relinkWhatsApp();
      if (res.success) {
        setTimeout(() => fetchDashboardData(true), 1000);
      }
    } catch (err) {
      alert('Relink failed');
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    
    // High-frequency polling for "Real-time" feel
    pollingRef.current = setInterval(() => {
      fetchDashboardData(true); 
    }, 10000); // 10 seconds

    return () => clearInterval(pollingRef.current);
  }, [fetchDashboardData]);

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-slate-100 border-t-slate-900 rounded-full animate-spin"></div>
          <p className="text-slate-500 font-bold animate-pulse">Initializing Command Center...</p>
        </div>
      </div>
    );
  }

  const mainMetrics = [
    { label: 'Total Revenue', value: `₹${(stats?.totalRevenue || 0).toLocaleString('en-IN')}`, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Total Orders', value: stats?.totalOrders || 0, icon: ShoppingBag, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Total Customers', value: basicStats?.totalUsers || 0, icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Total Products', value: basicStats?.totalProducts || 0, icon: Package, color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  // Prepare chart data
  const chartData = (stats?.dailyRevenue || []).map(item => ({
    name: new Date(item._id).toLocaleDateString('en-US', { weekday: 'short' }),
    revenue: item.revenue
  }));

  // Fallback data if no sales yet
  const displayData = chartData.length > 0 ? chartData : [
    { name: 'Mon', revenue: 0 }, { name: 'Tue', revenue: 0 }, { name: 'Wed', revenue: 0 },
    { name: 'Thu', revenue: 0 }, { name: 'Fri', revenue: 0 }, { name: 'Sat', revenue: 0 }, { name: 'Sun', revenue: 0 }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
               Command Center
               {refreshing && <RefreshCcw size={20} className="animate-spin text-slate-300" />}
            </h1>
            <div className="flex items-center gap-1.5 px-2 py-1 bg-emerald-50 text-emerald-600 rounded-lg border border-emerald-100 animate-in fade-in zoom-in duration-500">
               <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
               <span className="text-[10px] font-black uppercase tracking-widest">Live Sync</span>
            </div>
          </div>
          <p className="text-slate-500 font-medium mt-1">Real-time performance metrics and system status.</p>
        </div>
        <button 
            onClick={() => fetchDashboardData(true)}
            className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 font-bold text-sm rounded-xl shadow-sm hover:bg-slate-50 transition-all flex items-center gap-2"
          >
            <RefreshCcw size={16} className={refreshing ? 'animate-spin' : ''} />
            Refresh Analytics
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 p-4 rounded-2xl flex items-center gap-3 text-red-600 animate-in slide-in-from-top duration-500">
           <AlertCircle size={20} />
           <p className="text-sm font-bold">{error}</p>
        </div>
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {mainMetrics.map((m, i) => {
          const Icon = m.icon;
          return (
            <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow group">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${m.bg} ${m.color}`}>
                  <Icon size={24} />
                </div>
                <ChevronRight size={16} className="text-slate-200 group-hover:text-slate-400 transition-colors" />
              </div>
              <div className="space-y-1">
                 <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{m.label}</p>
                 <h3 className="text-2xl font-black text-slate-900 leading-none">{m.value}</h3>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sales Chart Area */}
        <div className="lg:col-span-2 bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm space-y-6">
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">Revenue Trends</h2>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Last 7 Days (₹) </p>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={displayData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 700}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 700}} tickFormatter={(val) => `₹${val}`} />
                  <Tooltip contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 800}} itemStyle={{color: '#059669'}} />
                  <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={4} fillOpacity={1} fill="url(#colorRevenue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
        </div>

        {/* WhatsApp Connectivity Widget */}
        <div className="bg-slate-900 rounded-[32px] p-6 text-white overflow-hidden relative flex flex-col justify-between">
           <div className="relative z-10 space-y-6">
              <div className="flex items-center justify-between">
                 <div className="p-3 bg-white/10 rounded-2xl">
                    <MessageSquare size={24} />
                 </div>
                 <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1 ${
                   waStatus?.status === 'Ready' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 
                   waStatus?.status === 'Initializing' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                   'bg-red-500/20 text-red-400 border border-red-500/30'
                 }`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${waStatus?.status === 'Ready' ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'}`}></div>
                    {waStatus?.status}
                 </div>
              </div>

              <div>
                 <h2 className="text-2xl font-black tracking-tight leading-tight">WhatsApp Connectivity</h2>
                 <p className="text-slate-400 text-sm font-medium mt-1">
                   {waStatus?.status === 'Ready' 
                     ? 'System is currently broadcasting OTPs and orders via WhatsApp.' 
                     : 'Disconnected. Scan the QR code below to enable automated messaging.'}
                 </p>
              </div>

              {waStatus?.status !== 'Ready' && waStatus?.qr ? (
                <div className="bg-white p-3 rounded-2xl w-fit mx-auto shadow-2xl animate-in zoom-in-95 duration-500">
                   <img src={waStatus.qr} alt="QR Code" className="w-40 h-40" />
                   <div className="mt-2 text-center text-slate-900 text-[10px] font-black uppercase tracking-tighter">
                      Scan with WhatsApp
                   </div>
                </div>
              ) : waStatus?.status === 'Ready' ? (
                <div className="py-8 flex flex-col items-center justify-center text-emerald-400 gap-3">
                   <div className="relative">
                     <CheckCircle2 size={48} />
                     <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-slate-900 rounded-full"></div>
                   </div>
                   <div className="text-center">
                     <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Master Node Linked</p>
                     <p className="text-sm font-bold text-white mt-1">+{waStatus?.linkedNumber || 'Active Device'}</p>
                   </div>
                   <button 
                     onClick={handleRelink}
                     className="mt-2 text-[10px] font-black text-white/40 uppercase tracking-widest hover:text-white transition-colors underline underline-offset-4"
                   >
                     Relink Different Account
                   </button>
                </div>
              ) : (
                <div className="py-8 flex flex-col items-center justify-center text-slate-600 animate-pulse font-bold text-sm">
                   <QrCode size={48} className="mb-2" />
                   Generating QR...
                </div>
              )}
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Top Products */}
          <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
             <div className="p-6 border-b border-slate-50"><h2 className="text-lg font-black text-slate-900 tracking-tight">Best Sellers</h2></div>
             <div className="p-6 space-y-4">
                {stats?.topProducts?.length > 0 ? (
                  stats.topProducts.map((p, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                           <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center font-black text-slate-400 text-xs">0{idx + 1}</div>
                           <p className="font-black text-slate-800 text-sm leading-tight">{p.name}</p>
                        </div>
                        <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">{p.salesCount} sold</span>
                    </div>
                  ))
                ) : <p className="text-center text-slate-300 font-bold italic">No data</p>}
             </div>
          </div>

          {/* Recent Orders */}
          <div className="lg:col-span-2 bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
             <div className="p-6 border-b border-slate-50 flex items-center justify-between">
                <h2 className="text-lg font-black text-slate-900 tracking-tight">Recent Orders</h2>
                <button onClick={() => window.location.href='/admin/orders'} className="text-xs font-black text-blue-600 uppercase tracking-widest hover:text-blue-700">View All</button>
             </div>
             <div className="overflow-x-auto">
                <table className="w-full text-left">
                   <thead className="bg-slate-50/50 text-[10px] uppercase font-black tracking-widest text-slate-400 border-b border-slate-50">
                      <tr><th className="px-6 py-4">Transaction</th><th className="px-6 py-4">Status</th><th className="px-6 py-4 text-right">Volume</th></tr>
                   </thead>
                   <tbody className="divide-y divide-slate-50">
                      {recentOrders.map(order => (
                        <tr key={order._id} className="hover:bg-slate-50/50 transition-colors">
                           <td className="px-6 py-4">
                              <p className="font-black text-slate-800 text-sm">#{(order._id || '').slice(-6).toUpperCase()}</p>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{order.shippingAddress?.fullName || 'Guest'}</p>
                           </td>
                           <td className="px-6 py-4">
                             <div className={`w-fit px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${['Delivered', 'Completed', 'Captured'].includes(order.orderStatus) ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                                {order.orderStatus}
                             </div>
                           </td>
                           <td className="px-6 py-4 text-right font-black text-slate-900 text-sm">₹{order.totalAmount?.toLocaleString()}</td>
                        </tr>
                      ))}
                   </tbody>
                </table>
             </div>
          </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
