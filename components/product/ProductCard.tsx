'use client';

import React, { useState } from 'react';
import Image, { StaticImageData } from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingBag } from 'lucide-react';

interface ProductCardProps {
  id?: string | number;
  title: string;
  description: string;
  price: string;
  originalPrice?: string;
  imageUrl?: string | StaticImageData;
  hoverImageUrl?: string | StaticImageData;
  badge?: 'NEW' | 'SALE';
  isFavorite?: boolean;
  sizes?: string[];
}

const ProductCard: React.FC<ProductCardProps> = ({
  id = 1,
  title,
  description,
  price,
  originalPrice,
  imageUrl,
  hoverImageUrl,
  badge,
  isFavorite = false,
  sizes,
}) => {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  return (
    <div className="bg-white border border-black/5 rounded-sm flex flex-col h-full relative group transition-all duration-500 hover:border-[#c8b99a]/50 overflow-hidden shadow-sm">
      {/* Badge (NEW/SALE) */}
      {badge && (
        <div className={`absolute top-4 left-4 z-10 px-3 py-1 text-[8px] font-bold tracking-widest uppercase shadow-lg ${
          badge === 'NEW' ? 'bg-[#c8b99a] text-black' : 'bg-red-800 text-white'
        }`}>
          {badge}
        </div>
      )}

      {/* Image Container */}
      <Link href={`/products/${id}`} className="block">
        <div className="aspect-[4/5] relative overflow-hidden">
          {imageUrl ? (
            <>
              <Image
                src={imageUrl}
                alt={title}
                fill
                className={`object-cover transition-all duration-700 ease-in-out cursor-pointer ${hoverImageUrl ? 'group-hover:opacity-0 group-hover:scale-105' : 'group-hover:scale-110'}`}
              />
              {hoverImageUrl && (
                <Image
                  src={hoverImageUrl}
                  alt={`${title} - alternative view`}
                  fill
                  className="object-cover absolute inset-0 opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700 ease-in-out cursor-pointer"
                />
              )}
            </>
          ) : (
            <div className="w-full h-full bg-black/5 flex items-center justify-center text-black/5">
              <ShoppingBag size={48} strokeWidth={0.5} />
            </div>
          )}

          {/* Quick Actions Overlay (Stopped from bubbling Link if needed, but for now okay) */}
          <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500 z-10">
            <button className="w-full py-3 bg-[#c8b99a] text-black text-[9px] tracking-[0.2em] font-bold uppercase flex items-center justify-center gap-2 hover:bg-white transition-all cursor-pointer">
                Add to Bag
            </button>
          </div>

          {/* Favorite Button */}
          <button 
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
            className="absolute top-4 right-4 p-2.5 bg-white/80 backdrop-blur-sm rounded-full text-black hover:bg-[#c8b99a] hover:text-white transition-all shadow-sm opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 duration-500 z-20 cursor-pointer"
          >
            <Heart size={16} fill={isFavorite ? "currentColor" : "none"} />
          </button>
        </div>
      </Link>

      {/* Content */}
      <div className="flex flex-col flex-grow p-4 space-y-3">
        <Link href={`/products/${id}`}>
          <div>
            <h3 className="text-[12px] tracking-[0.1em] font-bold text-black uppercase group-hover:text-[#c8b99a] transition-colors line-clamp-1">
              {title}
            </h3>
            <p className="text-[11px] text-[#888] font-light mt-1">
              {description}
            </p>
          </div>
        </Link>

        {sizes && sizes.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {sizes.map((size) => (
              <button 
                key={size} 
                onClick={() => setSelectedSize(size === selectedSize ? null : size)}
                className={`text-[9px] px-2 py-0.5 border transition-all duration-300 cursor-pointer uppercase font-bold ${
                  selectedSize === size 
                    ? 'bg-[#c8b99a] text-black border-[#c8b99a]' 
                    : 'bg-transparent text-black/50 border-black/5 hover:border-black/20 hover:text-black'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        )}

        <div className="mt-auto pt-2 flex items-center gap-3">
          <span className="text-[14px] font-bold text-black">
            Rs {price}
          </span>
          {originalPrice && (
            <span className="text-[11px] text-[#555] line-through">
              Rs {originalPrice}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
