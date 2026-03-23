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
import { fetchAllOrders, getTopLevelStats } from '@/lib/api-service';

export default function AdminDashboard() {
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [stats, setStats] = useState({
    revenue: 0,
    activeOrders: 0,
    inStock: 0,
    lowStock: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [orders, topStats] = await Promise.all([
          fetchAllOrders(),
          getTopLevelStats()
        ]);
        
        setRecentOrders(Array.isArray(orders) ? orders.slice(0, 5) : []);
        
        let lowStockCount = 0;
        if (Array.isArray(topStats.lowStock)) {
          lowStockCount = topStats.lowStock.length;
        } else if (typeof topStats.lowStock === 'number') {
          lowStockCount = topStats.lowStock;
        } else if (topStats.lowStockProducts !== undefined) {
          lowStockCount = topStats.lowStockProducts;
        }

        setStats({
          revenue: topStats.revenue || 0,
          activeOrders: topStats.activeOrders || 0,
          inStock: topStats.inStock || 0,
          lowStock: lowStockCount
        });
      } catch (err) {
        console.error('Failed to load dashboard data', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadDashboardData();
  }, []);

  const dashboardCards = [
    { 
      title: 'Total Revenue', 
      value: `Rs ${stats.revenue.toLocaleString()}`, 
      change: 'Calculated from orders', 
      isPositive: true, 
      icon: DollarSign,
      color: 'bg-green-500' 
    },
    { 
      title: 'Active Orders', 
      value: stats.activeOrders.toString(), 
      change: 'Current backlog', 
      isPositive: true, 
      icon: ShoppingBag,
      color: 'bg-black' 
    },
    { 
      title: 'Products in Stock', 
      value: stats.inStock.toString(), 
      change: 'Active inventory', 
      isPositive: true, 
      icon: Package,
      color: 'bg-[#c8b99a]' 
    },
    { 
      title: 'Low Stock', 
      value: stats.lowStock.toString(), 
      change: 'Requires attention', 
      isPositive: stats.lowStock === 0, 
      icon: AlertTriangle,
      color: 'bg-red-500',
      href: '/admin/products'
    },
  ];

  return (
    <div className="space-y-10">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardCards.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-white p-6 rounded-sm border border-black/5 hover:border-[#c8b99a]/50 transition-all duration-300 shadow-sm relative group overflow-hidden">
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
                   {isLoading ? '...' : stat.value}
                 </p>
                 <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-sm flex items-center gap-0.5 mb-1 ${
                   stat.isPositive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                 }`}>
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
                        <tr className="border-b border-black/10 text-[9px] font-bold uppercase tracking-widest text-black/60 bg-black/[0.02]">
                          <th className="px-4 py-4">Customer</th>
                          <th className="px-4 py-4">Status</th>
                          <th className="px-4 py-4 text-right">Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-black/5">
                         {recentOrders.map((order) => (
                            <tr key={order.id} className="hover:bg-black/[0.01] transition-colors">
                              <td className="py-4 px-4">
                                <div className="flex flex-col">
                                  <span className="text-[11px] font-bold uppercase tracking-tight text-black">{order.customerName || order.name || 'Guest'}</span>
                                  <span className="text-[8px] text-black/30 font-bold uppercase tracking-widest">#{order.orderId || order.id}</span>
                                </div>
                              </td>
                              <td className="py-4 px-4">
                                  <span className={`px-2 py-0.5 text-[8px] font-bold uppercase tracking-widest rounded-full ${
                                    (order.orderStatus || order.status) === 'PENDING' ? 'bg-amber-50 text-amber-600' :
                                    (order.orderStatus || order.status) === 'CONFIRMED' ? 'bg-indigo-50 text-indigo-600' :
                                    (order.orderStatus || order.status) === 'PROCESSING' ? 'bg-purple-50 text-purple-600' :
                                    (order.orderStatus || order.status) === 'SHIPPED' ? 'bg-blue-50 text-blue-600' :
                                    (order.orderStatus || order.status) === 'DELIVERED' ? 'bg-green-50 text-green-600' :
                                    (order.orderStatus || order.status) === 'CANCELLED' ? 'bg-red-50 text-red-600' :
                                    (order.orderStatus || order.status) === 'REFUNDED' ? 'bg-gray-100 text-gray-600' :
                                    'bg-black/5 text-black'
                                  }`}>
                                     {order.orderStatus || order.status || 'PENDING'}
                                  </span>
                              </td>
                              <td className="py-4 px-4 text-right">
                                 <span className="text-[11px] font-bold text-black">Rs {(order.total || order.totalAmount || 0).toLocaleString()}</span>
                              </td>
                            </tr>
                         ))}
                      </tbody>
                   </table>
                </div>
              ) : (
                <div className="text-center py-20 border-2 border-dashed border-black/5 rounded-sm">
                    <ShoppingBag size={48} className="mx-auto text-black/5 mb-4" strokeWidth={0.5} />
                    <p className="text-[11px] font-bold uppercase tracking-widest text-black/40">No actual orders found</p>
                </div>
              )}
           </div>
        </div>

        {/* Inventory Summary - Dynamic and clean */}
        <div className="bg-white p-8 rounded-sm border border-black/5 shadow-sm">
           <div className="flex items-center justify-between mb-8">
              <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-black">Inventory Quick-View</h2>
              <Link href="/admin/products" className="text-[10px] font-bold text-[#c8b99a] uppercase tracking-widest hover:text-black transition-colors">
                Manage
              </Link>
           </div>
           
           <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
              <Package size={40} className="text-black/10" strokeWidth={1} />
              <div className="space-y-1">
                 <p className="text-[11px] font-bold uppercase tracking-widest text-black/40">Real-time inventory active</p>
                 <p className="text-[9px] text-black/20 uppercase font-bold tracking-widest">Showing data from live database</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
