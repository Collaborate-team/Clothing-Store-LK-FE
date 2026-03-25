'use client';

import React from 'react';
import Image from 'next/image';
import { 
  Package, 
  ChevronRight, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  Truck,
  ArrowRight,
  RefreshCcw,
  Search
} from 'lucide-react';

import { getCustomerOrderHistory, getProductImageUrl } from '../../app/api/api-service';
import { OrderDTO } from '../../types/api-types';

const OrderHistoryPage = () => {
  const [orders, setOrders] = React.useState<OrderDTO[]>([]);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const fetchOrders = async (mobile: string) => {
    if (!mobile) return;
    setLoading(true);
    try {
      const data = await getCustomerOrderHistory(mobile);
      setOrders(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfbf7] text-[#0a0a0a] pt-32 pb-24" style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}>
      <main className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 md:20 gap-8 animate-fade-in">
          <div className="space-y-4">
            <p className="text-[9px] md:text-[10px] tracking-[0.5em] font-bold text-[#c8b99a] uppercase">Member Archive</p>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-light tracking-tight" style={{ fontFamily: "var(--font-cormorant), 'Cormorant Garamond', serif" }}>
              Order <span className="text-[#c8b99a] italic">History</span>
            </h1>
          </div>
          <div className="flex items-center gap-6 w-full md:w-auto">
             <div className="relative flex-1 md:w-64">
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && fetchOrders(searchQuery)}
                  placeholder="SEARCH ARCHIVE (By Mobile Number)" 
                  className="w-full bg-white border border-[#e5e1d8] py-4 pl-12 pr-4 text-[9px] tracking-widest outline-none focus:border-black transition-colors rounded-sm shadow-sm"
                />
                <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#b5b1a8]" />
             </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-10">
          {loading && <div className="text-center py-10 uppercase text-xs tracking-widest text-[#888]">Loading orders...</div>}
          {!loading && orders.length === 0 && <div className="text-center py-10 uppercase text-xs tracking-widest text-[#888]">No orders found for this contact number.</div>}
          {orders.map((order) => (
            <div 
              key={order.orderId || order.id} 
              className="bg-white border border-[#e5e1d8] overflow-hidden hover:shadow-2xl transition-all duration-700 animate-fade-in group"
            >
              {/* Top Banner */}
              <div className="px-5 md:px-8 py-6 border-b border-[#f0eee8] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 bg-[#fcfbf7]/50">
                <div className="flex flex-wrap gap-6 md:gap-10">
                  <div className="space-y-1">
                    <p className="text-[8px] md:text-[9px] font-bold uppercase text-[#b5b1a8] tracking-widest">Order Placed</p>
                    <p className="text-[11px] md:text-[12px] font-medium">{order.createdAt || 'N/A'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[8px] md:text-[9px] font-bold uppercase text-[#b5b1a8] tracking-widest">Total Value</p>
                    <p className="text-[11px] md:text-[12px] font-medium">Rs {order.total}</p>
                  </div>
                  <div className="space-y-1 hidden min-[450px]:block">
                    <p className="text-[8px] md:text-[9px] font-bold uppercase text-[#b5b1a8] tracking-widest">Dispatch to</p>
                    <p className="text-[11px] md:text-[12px] font-medium flex items-center gap-1">
                      {order.customerName || 'Customer'} <ChevronRight size={12} className="text-[#c8b99a]" />
                    </p>
                  </div>
                </div>
                <div className="w-full sm:w-auto text-left sm:text-right flex flex-row sm:flex-col justify-between sm:justify-end items-center sm:items-end">
                   <p className="text-[10px] md:text-[11px] font-bold uppercase tracking-tight">{order.orderId}</p>
                   <button className="text-[10px] text-[#c8b99a] border-b border-[#c8b99a]/30 hover:border-[#c8b99a] sm:mt-1 pb-0.5 transition-all font-bold uppercase tracking-widest flex items-center gap-2">
                     Details <ArrowRight size={12} />
                   </button>
                </div>
              </div>

              {/* Main Order Content */}
              <div className="p-5 md:p-8 flex flex-col lg:flex-row gap-8 md:gap-12">
                {/* Product Thumbnail and Info */}
                <div className="flex-1 flex flex-row gap-6 md:gap-8">
                  <div className="relative w-24 h-32 md:w-32 md:h-40 shrink-0 border border-[#e5e1d8] overflow-hidden bg-black/5 flex items-center justify-center">
                    {order.items && order.items.length > 0 && order.items[0].imageUrl ? (
                      <Image src={getProductImageUrl(order.items[0].imageUrl)} alt="Product" fill className="object-cover group-hover:scale-110 transition-transform duration-[3s]" />
                    ) : ( <Package size={30} className="text-black/10" /> )}
                  </div>
                  <div className="space-y-4 md:space-y-6 flex-1">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        {order.orderStatus !== 'DELIVERED' ? (
                          <div className="flex items-center gap-2 text-blue-800 bg-blue-50 px-3 py-1 rounded-full text-[8px] md:text-[9px] font-bold uppercase tracking-wider w-fit">
                            <Clock size={10} className="md:w-[12px]" /> {order.orderStatus}
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-green-800 bg-green-50 px-3 py-1 rounded-full text-[8px] md:text-[9px] font-bold uppercase tracking-wider w-fit">
                            <CheckCircle2 size={10} className="md:w-[12px]" /> {order.orderStatus}
                          </div>
                        )}
                      </div>
                      <h3 className="text-xs md:text-sm font-bold uppercase tracking-[0.1em] leading-tight flex flex-col">
                        <span>Luxury Collection Acquisition</span>
                        {order.items && order.items.length > 0 && <span className="text-[10px] opacity-70 mt-1 lowercase capitalize-first">{order.items[0].productName} {order.items.length > 1 ? `& ${order.items.length - 1} more items` : ''}</span>}
                      </h3>
                      <p className="text-[10px] md:text-[11px] text-[#888] italic">Consolidating {order.items?.length || 0} curated item{(order.items?.length !== 1) ? 's' : ''}</p>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-3 md:gap-4 pt-2">
                       <button className="px-4 md:px-6 py-3 bg-black text-white text-[8px] md:text-[9px] tracking-[0.2em] font-bold uppercase hover:bg-[#1a1a1a] transition-all flex items-center justify-center gap-2 group/btn shadow-md w-full sm:w-auto">
                         <RefreshCcw size={12} className="group-hover/btn:rotate-180 transition-transform duration-500" /> Track Parcel
                       </button>
                       <button className="px-4 md:px-6 py-3 border border-black text-black text-[8px] md:text-[9px] tracking-[0.2em] font-bold uppercase hover:bg-black hover:text-white transition-all w-full sm:w-auto">
                         View Invoice
                       </button>
                    </div>
                  </div>
                </div>

                {/* Tracking Milestones (Visual) */}
                <div className="lg:w-80 space-y-6 lg:border-l lg:border-[#f0eee8] lg:pl-12">
                  <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#b5b1a8] mb-8">Snapshot Status</h4>
                  <div className="space-y-8 relative">
                    <div className="absolute left-[7px] top-2 bottom-2 w-px bg-[#e5e1d8]" />
                    
                    {/* Event 1 */}
                    <div className="flex gap-4 relative">
                        <div className={`w-4 h-4 rounded-full border-2 border-white ring-1 shadow-sm shrink-0 z-10 ${order.orderStatus === 'DELIVERED' ? 'bg-black ring-black' : 'bg-[#c8b99a] ring-[#c8b99a] animate-pulse'}`} />
                        <div className="space-y-1">
                          <p className="text-[11px] font-bold uppercase tracking-wider">{order.orderStatus === 'DELIVERED' ? 'Delivered' : 'In Transit'}</p>
                          <p className="text-[10px] text-[#888]">{order.updateAt || 'Pending Delivery'}</p>
                        </div>
                    </div>

                    {/* Event 2 */}
                    <div className="flex gap-4 relative">
                        <div className="w-4 h-4 rounded-full bg-black border-2 border-white ring-1 ring-black shadow-sm shrink-0 z-10" />
                        <div className="space-y-1">
                          <p className="text-[11px] font-bold uppercase tracking-wider">Dispatched from Atelier</p>
                          <p className="text-[10px] text-[#888]">Port of Colombo</p>
                        </div>
                    </div>

                    {/* Event 3 */}
                    <div className="flex gap-4 relative">
                        <div className="w-4 h-4 rounded-full bg-black border-2 border-white ring-1 ring-black shadow-sm shrink-0 z-10" />
                        <div className="space-y-1">
                          <p className="text-[11px] font-bold uppercase tracking-wider">Authenticated</p>
                          <p className="text-[10px] text-[#888]">{order.createdAt || 'N/A'}</p>
                        </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Secure Delivery Trust */}
              <div className="bg-[#fcfbf7]/30 px-8 py-3 flex items-center gap-4 border-t border-[#f0eee8]">
                 <Truck size={14} className="text-[#c8b99a]" strokeWidth={1.5} />
                 <p className="text-[8px] tracking-[0.2em] uppercase font-bold text-[#b5b1a8]">Signature Required Upon Delivery — Secure Transit</p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Support */}
        <div className="mt-24 pt-20 border-t border-[#e5e1d8] text-center space-y-8 animate-fade-in delay-500">
           <div className="space-y-2">
             <p className="text-[11px] font-light text-[#888] italic">Encountered an anomaly with your archive?</p>
             <button className="text-[10px] font-bold uppercase border-b border-black pb-1 hover:text-[#c8b99a] hover:border-[#c8b99a] transition-all tracking-[0.2em]">Contact Noir Concierge</button>
           </div>
           <p className="text-[12px] font-light text-[#b5b1a8] max-w-lg mx-auto leading-relaxed">
             Our archive preserves all records for a duration of five solar years. For historical data older than this period, please contact our physical archives.
           </p>
        </div>
      </main>
    </div>
  );
};

export default OrderHistoryPage;
