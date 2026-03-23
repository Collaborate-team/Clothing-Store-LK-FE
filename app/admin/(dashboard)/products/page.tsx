'use client';

import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Package,
  AlertCircle,
  RefreshCw,
  ExternalLink,
  Tag,
  Eye,
  ShoppingBag,
  X
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { fetchAllProducts, deleteProduct, getProductImageUrl } from '@/app/api/api-service';
import { useNotification } from '@/context/NotificationContext';
import { useModal } from '@/context/ModalContext';


export default function AdminProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const { showNotification } = useNotification();
  const { showConfirm } = useModal();

  const loadProducts = async () => {
    setIsLoading(true);
    try {
      const data = await fetchAllProducts();
      setProducts(Array.isArray(data) ? data : []);
      setError('');
    } catch (err) {
      setError('Could not connect to Backend. Please check if your server is running.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleDelete = async (id: number | string) => {
    showConfirm({
      title: 'Remove Product',
      message: 'This will permanently delete the item from your store database. This action is irreversible.',
      type: 'danger',
      confirmText: 'Delete Permanently',
      onConfirm: async () => {
        try {
          await deleteProduct(id);
          setProducts(prev => prev.filter(p => p.id !== id));
          showNotification('Product removed successfully.', 'success', 'Deleted');
        } catch (err) {
          showNotification('Operation failed.', 'error', 'Error');
        }
      }
    });
  };

  const filteredProducts = products.filter(p => 
    (p.name || p.title || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.id?.toString().includes(searchTerm) ||
    (p.category || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-10 animate-fade-in pb-20">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
             <div className="p-2 bg-black text-white rounded-sm shadow-lg shadow-black/10">
                <Package size={20} />
             </div>
             <h1 className="text-2xl font-black tracking-tight text-black uppercase">Product Catalog</h1>
          </div>
          <p className="text-[10px] text-black/40 font-bold uppercase tracking-[0.2em] ml-1">Total Items: {products.length}</p>
        </div>
        
        <div className="flex items-center gap-3">
            <button 
              onClick={loadProducts}
              className="p-3.5 border border-black/5 bg-white text-black/40 hover:text-black hover:shadow-lg transition-all rounded-sm"
              title="Refresh Catalog"
            >
              <RefreshCw size={18} className={isLoading ? 'animate-spin' : ''} />
            </button>
            <Link 
              href="/admin/products/add"
              className="bg-black text-white px-8 py-4 text-[10px] font-bold uppercase tracking-[0.3em] flex items-center gap-3 hover:bg-[#c8b99a] hover:text-black transition-all duration-500 shadow-2xl"
            >
              <Plus size={18} />
              Add Product
            </Link>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-sm flex items-start gap-4 text-red-700 animate-slide-up">
            <AlertCircle size={24} className="mt-1" />
            <div>
               <p className="font-bold uppercase tracking-widest text-xs">{error}</p>
               <p className="text-[9px] mt-1 opacity-70 tracking-widest uppercase">Target API: {process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1'}</p>
            </div>
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="relative group">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-black/20 group-focus-within:text-black transition-colors" size={20} />
        <input 
          type="text" 
          placeholder="SEARCH BY NAME, CATEGORY OR PRODUCT ID..." 
          className="w-full bg-white border border-black/5 py-6 pl-16 pr-8 text-xs font-bold tracking-[0.1em] outline-none focus:border-[#c8b99a] transition-all rounded-sm shadow-sm placeholder:text-black/20"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Main List Table */}
      <div className="bg-white border border-black/5 rounded-sm shadow-2xl overflow-hidden">
        <div className="overflow-x-auto min-h-[400px]">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-80 gap-6">
               <div className="w-12 h-12 border-4 border-black/5 border-t-black rounded-full animate-spin"></div>
               <p className="text-[10px] font-black uppercase tracking-[0.5em] text-black/10">Synchronizing...</p>
            </div>
          ) : filteredProducts.length > 0 ? (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-black/5 bg-black/[0.02]">
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-black">Product Information</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-black">Category</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-black">Status</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-black text-right">Unit Price</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-black text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-black/[0.01] transition-all group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-5">
                        <div className="w-16 h-20 bg-black/5 rounded-sm flex items-center justify-center overflow-hidden border border-black/5 relative group-hover:scale-105 transition-transform duration-500">
                           {product.imageUrls && product.imageUrls.length > 0 ? (
                             <img src={getProductImageUrl(product.imageUrls[0])} alt="" className="w-full h-full object-cover" />
                           ) : (
                             <Package size={24} className="text-black/5" strokeWidth={1} />
                           )}
                           <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                              <ExternalLink size={16} className="text-white" />
                           </div>
                        </div>
                        <div className="flex flex-col space-y-1">
                            <span className="text-[13px] font-bold uppercase tracking-tight text-black leading-none">
                                {product.name || product.title || 'Unknown Item'}
                            </span>
                            <span className="text-[10px] text-black/40 font-bold uppercase tracking-widest flex items-center gap-2">
                                <Tag size={10} className="text-[#c8b99a]" /> {product.id}
                            </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                       <span className="px-3 py-1.5 bg-black/5 text-[9px] font-black uppercase tracking-widest text-black/60 rounded-sm">
                          {product.category || 'N/A'}
                       </span>
                    </td>
                    <td className="px-8 py-6">
                       {(product.quantity > 0 || product.inventory > 0) ? (
                         <div className="flex items-center gap-2 text-green-600">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-600 animate-pulse"></div>
                            <span className="text-[10px] font-bold uppercase tracking-widest">{product.quantity || product.inventory} IN STOCK</span>
                         </div>
                       ) : (
                        <div className="flex items-center gap-2 text-rose-600">
                           <div className="w-1.5 h-1.5 rounded-full bg-rose-600"></div>
                           <span className="text-[10px] font-bold uppercase tracking-widest uppercase">OUT OF STOCK</span>
                        </div>
                       )}
                    </td>
                    <td className="px-8 py-6 text-right">
                      <span className="text-[13px] font-black text-black tracking-tight">Rs {product.price?.toLocaleString()}</span>
                    </td>
                    <td className="px-8 py-6 text-right">
                        <div className="flex items-center justify-end gap-3 transition-all duration-300">
                           <Link 
                             href={`/admin/products/edit/${product.id}`}
                             className="p-3 bg-black/5 text-black hover:bg-black hover:text-white transition-all rounded-sm shadow-sm"
                             title="Edit Product"
                           >
                              <Edit size={16} />
                           </Link>
                           <button 
                             onClick={() => handleDelete(product.id)}
                             className="p-3 bg-black/5 text-black hover:bg-rose-600 hover:text-white transition-all rounded-sm shadow-sm"
                             title="Delete Product"
                           >
                              <Trash2 size={16} />
                           </button>
                        </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="flex flex-col items-center justify-center p-32 text-center space-y-6">
                <div className="w-24 h-24 bg-black/[0.02] rounded-full flex items-center justify-center">
                   <ShoppingBag size={48} strokeWidth={0.5} className="text-black/10" />
                </div>
                <div className="space-y-2">
                   <p className="text-[14px] font-black uppercase tracking-[0.3em] text-black">Empty Collection</p>
                   <p className="text-[10px] font-bold uppercase tracking-widest text-black/30">Your database has no products currently</p>
                </div>
                <button 
                  onClick={loadProducts}
                  className="px-8 py-3 border border-black text-[10px] font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-all"
                >
                  Reconnect to Server
                </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}