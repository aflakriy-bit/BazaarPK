import React, { useState } from 'react';
import { X, Upload, Sparkles, Tag, Percent, Image as ImageIcon, Check, AlertCircle, Loader2 } from 'lucide-react';
import { Promotion } from '../../types';
import { api } from '../../services/api';

interface PromotionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPromotionCreated: (promo: Promotion) => void;
}

export const PromotionModal: React.FC<PromotionModalProps> = ({
  isOpen,
  onClose,
  onPromotionCreated,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [discountPercentage, setDiscountPercentage] = useState('50');
  const [couponCode, setCouponCode] = useState('BLESSED50');
  const [badgeText, setBadgeText] = useState('Flat 50% Off ✨');
  const [themeColor, setThemeColor] = useState<'pink' | 'emerald' | 'amber' | 'purple' | 'rose'>('pink');
  
  // Media upload from PC
  const [bannerSource, setBannerSource] = useState<'pc' | 'url'>('pc');
  const [selectedFileBase64, setSelectedFileBase64] = useState<string | null>(null);
  const [selectedFileName, setSelectedFileName] = useState('');
  const [directBannerUrl, setDirectBannerUrl] = useState('');
  
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file (PNG/JPG/WEBP).');
      return;
    }

    setSelectedFileName(file.name);
    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const dataUrl = uploadEvent.target?.result as string;
      setSelectedFileBase64(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError('Please enter a promotion title (e.g. Blessed Friday Sale).');
      return;
    }

    if (!couponCode.trim()) {
      setError('Please enter a coupon code (e.g. BLESSED50).');
      return;
    }

    const numericDiscount = parseInt(discountPercentage, 10);
    if (isNaN(numericDiscount) || numericDiscount <= 0 || numericDiscount > 100) {
      setError('Discount percentage must be between 1 and 100.');
      return;
    }

    setIsUploading(true);

    try {
      let finalBannerUrl: string | undefined = undefined;

      if (bannerSource === 'pc' && selectedFileBase64) {
        const uploadResult = await api.uploadFile(selectedFileBase64, selectedFileName, 'image/jpeg');
        finalBannerUrl = uploadResult.url;
      } else if (bannerSource === 'url' && directBannerUrl.trim()) {
        finalBannerUrl = directBannerUrl.trim();
      }

      const newPromo = await api.addPromotion({
        title: title.trim(),
        description: description.trim() || `Enjoy flat ${numericDiscount}% discount with voucher code ${couponCode.toUpperCase().trim()}`,
        discountPercentage: numericDiscount,
        couponCode: couponCode.toUpperCase().trim(),
        bannerImageUrl: finalBannerUrl,
        themeColor,
        badgeText: badgeText.trim() || `Flat ${numericDiscount}% OFF`,
        isActive: true,
      });

      onPromotionCreated(newPromo);
      setIsUploading(false);
      onClose();
    } catch (err: any) {
      setIsUploading(false);
      setError('Failed to create promotion: ' + (err.message || 'Please verify details'));
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 my-8">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-pink-500 to-amber-400 flex items-center justify-center text-white">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white">Add Promotional Offer & Banner</h2>
              <p className="text-xs text-slate-400">Launch marketing campaigns for the Pakistani market</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {error && (
            <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{error}</span>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              Promotion Campaign Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Blessed Friday Sale / Flat 50% Off Kids Gala"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:ring-2 focus:ring-pink-500"
            />
          </div>

          {/* Tagline / Description */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              Short Description / Subtitle
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Flat 50% off all Festive Baba Suits & Frocks with Cash on Delivery"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium"
            />
          </div>

          {/* Discount & Coupon */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Discount Offer (%) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Percent className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="number"
                  value={discountPercentage}
                  onChange={(e) => setDiscountPercentage(e.target.value)}
                  placeholder="50"
                  min="1"
                  max="100"
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-sm font-bold text-pink-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Coupon Voucher Code <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Tag className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="BLESSED50"
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-sm font-mono font-black text-slate-900"
                />
              </div>
            </div>
          </div>

          {/* Theme Color & Badge */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">Badge Text</label>
              <input
                type="text"
                value={badgeText}
                onChange={(e) => setBadgeText(e.target.value)}
                placeholder="Flat 50% Off ✨"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">Banner Color Theme</label>
              <select
                value={themeColor}
                onChange={(e) => setThemeColor(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold"
              >
                <option value="pink">Pink & Purple Gradient</option>
                <option value="emerald">Emerald Green (Pakistani Special)</option>
                <option value="amber">Warm Amber Gold</option>
                <option value="rose">Festive Rose Red</option>
                <option value="purple">Royal Purple</option>
              </select>
            </div>
          </div>

          {/* Banner Media Image */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">
              Promotional Banner Image (Optional)
            </label>
            
            <div className="flex gap-2 mb-2">
              <button
                type="button"
                onClick={() => setBannerSource('pc')}
                className={`flex-1 py-1.5 text-xs font-bold rounded-xl border ${
                  bannerSource === 'pc' ? 'bg-pink-50 border-pink-400 text-pink-700' : 'border-slate-200 text-slate-600'
                }`}
              >
                Upload from PC
              </button>
              <button
                type="button"
                onClick={() => setBannerSource('url')}
                className={`flex-1 py-1.5 text-xs font-bold rounded-xl border ${
                  bannerSource === 'url' ? 'bg-pink-50 border-pink-400 text-pink-700' : 'border-slate-200 text-slate-600'
                }`}
              >
                Paste Image URL
              </button>
            </div>

            {bannerSource === 'pc' ? (
              <div className="border-2 border-dashed border-slate-300 rounded-2xl p-3 text-center cursor-pointer hover:border-pink-500 relative bg-slate-50">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                {selectedFileBase64 ? (
                  <div className="flex items-center justify-center gap-2 text-xs font-bold text-emerald-600">
                    <Check className="w-4 h-4" />
                    <span>Image Selected: {selectedFileName}</span>
                  </div>
                ) : (
                  <div className="space-y-1 py-1">
                    <Upload className="w-5 h-5 mx-auto text-slate-400" />
                    <p className="text-xs text-slate-600 font-semibold">Click to choose promo banner image from PC</p>
                  </div>
                )}
              </div>
            ) : (
              <input
                type="url"
                value={directBannerUrl}
                onChange={(e) => setDirectBannerUrl(e.target.value)}
                placeholder="https://example.com/promo-banner.jpg"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs"
              />
            )}
          </div>

          {/* Action buttons */}
          <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isUploading}
              className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isUploading}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 text-white text-xs font-black shadow-md flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>Activate Promotion</span>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
