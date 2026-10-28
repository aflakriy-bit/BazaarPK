import React from 'react';
import { ArrowUpRight } from 'lucide-react';

interface ExploreByAgeProps {
  onSelectAge: (ageLabel: string, categoryFallback: string) => void;
  title?: string;
  subtitle?: string;
  babyImage?: string;
  toddlerImage?: string;
  kidsImage?: string;
  isDarkMode?: boolean;
}

const DEFAULT_BABY = 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=900&q=85';
const DEFAULT_TODDLER = 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=900&q=85';
const DEFAULT_KIDS = 'https://images.unsplash.com/photo-1543332164-6e82f355badc?auto=format&fit=crop&w=900&q=85';

export const ExploreByAgeSection: React.FC<ExploreByAgeProps> = ({
  onSelectAge,
  title = 'Explore By Age',
  subtitle = 'Curated silhouettes engineered specifically for every developmental milestone',
  babyImage,
  toddlerImage,
  kidsImage,
  isDarkMode = false,
}) => {
  const cards = [
    {
      id: 'baby',
      range: '0 - 24M',
      title: 'Baby & Newborn',
      description: 'Ribbed onesies, kimono wraps & butter-soft organic swaddles',
      category: 'Newborn',
      imageUrl: babyImage?.trim() || DEFAULT_BABY,
      count: '24 Outfits',
    },
    {
      id: 'toddler',
      range: '2 - 4Y',
      title: 'Toddler Play',
      description: 'Festive Baba Suits, playtime co-ords & breezy linen sets',
      category: 'Toddler Outfits',
      imageUrl: toddlerImage?.trim() || DEFAULT_TODDLER,
      count: '38 Outfits',
    },
    {
      id: 'kids',
      range: '5 - 8Y',
      title: 'Kids Festive & Casual',
      description: 'Embroidered kurtas, jacquard waistcoats & fairy-tale frocks',
      category: 'Boys Wear',
      imageUrl: kidsImage?.trim() || DEFAULT_KIDS,
      count: '46 Outfits',
    },
  ];

  return (
    <section className={`py-16 sm:py-24 border-b transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-[#121214] text-white border-neutral-800' 
        : 'bg-[#FDFBF7] text-neutral-900 border-neutral-200'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with Minimalist Typography */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.28em] font-light text-neutral-400 dark:text-neutral-500 mb-2">
            The Atelier Collections
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight">
            {title}
          </h2>
          <p className="text-xs sm:text-sm font-light text-neutral-500 dark:text-neutral-400 mt-3 leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* Spacious 3-Column Layout with Clean Borderless Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10 lg:gap-12">
          {cards.map((card) => (
            <div
              key={card.id}
              onClick={() => onSelectAge(card.range, card.category)}
              className="group cursor-pointer flex flex-col"
            >
              {/* Tall Vertical Rectangle Image Container */}
              <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl sm:rounded-3xl bg-neutral-100 dark:bg-neutral-900 shadow-sm border border-neutral-200/60 dark:border-neutral-800/60 transition-all duration-500 group-hover:shadow-xl">
                <img
                  src={card.imageUrl}
                  alt={card.title}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                  loading="lazy"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    if (card.id === 'baby') target.src = DEFAULT_BABY;
                    else if (card.id === 'toddler') target.src = DEFAULT_TODDLER;
                    else target.src = DEFAULT_KIDS;
                  }}
                />
                
                {/* Subtle soft vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                {/* Age Range Badge Pill on Top Left */}
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full text-[10px] uppercase tracking-widest font-medium bg-white/90 text-neutral-900 dark:bg-black/80 dark:text-white backdrop-blur-xs shadow-xs">
                    {card.range}
                  </span>
                </div>

                {/* Circular Action Button with Diagonal Arrow (↗) at Bottom Right */}
                <div className="absolute bottom-5 right-5 z-10">
                  <div className="w-12 h-12 rounded-full border border-neutral-200 dark:border-neutral-700 bg-white/95 text-neutral-900 dark:bg-neutral-900/90 dark:text-white shadow-md flex items-center justify-center transition-all duration-300 group-hover:bg-[#C89299] group-hover:text-white group-hover:border-[#C89299] group-hover:scale-110">
                    <ArrowUpRight className="w-5 h-5 stroke-[1.8] group-hover:rotate-45 transition-transform duration-300" />
                  </div>
                </div>

                {/* Bottom Left Information on Image */}
                <div className="absolute bottom-5 left-5 right-20 text-white">
                  <h3 className="font-serif text-xl sm:text-2xl font-normal drop-shadow-xs">
                    {card.title}
                  </h3>
                  <p className="text-[11px] text-white/80 line-clamp-1 mt-0.5 font-light">
                    {card.count}
                  </p>
                </div>
              </div>

              {/* Text Description Below Card */}
              <div className="pt-3 px-1">
                <p className="text-xs font-light text-neutral-500 dark:text-neutral-400 leading-relaxed">
                  {card.description}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
