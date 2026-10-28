import React from 'react';
import { Eye, ArrowUpRight, Sparkles, Heart } from 'lucide-react';
import { Product } from '../types';

interface ParentFavoritesCollageProps {
  products: Product[];
  onOpenProduct: (product: Product) => void;
  title?: string;
  subtitle?: string;
  hero1Url?: string;
  hero1Title?: string;
  hero2Url?: string;
  hero2Title?: string;
  isDarkMode?: boolean;
}

const DEFAULT_HERO1 = 'https://images.unsplash.com/photo-1471286174890-9c112ffca56a?auto=format&fit=crop&w=1200&q=85';
const DEFAULT_HERO2 = 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=1000&q=85';

export const ParentFavoritesCollage: React.FC<ParentFavoritesCollageProps> = ({
  products,
  onOpenProduct,
  title = 'Loved Right Now',
  subtitle = 'Parent favorites curated for everyday joy and celebratory family moments',
  hero1Url,
  hero1Title = 'Everyday Wonder · Engineered for free, joyful movement',
  hero2Url,
  hero2Title = 'Festive Jacquards & Heirloom Embroidered Silks',
  isDarkMode = false,
}) => {
  const activeHero1 = hero1Url?.trim() || DEFAULT_HERO1;
  const activeHero2 = hero2Url?.trim() || DEFAULT_HERO2;

  // Pick 4 curated favorites from products array
  const favoriteItems = products.slice(0, 4);

  return (
    <section className={`py-20 sm:py-28 border-b transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-[#121214] text-white border-neutral-800' 
        : 'bg-[#FDFBF7] text-neutral-900 border-neutral-200'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row items-baseline justify-between mb-12 sm:mb-16 pb-4 border-b border-neutral-200/80 dark:border-neutral-800 gap-4">
          <div>
            <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.28em] font-light text-[#C89299]">
              Editorial Gallery
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight mt-1">
              {title}
            </h2>
          </div>
          <p className="text-xs sm:text-sm font-light text-neutral-500 dark:text-neutral-400 max-w-md">
            {subtitle}
          </p>
        </div>

        {/* ASYMMETRIC PHOTOGRAPHY COLLAGE GRID */}
        <div className="space-y-8 sm:space-y-12">
          
          {/* TOP ROW: Two Large Editorial Image Slots (Asymmetric 7-column / 5-column split) */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8">
            
            {/* Slot 1: Wide Lifestyle Feature (col-span-7) */}
            <div className="md:col-span-7 relative group overflow-hidden rounded-[28px] sm:rounded-[36px] bg-neutral-200 dark:bg-neutral-900 aspect-[16/10] border border-neutral-200/80 dark:border-neutral-800 shadow-md">
              <img
                src={activeHero1}
                alt="Parent Favorites Lifestyle"
                className="w-full h-full object-cover object-center group-hover:scale-104 transition-transform duration-1000 ease-out"
                loading="lazy"
                onError={(e) => { (e.target as HTMLImageElement).src = DEFAULT_HERO1; }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              
              <div className="absolute top-6 left-6">
                <span className="px-3.5 py-1 rounded-full text-[10px] uppercase tracking-widest font-semibold bg-white/90 text-neutral-950 backdrop-blur-xs">
                  Atelier Editorial
                </span>
              </div>

              <div className="absolute bottom-6 sm:bottom-8 left-6 sm:left-8 right-6 text-white">
                <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-normal leading-tight">
                  {hero1Title}
                </h3>
                <p className="text-xs sm:text-sm font-light text-white/80 mt-2 max-w-lg">
                  Soft breathable natural fabrics that endure endless sandbox adventures, tea parties, and afternoon naps.
                </p>
              </div>
            </div>

            {/* Slot 2: Editorial Square Detail Feature (col-span-5) */}
            <div className="md:col-span-5 relative group overflow-hidden rounded-[28px] sm:rounded-[36px] bg-neutral-200 dark:bg-neutral-900 aspect-[16/10] md:aspect-auto border border-neutral-200/80 dark:border-neutral-800 shadow-md">
              <img
                src={activeHero2}
                alt="Signature Weaves"
                className="w-full h-full object-cover object-center group-hover:scale-104 transition-transform duration-1000 ease-out"
                loading="lazy"
                onError={(e) => { (e.target as HTMLImageElement).src = DEFAULT_HERO2; }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

              <div className="absolute top-6 left-6">
                <span className="px-3.5 py-1 rounded-full text-[10px] uppercase tracking-widest font-semibold bg-white/90 text-neutral-950 backdrop-blur-xs">
                  Artisanal Craft
                </span>
              </div>

              <div className="absolute bottom-6 sm:bottom-8 left-6 sm:left-8 right-6 text-white">
                <h3 className="font-serif text-2xl sm:text-3xl font-normal leading-tight">
                  {hero2Title}
                </h3>
                <p className="text-xs sm:text-sm font-light text-white/80 mt-2">
                  Hand-tailored by master artisans in Lahore with brass buttons and pure lawn linings.
                </p>
              </div>
            </div>

          </div>

          {/* BOTTOM ROW: Cluster of Smaller Artistic Clothing Preview Grids with generous white space */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-xs uppercase tracking-[0.2em] font-medium text-neutral-500 dark:text-neutral-400">
                Trending Right Now · Quick Add
              </h4>
              <span className="text-[11px] text-neutral-400 font-light">
                Click any piece to inspect fabric & sizes
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-5 sm:gap-6 lg:gap-8">
              {favoriteItems.map((prod) => (
                <div
                  key={prod.id}
                  onClick={() => onOpenProduct(prod)}
                  className="group cursor-pointer flex flex-col"
                >
                  {/* Studio Image Frame */}
                  <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800/80 transition-all duration-300 group-hover:shadow-lg">
                    <img
                      src={prod.imageUrl}
                      alt={prod.title}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                      loading="lazy"
                    />

                    {/* Quick eye icon on hover */}
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-8 h-8 rounded-full bg-white/90 dark:bg-black/90 text-neutral-900 dark:text-white shadow-sm flex items-center justify-center">
                        <Eye className="w-3.5 h-3.5" />
                      </div>
                    </div>

                    {/* Category tag */}
                    <div className="absolute bottom-3 left-3">
                      <span className="text-[9px] uppercase tracking-wider font-medium px-2 py-0.5 rounded-full bg-white/90 dark:bg-neutral-950/90 text-neutral-800 dark:text-neutral-200 backdrop-blur-xs">
                        {prod.category}
                      </span>
                    </div>
                  </div>

                  {/* Garment Details */}
                  <div className="pt-2.5 px-0.5">
                    <h5 className="font-serif text-sm sm:text-base font-normal text-neutral-900 dark:text-white truncate group-hover:text-[#C89299] transition-colors">
                      {prod.title}
                    </h5>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                        Rs. {prod.price.toLocaleString()}
                      </span>
                      <span className="text-[10px] text-neutral-400 group-hover:text-[#C89299] flex items-center gap-0.5">
                        <span>Sizes</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
