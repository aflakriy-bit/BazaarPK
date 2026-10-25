import React from 'react';
import { ArrowRight, Film } from 'lucide-react';

interface HeroBannerProps {
  onExploreReels: () => void;
  onExploreProducts: () => void;
  imageUrl?: string;
  videoUrl?: string;
  mediaType?: 'image' | 'video';
  containerHeight?: number;
  mediaScale?: number;
  focalPoint?: 'top' | 'center' | 'bottom' | 'left' | 'right';
  tagText?: string;
  headline?: string;
  subtitle?: string;
}

const DEFAULT_BANNER_IMAGE = 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=2000&q=85';
const DEFAULT_VIDEO_URL = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4';
const DEFAULT_TAG = 'Tiny ones, big firsts';
const DEFAULT_HEADLINE = 'Thoughtfully Made For Childhood Memories';
const DEFAULT_SUBTITLE = 'Hand-tailored festive Baba Suits, fairy-tale chiffon frocks, and organic newborn essentials. Crafted for delicate skin with breathable Pakistani cottons and fine silks.';

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onExploreReels,
  onExploreProducts,
  imageUrl,
  videoUrl,
  mediaType = 'image',
  containerHeight = 680,
  mediaScale = 100,
  focalPoint = 'center',
  tagText,
  headline,
  subtitle,
}) => {
  const activeImage = imageUrl?.trim() ? imageUrl.trim() : DEFAULT_BANNER_IMAGE;
  const activeVideo = videoUrl?.trim() ? videoUrl.trim() : DEFAULT_VIDEO_URL;
  const activeTag = tagText?.trim() ? tagText.trim() : DEFAULT_TAG;
  const activeHeadline = headline?.trim() ? headline.trim() : DEFAULT_HEADLINE;
  const activeSubtitle = subtitle?.trim() ? subtitle.trim() : DEFAULT_SUBTITLE;

  // Detect whether to render video
  const isVideo = mediaType === 'video' || 
    activeImage.endsWith('.mp4') || 
    activeImage.endsWith('.webm') || 
    activeImage.includes('video/');

  // Focal point alignment classes (Object-Position Alignment)
  const focalPointClassMap: Record<string, string> = {
    top: 'object-top',
    center: 'object-center',
    bottom: 'object-bottom',
    left: 'object-left',
    right: 'object-right',
  };
  const focalClass = focalPointClassMap[focalPoint] || 'object-center';

  // Media scale/zoom multiplier
  const scaleMultiplier = Math.max(1, (mediaScale || 100) / 100);

  return (
    <section 
      style={{ minHeight: `${containerHeight || 680}px` }}
      className="relative w-full overflow-hidden bg-neutral-900 text-white flex items-center justify-center transition-[min-height] duration-300 border-b border-neutral-200 dark:border-neutral-800"
    >
      {/* Background Media Slot (Photography or Autoplaying HTML5 Video) */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {isVideo ? (
          <video
            key={activeVideo}
            src={activeVideo}
            autoPlay
            loop
            muted
            playsInline
            className={`w-full h-full object-cover transition-transform duration-700 ease-out ${focalClass}`}
            style={{ transform: `scale(${scaleMultiplier})` }}
          />
        ) : (
          <img
            src={activeImage}
            alt="Bachpan PK Hero Banner"
            className={`w-full h-full object-cover transition-transform duration-700 ease-out ${focalClass}`}
            style={{ transform: `scale(${scaleMultiplier})` }}
            loading="eager"
            onError={(e) => {
              (e.target as HTMLImageElement).src = DEFAULT_BANNER_IMAGE;
            }}
          />
        )}

        {/* Soft luxury vignette overlay to ensure pristine typography legibility (Alaya Junior aesthetic) */}
        <div className="absolute inset-0 bg-neutral-950/45 via-neutral-950/30 to-neutral-950/65" />
      </div>

      {/* Centered Minimal Luxury Content (Alaya Junior Modern Pastel Style) */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-14 sm:py-18 lg:py-24 text-center flex flex-col items-center space-y-4 sm:space-y-6 lg:space-y-7 animate-fadeIn">
        
        {/* Dynamic Season Kicker */}
        <p className="text-[11px] sm:text-[13px] uppercase tracking-[0.28em] font-light text-neutral-200">
          {activeTag}
        </p>

        {/* Serif Headline with Generous Spacing */}
        <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-normal tracking-[0.03em] sm:tracking-[0.05em] text-white leading-[1.15] sm:leading-tight max-w-3xl whitespace-pre-line">
          {activeHeadline}
        </h1>

        {/* Minimal Understated Description */}
        <p className="text-xs sm:text-sm font-light text-neutral-200/90 max-w-xl leading-relaxed tracking-wide px-2 sm:px-0">
          {activeSubtitle}
        </p>

        {/* Primary & Secondary Call-to-Action Buttons (Alaya Junior Style) */}
        <div className="pt-3 sm:pt-5 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 w-full sm:w-auto max-w-sm sm:max-w-none">
          {/* Primary CTA in soft rose-pink / dusty-rose (#C89299) */}
          <button
            onClick={onExploreProducts}
            className="w-full sm:w-auto min-h-[46px] px-8 sm:px-10 py-3 sm:py-3.5 bg-[#C89299] hover:bg-[#B9838A] text-white transition-all duration-300 text-[11px] sm:text-xs uppercase tracking-[0.2em] font-medium cursor-pointer flex items-center justify-center gap-2 group shadow-sm active:scale-98 rounded-full"
          >
            <span>Shop New In</span>
            <ArrowRight className="w-3.5 h-3.5 stroke-[2] group-hover:translate-x-1 transition-transform" />
          </button>

          {/* Secondary Ghost Button for Best Sellers / Reels */}
          <button
            onClick={onExploreReels}
            className="w-full sm:w-auto min-h-[46px] px-8 sm:px-10 py-3 sm:py-3.5 bg-white/10 hover:bg-white/20 text-white border border-white/70 transition-all duration-300 text-[11px] sm:text-xs uppercase tracking-[0.2em] font-light cursor-pointer flex items-center justify-center gap-2 backdrop-blur-xs active:scale-98 rounded-full"
          >
            <Film className="w-3.5 h-3.5 stroke-[1.5]" />
            <span>Shop Best Sellers</span>
          </button>
        </div>

        {/* Minimal Quiet Footnote */}
        <div className="pt-4 sm:pt-6 border-t border-white/20 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[10px] uppercase tracking-[0.2em] text-neutral-300 font-light">
          <span>Nationwide COD</span>
          <span className="hidden sm:inline">·</span>
          <span>Open Parcel Check</span>
          <span className="hidden sm:inline">·</span>
          <span>Pure Gentle Cottons</span>
        </div>

      </div>
    </section>
  );
};
