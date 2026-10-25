import React from 'react';

interface CategoryItem {
  id: string;
  name: string;
  subtitle: string;
  categoryFilter: string;
  imageUrl: string;
}

const CATEGORIES: CategoryItem[] = [
  {
    id: 'bodysuits',
    name: 'Bodysuits',
    subtitle: 'Organic rompers & onesies',
    categoryFilter: 'Newborn Essentials',
    imageUrl: 'https://images.unsplash.com/photo-1522771930-78848d9293e8?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'sets',
    name: 'Sets',
    subtitle: 'Baba Suits & coordinated wear',
    categoryFilter: 'Boys Wear',
    imageUrl: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'blankets',
    name: 'Blankets',
    subtitle: 'Muslin swaddles & wraps',
    categoryFilter: 'Newborn',
    imageUrl: 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'diaper-bags',
    name: 'Diaper Bags',
    subtitle: 'Heirloom travel & accessories',
    categoryFilter: 'All',
    imageUrl: 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'frocks-dresses',
    name: 'Frocks & Dresses',
    subtitle: 'Twirl chiffons & festive lawn',
    categoryFilter: 'Girls Wear',
    imageUrl: 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=800&q=80',
  },
];

interface CategoryGridProps {
  onSelectCategory: (category: string) => void;
  title?: string;
  isDarkMode?: boolean;
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({ 
  onSelectCategory,
  title = 'Shop by category',
  isDarkMode = false,
}) => {
  const handleClick = (categoryFilter: string) => {
    onSelectCategory(categoryFilter);
    const el = document.getElementById('kids-products-section');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className={`w-full border-b py-12 sm:py-20 transition-colors duration-300 ${
      isDarkMode ? 'border-neutral-800' : 'border-neutral-200'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Quiet Section Title (Alaya Junior Aesthetic) */}
        <div className="text-center mb-8 sm:mb-12 space-y-1.5">
          <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.28em] font-light text-neutral-400">
            Curated Wardrobes
          </p>
          <h2 className={`font-serif text-2xl sm:text-3xl lg:text-4xl tracking-[0.04em] font-normal transition-colors ${
            isDarkMode ? 'text-white' : 'text-neutral-900'
          }`}>
            {title}
          </h2>
        </div>

        {/* 5-Column Horizontal Grid: Vertical rectangle cards with rounded corners (border-radius: 8px) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-5">
          {CATEGORIES.map((cat) => (
            <div
              key={cat.id}
              onClick={() => handleClick(cat.categoryFilter)}
              className="group cursor-pointer relative aspect-[3/4] overflow-hidden rounded-[8px] bg-neutral-100 shadow-xs hover:shadow-md transition-all duration-300"
            >
              {/* Background Photography with gentle hover zoom */}
              <img
                src={cat.imageUrl}
                alt={cat.name}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                loading="lazy"
              />

              {/* Gradient shadow to guarantee crisp typography contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent pointer-events-none" />

              {/* White typography overlay inside bottom-left corner with thin underline */}
              <div className="absolute bottom-4 left-4 right-4 z-10 text-left">
                <span className="font-serif text-base sm:text-lg lg:text-xl text-white font-medium tracking-wide inline-block border-b border-white/80 pb-0.5 group-hover:border-white transition-all">
                  {cat.name}
                </span>
                <p className="text-[10px] sm:text-[11px] text-white/80 font-light mt-0.5 leading-tight truncate">
                  {cat.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
