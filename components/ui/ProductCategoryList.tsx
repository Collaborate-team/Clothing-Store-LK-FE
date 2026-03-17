"use client";

import { useState, useEffect } from 'react';
import ProductCard from '../product/ProductCard';
import producyImage from '../../public/images/images.jpeg'
import hoverImage1 from '../../public/images/carousel/carousel-1.jpg'
import hoverImage2 from '../../public/images/carousel/carousel-2.jpg'
import hoverImage3 from '../../public/images/carousel/carousel-4.jpg'
import hoverImage4 from '../../public/images/carousel/carousel-5.jpg'

const ProductCategoryList = () => {
    const [activeTab, setActiveTab] = useState("All Items");
    const [visibleCount, setVisibleCount] = useState(4);

    useEffect(() => {
        setVisibleCount(4);
    }, [activeTab]);

    const products = [
        {
            id: 1,
            title: "Linen Wrap Dress",
            description: "Natural",
            price: "128.00",
            category: "Women",
            badge: undefined,
            imageUrl: producyImage,
            hoverImageUrl: hoverImage1,
            sizes: ["S", "M", "L", "XL"]
        },
        {
            id: 2,
            title: "Silk Slip Blouse",
            description: "Ivory",
            price: "96.00",
            category: "Women",
            badge: undefined,
            imageUrl: producyImage,
            hoverImageUrl: hoverImage2,
            sizes: ["XS", "S", "M", "L"]
        },
        {
            id: 3,
            title: "Tailored Linen Coat",
            description: "Sand",
            price: "245.00",
            category: "Women",
            badge: "NEW" as const,
            imageUrl: producyImage,
            hoverImageUrl: hoverImage3,
            sizes: ["XS", "S", "M", "L", "XL"]
        },
        {
            id: 4,
            title: "Wide Leg Trousers",
            description: "Ecru",
            price: "112.00",
            category: "Women",
            badge: undefined,
            imageUrl: producyImage,
            hoverImageUrl: hoverImage4,
            sizes: ["6", "8", "10", "12", "14", "16"]
        },
        {
            id: 5,
            title: "Cotton Knit Cardigan",
            description: "Oat",
            price: "74.00",
            originalPrice: "98.00",
            category: "Sale",
            badge: "SALE" as const,
            imageUrl: producyImage,
            sizes: ["One Size"]
        },
        {
            id: 6,
            title: "Merino Turtleneck",
            description: "Charcoal",
            price: "135.00",
            category: "Men",
            badge: undefined,
            imageUrl: producyImage,
            sizes: ["XS", "S", "M", "L"]
        },
        {
            id: 7,
            title: "Oversized Blazer",
            description: "Stone",
            price: "198.00",
            category: "Women",
            badge: undefined,
            imageUrl: producyImage,
            sizes: ["6", "8", "10", "12", "14"]
        },
        {
            id: 8,
            title: "Pleated Midi Skirt",
            description: "Blush",
            price: "89.00",
            category: "Women",
            badge: undefined,
            imageUrl: producyImage,
            sizes: ["6", "8", "10", "12", "14", "16"]
        },
        {
            id: 9,
            title: "Classic Cotton Shirt",
            description: "White",
            price: "85.00",
            category: "Men",
            badge: undefined,
            imageUrl: producyImage,
            sizes: ["M", "L", "XL", "XXL"]
        },
        {
            id: 10,
            title: "Leather Handbag",
            description: "Tan",
            price: "210.00",
            category: "Accessories",
            badge: "NEW" as const,
            imageUrl: producyImage,
            sizes: ["Genuine Leather"]
        }
    ];

    const tabs = ["All Items", "Men", "Women", "Accessories", "Sale"];

    const filteredProducts = activeTab === "All Items" 
        ? products 
        : products.filter(p => p.category === activeTab);

    const visibleProducts = filteredProducts.slice(0, visibleCount);

    return (
        <div className="bg-white min-h-screen text-black py-16 px-4 md:px-8 lg:px-12 font-sans">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif mb-6 tracking-tight animate-fade-in-down">
                        New Season Collection
                    </h1>
                    <p className="text-black italic text-sm md:text-md max-w-lg mx-auto mb-10 opacity-80 animate-fade-in-up">
                        Thoughtfully made pieces for the modern wardrobe — crafted to last
                    </p>
                    
                    {/* Tabs */}
                    <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 border-b border-black/10 pb-4 mb-16 relative">
                        {tabs.map((tab) => (
                            <button 
                                key={tab} 
                                onClick={() => setActiveTab(tab)}
                                className={`text-[12px] font-bold tracking-[0.1em] transition-all duration-300 cursor-pointer uppercase relative pb-4 ${
                                    activeTab === tab 
                                    ? "text-black" 
                                    : "text-black/40 hover:text-black"
                                }`}
                            >
                                {tab}
                                {activeTab === tab && (
                                    <span className="absolute bottom-0 left-0 w-full h-[2px] bg-black animate-grow-x"></span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 min-[400px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 md:gap-x-6 gap-y-8 md:gap-y-10 min-h-[400px]">
                    {visibleProducts.length > 0 ? (
                        visibleProducts.map((product) => (
                            <div key={product.id} className="animate-fade-in">
                                <ProductCard
                                    title={product.title}
                                    description={product.description}
                                    price={product.price}
                                    originalPrice={product.originalPrice}
                                    badge={product.badge}
                                    imageUrl={product.imageUrl}
                                    hoverImageUrl={(product as any).hoverImageUrl}
                                    sizes={product.sizes}
                                />
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full py-20 text-center text-black/40 italic">
                            No items found in this category.
                        </div>
                    )}
                </div>

                {/* Footer */}
                {visibleCount < filteredProducts.length && (
                    <div className="mt-8 flex flex-col items-center gap-4 border-t border-black/5 pt-8 pb-12">
                        <button 
                            onClick={() => setVisibleCount(prev => prev + 4)}
                            className="group flex flex-col items-center gap-3 cursor-pointer"
                        >
                            <span className="text-[12px] font-bold text-black underline underline-offset-[10px] decoration-black/20 group-hover:decoration-black transition-all tracking-widest uppercase">
                                Show More
                            </span>
                            <span className="text-[10px] text-black/50 font-medium">
                                Showing {visibleProducts.length} of {filteredProducts.length} items
                            </span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductCategoryList;

