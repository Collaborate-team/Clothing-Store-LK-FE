'use client';

import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  ChevronRight,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import { fetchAllOrders, updateOrderStatus } from '@/lib/api-service';
import { useNotification } from '@/context/NotificationContext';

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
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
    <div className="space-y-8 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-black flex items-center gap-3 uppercase">
             <ShoppingBag size={24} />
             Orders
          </h1>
          <p className="text-[10px] text-black/40 font-bold uppercase tracking-widest mt-1">Track and manage customer orders</p>
        </div>
        <button 
          onClick={loadOrders}
          className="p-3 border border-black/5 hover:bg-black hover:text-white transition-all rounded-sm"
        >
          <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
        </button>
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
