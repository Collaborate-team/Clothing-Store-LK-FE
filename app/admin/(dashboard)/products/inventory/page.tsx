'use client';

import React, { useState, useEffect } from 'react';
import { 
  Package, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  RefreshCw,
  Zap,
  ArrowRight
} from 'lucide-react';
import { getLowStockProducts, checkProductAvailability } from '@/lib/api-service';
import { useNotification } from '@/context/NotificationContext';

export default function InventoryPage() {
  const [lowStock, setLowStock] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { showNotification } = useNotification();
  
  // Availability Check State
  const [checkId, setCheckId] = useState('');
  const [isChecking, setIsChecking] = useState(false);

  const loadLowStock = async () => {
    setIsLoading(true);
    try {
      const data = await getLowStockProducts();
      setLowStock(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadLowStock();
  }, []);

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkId) return;

    setIsChecking(true);
    try {
      const isAvailable = await checkProductAvailability(checkId);
      if (isAvailable === true || (typeof isAvailable === 'object' && isAvailable.available)) {
        showNotification(`Product #${checkId} is currently IN STOCK and available for purchase.`, 'success', 'Item Available');
      } else {
        showNotification(`Product #${checkId} is OUT OF STOCK. Please restock soon.`, 'error', 'Stock Depleted');
      }
    } catch (err) {
      showNotification('Failed to connect to Backend. Please try again later.', 'error', 'Network Error');
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="space-y-10 animate-fade-in pb-20">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-black flex items-center gap-3 uppercase">
           <Zap size={24} className="text-[#c8b99a]" />
           Inventory Management
        </h1>
        <p className="text-[10px] text-black/40 font-bold uppercase tracking-widest mt-1">Real-time stock tracking and availability</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Availability Checker Tool */}
        <div className="lg:col-span-1 space-y-6">
           <div className="bg-black text-white p-10 rounded-sm shadow-[0_20px_50px_rgba(0,0,0,0.3)] relative overflow-hidden ring-1 ring-white/10">
              {/* Premium Accent */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#c8b99a]/10 blur-[60px] -translate-y-1/2 translate-x-1/2"></div>
              
              <div className="relative z-10">
                 <div className="flex items-center gap-3 mb-8">
                    <div className="p-2 bg-[#c8b99a] text-black rounded-sm shadow-lg">
                       <Zap size={16} />
                    </div>
                    <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-[#c8b99a]">Quick Availability Check</h2>
                 </div>

                 <form onSubmit={handleCheck} className="space-y-6">
                    <div className="space-y-3">
                       <label className="text-[10px] font-bold uppercase tracking-widest text-[#c8b99a] block ml-1">Stock ID / Item Code</label>
                       <div className="relative group">
                          <input 
                            type="text" 
                            placeholder="Type Code Here..."
                            className="w-full bg-[#111] border border-white/20 py-5 px-6 text-sm font-bold tracking-[0.2em] text-white outline-none focus:bg-white focus:text-black focus:border-[#c8b99a] focus:placeholder:text-black/20 transition-all duration-500 rounded-sm shadow-inner placeholder:text-white/30"
                            value={checkId}
                            onChange={(e) => setCheckId(e.target.value)}
                          />
                          <button 
                            type="submit"
                            disabled={isChecking}
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-3 bg-[#c8b99a] text-black hover:bg-white hover:shadow-2xl transition-all duration-300 rounded-sm disabled:opacity-50 group-focus-within:bg-black group-focus-within:text-white"
                          >
                             {isChecking ? <RefreshCw size={18} className="animate-spin" /> : <ArrowRight size={18} />}
                          </button>
                       </div>
                    </div>
                 </form>

                 <div className="mt-10 min-h-[120px] flex flex-col items-center justify-center border border-white/10 bg-white/[0.05] rounded-sm p-6 text-center group">
                    <div className="mb-3 opacity-40 group-hover:opacity-100 transition-opacity">
                       <Package size={32} strokeWidth={1} className="text-[#c8b99a]" />
                    </div>
                    <p className="text-[10px] uppercase font-bold text-white/50 tracking-[0.2em] leading-relaxed">
                       Enter a code above to<br/>check real-time stock status
                    </p>
                 </div>
              </div>
           </div>
        </div>

        {/* Low Stock Alerts Table */}
        <div className="lg:col-span-2 space-y-6">
           <div className="bg-white border border-black/5 rounded-sm shadow-sm overflow-hidden">
              <div className="px-8 py-6 border-b border-black/5 flex items-center justify-between">
                 <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-black">Low Stock Alerts</h2>
                 <button 
                   onClick={loadLowStock}
                   className="p-2 text-black/20 hover:text-black transition-colors"
                 >
                    <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
                 </button>
              </div>

              <div className="overflow-x-auto min-h-[300px]">
                 {isLoading ? (
                    <div className="h-64 flex items-center justify-center">
                       <div className="w-6 h-6 border-2 border-black/10 border-t-black rounded-full animate-spin"></div>
                    </div>
                 ) : lowStock.length > 0 ? (
                    <table className="w-full text-left">
                       <thead>
                          <tr className="bg-black/[0.02] border-b border-black/5">
                             <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-black/40">Product</th>
                             <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-black/40">Stock Left</th>
                             <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-black/40">Level</th>
                             <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-black/40 text-right">Action</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-black/5">
                          {lowStock.map((item) => (
                             <tr key={item.id} className="hover:bg-red-50/30 transition-colors">
                                <td className="px-8 py-5">
                                   <div className="flex items-center gap-3">
                                      <div className="w-10 h-10 bg-black/5 rounded-sm flex items-center justify-center">
                                         <Package size={20} className="text-black/10" />
                                      </div>
                                      <span className="text-[11px] font-bold uppercase text-black">{item.name || item.title || `Item #${item.id}`}</span>
                                   </div>
                                </td>
                                <td className="px-8 py-5">
                                   <span className="text-[11px] font-bold text-red-600 tracking-widest">{item.inventory || item.quantity || 0} PCS</span>
                                </td>
                                <td className="px-8 py-5 text-[10px] uppercase font-bold text-black/40 tracking-widest">
                                   Low Stock
                                </td>
                                <td className="px-8 py-5 text-right">
                                   <button className="text-[9px] font-bold uppercase tracking-widest text-black underline hover:text-[#c8b99a] transition-colors">
                                      Restock Now
                                   </button>
                                </td>
                             </tr>
                          ))}
                       </tbody>
                    </table>
                 ) : (
                    <div className="h-64 flex flex-col items-center justify-center text-black/20 italic">
                       <CheckCircle2 size={48} strokeWidth={0.5} className="mb-4 text-green-200" />
                       <p className="text-[10px] uppercase font-bold tracking-widest">Inventory Levels are optimal</p>
                    </div>
                 )}
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}
