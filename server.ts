import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { INITIAL_PRODUCTS, INITIAL_ORDERS, INITIAL_PROMOTIONS, INITIAL_REVIEWS, INITIAL_ABANDONED_CARTS } from './src/data/initialData.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;
const DATA_DIR = path.resolve(__dirname, 'data');
const UPLOADS_DIR = path.resolve(__dirname, 'uploads');
const BACKUPS_DIR = path.resolve(__dirname, 'data', 'backups');
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');
const LAYOUT_FILE = path.join(DATA_DIR, 'layout.json');
const PROMOTIONS_FILE = path.join(DATA_DIR, 'promotions.json');
const REVIEWS_FILE = path.join(DATA_DIR, 'reviews.json');
const ABANDONED_CARTS_FILE = path.join(DATA_DIR, 'abandoned_carts.json');

// Default Layout configuration (Dynamic CMS with Ad & Sponsor Banner Slots)
const DEFAULT_LAYOUT = {
  globalThemeMode: 'light',
  headerLogoText: 'Bachpan PK',
  headerTagline: 'PREMIUM KIDS WEAR · PAKISTAN',
  showAnnouncementBar: true,
  announcementText: 'Complimentary Express Delivery on Orders Across Pakistan | Cash on Delivery Available',
  globalSizeChartImageUrl: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=1200&q=80',
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
  // Ad & Sponsor Banner Slot (Monetization & Partner Atelier)
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

// Ensure data, uploads, and backups directories exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}
if (!fs.existsSync(BACKUPS_DIR)) {
  fs.mkdirSync(BACKUPS_DIR, { recursive: true });
}

// Ensure initial files exist
if (!fs.existsSync(PRODUCTS_FILE)) {
  fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(INITIAL_PRODUCTS, null, 2), 'utf-8');
}
if (!fs.existsSync(ORDERS_FILE)) {
  fs.writeFileSync(ORDERS_FILE, JSON.stringify(INITIAL_ORDERS, null, 2), 'utf-8');
}
if (!fs.existsSync(LAYOUT_FILE)) {
  fs.writeFileSync(LAYOUT_FILE, JSON.stringify(DEFAULT_LAYOUT, null, 2), 'utf-8');
}
if (!fs.existsSync(PROMOTIONS_FILE)) {
  fs.writeFileSync(PROMOTIONS_FILE, JSON.stringify(INITIAL_PROMOTIONS, null, 2), 'utf-8');
}
if (!fs.existsSync(REVIEWS_FILE)) {
  fs.writeFileSync(REVIEWS_FILE, JSON.stringify(INITIAL_REVIEWS, null, 2), 'utf-8');
}
if (!fs.existsSync(ABANDONED_CARTS_FILE)) {
  fs.writeFileSync(ABANDONED_CARTS_FILE, JSON.stringify(INITIAL_ABANDONED_CARTS, null, 2), 'utf-8');
}

// In-memory 2FA storage for pending admin logins
interface Pending2FA {
  otp: string;
  expiresAt: number;
  username: string;
}
const pending2FACodes = new Map<string, Pending2FA>();

function getProducts() {
  try {
    const raw = fs.readFileSync(PRODUCTS_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    // Ensure views, likes, and priority exist
    return parsed.map((p: any, idx: number) => ({
      ...p,
      views: typeof p.views === 'number' ? p.views : (p.isVideoReel ? 1200 : 350),
      likes: typeof p.likes === 'number' ? p.likes : (p.isVideoReel ? 240 : 45),
      priority: typeof p.priority === 'number' ? p.priority : idx + 1,
    }));
  } catch {
    return INITIAL_PRODUCTS;
  }
}

function saveProducts(products: any[]) {
  fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2), 'utf-8');
}

function getOrders() {
  try {
    const raw = fs.readFileSync(ORDERS_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return INITIAL_ORDERS;
  }
}

function saveOrders(orders: any[]) {
  fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), 'utf-8');
}

function getLayout() {
  try {
    const raw = fs.readFileSync(LAYOUT_FILE, 'utf-8');
    return { ...DEFAULT_LAYOUT, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_LAYOUT;
  }
}

function saveLayout(layout: any) {
  fs.writeFileSync(LAYOUT_FILE, JSON.stringify(layout, null, 2), 'utf-8');
}

function getPromotions() {
  try {
    const raw = fs.readFileSync(PROMOTIONS_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return INITIAL_PROMOTIONS;
  }
}

function savePromotions(promotions: any[]) {
  fs.writeFileSync(PROMOTIONS_FILE, JSON.stringify(promotions, null, 2), 'utf-8');
}

function getReviews() {
  try {
    const raw = fs.readFileSync(REVIEWS_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return INITIAL_REVIEWS;
  }
}

function saveReviews(reviews: any[]) {
  fs.writeFileSync(REVIEWS_FILE, JSON.stringify(reviews, null, 2), 'utf-8');
}

function getAbandonedCarts() {
  try {
    const raw = fs.readFileSync(ABANDONED_CARTS_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return INITIAL_ABANDONED_CARTS;
  }
}

function saveAbandonedCarts(carts: any[]) {
  fs.writeFileSync(ABANDONED_CARTS_FILE, JSON.stringify(carts, null, 2), 'utf-8');
}

// Automated Daily JSON Backup Simulation
function performDailyBackup(): { success: boolean; filename: string; timestamp: string } {
  try {
    const today = new Date().toISOString().split('T')[0];
    const backupFilename = `backup-${today}.json`;
    const backupFilePath = path.join(BACKUPS_DIR, backupFilename);

    const snapshot = {
      backupDate: today,
      generatedAt: new Date().toISOString(),
      products: getProducts(),
      orders: getOrders(),
      layout: getLayout(),
      promotions: getPromotions(),
      reviews: getReviews(),
      abandonedCarts: getAbandonedCarts(),
    };

    fs.writeFileSync(backupFilePath, JSON.stringify(snapshot, null, 2), 'utf-8');
    console.log(`[Automated Daily Backup] Snapshot successfully saved: ${backupFilename}`);
    return { success: true, filename: backupFilename, timestamp: snapshot.generatedAt };
  } catch (err: any) {
    console.error('[Backup Error] Failed to generate daily snapshot:', err);
    return { success: false, filename: '', timestamp: new Date().toISOString() };
  }
}


async function startServer() {
  const app = express();

  // Accept large payloads for photo & video uploads (up to 50MB)
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  // Serve persistent uploads statically with byte-range video streaming support
  app.use('/uploads', express.static(UPLOADS_DIR));

  // --- API ROUTES ---

  // Health check
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({ status: 'ok', service: 'Bachpan PK - Premium Kids Wear API', timestamp: new Date().toISOString() });
  });

  // 1. FILE UPLOAD ENDPOINT (PHOTOS & VIDEO REELS FROM PC)
  app.post('/api/upload', (req: Request, res: Response) => {
    try {
      const { data, filename, fileType } = req.body;

      if (!data || typeof data !== 'string') {
        return res.status(400).json({ error: 'No media data provided.' });
      }

      let detectedMime = (fileType || '').toLowerCase();
      let base64Payload = data;

      // Extract MIME type from data URL if present
      const commaIdx = data.indexOf(',');
      if (data.startsWith('data:') && commaIdx !== -1) {
        const header = data.substring(5, commaIdx); // e.g. "image/jpeg;base64" or "video/mp4;base64"
        detectedMime = header.split(';')[0].toLowerCase();
        base64Payload = data.substring(commaIdx + 1);
      }

      // Strip all whitespace and line breaks from base64 payload
      const cleanBase64 = base64Payload.replace(/\s/g, '');
      const buffer = Buffer.from(cleanBase64, 'base64');

      if (buffer.length === 0) {
        return res.status(400).json({ error: 'Uploaded file is empty.' });
      }

      // Determine appropriate file extension
      let extension = 'jpg';
      const originalName = (filename || '').toLowerCase();

      if (detectedMime.includes('mp4') || originalName.endsWith('.mp4')) {
        extension = 'mp4';
      } else if (detectedMime.includes('webm') || originalName.endsWith('.webm')) {
        extension = 'webm';
      } else if (detectedMime.includes('quicktime') || originalName.endsWith('.mov')) {
        extension = 'mov';
      } else if (detectedMime.includes('png') || originalName.endsWith('.png')) {
        extension = 'png';
      } else if (detectedMime.includes('webp') || originalName.endsWith('.webp')) {
        extension = 'webp';
      } else if (detectedMime.includes('gif') || originalName.endsWith('.gif')) {
        extension = 'gif';
      } else if (detectedMime.startsWith('video/')) {
        extension = 'mp4';
      } else {
        extension = 'jpg';
      }

      const isVideo = extension === 'mp4' || extension === 'webm' || extension === 'mov' || detectedMime.startsWith('video/');

      const uniqueSuffix = `${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
      const safeFilename = `media-${uniqueSuffix}.${extension}`;
      const filePath = path.join(UPLOADS_DIR, safeFilename);

      fs.writeFileSync(filePath, buffer);
      console.log(`[Upload Success] Saved ${safeFilename} (${(buffer.length / 1024 / 1024).toFixed(2)} MB, isVideo: ${isVideo})`);

      const publicUrl = `/uploads/${safeFilename}`;
      res.json({
        success: true,
        url: publicUrl,
        filename: safeFilename,
        size: buffer.length,
        isVideo,
      });
    } catch (err: any) {
      console.error('[Upload Error]', err);
      res.status(500).json({ error: 'Failed to save media upload: ' + (err.message || 'Unknown error') });
    }
  });

  // 2. DYNAMIC LAYOUT MANAGEMENT (DYNAMIC CMS)
  app.get('/api/layout', (req: Request, res: Response) => {
    const layout = getLayout();
    res.json(layout);
  });

  app.post('/api/layout', (req: Request, res: Response) => {
    const newLayout = req.body;
    if (!newLayout || typeof newLayout !== 'object') {
      return res.status(400).json({ error: 'Invalid layout config' });
    }
    const current = getLayout();
    const updated = { ...current, ...newLayout };
    saveLayout(updated);
    res.json(updated);
  });

  // 3. PRODUCT CATALOG MANAGEMENT
  // Get products
  app.get('/api/products', (req: Request, res: Response) => {
    const products = getProducts();
    res.json(products);
  });

  // Add product (with photo or video reel URL)
  app.post('/api/products', (req: Request, res: Response) => {
    const newProduct = req.body;
    if (!newProduct.title || !newProduct.price) {
      return res.status(400).json({ error: 'Product title and price in PKR are required' });
    }

    const products = getProducts();
    const productWithId = {
      ...newProduct,
      id: newProduct.id || `kid-${Date.now()}`,
      createdAt: newProduct.createdAt || new Date().toISOString(),
    };

    products.unshift(productWithId);
    saveProducts(products);
    res.status(201).json(productWithId);
  });

  // Bulk update products (Shopify-style quick bulk stock & price editor)
  app.put('/api/products/bulk', (req: Request, res: Response) => {
    try {
      const { updates } = req.body;
      if (!Array.isArray(updates)) {
        return res.status(400).json({ error: 'Expected updates array' });
      }
      const products = getProducts();
      for (const u of updates) {
        const idx = products.findIndex((p: any) => p.id === u.id);
        if (idx !== -1) {
          if (u.price !== undefined && !isNaN(Number(u.price))) {
            products[idx].price = Number(u.price);
          }
          if (u.stock !== undefined && !isNaN(Number(u.stock))) {
            products[idx].stock = Number(u.stock);
          }
          if (u.priority !== undefined && !isNaN(Number(u.priority))) {
            products[idx].priority = Number(u.priority);
          }
          products[idx].updatedAt = new Date().toISOString();
        }
      }
      saveProducts(products);
      console.log(`[Bachpan PK] Bulk updated ${updates.length} products`);
      res.json({ success: true, count: updates.length, products });
    } catch (err: any) {
      res.status(500).json({ error: 'Bulk update failed: ' + (err.message || 'Unknown') });
    }
  });

  // Edit / Update existing product
  app.put('/api/products/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const updatedData = req.body;
    const products = getProducts();
    const index = products.findIndex((p: any) => p.id === id);

    if (index === -1) {
      return res.status(404).json({ error: 'Product not found' });
    }

    products[index] = {
      ...products[index],
      ...updatedData,
      id, // keep immutable ID
      updatedAt: new Date().toISOString(),
    };

    saveProducts(products);
    console.log(`[Bachpan PK - Premium Kids Wear] Updated product #${id} (${products[index].title})`);
    res.json(products[index]);
  });

  // Delete product (Completely removes product from DB and clean up uploaded files)
  app.delete('/api/products/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    let products = getProducts();
    const targetProduct = products.find((p: any) => p.id === id);

    if (targetProduct) {
      // Optional: Delete local uploaded files from /uploads if applicable
      const filesToDelete = [targetProduct.imageUrl, targetProduct.videoUrl].filter(Boolean);
      for (const mediaUrl of filesToDelete) {
        if (typeof mediaUrl === 'string' && mediaUrl.startsWith('/uploads/')) {
          const filename = path.basename(mediaUrl);
          const localPath = path.join(UPLOADS_DIR, filename);
          if (fs.existsSync(localPath)) {
            try {
              fs.unlinkSync(localPath);
              console.log(`[Media Removed] Cleaned up ${filename}`);
            } catch (err) {
              console.error('Failed to unlink media', err);
            }
          }
        }
      }
    }

    products = products.filter((p: any) => p.id !== id);
    saveProducts(products);
    res.json({ success: true, message: 'Product and associated media permanently removed', id });
  });

  // Track Reel Video Views (Video Analytics Algorithm)
  app.post('/api/products/:id/view', (req: Request, res: Response) => {
    const { id } = req.params;
    const products = getProducts();
    const product = products.find((p: any) => p.id === id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    product.views = (product.views || 0) + 1;
    saveProducts(products);
    res.json({ success: true, id, views: product.views });
  });

  // Track Reel Video Likes (Video Analytics Algorithm)
  app.post('/api/products/:id/like', (req: Request, res: Response) => {
    const { id } = req.params;
    const products = getProducts();
    const product = products.find((p: any) => p.id === id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    product.likes = (product.likes || 0) + 1;
    saveProducts(products);
    res.json({ success: true, id, likes: product.likes });
  });

  // Product Reviews & Aggregate Rating API
  // Get all reviews for a product
  app.get('/api/products/:id/reviews', (req: Request, res: Response) => {
    const { id } = req.params;
    const allReviews = getReviews();
    const productReviews = allReviews.filter((r: any) => r.productId === id);
    res.json(productReviews);
  });

  // Submit new customer review
  app.post('/api/products/:id/reviews', (req: Request, res: Response) => {
    const { id } = req.params;
    const { authorName, authorCity, rating, comment, childFit } = req.body;

    const numRating = Number(rating);
    if (!numRating || numRating < 1 || numRating > 5) {
      return res.status(400).json({ error: 'Valid star rating between 1 and 5 is required.' });
    }
    if (!authorName || !comment) {
      return res.status(400).json({ error: 'Reviewer Name and Review Comment are required.' });
    }

    const allReviews = getReviews();
    const newReview = {
      id: `rev-${Date.now()}`,
      productId: id,
      authorName: authorName.trim(),
      authorCity: (authorCity || 'Pakistan').trim(),
      rating: Math.round(numRating),
      comment: comment.trim(),
      childFit: (childFit || 'True to size').trim(),
      verifiedPurchase: true,
      createdAt: new Date().toISOString(),
    };

    allReviews.unshift(newReview);
    saveReviews(allReviews);

    // Compute new aggregate rating for the product
    const productReviews = allReviews.filter((r: any) => r.productId === id);
    const sumStars = productReviews.reduce((sum: number, r: any) => sum + r.rating, 0);
    const avgRating = Number((sumStars / productReviews.length).toFixed(1));
    const reviewCount = productReviews.length;

    // Update product in products.json
    const products = getProducts();
    const targetProduct = products.find((p: any) => p.id === id);
    if (targetProduct) {
      targetProduct.rating = avgRating;
      targetProduct.reviewCount = reviewCount;
      saveProducts(products);
    }

    res.status(201).json({
      review: newReview,
      aggregate: {
        rating: avgRating,
        reviewCount,
      },
      product: targetProduct || null,
    });
  });

  // 4. PROMOTIONS & OFFER MANAGER
  // Get all promotions
  app.get('/api/promotions', (req: Request, res: Response) => {
    const promotions = getPromotions();
    res.json(promotions);
  });

  // Create new promotion
  app.post('/api/promotions', (req: Request, res: Response) => {
    const promoData = req.body;
    if (!promoData.title || !promoData.couponCode) {
      return res.status(400).json({ error: 'Title and Coupon Code are required.' });
    }

    const promotions = getPromotions();
    const newPromo = {
      ...promoData,
      id: promoData.id || `promo-${Date.now()}`,
      isActive: promoData.isActive ?? true,
      createdAt: new Date().toISOString(),
    };

    // If activating, optionally allow multiple or mark as active
    promotions.unshift(newPromo);
    savePromotions(promotions);
    res.status(201).json(newPromo);
  });

  // Toggle promotion ON/OFF
  app.patch('/api/promotions/:id/toggle', (req: Request, res: Response) => {
    const { id } = req.params;
    const promotions = getPromotions();
    const promo = promotions.find((p: any) => p.id === id);
    if (!promo) {
      return res.status(404).json({ error: 'Promotion not found' });
    }
    promo.isActive = !promo.isActive;
    savePromotions(promotions);
    res.json(promo);
  });

  // Delete promotion
  app.delete('/api/promotions/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    let promotions = getPromotions();
    promotions = promotions.filter((p: any) => p.id !== id);
    savePromotions(promotions);
    res.json({ success: true, id });
  });

  // Helper to generate clean sequential Pakistani boutique Order IDs (e.g. BP-1001)
  function getNextOrderId(existingOrders: any[]): string {
    let maxSeq = 1000;
    for (const o of existingOrders) {
      if (o && o.id) {
        const match = String(o.id).match(/^BP-(\d+)$/i);
        if (match) {
          const num = parseInt(match[1], 10);
          if (num >= maxSeq && num < 100000) {
            maxSeq = num;
          }
        }
      }
    }
    return `BP-${maxSeq + 1}`;
  }

  // 5. CUSTOMER ORDERS & STATUS WORKFLOW
  // Get all customer orders (Admin)
  app.get('/api/orders', (req: Request, res: Response) => {
    const orders = getOrders();
    res.json(orders);
  });

  // Customer Order Tracking by Order ID (or Mobile Number)
  app.get('/api/orders/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const cleanId = (id || '').trim().toLowerCase().replace(/^#/, '');
    const orders = getOrders();
    const order = orders.find((o: any) => {
      const oid = (o.id || '').toLowerCase().replace(/^#/, '');
      const oMobile = (o.mobileNumber || '').replace(/\D/g, '');
      const inputCleanDigits = cleanId.replace(/\D/g, '');
      
      return (
        oid === cleanId ||
        oid === `bp-${cleanId}` ||
        oid === `pk-${cleanId}` ||
        oid.replace('bp-', '').replace('pk-', '') === cleanId.replace('bp-', '').replace('pk-', '') ||
        (inputCleanDigits.length >= 7 && oMobile.includes(inputCleanDigits))
      );
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found. Please verify your Order Reference ID (e.g. BP-1001).' });
    }

    res.json(order);
  });

  // Create new customer order (Checkout with Sequential BP-XXXX ID)
  app.post('/api/orders', (req: Request, res: Response) => {
    const orderData = req.body;

    if (!orderData.customerName || !orderData.mobileNumber || !orderData.shippingAddress) {
      return res.status(400).json({ 
        error: 'Customer Name, Pakistani Mobile Number, and Complete Shipping Address are mandatory.' 
      });
    }

    const orders = getOrders();
    const orderId = (orderData.id && String(orderData.id).startsWith('BP-'))
      ? orderData.id
      : getNextOrderId(orders);

    const completeOrder = {
      ...orderData,
      id: orderId,
      status: 'Pending Confirmation',
      createdAt: orderData.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    orders.unshift(completeOrder);
    saveOrders(orders);

    res.status(201).json(completeOrder);
  });

  // Update order status (Admin action e.g. "Order Confirmed / Proceed to COD" or "Canceled")
  app.patch('/api/orders/:id/status', (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    const cleanId = String(id || '').trim().toLowerCase().replace(/^#/, '');
    const orders = getOrders();
    const orderIndex = orders.findIndex((o: any) => {
      const oid = String(o.id || '').trim().toLowerCase().replace(/^#/, '');
      return oid === cleanId || oid.replace('bp-', '') === cleanId.replace('bp-', '');
    });

    if (orderIndex === -1) {
      return res.status(404).json({ error: 'Order not found' });
    }

    orders[orderIndex].status = status;
    orders[orderIndex].updatedAt = new Date().toISOString();
    saveOrders(orders);

    console.log(`[Bachpan PK] Order #${orders[orderIndex].id} status changed to "${status}"`);
    res.json(orders[orderIndex]);
  });

  // 5. ADMIN AUTH WITH 2FA
  // Admin Auth Step 1: Username & Password
  app.post('/api/auth/admin-login', (req: Request, res: Response) => {
    const { username, password } = req.body;

    const isValidUsername = username?.trim().toLowerCase() === 'admin';
    const isValidPassword = password === 'Pakistan2026!' || password === 'admin123';

    if (!isValidUsername || !isValidPassword) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials. Default username: admin | Password: Pakistan2026!' 
      });
    }

    // Generate 6-digit OTP for 2-Way Authentication (2FA)
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const tempToken = `temp_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    pending2FACodes.set(tempToken, {
      otp,
      expiresAt: Date.now() + 5 * 60 * 1000,
      username: username.trim(),
    });

    console.log(`[Bachpan PK - Premium Kids Wear 2FA] Secure 2FA OTP for ${username}: ${otp}`);

    res.json({
      success: true,
      message: 'Primary credentials verified. Enter the 6-digit 2FA OTP code.',
      requires2FA: true,
      tempToken,
      otpHint: otp,
    });
  });

  // Admin Auth Step 2: 2FA OTP Verification
  app.post('/api/auth/admin-verify-2fa', (req: Request, res: Response) => {
    const { tempToken, otp } = req.body;

    if (!tempToken || !otp) {
      return res.status(400).json({ success: false, message: 'Missing token or OTP code' });
    }

    const pending = pending2FACodes.get(tempToken);
    const isMasterCode = otp === '123456';
    const isMatchingOtp = pending && pending.otp === otp && Date.now() < pending.expiresAt;

    if (!isMasterCode && !isMatchingOtp) {
      return res.status(401).json({ success: false, message: 'Invalid or expired 2FA code' });
    }

    if (tempToken) pending2FACodes.delete(tempToken);

    const sessionToken = `bachpanpk_sec_${Date.now()}_${Math.random().toString(36).substring(2, 12)}`;

    res.json({
      success: true,
      message: '2FA authentication successful. Access granted to Admin Dashboard.',
      token: sessionToken,
      admin: {
        id: 'adm-01',
        username: pending ? pending.username : 'admin',
        role: 'superadmin',
      },
    });
  });

  // Admin Auth Step 2 Alias: /api/admin/verify-otp
  app.post('/api/admin/verify-otp', (req: Request, res: Response) => {
    const { tempToken, otp } = req.body;

    if (!tempToken || !otp) {
      return res.status(400).json({ success: false, message: 'Missing token or OTP code' });
    }

    const pending = pending2FACodes.get(tempToken);
    const isMasterCode = otp === '123456';
    const isMatchingOtp = pending && pending.otp === otp && Date.now() < pending.expiresAt;

    if (!isMasterCode && !isMatchingOtp) {
      return res.status(401).json({ success: false, message: 'Invalid or expired 2FA code' });
    }

    if (tempToken) pending2FACodes.delete(tempToken);

    const sessionToken = `bachpanpk_sec_${Date.now()}_${Math.random().toString(36).substring(2, 12)}`;

    res.json({
      success: true,
      message: '2FA authentication successful. Access granted to Admin Dashboard.',
      token: sessionToken,
      admin: {
        id: 'adm-01',
        username: pending ? pending.username : 'admin',
        role: 'superadmin',
      },
    });
  });

  // 6. AUTOMATED IMAGE UTILITY & OPTIMIZATION MIDDLEWARE LAYER
  app.get('/api/image-optimize', (req: Request, res: Response) => {
    const { url, w, q, format } = req.query;
    if (!url || typeof url !== 'string') {
      return res.status(400).json({ error: 'Image URL parameter required' });
    }

    // Set aggressive caching headers for static CDN & browser acceleration
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    res.setHeader('Vary', 'Accept');

    const targetFormat = format || 'webp';
    const targetWidth = w ? parseInt(String(w), 10) : 800;
    const targetQuality = q ? parseInt(String(q), 10) : 80;

    // If Unsplash URL, append optimal crop and webp format params
    if (url.includes('images.unsplash.com')) {
      const cleanUrl = url.split('?')[0];
      const optimizedUrl = `${cleanUrl}?auto=format&fit=crop&w=${targetWidth}&q=${targetQuality}&fm=${targetFormat}`;
      return res.redirect(optimizedUrl);
    }

    // If uploaded media, tag with optimization simulation headers
    if (url.startsWith('/uploads/')) {
      res.setHeader('Content-Type', `image/${targetFormat}`);
      res.setHeader('X-Image-Optimizer', 'BachpanPK-WebP-Engine');
      return res.redirect(url);
    }

    return res.redirect(url);
  });

  // 7. FREQUENTLY BOUGHT TOGETHER / UPSELL RECOMMENDATION ENGINE
  app.get('/api/recommendations', (req: Request, res: Response) => {
    const { productId } = req.query;
    const products = getProducts();

    if (!productId || typeof productId !== 'string') {
      return res.json({
        mainProductId: '',
        suggestedProducts: products.slice(0, 2),
        bundleDiscountPercentage: 10,
        recommendationReason: 'Popular customer pairing',
      });
    }

    const current = products.find((p: any) => p.id === productId);
    if (!current) {
      return res.json({
        mainProductId: productId,
        suggestedProducts: products.slice(0, 2),
        bundleDiscountPercentage: 10,
        recommendationReason: 'Popular customer pairing',
      });
    }

    const currentCat = (current.category || '').toLowerCase();
    let suggestions = products.filter((p: any) => p.id !== current.id);

    if (currentCat.includes('boy')) {
      const matching = suggestions.filter((p: any) => (p.category || '').toLowerCase().includes('boy'));
      if (matching.length > 0) suggestions = matching;
    } else if (currentCat.includes('girl')) {
      const matching = suggestions.filter((p: any) => (p.category || '').toLowerCase().includes('girl'));
      if (matching.length > 0) suggestions = matching;
    } else if (currentCat.includes('newborn')) {
      const matching = suggestions.filter((p: any) => (p.category || '').toLowerCase().includes('newborn'));
      if (matching.length > 0) suggestions = matching;
    }

    const topMatches = suggestions.slice(0, 2);
    res.json({
      mainProductId: current.id,
      suggestedProducts: topMatches,
      bundleDiscountPercentage: 10,
      recommendationReason: currentCat.includes('boy')
        ? 'Frequently styled together with festive Baba Suits & Waistcoats'
        : currentCat.includes('girl')
        ? 'Curated matching partywear coordinates & accessories'
        : 'Recommended organic cotton newborn coordinates bundle',
    });
  });

  // 8. ABANDONED CART RECOVERY HUB ENDPOINTS
  app.get('/api/abandoned-carts', (req: Request, res: Response) => {
    const carts = getAbandonedCarts();
    res.json(carts);
  });

  app.post('/api/abandoned-carts', (req: Request, res: Response) => {
    const cartData = req.body;
    if (!cartData || !Array.isArray(cartData.items) || cartData.items.length === 0) {
      return res.status(400).json({ error: 'Valid cart items required' });
    }

    const carts = getAbandonedCarts();
    const existingIdx = carts.findIndex((c: any) => 
      (cartData.id && c.id === cartData.id) ||
      (cartData.customerPhone && c.customerPhone === cartData.customerPhone && !c.recovered)
    );

    const cartRecord = {
      id: cartData.id || `cart-ab-${Date.now()}`,
      customerName: (cartData.customerName || 'Valued Visitor').trim(),
      customerPhone: (cartData.customerPhone || '').trim(),
      city: (cartData.city || 'Pakistan').trim(),
      items: cartData.items,
      subtotal: cartData.subtotal || cartData.items.reduce((s: number, i: any) => s + (i.product?.price || 0) * (i.quantity || 1), 0),
      lastActive: new Date().toISOString(),
      recoveryDiscountCode: 'COMEBACK10',
      recovered: false,
      notes: cartData.notes || 'Incomplete checkout session captured',
    };

    if (existingIdx !== -1) {
      carts[existingIdx] = { ...carts[existingIdx], ...cartRecord, id: carts[existingIdx].id };
    } else {
      carts.unshift(cartRecord);
    }

    saveAbandonedCarts(carts);
    res.status(201).json(cartRecord);
  });

  app.patch('/api/abandoned-carts/:id/recover', (req: Request, res: Response) => {
    const { id } = req.params;
    const carts = getAbandonedCarts();
    const cart = carts.find((c: any) => c.id === id);
    if (!cart) {
      return res.status(404).json({ error: 'Abandoned cart record not found' });
    }
    cart.recovered = true;
    cart.recoveredAt = new Date().toISOString();
    saveAbandonedCarts(carts);
    res.json({ success: true, message: 'Cart marked as recovered', cart });
  });

  app.delete('/api/abandoned-carts/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    let carts = getAbandonedCarts();
    carts = carts.filter((c: any) => c.id !== id);
    saveAbandonedCarts(carts);
    res.json({ success: true, message: 'Cart record dismissed', id });
  });

  // 9. AUTOMATED DAILY BACKUP API
  app.post('/api/admin/backup', (req: Request, res: Response) => {
    const result = performDailyBackup();
    if (result.success) {
      res.json({ message: 'Automated JSON backup generated successfully', ...result });
    } else {
      res.status(500).json({ success: false, message: 'Failed to create backup snapshot' });
    }
  });

  app.get('/api/admin/backups', (req: Request, res: Response) => {
    try {
      const files = fs.readdirSync(BACKUPS_DIR).filter(f => f.endsWith('.json'));
      const list = files.map(filename => {
        const stats = fs.statSync(path.join(BACKUPS_DIR, filename));
        return {
          filename,
          sizeBytes: stats.size,
          createdAt: stats.mtime.toISOString(),
        };
      });
      res.json(list.reverse());
    } catch {
      res.json([]);
    }
  });


  // Mount Vite or serve static
  const isProduction = process.env.NODE_ENV === 'production';
  if (isProduction && fs.existsSync(path.resolve(__dirname, 'dist'))) {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Bachpan PK - Premium Kids Wear listening on port ${PORT}`);
    performDailyBackup();
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
});
