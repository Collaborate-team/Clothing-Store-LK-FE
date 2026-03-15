'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { 
  Search, 
  Heart, 
  ShoppingBag, 
  User, 
  Menu, 
  X,
  ChevronDown
} from 'lucide-react';
import LOGO from '../../public/images/iconic-Logo.png';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'New Arrivals', href: '/new' },
    { label: 'Women', href: '/women' },
    { label: 'Men', href: '/men' },
    { label: 'Archive', href: '/archive' },
  ];

  return (
    <>
      <header 
        className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 ${
          isScrolled ? 'bg-black/60 backdrop-blur-lg border-b border-white/10 py-4' : 'bg-transparent py-6'
        }`}
        style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* Mobile Menu Toggle */}
          <button 
            className="lg:hidden p-2 text-[#fcfbf7] cursor-pointer"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu size={24} strokeWidth={1.5} />
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-10">
            {navLinks.map((link) => (
              <a 
                key={link.label} 
                href={link.href}
                className="text-[10px] tracking-[0.25em] font-bold uppercase transition-all duration-300 text-[#fcfbf7] hover:text-[#c8b99a] relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#c8b99a] transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </nav>

          {/* Logo */}
          <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center">
            <a href="/" className="cursor-pointer">
              <Image 
                src={LOGO} 
                alt="Iconic Apparel" 
                width={120} 
                height={35} 
                className={`transition-all duration-500 h-auto invert ${isScrolled ? 'w-[100px]' : 'w-[130px]'}`} 
              />
            </a>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-6">
            <button className="hidden sm:block p-2 text-[#fcfbf7] hover:text-[#c8b99a] transition-colors cursor-pointer">
              <Search size={20} strokeWidth={1.5} />
            </button>
            <a href="/wishlist" className="p-2 text-[#fcfbf7] hover:text-[#c8b99a] transition-colors cursor-pointer relative">
              <Heart size={20} strokeWidth={1.5} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-[#c8b99a] rounded-full" />
            </a>
            <button className="p-2 text-[#fcfbf7] hover:text-[#c8b99a] transition-colors cursor-pointer relative">
              <ShoppingBag size={20} strokeWidth={1.5} />
              <span className="absolute -top-1 -right-1 bg-[#c8b99a] text-black text-[8px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                2
              </span>
            </button>
            <button className="hidden sm:block p-2 text-[#fcfbf7] hover:text-[#c8b99a] transition-colors cursor-pointer">
              <User size={20} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] transition-opacity duration-500 ${
          isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      {/* Mobile Menu Panel */}
      <aside 
        className={`fixed top-0 left-0 h-full w-[85%] max-w-[400px] bg-[#fcfbf7] z-[201] shadow-2xl transform transition-transform duration-500 ease-out flex flex-col ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-6 border-b border-[#e5e1d8]">
          <Image src={LOGO} alt="Logo" width={100} height={30} className="h-auto" />
          <button onClick={() => setIsMobileMenuOpen(false)} className="p-2">
            <X size={24} strokeWidth={1.5} />
          </button>
        </div>

        <nav className="flex-1 px-6 py-10 space-y-8">
          {navLinks.map((link) => (
            <a 
              key={link.label} 
              href={link.href}
              className="block text-[14px] tracking-[0.3em] font-light uppercase border-b border-[#e5e1d8] pb-4"
            >
              {link.label}
            </a>
          ))}
          <div className="pt-10 flex flex-col gap-6">
            <a href="/account" className="flex items-center gap-4 text-[11px] tracking-[0.2em] uppercase font-bold text-[#888]">
              <User size={18} /> My Account
            </a>
            <a href="/help" className="flex items-center gap-4 text-[11px] tracking-[0.2em] uppercase font-bold text-[#888]">
              <ChevronDown size={18} /> Help & FAQ
            </a>
          </div>
        </nav>

        <div className="p-8 border-t border-[#e5e1d8] bg-white">
          <p className="text-[9px] tracking-[0.3em] uppercase text-[#b5b1a8] mb-4 text-center">Follow Us</p>
          <div className="flex justify-center gap-6">
            {/* Social Icons Placeholder */}
            <span className="text-[10px] tracking-widest font-bold">INSTAGRAM</span>
            <span className="text-[10px] tracking-widest font-bold">PINTEREST</span>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Header;
