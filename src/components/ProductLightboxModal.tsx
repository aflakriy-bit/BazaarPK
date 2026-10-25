import React, { useState, useEffect } from 'react';
import { 
  X, 
  ShoppingBag, 
  Check, 
  Truck, 
  RotateCcw, 
  ShieldCheck, 
  ChevronDown, 
  ChevronUp, 
  MessageCircle, 
  Play, 
  Ruler,
  Info,
  ZoomIn,
  ZoomOut,
  Sparkles,
  Star
} from 'lucide-react';
import { Product } from '../types';
import { ProductReviews } from './ProductReviews';
import { FrequentlyBoughtTogether } from './FrequentlyBoughtTogether';

interface ProductLightboxModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, size?: string) => void;
  onQuickBuy: (product: Product, size?: string) => void;
  onOpenReel?: (product: Product) => void;
  whatsappNumber?: string;
  onOpenSizeGuide?: (product: Product) => void;
  onReviewSubmitted?: (productId: string, newRating: number, newCount: number) => void;
  globalSizeChartImageUrl?: string;
}

export const ProductLightboxModal: React.FC<ProductLightboxModalProps> = ({
  product,
  isOpen,
  onClose,
  onAddToCart,
  onQuickBuy,
  onOpenReel,
  whatsappNumber,
  onOpenSizeGuide,
  onReviewSubmitted,
  globalSizeChartImageUrl,
}) => {
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [isAdded, setIsAdded] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState<'description' | 'sizechart' | 'care' | 'reviews' | null>('description');
  const [showSizeChartOverlay, setShowSizeChartOverlay] = useState(false);
  const [openReviewForm, setOpenReviewForm] = useState(false);

  // Dynamic reviews and aggregate rating state
  const [currentRating, setCurrentRating] = useState<number>(product?.rating || 5.0);
  const [currentReviewCount, setCurrentReviewCount] = useState<number>(product?.reviewCount || 0);

  useEffect(() => {
    if (product) {
      setCurrentRating(product.rating || 5.0);
      setCurrentReviewCount(product.reviewCount || 0);
      setOpenReviewForm(false);
    }
  }, [product]);

  const handleOpenReviews = (writeMode = false) => {
    setActiveAccordion('reviews');
    if (writeMode) {
      setOpenReviewForm(true);
    }
    setTimeout(() => {
      const el = document.getElementById('lightbox-reviews-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }, 100);
  };

  const handleReviewSubmitted = (newRating: number, newCount: number) => {
    setCurrentRating(newRating);
    setCurrentReviewCount(newCount);
    setOpenReviewForm(false);
    if (product && onReviewSubmitted) {
      onReviewSubmitted(product.id, newRating, newCount);
    }
  };

  // Interactive High-Resolution Fabric & Embroidery Zoom States
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState<{ x: number; y: number }>({ x: 50, y: 50 });
  const [zoomLevel, setZoomLevel] = useState<number>(2.5);

  if (!isOpen || !product) return null;

  const currentSize = selectedSize || (product.sizes && product.sizes.length > 0 ? product.sizes[0] : 'Standard');
  const discountPercent = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAdd = () => {
    for (let i = 0; i < quantity; i++) {
      onAddToCart(product, currentSize);
    }
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleBuyNow = () => {
    onQuickBuy(product, currentSize);
    onClose();
  };

  const handleWhatsAppInquiry = () => {
    const rawNumber = (whatsappNumber || '03001234567').replace(/\D/g, '');
    const cleanNumber = rawNumber.startsWith('92') 
      ? rawNumber 
      : (rawNumber.startsWith('0') ? `92${rawNumber.slice(1)}` : `92${rawNumber}`);

    const msg = encodeURIComponent(
      `Assalam-o-Alaikum Bachpan PK! I am inquiring about *${product.title}* (Code: #${product.id}, Size: ${currentSize}).\n\nCould you please guide me on size availability and fabric texture for my child?`
    );
    window.open(`https://wa.me/${cleanNumber}?text=${msg}`, '_blank');
  };

  // Zoom Loupe Handlers
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
    setZoomPos({ x, y });
    setIsZoomed(true);
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
    setZoomPos({ x, y });
    setIsZoomed(true);
  };

  const handleMouseLeave = () => {
    setIsZoomed(false);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length > 0) {
      const touch = e.touches[0];
      const rect = e.currentTarget.getBoundingClientRect();
      const x = Math.max(0, Math.min(100, ((touch.clientX - rect.left) / rect.width) * 100));
      const y = Math.max(0, Math.min(100, ((touch.clientY - rect.top) / rect.height) * 100));
      setZoomPos({ x, y });
      setIsZoomed(true);
    }
  };

  const handleToggleZoom = () => {
    setIsZoomed((prev) => !prev);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div 
        className="relative w-full max-w-4xl bg-white shadow-2xl overflow-hidden border border-neutral-200 my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 bg-white/90 hover:bg-black hover:text-white text-neutral-800 transition-colors flex items-center justify-center cursor-pointer border border-neutral-200"
          aria-label="Close modal"
        >
          <X className="w-4 h-4 stroke-[1.5]" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          
          {/* Left Column: High-Resolution Photo & Smooth Detail Zoom Loupe */}
          <div className="relative bg-[#F7F7F6] flex flex-col justify-center items-center p-6 sm:p-10 border-b md:border-b-0 md:border-r border-neutral-100">
            {/* Top Bar: Magnification Level Selector */}
            <div className="w-full flex items-center justify-between pb-3">
              <span className="text-[10px] uppercase tracking-[0.2em] text-neutral-500 font-light flex items-center gap-1.5">
                <ZoomIn className="w-3 h-3 text-neutral-700 stroke-[1.5]" />
                <span>Fabric & Stitch Zoom</span>
              </span>

              <div className="flex items-center gap-1">
                {[2, 2.5, 3].map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setZoomLevel(lvl);
                    }}
                    className={`px-2 py-0.5 text-[10px] uppercase tracking-wider transition-colors cursor-pointer border ${
                      zoomLevel === lvl
                        ? 'bg-neutral-900 text-white border-neutral-900 font-medium'
                        : 'bg-white text-neutral-600 border-neutral-200 hover:border-neutral-400'
                    }`}
                  >
                    {lvl}x
                  </button>
                ))}
              </div>
            </div>

            {/* Image Container with Interactive Mouse Hover Zoom & Strict 3:4 Aspect Ratio Protector */}
            <div 
              className="product-aspect-ratio-protector relative w-full aspect-[3/4] overflow-hidden bg-neutral-100 cursor-crosshair select-none group/zoom border border-neutral-200/60"
              onMouseMove={handleMouseMove}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onTouchMove={handleTouchMove}
              onTouchStart={handleTouchMove}
              onTouchEnd={() => setIsZoomed(false)}
              onClick={handleToggleZoom}
            >
              <img
                src={product.imageUrl}
                alt={product.title}
                className="w-full h-full object-cover object-center pointer-events-none select-none"
                style={{
                  transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                  transform: isZoomed ? `scale(${zoomLevel})` : 'scale(1)',
                  transition: isZoomed ? 'transform 0.12s ease-out' : 'transform 0.4s ease-out',
                }}
              />

              {/* Status Pill Indicator */}
              <div className="absolute top-3 right-3 pointer-events-none z-10 transition-opacity duration-300">
                {isZoomed ? (
                  <div className="bg-neutral-900/90 text-white text-[10px] tracking-wider uppercase px-2.5 py-1 backdrop-blur-xs flex items-center gap-1.5 shadow-sm">
                    <Sparkles className="w-3 h-3 text-amber-300 stroke-[1.5]" />
                    <span>{zoomLevel}x Detail Loupe</span>
                  </div>
                ) : (
                  <div className="bg-white/90 text-neutral-800 text-[10px] tracking-wider uppercase px-2.5 py-1 backdrop-blur-xs flex items-center gap-1.5 shadow-xs border border-neutral-200/80">
                    <ZoomIn className="w-3 h-3 text-neutral-600 stroke-[1.5]" />
                    <span className="hidden sm:inline">Hover To Zoom</span>
                  </div>
                )}
              </div>

              {/* Video Reel Overlay Button if applicable */}
              {product.videoUrl && onOpenReel && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenReel(product);
                    onClose();
                  }}
                  className="absolute bottom-4 left-4 right-4 bg-black/85 hover:bg-black text-white text-xs uppercase tracking-widest font-light py-2.5 px-4 flex items-center justify-center gap-2 backdrop-blur-xs transition-colors cursor-pointer z-10"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Watch 9:16 Video Reel</span>
                </button>
              )}

              {/* Discount Tag */}
              {discountPercent > 0 && (
                <div className="absolute top-3 left-3 border border-neutral-900 bg-white text-neutral-900 text-[10px] uppercase tracking-wider px-2 py-0.5 font-light z-10">
                  Offer {discountPercent}%
                </div>
              )}
            </div>

            <div className="flex items-center justify-between w-full mt-3 text-[10px] uppercase tracking-[0.18em] text-neutral-400 font-light">
              <span>Natural Daylight Photography</span>
              <span>Move cursor to inspect weave</span>
            </div>
          </div>

          {/* Right Column: Details, Sizing, Add to Cart & Accordion */}
          <div className="p-6 sm:p-10 flex flex-col justify-between space-y-6 overflow-y-auto max-h-[85vh]">
            
            <div className="space-y-4">
              {/* Category */}
              <div>
                <span className="text-[10px] uppercase tracking-[0.25em] text-neutral-400 font-light block">
                  {product.category}
                </span>
                <h1 className="font-serif text-2xl sm:text-3xl font-normal text-neutral-900 tracking-wide mt-1">
                  {product.title}
                </h1>
              </div>

              {/* Star Rating & Reviews Quick Anchor */}
              <div className="flex flex-wrap items-center gap-2 pt-0.5">
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-3.5 h-3.5 ${
                        star <= Math.round(currentRating)
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-neutral-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs font-serif font-medium text-neutral-900">
                  {Number(currentRating).toFixed(1)}
                </span>
                <span className="text-neutral-300 text-xs">·</span>
                <button
                  type="button"
                  onClick={() => handleOpenReviews(false)}
                  className="text-xs text-neutral-600 hover:text-black underline underline-offset-2 cursor-pointer font-light transition-colors"
                >
                  {currentReviewCount} verified reviews
                </button>
                <span className="text-neutral-300 text-xs">·</span>
                <button
                  type="button"
                  onClick={() => handleOpenReviews(true)}
                  className="text-[11px] uppercase tracking-wider text-neutral-800 hover:text-black cursor-pointer font-medium hover:underline bg-neutral-100 hover:bg-neutral-200/90 px-2 py-0.5 border border-neutral-200 transition-colors"
                >
                  Write Review
                </button>
              </div>

              {/* Price & Stock */}
              <div className="flex items-baseline gap-3 pt-1">
                <span className="font-serif text-2xl text-neutral-900 font-normal">
                  Rs. {product.price.toLocaleString()}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-xs font-light text-neutral-400 line-through">
                    Rs. {product.originalPrice.toLocaleString()}
                  </span>
                )}
                {product.stock <= 5 && product.stock > 0 && (
                  <span className="text-[10px] uppercase tracking-wider border border-amber-300 text-amber-800 bg-amber-50/50 px-2 py-0.5 font-light">
                    Only {product.stock} left in stock
                  </span>
                )}
              </div>

              {/* Sizing selector & View Size Chart */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs uppercase tracking-wider text-neutral-700 font-light">
                    {product.sizes && product.sizes.length > 0 ? (
                      <>Size: <span className="font-medium text-neutral-900">{currentSize}</span></>
                    ) : (
                      <span className="font-medium text-neutral-900">Standard Fit</span>
                    )}
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowSizeChartOverlay(true)}
                    className="text-[11px] uppercase tracking-wider text-neutral-900 hover:text-black bg-neutral-100 hover:bg-neutral-200/90 px-2.5 py-1 border border-neutral-300 flex items-center gap-1.5 cursor-pointer font-medium transition-colors shadow-2xs"
                    title="View uploaded standard kids size guide"
                  >
                    <Ruler className="w-3.5 h-3.5 stroke-[1.5] text-neutral-800" />
                    <span>View Size Chart</span>
                  </button>
                </div>

                {product.sizes && product.sizes.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setSelectedSize(s)}
                        className={`px-3 py-1.5 text-xs tracking-wider uppercase transition-colors cursor-pointer border ${
                          currentSize === s
                            ? 'border-neutral-900 bg-neutral-900 text-white font-medium'
                            : 'border-neutral-200 hover:border-neutral-900 text-neutral-700 font-light'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Quantity */}
              <div className="flex items-center gap-3 pt-1">
                <span className="text-xs uppercase tracking-wider text-neutral-600 font-light">Quantity:</span>
                <div className="flex items-center border border-neutral-200">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1 text-neutral-500 hover:text-black font-light cursor-pointer"
                  >
                    -
                  </button>
                  <span className="px-3 py-1 text-xs font-mono text-neutral-900">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-1 text-neutral-500 hover:text-black font-light cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Primary Actions */}
              <div className="flex flex-col sm:flex-row gap-3 pt-3">
                <button
                  onClick={handleAdd}
                  className="flex-1 py-3.5 px-6 bg-neutral-900 hover:bg-black text-white text-xs uppercase tracking-[0.2em] font-light flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  {isAdded ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Added To Bag</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-3.5 h-3.5 stroke-[1.5]" />
                      <span>Add To Cart</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleBuyNow}
                  className="py-3.5 px-6 border border-neutral-900 text-neutral-900 hover:bg-neutral-900 hover:text-white text-xs uppercase tracking-[0.2em] font-light transition-colors cursor-pointer"
                >
                  <span>Instant COD</span>
                </button>
              </div>

              {/* WhatsApp Inquiry Button */}
              <button
                onClick={handleWhatsAppInquiry}
                className="w-full py-2.5 px-3 border border-neutral-200 hover:border-black text-neutral-700 hover:text-black text-xs uppercase tracking-wider font-light flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <MessageCircle className="w-3.5 h-3.5 stroke-[1.5]" />
                <span>Ask Concierge On WhatsApp</span>
              </button>

              {/* Frequently Bought Together / Cross-Selling Upsell Widget */}
              <FrequentlyBoughtTogether
                currentProduct={product}
                onAddBundle={(bundle) => {
                  bundle.forEach(item => {
                    const chosenSize = item.id === product.id 
                      ? currentSize 
                      : (item.sizes && item.sizes.length > 0 ? item.sizes[0] : 'Standard');
                    onAddToCart(item, chosenSize);
                  });
                }}
              />
            </div>

            {/* EXPANDABLE ACCORDIONS (Description, Size Chart, Fabric & Care) */}
            <div className="pt-4 border-t border-neutral-200 space-y-2">
              
              {/* Accordion 1: Description & Fabric */}
              <div className="border border-neutral-200">
                <button
                  onClick={() => setActiveAccordion(activeAccordion === 'description' ? null : 'description')}
                  className="w-full p-3 text-left flex items-center justify-between text-xs uppercase tracking-wider text-neutral-900 font-light hover:bg-neutral-50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <Info className="w-3.5 h-3.5 stroke-[1.5]" />
                    <span>Cloth Details & Fabric</span>
                  </div>
                  {activeAccordion === 'description' ? <ChevronUp className="w-3.5 h-3.5 stroke-[1.5]" /> : <ChevronDown className="w-3.5 h-3.5 stroke-[1.5]" />}
                </button>

                {activeAccordion === 'description' && (
                  <div className="p-4 bg-[#FAF9F8] text-xs text-neutral-600 font-light space-y-3 leading-relaxed border-t border-neutral-200">
                    <p>{product.description}</p>
                    <div className="grid grid-cols-2 gap-3 pt-2 border-t border-neutral-200">
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-neutral-400 block font-light">Fabric Material</span>
                        <span className="text-neutral-900 font-normal">{product.fabric || '100% Breathable Cotton'}</span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-neutral-400 block font-light">Recommended Age</span>
                        <span className="text-neutral-900 font-normal">{product.ageGroup || 'Standard Pakistani Sizing'}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Accordion 2: Size Chart Table */}
              <div className="border border-neutral-200">
                <button
                  onClick={() => setActiveAccordion(activeAccordion === 'sizechart' ? null : 'sizechart')}
                  className="w-full p-3 text-left flex items-center justify-between text-xs uppercase tracking-wider text-neutral-900 font-light hover:bg-neutral-50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <Ruler className="w-3.5 h-3.5 stroke-[1.5]" />
                    <span>Size Chart (Inches)</span>
                  </div>
                  {activeAccordion === 'sizechart' ? <ChevronUp className="w-3.5 h-3.5 stroke-[1.5]" /> : <ChevronDown className="w-3.5 h-3.5 stroke-[1.5]" />}
                </button>

                {activeAccordion === 'sizechart' && (
                  <div className="p-4 bg-[#FAF9F8] text-xs border-t border-neutral-200">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-neutral-200 text-neutral-400 uppercase tracking-wider text-[10px] font-light">
                          <th className="py-2 px-2">Size</th>
                          <th className="py-2 px-2">Age Bracket</th>
                          <th className="py-2 px-2">Chest</th>
                          <th className="py-2 px-2">Length</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-100 font-light text-neutral-700">
                        {(product.sizeChart || [
                          { size: '1-2Y', age: '1-2 Years', chest: '22 in', length: '19 in' },
                          { size: '2-3Y', age: '2-3 Years', chest: '24 in', length: '21 in' },
                          { size: '3-4Y', age: '3-4 Years', chest: '26 in', length: '23 in' },
                          { size: '5-6Y', age: '5-6 Years', chest: '28 in', length: '25 in' },
                        ]).map((row, idx) => (
                          <tr key={idx} className={row.size === currentSize ? 'bg-white font-medium text-neutral-900' : ''}>
                            <td className="py-2 px-2">{row.size}</td>
                            <td className="py-2 px-2 text-neutral-500">{row.age}</td>
                            <td className="py-2 px-2">{row.chest}</td>
                            <td className="py-2 px-2">{row.length}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div className="pt-3 border-t border-neutral-200/60 mt-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                      <p className="text-[10px] text-neutral-400 font-light">
                        * Standard measurements with comfort margin for growth.
                      </p>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setShowSizeChartOverlay(true)}
                          className="text-[11px] uppercase tracking-wider text-neutral-900 hover:text-black font-medium underline underline-offset-2 flex items-center gap-1 cursor-pointer"
                        >
                          <Ruler className="w-3 h-3 stroke-[1.5]" />
                          <span>View Size Chart Image</span>
                        </button>
                        {onOpenSizeGuide && (
                          <button
                            type="button"
                            onClick={() => onOpenSizeGuide(product)}
                            className="text-[11px] uppercase tracking-wider text-neutral-500 hover:text-black font-light underline underline-offset-2 flex items-center gap-1 cursor-pointer"
                          >
                            <span>Detailed Table</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Accordion 3: Washing & Care */}
              <div className="border border-neutral-200">
                <button
                  onClick={() => setActiveAccordion(activeAccordion === 'care' ? null : 'care')}
                  className="w-full p-3 text-left flex items-center justify-between text-xs uppercase tracking-wider text-neutral-900 font-light hover:bg-neutral-50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 stroke-[1.5]" />
                    <span>Fabric Care Guide</span>
                  </div>
                  {activeAccordion === 'care' ? <ChevronUp className="w-3.5 h-3.5 stroke-[1.5]" /> : <ChevronDown className="w-3.5 h-3.5 stroke-[1.5]" />}
                </button>

                {activeAccordion === 'care' && (
                  <div className="p-4 bg-[#FAF9F8] text-xs text-neutral-600 font-light space-y-1.5 border-t border-neutral-200">
                    <p>{product.careInstructions || 'Wash in cold water with mild baby detergent. Do not bleach. Air dry in shade to preserve embroidery and fabric texture.'}</p>
                    <p className="text-[10px] text-neutral-400">7-Day Hassle-Free Size Exchange Guaranteed nationwide.</p>
                  </div>
                )}
              </div>

              {/* Accordion 4: Customer Reviews & Ratings */}
              <div className="border border-neutral-200" id="lightbox-reviews-section">
                <button
                  type="button"
                  onClick={() => {
                    const next = activeAccordion === 'reviews' ? null : 'reviews';
                    setActiveAccordion(next);
                  }}
                  className="w-full p-3 text-left flex items-center justify-between text-xs uppercase tracking-wider text-neutral-900 font-light hover:bg-neutral-50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400 stroke-[1.5]" />
                    <span>Customer Reviews ({currentReviewCount})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono font-medium text-neutral-800">
                      ★ {Number(currentRating).toFixed(1)}
                    </span>
                    {activeAccordion === 'reviews' ? <ChevronUp className="w-3.5 h-3.5 stroke-[1.5]" /> : <ChevronDown className="w-3.5 h-3.5 stroke-[1.5]" />}
                  </div>
                </button>

                {activeAccordion === 'reviews' && (
                  <div className="p-4 sm:p-5 bg-white text-xs border-t border-neutral-200">
                    <ProductReviews
                      product={{ ...product, rating: currentRating, reviewCount: currentReviewCount }}
                      onReviewSubmitted={handleReviewSubmitted}
                      forceOpenForm={openReviewForm}
                    />
                  </div>
                )}
              </div>

            </div>

            {/* Delivery Trust */}
            <div className="grid grid-cols-2 gap-3 pt-2 text-[10px] uppercase tracking-wider text-neutral-400 font-light">
              <div className="flex items-center gap-1.5">
                <Truck className="w-3 h-3 stroke-[1.5]" />
                <span>Cash on Delivery</span>
              </div>
              <div className="flex items-center gap-1.5">
                <RotateCcw className="w-3 h-3 stroke-[1.5]" />
                <span>7-Day Exchange</span>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* Global Size Chart Image Overlay (Overlaying the uploaded standard kids size guide) */}
      {showSizeChartOverlay && (
        <div 
          className="fixed inset-0 z-60 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fadeIn"
          onClick={() => setShowSizeChartOverlay(false)}
        >
          <div 
            className="relative bg-white border border-neutral-200 max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-200 bg-[#FAF9F8]">
              <div className="flex items-center gap-2.5">
                <Ruler className="w-4 h-4 text-neutral-800 stroke-[1.5]" />
                <div>
                  <h3 className="font-serif text-base sm:text-lg text-neutral-900 font-normal">
                    Bachpan PK · Official Kids Size Chart
                  </h3>
                  <p className="text-[10px] uppercase tracking-widest text-neutral-500 font-light">
                    Standard Pakistan Age & Measurement Guide
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowSizeChartOverlay(false)}
                className="p-1.5 text-neutral-400 hover:text-black transition-colors cursor-pointer"
                aria-label="Close Size Chart"
              >
                <X className="w-5 h-5 stroke-[1.5]" />
              </button>
            </div>

            {/* Scrollable / Zoomable Size Chart Image */}
            <div className="flex-1 overflow-auto p-4 sm:p-6 bg-neutral-100 flex items-center justify-center min-h-[300px]">
              <img
                src={globalSizeChartImageUrl || 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=1200&q=80'}
                alt="Bachpan PK Standard Kids Size Guide"
                className="max-h-[62vh] w-auto max-w-full object-contain shadow-md border border-neutral-200 bg-white"
              />
            </div>

            {/* Footer Guidance */}
            <div className="px-5 py-3.5 border-t border-neutral-200 bg-white flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <p className="text-neutral-500 font-light text-[11px]">
                💡 Standard measurements in inches. If between sizes or taller, choose one size up.
              </p>
              <div className="flex items-center gap-3">
                {onOpenSizeGuide && (
                  <button
                    onClick={() => {
                      setShowSizeChartOverlay(false);
                      onOpenSizeGuide(product);
                    }}
                    className="text-neutral-700 hover:text-black underline text-xs font-light cursor-pointer"
                  >
                    Open Numeric Table
                  </button>
                )}
                <button
                  onClick={() => setShowSizeChartOverlay(false)}
                  className="px-5 py-2 bg-neutral-900 hover:bg-black text-white uppercase tracking-wider text-[11px] font-medium transition-colors cursor-pointer"
                >
                  Close Size Chart
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
