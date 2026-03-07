import React from 'react';
import Image, { StaticImageData } from 'next/image';

interface ProductCardProps {
  title: string;
  description: string;
  price: string;
  originalPrice?: string;
  imageUrl?: string | StaticImageData;
  badge?: 'NEW' | 'SALE';
  isFavorite?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({
  title,
  description,
  price,
  originalPrice,
  imageUrl,
  badge,
  isFavorite = false,
}) => {
  return (
    <div className="bg-white rounded-sm flex flex-col h-full relative group transition-all duration-300 hover:shadow-2xl overflow-hidden">
      {/* Badge (NEW/SALE) */}
      {badge && (
        <div className={`absolute top-4 left-4 z-10 px-3 py-1 text-[10px] font-bold tracking-widest rounded ${
          badge === 'NEW' ? 'bg-[#2D261E] text-white' : 'bg-[#A37B5C] text-white'
        }`}>
          {badge}
        </div>
      )}

      {/* Image Container */}
      <div className="aspect-[4.5/5] relative">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 cursor-pointer"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[#2D261E]/5">
            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.5">
               <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
               <circle cx="8.5" cy="8.5" r="1.5" />
               <polyline points="21 15 16 10 5 21" />
            </svg>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-grow p-4">
        <h3 className="text-[15px] font-medium text-[#2D261E] mb-1 line-clamp-1">
          {title}
        </h3>
        <p className="text-[13px] text-[#2D261E]/60 mb-4 line-clamp-1">
          {description}
        </p>

        <div className="mt-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-[16px] font-bold text-[#2D261E]">
              Rs {price}
            </span>
            {originalPrice && (
              <span className="text-[13px] text-[#2D261E]/30 line-through">
                Rs {originalPrice}
              </span>
            )}
          </div>
          
          <button className="bg-[#2D261E] text-white text-[11px] font-bold tracking-widest px-5 py-2.5 rounded hover:bg-[#40372D] transition-colors cursor-pointer uppercase">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
