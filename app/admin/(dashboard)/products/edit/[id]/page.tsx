'use client';

import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  X,
  PlusCircle,
  Save,
  Loader2
} from 'lucide-react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { fetchProductById, updateProduct } from '@/lib/api-service';
import { useNotification } from '@/context/NotificationContext';

const CATEGORIES = [
  'SHIRTS', 'PANTS', 'DRESSES', 'SHOES', 'ACCESSORIES', 'OUTERWEAR', 'ACTIVEWEAR', 'UNDERWEAR', 'SWIMWEAR', 'SLEEPWEAR'
];

const COLORS = [
  'RED', 'BLUE', 'GREEN', 'BLACK', 'WHITE', 'YELLOW', 'ORANGE', 'PURPLE', 'PINK', 'BROWN', 'GRAY', 'NAVY', 'MAROON'
];

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

export default function EditProductPage() {
  const { id } = useParams();
  const router = useRouter();
  const { showNotification } = useNotification();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    category: 'SHIRTS',
    price: 0,
    quantity: 0,
    sizes: [] as string[],
    colors: [] as string[],
    description: '',
    status: 'INSTOCK'
  });

  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const data = await fetchProductById(id as string);
        setFormData({
            name: data.name || '',
            category: data.category || 'SHIRTS',
            price: data.price || 0,
            quantity: data.quantity || 0,
            sizes: data.sizes || [],
            colors: data.colors || [],
            description: data.description || '',
            status: data.status || 'INSTOCK'
        });
      } catch (err) {
        showNotification('Failed to load product details.', 'error', 'Error');
        router.push('/admin/products');
      } finally {
        setIsLoading(false);
      }
    };
    if (id) loadProduct();
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'price' || name === 'quantity' ? Number(value) : value 
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
    setIsSaving(true);

    try {
      await updateProduct(id as string, formData);
      showNotification(`${formData.name} updated successfully.`, 'success', 'Changes Saved');
      setTimeout(() => router.push('/admin/products'), 1500);
    } catch (err) {
      showNotification('Failed to update product.', 'error', 'Error');
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return (
    <div className="min-h-[400px] flex flex-col items-center justify-center gap-4">
       <Loader2 className="animate-spin text-[#c8b99a]" size={40} />
       <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-black/40">Loading Item Data...</p>
    </div>
  );

  return (
    <div className="max-w-screen-2xl mx-auto space-y-10 animate-fade-in pb-20 px-4 md:px-10">
      <div className="flex items-center gap-4">
        <Link 
          href="/admin/products" 
          className="p-3 bg-white border border-black/5 rounded-sm hover:bg-black hover:text-white transition-all shadow-sm"
        >
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-black uppercase">Edit Product</h1>
          <p className="text-[10px] text-black/40 font-bold uppercase tracking-widest mt-1">Modify details for item #{id}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          <div className="lg:col-span-7 xl:col-span-8 space-y-8 bg-white p-10 border border-black/5 rounded-sm shadow-sm">
             <div className="space-y-6">
                <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-black border-b border-black/5 pb-4">General Information</h2>
                
                <div className="space-y-2">
                   <label className="text-[10px] text-black/60 font-bold uppercase tracking-widest ml-1">Product Title</label>
                   <input 
                      type="text" 
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full bg-black/[0.02] border border-black/5 py-3.5 px-4 text-xs text-black outline-none focus:bg-white focus:border-[#c8b99a] transition-all rounded-sm font-bold"
                   />
                </div>

                <div className="space-y-2">
                   <label className="text-[10px] text-black/60 font-bold uppercase tracking-widest ml-1">Description</label>
                   <textarea 
                      rows={5}
                      name="description"
                      required
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
                         className="w-full bg-black/[0.02] border border-black/5 py-3.5 px-4 text-xs text-black outline-none focus:bg-white focus:border-[#c8b99a] transition-all rounded-sm font-bold"
                      />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] text-black/60 font-bold uppercase tracking-widest ml-1">Quantity in Stock</label>
                      <input 
                         type="number" 
                         name="quantity"
                         required
                         value={formData.quantity}
                         onChange={handleInputChange}
                         className="w-full bg-black/[0.02] border border-black/5 py-3.5 px-4 text-xs text-black outline-none focus:bg-white focus:border-[#c8b99a] transition-all rounded-sm font-bold"
                      />
                   </div>
                </div>
             </div>

             <div className="space-y-8 pt-6 border-t border-black/5">
                <div className="space-y-4">
                   <label className="text-[10px] text-black/60 font-bold uppercase tracking-widest ml-1">Sizes</label>
                   <div className="flex flex-wrap gap-2">
                      {SIZES.map(size => (
                        <button
                          key={size}
                          type="button"
                          onClick={() => toggleSelection('sizes', size)}
                          className={`min-w-[48px] py-2 text-[10px] font-bold uppercase border transition-all ${
                            formData.sizes.includes(size) 
                              ? 'bg-black text-white border-black' 
                              : 'bg-white text-black border-black/10'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                   </div>
                </div>

                <div className="space-y-4">
                   <label className="text-[10px] text-black/60 font-bold uppercase tracking-widest ml-1">Colors</label>
                   <div className="flex flex-wrap gap-2">
                      {COLORS.map(color => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => toggleSelection('colors', color)}
                          className={`px-4 py-2 text-[9px] font-bold uppercase border transition-all ${
                            formData.colors.includes(color) 
                              ? 'bg-black text-white border-black shadow-md' 
                              : 'bg-white text-black border-black/10'
                          }`}
                        >
                          {color}
                        </button>
                      ))}
                   </div>
                </div>
             </div>
          </div>

          <div className="lg:col-span-5 xl:col-span-4 space-y-10">
             <div className="bg-white p-8 border border-black/5 rounded-sm shadow-sm space-y-8">
                <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-black border-b border-black/5 pb-4">Status & Category</h2>
                
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
                   <label className="text-[10px] text-black/60 font-bold uppercase tracking-widest ml-1">Inventory Status</label>
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

             <div className="pt-4">
                <button 
                  type="submit" 
                  disabled={isSaving}
                  className="w-full py-5 bg-black text-white text-[11px] font-bold uppercase tracking-[0.3em] hover:bg-[#c8b99a] hover:text-black transition-all duration-500 shadow-2xl flex items-center justify-center gap-3 disabled:opacity-50"
                >
                   {isSaving ? (
                     <Loader2 className="animate-spin" size={18} />
                   ) : (
                     <><Save size={18} /> SAVE CHANGES</>
                   )}
                </button>
             </div>
          </div>
      </form>
    </div>
  );
}
