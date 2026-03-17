import React from "react";
import Image from "next/image";
import Link from "next/link";

const CategoryCard = ({ 
  tagline, 
  title, 
  className,
  isSmall,
  imageSrc,
  href
}: { 
  tagline: string; 
  title: string; 
  className?: string;
  isSmall?: boolean;
  imageSrc: string;
  href: string;
}) => {
  return (
    <Link href={href} className={`bg-black/5 rounded-2xl sm:rounded-3xl p-5 sm:p-6 lg:p-10 flex flex-col justify-between relative overflow-hidden group border border-black/5 shadow-sm ${className}`}>
      {/* Background Image */}
      <Image 
        src={imageSrc} 
        alt={title} 
        fill 
        sizes="(max-width: 768px) 100vw, 50vw"
        className="object-cover opacity-80 group-hover:scale-105 group-hover:opacity-100 transition-all duration-700 ease-in-out"
      />
      {/* Gradient Overlay for text readability */}
      <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-black/10 pointer-events-none" />

      <div className="relative z-10 w-full sm:w-3/4">
        <p className="text-black/50 text-[10px] sm:text-xs md:text-sm font-semibold tracking-wider uppercase mb-2 sm:mb-3">
          {tagline}
        </p>
        <h3 className="text-black text-lg sm:text-xl md:text-2xl font-bold leading-snug">
          {title}
        </h3>
      </div>
      
      <div className="mt-auto pt-6 flex w-full relative z-10 items-end justify-start sm:justify-end">
        <div className="bg-black text-white hover:bg-[#c8b99a] transition-colors px-5 py-2 sm:px-6 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap shadow-sm">
          View more
        </div>
      </div>
    </Link>
  );
};

export default function CategoryGrid() {
  return (
    <section className="w-full max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* Left Column */}
        <div className="flex flex-col gap-4 sm:gap-6">
          <CategoryCard 
            tagline="COLLECTION" 
            title="Discover Our Women's Collection" 
            imageSrc="/images/catergoryGrid/cat-01.jpg"
            href="/women"
            className="min-h-64 sm:min-h-80 md:min-h-112.5"
          />
          <CategoryCard 
            tagline="ESSENTIALS" 
            title="Premium Men's Wear" 
            imageSrc="/images/catergoryGrid/cat-02.jpg"
            href="/men"
            className="min-h-48 sm:min-h-55 md:min-h-70"
            isSmall
          />
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-4 sm:gap-6">
          <CategoryCard 
            tagline="STYLE" 
            title="New Kids Arrivals" 
            imageSrc="/images/catergoryGrid/cat-03.jpg"
            href="/kids"
            className="min-h-48 sm:min-h-55 md:min-h-70"
            isSmall
          />
          <CategoryCard 
            tagline="ACCESSORIES" 
            title="Handcrafted Accessories" 
            imageSrc="/images/catergoryGrid/cat-04.jpg"
            href="/accessories"
            className="min-h-64 sm:min-h-80 md:min-h-112.5"
          />
        </div>
      </div>
    </section>
  );
}
