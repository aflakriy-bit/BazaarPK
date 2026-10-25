import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Volume2, 
  VolumeX, 
  Play, 
  ShoppingBag, 
  Zap, 
  ChevronLeft, 
  ChevronRight, 
  MessageCircle,
  Sparkles,
  Heart,
  Eye
} from 'lucide-react';
import { Product } from '../types';
import { api } from '../services/api';

interface ReelPlayerModalProps {
  products: Product[];
  initialProduct: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, size?: string) => void;
  onQuickBuy: (product: Product, size?: string) => void;
}

export const ReelPlayerModal: React.FC<ReelPlayerModalProps> = ({
  products,
  initialProduct,
  isOpen,
  onClose,
  onAddToCart,
  onQuickBuy,
}) => {
  const reelProducts = products.filter(p => !!p.videoUrl);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [likesMap, setLikesMap] = useState<Record<string, number>>({});
  const [hasLikedMap, setHasLikedMap] = useState<Record<string, boolean>>({});
  const [viewsMap, setViewsMap] = useState<Record<string, number>>({});
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (initialProduct) {
      const idx = reelProducts.findIndex(p => p.id === initialProduct.id);
      if (idx !== -1) {
        setCurrentIndex(idx);
      }
    }
  }, [initialProduct, isOpen]);

  const currentProduct = reelProducts[currentIndex] || reelProducts[0];

  // Track video reel view whenever a reel opens
  useEffect(() => {
    if (isOpen && currentProduct) {
      api.trackProductView(currentProduct.id).then((v) => {
        if (v) setViewsMap(prev => ({ ...prev, [currentProduct.id]: v }));
      });
    }
  }, [currentIndex, isOpen, currentProduct?.id]);

  useEffect(() => {
    if (isOpen && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {
        setIsPlaying(false);
      });
      setIsPlaying(true);
    }
  }, [currentIndex, isOpen]);

  if (!isOpen || reelProducts.length === 0) return null;

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % reelProducts.length);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + reelProducts.length) % reelProducts.length);
  };

  const handleWhatsAppReel = (e: React.MouseEvent) => {
    e.stopPropagation();
    const msg = encodeURIComponent(
      `Assalam-o-Alaikum! I just saw your kids video reel for "${currentProduct.title}" (Rs. ${currentProduct.price.toLocaleString()}). I would like to order it via Cash on Delivery for my child.`
    );
    window.open(`https://wa.me/923001234567?text=${msg}`, '_blank');
  };

  const handleLikeReel = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasLikedMap[currentProduct.id]) return;
    setHasLikedMap(prev => ({ ...prev, [currentProduct.id]: true }));
    api.trackProductLike(currentProduct.id).then((l) => {
      if (l) setLikesMap(prev => ({ ...prev, [currentProduct.id]: l }));
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-50 p-2.5 rounded-full bg-black/50 text-white hover:bg-black/80 transition-colors cursor-pointer"
        aria-label="Close reels"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Navigation arrows (desktop) */}
      <button
        onClick={handlePrev}
        className="hidden md:flex absolute left-8 top-1/2 -translate-y-1/2 z-40 p-3 rounded-full bg-white/20 hover:bg-white/40 text-white transition-all backdrop-blur-md"
        title="Previous reel"
      >
        <ChevronLeft className="w-7 h-7" />
      </button>

      <button
        onClick={handleNext}
        className="hidden md:flex absolute right-8 top-1/2 -translate-y-1/2 z-40 p-3 rounded-full bg-white/20 hover:bg-white/40 text-white transition-all backdrop-blur-md"
        title="Next reel"
      >
        <ChevronRight className="w-7 h-7" />
      </button>

      {/* Main Reel Container (9:16 mobile phone proportion) */}
      <div 
        className="relative w-full max-w-[420px] h-[92vh] max-h-[780px] bg-black rounded-3xl overflow-hidden shadow-2xl border border-pink-500/20 flex flex-col justify-between"
        onClick={togglePlay}
      >
        {/* Video Player */}
        <video
          ref={videoRef}
          src={currentProduct.videoUrl}
          poster={currentProduct.imageUrl}
          playsInline
          loop
          muted={isMuted}
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/90 pointer-events-none" />

        {/* Top Header Bar */}
        <div className="relative z-20 p-4 flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <span className="bg-gradient-to-r from-pink-500 to-rose-500 text-white text-[11px] font-black uppercase px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md">
              <Sparkles className="w-3.5 h-3.5 text-yellow-300" /> Bachpan PK Live Reel
            </span>
            <span className="text-xs text-white/80 font-medium">
              {currentIndex + 1} of {reelProducts.length}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleMute}
              className="p-2 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md transition-colors"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Center Play/Pause indicator when paused */}
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
            <div className="w-16 h-16 rounded-full bg-black/60 text-white flex items-center justify-center backdrop-blur-md">
              <Play className="w-8 h-8 fill-white ml-1" />
            </div>
          </div>
        )}

        {/* Floating Right Action Bar: Like & Views Engagement (Video Analytics Algorithm) */}
        <div className="absolute right-3 bottom-52 z-30 flex flex-col items-center gap-3.5">
          {/* Like Heart Button */}
          <button
            onClick={handleLikeReel}
            className="flex flex-col items-center gap-1 group cursor-pointer"
            title="Like this outfit reel"
          >
            <div className={`w-11 h-11 rounded-full flex items-center justify-center backdrop-blur-md transition-all shadow-lg ${
              hasLikedMap[currentProduct.id] 
                ? 'bg-rose-600 text-white scale-110' 
                : 'bg-black/50 hover:bg-rose-600/80 text-white'
            }`}>
              <Heart className={`w-5 h-5 ${hasLikedMap[currentProduct.id] ? 'fill-white' : 'group-hover:fill-white'}`} />
            </div>
            <span className="text-[10px] font-black text-white drop-shadow-md">
              {(likesMap[currentProduct.id] ?? currentProduct.likes ?? 120).toLocaleString()}
            </span>
          </button>

          {/* Views Counter */}
          <div className="flex flex-col items-center gap-1">
            <div className="w-9 h-9 rounded-full bg-black/50 text-white/90 flex items-center justify-center backdrop-blur-md shadow-md">
              <Eye className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold text-white/80 drop-shadow-md">
              {(viewsMap[currentProduct.id] ?? currentProduct.views ?? 1200).toLocaleString()}
            </span>
          </div>
        </div>

        {/* Bottom Product Details Card */}
        <div className="relative z-20 p-4 space-y-3" onClick={(e) => e.stopPropagation()}>
          <div className="bg-black/70 backdrop-blur-md border border-white/20 rounded-3xl p-3.5 text-white shadow-xl">
            <div className="flex items-start gap-3">
              <img
                src={currentProduct.imageUrl}
                alt={currentProduct.title}
                className="w-16 h-16 rounded-2xl object-cover border border-white/30 shrink-0"
              />
              <div className="flex-1 min-w-0">
                <span className="text-[10px] uppercase font-bold text-pink-300 flex items-center gap-1">
                  <Heart className="w-2.5 h-2.5 fill-pink-400 text-pink-400" />
                  {currentProduct.category} {currentProduct.ageGroup ? `• ${currentProduct.ageGroup}` : ''}
                </span>
                <h4 className="font-extrabold text-sm text-white truncate">
                  {currentProduct.title}
                </h4>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="font-black text-lg text-yellow-300">
                    Rs. {currentProduct.price.toLocaleString()}
                  </span>
                  {currentProduct.originalPrice && (
                    <span className="text-xs text-white/60 line-through">
                      Rs. {currentProduct.originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Actions inside Reel */}
            <div className="grid grid-cols-2 gap-2 mt-3">
              <button
                onClick={() => {
                  onAddToCart(currentProduct);
                }}
                className="py-2.5 px-3 rounded-2xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                <ShoppingBag className="w-3.5 h-3.5 text-pink-300" />
                <span>Add to Bag</span>
              </button>

              <button
                onClick={() => {
                  onClose();
                  onQuickBuy(currentProduct);
                }}
                className="py-2.5 px-3 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white text-xs font-black flex items-center justify-center gap-1.5 shadow-lg transition-transform active:scale-95"
              >
                <Zap className="w-3.5 h-3.5 fill-yellow-300 text-yellow-300" />
                <span>Buy COD Now</span>
              </button>
            </div>

            {/* WhatsApp direct order */}
            <button
              onClick={handleWhatsAppReel}
              className="w-full mt-2 py-2 px-3 rounded-xl bg-green-500 hover:bg-green-600 text-white text-[11px] font-bold flex items-center justify-center gap-1.5 transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-white" />
              <span>Order via WhatsApp (Instant Dispatch)</span>
            </button>
          </div>

          {/* Mobile swipe hint */}
          <div className="flex items-center justify-between text-[11px] text-white/60 px-1 md:hidden">
            <button onClick={handlePrev} className="underline">← Previous Reel</button>
            <span>Tap to play/pause</span>
            <button onClick={handleNext} className="underline">Next Reel →</button>
          </div>
        </div>

      </div>
    </div>
  );
};
