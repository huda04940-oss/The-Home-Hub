import React from 'react';
import { ProductVariant } from '../types';
import { ShoppingBag, MessageCircle, ShieldCheck, Truck, RefreshCw, Check } from 'lucide-react';

interface FinalPurchaseSectionProps {
  selectedVariant: ProductVariant;
  onSelectVariant: (v: ProductVariant) => void;
  onBuyClick: () => void;
  onContactClick: () => void;
}

export const FinalPurchaseSection: React.FC<FinalPurchaseSectionProps> = ({
  selectedVariant,
  onSelectVariant,
  onBuyClick,
  onContactClick,
}) => {
  return (
    <section id="purchase" className="relative w-full bg-[#080808] text-white py-16 md:py-24 overflow-hidden border-t border-white/10">
      {/* Background radial gold glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#C6A45B]/10 blur-[140px] pointer-events-none rounded-full" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Main Purchase Card */}
        <div className="rounded-3xl bg-neutral-900/90 border border-[#C6A45B]/40 p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          {/* Top Gold Corner Accent Line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#C6A45B] to-transparent" />

          <div className="text-center space-y-4 max-w-xl mx-auto">
            <span className="text-xs uppercase tracking-widest font-bold text-[#C6A45B] block">
              THE HOME HUB OFFICIAL STORE
            </span>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
              Car Humidifier
            </h2>

            {/* Clear Price Display */}
            <div className="flex items-center justify-center gap-3">
              <span className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight tabular-nums">
                PKR 1,199
              </span>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#C6A45B]/20 text-[#C6A45B] border border-[#C6A45B]/30 uppercase tracking-wider">
                Full Kit Included
              </span>
            </div>

            {/* Short Urgency-Free Purchase Message */}
            <p className="text-sm sm:text-base text-neutral-300 leading-relaxed pt-2">
              Order directly with nationwide Cash on Delivery. Inspect your parcel upon arrival and enjoy a refreshing, serene drive from day one.
            </p>

            {/* Selected Colour Option Selector & Repeat Indicator */}
            <div className="pt-4 pb-2">
              <span className="text-xs font-medium text-neutral-400 uppercase tracking-wider block mb-2.5">
                Current Selection: <strong className="text-white capitalize">{selectedVariant} Edition</strong>
              </span>
              <div className="inline-flex p-1 rounded-2xl bg-black/60 border border-white/15 gap-1.5">
                <button
                  type="button"
                  onClick={() => onSelectVariant('black')}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                    selectedVariant === 'black'
                      ? 'bg-[#C6A45B] text-[#080808] shadow-md'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <span className="w-3 h-3 rounded-full bg-neutral-900 border border-neutral-600 inline-block" />
                  <span>Black Edition</span>
                </button>

                <button
                  type="button"
                  onClick={() => onSelectVariant('white')}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                    selectedVariant === 'white'
                      ? 'bg-[#C6A45B] text-[#080808] shadow-md'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <span className="w-3 h-3 rounded-full bg-white border border-neutral-300 inline-block" />
                  <span>White Edition</span>
                </button>
              </div>
            </div>

            {/* Large Gold BUY NOW and Secondary CONTACT US Buttons */}
            <div className="pt-4 space-y-3 max-w-md mx-auto">
              <button
                type="button"
                onClick={onBuyClick}
                className="gold-btn w-full py-4 px-8 rounded-xl text-base sm:text-lg font-extrabold flex items-center justify-center gap-2.5 cursor-pointer shadow-xl tracking-wide"
              >
                <ShoppingBag className="w-5 h-5 text-[#080808]" />
                <span>BUY NOW</span>
              </button>

              <button
                type="button"
                onClick={onContactClick}
                className="gold-outline-btn w-full py-3.5 px-6 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 text-[#25D366]" />
                <span>CONTACT US ON WHATSAPP</span>
              </button>
            </div>

            {/* Honest Trust Badges */}
            <div className="pt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-neutral-400 border-t border-white/10 mt-6">
              <div className="flex items-center justify-center gap-1.5">
                <Truck className="w-4 h-4 text-[#C6A45B]" />
                <span>Cash on Delivery</span>
              </div>
              <div className="flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#C6A45B]" />
                <span>7-Day Replacement</span>
              </div>
              <div className="flex items-center justify-center gap-1.5">
                <Check className="w-4 h-4 text-[#C6A45B]" />
                <span>100% Verified Product</span>
              </div>
            </div>
          </div>
        </div>

        {/* Minimal Footer */}
        <footer className="mt-16 text-center text-xs text-neutral-500 space-y-2 border-t border-white/5 pt-8">
          <p className="font-medium text-neutral-400 tracking-wider">
            THE HOME HUB · ALL RIGHTS RESERVED
          </p>
          <p className="text-[11px] text-neutral-600">
            Premium Car Humidifier & Aromatherapy Diffuser · One Page Official Sales Portal
          </p>
        </footer>
      </div>
    </section>
  );
};
