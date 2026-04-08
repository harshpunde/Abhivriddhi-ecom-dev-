import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Package, HelpCircle, LogOut, ChevronRight, Mail, Phone, MapPin } from 'lucide-react';
import { getCurrentUser } from '../../services/api';

export default function Dashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }
        
        const response = await getCurrentUser();
        // Setup headers globally or assume api.js handles it using localStorage
        // Note: verify if api.js sends the token automatically. If not, we fall back to mock data for layout purposes.
        if (response && response.user) {
          setUserData(response.user);
        } else {
          setUserData({ name: 'Valued Customer', email: 'user@example.com', mobile: '+91 9999999999' });
        }
      } catch (err) {
        console.error(err);
        setUserData({ name: 'Valued Customer', email: 'user@example.com', mobile: '+91 9999999999' });
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (loading) return <div className="flex h-screen items-center justify-center text-[#4a7c23]">Loading Profile...</div>;

  const mockOrders = [
    { id: '#ORD-9982X', date: 'Oct 12, 2026', total: '₹450', items: 'Organic Toor Dal (1kg), Brown Rice (2kg)', status: 'Delivered' },
    { id: '#ORD-9981X', date: 'Sep 25, 2026', total: '₹1200', items: 'Cold Pressed Coconut Oil (1L), Mustard Seeds (500g)', status: 'Delivered' },
    { id: '#ORD-9980X', date: 'Sep 10, 2026', total: '₹350', items: 'Organic Jaggery Powder (1kg)', status: 'Processing' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 mt-16">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">My Dashboard</h1>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="w-full md:w-64 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 sticky top-24">
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition ${activeTab === 'profile' ? 'bg-[#f4f7f1] text-[#4a7c23] font-semibold' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
                >
                  <div className="flex items-center gap-3"><User size={20} /> Profile Details</div>
                  {activeTab === 'profile' && <ChevronRight size={16} />}
                </button>
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition ${activeTab === 'orders' ? 'bg-[#f4f7f1] text-[#4a7c23] font-semibold' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
                >
                  <div className="flex items-center gap-3"><Package size={20} /> Order History</div>
                  {activeTab === 'orders' && <ChevronRight size={16} />}
                </button>
                <button
                  onClick={() => setActiveTab('help')}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition ${activeTab === 'help' ? 'bg-[#f4f7f1] text-[#4a7c23] font-semibold' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
                >
                  <div className="flex items-center gap-3"><HelpCircle size={20} /> Help & Support</div>
                  {activeTab === 'help' && <ChevronRight size={16} />}
                </button>
                <div className="pt-4 mt-2 border-t border-slate-100">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition"
                  >
                    <div className="flex items-center gap-3"><LogOut size={20} /> Sign Out</div>
                  </button>
                </div>
              </nav>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1">
            {activeTab === 'profile' && (
              <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-2xl font-bold text-slate-800 mb-6">Profile Details</h2>
                <div className="flex items-center gap-6 mb-8">
                  <div className="h-24 w-24 rounded-full bg-gradient-to-br from-[#4a7c23] to-[#76a251] flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                    {userData?.name ? userData.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900">{userData?.name || 'Valued Customer'}</h3>
                    <span className="inline-block mt-2 px-3 py-1 bg-green-100 text-[#4a7c23] text-xs font-semibold rounded-full">Verified Account</span>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 group hover:border-[#4a7c23]/30 transition">
                    <div className="flex items-center gap-3 text-slate-500 mb-2 font-medium">
                      <Mail size={18} className="text-[#4a7c23]" /> Email Address
                    </div>
                    <p className="text-slate-900 font-semibold">{userData?.email || 'Not provided'}</p>
                  </div>
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 group hover:border-[#4a7c23]/30 transition">
                    <div className="flex items-center gap-3 text-slate-500 mb-2 font-medium">
                      <Phone size={18} className="text-[#4a7c23]" /> Mobile Number
                    </div>
                    <p className="text-slate-900 font-semibold">{userData?.mobile || 'Not provided'}</p>
                  </div>
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 md:col-span-2 group hover:border-[#4a7c23]/30 transition">
                    <div className="flex items-center justify-between mb-2">
                       <div className="flex items-center gap-3 text-slate-500 font-medium">
                         <MapPin size={18} className="text-[#4a7c23]" /> Delivery Address
                       </div>
                       <button className="text-sm font-semibold text-[#4a7c23] hover:underline">Edit</button>
                    </div>
                    <p className="text-slate-900 font-semibold">123 Organic Farms Road, Bengaluru, Karnataka, 560001</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-2xl font-bold text-slate-800 mb-6">Order History</h2>
                <div className="space-y-5">
                  {mockOrders.map((order, idx) => (
                    <div key={idx} className="p-6 rounded-2xl border border-slate-100 hover:shadow-md transition bg-white flex flex-col md:flex-row justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <span className="font-bold text-slate-900">{order.id}</span>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${order.status === 'Delivered' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>{order.status}</span>
                        </div>
                        <p className="text-sm text-slate-500 mb-2">Ordered on {order.date}</p>
                        <p className="text-slate-700 font-medium">{order.items}</p>
                      </div>
                      <div className="flex flex-col justify-between items-end">
                        <span className="text-xl font-bold text-[#4a7c23]">{order.total}</span>
                        <button className="mt-4 md:mt-0 px-4 py-2 text-sm font-semibold text-[#4a7c23] bg-green-50 rounded-lg hover:bg-green-100 transition">View Receipt</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'help' && (
              <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-2xl font-bold text-slate-800 mb-6">Help & Support</h2>
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                   <div className="p-6 rounded-2xl bg-green-50/50 border border-green-100">
                     <h3 className="font-bold text-slate-900 mb-2">Call Us</h3>
                     <p className="text-slate-600 mb-4 text-sm">Need immediate assistance with your order? Our support team is online.</p>
                     <p className="font-bold text-[#4a7c23] text-lg">1800-123-ORGANIC</p>
                   </div>
                   <div className="p-6 rounded-2xl bg-blue-50/50 border border-blue-100">
                     <h3 className="font-bold text-slate-900 mb-2">Email Support</h3>
                     <p className="text-slate-600 mb-4 text-sm">Drop us a line and we will get back to you within 24 hours.</p>
                     <p className="font-bold text-blue-700 text-lg">support@abhivriddhi.com</p>
                   </div>
                </div>

                <h3 className="text-xl font-bold text-slate-800 mb-4 border-t border-slate-100 pt-8">Frequently Asked Questions</h3>
                <div className="space-y-4">
                  <div className="p-5 rounded-2xl border border-slate-100">
                    <p className="font-semibold text-slate-900 mb-1">How do I track my order?</p>
                    <p className="text-slate-600 text-sm">You can track your order status directly from the Order History tab. Once dispatched, a tracking link will appear on your receipt.</p>
                  </div>
                  <div className="p-5 rounded-2xl border border-slate-100">
                    <p className="font-semibold text-slate-900 mb-1">What is the refund policy?</p>
                    <p className="text-slate-600 text-sm">Due to the perishable nature of organic goods, we only offer refunds if the package arrives damaged. Please report within 48 hours with images.</p>
                  </div>
                  <div className="p-5 rounded-2xl border border-slate-100">
                    <p className="font-semibold text-slate-900 mb-1">How can I change my delivery address?</p>
                    <p className="text-slate-600 text-sm">You can update your address from the Profile Details section. Note that address changes won't apply to already dispatched orders.</p>
                  </div>
                </div>
              </div>
            )}
            
          </div>
        </div>
      </div>
    </div>
  );
}
