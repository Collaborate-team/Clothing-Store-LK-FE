"use client";

import Link from "next/link";
import { useState } from "react";
import { FiUser, FiSearch, FiShoppingBag } from "react-icons/fi";

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
    { label: "NEW ARRIVALS", href: "/new-arrivals" },
    {
        label: "WOMEN",
        href: "/women",
        mega: [
            {
                heading: "SHOP BY COLLECTION",
                links: [
                    { label: "Linen", href: "/women/linen" },
                    { label: "Casual", href: "/women/casual" },
                    { label: "Workwear", href: "/women/workwear" },
                    { label: "Tee Bar", href: "/women/tee-bar" },
                    { label: "Kids", href: "/kids" },
                    { label: "Teens", href: "/women/teens" },
                ],
            },
            {
                heading: "SHOP BY CATEGORY",
                links: [
                    { label: "Dresses", href: "/women/dresses" },
                    { label: "Tops", href: "/women/tops" },
                    { label: "Pants", href: "/women/pants" },
                    { label: "Skirts", href: "/women/skirts" },
                    { label: "Shorts", href: "/women/shorts" },
                    { label: "Co-ord Sets", href: "/women/co-ord-sets" },
                    { label: "Denims", href: "/women/denims" },
                    { label: "Tees", href: "/women/tees" },
                    { label: "Printed Tees", href: "/women/printed-tees" },
                ],
            },
            {
                heading: "SHOP BY EDIT",
                links: [
                    { label: "Mahali", href: "/women/edit/mahali" },
                    { label: "Palms Edit", href: "/women/edit/palms" },
                    { label: "Arienti Classics", href: "/women/edit/classics" },
                    { label: "The Girl Edit", href: "/women/edit/girl" },
                    { label: "Pure Linen", href: "/women/edit/pure-linen" },
                ],
            },
        ],
    },
    {
        label: "MEN",
        href: "/men",
        mega: [
            {
                heading: "SHOP BY COLLECTION",
                links: [
                    { label: "Casual", href: "/men/casual" },
                    { label: "Workwear", href: "/men/workwear" },
                    { label: "Formal", href: "/men/formal" },
                    { label: "Linen", href: "/men/linen" },
                    { label: "Activewear", href: "/men/activewear" },
                ],
            },
            {
                heading: "SHOP BY CATEGORY",
                links: [
                    { label: "T-Shirts", href: "/men/tshirts" },
                    { label: "Shirts", href: "/men/shirts" },
                    { label: "Trousers", href: "/men/trousers" },
                    { label: "Shorts", href: "/men/shorts" },
                    { label: "Jackets", href: "/men/jackets" },
                    { label: "Denims", href: "/men/denims" },
                    { label: "Co-ord Sets", href: "/men/co-ord-sets" },
                ],
            },
            {
                heading: "SHOP BY EDIT",
                links: [
                    { label: "Summer Edit", href: "/men/edit/summer" },
                    { label: "Classics", href: "/men/edit/classics" },
                    { label: "Linen Edit", href: "/men/edit/linen" },
                    { label: "Weekend Edit", href: "/men/edit/weekend" },
                ],
            },
        ],
    },
    {
        label: "KIDS",
        href: "/kids",
        mega: [
            {
                heading: "SHOP BY COLLECTION",
                links: [
                    { label: "Girls", href: "/kids/girls" },
                    { label: "Boys", href: "/kids/boys" },
                    { label: "Babies", href: "/kids/babies" },
                    { label: "Teens", href: "/kids/teens" },
                ],
            },
            {
                heading: "SHOP BY CATEGORY",
                links: [
                    { label: "Tops", href: "/kids/tops" },
                    { label: "Bottoms", href: "/kids/bottoms" },
                    { label: "Dresses", href: "/kids/dresses" },
                    { label: "Sets", href: "/kids/sets" },
                    { label: "Outerwear", href: "/kids/outerwear" },
                ],
            },
            {
                heading: "SHOP BY EDIT",
                links: [
                    { label: "School Edit", href: "/kids/edit/school" },
                    { label: "Playwear", href: "/kids/edit/playwear" },
                    { label: "Party Wear", href: "/kids/edit/party" },
                ],
            },
        ],
    },
    { label: "ACCESSORIES", href: "/accessories" },
    { label: "GIFT CARD", href: "/gift-card" },
];

/* ─────────────────────────── Component ─────────────────────── */
export default function NavBar() {
    const [cartCount] = useState(0);
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);

    return (
        <>
            {/* ── Header ── */}
            <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 h-14 bg-[rgba(10,10,10,0.60)] backdrop-blur-md border-b border-white/[0.08]">

                {/* Logo */}
                <Link
                    href="/"
                    className="font-[Dancing_Script] text-[1.7rem] font-bold text-white no-underline whitespace-nowrap min-w-[120px] leading-none"
                    style={{ fontFamily: "'Dancing Script', cursive" }}
                >
                    Arienti
                </Link>

                {/* Nav Links */}
                <nav className="flex items-center gap-6 flex-1 justify-center">
                    {navLinks.map((link) => (
                        <div
                            key={link.href}
                            className="relative"
                            onMouseEnter={() => link.mega && setOpenDropdown(link.label)}
                            onMouseLeave={() => setOpenDropdown(null)}
                        >
                            <Link
                                href={link.href}
                                className={`text-[0.65rem] font-semibold tracking-[0.09em] no-underline whitespace-nowrap transition-colors duration-200 pb-1 underline-offset-4 ${openDropdown === link.label
                                    ? "text-white underline"
                                    : "text-white/80 hover:text-white hover:underline"
                                    }`}
                            >
                                {link.label}
                            </Link>

                            {/* Mega dropdown panel */}
                            {link.mega && openDropdown === link.label && (
                                <div
                                    onMouseEnter={() => setOpenDropdown(link.label)}
                                    onMouseLeave={() => setOpenDropdown(null)}
                                    className="animate-fade-down absolute z-[51] top-[calc(100%+14px)] left-1/2 -translate-x-1/2 grid grid-cols-3 gap-8 p-7 min-w-[520px] bg-white/95 backdrop-blur-xl border border-white/90 rounded-xl shadow-[0_12px_40px_rgba(0,0,0,0.18)]"
                                >
                                    {link.mega.map((col) => (
                                        <div key={col.heading}>
                                            <p className="text-[0.6rem] font-bold tracking-[0.12em] text-gray-900 mb-2.5 pb-1.5 border-b border-black/10">
                                                {col.heading}
                                            </p>
                                            {col.links.map((item) => (
                                                <Link
                                                    key={item.href}
                                                    href={item.href}
                                                    className="block text-[0.75rem] font-medium tracking-[0.04em] text-[#2a5fa8] no-underline py-[0.28rem] transition-colors duration-150 hover:text-[#0f3d7a]"
                                                >
                                                    {item.label}
                                                </Link>
                                            ))}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </nav>

                {/* Right Icons */}
                <div className="flex items-center gap-5 min-w-[120px] justify-end">
                    <button aria-label="Account" className="bg-transparent border-none cursor-pointer text-white/75 hover:text-white p-1 flex items-center justify-center transition-colors duration-200">
                        <FiUser size={17} />
                    </button>
                    <button aria-label="Search" className="bg-transparent border-none cursor-pointer text-white/75 hover:text-white p-1 flex items-center justify-center transition-colors duration-200">
                        <FiSearch size={17} />
                    </button>
                    <button aria-label="Cart" className="relative bg-transparent border-none cursor-pointer text-white/75 hover:text-white p-1 flex items-center justify-center transition-colors duration-200">
                        <FiShoppingBag size={17} />
                        {cartCount > 0 && (
                            <span className="absolute -top-1.5 -right-1.5 bg-[#c8a96e] text-black rounded-full w-3.5 h-3.5 text-[0.55rem] font-bold flex items-center justify-center">
                                {cartCount}
                            </span>
                        )}
                    </button>
                </div>
            </header>

            {/* Dark scrim behind dropdown */}
            {openDropdown && (
                <div
                    onMouseEnter={() => setOpenDropdown(null)}
                    className="animate-fade-in fixed top-14 left-0 right-0 bottom-0 z-[48] bg-black/20"
                />
            )}
        </>
    );
}
