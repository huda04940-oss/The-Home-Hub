import React from 'react';
import { ShoppingBag } from 'lucide-react';

interface TopNavProps {
  onBuyClick: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({ onBuyClick }) => {
  return (
    <header className="sticky top-0 z-50 w-full bg-[#080808]/95 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-8">
        {/* Zone 1: Brand title wordmark */}
        <a
          href="#"
          className="text-lg sm:text-xl font-extrabold tracking-widest text-white uppercase whitespace-nowrap shrink-0 hover:text-[#C6A45B] transition-colors"
        >
          THE HOME HUB
        </a>

        {/* Zone 2: Concise single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-300">
          <a
            href="#hero"
            className="hover:text-white hover:underline underline-offset-8 transition-colors whitespace-nowrap shrink-0"
          >
            Overview
          </a>
          <a
            href="#experience"
            className="hover:text-white hover:underline underline-offset-8 transition-colors whitespace-nowrap shrink-0"
          >
            360° Experience
          </a>
          <a
            href="#benefits"
            className="hover:text-white hover:underline underline-offset-8 transition-colors whitespace-nowrap shrink-0"
          >
            Key Benefits
          </a>
          <a
            href="#purchase"
            className="hover:text-white hover:underline underline-offset-8 transition-colors whitespace-nowrap shrink-0"
          >
            Order
          </a>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onBuyClick}
            className="gold-btn px-5 py-2.5 rounded-lg text-xs sm:text-sm font-bold flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4 text-[#080808]" />
            <span>BUY NOW</span>
          </button>
        </div>
      </div>
    </header>
  );
};
