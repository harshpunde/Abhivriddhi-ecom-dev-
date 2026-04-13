import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Calendar, CreditCard, ChevronLeft, Download, Eye, ExternalLink, Clock, CheckCircle, Truck, XCircle, AlertCircle } from 'lucide-react';
import { fetchMyOrders } from '../../services/api';

const OrderHistory = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedOrder, setSelectedOrder] = useState(null);

    useEffect(() => {
        const getOrders = async () => {
            try {
                const data = await fetchMyOrders();
                if (data.success) {
                    setOrders(data.orders);
                }
            } catch (err) {
                console.error('Error fetching orders:', err);
                setError('Failed to load your order history. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        getOrders();
    }, [navigate]);

    const getStatusColor = (status) => {
        switch (status) {
            case 'Processing': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'Shipped': return 'bg-purple-100 text-purple-700 border-purple-200';
            case 'Delivered': return 'bg-green-100 text-green-700 border-green-200';
            case 'Cancelled': return 'bg-red-100 text-red-700 border-red-200';
            case 'Payment Pending': return 'bg-amber-100 text-amber-700 border-amber-200';
            default: return 'bg-slate-100 text-slate-700 border-slate-200';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Processing': return <Clock size={14} />;
            case 'Shipped': return <Truck size={14} />;
            case 'Delivered': return <CheckCircle size={14} />;
            case 'Cancelled': return <XCircle size={14} />;
            case 'Payment Pending': return <AlertCircle size={14} />;
            default: return <Package size={14} />;
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    const getDeliveryRange = (createdAt) => {
        const start = new Date(createdAt);
        start.setDate(start.getDate() + 7);
        const end = new Date(createdAt);
        end.setDate(end.getDate() + 8);

        return `${formatDate(start)} - ${formatDate(end)}`;
    };

    const TrackingStepper = ({ status, createdAt }) => {
        const [progress, setProgress] = useState(0);
        const [simulatedStatus, setSimulatedStatus] = useState('');

        useEffect(() => {
            const calculateProgress = () => {
                const now = new Date();
                const start = new Date(createdAt);
                const diffTime = Math.abs(now - start);
                const diffDays = diffTime / (1000 * 60 * 60 * 24);

                // Admin Manual Overrides
                if (status === 'Delivered') {
                    setProgress(100);
                    setSimulatedStatus('Delivered');
                    return;
                }
                if (status === 'Cancelled') {
                    setProgress(0);
                    setSimulatedStatus('Cancelled');
                    return;
                }
                if (status === 'Shipped') {
                    // If admin marked as shipped, we jump to at least 70%
                    const baseProgress = 70;
                    const remainingProgress = Math.min((diffDays / 8) * 100, 95);
                    setProgress(Math.max(baseProgress, remainingProgress));
                    setSimulatedStatus('Dispatched');
                    return;
                }

                // Automated Progression (when status is Processing or Payment Completed)
                if (diffDays < 1) {
                    setProgress(20);
                    setSimulatedStatus('Order Confirmed');
                } else if (diffDays < 7) {
                    // Smoothly move from 20% to 90% over 6 days
                    const autoMove = 20 + ((diffDays - 1) / 6) * 70;
                    setProgress(autoMove);
                    setSimulatedStatus(diffDays > 3 ? 'In Transit' : 'Processing');
                } else {
                    setProgress(95);
                    setSimulatedStatus('Arriving Soon');
                }
            };

            calculateProgress();
            const interval = setInterval(calculateProgress, 60000); // Update every minute
            return () => clearInterval(interval);
        }, [status, createdAt]);

        if (status === 'Cancelled') {
            return (
                <div className="mt-8 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-700 animate-pulse">
                    <XCircle size={20} />
                    <p className="font-bold text-sm">Order Cancelled: This order will not be delivered.</p>
                </div>
            );
        }

        const steps = [
            { id: 'confirmed', label: 'Confirmed', pos: 20 },
            { id: 'dispatched', label: 'Dispatched', pos: 70 },
            { id: 'delivered', label: 'Delivered', pos: 100 }
        ];

        return (
            <div className="mt-8 mb-6">
                <div className="flex items-center justify-between mb-2 px-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#4a7c23] flex items-center gap-2">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4a7c23] opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#4a7c23]"></span>
                        </span>
                        Live Tracking: {simulatedStatus}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400">
                        {status === 'Delivered' ? 'Completed' : 'Estimated 7-8 Days'}
                    </span>
                </div>

                <div className="relative h-2 w-full bg-slate-100 rounded-full overflow-hidden mb-8">
                    {/* Background Progress Fill */}
                    <div 
                        className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#1a3d0c] to-[#4a7c23] transition-all duration-1000 ease-out"
                        style={{ width: `${progress}%` }}
                    >
                        <div className="absolute top-0 right-0 h-full w-8 bg-white/20 skew-x-[-20deg] animate-[shimmer_2s_infinite]"></div>
                    </div>

                    {/* Step Markers */}
                    {steps.map(step => (
                        <div 
                            key={step.id}
                            className={`absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 transition-colors duration-500 ${progress >= step.pos ? 'bg-[#4a7c23] border-white' : 'bg-white border-slate-200'}`}
                            style={{ left: `calc(${step.pos}% - 6px)` }}
                        ></div>
                    ))}
                </div>

                <div className="flex justify-between px-1">
                    {steps.map(step => (
                        <div key={step.id} className="text-center">
                            <p className={`text-[10px] font-black uppercase tracking-tighter ${progress >= step.pos ? 'text-[#4a7c23]' : 'text-slate-300'}`}>
                                {step.label}
                            </p>
                        </div>
                    ))}
                </div>

                {status !== 'Delivered' && (
                    <div className="mt-6 bg-[#f4f7f1] rounded-2xl p-4 flex items-center justify-between border border-[#4a7c23]/10">
                        <div className="flex items-center gap-3">
                            <Clock size={18} className="text-[#4a7c23]" />
                            <div>
                                <p className="text-[10px] uppercase font-bold text-slate-500 tracking-tight">Expected by</p>
                                <p className="text-sm font-black text-slate-900">{getDeliveryRange(createdAt)}</p>
                            </div>
                        </div>
                        <div className="text-[10px] font-bold text-white bg-[#4a7c23] px-3 py-1 rounded-full shadow-sm">
                            AUTO-TRACKING ACTIVE
                        </div>
                    </div>
                )}

                <style>{`
                    @keyframes shimmer {
                        0% { transform: translateX(-100%) skewX(-20deg); }
                        100% { transform: translateX(200%) skewX(-20deg); }
                    }
                `}</style>
            </div>
        );
    };

    const OrderDetailsModal = ({ order, onClose }) => {
        if (!order) return null;

        return (
            <div 
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300"
                onClick={onClose}
            >
                <div 
                    className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-10 duration-500"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Modal Header */}
                    <div className="bg-gradient-to-r from-[#1a3d0c] to-[#4a7c23] p-8 text-white relative">
                        <button 
                            onClick={onClose}
                            className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                        >
                            <XCircle size={24} />
                        </button>
                        <p className="text-xs uppercase tracking-[0.2em] font-black opacity-80 mb-2">Order Summary</p>
                        <h2 className="text-3xl font-black tracking-tight">#{order._id.slice(-8).toUpperCase()}</h2>
                    </div>

                    <div className="p-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
                        <div className="grid md:grid-cols-2 gap-8 mb-8">
                            {/* Shipping Details */}
                            <div className="space-y-4">
                                <h3 className="text-xs uppercase tracking-widest font-black text-[#4a7c23] flex items-center gap-2">
                                    <Truck size={16} /> Delivery Address
                                </h3>
                                <div className="p-5 rounded-3xl bg-slate-50 border border-slate-100">
                                    <p className="text-slate-900 font-black mb-1">{order.shippingAddress.fullName}</p>
                                    <p className="text-slate-600 text-sm leading-relaxed">
                                        {order.shippingAddress.addressLine}<br />
                                        {order.shippingAddress.landmark && `${order.shippingAddress.landmark}, `}
                                        {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
                                    </p>
                                    <div className="mt-3 pt-3 border-t border-slate-200 flex items-center gap-2 text-slate-500 text-xs font-bold">
                                        <Clock size={14} className="text-[#4a7c23]" />
                                        Contact: {order.shippingAddress.mobile}
                                    </div>
                                </div>
                            </div>

                            {/* Payment Summary */}
                            <div className="space-y-4">
                                <h3 className="text-xs uppercase tracking-widest font-black text-[#4a7c23] flex items-center gap-2">
                                    <CreditCard size={16} /> Payment Info
                                </h3>
                                <div className="p-5 rounded-3xl bg-slate-50 border border-slate-100 space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-500 font-bold">Status</span>
                                        <span className="text-[#4a7c23] font-black uppercase tracking-tighter">{order.paymentInfo?.status || 'Paid'}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-500 font-bold">Method</span>
                                        <span className="text-slate-900 font-black truncate max-w-[100px]">Razorpay</span>
                                    </div>
                                    <div className="pt-3 border-t border-slate-200 flex justify-between items-center">
                                        <span className="text-slate-900 font-black">Total Paid</span>
                                        <span className="text-xl font-black text-[#4a7c23]">₹{order.totalAmount.toLocaleString('en-IN')}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Support Area */}
                        <div className="p-6 rounded-[2rem] bg-[#f4f7f1] border border-[#dce6d2] flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
                            <div>
                                <h4 className="text-slate-900 font-black mb-1">Need help with this order?</h4>
                                <p className="text-xs text-slate-500 font-bold">Our support team is available 24/7 for you.</p>
                            </div>
                            <button className="px-6 py-2.5 bg-white border-2 border-[#4a7c23] text-[#4a7c23] rounded-2xl text-xs font-black hover:bg-[#4a7c23] hover:text-white transition-all shadow-sm uppercase tracking-tighter">
                                Contact Support
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-[#4a7c23]/20 border-t-[#4a7c23] rounded-full animate-spin"></div>
                    <p className="text-slate-600 font-medium font-jaini-purva text-xl">Fetching your organic journey...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 pt-[150px] pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                {/* Header Navigation - Back to Dashboard removed */}
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Order History</h1>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl mb-8 flex items-center gap-3">
                        <AlertCircle size={20} />
                        <p>{error}</p>
                    </div>
                )}

                {orders.length === 0 && !error ? (
                    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-16 text-center">
                        <div className="w-20 h-20 bg-[#f4f7f1] text-[#4a7c23] translate-x-1/2 mx-auto rounded-full flex items-center justify-center mb-6 relative left-[-40px]">
                            <Package size={40} />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-2">No orders found yet</h2>
                        <p className="text-slate-500 mb-8 max-w-sm mx-auto">It looks like you haven't placed any orders with us yet. Start your organic journey today!</p>
                        <button 
                            onClick={() => navigate('/')}
                            className="bg-[#4a7c23] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#3d661d] transition-all shadow-lg shadow-[#4a7c23]/20"
                        >
                            Browse Products
                        </button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <div 
                                key={order._id}
                                className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden hover:border-[#4a7c23]/30 transition-all group"
                            >
                                {/* Order Header */}
                                <div className="p-6 border-b border-slate-50 bg-slate-50/30 flex flex-wrap items-center justify-between gap-4">
                                    <div className="flex items-center gap-6">
                                        <div>
                                            <p className="text-xs uppercase tracking-wider text-slate-500 font-bold mb-1">Order ID</p>
                                            <p className="text-sm font-black text-slate-900 tracking-tighter uppercase">#{order._id.slice(-8)}</p>
                                        </div>
                                        <div className="h-8 w-[1px] bg-slate-200 hidden sm:block"></div>
                                        <div>
                                            <p className="text-xs uppercase tracking-wider text-slate-500 font-bold mb-1">Placed On</p>
                                            <p className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
                                                <Calendar size={14} className="text-[#4a7c23]" />
                                                {formatDate(order.createdAt)}
                                            </p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-3">
                                        <div className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold border ${getStatusColor(order.orderStatus)} shadow-sm`}>
                                            {getStatusIcon(order.orderStatus)}
                                            {order.orderStatus.toUpperCase()}
                                        </div>
                                    </div>
                                </div>

                                {/* Order Items Preview */}
                                <div className="p-6">
                                    <div className="space-y-4">
                                        {order.orderItems.map((item, idx) => (
                                            <div key={idx} className="flex items-center gap-4">
                                                <div className="h-16 w-16 rounded-xl bg-slate-50 border border-slate-100 flex-shrink-0 relative overflow-hidden">
                                                    <img 
                                                        src={item.image || 'images/placeholder-product.jpg'} 
                                                        alt={item.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="text-slate-900 font-bold text-sm truncate">{item.name}</h4>
                                                    <p className="text-slate-500 text-xs">Qty: {item.quantity} × ₹{item.price.toLocaleString('en-IN')}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-slate-900 font-bold text-sm">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Real-time Tracking Stepper */}
                                    <TrackingStepper status={order.orderStatus} createdAt={order.createdAt} />
                                </div>

                                {/* Order Footer */}
                                <div className="p-6 bg-slate-50/30 border-t border-slate-50 flex flex-wrap items-center justify-between gap-6">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-green-50 rounded-2xl text-[#4a7c23]">
                                            <CreditCard size={20} />
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-500 font-medium">Total Paid</p>
                                            <p className="text-xl font-black text-slate-900">₹{order.totalAmount.toLocaleString('en-IN')}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        {order.paymentInfo?.status === 'Completed' && (
                                            <a 
                                                href={`/api/payment/invoice/${order._id}`}
                                                download
                                                className="flex items-center gap-2 px-6 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-bold hover:bg-[#f4f7f1] hover:text-[#4a7c23] hover:border-[#4a7c23]/30 transition-all shadow-sm"
                                            >
                                                <Download size={16} />
                                                Invoice
                                            </a>
                                        )}
                                        <button 
                                            onClick={() => setSelectedOrder(order)}
                                            className="flex items-center gap-2 px-6 py-2.5 bg-[#4a7c23] text-white rounded-xl text-sm font-bold hover:bg-[#3d661d] transition-all shadow-lg shadow-[#4a7c23]/20"
                                        >
                                            <Eye size={16} />
                                            Details
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                
                {/* Global Modal Overlay */}
                <OrderDetailsModal 
                    order={selectedOrder} 
                    onClose={() => setSelectedOrder(null)} 
                />
            </div>
        </div>
    );
};

export default OrderHistory;
