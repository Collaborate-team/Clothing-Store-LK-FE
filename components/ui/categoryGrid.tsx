"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const CategoryCard = ({ 
  tagline, 
  title, 
  className,
  imageSrc,
  href,
  delay = 0
}: { 
  tagline: string; 
  title: string; 
  className?: string;
  imageSrc: string;
  href: string;
  delay?: number;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay, ease: [0.215, 0.61, 0.355, 1] }}
      className={`h-full ${className}`}
    >
      <Link href={href} className="group block h-full relative overflow-hidden rounded-[2rem] sm:rounded-[2.5rem] bg-neutral-100 shadow-2xl transition-all duration-500">
        {/* Background Image with Zoom & Parallax-like effect */}
        <div className="absolute inset-0 overflow-hidden">
          <Image 
            src={imageSrc} 
            alt={title} 
            fill 
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
          />
        </div>

        {/* Multi-layered Premium Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/80 transition-opacity duration-500 group-hover:opacity-90" />
        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Content Container */}
        <div className="relative h-full flex flex-col justify-between p-6 sm:p-8 lg:p-10 z-10">
          <div className="space-y-3">
            <motion.div 
              initial={{ x: -10, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ delay: delay + 0.3 }}
              className="flex items-center gap-3"
            >
              <div className="w-6 h-[1px] bg-white/50" />
              <p className="text-white/80 text-[8px] sm:text-[10px] font-black tracking-[0.3em] uppercase">
                {tagline}
              </p>
            </motion.div>
            
            <h3 className="text-white text-xl sm:text-2xl lg:text-3xl font-serif italic leading-[1.1] max-w-[200px] drop-shadow-md">
              {title}
            </h3>
          </div>
          
          <div className="flex justify-between items-end">
            <div className="overflow-hidden">
              <div className="inline-flex flex-col">
                <span className="h-[2px] w-0 bg-white group-hover:w-full transition-all duration-500 ease-out" />
                <div className="bg-white/95 backdrop-blur-md text-black px-6 py-2.5 rounded-full text-[9px] font-black tracking-[0.2em] uppercase transition-all duration-300 transform group-hover:-translate-y-1 group-hover:shadow-[0_10px_30px_rgba(255,255,255,0.3)]">
                  Explore Now
                </div>
              </div>
            </div>

            {/* Micro Interaction Icon */}
            <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center transition-all duration-500 group-hover:bg-white group-hover:border-white">
              <svg 
                width="10" 
                height="10" 
                viewBox="0 0 12 12" 
                fill="none" 
                className="text-white transition-colors duration-500 group-hover:text-black"
              >
                <path d="M1 11L11 1M11 1H1M11 1V11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </div>

        {/* Decorative Inner Border */}
        <div className="absolute inset-4 border border-white/10 rounded-[1.5rem] sm:rounded-[2rem] pointer-events-none transition-all duration-500 group-hover:inset-6 group-hover:border-white/20" />
      </Link>
    </motion.div>
  );
};

export default function CategoryGrid() {
  return (
    <section className="w-full max-w-7xl mx-auto px-6 md:px-10 lg:px-12 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        {/* Left Column */}
        <div className="flex flex-col gap-6 lg:gap-8">
          <CategoryCard 
            tagline="COLLECTION" 
            title="Discover Our Women's Collection" 
            imageSrc="/images/catergoryGrid/cat-01.jpg"
            href="/women"
            className="aspect-[4/5] md:aspect-auto md:min-h-[480px]"
            delay={0.1}
          />
          <CategoryCard 
            tagline="ESSENTIALS" 
            title="Premium Men's Wear" 
            imageSrc="/images/catergoryGrid/cat-02.jpg"
            href="/men"
            className="aspect-[4/3] md:aspect-auto md:min-h-[320px]"
            delay={0.3}
          />
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-6 lg:gap-8">
          <CategoryCard 
            tagline="STYLE" 
            title="New Kids Arrivals" 
            imageSrc="/images/catergoryGrid/cat-03.jpg"
            href="/kids"
            className="aspect-[4/3] md:aspect-auto md:min-h-[320px]"
            delay={0.2}
          />
          <CategoryCard 
            tagline="ACCESSORIES" 
            title="Handcrafted Accessories" 
            imageSrc="/images/catergoryGrid/cat-04.jpg"
            href="/accessories"
            className="aspect-[4/5] md:aspect-auto md:min-h-[480px]"
            delay={0.4}
          />
        </div>
      </div>
    </section>
  );
}
