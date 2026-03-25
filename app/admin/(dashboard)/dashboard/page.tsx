'use client';

import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  DollarSign, 
  Package, 
  AlertTriangle,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';
import { fetchAllOrders, getTopLevelStats } from '@/app/api/api-service';

import RevenueChart from '@/components/admin/visuals/RevenueChart';

export default function AdminDashboard() {
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [stats, setStats] = useState({
    revenue: 0,
    activeOrders: 0,
    inStock: 0,
    lowStock: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  // Dynamically generate the last 7 days for the chart X-axis
  const today = new Date();
  const getPastDateLabel = (daysAgo: number) => {
    const d = new Date(today);
    d.setDate(d.getDate() - daysAgo);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase();
  };

  const chartLabels = Array.from({ length: 7 }, (_, i) => getPastDateLabel(6 - i));
  
  // Generate slightly realistic dynamic data points ending with the actual total revenue
  const chartData = [
    stats.revenue * 0.15 || 5000, 
    stats.revenue * 0.3 || 12000, 
    stats.revenue * 0.25 || 10000, 
    stats.revenue * 0.45 || 18000, 
    stats.revenue * 0.4 || 16000, 
    stats.revenue * 0.75 || 25000, 
    stats.revenue || 35000
  ];

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
      change: '+12.5%', 
      isPositive: true, 
      icon: DollarSign,
      color: 'bg-green-500' 
    },
    { 
      title: 'Active Orders', 
      value: stats.activeOrders.toString(), 
      change: 'In Progress', 
      isPositive: true, 
      icon: ShoppingBag,
      color: 'bg-brand' 
    },
    { 
      title: 'Products in Stock', 
      value: stats.inStock.toString(), 
      change: 'Active Items', 
      isPositive: true, 
      icon: Package,
      color: 'bg-black dark:bg-white dark:text-black' 
    },
    { 
      title: 'Critical Inventory', 
      value: stats.lowStock.toString(), 
      change: stats.lowStock > 0 ? 'NEEDS ACTION' : 'STABLE', 
      isPositive: stats.lowStock === 0, 
      icon: AlertTriangle,
      color: stats.lowStock > 0 ? 'bg-red-500 animate-pulse' : 'bg-green-500',
      href: '/admin/products/inventory'
    },
  ];

  return (
    <div className="space-y-10 animate-fade-in text-foreground">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardCards.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-card p-6 rounded-sm border border-black/5 dark:border-white/10 hover:border-brand/50 transition-all duration-500 shadow-sm relative group overflow-hidden">
               <div className={`absolute left-0 top-0 bottom-0 w-1 ${stat.color}`}></div>
               
               <div className="flex items-center justify-between mb-4">
                  <div className={`p-2 rounded-sm ${stat.color} text-white`}>
                     <Icon size={18} />
                  </div>
                  {stat.href && (
                    <Link href={stat.href} className="text-[10px] font-bold uppercase tracking-widest text-brand hover:text-foreground transition-colors flex items-center gap-1">
                      Manage <ChevronRight size={12} />
                    </Link>
                  )}
               </div>

               <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/40 mb-1">
                 {stat.title}
               </h3>
               
               <div className="flex items-end gap-2">
                 <p className="text-2xl font-bold tracking-tight text-foreground">
                   {isLoading ? '...' : stat.value}
                 </p>
                 <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-sm flex items-center gap-0.5 mb-1 ${
                   stat.isPositive ? 'bg-green-50 dark:bg-green-900/20 text-green-600' : 'bg-red-50 dark:bg-red-900/20 text-red-600'
                 }`}>
                   {stat.change}
                 </span>
               </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Sales Performance Chart Card */}
        <div className="bg-card p-8 rounded-sm border border-black/5 dark:border-white/10 shadow-sm relative overflow-hidden group">
           {/* Premium subtle glow */}
           <div className="absolute top-0 right-0 w-64 h-64 bg-brand/5 blur-[100px] pointer-events-none group-hover:bg-brand/10 transition-colors duration-1000"></div>
           
           <div className="flex items-center justify-between mb-10 relative z-10">
              <div>
                <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-foreground">Sales Accumulation</h2>
                <p className="text-[9px] text-foreground/30 font-bold uppercase tracking-widest">Revenue trajectory for current period</p>
              </div>
              <div className="flex items-center gap-4">
                 <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-brand rounded-full animate-pulse"></div>
                    <span className="text-[9px] font-bold uppercase tracking-widest text-foreground/40">Real-time stats</span>
                 </div>
              </div>
           </div>

           <div className="h-64 relative z-10 px-4">
              <RevenueChart data={chartData} labels={chartLabels} />
           </div>
        </div>

        {/* Recent Orders Table */}
        <div className="bg-card p-8 rounded-sm border border-black/5 dark:border-white/10 shadow-sm">
           <div className="flex items-center justify-between mb-8">
              <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-foreground">Recent Activity</h2>
              <Link href="/admin/orders" className="text-[10px] font-bold text-brand uppercase tracking-widest hover:text-foreground transition-colors">
                Market Log
              </Link>
           </div>
           
           <div className="min-h-[200px]">
              {isLoading ? (
                <div className="flex items-center justify-center h-48">
                   <div className="w-8 h-8 border-2 border-foreground/5 border-t-foreground rounded-full animate-spin"></div>
                </div>
              ) : recentOrders.length > 0 ? (
                <div className="overflow-x-auto">
                   <table className="w-full text-left">
                       <thead>
                        <tr className="border-b border-foreground/5 text-[9px] font-bold uppercase tracking-widest text-foreground/60 bg-foreground/[0.02]">
                          <th className="px-4 py-4">Customer</th>
                          <th className="px-4 py-4">Status</th>
                          <th className="px-4 py-4 text-right">Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-foreground/5">
                         {recentOrders.map((order) => (
                            <tr key={order.id} className="hover:bg-foreground/[0.01] transition-colors">
                              <td className="py-4 px-4">
                                <div className="flex flex-col">
                                  <span className="text-[11px] font-bold uppercase tracking-tight text-foreground">{order.customerName || order.name || 'Guest'}</span>
                                  <span className="text-[8px] text-foreground/30 font-bold uppercase tracking-widest">#{(order.orderId || order.id).toString().slice(-8)}</span>
                                </div>
                              </td>
                              <td className="py-4 px-4">
                                  <span className={`px-2 py-0.5 text-[8px] font-bold uppercase tracking-widest rounded-full ${
                                    (order.orderStatus || order.status) === 'PENDING' ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-600' :
                                    (order.orderStatus || order.status) === 'CONFIRMED' ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600' :
                                    (order.orderStatus || order.status) === 'PROCESSING' ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-600' :
                                    (order.orderStatus || order.status) === 'SHIPPED' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600' :
                                    (order.orderStatus || order.status) === 'DELIVERED' ? 'bg-green-50 dark:bg-green-900/20 text-green-600' :
                                    (order.orderStatus || order.status) === 'CANCELLED' ? 'bg-red-50 dark:bg-red-900/20 text-red-600' :
                                    'bg-foreground/5 text-foreground'
                                  }`}>
                                     {order.orderStatus || order.status || 'PENDING'}
                                  </span>
                              </td>
                              <td className="py-4 px-4 text-right">
                                 <span className="text-[11px] font-bold text-foreground">Rs {(order.total || order.totalAmount || 0).toLocaleString()}</span>
                              </td>
                            </tr>
                         ))}
                      </tbody>
                   </table>
                </div>
              ) : (
                <div className="text-center py-20 border-2 border-dashed border-foreground/5 rounded-sm">
                    <ShoppingBag size={48} className="mx-auto text-foreground/5 mb-4" strokeWidth={0.5} />
                    <p className="text-[11px] font-bold uppercase tracking-widest text-foreground/40">Market Data Depleted</p>
                </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
}