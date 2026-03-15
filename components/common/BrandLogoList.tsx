import React from 'react';

const brands = [
  { name: 'VALENTINE', id: 1 },
  { name: 'ASTORIA', id: 2 },
  { name: 'LUMIÈRE', id: 3 },
  { name: 'NOIR', id: 4 },
  { name: 'ESTELLA', id: 5 },
  { name: 'ORCHID', id: 6 },
  { name: 'ELEVATE', id: 7 },
  { name: 'MODERN', id: 8 },
  { name: 'NEXOWA', id: 9 },
];

export default function BrandLogoList() {
  const displayBrands = [...brands, ...brands];

  return (
    <div className="py-12 border-y border-[#A37B5C]/10 overflow-hidden relative group pause-on-hover">
      <div className="absolute left-0 top-0 w-32 h-full z-10"></div>
      <div className="absolute right-0 top-0 w-32 h-full z-10"></div>

      <div className="animate-marquee flex gap-16 md:gap-32 items-center">
        {displayBrands.map((brand, index) => (
          <div
            key={`${brand.id}-${index}`}
            className="flex items-center justify-center grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500 cursor-pointer"
          >
            <span className="text-2xl md:text-3xl font-serif tracking-[0.3em] text-white whitespace-nowrap">
              {brand.name}
            </span>
          </div>
        ))}
      </div>
      
      {/* Subtle bottom accent line */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-[1px] bg-[#A37B5C]/30"></div>
    </div>
  );
}
