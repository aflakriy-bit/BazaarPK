import React, { useState } from 'react';
import { Sparkles, Copy, Check, ArrowRight, Tag, X } from 'lucide-react';
import { Promotion } from '../types';

interface PromotionalTopBarProps {
  promotions: Promotion[];
  onApplyCoupon?: (code: string) => void;
}

export const PromotionalTopBar: React.FC<PromotionalTopBarProps> = ({
  promotions,
  onApplyCoupon,
}) => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [isDismissed, setIsDismissed] = useState(false);

  // Find first active promotion
  const activePromo = promotions.find((p) => p.isActive);

  if (!activePromo || isDismissed) return null;

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    if (onApplyCoupon) onApplyCoupon(code);
    setTimeout(() => setCopiedCode(null), 3000);
  };

  const getThemeGradient = (theme?: string) => {
    switch (theme) {
      case 'emerald':
        return 'from-emerald-900 via-teal-900 to-slate-900 text-emerald-100 border-emerald-800/50';
      case 'amber':
        return 'from-amber-950 via-orange-950 to-slate-900 text-amber-100 border-amber-800/50';
      case 'purple':
        return 'from-purple-950 via-indigo-950 to-slate-900 text-purple-100 border-purple-800/50';
      case 'rose':
        return 'from-rose-950 via-pink-950 to-slate-900 text-rose-100 border-rose-800/50';
      case 'pink':
      default:
        return 'from-pink-950 via-purple-950 to-slate-900 text-pink-100 border-pink-800/50';
    }
  };

  return (
    <aside aria-label="Promotional banner" className="relative bg-[#F9F9F8] border-b border-neutral-200 text-neutral-800 py-2.5 px-4 z-30 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        
        {/* Left: Promotion Title & Badge */}
        <div className="flex items-center gap-3 text-center sm:text-left">
          <span className="border border-neutral-900 text-neutral-900 text-[10px] font-normal tracking-[0.14em] uppercase px-2 py-0.5 shrink-0">
            {activePromo.badgeText || `Offer ${activePromo.discountPercentage}%`}
          </span>

          <span className="font-serif text-sm tracking-wide text-neutral-900">
            {activePromo.title}
          </span>

          <span className="hidden md:inline text-neutral-500 font-light text-xs">
            — {activePromo.description}
          </span>
        </div>

        {/* Right: Coupon Code & Copy Action */}
        <div className="flex items-center gap-3">
          {activePromo.couponCode && (
            <div className="flex items-center gap-2 border border-neutral-300 bg-white px-2.5 py-1">
              <Tag className="w-3 h-3 text-neutral-500 stroke-[1.5]" />
              <span className="text-[10px] uppercase tracking-widest text-neutral-500">Code:</span>
              <span className="font-mono text-xs font-semibold text-neutral-900 tracking-wider">
                {activePromo.couponCode}
              </span>
              <button
                onClick={() => handleCopyCode(activePromo.couponCode)}
                className="ml-1 text-[10px] uppercase tracking-wider text-neutral-700 hover:text-black underline underline-offset-2 transition-colors cursor-pointer"
                title="Copy coupon code"
              >
                {copiedCode === activePromo.couponCode ? (
                  <span className="text-emerald-700 font-medium">Copied</span>
                ) : (
                  <span>Copy</span>
                )}
              </button>
            </div>
          )}

          <button
            onClick={() => {
              const el = document.getElementById('kids-products-section');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="hidden lg:flex items-center gap-1.5 text-xs tracking-wider uppercase text-neutral-900 hover:text-neutral-600 transition-colors cursor-pointer"
          >
            <span>Shop Now</span>
            <ArrowRight className="w-3 h-3 stroke-[1.5]" />
          </button>

          <button
            onClick={() => setIsDismissed(true)}
            className="text-neutral-400 hover:text-neutral-700 transition-colors p-1 cursor-pointer"
            title="Dismiss promotional bar"
          >
            <X className="w-3.5 h-3.5 stroke-[1.5]" />
          </button>
        </div>

      </div>
    </aside>
  );
};

