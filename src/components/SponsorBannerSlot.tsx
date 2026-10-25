import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

interface SponsorBannerSlotProps {
  badge?: string;
  title?: string;
  subtitle?: string;
  ctaText?: string;
  link?: string;
  imageUrl?: string;
  isDarkMode?: boolean;
}

export const SponsorBannerSlot: React.FC<SponsorBannerSlotProps> = ({
  badge = 'Partner Atelier Selection',
  title = 'Handcrafted Silver Keepsakes & Heirloom Rattles',
  subtitle = 'Certified 925 sterling silver gifts, pacifier clips, and baby bangles presented in royal silk gift boxes. The quintessential newborn heirloom.',
  ctaText = 'Explore Partner Collection',
  link = '#kids-products-section',
  imageUrl = 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=1200&q=80',
  isDarkMode = false,
}) => {
  const handleClick = (e: React.MouseEvent) => {
    if (link.startsWith('#')) {
      e.preventDefault();
      const target = document.querySelector(link);
      target?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className={`w-full border-b py-12 sm:py-16 transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-[#161619] border-neutral-800 text-white' 
        : 'bg-[#FAF8F5] border-neutral-200 text-neutral-900'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`relative overflow-hidden rounded-sm border p-6 sm:p-10 md:p-12 transition-all ${
          isDarkMode 
            ? 'bg-[#1b1b1f] border-neutral-800' 
            : 'bg-white border-neutral-200/90 shadow-2xs'
        }`}>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            
            {/* Left Content */}
            <div className="md:col-span-7 space-y-4 text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 text-[9px] uppercase tracking-[0.25em] font-medium border rounded-full bg-transparent text-[#C89299] border-[#C89299]/30">
                <Sparkles className="w-3 h-3 text-[#C89299]" />
                <span>{badge}</span>
              </div>

              <h3 className={`font-serif text-2xl sm:text-3xl lg:text-4xl font-normal tracking-wide leading-tight ${
                isDarkMode ? 'text-white' : 'text-neutral-900'
              }`}>
                {title}
              </h3>

              <p className={`text-xs sm:text-sm font-light leading-relaxed max-w-xl ${
                isDarkMode ? 'text-neutral-300' : 'text-neutral-600'
              }`}>
                {subtitle}
              </p>

              <div className="pt-2">
                <a
                  href={link}
                  onClick={handleClick}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#C89299] hover:bg-[#B9838A] text-white text-xs uppercase tracking-[0.18em] font-medium transition-all shadow-xs cursor-pointer group rounded-full"
                >
                  <span>{ctaText}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </a>
              </div>
            </div>

            {/* Right Media Preview */}
            <div className="md:col-span-5 relative">
              <div className="relative aspect-[16/10] sm:aspect-[4/3] overflow-hidden rounded-xs bg-neutral-100 group">
                <img
                  src={imageUrl}
                  alt={title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                <span className="absolute bottom-2.5 right-2.5 text-[9px] uppercase tracking-wider text-white/90 bg-black/60 backdrop-blur-xs px-2 py-0.5 rounded-2xs font-mono">
                  Sponsor Showcase
                </span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};
