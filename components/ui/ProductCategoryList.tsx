"use client";

import { useState } from 'react';
import ProductCard from '../product/ProductCard';
import producyImage from '../../public/images/images.jpeg'

const ProductCategoryList = () => {
    const [activeTab, setActiveTab] = useState("All Items");

    const products = [
        {
            id: 1,
            title: "Linen Wrap Dress",
            description: "Natural / S-XL",
            price: "128.00",
            category: "Women",
            badge: undefined,
            imageUrl: producyImage
        },
        {
            id: 2,
            title: "Silk Slip Blouse",
            description: "Ivory / XS-L",
            price: "96.00",
            category: "Women",
            badge: undefined,
            imageUrl: producyImage
        },
        {
            id: 3,
            title: "Tailored Linen Coat",
            description: "Sand / XS-XL",
            price: "245.00",
            category: "Women",
            badge: "NEW" as const,
            imageUrl: producyImage
        },
        {
            id: 4,
            title: "Wide Leg Trousers",
            description: "Ecru / 6-16",
            price: "112.00",
            category: "Women",
            badge: undefined,
            imageUrl: producyImage
        },
        {
            id: 5,
            title: "Cotton Knit Cardigan",
            description: "Oat / One Size",
            price: "74.00",
            originalPrice: "98.00",
            category: "Sale",
            badge: "SALE" as const,
            imageUrl: producyImage
        },
        {
            id: 6,
            title: "Merino Turtleneck",
            description: "Charcoal / XS-L",
            price: "135.00",
            category: "Men",
            badge: undefined,
            imageUrl: producyImage
        },
        {
            id: 7,
            title: "Oversized Blazer",
            description: "Stone / 6-14",
            price: "198.00",
            category: "Women",
            badge: undefined,
            imageUrl: producyImage
        },
        {
            id: 8,
            title: "Pleated Midi Skirt",
            description: "Blush / 6-16",
            price: "89.00",
            category: "Women",
            badge: undefined,
            imageUrl: producyImage
        },
        {
            id: 9,
            title: "Classic Cotton Shirt",
            description: "White / M-XXL",
            price: "85.00",
            category: "Men",
            badge: undefined,
            imageUrl: producyImage
        },
        {
            id: 10,
            title: "Leather Handbag",
            description: "Tan / Genuine Leather",
            price: "210.00",
            category: "Accessories",
            badge: "NEW" as const,
            imageUrl: producyImage
        }
    ];

    const tabs = ["All Items", "Women", "Men", "Accessories", "Sale"];

    const filteredProducts = activeTab === "All Items" 
        ? products 
        : products.filter(p => p.category === activeTab);

    return (
        <div className="bg-black min-h-screen text-white py-16 px-4 md:px-8 lg:px-12 font-sans">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif mb-6 tracking-tight animate-fade-in-down">
                        New Season Collection
                    </h1>
                    <p className="text-[#A37B5C] italic text-sm md:text-md max-w-lg mx-auto mb-10 opacity-80 animate-fade-in-up">
                        Thoughtfully made pieces for the modern wardrobe — crafted to last
                    </p>
                    
                    {/* Tabs */}
                    <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 border-b border-[#A37B5C]/20 pb-4 mb-16 relative">
                        {tabs.map((tab) => (
                            <button 
                                key={tab} 
                                onClick={() => setActiveTab(tab)}
                                className={`text-[12px] font-bold tracking-[0.1em] transition-all duration-300 cursor-pointer uppercase relative pb-4 ${
                                    activeTab === tab 
                                    ? "text-white" 
                                    : "text-white/40 hover:text-white"
                                }`}
                            >
                                {tab}
                                {activeTab === tab && (
                                    <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#A37B5C] animate-grow-x"></span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10 min-h-[400px]">
                    {filteredProducts.length > 0 ? (
                        filteredProducts.map((product) => (
                            <div key={product.id} className="animate-fade-in">
                                <ProductCard
                                    title={product.title}
                                    description={product.description}
                                    price={product.price}
                                    originalPrice={product.originalPrice}
                                    badge={product.badge}
                                    imageUrl={product.imageUrl}
                                />
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full py-20 text-center text-white/40 italic">
                            No items found in this category.
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="mt-20 flex flex-col items-center gap-4 border-t border-[#A37B5C]/10 pt-12 pb-24">
                   <div className="flex justify-between w-full text-[11px] font-bold text-[#A37B5C]/60 tracking-widest uppercase mb-12">
                        <span>{filteredProducts.length} Pieces</span>
                   </div>
                    <button className="text-[12px] font-bold text-[#A37B5C] underline underline-offset-[10px] decoration-[#A37B5C]/30 hover:decoration-[#A37B5C] transition-all cursor-pointer tracking-widest uppercase">
                        Show More
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCategoryList;

