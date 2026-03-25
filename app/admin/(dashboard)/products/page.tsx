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
  Tag,
  Eye,
  ShoppingBag,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';
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
  
  // Image Preview States
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [productName, setProductName] = useState('');

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

  const openPreview = (images: string[], name: string) => {
    if (!images || images.length === 0) return;
    setPreviewImages(images);
    setProductName(name);
    setCurrentImageIndex(0);
    setIsPreviewOpen(true);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % previewImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + previewImages.length) % previewImages.length);
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
             <h1 className="text-3xl font-bold tracking-tight text-black uppercase">Product Catalog</h1>
          </div>
          <p className="text-[10px] text-black/70 font-bold uppercase tracking-widest mt-1">Manage and Curate your Premium Collection</p>
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
               <p className="text-[9px] mt-1 opacity-70 tracking-widest uppercase">Target API: {process.env.NEXT_PUBLIC_API_URL || 'DEFAULT BACKEND SERVER'}</p>
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
                        <div 
                          className="w-16 h-20 bg-black/5 rounded-sm flex items-center justify-center overflow-hidden border border-black/5 relative group-hover:scale-105 transition-transform duration-500 cursor-pointer"
                          onClick={() => openPreview(product.imageUrls, product.name || product.title)}
                        >
                           {product.imageUrls && product.imageUrls.length > 0 ? (
                             <img src={getProductImageUrl(product.imageUrls[0])} alt="" className="w-full h-full object-cover" />
                           ) : (
                             <Package size={24} className="text-black/5" strokeWidth={1} />
                           )}
                           <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                              <Eye size={16} className="text-white" />
                           </div>
                        </div>
                        <div className="flex flex-col space-y-1">
                            <span className="text-[13px] font-bold uppercase tracking-tight text-black leading-none">
                                {product.name || product.title || 'Unknown Item'}
                            </span>
                            <span className="text-[10px] text-black/70 font-bold uppercase tracking-widest flex items-center gap-2">
                                <Tag size={10} className="text-[#c8b99a]" /> {product.id}
                            </span>
                            {product.sizes && product.sizes.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-1.5">
                                {product.sizes.map((size: string) => (
                                  <span key={size} className="px-1.5 py-0.5 bg-black/5 text-black text-[8px] font-black rounded-sm border border-black/5 uppercase">{size}</span>
                                ))}
                              </div>
                            )}
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                       <span className="px-3 py-1.5 bg-black/5 text-[9px] font-black uppercase tracking-widest text-black/90 rounded-sm">
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
                   <p className="text-[14px] font-black uppercase tracking-[0.3em] text-black/90">Empty Collection</p>
                   <p className="text-[10px] font-bold uppercase tracking-widest text-black/70">Your database has no products currently</p>
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

      {/* Image Preview Modal */}
      {isPreviewOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 animate-fade-in">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/95 backdrop-blur-xl"
            onClick={() => setIsPreviewOpen(false)}
          ></div>
          
          {/* Close Button */}
          <button 
            onClick={() => setIsPreviewOpen(false)}
            className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors z-[110]"
          >
            <X size={32} strokeWidth={1} />
          </button>

          {/* Modal Content */}
          <div className="relative w-full max-w-5xl aspect-[4/5] md:aspect-video flex flex-col items-center justify-center z-[105]">
            
            {/* Main Image Container */}
            <div className="relative w-full h-full flex items-center justify-center group">
              {/* Navigation Arrows */}
              {previewImages.length > 1 && (
                <>
                  <button 
                    onClick={prevImage}
                    className="absolute left-0 md:-left-16 p-4 text-white/30 hover:text-white transition-all hover:scale-110 z-20"
                  >
                    <ChevronLeft size={48} strokeWidth={1} />
                  </button>
                  <button 
                    onClick={nextImage}
                    className="absolute right-0 md:-right-16 p-4 text-white/30 hover:text-white transition-all hover:scale-110 z-20"
                  >
                    <ChevronRight size={48} strokeWidth={1} />
                  </button>
                </>
              )}

              {/* Image Canvas */}
              <div className="w-full h-full relative border border-white/10 bg-black">
                <img 
                  src={getProductImageUrl(previewImages[currentImageIndex])} 
                  alt={productName}
                  className="w-full h-full object-contain animate-scale-in"
                />
                
                {/* Image Counter */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/60 backdrop-blur-md border border-white/10 rounded-full">
                  <p className="text-[10px] font-black tracking-[0.3em] uppercase text-white/80">
                    {currentImageIndex + 1} <span className="text-white/20 px-2">/</span> {previewImages.length}
                  </p>
                </div>
              </div>
            </div>

            {/* Caption */}
            <div className="mt-8 text-center space-y-2">
              <h3 className="text-white text-[12px] font-black tracking-[0.4em] uppercase">{productName}</h3>
              <div className="flex justify-center gap-2">
                {previewImages.map((_, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`w-1 h-1 rounded-full transition-all duration-500 ${idx === currentImageIndex ? 'bg-[#c8b99a] w-8' : 'bg-white/20'}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}