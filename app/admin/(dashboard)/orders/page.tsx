'use client';

import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  ChevronRight,
  RefreshCw,
  AlertCircle,
  Search,
  Filter,
  X,
  Loader2
} from 'lucide-react';
import Link from 'next/link';
import { fetchAllOrders, updateOrderStatus, searchOrders } from '@/lib/api-service';
import { useNotification } from '@/context/NotificationContext';

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<'orderId' | 'name' | 'email' | 'mobile'>('orderId');
  const [error, setError] = useState('');
  const { showNotification } = useNotification();

  const loadOrders = async () => {
    setIsLoading(true);
    try {
      const data = await fetchAllOrders();
      setOrders(Array.isArray(data) ? data : []);
      setError('');
    } catch (err) {
      setError('Could not connect to Backend for Orders.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) {
      loadOrders();
      return;
    }

    setIsSearching(true);
    try {
      const results = await searchOrders(searchType, searchQuery);
      setOrders(Array.isArray(results) ? results : []);
    } catch (err) {
      console.error('Search failed', err);
      showNotification('Search failed. Please try again.', 'error', 'Error');
    } finally {
      setIsSearching(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    loadOrders();
  };

  const handleStatusChange = async (id: number | string, newStatus: string) => {
    try {
      await updateOrderStatus(id, newStatus);
      showNotification(`Order #${id} has been updated to ${newStatus}.`, 'success', 'Status Updated');
      loadOrders(); // Refresh
    } catch (err) {
      showNotification('Failed to update order status.', 'error', 'Error');
    }
  };

  return (
    <div className="space-y-10 animate-fade-in pb-20">
      {/* Page Header & Search */}
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-black flex items-center gap-3 uppercase">
             <ShoppingBag size={24} className="text-[#c8b99a]" />
             Sales & Orders
          </h1>
          <p className="text-[10px] text-black/40 font-bold uppercase tracking-widest mt-1">Track and manage customer transactions ({orders.length})</p>
        </div>

        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-stretch gap-3 w-full max-w-2xl bg-white p-2 border border-black/5 rounded-sm shadow-sm">
           <div className="relative flex-1 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-black/20 group-focus-within:text-[#c8b99a] transition-colors" size={16} />
              <input 
                type="text" 
                placeholder={`Search by ${searchType}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-black/[0.02] border border-transparent py-3 pl-11 pr-4 text-xs font-bold text-black outline-none focus:bg-white focus:border-black/5 transition-all rounded-sm uppercase tracking-widest placeholder:text-black/20"
              />
              {searchQuery && (
                <button 
                  type="button" 
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-black/5 rounded-full text-black/20 hover:text-black transition-all"
                >
                  <X size={14} />
                </button>
              )}
           </div>

           <div className="relative min-w-[140px]">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-black/20" size={14} />
              <select 
                value={searchType}
                onChange={(e) => setSearchType(e.target.value as any)}
                className="w-full h-full bg-black/[0.02] border border-transparent py-3 pl-10 pr-8 text-[10px] font-bold uppercase tracking-widest text-black outline-none cursor-pointer hover:bg-black/[0.04] transition-all appearance-none rounded-sm"
              >
                 <option value="orderId">Order ID</option>
                 <option value="name">Customer Name</option>
                 <option value="email">Email</option>
                 <option value="mobile">Mobile No</option>
              </select>
           </div>

           <button 
             type="submit"
             disabled={isSearching}
             className="bg-black text-white px-8 py-3 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-[#c8b99a] hover:text-black transition-all disabled:opacity-50 flex items-center justify-center gap-2 rounded-sm"
           >
              {isSearching ? <RefreshCw className="animate-spin" size={14} /> : 'Search'}
           </button>
        </form>
      </div>


      {error && (
        <div className="bg-red-50 border border-red-100 p-4 rounded-sm flex items-center gap-2 text-red-600">
            <AlertCircle size={16} />
            <span className="text-[11px] font-bold uppercase tracking-tight">{error}</span>
        </div>
      )}

      <div className="bg-white border border-black/5 rounded-sm shadow-sm overflow-hidden min-h-[400px]">
        <div className="overflow-x-auto">
          {isLoading ? (
             <div className="h-64 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-black/10 border-t-black rounded-full animate-spin"></div>
             </div>
          ) : orders.length > 0 ? (
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-black/5 bg-black/[0.02]">
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-black/40">Order ID</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-black/40">Customer</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-black/40">Amount</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-black/40">Status</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-black/40 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-black/[0.01] transition-colors group">
                    <td className="px-6 py-5">
                      <span className="text-[11px] font-bold text-black">#{order.id}</span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="text-[11px] font-bold text-black uppercase tracking-tight">{order.customerName || order.user?.username || 'Unknown'}</div>
                    </td>
                    <td className="px-6 py-5 text-[11px] font-bold text-black">Rs {order.totalAmount || order.price}</td>
                    <td className="px-6 py-5">
                        <select 
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          className="text-[9px] font-bold uppercase tracking-widest bg-black/5 border-none px-2 py-1 rounded-sm focus:ring-1 focus:ring-black outline-none"
                        >
                            <option value="PENDING">PENDING</option>
                            <option value="PROCESSING">PROCESSING</option>
                            <option value="SHIPPED">SHIPPED</option>
                            <option value="DELIVERED">DELIVERED</option>
                            <option value="CANCELLED">CANCELLED</option>
                        </select>
                    </td>
                    <td className="px-6 py-5 text-right">
                         <Link 
                           href={`/admin/orders/${order.id}`}
                           className="bg-black text-white px-3 py-1.5 text-[9px] font-bold uppercase tracking-widest hover:bg-[#c8b99a] hover:text-black transition-all flex items-center gap-2 ml-auto w-fit"
                         >
                            Details <ChevronRight size={12} />
                         </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
             <div className="h-64 flex flex-col items-center justify-center text-black/20 italic">
                <ShoppingBag size={48} strokeWidth={0.5} className="mb-4" />
                No orders found.
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
