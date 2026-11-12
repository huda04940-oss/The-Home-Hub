import React from 'react';
import { ProductVariant } from '../types';
import { ShoppingBag } from 'lucide-react';

interface StickyMobileBarProps {
  selectedVariant: ProductVariant;
  onBuyClick: () => void;
}

export const StickyMobileBar: React.FC<StickyMobileBarProps> = ({
  selectedVariant,
  onBuyClick,
}) => {
  return (
    <aside
      aria-label="Mobile quick purchase action"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#080808]/95 backdrop-blur-md border-t border-white/15 px-4 py-3 flex items-center justify-between gap-3 shadow-[0_-10px_25px_rgba(0,0,0,0.8)]"
      style={{ maxHeight: '72px' }}
    >
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-semibold text-neutral-400 capitalize">
            {selectedVariant} Edition
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#C6A45B]" />
        </div>
        <span className="text-lg font-extrabold text-white tracking-tight tabular-nums">
          PKR 1,199
        </span>
      </div>

      <button
        type="button"
        onClick={onBuyClick}
        className="gold-btn py-2.5 px-5 rounded-xl text-xs font-extrabold flex items-center gap-2 cursor-pointer shadow-lg tracking-wide shrink-0"
      >
        <ShoppingBag className="w-4 h-4 text-[#080808]" />
        <span>BUY NOW</span>
      </button>
    </aside>
  );
};
