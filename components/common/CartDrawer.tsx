'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, Minus, Plus, ShoppingBag, ArrowRight } from 'lucide-react';

interface CartItem {
  id: number;
  name: string;
  price: number;
  size: string | null;
  color: string | null;
  quantity: number;
  image: string;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onRemove: (id: number, size: string | null, color: string | null) => void;
  onUpdateQuantity: (id: number, size: string | null, color: string | null, newQuantity: number) => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose, items, onRemove, onUpdateQuantity }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <>
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-black/40 backdrop-blur-[2px] z-[200] transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <aside 
        className={`fixed top-0 right-0 h-full w-full max-w-[450px] bg-[#fcfbf7] z-[201] shadow-2xl transform transition-transform duration-500 ease-out flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-8 border-b border-[#e5e1d8]">
          <div className="flex items-center gap-3">
            <ShoppingBag size={20} strokeWidth={1.5} />
            <h2 className="text-[12px] tracking-[0.3em] font-bold uppercase">Shopping Bag ({items.length})</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:rotate-90 transition-transform duration-300 cursor-pointer"
            aria-label="Close cart"
          >
            <X size={24} strokeWidth={1.5} />
          </button>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-8">
          {items.length > 0 ? (
            items.map((item) => (
              <div key={`${item.id}-${item.size}-${item.color}`} className="flex gap-6 animate-fade-in">
                {/* Product Image */}
                <div className="relative w-24 h-32 bg-white border border-[#e5e1d8] overflow-hidden shrink-0">
                  <Image src={item.image} alt={item.name} fill className="object-cover" />
                </div>

                {/* Product Info */}
                <div className="flex-1 flex flex-col py-1">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="text-[10px] tracking-[0.15em] font-bold uppercase leading-tight max-w-[180px]">{item.name}</h3>
                    <span className="text-[12px] font-medium">Rs {item.price.toLocaleString()}</span>
                  </div>
                  
                  <div className="text-[9px] tracking-[0.1em] text-[#888] uppercase space-y-1 mb-4">
                    {item.color && <p>Color: {item.color}</p>}
                    {item.size && <p>Size: {item.size}</p>}
                  </div>

                  <div className="mt-auto flex items-center justify-between">
                    <div className="flex items-center border border-[#e5e1d8] h-10 px-3 bg-white">
                      <button 
                        onClick={() => onUpdateQuantity(item.id, item.size, item.color, Math.max(1, item.quantity - 1))}
                        className="p-1 hover:text-[#c8b99a] cursor-pointer"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="w-8 text-center text-[11px]">{item.quantity}</span>
                      <button 
                        onClick={() => onUpdateQuantity(item.id, item.size, item.color, item.quantity + 1)}
                        className="p-1 hover:text-[#c8b99a] cursor-pointer"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                    <button 
                      onClick={() => onRemove(item.id, item.size, item.color)}
                      className="text-[9px] tracking-[0.2em] font-bold text-[#b5b1a8] border-b border-[#b5b1a8] hover:text-black hover:border-black transition-colors uppercase cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="h-full flex flex-col items-center justify-center space-y-6 opacity-30 italic">
              <ShoppingBag size={48} strokeWidth={0.5} />
              <p className="text-[12px] tracking-[0.2em] uppercase">Your bag is empty</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 bg-white border-t border-[#e5e1d8] space-y-6">
          <div className="flex justify-between items-end">
            <div className="space-y-1">
              <p className="text-[10px] tracking-[0.2em] text-[#b5b1a8] uppercase font-bold">Subtotal</p>
              <p className="text-[9px] text-[#888] font-light">* Shipping & taxes calculated at checkout</p>
            </div>
            <p className="text-[20px] font-light">Rs {subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
          </div>

          <div className="space-y-3">
            <Link href="/cart" onClick={onClose} className="w-full h-14 bg-black text-white text-[11px] tracking-[0.3em] font-bold uppercase flex items-center justify-center gap-3 hover:bg-[#1a1a1a] transition-all group cursor-pointer">
              Checkout Now
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <button 
              onClick={onClose}
              className="w-full h-14 border border-black text-black text-[11px] tracking-[0.2em] font-bold uppercase hover:bg-black hover:text-white transition-all cursor-pointer"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default CartDrawer;
