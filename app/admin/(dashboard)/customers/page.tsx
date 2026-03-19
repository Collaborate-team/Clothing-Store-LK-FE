'use client';

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Mail, 
  Phone, 
  ShoppingBag,
  MoreVertical,
  Loader2,
  UserX,
  Search,
  Filter,
  X,
  RefreshCw
} from 'lucide-react';
import { fetchAllCustomers, searchCustomersByType } from '@/lib/api-service';
import { CustomerDTO } from '@/types/api-types';

export default function AdminCustomers() {
  const [customers, setCustomers] = useState<CustomerDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<'name' | 'email' | 'mobile'>('name');
  const [isSearching, setIsSearching] = useState(false);

  const loadCustomers = async () => {
    setIsLoading(true);
    try {
      const data = await fetchAllCustomers();
      setCustomers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load customers', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) {
      loadCustomers();
      return;
    }

    setIsSearching(true);
    try {
      const results = await searchCustomersByType(searchType, searchQuery);
      setCustomers(results);
    } catch (err) {
      console.error('Search failed', err);
    } finally {
      setIsSearching(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    loadCustomers();
  };

  if (isLoading && !isSearching) return (
    <div className="min-h-[400px] flex flex-col items-center justify-center gap-4">
       <Loader2 className="animate-spin text-[#c8b99a]" size={40} />
       <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-black/40">Synchronizing database...</p>
    </div>
  );

  return (
    <div className="space-y-10 animate-fade-in pb-20">
      {/* Page Header & Search */}
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-black flex items-center gap-3 uppercase">
             <Users size={24} className="text-[#c8b99a]" />
             Store Customers
          </h1>
          <p className="text-[10px] text-black/40 font-bold uppercase tracking-widest mt-1">Manage and track your customer base ({customers.length})</p>
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
                 <option value="name">Name</option>
                 <option value="email">Email</option>
                 <option value="mobile">Mobile</option>
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


      {customers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {customers.map((customer) => (
            <div key={customer.id} className="bg-white border border-black/5 p-6 rounded-sm shadow-sm hover:border-black/20 transition-all group relative overflow-hidden">
               {/* Background Decoration */}
               <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Users size={80} />
               </div>

               <div className="flex items-start gap-4 mb-6 relative z-10">
                  <div className="w-14 h-14 bg-black text-white flex items-center justify-center font-bold text-lg rounded-full shadow-lg ring-2 ring-black/5 ring-offset-2 uppercase">
                     {customer.name?.[0] || 'U'}
                  </div>
                  <div>
                     <h3 className="text-sm font-bold text-black uppercase tracking-tight mb-1">{customer.name || 'Unnamed User'}</h3>
                     <div className="flex items-center gap-1.5 text-black/40">
                        <Mail size={12} />
                        <span className="text-[10px] font-bold tracking-tight">{customer.email}</span>
                     </div>
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-4 border-y border-black/5 py-4 mb-6 relative z-10">
                  <div className="space-y-1">
                     <p className="text-[9px] font-bold uppercase tracking-widest text-black/30">Mobile No</p>
                     <p className="text-[11px] font-bold text-black flex items-center gap-1.5 uppercase">
                        <Phone size={12} className="text-[#A37B5C]" />
                        {customer.mobileNo || 'N/A'}
                     </p>
                  </div>
                  <div className="space-y-1">
                     <p className="text-[9px] font-bold uppercase tracking-widest text-black/30">ID Vector</p>
                     <p className="text-[11px] font-bold text-black uppercase">#{customer.id}</p>
                  </div>
               </div>

               <div className="space-y-2 relative z-10">
                  <div className="flex items-start gap-2 text-black/40">
                     <span className="text-[10px] font-bold tracking-tight uppercase line-clamp-2">Address: {customer.address || 'No address provided'}</span>
                  </div>
               </div>

               <div className="mt-6 flex gap-2 relative z-10">
                  <button className="flex-1 py-2 bg-black text-white text-[9px] font-bold uppercase tracking-widest hover:bg-[#c8b99a] hover:text-black transition-all">
                     View History
                  </button>
                  <button className="p-2 border border-black/5 text-black hover:bg-black hover:text-white transition-all rounded-sm">
                     <MoreVertical size={14} />
                  </button>
               </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="min-h-[400px] border-2 border-dashed border-black/5 rounded-sm flex flex-col items-center justify-center space-y-4">
            <UserX size={48} className="text-black/10" strokeWidth={1} />
            <div className="text-center">
               <p className="text-[12px] font-bold uppercase tracking-widest text-black/40">No actual customers found</p>
               <p className="text-[9px] text-black/10 uppercase font-bold tracking-widest">Database returns an empty collection</p>
            </div>
        </div>
      )}
    </div>
  );
}
