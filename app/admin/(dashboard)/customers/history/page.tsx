'use client';

import React, { useState, useEffect } from 'react';
import { 
  History, 
  Search, 
  Phone, 
  ShoppingBag, 
  ArrowRight,
  User,
  MapPin,
  Calendar,
  ChevronRight,
  TrendingUp,
  Package,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import { fetchAllOrders } from '@/app/api/api-service';

export default function CustomerHistoryPage() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [orders, setOrders] = useState<any[]>([]);
  const [allOrders, setAllOrders] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadAll = async () => {
      try {
        const data = await fetchAllOrders();
        setAllOrders(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    loadAll();
  }, []);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!phoneNumber) return;

    setIsSearching(true);
    // Filter orders by phone number (removing spaces for better matching)
    const filtered = allOrders.filter(o => 
      o.mobileNo?.replace(/\s/g, '').includes(phoneNumber.replace(/\s/g, ''))
    );
    
    setOrders(filtered);
    setHasSearched(true);
    setTimeout(() => setIsSearching(false), 500);
  };

  const customerInfo = orders.length > 0 ? orders[0] : null;

  return (
    <div className="space-y-10 animate-fade-in pb-20">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-black tracking-tight text-black flex items-center gap-3 uppercase">
           <History size={28} className="text-[#c8b99a]" />
           Customer History
        </h1>
        <p className="text-[10px] text-black/40 font-bold uppercase tracking-widest mt-1">Trace all previous interactions by mobile number</p>
      </div>

      {/* Main Search Panel */}
      <div className="bg-black text-white p-10 rounded-sm shadow-2xl relative overflow-hidden ring-1 ring-white/10">
         <div className="absolute top-0 right-0 w-64 h-64 bg-[#c8b99a]/10 blur-[90px] -translate-y-1/2 translate-x-1/2"></div>
         
         <div className="relative z-10 max-w-2xl">
            <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-[#c8b99a] mb-8">Search Order History</h2>
            
            <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
               <div className="flex-1 relative group">
                  <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#c8b99a] transition-colors" size={18} />
                  <input 
                    type="text" 
                    placeholder="Enter Customer Mobile No..."
                    className="w-full bg-white/[0.05] border border-white/10 py-5 pl-14 pr-6 text-sm font-bold tracking-[0.2em] outline-none focus:bg-white focus:text-black focus:border-[#c8b99a] transition-all duration-500 rounded-sm"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
               </div>
               <button 
                 type="submit"
                 disabled={isSearching || isLoading}
                 className="px-10 py-5 bg-[#c8b99a] text-black font-black text-xs uppercase tracking-[0.2em] hover:bg-white transition-all duration-500 flex items-center justify-center gap-3 disabled:opacity-50"
               >
                  {isSearching ? <RefreshCw size={18} className="animate-spin" /> : <><Search size={18} /> Search Dashboard</>}
               </button>
            </form>
         </div>
      </div>

      {hasSearched && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Customer Summary Sidebar */}
          <div className="lg:col-span-4 space-y-6">
             {orders.length > 0 ? (
               <div className="bg-white border border-black/5 p-8 rounded-sm shadow-sm sticky top-24">
                  <div className="flex flex-col items-center text-center mb-8">
                     <div className="w-24 h-24 bg-black text-white flex items-center justify-center text-3xl font-black rounded-full mb-4 shadow-xl ring-4 ring-black/5 ring-offset-4 uppercase">
                        {customerInfo?.customerName?.[0]}
                     </div>
                     <h3 className="text-lg font-bold text-black uppercase tracking-tight">{customerInfo?.customerName}</h3>
                     <p className="text-[10px] text-black/40 font-bold uppercase tracking-widest mt-1">{customerInfo?.email}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 border-y border-black/5 py-6 mb-6">
                     <div className="text-center md:text-left">
                        <p className="text-[9px] font-bold uppercase tracking-widest text-black/30 mb-1">Frequency</p>
                        <p className="text-xl font-black text-black">{orders.length} <span className="text-[10px] uppercase text-black/40">Orders</span></p>
                     </div>
                     <div className="text-center md:text-left border-l border-black/5 pl-4">
                        <p className="text-[9px] font-bold uppercase tracking-widest text-black/30 mb-1">Customer Value</p>
                        <p className="text-xl font-black text-[#c8b99a]">Rs {orders.reduce((acc, curr) => acc + curr.total, 0).toLocaleString()}</p>
                     </div>
                  </div>

                  <div className="space-y-4">
                     <div className="flex items-start gap-3">
                        <MapPin size={16} className="text-black/20 mt-1 shrink-0" />
                        <div>
                           <p className="text-[9px] font-bold uppercase tracking-widest text-black/30">Last Shipping Address</p>
                           <p className="text-[11px] font-bold text-black uppercase leading-relaxed mt-1">{customerInfo?.address}</p>
                        </div>
                     </div>
                  </div>
               </div>
             ) : (
               <div className="bg-red-50 border border-red-100 p-8 rounded-sm text-center">
                  <AlertCircle size={40} className="mx-auto text-red-300 mb-4" />
                  <h3 className="text-sm font-bold text-red-900 uppercase tracking-tight">No History Found</h3>
                  <p className="text-[10px] text-red-700/60 font-bold tracking-widest mt-2 uppercase">We couldn't find any orders linked to this mobile number</p>
               </div>
             )}
          </div>

          {/* Detailed Order List */}
          <div className="lg:col-span-8 space-y-6">
             {orders.length > 0 ? (
               <div className="bg-white border border-black/5 rounded-sm shadow-sm overflow-hidden animate-slide-up">
                  <div className="px-8 py-6 border-b border-black/5 bg-black/[0.01]">
                     <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-black">Purchasing Timeline</h2>
                  </div>
                  
                  <div className="divide-y divide-black/5">
                     {orders.map((order) => (
                       <div key={order.id} className="p-8 hover:bg-black/[0.01] transition-all group">
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                             <div className="flex items-center gap-6">
                                <div className="w-16 h-16 bg-black/[0.03] rounded-sm flex items-center justify-center text-black/10">
                                   <ShoppingBag size={28} strokeWidth={1} />
                                </div>
                                <div className="space-y-1">
                                   <div className="flex items-center gap-3">
                                      <span className="text-[13px] font-black text-black">ORDER #{order.orderId}</span>
                                      <span className={`px-2 py-0.5 text-[8px] font-bold uppercase tracking-widest rounded-full ${
                                        order.orderStatus === 'DELIVERED' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'
                                      }`}>
                                         {order.orderStatus}
                                      </span>
                                   </div>
                                   <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-black/30">
                                      <Calendar size={12} /> {new Date(order.createdAt).toLocaleDateString()}
                                      <span className="w-1 h-1 bg-black/10 rounded-full"></span>
                                      <Package size={12} /> {order.items?.length} ITEMS
                                   </div>
                                </div>
                             </div>

                             <div className="flex items-center justify-between md:justify-end gap-10">
                                <div className="text-right">
                                   <span className="text-xl font-black text-black tracking-tighter">Rs {order.total?.toLocaleString()}</span>
                                   <p className="text-[9px] font-bold uppercase tracking-widest text-black/30">Paid via {order.paymentMethod?.replace(/_/g, ' ')}</p>
                                </div>
                                <Link 
                                  href={`/admin/orders/${order.id}`}
                                  className="p-3 border border-black/10 text-black hover:bg-black hover:text-white transition-all rounded-sm shadow-sm"
                                >
                                   <ChevronRight size={20} />
                                </Link>
                             </div>
                          </div>
                       </div>
                     ))}
                  </div>
               </div>
             ) : (
                <div className="bg-white border-2 border-dashed border-black/5 p-32 rounded-sm text-center flex flex-col items-center">
                   <TrendingUp size={64} className="text-black/5 mb-6" strokeWidth={0.5} />
                   <p className="text-[12px] font-black uppercase text-black/20 tracking-[0.3em]">Waiting for valid search...</p>
                </div>
             )}
          </div>

        </div>
      )}

      {!hasSearched && (
        <div className="flex flex-col items-center justify-center p-40 text-center space-y-8 bg-white border border-black/5 rounded-sm shadow-inner opacity-50">
           <Package size={100} strokeWidth={0.5} className="text-black/10" />
           <div className="space-y-2">
              <h2 className="text-xl font-black uppercase tracking-[0.4em] text-black">Customer Archive</h2>
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-black/30 max-w-sm mx-auto leading-relaxed">
                 Type a valid phone number above to unlock purchasing behavior and order records
              </p>
           </div>
        </div>
      )}
    </div>
  );
}