import React from "react";
import Image from "next/image";

const CategoryCard = ({ 
  tagline, 
  title, 
  className,
  isSmall,
  imageSrc
}: { 
  tagline: string; 
  title: string; 
  className?: string;
  isSmall?: boolean;
  imageSrc: string;
}) => {
  return (
    <div className={`bg-slate-900 rounded-2xl sm:rounded-3xl p-5 sm:p-6 lg:p-10 flex flex-col justify-between relative overflow-hidden group ${className}`}>
      {/* Background Image */}
      <Image 
        src={imageSrc} 
        alt={title} 
        fill 
        sizes="(max-width: 768px) 100vw, 50vw"
        className="object-cover opacity-50 group-hover:scale-105 group-hover:opacity-70 transition-all duration-700 ease-in-out"
      />
      {/* Gradient Overlay for text readability */}
      <div className="absolute inset-0 bg-linear-to-t from-slate-900/90 via-slate-900/30 to-slate-900/80 pointer-events-none" />

      <div className="relative z-10 w-full sm:w-3/4">
        <p className="text-slate-400 text-[10px] sm:text-xs md:text-sm font-semibold tracking-wider uppercase mb-2 sm:mb-3">
          {tagline}
        </p>
        <h3 className="text-white text-lg sm:text-xl md:text-2xl font-bold leading-snug">
          {title}
        </h3>
      </div>
      
      <div className="mt-auto pt-6 flex w-full relative z-10 items-end justify-start sm:justify-end">
        <button className="bg-white text-slate-900 hover:bg-slate-200 transition-colors px-5 py-2 sm:px-6 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap shadow-sm">
          View more
        </button>
      </div>
    </div>
  );
};

export default function CategoryGrid() {
  return (
    <section className="w-full max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* Left Column */}
        <div className="flex flex-col gap-4 sm:gap-6">
          <CategoryCard 
            tagline="TAGLINE" 
            title="Discover Our Accessories Collection" 
            imageSrc="/images/catergoryGrid/cat-01.jpg"
            className="min-h-64 sm:min-h-80 md:min-h-112.5"
          />
          <CategoryCard 
            tagline="TAGLINE" 
            title="Discover Our Accessories Collection" 
            imageSrc="/images/catergoryGrid/cat-02.jpg"
            className="min-h-48 sm:min-h-55 md:min-h-70"
            isSmall
          />
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-4 sm:gap-6">
          <CategoryCard 
            tagline="TAGLINE" 
            title="Discover Our Accessories Collection" 
            imageSrc="/images/catergoryGrid/cat-03.jpg"
            className="min-h-48 sm:min-h-55 md:min-h-70"
            isSmall
          />
          <CategoryCard 
            tagline="TAGLINE" 
            title="Discover Our Accessories Collection" 
            imageSrc="/images/catergoryGrid/cat-04.jpg"
            className="min-h-64 sm:min-h-80 md:min-h-112.5"
          />
        </div>
      </div>
    </section>
  );
}
