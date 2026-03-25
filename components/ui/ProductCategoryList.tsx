"use client";

import { useState, useEffect } from 'react';
import { fetchAllProducts, fetchProductsByCategory } from '../../app/api/api-service';
import ProductCard from '../product/ProductCard';
import producyImage from '../../public/images/images.jpeg'

const ProductCategoryList = () => {
    const [activeTab, setActiveTab] = useState("All Items");
    const [visibleCount, setVisibleCount] = useState(4);
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setVisibleCount(4);
    }, [activeTab]);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                let data;
                if (activeTab === "All Items") {
                    data = await fetchAllProducts();
                } else {
                    data = await fetchProductsByCategory(activeTab);
                }
                
                const mappedData = data.map((item: any) => ({
                    id: item.id,
                    title: item.name,
                    description: item.description,
                    price: item.price ? item.price.toFixed(2) : "0.00",
                    category: item.category,
                    imageUrl: item.imageUrls?.[0] || producyImage,
                    hoverImageUrl: item.imageUrls?.[1],
                    sizes: item.sizes,
                    colors: item.colors
                }));
                setProducts(mappedData);
            } catch (error) {
                console.error("Failed to fetch products:", error);
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [activeTab]);

    const tabs = ["All Items", "SHIRTS", "PANTS", "DRESSES", "ACCESSORIES"];

    const visibleProducts = products.slice(0, visibleCount);

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
                {loading ? (
                    <div className="py-20 text-center text-black/40 italic">Loading...</div>
                ) : (
                    <div className="grid grid-cols-1 min-[400px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 md:gap-x-6 gap-y-8 md:gap-y-10 min-h-[400px]">
                        {visibleProducts.length > 0 ? (
                            visibleProducts.map((product) => (
                                <div key={product.id} className="animate-fade-in block">
                                    <ProductCard
                                        id={product.id}
                                        title={product.title}
                                        description={product.description}
                                        price={product.price}
                                        originalPrice={product.originalPrice}
                                        badge={product.badge}
                                        imageUrl={product.imageUrl}
                                        hoverImageUrl={product.hoverImageUrl}
                                        sizes={product.sizes}
                                        colors={product.colors}
                                    />
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full py-20 text-center text-black/40 italic">
                                No items found in this category.
                            </div>
                        )}
                    </div>
                )}

                {/* Footer */}
                {visibleCount < products.length && (
                    <div className="mt-8 flex flex-col items-center gap-4 border-t border-black/5 pt-8 pb-12">
                        <button 
                            onClick={() => setVisibleCount(prev => prev + 4)}
                            className="group flex flex-col items-center gap-3 cursor-pointer"
                        >
                            <span className="text-[12px] font-bold text-black underline underline-offset-[10px] decoration-black/20 group-hover:decoration-black transition-all tracking-widest uppercase">
                                Show More
                            </span>
                            <span className="text-[10px] text-black/50 font-medium">
                                Showing {visibleProducts.length} of {products.length} items
                            </span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductCategoryList;
