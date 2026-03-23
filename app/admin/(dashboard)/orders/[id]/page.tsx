'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Package, 
  MapPin, 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Clock, 
  CreditCard,
  ShoppingBag,
  CheckCircle2,
  AlertCircle,
  Truck,
  Printer
} from 'lucide-react';
import Link from 'next/link';
import { fetchOrderById, updateOrderStatus, getProductImageUrl } from '@/lib/api-service';

export default function OrderDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadOrder = async () => {
      try {
        const data = await fetchOrderById(id as string);
        setOrder(data);
      } catch (err) {
        setError('Failed to load order details. Please ensure Backend is running.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    if (id) loadOrder();
  }, [id]);

  const handleStatusUpdate = async (newStatus: string) => {
    try {
      await updateOrderStatus(id as string, newStatus);
      setOrder({...order, orderStatus: newStatus});
    } catch (err) {
      alert('Failed to update status.');
    }
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-orange-100 text-orange-600';
      case 'CONFIRMED': return 'bg-indigo-100 text-indigo-600';
      case 'PROCESSING': return 'bg-purple-100 text-purple-600';
      case 'SHIPPED': return 'bg-blue-100 text-blue-600';
      case 'DELIVERED': return 'bg-green-100 text-green-600';
      case 'CANCELLED': return 'bg-red-100 text-red-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  if (isLoading) return (
    <div className="min-h-[400px] flex items-center justify-center">
       <div className="w-10 h-10 border-4 border-black/10 border-t-black rounded-full animate-spin"></div>
    </div>
  );

  if (error || !order) return (
    <div className="flex flex-col items-center justify-center h-64 bg-red-50 rounded-sm border border-red-100 p-8 text-center text-red-600">
       <AlertCircle size={32} className="mb-4" />
       <p className="font-bold uppercase tracking-widest text-[11px]">{error || 'Order not found'}</p>
       <button onClick={() => router.back()} className="mt-6 text-[10px] font-bold underline uppercase tracking-widest">Go Back</button>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-fade-in pb-20">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-black/5 pb-8">
        <div className="flex items-center gap-4">
           <Link 
             href="/admin/orders" 
             className="p-3 bg-white border border-black/5 rounded-sm hover:bg-black hover:text-white transition-all shadow-sm"
           >
             <ArrowLeft size={18} />
           </Link>
           <div>
              <div className="flex items-center gap-3">
                 <h1 className="text-2xl font-bold tracking-tight text-black uppercase">Order #{order.orderId}</h1>
                 <span className={`px-2 py-1 text-[9px] font-bold uppercase tracking-widest rounded-full ${getStatusStyles(order.orderStatus || '')}`}>
                  {order.orderStatus}
                </span>
              </div>
              <p className="text-[10px] text-black/40 font-bold uppercase tracking-widest mt-1 flex items-center gap-2">
                 <Calendar size={12} /> {new Date(order.createdAt).toLocaleDateString()}
                 <Clock size={12} className="ml-2" /> {new Date(order.createdAt).toLocaleTimeString()}
              </p>
           </div>
        </div>

        <div className="flex items-center gap-2">
           <button className="flex items-center gap-2 px-4 py-3 bg-white border border-black/5 text-[10px] font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-all">
              <Printer size={16} /> Print
           </button>
           <select 
             className="bg-black text-white px-4 py-3 text-[10px] font-bold uppercase tracking-widest outline-none cursor-pointer hover:bg-[#c8b99a] hover:text-black transition-all"
             value={order.orderStatus}
             onChange={(e) => handleStatusUpdate(e.target.value)}
           >
              <option value="PENDING">SET TO PENDING</option>
              <option value="CONFIRMED">SET TO CONFIRMED</option>
              <option value="PROCESSING">SET TO PROCESSING</option>
              <option value="SHIPPED">SET TO SHIPPED</option>
              <option value="DELIVERED">SET TO DELIVERED</option>
              <option value="CANCELLED">SET TO CANCELLED</option>
              <option value="REFUNDED">SET TO REFUNDED</option>
           </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
         {/* Left Column: Customer & Shipping */}
         <div className="lg:col-span-2 space-y-10">
            
            {/* Customer Details */}
            <div className="bg-white p-8 border border-black/5 rounded-sm shadow-sm space-y-8">
               <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-black border-b border-black/5 pb-4">Customer Information</h2>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-black/5 rounded-full flex items-center justify-center text-black/20">
                           <User size={24} />
                        </div>
                        <div>
                           <p className="text-[9px] font-bold uppercase tracking-widest text-black/30">Customer Name</p>
                           <p className="text-sm font-bold text-black uppercase">{order.customerName}</p>
                        </div>
                     </div>
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-black/5 rounded-full flex items-center justify-center text-black/20">
                           <Mail size={24} />
                        </div>
                        <div>
                           <p className="text-[9px] font-bold uppercase tracking-widest text-black/30">Email Address</p>
                           <p className="text-sm font-bold text-black">{order.email}</p>
                        </div>
                     </div>
                  </div>
                  <div className="space-y-4">
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-black/5 rounded-full flex items-center justify-center text-black/20">
                           <Phone size={24} />
                        </div>
                        <div>
                           <p className="text-[9px] font-bold uppercase tracking-widest text-black/30">Mobile Number</p>
                           <p className="text-sm font-bold text-black">{order.mobileNo}</p>
                        </div>
                     </div>
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-black/5 rounded-full flex items-center justify-center text-black/20">
                           <MapPin size={24} />
                        </div>
                        <div>
                           <p className="text-[9px] font-bold uppercase tracking-widest text-black/30">Shipping Address</p>
                           <p className="text-sm font-bold text-black uppercase leading-tight">{order.address}</p>
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            {/* Order Items */}
            <div className="bg-white border border-black/5 rounded-sm shadow-sm overflow-hidden">
               <div className="px-8 py-6 border-b border-black/5">
                  <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-black">Product Item List</h2>
               </div>
               <div className="overflow-x-auto">
                  <table className="w-full text-left">
                     <thead>
                        <tr className="bg-black/[0.02] border-b border-black/5">
                           <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-black/40">Product</th>
                           <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-black/40">Variation</th>
                           <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-black/40">Price</th>
                           <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-black/40 text-center">Qty</th>
                           <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-black/40 text-right">Subtotal</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-black/5">
                        {order.items?.map((item: any) => {
                           const subtotal = (item.qty || item.quantity || 0) * (item.unitPrice || 0);
                           return (
                              <tr key={item.productId} className="hover:bg-black/[0.01] transition-colors">
                                 <td className="px-8 py-6">
                                    <div className="flex items-center gap-4">
                                       <div className="w-16 h-16 bg-black/[0.02] border border-black/5 rounded-sm overflow-hidden flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                                          {item.imageUrl ? (
                                             <img 
                                                src={getProductImageUrl(item.imageUrl)} 
                                                alt={item.productName}
                                                className="w-full h-full object-cover"
                                             />
                                          ) : (
                                             <Package size={24} className="text-black/10" />
                                          )}
                                       </div>
                                       <div className="space-y-1">
                                          <p className="text-[11px] font-bold uppercase text-black tracking-tight">{item.productName || `Product #${item.productId}`}</p>
                                          <p className="text-[9px] text-black/30 font-mono">ID: {item.productId}</p>
                                       </div>
                                    </div>
                                 </td>
                                 <td className="px-8 py-6">
                                    <div className="flex items-center gap-2">
                                       {item.size && (
                                          <span className="px-2 py-1 bg-black/5 text-[9px] font-bold text-black border border-black/5 rounded-sm">
                                             {item.size}
                                          </span>
                                       )}
                                       {item.color && (
                                          <div className="flex items-center gap-2 px-2 py-1 bg-black/5 border border-black/5 rounded-sm">
                                             <div 
                                                className="w-2 h-2 rounded-full border border-black/10" 
                                                style={{ backgroundColor: item.color.toLowerCase() }}
                                             />
                                             <span className="text-[9px] font-bold text-black uppercase">{item.color}</span>
                                          </div>
                                       )}
                                    </div>
                                 </td>
                                 <td className="px-8 py-6 text-[11px] font-bold text-black/60">
                                    Rs {(item.unitPrice || 0).toLocaleString()}
                                 </td>
                                 <td className="px-8 py-6 text-center">
                                    <span className="text-[11px] font-bold text-black tracking-widest">{item.qty || item.quantity} PCS</span>
                                 </td>
                                 <td className="px-8 py-6 text-right">
                                    <span className="text-[11px] font-bold text-black">Rs {subtotal.toLocaleString()}</span>
                                 </td>
                              </tr>
                           );
                        })}
                     </tbody>
                  </table>
               </div>
            </div>
         </div>

         {/* Right Column: Summary */}
         <div className="space-y-8">
            <div className="bg-black text-white p-8 rounded-sm shadow-2xl relative overflow-hidden">
               {/* Accent decoration */}
               <div className="absolute top-0 right-0 p-4 opacity-5">
                  <ShoppingBag size={120} />
               </div>

               <div className="relative z-10 space-y-8">
                  <div>
                     <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#c8b99a] mb-4">Payment Summary</h2>
                     <div className="flex items-center gap-2 text-white/60 mb-1">
                        <CreditCard size={14} />
                        <span className="text-[9px] font-bold uppercase tracking-widest">Method</span>
                     </div>
                     <p className="text-sm font-bold uppercase">{order.paymentMethod ? order.paymentMethod.replace(/_/g, ' ') : 'N/A'}</p>
                  </div>

                  <div className="space-y-3 pt-8 border-t border-white/10">
                     <div className="flex justify-between text-[11px]">
                        <span className="text-white uppercase tracking-widest">Store Total</span>
                        <span className="font-bold">Rs {order.total}</span>
                     </div>
                     <div className="flex justify-between text-[11px]">
                        <span className="text-white uppercase tracking-widest">Shipping</span>
                        <span className="text-green-400 font-bold uppercase">Free</span>
                     </div>
                     <div className="flex justify-between text-lg pt-4">
                        <span className="font-bold uppercase tracking-widest">Total</span>
                        <span className="font-bold text-[#c8b99a]">Rs {order.total}</span>
                     </div>
                  </div>
               </div>
            </div>

            <div className="bg-white p-8 border border-black/5 rounded-sm shadow-sm space-y-6">
               <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-black">Internal Tracking</h2>
               <div className="space-y-4">
                  <div className="flex items-center gap-3 text-green-600">
                     <CheckCircle2 size={16} />
                     <span className="text-[10px] font-bold uppercase tracking-widest">Order Verified</span>
                  </div>
                  <div className={`flex items-center gap-3 ${order.orderStatus === 'PENDING' ? 'text-black/30' : 'text-green-600'}`}>
                     <Truck size={16} />
                     <span className="text-[10px] font-bold uppercase tracking-widest font-bold">In Logistics</span>
                  </div>
               </div>
               <p className="text-[9px] text-black/40 italic mt-4 uppercase">
                  Last updated: {new Date(order.updateAt).toLocaleDateString()} at {new Date(order.updateAt).toLocaleTimeString()}
               </p>
            </div>
         </div>
      </div>
    </div>
  );
}
