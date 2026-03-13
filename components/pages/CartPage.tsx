'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { 
  Minus, 
  Plus, 
  Trash2, 
  ChevronRight, 
  CreditCard, 
  Truck, 
  ShieldCheck,
  ArrowLeft,
  ShoppingBag
} from 'lucide-react';

// Mock data for the cart
const INITIAL_CART = [
  {
    id: 'noir-01',
    name: 'OVERSIZED LINEN BLEND BLAZER',
    price: 24500,
    size: 'M',
    color: 'Noir Black',
    quantity: 1,
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: 'noir-02',
    name: 'SILK MIDI DRESS',
    price: 18200,
    size: 'S',
    color: 'Pure White',
    quantity: 1,
    image: 'https://images.unsplash.com/photo-1548883354-94bcfe321cbb?q=80&w=1000&auto=format&fit=crop'
  }
];

const CartPage = () => {
  const [items, setItems] = useState(INITIAL_CART);
  const [step, setStep] = useState(1); // 1: Cart, 2: Checkout
  const [selectedPayment, setSelectedPayment] = useState('CREDIT_CARD');

  const updateQuantity = (id: string, size: string, delta: number) => {
    setItems(items.map(item => 
      (item.id === id && item.size === size) 
        ? { ...item, quantity: Math.max(1, item.quantity + delta) } 
        : item
    ));
  };

  const removeItem = (id: string, size: string) => {
    setItems(items.filter(item => !(item.id === id && item.size === size)));
  };

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = subtotal > 50000 ? 0 : 1500;
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen bg-[#fcfbf7] text-[#0a0a0a] pb-20" style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}>
      {/* Page Header */}
      <header className="pt-12 pb-8 px-4 text-center border-b border-[#e5e1d8] mb-8 bg-white/50 backdrop-blur-md sticky top-0 z-30">
        <h1 className="text-3xl md:text-4xl font-light tracking-tight mb-2" style={{ fontFamily: "var(--font-cormorant), 'Cormorant Garamond', serif" }}>
          Shopping <span className="text-[#c8b99a]">Bag</span>
        </h1>
        <div className="flex items-center justify-center gap-4 text-[10px] tracking-[0.2em] uppercase font-bold text-[#b5b1a8]">
          <span className={step >= 1 ? 'text-black' : ''}>01. Cart</span>
          <ChevronRight size={10} />
          <span className={step >= 2 ? 'text-black' : ''}>02. Checkout</span>
          <ChevronRight size={10} />
          <span>03. Complete</span>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
          
          {/* LEFT COLUMN: Cart Items or Checkout Form */}
          <div className="flex-1 space-y-8">
            {step === 1 ? (
              <div className="bg-white border border-[#e5e1d8] overflow-hidden">
                <div className="hidden md:grid grid-cols-5 gap-4 p-6 border-b border-[#e5e1d8] text-[9px] tracking-[0.3em] font-bold uppercase text-[#b5b1a8]">
                  <div className="col-span-2">Product</div>
                  <div className="text-center">Price</div>
                  <div className="text-center">Quantity</div>
                  <div className="text-right">Total</div>
                </div>

                {items.length > 0 ? (
                  items.map((item) => (
                    <div key={`${item.id}-${item.size}`} className="grid grid-cols-1 md:grid-cols-5 gap-6 p-6 border-b border-[#e5e1d8] last:border-0 hover:bg-[#fcfbf7] transition-colors group">
                      <div className="col-span-1 md:col-span-2 flex gap-6">
                        <div className="relative w-24 h-32 shrink-0 overflow-hidden border border-[#e5e1d8]">
                          <Image src={item.image} alt={item.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                        </div>
                        <div className="flex flex-col justify-center gap-1">
                          <h3 className="text-[11px] tracking-[0.15em] font-bold uppercase leading-tight">{item.name}</h3>
                          <div className="text-[10px] text-[#888] uppercase">
                            <p>Size: {item.size} / Color: {item.color}</p>
                          </div>
                          <button onClick={() => removeItem(item.id, item.size)} className="mt-2 text-[9px] text-red-800 border-b border-transparent hover:border-red-800 transition-all uppercase w-fit cursor-pointer flex items-center gap-1">
                            <Trash2 size={10} /> Remove
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between md:justify-center">
                        <span className="md:hidden text-[9px] font-bold uppercase text-[#b5b1a8]">Price</span>
                        <span className="text-[13px]">Rs {item.price.toLocaleString()}</span>
                      </div>

                      <div className="flex items-center justify-between md:justify-center">
                        <span className="md:hidden text-[9px] font-bold uppercase text-[#b5b1a8]">Quantity</span>
                        <div className="flex items-center border border-[#e5e1d8] h-10 px-3 bg-white">
                          <button onClick={() => updateQuantity(item.id, item.size, -1)} className="p-1 hover:text-[#c8b99a] cursor-pointer"><Minus size={12} /></button>
                          <span className="w-8 text-center text-[12px]">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.size, 1)} className="p-1 hover:text-[#c8b99a] cursor-pointer"><Plus size={12} /></button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between md:justify-end">
                        <span className="md:hidden text-[9px] font-bold uppercase text-[#b5b1a8]">Subtotal</span>
                        <span className="text-[14px] font-medium">Rs {(item.price * item.quantity).toLocaleString()}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-20 text-center flex flex-col items-center gap-6">
                    <ShoppingBag size={40} className="text-[#e5e1d8]" strokeWidth={1} />
                    <p className="text-[12px] tracking-[0.2em] uppercase text-[#b5b1a8] italic">Your bag is empty</p>
                    <a href="/shop" className="px-8 py-4 bg-black text-white text-[10px] tracking-[0.2em] font-bold uppercase">Return to shop</a>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white border border-[#e5e1d8] p-8 space-y-10 animate-fade-in">
                <section>
                  <h2 className="text-[12px] tracking-[0.3em] font-bold uppercase mb-6 flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center text-[10px]">1</span>
                    Contact Information
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold uppercase text-[#888]">First Name</label>
                      <input type="text" className="w-full h-12 border border-[#e5e1d8] px-4 text-xs outline-none focus:border-black transition-colors" placeholder="John" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold uppercase text-[#888]">Last Name</label>
                      <input type="text" className="w-full h-12 border border-[#e5e1d8] px-4 text-xs outline-none focus:border-black transition-colors" placeholder="Doe" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold uppercase text-[#888]">Email Address</label>
                      <input type="email" className="w-full h-12 border border-[#e5e1d8] px-4 text-xs outline-none focus:border-black transition-colors" placeholder="alex@example.com" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold uppercase text-[#888]">Phone Number</label>
                      <input type="tel" className="w-full h-12 border border-[#e5e1d8] px-4 text-xs outline-none focus:border-black transition-colors" placeholder="+94 77 123 4567" />
                    </div>
                  </div>
                </section>

                <section>
                  <h2 className="text-[12px] tracking-[0.3em] font-bold uppercase mb-6 flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center text-[10px]">2</span>
                    Shipping Address
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1 md:col-span-2">
                        <label className="text-[9px] font-bold uppercase text-[#888]">Shipping Address</label>
                        <input type="text" className="w-full h-12 border border-[#e5e1d8] px-4 text-xs outline-none focus:border-black transition-colors" placeholder="Street Address, Apartment, etc." />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[9px] font-bold uppercase text-[#888]">City</label>
                        <input type="text" className="w-full h-12 border border-[#e5e1d8] px-4 text-xs outline-none focus:border-black transition-colors" placeholder="Colombo" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[9px] font-bold uppercase text-[#888]">Province / State</label>
                        <input type="text" className="w-full h-12 border border-[#e5e1d8] px-4 text-xs outline-none focus:border-black transition-colors" placeholder="Western" />
                    </div>
                  </div>
                </section>

                <section>
                  <h2 className="text-[12px] tracking-[0.3em] font-bold uppercase mb-6 flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center text-[10px]">3</span>
                    Payment Method
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { id: 'CREDIT_CARD', label: 'Credit Card', icon: <CreditCard size={18} /> },
                      { id: 'DEBIT_CARD', label: 'Debit Card', icon: <CreditCard size={18} className="rotate-180" /> },
                      { id: 'ONLINE_TRANSFER', label: 'Bank Transfer', icon: <Image src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_xM7u4YIn9I_7p_p2L8K2N3_7q8o_7p8A4w&s" alt="Transfer" width={20} height={20} className="grayscale" /> },
                      { id: 'CASH_ON_DELIVERY', label: 'Cash on Delivery', icon: <Truck size={18} /> }
                    ].map((method) => (
                      <button 
                        key={method.id}
                        onClick={() => setSelectedPayment(method.id)}
                        className={`h-16 border p-4 flex items-center gap-4 transition-all duration-300 cursor-pointer ${selectedPayment === method.id ? 'border-black bg-[#fcfbf7] shadow-sm' : 'border-[#e5e1d8] hover:border-[#b5b1a8] bg-white text-[#888]'}`}
                      >
                        <div className={`${selectedPayment === method.id ? 'text-black' : 'text-[#b5b1a8]'}`}>
                          {method.icon}
                        </div>
                        <span className={`text-[10px] font-bold uppercase tracking-wider ${selectedPayment === method.id ? 'text-black' : 'text-[#888]'}`}>
                          {method.label}
                        </span>
                        {selectedPayment === method.id && (
                          <div className="ml-auto w-2 h-2 rounded-full bg-black animate-pulse" />
                        )}
                      </button>
                    ))}
                  </div>
                </section>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: Summary */}
          <div className="lg:w-[380px] shrink-0">
            <div className="bg-white border border-[#e5e1d8] p-8 sticky top-36">
              <h2 className="text-[12px] tracking-[0.3em] font-bold uppercase mb-8 pb-4 border-b border-[#e5e1d8]">Order Summary</h2>
              
              <div className="space-y-5 mb-8">
                <div className="flex justify-between text-[11px] uppercase tracking-wider text-[#555]">
                  <span>Subtotal</span>
                  <span>Rs {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[11px] uppercase tracking-wider text-[#555]">
                  <span>Estimated Shipping</span>
                  <span>{shipping === 0 ? 'FREE' : `Rs ${shipping.toLocaleString()}`}</span>
                </div>
                <div className="flex justify-between text-[11px] uppercase tracking-wider text-[#555]">
                  <span>Estimated Tax</span>
                  <span>Calculated at next step</span>
                </div>
                <div className="pt-5 border-t border-[#e5e1d8] flex justify-between items-end">
                  <span className="text-[12px] font-bold uppercase tracking-[0.2em]">Total</span>
                  <div className="text-right">
                    <p className="text-2xl font-light">Rs {total.toLocaleString()}</p>
                    <p className="text-[9px] text-[#888] italic">* Includes all applicable taxes</p>
                  </div>
                </div>
              </div>

              {step === 1 ? (
                <button 
                  onClick={() => setStep(2)}
                  className="w-full py-5 bg-black text-white text-[11px] tracking-[0.3em] font-bold uppercase hover:bg-[#1a1a1a] transition-all cursor-pointer flex items-center justify-center gap-3"
                >
                  Proceed to Checkout
                  <ChevronRight size={16} />
                </button>
              ) : (
                <div className="space-y-4">
                  <button 
                    className="w-full py-5 bg-black text-white text-[11px] tracking-[0.3em] font-bold uppercase hover:bg-[#1a1a1a] transition-all cursor-pointer shadow-lg"
                  >
                    Place Order Now
                  </button>
                  <button 
                    onClick={() => setStep(1)}
                    className="w-full py-4 text-[10px] tracking-[0.2em] font-bold uppercase text-[#555] hover:text-black transition-colors flex items-center justify-center gap-2"
                  >
                    <ArrowLeft size={14} /> Back to Bag
                  </button>
                </div>
              )}

              {/* Trust Section */}
              <div className="mt-10 space-y-4 pt-6 border-t border-[#e5e1d8]">
                <div className="flex items-center gap-4 group">
                  <div className="w-10 h-10 rounded-full bg-[#fcfbf7] border border-[#e5e1d8] flex items-center justify-center text-[#c8b99a] group-hover:scale-110 transition-transform">
                    <ShieldCheck size={18} />
                  </div>
                  <div className="text-[10px]">
                    <p className="font-bold uppercase tracking-wider">Secure Checkout</p>
                    <p className="text-[#888] font-light">Your information is protected by 256-bit SSL encryption</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 group">
                  <div className="w-10 h-10 rounded-full bg-[#fcfbf7] border border-[#e5e1d8] flex items-center justify-center text-[#c8b99a] group-hover:scale-110 transition-transform">
                    <Truck size={18} />
                  </div>
                  <div className="text-[10px]">
                    <p className="font-bold uppercase tracking-wider">Guaranteed Delivery</p>
                    <p className="text-[#888] font-light">Ships in 1-2 business days with signature tracking</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CartPage;
