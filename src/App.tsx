/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { AnnouncementBar } from './components/AnnouncementBar';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { ProductCard } from './components/ProductCard';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { ReelPlayerModal } from './components/ReelPlayerModal';
import { AdminLoginModal } from './components/admin/AdminLoginModal';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { Footer } from './components/Footer';
import { ProductLightboxModal } from './components/ProductLightboxModal';
import { PromotionalTopBar } from './components/PromotionalTopBar';
import { FloatingWhatsAppButton } from './components/FloatingWhatsAppButton';
import { BackToTopButton } from './components/BackToTopButton';
import { CategoryGrid } from './components/CategoryGrid';
import { NewArrivalsSection } from './components/NewArrivalsSection';
import { TrustBadgesBar } from './components/TrustBadgesBar';
import { AboutUsModal } from './components/AboutUsModal';
import { SizeGuideModal } from './components/SizeGuideModal';
import { OrderTrackingModal } from './components/OrderTrackingModal';
import { SponsorBannerSlot } from './components/SponsorBannerSlot';
import { ExploreByAgeSection } from './components/ExploreByAgeSection';
import { ProductHighlightShowcase } from './components/ProductHighlightShowcase';
import { ParentFavoritesCollage } from './components/ParentFavoritesCollage';
import { PriceRangeFilter } from './components/PriceRangeFilter';
import { Product, CartItem, Order, StoreLayoutConfig, DEFAULT_LAYOUT_CONFIG, Promotion } from './types';
import { KIDS_CATEGORIES } from './data/initialData';
import { api } from './services/api';
import { matchesAgeGroup } from './utils/ageFilter';
import { Film, ArrowRight, Ruler, Sparkles, MessageCircle, Lock } from 'lucide-react';

const CART_STORAGE_KEY = 'bachpanpk_user_cart';

// Secret hidden admin route string
export const HIDDEN_ADMIN_ROUTE = '/admin-secure-login';

export default function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [layoutConfig, setLayoutConfig] = useState<StoreLayoutConfig>(DEFAULT_LAYOUT_CONFIG);
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Filter & Search
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<string>('All Ages');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [maxBudgetFilter, setMaxBudgetFilter] = useState<number | null>(null);

  // Customer Modals & Drawers
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [submittedOrder, setSubmittedOrder] = useState<Order | null>(null);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  
  // Reels & Media
  const [selectedReelProduct, setSelectedReelProduct] = useState<Product | null>(null);
  const [isReelModalOpen, setIsReelModalOpen] = useState(false);

  // Promotions & Lightbox State
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [selectedLightboxProduct, setSelectedLightboxProduct] = useState<Product | null>(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [sizeGuideProduct, setSizeGuideProduct] = useState<Product | null>(null);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [trackingOrderId, setTrackingOrderId] = useState<string>('');

  // Hidden Admin Routing State
  const checkIsAdminRoute = useCallback(() => {
    const path = window.location.pathname.toLowerCase();
    const search = window.location.search.toLowerCase();
    const hash = window.location.hash.toLowerCase();
    return (
      path.includes('admin-secure-login') ||
      search.includes('admin-secure-login') ||
      hash.includes('admin-secure-login')
    );
  }, []);

  const [isAdminRouteActive, setIsAdminRouteActive] = useState<boolean>(() => checkIsAdminRoute());
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => api.isAdminAuthenticated());
  const [isAdminLoginModalOpen, setIsAdminLoginModalOpen] = useState(false);

  // Load products & layout & promotions on mount
  const loadInitialData = async () => {
    try {
      const [allProducts, currentLayout, allPromotions] = await Promise.all([
        api.getProducts(),
        api.getLayout(),
        api.getPromotions(),
      ]);
      setProducts(allProducts);
      setLayoutConfig(currentLayout);
      setPromotions(allPromotions);
    } catch (e) {
      console.error('Error loading initial data', e);
    }
  };

  useEffect(() => {
    loadInitialData();

    // Listen to instant custom events from Admin CMS
    const handleLayoutUpdate = (e: any) => {
      if (e.detail) {
        setLayoutConfig(e.detail);
      } else {
        api.getLayout().then(setLayoutConfig);
      }
    };

    const handleProductsUpdate = () => {
      api.getProducts().then(setProducts);
    };

    const handlePromotionsUpdate = (e: any) => {
      if (e.detail) {
        setPromotions(e.detail);
      } else {
        api.getPromotions().then(setPromotions);
      }
    };

    window.addEventListener('bachpanpk_layout_updated', handleLayoutUpdate);
    window.addEventListener('bachpanpk_products_updated', handleProductsUpdate);
    window.addEventListener('bachpanpk_promotions_updated', handlePromotionsUpdate);
    
    // Also listen to cross-tab storage updates
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'bachpanpk_layout') {
        api.getLayout().then(setLayoutConfig);
      }
      if (e.key === 'bachpanpk_products') {
        api.getProducts().then(setProducts);
      }
      if (e.key === 'bachpanpk_promotions') {
        api.getPromotions().then(setPromotions);
      }
    };
    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener('bachpanpk_layout_updated', handleLayoutUpdate);
      window.removeEventListener('bachpanpk_products_updated', handleProductsUpdate);
      window.removeEventListener('bachpanpk_promotions_updated', handlePromotionsUpdate);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  // Save cart changes
  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  // Handle hidden route check and history listener
  useEffect(() => {
    const syncRoute = () => {
      const isAdmin = checkIsAdminRoute();
      setIsAdminRouteActive(isAdmin);
      if (isAdmin) {
        if (!api.isAdminAuthenticated()) {
          setIsAdminLoginModalOpen(true);
        }
      } else {
        setIsAdminLoginModalOpen(false);
      }
    };

    syncRoute();
    window.addEventListener('popstate', syncRoute);
    window.addEventListener('hashchange', syncRoute);

    return () => {
      window.removeEventListener('popstate', syncRoute);
      window.removeEventListener('hashchange', syncRoute);
    };
  }, [checkIsAdminRoute]);

  // Navigate back to clean customer storefront
  const navigateToStorefront = async () => {
    window.history.pushState({}, '', '/');
    setIsAdminRouteActive(false);
    setIsAdminLoginModalOpen(false);
    // Reload layout and products to ensure any Admin CMS changes reflect immediately
    await loadInitialData();
  };

  // Admin Logout
  const handleAdminLogout = () => {
    api.adminLogout();
    setIsAdminLoggedIn(false);
    navigateToStorefront();
  };

  // Categories
  const categories = useMemo(() => {
    const set = new Set<string>(KIDS_CATEGORIES);
    products.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return Array.from(set);
  }, [products]);

  // Two-Tier Smart Category Matcher
  const matchCategory = useCallback((product: Product, targetCat: string): boolean => {
    if (!targetCat || targetCat === 'All') return true;
    const cat = (product.category || '').toLowerCase();
    const sub = (product.subCategory || '').toLowerCase();
    const target = targetCat.toLowerCase();

    if (cat === target || sub === target) return true;

    if (target === 'new arrivals' || target === 'new arrival') {
      return true; // Displays all latest stock sorted by priority/freshness
    }
    if (target === 'boys' || target === 'boys wear' || target === 'boys new arrivals') {
      return (cat.includes('boy') && !cat.includes('baby boy')) || cat === 'boys wear' || cat === 'boys';
    }
    if (target === 'girls' || target === 'girls wear' || target === 'girls new arrivals') {
      return (cat.includes('girl') && !cat.includes('baby girl')) || cat === 'girls wear' || cat === 'girls';
    }
    if (target === 'baby boy' || target === 'toddler outfits') {
      return cat.includes('baby boy') || cat.includes('toddler') || (cat.includes('boy') && Boolean(product.ageGroup?.includes('Month') || product.ageGroup?.includes('0-') || product.ageGroup?.includes('1-')));
    }
    if (target === 'baby girl') {
      return cat.includes('baby girl') || (cat.includes('girl') && Boolean(product.ageGroup?.includes('Month') || product.ageGroup?.includes('0-') || product.ageGroup?.includes('1-')));
    }
    if (target === 'newborn' || target === 'newborn essentials' || target === 'newborn new arrivals') {
      return cat.includes('newborn') || sub.includes('swaddle') || sub.includes('kimono') || sub.includes('essential') || sub.includes('hampers');
    }

    return cat.includes(target) || sub.includes(target);
  }, []);

  // Helper: Sort products strictly by Display Weight / Priority (1 at absolute top, then 2, 3...)
  const sortByPriority = (items: Product[]): Product[] => {
    return [...items].sort((a, b) => {
      const pA = typeof a.priority === 'number' && !isNaN(a.priority) ? a.priority : 10;
      const pB = typeof b.priority === 'number' && !isNaN(b.priority) ? b.priority : 10;
      if (pA !== pB) {
        return pA - pB; // Priority 1 appears at absolute top
      }
      return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
    });
  };

  // Specific Category Products for Category Showcase Boxes (bridging two-tier categories)
  const boysWearProducts = useMemo(() => {
    const list = products.filter((p) => matchCategory(p, 'Boys'));
    return sortByPriority(list).slice(0, 4);
  }, [products, matchCategory]);

  const girlsWearProducts = useMemo(() => {
    const list = products.filter((p) => matchCategory(p, 'Girls'));
    return sortByPriority(list).slice(0, 4);
  }, [products, matchCategory]);

  const toddlerProducts = useMemo(() => {
    const list = products.filter((p) => matchCategory(p, 'Baby Boy') || matchCategory(p, 'Toddler Outfits'));
    return sortByPriority(list).slice(0, 4);
  }, [products, matchCategory]);

  const newbornProducts = useMemo(() => {
    const list = products.filter((p) => matchCategory(p, 'Newborn'));
    return sortByPriority(list).slice(0, 4);
  }, [products, matchCategory]);

  // Minimum and Maximum prices in current product database
  const { minCatalogPrice, maxCatalogPrice } = useMemo(() => {
    if (!products.length) return { minCatalogPrice: 1000, maxCatalogPrice: 5000 };
    const prices = products.map((p) => p.price);
    const minP = Math.min(...prices);
    const maxP = Math.max(...prices);
    return {
      minCatalogPrice: Math.floor(minP / 100) * 100,
      maxCatalogPrice: Math.ceil(maxP / 100) * 100,
    };
  }, [products]);

  const effectiveMaxBudget = maxBudgetFilter !== null ? maxBudgetFilter : maxCatalogPrice;

  // Products matching category, age, and search (before price filter, for count display)
  const categoryAndAgeMatchedProducts = useMemo(() => {
    return products.filter((prod) => {
      const matchCat = matchCategory(prod, selectedCategory);
      const matchAge = matchesAgeGroup(prod, selectedAgeGroup);
      const matchSearch =
        prod.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prod.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prod.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (prod.subCategory && prod.subCategory.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (prod.ageGroup && prod.ageGroup.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCat && matchAge && matchSearch;
    });
  }, [products, selectedCategory, selectedAgeGroup, searchQuery, matchCategory]);

  // Filtered Products for the Main Catalog Grid (sorted by Display Weight/Priority 1, 2, 3...)
  const filteredProducts = useMemo(() => {
    const matched = categoryAndAgeMatchedProducts.filter((prod) => {
      return maxBudgetFilter !== null ? prod.price <= maxBudgetFilter : true;
    });

    return sortByPriority(matched);
  }, [categoryAndAgeMatchedProducts, maxBudgetFilter]);

  // Reel-enabled products
  const reelProducts = useMemo(() => {
    return products.filter((p) => !!p.videoUrl);
  }, [products]);

  // Cart operations
  const handleAddToCart = (product: Product, size?: string) => {
    const chosenSize = size || (product.sizes && product.sizes.length > 0 ? product.sizes[0] : 'Standard');
    setCart((prev) => {
      const existing = prev.find(
        (item) => item.product.id === product.id && item.selectedSize === chosenSize
      );
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id && item.selectedSize === chosenSize
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1, selectedSize: chosenSize }];
    });
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveItem = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleQuickBuy = (product: Product, size?: string) => {
    handleAddToCart(product, size);
    setIsCheckoutOpen(true);
  };

  const handleProceedToCheckout = (discount: number) => {
    setAppliedDiscount(discount);
    setIsCheckoutOpen(true);
  };

  const handleOrderSuccess = (order: Order) => {
    setCart([]); // Clear cart
    setSubmittedOrder(order);
    setIsCheckoutOpen(false);
    setIsSuccessModalOpen(true);
  };

  const handleOpenReel = (product: Product) => {
    setSelectedReelProduct(product);
    setIsReelModalOpen(true);
  };

  const handleOpenLightbox = (product: Product) => {
    setSelectedLightboxProduct(product);
    setIsLightboxOpen(true);
  };

  const handleOpenSizeGuide = (product?: Product) => {
    setSizeGuideProduct(product || selectedLightboxProduct || null);
    setIsSizeGuideOpen(true);
  };

  const handleOpenTracking = (orderId?: string) => {
    setTrackingOrderId(orderId || '');
    setIsTrackingOpen(true);
  };

  const handleReviewSubmitted = (productId: string, newRating: number, newCount: number) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, rating: newRating, reviewCount: newCount } : p))
    );
    setSelectedLightboxProduct((prev) =>
      prev && prev.id === productId ? { ...prev, rating: newRating, reviewCount: newCount } : prev
    );
  };

  // IF ADMIN ROUTE ACTIVE:
  if (isAdminRouteActive) {
    if (isAdminLoggedIn) {
      return (
        <AdminDashboard
          onLogout={handleAdminLogout}
          onOpenStorefront={navigateToStorefront}
        />
      );
    }

    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <AdminLoginModal
          isOpen={true}
          onClose={navigateToStorefront}
          onLoginSuccess={() => {
            setIsAdminLoggedIn(true);
            setIsAdminLoginModalOpen(false);
          }}
        />
      </div>
    );
  }

  // 0. ADMINISTRATIVE MAINTENANCE MODE PLACEHOLDER (when turned ON in Admin Panel)
  if (layoutConfig.maintenanceMode && !isAdminRouteActive) {
    return (
      <div className="min-h-screen bg-[#FAF9F8] text-neutral-900 flex flex-col justify-between p-6 sm:p-12 font-sans selection:bg-neutral-900 selection:text-white">
        {/* Top Minimal Brand Mark */}
        <header className="w-full max-w-5xl mx-auto flex items-center justify-between border-b border-neutral-200/60 pb-6">
          <div className="flex flex-col">
            <span className="font-serif text-2xl sm:text-3xl tracking-[0.24em] uppercase text-neutral-900 font-normal">
              BACHPAN PK
            </span>
            <span className="text-[9px] sm:text-[10px] tracking-[0.32em] uppercase text-neutral-500 font-light mt-0.5">
              PREMIUM KIDS WEAR
            </span>
          </div>

          <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-neutral-600 font-light border border-neutral-300 px-3 py-1 bg-white shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span>Stock Refresh In Progress</span>
          </div>
        </header>

        {/* Center Minimalist Under Construction Box */}
        <main className="max-w-xl mx-auto text-center space-y-6 my-auto py-12 px-4 animate-fadeIn">
          <div className="inline-flex p-4 rounded-full bg-white border border-neutral-200 shadow-xs mb-2">
            <Sparkles className="w-7 h-7 text-neutral-800 stroke-[1.2]" />
          </div>

          <p className="text-[11px] uppercase tracking-[0.28em] text-neutral-400 font-light">
            Atelier Curations · Updating Seasonal Stock
          </p>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-neutral-900 font-normal tracking-wide leading-tight">
            Bachpan PK is currently updating stock. We will be back online shortly!
          </h1>

          <p className="text-sm sm:text-base text-neutral-600 font-light leading-relaxed max-w-md mx-auto">
            Our atelier artisans are restocking hand-tailored festive suits, soft pure-lawn sets, and newborn essentials. Thank you for your patience.
          </p>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={`https://wa.me/${(layoutConfig.whatsappNumber || '03001234567').replace(/[^0-9]/g, '').startsWith('92') ? (layoutConfig.whatsappNumber || '03001234567').replace(/[^0-9]/g, '') : `92${(layoutConfig.whatsappNumber || '03001234567').replace(/[^0-9]/g, '').replace(/^0/, '')}`}?text=Assalam-o-Alaikum!%20I%20saw%20Bachpan%20PK%20is%20updating%20stock.%20Can%20I%20inquire%20about%20an%20urgent%20outfit%20order?`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-3.5 bg-neutral-900 hover:bg-black text-white text-xs uppercase tracking-[0.18em] font-light flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm"
            >
              <MessageCircle className="w-4 h-4 stroke-[1.5]" />
              <span>Contact WhatsApp Concierge</span>
            </a>

            <button
              onClick={() => handleOpenTracking()}
              className="w-full sm:w-auto px-6 py-3.5 border border-neutral-300 hover:border-black text-neutral-800 text-xs uppercase tracking-[0.18em] font-light transition-colors cursor-pointer bg-white"
            >
              <span>Track Existing Order</span>
            </button>
          </div>
        </main>

        {/* Footer with Discreet Hidden Admin Access */}
        <footer className="w-full max-w-5xl mx-auto pt-8 border-t border-neutral-200/60 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-400 font-light gap-4">
          <p className="text-[11px] tracking-wider">
            © 2026 Bachpan PK - Premium Kids Wear. All Rights Reserved.
          </p>

          {/* Hidden Admin Access Lock */}
          <button
            onClick={() => {
              window.history.pushState({}, '', '/admin-secure-login');
              setIsAdminRouteActive(true);
              setIsAdminLoginModalOpen(true);
            }}
            className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-neutral-400 hover:text-black transition-colors cursor-pointer"
            title="Administrator Access"
          >
            <Lock className="w-3.5 h-3.5 stroke-[1.5]" />
            <span>Admin Portal</span>
          </button>
        </footer>

        {/* Allow customer order tracking modal during maintenance */}
        <OrderTrackingModal
          isOpen={isTrackingOpen}
          onClose={() => setIsTrackingOpen(false)}
          initialOrderId={trackingOrderId}
          whatsappNumber={layoutConfig.whatsappNumber}
        />

        <AdminLoginModal
          isOpen={isAdminLoginModalOpen}
          onClose={() => {
            setIsAdminLoginModalOpen(false);
            window.history.pushState({}, '', '/');
            setIsAdminRouteActive(false);
          }}
          onLoginSuccess={() => {
            setIsAdminLoggedIn(true);
            setIsAdminLoginModalOpen(false);
          }}
        />
      </div>
    );
  }

  // 100% CLEAN LUXURY PASTEL CUSTOMER STOREFRONT (ALAYA JUNIOR AESTHETIC / GLOBAL THEME MODE)
  const isCustomerDark = layoutConfig.globalThemeMode === 'dark';

  return (
    <div 
      data-theme={isCustomerDark ? 'dark' : 'light'}
      className={`min-h-screen flex flex-col font-sans selection:bg-[#C89299] selection:text-white transition-colors duration-300 ${
        isCustomerDark ? 'bg-[#121214] text-[#FAF6F0]' : 'bg-[#FDFBF7] text-neutral-900'
      }`}
    >
      
      {/* 1. Top Announcement Bar (Dynamic CMS Toggle & Custom Text) */}
      {layoutConfig.showAnnouncementBar && (
        <AnnouncementBar 
          announcementText={layoutConfig.announcementText}
          supportPhone={layoutConfig.supportPhoneNumber}
        />
      )}

      {/* Promotional Banner & Coupon Bar (Managed from Admin Promotion Manager) */}
      <PromotionalTopBar
        promotions={promotions}
        onApplyCoupon={(code) => {
          const promo = promotions.find((p) => p.couponCode === code);
          if (promo) {
            setAppliedDiscount(promo.discountPercentage);
          }
        }}
      />

      {/* Main Navigation (Pure White / Ivory, Centered Menu, Mega Menu Dropdowns) */}
      <Navbar
        cart={cart}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenReels={() => {
          if (reelProducts.length > 0) {
            handleOpenReel(reelProducts[0]);
          } else {
            const el = document.getElementById('kids-products-section');
            el?.scrollIntoView({ behavior: 'smooth' });
          }
        }}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        selectedAgeGroup={selectedAgeGroup}
        onSelectAgeGroup={setSelectedAgeGroup}
        categories={categories}
        showCategoryFilter={layoutConfig.showCategoryFilter}
        onOpenAbout={() => setIsAboutOpen(true)}
        whatsappNumber={layoutConfig.whatsappNumber}
        onOpenTracking={() => handleOpenTracking()}
        brandLogoText={layoutConfig.headerLogoText || 'BACHPAN PK'}
        brandTagline={layoutConfig.headerTagline || 'PREMIUM KIDS WEAR'}
        isDarkMode={isCustomerDark}
      />

      {/* 2. Wix Juniper Romp: Triple-Split Vertical Hero Section with Floating Minimalist Card (100vh) */}
      {layoutConfig.showHeroBanner && (
        <HeroBanner
          layoutType={layoutConfig.heroLayoutType || 'triple_split'}
          imageUrl={layoutConfig.heroBannerImageUrl}
          videoUrl={layoutConfig.heroBannerVideoUrl}
          mediaType={layoutConfig.heroBannerMediaType || 'image'}
          containerHeight={layoutConfig.heroBannerHeight || 740}
          mediaScale={layoutConfig.heroBannerScale || 100}
          focalPoint={layoutConfig.heroBannerFocalPoint || 'center'}
          tagText={layoutConfig.heroBannerTag}
          headline={layoutConfig.heroBannerTitle}
          subtitle={layoutConfig.heroBannerSubtitle}
          column1Image={layoutConfig.heroColumn1ImageUrl}
          column2Image={layoutConfig.heroColumn2ImageUrl}
          column3Image={layoutConfig.heroColumn3ImageUrl}
          floatingKicker={layoutConfig.heroFloatingCardKicker}
          floatingTitle={layoutConfig.heroFloatingCardTitle}
          floatingSubtitle={layoutConfig.heroFloatingCardSubtitle}
          floatingCtaText={layoutConfig.heroFloatingCardCta}
          floatingTagline={layoutConfig.heroFloatingCardTagline}
          isDarkMode={isCustomerDark}
          onExploreReels={() => {
            if (reelProducts.length > 0) {
              handleOpenReel(reelProducts[0]);
            } else {
              const el = document.getElementById('kids-products-section');
              el?.scrollIntoView({ behavior: 'smooth' });
            }
          }}
          onExploreProducts={() => {
            const el = document.getElementById('explore-by-age-section') || document.getElementById('kids-products-section');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
        />
      )}

      {/* Trust Banner Bar (COD Available, PostEx Tracking, Real Photo on Request) */}
      {(layoutConfig.showTrustBadgesBar ?? true) && (
        <TrustBadgesBar
          onOpenTracking={handleOpenTracking}
          whatsappNumber={layoutConfig.whatsappNumber}
          badge1Title={layoutConfig.trustBadge1Title}
          badge1Subtitle={layoutConfig.trustBadge1Subtitle}
          badge2Title={layoutConfig.trustBadge2Title}
          badge2Subtitle={layoutConfig.trustBadge2Subtitle}
          badge3Title={layoutConfig.trustBadge3Title}
          badge3Subtitle={layoutConfig.trustBadge3Subtitle}
          isDarkMode={isCustomerDark}
        />
      )}

      {/* Monetization: Native Partner Atelier Sponsor Slot (When Position is 'after_hero') */}
      {layoutConfig.showSponsorBanner && layoutConfig.sponsorBannerPosition === 'after_hero' && (
        <SponsorBannerSlot
          badge={layoutConfig.sponsorBannerBadge}
          title={layoutConfig.sponsorBannerTitle}
          subtitle={layoutConfig.sponsorBannerSubtitle}
          ctaText={layoutConfig.sponsorBannerCtaText}
          link={layoutConfig.sponsorBannerLink}
          imageUrl={layoutConfig.sponsorBannerImageUrl}
          isDarkMode={isCustomerDark}
        />
      )}

      {/* Wix Juniper Romp Block 2: Minimalist Explore By Age Grid (3 Tall Vertical Cards with Diagonal Arrow) */}
      {(layoutConfig.showExploreByAge ?? true) && (
        <div id="explore-by-age-section">
          <ExploreByAgeSection
            title={layoutConfig.exploreByAgeTitle}
            subtitle={layoutConfig.exploreByAgeSubtitle}
            babyImage={layoutConfig.exploreBabyImageUrl}
            toddlerImage={layoutConfig.exploreToddlerImageUrl}
            kidsImage={layoutConfig.exploreKidsImageUrl}
            isDarkMode={isCustomerDark}
            onSelectAge={(ageLabel, categoryFallback) => {
              setSelectedAgeGroup(ageLabel);
              setSelectedCategory(categoryFallback);
              const el = document.getElementById('kids-products-section');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
          />
        </div>
      )}

      {/* Wix Juniper Romp Block 3: Independent Highlight Showcase (Large Centered Garment + Geometric Star Bullets) */}
      {(layoutConfig.showHighlightShowcase ?? true) && (
        <ProductHighlightShowcase
          featuredProduct={products.find(p => p.id === 'kid-1' || p.category === 'Newborn') || products[0]}
          title={layoutConfig.highlightShowcaseTitle}
          subtitle={layoutConfig.highlightShowcaseSubtitle}
          kicker={layoutConfig.highlightShowcaseKicker}
          price={layoutConfig.highlightShowcasePrice}
          imageUrl={layoutConfig.highlightShowcaseImageUrl}
          bullet1={layoutConfig.highlightBullet1}
          bullet2={layoutConfig.highlightBullet2}
          bullet3={layoutConfig.highlightBullet3}
          bullet4={layoutConfig.highlightBullet4}
          isDarkMode={isCustomerDark}
          onOpenProduct={(p) => handleOpenLightbox(p || products[0])}
        />
      )}

      {/* Wix Juniper Romp Block 4: Asymmetric Photography Collage Grid ("Parent Favorites / Loved Right Now") */}
      {(layoutConfig.showParentFavoritesCollage ?? true) && (
        <ParentFavoritesCollage
          products={products}
          onOpenProduct={handleOpenLightbox}
          title={layoutConfig.parentFavoritesTitle}
          subtitle={layoutConfig.parentFavoritesSubtitle}
          hero1Url={layoutConfig.parentFavoritesHero1Url}
          hero1Title={layoutConfig.parentFavoritesHero1Title}
          hero2Url={layoutConfig.parentFavoritesHero2Url}
          hero2Title={layoutConfig.parentFavoritesHero2Title}
          isDarkMode={isCustomerDark}
        />
      )}

      {/* Prominent On-Screen New Arrivals Curated Discovery Section (Boys, Girls, Newborn) */}
      {(layoutConfig.showNewArrivalsSection ?? true) && (
        <NewArrivalsSection
          products={products}
          onSelectCategory={(cat) => setSelectedCategory(cat)}
          selectedCategory={selectedCategory}
          onOpenLightbox={handleOpenLightbox}
          title={layoutConfig.newArrivalsSectionTitle}
          isDarkMode={isCustomerDark}
        />
      )}

      {/* Clean Category Grid ("Shop By Category" clean square images side-by-side with no borders) */}
      {(layoutConfig.showCategoryGrid ?? true) && (
        <CategoryGrid 
          onSelectCategory={(cat) => setSelectedCategory(cat)}
          title={layoutConfig.categorySectionTitle}
          isDarkMode={isCustomerDark}
        />
      )}

      {/* 3. Watch Kids Outfit Reels Row (Dynamic CMS Toggle) */}
      {layoutConfig.showVideoReels && reelProducts.length > 0 && (
        <section className={`border-b py-16 transition-colors duration-300 ${
          isCustomerDark ? 'bg-[#151518] border-neutral-800 text-white' : 'bg-[#FAF9F8] border-neutral-200 text-neutral-900'
        }`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className={`flex flex-col sm:flex-row items-baseline justify-between mb-8 pb-4 border-b gap-2 ${
              isCustomerDark ? 'border-neutral-800' : 'border-neutral-200/80'
            }`}>
              <div>
                <p className="text-[10px] uppercase tracking-[0.25em] font-light text-neutral-400">
                  Outfits In Motion
                </p>
                <h3 className={`font-serif text-2xl sm:text-3xl font-normal tracking-wide mt-0.5 ${
                  isCustomerDark ? 'text-white' : 'text-neutral-900'
                }`}>
                  Trending Outfit Reels (9:16)
                </h3>
              </div>

              <button
                onClick={() => handleOpenReel(reelProducts[0])}
                className="text-xs uppercase tracking-[0.18em] font-light text-neutral-800 hover:text-black flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Play All Reels</span>
                <ArrowRight className="w-3.5 h-3.5 stroke-[1.5]" />
              </button>
            </div>

            {/* Reel thumbnail row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4 sm:gap-6">
              {reelProducts.map((prod) => (
                <div
                  key={prod.id}
                  onClick={() => handleOpenReel(prod)}
                  className="group relative aspect-[9/14] overflow-hidden bg-neutral-900 cursor-pointer shadow-xs"
                >
                  <img
                    src={prod.imageUrl}
                    alt={prod.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
                  
                  {/* Play badge */}
                  <div className="absolute top-2.5 right-2.5 bg-white/90 text-neutral-900 p-1.5 rounded-full shadow-xs">
                    <Film className="w-3 h-3 stroke-[1.5]" />
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <span className="text-[9px] uppercase tracking-wider text-neutral-300 block truncate">{prod.category}</span>
                    <p className="text-[11px] font-normal truncate leading-tight mt-0.5">{prod.title}</p>
                    <p className="font-serif text-xs text-white mt-1">
                      Rs. {prod.price.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Monetization: Native Partner Atelier Sponsor Slot (When Position is 'after_categories') */}
      {layoutConfig.showSponsorBanner && (layoutConfig.sponsorBannerPosition === 'after_categories' || !layoutConfig.sponsorBannerPosition) && (
        <SponsorBannerSlot
          badge={layoutConfig.sponsorBannerBadge}
          title={layoutConfig.sponsorBannerTitle}
          subtitle={layoutConfig.sponsorBannerSubtitle}
          ctaText={layoutConfig.sponsorBannerCtaText}
          link={layoutConfig.sponsorBannerLink}
          imageUrl={layoutConfig.sponsorBannerImageUrl}
          isDarkMode={isCustomerDark}
        />
      )}

      {/* 4. DEDICATED CATEGORY SHOWCASE SECTIONS (Clean Multi-Column Grid, Cashmirino Style) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24 py-16">
        
        {/* Boys Wear Category Section */}
        {layoutConfig.showBoysWearSection && boysWearProducts.length > 0 && (
          <section className="space-y-8">
            <div className="flex flex-col sm:flex-row items-baseline justify-between border-b border-neutral-200 pb-5 gap-2">
              <div>
                <p className="text-[10px] uppercase tracking-[0.25em] font-light text-neutral-400">
                  Boys Atelier · 1 - 6 Years
                </p>
                <h3 className={`font-serif text-2xl sm:text-3xl font-normal tracking-wide mt-0.5 ${
                  isCustomerDark ? 'text-white' : 'text-neutral-900'
                }`}>
                  Festive Baba Suits & Waistcoats
                </h3>
              </div>
              <button
                onClick={() => {
                  setSelectedCategory('Boys Wear');
                  const el = document.getElementById('kids-products-section');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`text-xs uppercase tracking-[0.18em] font-light flex items-center gap-1.5 cursor-pointer ${
                  isCustomerDark ? 'text-neutral-300 hover:text-white' : 'text-neutral-800 hover:text-black'
                }`}
              >
                <span>View All Boys</span>
                <ArrowRight className="w-3.5 h-3.5 stroke-[1.5]" />
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-10">
              {boysWearProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onOpenLightbox={handleOpenLightbox}
                  onAddToCart={handleAddToCart}
                  onQuickBuy={handleQuickBuy}
                  onOpenReel={handleOpenReel}
                  onOpenSizeGuide={handleOpenSizeGuide}
                  isDarkMode={isCustomerDark}
                />
              ))}
            </div>
          </section>
        )}

        {/* Separator between Boys and Girls */}
        {layoutConfig.showBoysWearSection && boysWearProducts.length > 0 && 
         ((layoutConfig.showGirlsWearSection && girlsWearProducts.length > 0) ||
          (layoutConfig.showToddlerSection && toddlerProducts.length > 0) ||
          (layoutConfig.showNewbornSection && newbornProducts.length > 0)) && (
          <div className="w-full border-t border-neutral-200 dark:border-neutral-800" />
        )}

        {/* Girls Wear Category Section */}
        {layoutConfig.showGirlsWearSection && girlsWearProducts.length > 0 && (
          <section className="space-y-8">
            <div className={`flex flex-col sm:flex-row items-baseline justify-between border-b pb-5 gap-2 ${
              isCustomerDark ? 'border-neutral-800' : 'border-neutral-200'
            }`}>
              <div>
                <p className="text-[10px] uppercase tracking-[0.25em] font-light text-neutral-400">
                  Girls Atelier · 2 - 8 Years
                </p>
                <h3 className={`font-serif text-2xl sm:text-3xl font-normal tracking-wide mt-0.5 ${
                  isCustomerDark ? 'text-white' : 'text-neutral-900'
                }`}>
                  Party Frocks & Festive Lawn (Guriya Special)
                </h3>
              </div>
              <button
                onClick={() => {
                  setSelectedCategory('Girls Wear');
                  const el = document.getElementById('kids-products-section');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`text-xs uppercase tracking-[0.18em] font-light flex items-center gap-1.5 cursor-pointer ${
                  isCustomerDark ? 'text-neutral-300 hover:text-white' : 'text-neutral-800 hover:text-black'
                }`}
              >
                <span>View All Girls</span>
                <ArrowRight className="w-3.5 h-3.5 stroke-[1.5]" />
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-10">
              {girlsWearProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onOpenLightbox={handleOpenLightbox}
                  onAddToCart={handleAddToCart}
                  onQuickBuy={handleQuickBuy}
                  onOpenReel={handleOpenReel}
                  onOpenSizeGuide={handleOpenSizeGuide}
                  isDarkMode={isCustomerDark}
                />
              ))}
            </div>
          </section>
        )}

        {/* Separator between Girls and Toddler */}
        {layoutConfig.showGirlsWearSection && girlsWearProducts.length > 0 && 
         ((layoutConfig.showToddlerSection && toddlerProducts.length > 0) ||
          (layoutConfig.showNewbornSection && newbornProducts.length > 0)) && (
          <div className="w-full border-t border-neutral-200 dark:border-neutral-800" />
        )}

        {/* Toddler Outfits Category Section */}
        {layoutConfig.showToddlerSection && toddlerProducts.length > 0 && (
          <section className="space-y-8">
            <div className={`flex flex-col sm:flex-row items-baseline justify-between border-b pb-5 gap-2 ${
              isCustomerDark ? 'border-neutral-800' : 'border-neutral-200'
            }`}>
              <div>
                <p className="text-[10px] uppercase tracking-[0.25em] font-light text-neutral-400">
                  Toddler Coordinates · 1 - 3 Years
                </p>
                <h3 className={`font-serif text-2xl sm:text-3xl font-normal tracking-wide mt-0.5 ${
                  isCustomerDark ? 'text-white' : 'text-neutral-900'
                }`}>
                  Playwear Dungarees & Day Sets
                </h3>
              </div>
              <button
                onClick={() => {
                  setSelectedCategory('Toddler Outfits');
                  const el = document.getElementById('kids-products-section');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`text-xs uppercase tracking-[0.18em] font-light flex items-center gap-1.5 cursor-pointer ${
                  isCustomerDark ? 'text-neutral-300 hover:text-white' : 'text-neutral-800 hover:text-black'
                }`}
              >
                <span>View All Toddler</span>
                <ArrowRight className="w-3.5 h-3.5 stroke-[1.5]" />
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-10">
              {toddlerProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onOpenLightbox={handleOpenLightbox}
                  onAddToCart={handleAddToCart}
                  onQuickBuy={handleQuickBuy}
                  onOpenReel={handleOpenReel}
                  onOpenSizeGuide={handleOpenSizeGuide}
                  isDarkMode={isCustomerDark}
                />
              ))}
            </div>
          </section>
        )}

        {/* Separator between Toddler and Newborn */}
        {layoutConfig.showToddlerSection && toddlerProducts.length > 0 && 
         layoutConfig.showNewbornSection && newbornProducts.length > 0 && (
          <div className="w-full border-t border-neutral-200 dark:border-neutral-800" />
        )}

        {/* Newborn Essentials Category Section */}
        {layoutConfig.showNewbornSection && newbornProducts.length > 0 && (
          <section className="space-y-8">
            <div className={`flex flex-col sm:flex-row items-baseline justify-between border-b pb-5 gap-2 ${
              isCustomerDark ? 'border-neutral-800' : 'border-neutral-200'
            }`}>
              <div>
                <p className="text-[10px] uppercase tracking-[0.25em] font-light text-neutral-400">
                  Newborn Essentials · 0 - 12 Months
                </p>
                <h3 className={`font-serif text-2xl sm:text-3xl font-normal tracking-wide mt-0.5 ${
                  isCustomerDark ? 'text-white' : 'text-neutral-900'
                }`}>
                  100% Organic Soft Cotton Rompers & Gifts
                </h3>
              </div>
              <button
                onClick={() => {
                  setSelectedCategory('Newborn Essentials');
                  const el = document.getElementById('kids-products-section');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`text-xs uppercase tracking-[0.18em] font-light flex items-center gap-1.5 cursor-pointer ${
                  isCustomerDark ? 'text-neutral-300 hover:text-white' : 'text-neutral-800 hover:text-black'
                }`}
              >
                <span>View All Newborn</span>
                <ArrowRight className="w-3.5 h-3.5 stroke-[1.5]" />
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-10">
              {newbornProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onOpenLightbox={handleOpenLightbox}
                  onAddToCart={handleAddToCart}
                  onQuickBuy={handleQuickBuy}
                  onOpenReel={handleOpenReel}
                  onOpenSizeGuide={handleOpenSizeGuide}
                  isDarkMode={isCustomerDark}
                />
              ))}
            </div>
          </section>
        )}

      </div>

      {/* Monetization: Native Partner Atelier Sponsor Slot (When Position is 'before_catalog') */}
      {layoutConfig.showSponsorBanner && layoutConfig.sponsorBannerPosition === 'before_catalog' && (
        <SponsorBannerSlot
          badge={layoutConfig.sponsorBannerBadge}
          title={layoutConfig.sponsorBannerTitle}
          subtitle={layoutConfig.sponsorBannerSubtitle}
          ctaText={layoutConfig.sponsorBannerCtaText}
          link={layoutConfig.sponsorBannerLink}
          imageUrl={layoutConfig.sponsorBannerImageUrl}
          isDarkMode={isCustomerDark}
        />
      )}

      {/* Subtle 1px Horizontal Line Separator before All Products Catalog */}
      <div className="w-full border-b border-neutral-200 dark:border-neutral-800" />

      {/* 5. Main Product Catalog Grid Section (Multi-Column 3 or 4 Column Grid) */}
      {layoutConfig.showAllProductsGrid && (
        <section id="kids-products-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex-1 w-full">
          <div className="flex flex-col sm:flex-row items-baseline justify-between gap-4 pb-8 border-b border-neutral-200">
            <div>
              <p className="text-[10px] uppercase tracking-[0.25em] font-light text-neutral-400">
                {selectedCategory.toLowerCase().includes('new arrival') ? 'Curated Atelier Drops' : 'The Complete Wardrobe'}
              </p>
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-neutral-900 font-normal tracking-wide mt-0.5">
                {selectedCategory === 'All' ? "All Children's Outfits" : selectedCategory}
              </h2>
              <div className="flex items-center gap-2 flex-wrap mt-1">
                <p className="text-xs text-neutral-500 font-light">
                  Displaying {filteredProducts.length} verified outfits with Nationwide Cash on Delivery (COD)
                </p>
                {selectedCategory !== 'All' && (
                  <button
                    type="button"
                    onClick={() => setSelectedCategory('All')}
                    className="inline-flex items-center gap-1 text-[11px] text-amber-900 bg-amber-100/70 hover:bg-amber-200/80 px-2.5 py-0.5 rounded-full border border-amber-300 transition-colors cursor-pointer"
                  >
                    <span>Filtered: {selectedCategory}</span>
                    <span className="font-bold ml-1 text-xs leading-none">×</span>
                    <span className="underline ml-0.5 font-normal">Show All</span>
                  </button>
                )}

                {maxBudgetFilter !== null && maxBudgetFilter < maxCatalogPrice && (
                  <button
                    type="button"
                    onClick={() => setMaxBudgetFilter(null)}
                    className="inline-flex items-center gap-1 text-[11px] text-[#C89299] bg-[#C89299]/15 hover:bg-[#C89299]/25 px-2.5 py-0.5 rounded-full border border-[#C89299]/30 transition-colors cursor-pointer"
                  >
                    <span>Budget: Up to Rs. {maxBudgetFilter.toLocaleString()}</span>
                    <span className="font-bold ml-1 text-xs leading-none">×</span>
                    <span className="underline ml-0.5 font-normal">Clear</span>
                  </button>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => handleOpenSizeGuide()}
                className="text-xs uppercase tracking-wider text-neutral-800 hover:text-black flex items-center gap-1.5 border border-neutral-300 hover:border-black px-3.5 py-1.5 transition-colors cursor-pointer bg-white"
              >
                <Ruler className="w-3.5 h-3.5 stroke-[1.5]" />
                <span>Size Chart & Guide</span>
              </button>
              <div className="text-xs uppercase tracking-wider text-neutral-400 font-light hidden sm:block">
                Pakistani Rupees (PKR) · Express TCS / Trax
              </div>
            </div>
          </div>

          {/* DYNAMIC AGE-GROUP QUICK FILTER ROW */}
          <div className="pt-4 pb-2 flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-neutral-400 mr-1">
                Filter by Age:
              </span>
              {['All Ages', '0-3M', '3-6M', '1-2Y', '3-5Y', '5Y+'].map((age) => {
                const isSelected = selectedAgeGroup === age;
                return (
                  <button
                    key={age}
                    type="button"
                    onClick={() => setSelectedAgeGroup(age)}
                    className={`px-3 py-1 text-xs tracking-wider uppercase font-medium transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-neutral-900 text-white shadow-2xs font-semibold'
                        : 'bg-white hover:bg-neutral-100 text-neutral-700 hover:text-black border border-neutral-200'
                    }`}
                  >
                    {age}
                  </button>
                );
              })}
            </div>

            {selectedAgeGroup !== 'All Ages' && (
              <button
                type="button"
                onClick={() => setSelectedAgeGroup('All Ages')}
                className="text-[11px] text-neutral-500 hover:text-black uppercase tracking-wider underline cursor-pointer"
              >
                Clear Age Filter ({selectedAgeGroup})
              </button>
            )}
          </div>

          {/* PRICE RANGE BUDGET SLIDER FILTER */}
          <PriceRangeFilter
            minPrice={minCatalogPrice}
            maxPrice={maxCatalogPrice}
            currentMaxPrice={effectiveMaxBudget}
            onChangeMaxPrice={(val) => setMaxBudgetFilter(val >= maxCatalogPrice ? null : val)}
            onReset={() => setMaxBudgetFilter(null)}
            matchingCount={filteredProducts.length}
            totalCount={categoryAndAgeMatchedProducts.length}
            isDarkMode={isCustomerDark}
          />

          {/* Clean Multi-Column Product Grid */}
          {filteredProducts.length === 0 ? (
            <div className="py-24 text-center space-y-4">
              <p className="font-serif text-xl text-neutral-700 dark:text-neutral-300">No outfits found matching your filters.</p>
              <p className="text-xs text-neutral-400 font-light">Try adjusting your budget slider, category filter, or age selection.</p>
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setSelectedAgeGroup('All Ages');
                  setMaxBudgetFilter(null);
                  setSearchQuery('');
                }}
                className="px-6 py-2.5 border border-neutral-900 dark:border-neutral-200 text-neutral-900 dark:text-white hover:bg-neutral-900 hover:text-white dark:hover:bg-white dark:hover:text-neutral-950 text-xs uppercase tracking-widest transition-colors cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-10 pt-10">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onOpenLightbox={handleOpenLightbox}
                  onAddToCart={handleAddToCart}
                  onQuickBuy={handleQuickBuy}
                  onOpenReel={handleOpenReel}
                  onOpenSizeGuide={handleOpenSizeGuide}
                  isDarkMode={isCustomerDark}
                />
              ))}
            </div>
          )}
        </section>
      )}

      {/* Production Customer Footer */}
      <Footer 
        whatsappNumber={layoutConfig.whatsappNumber}
        supportPhoneNumber={layoutConfig.supportPhoneNumber}
        onOpenSizeGuide={handleOpenSizeGuide}
        onOpenTracking={() => handleOpenTracking()}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onProceedToCheckout={handleProceedToCheckout}
        whatsappNumber={layoutConfig.whatsappNumber}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cart={cart}
        discount={appliedDiscount}
        onOrderSuccess={handleOrderSuccess}
      />

      {/* Order Success Confirmation */}
      <OrderSuccessModal
        isOpen={isSuccessModalOpen}
        order={submittedOrder}
        onClose={() => setIsSuccessModalOpen(false)}
        whatsappNumber={layoutConfig.whatsappNumber}
        onTrackOrder={handleOpenTracking}
      />

      {/* 9:16 Video Reel Player Modal */}
      <ReelPlayerModal
        isOpen={isReelModalOpen}
        onClose={() => setIsReelModalOpen(false)}
        products={products}
        initialProduct={selectedReelProduct}
        onAddToCart={handleAddToCart}
        onQuickBuy={handleQuickBuy}
      />

      {/* Product Details Modal (Lightbox with High-Res View & Description) */}
      <ProductLightboxModal
        isOpen={isLightboxOpen}
        product={selectedLightboxProduct}
        onClose={() => setIsLightboxOpen(false)}
        onAddToCart={handleAddToCart}
        onQuickBuy={handleQuickBuy}
        onOpenReel={handleOpenReel}
        whatsappNumber={layoutConfig.whatsappNumber}
        onOpenSizeGuide={handleOpenSizeGuide}
        onReviewSubmitted={handleReviewSubmitted}
        globalSizeChartImageUrl={layoutConfig.globalSizeChartImageUrl}
      />

      {/* Children's Clothing Size Guide Modal */}
      <SizeGuideModal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
        product={sizeGuideProduct}
        whatsappNumber={layoutConfig.whatsappNumber}
      />

      {/* Order Tracking Modal */}
      <OrderTrackingModal
        isOpen={isTrackingOpen}
        onClose={() => setIsTrackingOpen(false)}
        initialOrderId={trackingOrderId}
        whatsappNumber={layoutConfig.whatsappNumber}
      />

      {/* About Us Philosophy Modal */}
      <AboutUsModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
      />

      {/* Floating WhatsApp Concierge Button for Mothers */}
      <FloatingWhatsAppButton 
        phoneNumber={layoutConfig.whatsappNumber}
        buttonLabel={layoutConfig.whatsappButtonLabel}
        defaultMessage={layoutConfig.whatsappWelcomeMessage}
      />

      {/* Floating Back to Top Button (appears when scrolled > 500px) */}
      <BackToTopButton threshold={500} />
    </div>
  );
}
