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
  ShoppingBag,
  CheckCircle2
} from 'lucide-react';
import { placeOrder } from '../../app/api/api-service';
import { OrderDTO, OrderItemDTO, PaymentMethod } from '../../types/api-types';

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
  const [step, setStep] = useState(1); // 1: Cart, 2: Checkout, 3: Success
  const [selectedPayment, setSelectedPayment] = useState('CREDIT_CARD');
  
  // Checkout Form State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    province: ''
  });
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [orderResponse, setOrderResponse] = useState<OrderDTO | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const submitOrder = async () => {
    if (items.length === 0) return;
    setIsPlacingOrder(true);
    try {
      const orderItems: OrderItemDTO[] = items.map(item => ({
        productId: 1, // DTO requires number but cart items might be string mock. Using 1 as fallback for demo
        productName: item.name,
        imageUrl: item.image,
        color: item.color as any,
        size: item.size as any,
        qty: item.quantity,
        unitPrice: item.price
      }));

      const orderData: OrderDTO = {
        items: orderItems,
        paymentMethod: selectedPayment as PaymentMethod,
        customerName: `${formData.firstName} ${formData.lastName}`.trim() || 'Guest User',
        email: formData.email,
        mobileNo: formData.phone,
        address: `${formData.address}, ${formData.city}, ${formData.province}`,
        total: items.reduce((acc, item) => acc + item.price * item.quantity, 0) + (items.reduce((acc, item) => acc + item.price * item.quantity, 0) > 50000 ? 0 : 1500)
      };

      const response = await placeOrder(orderData);
      setOrderResponse(response);
      setStep(3);
      setItems([]); // Clear local cart
    } catch (err) {
      console.error('Failed to place order:', err);
      alert('There was an issue placing your order. Please try again.');
    } finally {
      setIsPlacingOrder(false);
    }
  };

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
      <header className="pt-16 pb-12 px-4 text-center border-b border-[#e5e1d8] mb-12 bg-white/70 backdrop-blur-xl sticky top-0 z-30 transition-all duration-500">
        <h1 className="text-4xl md:text-5xl font-light tracking-tight mb-10" style={{ fontFamily: "var(--font-cormorant), 'Cormorant Garamond', serif" }}>
          {step === 1 ? (
            <>Shopping <span className="text-[#c8b99a]">Bag</span></>
          ) : (
            <>Secured <span className="text-[#c8b99a]">Checkout</span></>
          )}
        </h1>
        
        {/* Visual Progress Stepper */}
        <div className="max-w-xl mx-auto w-full px-4">
          <div className="flex items-center justify-between relative">
            {/* Step 1 */}
            <div className="flex flex-col items-center relative z-10 group cursor-pointer" onClick={() => setStep(1)}>
              <div className={`w-9 h-9 rounded-full border flex items-center justify-center text-[10px] font-bold transition-all duration-500 ${step >= 1 ? 'bg-black border-black text-white shadow-lg' : 'bg-white border-[#e5e1d8] text-[#b5b1a8]'}`}>
                01
              </div>
              <div className={`absolute -bottom-7 whitespace-nowrap text-[9px] tracking-[0.2em] uppercase font-bold transition-colors duration-500 ${step >= 1 ? 'text-black' : 'text-[#b5b1a8]'}`}>
                Cart
              </div>
              {step === 1 && <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#c8b99a] rounded-full border-2 border-white animate-pulse" />}
            </div>

            {/* Connector 1-2 */}
            <div className="flex-1 mx-4 h-[1px] bg-[#e5e1d8] relative overflow-hidden">
              <div 
                className={`absolute inset-0 bg-black transition-transform duration-700 ease-out ${step >= 2 ? 'translate-x-0' : '-translate-x-full'}`} 
              />
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center relative z-10 group cursor-pointer" onClick={() => items.length > 0 && setStep(2)}>
              <div className={`w-9 h-9 rounded-full border flex items-center justify-center text-[10px] font-bold transition-all duration-500 ${step >= 2 ? 'bg-black border-black text-white shadow-lg' : 'bg-white border-[#e5e1d8] text-[#b5b1a8]'}`}>
                02
              </div>
              <div className={`absolute -bottom-7 whitespace-nowrap text-[9px] tracking-[0.2em] uppercase font-bold transition-colors duration-500 ${step >= 2 ? 'text-black' : 'text-[#b5b1a8]'}`}>
                Checkout
              </div>
              {step === 2 && <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#c8b99a] rounded-full border-2 border-white animate-pulse" />}
            </div>

            {/* Connector 2-3 */}
            <div className="flex-1 mx-4 h-[1px] bg-[#e5e1d8] relative overflow-hidden">
              <div 
                className={`absolute inset-0 bg-black transition-transform duration-700 ease-out ${step >= 3 ? 'translate-x-0' : '-translate-x-full'}`} 
              />
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center relative z-10">
              <div className={`w-9 h-9 rounded-full border flex items-center justify-center text-[10px] font-bold transition-all duration-500 ${step >= 3 ? 'bg-black border-black text-white shadow-lg' : 'bg-white border-[#e5e1d8] text-[#b5b1a8]'}`}>
                03
              </div>
              <div className={`absolute -bottom-7 whitespace-nowrap text-[9px] tracking-[0.2em] uppercase font-bold transition-colors duration-500 ${step >= 3 ? 'text-black' : 'text-[#b5b1a8]'}`}>
                Complete
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
          
          {/* LEFT COLUMN: Cart Items, Checkout Form, or Completion */}
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
            ) : step === 2 ? (
              <div className="bg-white border border-[#e5e1d8] p-8 space-y-10 animate-fade-in">
                <section>
                  <h2 className="text-[12px] tracking-[0.3em] font-bold uppercase mb-6 flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center text-[10px]">1</span>
                    Contact Information
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold uppercase text-[#888]">First Name</label>
                      <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} className="w-full h-12 border border-[#e5e1d8] px-4 text-xs outline-none focus:border-black transition-colors" placeholder="John" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold uppercase text-[#888]">Last Name</label>
                      <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} className="w-full h-12 border border-[#e5e1d8] px-4 text-xs outline-none focus:border-black transition-colors" placeholder="Doe" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold uppercase text-[#888]">Email Address</label>
                      <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full h-12 border border-[#e5e1d8] px-4 text-xs outline-none focus:border-black transition-colors" placeholder="alex@example.com" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold uppercase text-[#888]">Phone Number</label>
                      <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full h-12 border border-[#e5e1d8] px-4 text-xs outline-none focus:border-black transition-colors" placeholder="+94 77 123 4567" />
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
                        <input type="text" name="address" value={formData.address} onChange={handleInputChange} className="w-full h-12 border border-[#e5e1d8] px-4 text-xs outline-none focus:border-black transition-colors" placeholder="Street Address, Apartment, etc." />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[9px] font-bold uppercase text-[#888]">City</label>
                        <input type="text" name="city" value={formData.city} onChange={handleInputChange} className="w-full h-12 border border-[#e5e1d8] px-4 text-xs outline-none focus:border-black transition-colors" placeholder="Colombo" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[9px] font-bold uppercase text-[#888]">Province / State</label>
                        <input type="text" name="province" value={formData.province} onChange={handleInputChange} className="w-full h-12 border border-[#e5e1d8] px-4 text-xs outline-none focus:border-black transition-colors" placeholder="Western" />
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
            ) : (
              <div className="bg-white border border-[#e5e1d8] p-16 text-center space-y-8 animate-fade-in shadow-sm">
                <div className="w-24 h-24 rounded-full bg-black text-[#c8b99a] flex items-center justify-center mx-auto mb-8 relative">
                   <CheckCircle2 size={50} strokeWidth={1} />
                   <div className="absolute inset-0 rounded-full border border-[#c8b99a]/30 animate-ping opacity-20" />
                </div>
                <div className="space-y-4">
                  <p className="text-[10px] tracking-[0.5em] font-bold text-[#c8b99a] uppercase">Transaction Successful</p>
                  <h2 className="text-4xl font-light tracking-tight" style={{ fontFamily: "var(--font-cormorant), 'Cormorant Garamond', serif" }}>
                    Your order is <span className="italic text-[#c8b99a]">confirmed.</span>
                  </h2>
                </div>
                <p className="text-[13px] text-[#888] max-w-sm mx-auto font-light leading-relaxed">
                  Thank you for your purchase. We are preparing your selection <span className="font-bold text-black tracking-widest text-[11px]">{orderResponse?.orderId || '#NA-SUCCESS'}</span> with meticulous care.
                </p>
                <div className="pt-6">
                  <button 
                    onClick={() => {
                        setItems([]);
                        setStep(1);
                    }} 
                    className="px-12 py-5 bg-black text-white text-[10px] tracking-[0.3em] font-bold uppercase hover:bg-[#111] transition-all shadow-xl"
                  >
                    Continue Shopping
                  </button>
                </div>
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
                  disabled={items.length === 0}
                  className="w-full py-5 bg-black text-white text-[11px] tracking-[0.3em] font-bold uppercase hover:bg-[#1a1a1a] transition-all cursor-pointer flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group shadow-lg"
                >
                  Proceed to Checkout
                  <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
              ) : step === 2 ? (
                <div className="space-y-4">
                  <button 
                    onClick={submitOrder}
                    disabled={isPlacingOrder}
                    className="w-full py-5 bg-black text-white text-[11px] tracking-[0.3em] font-bold uppercase hover:bg-[#111] transition-all cursor-pointer shadow-lg active:scale-95 duration-200 disabled:opacity-50"
                  >
                    {isPlacingOrder ? 'Processing...' : 'Place Order Now'}
                  </button>
                  <button 
                    onClick={() => setStep(1)}
                    className="w-full py-4 text-[10px] tracking-[0.2em] font-bold uppercase text-[#555] hover:text-black transition-colors flex items-center justify-center gap-2"
                  >
                    <ArrowLeft size={14} /> Back to Bag
                  </button>
                </div>
              ) : (
                <div className="p-4 border border-[#c8b99a]/20 bg-[#fcfbf7] rounded-sm text-center">
                    <p className="text-[10px] tracking-[0.2em] uppercase font-bold text-[#c8b99a]">Order Finished</p>
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
