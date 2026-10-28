import React from 'react';
import { Sparkles, ShoppingBag, Eye, ArrowRight, Star } from 'lucide-react';
import { Product } from '../types';

interface ProductHighlightShowcaseProps {
  onOpenProduct: (product?: Product) => void;
  featuredProduct?: Product;
  title?: string;
  subtitle?: string;
  kicker?: string;
  price?: number;
  imageUrl?: string;
  bullet1?: string;
  bullet2?: string;
  bullet3?: string;
  bullet4?: string;
  isDarkMode?: boolean;
}

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1000&q=85';

export const ProductHighlightShowcase: React.FC<ProductHighlightShowcaseProps> = ({
  onOpenProduct,
  featuredProduct,
  title = 'Heirloom Ribbed Knit Romper & Bonnet Set',
  subtitle = 'Woven from 100% combed organic cotton for sensitive newborn and toddler skin',
  kicker = 'ATELIER SIGNATURE SHOWCASE',
  price = 2950,
  imageUrl,
  bullet1 = '100% Organic Cotton — Butter-soft combed weave gentle on delicate skin',
  bullet2 = 'Hypoallergenic Dyes — Kind to sensitive skin, zero harsh chemicals',
  bullet3 = 'Play-Proof Durability — Double-stitched seams designed for high activity',
  bullet4 = 'Nickel-Free Snaps — Hassle-free 10-second diaper changes',
  isDarkMode = false,
}) => {
  const activeImage = imageUrl?.trim() || featuredProduct?.imageUrl || DEFAULT_IMAGE;
  const activeTitle = title?.trim() || featuredProduct?.title || 'Heirloom Ribbed Knit Romper & Bonnet Set';
  const activePrice = price || featuredProduct?.price || 2950;

  return (
    <section className={`py-20 sm:py-28 border-b overflow-hidden transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-[#151518] text-white border-neutral-800' 
        : 'bg-[#F9F7F4] text-neutral-900 border-neutral-200'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Subtle Top Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 sm:mb-18">
          <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.3em] font-light text-[#C89299] mb-2">
            {kicker}
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight">
            {activeTitle}
          </h2>
          <p className="text-xs sm:text-sm font-light text-neutral-500 dark:text-neutral-400 mt-3 max-w-lg mx-auto leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* 3-Part Showcase Grid: Left Bullets | Center Garment Feature | Right Bullets */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column Bullet Callouts */}
          <div className="lg:col-span-3 space-y-8 lg:space-y-12 order-2 lg:order-1">
            <div className={`p-6 rounded-2xl border transition-all ${
              isDarkMode 
                ? 'bg-neutral-900/60 border-neutral-800/80 shadow-lg' 
                : 'bg-white border-neutral-200/80 shadow-xs'
            }`}>
              <div className="flex items-center gap-2 text-[#C89299] mb-2">
                <span className="text-base">✦</span>
                <span className="text-[10px] uppercase tracking-widest font-semibold">Pure Fiber</span>
              </div>
              <p className="text-xs sm:text-sm font-light leading-relaxed text-neutral-700 dark:text-neutral-300">
                {bullet1}
              </p>
            </div>

            <div className={`p-6 rounded-2xl border transition-all ${
              isDarkMode 
                ? 'bg-neutral-900/60 border-neutral-800/80 shadow-lg' 
                : 'bg-white border-neutral-200/80 shadow-xs'
            }`}>
              <div className="flex items-center gap-2 text-[#C89299] mb-2">
                <span className="text-base">✦</span>
                <span className="text-[10px] uppercase tracking-widest font-semibold">Skin Wellness</span>
              </div>
              <p className="text-xs sm:text-sm font-light leading-relaxed text-neutral-700 dark:text-neutral-300">
                {bullet2}
              </p>
            </div>
          </div>

          {/* Center Column: Prominent Large Product Showcase with Soft Halo */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center order-1 lg:order-2">
            <div className="relative group w-full max-w-md sm:max-w-lg">
              
              {/* Soft decorative background glow */}
              <div className="absolute inset-0 bg-[#C89299]/15 rounded-full filter blur-3xl transform scale-90 -z-10" />

              {/* Garment Studio Card */}
              <div className="relative aspect-[4/5] rounded-[32px] overflow-hidden border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xl group-hover:shadow-2xl transition-all duration-500">
                <img
                  src={activeImage}
                  alt={activeTitle}
                  className="w-full h-full object-cover object-center group-hover:scale-103 transition-transform duration-700 ease-out"
                  onError={(e) => { (e.target as HTMLImageElement).src = DEFAULT_IMAGE; }}
                />
                
                {/* Floating Price Pill */}
                <div className="absolute bottom-6 left-6 bg-white/95 dark:bg-black/90 backdrop-blur-md px-4 py-2 rounded-full border border-neutral-200 dark:border-neutral-800 shadow-md flex items-center gap-2">
                  <span className="text-[10px] uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Atelier Price</span>
                  <span className="font-serif text-base font-semibold text-neutral-950 dark:text-white">
                    Rs. {activePrice.toLocaleString()}
                  </span>
                </div>

                {/* Quick view button overlay */}
                <div className="absolute top-6 right-6">
                  <button
                    onClick={() => onOpenProduct(featuredProduct)}
                    className="w-10 h-10 rounded-full bg-white/90 dark:bg-black/90 text-neutral-900 dark:text-white shadow-md flex items-center justify-center hover:scale-108 transition-transform cursor-pointer"
                    title="View Garment Details"
                  >
                    <Eye className="w-4 h-4 stroke-[1.8]" />
                  </button>
                </div>
              </div>

            </div>

            {/* Quick Action Button Under Center Piece */}
            <div className="mt-8 flex items-center gap-4">
              <button
                onClick={() => onOpenProduct(featuredProduct)}
                className="px-8 py-3.5 rounded-full text-xs uppercase tracking-[0.2em] font-medium bg-neutral-950 hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-200 dark:text-neutral-950 transition-all duration-300 cursor-pointer flex items-center gap-2 shadow-md active:scale-98"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Shop This Garment</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Right Column Bullet Callouts */}
          <div className="lg:col-span-3 space-y-8 lg:space-y-12 order-3">
            <div className={`p-6 rounded-2xl border transition-all ${
              isDarkMode 
                ? 'bg-neutral-900/60 border-neutral-800/80 shadow-lg' 
                : 'bg-white border-neutral-200/80 shadow-xs'
            }`}>
              <div className="flex items-center gap-2 text-[#C89299] mb-2">
                <span className="text-base">✦</span>
                <span className="text-[10px] uppercase tracking-widest font-semibold">Active Motion</span>
              </div>
              <p className="text-xs sm:text-sm font-light leading-relaxed text-neutral-700 dark:text-neutral-300">
                {bullet3}
              </p>
            </div>

            <div className={`p-6 rounded-2xl border transition-all ${
              isDarkMode 
                ? 'bg-neutral-900/60 border-neutral-800/80 shadow-lg' 
                : 'bg-white border-neutral-200/80 shadow-xs'
            }`}>
              <div className="flex items-center gap-2 text-[#C89299] mb-2">
                <span className="text-base">✦</span>
                <span className="text-[10px] uppercase tracking-widest font-semibold">Effortless Wear</span>
              </div>
              <p className="text-xs sm:text-sm font-light leading-relaxed text-neutral-700 dark:text-neutral-300">
                {bullet4}
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
