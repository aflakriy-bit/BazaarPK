import React, { useState } from 'react';
import { Film, Ruler, Star, Check } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onOpenLightbox: (product: Product) => void;
  onOpenReel?: (product: Product) => void;
  onAddToCart?: (product: Product, size?: string) => void;
  onQuickBuy?: (product: Product, size?: string) => void;
  onOpenSizeGuide?: (product: Product) => void;
  isDarkMode?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onOpenLightbox,
  onOpenReel,
  onAddToCart,
  onOpenSizeGuide,
  isDarkMode = false,
}) => {
  const [recentlyAddedSize, setRecentlyAddedSize] = useState<string | null>(null);

  // Default standard Pakistani kids sizes if not specified
  const displaySizes = (product.sizes && product.sizes.length > 0)
    ? product.sizes.slice(0, 5)
    : ['NB', '6M', '1-2Y', '3-4Y'];

  const handleSizeClick = (e: React.MouseEvent, size: string) => {
    e.stopPropagation();
    if (onAddToCart) {
      onAddToCart(product, size);
      setRecentlyAddedSize(size);
      setTimeout(() => setRecentlyAddedSize(null), 1500);
    }
  };

  // Calculate strike-through original price (Alaya Junior discount pricing style)
  const regularPrice = product.originalPrice && product.originalPrice > product.price
    ? product.originalPrice
    : Math.round((product.price * 1.35) / 50) * 50;

  return (
    <div 
      onClick={() => onOpenLightbox(product)}
      className="group cursor-pointer flex flex-col transition-all duration-300 select-none"
    >
      {/* 1. Rounded-corner Product Image (border-radius: 8px) with Aspect Ratio & Hover Zoom */}
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[8px] bg-[#F7F7F6] shadow-2xs">
        <img
          src={product.imageUrl}
          alt={product.title}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1522771930-78848d9293e8?auto=format&fit=crop&w=800&q=80';
          }}
        />

        {/* Size Guide Trigger */}
        {onOpenSizeGuide && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpenSizeGuide(product);
            }}
            className="absolute top-2.5 left-2.5 z-10 bg-white/90 hover:bg-neutral-900 hover:text-white text-neutral-700 px-2.5 py-1 text-[10px] uppercase tracking-wider font-light flex items-center gap-1 shadow-xs backdrop-blur-xs transition-all duration-300 cursor-pointer border border-neutral-200/80 rounded-full"
            title="Open Size Chart & Guide"
            aria-label="Open Size Guide"
          >
            <Ruler className="w-3 h-3 stroke-[1.5]" />
            <span className="hidden sm:inline">Size Chart</span>
          </button>
        )}

        {/* 9:16 Video Reel Indicator */}
        {product.videoUrl && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (onOpenReel) onOpenReel(product);
              else onOpenLightbox(product);
            }}
            className="absolute top-2.5 right-2.5 z-10 bg-white/90 hover:bg-black hover:text-white text-neutral-800 p-1.5 sm:p-2 rounded-full shadow-xs backdrop-blur-xs transition-all duration-300 cursor-pointer"
            title="Watch 9:16 Video Reel"
            aria-label="Watch Video Reel"
          >
            <Film className="w-3.5 h-3.5 stroke-[1.5]" />
          </button>
        )}

        {/* Low Stock Badge */}
        {product.stock <= 5 && product.stock > 0 && (
          <div className="absolute bottom-2.5 left-2.5 bg-white/95 text-neutral-800 text-[10px] tracking-wider uppercase px-2 py-0.5 shadow-xs font-light rounded-sm">
            Low Stock · {product.stock} Left
          </div>
        )}

        {/* Hover Quick View Overlay */}
        <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/50 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <span className="text-[10px] uppercase tracking-[0.2em] font-light text-white bg-black/60 px-3 py-1 backdrop-blur-xs rounded-full">
            Quick Details & Reviews
          </span>
        </div>
      </div>

      {/* 2. Slim Font Title & Prominent Discount Price Strip (Alaya Junior Style) */}
      <div className="pt-3 pb-1 text-center space-y-1 font-sans">
        
        {/* Title in slim font */}
        <h4 className={`font-sans text-[13px] sm:text-[14px] font-light tracking-wide transition-colors truncate px-1 ${
          isDarkMode ? 'text-neutral-200 group-hover:text-white' : 'text-neutral-800 group-hover:text-black'
        }`}>
          {product.title}
        </h4>

        {/* Quick Size Variant Pills */}
        {onAddToCart && (
          <div className="pt-0.5 pb-0.5">
            <div className="flex items-center justify-center gap-1 flex-wrap">
              {displaySizes.map((size) => {
                const isAdded = recentlyAddedSize === size;
                return (
                  <button
                    key={size}
                    type="button"
                    onClick={(e) => handleSizeClick(e, size)}
                    className={`px-2 py-0.5 text-[9px] sm:text-[10px] tracking-wider uppercase border transition-all cursor-pointer rounded-full ${
                      isAdded
                        ? 'bg-[#C89299] text-white border-[#C89299] scale-105 shadow-2xs font-medium'
                        : (isDarkMode 
                            ? 'bg-neutral-800 hover:bg-[#C89299] hover:text-white border-neutral-700 text-neutral-300' 
                            : 'bg-white hover:bg-[#C89299] hover:text-white border-neutral-200 hover:border-[#C89299] text-neutral-600')
                    }`}
                    title={`Instant Add Size ${size} to Bag`}
                  >
                    {isAdded ? (
                      <span className="flex items-center gap-1 text-white font-medium">
                        {size} <Check className="w-2.5 h-2.5 text-white stroke-[2.5]" />
                      </span>
                    ) : (
                      size
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Price Strip: Current price in bold dark charcoal & original price crossed out in light grey */}
        <div className="flex items-center justify-center gap-2 pt-0.5">
          <span className={`font-serif text-base sm:text-lg font-bold tracking-wide transition-colors ${
            isDarkMode ? 'text-white' : 'text-neutral-900'
          }`}>
            Rs. {product.price.toLocaleString()} PKR
          </span>
          <span className={`text-xs sm:text-[13px] font-light line-through ${
            isDarkMode ? 'text-neutral-500' : 'text-neutral-400'
          }`}>
            Rs. {regularPrice.toLocaleString()} PKR
          </span>
        </div>

        {/* Aggregate Star Rating */}
        {(product.rating !== undefined || (product.reviewCount && product.reviewCount > 0)) && (
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-neutral-400 font-light">
            <div className="flex items-center text-amber-500">
              <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
            </div>
            <span>
              {product.rating ? product.rating.toFixed(1) : '5.0'} ({product.reviewCount || 12})
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
