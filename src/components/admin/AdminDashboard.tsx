import React, { useState, useEffect, useRef } from 'react';
import { 
  ShoppingBag, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  Truck, 
  Phone, 
  MessageCircle, 
  Search, 
  Plus, 
  Trash2, 
  Database, 
  LogOut, 
  ExternalLink, 
  Copy, 
  Check, 
  Printer,
  XCircle,
  RefreshCw,
  Layout,
  Tag,
  AlertTriangle,
  AlertCircle,
  BarChart3,
  X,
  ArrowRight,
  Edit3,
  FileText,
  Send,
  Ruler,
  Upload,
  Power,
  Sun,
  Moon,
  Layers,
  Save,
  Volume2,
  Sparkles,
  RotateCcw,
  Download,
  UserCheck,
  ShieldCheck,
  Film,
  Image as ImageIcon
} from 'lucide-react';
import { Order, Product, OrderStatus, StoreLayoutConfig, DEFAULT_LAYOUT_CONFIG, Promotion } from '../../types';
import { api } from '../../services/api';
import { ProductUploadModal } from '../ProductUploadModal';
import { VideoAnalyticsTab } from './VideoAnalyticsTab';
import { PromotionManagerTab } from './PromotionManagerTab';
import { CustomerHistoryModal } from './CustomerHistoryModal';
import { LiveVisualCustomizer } from './LiveVisualCustomizer';
import { AbandonedCartsTab } from './AbandonedCartsTab';

interface AdminDashboardProps {
  onLogout: () => void;
  onOpenStorefront: () => void;
  onOpenUploadProduct?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onLogout,
  onOpenStorefront,
  onOpenUploadProduct: _onOpenUploadProduct,
}) => {
  // Navigation Tabs (Shopify-style tabs)
  const [activeTab, setActiveTab] = useState<'orders' | 'bulk_inventory' | 'products' | 'live_customizer' | 'layout' | 'analytics' | 'promotions' | 'database_guide' | 'abandoned_carts'>('orders');
  
  // Theme Toggle: Modern Dark / Light Mode Switch
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    try {
      return localStorage.getItem('bachpanpk_admin_theme') === 'dark';
    } catch {
      return false;
    }
  });

  const toggleTheme = () => {
    const nextTheme = !darkMode;
    setDarkMode(nextTheme);
    try {
      localStorage.setItem('bachpanpk_admin_theme', nextTheme ? 'dark' : 'light');
    } catch {
      // ignore
    }
  };

  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [layoutConfig, setLayoutConfig] = useState<StoreLayoutConfig>(DEFAULT_LAYOUT_CONFIG);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [catalogFilter, setCatalogFilter] = useState<'all' | 'low_stock'>('all');
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [selectedOrderForSlip, setSelectedOrderForSlip] = useState<Order | null>(null);
  const [selectedOrderForInvoice, setSelectedOrderForInvoice] = useState<Order | null>(null);
  const [copiedInvoice, setCopiedInvoice] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);
  const [uploadingSizeChart, setUploadingSizeChart] = useState(false);
  const [sizeChartUploadError, setSizeChartUploadError] = useState<string | null>(null);
  const [selectedCustomerForHistory, setSelectedCustomerForHistory] = useState<{ name: string; phone: string } | null>(null);

  // Dynamic Homepage Hero Banner Settings State
  const [heroTagText, setHeroTagText] = useState(layoutConfig.heroBannerTag || 'Tiny ones, big firsts');
  const [heroTitleText, setHeroTitleText] = useState(layoutConfig.heroBannerTitle || 'Thoughtfully Made For Childhood Memories');
  const [heroSubtitleText, setHeroSubtitleText] = useState(layoutConfig.heroBannerSubtitle || 'Hand-tailored festive Baba Suits, fairy-tale chiffon frocks, and organic newborn essentials. Crafted for delicate skin with breathable Pakistani cottons and fine silks.');
  const [heroImageUrl, setHeroImageUrl] = useState(layoutConfig.heroBannerImageUrl || 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=2000&q=85');
  const [heroVideoUrl, setHeroVideoUrl] = useState(layoutConfig.heroBannerVideoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4');
  const [heroMediaType, setHeroMediaType] = useState<'image' | 'video'>(layoutConfig.heroBannerMediaType || 'image');
  const [heroHeight, setHeroHeight] = useState<number>(layoutConfig.heroBannerHeight || 680);
  const [heroScale, setHeroScale] = useState<number>(layoutConfig.heroBannerScale || 100);
  const [heroFocalPoint, setHeroFocalPoint] = useState<'top' | 'center' | 'bottom' | 'left' | 'right'>(layoutConfig.heroBannerFocalPoint || 'center');
  const [uploadingHeroBanner, setUploadingHeroBanner] = useState(false);
  const [heroBannerError, setHeroBannerError] = useState<string | null>(null);
  const [savingHeroBanner, setSavingHeroBanner] = useState(false);
  const isHeroDirtyRef = useRef(false);

  // Administrative Automatic Database Backup Button (Exports Products, Inventory, Orders to clean CSV)
  const handleDownloadDatabaseBackup = () => {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      
      const escapeCsv = (val: any) => {
        if (val === null || val === undefined) return '""';
        const str = String(val).replace(/"/g, '""');
        return `"${str}"`;
      };

      let csv = '';
      csv += 'BACHPAN PK - ATELIER DATABASE & INVENTORY BACKUP\n';
      csv += `Export Timestamp,${escapeCsv(new Date().toLocaleString('en-PK'))}\n`;
      csv += `Total Products,${products.length},Total Orders,${orders.length},Promotions,${promotions.length}\n\n`;

      csv += '--- PRODUCT CATALOG & STOCK INVENTORY ---\n';
      csv += [
        'Product ID',
        'Title',
        'Category',
        'SubCategory',
        'Age Group',
        'Sizes Available',
        'Price (PKR)',
        'Original Price',
        'Stock Quantity',
        'In Stock Status',
        'Fabric',
        'Display Priority',
        'Rating',
        'Reviews Count',
        'Image URL',
        'Created At'
      ].join(',') + '\n';

      products.forEach((p) => {
        csv += [
          escapeCsv(p.id),
          escapeCsv(p.title),
          escapeCsv(p.category),
          escapeCsv(p.subCategory || ''),
          escapeCsv(p.ageGroup || ''),
          escapeCsv((p.sizes || []).join(', ')),
          escapeCsv(p.price),
          escapeCsv(p.originalPrice || ''),
          escapeCsv(p.stock),
          escapeCsv(p.stock > 0 ? 'In Stock' : 'Out of Stock'),
          escapeCsv(p.fabric || ''),
          escapeCsv(p.priority || 10),
          escapeCsv(p.rating || 5.0),
          escapeCsv(p.reviewCount || 0),
          escapeCsv(p.imageUrl),
          escapeCsv(p.createdAt || '')
        ].join(',') + '\n';
      });

      csv += '\n--- MASTER CUSTOMER ORDERS & DISPATCH LOG ---\n';
      csv += [
        'Order ID',
        'Order Placed Date',
        'Customer Name',
        'Mobile Number',
        'City',
        'Province',
        'Delivery Address',
        'Nearest Landmark',
        'Payment Method',
        'Order Status',
        'Subtotal (PKR)',
        'Delivery Fee',
        'Discount Applied',
        'Total Payable (PKR)',
        'Purchased Items Breakdown'
      ].join(',') + '\n';

      orders.forEach((o) => {
        const itemsStr = o.items.map(it => `${it.quantity}x ${it.title} (${it.selectedSize || 'Standard'}) @ Rs. ${it.price}`).join(' | ');
        csv += [
          escapeCsv(o.id),
          escapeCsv(new Date(o.createdAt).toLocaleString('en-PK')),
          escapeCsv(o.customerName),
          escapeCsv(o.mobileNumber),
          escapeCsv(o.city),
          escapeCsv(o.province),
          escapeCsv(o.shippingAddress),
          escapeCsv(o.nearestLandmark || ''),
          escapeCsv(o.paymentMethod),
          escapeCsv(o.status),
          escapeCsv(o.subtotal || o.totalAmount),
          escapeCsv(o.deliveryFee || 0),
          escapeCsv(o.discount || 0),
          escapeCsv(o.totalAmount),
          escapeCsv(itemsStr)
        ].join(',') + '\n';
      });

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `bachpanpk_database_backup_${timestamp}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setActionSuccess('Database Backup exported successfully (CSV)!');
      setTimeout(() => setActionSuccess(null), 3500);
    } catch (err) {
      console.error('Backup download error:', err);
      setActionSuccess('Failed to generate database backup');
      setTimeout(() => setActionSuccess(null), 3000);
    }
  };

  // Bulk Inventory Editor State
  const [bulkEdits, setBulkEdits] = useState<Record<string, { price: number; stock: number; priority: number }>>({});
  const [bulkSearch, setBulkSearch] = useState('');
  const [isSavingBulk, setIsSavingBulk] = useState(false);
  const [bulkSaveSuccess, setBulkSaveSuccess] = useState(false);

  // Real-Time Floating Order Alert state
  const [liveOrderAlert, setLiveOrderAlert] = useState<Order | null>(null);
  const previousOrderCountRef = useRef<number>(0);

  // Synthesize clean audible "Ding" sound via Web Audio API (100% reliable without external audio asset)
  const playDingSound = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime); // A5
      osc.frequency.exponentialRampToValueAtTime(1760, ctx.currentTime + 0.15); // A6 octave rise
      
      gain.gain.setValueAtTime(0.35, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.75);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.8);
    } catch (e) {
      console.warn('Audio chime notification error', e);
    }
  };

  // Formatter for clean, short, professional Pakistani WhatsApp Invoice
  const generateWhatsAppInvoiceText = (order: Order): string => {
    const dateFormatted = new Date(order.createdAt).toLocaleDateString('en-PK', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

    const itemsSummary = order.items
      .map(
        (it, idx) =>
          `  ${idx + 1}. *${it.title}*${it.selectedSize ? ` [Size: ${it.selectedSize}]` : ''} x${it.quantity} = Rs. ${(it.price * it.quantity).toLocaleString()}`
      )
      .join('\n');

    const deliveryText = order.deliveryFee === 0 ? 'FREE Shipping' : `Rs. ${order.deliveryFee.toLocaleString()}`;
    const discountText = order.discount > 0 ? `\n• Discount Applied: -Rs. ${order.discount.toLocaleString()}` : '';

    return `*Bachpan PK Atelier · Order Invoice* 🌟
-----------------------------------------
*Order ID:* #${order.id}
*Date:* ${dateFormatted}
*Customer:* ${order.customerName}
*Phone:* ${order.mobileNumber}
*Delivery Address:* ${order.shippingAddress}, ${order.city}, ${order.province}${order.nearestLandmark ? ` (Near: ${order.nearestLandmark})` : ''}

*Items Ordered:*
${itemsSummary}

*Payment Breakdown:*
• Subtotal: Rs. ${order.subtotal.toLocaleString()}
• Courier Delivery: ${deliveryText}${discountText}
• *Total Payable (${order.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Prepaid'}): Rs. ${order.totalAmount.toLocaleString()}*

*Courier Partner:* TCS / Trax Express
*Notice:* Parcel Open Check Allowed on Delivery.
-----------------------------------------
Thank you for choosing *Bachpan PK - Premium Kids Wear*!
Reply to this message for any questions or size guidance.`;
  };

  const handleOpenEdit = (product: Product) => {
    setProductToEdit(product);
    setIsUploadModalOpen(true);
  };

  const handleOpenCreate = () => {
    setProductToEdit(null);
    setIsUploadModalOpen(true);
  };

  const fetchDashboardData = async () => {
    try {
      const [allOrders, allProducts, currentLayout, allPromotions] = await Promise.all([
        api.getOrders(),
        api.getProducts(),
        api.getLayout(),
        api.getPromotions(),
      ]);

      // Check if new orders arrived since last poll
      if (previousOrderCountRef.current > 0 && allOrders.length > previousOrderCountRef.current) {
        const latestOrder = allOrders[0];
        playDingSound();
        setLiveOrderAlert(latestOrder);
        setTimeout(() => setLiveOrderAlert(null), 6500);
      }
      previousOrderCountRef.current = allOrders.length;

      setOrders(allOrders);
      setProducts(allProducts);
      setLayoutConfig(currentLayout);
      if (currentLayout && !isHeroDirtyRef.current) {
        if (currentLayout.heroBannerTag) setHeroTagText(currentLayout.heroBannerTag);
        if (currentLayout.heroBannerTitle) setHeroTitleText(currentLayout.heroBannerTitle);
        if (currentLayout.heroBannerSubtitle) setHeroSubtitleText(currentLayout.heroBannerSubtitle);
        if (currentLayout.heroBannerImageUrl) setHeroImageUrl(currentLayout.heroBannerImageUrl);
        if (currentLayout.heroBannerVideoUrl) setHeroVideoUrl(currentLayout.heroBannerVideoUrl);
        if (currentLayout.heroBannerMediaType) setHeroMediaType(currentLayout.heroBannerMediaType);
        if (currentLayout.heroBannerHeight) setHeroHeight(currentLayout.heroBannerHeight);
        if (currentLayout.heroBannerScale) setHeroScale(currentLayout.heroBannerScale);
        if (currentLayout.heroBannerFocalPoint) setHeroFocalPoint(currentLayout.heroBannerFocalPoint);
      }
      setPromotions(allPromotions);

      // Sync bulk edits table if not actively dirty
      setBulkEdits(prev => {
        const next = { ...prev };
        for (const p of allProducts) {
          if (!next[p.id]) {
            next[p.id] = {
              price: p.price,
              stock: p.stock,
              priority: p.priority ?? 10,
            };
          }
        }
        return next;
      });
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 6000);

    // Listen to real-time custom event triggered directly when customer submits order
    const handleOrderPlaced = (e: any) => {
      const newOrder = e.detail as Order;
      if (newOrder) {
        playDingSound();
        setLiveOrderAlert(newOrder);
        setOrders(prev => [newOrder, ...prev.filter(o => o.id !== newOrder.id)]);
        setTimeout(() => setLiveOrderAlert(null), 7000);
      }
    };

    window.addEventListener('bachpanpk_order_placed', handleOrderPlaced);
    return () => {
      clearInterval(interval);
      window.removeEventListener('bachpanpk_order_placed', handleOrderPlaced);
    };
  }, []);

  // Update order status with immediate optimistic update (NO window.confirm to avoid iframe blocking!)
  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    // 1. Optimistic immediate update in local UI state
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus, updatedAt: new Date().toISOString() } : o));
    setActionSuccess(`Order #${orderId} marked as "${newStatus}"`);
    setTimeout(() => setActionSuccess(null), 3500);

    // 2. Persist to API and localStorage
    try {
      const updated = await api.updateOrderStatus(orderId, newStatus);
      if (updated) {
        setOrders(prev => prev.map(o => o.id === orderId ? updated : o));
      }
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

  // Instant quick actions on order rows
  const handleInstantConfirm = (orderId: string) => {
    handleStatusChange(orderId, 'Order Confirmed / Proceed to COD');
  };

  const handleInstantCancel = (orderId: string) => {
    // If currently filtered by a specific active status (e.g. Pending), switch filter to 'All' so the soft red row stays in view
    if (statusFilter !== 'All' && statusFilter !== 'Canceled') {
      setStatusFilter('All');
    }
    handleStatusChange(orderId, 'Canceled');
  };

  const handleInstantCopyInvoice = (order: Order) => {
    const text = generateWhatsAppInvoiceText(order);
    navigator.clipboard.writeText(text);
    setActionSuccess(`WhatsApp invoice for #${order.id} copied to clipboard!`);
    setTimeout(() => setActionSuccess(null), 3000);
  };

  const handleDeleteProduct = async (id: string, title: string) => {
    if (confirm(`Are you sure you want to remove "${title}" from the catalog?`)) {
      await api.deleteProduct(id);
      setProducts(prev => prev.filter(p => p.id !== id));
      setActionSuccess(`"${title}" has been removed.`);
      setTimeout(() => setActionSuccess(null), 3000);
    }
  };

  const handleToggleLayout = async (key: keyof StoreLayoutConfig) => {
    const updated: StoreLayoutConfig = {
      ...layoutConfig,
      [key]: !layoutConfig[key],
    };
    setLayoutConfig(updated);
    await api.updateLayout(updated);
    setActionSuccess(`Layout updated: ${key} is now ${updated[key] ? 'VISIBLE' : 'HIDDEN'}`);
    setTimeout(() => setActionSuccess(null), 3000);
  };

  const handleEnableAllLayout = async () => {
    const allEnabled: StoreLayoutConfig = {
      ...layoutConfig,
      showAnnouncementBar: true,
      showHeroBanner: true,
      showVideoReels: true,
      showCategoryFilter: true,
      showBoysWearSection: true,
      showGirlsWearSection: true,
      showToddlerSection: true,
      showNewbornSection: true,
      showAllProductsGrid: true,
    };
    setLayoutConfig(allEnabled);
    await api.updateLayout(allEnabled);
    setActionSuccess('All storefront sections are now VISIBLE.');
    setTimeout(() => setActionSuccess(null), 3000);
  };

  const handleResetLayout = async () => {
    setLayoutConfig(DEFAULT_LAYOUT_CONFIG);
    await api.updateLayout(DEFAULT_LAYOUT_CONFIG);
    setActionSuccess('Storefront layout restored to default.');
    setTimeout(() => setActionSuccess(null), 3000);
  };

  const handleToggleMaintenanceMode = async () => {
    const nextVal = !layoutConfig.maintenanceMode;
    const updated: StoreLayoutConfig = {
      ...layoutConfig,
      maintenanceMode: nextVal,
    };
    setLayoutConfig(updated);
    await api.updateLayout(updated);
    setActionSuccess(`Maintenance Mode is now ${nextVal ? 'ON (Storefront Locked)' : 'OFF (Storefront Live)'}`);
    setTimeout(() => setActionSuccess(null), 3000);
  };

  const handleAnnouncementTextChange = async (text: string) => {
    const updated: StoreLayoutConfig = {
      ...layoutConfig,
      announcementText: text,
    };
    setLayoutConfig(updated);
    await api.updateLayout(updated);
  };

  const handleSizeChartUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSizeChartUploadError(null);
    setUploadingSizeChart(true);
    try {
      const reader = new FileReader();
      reader.onload = async (evt) => {
        const base64 = evt.target?.result as string;
        const uploadRes = await api.uploadFile(base64, file.name, file.type || 'image/jpeg');
        const updated: StoreLayoutConfig = {
          ...layoutConfig,
          globalSizeChartImageUrl: uploadRes.url,
        };
        setLayoutConfig(updated);
        await api.updateLayout(updated);
        setActionSuccess('Standard Kids Size Guide successfully updated!');
        setTimeout(() => setActionSuccess(null), 3000);
        setUploadingSizeChart(false);
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      setSizeChartUploadError(err.message || 'Failed to upload size chart image.');
      setUploadingSizeChart(false);
    }
  };

  const handleResetSizeChart = async () => {
    const defaultUrl = 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=1200&q=80';
    const updated: StoreLayoutConfig = {
      ...layoutConfig,
      globalSizeChartImageUrl: defaultUrl,
    };
    setLayoutConfig(updated);
    await api.updateLayout(updated);
    setActionSuccess('Size Guide image reset to default.');
    setTimeout(() => setActionSuccess(null), 3000);
  };

  // Homepage Hero Banner Dynamic Media & Overlay Handlers
  const handleHeroBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setHeroBannerError(null);
    setUploadingHeroBanner(true);
    isHeroDirtyRef.current = true;
    try {
      const reader = new FileReader();
      reader.onload = async (evt) => {
        const base64 = evt.target?.result as string;
        const isVid = file.type.startsWith('video/') || file.name.endsWith('.mp4') || file.name.endsWith('.webm') || file.name.endsWith('.mov');
        const uploadRes = await api.uploadFile(base64, file.name, file.type || (isVid ? 'video/mp4' : 'image/jpeg'));
        if (isVid) {
          setHeroVideoUrl(uploadRes.url);
          setHeroMediaType('video');
          setActionSuccess('Hero background video uploaded! Click "Save & Apply Banner" to publish live.');
        } else {
          setHeroImageUrl(uploadRes.url);
          setHeroMediaType('image');
          setActionSuccess('High-resolution hero photo uploaded! Click "Save & Apply Banner" to publish live.');
        }
        setTimeout(() => setActionSuccess(null), 3500);
        setUploadingHeroBanner(false);
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      setHeroBannerError(err.message || 'Failed to upload hero media file.');
      setUploadingHeroBanner(false);
    }
  };

  const handleSaveHeroBanner = async () => {
    setSavingHeroBanner(true);
    setHeroBannerError(null);
    try {
      const updated: StoreLayoutConfig = {
        ...layoutConfig,
        heroBannerImageUrl: heroImageUrl.trim(),
        heroBannerVideoUrl: heroVideoUrl.trim(),
        heroBannerMediaType: heroMediaType,
        heroBannerHeight: Number(heroHeight) || 680,
        heroBannerScale: Number(heroScale) || 100,
        heroBannerFocalPoint: heroFocalPoint,
        heroBannerTag: heroTagText.trim(),
        heroBannerTitle: heroTitleText.trim(),
        heroBannerSubtitle: heroSubtitleText.trim(),
      };
      setLayoutConfig(updated);
      await api.updateLayout(updated);
      isHeroDirtyRef.current = false;
      setActionSuccess('Homepage Hero Banner dimensions & media settings published LIVE!');
      setTimeout(() => setActionSuccess(null), 3500);
    } catch (err: any) {
      setHeroBannerError(err.message || 'Failed to save hero banner settings.');
    } finally {
      setSavingHeroBanner(false);
    }
  };

  const handleResetHeroBanner = async () => {
    const defaultImg = 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=2000&q=85';
    const defaultVid = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4';
    const defaultTag = 'Tiny ones, big firsts';
    const defaultTitle = 'Thoughtfully Made For Childhood Memories';
    const defaultSub = 'Hand-tailored festive Baba Suits, fairy-tale chiffon frocks, and organic newborn essentials. Crafted for delicate skin with breathable Pakistani cottons and fine silks.';
    
    setHeroImageUrl(defaultImg);
    setHeroVideoUrl(defaultVid);
    setHeroMediaType('image');
    setHeroHeight(680);
    setHeroScale(100);
    setHeroFocalPoint('center');
    setHeroTagText(defaultTag);
    setHeroTitleText(defaultTitle);
    setHeroSubtitleText(defaultSub);
    isHeroDirtyRef.current = false;

    const updated: StoreLayoutConfig = {
      ...layoutConfig,
      heroBannerImageUrl: defaultImg,
      heroBannerVideoUrl: defaultVid,
      heroBannerMediaType: 'image',
      heroBannerHeight: 680,
      heroBannerScale: 100,
      heroBannerFocalPoint: 'center',
      heroBannerTag: defaultTag,
      heroBannerTitle: defaultTitle,
      heroBannerSubtitle: defaultSub,
    };
    setLayoutConfig(updated);
    await api.updateLayout(updated);
    setActionSuccess('Hero Banner restored to default luxury media, text, and 680px height.');
    setTimeout(() => setActionSuccess(null), 3500);
  };

  // Bulk Inventory Editor Handlers
  const handleBulkFieldChange = (id: string, field: 'price' | 'stock' | 'priority', value: number) => {
    setBulkEdits(prev => {
      const prod = products.find(p => p.id === id);
      const existing = prev[id] || {
        price: prod?.price ?? 0,
        stock: prod?.stock ?? 0,
        priority: prod?.priority ?? 10,
      };
      return {
        ...prev,
        [id]: {
          ...existing,
          [field]: value,
        }
      };
    });
  };

  const handleBulkToggleStock = (id: string) => {
    const prod = products.find(p => p.id === id);
    const current = bulkEdits[id]?.stock ?? prod?.stock ?? 0;
    const nextStock = current > 0 ? 0 : 10;
    handleBulkFieldChange(id, 'stock', nextStock);
  };

  const handleSaveBulkChanges = async () => {
    setIsSavingBulk(true);
    try {
      const updates = Object.entries(bulkEdits).map(([id, data]) => ({
        id,
        price: data.price,
        stock: data.stock,
        priority: data.priority,
      }));

      if (updates.length > 0) {
        await api.bulkUpdateProducts(updates);
        setProducts(prev => prev.map(p => {
          const edit = bulkEdits[p.id];
          return edit ? { ...p, price: edit.price, stock: edit.stock, priority: edit.priority } : p;
        }));
      }

      setIsSavingBulk(false);
      setBulkSaveSuccess(true);
      const count = updates.length;
      setBulkEdits({});
      setActionSuccess(`Successfully saved inventory changes across ${count > 0 ? count : products.length} products!`);
      setTimeout(() => {
        setBulkSaveSuccess(false);
        setActionSuccess(null);
      }, 3500);
    } catch (err) {
      console.error(err);
      setIsSavingBulk(false);
      setActionSuccess('Failed to save bulk inventory changes. Please retry.');
      setTimeout(() => setActionSuccess(null), 3000);
    }
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSnippet(label);
    setTimeout(() => setCopiedSnippet(null), 2000);
  };

  // Calculations
  const activeOrders = orders.filter(o => o.status !== 'Canceled' && o.status !== 'Cancelled');
  const totalRevenue = activeOrders.reduce((sum, o) => sum + o.totalAmount, 0);

  const pendingConfirmations = orders.filter(
    o => o.status === 'Pending Confirmation'
  ).length;

  const confirmedCODCount = orders.filter(
    o => o.status === 'Order Confirmed / Proceed to COD' || o.status === 'Confirmed'
  ).length;

  const dispatchedCount = orders.filter(
    o => o.status === 'Dispatched' || o.status === 'Shipped'
  ).length;

  const deliveredCount = orders.filter(
    o => o.status === 'Delivered'
  ).length;

  const canceledCount = orders.filter(
    o => o.status === 'Canceled' || o.status === 'Cancelled'
  ).length;

  // Pending COD Value: Sum of all orders currently marked as Confirmed or Dispatched but not yet Delivered
  const pendingCodOrders = orders.filter(o => {
    const s = o.status;
    return s === 'Confirmed' || s === 'Order Confirmed / Proceed to COD' || s === 'Dispatched' || s === 'Shipped';
  });
  const pendingCodValue = pendingCodOrders.reduce((sum, o) => sum + o.totalAmount, 0);

  const lowStockProducts = products.filter(p => p.stock <= 5);

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.mobileNumber.includes(searchQuery) ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.city.toLowerCase().includes(searchQuery.toLowerCase());

    const isOrderCanceled = order.status === 'Canceled' || order.status === 'Cancelled';
    const isOrderConfirmed = order.status === 'Confirmed' || order.status === 'Order Confirmed / Proceed to COD';
    const isOrderDispatched = order.status === 'Dispatched' || order.status === 'Shipped';

    if (statusFilter === 'All') return matchesSearch;
    if (statusFilter === 'Canceled') return matchesSearch && isOrderCanceled;
    if (statusFilter === 'Confirmed' || statusFilter === 'Order Confirmed / Proceed to COD') return matchesSearch && isOrderConfirmed;
    if (statusFilter === 'Dispatched') return matchesSearch && isOrderDispatched;
    return matchesSearch && order.status === statusFilter;
  });

  const displayedProducts = catalogFilter === 'low_stock' ? lowStockProducts : products;

  const filteredBulkProducts = products.filter(p => 
    p.title.toLowerCase().includes(bulkSearch.toLowerCase()) ||
    p.category.toLowerCase().includes(bulkSearch.toLowerCase()) ||
    p.id.toLowerCase().includes(bulkSearch.toLowerCase())
  );

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-200 ${
      darkMode ? 'bg-neutral-950 text-neutral-100' : 'bg-[#FBFBFB] text-neutral-950'
    }`}>
      
      {/* 1. ULTRA-CLEAN MODERN ADMIN HEADER WITH DARK/LIGHT TOGGLE */}
      <header className={`border-b sticky top-0 z-30 transition-colors shadow-xs ${
        darkMode ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-neutral-300'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className={`font-serif text-xl tracking-[0.16em] uppercase font-semibold ${
                  darkMode ? 'text-white' : 'text-neutral-950'
                }`}>
                  Bachpan PK
                </span>
                <span className={`text-[10px] uppercase tracking-[0.2em] font-medium ${
                  darkMode ? 'text-neutral-400' : 'text-neutral-600'
                }`}>
                  - Premium Kids Wear
                </span>
                <span className={`inline-flex items-center gap-1 text-[10px] font-medium border px-2 py-0.5 rounded-sm ${
                  darkMode ? 'border-neutral-700 text-neutral-300 bg-neutral-800' : 'border-neutral-300 text-neutral-800 bg-neutral-50'
                }`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live Sync
                </span>
              </div>
              <p className={`text-[11px] font-normal tracking-wide mt-0.5 ${
                darkMode ? 'text-neutral-400' : 'text-neutral-600'
              }`}>
                Store Operations, Inventory Management & Orders
              </p>
            </div>
          </div>

          {/* Navigation Tabs (Shopify Style Navigation) */}
          <div className="flex items-center gap-2 flex-wrap justify-center">
            <nav className={`flex items-center gap-1 border-b sm:border-0 ${
              darkMode ? 'border-neutral-800' : 'border-neutral-200'
            }`}>
              <button
                onClick={() => setActiveTab('orders')}
                className={`px-3 py-1.5 text-xs tracking-wider uppercase transition-colors cursor-pointer ${
                  activeTab === 'orders'
                    ? (darkMode ? 'text-white border-b-2 border-white font-semibold' : 'text-neutral-950 border-b-2 border-neutral-950 font-bold')
                    : (darkMode ? 'text-neutral-400 hover:text-neutral-200 font-medium' : 'text-neutral-700 hover:text-black font-semibold')
                }`}
              >
                Orders ({orders.length})
              </button>

              {/* Shopify-style Bulk Inventory Editor Tab */}
              <button
                onClick={() => setActiveTab('bulk_inventory')}
                className={`px-3 py-1.5 text-xs tracking-wider uppercase transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'bulk_inventory'
                    ? (darkMode ? 'text-white border-b-2 border-white font-semibold' : 'text-neutral-950 border-b-2 border-neutral-950 font-bold')
                    : (darkMode ? 'text-neutral-400 hover:text-neutral-200 font-medium' : 'text-neutral-700 hover:text-black font-semibold')
                }`}
              >
                <Layers className="w-3.5 h-3.5 stroke-[1.8]" />
                <span>Bulk Inventory</span>
              </button>

              <button
                onClick={() => setActiveTab('products')}
                className={`px-3 py-1.5 text-xs tracking-wider uppercase transition-colors cursor-pointer ${
                  activeTab === 'products'
                    ? (darkMode ? 'text-white border-b-2 border-white font-semibold' : 'text-neutral-950 border-b-2 border-neutral-950 font-bold')
                    : (darkMode ? 'text-neutral-400 hover:text-neutral-200 font-medium' : 'text-neutral-700 hover:text-black font-semibold')
                }`}
              >
                Catalog ({products.length})
              </button>

              <button
                onClick={() => setActiveTab('layout')}
                className={`px-3 py-1.5 text-xs tracking-wider uppercase transition-colors cursor-pointer flex items-center gap-1 ${
                  activeTab === 'layout'
                    ? (darkMode ? 'text-white border-b-2 border-white font-semibold' : 'text-neutral-950 border-b-2 border-neutral-950 font-bold')
                    : (darkMode ? 'text-neutral-400 hover:text-neutral-200 font-medium' : 'text-neutral-700 hover:text-black font-semibold')
                }`}
              >
                <Layout className="w-3.5 h-3.5 stroke-[1.8]" />
                <span>Layout CMS</span>
              </button>

              {/* Shopify-Style Live Visual Theme Customizer */}
              <button
                onClick={() => setActiveTab('live_customizer')}
                className={`px-3 py-1.5 text-xs tracking-wider uppercase transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'live_customizer'
                    ? 'text-[#C89299] border-b-2 border-[#C89299] font-bold'
                    : (darkMode ? 'text-[#C89299] hover:text-white font-semibold' : 'text-[#C89299] hover:text-black font-semibold')
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 stroke-[2] text-[#C89299]" />
                <span>Live Customizer</span>
                <span className="text-[8px] uppercase tracking-wider px-1.5 py-0.2 rounded-full bg-[#C89299]/20 text-[#C89299] font-bold">
                  Live
                </span>
              </button>

              <button
                onClick={() => setActiveTab('analytics')}
                className={`px-3 py-1.5 text-xs tracking-wider uppercase transition-colors cursor-pointer flex items-center gap-1 ${
                  activeTab === 'analytics'
                    ? (darkMode ? 'text-white border-b-2 border-white font-semibold' : 'text-neutral-950 border-b-2 border-neutral-950 font-bold')
                    : (darkMode ? 'text-neutral-400 hover:text-neutral-200 font-medium' : 'text-neutral-700 hover:text-black font-semibold')
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5 stroke-[1.8]" />
                <span>Reels</span>
              </button>

              <button
                onClick={() => setActiveTab('promotions')}
                className={`px-3 py-1.5 text-xs tracking-wider uppercase transition-colors cursor-pointer flex items-center gap-1 ${
                  activeTab === 'promotions'
                    ? (darkMode ? 'text-white border-b-2 border-white font-semibold' : 'text-neutral-950 border-b-2 border-neutral-950 font-bold')
                    : (darkMode ? 'text-neutral-400 hover:text-neutral-200 font-medium' : 'text-neutral-700 hover:text-black font-semibold')
                }`}
              >
                <Tag className="w-3.5 h-3.5 stroke-[1.8]" />
                <span>Promotions ({promotions.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('abandoned_carts')}
                className={`px-3 py-1.5 text-xs tracking-wider uppercase transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'abandoned_carts'
                    ? (darkMode ? 'text-amber-400 border-b-2 border-amber-400 font-bold' : 'text-amber-700 border-b-2 border-amber-700 font-bold')
                    : (darkMode ? 'text-neutral-400 hover:text-neutral-200 font-medium' : 'text-neutral-700 hover:text-black font-semibold')
                }`}
              >
                <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                <span>Abandoned Carts</span>
              </button>

              <button
                onClick={() => setActiveTab('database_guide')}
                className={`px-3 py-1.5 text-xs tracking-wider uppercase transition-colors cursor-pointer ${
                  activeTab === 'database_guide'
                    ? (darkMode ? 'text-white border-b-2 border-white font-semibold' : 'text-neutral-950 border-b-2 border-neutral-950 font-bold')
                    : (darkMode ? 'text-neutral-400 hover:text-neutral-200 font-medium' : 'text-neutral-700 hover:text-black font-semibold')
                }`}
              >
                DB
              </button>
            </nav>

            <div className={`h-4 w-px mx-2 hidden sm:block ${
              darkMode ? 'bg-neutral-800' : 'bg-neutral-300'
            }`} />

            {/* Dark/Light Mode Switch */}
            <button
              onClick={toggleTheme}
              className={`p-1.5 border rounded-sm transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-medium ${
                darkMode 
                  ? 'border-neutral-700 bg-neutral-800 text-amber-300 hover:bg-neutral-700' 
                  : 'border-neutral-300 bg-white text-neutral-800 hover:bg-neutral-100 shadow-2xs'
              }`}
              title={darkMode ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
              aria-label="Toggle Dark/Light Mode"
            >
              {darkMode ? <Sun className="w-4 h-4 stroke-[1.8]" /> : <Moon className="w-4 h-4 stroke-[1.8]" />}
              <span className="hidden md:inline">{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
            </button>

            {/* Sound notification test */}
            <button
              onClick={() => {
                playDingSound();
                setActionSuccess('Notification sound chime played!');
                setTimeout(() => setActionSuccess(null), 2000);
              }}
              className={`p-1.5 border rounded-sm transition-colors cursor-pointer ${
                darkMode
                  ? 'border-neutral-700 bg-neutral-800 text-neutral-300 hover:text-white'
                  : 'border-neutral-300 bg-white text-neutral-800 hover:text-black shadow-2xs'
              }`}
              title="Test Order Ding Notification Sound"
              aria-label="Test Notification Chime"
            >
              <Volume2 className="w-4 h-4 stroke-[1.8]" />
            </button>

            {/* Prominent Database Backup Button */}
            <button
              onClick={handleDownloadDatabaseBackup}
              className={`text-xs uppercase tracking-wider font-semibold flex items-center gap-1.5 px-3 py-1.5 border transition-all cursor-pointer shadow-2xs ${
                darkMode
                  ? 'border-emerald-600 bg-emerald-950/60 text-emerald-300 hover:bg-emerald-900/80 hover:text-white'
                  : 'border-emerald-600 bg-emerald-50 text-emerald-900 hover:bg-emerald-600 hover:text-white'
              }`}
              title="Download Full Database Backup (CSV)"
            >
              <Download className="w-3.5 h-3.5 stroke-[2]" />
              <span className="hidden sm:inline">Backup DB</span>
            </button>

            {/* Quick Link to Customer Storefront */}
            <button
              onClick={onOpenStorefront}
              className={`text-xs uppercase tracking-wider font-medium flex items-center gap-1 px-2.5 py-1.5 border transition-colors cursor-pointer ${
                darkMode 
                  ? 'border-neutral-700 text-neutral-300 hover:border-white hover:text-white' 
                  : 'border-neutral-300 text-neutral-800 hover:text-black hover:border-black bg-white shadow-2xs'
              }`}
            >
              <span>Storefront</span>
              <ExternalLink className="w-3 h-3 stroke-[1.8]" />
            </button>

            {/* Logout */}
            <button
              onClick={onLogout}
              className="p-1.5 text-neutral-500 hover:text-rose-600 transition-colors cursor-pointer"
              title="Logout"
              aria-label="Logout"
            >
              <LogOut className="w-4 h-4 stroke-[1.8]" />
            </button>
          </div>

        </div>
      </header>

      {/* Floating Real-Time Audible Order Notification Toast */}
      {liveOrderAlert && (
        <div className="fixed bottom-6 right-6 z-50 bg-neutral-900 border border-neutral-700 text-white p-4 shadow-2xl rounded-sm flex items-start gap-3 max-w-sm animate-fadeIn">
          <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/40">
            <Volume2 className="w-4 h-4 stroke-[2]" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-widest text-emerald-400 font-medium">New Order Placed!</span>
              <button 
                onClick={() => setLiveOrderAlert(null)}
                className="text-neutral-400 hover:text-white p-0.5 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="font-serif text-sm font-normal text-white mt-0.5 truncate">
              Order #{liveOrderAlert.id} · Rs. {liveOrderAlert.totalAmount.toLocaleString()}
            </p>
            <p className="text-xs text-neutral-300 font-light mt-0.5">
              {liveOrderAlert.customerName} ({liveOrderAlert.city})
            </p>
            <div className="pt-2 flex items-center gap-2">
              <button
                onClick={() => {
                  setSelectedOrderForInvoice(liveOrderAlert);
                  setLiveOrderAlert(null);
                }}
                className="text-[10px] uppercase tracking-wider bg-white text-neutral-900 px-2 py-1 font-medium hover:bg-neutral-200 cursor-pointer"
              >
                View Invoice
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Action Notification Toast Banner */}
      {actionSuccess && (
        <div className={`px-4 py-2 text-xs font-medium tracking-wide text-center flex items-center justify-center gap-2 animate-fadeIn transition-colors ${
          darkMode ? 'bg-neutral-800 text-neutral-100 border-b border-neutral-700' : 'bg-neutral-900 text-white'
        }`}>
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-8 py-8 flex-1 space-y-8">
        
        {/* 3. SALES ANALYTICS MINI-DASHBOARD (High Contrast in Both Light and Dark Modes) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {/* Card 1: Total Revenue Generated */}
          <div className={`p-6 sm:p-7 border shadow-xs relative overflow-hidden transition-colors ${
            darkMode ? 'bg-neutral-900 border-neutral-800 hover:border-neutral-600' : 'bg-white border-neutral-300 hover:border-neutral-900'
          }`}>
            <div className="flex items-center justify-between pb-3">
              <span className={`text-[11px] uppercase tracking-[0.2em] font-semibold ${
                darkMode ? 'text-neutral-400' : 'text-neutral-700'
              }`}>
                Total Revenue Generated
              </span>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border transition-colors ${
                darkMode ? 'bg-neutral-800 border-neutral-700 text-neutral-300' : 'bg-neutral-100 border-neutral-200 text-neutral-800'
              }`}>
                <TrendingUp className="w-4 h-4 stroke-[1.8]" />
              </div>
            </div>
            <div className="space-y-1">
              <span className={`font-serif text-3xl sm:text-4xl font-normal tracking-tight block ${
                darkMode ? 'text-white' : 'text-neutral-950'
              }`}>
                Rs. {totalRevenue.toLocaleString()}
              </span>
              <div className={`flex items-center gap-2 pt-1 text-[11px] font-normal ${
                darkMode ? 'text-neutral-400' : 'text-neutral-600'
              }`}>
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Active completed orders</span>
                <span className="text-neutral-400">·</span>
                <span className="font-mono font-medium">PKR</span>
              </div>
            </div>
          </div>

          {/* Card 2: Total Orders Placed */}
          <div className={`p-6 sm:p-7 border shadow-xs relative overflow-hidden transition-colors ${
            darkMode ? 'bg-neutral-900 border-neutral-800 hover:border-neutral-600' : 'bg-white border-neutral-300 hover:border-neutral-900'
          }`}>
            <div className="flex items-center justify-between pb-3">
              <span className={`text-[11px] uppercase tracking-[0.2em] font-semibold ${
                darkMode ? 'text-neutral-400' : 'text-neutral-700'
              }`}>
                Total Orders Placed
              </span>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border transition-colors ${
                darkMode ? 'bg-neutral-800 border-neutral-700 text-neutral-300' : 'bg-neutral-100 border-neutral-200 text-neutral-800'
              }`}>
                <ShoppingBag className="w-4 h-4 stroke-[1.8]" />
              </div>
            </div>
            <div className="space-y-1">
              <span className={`font-serif text-3xl sm:text-4xl font-normal tracking-tight block ${
                darkMode ? 'text-white' : 'text-neutral-950'
              }`}>
                {orders.length}
              </span>
              <div className={`flex items-center gap-2 pt-1 text-[11px] font-normal ${
                darkMode ? 'text-neutral-400' : 'text-neutral-600'
              }`}>
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-500" />
                <span>{pendingConfirmations} pending call</span>
                <span className="text-neutral-400">·</span>
                <span>{confirmedCODCount} confirmed COD</span>
              </div>
            </div>
          </div>

          {/* Card 3: Pending COD Value (Cash Flow Analytics) */}
          <div className={`p-6 sm:p-7 border shadow-xs relative overflow-hidden transition-colors ${
            darkMode ? 'bg-neutral-900 border-neutral-800 hover:border-neutral-600' : 'bg-white border-neutral-300 hover:border-neutral-900'
          }`}>
            <div className="flex items-center justify-between pb-3">
              <span className={`text-[11px] uppercase tracking-[0.2em] font-semibold ${
                darkMode ? 'text-neutral-400' : 'text-neutral-700'
              }`}>
                Pending COD Value
              </span>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border transition-colors ${
                darkMode ? 'bg-neutral-800 border-neutral-700 text-sky-400' : 'bg-sky-50 border-sky-200 text-sky-700'
              }`}>
                <Truck className="w-4 h-4 stroke-[1.8]" />
              </div>
            </div>
            <div className="space-y-1">
              <span className={`font-serif text-3xl sm:text-4xl font-normal tracking-tight block ${
                darkMode ? 'text-white' : 'text-neutral-950'
              }`}>
                Rs. {pendingCodValue.toLocaleString()}
              </span>
              <div className={`flex items-center gap-2 pt-1 text-[11px] font-normal ${
                darkMode ? 'text-neutral-400' : 'text-neutral-600'
              }`}>
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse" />
                <span>{pendingCodOrders.length} in transit / awaiting COD</span>
                <span className="text-neutral-400">·</span>
                <span className="font-mono font-medium">PKR</span>
              </div>
            </div>
          </div>

          {/* Card 4: Canceled Orders Count */}
          <div className={`p-6 sm:p-7 border shadow-xs relative overflow-hidden transition-colors ${
            darkMode ? 'bg-neutral-900 border-neutral-800 hover:border-neutral-600' : 'bg-white border-neutral-300 hover:border-neutral-900'
          }`}>
            <div className="flex items-center justify-between pb-3">
              <span className={`text-[11px] uppercase tracking-[0.2em] font-semibold ${
                darkMode ? 'text-neutral-400' : 'text-neutral-700'
              }`}>
                Canceled Orders Count
              </span>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border transition-colors ${
                darkMode ? 'bg-neutral-800 border-neutral-700 text-rose-400' : 'bg-rose-50 border-rose-200 text-rose-600'
              }`}>
                <XCircle className="w-4 h-4 stroke-[1.8]" />
              </div>
            </div>
            <div className="space-y-1">
              <span className={`font-serif text-3xl sm:text-4xl font-normal tracking-tight block ${
                darkMode ? 'text-white' : 'text-neutral-950'
              }`}>
                {canceledCount}
              </span>
              <div className={`flex items-center gap-2 pt-1 text-[11px] font-normal ${
                darkMode ? 'text-neutral-400' : 'text-neutral-600'
              }`}>
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-rose-500" />
                <span>{orders.length > 0 ? ((canceledCount / orders.length) * 100).toFixed(1) : '0'}% cancellation rate</span>
                <span className="text-neutral-400">·</span>
                <span>{orders.length - canceledCount} successful</span>
              </div>
            </div>
          </div>
        </div>

        {/* TAB 1: MASTER ORDERS TABLE WITH FUNCTIONAL CANCEL ACTION */}
        {activeTab === 'orders' && (
          <div className={`border overflow-hidden flex flex-col transition-colors shadow-xs ${
            darkMode ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-neutral-300'
          }`}>
            
            {/* Table Header Controls */}
            <div className={`p-6 border-b flex flex-col md:flex-row items-center justify-between gap-4 ${
              darkMode ? 'border-neutral-800' : 'border-neutral-200'
            }`}>
              <div>
                <h2 className={`font-serif text-xl font-normal tracking-wide ${
                  darkMode ? 'text-white' : 'text-neutral-950'
                }`}>
                  Customer Orders & Quick Actions
                </h2>
                <p className={`text-xs font-normal mt-0.5 ${
                  darkMode ? 'text-neutral-400' : 'text-neutral-600'
                }`}>
                  Confirm COD, dispatch shipments, or click Cancel to immediately mark row as canceled.
                </p>
              </div>

              {/* Order Search Filter & Status Dropdown */}
              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Search className={`w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 stroke-[1.8] ${
                    darkMode ? 'text-neutral-400' : 'text-neutral-500'
                  }`} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search name, phone, city..."
                    className={`w-full pl-9 pr-3 py-2 text-xs border font-medium focus:outline-none ${
                      darkMode 
                        ? 'bg-neutral-950 border-neutral-700 text-white focus:border-white' 
                        : 'bg-white border-neutral-300 text-neutral-950 focus:border-black'
                    }`}
                  />
                </div>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className={`px-3 py-2 border text-xs font-medium cursor-pointer focus:outline-none ${
                    darkMode 
                      ? 'bg-neutral-950 border-neutral-700 text-neutral-200 focus:border-white' 
                      : 'bg-white border-neutral-300 text-neutral-800 focus:border-black'
                  }`}
                >
                  <option value="All">All Statuses ({orders.length})</option>
                  <option value="Pending Confirmation">Pending Confirmation ({pendingConfirmations})</option>
                  <option value="Order Confirmed / Proceed to COD">Confirmed COD ({confirmedCODCount})</option>
                  <option value="Dispatched">Dispatched</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Canceled">Canceled ({canceledCount})</option>
                </select>

                <button
                  onClick={fetchDashboardData}
                  className={`p-2 border transition-colors cursor-pointer ${
                    darkMode 
                      ? 'border-neutral-700 text-neutral-300 hover:text-white hover:border-white' 
                      : 'border-neutral-300 text-neutral-700 hover:text-black hover:border-black bg-white'
                  }`}
                  title="Refresh orders from database"
                >
                  <RefreshCw className={`w-3.5 h-3.5 stroke-[1.8] ${loadingOrders ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>

            {/* Orders Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className={`border-b text-[11px] uppercase tracking-[0.14em] font-semibold ${
                    darkMode ? 'bg-neutral-950 border-neutral-800 text-neutral-300' : 'bg-[#F4F3EF] border-neutral-300 text-neutral-800'
                  }`}>
                    <th className="py-4 px-6">Order ID & Date</th>
                    <th className="py-4 px-6">Customer & Contact</th>
                    <th className="py-4 px-6">Destination</th>
                    <th className="py-4 px-6">Outfits</th>
                    <th className="py-4 px-6">Total (PKR)</th>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-6 text-right">Quick Actions</th>
                  </tr>
                </thead>

                <tbody className={`divide-y ${
                  darkMode ? 'divide-neutral-800' : 'divide-neutral-200'
                }`}>
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={7} className={`text-center py-16 font-normal ${
                        darkMode ? 'text-neutral-400' : 'text-neutral-600'
                      }`}>
                        No orders match the current filter.
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((order) => {
                      const isPending = order.status === 'Pending Confirmation';
                      const isConfirmed = order.status === 'Order Confirmed / Proceed to COD' || order.status === 'Confirmed';
                      const isDispatched = order.status === 'Dispatched' || order.status === 'Shipped';
                      const isDelivered = order.status === 'Delivered';
                      const isCanceled = order.status === 'Canceled' || order.status === 'Cancelled';

                      const currentSelectStatus = 
                        isConfirmed ? 'Confirmed' :
                        isDispatched ? 'Dispatched' :
                        isDelivered ? 'Delivered' :
                        isCanceled ? 'Canceled' :
                        'Pending Confirmation';

                      const handleWhatsAppChat = () => {
                        const msg = encodeURIComponent(
                          `Assalam-o-Alaikum ${order.customerName}! This is Bachpan Atelier calling regarding your Kids Order #${order.id} for Rs. ${order.totalAmount.toLocaleString()} to ${order.city}.\n\nCould you please confirm if your address is ready for parcel dispatch?`
                        );
                        const cleanPhone = order.mobileNumber.replace(/\D/g, '');
                        const intlPhone = cleanPhone.startsWith('0') ? '92' + cleanPhone.substring(1) : cleanPhone;
                        window.open(`https://wa.me/${intlPhone}?text=${msg}`, '_blank');
                      };

                      return (
                        <tr 
                          key={order.id} 
                          className={`group transition-colors relative ${
                            isCanceled 
                              ? (darkMode ? 'bg-rose-950/40 text-rose-200 border-l-4 border-l-rose-500' : 'bg-rose-50 text-rose-950 border-l-4 border-l-rose-600')
                              : isDelivered
                              ? (darkMode ? 'bg-violet-950/20' : 'bg-violet-50/30')
                              : (darkMode ? 'hover:bg-neutral-800/60' : 'hover:bg-neutral-50')
                          }`}
                        >
                          {/* Order ID & Date */}
                          <td className="py-4 px-6 align-top">
                            <span className={`font-mono text-xs font-bold block ${
                              darkMode ? 'text-white' : 'text-neutral-950'
                            }`}>
                              #{order.id}
                            </span>
                            <span className={`text-[11px] font-normal block mt-0.5 ${
                              darkMode ? 'text-neutral-400' : 'text-neutral-600'
                            }`}>
                              {new Date(order.createdAt).toLocaleDateString('en-PK', {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </td>

                          {/* Customer */}
                          <td className="py-4 px-6 align-top">
                            <div className={`font-semibold text-xs ${
                              darkMode ? 'text-white' : 'text-neutral-950'
                            }`}>
                              {order.customerName}
                            </div>
                            <div className={`text-[11px] font-mono font-medium mt-0.5 ${
                              darkMode ? 'text-neutral-300' : 'text-neutral-700'
                            }`}>
                              {order.mobileNumber}
                            </div>
                            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                              <button
                                type="button"
                                onClick={() => setSelectedCustomerForHistory({ name: order.customerName, phone: order.mobileNumber })}
                                className={`inline-flex items-center gap-1 text-[10px] uppercase tracking-wider font-semibold border px-2 py-0.5 transition-colors cursor-pointer ${
                                  darkMode
                                    ? 'border-neutral-700 bg-neutral-800 hover:bg-neutral-700 text-emerald-300'
                                    : 'border-neutral-300 hover:border-black bg-white hover:bg-neutral-100 text-emerald-800 shadow-2xs'
                                }`}
                                title="Query Customer Purchase History & Vet COD Risk"
                              >
                                <UserCheck className="w-3 h-3 text-emerald-600 stroke-[2]" />
                                <span>COD History</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => setSelectedOrderForInvoice(order)}
                                className={`inline-flex items-center gap-1 text-[10px] uppercase tracking-wider font-semibold border px-2 py-0.5 transition-colors cursor-pointer ${
                                  darkMode
                                    ? 'border-neutral-700 bg-neutral-800 hover:bg-neutral-700 text-neutral-200'
                                    : 'border-neutral-300 hover:border-black bg-white hover:bg-neutral-100 text-neutral-800 shadow-2xs'
                                }`}
                                title="Open full WhatsApp Invoice template"
                              >
                                <FileText className="w-3 h-3 stroke-[1.8]" />
                                <span>Invoice</span>
                              </button>

                              <button
                                onClick={handleWhatsAppChat}
                                className="text-[10px] text-emerald-700 hover:text-emerald-900 font-medium flex items-center gap-1 cursor-pointer"
                                title="Open Direct WhatsApp Chat"
                              >
                                <MessageCircle className="w-3 h-3 stroke-[1.8]" />
                                <span>Direct Chat</span>
                              </button>
                            </div>
                          </td>

                          {/* Destination */}
                          <td className="py-4 px-6 align-top max-w-xs font-normal">
                            <p className={`font-semibold ${
                              darkMode ? 'text-neutral-100' : 'text-neutral-950'
                            }`}>{order.city}, {order.province}</p>
                            <p className={`text-[11px] mt-0.5 truncate ${
                              darkMode ? 'text-neutral-300' : 'text-neutral-700'
                            }`}>{order.shippingAddress}</p>
                            {order.nearestLandmark && (
                              <p className={`text-[10px] italic ${
                                darkMode ? 'text-neutral-400' : 'text-neutral-500'
                              }`}>Near: {order.nearestLandmark}</p>
                            )}
                          </td>

                          {/* Outfits with Tiny Clean Circular Image Previews */}
                          <td className="py-4 px-6 align-top">
                            <div className="space-y-2">
                              {order.items.map((it, idx) => {
                                const matchingProd = products.find(p => p.id === it.productId);
                                const thumbUrl = it.imageUrl || matchingProd?.imageUrl || 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=150&q=80';
                                return (
                                  <div key={idx} className="flex items-center gap-2.5">
                                    <img
                                      src={thumbUrl}
                                      alt={it.title}
                                      className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover shrink-0 border border-neutral-300 dark:border-neutral-700 shadow-2xs"
                                    />
                                    <div className={`text-[11px] font-normal leading-tight ${
                                      darkMode ? 'text-neutral-200' : 'text-neutral-900'
                                    }`}>
                                      <span className="font-semibold">{it.quantity}x</span> {it.title} 
                                      {it.selectedSize && <span className={`text-[10px] font-medium ml-1 ${
                                        darkMode ? 'text-neutral-400' : 'text-neutral-600'
                                      }`}>({it.selectedSize})</span>}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </td>

                          {/* Total */}
                          <td className="py-4 px-6 align-top">
                            <span className={`font-serif text-sm font-semibold block ${
                              darkMode ? 'text-white' : 'text-neutral-950'
                            }`}>
                              Rs. {order.totalAmount.toLocaleString()}
                            </span>
                            <span className={`text-[10px] uppercase tracking-widest block font-medium ${
                              darkMode ? 'text-neutral-400' : 'text-neutral-600'
                            }`}>
                              {order.paymentMethod}
                            </span>
                          </td>

                          {/* Status Badge with Instant Color Updates */}
                          <td className="py-4 px-6 align-top">
                            <span className={`inline-block px-2.5 py-1 text-[10px] tracking-wider uppercase font-semibold border ${
                              isConfirmed
                                ? (darkMode ? 'border-emerald-500/50 text-emerald-300 bg-emerald-950/40' : 'border-emerald-600 text-emerald-900 bg-emerald-50')
                                : isDispatched
                                ? (darkMode ? 'border-sky-500/50 text-sky-300 bg-sky-950/40' : 'border-sky-600 text-sky-900 bg-sky-50')
                                : isDelivered
                                ? (darkMode ? 'border-violet-500/50 text-violet-300 bg-violet-950/40' : 'border-violet-600 text-violet-900 bg-violet-50')
                                : isCanceled
                                ? (darkMode ? 'border-rose-500/50 text-rose-300 bg-rose-950/40 line-through' : 'border-rose-400 text-rose-900 bg-rose-100 line-through')
                                : (darkMode ? 'border-amber-500/50 text-amber-300 bg-amber-950/40' : 'border-amber-600 text-amber-900 bg-amber-50')
                            }`}>
                              {order.status}
                            </span>
                          </td>

                          {/* Unified Multi-Stage Status Dropdown & Action Controls */}
                          <td className="py-4 px-6 align-top text-right">
                            <div className="flex items-center justify-end gap-2 flex-wrap">
                              
                              {/* Multi-Stage Status Dropdown */}
                              <select
                                value={currentSelectStatus}
                                onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                                className={`px-2.5 py-1.5 text-[10px] uppercase tracking-wider font-semibold border rounded-xs cursor-pointer transition-colors focus:outline-none shadow-2xs ${
                                  isConfirmed
                                    ? (darkMode ? 'bg-emerald-950/70 border-emerald-500 text-emerald-300' : 'bg-emerald-50 border-emerald-600 text-emerald-900')
                                    : isDispatched
                                    ? (darkMode ? 'bg-sky-950/70 border-sky-500 text-sky-300' : 'bg-sky-50 border-sky-600 text-sky-900')
                                    : isDelivered
                                    ? (darkMode ? 'bg-violet-950/70 border-violet-500 text-violet-300' : 'bg-violet-50 border-violet-600 text-violet-900')
                                    : isCanceled
                                    ? (darkMode ? 'bg-rose-950/70 border-rose-500 text-rose-300' : 'bg-rose-50 border-rose-400 text-rose-900')
                                    : (darkMode ? 'bg-amber-950/70 border-amber-500 text-amber-300' : 'bg-amber-50 border-amber-600 text-amber-900')
                                }`}
                                title="Update order stage"
                              >
                                <option value="Pending Confirmation">⏳ Pending Confirmation</option>
                                <option value="Confirmed">✅ Confirmed</option>
                                <option value="Dispatched">🚚 Dispatched</option>
                                <option value="Delivered">📦 Delivered</option>
                                <option value="Canceled">❌ Canceled</option>
                              </select>

                              {/* One-Click WhatsApp Invoice Copy Button */}
                              <button
                                type="button"
                                onClick={() => handleInstantCopyInvoice(order)}
                                className={`p-1.5 border transition-colors cursor-pointer ${
                                  darkMode
                                    ? 'border-neutral-700 hover:border-neutral-400 text-neutral-300 hover:text-white'
                                    : 'border-neutral-300 hover:border-black text-neutral-700 hover:text-black bg-white shadow-2xs'
                                }`}
                                title="One-Click WhatsApp Invoice Copy"
                              >
                                <Copy className="w-3.5 h-3.5 stroke-[1.8]" />
                              </button>

                              {/* Print Courier Slip */}
                              <button
                                type="button"
                                onClick={() => setSelectedOrderForSlip(order)}
                                className={`p-1.5 border transition-colors cursor-pointer ${
                                  darkMode
                                    ? 'border-neutral-700 hover:border-neutral-400 text-neutral-300 hover:text-white'
                                    : 'border-neutral-300 hover:border-black text-neutral-700 hover:text-black bg-white shadow-2xs'
                                }`}
                                title="Print TCS/Trax Courier Slip"
                              >
                                <Printer className="w-3.5 h-3.5 stroke-[1.8]" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: SHOPIFY-STYLE QUICK BULK STOCK EDITOR */}
        {activeTab === 'bulk_inventory' && (
          <div className={`border overflow-hidden flex flex-col transition-colors shadow-xs ${
            darkMode ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-neutral-300'
          }`}>
            
            {/* Top Controls Bar with Search & Quick Save */}
            <div className={`p-4 sm:p-6 border-b flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 sticky top-16 z-20 ${
              darkMode ? 'bg-neutral-900/95 backdrop-blur-xs border-neutral-800' : 'bg-white/95 backdrop-blur-xs border-neutral-200'
            }`}>
              <div>
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 stroke-[1.8]" />
                  <h2 className={`font-serif text-lg sm:text-xl font-normal tracking-wide ${
                    darkMode ? 'text-white' : 'text-neutral-950'
                  }`}>
                    Quick Bulk Inventory & Price Editor
                  </h2>
                  {Object.keys(bulkEdits).length > 0 && (
                    <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 bg-amber-500 text-neutral-950 rounded-xs animate-pulse">
                      {Object.keys(bulkEdits).length} Unsaved
                    </span>
                  )}
                </div>
                <p className={`text-xs font-normal mt-0.5 ${
                  darkMode ? 'text-neutral-400' : 'text-neutral-600'
                }`}>
                  Instant stock toggling, units counting, and price adjustments across {products.length} outfits.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3">
                <div className="relative flex-1 sm:w-60">
                  <Search className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 stroke-[1.8] ${
                    darkMode ? 'text-neutral-400' : 'text-neutral-500'
                  }`} />
                  <input
                    type="text"
                    value={bulkSearch}
                    onChange={(e) => setBulkSearch(e.target.value)}
                    placeholder="Filter products..."
                    className={`w-full pl-9 pr-3 py-2 sm:py-2 text-xs sm:text-xs min-h-[44px] sm:min-h-0 border font-medium focus:outline-none transition-colors ${
                      darkMode 
                        ? 'bg-neutral-950 border-neutral-700 text-white focus:border-white' 
                        : 'bg-white border-neutral-300 text-neutral-950 focus:border-black'
                    }`}
                  />
                  {bulkSearch && (
                    <button
                      type="button"
                      onClick={() => setBulkSearch('')}
                      className={`absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold cursor-pointer ${
                        darkMode ? 'text-neutral-400 hover:text-white' : 'text-neutral-500 hover:text-black'
                      }`}
                    >
                      ×
                    </button>
                  )}
                </div>

                {/* Top Save Button */}
                <button
                  type="button"
                  onClick={handleSaveBulkChanges}
                  disabled={isSavingBulk}
                  className={`min-h-[44px] px-5 py-2.5 text-xs uppercase tracking-wider font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm ${
                    bulkSaveSuccess
                      ? 'bg-emerald-600 text-white'
                      : Object.keys(bulkEdits).length > 0
                      ? (darkMode ? 'bg-white text-neutral-900 hover:bg-neutral-200' : 'bg-neutral-900 text-white hover:bg-black')
                      : (darkMode ? 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700' : 'bg-neutral-900 text-white hover:bg-black')
                  } disabled:opacity-50`}
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>
                    {isSavingBulk
                      ? 'Saving...'
                      : bulkSaveSuccess
                      ? 'Saved All Changes ✓'
                      : Object.keys(bulkEdits).length > 0
                      ? `Save Changes (${Object.keys(bulkEdits).length})`
                      : 'Save All Changes'}
                  </span>
                </button>
              </div>
            </div>

            {/* Mobile Scroll Hint Banner */}
            <div className={`px-4 py-2 sm:hidden flex items-center justify-between text-[11px] border-b ${
              darkMode ? 'bg-neutral-950/80 border-neutral-800 text-neutral-400' : 'bg-[#FAF9F6] border-neutral-200 text-neutral-600'
            }`}>
              <span className="flex items-center gap-1.5 font-medium">
                <ArrowRight className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                <span>Swipe table horizontally to edit all fields</span>
              </span>
              <span className="font-mono text-[10px] uppercase font-semibold">
                {filteredBulkProducts.length} items
              </span>
            </div>

            {/* Compact Bulk Grid Table with full horizontal scroll and touch-friendly controls */}
            <div className="overflow-x-auto w-full scroll-smooth">
              <table className="min-w-[820px] w-full text-left text-xs border-collapse">
                <thead>
                  <tr className={`border-b text-[11px] uppercase tracking-[0.14em] font-semibold select-none ${
                    darkMode ? 'bg-neutral-950 border-neutral-800 text-neutral-300' : 'bg-[#F4F3EF] border-neutral-300 text-neutral-800'
                  }`}>
                    <th className="py-3.5 px-4 sm:px-5 min-w-[240px]">Outfit</th>
                    <th className="py-3.5 px-4 sm:px-5 min-w-[130px]">Category</th>
                    <th className="py-3.5 px-4 sm:px-5 min-w-[160px] text-center">Stock Status</th>
                    <th className="py-3.5 px-4 sm:px-5 min-w-[140px] text-center">Warehouse Units</th>
                    <th className="py-3.5 px-4 sm:px-5 min-w-[160px]">Price (PKR)</th>
                    <th className="py-3.5 px-4 sm:px-5 min-w-[120px] text-center">Priority Rank</th>
                    <th className="py-3.5 px-4 sm:px-5 min-w-[100px] text-right">Quick Action</th>
                  </tr>
                </thead>

                <tbody className={`divide-y ${
                  darkMode ? 'divide-neutral-800' : 'divide-neutral-200'
                }`}>
                  {filteredBulkProducts.length === 0 ? (
                    <tr>
                      <td colSpan={7} className={`py-12 text-center text-xs ${
                        darkMode ? 'text-neutral-400' : 'text-neutral-600'
                      }`}>
                        No products match your search filter "{bulkSearch}".
                      </td>
                    </tr>
                  ) : (
                    filteredBulkProducts.map((p) => {
                      const currentData = bulkEdits[p.id] || { price: p.price, stock: p.stock, priority: p.priority ?? 10 };
                      const isInStock = currentData.stock > 0;
                      const isModified = Boolean(bulkEdits[p.id]);

                      return (
                        <tr 
                          key={p.id}
                          className={`transition-colors ${
                            isModified
                              ? (darkMode ? 'bg-amber-950/20' : 'bg-amber-50/50')
                              : !isInStock
                              ? (darkMode ? 'bg-neutral-950/70 opacity-60' : 'bg-neutral-100/70 opacity-80')
                              : (darkMode ? 'hover:bg-neutral-800/40' : 'hover:bg-neutral-50')
                          }`}
                        >
                          {/* Outfit Thumbnail & Title */}
                          <td className="py-3.5 px-4 sm:px-5">
                            <div className="flex items-center gap-3">
                              <img
                                src={p.imageUrl}
                                alt={p.title}
                                className="w-12 h-14 object-cover bg-neutral-200 shrink-0 border border-neutral-300 shadow-2xs"
                              />
                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5">
                                  <p className={`font-semibold truncate max-w-xs ${
                                    darkMode ? 'text-white' : 'text-neutral-950'
                                  }`}>{p.title}</p>
                                  {isModified && (
                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" title="Unsaved edit" />
                                  )}
                                </div>
                                <p className={`text-[10px] font-mono mt-0.5 ${
                                  darkMode ? 'text-neutral-400' : 'text-neutral-600'
                                }`}>ID: {p.id}</p>
                              </div>
                            </div>
                          </td>

                          {/* Category */}
                          <td className={`py-3.5 px-4 sm:px-5 font-normal ${
                            darkMode ? 'text-neutral-300' : 'text-neutral-700'
                          }`}>
                            <span className="inline-block truncate max-w-[120px]">
                              {p.category} {p.subCategory ? `• ${p.subCategory}` : ''}
                            </span>
                          </td>

                          {/* Stock Status Toggle (Touch-Friendly: Min 44px) */}
                          <td className="py-3.5 px-4 sm:px-5">
                            <div className="flex justify-center">
                              <button
                                type="button"
                                onClick={() => handleBulkToggleStock(p.id)}
                                className={`min-h-[44px] w-full max-w-[135px] px-3.5 py-2.5 text-xs font-semibold uppercase tracking-wider border flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 shadow-2xs ${
                                  isInStock
                                    ? (darkMode ? 'border-emerald-500 text-emerald-300 bg-emerald-950/40 hover:bg-emerald-900/40' : 'border-emerald-600 text-emerald-900 bg-emerald-50 hover:bg-emerald-100')
                                    : (darkMode ? 'border-rose-500 text-rose-300 bg-rose-950/40 hover:bg-rose-900/40' : 'border-rose-400 text-rose-900 bg-rose-50 hover:bg-rose-100')
                                }`}
                                title={isInStock ? "Click to set Out of Stock (0 units)" : "Click to set In Stock (10 units)"}
                              >
                                <span className={`w-2 h-2 rounded-full shrink-0 ${isInStock ? 'bg-emerald-500 ring-2 ring-emerald-400/40' : 'bg-rose-500 ring-2 ring-rose-400/40'}`} />
                                <span className="truncate">{isInStock ? 'In Stock' : 'Out of Stock'}</span>
                              </button>
                            </div>
                          </td>

                          {/* Warehouse Stock Units (Touch-Friendly: Min 44px) */}
                          <td className="py-3.5 px-4 sm:px-5">
                            <div className="flex justify-center">
                              <input
                                type="number"
                                min="0"
                                inputMode="numeric"
                                value={currentData.stock}
                                onChange={(e) => handleBulkFieldChange(p.id, 'stock', Math.max(0, parseInt(e.target.value) || 0))}
                                className={`min-h-[44px] w-28 px-3 py-2 text-sm sm:text-xs font-mono font-medium border text-center focus:outline-none transition-colors shadow-2xs ${
                                  currentData.stock <= 5 && currentData.stock > 0
                                    ? 'border-amber-500 text-amber-900 bg-amber-50 dark:bg-amber-950/50 dark:text-amber-300'
                                    : currentData.stock === 0
                                    ? 'border-rose-500 text-rose-900 bg-rose-50 dark:bg-rose-950/50 dark:text-rose-300'
                                    : (darkMode ? 'bg-neutral-950 border-neutral-700 text-white focus:border-white' : 'bg-white border-neutral-300 text-neutral-950 focus:border-black')
                                }`}
                                aria-label={`${p.title} warehouse units`}
                              />
                            </div>
                          </td>

                          {/* Price (PKR) Inline Input (Touch-Friendly: Min 44px) */}
                          <td className="py-3.5 px-4 sm:px-5">
                            <div className="relative w-36 sm:w-32">
                              <span className={`absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono font-semibold pointer-events-none select-none ${
                                darkMode ? 'text-neutral-400' : 'text-neutral-600'
                              }`}>
                                Rs.
                              </span>
                              <input
                                type="number"
                                min="0"
                                step="50"
                                inputMode="numeric"
                                value={currentData.price}
                                onChange={(e) => handleBulkFieldChange(p.id, 'price', Math.max(0, parseInt(e.target.value) || 0))}
                                className={`min-h-[44px] w-full pl-10 pr-3 py-2 text-sm sm:text-xs font-mono font-medium border focus:outline-none transition-colors shadow-2xs ${
                                  darkMode ? 'bg-neutral-950 border-neutral-700 text-white focus:border-white' : 'bg-white border-neutral-300 text-neutral-950 focus:border-black'
                                }`}
                                aria-label={`${p.title} price in rupees`}
                              />
                            </div>
                          </td>

                          {/* Priority / Weight Rank (Touch-Friendly: Min 44px) */}
                          <td className="py-3.5 px-4 sm:px-5">
                            <div className="flex justify-center">
                              <input
                                type="number"
                                min="1"
                                max="999"
                                inputMode="numeric"
                                value={currentData.priority}
                                onChange={(e) => handleBulkFieldChange(p.id, 'priority', Math.max(1, parseInt(e.target.value) || 10))}
                                className={`min-h-[44px] w-24 sm:w-20 px-3 py-2 text-sm sm:text-xs font-mono font-medium border text-center focus:outline-none transition-colors shadow-2xs ${
                                  darkMode ? 'bg-neutral-950 border-neutral-700 text-white focus:border-white' : 'bg-white border-neutral-300 text-neutral-950 focus:border-black'
                                }`}
                                title="Priority 1 appears at top of store"
                                aria-label={`${p.title} priority rank`}
                              />
                            </div>
                          </td>

                          {/* Quick Edit Full Outfit (Touch-Friendly: Min 44px) */}
                          <td className="py-3.5 px-4 sm:px-5 text-right">
                            <button
                              type="button"
                              onClick={() => handleOpenEdit(p)}
                              className={`min-h-[44px] px-3.5 py-2 inline-flex items-center justify-center text-xs uppercase tracking-wider font-semibold border transition-all cursor-pointer active:scale-95 shadow-2xs ${
                                darkMode ? 'border-neutral-700 text-neutral-200 hover:text-white hover:border-neutral-500 bg-neutral-950' : 'border-neutral-300 text-neutral-900 hover:text-black hover:border-black bg-white'
                              }`}
                            >
                              Details
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Sticky Save All Changes Floating / Bottom Bar (Accessible while scrolling) */}
            <div className={`sticky bottom-0 z-30 border-t p-3.5 sm:p-4 transition-colors flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg ${
              darkMode ? 'bg-neutral-900/95 border-neutral-800 backdrop-blur-md' : 'bg-[#FCFCFC]/95 border-neutral-300 backdrop-blur-md'
            }`}>
              <div className="flex items-center justify-between w-full sm:w-auto gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${Object.keys(bulkEdits).length > 0 ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`} />
                  <span className={`font-semibold ${darkMode ? 'text-white' : 'text-neutral-900'}`}>
                    {Object.keys(bulkEdits).length > 0
                      ? `${Object.keys(bulkEdits).length} outfit${Object.keys(bulkEdits).length > 1 ? 's' : ''} with unsaved adjustments`
                      : 'All outfit prices & stock counts are synchronized'}
                  </span>
                </div>
                {Object.keys(bulkEdits).length > 0 && (
                  <button
                    type="button"
                    onClick={() => setBulkEdits({})}
                    className={`sm:hidden text-[11px] underline font-medium cursor-pointer ${
                      darkMode ? 'text-neutral-400 hover:text-white' : 'text-neutral-600 hover:text-black'
                    }`}
                  >
                    Reset
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                {Object.keys(bulkEdits).length > 0 && (
                  <button
                    type="button"
                    onClick={() => setBulkEdits({})}
                    className={`hidden sm:inline-flex min-h-[44px] px-4 py-2 text-xs uppercase tracking-wider font-semibold border transition-colors cursor-pointer ${
                      darkMode ? 'border-neutral-700 text-neutral-300 hover:text-white' : 'border-neutral-300 text-neutral-700 hover:text-black'
                    }`}
                  >
                    Discard Changes
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleSaveBulkChanges}
                  disabled={isSavingBulk}
                  className={`w-full sm:w-auto min-h-[44px] px-6 py-2.5 text-xs uppercase tracking-wider font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm ${
                    bulkSaveSuccess
                      ? 'bg-emerald-600 text-white'
                      : Object.keys(bulkEdits).length > 0
                      ? (darkMode ? 'bg-white text-neutral-900 hover:bg-neutral-200' : 'bg-neutral-900 text-white hover:bg-black')
                      : (darkMode ? 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700' : 'bg-neutral-900 text-white hover:bg-black')
                  } disabled:opacity-50`}
                >
                  <Save className="w-4 h-4 stroke-[2]" />
                  <span>
                    {isSavingBulk
                      ? 'Saving To Database...'
                      : bulkSaveSuccess
                      ? 'Saved All Changes ✓'
                      : Object.keys(bulkEdits).length > 0
                      ? `Save All Changes (${Object.keys(bulkEdits).length})`
                      : 'Save All Changes'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: CATALOG GRID & INDIVIDUAL EDIT */}
        {activeTab === 'products' && (
          <div className={`border p-6 sm:p-8 space-y-6 transition-colors shadow-xs ${
            darkMode ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-neutral-300'
          }`}>
            <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 border-b pb-5 ${
              darkMode ? 'border-neutral-800' : 'border-neutral-200'
            }`}>
              <div>
                <h2 className={`font-serif text-xl font-normal tracking-wide ${
                  darkMode ? 'text-white' : 'text-neutral-950'
                }`}>
                  Atelier Catalog & Inventory
                </h2>
                <p className={`text-xs font-normal mt-0.5 ${
                  darkMode ? 'text-neutral-400' : 'text-neutral-600'
                }`}>
                  Displaying {products.length} outfits. Products with stock &lt; 5 display warning alerts.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setCatalogFilter(catalogFilter === 'all' ? 'low_stock' : 'all')}
                  className={`px-3 py-1.5 text-xs uppercase tracking-wider font-medium border transition-colors cursor-pointer ${
                    catalogFilter === 'low_stock'
                      ? 'border-amber-500 bg-amber-500/20 text-amber-700 font-semibold'
                      : (darkMode ? 'border-neutral-700 text-neutral-300 hover:border-white' : 'border-neutral-300 text-neutral-800 hover:border-black bg-white shadow-2xs')
                  }`}
                >
                  {catalogFilter === 'low_stock' ? 'Show All Products' : `Low Stock Alert (${lowStockProducts.length})`}
                </button>

                <button
                  onClick={handleOpenCreate}
                  className={`px-4 py-1.5 text-xs uppercase tracking-wider font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                    darkMode ? 'bg-white text-neutral-900 hover:bg-neutral-200' : 'bg-neutral-900 text-white hover:bg-black shadow-2xs'
                  }`}
                >
                  <Plus className="w-3.5 h-3.5 stroke-[1.8]" />
                  <span>Upload Outfit</span>
                </button>
              </div>
            </div>

            {/* Product Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedProducts.map((prod) => (
                <div key={prod.id} className={`border p-4 space-y-3 flex flex-col justify-between transition-colors shadow-2xs ${
                  darkMode ? 'bg-neutral-950 border-neutral-800' : 'bg-white border-neutral-300'
                }`}>
                  <div className="flex gap-4">
                    <div className="relative w-20 aspect-[4/5] bg-neutral-800 shrink-0 overflow-hidden border border-neutral-200">
                      <img
                        src={prod.imageUrl}
                        alt={prod.title}
                        className="w-full h-full object-cover"
                      />
                      {prod.videoUrl && (
                        <span className="absolute bottom-1 right-1 bg-black/80 text-white text-[8px] tracking-widest uppercase px-1 font-semibold">
                          REEL
                        </span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className={`text-[10px] uppercase tracking-widest font-semibold block truncate ${
                          darkMode ? 'text-neutral-400' : 'text-neutral-600'
                        }`}>
                          {prod.category} {prod.subCategory ? `• ${prod.subCategory}` : ''}
                        </span>
                        <span className={`text-[9px] font-mono px-1.5 py-0.5 border shrink-0 font-bold ${
                          darkMode ? 'border-neutral-700 bg-neutral-900 text-neutral-200' : 'border-neutral-300 bg-neutral-100 text-neutral-900'
                        }`} title="Display Priority Weight">
                          Rank #{prod.priority !== undefined ? prod.priority : 10}
                        </span>
                      </div>
                      <h4 className={`font-semibold text-xs truncate mt-0.5 ${
                        darkMode ? 'text-white' : 'text-neutral-950'
                      }`}>
                        {prod.title}
                      </h4>
                      <p className={`font-serif text-sm font-semibold mt-1 ${
                        darkMode ? 'text-white' : 'text-neutral-950'
                      }`}>
                        Rs. {prod.price.toLocaleString()}
                      </p>
                      
                      {prod.stock <= 5 ? (
                        <div className="mt-2 inline-flex items-center gap-1 border border-amber-500/50 bg-amber-50 text-amber-900 px-2 py-0.5 text-[10px] uppercase tracking-wider font-semibold">
                          <AlertTriangle className="w-3 h-3 text-amber-600 shrink-0" />
                          <span>Low Stock: {prod.stock} left</span>
                        </div>
                      ) : (
                        <p className={`text-[10px] font-medium mt-1 ${
                          darkMode ? 'text-neutral-400' : 'text-neutral-600'
                        }`}>
                          Warehouse Stock: {prod.stock} units
                        </p>
                      )}
                    </div>
                  </div>

                  <div className={`pt-2 border-t flex items-center justify-between text-xs ${
                    darkMode ? 'border-neutral-800' : 'border-neutral-200'
                  }`}>
                    <span className={`font-mono text-[10px] font-medium ${
                      darkMode ? 'text-neutral-400' : 'text-neutral-600'
                    }`}>ID: {prod.id}</span>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleOpenEdit(prod)}
                        className={`flex items-center gap-1 text-[11px] uppercase tracking-wider font-semibold transition-colors cursor-pointer ${
                          darkMode ? 'text-neutral-300 hover:text-white' : 'text-neutral-700 hover:text-black'
                        }`}
                        title="Edit outfit details & category"
                      >
                        <Edit3 className="w-3 h-3 stroke-[1.8]" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(prod.id, prod.title)}
                        className="text-rose-600 hover:text-rose-800 flex items-center gap-1 text-[11px] uppercase tracking-wider font-semibold transition-colors cursor-pointer"
                        title="Permanently remove outfit"
                      >
                        <Trash2 className="w-3 h-3 stroke-[1.8]" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: LIVE CUSTOMIZER (Shopify Theme Editor Style Split-Screen) */}
        {activeTab === 'live_customizer' && (
          <LiveVisualCustomizer
            layoutConfig={layoutConfig}
            onSaveLayout={async (updatedConfig) => {
              await api.updateLayout(updatedConfig);
              setLayoutConfig(updatedConfig);
              playDingSound();
              setActionSuccess('Live Storefront Customizer published to database & visitors!');
              setTimeout(() => setActionSuccess(null), 4000);
            }}
            products={products}
            darkMode={darkMode}
            onOpenStorefront={onOpenStorefront}
          />
        )}

        {/* TAB 4: LAYOUT CMS (Dynamic Alert Ticker, Size Chart Manager, Maintenance Mode) */}
        {activeTab === 'layout' && (
          <div className={`border p-6 sm:p-8 space-y-8 transition-colors shadow-xs ${
            darkMode ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-neutral-300'
          }`}>
            <div className={`flex flex-col sm:flex-row items-baseline justify-between gap-4 border-b pb-5 ${
              darkMode ? 'border-neutral-800' : 'border-neutral-200'
            }`}>
              <div>
                <h2 className={`font-serif text-xl font-normal tracking-wide ${
                  darkMode ? 'text-white' : 'text-neutral-950'
                }`}>
                  Storefront Layout & CMS Controls
                </h2>
                <p className={`text-xs font-normal mt-0.5 ${
                  darkMode ? 'text-neutral-400' : 'text-neutral-600'
                }`}>
                  Configure top announcement alert bar, size chart uploads, and maintenance mode.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleEnableAllLayout}
                  className={`px-3.5 py-1.5 border text-xs uppercase tracking-wider font-medium transition-colors cursor-pointer ${
                    darkMode ? 'border-neutral-600 hover:border-white text-white' : 'border-neutral-900 text-neutral-900 hover:bg-neutral-900 hover:text-white shadow-2xs'
                  }`}
                >
                  Enable All Sections
                </button>
                <button
                  onClick={handleResetLayout}
                  className={`px-3.5 py-1.5 border text-xs uppercase tracking-wider font-medium transition-colors cursor-pointer ${
                    darkMode ? 'border-neutral-700 text-neutral-400 hover:text-white' : 'border-neutral-300 text-neutral-700 hover:text-black hover:border-black bg-white shadow-2xs'
                  }`}
                >
                  Reset Default
                </button>
              </div>
            </div>

            {/* 1. ADMINISTRATIVE MAINTENANCE MODE TOGGLE */}
            <div className={`p-5 sm:p-6 border transition-all ${
              layoutConfig.maintenanceMode 
                ? (darkMode ? 'bg-rose-950/40 border-rose-900' : 'bg-rose-50 border-rose-300')
                : (darkMode ? 'bg-emerald-950/30 border-emerald-900' : 'bg-emerald-50/60 border-emerald-300')
            }`}>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5">
                    <span className={`font-serif text-lg font-medium ${
                      darkMode ? 'text-white' : 'text-neutral-950'
                    }`}>
                      Maintenance Mode (Live / Under Construction)
                    </span>
                    <span className={`text-[10px] uppercase tracking-widest px-2.5 py-0.5 border font-bold ${
                      layoutConfig.maintenanceMode
                        ? 'border-rose-500 bg-rose-500/20 text-rose-700'
                        : 'border-emerald-600 bg-emerald-100 text-emerald-900'
                    }`}>
                      {layoutConfig.maintenanceMode ? '🔴 Under Construction' : '🟢 Storefront Live'}
                    </span>
                  </div>
                  <p className={`text-xs font-normal max-w-2xl leading-relaxed ${
                    darkMode ? 'text-neutral-300' : 'text-neutral-700'
                  }`}>
                    {layoutConfig.maintenanceMode
                      ? 'The Customer Frontend is currently LOCKED and displaying: "Bachpan PK is currently updating stock. We will be back online shortly!" The Admin Panel remains fully accessible.'
                      : 'Storefront is currently LIVE. Customers across Pakistan can browse luxury outfits, view size charts, and place orders.'}
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className={`text-xs font-mono font-bold ${
                    darkMode ? 'text-neutral-200' : 'text-neutral-900'
                  }`}>
                    {layoutConfig.maintenanceMode ? 'LOCKED' : 'LIVE'}
                  </span>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={Boolean(layoutConfig.maintenanceMode)}
                    onClick={handleToggleMaintenanceMode}
                    className={`relative inline-flex h-7 w-13 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      layoutConfig.maintenanceMode ? 'bg-rose-600' : 'bg-neutral-600'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-6 w-6 rounded-full bg-white shadow-xs transform ring-0 transition duration-200 ease-in-out ${
                        layoutConfig.maintenanceMode ? 'translate-x-6' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* 2. DYNAMIC ANNOUNCEMENT ALERT BAR (TICKER) */}
            <div className={`border p-5 sm:p-6 space-y-4 ${
              darkMode ? 'bg-neutral-950 border-neutral-800' : 'bg-[#FCFCFC] border-neutral-300'
            }`}>
              <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4 ${
                darkMode ? 'border-neutral-800' : 'border-neutral-200'
              }`}>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className={`font-serif text-lg font-medium ${
                      darkMode ? 'text-white' : 'text-neutral-950'
                    }`}>
                      Header Announcement Alert Bar (Ticker)
                    </h3>
                    <span className={`text-[10px] uppercase tracking-widest px-2 py-0.5 border font-semibold ${
                      layoutConfig.showAnnouncementBar && layoutConfig.announcementText?.trim()
                        ? (darkMode ? 'border-white bg-white text-neutral-900' : 'border-neutral-900 bg-neutral-900 text-white')
                        : 'border-neutral-400 text-neutral-600'
                    }`}>
                      {layoutConfig.showAnnouncementBar && layoutConfig.announcementText?.trim() ? 'Displaying' : 'Hidden'}
                    </span>
                  </div>
                  <p className={`text-xs font-normal mt-0.5 ${
                    darkMode ? 'text-neutral-400' : 'text-neutral-600'
                  }`}>
                    Display this text dynamically on the Customer Frontend inside a sleek bar at the top of the webpage.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`text-xs font-medium ${
                    darkMode ? 'text-neutral-400' : 'text-neutral-700'
                  }`}>Show Bar:</span>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={Boolean(layoutConfig.showAnnouncementBar)}
                    onClick={() => handleToggleLayout('showAnnouncementBar')}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      layoutConfig.showAnnouncementBar ? (darkMode ? 'bg-white' : 'bg-neutral-900') : 'bg-neutral-400'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 rounded-full ${layoutConfig.showAnnouncementBar ? (darkMode ? 'bg-neutral-900' : 'bg-white') : 'bg-white'} shadow-xs transform ring-0 transition duration-200 ease-in-out ${
                        layoutConfig.showAnnouncementBar ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>

              <div>
                <label className={`block text-xs uppercase tracking-wider font-semibold mb-1.5 ${
                  darkMode ? 'text-neutral-300' : 'text-neutral-900'
                }`}>
                  Header Announcement Text
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={layoutConfig.announcementText || ''}
                    onChange={(e) => handleAnnouncementTextChange(e.target.value)}
                    placeholder="e.g. Free Shipping on Orders Above Rs. 3000! | Cash on Delivery Available"
                    className={`w-full px-3.5 py-2.5 border text-xs sm:text-sm font-medium focus:outline-none transition-colors ${
                      darkMode ? 'bg-neutral-900 border-neutral-700 text-white focus:border-white' : 'bg-white border-neutral-300 text-neutral-950 focus:border-black'
                    }`}
                  />
                  {layoutConfig.announcementText && (
                    <button
                      type="button"
                      onClick={() => handleAnnouncementTextChange('')}
                      className={`absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold cursor-pointer ${
                        darkMode ? 'text-neutral-400 hover:text-white' : 'text-neutral-600 hover:text-black'
                      }`}
                      title="Clear text to hide ticker"
                    >
                      Clear
                    </button>
                  )}
                </div>
                <p className={`text-[11px] font-normal mt-1 ${
                  darkMode ? 'text-neutral-400' : 'text-neutral-600'
                }`}>
                  Leave completely blank or delete text to instantly make the top announcement bar disappear on the boutique.
                </p>
              </div>

              {/* Quick Presets */}
              <div className="pt-2">
                <span className={`text-[10px] uppercase tracking-wider font-semibold block mb-1.5 ${
                  darkMode ? 'text-neutral-400' : 'text-neutral-700'
                }`}>
                  Quick Presets:
                </span>
                <div className="flex flex-wrap gap-2">
                  {[
                    'Free Shipping on Orders Above Rs. 3000! | Cash on Delivery Across Pakistan',
                    'Complimentary Express Delivery on Orders Across Pakistan | Cash on Delivery Available',
                    'Atelier Festive & Lawn Edition Now Live · Flat 15% Off with Code: WELCOME15',
                    'Open Parcel Check Allowed Upon Delivery · 7-Day Hassle-Free Size Exchange',
                  ].map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleAnnouncementTextChange(preset)}
                      className={`text-[10px] px-2.5 py-1 border font-medium transition-colors cursor-pointer text-left truncate max-w-md ${
                        darkMode ? 'bg-neutral-900 border-neutral-700 text-neutral-300 hover:border-white' : 'bg-white border-neutral-300 text-neutral-800 hover:border-black shadow-2xs'
                      }`}
                    >
                      + "{preset.slice(0, 48)}..."
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 3. HOMEPAGE HERO BANNER SETTINGS (DYNAMIC MEDIA & TEXT MANAGER) */}
            <div className={`border p-5 sm:p-6 space-y-6 ${
              darkMode ? 'bg-neutral-950 border-neutral-800' : 'bg-[#FCFCFC] border-neutral-300'
            }`}>
              <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4 ${
                darkMode ? 'border-neutral-800' : 'border-neutral-200'
              }`}>
                <div>
                  <div className="flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 stroke-[1.8] text-amber-600" />
                    <h3 className={`font-serif text-lg font-medium ${
                      darkMode ? 'text-white' : 'text-neutral-950'
                    }`}>
                      Homepage Hero Banner Settings
                    </h3>
                    <span className={`text-[10px] uppercase tracking-widest px-2 py-0.5 border font-semibold ${
                      layoutConfig.showHeroBanner
                        ? (darkMode ? 'border-white bg-white text-neutral-900' : 'border-neutral-900 bg-neutral-900 text-white')
                        : 'border-neutral-400 text-neutral-600'
                    }`}>
                      {layoutConfig.showHeroBanner ? 'Storefront Active' : 'Section Off'}
                    </span>
                  </div>
                  <p className={`text-xs font-normal mt-0.5 ${
                    darkMode ? 'text-neutral-400' : 'text-neutral-600'
                  }`}>
                    Upload high-resolution photography from your PC or camera, update the text overlay in real-time, and apply changes live.
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {/* Upload Button */}
                  <label className={`px-4 py-2 text-xs uppercase tracking-wider font-semibold flex items-center gap-2 cursor-pointer transition-colors shadow-2xs border ${
                    darkMode ? 'bg-white text-neutral-900 hover:bg-neutral-200 border-white' : 'bg-neutral-900 text-white hover:bg-black border-neutral-900'
                  }`}>
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploadingHeroBanner ? 'Uploading...' : 'Upload New Hero Banner Image'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleHeroBannerUpload}
                      disabled={uploadingHeroBanner}
                      className="hidden"
                    />
                  </label>

                  {/* Save & Apply Button */}
                  <button
                    type="button"
                    onClick={handleSaveHeroBanner}
                    disabled={savingHeroBanner}
                    className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs uppercase tracking-wider font-semibold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-95"
                  >
                    <Check className="w-3.5 h-3.5 stroke-[2]" />
                    <span>{savingHeroBanner ? 'Saving...' : 'Save & Apply Banner'}</span>
                  </button>

                  {/* Reset Button */}
                  <button
                    type="button"
                    onClick={handleResetHeroBanner}
                    className={`px-3 py-2 border text-xs uppercase tracking-wider font-medium transition-colors cursor-pointer ${
                      darkMode ? 'border-neutral-700 text-neutral-300 hover:text-white' : 'border-neutral-300 text-neutral-800 hover:border-black bg-white shadow-2xs'
                    }`}
                  >
                    Reset Default
                  </button>
                </div>
              </div>

              {heroBannerError && (
                <div className="p-3 bg-rose-950/40 border border-rose-800 text-rose-300 text-xs font-medium">
                  {heroBannerError}
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Left: Interactive Live Preview with object-fit: cover, scale & focal point */}
                <div className="lg:col-span-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] uppercase tracking-wider font-semibold ${
                      darkMode ? 'text-neutral-400' : 'text-neutral-600'
                    }`}>
                      Live Hero Preview
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-emerald-500 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                        {heroHeight}px · {heroScale}% · {heroFocalPoint}
                      </span>
                    </div>
                  </div>

                  {/* Scaled Preview Box */}
                  <div className="relative aspect-[16/10] bg-neutral-950 overflow-hidden border border-neutral-300 rounded-sm shadow-md">
                    {heroMediaType === 'video' || (heroVideoUrl && heroVideoUrl.includes('.mp4')) ? (
                      <video
                        key={heroVideoUrl}
                        src={heroVideoUrl}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className={`w-full h-full object-cover transition-all duration-300 ${
                          heroFocalPoint === 'top' ? 'object-top' :
                          heroFocalPoint === 'bottom' ? 'object-bottom' :
                          heroFocalPoint === 'left' ? 'object-left' :
                          heroFocalPoint === 'right' ? 'object-right' : 'object-center'
                        }`}
                        style={{ transform: `scale(${Math.max(1, heroScale / 100)})` }}
                      />
                    ) : (
                      <img
                        src={heroImageUrl || 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=2000&q=85'}
                        alt="Hero Preview"
                        className={`w-full h-full object-cover transition-all duration-300 ${
                          heroFocalPoint === 'top' ? 'object-top' :
                          heroFocalPoint === 'bottom' ? 'object-bottom' :
                          heroFocalPoint === 'left' ? 'object-left' :
                          heroFocalPoint === 'right' ? 'object-right' : 'object-center'
                        }`}
                        style={{ transform: `scale(${Math.max(1, heroScale / 100)})` }}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=2000&q=85';
                        }}
                      />
                    )}
                    <div className="absolute inset-0 bg-neutral-950/45 via-neutral-950/30 to-neutral-950/60" />

                    <div className="absolute inset-0 p-4 sm:p-5 flex flex-col items-center justify-center text-center text-white space-y-1.5 select-none pointer-events-none">
                      <p className="text-[9px] uppercase tracking-[0.24em] font-light text-neutral-200 line-clamp-1">
                        {heroTagText || 'Tiny ones, big firsts'}
                      </p>
                      <h4 className="font-serif text-sm sm:text-base font-normal tracking-wide text-white leading-tight line-clamp-2 max-w-xs">
                        {heroTitleText || 'Thoughtfully Made For Childhood Memories'}
                      </h4>
                      <p className="text-[9px] font-light text-neutral-200/90 line-clamp-2 max-w-xs leading-snug">
                        {heroSubtitleText || 'Hand-tailored festive Baba Suits, fairy-tale chiffon frocks, and organic newborn essentials.'}
                      </p>
                      <div className="pt-1.5">
                        <span className="px-3 py-1 bg-[#C89299] text-white text-[9px] uppercase tracking-wider rounded-full shadow-2xs font-medium">
                          Shop New In
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Cropping & Dimensions Quick Bar */}
                  <div className={`p-3 border rounded-sm space-y-3 ${
                    darkMode ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-neutral-200 shadow-2xs'
                  }`}>
                    {/* Dimension Slider 1: Hero Height */}
                    <div>
                      <div className="flex items-center justify-between text-xs font-medium mb-1">
                        <span className={darkMode ? 'text-neutral-300' : 'text-neutral-700'}>
                          Hero Container Height (px)
                        </span>
                        <span className="font-mono text-xs px-2 py-0.5 rounded bg-amber-500/10 text-amber-900 border border-amber-300 font-bold">
                          {heroHeight}px
                        </span>
                      </div>
                      <input
                        type="range"
                        min="450"
                        max="900"
                        step="10"
                        value={heroHeight}
                        onChange={(e) => {
                          setHeroHeight(Number(e.target.value));
                          isHeroDirtyRef.current = true;
                        }}
                        className="w-full accent-[#C89299] cursor-pointer"
                      />
                      <div className="flex justify-between text-[10px] text-neutral-400 mt-0.5">
                        <span>Compact (450px)</span>
                        <button type="button" onClick={() => { setHeroHeight(680); isHeroDirtyRef.current = true; }} className="hover:underline">Default (680px)</button>
                        <span>Immersive (900px)</span>
                      </div>
                    </div>

                    {/* Dimension Slider 2: Media Scale / Zoom */}
                    <div>
                      <div className="flex items-center justify-between text-xs font-medium mb-1">
                        <span className={darkMode ? 'text-neutral-300' : 'text-neutral-700'}>
                          Media Scale/Zoom (%)
                        </span>
                        <span className="font-mono text-xs px-2 py-0.5 rounded bg-sky-500/10 text-sky-900 border border-sky-300 font-bold">
                          {heroScale}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min="100"
                        max="150"
                        step="1"
                        value={heroScale}
                        onChange={(e) => {
                          setHeroScale(Number(e.target.value));
                          isHeroDirtyRef.current = true;
                        }}
                        className="w-full accent-[#C89299] cursor-pointer"
                      />
                      <div className="flex justify-between text-[10px] text-neutral-400 mt-0.5">
                        <span>100% (Normal)</span>
                        <button type="button" onClick={() => { setHeroScale(110); isHeroDirtyRef.current = true; }} className="hover:underline">110% (Subtle)</button>
                        <span>150% (Close-up)</span>
                      </div>
                    </div>

                    {/* Alignment / Focal Point Cropper Dropdown */}
                    <div>
                      <div className="flex items-center justify-between text-xs font-medium mb-1.5">
                        <span className={darkMode ? 'text-neutral-300' : 'text-neutral-700'}>
                          Object-Position Alignment (Focal Cropper)
                        </span>
                      </div>
                      <select
                        value={heroFocalPoint}
                        onChange={(e) => {
                          setHeroFocalPoint(e.target.value as any);
                          isHeroDirtyRef.current = true;
                        }}
                        className={`w-full px-3 py-2 text-xs border focus:outline-none cursor-pointer ${
                          darkMode ? 'bg-neutral-800 border-neutral-700 text-white' : 'bg-neutral-50 border-neutral-300 text-neutral-900'
                        }`}
                      >
                        <option value="center">Center (Default · Balanced Framing)</option>
                        <option value="top">Top (Focus on Face & Neckline)</option>
                        <option value="bottom">Bottom (Focus on Hemline & Shoes)</option>
                        <option value="left">Left (Align Subject to Left)</option>
                        <option value="right">Right (Align Subject to Right)</option>
                      </select>

                      {/* Visual Focal Point Quick Buttons */}
                      <div className="grid grid-cols-5 gap-1 pt-1.5">
                        {(['top', 'center', 'bottom', 'left', 'right'] as const).map((pos) => (
                          <button
                            key={pos}
                            type="button"
                            onClick={() => {
                              setHeroFocalPoint(pos);
                              isHeroDirtyRef.current = true;
                            }}
                            className={`py-1 text-[10px] uppercase tracking-wider font-semibold border transition-all cursor-pointer text-center capitalize ${
                              heroFocalPoint === pos
                                ? 'bg-[#C89299] text-white border-[#C89299] shadow-2xs'
                                : (darkMode ? 'bg-neutral-800 border-neutral-700 text-neutral-300 hover:border-white' : 'bg-neutral-50 border-neutral-300 text-neutral-700 hover:border-black')
                            }`}
                          >
                            {pos}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column: Inputs for Media Source & Text Overlays */}
                <div className="lg:col-span-7 space-y-4">
                  
                  {/* Media Format Selector: Photo vs Autoplay Video */}
                  <div className={`p-3.5 border rounded-sm ${darkMode ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-neutral-200'}`}>
                    <label className={`block text-xs uppercase tracking-wider font-semibold mb-2 ${
                      darkMode ? 'text-neutral-200' : 'text-neutral-900'
                    }`}>
                      Media Format Selection
                    </label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setHeroMediaType('image');
                          isHeroDirtyRef.current = true;
                        }}
                        className={`flex-1 py-2 px-3 text-xs uppercase tracking-wider font-semibold border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                          heroMediaType === 'image'
                            ? 'bg-[#C89299] text-white border-[#C89299] shadow-2xs'
                            : (darkMode ? 'bg-neutral-800 border-neutral-700 text-neutral-300' : 'bg-neutral-50 border-neutral-300 text-neutral-700 hover:border-black')
                        }`}
                      >
                        <ImageIcon className="w-3.5 h-3.5" />
                        <span>High-Res Photo (Image)</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setHeroMediaType('video');
                          isHeroDirtyRef.current = true;
                        }}
                        className={`flex-1 py-2 px-3 text-xs uppercase tracking-wider font-semibold border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                          heroMediaType === 'video'
                            ? 'bg-[#C89299] text-white border-[#C89299] shadow-2xs'
                            : (darkMode ? 'bg-neutral-800 border-neutral-700 text-neutral-300' : 'bg-neutral-50 border-neutral-300 text-neutral-700 hover:border-black')
                        }`}
                      >
                        <Film className="w-3.5 h-3.5" />
                        <span>Autoplay Video (MP4)</span>
                      </button>
                    </div>

                    {/* Active Media URL / Upload Input */}
                    <div className="mt-3">
                      <label className={`block text-[11px] font-medium mb-1 ${darkMode ? 'text-neutral-400' : 'text-neutral-600'}`}>
                        {heroMediaType === 'video' ? 'Video File Source URL (MP4 / WebM)' : 'Image File Source URL (JPG / WebP)'}
                      </label>
                      <input
                        type="text"
                        value={heroMediaType === 'video' ? heroVideoUrl : heroImageUrl}
                        onChange={(e) => {
                          if (heroMediaType === 'video') setHeroVideoUrl(e.target.value);
                          else setHeroImageUrl(e.target.value);
                          isHeroDirtyRef.current = true;
                        }}
                        placeholder={heroMediaType === 'video' ? 'https://.../video.mp4 or /uploads/media-...' : 'https://.../photo.jpg or /uploads/media-...'}
                        className={`w-full px-3.5 py-2 text-xs font-mono border focus:outline-none transition-colors truncate ${
                          darkMode ? 'bg-neutral-800 border-neutral-700 text-white focus:border-white' : 'bg-neutral-50 border-neutral-300 text-neutral-900 focus:border-black shadow-2xs'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Banner Tag / Season Kicker */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className={`block text-xs uppercase tracking-wider font-semibold ${
                        darkMode ? 'text-neutral-200' : 'text-neutral-900'
                      }`}>
                        Banner Tag / Season Text Overlay
                      </label>
                      <span className="text-[10px] text-neutral-400 font-light">
                        Appears above main headline
                      </span>
                    </div>
                    <input
                      type="text"
                      value={heroTagText}
                      onChange={(e) => {
                        setHeroTagText(e.target.value);
                        isHeroDirtyRef.current = true;
                      }}
                      placeholder="e.g. Tiny ones, big firsts or SPRING / SUMMER 2026 EDITION"
                      className={`w-full px-3.5 py-2.5 text-xs font-medium border focus:outline-none transition-colors ${
                        darkMode ? 'bg-neutral-900 border-neutral-700 text-white focus:border-white' : 'bg-white border-neutral-300 text-neutral-900 focus:border-black shadow-2xs'
                      }`}
                    />

                    {/* Quick Presets for Text Overlay */}
                    <div className="mt-2 flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-semibold mr-1">
                        Quick Tags:
                      </span>
                      {[
                        'Tiny ones, big firsts',
                        'SPRING / SUMMER 2026 EDITION',
                        'WINTER / EID COLLECTION',
                        'EID UL FITR SPECIAL EDIT',
                        'FESTIVE LAWN & ATELIER DROPS'
                      ].map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => {
                            setHeroTagText(preset);
                            isHeroDirtyRef.current = true;
                          }}
                          className={`text-[10px] px-2.5 py-1 border transition-colors cursor-pointer ${
                            heroTagText === preset
                              ? 'bg-[#C89299] text-white font-bold border-[#C89299]'
                              : (darkMode ? 'bg-neutral-900 border-neutral-700 text-neutral-300 hover:border-white' : 'bg-white border-neutral-300 text-neutral-700 hover:border-black shadow-2xs')
                          }`}
                        >
                          {preset}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Main Headline */}
                  <div>
                    <label className={`block text-xs uppercase tracking-wider font-semibold mb-1 ${
                      darkMode ? 'text-neutral-200' : 'text-neutral-900'
                    }`}>
                      Headline (Cormorant Garamond)
                    </label>
                    <input
                      type="text"
                      value={heroTitleText}
                      onChange={(e) => {
                        setHeroTitleText(e.target.value);
                        isHeroDirtyRef.current = true;
                      }}
                      placeholder="e.g. Thoughtfully Made For Childhood Memories"
                      className={`w-full px-3.5 py-2 text-xs font-serif text-sm border focus:outline-none transition-colors ${
                        darkMode ? 'bg-neutral-900 border-neutral-700 text-white focus:border-white' : 'bg-white border-neutral-300 text-neutral-900 focus:border-black shadow-2xs'
                      }`}
                    />
                  </div>

                  {/* Subtitle */}
                  <div>
                    <label className={`block text-xs uppercase tracking-wider font-semibold mb-1 ${
                      darkMode ? 'text-neutral-200' : 'text-neutral-900'
                    }`}>
                      Subtitle / Supporting Description
                    </label>
                    <textarea
                      rows={2}
                      value={heroSubtitleText}
                      onChange={(e) => {
                        setHeroSubtitleText(e.target.value);
                        isHeroDirtyRef.current = true;
                      }}
                      placeholder="e.g. Hand-tailored festive Baba Suits, fairy-tale chiffon frocks..."
                      className={`w-full px-3.5 py-2 text-xs border focus:outline-none transition-colors ${
                        darkMode ? 'bg-neutral-900 border-neutral-700 text-white focus:border-white' : 'bg-white border-neutral-300 text-neutral-900 focus:border-black shadow-2xs'
                      }`}
                    />
                  </div>

                  {/* Bottom Apply & Save Bar */}
                  <div className="pt-2 flex items-center justify-between">
                    <p className="text-xs text-neutral-400 font-light">
                      Click below to immediately update both the live customer storefront and database.
                    </p>
                    <button
                      type="button"
                      onClick={handleSaveHeroBanner}
                      disabled={savingHeroBanner}
                      className="px-6 py-2.5 bg-[#C89299] hover:bg-[#B9838A] text-white text-xs uppercase tracking-wider font-semibold flex items-center gap-2 transition-all shadow-xs cursor-pointer active:scale-95 rounded-full"
                    >
                      <Check className="w-4 h-4 stroke-[2]" />
                      <span>{savingHeroBanner ? 'Publishing...' : 'Save & Apply Banner'}</span>
                    </button>
                  </div>

                </div>
              </div>
            </div>

            {/* 4. GLOBAL SIZE CHART MANAGER */}
            <div className={`border p-5 sm:p-6 space-y-5 ${
              darkMode ? 'bg-neutral-950 border-neutral-800' : 'bg-[#FCFCFC] border-neutral-300'
            }`}>
              <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4 ${
                darkMode ? 'border-neutral-800' : 'border-neutral-200'
              }`}>
                <div>
                  <div className="flex items-center gap-2">
                    <Ruler className="w-4 h-4 stroke-[1.8]" />
                    <h3 className={`font-serif text-lg font-medium ${
                      darkMode ? 'text-white' : 'text-neutral-950'
                    }`}>
                      Global Size Chart Manager
                    </h3>
                  </div>
                  <p className={`text-xs font-normal mt-0.5 ${
                    darkMode ? 'text-neutral-400' : 'text-neutral-600'
                  }`}>
                    Upload an image of standard kids' size guide from your PC. Displayed when mothers click "View Size Chart".
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <label className={`px-4 py-2 text-xs uppercase tracking-wider font-semibold flex items-center gap-2 cursor-pointer transition-colors shadow-2xs ${
                    darkMode ? 'bg-white text-neutral-900 hover:bg-neutral-200' : 'bg-neutral-900 text-white hover:bg-black'
                  }`}>
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploadingSizeChart ? 'Uploading...' : 'Size Chart Upload'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleSizeChartUpload}
                      disabled={uploadingSizeChart}
                      className="hidden"
                    />
                  </label>

                  <button
                    type="button"
                    onClick={handleResetSizeChart}
                    className={`px-3 py-2 border text-xs uppercase tracking-wider font-medium transition-colors cursor-pointer ${
                      darkMode ? 'border-neutral-700 text-neutral-300 hover:text-white' : 'border-neutral-300 text-neutral-800 hover:border-black bg-white shadow-2xs'
                    }`}
                  >
                    Reset Default
                  </button>
                </div>
              </div>

              {sizeChartUploadError && (
                <div className="p-3 bg-rose-950/40 border border-rose-800 text-rose-300 text-xs font-medium">
                  {sizeChartUploadError}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                <div className={`border p-3 space-y-2 ${
                  darkMode ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-neutral-300 shadow-2xs'
                }`}>
                  <span className={`text-[10px] uppercase tracking-wider font-semibold block ${
                    darkMode ? 'text-neutral-400' : 'text-neutral-600'
                  }`}>
                    Active Size Guide Image
                  </span>
                  <div className="relative aspect-[4/3] bg-neutral-800 overflow-hidden border border-neutral-300 flex items-center justify-center">
                    <img
                      src={layoutConfig.globalSizeChartImageUrl || 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=1200&q=80'}
                      alt="Active Size Guide"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                <div className="md:col-span-2 space-y-3">
                  <div>
                    <label className={`block text-xs uppercase tracking-wider font-semibold mb-1 ${
                      darkMode ? 'text-neutral-300' : 'text-neutral-900'
                    }`}>
                      Direct Size Chart Image URL
                    </label>
                    <input
                      type="text"
                      value={layoutConfig.globalSizeChartImageUrl || ''}
                      onChange={async (e) => {
                        const val = e.target.value;
                        const updated = { ...layoutConfig, globalSizeChartImageUrl: val };
                        setLayoutConfig(updated);
                        await api.updateLayout(updated);
                      }}
                      placeholder="https://... or /uploads/media-...jpg"
                      className={`w-full px-3.5 py-2.5 border text-xs font-mono font-medium focus:outline-none ${
                        darkMode ? 'bg-neutral-900 border-neutral-700 text-white' : 'bg-white border-neutral-300 text-neutral-950'
                      }`}
                    />
                  </div>

                  <div className={`border p-3.5 space-y-2 text-xs font-normal ${
                    darkMode ? 'bg-neutral-900 border-neutral-800 text-neutral-300' : 'bg-neutral-50 border-neutral-300 text-neutral-700'
                  }`}>
                    <p className={`font-semibold ${
                      darkMode ? 'text-neutral-100' : 'text-neutral-950'
                    }`}>
                      ✨ How mothers interact with this Size Chart on the Customer Frontend:
                    </p>
                    <ul className="list-disc pl-4 space-y-1 text-[11px]">
                      <li>Inside every product details popup (modal), a prominent <strong>"View Size Chart"</strong> button appears with a ruler icon.</li>
                      <li>Clicking it displays this uploaded size chart image in a dedicated clean lightbox overlay with zoom capabilities.</li>
                      <li>Helps mothers confirm exact chest, length, and age recommendations before choosing a size.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* 5. SECTIONS VISIBILITY TOGGLES */}
            <div className="pt-2">
              <h3 className={`font-serif text-lg font-medium mb-1 ${
                darkMode ? 'text-white' : 'text-neutral-950'
              }`}>
                Storefront Section Visibility Toggles
              </h3>
              <p className={`text-xs font-normal mb-4 ${
                darkMode ? 'text-neutral-400' : 'text-neutral-600'
              }`}>
                Toggle individual editorial collections and sections on and off in real-time.
              </p>
            </div>

            <div className={`divide-y ${
              darkMode ? 'divide-neutral-800' : 'divide-neutral-200'
            }`}>
              {[
                { key: 'showAnnouncementBar', title: 'Top Announcement Bar', desc: 'Minimalist header announcement with complimentary shipping & hotline alerts.' },
                { key: 'showHeroBanner', title: 'Main Editorial Hero Banner', desc: 'Full-width photography hero banner with ghost buttons and seasonal story.' },
                { key: 'showNewArrivalsSection', title: 'On-Screen New Arrivals Discovery', desc: 'Prominent, aesthetic on-screen segmented quick cards for Boys, Girls, and Newborn new stock with instant catalog filtering.' },
                { key: 'showVideoReels', title: 'Outfit Video Reels (9:16)', desc: 'Interactive vertical reels showcasing fine fabric texture, stitching, and flow.' },
                { key: 'showCategoryFilter', title: 'Category Mega Navigation Bar', desc: 'Centered minimalist menu with category links and dropdowns.' },
                { key: 'showBoysWearSection', title: 'Boys Wear Showcase', desc: 'Dedicated Baba Suits, waistcoats, and festive kurta shalwar collection.' },
                { key: 'showGirlsWearSection', title: 'Girls Wear Showcase', desc: 'Dedicated party frocks, chiffon twirl gowns, and festive lawn sets.' },
                { key: 'showToddlerSection', title: 'Toddler Outfits Showcase', desc: 'Dungarees, daytime playwear sets, and stretch coordinates.' },
                { key: 'showNewbornSection', title: 'Newborn Essentials Showcase', desc: 'Pure organic cotton front-snap rompers, swaddles, and welcome gifts.' },
                { key: 'showAllProductsGrid', title: 'Comprehensive Catalog Grid', desc: 'Multi-column clean product grid with interactive hover zoom and search.' },
              ].map((item) => {
                const k = item.key as keyof StoreLayoutConfig;
                const isChecked = Boolean(layoutConfig[k]);
                return (
                  <div key={item.key} className="py-4 flex items-center justify-between gap-4">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs uppercase tracking-wider font-semibold ${
                          darkMode ? 'text-white' : 'text-neutral-950'
                        }`}>
                          {item.title}
                        </span>
                        <span className={`text-[10px] uppercase tracking-widest px-1.5 py-0.2 border font-bold ${
                          isChecked ? 'border-emerald-600 text-emerald-700' : 'border-neutral-400 text-neutral-600'
                        }`}>
                          {isChecked ? 'Active' : 'Off'}
                        </span>
                      </div>
                      <p className={`text-xs font-normal max-w-xl ${
                        darkMode ? 'text-neutral-400' : 'text-neutral-600'
                      }`}>
                        {item.desc}
                      </p>
                    </div>

                    <button
                      type="button"
                      role="switch"
                      aria-checked={isChecked}
                      onClick={() => handleToggleLayout(k)}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        isChecked ? (darkMode ? 'bg-white' : 'bg-neutral-900') : 'bg-neutral-400'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 rounded-full ${isChecked ? (darkMode ? 'bg-neutral-900' : 'bg-white') : 'bg-white'} shadow-xs transform ring-0 transition duration-200 ease-in-out ${
                          isChecked ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Dynamic WhatsApp & Concierge Settings */}
            <div className={`border-t pt-6 space-y-4 ${
              darkMode ? 'border-neutral-800' : 'border-neutral-200'
            }`}>
              <div>
                <h3 className={`font-serif text-lg font-medium ${
                  darkMode ? 'text-white' : 'text-neutral-950'
                }`}>
                  WhatsApp Concierge & Helpline Settings
                </h3>
                <p className={`text-xs font-normal mt-0.5 ${
                  darkMode ? 'text-neutral-400' : 'text-neutral-600'
                }`}>
                  Dynamic WhatsApp number and customer support hotline used across floating buttons, checkout inquiries, and footer.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-xs uppercase tracking-wider font-semibold mb-1 ${
                    darkMode ? 'text-neutral-300' : 'text-neutral-900'
                  }`}>
                    WhatsApp Concierge Number
                  </label>
                  <input
                    type="text"
                    value={layoutConfig.whatsappNumber || '03001234567'}
                    onChange={async (e) => {
                      const val = e.target.value;
                      const updated = { ...layoutConfig, whatsappNumber: val };
                      setLayoutConfig(updated);
                      await api.updateLayout(updated);
                    }}
                    placeholder="03001234567"
                    className={`w-full px-3.5 py-2.5 border text-xs font-mono font-medium focus:outline-none ${
                      darkMode ? 'bg-neutral-900 border-neutral-700 text-white' : 'bg-white border-neutral-300 text-neutral-950'
                    }`}
                  />
                </div>

                <div>
                  <label className={`block text-xs uppercase tracking-wider font-semibold mb-1 ${
                    darkMode ? 'text-neutral-300' : 'text-neutral-900'
                  }`}>
                    Support Hotline Display Phone
                  </label>
                  <input
                    type="text"
                    value={layoutConfig.supportPhoneNumber || '0300-1234567'}
                    onChange={async (e) => {
                      const val = e.target.value;
                      const updated = { ...layoutConfig, supportPhoneNumber: val };
                      setLayoutConfig(updated);
                      await api.updateLayout(updated);
                    }}
                    placeholder="0300-1234567"
                    className={`w-full px-3.5 py-2.5 border text-xs font-mono font-medium focus:outline-none ${
                      darkMode ? 'bg-neutral-900 border-neutral-700 text-white' : 'bg-white border-neutral-300 text-neutral-950'
                    }`}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: VIDEO REELS */}
        {activeTab === 'analytics' && (
          <VideoAnalyticsTab
            products={products}
            onOpenStorefront={onOpenStorefront}
          />
        )}

        {/* TAB 6: PROMOTIONS */}
        {activeTab === 'promotions' && (
          <PromotionManagerTab
            promotions={promotions}
            onPromotionsChange={(updated) => setPromotions(updated)}
            onOpenStorefront={onOpenStorefront}
          />
        )}

        {/* TAB 6b: ABANDONED CARTS RECOVERY HUB */}
        {activeTab === 'abandoned_carts' && (
          <AbandonedCartsTab
            darkMode={darkMode}
          />
        )}

        {/* TAB 7: DATABASE ARCHITECTURE */}
        {activeTab === 'database_guide' && (
          <div className={`border p-6 sm:p-8 space-y-6 transition-colors shadow-xs ${
            darkMode ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-neutral-300'
          }`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6 border-neutral-200 dark:border-neutral-800">
              <div>
                <h2 className={`font-serif text-2xl font-normal tracking-wide ${
                  darkMode ? 'text-white' : 'text-neutral-950'
                }`}>
                  Database Architecture & Local Backups
                </h2>
                <p className={`text-xs font-normal mt-0.5 ${
                  darkMode ? 'text-neutral-400' : 'text-neutral-600'
                }`}>
                  Store data ownership: Instantly compile and download all products, stock counts, and orders.
                </p>
              </div>

              {/* Prominent Download Database Backup Button */}
              <button
                onClick={handleDownloadDatabaseBackup}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs uppercase tracking-wider font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs shrink-0"
              >
                <Download className="w-4 h-4 stroke-[2]" />
                <span>Download Database Backup (CSV)</span>
              </button>
            </div>

            <div className={`border p-5 space-y-3 ${
              darkMode ? 'bg-neutral-950 border-neutral-800' : 'bg-[#FAF9F8] border-neutral-300'
            }`}>
              <div className="flex items-center justify-between">
                <span className={`text-xs uppercase tracking-wider font-bold ${
                  darkMode ? 'text-neutral-200' : 'text-neutral-900'
                }`}>PostgreSQL Table Schema</span>
                <button
                  onClick={() => handleCopy(`CREATE TABLE products (id TEXT PRIMARY KEY, title TEXT, price NUMERIC, stock INT, priority INT);\nCREATE TABLE orders (id TEXT PRIMARY KEY, customer_name TEXT, mobile_number TEXT, total_amount NUMERIC, status TEXT);`, 'pg_sql')}
                  className={`text-xs uppercase tracking-wider font-semibold flex items-center gap-1 cursor-pointer ${
                    darkMode ? 'text-neutral-400 hover:text-white' : 'text-neutral-700 hover:text-black'
                  }`}
                >
                  {copiedSnippet === 'pg_sql' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSnippet === 'pg_sql' ? 'Copied' : 'Copy SQL'}</span>
                </button>
              </div>
              <pre className="bg-black/90 text-neutral-100 p-3 text-[11px] font-mono overflow-x-auto">
{`CREATE TABLE products (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  price NUMERIC NOT NULL,
  category TEXT,
  stock INT DEFAULT 10,
  priority INT DEFAULT 10
);

CREATE TABLE orders (
  id TEXT PRIMARY KEY,
  customer_name TEXT NOT NULL,
  mobile_number TEXT NOT NULL,
  total_amount NUMERIC NOT NULL,
  status TEXT DEFAULT 'Pending Confirmation'
);`}
              </pre>
            </div>
          </div>
        )}

      </main>

      {/* TCS / TRAX EXPRESS COURIER DISPATCH SLIP MODAL */}
      {selectedOrderForSlip && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className={`max-w-lg w-full p-6 space-y-4 border shadow-2xl ${
            darkMode ? 'bg-neutral-900 border-neutral-800 text-white' : 'bg-white border-neutral-300 text-neutral-950'
          }`}>
            <div className={`flex items-center justify-between border-b pb-3 ${
              darkMode ? 'border-neutral-700/50' : 'border-neutral-200'
            }`}>
              <div>
                <h3 className="font-serif text-base font-normal">TCS / Trax Express Courier Dispatch Slip</h3>
                <p className={`text-xs font-mono ${
                  darkMode ? 'text-neutral-400' : 'text-neutral-600 font-semibold'
                }`}>Order #{selectedOrderForSlip.id}</p>
              </div>
              <button
                onClick={() => setSelectedOrderForSlip(null)}
                className={`p-1 cursor-pointer ${
                  darkMode ? 'text-neutral-400 hover:text-white' : 'text-neutral-600 hover:text-black'
                }`}
              >
                <X className="w-4 h-4 stroke-[1.8]" />
              </button>
            </div>

            <div className={`border p-4 space-y-3 text-xs ${
              darkMode ? 'bg-neutral-950 border-neutral-800' : 'bg-[#FAF9F8] border-neutral-300'
            }`}>
              <div className={`flex justify-between border-b pb-2 ${
                darkMode ? 'border-neutral-700/50' : 'border-neutral-200'
              }`}>
                <span className={`text-[10px] uppercase tracking-wider font-semibold ${
                  darkMode ? 'text-neutral-400' : 'text-neutral-600'
                }`}>CONSIGNEE:</span>
                <span className="font-serif text-sm font-semibold">
                  {selectedOrderForSlip.paymentMethod === 'COD' 
                    ? `COD: Rs. ${selectedOrderForSlip.totalAmount.toLocaleString()}` 
                    : 'PREPAID'}
                </span>
              </div>
              <div>
                <p className="font-semibold text-sm">{selectedOrderForSlip.customerName}</p>
                <p className={`font-mono mt-0.5 font-medium ${
                  darkMode ? 'text-neutral-400' : 'text-neutral-700'
                }`}>Phone: {selectedOrderForSlip.mobileNumber}</p>
                <p className={`mt-1 ${
                  darkMode ? 'text-neutral-300' : 'text-neutral-800'
                }`}>{selectedOrderForSlip.shippingAddress}, {selectedOrderForSlip.city}, {selectedOrderForSlip.province}</p>
              </div>
              <div className={`pt-2 border-t text-[10px] tracking-wider uppercase font-medium ${
                darkMode ? 'border-neutral-700/50 text-neutral-400' : 'border-neutral-200 text-neutral-600'
              }`}>
                Shipper: Bachpan PK Atelier Logistics, Warehouse #4, Industrial Area, Gulberg III, Lahore.
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setSelectedOrderForSlip(null)}
                className={`px-4 py-2 border text-xs uppercase tracking-wider font-medium cursor-pointer ${
                  darkMode ? 'border-neutral-700 text-neutral-300 hover:text-white' : 'border-neutral-300 text-neutral-700 hover:text-black bg-white shadow-2xs'
                }`}
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className={`px-4 py-2 text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer font-semibold ${
                  darkMode ? 'bg-white text-neutral-900 hover:bg-neutral-200' : 'bg-neutral-900 text-white hover:bg-black shadow-xs'
                }`}
              >
                <Printer className="w-3.5 h-3.5 stroke-[1.8]" />
                <span>Print Slip</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* WHATSAPP INVOICE GENERATOR MODAL */}
      {selectedOrderForInvoice && (
        <div 
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fadeIn font-sans"
          onClick={() => {
            setSelectedOrderForInvoice(null);
            setCopiedInvoice(false);
          }}
        >
          <div 
            className={`max-w-xl w-full border shadow-2xl overflow-hidden flex flex-col max-h-[92vh] ${
              darkMode ? 'bg-neutral-900 border-neutral-800 text-white' : 'bg-white border-neutral-300 text-neutral-950'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className={`p-6 border-b flex items-center justify-between shrink-0 ${
              darkMode ? 'border-neutral-800' : 'border-neutral-200'
            }`}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center border border-emerald-500/40">
                  <MessageCircle className="w-4 h-4 stroke-[1.8]" />
                </div>
                <div>
                  <span className={`text-[10px] uppercase tracking-[0.2em] font-semibold block ${
                    darkMode ? 'text-neutral-400' : 'text-neutral-600'
                  }`}>
                    Instant WhatsApp Generator
                  </span>
                  <h3 className="font-serif text-lg font-semibold">
                    Order Invoice #{selectedOrderForInvoice.id}
                  </h3>
                </div>
              </div>
              <button
                onClick={() => {
                  setSelectedOrderForInvoice(null);
                  setCopiedInvoice(false);
                }}
                className={`p-1.5 cursor-pointer ${
                  darkMode ? 'text-neutral-400 hover:text-white' : 'text-neutral-600 hover:text-black'
                }`}
              >
                <X className="w-4 h-4 stroke-[1.8]" />
              </button>
            </div>

            {/* Recipient & Summary strip */}
            <div className={`px-6 py-3 border-b flex flex-wrap items-center justify-between gap-2 text-xs ${
              darkMode ? 'bg-neutral-950 border-neutral-800' : 'bg-[#FAF9F8] border-neutral-200'
            }`}>
              <div className="flex items-center gap-2">
                <span className={darkMode ? 'text-neutral-400' : 'text-neutral-600'}>Recipient:</span>
                <span className="font-semibold">{selectedOrderForInvoice.customerName}</span>
                <span className={`font-mono font-medium ${darkMode ? 'text-neutral-400' : 'text-neutral-600'}`}>
                  ({selectedOrderForInvoice.mobileNumber})
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedCustomerForHistory({
                    name: selectedOrderForInvoice.customerName,
                    phone: selectedOrderForInvoice.mobileNumber
                  })}
                  className="ml-2 inline-flex items-center gap-1 text-[10px] uppercase font-semibold text-emerald-600 hover:text-emerald-700 underline cursor-pointer"
                  title="View Purchase History & COD Risk Log"
                >
                  <ShieldCheck className="w-3.5 h-3.5 stroke-[2]" />
                  <span>Vet COD Risk</span>
                </button>
              </div>
              <div className="flex items-center gap-2 font-mono">
                <span className={darkMode ? 'text-neutral-400' : 'text-neutral-600'}>Total Bill:</span>
                <strong className="font-serif text-sm font-semibold">Rs. {selectedOrderForInvoice.totalAmount.toLocaleString()}</strong>
              </div>
            </div>

            {/* Invoice Message Preview */}
            <div className="p-6 overflow-y-auto space-y-3">
              <div className="flex items-center justify-between">
                <span className={`text-xs uppercase tracking-wider font-semibold ${
                  darkMode ? 'text-neutral-300' : 'text-neutral-800'
                }`}>
                  WhatsApp Message Template
                </span>
                <span className={`text-[10px] font-medium ${
                  darkMode ? 'text-neutral-400' : 'text-neutral-500'
                }`}>
                  Ready for customer verification
                </span>
              </div>

              <div className="relative">
                <textarea
                  readOnly
                  rows={13}
                  value={generateWhatsAppInvoiceText(selectedOrderForInvoice)}
                  className={`w-full p-4 border font-mono text-xs leading-relaxed focus:outline-none resize-none select-all ${
                    darkMode ? 'bg-neutral-950 border-neutral-800 text-neutral-200' : 'bg-[#FAF9F8] border-neutral-300 text-neutral-900'
                  }`}
                />
              </div>

              {copiedInvoice && (
                <div className="p-3 bg-emerald-500/20 border border-emerald-500/50 text-emerald-700 text-xs flex items-center gap-2 animate-fadeIn font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Invoice copied to clipboard! You can now paste directly into WhatsApp.</span>
                </div>
              )}
            </div>

            {/* Footer Quick Actions */}
            <div className={`p-5 border-t flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0 ${
              darkMode ? 'border-neutral-800 bg-neutral-900' : 'border-neutral-200 bg-white'
            }`}>
              <button
                type="button"
                onClick={() => {
                  setSelectedOrderForInvoice(null);
                  setCopiedInvoice(false);
                }}
                className={`w-full sm:w-auto px-4 py-2 border text-xs uppercase tracking-wider font-medium cursor-pointer ${
                  darkMode ? 'border-neutral-700 text-neutral-300 hover:text-white' : 'border-neutral-300 text-neutral-700 hover:text-black bg-white shadow-2xs'
                }`}
              >
                Close
              </button>

              <div className="w-full sm:w-auto flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    const text = generateWhatsAppInvoiceText(selectedOrderForInvoice);
                    navigator.clipboard.writeText(text);
                    setCopiedInvoice(true);
                    setTimeout(() => setCopiedInvoice(false), 3000);
                  }}
                  className={`flex-1 sm:flex-none px-4 py-2 border text-xs uppercase tracking-wider font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                    darkMode ? 'border-neutral-700 hover:border-white text-white' : 'border-neutral-900 text-neutral-900 hover:bg-neutral-900 hover:text-white shadow-2xs'
                  }`}
                >
                  {copiedInvoice ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 stroke-[1.8]" />
                      <span>Copy Invoice</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const text = generateWhatsAppInvoiceText(selectedOrderForInvoice);
                    const cleanPhone = selectedOrderForInvoice.mobileNumber.replace(/\D/g, '');
                    const intlPhone = cleanPhone.startsWith('0') ? '92' + cleanPhone.substring(1) : cleanPhone;
                    window.open(`https://wa.me/${intlPhone}?text=${encodeURIComponent(text)}`, '_blank');
                  }}
                  className="flex-1 sm:flex-none px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer font-semibold shadow-xs"
                >
                  <Send className="w-3.5 h-3.5 stroke-[1.8]" />
                  <span>Send via WhatsApp</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Product Upload / Edit Modal */}
      <ProductUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => {
          setIsUploadModalOpen(false);
          setProductToEdit(null);
        }}
        productToEdit={productToEdit}
        onProductAdded={(savedProd) => {
          setProducts((prev) => {
            const exists = prev.find(p => p.id === savedProd.id);
            if (exists) {
              return prev.map(p => p.id === savedProd.id ? savedProd : p);
            }
            return [savedProd, ...prev];
          });
          setIsUploadModalOpen(false);
          setProductToEdit(null);
          setActionSuccess(productToEdit ? `"${savedProd.title}" updated successfully!` : `"${savedProd.title}" published to catalog!`);
          setTimeout(() => setActionSuccess(null), 4000);
        }}
      />

      {/* Customer Purchase History Log & COD Risk Vetting Modal */}
      {selectedCustomerForHistory && (
        <CustomerHistoryModal
          isOpen={!!selectedCustomerForHistory}
          onClose={() => setSelectedCustomerForHistory(null)}
          customerName={selectedCustomerForHistory.name}
          customerPhone={selectedCustomerForHistory.phone}
          allOrders={orders}
          darkMode={darkMode}
          onSelectOrder={(ord) => {
            setSelectedOrderForInvoice(ord);
          }}
        />
      )}

    </div>
  );
};
