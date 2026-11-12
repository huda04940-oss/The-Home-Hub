import React, { useState, useEffect } from 'react';
import { ProductVariant } from './types';
import { TopNav } from './components/TopNav';
import { HeroSection } from './components/HeroSection';
import { Experience360Section } from './components/Experience360Section';
import { BenefitsSection } from './components/BenefitsSection';
import { FinalPurchaseSection } from './components/FinalPurchaseSection';
import { CheckoutModal } from './components/CheckoutModal';
import { StickyMobileBar } from './components/StickyMobileBar';

export default function App() {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>('black');
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [whatsappNumber, setWhatsappNumber] = useState(() => {
    return localStorage.getItem('thh_whatsapp_number') || '+923001234567';
  });

  const handleUpdateWhatsapp = (newNumber: string) => {
    setWhatsappNumber(newNumber);
    localStorage.setItem('thh_whatsapp_number', newNumber);
  };

  const handleOpenCheckout = () => {
    setIsCheckoutOpen(true);
  };

  const handleOpenContactWhatsApp = () => {
    const cleanNum = whatsappNumber.replace(/[^0-9]/g, '');
    const text = encodeURIComponent(
      `Hello THE HOME HUB! I am interested in purchasing the Car Humidifier (${selectedVariant.toUpperCase()} EDITION) for PKR 1,199. Please share availability and delivery details.`
    );
    window.open(`https://wa.me/${cleanNum}?text=${text}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen bg-[#080808] text-white flex flex-col selection:bg-[#C6A45B] selection:text-black">
      {/* Top Navigation */}
      <TopNav onBuyClick={handleOpenCheckout} />

      {/* Main One-Page Sales Landing Content */}
      <main className="flex-1 pb-16 md:pb-0">
        {/* Section 1: Immediate Sales Hero (Deep Black #080808) */}
        <HeroSection
          selectedVariant={selectedVariant}
          onSelectVariant={setSelectedVariant}
          onBuyClick={handleOpenCheckout}
          onContactClick={handleOpenContactWhatsApp}
        />

        {/* Section 2: Scroll-Driven 360° Product Experience (Pure White #FFFFFF) */}
        <Experience360Section
          currentVariant={selectedVariant}
          onVariantChange={setSelectedVariant}
          onBuyClick={handleOpenCheckout}
        />

        {/* Section 3: Key Benefits */}
        <BenefitsSection onBuyClick={handleOpenCheckout} />

        {/* Section 5: Final Purchase Section (Deep Black #080808) */}
        <FinalPurchaseSection
          selectedVariant={selectedVariant}
          onSelectVariant={setSelectedVariant}
          onBuyClick={handleOpenCheckout}
          onContactClick={handleOpenContactWhatsApp}
        />
      </main>

      {/* Sticky Mobile Buy Now Action Bar (Max height < 15% mobile viewport) */}
      <StickyMobileBar
        selectedVariant={selectedVariant}
        onBuyClick={handleOpenCheckout}
      />

      {/* Direct-To-Order Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        selectedVariant={selectedVariant}
        onVariantChange={setSelectedVariant}
        whatsappNumber={whatsappNumber}
        onUpdateWhatsappNumber={handleUpdateWhatsapp}
      />
    </div>
  );
}
