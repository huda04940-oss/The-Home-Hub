import React, { useState } from 'react';
import { ProductVariant, OrderForm, ConfirmedOrder } from '../types';
import {
  X,
  ShoppingBag,
  CheckCircle,
  Truck,
  MessageCircle,
  ShieldCheck,
  Plus,
  Minus,
  Settings,
  Copy,
  Check,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedVariant: ProductVariant;
  onVariantChange: (v: ProductVariant) => void;
  whatsappNumber: string;
  onUpdateWhatsappNumber: (num: string) => void;
}

const PAKISTAN_CITIES = [
  'Karachi',
  'Lahore',
  'Islamabad',
  'Rawalpindi',
  'Faisalabad',
  'Multan',
  'Peshawar',
  'Quetta',
  'Sialkot',
  'Gujranwala',
  'Hyderabad',
  'Other City',
];

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  selectedVariant,
  onVariantChange,
  whatsappNumber,
  onUpdateWhatsappNumber,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('Karachi');
  const [customCity, setCustomCity] = useState('');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'bank_transfer'>('cod');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<ConfirmedOrder | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  // WhatsApp Configuration toggle
  const [showConfig, setShowConfig] = useState(false);
  const [tempWhatsapp, setTempWhatsapp] = useState(whatsappNumber);

  if (!isOpen) return null;

  const unitPrice = 1199;
  const totalPrice = unitPrice * quantity;
  const effectiveCity = city === 'Other City' ? customCity || 'Other City' : city;

  // Handle Cash on Delivery order placement
  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim() || !address.trim()) {
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const newOrder: ConfirmedOrder = {
        orderId: `HH-${Math.floor(100000 + Math.random() * 900000)}`,
        timestamp: new Date().toLocaleDateString('en-PK', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        variant: selectedVariant,
        quantity,
        unitPrice,
        totalPrice,
        customerName: fullName.trim(),
        phone: phone.trim(),
        city: effectiveCity,
        address: address.trim(),
        paymentMethod: paymentMethod === 'cod' ? 'Cash on Delivery (COD)' : 'Direct Bank Transfer',
      };

      setConfirmedOrder(newOrder);
      setIsSubmitting(false);

      // Trigger celebration confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#C6A45B', '#FFFFFF', '#333333'],
        });
      } catch {
        // Ignored
      }
    }, 600);
  };

  // Generate WhatsApp order message link
  const handleOrderViaWhatsApp = () => {
    const formattedCity = effectiveCity;
    const variantName = selectedVariant === 'black' ? 'Black Edition (Dark Metallic)' : 'White Edition (Pearl Silver)';
    const text = `*NEW ORDER — THE HOME HUB CAR HUMIDIFIER*
-----------------------------------------
*Item:* Car Humidifier (${variantName})
*Quantity:* ${quantity}
*Total Amount:* PKR ${totalPrice.toLocaleString()}
*Payment:* Cash on Delivery (COD)
*Included Free:* 1x Lavender Essential Oil (10ml) + 1x Cotton Core Filter

*Customer Details:*
• *Name:* ${fullName || 'Not provided yet'}
• *Phone:* ${phone || 'Not provided yet'}
• *City:* ${formattedCity}
• *Address:* ${address || 'Not provided yet'}
-----------------------------------------
Please confirm my order and share tracking information!`;

    const cleanNum = whatsappNumber.replace(/[^0-9]/g, '');
    const url = `https://wa.me/${cleanNum}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const copyOrderDetails = () => {
    if (!confirmedOrder) return;
    const text = `Order #${confirmedOrder.orderId}
Product: THE HOME HUB Car Humidifier (${confirmedOrder.variant.toUpperCase()} EDITION)
Qty: ${confirmedOrder.quantity}
Total: PKR ${confirmedOrder.totalPrice.toLocaleString()}
Customer: ${confirmedOrder.customerName} (${confirmedOrder.phone})
Address: ${confirmedOrder.address}, ${confirmedOrder.city}
Payment: ${confirmedOrder.paymentMethod}`;

    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-xl my-8 bg-neutral-900 border border-white/15 rounded-3xl shadow-2xl text-white overflow-hidden">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-neutral-950/80">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#C6A45B]" />
            <h3 className="text-base font-bold text-white tracking-tight">
              {confirmedOrder ? 'Order Confirmation' : 'Complete Your Order'}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowConfig(!showConfig)}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
              title="Configure Store WhatsApp Number"
            >
              <Settings className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Optional WhatsApp Store Configuration Drawer */}
        {showConfig && (
          <div className="p-4 bg-black/90 border-b border-[#C6A45B]/30 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-[#C6A45B]">Configurable Business WhatsApp Number</span>
              <button
                type="button"
                onClick={() => setShowConfig(false)}
                className="text-neutral-400 hover:text-white"
              >
                Done
              </button>
            </div>
            <p className="text-neutral-400 text-[11px]">
              Set your actual WhatsApp number for receiving customer orders and inquiries:
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                value={tempWhatsapp}
                onChange={(e) => setTempWhatsapp(e.target.value)}
                placeholder="+923001234567"
                className="flex-1 bg-neutral-800 border border-white/20 rounded-lg px-3 py-1.5 text-white text-xs font-mono"
              />
              <button
                type="button"
                onClick={() => {
                  onUpdateWhatsappNumber(tempWhatsapp);
                  setShowConfig(false);
                }}
                className="gold-btn px-3 py-1.5 rounded-lg text-xs font-bold"
              >
                Save
              </button>
            </div>
          </div>
        )}

        {/* Content Area */}
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          {confirmedOrder ? (
            /* ORDER SUCCESS RECEIPT VIEW */
            <div className="space-y-6 text-center py-4">
              <div className="w-16 h-16 rounded-full bg-[#C6A45B]/20 border border-[#C6A45B] text-[#C6A45B] flex items-center justify-center mx-auto shadow-lg">
                <CheckCircle className="w-8 h-8" />
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#C6A45B] block mb-1">
                  ORDER PLACED SUCCESSFULLY
                </span>
                <h4 className="text-2xl font-extrabold text-white">Thank You for Your Order!</h4>
                <p className="text-xs text-neutral-400 mt-1">
                  Order ID: <strong className="text-white font-mono">{confirmedOrder.orderId}</strong>
                </p>
              </div>

              {/* Receipt Summary Card */}
              <div className="bg-neutral-950 rounded-2xl p-4 sm:p-5 border border-white/10 text-left space-y-3 text-xs">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div>
                    <span className="font-bold text-white block text-sm">Car Humidifier</span>
                    <span className="text-neutral-400 capitalize">
                      {confirmedOrder.variant} Edition · Qty: {confirmedOrder.quantity}
                    </span>
                  </div>
                  <span className="text-base font-extrabold text-[#C6A45B] tabular-nums">
                    PKR {confirmedOrder.totalPrice.toLocaleString()}
                  </span>
                </div>

                <div className="space-y-1.5 text-neutral-300">
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Recipient:</span>
                    <span className="font-medium text-white">{confirmedOrder.customerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Phone:</span>
                    <span className="font-medium text-white">{confirmedOrder.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">City / Destination:</span>
                    <span className="font-medium text-white">{confirmedOrder.city}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Delivery Address:</span>
                    <span className="font-medium text-white text-right max-w-[240px] truncate">
                      {confirmedOrder.address}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Payment:</span>
                    <span className="font-semibold text-[#C6A45B]">{confirmedOrder.paymentMethod}</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-[#C6A45B]/10 border border-[#C6A45B]/20 text-[11px] text-[#C6A45B]">
                  Bonus included: 1x 10ml Lavender Essential Oil + 1x Cotton Core Filter.
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5 pt-2">
                <button
                  type="button"
                  onClick={handleOrderViaWhatsApp}
                  className="w-full py-3.5 px-4 rounded-xl font-bold text-xs sm:text-sm bg-[#25D366] text-black hover:bg-[#20ba5a] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Send Order Confirmation on WhatsApp</span>
                </button>

                <button
                  type="button"
                  onClick={copyOrderDetails}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/15 text-white transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isCopied ? <Check className="w-3.5 h-3.5 text-[#C6A45B]" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{isCopied ? 'Order Details Copied!' : 'Copy Order Receipt'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setConfirmedOrder(null);
                    onClose();
                  }}
                  className="text-xs text-neutral-400 hover:text-white pt-2 block mx-auto underline"
                >
                  Close & Return to Store
                </button>
              </div>
            </div>
          ) : (
            /* CHECKOUT FORM VIEW */
            <form onSubmit={handleSubmitOrder} className="space-y-5">
              {/* Product Variant Quick Switcher */}
              <div className="p-3.5 bg-neutral-950 rounded-2xl border border-white/10 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-neutral-400 uppercase tracking-wider font-semibold">Selected Variant</span>
                  <span className="text-white font-bold capitalize">{selectedVariant} Edition</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => onVariantChange('black')}
                    className={`p-2.5 rounded-xl border text-left transition-all flex items-center gap-2.5 cursor-pointer ${
                      selectedVariant === 'black'
                        ? 'border-[#C6A45B] bg-[#C6A45B]/15 text-white'
                        : 'border-white/10 bg-neutral-900 text-neutral-400 hover:text-white'
                    }`}
                  >
                    <span className="w-3.5 h-3.5 rounded-full bg-neutral-800 border border-neutral-600 shrink-0" />
                    <div>
                      <span className="text-xs font-bold block">Black Edition</span>
                      <span className="text-[10px] opacity-75">Dark Metallic</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => onVariantChange('white')}
                    className={`p-2.5 rounded-xl border text-left transition-all flex items-center gap-2.5 cursor-pointer ${
                      selectedVariant === 'white'
                        ? 'border-[#C6A45B] bg-[#C6A45B]/15 text-white'
                        : 'border-white/10 bg-neutral-900 text-neutral-400 hover:text-white'
                    }`}
                  >
                    <span className="w-3.5 h-3.5 rounded-full bg-white border border-neutral-300 shrink-0" />
                    <div>
                      <span className="text-xs font-bold block">White Edition</span>
                      <span className="text-[10px] opacity-75">Pearl Silver</span>
                    </div>
                  </button>
                </div>

                {/* Quantity Stepper & Price Calculation */}
                <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs">
                  <span className="text-neutral-400">Quantity:</span>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center bg-neutral-900 border border-white/15 rounded-lg overflow-hidden">
                      <button
                        type="button"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="px-2.5 py-1 text-neutral-300 hover:text-white hover:bg-white/10 transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-3 py-1 font-bold text-white tabular-nums">{quantity}</span>
                      <button
                        type="button"
                        onClick={() => setQuantity(quantity + 1)}
                        className="px-2.5 py-1 text-neutral-300 hover:text-white hover:bg-white/10 transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <span className="text-base font-extrabold text-[#C6A45B] tabular-nums">
                      PKR {totalPrice.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Customer Shipping Form Fields */}
              <div className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Ali Ahmed"
                    className="w-full bg-neutral-950 border border-white/15 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#C6A45B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Phone / WhatsApp Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0300 1234567"
                    className="w-full bg-neutral-950 border border-white/15 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#C6A45B]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">
                      City *
                    </label>
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full bg-neutral-950 border border-white/15 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#C6A45B]"
                    >
                      {PAKISTAN_CITIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  {city === 'Other City' ? (
                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 mb-1">
                        Specify City Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={customCity}
                        onChange={(e) => setCustomCity(e.target.value)}
                        placeholder="Enter your city"
                        className="w-full bg-neutral-950 border border-white/15 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#C6A45B]"
                      />
                    </div>
                  ) : (
                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 mb-1">
                        Shipping
                      </label>
                      <div className="h-[42px] px-3.5 flex items-center bg-neutral-950/60 border border-white/10 rounded-xl text-xs text-[#C6A45B] font-semibold">
                        Standard Delivery (2-3 Days)
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Complete Street Address *
                  </label>
                  <textarea
                    required
                    rows={2}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="House / Flat No., Street, Sector / Area"
                    className="w-full bg-neutral-950 border border-white/15 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#C6A45B]"
                  />
                </div>
              </div>

              {/* Payment Method Selection */}
              <div className="space-y-2 pt-1">
                <label className="block text-xs font-semibold text-neutral-300">
                  Payment Method
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cod')}
                    className={`p-3 rounded-xl border text-left flex items-center gap-2 cursor-pointer ${
                      paymentMethod === 'cod'
                        ? 'border-[#C6A45B] bg-[#C6A45B]/15 text-white font-bold'
                        : 'border-white/10 bg-neutral-950 text-neutral-400'
                    }`}
                  >
                    <Truck className="w-4 h-4 text-[#C6A45B] shrink-0" />
                    <span>Cash on Delivery (COD)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('bank_transfer')}
                    className={`p-3 rounded-xl border text-left flex items-center gap-2 cursor-pointer ${
                      paymentMethod === 'bank_transfer'
                        ? 'border-[#C6A45B] bg-[#C6A45B]/15 text-white font-bold'
                        : 'border-white/10 bg-neutral-950 text-neutral-400'
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4 text-[#C6A45B] shrink-0" />
                    <span>Bank Transfer / JazzCash</span>
                  </button>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="space-y-3 pt-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="gold-btn w-full py-4 px-6 rounded-xl text-sm sm:text-base font-extrabold flex items-center justify-center gap-2 cursor-pointer shadow-lg disabled:opacity-50"
                >
                  <ShoppingBag className="w-5 h-5 text-[#080808]" />
                  <span>
                    {isSubmitting ? 'PLACING ORDER...' : `CONFIRM ORDER · PKR ${totalPrice.toLocaleString()}`}
                  </span>
                </button>

                <div className="relative flex items-center justify-center my-2">
                  <div className="border-t border-white/10 w-full" />
                  <span className="bg-neutral-900 px-3 text-[11px] text-neutral-400 uppercase tracking-widest font-semibold shrink-0">
                    OR
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleOrderViaWhatsApp}
                  className="w-full py-3.5 px-6 rounded-xl text-xs sm:text-sm font-bold bg-[#25D366] text-black hover:bg-[#20ba5a] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Fast Order via WhatsApp</span>
                </button>
              </div>

              {/* Guaranteed Trust Footer */}
              <div className="pt-2 text-center text-[11px] text-neutral-400 flex items-center justify-center gap-4">
                <span>🔒 Secure Direct Checkout</span>
                <span>•</span>
                <span>📦 Inspect Before Paying</span>
                <span>•</span>
                <span>🇵🇰 Nationwide Pakistan Delivery</span>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
