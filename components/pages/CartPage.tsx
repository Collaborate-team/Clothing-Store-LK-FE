'use client';

import React, { useCallback, useMemo, useState } from 'react';
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
import { OrderDTO, PaymentMethod, PlaceOrderRequestDTO } from '../../types/api-types';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { clearCart, removeFromCart, updateCartQuantity } from '@/store/cartSlice';
import { useNotification } from '@/context/NotificationContext';
import { AppError, ERROR_MESSAGES } from '@/utils/error-handler';

const SRI_LANKA_PROVINCES = [
  'Western',
  'Central',
  'Southern',
  'Northern',
  'Eastern',
  'North Western',
  'North Central',
  'Uva',
  'Sabaragamuwa',
];

const PAYMENT_METHODS = [
  { id: 'CREDIT_CARD', label: 'Credit Card' },
  { id: 'DEBIT_CARD', label: 'Debit Card' },
  { id: 'ONLINE_TRANSFER', label: 'Bank Transfer' },
  { id: 'CASH_ON_DELIVERY', label: 'Cash on Delivery' },
] as const;

const CartPage = () => {
  const dispatch = useAppDispatch();
  const { showNotification } = useNotification();
  const items = useAppSelector((state) => state.cart.items);
  const [step, setStep] = useState(1); // 1: Cart, 2: Checkout, 3: Success
  const [selectedPayment, setSelectedPayment] = useState('CASH_ON_DELIVERY');
  
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
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof typeof formData, string>>>({});
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [orderResponse, setOrderResponse] = useState<OrderDTO | null>(null);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const fieldName = e.target.name as keyof typeof formData;
    setFormData(prev => ({ ...prev, [fieldName]: e.target.value }));
    setFormErrors(prev => ({ ...prev, [fieldName]: '' }));
  }, []);

  const validateCheckoutForm = () => {
    const errors: Partial<Record<keyof typeof formData, string>> = {};

    (Object.keys(formData) as Array<keyof typeof formData>).forEach((field) => {
      if (!formData[field].trim()) {
        errors[field] = ERROR_MESSAGES.REQUIRED_FIELD;
      }
    });

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const submitOrder = async () => {
    if (items.length === 0) return;

    if (selectedPayment !== 'CASH_ON_DELIVERY') {
      showNotification('Only Cash on Delivery is available right now.', 'error');
      return;
    }

    const stockConflictItem = items.find(
      (item) => item.stock !== undefined && item.quantity > item.stock,
    );
    if (stockConflictItem?.stock !== undefined) {
      showNotification(
        `Not enough stock for ${stockConflictItem.name}. Only ${stockConflictItem.stock} items are available.`,
        'error',
      );
      return;
    }

    if (!validateCheckoutForm()) {
      return;
    }

    setIsPlacingOrder(true);
    try {
      const normalizeEnumValue = (value: string | null) =>
        value ? value.trim().toUpperCase().replaceAll(' ', '_') : null;

      const customerName = `${formData.firstName} ${formData.lastName}`.trim() || 'Guest User';
      const fullAddress = `${formData.address}, ${formData.city}, ${formData.province}`;

      const orderData: PlaceOrderRequestDTO = {
        items: items.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
          selectedSize: normalizeEnumValue(item.size),
          selectedColor: normalizeEnumValue(item.color),
          selectedDesign: normalizeEnumValue(item.design),
          imageUrl: item.image,
        })),
        paymentMethod: selectedPayment as PaymentMethod,
        customerName,
        email: formData.email,
        mobileNo: formData.phone,
        address: fullAddress,
        customer: {
          id: 0,
          name: customerName,
          email: formData.email,
          mobileNo: formData.phone,
          address: fullAddress,
        },
      };

      const response = await placeOrder(orderData);
      setOrderResponse(response);
      setStep(3);
      dispatch(clearCart());
    } catch (err) {
      console.error('Failed to place order:', err);
      const message = err instanceof AppError
        ? err.userMessage
        : ERROR_MESSAGES.UNKNOWN_ERROR;
      showNotification(message, 'error');
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const updateQuantity = useCallback((id: number, size: string | null, color: string | null, design: string | null, delta: number) => {
    const target = items.find(
      (item) => item.id === id && item.size === size && item.color === color && item.design === design,
    );
    if (!target) return;

    const nextQuantity = Math.max(1, target.quantity + delta);
    if (target.stock !== undefined && nextQuantity > target.stock) {
      showNotification(`Only ${target.stock} items are available in stock.`, 'error');
      return;
    }

    dispatch(
      updateCartQuantity({
        id,
        size,
        color,
        design,
        quantity: nextQuantity,
      }),
    );
  }, [dispatch, items, showNotification]);

  const removeItem = useCallback((id: number, size: string | null, color: string | null, design: string | null) => {
    dispatch(removeFromCart({ id, size, color, design }));
  }, [dispatch]);

  const subtotal = useMemo(
    () => items.reduce((acc, item) => acc + item.price * item.quantity, 0),
    [items],
  );
  const shipping = useMemo(() => (subtotal > 50000 ? 0 : 1500), [subtotal]);
  const total = useMemo(() => subtotal + shipping, [subtotal, shipping]);

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
            <button type="button" className="flex flex-col items-center relative z-10 group cursor-pointer" onClick={() => setStep(1)}>
              <div className={`w-9 h-9 rounded-full border flex items-center justify-center text-2xs font-bold transition-all duration-500 ${step >= 1 ? 'bg-black border-black text-white shadow-lg' : 'bg-white border-[#e5e1d8] text-[#b5b1a8]'}`}>
                01
              </div>
              <div className={`absolute -bottom-7 whitespace-nowrap text-[9px] tracking-[0.2em] uppercase font-bold transition-colors duration-500 ${step >= 1 ? 'text-black' : 'text-[#b5b1a8]'}`}>
                Cart
              </div>
              {step === 1 && <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#c8b99a] rounded-full border-2 border-white animate-pulse" />}
            </button>

            {/* Connector 1-2 */}
            <div className="flex-1 mx-4 h-px bg-[#e5e1d8] relative overflow-hidden">
              <div 
                className={`absolute inset-0 bg-black transition-transform duration-700 ease-out ${step >= 2 ? 'translate-x-0' : '-translate-x-full'}`} 
              />
            </div>

            {/* Step 2 */}
            <button type="button" className="flex flex-col items-center relative z-10 group cursor-pointer" onClick={() => items.length > 0 && setStep(2)}>
              <div className={`w-9 h-9 rounded-full border flex items-center justify-center text-2xs font-bold transition-all duration-500 ${step >= 2 ? 'bg-black border-black text-white shadow-lg' : 'bg-white border-[#e5e1d8] text-[#b5b1a8]'}`}>
                02
              </div>
              <div className={`absolute -bottom-7 whitespace-nowrap text-[9px] tracking-[0.2em] uppercase font-bold transition-colors duration-500 ${step >= 2 ? 'text-black' : 'text-[#b5b1a8]'}`}>
                Checkout
              </div>
              {step === 2 && <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#c8b99a] rounded-full border-2 border-white animate-pulse" />}
            </button>

            {/* Connector 2-3 */}
            <div className="flex-1 mx-4 h-px bg-[#e5e1d8] relative overflow-hidden">
              <div 
                className={`absolute inset-0 bg-black transition-transform duration-700 ease-out ${step >= 3 ? 'translate-x-0' : '-translate-x-full'}`} 
              />
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center relative z-10">
              <div className={`w-9 h-9 rounded-full border flex items-center justify-center text-2xs font-bold transition-all duration-500 ${step >= 3 ? 'bg-black border-black text-white shadow-lg' : 'bg-white border-[#e5e1d8] text-[#b5b1a8]'}`}>
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
            {(() => {
              if (step === 1) {
                return (
              <div className="bg-white border border-[#e5e1d8] overflow-hidden">
                <div className="hidden md:grid grid-cols-5 gap-4 p-6 border-b border-[#e5e1d8] text-[9px] tracking-[0.3em] font-bold uppercase text-[#b5b1a8]">
                  <div className="col-span-2">Product</div>
                  <div className="text-center">Price</div>
                  <div className="text-center">Quantity</div>
                  <div className="text-right">Total</div>
                </div>

                {items.length > 0 ? (
                  items.map((item) => (
                    <div key={`${item.id}-${item.size}-${item.color}-${item.design}`} className="grid grid-cols-1 md:grid-cols-5 gap-6 p-6 border-b border-[#e5e1d8] last:border-0 hover:bg-[#fcfbf7] transition-colors group">
                      <div className="col-span-1 md:col-span-2 flex gap-6">
                        <div className="relative w-24 h-32 shrink-0 overflow-hidden border border-[#e5e1d8]">
                          <Image src={item.image} alt={item.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                        </div>
                        <div className="flex flex-col justify-center gap-1">
                          <h3 className="text-[11px] tracking-[0.15em] font-bold uppercase leading-tight">{item.name}</h3>
                          <div className="text-2xs text-[#888] uppercase space-y-1">
                            {item.size && <p>Size: {item.size}</p>}
                            {item.color && <p>Color: {item.color}</p>}
                            {item.design && <p>Design: {item.design}</p>}
                          </div>
                          <button onClick={() => removeItem(item.id, item.size, item.color, item.design)} className="mt-2 text-[9px] text-red-800 border-b border-transparent hover:border-red-800 transition-all uppercase w-fit cursor-pointer flex items-center gap-1">
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
                          <button onClick={() => updateQuantity(item.id, item.size, item.color, item.design, -1)} className="p-1 hover:text-[#c8b99a] cursor-pointer"><Minus size={12} /></button>
                          <span className="w-8 text-center text-[12px]">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.size, item.color, item.design, 1)} className="p-1 hover:text-[#c8b99a] cursor-pointer"><Plus size={12} /></button>
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
                    <a href="/shop" className="px-8 py-4 bg-black text-white text-2xs tracking-[0.2em] font-bold uppercase">Return to shop</a>
                  </div>
                )}
              </div>
                );
              }

              if (step === 2) {
                return (
              <div className="bg-white border border-[#e5e1d8] p-8 space-y-10 animate-fade-in">
                <section>
                  <h2 className="text-[12px] tracking-[0.3em] font-bold uppercase mb-6 flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center text-2xs">1</span>{' '}
                    Contact Information
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label htmlFor="firstName" className="text-[9px] font-bold uppercase text-[#888]">First Name</label>
                      <input id="firstName" type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} className={`w-full h-12 border px-4 text-xs outline-none transition-colors ${formErrors.firstName ? 'border-red-500 focus:border-red-500' : 'border-[#e5e1d8] focus:border-black'}`} placeholder="John" />
                      {formErrors.firstName && <p className="text-2xs text-red-600">{formErrors.firstName}</p>}
                    </div>
                    <div className="space-y-1">
                      <label htmlFor="lastName" className="text-[9px] font-bold uppercase text-[#888]">Last Name</label>
                      <input id="lastName" type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} className={`w-full h-12 border px-4 text-xs outline-none transition-colors ${formErrors.lastName ? 'border-red-500 focus:border-red-500' : 'border-[#e5e1d8] focus:border-black'}`} placeholder="Doe" />
                      {formErrors.lastName && <p className="text-2xs text-red-600">{formErrors.lastName}</p>}
                    </div>
                    <div className="space-y-1">
                      <label htmlFor="email" className="text-[9px] font-bold uppercase text-[#888]">Email Address</label>
                      <input id="email" type="email" name="email" value={formData.email} onChange={handleInputChange} className={`w-full h-12 border px-4 text-xs outline-none transition-colors ${formErrors.email ? 'border-red-500 focus:border-red-500' : 'border-[#e5e1d8] focus:border-black'}`} placeholder="alex@example.com" />
                      {formErrors.email && <p className="text-2xs text-red-600">{formErrors.email}</p>}
                    </div>
                    <div className="space-y-1">
                      <label htmlFor="phone" className="text-[9px] font-bold uppercase text-[#888]">Phone Number</label>
                      <input id="phone" type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className={`w-full h-12 border px-4 text-xs outline-none transition-colors ${formErrors.phone ? 'border-red-500 focus:border-red-500' : 'border-[#e5e1d8] focus:border-black'}`} placeholder="+94 77 123 4567" />
                      {formErrors.phone && <p className="text-2xs text-red-600">{formErrors.phone}</p>}
                    </div>
                  </div>
                </section>

                <section>
                  <h2 className="text-[12px] tracking-[0.3em] font-bold uppercase mb-6 flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center text-2xs">2</span>{' '}
                    Shipping Address
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1 md:col-span-2">
                        <label htmlFor="address" className="text-[9px] font-bold uppercase text-[#888]">Shipping Address</label>
                      <input id="address" type="text" name="address" value={formData.address} onChange={handleInputChange} className={`w-full h-12 border px-4 text-xs outline-none transition-colors ${formErrors.address ? 'border-red-500 focus:border-red-500' : 'border-[#e5e1d8] focus:border-black'}`} placeholder="Street Address, Apartment, etc." />
                      {formErrors.address && <p className="text-2xs text-red-600">{formErrors.address}</p>}
                    </div>
                    <div className="space-y-1">
                        <label htmlFor="city" className="text-[9px] font-bold uppercase text-[#888]">City</label>
                      <input id="city" type="text" name="city" value={formData.city} onChange={handleInputChange} className={`w-full h-12 border px-4 text-xs outline-none transition-colors ${formErrors.city ? 'border-red-500 focus:border-red-500' : 'border-[#e5e1d8] focus:border-black'}`} placeholder="Colombo" />
                      {formErrors.city && <p className="text-2xs text-red-600">{formErrors.city}</p>}
                    </div>
                    <div className="space-y-1">
                        <label htmlFor="province" className="text-[9px] font-bold uppercase text-[#888]">Province / State</label>
                      <select id="province" name="province" value={formData.province} onChange={handleInputChange} className={`w-full h-12 border px-4 text-xs outline-none transition-colors bg-white ${formErrors.province ? 'border-red-500 focus:border-red-500' : 'border-[#e5e1d8] focus:border-black'}`}>
                        <option value="">Select Province / State</option>
                        {SRI_LANKA_PROVINCES.map((province) => (
                          <option key={province} value={province}>{province}</option>
                        ))}
                      </select>
                      {formErrors.province && <p className="text-2xs text-red-600">{formErrors.province}</p>}
                    </div>
                  </div>
                </section>

                <section>
                  <h2 className="text-[12px] tracking-[0.3em] font-bold uppercase mb-6 flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center text-2xs">3</span>{' '}
                    Payment Method
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {PAYMENT_METHODS.map((method) => {
                      const isEnabled = method.id === 'CASH_ON_DELIVERY';
                      const isDisabled = method.id !== 'CASH_ON_DELIVERY';
                      const isSelected = selectedPayment === method.id;

                      let icon: React.ReactNode = <Truck size={18} />;
                      if (method.id === 'CREDIT_CARD') {
                        icon = <CreditCard size={18} />;
                      } else if (method.id === 'DEBIT_CARD') {
                        icon = <CreditCard size={18} className="rotate-180" />;
                      } else if (method.id === 'ONLINE_TRANSFER') {
                        icon = (
                          <Image
                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_xM7u4YIn9I_7p_p2L8K2N3_7q8o_7p8A4w&s"
                            alt="Transfer"
                            width={20}
                            height={20}
                            className="grayscale"
                          />
                        );
                      }

                      let buttonClassName = 'border-[#e5e1d8] hover:border-[#b5b1a8] bg-white text-[#888] cursor-pointer';
                      if (isSelected) {
                        buttonClassName = 'border-black bg-[#fcfbf7] shadow-sm cursor-pointer';
                      }
                      if (isDisabled) {
                        buttonClassName = 'border-[#e5e1d8] bg-[#f8f8f8] text-[#b5b1a8] cursor-not-allowed opacity-60';
                      }

                      return (
                      <button
                        key={method.id}
                        disabled={!isEnabled}
                        onClick={() => setSelectedPayment(method.id)}
                        className={`h-16 border p-4 flex items-center gap-4 transition-all duration-300 ${buttonClassName}`}
                      >
                        <div className={`${isSelected ? 'text-black' : 'text-[#b5b1a8]'}`}>
                          {icon}
                        </div>
                        <span className={`text-2xs font-bold uppercase tracking-wider ${isSelected ? 'text-black' : 'text-[#888]'}`}>
                          {method.label}
                        </span>
                        {isSelected && (
                          <div className="ml-auto w-2 h-2 rounded-full bg-black animate-pulse" />
                        )}
                      </button>
                    )})}
                  </div>
                  <p className="mt-3 text-2xs text-[#888] uppercase tracking-wider">
                    Only Cash on Delivery is available at the moment.
                  </p>
                </section>
              </div>
                );
              }

              return (
              <div className="bg-white border border-[#e5e1d8] p-16 text-center space-y-8 animate-fade-in shadow-sm">
                <div className="w-24 h-24 rounded-full bg-black text-[#c8b99a] flex items-center justify-center mx-auto mb-8 relative">
                   <CheckCircle2 size={50} strokeWidth={1} />
                   <div className="absolute inset-0 rounded-full border border-[#c8b99a]/30 animate-ping opacity-20" />
                </div>
                <div className="space-y-4">
                  <p className="text-2xs tracking-[0.5em] font-bold text-[#c8b99a] uppercase">Transaction Successful</p>
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
                      dispatch(clearCart());
                        setStep(1);
                    }} 
                    className="px-12 py-5 bg-black text-white text-2xs tracking-[0.3em] font-bold uppercase hover:bg-[#111] transition-all shadow-xl"
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
              );
            })()}
          </div>

          {/* RIGHT COLUMN: Summary */}
          <div className="lg:w-95 shrink-0">
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

              {(() => {
                if (step === 1) {
                  return (
                    <button
                      onClick={() => setStep(2)}
                      disabled={items.length === 0}
                      className="w-full py-5 bg-black text-white text-[11px] tracking-[0.3em] font-bold uppercase hover:bg-[#1a1a1a] transition-all cursor-pointer flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group shadow-lg"
                    >
                      Proceed to Checkout
                      <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  );
                }

                if (step === 2) {
                  return (
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
                        className="w-full py-4 text-2xs tracking-[0.2em] font-bold uppercase text-[#555] hover:text-black transition-colors flex items-center justify-center gap-2"
                      >
                        <ArrowLeft size={14} /> Back to Bag
                      </button>
                    </div>
                  );
                }

                return (
                  <div className="p-4 border border-[#c8b99a]/20 bg-[#fcfbf7] rounded-sm text-center">
                    <p className="text-2xs tracking-[0.2em] uppercase font-bold text-[#c8b99a]">Order Finished</p>
                  </div>
                );
              })()}

              {/* Trust Section */}
              <div className="mt-10 space-y-4 pt-6 border-t border-[#e5e1d8]">
                <div className="flex items-center gap-4 group">
                  <div className="w-10 h-10 rounded-full bg-[#fcfbf7] border border-[#e5e1d8] flex items-center justify-center text-[#c8b99a] group-hover:scale-110 transition-transform">
                    <ShieldCheck size={18} />
                  </div>
                  <div className="text-2xs">
                    <p className="font-bold uppercase tracking-wider">Secure Checkout</p>
                    <p className="text-[#888] font-light">Your information is protected by 256-bit SSL encryption</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 group">
                  <div className="w-10 h-10 rounded-full bg-[#fcfbf7] border border-[#e5e1d8] flex items-center justify-center text-[#c8b99a] group-hover:scale-110 transition-transform">
                    <Truck size={18} />
                  </div>
                  <div className="text-2xs">
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

