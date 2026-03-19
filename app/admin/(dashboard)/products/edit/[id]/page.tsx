'use client';

import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  X,
  PlusCircle,
  Save,
  Loader2,
  Trash2
} from 'lucide-react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { fetchProductById, updateProduct, deleteProductImage, getProductImageUrl } from '@/lib/api-service';
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
    stockStatus: 'INSTOCK'
  });

  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const data = await fetchProductById(id as string);
        setFormData({
            name: data.name || '',
            category: data.category || 'SHIRTS',
            price: data.price || 0,
            quantity: data.quantity || 0,
            sizes: (data.sizes || []) as any,
            colors: (data.colors || []) as any,
            description: data.description || '',
            stockStatus: data.stockStatus || 'INSTOCK'
        });
        setExistingImages(data.imageUrls || []);
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
      [name]: (name === 'price' || name === 'quantity') ? Number(value) : value 
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
      
      setImageFiles(prev => [...prev, ...files]);
      setImagePreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleDeleteExistingImage = async (imageName: string) => {
    if (!window.confirm('Are you sure you want to permanently delete this image?')) return;
    
    try {
      await deleteProductImage(id as string, imageName);
      setExistingImages(prev => prev.filter(img => img !== imageName));
      showNotification('Image deleted successfully.', 'success', 'Inventory Updated');
    } catch (err) {
      showNotification('Failed to delete image.', 'error', 'Error');
      console.error(err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      await updateProduct(id as string, formData as any, imageFiles);
      
      showNotification(`${formData.name} updated successfully.`, 'success', 'Changes Saved');
      setTimeout(() => router.push('/admin/products'), 1500);
    } catch (err) {
      showNotification('Failed to update product. Ensure your backend is running.', 'error', 'Error');
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
                      name="stockStatus"
                      value={formData.stockStatus}
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
             <div className="bg-white p-10 border border-black/5 rounded-sm shadow-sm space-y-8">
                <div>
                   <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-black border-b border-black/5 pb-4">Gallery Management</h2>
                   <p className="text-[9px] text-black/30 font-bold uppercase tracking-widest mt-2">Manage existing assets and upload new collections</p>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                   {/* Existing Images */}
                   {existingImages.map((imageName, i) => (
                      <div key={`exist-${i}`} className="aspect-[3/4] relative group rounded-sm overflow-hidden border border-black/5 bg-black/[0.02] shadow-sm">
                         <img src={getProductImageUrl(imageName)} alt="Product" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                         <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                            <button 
                              type="button" 
                              onClick={() => handleDeleteExistingImage(imageName)}
                              className="p-3 bg-red-600 text-white rounded-full shadow-2xl hover:bg-red-700 transition-colors transform hover:scale-110"
                              title="Delete from Server"
                            >
                               <Trash2 size={16} />
                            </button>
                            <span className="text-[7px] text-white font-bold uppercase tracking-[0.2em] px-2 py-1 bg-black/40 backdrop-blur-md rounded-full mt-2">Saved Asset</span>
                         </div>
                         <div className="absolute top-2 left-2 bg-green-500/80 backdrop-blur-md px-2 py-0.5 rounded-sm">
                            <span className="text-[8px] text-white font-bold uppercase tracking-widest">Live</span>
                         </div>
                      </div>
                   ))}

                   {/* New Upload Previews */}
                   {imagePreviews.map((preview, i) => (
                      <div key={`new-${i}`} className="aspect-[3/4] relative group rounded-sm overflow-hidden border border-[#c8b99a]/30 bg-black/[0.02] shadow-sm animate-pulse-subtle">
                         <img src={preview} alt="New" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                         <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button 
                              type="button" 
                              onClick={() => removeImage(i)}
                              className="p-3 bg-red-600 text-white rounded-full shadow-2xl hover:bg-red-700 transition-colors transform hover:scale-110"
                              title="Discard"
                            >
                               <X size={16} />
                            </button>
                         </div>
                         <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-sm">
                            <span className="text-[8px] text-white font-bold uppercase tracking-widest">Queue</span>
                         </div>
                      </div>
                   ))}
                   
                   <label className="aspect-[3/4] bg-black/[0.01] border-2 border-dashed border-black/5 rounded-sm flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-[#c8b99a] hover:bg-black/[0.02] transition-all group overflow-hidden relative">
                      <div className="absolute inset-0 bg-[radial-gradient(#c8b99a_1px,transparent_1px)] [background-size:16px_16px] opacity-[0.03] group-hover:opacity-[0.05]"></div>
                      <PlusCircle className="text-black/10 group-hover:text-[#c8b99a] group-hover:scale-110 transition-all duration-500" size={40} strokeWidth={1} />
                      <div className="text-center">
                         <span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-black/40 group-hover:text-black transition-colors">Add More</span>
                      </div>
                      <input type="file" multiple accept="image/*" onChange={handleImageChange} className="hidden" />
                   </label>
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
