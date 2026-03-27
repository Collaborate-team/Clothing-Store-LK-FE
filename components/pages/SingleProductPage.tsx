'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useParams, useSearchParams } from 'next/navigation';
import { 
  Heart, 
  ShoppingBag, 
  ChevronRight, 
  Minus, 
  Plus, 
  Truck, 
  RotateCcw, 
  ShieldCheck,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import ProductCard from '../product/ProductCard';
import { useCart } from '@/hooks/useCart';
import { useNotification } from '@/context/NotificationContext';
import { ERROR_MESSAGES } from '@/utils/error-handler';

type RelatedProduct = {
  id?: number;
  name: string;
  description?: string;
  price: number;
  sizes?: string[];
  colors?: string[];
  imageUrls?: string[];
};

type ProductColor = {
  name: string;
  hex: string;
};

type ProductDetail = {
  title: string;
  content: string;
};

type ProductDataType = {
  id: string | null;
  name: string;
  category: string;
  price: string;
  quantity: number;
  description: string;
  colors: ProductColor[];
  sizes: string[];
  images: string[];
  details: ProductDetail[];
};

const SingleProductPage: React.FC = () => {
  const { addToCart: addToCartWithValidation } = useCart();
  const { showNotification } = useNotification();
  const params = useParams();
  const searchParams = useSearchParams();
  const productId = (params?.id as string) || searchParams.get('id');

  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColor, setSelectedColor] = useState<ProductColor | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [openDetail, setOpenDetail] = useState<number | null>(0);

  const [productData, setProductData] = useState<ProductDataType>({
    id: null,
    name: '',
    category: '',
    price: '0.00',
    quantity: 0,
    description: '',
    colors: [],
    sizes: [],
    images: [],
    details: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [relatedProducts, setRelatedProducts] = useState<RelatedProduct[]>([]);

  useEffect(() => {
    let active = true;

    const fetchProduct = async () => {
      if (!productId) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const { fetchProductById, fetchProductsByCategory } = await import('../../app/api/api-service');
        const item = await fetchProductById(productId);
        if (!active) return;

        const mappedColors = item.colors && item.colors.length > 0
          ? item.colors.map((c: string) => ({ name: c, hex: c.toLowerCase() }))
          : [];

        const normalizedProductId = Number(item.id ?? productId);
        setProductData({
          id: item.id?.toString() || productId,
          name: item.name,
          category: item.category,
          price: item.price ? item.price.toFixed(2) : '0.00',
          quantity: item.quantity ?? 0,
          description: item.description || '',
          colors: mappedColors,
          sizes: item.sizes || [],
          images: (item.imageUrls || []).filter((url: string) => url && url.trim() !== ''),
          details: [],
        });

        if (mappedColors.length > 0) {
          setSelectedColor(mappedColors[0]);
        }

        if (item.category) {
          const sameCategoryProducts = await fetchProductsByCategory(item.category);
          if (!active) return;

          const filteredRelated = sameCategoryProducts
            .filter((product: RelatedProduct) => Number(product.id) !== normalizedProductId)
            .slice(0, 4);

          setRelatedProducts(filteredRelated);
        } else {
          setRelatedProducts([]);
        }
      } catch (error) {
        console.error('Failed to fetch products by id', error);
        if (active) setRelatedProducts([]);
      } finally {
        if (active) setIsLoading(false);
      }
    };

    void fetchProduct();
    return () => {
      active = false;
    };
  }, [productId]);

  const toggleDetail = (index: number) => {
    setOpenDetail(openDetail === index ? null : index);
  };

  const increaseQuantity = () => {
    if (productData.quantity <= 0) {
      showNotification(ERROR_MESSAGES.OUT_OF_STOCK, 'error');
      return;
    }

    const maxAllowedQuantity = productData.quantity;

    if (quantity >= maxAllowedQuantity) {
      showNotification(`Only ${productData.quantity} items are available in stock.`, 'error');
      return;
    }

    setQuantity((q) => q + 1);
  };

  const addToCart = () => {
    addToCartWithValidation({
      id: Number(productData.id) || 0,
      name: productData.name,
      price: Number(String(productData.price).replaceAll(',', '')) || 0,
      size: selectedSize,
      color: selectedColor?.name || 'Default',
      quantity,
      image: productData.images?.[0] || '',
      stock: productData.quantity,
    });
  };

  return (
    <div className="min-h-screen bg-[#fcfbf7] text-[#0a0a0a]" style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}>
      {/* Breadcrumbs - Responsive text size */}
        <nav className="px-4 sm:px-6 pt-4 sm:pt-6 pb-8 sm:pb-12 flex items-center gap-2 text-[9px] sm:text-2xs tracking-widest uppercase text-black/50 mt-20 ">
          {productData.category && (
            <>
              <span className="text-black font-semibold">{productData.category}</span>
              <ChevronRight size={8} />
            </>
          )}
          <a href="/shop" className="hover:text-black transition-colors cursor-pointer">Shop</a>
          <ChevronRight size={8} />
          <span className="text-black font-semibold truncate max-w-[150px] sm:max-w-none">{productData.name}</span>
        </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pb-24">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 xl:gap-24 ">
          
          {/* Left: Image Gallery - Compact Layout */}
          <div className="w-full lg:w-[45%] xl:w-[45%] flex flex-col gap-4">
            {/* Mobile: Vertical Stack, Desktop: Side-by-Side */}
            <div className="flex flex-col lg:flex-row gap-3 lg:gap-4">
              {/* Main Image */}
              <div className="relative flex-1 aspect-3/4 sm:aspect-4/5 overflow-hidden bg-white border border-[#e5e1d8]">
                {productData.images[activeImage] ? (
                  <Image 
                    src={productData.images[activeImage]} 
                    alt={productData.name} 
                    fill 
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 40vw, 35vw"
                    className="object-cover transition-transform duration-700 hover:scale-105" 
                  />
                ) : (
                  <div className="w-full h-full bg-gray-50 flex items-center justify-center">
                    <div className="w-8 h-8 border-2 border-[#c8b99a]/20 border-t-[#c8b99a] rounded-full animate-spin" />
                  </div>
                )}
                <button className="absolute top-3 sm:top-4 right-3 sm:right-4 p-2.5 sm:p-3 bg-white/80 backdrop-blur-md rounded-full text-black hover:bg-black hover:text-white transition-all shadow-sm z-10 cursor-pointer">
                  <Heart size={16} />
                </button>
              </div>

              {/* Thumbnails - Vertical on Desktop, Horizontal on Mobile */}
              <div className="flex lg:flex-col gap-2 sm:gap-3 overflow-x-auto lg:overflow-x-visible lg:w-24 no-scrollbar py-2 lg:py-0">
                {productData.images.map((img: string, idx: number) => (
                  <button 
                    key={`${img}-${idx}`}
                    onClick={() => setActiveImage(idx)}
                    className={`relative w-16 h-20 sm:w-20 sm:h-28 lg:w-20 lg:h-24 shrink-0 border transition-all duration-300 cursor-pointer ${activeImage === idx ? 'border-black' : 'border-[#e5e1d8] grayscale-110 opacity-70 hover:opacity-100 hover:grayscale-0'}`}
                  >
                    <Image src={img} alt={`View ${idx + 1}`} fill sizes="100px" className="object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Product Info */}
          <div className="w-full lg:w-[55%] xl:w-[55%] flex flex-col gap-6 sm:gap-8">
            <div className="space-y-2 sm:space-y-3">
              <span className="text-[8px] sm:text-[9px] tracking-[0.4em] font-bold text-[#c8b99a] uppercase">{productData.category}</span>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-light tracking-tight text-black leading-tight" style={{ fontFamily: "var(--font-cormorant), 'Cormorant Garamond', serif" }}>
                {productData.name}
              </h1>
              <div className="flex items-center gap-4">
                <span className="text-lg sm:text-xl font-light">Rs {productData.price}</span>
                <span className="px-1.5 py-0.5 border border-[#e5e1d8] text-[7px] sm:text-[8px] tracking-[0.15em] font-bold uppercase rounded-sm">In Stock</span>
              </div>
            </div>

            <p className="text-[13px] sm:text-[14px] leading-[1.7] text-[#555] font-light">
              {productData.description}
            </p>

            {/* Color Selection */}
            <div className="space-y-3">
              <h3 className="text-[8px] sm:text-[9px] tracking-[0.3em] font-bold uppercase">Color: {selectedColor?.name || 'Select Color'}</h3>
              <div className="flex gap-3">
                {productData.colors?.map((color: ProductColor) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color)}
                    className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full border transition-all duration-300 cursor-pointer ${selectedColor?.name === color.name ? 'border-black scale-110' : 'border-[#e5e1d8] hover:border-black'}`}
                    style={{ backgroundColor: color.hex }}
                  />
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="text-[8px] sm:text-[9px] tracking-[0.3em] font-bold uppercase">Select Size</h3>
                <button className="text-[8px] tracking-[0.1em] uppercase border-b border-black font-semibold cursor-pointer">Size Guide</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {productData.sizes?.map((size: string) => (
                  <button 
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-[10px] sm:text-[11px] font-medium border transition-all duration-300 cursor-pointer ${selectedSize === size ? 'bg-black text-white border-black' : 'bg-white text-black border-[#e5e1d8] hover:border-black'}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity & Add to Cart */}
            <div className="space-y-3 sm:space-y-4 pt-2">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="flex items-center justify-between border border-[#e5e1d8] h-14 sm:h-12 px-4 bg-white w-full sm:w-32 shrink-0">
                  <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="p-1 hover:text-[#c8b99a] cursor-pointer"><Minus size={16} /></button>
                  <span className="text-[14px] sm:text-[13px] font-medium">{quantity}</span>
                  <button onClick={increaseQuantity} className="p-1 hover:text-[#c8b99a] cursor-pointer"><Plus size={16} /></button>
                </div>
                <button 
                  onClick={addToCart}
                  className="w-full sm:flex-1 h-14 sm:h-12 bg-black text-white text-[11px] sm:text-[10px] tracking-[0.2em] font-bold uppercase flex items-center justify-center gap-3 hover:bg-[#1a1a1a] transition-all cursor-pointer"
                >
                  <ShoppingBag size={18} />
                  Add to Cart
                </button>
              </div>
              
              <button className="w-full h-14 sm:h-12 border border-black text-black text-[11px] sm:text-[10px] tracking-[0.2em] font-bold uppercase hover:bg-black hover:text-white transition-all cursor-pointer">
                Quick Checkout
              </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-2 pt-6 border-t border-[#e5e1d8]">
              <div className="flex flex-col items-center sm:flex-row gap-1 sm:gap-2">
                <Truck size={14} className="text-[#c8b99a]" />
                <span className="text-[7px] sm:text-[8px] tracking-[0.1em] uppercase font-bold text-[#b5b1a8]">Shipping</span>
              </div>
              <div className="flex flex-col items-center sm:flex-row gap-1 sm:gap-2">
                <RotateCcw size={14} className="text-[#c8b99a]" />
                <span className="text-[7px] sm:text-[8px] tracking-[0.1em] uppercase font-bold text-[#b5b1a8]">Returns</span>
              </div>
              <div className="flex flex-col items-center sm:flex-row gap-1 sm:gap-2">
                <ShieldCheck size={14} className="text-[#c8b99a]" />
                <span className="text-[7px] sm:text-[8px] tracking-[0.1em] uppercase font-bold text-[#b5b1a8]">Secure</span>
              </div>
            </div>

            {/* Accordion Details */}
            <div className="pt-2 border-t border-[#e5e1d8]">
              {productData.details?.map((detail: ProductDetail, idx: number) => (
                <div key={detail.title} className="border-b border-[#e5e1d8] last:border-0">
                  <button 
                    onClick={() => toggleDetail(idx)}
                    className="w-full py-4 flex justify-between items-center text-[8px] sm:text-[9px] tracking-[0.3em] font-bold uppercase text-left group cursor-pointer"
                  >
                    <span>{detail.title}</span>
                    {openDetail === idx ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                  </button>
                  <div className={`transition-all duration-300 ${openDetail === idx ? 'max-h-32 pb-4 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                    <p className="text-[11px] sm:text-[12px] leading-[1.6] text-[#666] font-light italic">
                      {detail.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RELATED PRODUCTS */}
        <section className="mt-20 sm:mt-32">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 sm:mb-10 border-b border-[#e5e1d8] pb-6 gap-4">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-light tracking-tight" style={{ fontFamily: "var(--font-cormorant), 'Cormorant Garamond', serif" }}>
              Suggested <span className="text-[#c8b99a]">Items</span>
            </h2>
            <a href="/shop" className="text-[8px] sm:text-[9px] font-bold tracking-[0.2em] uppercase border-b-2 border-[#c8b99a] pb-1 cursor-pointer">Shop Archive</a>
          </div>

          <div className="grid grid-cols-1 min-[400px]:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.map((product) => (
              <div key={product.id}>
                <ProductCard
                  id={product.id}
                  title={product.name}
                  description={product.description || 'Premium quality apparel'}
                  price={product.price?.toFixed(2) || '0.00'}
                  sizes={product.sizes}
                  colors={product.colors}
                  imageUrl={product.imageUrls?.[0]}
                />
              </div>
            ))}
          </div>

          {!isLoading && relatedProducts.length === 0 && (
            <p className="mt-6 text-[10px] tracking-[0.2em] uppercase text-black/40">
              No suggested items available for this category right now.
            </p>
          )}
        </section>
      </main>
    </div>
  );
};

export default SingleProductPage;