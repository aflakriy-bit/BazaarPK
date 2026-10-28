export interface Product {
  id: string;
  title: string;
  description: string;
  price: number; // in PKR (Rs.)
  originalPrice?: number; // for discount display
  category: string; // Dropdown 1: Main Category (e.g. 'Baby Girl', 'Baby Boy', 'Girls', 'Boys', 'Newborn')
  subCategory?: string; // Dropdown 2: Dynamic Sub-Category (e.g. 'Dresses & Frocks', 'Rompers', 'Sets', 'Outerwear', etc.)
  ageGroup?: string; // e.g. "0-6 Months", "1-2 Years", "3-5 Years", "6-8 Years"
  sizes?: string[]; // e.g. ["Newborn", "0-3M", "3-6M", "6-12M", "1-2Y", "2-3Y", "3-4Y"]
  imageUrl: string;
  videoUrl?: string; // local or cloud reel video URL
  isVideoReel?: boolean;
  stock: number;
  rating: number;
  reviewCount: number;
  featured?: boolean;
  badge?: string;
  fabric?: string; // e.g. "100% Breathable Cotton", "Soft Chiffon", "Pure Lawn"
  careInstructions?: string;
  views?: number; // Video reel views tracking
  likes?: number; // Video reel likes tracking
  priority?: number; // Display Weight / Priority (1 = top of page, 2, 3...)
  sizeChart?: { size: string; age: string; chest: string; length: string }[];
  createdAt: string;
}

export interface CategoryHierarchy {
  id: string;
  name: string;
  subCategories: string[];
}

export const MAIN_CATEGORIES: CategoryHierarchy[] = [
  {
    id: 'baby-girl',
    name: 'Baby Girl',
    subCategories: [
      'Dresses & Rompers',
      'Sets & Outfits',
      'Knitwear & Sweaters',
      'Sleepwear & Onesies',
      'Accessories & Headbands'
    ]
  },
  {
    id: 'baby-boy',
    name: 'Baby Boy',
    subCategories: [
      'Rompers & Bodysuits',
      'Sets & Overalls',
      'Knitwear & Cardigans',
      'Outerwear & Jackets',
      'Accessories & Booties'
    ]
  },
  {
    id: 'girls',
    name: 'Girls',
    subCategories: [
      'Dresses & Frocks',
      'Tops & Blouses',
      'Skirts & Bottoms',
      'Festive & Party Wear',
      'Knitwear & Cardigans',
      'Accessories'
    ]
  },
  {
    id: 'boys',
    name: 'Boys',
    subCategories: [
      'Shirts & Polos',
      'Pants & Chinos',
      'Baba Suits & Festive',
      'Knitwear & Sweaters',
      'Outerwear & Jackets',
      'Accessories'
    ]
  },
  {
    id: 'newborn',
    name: 'Newborn',
    subCategories: [
      'Gift Sets & Hampers',
      'Kimono Rompers',
      'Swaddles & Blankets',
      'Caps, Mittens & Booties',
      'Organic Essentials'
    ]
  }
];

export interface Promotion {
  id: string;
  title: string;
  description: string;
  discountPercentage: number;
  couponCode: string;
  bannerImageUrl?: string;
  themeColor?: 'pink' | 'emerald' | 'amber' | 'purple' | 'rose';
  badgeText?: string;
  isActive: boolean;
  createdAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize?: string;
}

export type PaymentMethod = 'COD' | 'EASYPAISA_JAZZCASH' | 'BANK_TRANSFER';

export type OrderStatus = 
  | 'Pending Confirmation' 
  | 'Order Confirmed / Proceed to COD' 
  | 'Confirmed'
  | 'Processing'
  | 'Dispatched' 
  | 'Shipped'
  | 'Delivered' 
  | 'Canceled'
  | 'Cancelled';

export interface OrderItem {
  productId: string;
  title: string;
  price: number;
  quantity: number;
  imageUrl: string;
  selectedSize?: string;
}

export interface Order {
  id: string;
  customerName: string;
  mobileNumber: string;
  whatsappNumber?: string;
  province: string;
  city: string;
  shippingAddress: string;
  nearestLandmark?: string;
  orderNotes?: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  totalAmount: number; // in PKR
  paymentMethod: PaymentMethod;
  paymentReference?: string;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

export interface AdminUser {
  id: string;
  username: string;
  role: 'superadmin' | 'manager';
}

export interface AuthResponse {
  success: boolean;
  message: string;
  requires2FA?: boolean;
  tempToken?: string;
  token?: string;
  admin?: AdminUser;
  otpHint?: string;
}

export interface AdBannerSlot {
  id: string;
  enabled: boolean;
  sponsorName: string;
  badgeText: string;
  headline: string;
  description: string;
  callToActionText: string;
  targetUrl: string;
  bannerImageUrl: string;
  position: 'after_hero' | 'after_categories' | 'before_catalog';
}

export interface AbandonedCart {
  id: string;
  customerName?: string;
  customerPhone?: string;
  city?: string;
  items: CartItem[];
  subtotal: number;
  lastActive: string;
  recoveryDiscountCode?: string;
  recovered: boolean;
  notes?: string;
}

export interface ProductRecommendation {
  mainProductId: string;
  suggestedProduct: Product;
  discountPercentage?: number;
  bundleSavings?: number;
  reason?: string;
}

export interface StoreLayoutConfig {
  // Global Customer Frontend Theme Management
  globalThemeMode?: 'light' | 'dark'; // 'light' (Soft Ivory Pastel #FDFBF7) or 'dark' (Midnight Charcoal #121214)

  // Header & Brand Identity CMS
  headerLogoText?: string;
  headerTagline?: string;
  showAnnouncementBar: boolean;
  announcementText?: string; // Dynamic Header Announcement Ticker
  globalSizeChartImageUrl?: string; // Standard kids size chart image uploaded by Admin
  
  // Hero Banner Dynamic Media & Cropping Controller (Juniper Romp Triple-Split Hero)
  heroLayoutType?: 'triple_split' | 'single';
  heroBannerImageUrl?: string; // Dynamic Homepage Hero Background Image (Single mode)
  heroBannerVideoUrl?: string; // Dynamic Homepage Background Video (HTML5)
  heroBannerMediaType?: 'image' | 'video'; // 'image' or 'video'
  heroBannerHeight?: number; // Container Height in px (e.g. 500 to 850, default: 720)
  heroBannerScale?: number; // Media Scale/Zoom in % (e.g. 100 to 150, default: 100)
  heroBannerFocalPoint?: 'top' | 'center' | 'bottom' | 'left' | 'right'; // Focal point cropper alignment
  heroBannerTag?: string; // Season Kicker / Tag
  heroBannerTitle?: string; // Headline in Cormorant Garamond
  heroBannerSubtitle?: string; // Description text overlay

  // Wix Juniper Romp: Triple-Split Vertical Hero 3 Individual Columns & Floating Card
  heroColumn1ImageUrl?: string; // Column 1 portrait image (Baby / Romper)
  heroColumn2ImageUrl?: string; // Column 2 portrait image (Toddler / Knitwear)
  heroColumn3ImageUrl?: string; // Column 3 portrait image (Playful child / Festive)
  heroFloatingCardKicker?: string; // Floating Card brand tag
  heroFloatingCardTitle?: string; // Floating Card headline e.g. "Made For Pure Play"
  heroFloatingCardSubtitle?: string; // Floating Card descriptive body text
  heroFloatingCardCta?: string; // Pill-shaped black CTA button e.g. "Shop All Products"
  heroFloatingCardTagline?: string; // Extra trust line

  // Wix Juniper Romp: Minimalist Explore By Age Grid (3 Tall Vertical Cards with Diagonal Arrow)
  showExploreByAge?: boolean;
  exploreByAgeTitle?: string;
  exploreByAgeSubtitle?: string;
  exploreBabyImageUrl?: string;
  exploreToddlerImageUrl?: string;
  exploreKidsImageUrl?: string;

  // Wix Juniper Romp: Independent Highlight Showcase (Large Centered Garment + Geometric Star Bullets)
  showHighlightShowcase?: boolean;
  highlightShowcaseKicker?: string;
  highlightShowcaseTitle?: string;
  highlightShowcaseSubtitle?: string;
  highlightShowcasePrice?: number;
  highlightShowcaseImageUrl?: string;
  highlightBullet1?: string;
  highlightBullet2?: string;
  highlightBullet3?: string;
  highlightBullet4?: string;

  // Wix Juniper Romp: Asymmetric Photography Collage Grid ("Parent Favorites / Loved Right Now")
  showParentFavoritesCollage?: boolean;
  parentFavoritesTitle?: string;
  parentFavoritesSubtitle?: string;
  parentFavoritesHero1Url?: string;
  parentFavoritesHero1Title?: string;
  parentFavoritesHero2Url?: string;
  parentFavoritesHero2Title?: string;
  
  // Trust Badges Bar Settings
  showTrustBadgesBar?: boolean; // 3-column Trust Banner Bar (COD Available, PostEx Tracking, Real Photo)
  trustBadge1Title?: string;
  trustBadge1Subtitle?: string;
  trustBadge2Title?: string;
  trustBadge2Subtitle?: string;
  trustBadge3Title?: string;
  trustBadge3Subtitle?: string;

  // Category Grid & New Arrivals
  showCategoryGrid?: boolean;
  categorySectionTitle?: string;
  showNewArrivalsSection?: boolean;
  newArrivalsSectionTitle?: string;

  // Catalog Section Visibility Toggles
  showHeroBanner: boolean;
  showVideoReels: boolean;
  showCategoryFilter: boolean;
  showBoysWearSection: boolean;
  showGirlsWearSection: boolean;
  showToddlerSection: boolean;
  showNewbornSection: boolean;
  showAllProductsGrid: boolean;

  // Ad & Sponsor Banner Slot (Monetization & Partner Atelier)
  showSponsorBanner?: boolean;
  sponsorBannerBadge?: string;
  sponsorBannerTitle?: string;
  sponsorBannerSubtitle?: string;
  sponsorBannerCtaText?: string;
  sponsorBannerLink?: string;
  sponsorBannerImageUrl?: string;
  sponsorBannerPosition?: 'after_hero' | 'after_categories' | 'before_catalog';

  // WhatsApp & Support Floating Box
  whatsappNumber?: string;
  whatsappButtonLabel?: string;
  whatsappWelcomeMessage?: string;
  supportPhoneNumber?: string;
  maintenanceMode: boolean; // Master toggle for Customer Under Construction lock
}

export const DEFAULT_LAYOUT_CONFIG: StoreLayoutConfig = {
  globalThemeMode: 'light',
  headerLogoText: 'Bachpan PK',
  headerTagline: 'PREMIUM KIDS WEAR · PAKISTAN',
  showAnnouncementBar: true,
  announcementText: 'Complimentary Express Delivery on Orders Across Pakistan | Cash on Delivery Available',
  globalSizeChartImageUrl: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=1200&q=80',
  
  // Hero settings
  heroLayoutType: 'triple_split',
  heroBannerImageUrl: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=2000&q=85',
  heroBannerVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  heroBannerMediaType: 'image',
  heroBannerHeight: 740,
  heroBannerScale: 100,
  heroBannerFocalPoint: 'center',
  heroBannerTag: 'Tiny ones, big firsts',
  heroBannerTitle: 'Thoughtfully Made For Childhood Memories',
  heroBannerSubtitle: 'Hand-tailored festive Baba Suits, fairy-tale chiffon frocks, and organic newborn essentials. Crafted for delicate skin with breathable Pakistani cottons and fine silks.',

  // Wix Juniper Romp: Triple-Split Hero defaults (high-res portrait photography)
  heroColumn1ImageUrl: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=900&q=85',
  heroColumn2ImageUrl: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=900&q=85',
  heroColumn3ImageUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=900&q=85',
  heroFloatingCardKicker: 'BACHPAN PK · ATELIER',
  heroFloatingCardTitle: 'Made For Pure Play',
  heroFloatingCardSubtitle: 'Effortless, organic kids essentials thoughtfully crafted for every crawl, step, and joyful jump.',
  heroFloatingCardCta: 'Shop All Products',
  heroFloatingCardTagline: '100% Breathable Cottons · Nationwide Cash on Delivery',

  // Wix Juniper Romp: Explore By Age Grid
  showExploreByAge: true,
  exploreByAgeTitle: 'Explore By Age',
  exploreByAgeSubtitle: 'Curated silhouettes engineered specifically for every milestone',
  exploreBabyImageUrl: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=900&q=85',
  exploreToddlerImageUrl: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=900&q=85',
  exploreKidsImageUrl: 'https://images.unsplash.com/photo-1543332164-6e82f355badc?auto=format&fit=crop&w=900&q=85',

  // Wix Juniper Romp: Independent Highlight Showcase
  showHighlightShowcase: true,
  highlightShowcaseKicker: 'ATELIER SIGNATURE SHOWCASE',
  highlightShowcaseTitle: 'Heirloom Ribbed Knit Romper & Bonnet Set',
  highlightShowcaseSubtitle: 'Woven from 100% combed organic cotton for sensitive newborn and toddler skin',
  highlightShowcasePrice: 2950,
  highlightShowcaseImageUrl: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1000&q=85',
  highlightBullet1: '100% Organic Cotton — Butter-soft combed weave gentle on delicate skin',
  highlightBullet2: 'Hypoallergenic Dyes — Kind to sensitive skin, zero harsh chemicals',
  highlightBullet3: 'Play-Proof Durability — Double-stitched seams designed for high activity',
  highlightBullet4: 'Nickel-Free Snaps — Hassle-free 10-second diaper changes',

  // Wix Juniper Romp: Asymmetric Collage Grid
  showParentFavoritesCollage: true,
  parentFavoritesTitle: 'Loved Right Now',
  parentFavoritesSubtitle: 'Parent favorites curated for everyday comfort and celebratory moments',
  parentFavoritesHero1Url: 'https://images.unsplash.com/photo-1471286174890-9c112ffca56a?auto=format&fit=crop&w=1200&q=85',
  parentFavoritesHero1Title: 'Everyday Wonder · Made for unrestricted movement',
  parentFavoritesHero2Url: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=1000&q=85',
  parentFavoritesHero2Title: 'Festive Jacquards & Pure Embroidered Silks',

  maintenanceMode: false,
  showHeroBanner: true,
  showTrustBadgesBar: true,
  trustBadge1Title: 'COD Available',
  trustBadge1Subtitle: 'Pay when it arrives at your doorstep',
  trustBadge2Title: 'PostEx Tracking',
  trustBadge2Subtitle: 'Follow every delivery step live',
  trustBadge3Title: 'Real Photo on Request',
  trustBadge3Subtitle: 'See your outfit before it ships',
  showCategoryGrid: true,
  categorySectionTitle: 'Shop by category',
  showNewArrivalsSection: true,
  newArrivalsSectionTitle: 'New Arrivals · Fresh In',
  showVideoReels: true,
  showCategoryFilter: true,
  showBoysWearSection: true,
  showGirlsWearSection: true,
  showToddlerSection: true,
  showNewbornSection: true,
  showAllProductsGrid: true,
  showSponsorBanner: false,
  sponsorBannerBadge: 'Partner Atelier Selection',
  sponsorBannerTitle: 'Handcrafted Silver Keepsakes & Heirloom Rattles',
  sponsorBannerSubtitle: 'Certified 925 sterling silver gifts, pacifier clips, and baby bangles presented in royal silk gift boxes.',
  sponsorBannerCtaText: 'Explore Collection',
  sponsorBannerLink: '#kids-products-section',
  sponsorBannerImageUrl: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=1200&q=80',
  sponsorBannerPosition: 'after_categories',
  whatsappNumber: '03001234567',
  whatsappButtonLabel: 'Chat on WhatsApp',
  whatsappWelcomeMessage: 'Assalam-o-Alaikum! I have a question about Bachpan PK collection.',
  supportPhoneNumber: '0300-1234567',
};

export interface ProductReview {
  id: string;
  productId: string;
  authorName: string;
  authorCity?: string;
  rating: number; // 1 to 5
  comment: string;
  childFit?: string;
  verifiedPurchase: boolean;
  createdAt: string;
}


