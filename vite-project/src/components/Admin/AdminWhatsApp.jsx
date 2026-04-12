import React, { useState, useEffect } from 'react';
import {
   MessageSquare,
   Smartphone,
   CheckCircle2,
   AlertCircle,
   RefreshCcw,
   Zap,
   ShieldCheck,
   QrCode
} from 'lucide-react';
import { getWhatsAppStatus, relinkWhatsApp, hardResetWhatsApp } from '../../services/api';

const AdminWhatsApp = () => {
   const [waStatus, setWaStatus] = useState({ status: 'Disconnected', qr: null });
   const [loading, setLoading] = useState(true);
   const [refreshing, setRefreshing] = useState(false);

   const fetchStatus = async (isManual = false) => {
      try {
         if (isManual) setRefreshing(true);
         const status = await getWhatsAppStatus();
         setWaStatus(status);
      } catch (err) {
         console.error('Failed to fetch WhatsApp status', err);
      } finally {
         setLoading(false);
         setRefreshing(false);
      }
   };

   const handleRelink = async () => {
      if (!window.confirm('CRITICAL: This will PERMANENTLY LOGOUT the current account and clear all saved data. A NEW QR code will be generated for scanning. Proceed?')) return;
      try {
         setRefreshing(true);
         const res = await relinkWhatsApp();
         if (res.success) {
            // After relinking, poll for status which should now be disconnected
            setTimeout(() => fetchStatus(), 1000);
         }
      } catch (err) {
         alert('Failed to initiate relink');
      } finally {
         setRefreshing(false);
      }
   };
   const handleHardReset = async () => {
      if (!window.confirm('CRITICAL: This will force-kill all WhatsApp browser processes and clear session locks. Use ONLY if the bridge is stuck. Proceed?')) return;
      try {
         setRefreshing(true);
         const res = await hardResetWhatsApp();
         if (res.success) {
            alert('Hard reset triggered. Please wait 10-15 seconds for the bridge to restart.');
            setTimeout(() => fetchStatus(), 5000);
         }
      } catch (err) {
         alert('Failed to initiate hard reset');
      } finally {
         setRefreshing(false);
      }
   };

   useEffect(() => {
      fetchStatus();
      
      // Dynamic polling: faster when awaiting connection, slower when ready
      const getPollSpeed = () => {
         if (waStatus.status === 'Ready') return 15000;
         if (waStatus.qr) return 5000;
         return 3000;
      };

      const interval = setInterval(() => fetchStatus(), getPollSpeed());
      return () => clearInterval(interval);
   }, [waStatus.status, waStatus.qr]);

   if (loading) {
      return (
         <div className="flex h-[60vh] items-center justify-center">
            <div className="w-10 h-10 border-4 border-slate-200 border-t-emerald-600 rounded-full animate-spin"></div>
         </div>
      );
   }

   return (
      <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

         {/* Header */}
         <div className="flex items-center justify-between">
            <div>
               <h1 className="text-4xl font-black text-slate-900 tracking-tight">Communication Node</h1>
               <p className="text-slate-500 font-medium mt-1">Configure and monitor your WhatsApp business connection.</p>
            </div>
            <div className={`px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center gap-2 ${waStatus.status === 'Ready' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'
               }`}>
               <div className={`w-2 h-2 rounded-full ${waStatus.status === 'Ready' ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></div>
               {waStatus.status}
            </div>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

            {/* Connection Status Card */}
            <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm space-y-8">
               <div className="space-y-4">
                  <div className="p-4 bg-slate-50 rounded-3xl w-fit text-slate-900">
                     <Smartphone size={32} />
                  </div>
                  <div>
                     <h2 className="text-2xl font-black text-slate-900">System Status</h2>
                     <p className="text-slate-500 text-sm font-medium">Automatic order notifications and OTP delivery status.</p>
                  </div>
               </div>

               <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 rounded-3xl bg-slate-50 border border-slate-100">
                     <div className={`p-2 rounded-xl ${waStatus.status === 'Ready' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-200 text-slate-400'}`}>
                        <Zap size={18} />
                     </div>
                     <div className="flex-1">
                        <p className="text-xs font-black uppercase tracking-widest text-slate-400">Push Delivery</p>
                        <p className="text-sm font-bold text-slate-700">{waStatus.status === 'Ready' ? 'Active & High-Speed' : 'Paused'}</p>
                     </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 rounded-3xl bg-slate-50 border border-slate-100">
                     <div className={`p-2 rounded-xl ${waStatus.status === 'Ready' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-200 text-slate-400'}`}>
                        <ShieldCheck size={18} />
                     </div>
                     <div className="flex-1">
                        <p className="text-xs font-black uppercase tracking-widest text-slate-400">Encryption</p>
                        <p className="text-sm font-bold text-slate-700">End-to-End Secure</p>
                     </div>
                  </div>
               </div>

                <button
                   onClick={() => fetchStatus(true)}
                   className="w-full py-4 bg-slate-900 text-white font-black text-sm rounded-2xl shadow-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                >
                   {refreshing ? <RefreshCcw size={18} className="animate-spin" /> : <RefreshCcw size={18} />}
                   Force Refresh Bridge
                </button>

                <button
                   onClick={handleRelink}
                   disabled={refreshing}
                   className="w-full py-3 bg-white border border-slate-200 text-slate-400 font-black text-xs rounded-xl hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-all flex items-center justify-center gap-2"
                >
                   Relink Different Account
                </button>

                <div className="pt-4 border-t border-slate-100">
                   <button
                      onClick={handleHardReset}
                      disabled={refreshing}
                      className="w-full py-2 text-red-400 font-bold text-[10px] uppercase tracking-widest hover:text-red-600 transition-all flex items-center justify-center gap-2"
                   >
                      {refreshing ? 'Processing...' : '⚠️ EMERGENCY: HARD RESET BRIDGE'}
                   </button>
                   <p className="text-[10px] text-slate-400 text-center mt-2 px-4 leading-relaxed">
                      Only use Hard Reset if the system reports "Browser already running" or remains stuck for several minutes.
                   </p>
                </div>
            </div>

            {/* QR Scanner Card */}
             <div className="bg-slate-900 p-8 rounded-[40px] text-white flex flex-col items-center justify-center text-center space-y-6 relative overflow-hidden">
                {waStatus.status === 'Ready' ? (
                   <div className="relative z-10 animate-in zoom-in duration-500">
                      <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-400 mx-auto mb-6 relative">
                         <CheckCircle2 size={48} />
                         <div className="absolute top-0 right-0 w-6 h-6 bg-emerald-500 rounded-full border-4 border-slate-900 flex items-center justify-center">
                            <Zap size={10} className="text-white" />
                         </div>
                      </div>
                      <h2 className="text-2xl font-black italic tracking-tighter">SUCCESSFULLY LINKED</h2>
                      <div className="mt-4 py-2 px-4 bg-white/10 rounded-2xl border border-white/10">
                         <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Linked Account</p>
                         <p className="text-lg font-bold mt-1">+{waStatus.linkedNumber || 'Active Device'}</p>
                      </div>
                      <p className="text-slate-400 text-xs mt-4 max-w-[200px] leading-relaxed">
                         All order confirmations and OTPs are now being dispatched from this number.
                      </p>
                   </div>
               ) : waStatus.qr ? (
                  <div className="relative z-10 space-y-6 animate-in fade-in duration-500">
                     <div className="bg-white p-4 rounded-[32px] shadow-2xl">
                        <img src={waStatus.qr} alt="Connection QR" className="w-56 h-56" />
                     </div>
                     <div>
                        <h2 className="text-xl font-black">Scan to Connect</h2>
                        <p className="text-slate-400 text-xs mt-2 uppercase tracking-widest font-bold">Open WhatsApp Settings Linked Devices</p>
                     </div>
                  </div>
               ) : (
                  <div className="relative z-10 flex flex-col items-center text-slate-500 animate-pulse">
                     <QrCode size={64} />
                     <p className="text-sm font-black mt-4 uppercase tracking-widest">Awaiting Bridge Response...</p>
                  </div>
               )}

               {/* Decorative Background Glow */}
               <div className="absolute -top-24 -right-24 w-64 h-64 bg-emerald-500/10 rounded-full blur-[100px]"></div>
               <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-500/10 rounded-full blur-[100px]"></div>
            </div>

         </div>

         <div className="p-8 bg-blue-50/50 rounded-[40px] border border-blue-100 flex items-start gap-4">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-xl">
               <AlertCircle size={20} />
            </div>
            <div>
               <h4 className="text-sm font-black text-blue-900 uppercase tracking-widest">Connection Notice</h4>
               <p className="text-sm text-blue-700 font-medium mt-1 leading-relaxed">
                  For optimal performance, keep your linked phone connected to the internet. If you experience delays in OTP delivery, try refreshing the bridge settings.
               </p>
            </div>
         </div>

      </div>
   );
};

export default AdminWhatsApp;
