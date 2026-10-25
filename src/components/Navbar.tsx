import React, { useState, useRef, useEffect } from 'react';
import { 
  ShoppingBag, 
  Search, 
  Film, 
  X, 
  Menu, 
  ChevronDown,
  MessageCircle, 
  ArrowRight,
  Truck,
  Sparkles
} from 'lucide-react';
import { CartItem } from '../types';

interface NavbarProps {
  cart: CartItem[];
  onOpenCart: () => void;
  onOpenReels: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  categories: string[];
  showCategoryFilter?: boolean;
  onOpenAbout?: () => void;
  whatsappNumber?: string;
  onOpenTracking?: () => void;
  selectedAgeGroup?: string;
  onSelectAgeGroup?: (age: string) => void;
  brandLogoText?: string;
  brandTagline?: string;
  isDarkMode?: boolean;
}

interface MegaMenuCategory {
  id: string;
  label: string;
  hasDropdown: boolean;
  targetCategory?: string;
  columns?: {
    shopByCategory: { label: string; query?: string; category?: string }[];
    collections: { label: string; query?: string; category?: string }[];
    accessories: { label: string; query?: string; category?: string }[];
  };
  featured?: {
    title: string;
    subtitle: string;
    image: string;
    linkText: string;
    category: string;
  };
}

const MENU_ITEMS: MegaMenuCategory[] = [
  {
    id: 'new-arrivals',
    label: 'New Arrivals',
    hasDropdown: true,
    targetCategory: 'New Arrivals',
    columns: {
      shopByCategory: [
        { label: 'Boys New Arrivals', category: 'Boys New Arrivals' },
        { label: 'Girls New Arrivals', category: 'Girls New Arrivals' },
        { label: 'Newborn New Arrivals', category: 'Newborn New Arrivals' },
        { label: 'All Spring / Summer 2026 Drops', category: 'New Arrivals' },
      ],
      collections: [
        { label: 'Eid Festive Fresh Stock', category: 'All' },
        { label: 'Hand-Finished Waistcoats', category: 'Boys Wear' },
        { label: 'Twirl Party Frocks', category: 'Girls Wear' },
        { label: 'Organic Baby Rompers', category: 'Newborn Essentials' },
      ],
      accessories: [
        { label: 'Soft Sole Khussas', category: 'All' },
        { label: 'Muslin Swaddles', category: 'Newborn Essentials' },
        { label: 'Satin Bows & Clips', category: 'Girls Wear' },
      ],
    },
    featured: {
      title: 'New Arrivals 2026',
      subtitle: 'Just In: Hand-finished boutique drops',
      image: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=700&q=80',
      linkText: 'Explore New In',
      category: 'New Arrivals',
    },
  },
  {
    id: 'edits',
    label: 'Edits',
    hasDropdown: true,
    targetCategory: 'All',
    columns: {
      shopByCategory: [
        { label: 'The Eid Festive Edit', category: 'All' },
        { label: 'Summer Lawn & Cottons', category: 'All' },
        { label: 'Newborn Welcome Sets', category: 'Newborn Essentials' },
        { label: 'Ceremony & Wedding Wear', category: 'Boys Wear' },
      ],
      collections: [
        { label: 'Pure Cashmere Touch', category: 'All' },
        { label: 'Organic Handspun Cottons', category: 'All' },
        { label: 'Silk Embroideries', category: 'Girls Wear' },
        { label: 'Classic Linen Suiting', category: 'Boys Wear' },
      ],
      accessories: [
        { label: 'Hand-stitched Booties', category: 'Newborn Essentials' },
        { label: 'Bonnet Caps & Bibs', category: 'Newborn Essentials' },
        { label: 'Gota Trimming Dupattas', category: 'Girls Wear' },
        { label: 'Pure Cotton Swaddles', category: 'Newborn Essentials' },
      ],
    },
    featured: {
      title: 'Spring / Summer 2026',
      subtitle: 'Hand-tailored for childhood moments',
      image: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=700&q=80',
      linkText: 'Explore The Edit',
      category: 'All',
    },
  },
  {
    id: 'baby-girl',
    label: 'Baby Girl',
    hasDropdown: true,
    targetCategory: 'Baby Girl',
    columns: {
      shopByCategory: [
        { label: 'Pastel Party Frocks', category: 'Baby Girl' },
        { label: 'Cotton-Lawn Ruffled Sets', category: 'Baby Girl' },
        { label: 'Bloomers & Day Dresses', category: 'Baby Girl' },
        { label: 'Fine Knit Cardigans', category: 'Baby Girl' },
      ],
      collections: [
        { label: 'Rosewater & Ivory Palette', category: 'Baby Girl' },
        { label: 'Vintage Gota Lace Edition', category: 'Baby Girl' },
        { label: 'First Birthday Outfits', category: 'Baby Girl' },
      ],
      accessories: [
        { label: 'Soft Satin Bows & Headbands', category: 'Baby Girl' },
        { label: 'Ribbed Cotton Tights', category: 'Baby Girl' },
        { label: 'Delicate Embroidered Shoes', category: 'Baby Girl' },
      ],
    },
    featured: {
      title: 'Baby Girl Collection',
      subtitle: 'Gentle, tag-free soft chiffons & lawn',
      image: 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=700&q=80',
      linkText: 'View Collection',
      category: 'Baby Girl',
    },
  },
  {
    id: 'baby-boy',
    label: 'Baby Boy',
    hasDropdown: true,
    targetCategory: 'Baby Boy',
    columns: {
      shopByCategory: [
        { label: 'Mini Baba Suits & Kurtas', category: 'Baby Boy' },
        { label: 'Detachable Jacquard Waistcoats', category: 'Baby Boy' },
        { label: 'Linen Button-down Rompers', category: 'Baby Boy' },
        { label: 'Playtime Dungaree Sets', category: 'Baby Boy' },
      ],
      collections: [
        { label: 'Royal Cream & Slate Silk', category: 'Baby Boy' },
        { label: 'Classic Friday Kurtas', category: 'Baby Boy' },
        { label: 'Everyday Soft Cottons', category: 'Baby Boy' },
      ],
      accessories: [
        { label: 'Soft-sole Khussa Shoes', category: 'Baby Boy' },
        { label: 'Hand-loomed Cotton Socks', category: 'Baby Boy' },
        { label: 'Mini Bowties & Braces', category: 'Baby Boy' },
      ],
    },
    featured: {
      title: 'Baby Boy Wardrobe',
      subtitle: 'Festive elegance with breathable comfort',
      image: 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=700&q=80',
      linkText: 'Discover Suits',
      category: 'Baby Boy',
    },
  },
  {
    id: 'girls',
    label: 'Girls',
    hasDropdown: true,
    targetCategory: 'Girls',
    columns: {
      shopByCategory: [
        { label: 'Festive Twirl Frocks', category: 'Girls' },
        { label: 'Embroidered Kurti Shalwars', category: 'Girls' },
        { label: 'Silk Ceremony Gowns', category: 'Girls' },
        { label: 'Casual Summer Coordinates', category: 'Girls' },
      ],
      collections: [
        { label: 'Guriya Special Eid Edit', category: 'Girls' },
        { label: 'Floral French Chiffon', category: 'Girls' },
        { label: 'Hand-block Printed Lawn', category: 'Girls' },
      ],
      accessories: [
        { label: 'Embroidered Net Dupattas', category: 'Girls' },
        { label: 'Hair Ribbons & Velvet Clips', category: 'Girls' },
        { label: 'Traditional Bangles & Shoes', category: 'Girls' },
      ],
    },
    featured: {
      title: 'Girls 2 - 8 Years',
      subtitle: 'Twirl-worthy frocks for special days',
      image: 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=700&q=80',
      linkText: 'Shop Girls Wear',
      category: 'Girls',
    },
  },
  {
    id: 'boys',
    label: 'Boys',
    hasDropdown: true,
    targetCategory: 'Boys',
    columns: {
      shopByCategory: [
        { label: 'Kurta Shalwar & Pajamas', category: 'Boys' },
        { label: 'Hand-finished Waistcoats', category: 'Boys' },
        { label: 'Formal Bandhgala Jackets', category: 'Boys' },
        { label: 'Tailored Cotton Trousers', category: 'Boys' },
      ],
      collections: [
        { label: 'Festive Jacquard Suiting', category: 'Boys' },
        { label: 'Pure White Juma Classics', category: 'Boys' },
        { label: 'Resham Embroidered Collars', category: 'Boys' },
      ],
      accessories: [
        { label: 'Embroidered Pocket Squares', category: 'Boys' },
        { label: 'Leather Khussa Slip-ons', category: 'Boys' },
        { label: 'Woven Cotton Caps', category: 'Boys' },
      ],
    },
    featured: {
      title: 'Boys 1 - 6 Years',
      subtitle: 'Tailored perfection for festive celebrations',
      image: 'https://images.unsplash.com/photo-1471286174890-9c112ffca56a?auto=format&fit=crop&w=700&q=80',
      linkText: 'Shop Boys Wear',
      category: 'Boys',
    },
  },
  {
    id: 'about-us',
    label: 'About Us',
    hasDropdown: false,
  },
];

export const Navbar: React.FC<NavbarProps> = ({
  cart,
  onOpenCart,
  onOpenReels,
  searchQuery,
  onSearchChange,
  selectedCategory: _selectedCategory,
  onSelectCategory,
  categories: _categories,
  showCategoryFilter: _showCategoryFilter,
  onOpenAbout,
  whatsappNumber,
  onOpenTracking,
  selectedAgeGroup = 'All Ages',
  onSelectAgeGroup,
  brandLogoText = 'BACHPAN PK',
  brandTagline = 'PREMIUM KIDS WEAR',
  isDarkMode = false,
}) => {
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleMouseEnter = (id: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveMenuId(id);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveMenuId(null);
    }, 180);
  };

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 25);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Listen for click-outside to collapse search suggestion overlay and Escape key to close search
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
        setIsSearchFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleCategoryClick = (catName?: string) => {
    setActiveMenuId(null);
    setMobileMenuOpen(false);
    if (catName) {
      onSelectCategory(catName);
    }
    const el = document.getElementById('kids-products-section');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  // Instant filter for segmented New Arrivals tags
  const handleNewArrivalsClick = (categoryTarget: 'Boys' | 'Girls' | 'Newborn') => {
    onSearchChange('');
    onSelectCategory(categoryTarget);
    setIsSearchOpen(false);
    setIsSearchFocused(false);
    const el = document.getElementById('kids-products-section');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  const activeItem = MENU_ITEMS.find((m) => m.id === activeMenuId);

  const AGE_PILL_FILTERS = [
    { 
      id: 'All Ages', 
      label: 'All Ages', 
      colorClasses: 'bg-neutral-100 text-neutral-800 border-neutral-300 hover:bg-neutral-200/70',
      dotColor: 'bg-neutral-500'
    },
    { 
      id: '0-3M', 
      label: '0-3M', 
      colorClasses: 'bg-[#FDF2F4] text-[#8C3A4A] border-[#F8D2D9] hover:bg-[#FBE5EA]',
      dotColor: 'bg-[#E598A8]'
    },
    { 
      id: '3-6M', 
      label: '3-6M', 
      colorClasses: 'bg-[#FFF6EB] text-[#925016] border-[#FCE1C3] hover:bg-[#FEEAD4]',
      dotColor: 'bg-[#EAA96C]'
    },
    { 
      id: '1-2Y', 
      label: '1-2Y', 
      colorClasses: 'bg-[#FEFCE8] text-[#854D0E] border-[#FEF08A] hover:bg-[#FEF9C3]',
      dotColor: 'bg-[#EAB308]'
    },
    { 
      id: '3-5Y', 
      label: '3-5Y', 
      colorClasses: 'bg-[#F0FDF4] text-[#166534] border-[#BBF7D0] hover:bg-[#DCFCE7]',
      dotColor: 'bg-[#4ADE80]'
    },
    { 
      id: '5Y+', 
      label: '5Y+', 
      colorClasses: 'bg-[#F0F9FF] text-[#075985] border-[#BAE6FD] hover:bg-[#E0F2FE]',
      dotColor: 'bg-[#38BDF8]'
    },
  ];

  return (
    <header className={`sticky top-0 z-40 transition-all duration-300 border-b select-none ${
      isScrolled 
        ? (isDarkMode ? 'bg-[#18181b]/95 backdrop-blur-md shadow-sm border-neutral-800 text-neutral-100' : 'bg-white/95 backdrop-blur-md shadow-sm border-neutral-200/90 text-neutral-900') 
        : (isDarkMode ? 'bg-[#18181b] border-neutral-800 text-neutral-100' : 'bg-white border-neutral-200/70 text-neutral-900')
    }`}>
      {/* Main Top Navigation Row (Shrinks Elegantly on Scroll) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex items-center justify-between transition-all duration-300 ${
          isScrolled ? 'h-14 sm:h-16' : 'h-20 sm:h-24'
        }`}>
          
          {/* Left Action / Mobile Menu Toggle */}
          <div className="flex items-center gap-3 sm:gap-4 w-1/4">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`lg:hidden p-2 transition-colors cursor-pointer -ml-2 ${
                isDarkMode ? 'text-neutral-200 hover:text-white' : 'text-neutral-800 hover:text-black'
              }`}
              aria-label="Open navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 stroke-[1.5]" /> : <Menu className="w-5 h-5 stroke-[1.5]" />}
            </button>

            {/* Desktop Quick Links (Concierge / Helpline) */}
            <a
              href={`https://wa.me/${(whatsappNumber || '03001234567').replace(/[^0-9]/g, '').startsWith('92') ? (whatsappNumber || '03001234567').replace(/[^0-9]/g, '') : `92${(whatsappNumber || '03001234567').replace(/[^0-9]/g, '').replace(/^0/, '')}`}?text=Assalam-o-Alaikum!%20I%20need%20size%20advice%20for%20Bachpan%20PK`}
              target="_blank"
              rel="noopener noreferrer"
              className={`hidden lg:flex items-center gap-1.5 text-[11px] uppercase tracking-[0.18em] transition-colors cursor-pointer ${
                isDarkMode ? 'text-neutral-400 hover:text-white' : 'text-neutral-500 hover:text-black'
              }`}
            >
              <MessageCircle className={`w-3.5 h-3.5 stroke-[1.5] ${isDarkMode ? 'text-[#C89299]' : 'text-neutral-600'}`} />
              <span>Concierge</span>
            </a>
          </div>

          {/* Center Brand Identity: Strictly Bachpan PK - Premium Kids Wear (Shrinks on Scroll) */}
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <button
              onClick={() => {
                onSelectCategory('All');
                onSearchChange('');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="group cursor-pointer flex flex-col items-center"
            >
              <span className={`font-serif uppercase font-normal group-hover:opacity-85 transition-all duration-300 ${
                isDarkMode ? 'text-white' : 'text-neutral-900'
              } ${
                isScrolled 
                  ? 'text-xl sm:text-2xl tracking-[0.2em]' 
                  : 'text-2xl sm:text-3xl lg:text-4xl tracking-[0.24em]'
              }`}>
                {brandLogoText}
              </span>
              <span className={`uppercase font-light transition-all duration-300 ${
                isDarkMode ? 'text-neutral-400' : 'text-neutral-500'
              } ${
                isScrolled 
                  ? 'text-[8px] sm:text-[9px] tracking-[0.28em] -mt-0.5 opacity-90' 
                  : 'text-[9px] sm:text-[10px] tracking-[0.32em] mt-0.5'
              }`}>
                {brandTagline}
              </span>
            </button>
          </div>

          {/* Right Utilities (Search, Reels, Track Order, Bag) */}
          <div className="flex items-center justify-end gap-3 sm:gap-5 w-1/4">
            {/* Search Trigger */}
            <button
              onClick={() => {
                const next = !isSearchOpen;
                setIsSearchOpen(next);
                if (next) {
                  setIsSearchFocused(true);
                  setTimeout(() => searchInputRef.current?.focus(), 80);
                } else {
                  setIsSearchFocused(false);
                }
              }}
              className={`transition-colors p-1 cursor-pointer ${
                isDarkMode ? 'text-neutral-300 hover:text-white' : 'text-neutral-700 hover:text-black'
              }`}
              title="Search collection"
              aria-label="Search"
            >
              <Search className="w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-[1.5]" />
            </button>

            {/* Video Reels Indicator */}
            <button
              onClick={onOpenReels}
              className={`hidden md:flex items-center gap-1.5 text-[11px] uppercase tracking-[0.16em] transition-colors cursor-pointer ${
                isDarkMode ? 'text-neutral-400 hover:text-white' : 'text-neutral-600 hover:text-black'
              }`}
              title="Watch 9:16 outfit reels"
            >
              <Film className="w-3.5 h-3.5 stroke-[1.5]" />
              <span className="hidden lg:inline">Reels</span>
            </button>

            {/* Order Tracking Button */}
            {onOpenTracking && (
              <button
                type="button"
                onClick={onOpenTracking}
                className={`flex items-center gap-1.5 text-[11px] uppercase tracking-[0.16em] transition-colors cursor-pointer ${
                  isDarkMode ? 'text-neutral-400 hover:text-white' : 'text-neutral-600 hover:text-black'
                }`}
                title="Track order status"
              >
                <Truck className="w-3.5 h-3.5 stroke-[1.5]" />
                <span className="hidden sm:inline">Track</span>
              </button>
            )}

            {/* Shopping Bag */}
            <button
              onClick={onOpenCart}
              className={`flex items-center gap-1.5 sm:gap-2 transition-colors relative cursor-pointer ${
                isDarkMode ? 'text-neutral-100 hover:text-white' : 'text-neutral-800 hover:text-black'
              }`}
              title="View shopping bag"
              aria-label="Bag"
            >
              <ShoppingBag className="w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-[1.5]" />
              <span className="text-[11px] uppercase tracking-[0.16em] font-light">
                Bag {totalCartCount > 0 ? `(${totalCartCount})` : ''}
              </span>
            </button>
          </div>

        </div>

        {/* Centered Desktop Category Navigation Bar (Thin, Elegant, Cashmirino Style) */}
        <nav className={`hidden lg:flex items-center justify-center gap-8 xl:gap-12 transition-all duration-300 border-t ${
          isDarkMode ? 'border-neutral-800' : 'border-neutral-100'
        } ${
          isScrolled ? 'py-2' : 'py-3'
        }`}>
          {MENU_ITEMS.map((item) => {
            const isHovered = activeMenuId === item.id;
            return (
              <div
                key={item.id}
                onMouseEnter={() => handleMouseEnter(item.id)}
                onMouseLeave={handleMouseLeave}
                className="relative py-1"
              >
                <button
                  type="button"
                  className={`text-[11px] uppercase tracking-[0.18em] font-medium transition-colors flex items-center gap-1 cursor-pointer ${
                    isHovered 
                      ? (isDarkMode ? 'text-white' : 'text-black') 
                      : (isDarkMode ? 'text-neutral-300 hover:text-white' : 'text-neutral-700 hover:text-black')
                  }`}
                  onClick={() => {
                    if (item.id === 'about-us') {
                      if (onOpenAbout) onOpenAbout();
                      else {
                        const el = document.getElementById('about-us-section');
                        el?.scrollIntoView({ behavior: 'smooth' });
                      }
                    } else if (item.targetCategory) {
                      handleCategoryClick(item.targetCategory);
                    }
                  }}
                >
                  <span>{item.label}</span>
                  {item.hasDropdown && (
                    <ChevronDown className={`w-3 h-3 text-neutral-400 stroke-[1.5] transition-transform duration-200 ${
                      isHovered ? 'rotate-180 text-black' : ''
                    }`} />
                  )}
                </button>
              </div>
            );
          })}
        </nav>
      </div>

      {/* DYNAMIC AGE-GROUP QUICK FILTER ROW (Soft-Colored Circular Pill Buttons & On-Screen New Arrivals) */}
      <div className="bg-[#FAF9F8] border-t border-b border-neutral-200/60 py-2.5 px-4 overflow-x-auto no-scrollbar">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 sm:gap-3 min-w-max">
          {/* On-Screen New Arrivals Action Pill */}
          <button
            type="button"
            onClick={() => {
              if (onSelectCategory) onSelectCategory('New Arrivals');
              const el = document.getElementById('new-arrivals-section') || document.getElementById('kids-products-section');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className={`rounded-full px-3.5 py-1.5 sm:px-4 sm:py-2 text-[11px] sm:text-xs tracking-wider uppercase font-semibold border flex items-center gap-1.5 transition-all duration-200 cursor-pointer shadow-2xs ${
              _selectedCategory && _selectedCategory.toLowerCase().includes('new arrival')
                ? 'bg-amber-900 text-white border-amber-900 ring-2 ring-amber-400/40 shadow-xs scale-105'
                : 'bg-gradient-to-r from-amber-50 to-orange-50 text-amber-950 border-amber-300 hover:border-amber-500 hover:scale-105 active:scale-95'
            }`}
            title="Explore 2026 New Arrivals & Fresh Drops"
          >
            <Sparkles className="w-3 h-3 text-amber-600 stroke-[2.2]" />
            <span>New Arrivals</span>
            <span className="text-[9px] uppercase tracking-widest bg-white/80 text-amber-800 px-1.5 py-0.2 rounded-full font-bold border border-amber-200">
              2026
            </span>
          </button>

          <span className="text-[10px] uppercase tracking-[0.22em] font-medium text-neutral-400 ml-1 mr-0.5 select-none hidden sm:inline">
            Shop by Age:
          </span>
          {AGE_PILL_FILTERS.map((item) => {
            const isSelected = selectedAgeGroup === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  if (onSelectAgeGroup) onSelectAgeGroup(item.id);
                  const el = document.getElementById('kids-products-section');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`rounded-full px-4 py-1.5 sm:px-4.5 sm:py-2 text-[11px] sm:text-xs tracking-wider uppercase font-medium border flex items-center gap-1.5 transition-all duration-200 cursor-pointer shadow-2xs ${
                  isSelected
                    ? 'bg-neutral-950 text-white border-neutral-950 ring-2 ring-neutral-400/40 shadow-xs scale-105 font-semibold'
                    : `${item.colorClasses} hover:scale-105 active:scale-95`
                }`}
                title={`Filter outfits for ${item.label}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                  isSelected ? 'bg-white ring-2 ring-white/30' : item.dotColor
                }`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Expandable Clean Minimalist Search Input & Discovery Overlay */}
      {isSearchOpen && (
        <div 
          ref={searchContainerRef} 
          className="border-t border-neutral-200/90 bg-[#FAF9F8] py-4 px-4 sm:px-8 relative shadow-md animate-fadeIn z-50"
        >
          <div className="max-w-4xl mx-auto relative">
            {/* Search Input Bar */}
            <div className="flex items-center gap-3 border-b border-neutral-300 pb-2 focus-within:border-neutral-900 transition-colors">
              <Search className="w-4 h-4 sm:w-5 sm:h-5 text-neutral-400 stroke-[1.5]" />
              <input
                ref={searchInputRef}
                type="text"
                autoFocus
                value={searchQuery}
                onFocus={() => setIsSearchFocused(true)}
                onClick={() => setIsSearchFocused(true)}
                onChange={(e) => {
                  onSearchChange(e.target.value);
                  setIsSearchFocused(true);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    setIsSearchOpen(false);
                    setIsSearchFocused(false);
                    document.getElementById('kids-products-section')?.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                placeholder="Search Baba Suits, Party Frocks, Rompers, Waistcoats..."
                className="w-full bg-transparent text-sm sm:text-base text-neutral-900 placeholder:text-neutral-400 focus:outline-none font-light tracking-wide"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => onSearchChange('')}
                  className="text-xs uppercase tracking-wider text-neutral-400 hover:text-black cursor-pointer px-1.5 py-0.5"
                >
                  Clear
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  setIsSearchOpen(false);
                  setIsSearchFocused(false);
                }}
                className="text-neutral-400 hover:text-black p-1 cursor-pointer"
                aria-label="Close search"
              >
                <X className="w-4 h-4 stroke-[1.5]" />
              </button>
            </div>

            {/* INTUITIVE SEARCH OVERLAY & NEW ARRIVALS QUICK BUTTONS */}
            {isSearchFocused && (
              <div className="mt-3.5 bg-white border border-neutral-200/90 shadow-xl rounded-sm p-4 sm:p-6 space-y-4 animate-fadeIn">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-neutral-100 pb-2.5">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600 stroke-[1.8]" />
                    <span className="font-serif text-sm tracking-wider uppercase text-neutral-900 font-medium">
                      Curated Discovery · New Arrivals
                    </span>
                  </div>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 font-light">
                    Spring / Summer 2026
                  </span>
                </div>

                {/* Aesthetic Quick-Action New Arrivals Buttons Segmented by Category */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* [ Boys New Arrivals ] */}
                  <button
                    type="button"
                    onClick={() => handleNewArrivalsClick('Boys')}
                    className="group text-left p-3.5 sm:p-4 rounded-xl border border-sky-100/90 bg-[#F4F9FD] hover:bg-[#EAF3FA] hover:border-sky-300 transition-all duration-200 cursor-pointer shadow-2xs hover:shadow-xs flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-white text-sky-800 shadow-2xs font-serif text-xs font-semibold">
                        B
                      </span>
                      <span className="text-[9px] uppercase tracking-[0.2em] text-sky-700 font-semibold bg-white/90 px-2 py-0.5 rounded-full border border-sky-200/60">
                        New Stock
                      </span>
                    </div>
                    <div>
                      <p className="font-serif text-sm sm:text-base text-neutral-900 font-medium group-hover:text-black tracking-wide">
                        Boys New Arrivals
                      </p>
                      <p className="text-[11px] text-neutral-500 font-light mt-0.5 leading-snug">
                        Baba Suits, Waistcoats & Kurta Shalwar
                      </p>
                    </div>
                    <div className="mt-3 flex items-center gap-1 text-[10px] uppercase tracking-[0.18em] text-sky-800 font-medium group-hover:translate-x-1 transition-transform">
                      <span>Explore Boys</span>
                      <ArrowRight className="w-3 h-3 stroke-[1.8]" />
                    </div>
                  </button>

                  {/* [ Girls New Arrivals ] */}
                  <button
                    type="button"
                    onClick={() => handleNewArrivalsClick('Girls')}
                    className="group text-left p-3.5 sm:p-4 rounded-xl border border-rose-100/90 bg-[#FDF5F7] hover:bg-[#FBEBF0] hover:border-rose-300 transition-all duration-200 cursor-pointer shadow-2xs hover:shadow-xs flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-white text-rose-800 shadow-2xs font-serif text-xs font-semibold">
                        G
                      </span>
                      <span className="text-[9px] uppercase tracking-[0.2em] text-rose-700 font-semibold bg-white/90 px-2 py-0.5 rounded-full border border-rose-200/60">
                        New Stock
                      </span>
                    </div>
                    <div>
                      <p className="font-serif text-sm sm:text-base text-neutral-900 font-medium group-hover:text-black tracking-wide">
                        Girls New Arrivals
                      </p>
                      <p className="text-[11px] text-neutral-500 font-light mt-0.5 leading-snug">
                        Party Frocks, Chiffon Sets & Twirl Dresses
                      </p>
                    </div>
                    <div className="mt-3 flex items-center gap-1 text-[10px] uppercase tracking-[0.18em] text-rose-800 font-medium group-hover:translate-x-1 transition-transform">
                      <span>Explore Girls</span>
                      <ArrowRight className="w-3 h-3 stroke-[1.8]" />
                    </div>
                  </button>

                  {/* [ Newborn New Arrivals ] */}
                  <button
                    type="button"
                    onClick={() => handleNewArrivalsClick('Newborn')}
                    className="group text-left p-3.5 sm:p-4 rounded-xl border border-emerald-100/90 bg-[#F3FAF5] hover:bg-[#E7F5EB] hover:border-emerald-300 transition-all duration-200 cursor-pointer shadow-2xs hover:shadow-xs flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-white text-emerald-800 shadow-2xs font-serif text-xs font-semibold">
                        N
                      </span>
                      <span className="text-[9px] uppercase tracking-[0.2em] text-emerald-700 font-semibold bg-white/90 px-2 py-0.5 rounded-full border border-emerald-200/60">
                        New Stock
                      </span>
                    </div>
                    <div>
                      <p className="font-serif text-sm sm:text-base text-neutral-900 font-medium group-hover:text-black tracking-wide">
                        Newborn New Arrivals
                      </p>
                      <p className="text-[11px] text-neutral-500 font-light mt-0.5 leading-snug">
                        Organic Rompers, Kimonos & Swaddles
                      </p>
                    </div>
                    <div className="mt-3 flex items-center gap-1 text-[10px] uppercase tracking-[0.18em] text-emerald-800 font-medium group-hover:translate-x-1 transition-transform">
                      <span>Explore Newborn</span>
                      <ArrowRight className="w-3 h-3 stroke-[1.8]" />
                    </div>
                  </button>
                </div>

                {/* Popular Curated Searches */}
                <div className="pt-2 border-t border-neutral-100 flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 font-medium mr-1 select-none">
                    Trending Searches:
                  </span>
                  {['Eid Festive Edit', 'Baba Suits', 'Lawn Frocks', 'Organic Cottons', 'Waistcoats', 'Rompers'].map((term) => (
                    <button
                      key={term}
                      type="button"
                      onClick={() => {
                        onSearchChange(term);
                        setIsSearchOpen(false);
                        setIsSearchFocused(false);
                        document.getElementById('kids-products-section')?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-neutral-100 hover:bg-neutral-200 text-neutral-700 hover:text-black border border-neutral-200 transition-colors cursor-pointer"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* LUXURY MINIMALIST MEGA MENU DROPDOWN (Hover-Activated) */}
      {activeItem && activeItem.hasDropdown && activeItem.columns && (
        <div
          onMouseEnter={() => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
          }}
          onMouseLeave={handleMouseLeave}
          className="hidden lg:block absolute left-0 right-0 top-full bg-white border-b border-neutral-200 shadow-xl z-50 animate-fadeIn"
        >
          <div className="max-w-7xl mx-auto px-8 py-10">
            <div className="grid grid-cols-12 gap-8">
              
              {/* Column 1: Shop by Category */}
              <div className="col-span-3 space-y-4">
                <h4 className="text-[11px] uppercase tracking-[0.22em] text-neutral-400 font-medium">
                  Shop By Category
                </h4>
                <ul className="space-y-2.5">
                  {activeItem.columns.shopByCategory.map((link, idx) => (
                    <li key={idx}>
                      <button
                        onClick={() => handleCategoryClick(link.category)}
                        className="text-[13px] text-neutral-600 hover:text-black transition-colors text-left font-light tracking-wide cursor-pointer hover:translate-x-1 duration-150 inline-block"
                      >
                        {link.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Column 2: Collections */}
              <div className="col-span-3 space-y-4">
                <h4 className="text-[11px] uppercase tracking-[0.22em] text-neutral-400 font-medium">
                  Collections
                </h4>
                <ul className="space-y-2.5">
                  {activeItem.columns.collections.map((link, idx) => (
                    <li key={idx}>
                      <button
                        onClick={() => handleCategoryClick(link.category)}
                        className="text-[13px] text-neutral-600 hover:text-black transition-colors text-left font-light tracking-wide cursor-pointer hover:translate-x-1 duration-150 inline-block"
                      >
                        {link.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Column 3: Accessories */}
              <div className="col-span-3 space-y-4">
                <h4 className="text-[11px] uppercase tracking-[0.22em] text-neutral-400 font-medium">
                  Accessories & Gifts
                </h4>
                <ul className="space-y-2.5">
                  {activeItem.columns.accessories.map((link, idx) => (
                    <li key={idx}>
                      <button
                        onClick={() => handleCategoryClick(link.category)}
                        className="text-[13px] text-neutral-600 hover:text-black transition-colors text-left font-light tracking-wide cursor-pointer hover:translate-x-1 duration-150 inline-block"
                      >
                        {link.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Column 4: Editorial Photography Feature */}
              {activeItem.featured && (
                <div className="col-span-3 pl-6 border-l border-neutral-100 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="aspect-[4/3] w-full overflow-hidden bg-neutral-100 group">
                      <img
                        src={activeItem.featured.image}
                        alt={activeItem.featured.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                    </div>
                    <div>
                      <h5 className="font-serif text-base text-neutral-900 tracking-wide">
                        {activeItem.featured.title}
                      </h5>
                      <p className="text-xs text-neutral-500 font-light mt-0.5">
                        {activeItem.featured.subtitle}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleCategoryClick(activeItem.featured?.category)}
                    className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.2em] font-light text-neutral-900 hover:text-neutral-500 pt-3 transition-colors cursor-pointer"
                  >
                    <span>{activeItem.featured.linkText}</span>
                    <ArrowRight className="w-3 h-3 stroke-[1.5]" />
                  </button>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-[110px] z-50 bg-white/98 backdrop-blur-md overflow-y-auto px-6 py-8 border-t border-neutral-200">
          <div className="space-y-6">
            <div className="space-y-4">
              <h4 className="text-[10px] uppercase tracking-[0.25em] text-neutral-400 font-medium">
                Categories
              </h4>
              <ul className="space-y-4">
                {MENU_ITEMS.map((item) => (
                  <li key={item.id}>
                    <button
                      onClick={() => {
                        if (item.id === 'about-us') {
                          setMobileMenuOpen(false);
                          if (onOpenAbout) onOpenAbout();
                        } else {
                          handleCategoryClick(item.targetCategory);
                        }
                      }}
                      className="text-lg font-serif text-neutral-900 tracking-wide text-left flex items-center justify-between w-full py-1 border-b border-neutral-100 cursor-pointer"
                    >
                      <span>{item.label}</span>
                      <ArrowRight className="w-4 h-4 text-neutral-400 stroke-[1.5]" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Mobile Shop by Age */}
            <div className="py-4 border-t border-neutral-200 space-y-2">
              <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-neutral-400 block">
                Shop by Age
              </span>
              <div className="grid grid-cols-3 gap-1.5">
                {['All Ages', '0-3M', '3-6M', '1-2Y', '3-5Y', '5Y+'].map((age) => (
                  <button
                    key={age}
                    type="button"
                    onClick={() => {
                      if (onSelectAgeGroup) onSelectAgeGroup(age);
                      setMobileMenuOpen(false);
                      const el = document.getElementById('kids-products-section');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className={`py-1.5 px-2 text-[11px] font-medium uppercase tracking-wider text-center border cursor-pointer ${
                      selectedAgeGroup === age
                        ? 'bg-neutral-900 text-white border-neutral-900 font-semibold'
                        : 'bg-white text-neutral-700 border-neutral-200'
                    }`}
                  >
                    {age}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-neutral-200 space-y-3">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenReels();
                }}
                className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-neutral-700 py-2 w-full cursor-pointer"
              >
                <Film className="w-4 h-4 stroke-[1.5]" />
                <span>Watch Outfit Reels</span>
              </button>

              {onOpenTracking && (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenTracking();
                  }}
                  className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-neutral-700 py-2 w-full cursor-pointer"
                >
                  <Truck className="w-4 h-4 stroke-[1.5]" />
                  <span>Track Order Status</span>
                </button>
              )}

              <a
                href="https://wa.me/923001234567?text=Assalam-o-Alaikum!%20I%20need%20help%20with%20Bachpan%20PK"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-neutral-700 py-2 w-full cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 stroke-[1.5]" />
                <span>WhatsApp Concierge</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
