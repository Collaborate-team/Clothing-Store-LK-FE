"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { FiSearch, FiShoppingBag, FiMenu, FiX } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import CartDrawer from "./CartDrawer";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { closeCartDrawer, removeFromCart, updateCartQuantity, openCartDrawer } from "@/store/cartSlice";
import LOGO from '../../public/images/Logo.jpeg'


/* ─────────────────────────── Types ─────────────────────────── */
type MegaColumn = {
    heading: string;
    links: { label: string; href: string }[];
};

type NavLink = {
    label: string;
    href: string;
    mega?: MegaColumn[];
};

/* ─────────────────────────── Data ──────────────────────────── */
const navLinks: NavLink[] = [
    { label: "ALL ITEMS", href: "/shop" },
    { label: "SHIRTS", href: "/shop?category=SHIRTS" },
    { label: "PANTS", href: "/shop?category=PANTS" },
    { label: "DRESSES", href: "/shop?category=DRESSES" },
    { label: "ACCESSORIES", href: "/shop?category=ACCESSORIES" },
];

/* ─────────────────────────── Component ─────────────────────── */
export default function NavBar() {
    const dispatch = useAppDispatch();
    const cartItems = useAppSelector((state) => state.cart.items);
    const isCartOpen = useAppSelector((state) => state.cart.isDrawerOpen);
    const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    const [isScrolled, setIsScrolled] = useState(false);
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Scroll Detection
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <>
            <header 
                className={`fixed top-0 left-0 right-0 z-100 transition-all duration-500 px-6 md:px-12 h-20 flex items-center justify-between border-b ${
                    isScrolled 
                    ? "bg-white/90 backdrop-blur-xl border-black/5 h-16 shadow-lg" 
                    : "bg-transparent border-transparent h-20"
                }`}
                style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
            >
                {/* ── Left: Mobile Menu Trigger ── */}
                <div className="flex lg:hidden flex-1">
                    <button 
                        onClick={() => setIsMobileMenuOpen(true)}
                        className="text-black hover:text-[#c8a96e] transition-colors p-2"
                        aria-label="Open Menu"
                    >
                        <FiMenu size={24} />
                    </button>
                </div>

                {/* ── Center: Logo ── */}
                <div className="flex-1 lg:flex-none flex justify-center lg:justify-start">
                    <Link
                        href="/"
                        className="group flex flex-col items-center lg:items-start"
                    >
                       <Image
                        src={LOGO}
                        alt="Iconic Apparel Logo"
                        width={150}
                        height={40}
                        className="w-30 sm:w-37.5 h-auto"
                        />
                    </Link>
                </div>

                {/* ── Middle: Nav Links (Desktop) ── */}
                <nav className="hidden lg:flex items-center gap-10 flex-1 justify-center">
                    {navLinks.map((link) => (
                        <div
                            key={link.href}
                            className="relative h-full flex items-center"
                            onMouseEnter={() => link.mega && setOpenDropdown(link.label)}
                            onMouseLeave={() => setOpenDropdown(null)}
                            onFocus={() => link.mega && setOpenDropdown(link.label)}
                            onBlur={() => setOpenDropdown(null)}
                            tabIndex={0}
                            role="button"
                            onKeyDown={(event) => {
                                if (!link.mega) return;
                                if (event.key === "Enter" || event.key === " ") {
                                    setOpenDropdown((prev) => prev === link.label ? null : link.label);
                                }
                                if (event.key === "Escape") {
                                    setOpenDropdown(null);
                                }
                            }}
                        >
                            <Link
                                href={link.href}
                                className={`text-[0.7rem] font-bold tracking-[0.2em] text-black/90 hover:text-black transition-all duration-300 relative py-2 ${
                                    openDropdown === link.label ? "text-[#c8a96e]" : ""
                                }`}
                            >
                                {link.label}
                                <motion.div 
                                    className="absolute bottom-0 left-0 right-0 h-px bg-[#c8a96e]"
                                    initial={{ scaleX: 0 }}
                                    animate={{ scaleX: openDropdown === link.label ? 1 : 0 }}
                                    transition={{ duration: 0.3 }}
                                />
                            </Link>

                            {/* Mega Dropdown */}
                            <AnimatePresence>
                                {link.mega && openDropdown === link.label && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        transition={{ duration: 0.3, ease: "easeOut" }}
                                        className="absolute top-full left-1/2 -translate-x-1/2 pt-4 w-screen max-w-4xl"
                                    >
                                        <div className="bg-white/95 backdrop-blur-2xl border border-black/10 rounded-2xl overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] flex p-10 gap-16">
                                            {link.mega.map((col) => (
                                                <div key={col.heading} className="flex-1">
                                                    <h3 className="text-[0.6rem] font-black tracking-[0.3em] text-[#c8a96e] uppercase mb-6 pb-2 border-b border-black/5">
                                                        {col.heading}
                                                    </h3>
                                                    <div className="flex flex-col gap-4">
                                                        {col.links.map((item) => (
                                                            <Link
                                                                key={item.href}
                                                                href={item.href}
                                                                className="text-xs text-black/60 hover:text-black hover:translate-x-1 transition-all duration-300 font-medium tracking-wide"
                                                            >
                                                                {item.label}
                                                            </Link>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                            <div className="w-1/4 relative overflow-hidden rounded-xl border border-white/5 group/img">
                                                <div className="absolute inset-0 bg-[#c8a96e]/20 group-hover/img:bg-transparent transition-colors z-10" />
                                                <Image
                                                    src="https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?auto=format&fit=crop&q=80&w=400"
                                                    alt="Featured"
                                                    width={400}
                                                    height={500}
                                                    className="w-full h-full object-cover grayscale transition-all duration-700 group-hover/img:grayscale-0 group-hover/img:scale-110"
                                                />
                                                <div className="absolute bottom-4 left-4 z-20">
                                                    <p className="text-[0.5rem] font-bold text-white tracking-widest uppercase mb-1">Featured</p>
                                                    <p className="text-xs font-serif text-[#c8a96e] italic">Spring &apos;26 Collection</p>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </nav>

                {/* ── Right: Action Icons ── */}
                <div className="flex-1 lg:flex-none flex items-center justify-end gap-2 md:gap-6">
                    {/* Search Expansion */}
                    <div className="relative flex items-center">
                        <AnimatePresence>
                            {isSearchOpen && (
                                <motion.input 
                                    initial={{ width: 0, opacity: 0 }}
                                    animate={{ width: 200, opacity: 1 }}
                                    exit={{ width: 0, opacity: 0 }}
                                    placeholder="SEARCH LUXURY..."
                                    className="bg-black/5 border border-black/10 rounded-full px-4 py-2 text-2xs tracking-widest text-black outline-none focus:border-[#c8a96e]/50 mr-2"
                                />
                            )}
                        </AnimatePresence>
                        <button 
                            onClick={() => setIsSearchOpen(!isSearchOpen)}
                            className="text-black/80 hover:text-[#c8a96e] p-2 transition-colors"
                        >
                            <FiSearch size={18} />
                        </button>
                    </div>

                    {/*<Link href="/order-history" className="text-black/80 hover:text-[#c8a96e] p-2 transition-colors hidden sm:block">*/}
                    {/*    <FiUser size={18} />*/}
                    {/*</Link>*/}

                    <button onClick={() => dispatch(openCartDrawer())} className="relative text-black/80 hover:text-[#c8a96e] p-2 transition-colors">
                        <FiShoppingBag size={18} />
                        {cartCount > 0 && (
                            <span className="absolute top-1 right-1 bg-[#c8a96e] text-black text-[0.55rem] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
                                {cartCount}
                            </span>
                        )}
                    </button>
                </div>
            </header>

            {/* ── Mobile Menu Overlay ── */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div 
                        initial={{ x: "-100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "-100%" }}
                        transition={{ type: "spring", damping: 30, stiffness: 200 }}
                        className="fixed inset-0 z-150 bg-white p-10 flex flex-col"
                    >
                        <div className="flex justify-between items-center mb-16">
                            <button onClick={() => setIsMobileMenuOpen(false)} className="text-black/50 hover:text-black">
                                <FiX size={32} />
                            </button>
                        </div>
                        <nav className="flex flex-col gap-8">
                            {navLinks.map((link) => (
                                <Link 
                                    key={link.href} 
                                    href={link.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="text-3xl font-light text-black hover:text-[#c8a96e] transition-colors tracking-tighter"
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </nav>
                        <div className="mt-auto border-t border-black/10 pt-8 flex gap-8">
                            {/*<Link href="/order-history" className="text-xs tracking-widest text-black/40 hover:text-black uppercase font-bold">Profile</Link>*/}
                            <Link href="/wishlist" className="text-xs tracking-widest text-black/40 hover:text-black uppercase font-bold">Wishlist</Link>
                            <Link href="/help" className="text-xs tracking-widest text-black/40 hover:text-black uppercase font-bold">Contact</Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Scrim for Desktop MegaMenu ── */}
            <AnimatePresence>
                {openDropdown && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-90 pointer-events-none"
                    />
                )}
            </AnimatePresence>

            <CartDrawer
                isOpen={isCartOpen}
                onClose={() => dispatch(closeCartDrawer())}
                items={cartItems}
                onRemove={(id, size, color) => dispatch(removeFromCart({ id, size, color }))}
                onUpdateQuantity={(id, size, color, quantity) => dispatch(updateCartQuantity({ id, size, color, quantity }))}
            />
        </>
    );
}
