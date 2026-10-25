import React from 'react';
import { Sparkles, ArrowRight, Clock, ChevronRight } from 'lucide-react';
import { Product } from '../types';

interface NewArrivalsSectionProps {
  products: Product[];
  onSelectCategory: (category: string) => void;
  selectedCategory?: string;
  onOpenLightbox?: (product: Product) => void;
  title?: string;
  isDarkMode?: boolean;
}

export const NewArrivalsSection: React.FC<NewArrivalsSectionProps> = ({
  products,
  onSelectCategory,
  selectedCategory,
  onOpenLightbox,
  title = 'New Arrivals & Fresh Drops',
  isDarkMode = false,
}) => {
  // Helper to filter recent outfits for quick thumbnail previews
  const getCategoryPreviews = (categoryType: 'Boys' | 'Girls' | 'Newborn') => {
    return products
      .filter((p) => {
        const cat = (p.category || '').toLowerCase();
        const sub = (p.subCategory || '').toLowerCase();
        if (categoryType === 'Boys') {
          return (cat.includes('boy') && !cat.includes('baby boy')) || cat === 'boys wear';
        }
        if (categoryType === 'Girls') {
          return (cat.includes('girl') && !cat.includes('baby girl')) || cat === 'girls wear';
        }
        if (categoryType === 'Newborn') {
          return cat.includes('newborn') || sub.includes('swaddle') || sub.includes('kimono') || sub.includes('essential');
        }
        return false;
      })
      .slice(0, 3);
  };

  const boysPreviews = getCategoryPreviews('Boys');
  const girlsPreviews = getCategoryPreviews('Girls');
  const newbornPreviews = getCategoryPreviews('Newborn');

  const handleCardClick = (target: string) => {
    onSelectCategory(target);
    const targetElement = document.getElementById('kids-products-section');
    targetElement?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="new-arrivals-section" className={`border-b py-12 sm:py-16 transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-[#151518] border-neutral-800 text-neutral-100' 
        : 'bg-[#FAF9F8] border-neutral-200 text-neutral-900'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className={`flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-10 pb-4 border-b gap-4 ${
          isDarkMode ? 'border-neutral-800' : 'border-neutral-200/60'
        }`}>
          <div>
            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] uppercase tracking-[0.22em] font-semibold mb-2 border ${
              isDarkMode 
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-300' 
                : 'bg-amber-500/10 border-amber-300/60 text-amber-900'
            }`}>
              <Sparkles className="w-3 h-3 text-amber-500 stroke-[2]" />
              <span>Spring / Summer 2026 Collection</span>
            </div>
            <h2 className={`font-serif text-2xl sm:text-3xl lg:text-4xl font-normal tracking-wide mt-1 transition-colors ${
              isDarkMode ? 'text-white' : 'text-neutral-900'
            }`}>
              {title}
            </h2>
            <p className={`text-xs sm:text-sm font-light mt-1.5 max-w-2xl leading-relaxed ${
              isDarkMode ? 'text-neutral-400' : 'text-neutral-500'
            }`}>
              Explore newly tailored festive outfits, lawn prints, and organic cottons — cleanly segmented by category for effortless browsing.
            </p>
          </div>

          {/* Quick Segment Buttons Bar */}
          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            <button
              type="button"
              onClick={() => handleCardClick('New Arrivals')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium tracking-wider uppercase border transition-all cursor-pointer shadow-2xs ${
                selectedCategory === 'New Arrivals'
                  ? 'bg-neutral-900 text-white border-neutral-900'
                  : 'bg-white text-neutral-700 border-neutral-300 hover:border-black hover:text-black'
              }`}
            >
              All New In
            </button>
            <button
              type="button"
              onClick={() => handleCardClick('Boys New Arrivals')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium tracking-wider uppercase border transition-all cursor-pointer shadow-2xs ${
                selectedCategory === 'Boys New Arrivals'
                  ? 'bg-sky-900 text-white border-sky-900'
                  : 'bg-sky-50 text-sky-800 border-sky-200 hover:border-sky-400'
              }`}
            >
              Boys
            </button>
            <button
              type="button"
              onClick={() => handleCardClick('Girls New Arrivals')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium tracking-wider uppercase border transition-all cursor-pointer shadow-2xs ${
                selectedCategory === 'Girls New Arrivals'
                  ? 'bg-rose-900 text-white border-rose-900'
                  : 'bg-rose-50 text-rose-800 border-rose-200 hover:border-rose-400'
              }`}
            >
              Girls
            </button>
            <button
              type="button"
              onClick={() => handleCardClick('Newborn New Arrivals')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium tracking-wider uppercase border transition-all cursor-pointer shadow-2xs ${
                selectedCategory === 'Newborn New Arrivals'
                  ? 'bg-emerald-900 text-white border-emerald-900'
                  : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:border-emerald-400'
              }`}
            >
              Newborn
            </button>
          </div>
        </div>

        {/* 3 Prominent, Segmented New Arrivals Cards (On-Screen Grid) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          
          {/* 1. [ Boys New Arrivals ] */}
          <div 
            onClick={() => handleCardClick('Boys New Arrivals')}
            className="group relative bg-[#F4F9FD] border border-sky-100 rounded-2xl p-6 sm:p-7 shadow-xs hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col justify-between hover:border-sky-300 hover:-translate-y-0.5"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-full bg-white text-sky-800 shadow-2xs font-serif text-base font-semibold flex items-center justify-center border border-sky-100">
                    B
                  </span>
                  <div>
                    <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-sky-700 block">
                      Ages 1 - 6 Years
                    </span>
                    <h3 className="font-serif text-xl sm:text-2xl text-neutral-900 font-medium tracking-wide">
                      Boys New Arrivals
                    </h3>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 text-[9px] uppercase tracking-[0.2em] font-bold text-sky-800 bg-white/95 px-2.5 py-1 rounded-full border border-sky-200/80 shadow-2xs">
                  <Clock className="w-2.5 h-2.5" />
                  New Stock
                </span>
              </div>

              <p className="text-xs sm:text-[13px] text-neutral-600 font-light leading-relaxed mb-6">
                Tailored Baba Suits, hand-finished jacquard waistcoats, and pure cotton Kurta Shalwars for festive and Friday gatherings.
              </p>

              {/* Outfit Thumbnail Previews */}
              {boysPreviews.length > 0 && (
                <div className="flex items-center gap-2.5 mb-6">
                  {boysPreviews.map((p) => (
                    <div 
                      key={p.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onOpenLightbox) onOpenLightbox(p);
                        else handleCardClick('Boys New Arrivals');
                      }}
                      className="w-14 h-18 rounded-lg overflow-hidden border border-white shadow-2xs relative bg-white group/thumb cursor-pointer"
                      title={p.title}
                    >
                      <img
                        src={p.imageUrl}
                        alt={p.title}
                        className="w-full h-full object-cover group-hover/thumb:scale-110 transition-transform duration-300"
                      />
                    </div>
                  ))}
                  <div className="text-[11px] text-sky-800 font-light pl-1">
                    + more in stock
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Action Trigger */}
            <div className="pt-4 border-t border-sky-200/50 flex items-center justify-between text-xs font-medium text-sky-800 uppercase tracking-[0.16em]">
              <span>Shop Boys New Stock</span>
              <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center group-hover:bg-sky-800 group-hover:text-white transition-all duration-200 shadow-2xs">
                <ArrowRight className="w-3.5 h-3.5 stroke-[2]" />
              </div>
            </div>
          </div>

          {/* 2. [ Girls New Arrivals ] */}
          <div 
            onClick={() => handleCardClick('Girls New Arrivals')}
            className="group relative bg-[#FDF5F7] border border-rose-100 rounded-2xl p-6 sm:p-7 shadow-xs hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col justify-between hover:border-rose-300 hover:-translate-y-0.5"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-full bg-white text-rose-800 shadow-2xs font-serif text-base font-semibold flex items-center justify-center border border-rose-100">
                    G
                  </span>
                  <div>
                    <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-rose-700 block">
                      Ages 2 - 8 Years
                    </span>
                    <h3 className="font-serif text-xl sm:text-2xl text-neutral-900 font-medium tracking-wide">
                      Girls New Arrivals
                    </h3>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 text-[9px] uppercase tracking-[0.2em] font-bold text-rose-800 bg-white/95 px-2.5 py-1 rounded-full border border-rose-200/80 shadow-2xs">
                  <Clock className="w-2.5 h-2.5" />
                  New Stock
                </span>
              </div>

              <p className="text-xs sm:text-[13px] text-neutral-600 font-light leading-relaxed mb-6">
                Heirloom party twirl frocks, delicate embroidered chiffon coordinates, and Guriya Eid lawn sets with artisanal gota work.
              </p>

              {/* Outfit Thumbnail Previews */}
              {girlsPreviews.length > 0 && (
                <div className="flex items-center gap-2.5 mb-6">
                  {girlsPreviews.map((p) => (
                    <div 
                      key={p.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onOpenLightbox) onOpenLightbox(p);
                        else handleCardClick('Girls New Arrivals');
                      }}
                      className="w-14 h-18 rounded-lg overflow-hidden border border-white shadow-2xs relative bg-white group/thumb cursor-pointer"
                      title={p.title}
                    >
                      <img
                        src={p.imageUrl}
                        alt={p.title}
                        className="w-full h-full object-cover group-hover/thumb:scale-110 transition-transform duration-300"
                      />
                    </div>
                  ))}
                  <div className="text-[11px] text-rose-800 font-light pl-1">
                    + more in stock
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Action Trigger */}
            <div className="pt-4 border-t border-rose-200/50 flex items-center justify-between text-xs font-medium text-rose-800 uppercase tracking-[0.16em]">
              <span>Shop Girls New Stock</span>
              <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center group-hover:bg-rose-800 group-hover:text-white transition-all duration-200 shadow-2xs">
                <ArrowRight className="w-3.5 h-3.5 stroke-[2]" />
              </div>
            </div>
          </div>

          {/* 3. [ Newborn New Arrivals ] */}
          <div 
            onClick={() => handleCardClick('Newborn New Arrivals')}
            className="group relative bg-[#F3FAF5] border border-emerald-100 rounded-2xl p-6 sm:p-7 shadow-xs hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col justify-between hover:border-emerald-300 hover:-translate-y-0.5"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-full bg-white text-emerald-800 shadow-2xs font-serif text-base font-semibold flex items-center justify-center border border-emerald-100">
                    N
                  </span>
                  <div>
                    <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-emerald-700 block">
                      Ages 0 - 12 Months
                    </span>
                    <h3 className="font-serif text-xl sm:text-2xl text-neutral-900 font-medium tracking-wide">
                      Newborn New Arrivals
                    </h3>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 text-[9px] uppercase tracking-[0.2em] font-bold text-emerald-800 bg-white/95 px-2.5 py-1 rounded-full border border-emerald-200/80 shadow-2xs">
                  <Clock className="w-2.5 h-2.5" />
                  New Stock
                </span>
              </div>

              <p className="text-xs sm:text-[13px] text-neutral-600 font-light leading-relaxed mb-6">
                100% GOTS-certified organic cotton rompers, Japanese kimonos, breathable muslin swaddles, and luxury newborn welcome gift sets.
              </p>

              {/* Outfit Thumbnail Previews */}
              {newbornPreviews.length > 0 && (
                <div className="flex items-center gap-2.5 mb-6">
                  {newbornPreviews.map((p) => (
                    <div 
                      key={p.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onOpenLightbox) onOpenLightbox(p);
                        else handleCardClick('Newborn New Arrivals');
                      }}
                      className="w-14 h-18 rounded-lg overflow-hidden border border-white shadow-2xs relative bg-white group/thumb cursor-pointer"
                      title={p.title}
                    >
                      <img
                        src={p.imageUrl}
                        alt={p.title}
                        className="w-full h-full object-cover group-hover/thumb:scale-110 transition-transform duration-300"
                      />
                    </div>
                  ))}
                  <div className="text-[11px] text-emerald-800 font-light pl-1">
                    + more in stock
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Action Trigger */}
            <div className="pt-4 border-t border-emerald-200/50 flex items-center justify-between text-xs font-medium text-emerald-800 uppercase tracking-[0.16em]">
              <span>Shop Newborn New Stock</span>
              <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center group-hover:bg-emerald-800 group-hover:text-white transition-all duration-200 shadow-2xs">
                <ArrowRight className="w-3.5 h-3.5 stroke-[2]" />
              </div>
            </div>
          </div>

        </div>

        {/* Informative Shipping & COD Guarantee Ribbon */}
        <div className="mt-8 pt-6 border-t border-neutral-200/60 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 font-light gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-medium text-neutral-800">Fresh Stock Just Arrived:</span>
            <span>All items in-stock and ready for Immediate Dispatch across Pakistan with Cash on Delivery.</span>
          </div>
          <button
            type="button"
            onClick={() => handleCardClick('New Arrivals')}
            className="flex items-center gap-1 text-[11px] uppercase tracking-[0.18em] font-medium text-neutral-900 hover:underline cursor-pointer"
          >
            <span>View All New Drops</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </section>
  );
};
