'use client';

import React from 'react';
import { 
  CheckCircle2, 
  Package, 
  MapPin, 
  CreditCard, 
  ArrowRight,
  Printer,
  Calendar
} from 'lucide-react';

const OrderSuccessPage = () => {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#fcfbf7] pt-40 pb-24" style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}>
      <main className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Success Header */}
        <div className="text-center space-y-8 mb-20 animate-fade-in">
          <div className="flex justify-center">
            <div className="w-24 h-24 rounded-full bg-black border border-[#c8b99a]/30 flex items-center justify-center text-[#c8b99a] shadow-[0_0_40px_rgba(200,185,154,0.15)]">
              <CheckCircle2 size={56} strokeWidth={1} />
            </div>
          </div>
          <div className="space-y-3">
            <p className="text-[11px] tracking-[0.5em] font-bold text-[#c8b99a] uppercase">Order Manifest Confirmed</p>
            <h1 className="text-5xl md:text-7xl font-light tracking-tight" style={{ fontFamily: "var(--font-cormorant), 'Cormorant Garamond', serif" }}>
              Thank you for your <span className="text-[#c8b99a] italic">acquisition.</span>
            </h1>
          </div>
          <p className="text-[15px] font-light text-[#888] max-w-lg mx-auto italic leading-relaxed">
            Your selection <span className="font-bold text-white tracking-widest">#NA-2026-9432</span> is being meticulously prepared. A digital receipt has been dispatched to your email.
          </p>
        </div>

        {/* Order Details Card */}
        <div className="bg-[#111] border border-white/5 overflow-hidden animate-fade-in transition-all duration-1000 delay-300 shadow-2xl">
          <div className="p-10 border-b border-white/5 grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-2">
              <p className="text-[10px] tracking-[0.3em] uppercase font-bold text-[#555]">Dispatch Date</p>
              <div className="flex items-center gap-3 text-[14px] text-white">
                <Calendar size={18} className="text-[#c8b99a]" />
                <span className="font-light">March 13, 2026</span>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-[10px] tracking-[0.3em] uppercase font-bold text-[#555]">Estimated Arrival</p>
              <div className="flex items-center gap-3 text-[14px]">
                <Package size={18} className="text-[#c8b99a]" />
                <span className="font-medium text-[#c8b99a]">March 16 - March 18, 2026</span>
              </div>
            </div>
          </div>

          <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-16">
            {/* Shipping Info */}
            <div className="space-y-6">
              <h3 className="text-[11px] tracking-[0.4em] font-bold uppercase text-[#c8b99a] border-b border-white/5 pb-4">Consignee Details</h3>
              <div className="flex gap-6">
                <div className="w-12 h-12 bg-black border border-white/5 flex items-center justify-center text-[#555] shrink-0">
                    <MapPin size={22} />
                </div>
                <div className="text-[14px] font-light text-[#888] leading-relaxed space-y-1">
                  <p className="font-bold text-white tracking-wider mb-2 uppercase">Alex Fernando</p>
                  <p>42/A, Minimalist Heights,</p>
                  <p>Lotus Street, Colombo 07</p>
                  <p>Western Province, Sri Lanka</p>
                  <p className="pt-3 text-[12px] font-bold text-[#c8b99a] tracking-widest">+94 77 123 4567</p>
                </div>
              </div>
            </div>

            {/* Payment Info */}
            <div className="space-y-6">
              <h3 className="text-[11px] tracking-[0.4em] font-bold uppercase text-[#c8b99a] border-b border-white/5 pb-4">Transaction Summary</h3>
              <div className="flex gap-6">
                <div className="w-12 h-12 bg-black border border-white/5 flex items-center justify-center text-[#555] shrink-0">
                    <CreditCard size={22} />
                </div>
                <div className="text-[14px] font-light text-[#888] space-y-2">
                  <p className="font-bold text-white tracking-widest uppercase">Noir Secure Card</p>
                  <p>Authenticated <span className="font-medium text-white">**** 4321</span></p>
                  <div className="pt-4 space-y-1">
                      <p className="text-[9px] text-[#555] uppercase tracking-[0.3em]">Total Value</p>
                      <p className="text-3xl text-[#c8b99a] font-light tracking-tight">Rs 42,700.00</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="p-10 bg-black flex flex-col sm:flex-row gap-6 border-t border-white/5">
            <button className="flex-1 py-6 bg-[#c8b99a] text-black text-[11px] tracking-[0.4em] font-bold uppercase flex items-center justify-center gap-4 hover:bg-white transition-all cursor-pointer group shadow-lg">
              Track Manifest
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="flex-1 py-6 border border-white/20 text-white text-[11px] tracking-[0.4em] font-bold uppercase flex items-center justify-center gap-4 hover:bg-white hover:text-black transition-all cursor-pointer">
              <Printer size={18} />
              Print Invoice
            </button>
          </div>
        </div>

        {/* Support Section */}
        <div className="mt-20 text-center space-y-10 animate-fade-in delay-700">
          <div className="space-y-2">
            <p className="text-[12px] font-light text-[#555]">Require assistance with your order?</p>
            <a href="mailto:concierge@noiratelier.com" className="text-[13px] font-bold text-white border-b border-[#c8b99a] tracking-[0.1em] hover:text-[#c8b99a] transition-colors pb-1">concierge@noiratelier.com</a>
          </div>
          
          <div className="flex flex-col items-center gap-6 pt-10 border-t border-white/5 max-w-xs mx-auto">
             <div className="h-px w-20 bg-[#c8b99a]/30" />
             <p className="text-[10px] tracking-[0.5em] uppercase text-[#333] font-bold">Noir Atelier — The Archive</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default OrderSuccessPage;
