'use client';

import React, { useState } from 'react';
import { 
  ArrowLeft, 
  X,
  PlusCircle,
  Save,
  CheckCircle2
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { addProduct } from '@/lib/api-service';
import { useNotification } from '@/context/NotificationContext';

const CATEGORIES = [
  'SHIRTS', 'PANTS', 'DRESSES', 'SHOES', 'ACCESSORIES', 'OUTERWEAR', 'ACTIVEWEAR', 'UNDERWEAR', 'SWIMWEAR', 'SLEEPWEAR'
];

const COLORS = [
  'RED', 'BLUE', 'GREEN', 'BLACK', 'WHITE', 'YELLOW', 'ORANGE', 'PURPLE', 'PINK', 'BROWN', 'GRAY', 'NAVY', 'MAROON'
];

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

export default function AddProductPage() {
  const router = useRouter();
  const { showNotification } = useNotification();
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    category: 'SHIRTS',
    price: '' as string | number,
    quantity: '' as string | number,
    sizes: [] as string[],
    colors: [] as string[],
    description: '',
    status: 'INSTOCK'
  });

  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: (name === 'price' || name === 'quantity') 
        ? (value === '' ? '' : Number(value)) 
        : value 
    }));
  };

  const toggleSelection = (category: 'sizes' | 'colors', value: string) => {
    setFormData(prev => {
      const current = prev[category] as string[];
      if (current.includes(value)) {
        return { ...prev, [category]: current.filter(i => i !== value) };
      } else {
        return { ...prev, [category]: [...current, value] };
      }
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const newPreviews = files.map(file => URL.createObjectURL(file));
      setImagePreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (index: number) => {
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await addProduct(formData);
      showNotification(`${formData.name} has been added successfully.`, 'success', 'Product Published');
      setSuccess(true);
      setTimeout(() => router.push('/admin/products'), 2000);
    } catch (err) {
      showNotification('Could not save product. Please check your backend connection.', 'error', 'Error');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-screen-2xl mx-auto space-y-10 animate-fade-in pb-20 px-4 md:px-10">
      {/* Page Header */}
      <div className="flex items-center gap-4">
        <Link 
          href="/admin/products" 
          className="p-3 bg-white border border-black/5 rounded-sm hover:bg-black hover:text-white transition-all shadow-sm"
        >
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-black uppercase">Add New Product</h1>
          <p className="text-[10px] text-black/40 font-bold uppercase tracking-widest mt-1">Populate your store with premium items</p>
        </div>
      </div>

      {success ? (
        <div className="bg-white border border-black/5 p-16 rounded-sm shadow-xl flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 animate-bounce">
                <CheckCircle2 size={40} />
            </div>
            <h2 className="text-xl font-bold tracking-tight text-black uppercase">Product Added Successfully!</h2>
            <p className="text-[11px] text-black/40 uppercase tracking-widest mt-2">Redirecting you to inventory...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Main Info */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-8 bg-white p-10 border border-black/5 rounded-sm shadow-sm">
             <div className="space-y-6">
                <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-black border-b border-black/5 pb-4">General Information</h2>
                
                <div className="space-y-2">
                   <label className="text-[10px] text-black/60 font-bold uppercase tracking-widest ml-1">Product Title</label>
                   <input 
                      type="text" 
                      name="name"
                      required
                      placeholder="e.g., Linen Short for Summer"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full bg-black/[0.02] border border-black/5 py-3.5 px-4 text-xs text-black outline-none focus:bg-white focus:border-[#c8b99a] transition-all rounded-sm"
                   />
                </div>

                <div className="space-y-2">
                   <label className="text-[10px] text-black/60 font-bold uppercase tracking-widest ml-1">Description</label>
                   <textarea 
                      rows={5}
                      name="description"
                      required
                      placeholder="Tell more about this item..."
                      value={formData.description}
                      onChange={handleInputChange}
                      className="w-full bg-black/[0.02] border border-black/5 py-3.5 px-4 text-xs text-black outline-none focus:bg-white focus:border-[#c8b99a] transition-all rounded-sm resize-none"
                   ></textarea>
                </div>

                <div className="grid grid-cols-2 gap-6">
                   <div className="space-y-2">
                      <label className="text-[10px] text-black/60 font-bold uppercase tracking-widest ml-1">Price (Rs)</label>
                      <input 
                         type="number"
                         name="price"
                         required
                         value={formData.price}
                         onChange={handleInputChange}
                         className="w-full bg-black/[0.02] border border-black/5 py-3.5 px-4 text-xs text-black outline-none focus:bg-white focus:border-[#c8b99a] transition-all rounded-sm"
                      />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] text-black/60 font-bold uppercase tracking-widest ml-1">Initial Quantity</label>
                      <input 
                         type="number" 
                         name="quantity"
                         required
                         value={formData.quantity}
                         onChange={handleInputChange}
                         className="w-full bg-black/[0.02] border border-black/5 py-3.5 px-4 text-xs text-black outline-none focus:bg-white focus:border-[#c8b99a] transition-all rounded-sm"
                      />
                   </div>
                </div>
             </div>

             {/* Variants */}
             <div className="space-y-8 pt-6 border-t border-black/5">
                <div className="space-y-4">
                   <label className="text-[10px] text-black/60 font-bold uppercase tracking-widest ml-1">Available Sizes</label>
                   <div className="flex flex-wrap gap-2">
                      {SIZES.map(size => (
                        <button
                          key={size}
                          type="button"
                          onClick={() => toggleSelection('sizes', size)}
                          className={`min-w-[48px] py-2 text-[10px] font-bold uppercase border transition-all ${
                            formData.sizes.includes(size) 
                              ? 'bg-black text-white border-black shadow-lg' 
                              : 'bg-white text-black border-black/10 hover:border-black/30'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                   </div>
                </div>

                <div className="space-y-4">
                   <label className="text-[10px] text-black/60 font-bold uppercase tracking-widest ml-1">Available Colors</label>
                   <div className="flex flex-wrap gap-2">
                      {COLORS.map(color => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => toggleSelection('colors', color)}
                          className={`px-4 py-2 text-[9px] font-bold uppercase border transition-all ${
                            formData.colors.includes(color) 
                              ? 'bg-black text-white border-black shadow-lg scale-105' 
                              : 'bg-white text-black border-black/10 hover:border-black/30'
                          }`}
                        >
                          {color}
                        </button>
                      ))}
                   </div>
                </div>
             </div>
          </div>

          {/* Sidebar / Options */}
          <div className="lg:col-span-5 xl:col-span-4 space-y-10">
             {/* Organizational Info */}
             <div className="bg-white p-8 border border-black/5 rounded-sm shadow-sm space-y-8">
                <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-black border-b border-black/5 pb-4">Classification</h2>
                
                <div className="space-y-2">
                   <label className="text-[10px] text-black/60 font-bold uppercase tracking-widest ml-1">Category</label>
                   <select 
                     name="category"
                     value={formData.category}
                     onChange={handleInputChange}
                     className="w-full bg-black/[0.02] border border-black/5 py-3.5 px-4 text-[10px] font-bold uppercase tracking-widest text-black outline-none focus:bg-white focus:border-[#c8b99a] transition-all rounded-sm cursor-pointer"
                   >
                      {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                   </select>
                </div>

                <div className="space-y-2">
                   <label className="text-[10px] text-black/60 font-bold uppercase tracking-widest ml-1">Stock Status</label>
                   <select 
                     name="status"
                     value={formData.status}
                     onChange={handleInputChange}
                     className="w-full bg-black/[0.02] border border-black/5 py-3.5 px-4 text-[10px] font-bold uppercase tracking-widest text-black outline-none focus:bg-white focus:border-[#c8b99a] transition-all rounded-sm cursor-pointer"
                   >
                      <option value="INSTOCK">IN STOCK</option>
                      <option value="LOWSTOCK">LOW STOCK</option>
                      <option value="OUTOFSTOCK">OUT OF STOCK</option>
                   </select>
                </div>
             </div>

             {/* Images Area */}
             <div className="bg-white p-8 border border-black/5 rounded-sm shadow-sm space-y-6">
                <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-black">Product Images</h2>
                
                <div className="grid grid-cols-2 gap-3">
                   {imagePreviews.map((preview, i) => (
                     <div key={i} className="aspect-square relative group rounded-sm overflow-hidden border border-black/5">
                        <img src={preview} alt="Product" className="w-full h-full object-cover" />
                        <button 
                          type="button" 
                          onClick={() => removeImage(i)}
                          className="absolute top-1 right-1 p-1.5 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                        >
                           <X size={12} />
                        </button>
                     </div>
                   ))}
                   
                   <label className="aspect-square bg-black/[0.02] border-2 border-dashed border-black/5 rounded-sm flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-[#c8b99a] transition-colors group">
                      <PlusCircle className="text-black/10 group-hover:text-[#c8b99a] transition-colors" size={32} strokeWidth={1} />
                      <span className="text-[9px] font-bold uppercase tracking-widest text-black/40">Browse Image</span>
                      <input type="file" multiple accept="image/*" onChange={handleImageChange} className="hidden" />
                   </label>
                </div>
             </div>

             {/* Actions */}
             <div className="pt-4">
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full py-5 bg-black text-white text-[11px] font-bold uppercase tracking-[0.3em] hover:bg-[#c8b99a] hover:text-black transition-all duration-500 shadow-2xl flex items-center justify-center gap-3 disabled:opacity-50"
                >
                   {isLoading ? (
                     <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                   ) : (
                     <><Save size={18} /> CONFIRM & PUBLISH</>
                   )}
                </button>
             </div>
          </div>
        </form>
      )}
    </div>
  );
}
