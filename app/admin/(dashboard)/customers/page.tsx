'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Users, 
  Mail, 
  Phone, 
  ShoppingBag,
  Loader2,
  UserX,
  Search,
  Filter,
  X,
  RefreshCw,
  ChevronRight,
  Receipt,
  TrendingUp
} from 'lucide-react';
import { fetchAllCustomers, searchCustomersByType, getCustomerOrderHistory } from '@/app/api/api-service';
import { CustomerDTO } from '@/types/api-types';

interface CustomerWithInsights extends CustomerDTO {
  totalOrders?: number;
  totalSpend?: number;
  isLoadingInsights?: boolean;
}

export default function AdminCustomers() {
  const [customers, setCustomers] = useState<CustomerWithInsights[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<'name' | 'email' | 'mobile'>('name');
  const [isSearching, setIsSearching] = useState(false);

  const enrichWithInsights = useCallback(async (list: CustomerDTO[]): Promise<CustomerWithInsights[]> => {
    // Set as loading first
    const withLoading: CustomerWithInsights[] = list.map(c => ({ ...c, isLoadingInsights: true }));
    setCustomers(withLoading);

    // Fetch insights in parallel for each customer who has a mobileNo
    const enriched = await Promise.all(list.map(async (customer) => {
      if (!customer.mobileNo) return { ...customer, totalOrders: 0, totalSpend: 0, isLoadingInsights: false };
      try {
        const orders = await getCustomerOrderHistory(customer.mobileNo);
        const totalOrders = Array.isArray(orders) ? orders.length : 0;
        const totalSpend = Array.isArray(orders)
          ? orders.reduce((sum, o) => sum + (o.total || 0), 0)
          : 0;
        return { ...customer, totalOrders, totalSpend, isLoadingInsights: false };
      } catch {
        return { ...customer, totalOrders: 0, totalSpend: 0, isLoadingInsights: false };
      }
    }));
    return enriched;
  }, []);

  const loadCustomers = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await fetchAllCustomers();
      const list = Array.isArray(data) ? data : [];
      const enriched = await enrichWithInsights(list);
      setCustomers(enriched);
    } catch (err) {
      console.error('Failed to load customers', err);
    } finally {
      setIsLoading(false);
    }
  }, [enrichWithInsights]);

  useEffect(() => {
    loadCustomers();
  }, [loadCustomers]);

  const handleSearch = async (e?: { preventDefault?: () => void }) => {
    if (e?.preventDefault) e.preventDefault();
    if (!searchQuery.trim()) { loadCustomers(); return; }
    setIsSearching(true);
    try {
      const results = await searchCustomersByType(searchType, searchQuery);
      const enriched = await enrichWithInsights(results);
      setCustomers(enriched);
    } catch (err) {
      console.error('Search failed', err);
    } finally {
      setIsSearching(false);
    }
  };

  const clearSearch = () => { setSearchQuery(''); loadCustomers(); };

  if (isLoading && customers.length === 0) return (
    <div className="min-h-[400px] flex flex-col items-center justify-center gap-4">
       <Loader2 className="animate-spin text-brand" size={40} />
       <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-foreground/40">Loading customer database...</p>
    </div>
  );

  return (
    <div className="space-y-10 animate-fade-in pb-20 text-foreground">
      {/* Page Header & Search */}
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-3 uppercase">
             <Users size={24} className="text-brand" />
             Store Customers
          </h1>
          <p className="text-[10px] text-foreground/40 font-bold uppercase tracking-widest mt-1">
            Manage and track your customer base ({customers.length})
          </p>
        </div>

        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-stretch gap-3 w-full max-w-2xl bg-card p-2 border border-foreground/5 rounded-sm shadow-sm">
           <div className="relative flex-1 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/20 group-focus-within:text-brand transition-colors" size={16} />
              <input 
                type="text" 
                placeholder={`Search by ${searchType}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-foreground/[0.02] border border-transparent py-3 pl-11 pr-4 text-xs font-bold text-foreground outline-none focus:bg-card focus:border-foreground/5 transition-all rounded-sm uppercase tracking-widest placeholder:text-foreground/20"
              />
              {searchQuery && (
                <button type="button" onClick={clearSearch} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-foreground/5 rounded-full text-foreground/20 hover:text-foreground transition-all">
                  <X size={14} />
                </button>
              )}
           </div>
           <div className="relative min-w-[140px]">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/20" size={14} />
              <select 
                value={searchType}
                onChange={(e) => setSearchType(e.target.value as 'name' | 'email' | 'mobile')}
                className="w-full h-full bg-foreground/[0.02] border border-transparent py-3 pl-10 pr-8 text-[10px] font-bold uppercase tracking-widest text-foreground outline-none cursor-pointer hover:bg-foreground/[0.04] transition-all appearance-none rounded-sm"
              >
                 <option value="name">Name</option>
                 <option value="email">Email</option>
                 <option value="mobile">Mobile</option>
              </select>
           </div>
           <button 
             type="submit"
             disabled={isSearching}
             className="bg-foreground text-background px-8 py-3 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-brand hover:text-foreground transition-all disabled:opacity-50 flex items-center justify-center gap-2 rounded-sm"
           >
              {isSearching ? <RefreshCw className="animate-spin" size={14} /> : 'Search'}
           </button>
        </form>
      </div>

      {customers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {customers.map((customer) => (
            <div key={customer.id} className="bg-card border border-foreground/5 p-6 rounded-sm shadow-sm hover:border-foreground/20 transition-all group relative overflow-hidden">
               {/* Background Decoration */}
               <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Users size={80} />
               </div>

               <div className="flex items-start gap-4 mb-6 relative z-10">
                  <div className="w-14 h-14 bg-foreground text-background flex items-center justify-center font-bold text-lg rounded-full shadow-lg ring-2 ring-foreground/5 ring-offset-2 uppercase shrink-0">
                     {customer.name?.[0] || 'U'}
                  </div>
                  <div>
                     <h3 className="text-sm font-bold text-foreground uppercase tracking-tight mb-1">{customer.name || 'Unnamed User'}</h3>
                     <div className="flex items-center gap-1.5 text-foreground/40">
                        <Mail size={12} />
                        <span className="text-[10px] font-bold tracking-tight truncate max-w-[180px]">{customer.email}</span>
                     </div>
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-4 border-y border-foreground/5 py-4 mb-4 relative z-10">
                  <div className="space-y-1">
                     <p className="text-[9px] font-bold uppercase tracking-widest text-foreground/30">Mobile No</p>
                     <p className="text-[11px] font-bold text-foreground flex items-center gap-1.5">
                        <Phone size={12} className="text-brand" />
                        {customer.mobileNo || 'N/A'}
                     </p>
                  </div>
                  <div className="space-y-1">
                     <p className="text-[9px] font-bold uppercase tracking-widest text-foreground/30">Customer ID</p>
                     <p className="text-[11px] font-bold text-foreground uppercase font-mono">#{customer.id}</p>
                  </div>
               </div>

               {/* Customer Insights */}
               <div className="grid grid-cols-2 gap-3 mb-5 relative z-10">
                  <div className="bg-foreground/[0.03] rounded-sm p-3 border border-foreground/5">
                     <div className="flex items-center gap-1.5 text-brand mb-1">
                        <ShoppingBag size={12} />
                        <p className="text-[9px] font-bold uppercase tracking-widest text-foreground/40">Total Orders</p>
                     </div>
                     {customer.isLoadingInsights ? (
                       <div className="w-4 h-4 border-2 border-foreground/10 border-t-brand rounded-full animate-spin"></div>
                     ) : (
                       <p className="text-lg font-bold text-foreground">{customer.totalOrders ?? 0}</p>
                     )}
                  </div>
                  <div className="bg-foreground/[0.03] rounded-sm p-3 border border-foreground/5">
                     <div className="flex items-center gap-1.5 text-brand mb-1">
                        <TrendingUp size={12} />
                        <p className="text-[9px] font-bold uppercase tracking-widest text-foreground/40">Total Spend</p>
                     </div>
                     {customer.isLoadingInsights ? (
                       <div className="w-4 h-4 border-2 border-foreground/10 border-t-brand rounded-full animate-spin"></div>
                     ) : (
                       <p className="text-[13px] font-bold text-foreground">Rs {(customer.totalSpend ?? 0).toLocaleString()}</p>
                     )}
                  </div>
               </div>

               <div className="space-y-2 relative z-10 mb-5">
                  <div className="flex items-start gap-2 text-foreground/40 text-[10px] font-bold tracking-tight uppercase line-clamp-2">
                     Address: {customer.address || 'No address provided'}
                  </div>
               </div>

               <div className="flex gap-2 relative z-10">
                  <a
                    href={`/admin/customers/history?mobile=${customer.mobileNo}`}
                    className="flex-1 py-2 flex items-center justify-center gap-1.5 bg-foreground text-background text-[9px] font-bold uppercase tracking-widest hover:bg-brand hover:text-foreground transition-all rounded-sm"
                  >
                     <Receipt size={11} /> Order History
                  </a>
                  <button className="p-2 border border-foreground/5 text-foreground hover:bg-foreground hover:text-background transition-all rounded-sm">
                     <ChevronRight size={14} />
                  </button>
               </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="min-h-[400px] border-2 border-dashed border-foreground/5 rounded-sm flex flex-col items-center justify-center space-y-4">
            <UserX size={48} className="text-foreground/10" strokeWidth={1} />
            <div className="text-center">
               <p className="text-[12px] font-bold uppercase tracking-widest text-foreground/40">No customers found</p>
               <p className="text-[9px] text-foreground/20 uppercase font-bold tracking-widest mt-1">Database returns an empty collection</p>
            </div>
        </div>
      )}
    </div>
  );
}