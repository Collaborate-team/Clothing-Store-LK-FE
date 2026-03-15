'use client';

import React from 'react';
import Image from 'next/image';
import { Heart, ShoppingBag, ArrowRight } from 'lucide-react';

const FEATURED_PRODUCTS = [
  {
    id: 1,
    name: 'SILK BLEND MAXI DRESS',
    price: '22,400.00',
    image: 'https://images.unsplash.com/photo-1539109132271-411a19008bc5?q=80&w=1000&auto=format&fit=crop',
    tag: 'NEW ARRIVAL'
  },
  {
    id: 2,
    name: 'STRUCTURED WOOL BLAZER',
    price: '28,500.00',
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=1000&auto=format&fit=crop',
    tag: 'BEST SELLER'
  },
  {
    id: 3,
    name: 'LINEN WIDE-LEG PANTS',
    price: '14,200.00',
    image: 'https://images.unsplash.com/photo-1548883354-94bcfe321cbb?q=80&w=1000&auto=format&fit=crop',
    tag: 'LIMITED EDITION'
  },
  {
    id: 4,
    name: 'MINIMALIST LEATHER TOTE',
    price: '34,000.00',
    image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?q=80&w=1000&auto=format&fit=crop',
    tag: 'ESSENTIAL'
  }
];

const FeaturedProducts = () => {
  return (
    <section className="py-24 sm:py-32 bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 space-y-4 md:space-y-0">
          <div className="space-y-3">
            <p className="text-[10px] tracking-[0.4em] font-bold text-[#c8b99a] uppercase">Curated Selection</p>
            <h2 className="text-4xl md:text-5xl font-light tracking-tight text-[#fcfbf7]" style={{ fontFamily: "var(--font-cormorant), 'Cormorant Garamond', serif" }}>
              Featured <span className="text-[#c8b99a]">Collection</span>
            </h2>
          </div>
          <button className="flex items-center gap-4 text-[11px] tracking-[0.3em] font-bold uppercase group transition-all cursor-pointer text-[#fcfbf7]">
            Explore All Items
            <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-[#c8b99a] group-hover:text-white group-hover:border-[#c8b99a] transition-all">
              <ArrowRight size={18} />
            </div>
          </button>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {FEATURED_PRODUCTS.map((product) => (
            <div key={product.id} className="group cursor-pointer">
              <div className="relative aspect-[3/4] overflow-hidden bg-[#111] border border-white/10 mb-6">
                <Image 
                  src={product.image} 
                  alt={product.name} 
                  fill 
                  className="object-cover transition-transform duration-1000 group-hover:scale-110" 
                />
                
                {/* Labels */}
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-black/80 backdrop-blur-sm text-[8px] tracking-[0.2em] font-bold uppercase shadow-sm text-white">
                    {product.tag}
                  </span>
                </div>

                {/* Quick Add Overlay */}
                <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500 z-10">
                  <button className="w-full py-4 bg-[#c8b99a] text-black text-[9px] tracking-[0.3em] font-bold uppercase flex items-center justify-center gap-3 hover:bg-white transition-all">
                    <ShoppingBag size={14} />
                    Quick Add
                  </button>
                </div>

                {/* Wishlist Button */}
                <button className="absolute top-4 right-4 p-2.5 bg-black/60 backdrop-blur-sm rounded-full text-white hover:bg-[#c8b99a] transition-all shadow-sm opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 duration-500">
                  <Heart size={16} />
                </button>
              </div>

              {/* Details */}
              <div className="space-y-2 text-center">
                <h3 className="text-[11px] tracking-[0.2em] font-bold uppercase leading-tight text-[#fcfbf7] group-hover:text-[#c8b99a] transition-colors">
                  {product.name}
                </h3>
                <p className="text-[14px] font-light text-[#888]">
                  Rs {product.price}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
