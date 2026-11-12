import React from 'react';
import { Sliders, VolumeX, HandMetal, PlugZap, Gift, CheckCircle2, ShoppingBag } from 'lucide-react';

interface BenefitsSectionProps {
  onBuyClick: () => void;
}

export const BenefitsSection: React.FC<BenefitsSectionProps> = ({ onBuyClick }) => {
  return (
    <section id="benefits" className="relative w-full bg-white text-neutral-900 py-16 md:py-24 border-b border-neutral-200 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-14 md:mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-[#C6A45B] bg-[#C6A45B]/10 px-3.5 py-1 rounded-full border border-[#C6A45B]/20">
            <span>ENGINEERED FOR THE ROAD</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#080808] tracking-tight">
            Designed for In-Car Comfort
          </h2>
          <p className="text-sm sm:text-base text-neutral-600 leading-relaxed text-balance">
            Engineered specifically for automobile cabins to combat dry air conditioning, reduce fatigue, and disperse soothing botanical scents.
          </p>
        </div>

        {/* 4 Minimal Icon-Based Benefit Points */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {/* Benefit 1 */}
          <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-200/80 hover:border-[#C6A45B]/40 transition-all duration-300 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#C6A45B]/15 text-[#C6A45B] flex items-center justify-center">
                <Sliders className="w-6 h-6 stroke-[2.2]" />
              </div>
              <h3 className="text-lg font-bold text-neutral-900 tracking-tight">
                Multiple Mist Settings
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                Toggle smoothly between continuous rapid humidification or intermittent pulse diffusion to maintain optimal cabin moisture.
              </p>
            </div>
            <div className="text-[11px] font-semibold text-[#C6A45B] uppercase tracking-wider">
              Continuous & Intermittent
            </div>
          </div>

          {/* Benefit 2 */}
          <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-200/80 hover:border-[#C6A45B]/40 transition-all duration-300 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#C6A45B]/15 text-[#C6A45B] flex items-center justify-center">
                <VolumeX className="w-6 h-6 stroke-[2.2]" />
              </div>
              <h3 className="text-lg font-bold text-neutral-900 tracking-tight">
                Quiet Operation
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                Ultrasonic ceramic transducer produces a whisper-quiet output under 25dB, keeping phone calls and music completely undisturbed.
              </p>
            </div>
            <div className="text-[11px] font-semibold text-[#C6A45B] uppercase tracking-wider">
              Ultra-Silent &lt; 25dB
            </div>
          </div>

          {/* Benefit 3 */}
          <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-200/80 hover:border-[#C6A45B]/40 transition-all duration-300 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#C6A45B]/15 text-[#C6A45B] flex items-center justify-center">
                <HandMetal className="w-6 h-6 stroke-[2.2]" />
              </div>
              <h3 className="text-lg font-bold text-neutral-900 tracking-tight">
                Simple One-Button Operation
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                Single tactile gold button allows safe, distraction-free control while driving: tap once to mist, long-press for soft LED night ambiance.
              </p>
            </div>
            <div className="text-[11px] font-semibold text-[#C6A45B] uppercase tracking-wider">
              One-Touch Blind Control
            </div>
          </div>

          {/* Benefit 4 */}
          <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-200/80 hover:border-[#C6A45B]/40 transition-all duration-300 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#C6A45B]/15 text-[#C6A45B] flex items-center justify-center">
                <PlugZap className="w-6 h-6 stroke-[2.2]" />
              </div>
              <h3 className="text-lg font-bold text-neutral-900 tracking-tight">
                USB-Powered Convenience
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                Plug-and-play USB connection operates effortlessly via car 12V adapter, dashboard USB ports, portable power banks, or desktop laptops.
              </p>
            </div>
            <div className="text-[11px] font-semibold text-[#C6A45B] uppercase tracking-wider">
              Universal 5V USB Input
            </div>
          </div>
        </div>

        {/* Free Included Bonus Kit Banner */}
        <div className="mt-14 max-w-4xl mx-auto rounded-3xl bg-neutral-900 text-white p-6 sm:p-8 border border-neutral-800 shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Visual of Included Bottle & Wick */}
            <div className="md:col-span-4 flex items-center justify-center">
              <div className="w-44 h-44 bg-black/60 rounded-2xl p-3 border border-white/10 flex items-center justify-center">
                <img
                  src="/assets/aistudio/accessories_clean.png"
                  alt="Hankey Lavender Aromatherapy Essential Oil and Cotton Core Filter included free"
                  className="max-h-full object-contain filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

            {/* Description of Inclusions */}
            <div className="md:col-span-8 space-y-3">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#C6A45B]">
                <Gift className="w-4 h-4" />
                <span>INCLUDED FREE WITH EVERY ORDER</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Complete Aromatherapy Starter Package
              </h3>
              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                Every unit comes factory-packed with everything required to begin immediate aromatherapy diffusion:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 text-xs text-neutral-200">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#C6A45B] shrink-0" />
                  <span>1x Hankey Lavender Essential Oil (10ml)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#C6A45B] shrink-0" />
                  <span>1x High-Density Cotton Core Filter</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#C6A45B] shrink-0" />
                  <span>1x Flexible USB Power Cable</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#C6A45B] shrink-0" />
                  <span>1x English User & Care Manual</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick CTA inside Benefits */}
        <div className="mt-12 text-center">
          <button
            type="button"
            onClick={onBuyClick}
            className="gold-btn inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-sm font-bold shadow-lg cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4 text-[#080808]" />
            <span>BUY NOW</span>
          </button>
        </div>
      </div>
    </section>
  );
};
