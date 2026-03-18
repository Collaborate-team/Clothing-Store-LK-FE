'use client';

import React from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  ShoppingBag,
  MoreVertical,
  CheckCircle2
} from 'lucide-react';

const MOCK_CUSTOMERS = [
  { id: 1, name: 'Kasun Perera', email: 'kasun@example.com', phone: '071 234 5678', orders: 12, spent: 'Rs 145,000', joined: '2025-01-15' },
  { id: 2, name: 'Sanduni Silva', email: 'sanduni@example.com', phone: '077 112 3344', orders: 5, spent: 'Rs 45,600', joined: '2025-02-10' },
  { id: 3, name: 'Nimal Jayasuriya', email: 'nimal@example.com', phone: '070 998 8776', orders: 8, spent: 'Rs 12,400', joined: '2025-03-01' },
];

export default function AdminCustomers() {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-black flex items-center gap-3 uppercase">
           <Users size={24} />
           Customers
        </h1>
        <p className="text-[10px] text-black/40 font-bold uppercase tracking-widest mt-1">Manage customer profiles and history</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_CUSTOMERS.map((customer) => (
          <div key={customer.id} className="bg-white border border-black/5 p-6 rounded-sm shadow-sm hover:border-black/20 transition-all group relative overflow-hidden">
             {/* Background Decoration */}
             <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <Users size={80} />
             </div>

             <div className="flex items-start gap-4 mb-6 relative z-10">
                <div className="w-14 h-14 bg-black text-white flex items-center justify-center font-bold text-lg rounded-full shadow-lg ring-2 ring-black/5 ring-offset-2 uppercase">
                   {customer.name[0]}
                </div>
                <div>
                   <h3 className="text-sm font-bold text-black uppercase tracking-tight mb-1">{customer.name}</h3>
                   <div className="flex items-center gap-1.5 text-black/40">
                      <Mail size={12} />
                      <span className="text-[10px] font-bold tracking-tight">{customer.email}</span>
                   </div>
                </div>
             </div>

             <div className="grid grid-cols-2 gap-4 border-y border-black/5 py-4 mb-6 relative z-10">
                <div className="space-y-1">
                   <p className="text-[9px] font-bold uppercase tracking-widest text-black/30">Total Orders</p>
                   <p className="text-sm font-bold text-black flex items-center gap-1.5">
                      <ShoppingBag size={14} className="text-[#A37B5C]" />
                      {customer.orders}
                   </p>
                </div>
                <div className="space-y-1">
                   <p className="text-[9px] font-bold uppercase tracking-widest text-black/30">Total Spent</p>
                   <p className="text-sm font-bold text-black">{customer.spent}</p>
                </div>
             </div>

             <div className="space-y-2 relative z-10">
                <div className="flex items-center gap-2 text-black/40">
                   <Phone size={12} />
                   <span className="text-[10px] font-bold tracking-tight uppercase">{customer.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-black/40">
                   <Calendar size={12} />
                   <span className="text-[10px] font-bold tracking-tight uppercase">Joined {customer.joined}</span>
                </div>
             </div>

             <div className="mt-6 flex gap-2 relative z-10">
                <button className="flex-1 py-2 bg-black text-white text-[9px] font-bold uppercase tracking-widest hover:bg-[#c8b99a] hover:text-black transition-all">
                   View Profile
                </button>
                <button className="p-2 border border-black/5 text-black hover:bg-black hover:text-white transition-all rounded-sm">
                   <MoreVertical size={14} />
                </button>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
}
