'use client';

import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ShoppingBag, 
  Users, 
  ArrowUpRight,
  TrendingDown as TrendingDownIcon,
  ChevronRight,
  Package
} from 'lucide-react';

export default function AdminAnalytics() {
  return (
    <div className="space-y-10 animate-fade-in">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-black flex items-center gap-3 uppercase">
           <BarChart3 size={24} />
           Analytics
        </h1>
        <p className="text-[10px] text-black/40 font-bold uppercase tracking-widest mt-1">Deep insights into your store performance</p>
      </div>

      {/* Main Charts Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 bg-white border border-black/5 p-8 rounded-sm shadow-sm relative overflow-hidden group">
           {/* Grid Background Mock */}
           <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:20px_20px]"></div>

           <div className="flex items-center justify-between mb-10 relative z-10">
              <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-black">Revenue Over Time</h2>
              <div className="flex items-center gap-4">
                 <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-black rounded-full"></div>
                    <span className="text-[9px] font-bold uppercase tracking-widest text-black/40">This Month</span>
                 </div>
                 <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-[#c8b99a] rounded-full"></div>
                    <span className="text-[9px] font-bold uppercase tracking-widest text-black/40">Last Month</span>
                 </div>
              </div>
           </div>
           
           <div className="h-64 flex items-end justify-between gap-4 relative z-10 box-border px-4">
              {[65, 45, 75, 55, 90, 85, 95].map((h, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-4 group/bar h-full justify-end">
                   <div className="flex gap-1 items-end h-full">
                      <div className="w-3 bg-black rounded-t-sm transition-all duration-700 hover:bg-[#c8b99a] group-hover/bar:animate-pulse" style={{ height: `${h}%` }}></div>
                      <div className="w-3 bg-black/10 rounded-t-sm" style={{ height: `${h * 0.7}%` }}></div>
                   </div>
                   <span className="text-[8px] font-bold uppercase tracking-widest text-black/20 group-hover/bar:text-black transition-colors">Mon {i + 1}</span>
                </div>
              ))}
           </div>
        </div>

        <div className="bg-white border border-black/5 p-8 rounded-sm shadow-sm flex flex-col justify-between">
           <div>
              <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-black mb-8">Sales by Category</h2>
              <div className="space-y-6">
                 {[
                   { name: 'Women', percentage: 45, color: 'bg-black' },
                   { name: 'Men', percentage: 35, color: 'bg-[#c8b99a]' },
                   { name: 'Kids', percentage: 15, color: 'bg-black/40' },
                   { name: 'Accessories', percentage: 5, color: 'bg-black/10' },
                 ].map(cat => (
                   <div key={cat.name} className="space-y-2">
                      <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest">
                         <span>{cat.name}</span>
                         <span className="text-black/40">{cat.percentage}%</span>
                      </div>
                      <div className="h-1 bg-black/5 rounded-full overflow-hidden">
                         <div className={`h-full ${cat.color} transition-all duration-1000 animate-grow-x`} style={{ width: `${cat.percentage}%` }}></div>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
           
           <button className="w-full mt-10 py-3 border border-black/5 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-black hover:text-white transition-all duration-500">
              Generate Detailed Report
           </button>
        </div>
      </div>

      {/* Stats Summary Area */}
      <div className="grid grid-cols-1 md:grid-cols-2 mt-10 gap-10">
         <div className="p-8 bg-black text-white rounded-sm shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[300px]">
            {/* Background Decoration */}
            <div className="absolute -bottom-10 -right-10 opacity-10">
               <DollarSign size={200} />
            </div>
            
            <div className="relative z-10">
               <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#c8b99a] mb-2">Total Accumulated Sales</p>
               <h3 className="text-4xl font-bold tracking-tighter mb-4">Rs 4,682,000</h3>
               <div className="flex items-center gap-2 text-green-400">
                  <ArrowUpRight size={16} />
                  <span className="text-xs font-bold uppercase tracking-widest">+22.5% vs Previous Month</span>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-8 relative z-10 mt-10">
               <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-1">Total Profits</p>
                   <p className="text-lg font-bold">Rs 1,240,000</p>
               </div>
               <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-1">Store Conversion</p>
                   <p className="text-lg font-bold">12.4%</p>
               </div>
            </div>
         </div>

         <div className="flex flex-col gap-6">
            {[
              { title: 'Top Performer', value: 'Cutwork Dress', desc: '124 units sold', icon: Package },
              { title: 'Average Order', value: 'Rs 8,450', desc: '+5% this week', icon: ShoppingBag },
              { title: 'Refund Rate', value: '1.2%', desc: 'Optimal range', icon: TrendingDownIcon, isGood: true },
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
