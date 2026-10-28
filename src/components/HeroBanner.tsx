import React from 'react';
import { ArrowRight, ArrowUpRight, Film, Sparkles, Check } from 'lucide-react';

interface HeroBannerProps {
  onExploreReels: () => void;
  onExploreProducts: () => void;
  layoutType?: 'triple_split' | 'single';
  imageUrl?: string;
  videoUrl?: string;
  mediaType?: 'image' | 'video';
  containerHeight?: number;
  mediaScale?: number;
  focalPoint?: 'top' | 'center' | 'bottom' | 'left' | 'right';
  tagText?: string;
  headline?: string;
  subtitle?: string;

  // Wix Juniper Romp Triple-Split Hero Props
  column1Image?: string;
  column2Image?: string;
  column3Image?: string;
  floatingKicker?: string;
  floatingTitle?: string;
  floatingSubtitle?: string;
  floatingCtaText?: string;
  floatingTagline?: string;
  isDarkMode?: boolean;
}

const DEFAULT_BANNER_IMAGE = 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=2000&q=85';
const DEFAULT_VIDEO_URL = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4';

const DEFAULT_COL1 = 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=900&q=85';
const DEFAULT_COL2 = 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=900&q=85';
const DEFAULT_COL3 = 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=900&q=85';

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onExploreReels,
  onExploreProducts,
  layoutType = 'triple_split',
  imageUrl,
  videoUrl,
  mediaType = 'image',
  containerHeight = 740,
  mediaScale = 100,
  focalPoint = 'center',
  tagText = 'Tiny ones, big firsts',
  headline = 'Thoughtfully Made For Childhood Memories',
  subtitle = 'Hand-tailored festive Baba Suits, fairy-tale chiffon frocks, and organic newborn essentials.',
  column1Image,
  column2Image,
  column3Image,
  floatingKicker = 'BACHPAN PK · ATELIER',
  floatingTitle = 'Made For Pure Play',
  floatingSubtitle = 'Effortless, organic kids essentials thoughtfully crafted for every crawl, step, and joyful jump.',
  floatingCtaText = 'Shop All Products',
  floatingTagline = '100% Breathable Cottons · Nationwide Cash on Delivery',
  isDarkMode = false,
}) => {
  const activeCol1 = column1Image?.trim() || DEFAULT_COL1;
  const activeCol2 = column2Image?.trim() || DEFAULT_COL2;
  const activeCol3 = column3Image?.trim() || DEFAULT_COL3;

  // Single mode fallback
  if (layoutType === 'single') {
    const activeImage = imageUrl?.trim() ? imageUrl.trim() : DEFAULT_BANNER_IMAGE;
    const activeVideo = videoUrl?.trim() ? videoUrl.trim() : DEFAULT_VIDEO_URL;
    const isVideo = mediaType === 'video' || activeImage.endsWith('.mp4');
    const scaleMultiplier = Math.max(1, (mediaScale || 100) / 100);

    return (
      <section 
        style={{ minHeight: `${containerHeight || 680}px` }}
        className="relative w-full overflow-hidden bg-neutral-900 text-white flex items-center justify-center border-b border-neutral-200 dark:border-neutral-800"
      >
        <div className="absolute inset-0 z-0 overflow-hidden">
          {isVideo ? (
            <video
              src={activeVideo}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
              style={{ transform: `scale(${scaleMultiplier})` }}
            />
          ) : (
            <img
              src={activeImage}
              alt="Bachpan PK Hero"
              className="w-full h-full object-cover"
              style={{ transform: `scale(${scaleMultiplier})` }}
            />
          )}
          <div className="absolute inset-0 bg-neutral-950/45 via-neutral-950/30 to-neutral-950/65" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 py-16 text-center flex flex-col items-center space-y-6">
          <p className="text-xs uppercase tracking-[0.28em] font-light text-neutral-200">{tagText}</p>
          <h1 className="font-serif text-4xl sm:text-6xl text-white font-normal">{headline}</h1>
          <p className="text-sm font-light text-neutral-200/90 max-w-xl">{subtitle}</p>
          <button
            onClick={onExploreProducts}
            className="px-8 py-3.5 bg-neutral-950 hover:bg-neutral-800 text-white rounded-full text-xs uppercase tracking-widest font-medium cursor-pointer shadow-lg"
          >
            {floatingCtaText}
          </button>
        </div>
      </section>
    );
  }

  // WIX "JUNIPER ROMP" TRIPLE-SPLIT VERTICAL HERO SECTION (IMAGE 1)
  return (
    <section 
      className="relative w-full overflow-hidden bg-neutral-100 dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800"
      style={{ minHeight: 'calc(100vh - 80px)', height: 'clamp(620px, 92vh, 880px)' }}
    >
      {/* 3-Column Vertical Grid Layout taking full viewport height */}
      <div className="grid grid-cols-1 md:grid-cols-3 w-full h-full divide-y md:divide-y-0 md:divide-x divide-white/20 dark:divide-neutral-900">
        
        {/* Column 1: Newborn / Rompers */}
        <div className="relative group overflow-hidden h-[40vh] md:h-full bg-neutral-200 dark:bg-neutral-900">
          <img
            src={activeCol1}
            alt="Bachpan PK Baby Atelier"
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-1000 ease-out"
            loading="eager"
            onError={(e) => { (e.target as HTMLImageElement).src = DEFAULT_COL1; }}
          />
          <div className="absolute inset-0 bg-black/15 group-hover:bg-black/5 transition-colors duration-500" />
          <div className="absolute bottom-6 left-6 text-white/90 hidden md:block">
            <span className="text-[10px] uppercase tracking-[0.25em] font-light drop-shadow-xs">Organic Knitwear · 0-24M</span>
          </div>
        </div>

        {/* Column 2: Toddler / Everyday Active Play */}
        <div className="relative group overflow-hidden h-[40vh] md:h-full bg-neutral-200 dark:bg-neutral-900">
          <img
            src={activeCol2}
            alt="Bachpan PK Toddler Play"
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-1000 ease-out"
            loading="eager"
            onError={(e) => { (e.target as HTMLImageElement).src = DEFAULT_COL2; }}
          />
          <div className="absolute inset-0 bg-black/15 group-hover:bg-black/5 transition-colors duration-500" />
          <div className="absolute bottom-6 left-6 text-white/90 hidden md:block">
            <span className="text-[10px] uppercase tracking-[0.25em] font-light drop-shadow-xs">Play-Proof Sets · 2-4Y</span>
          </div>
        </div>

        {/* Column 3: Kids / Celebratory Festive Outfits */}
        <div className="relative group overflow-hidden h-[40vh] md:h-full bg-neutral-200 dark:bg-neutral-900">
          <img
            src={activeCol3}
            alt="Bachpan PK Kids Outfits"
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-1000 ease-out"
            loading="eager"
            onError={(e) => { (e.target as HTMLImageElement).src = DEFAULT_COL3; }}
          />
          <div className="absolute inset-0 bg-black/15 group-hover:bg-black/5 transition-colors duration-500" />
          <div className="absolute bottom-6 left-6 text-white/90 hidden md:block">
            <span className="text-[10px] uppercase tracking-[0.25em] font-light drop-shadow-xs">Festive Suits & Frocks · 5-8Y</span>
          </div>
        </div>

      </div>

      {/* Floating White Minimalist Card with Thick Rounded Corners (Left-Center) */}
      <div className="absolute inset-x-4 sm:inset-x-8 md:inset-x-auto md:left-10 lg:left-16 xl:left-24 top-1/2 -translate-y-1/2 z-20 pointer-events-none">
        <div 
          className={`pointer-events-auto max-w-md lg:max-w-lg p-7 sm:p-9 lg:p-11 rounded-[28px] sm:rounded-[36px] transition-all duration-300 ${
            isDarkMode 
              ? 'bg-[#18181b]/95 text-white shadow-2xl border border-neutral-800/80 backdrop-blur-md' 
              : 'bg-white/95 text-neutral-900 shadow-[0_20px_50px_rgba(0,0,0,0.12)] border border-neutral-100 backdrop-blur-md'
          }`}
        >
          {/* Brand Kicker */}
          <div className="flex items-center gap-2 mb-3 sm:mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C89299]" />
            <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.28em] font-light text-neutral-500 dark:text-neutral-400">
              {floatingKicker}
            </p>
          </div>

          {/* Stately Serif Headline */}
          <h1 className={`font-serif text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight leading-[1.1] mb-3 sm:mb-4 ${
            isDarkMode ? 'text-white' : 'text-neutral-950'
          }`}>
            {floatingTitle}
          </h1>

          {/* Minimalist Descriptive Text */}
          <p className="text-xs sm:text-sm font-light text-neutral-600 dark:text-neutral-300 leading-relaxed tracking-wide mb-6 sm:mb-7">
            {floatingSubtitle}
          </p>

          {/* Clean Pill-Shaped Black CTA Button */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              onClick={onExploreProducts}
              className={`min-h-[48px] px-8 py-3.5 rounded-full text-xs uppercase tracking-[0.2em] font-medium transition-all duration-300 cursor-pointer flex items-center justify-center gap-2.5 shadow-md active:scale-98 group ${
                isDarkMode 
                  ? 'bg-white hover:bg-neutral-200 text-neutral-950 font-semibold' 
                  : 'bg-neutral-950 hover:bg-neutral-800 text-white'
              }`}
            >
              <span>{floatingCtaText}</span>
              <ArrowRight className="w-4 h-4 stroke-[1.8] group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={onExploreReels}
              className={`min-h-[44px] px-5 py-2.5 rounded-full text-xs tracking-wider transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 ${
                isDarkMode
                  ? 'text-neutral-300 hover:text-white hover:bg-neutral-800/60'
                  : 'text-neutral-700 hover:text-neutral-950 hover:bg-neutral-100'
              }`}
            >
              <Film className="w-3.5 h-3.5 text-[#C89299]" />
              <span className="text-[11px] font-light">Watch Reels</span>
            </button>
          </div>

          {/* Subtle Trust line inside card */}
          {floatingTagline && (
            <div className="mt-6 pt-4 border-t border-neutral-200/70 dark:border-neutral-800/80 flex items-center gap-2 text-[10px] text-neutral-500 dark:text-neutral-400 font-light">
              <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>{floatingTagline}</span>
            </div>
          )}
        </div>
      </div>

    </section>
  );
};
