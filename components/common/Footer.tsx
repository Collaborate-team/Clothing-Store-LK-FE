"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import LOGO from '../../public/images/Logo.jpeg'

const Footer = () => {
  const [email, setEmail] = useState("");

  const shopLinks = [
    { label: "New Arrivals", href: "/new-arrivals" },
    { label: "Women", href: "/women" },
    { label: "Men", href: "/men" },
    { label: "Accessories", href: "/accessories" },
    { label: "Sale", href: "/sale" },
  ];

  const helpLinks = [
    { label: "Sizing Guide", href: "/sizing-guide" },
    { label: "Shipping & Returns", href: "/shipping-returns" },
    { label: "FAQs", href: "/faqs" },
    { label: "Contact Us", href: "/contact-us" },
  ];

  const aboutLinks = [
    { label: "Our Story", href: "/our-story" },
    { label: "Sustainability", href: "/sustainability" },
  ];

  return (
    <footer
      className="w-full bg-white text-[#1a1a1a] relative overflow-hidden border-t border-black/5"
      style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
    >
      {/* Decorative top gradient line */}
      <div className="h-[1px] bg-gradient-to-r from-transparent via-black/20 to-transparent" />

      {/* Newsletter Band */}
      <div className="relative z-[1] border-b border-black/5 px-5 py-8 sm:px-8 sm:py-10 md:px-12 lg:px-20 md:py-[52px] flex flex-col md:flex-row items-center md:items-center justify-between gap-6 sm:gap-8 md:gap-10 animate-fade-in">
        <div className="text-center md:text-left w-full md:w-auto">
          <h2
            className="text-[24px] sm:text-[28px] md:text-[clamp(28px,4vw,46px)] font-light tracking-[0.04em] leading-[1.1] text-black"
            style={{ fontFamily: "var(--font-cormorant), 'Cormorant Garamond', serif" }}
          >
            Wear what you <em className="italic">feel.</em>
          </h2>
          <p className="mt-2 text-[10px] sm:text-[11px] tracking-[0.18em] uppercase text-black font-bold">
            Join the inner circle — exclusive drops & early access
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch w-full md:w-auto gap-0">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="YOUR EMAIL ADDRESS"
            className="flex-1 min-w-0 w-full md:w-[280px] bg-black/5 border border-black/10 sm:border-r-0 px-4 sm:px-5 py-3 sm:py-3.5 text-[#1a1a1a] text-[11px] tracking-[0.12em] outline-none placeholder:text-black placeholder:tracking-[0.14em] placeholder:uppercase focus:border-[#c8b99a] transition-colors"
          />
          <button className="bg-black border border-black px-5 md:px-7 py-3 sm:py-3.5 text-white text-[10px] font-medium tracking-[0.2em] uppercase cursor-pointer hover:bg-black/80 hover:border-black/80 hover:text-white transition-colors whitespace-nowrap">
            Subscribe
          </button>
        </div>
      </div>

      {/* Main Footer Grid */}
      <div className="relative z-[1] grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-[2fr_1fr_1fr_1fr] gap-8 sm:gap-8 md:gap-10 lg:gap-0 px-5 py-10 sm:px-8 sm:py-12 md:px-12 md:py-14 lg:px-20 lg:py-16 border-b border-black/5 animate-fade-in">
        {/* Brand Column */}
        <div className="sm:col-span-3 lg:col-span-1 lg:pr-[60px] sm:pb-8 sm:border-b sm:border-black/5 lg:pb-0 lg:border-b-0 flex flex-col items-center sm:items-start">
          <div className="mb-5 ml-0 sm:ml-[15px]">
            <Image
              src={LOGO}
              alt="Iconic Apparel Logo"
              width={150}
              height={40}
              className="w-[120px] sm:w-[150px] h-auto"
            />
          </div>
          <div className="text-[9px] sm:text-[10px] tracking-[0.3em] uppercase text-black font-bold mb-5 sm:mb-7">
            ARIYENTI · EST. 2026
          </div>
          <p className="text-[12px] leading-[1.9] text-black font-light max-w-[280px] mb-6 sm:mb-8 text-center sm:text-left">
            Thoughtfully crafted pieces for the considered wardrobe. Slow
            fashion, enduring style — designed to be worn and worn again.
          </p>
          {/* Social Links */}
          <div className="flex gap-4 sm:gap-5">
            {/* Instagram */}
            <a
              href="https://instagram.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="w-[34px] h-[34px] border border-black/10 flex items-center justify-center text-black hover:border-black hover:bg-black/5 transition-all cursor-pointer"
            >
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>
            {/* Pinterest */}
            <a
              href="https://pinterest.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Pinterest"
              className="w-[34px] h-[34px] border border-black/10 flex items-center justify-center text-black hover:border-black hover:bg-black/5 transition-all cursor-pointer"
            >
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current">
                <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" />
              </svg>
            </a>
            {/* TikTok */}
            <a
              href="https://tiktok.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok"
              className="w-[34px] h-[34px] border border-black/10 flex items-center justify-center text-black hover:border-black hover:bg-black/5 transition-all cursor-pointer"
            >
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current">
                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Shop Column */}
        <FooterLinkColumn title="Shop" links={shopLinks} />

        {/* Help Column */}
        <FooterLinkColumn title="Help" links={helpLinks} />

        {/* About Column */}
        <FooterLinkColumn title="About" links={aboutLinks} />
      </div>

      {/* Bottom Bar */}
      <div className="relative z-[1] px-5 py-5 sm:px-8 md:px-12 lg:px-20 flex flex-col items-center sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-5 animate-fade-in">
        <p className="text-[9px] sm:text-[10px] text-black tracking-[0.14em] font-light text-center sm:text-left order-3 sm:order-1">
          © 2026 ARIYENTI Apparel. All rights reserved.
        </p>

        <div className="flex flex-wrap justify-center sm:justify-start gap-4 sm:gap-5 md:gap-7 order-1 sm:order-2">
          {[
            { label: "Privacy Policy", href: "/privacy-policy" },
            { label: "Terms of Use", href: "/terms-of-use" },
            { label: "Cookie Settings", href: "/cookie-settings" },
          ].map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-[10px] text-black no-underline tracking-[0.12em] hover:text-black/60 transition-colors cursor-pointer"
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Payment Badges */}
        <div className="flex flex-wrap justify-center sm:justify-end gap-2 sm:gap-2.5 items-center order-2 sm:order-3">
          <PayBadge title="Visa">
            <svg width="46" height="16" viewBox="0 0 46 16" fill="none">
              <path d="M18.1 0.5L15.1 15.5H18.6L21.6 0.5H18.1Z" fill="currentColor" />
              <path d="M30.7 0.8C30 0.5 28.9 0.2 27.5 0.2C24 0.2 21.5 2.1 21.5 4.8C21.5 6.8 23.3 7.9 24.7 8.6C26.1 9.3 26.6 9.7 26.6 10.3C26.6 11.2 25.5 11.6 24.5 11.6C23.1 11.6 22.3 11.4 21.1 10.8L20.6 10.6L20.1 13.8C20.9 14.2 22.4 14.5 24 14.5C27.7 14.5 30.2 12.6 30.2 9.7C30.2 8.1 29.2 6.9 27.1 5.9C25.8 5.2 25.1 4.8 25.1 4.2C25.1 3.6 25.8 3 27.1 3C28.2 3 29 3.2 29.7 3.5L30 3.7L30.7 0.8Z" fill="currentColor" />
              <path d="M35.4 10.2C35.7 9.3 36.9 6.1 36.9 6.1C36.9 6.1 37.2 5.3 37.4 4.8L37.6 6C37.6 6 38.3 9.4 38.5 10.2H35.4ZM39.6 0.5H36.9C36.1 0.5 35.5 0.7 35.1 1.5L29.8 15.5H33.5L34.3 13.1H38.8L39.3 15.5H42.6L39.6 0.5Z" fill="currentColor" />
              <path d="M14.5 0.5L11 10.4L10.6 8.4C9.9 6.3 8 4 5.8 2.8L9 15.5H12.8L18.3 0.5H14.5Z" fill="currentColor" />
              <path d="M7.8 0.5H2.1L2 0.8C6.5 1.9 9.5 4.6 10.6 8.4L9.4 1.5C9.2 0.8 8.6 0.5 7.8 0.5Z" fill="currentColor" />
            </svg>
          </PayBadge>
          <PayBadge title="Mastercard">
            <svg width="36" height="22" viewBox="0 0 36 22" fill="none">
              <circle cx="13" cy="11" r="10" fill="currentColor" opacity="0.3" />
              <circle cx="23" cy="11" r="10" fill="currentColor" opacity="0.2" />
              <path d="M18 4.3C19.9 5.7 21.2 7.7 21.2 11C21.2 14.3 19.9 16.3 18 17.7C16.1 16.3 14.8 14.3 14.8 11C14.8 7.7 16.1 5.7 18 4.3Z" fill="currentColor" opacity="0.4" />
            </svg>
          </PayBadge>
          <PayBadge title="PayPal">
            <svg width="52" height="14" viewBox="0 0 52 14" fill="none" className="text-black">
              <path d="M8.5 1H4.5C4.2 1 4 1.2 3.9 1.5L2 12.5C2 12.7 2.1 12.9 2.3 12.9H4.3C4.6 12.9 4.8 12.7 4.9 12.4L5.4 9.4C5.5 9.1 5.7 8.9 6 8.9H7.4C10.2 8.9 11.8 7.5 12.2 4.9C12.4 3.7 12.2 2.8 11.7 2.2C11.1 1.5 10 1 8.5 1ZM9 5C8.8 6.3 7.8 6.3 6.8 6.3H6.2L6.7 3.4C6.7 3.2 6.9 3.1 7.1 3.1H7.4C8.1 3.1 8.7 3.1 9.1 3.5C9.2 3.8 9.2 4.3 9 5Z" fill="currentColor" />
              <path d="M20.5 5H18.5C18.3 5 18.1 5.1 18.1 5.3L18 5.9L17.8 5.6C17.3 4.9 16.2 4.7 15.1 4.7C12.6 4.7 10.5 6.6 10.1 9.2C9.9 10.5 10.2 11.7 10.9 12.5C11.5 13.2 12.5 13.5 13.6 13.5C15.6 13.5 16.7 12.3 16.7 12.3L16.6 12.9C16.6 13.1 16.7 13.3 16.9 13.3H18.7C19 13.3 19.2 13.1 19.3 12.8L20.4 5.4C20.5 5.2 20.7 5 20.5 5ZM17.2 9.3C17 10.5 16.1 11.4 14.8 11.4C14.2 11.4 13.7 11.2 13.4 10.8C13.1 10.4 13 9.9 13.1 9.3C13.3 8.1 14.3 7.2 15.5 7.2C16.1 7.2 16.6 7.4 16.9 7.8C17.2 8.2 17.3 8.7 17.2 9.3Z" fill="currentColor" />
              <path d="M30.4 5H28.3C28.1 5 27.9 5.1 27.8 5.3L25.3 9.1L24.2 5.4C24.1 5.1 23.9 5 23.6 5H21.5C21.3 5 21.1 5.2 21.2 5.4L23.3 11.6L21.3 14.4C21.2 14.7 21.3 15 21.6 15H23.7C23.9 15 24.1 14.9 24.2 14.7L30.7 5.6C30.8 5.3 30.7 5 30.4 5Z" fill="currentColor" />
              <path d="M37.5 1H33.5C33.2 1 33 1.2 32.9 1.5L31 12.5C31 12.7 31.1 12.9 31.3 12.9H33.5C33.7 12.9 33.9 12.7 33.9 12.5L34.4 9.4C34.5 9.1 34.7 8.9 35 8.9H36.4C39.2 8.9 40.8 7.5 41.2 4.9C41.4 3.7 41.2 2.8 40.7 2.2C40.1 1.5 39 1 37.5 1ZM38 5C37.8 6.3 36.8 6.3 35.8 6.3H35.2L35.7 3.4C35.7 3.2 35.9 3.1 36.1 3.1H36.4C37.1 3.1 37.7 3.1 38.1 3.5C38.2 3.8 38.2 4.3 38 5Z" fill="currentColor" opacity="0.4" />
            </svg>
          </PayBadge>
          <PayBadge title="Klarna">
            <svg width="44" height="14" viewBox="0 0 44 14" fill="none">
              <path d="M2 1H4.8V13H2V1Z" fill="currentColor" />
              <path d="M13.5 1H10.6C10.6 3.4 9.5 5.5 7.7 6.9L6.8 7.6L11 13H14.4L10.5 7.9C12.3 6.3 13.5 4 13.5 1Z" fill="currentColor" />
              <path d="M16.5 13H19.2V1H16.5V13Z" fill="currentColor" />
              <path d="M28.5 5.2C27.7 4.6 26.7 4.3 25.5 4.3C22.6 4.3 20.3 6.5 20.3 9.3C20.3 12.1 22.6 14.3 25.5 14.3C26.7 14.3 27.7 13.9 28.5 13.4V13H31V4.6H28.5V5.2ZM25.7 11.7C24.1 11.7 22.9 10.6 22.9 9.2C22.9 7.8 24.1 6.7 25.7 6.7C27.3 6.7 28.4 7.8 28.4 9.2C28.4 10.6 27.3 11.7 25.7 11.7Z" fill="currentColor" />
              <path d="M36 5.8V4.6H33.4V13H36V9.2C36 7.8 37.5 7.1 38.6 7.1H38.6V4.5C37.5 4.5 36.6 5 36 5.8Z" fill="currentColor" />
              <path d="M41 11.3C40.1 11.3 39.4 12 39.4 12.9C39.4 13.7 40.1 14.4 41 14.4C41.9 14.4 42.6 13.7 42.6 12.9C42.6 12 41.9 11.3 41 11.3Z" fill="currentColor" opacity="0.4" />
            </svg>
          </PayBadge>
        </div>
      </div>
    </footer>
  );
};


const FooterLinkColumn = ({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) => (
  <div className="text-center sm:text-left text-black">
    <h4 className="text-[12px] sm:text-[13px] font-medium tracking-[0.28em] uppercase mb-4 sm:mb-6 pb-2 sm:pb-3 border-b border-black/10 inline-block sm:block w-auto sm:w-full">
      {title}
    </h4>
    <ul className="list-none p-0 m-0">
      {links.map((link) => (
        <li key={link.label} className="mb-2.5 sm:mb-3">
          <Link
            href={link.href}
            className="text-black text-[13px] sm:text-[14px] font-light tracking-[0.06em] no-underline hover:text-black transition-colors relative group"
          >
            {link.label}
            <span className="absolute left-0 -bottom-0.5 w-0 h-[1px] bg-black group-hover:w-full transition-all duration-300" />
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

const PayBadge = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <span
    title={title}
    className="bg-black/5 border border-black/10 px-2 sm:px-2.5 py-1 flex items-center justify-center h-[28px] sm:h-[30px] text-black opacity-30 hover:opacity-100 transition-opacity"
  >
    {children}
  </span>
);

export default Footer;
