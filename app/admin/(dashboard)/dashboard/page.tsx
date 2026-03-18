'use client';

import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  DollarSign, 
  Package, 
  AlertTriangle,
  ArrowUpRight,
  TrendingDown,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';
import { fetchAllOrders } from '@/lib/api-service';

const DashboardStats = [
  { 
    title: 'Total Revenue', 
    value: 'Rs 1,245,000', 
    change: '+12.5%', 
    isPositive: true, 
    icon: DollarSign,
    color: 'bg-green-500' 
  },
  { 
    title: 'Active Orders', 
    value: '48', 
    change: '+5.2%', 
    isPositive: true, 
    icon: ShoppingBag,
    color: 'bg-black' 
  },
  { 
    title: 'Products in Stock', 
    value: '154', 
    change: '-2%', 
    isPositive: false, 
    icon: Package,
    color: 'bg-[#c8b99a]' 
  },
  { 
    title: 'Low Stock', 
    value: '3', 
    change: 'Urgent', 
    isPositive: false, 
    icon: AlertTriangle,
    color: 'bg-red-500',
    href: '/admin/products/inventory'
  },
];

export default function AdminDashboard() {
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadRecentOrders = async () => {
      try {
        const orders = await fetchAllOrders();
        // Assuming API returns an array, take the first 5 (latest)
        setRecentOrders(Array.isArray(orders) ? orders.slice(0, 5) : []);
      } catch (err) {
        console.error('Failed to load dashboard orders', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadRecentOrders();
  }, []);

  return (
    <div className="space-y-10">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {DashboardStats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-white p-6 rounded-sm border border-black/5 hover:border-[#c8b99a]/50 transition-all duration-300 shadow-sm relative group overflow-hidden">
               {/* Accent line */}
               <div className={`absolute left-0 top-0 bottom-0 w-1 ${stat.color}`}></div>
               
               <div className="flex items-center justify-between mb-4">
                  <div className={`p-2 rounded-sm ${stat.color} text-white`}>
                     <Icon size={18} />
                  </div>
                  {stat.href && (
                    <Link href={stat.href} className="text-[10px] font-bold uppercase tracking-widest text-[#c8b99a] hover:text-black transition-colors flex items-center gap-1">
                      View <ChevronRight size={12} />
                    </Link>
                  )}
               </div>

               <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-black/40 mb-1">
                 {stat.title}
               </h3>
               
               <div className="flex items-end gap-2">
                 <p className="text-2xl font-bold tracking-tight text-black">
                   {stat.value}
                 </p>
                 <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-sm flex items-center gap-0.5 mb-1 ${
                   stat.isPositive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                 }`}>
                   {stat.isPositive ? <ArrowUpRight size={10} /> : <TrendingDown size={10} />}
                   {stat.change}
                 </span>
               </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Recent Orders Table */}
        <div className="bg-white p-8 rounded-sm border border-black/5 shadow-sm">
           <div className="flex items-center justify-between mb-8">
              <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-black">Recent Orders</h2>
              <Link href="/admin/orders" className="text-[10px] font-bold text-[#c8b99a] uppercase tracking-widest hover:text-black transition-colors">
                View All
              </Link>
           </div>
           
           <div className="min-h-[200px]">
              {isLoading ? (
                <div className="flex items-center justify-center h-48">
                   <div className="w-8 h-8 border-2 border-black/5 border-t-black rounded-full animate-spin"></div>
                </div>
              ) : recentOrders.length > 0 ? (
                <div className="overflow-x-auto">
                   <table className="w-full text-left">
                     <thead>
                       <tr className="border-b border-black/5 text-[9px] font-bold uppercase tracking-widest text-black/40">
                         <th className="pb-4">Customer</th>
                         <th className="pb-4">Status</th>
                         <th className="pb-4 text-right">Total</th>
                       </tr>
                     </thead>
                     <tbody className="divide-y divide-black/5">
                        {recentOrders.map((order) => (
                           <tr key={order.id} className="hover:bg-black/[0.01] transition-colors">
                             <td className="py-4">
                               <div className="flex flex-col">
                                 <span className="text-[11px] font-bold uppercase tracking-tight text-black">{order.customerName}</span>
                                 <span className="text-[8px] text-black/30 font-bold uppercase tracking-widest">#{order.orderId}</span>
                               </div>
                             </td>
                             <td className="py-4">
                                <span className={`px-2 py-0.5 text-[8px] font-bold uppercase tracking-widest rounded-full ${
                                  order.orderStatus === 'PENDING' ? 'bg-amber-50 text-amber-600' :
                                  order.orderStatus === 'DELIVERED' ? 'bg-green-50 text-green-600' :
                                  'bg-black/5 text-black'
                                }`}>
                                   {order.orderStatus}
                                </span>
                             </td>
                             <td className="py-4 text-right">
                                <span className="text-[11px] font-bold text-black">Rs {order.total?.toLocaleString()}</span>
                             </td>
                           </tr>
                        ))}
                     </tbody>
                   </table>
                </div>
              ) : (
                <div className="text-center py-20 border-2 border-dashed border-black/5 rounded-sm">
                    <ShoppingBag size={48} className="mx-auto text-black/5 mb-4" strokeWidth={0.5} />
                    <p className="text-[11px] font-bold uppercase tracking-widest text-black/40">No orders to display</p>
                </div>
              )}
           </div>
        </div>

        {/* Inventory Summary - Placeholder or Real */}
        <div className="bg-white p-8 rounded-sm border border-black/5 shadow-sm">
           <div className="flex items-center justify-between mb-8">
              <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-black">Inventory Quick-View</h2>
              <Link href="/admin/products/inventory" className="text-[10px] font-bold text-[#c8b99a] uppercase tracking-widest hover:text-black transition-colors">
                Manage
              </Link>
           </div>
           
           <div className="space-y-6">
               {['Polos', 'Henleys', 'Accessories'].map(cat => (
                 <div key={cat} className="space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-widest">
                       <span>{cat}</span>
                       <span className="text-black/40">75% Full</span>
                    </div>
                    <div className="h-1 bg-black/5 rounded-full overflow-hidden">
                       <div className="h-full bg-black/80 w-3/4 animate-grow-x"></div>
                    </div>
                 </div>
               ))}
           </div>
        </div>
      </div>
    </div>
  );
}
