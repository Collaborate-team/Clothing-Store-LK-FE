'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { 
  Heart, 
  ShoppingBag, 
  Trash2, 
  ArrowRight
} from 'lucide-react';

const MOCK_WISHLIST = [
  {
    id: 1,
    name: 'SILK MIDI DRESS',
    price: '18,200.00',
    image: 'https://images.unsplash.com/photo-1548883354-94bcfe321cbb?q=80&w=1000&auto=format&fit=crop',
    status: 'In Stock'
  },
  {
    id: 2,
    name: 'OVERSIZED LINEN BLAZER',
    price: '24,500.00',
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=1000&auto=format&fit=crop',
    status: 'Limited Stock'
  },
  {
    id: 3,
    name: 'CROPPED TROUSERS',
    price: '12,500.00',
    image: 'https://images.unsplash.com/photo-1539109132271-411a19008bc5?q=80&w=1000&auto=format&fit=crop',
    status: 'Out of Stock'
  }
];

const WishlistPage = () => {
  const [items, setItems] = useState(MOCK_WISHLIST);

  const removeItem = (id: number) => {
    setItems(items.filter(item => item.id !== id));
  };

  return (
    <div className="min-h-screen bg-white text-black pt-32 pb-20" style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="flex flex-col items-center mb-24 text-center space-y-4">
          <div className="w-16 h-16 rounded-full border border-[#c8b99a]/30 flex items-center justify-center text-[#c8b99a] mb-2 animate-fade-in">
            <Heart size={32} strokeWidth={1} fill="currentColor" />
          </div>
          <p className="text-[10px] tracking-[0.5em] font-bold text-[#c8b99a] uppercase">Personal Curator</p>
          <h1 className="text-5xl md:text-7xl font-light tracking-tight" style={{ fontFamily: "var(--font-cormorant), 'Cormorant Garamond', serif" }}>
            The <span className="text-[#c8b99a] italic">Wishlist</span>
          </h1>
        </div>

        {items.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 sm:gap-16">
            {items.map((item) => (
              <div key={item.id} className="group animate-fade-in bg-white border border-black/5 p-4 sm:p-6 transition-all duration-500 hover:border-[#c8b99a]/30 shadow-sm">
                <div className="relative aspect-[3/4] overflow-hidden border border-black/5 bg-black/5 mb-8">
                  <Image 
                    src={item.image} 
                    alt={item.name} 
                    fill 
                    className="object-cover transition-transform duration-1000 group-hover:scale-110" 
                  />
                  
                  {/* Remove Button */}
                  <button 
                    onClick={() => removeItem(item.id)}
                    className="absolute top-4 right-4 p-3 bg-white/80 backdrop-blur-md rounded-full text-black hover:bg-black hover:text-white transition-all shadow-sm z-10 cursor-pointer opacity-0 group-hover:opacity-100 duration-500"
                  >
                    <Trash2 size={16} />
                  </button>

                  {/* Stock Label */}
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 bg-black/80 backdrop-blur-sm text-[8px] tracking-[0.2em] font-bold uppercase ${item.status === 'Out of Stock' ? 'text-red-800' : 'text-[#c8b99a]'}`}>
                      {item.status}
                    </span>
                  </div>

                  {item.status === 'Out of Stock' && (
                    <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px] flex items-center justify-center">
                      <span className="px-6 py-3 border border-black/10 bg-white/80 text-black text-[9px] tracking-[0.3em] font-bold uppercase">Sold Out</span>
                    </div>
                  )}
                </div>

                <div className="space-y-6">
                  <div className="flex justify-between items-end">
                    <div className="space-y-1">
                      <h3 className="text-[12px] tracking-[0.2em] font-bold uppercase text-black group-hover:text-[#c8b99a] transition-colors">{item.name}</h3>
                      <p className="text-[15px] font-light text-[#888]">Rs {item.price}</p>
                    </div>
                  </div>

                  <button 
                    disabled={item.status === 'Out of Stock'}
                    className={`w-full py-5 flex items-center justify-center gap-4 text-[10px] tracking-[0.4em] font-bold uppercase transition-all duration-500 ${
                      item.status === 'Out of Stock' 
                      ? 'bg-white/5 text-[#333] cursor-not-allowed opacity-50' 
                      : 'bg-[#c8b99a] text-black hover:bg-white cursor-pointer shadow-lg'
                    }`}
                  >
                    <ShoppingBag size={18} />
                    Move to Bag
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-32 text-center flex flex-col items-center gap-10 bg-white border border-black/5 shadow-sm">
            <div className="w-24 h-24 rounded-full bg-black/5 border border-black/5 flex items-center justify-center text-black/5">
              <Heart size={48} strokeWidth={0.5} />
            </div>
            <div className="space-y-3">
              <p className="text-[16px] tracking-[0.1em] font-light italic text-[#888]">Your wishlist sanctuary is currently empty.</p>
              <p className="text-[10px] tracking-[0.3em] uppercase text-[#555] font-bold">Discover and save the pieces you love</p>
            </div>
            <a 
              href="/" 
              className="px-12 py-5 bg-[#c8b99a] text-black text-[11px] tracking-[0.4em] font-bold uppercase hover:bg-white flex items-center gap-4 transition-all"
            >
              Begin Journey
              <ArrowRight size={18} />
            </a>
          </div>
        )}

        {/* Similar Items Suggestion */}
        <div className="mt-40 pt-24 border-t border-white/5">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 space-y-4 md:space-y-0 text-center md:text-left">
              <div className="space-y-2 mx-auto md:mx-0">
                <p className="text-[9px] tracking-[0.5em] font-bold text-[#c8b99a] uppercase">Recommendations</p>
                <h2 className="text-4xl font-light tracking-tight text-black" style={{ fontFamily: "var(--font-cormorant), 'Cormorant Garamond', serif" }}>
                  Curated for <span className="text-[#c8b99a] italic">You</span>
                </h2>
              </div>
              <a href="/recommendations" className="text-[10px] tracking-[0.3em] font-bold uppercase border-b border-[#c8b99a]/50 text-[#c8b99a] hover:border-[#c8b99a] transition-all pb-1 mx-auto md:mx-0">View The Collection</a>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-[3/4] bg-black/5 border border-black/5 relative group overflow-hidden">
                   <div className="absolute inset-0 bg-white group-hover:scale-105 transition-transform duration-[2s] opacity-20" />
                </div>
              ))}
            </div>
        </div>
      </main>
    </div>
  );
};

export default WishlistPage;
