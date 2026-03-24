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
import { addProduct } from '@/app/api/api-service';
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
    stockStatus: 'INSTOCK'
  });

  const [imageFiles, setImageFiles] = useState<File[]>([]);
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
      
      setImageFiles(prev => [...prev, ...files]);
      setImagePreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await addProduct(formData as any, imageFiles);
      
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
          
          {/* Main Column */}
          <div className="lg:col-span-8 space-y-10">
            {/* General Info */}
            <div className="bg-white p-10 border border-black/5 rounded-sm shadow-sm space-y-8">
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-black border-b border-black/5 pb-4">General Information</h2>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] text-black font-bold uppercase tracking-widest ml-1">Product Title</label>
                  <input 
                    type="text" 
                    name="name"
                    required
                    placeholder="e.g., Linen Short for Summer"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full bg-black/[0.02] border border-black/5 py-4 px-4 text-xs text-black outline-none focus:bg-white focus:border-[#c8b99a] transition-all rounded-sm font-bold"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] text-black font-bold uppercase tracking-widest ml-1">Description</label>
                  <textarea 
                    rows={6}
                    name="description"
                    required
                    placeholder="Tell more about this item..."
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full bg-black/[0.02] border border-black/5 py-4 px-4 text-xs text-black outline-none focus:bg-white focus:border-[#c8b99a] transition-all rounded-sm resize-none"
                  ></textarea>
                </div>

                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] text-black font-bold uppercase tracking-widest ml-1">Price (Rs)</label>
                    <input 
                      type="number"
                      name="price"
                      required
                      value={formData.price}
                      onChange={handleInputChange}
                      className="w-full bg-black/[0.02] border border-black/5 py-4 px-4 text-xs text-black outline-none focus:bg-white focus:border-[#c8b99a] transition-all rounded-sm font-bold"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] text-black font-bold uppercase tracking-widest ml-1">Initial Quantity</label>
                    <input 
                      type="number" 
                      name="quantity"
                      required
                      value={formData.quantity}
                      onChange={handleInputChange}
                      className="w-full bg-black/[0.02] border border-black/5 py-4 px-4 text-xs text-black outline-none focus:bg-white focus:border-[#c8b99a] transition-all rounded-sm font-bold"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Variants */}
            <div className="bg-white p-10 border border-black/5 rounded-sm shadow-sm space-y-10">
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-black border-b border-black/5 pb-4">Product Variants</h2>
              
              <div className="space-y-8">
                <div className="space-y-4">
                  <label className="text-[10px] text-black font-bold uppercase tracking-widest ml-1">Available Sizes</label>
                  <div className="flex flex-wrap gap-3">
                    {SIZES.map(size => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => toggleSelection('sizes', size)}
                        className={`min-w-[60px] py-3 text-[10px] font-bold uppercase border transition-all ${
                          formData.sizes.includes(size) 
                            ? 'bg-black text-white border-black shadow-lg scale-105' 
                            : 'bg-white text-black border-black/10 hover:border-black/30'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] text-black font-bold uppercase tracking-widest ml-1">Available Colors</label>
                  <div className="flex flex-wrap gap-3">
                    {COLORS.map(color => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => toggleSelection('colors', color)}
                        className={`px-6 py-3 text-[9px] font-bold uppercase border transition-all ${
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

            {/* Photo Gallery - MUCH LARGER NOW */}
            <div className="bg-white p-10 border border-black/5 rounded-sm shadow-sm space-y-8">
              <div>
                <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-black border-b border-black/5 pb-4">Product Photography</h2>
                <p className="text-[9px] text-black/30 font-bold uppercase tracking-widest mt-2">Display your product in high resolution. The first image will be the primary thumbnail.</p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                {imagePreviews.map((preview, i) => (
                  <div key={i} className="aspect-[3/4] relative group rounded-sm overflow-hidden border border-black/5 bg-black/[0.02] shadow-sm hover:shadow-2xl transition-all duration-700">
                    <img src={preview} alt="Product" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button 
                        type="button" 
                        onClick={() => removeImage(i)}
                        className="p-4 bg-red-600 text-white rounded-full shadow-2xl hover:bg-red-700 transition-colors transform hover:scale-110"
                        title="Remove Image"
                      >
                        <X size={20} />
                      </button>
                    </div>
                    <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-sm border border-white/10">
                      <span className="text-[9px] text-white font-bold uppercase tracking-widest">Image {i + 1}</span>
                    </div>
                  </div>
                ))}
                
                <label className="aspect-[3/4] bg-black/[0.01] border-2 border-dashed border-black/5 rounded-sm flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-[#c8b99a] hover:bg-black/[0.02] transition-all group overflow-hidden relative min-h-[250px]">
                  <div className="absolute inset-0 bg-[radial-gradient(#c8b99a_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.03] group-hover:opacity-[0.05]"></div>
                  <PlusCircle className="text-black/10 group-hover:text-[#c8b99a] group-hover:scale-110 transition-all duration-700" size={56} strokeWidth={1} />
                  <div className="text-center px-6">
                    <span className="block text-[10px] font-bold uppercase tracking-[0.3em] text-black/40 group-hover:text-black transition-colors">Add Image</span>
                    <span className="block text-[8px] font-bold uppercase tracking-widest text-black/20 mt-2 italic text-shadow-sm">High-res PNG, JPG preferred</span>
                  </div>
                  <input type="file" multiple accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-10">
            {/* Classification */}
            <div className="bg-white p-8 border border-black/5 rounded-sm shadow-sm space-y-8 sticky top-10">
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-black border-b border-black/5 pb-4">Classification</h2>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] text-black/60 font-bold uppercase tracking-widest ml-1">Category</label>
                  <select 
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full bg-black/[0.02] border border-black/5 py-4 px-4 text-[10px] font-bold uppercase tracking-widest text-black outline-none focus:bg-white focus:border-[#c8b99a] transition-all rounded-sm cursor-pointer"
                  >
                    {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] text-black/60 font-bold uppercase tracking-widest ml-1">Stock Status</label>
                  <select 
                    name="stockStatus"
                    value={formData.stockStatus}
                    onChange={handleInputChange}
                    className="w-full bg-black/[0.02] border border-black/5 py-4 px-4 text-[10px] font-bold uppercase tracking-widest text-black outline-none focus:bg-white focus:border-[#c8b99a] transition-all rounded-sm cursor-pointer"
                  >
                    <option value="INSTOCK">IN STOCK</option>
                    <option value="LOWSTOCK">LOW STOCK</option>
                    <option value="OUTOFSTOCK">OUT OF STOCK</option>
                  </select>
                </div>

                <div className="pt-6 border-t border-black/5">
                  <button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full py-5 bg-black text-white text-[11px] font-bold uppercase tracking-[0.4em] hover:bg-[#c8b99a] hover:text-black transition-all duration-500 shadow-2xl flex items-center justify-center gap-3 disabled:opacity-50 active:scale-95"
                  >
                    {isLoading ? (
                      <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                    ) : (
                      <><Save size={20} /> PUBLISH ITEM</>
                    )}
                  </button>
                  <p className="text-[9px] text-black/30 font-bold text-center uppercase tracking-widest mt-6 leading-relaxed">
                    By publishing, you confirm that these specifications meet our brand quality standards.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}