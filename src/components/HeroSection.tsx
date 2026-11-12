import React from 'react';
import { ProductVariant } from '../types';
import { ShoppingBag, MessageCircle, ShieldCheck, Truck, Zap } from 'lucide-react';

interface HeroSectionProps {
  selectedVariant: ProductVariant;
  onSelectVariant: (v: ProductVariant) => void;
  onBuyClick: () => void;
  onContactClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  selectedVariant,
  onSelectVariant,
  onBuyClick,
  onContactClick,
}) => {
  return (
    <section id="hero" className="relative w-full bg-[#080808] text-white pt-10 pb-16 md:py-20 border-b border-white/10 overflow-hidden">
      {/* Subtle luxury ambient backlight */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-[#C6A45B]/10 blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Immediate Value & Sales Hook */}
          <div className="lg:col-span-6 flex flex-col justify-center space-y-6">
            {/* Brand Kicker */}
            <div className="flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-[#C6A45B]">
              <span>THE HOME HUB</span>
              <span aria-hidden="true">·</span>
              <span>EXCLUSIVE CAR ACCESSORY</span>
            </div>

            {/* Product Title */}
            <div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
                Car Humidifier
              </h1>
              <p className="mt-3 text-lg sm:text-xl text-neutral-300 font-normal leading-relaxed text-balance">
                Eliminate dry cabin air and infuse every drive with ultra-fine aromatherapy mist.
              </p>
            </div>

            {/* Price Box - Bold, Clear, Immediate */}
            <div className="p-4 sm:p-5 rounded-2xl bg-neutral-900/90 border border-white/10 flex items-baseline justify-between max-w-md">
              <div>
                <span className="text-xs uppercase tracking-wider text-neutral-400 block font-medium">
                  Official Retail Price
                </span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight tabular-nums">
                    PKR 1,199
                  </span>
                  <span className="text-xs text-[#C6A45B] font-semibold">
                    Free Lavender Oil & Wick Included
                  </span>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded bg-[#C6A45B]/20 border border-[#C6A45B]/40 text-[#C6A45B] text-xs font-bold uppercase tracking-wider">
                In Stock
              </span>
            </div>

            {/* Two Colour Variants Selector */}
            <div className="space-y-2.5">
              <span className="text-xs font-medium text-neutral-400 uppercase tracking-wider block">
                Select Edition: <strong className="text-white capitalize">{selectedVariant} Edition</strong>
              </span>
              <div className="grid grid-cols-2 gap-3 max-w-md">
                <button
                  type="button"
                  onClick={() => onSelectVariant('black')}
                  className={`p-3.5 rounded-xl border text-left transition-all flex items-center gap-3 cursor-pointer ${
                    selectedVariant === 'black'
                      ? 'border-[#C6A45B] bg-[#C6A45B]/10 shadow-[0_0_15px_rgba(198,164,91,0.2)]'
                      : 'border-white/10 bg-neutral-900/60 hover:border-white/30 text-neutral-300'
                  }`}
                >
                  <span className="w-5 h-5 rounded-full bg-gradient-to-br from-neutral-700 to-black border border-neutral-500 shrink-0 shadow-inner" />
                  <div>
                    <span className="text-xs font-bold block text-white">Black Edition</span>
                    <span className="text-[11px] text-neutral-400">Dark Gunmetal Metallic</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => onSelectVariant('white')}
                  className={`p-3.5 rounded-xl border text-left transition-all flex items-center gap-3 cursor-pointer ${
                    selectedVariant === 'white'
                      ? 'border-[#C6A45B] bg-[#C6A45B]/10 shadow-[0_0_15px_rgba(198,164,91,0.2)]'
                      : 'border-white/10 bg-neutral-900/60 hover:border-white/30 text-neutral-300'
                  }`}
                >
                  <span className="w-5 h-5 rounded-full bg-gradient-to-br from-white to-neutral-200 border border-neutral-300 shrink-0 shadow-inner" />
                  <div>
                    <span className="text-xs font-bold block text-white">White Edition</span>
                    <span className="text-[11px] text-neutral-400">Pearl Silver Metallic</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Primary & Secondary CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 max-w-md pt-2">
              <button
                type="button"
                onClick={onBuyClick}
                className="gold-btn flex-1 py-4 px-6 rounded-xl text-base font-bold flex items-center justify-center gap-2 cursor-pointer shadow-lg"
              >
                <ShoppingBag className="w-5 h-5 text-[#080808]" />
                <span>BUY NOW</span>
              </button>

              <button
                type="button"
                onClick={onContactClick}
                className="gold-outline-btn py-4 px-6 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageCircle className="w-5 h-5 text-[#25D366]" />
                <span>CONTACT US</span>
              </button>
            </div>

            {/* Direct-response Trust Marks */}
            <div className="pt-2 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-neutral-400">
              <div className="flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-[#C6A45B]" />
                <span>Cash on Delivery (COD) Nationwide</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#C6A45B]" />
                <span>7-Day Replacement Guarantee</span>
              </div>
            </div>
          </div>

          {/* Right Column: Large High-Quality Product Visual */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center relative">
            <div className="relative w-full max-w-lg aspect-[5/4] sm:aspect-[4/3] flex items-center justify-center">
              {/* Product Visual Container with Subtle Glow */}
              <div className="w-full h-full flex items-center justify-center relative">
                <img
                  src="/assets/aistudio/bottle_duo.png"
                  alt="THE HOME HUB Car Humidifier in Black Edition and White Edition with top crystal grille and USB cable"
                  className="w-full h-full object-contain filter drop-shadow-[0_20px_35px_rgba(0,0,0,0.85)] hover:scale-[1.02] transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Floating Specification Pill */}
              <div className="absolute -bottom-2 right-4 sm:right-8 bg-neutral-900/95 border border-white/15 backdrop-blur-md rounded-xl p-3 shadow-xl flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#C6A45B]/20 flex items-center justify-center text-[#C6A45B]">
                  <Zap className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <span className="text-[11px] font-semibold text-white block">Universal Car Fit</span>
                  <span className="text-[10px] text-neutral-400">Standard Cup Holder & USB Powered</span>
                </div>
              </div>
            </div>

            {/* Free Gift Badge Bar */}
            <div className="mt-4 w-full max-w-md bg-neutral-900/70 border border-white/10 rounded-xl px-4 py-2.5 flex items-center justify-between text-xs text-neutral-300">
              <span className="font-semibold text-white flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#C6A45B]" />
                Package Includes:
              </span>
              <span className="text-[#C6A45B] font-medium text-right">
                1x Lavender Oil (10ml) + 1x Cotton Filter
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
