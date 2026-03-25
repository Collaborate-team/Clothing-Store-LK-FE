'use client';

import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

const TermsCondition: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('acceptance');

  const sections = [
    { 
      id: 'acceptance', 
      title: 'Acceptance of Terms', 
      content: 'By accessing or purchasing from Noir Atelier, you agree to be bound by these Terms and Conditions in their entirety. If you do not agree, please refrain from using our website or services.', 
      highlight: 'These Terms constitute a legally binding agreement between you and Noir Atelier. Your continued use constitutes acceptance of any updates we may make.' 
    },
    { 
      id: 'products', 
      title: 'Products & Descriptions', 
      content: 'Noir Atelier makes every effort to accurately display the color, texture, and fit of garments. However, due to monitor calibration differences, exact color accuracy cannot be guaranteed. All measurements provided are approximate.', 
      tags: ['APPAREL', 'ACCESSORIES', 'LIMITED EDITIONS', 'ARCHIVE PIECES'], 
      footer: 'Limited edition and archive pieces are sold as-is. Descriptions do not constitute a warranty of any kind.' 
    },
    { 
      id: 'orders', 
      title: 'Orders & Payment', 
      content: 'All orders are subject to products availability and acceptance by Noir Atelier. We reserve the right to refuse or cancel any order at our sole discretion, including orders that appear to be placed for commercial resale purposes.',
      highlight: 'Prices include applicable taxes where required by law. International customers may be subject to import duties — sole responsibility of purchaser.' 
    },
    { 
      id: 'shipping', 
      title: 'Shipping & Delivery', 
      content: 'Noir Atelier ships globally. Standard delivery: 3-7 business days domestically, 7-21 business days internationally, depending on destination and customs. Express and white-glove delivery options are available at checkout. Tracking information will be provided via email once dispatched.', 
      footer: 'Risk of loss and title for purchased items passes to you upon our delivery to the carrier. Ensure your shipping address is accurate — we cannot redirect shipments.' 
    },
    { 
      id: 'returns', 
      title: 'Returns & Exchanges', 
      content: 'We accept returns within 14 days of delivery, provided items are unworn, unwashed, and in their original packaging with all tags attached.', 
      tags: ['14-DAY WINDOW', 'ORIGINAL CONDITION', 'TAGS ATTACHED'], 
      highlight: 'Exchanges are processed as new orders. Refunds are issued within 5-10 business days of receiving the return.' 
    },
    { 
      id: 'intellectual', 
      title: 'Intellectual Property', 
      content: 'All content on this website — photography, editorial copy, design elements, logo, and garment designs — is the exclusive intellectual property of Noir Atelier. Unauthorized reproduction or commercial use is strictly prohibited and may result in legal action. Personal non-commercial sharing is permitted with attribution.' 
    },
    { 
      id: 'privacy', 
      title: 'Privacy & Data', 
      content: 'Your privacy is important to us. We collect only the personal data necessary to fulfill your orders and improve your shopping experience. We do not sell your data. By creating an account or placing an order, you consent to our data practices as outlined in our Privacy Policy. You may request data deletion at any time.' 
    },
    { 
      id: 'liability', 
      title: 'Limitation of Liability', 
      content: 'To the fullest extent permitted by law, Noir Atelier shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of our products or website.', 
      highlight: 'Our total liability shall not exceed the amount paid for the products in question. Some jurisdictions may allow greater protections under applicable consumer law.'
    },
    { 
      id: 'governing', 
      title: 'Governing Law', 
      content: 'These Terms shall be governed by the laws of the jurisdiction in which Noir Atelier is incorporated, without regard to conflict of law provisions. Any disputes shall be subject to the exclusive jurisdiction of the courts of that jurisdiction, unless otherwise required by applicable consumer protection law.' 
    },
    { 
      id: 'contact', 
      title: 'Contact Us', 
      content: 'For any questions regarding these Terms and Conditions, please reach out to our client services team. We aim to respond to all enquiries within 2 business days.', 
      contactInfo: ['legal@noiratelier.com', '+1 (234) 000-0000', 'MON-FRI, 9-5 EST'], 
      footer: 'Noir Atelier, 14 Rue du Faubourg, New York, NY 10001, United States.' 
    }
  ];

  // Scroll spy to update active section
  useEffect(() => {
    const handleScroll = () => {
      const sectionElements = sections.map(s => document.getElementById(s.id));
      const scrollPosition = window.scrollY + 200;

      sectionElements.forEach(el => {
        if (el && el.offsetTop <= scrollPosition && (el.offsetTop + el.offsetHeight) > scrollPosition) {
          setActiveSection(el.id);
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections]);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <div className="min-h-screen bg-[#fcfbf7] text-black" style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}>
      {/* Mobile Menu Overlay */}
      <div 
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
        onClick={toggleMobileMenu}
        aria-hidden="true"
      />
      
      {/* Mobile Sidebar Drawer */}
      <aside className={`fixed top-0 left-0 w-[80%] max-w-[320px] h-full bg-[#fcfbf7] z-[101] p-10 transform transition-transform duration-500 ease-out border-r border-[#e5e1d8] ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-[10px] tracking-[0.4em] font-bold text-[#b5b1a8] uppercase">Contents</h2>
          <button onClick={toggleMobileMenu} className="p-2 -mr-2" aria-label="Close menu"><X className="w-5 h-5 text-black" /></button>
        </div>
        <nav className="flex flex-col gap-8">
          {sections.map((section, index) => (
            <a 
              key={section.id} 
              href={`#${section.id}`}
              onClick={toggleMobileMenu}
              className={`group flex items-start gap-4 text-[11px] tracking-[0.2em] uppercase transition-all duration-300 ${activeSection === section.id ? 'text-black font-semibold' : 'text-[#666666]'}`}
            >
              <span className={`text-[10px] font-medium transition-opacity ${activeSection === section.id ? 'text-black opacity-100' : 'text-[#c8b99a] opacity-60'}`}>{index + 1}</span>
              <span className={`border-b border-transparent group-hover:border-[#c8b99a] pb-1 transition-all ${activeSection === section.id ? 'border-[#c8b99a]' : ''}`}>
                {section.title}
              </span>
            </a>
          ))}
        </nav>
      </aside>

      {/* Header */}
      <header className="bg-white text-black py-20 md:py-32 px-6 flex justify-center items-center relative overflow-hidden border-b border-black/5">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#c8b99a_1px,transparent_1px)] [background-size:20px_20px]" />
        
        {/* Mobile Menu Trigger */}
        <button onClick={toggleMobileMenu} className="lg:hidden absolute top-10 left-6 z-20 flex items-center gap-2 text-[#c8b99a] text-[10px] tracking-[0.2em] uppercase border border-[#c8b99a]/30 px-4 py-2 hover:bg-[#c8b99a]/10 transition-colors">
          <Menu className="w-4 h-4" />
          <span>Table of Contents</span>
        </button>

        <h1 className="text-3xl md:text-5xl lg:text-7xl font-light uppercase text-center relative z-10 flex items-center justify-center gap-x-3 md:gap-x-6 lg:gap-x-8 flex-wrap" style={{ fontFamily: "var(--font-cormorant), 'Cormorant Garamond', serif" }}>
          <span className="tracking-[0.15em] md:tracking-[0.25em]">Terms</span>
          <span className="text-[#c8b99a] font-extralight italic leading-none translate-y-[2px] md:translate-y-[4px]">&</span>
          <span className="tracking-[0.15em] md:tracking-[0.25em]">Conditions</span>
        </h1>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-12 md:py-24 lg:py-32 flex flex-col lg:flex-row gap-12 md:gap-20">
        {/* Sidebar (Desktop) */}
        <aside className="lg:w-72 hidden lg:block sticky top-32 h-fit border-l border-[#e5e1d8] pl-10 py-2">
          <h2 className="text-[10px] tracking-[0.4em] font-bold text-[#b5b1a8] mb-12 uppercase">Contents</h2>
          <nav className="space-y-8">
            {sections.map((section, index) => (
              <a 
                key={section.id} 
                href={`#${section.id}`}
                className={`group flex items-start gap-4 text-[11px] tracking-[0.2em] uppercase transition-all duration-300 ${activeSection === section.id ? 'text-black' : 'text-[#1a1a1a]'}`}
              >
                <span className={`text-[10px] font-medium w-5 transition-opacity ${activeSection === section.id ? 'text-black opacity-100' : 'text-[#c8b99a] opacity-60 group-hover:opacity-100'}`}>{index + 1}</span>
                <span className={`border-b border-transparent group-hover:border-[#c8b99a] pb-1 transition-all ${activeSection === section.id ? 'border-[#c8b99a]' : ''}`}>
                  {section.title}
                </span>
              </a>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 space-y-24 md:space-y-40">
          {sections.map((section, index) => (
            <div key={section.id} id={section.id} className="relative scroll-mt-24 md:scroll-mt-32 animate-fade-in group">
              <div 
                className="absolute -left-4 md:-left-16 -top-8 md:-top-16 text-[100px] md:text-[180px] font-bold text-[#c8b99a]/10 md:text-[#c8b99a] select-none -z-10 leading-none italic group-hover:text-black transition-colors duration-700 opacity-20 md:opacity-100" 
                style={{ fontFamily: "var(--font-cormorant), 'Cormorant Garamond', serif" }}
              >
                {index + 1}
              </div>
              
              <div className="space-y-6 md:space-y-10 max-w-3xl">
                <div className="flex items-center gap-4 text-[#c8b99a] lg:hidden mb-2">
                   <span className="h-[1px] w-12 bg-current"></span>
                   <span className="text-[10px] tracking-[0.3em] uppercase font-semibold">Section {index + 1}</span>
                </div>
                
                <h2 className="text-3xl md:text-5xl font-light tracking-tight text-black" style={{ fontFamily: "var(--font-cormorant), 'Cormorant Garamond', serif" }}>
                  {section.title}
                </h2>
                
                <p className="text-[#0a0a0a] leading-[1.8] text-[15px] md:text-[17px] font-light">
                  {section.content}
                </p>

                {section.highlight && (
                  <div className="p-6 md:p-10 bg-white border border-[#e5e1d8] border-l-4 border-l-[#c8b99a] shadow-sm transform hover:-translate-y-1 transition-transform duration-300">
                    <p className="text-[15px] md:text-[18px] font-medium leading-[1.7] text-black italic">
                      {section.highlight}
                    </p>
                  </div>
                )}

                {section.tags && (
                  <div className="flex flex-wrap gap-2 md:gap-4 pt-4">
                    {section.tags.map(tag => (
                      <span key={tag} className="px-4 md:px-6 py-2 md:py-3 border border-[#d5d1c8] text-[9px] md:text-[10px] tracking-[0.2em] font-bold uppercase text-[#5a4631] bg-white hover:bg-[#fcfbf7] transition-all cursor-default">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {section.contactInfo && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-px bg-[#e5e1d8] border border-[#e5e1d8] mt-12 md:mt-16 overflow-hidden">
                    {section.contactInfo.map((info, i) => (
                      <div key={info} className="bg-white px-6 py-10 md:py-12 text-center text-[10px] md:text-[11px] tracking-[0.2em] font-medium uppercase text-[#0a0a0a] hover:bg-[#fcfbf7] transition-colors flex items-center justify-center">
                        {info}
                      </div>
                    ))}
                  </div>
                )}

                {section.footer && (
                  <p className="text-[11px] md:text-[12px] tracking-[0.05em] text-[#333333] font-light mt-8 border-t border-[#e5e1d8] pt-6 italic">
                    {section.footer}
                  </p>
                )}
              </div>
            </div>
          ))}

          {/* Bottom spacer */}
          <div className="h-20" />
        </main>
      </div>
    </div>
  );
};

export default TermsCondition;
