import React, { useState } from 'react';
import { 
  Plus, 
  Tag, 
  Trash2, 
  Eye, 
  Check, 
  Copy
} from 'lucide-react';
import { Promotion } from '../../types';
import { api } from '../../services/api';
import { PromotionModal } from './PromotionModal';

interface PromotionManagerTabProps {
  promotions: Promotion[];
  onPromotionsChange: (promos: Promotion[]) => void;
  onOpenStorefront: () => void;
}

export const PromotionManagerTab: React.FC<PromotionManagerTabProps> = ({
  promotions,
  onPromotionsChange,
  onOpenStorefront,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleToggle = async (promoId: string) => {
    const updated = await api.togglePromotion(promoId);
    if (updated) {
      const next = promotions.map(p => p.id === promoId ? updated : p);
      onPromotionsChange(next);
    }
  };

  const handleDelete = async (promoId: string, title: string) => {
    if (confirm(`Are you sure you want to delete the promotion "${title}"?`)) {
      await api.deletePromotion(promoId);
      const next = promotions.filter(p => p.id !== promoId);
      onPromotionsChange(next);
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const activePromotion = promotions.find(p => p.isActive);

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header Bar */}
      <div className="bg-white border border-neutral-200/80 p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.25em] font-light text-neutral-400">
            Campaign Manager
          </p>
          <h2 className="font-serif text-2xl text-neutral-900 font-normal tracking-wide mt-1">
            Promotional Campaigns & Top Banners
          </h2>
          <p className="text-xs text-neutral-500 font-light mt-0.5">
            Create discount offers and seasonal sales. Turning an offer <span className="font-medium text-neutral-900">ON</span> displays a promotional bar at the top of the customer storefront.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 stroke-[1.5]" />
            <span>Add Promotion</span>
          </button>

          <button
            onClick={onOpenStorefront}
            className="px-3.5 py-2 border border-neutral-200 hover:border-black text-neutral-700 hover:text-black text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-neutral-400 stroke-[1.5]" />
            <span>Storefront</span>
          </button>
        </div>
      </div>

      {/* ACTIVE PROMOTION LIVE SPOTLIGHT */}
      {activePromotion ? (
        <div className="bg-[#FAF9F8] border border-neutral-300 p-6 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-600" />
              <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-neutral-900">
                Currently Live on Storefront
              </span>
            </div>
            <button
              onClick={() => handleToggle(activePromotion.id)}
              className="text-xs uppercase tracking-wider text-neutral-500 hover:text-black underline underline-offset-2 cursor-pointer font-light"
            >
              Turn Off Live Banner
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-1">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="border border-neutral-900 text-neutral-900 text-[10px] uppercase tracking-wider px-2 py-0.5 font-light">
                  {activePromotion.badgeText || `Offer ${activePromotion.discountPercentage}%`}
                </span>
                <h3 className="font-serif text-lg text-neutral-900 font-normal">{activePromotion.title}</h3>
              </div>
              <p className="text-xs text-neutral-500 font-light">{activePromotion.description}</p>
            </div>

            <div className="flex items-center gap-2 border border-neutral-200 bg-white px-3 py-1.5">
              <Tag className="w-3.5 h-3.5 text-neutral-400 stroke-[1.5]" />
              <span className="text-xs uppercase tracking-wider text-neutral-500 font-light">Code:</span>
              <span className="font-mono font-semibold text-neutral-900 text-sm tracking-wider">
                {activePromotion.couponCode}
              </span>
              <button
                onClick={() => handleCopyCode(activePromotion.couponCode)}
                className="ml-2 text-xs uppercase tracking-wider text-neutral-700 hover:text-black underline cursor-pointer"
              >
                {copiedCode === activePromotion.couponCode ? <Check className="w-3 h-3 text-emerald-600" /> : <span>Copy</span>}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-neutral-200 text-neutral-600 p-4 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-neutral-400 stroke-[1.5]" />
            <span className="font-light">No promotional bar is currently active on the customer storefront.</span>
          </div>
          <span className="text-[11px] text-neutral-400 font-light">Turn any offer ON below to activate</span>
        </div>
      )}

      {/* PROMOTIONS CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {promotions.map((promo) => (
          <div 
            key={promo.id}
            className={`bg-white border p-6 flex flex-col justify-between space-y-4 transition-all ${
              promo.isActive ? 'border-neutral-900' : 'border-neutral-200'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] uppercase tracking-widest px-2 py-0.5 border ${
                      promo.isActive ? 'border-neutral-900 text-neutral-900 font-medium' : 'border-neutral-200 text-neutral-400 font-light'
                    }`}>
                      {promo.isActive ? 'ACTIVE · LIVE' : 'INACTIVE'}
                    </span>
                    <span className="text-xs font-light text-neutral-600">
                      {promo.discountPercentage}% Discount
                    </span>
                  </div>

                  <h3 className="font-serif text-base text-neutral-900 font-normal mt-1">
                    {promo.title}
                  </h3>
                  <p className="text-xs text-neutral-500 font-light leading-relaxed">
                    {promo.description}
                  </p>
                </div>

                {/* Banner Thumbnail if available */}
                {promo.bannerImageUrl && (
                  <div className="w-16 aspect-square overflow-hidden bg-neutral-100 shrink-0 border border-neutral-200">
                    <img src={promo.bannerImageUrl} alt={promo.title} className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              {/* Coupon Code */}
              <div className="flex items-center gap-2 pt-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-neutral-50 text-neutral-800 text-xs font-mono border border-neutral-200">
                  <Tag className="w-3 h-3 text-neutral-400 stroke-[1.5]" />
                  <span>CODE: <strong>{promo.couponCode}</strong></span>
                </div>
              </div>
            </div>

            {/* Bottom Controls: Clean Sliding Toggle & Delete */}
            <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  role="switch"
                  aria-checked={promo.isActive}
                  onClick={() => handleToggle(promo.id)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    promo.isActive ? 'bg-neutral-900' : 'bg-neutral-200'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-xs transform ring-0 transition duration-200 ease-in-out ${
                      promo.isActive ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
                <span className="text-xs uppercase tracking-wider font-light text-neutral-600">
                  {promo.isActive ? 'Status: ON' : 'Status: OFF'}
                </span>
              </div>

              <button
                onClick={() => handleDelete(promo.id, promo.title)}
                className="text-neutral-400 hover:text-rose-600 transition-colors cursor-pointer p-1"
                title="Delete promotion"
              >
                <Trash2 className="w-4 h-4 stroke-[1.5]" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Promotion Modal */}
      <PromotionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onPromotionCreated={(newPromo) => {
          onPromotionsChange([newPromo, ...promotions]);
        }}
      />

    </div>
  );
};
