import React, { useEffect, useRef, useState } from 'react';
import { ProductVariant } from '../types';
import { Product3DViewer } from './Product3DViewer';
import { ShoppingBag } from 'lucide-react';

interface Experience360SectionProps {
  currentVariant: ProductVariant;
  onVariantChange: (v: ProductVariant) => void;
  onBuyClick: () => void;
}

export const Experience360Section: React.FC<Experience360SectionProps> = ({
  currentVariant,
  onVariantChange,
  onBuyClick,
}) => {
  const sectionRef = useRef<HTMLElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Calculate progress while section passes through viewport
      const totalDist = rect.height + windowHeight;
      const currentDist = windowHeight - rect.top;
      const rawProgress = Math.max(0, Math.min(1, currentDist / totalDist));
      setScrollProgress(rawProgress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section
      id="experience"
      ref={sectionRef}
      className="relative w-full bg-[#080808] text-white py-16 md:py-24 border-b border-white/10 overflow-hidden"
    >
      {/* Subtle Studio Gold Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-[#C6A45B]/8 blur-[140px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-8">
          <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-[#C6A45B]">
            <span>3D PRODUCT INSPECTION</span>
            <span aria-hidden="true">·</span>
            <span>360° CONTINUOUS ROTATION</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Inspect the Physical Product
          </h2>
          <p className="text-sm sm:text-base text-neutral-400 leading-relaxed text-balance">
            Rotate seamlessly as you scroll down. Examine the original cylindrical silhouette, circular top ventilation lattice, front gold button, water-level gauge, and rear USB cable.
          </p>

          {/* Minimal Edition Toggle */}
          <div className="pt-2 flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => onVariantChange('black')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer border ${
                currentVariant === 'black'
                  ? 'bg-neutral-800 text-white border-[#C6A45B] shadow-md'
                  : 'bg-neutral-900/60 text-neutral-400 border-white/10 hover:text-white'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-neutral-900 border border-neutral-600 inline-block" />
              <span>Black Edition</span>
            </button>

            <button
              type="button"
              onClick={() => onVariantChange('white')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer border ${
                currentVariant === 'white'
                  ? 'bg-neutral-200 text-black border-[#C6A45B] shadow-md font-bold'
                  : 'bg-neutral-900/60 text-neutral-400 border-white/10 hover:text-white'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-white border border-neutral-300 inline-block" />
              <span>White Edition</span>
            </button>
          </div>
        </div>

        {/* Central 3D Showcase Card - Clean Black Studio Environment */}
        <div className="relative w-full max-w-3xl mx-auto rounded-3xl bg-[#080808] shadow-2xl overflow-hidden border border-white/10">
          {/* Three.js Interactive Component */}
          <div className="w-full h-[460px] sm:h-[560px] relative">
            <Product3DViewer
              currentVariant={currentVariant}
              scrollProgress={scrollProgress}
            />
          </div>
        </div>

        {/* Mid-page Quick Conversion Bar */}
        <div className="mt-10 text-center">
          <button
            onClick={onBuyClick}
            className="gold-btn inline-flex items-center gap-2 px-8 py-4 rounded-xl text-sm sm:text-base font-extrabold shadow-lg cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4 text-[#080808]" />
            <span>BUY NOW</span>
          </button>
        </div>
      </div>
    </section>
  );
};
