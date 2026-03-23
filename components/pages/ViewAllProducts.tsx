"use client";

import React, { useState, useMemo } from 'react';
import { ChevronUp, ChevronDown, Grid, List, Star, Filter, X } from 'lucide-react';
import ProductCard from '../product/ProductCard';
import producyImage from '../../public/images/images.jpeg';

const MOCK_PRODUCTS = [
  {
    id: 1,
    title: 'CUTWORK POPLIN DRESS',
    description: 'A premium cotton blend dress',
    price: '9,950.00',
    numericPrice: 9950,
    colors: ['BLACK', 'BROWN'],
    productType: 'POLO',
    rating: 4,
    size: ['S', 'M'],
    image: producyImage,
    width:'200px',
    heught:"500px",
    hoverImage: producyImage,
    badge: 'NEW' as const,
  },
  {
    id: 2,
    title: 'CLASSIC HENLEY SHIRT',
    description: 'Comfortable everyday wear',
    price: '4,500.00',
    numericPrice: 4500,
    colors: ['WHITE', 'GREY'],
    productType: 'HENLEY',
    rating: 5,
    size: ['Medium', 'Large'],
    image: producyImage,
    width:'200px',
    heught:"500px",
    hoverImage: producyImage,
  },
  {
    id: 3,
    title: 'CASUAL POLO T-SHIRT',
    description: 'Perfect for summer',
    price: '3,200.00',
    numericPrice: 3200,
    colors: ['RED', 'BLACK'],
    productType: 'POLO',
    rating: 3,
    size: ['Large', 'X Large'],
    image: producyImage,
    hoverImage: producyImage,
    badge: 'SALE' as const,
  },
  {
    id: 4,
    title: 'PREMIUM LINEN SHIRT',
    description: 'Elegant look for any occasion',
    price: '8,900.00',
    numericPrice: 8900,
    colors: ['BLACK', 'GREY'],
    productType: 'HENLEY',
    rating: 5,
    size: ['Small', 'Large'],
    image: producyImage,
    hoverImage: producyImage,
  },
  {
    id: 5,
    title: 'SLIM FIT POLO',
    description: 'Modern slim fit design',
    price: '5,500.00',
    numericPrice: 5500,
    colors: ['WHITE', 'BROWN'],
    productType: 'POLO',
    rating: 4,
    size: ['Small', 'Medium', 'Large'],
    image: producyImage,
    hoverImage: producyImage,
  },
  {
    id: 6,
    title: 'COMFORT HENLEY TEE',
    description: 'Soft touch fabric',
    price: '2,800.00',
    numericPrice: 2800,
    colors: ['RED', 'WHITE'],
    productType: 'HENLEY',
    rating: 2,
    size: ['Small', 'X Large'],
    image: producyImage,
    hoverImage: producyImage, 
  },
];

const FILTER_SECTIONS = [
  {
    id: 'size',
    title: 'Size',
    type: 'checkbox',
    options: ['Small', 'Medium', 'Large', 'X Large'],
  },
  {
    id: 'productType',
    title: 'Product Type',
    type: 'checkbox',
    options: ['HENLEY', 'POLO'],
  },
  {
    id: 'price',
    title: 'Price range',
    type: 'range',
  },
  {
    id: 'color',
    title: 'Color',
    type: 'checkbox',
    options: ['BLACK', 'BROWN', 'RED', 'GREY', 'WHITE'],
  },
  {
    id: 'rating',
    title: 'Ratings',
    type: 'rating',
    options: [5, 4, 3, 2, 1],
  },
];

const SORT_OPTIONS = ["Featured", "Price: Low to High", "Price: High to Low", "New Arrivals"];

export default function ViewAllProducts() {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    'Size': true,
    'Product Type': true,
    'Price range': true,
    'Color': true,
    'Ratings': true,
  });

  // State for all filters
  const [filters, setFilters] = useState<{
    size: string[];
    productType: string[];
    color: string[];
    rating: number[];
  }>({
    size: [],
    productType: [],
    color: [],
    rating: [],
  });

  const [priceRange, setPriceRange] = useState({ min: 0, max: 20000 });
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [sortOption, setSortOption] = useState("Featured");
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const toggleSection = (title: string) => {
    setOpenSections(prev => ({ ...prev, [title]: !prev[title] }));
  };

  const handleCheckboxChange = (category: keyof typeof filters, value: string | number) => {
    setFilters(prev => {
      const currentList = prev[category] as any[];
      if (currentList.includes(value)) {
        return { ...prev, [category]: currentList.filter(item => item !== value) };
      } else {
        return { ...prev, [category]: [...currentList, value] };
      }
    });
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'min' | 'max') => {
    const val = Number.parseInt(e.target.value) || 0;
    setPriceRange(prev => ({ ...prev, [type]: val }));
  };

  const filteredProducts = useMemo(() => {
    return MOCK_PRODUCTS.filter(product => {
      // Filter by size
      if (filters.size.length > 0 && !filters.size.some(val => product.size.includes(val))) return false;
      // Filter by product type
      if (filters.productType.length > 0 && !filters.productType.includes(product.productType)) return false;
      // Filter by color
      if (filters.color.length > 0 && !filters.color.some(val => product.colors.includes(val))) return false;
      // Filter by rating
      if (filters.rating.length > 0 && !filters.rating.includes(product.rating)) return false;
      // Filter by price
      if (product.numericPrice < priceRange.min || product.numericPrice > priceRange.max) return false;

      return true;
    }).sort((a, b) => {
      if (sortOption === "Price: Low to High") return a.numericPrice - b.numericPrice;
      if (sortOption === "Price: High to Low") return b.numericPrice - a.numericPrice;
      return 0; // Featured or New Arrivals (mocked as random/default order)
    });
  }, [filters, priceRange, sortOption]);

  return (
    <div className="max-w-screen-2xl mx-auto px-4 md:px-8 py-10 lg:py-16 flex flex-col lg:flex-row gap-10">
      
      {/* MOBILE OVERLAY */}
      {isMobileFiltersOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-[100] lg:hidden backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setIsMobileFiltersOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* LEFT SIDEBAR - FILTERS */}
      <aside className={`fixed inset-y-0 left-0 z-[101] w-72 bg-white border-r border-black/5 p-6 overflow-y-auto transform transition-transform duration-300 lg:static lg:w-64 lg:p-0 lg:border-0 lg:bg-transparent lg:translate-x-0 ${isMobileFiltersOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between lg:hidden mb-8 border-b border-black/5 pb-4">
          <h2 className="text-xl font-bold tracking-tight text-black uppercase flex items-center gap-2">
            <Filter size={18} />
            Filters
          </h2>
          <button 
            onClick={() => setIsMobileFiltersOpen(false)}
            className="p-2 hover:bg-black/5 rounded-full text-black/40 hover:text-black transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex flex-col gap-6">
          {FILTER_SECTIONS.map((section, idx) => {
            const isOpen = openSections[section.title];
            
            return (
              <div key={idx} className="border-b border-black/5 pb-6 last:border-0 last:pb-0">
                <button 
                  onClick={() => toggleSection(section.title)}
                  className="flex items-center justify-between w-full text-left font-semibold text-sm mb-4 tracking-wide text-black group"
                >
                  <span className="group-hover:text-[#A37B5C] transition-colors">{section.title}</span>
                  {isOpen ? <ChevronUp size={16} className="text-gray-500" /> : <ChevronDown size={16} className="text-gray-500" />}
                </button>
                
                {isOpen && (
                  <div className="flex flex-col gap-3 animate-fade-in">
                    
                    {/* CHECKBOX TYPE (Size, Product Type, Color) */}
                    {section.type === 'checkbox' && section.options?.map((opt, i) => {
                      const isChecked = (filters[section.id as keyof typeof filters] as any[]).includes(opt);
                      
                      return (
                        <label key={i} className="flex items-center gap-3 cursor-pointer group">
                          <div className={`relative flex items-center justify-center w-4 h-4 border rounded transition-all duration-200 ${isChecked ? 'bg-black border-black' : 'border-black/20 group-hover:border-black/40'}`}>
                            <input 
                              type="checkbox" 
                              checked={isChecked}
                              onChange={() => handleCheckboxChange(section.id as keyof typeof filters, opt)}
                              className="sr-only" 
                            />
                            {isChecked && (
                              <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                          <span className={`text-[11px] tracking-wider uppercase transition-colors ${isChecked ? 'text-black' : 'text-black/40 group-hover:text-black'}`}>
                              {opt}
                          </span>
                        </label>
                      );
                    })}

                    {/* PRICE RANGE TYPE */}
                    {section.type === 'range' && (
                      <div className="flex flex-col gap-4 mt-2">
                        <div className="flex items-center justify-between gap-4">
                            <div className="flex flex-col gap-1.5 w-full">
                              <span className="text-[9px] text-black/40 font-bold uppercase tracking-tight">Min (Rs)</span>
                              <div className="relative">
                                <input 
                                  type="number" 
                                  value={priceRange.min}
                                  onChange={(e) => handlePriceChange(e, 'min')}
                                  className="w-full bg-black/5 border border-black/10 text-black text-[11px] py-2 px-3 outline-none focus:border-[#A37B5C] transition-colors rounded-sm" 
                                />
                              </div>
                            </div>
                            <div className="flex flex-col gap-1.5 w-full">
                              <span className="text-[9px] text-black/40 font-bold uppercase tracking-tight">Max (Rs)</span>
                              <div className="relative">
                                <input 
                                  type="number" 
                                  value={priceRange.max}
                                  onChange={(e) => handlePriceChange(e, 'max')}
                                  className="w-full bg-black/5 border border-black/10 text-black text-[11px] py-2 px-3 outline-none focus:border-[#A37B5C] transition-colors rounded-sm" 
                                />
                              </div>
                            </div>
                        </div>
                      </div>
                    )}

                    {/* RATING TYPE */}
                    {section.type === 'rating' && section.options?.map((opt, i) => {
                      const numericOpt = Number(opt);
                      const isChecked = filters.rating.includes(numericOpt);

                      return (
                        <label key={i} className="flex items-center gap-3 cursor-pointer group">
                          <div className={`relative flex items-center justify-center w-4 h-4 border rounded transition-all duration-200 ${isChecked ? 'bg-black border-black' : 'border-black/20 group-hover:border-black/40'}`}>
                            <input 
                              type="checkbox" 
                              checked={isChecked}
                              onChange={() => handleCheckboxChange('rating', numericOpt)}
                              className="sr-only" 
                            />
                            {isChecked && (
                              <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                          <div className="flex gap-0.5">
                            {[...new Array(5)].map((_, starIdx) => {
                              const isFilled = starIdx < numericOpt;
                              return (
                                <Star 
                                  key={starIdx} 
                                  size={13} 
                                  fill={isFilled ? '#f5b62dff' : 'transparent'} 
                                  color={isFilled ? '#f5b62dff' : '#f1f4f7ff'}
                                  strokeWidth={1.5}
                                />
                              );
                            })}
                          </div>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </aside>

      {/* RIGHT MAIN AREA - PRODUCTS */}
      <section className="flex-1 flex flex-col">
        {/* TOP BAR */}
        <div className="flex flex-col sm:flex-row items-center border border-black/5 py-3 px-4 md:px-6 mb-8 justify-between text-xs tracking-wider uppercase font-semibold text-black/40 gap-4 shadow-sm bg-white">
          <div className="flex items-center justify-between w-full sm:w-auto gap-4">
            <button 
              onClick={() => setIsMobileFiltersOpen(true)}
              className="lg:hidden flex items-center gap-2 bg-black text-white px-4 py-2 rounded-sm font-bold active:scale-95 transition-transform"
            >
              <Filter size={14} />
              Filters
            </button>
            <span className="hidden sm:inline-block border-l border-black/5 pl-4">
              {filteredProducts.length} ITEMS FOUND
            </span>
            <span className="sm:hidden font-bold text-[10px]">
              {filteredProducts.length} ITEMS
            </span>
          </div>
          <div className="flex items-center gap-6">

            {/* SORTING DROPDOWN */}
            <div className="relative border-l border-black/5 pl-6 cursor-pointer">
               <div 
                  className="flex items-center gap-2 hover:text-white transition-colors"
                  onClick={() => setIsSortOpen(!isSortOpen)}
               >
                 <span>{sortOption}</span>
                 <ChevronDown size={14} className={`transition-transform ${isSortOpen ? 'rotate-180' : ''}`} />
               </div>
               
               {isSortOpen && (
                 <div className="absolute top-full right-0 mt-2 min-w-[160px] bg-white border border-black/5 rounded-sm shadow-xl z-50 py-2">
                   {SORT_OPTIONS.map((opt, id) => (
                     <button 
                       key={id}
                       onClick={() => {
                         setSortOption(opt);
                         setIsSortOpen(false);
                       }}
                       className={`w-full text-left px-4 py-2 hover:bg-black/5 transition-colors ${sortOption === opt ? 'text-black font-bold' : 'text-black/40'}`}
                     >
                       {opt}
                     </button>
                   ))}
                 </div>
               )}
            </div>

            <div className="flex items-center gap-1 border-l border-black/5 pl-6">
               <button className="p-1 rounded bg-black text-white hover:bg-black/80 transition-colors shadow-md">
                 <Grid size={16} strokeWidth={2.5} />
               </button>
               <button className="p-1 hover:bg-black/5 rounded text-black/40 transition-colors">
                 <List size={16} strokeWidth={2.5} />
               </button>
            </div>
          </div>
        </div>

        {/* PRODUCTS GRID */}
        <div className="grid grid-cols-1 min-[400px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 md:gap-x-6 gap-y-8 md:gap-y-10 min-h-[400px]">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div key={product.id} className="animate-fade-in">
                <ProductCard
                  title={product.title}
                  description={product.description}
                  price={product.price}
                  imageUrl={product.image}
                  badge={product.badge}
                  sizes={product.size}
                />
              </div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center text-black/40 italic">
              No items found in this category.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}