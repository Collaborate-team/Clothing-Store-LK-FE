'use client';

import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  DollarSign, 
  ShoppingBag, 
  Users, 
  ArrowUpRight,
  TrendingDown,
  Package,
  Loader2,
  PieChart
} from 'lucide-react';
import { getDashboardAnalytics } from '@/app/api/api-service';
import { AnalyticsDTO } from '@/types/api-types';

export default function AdminAnalytics() {
  const [data, setData] = useState<AnalyticsDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const result = await getDashboardAnalytics();
        setData(result);
      } catch (err) {
        console.error('Failed to load analytics', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadAnalytics();
  }, []);

  if (isLoading) return (
    <div className="min-h-[400px] flex flex-col items-center justify-center gap-4">
       <Loader2 className="animate-spin text-black/20" size={40} />
       <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-black/40">Calculating store metrics...</p>
    </div>
  );

  return (
    <div className="space-y-10 animate-fade-in">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-black flex items-center gap-3 uppercase">
           <BarChart3 size={24} />
           Performance Statistics
        </h1>
        <p className="text-[10px] text-black/40 font-bold uppercase tracking-widest mt-1">Live data from your storefront</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 bg-white border border-black/5 p-8 rounded-sm shadow-sm relative overflow-hidden group">
           <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:20px_20px]"></div>

           <div className="flex items-center justify-between mb-10 relative z-10">
              <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-black">Revenue Accumulation</h2>
              <div className="flex items-center gap-4">
                 <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-black rounded-full"></div>
                    <span className="text-[9px] font-bold uppercase tracking-widest text-black/40">Real-time Data</span>
                 </div>
              </div>
           </div>
           
           <div className="h-64 flex flex-col items-center justify-center relative z-10 bg-black/[0.01] border-2 border-dashed border-black/5 rounded-sm">
              <BarChart3 size={48} className="text-black/5 mb-4" strokeWidth={0.5} />
              <p className="text-[11px] font-bold uppercase tracking-widest text-black/40">Accumulating Historical Data</p>
              <p className="text-[8px] text-black/30 mt-2 uppercase tracking-widest">Showing total: Rs {data?.totalRevenue?.toLocaleString() || 0}</p>
           </div>
        </div>

        <div className="bg-white border border-black/5 p-8 rounded-sm shadow-sm flex flex-col justify-between">
           <div>
              <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-black mb-8">Stock Distribution</h2>
              <div className="space-y-6">
                 <div className="space-y-2">
                    <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest">
                       <span>Total Products</span>
                       <span className="text-black/40">{data?.totalProducts || 0}</span>
                    </div>
                    <div className="h-1 bg-black/5 rounded-full overflow-hidden">
                       <div className="h-full bg-black transition-all duration-1000 animate-grow-x w-full"></div>
                    </div>
                 </div>

                 <div className="space-y-2">
                    <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest">
                       <span>Low Stock</span>
                       <span className="text-black/40">{data?.lowStockProducts || 0}</span>
                    </div>
                    <div className="h-1 bg-black/5 rounded-full overflow-hidden">
                       <div className="h-full bg-red-400 transition-all duration-1000 animate-grow-x" style={{ width: `${(data?.lowStockProducts || 0) / (data?.totalProducts || 1) * 100}%` }}></div>
                    </div>
                 </div>
              </div>
           </div>
           
           <div className="flex flex-col items-center justify-center p-6 bg-black/[0.01] rounded-sm mt-8">
              <PieChart size={32} className="text-black/10 mb-2" />
              <p className="text-[10px] uppercase font-bold text-black/40 tracking-widest">Inventory Health Active</p>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 mt-10 gap-10">
         <div className="p-8 bg-black text-white rounded-sm shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[300px]">
            <div className="absolute -bottom-10 -right-10 opacity-10">
               <DollarSign size={200} />
            </div>
            
            <div className="relative z-10">
               <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#c8b99a] mb-2">Total Accumulated Revenue</p>
               <h3 className="text-4xl font-bold tracking-tighter mb-4">Rs {data?.totalRevenue?.toLocaleString() || 0}</h3>
               <div className="flex items-center gap-2 text-[#c8b99a]">
                  <ArrowUpRight size={16} />
                  <span className="text-xs font-bold uppercase tracking-widest">Real-time stats from database</span>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-8 relative z-10 mt-10">
               <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-1">Total Orders</p>
                   <p className="text-lg font-bold">{data?.totalOrders || 0}</p>
               </div>
               <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-1">Total Customers</p>
                   <p className="text-lg font-bold">{data?.totalCustomers || 0}</p>
               </div>
            </div>
         </div>

         <div className="flex flex-col gap-6">
            {[
              { title: 'Active Orders', value: data?.activeOrders || 0, desc: 'Current processing list', icon: ShoppingBag },
              { title: 'Products in Stock', value: data?.productsInStock || 0, desc: 'Live inventory count', icon: Package },
              { title: 'Efficiency Stats', value: 'Enabled', desc: 'Tracking active performance', icon: BarChart3, isGood: true },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="bg-white border border-black/5 p-6 rounded-sm flex items-center gap-6 shadow-sm hover:translate-x-2 transition-all group">
                   <div className="p-4 bg-black/5 rounded-sm group-hover:bg-black group-hover:text-white transition-all">
                      <Icon size={24} strokeWidth={1.5} />
                   </div>
                   <div className="flex-1">
                      <p className="text-[9px] font-bold uppercase tracking-widest text-black/40 mb-1">{item.title}</p>
                      <p className="text-md font-bold text-black uppercase tracking-tight">{item.value}</p>
                   </div>
                   <div className="text-right">
                      <p className={`text-[9px] font-bold uppercase tracking-widest ${item.isGood ? 'text-green-600' : 'text-[#c8b99a]'}`}>{item.desc}</p>
                   </div>
                </div>
              );
            })}
         </div>
      </div>
    </div>
  );
}