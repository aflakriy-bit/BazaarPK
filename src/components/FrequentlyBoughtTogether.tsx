import React, { useState, useEffect } from 'react';
import { Plus, Check, ShoppingBag, Sparkles, Tag } from 'lucide-react';
import { Product } from '../types';
import { api } from '../services/api';

interface FrequentlyBoughtTogetherProps {
  currentProduct: Product;
  onAddBundle: (products: Product[]) => void;
  isDarkMode?: boolean;
}

export const FrequentlyBoughtTogether: React.FC<FrequentlyBoughtTogetherProps> = ({
  currentProduct,
  onAddBundle,
  isDarkMode = false,
}) => {
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [discountPercent, setDiscountPercent] = useState<number>(10);
  const [reason, setReason] = useState<string>('Frequently styled together');
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedIds, setSelectedIds] = useState<Record<string, boolean>>({
    [currentProduct.id]: true,
  });
  const [addedSuccess, setAddedSuccess] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadRecs() {
      setLoading(true);
      try {
        const data = await api.getRecommendations(currentProduct.id);
        if (isMounted) {
          setRecommendations(data.suggestedProducts || []);
          setDiscountPercent(data.bundleDiscountPercentage || 10);
          if (data.recommendationReason) setReason(data.recommendationReason);
          
          // Auto-select current product + first recommendation
          const initialSelection: Record<string, boolean> = { [currentProduct.id]: true };
          if (data.suggestedProducts && data.suggestedProducts.length > 0) {
            initialSelection[data.suggestedProducts[0].id] = true;
          }
          setSelectedIds(initialSelection);
        }
      } catch (e) {
        console.warn('Failed to load bundle recommendations', e);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadRecs();
    return () => { isMounted = false; };
  }, [currentProduct.id]);

  if (loading || recommendations.length === 0) {
    return null;
  }

  const allItems = [currentProduct, ...recommendations];
  const activeItems = allItems.filter(item => selectedIds[item.id]);

  const rawSubtotal = activeItems.reduce((acc, item) => acc + item.price, 0);
  const isBundleEligible = activeItems.length > 1;
  const bundleDiscount = isBundleEligible ? Math.round((rawSubtotal * discountPercent) / 100) : 0;
  const bundleTotal = Math.max(0, rawSubtotal - bundleDiscount);

  const toggleItem = (id: string) => {
    if (id === currentProduct.id && activeItems.length === 1) {
      return; // Keep at least one item
    }
    setSelectedIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleAddBundle = () => {
    if (activeItems.length === 0) return;
    onAddBundle(activeItems);
    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 2400);
  };

  return (
    <div className={`mt-6 p-4 sm:p-5 border rounded-sm transition-colors text-left ${
      isDarkMode 
        ? 'bg-[#18181b] border-neutral-800 text-white' 
        : 'bg-[#FAF9F8] border-neutral-200 text-neutral-900'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between gap-2 pb-3 border-b border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#C89299]" />
          <h4 className="font-serif text-sm sm:text-base font-normal tracking-wide">
            Frequently Styled Together
          </h4>
        </div>
        {isBundleEligible && (
          <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
            <Tag className="w-3 h-3" />
            Bundle & Save {discountPercent}%
          </span>
        )}
      </div>

      <p className="text-[11px] text-neutral-500 dark:text-neutral-400 font-light mt-1.5 mb-4">
        {reason}
      </p>

      {/* Visual Product Strip with Plus Signs */}
      <div className="flex items-center gap-2 sm:gap-3 flex-wrap sm:flex-nowrap mb-4">
        {allItems.map((item, index) => {
          const isSelected = !!selectedIds[item.id];
          const isMain = item.id === currentProduct.id;

          return (
            <React.Fragment key={item.id}>
              {index > 0 && (
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-neutral-200 dark:bg-neutral-800 text-neutral-500 text-xs shrink-0">
                  <Plus className="w-3.5 h-3.5 stroke-[2]" />
                </div>
              )}

              <div 
                onClick={() => toggleItem(item.id)}
                className={`relative group cursor-pointer border rounded-xs p-1.5 transition-all flex items-center gap-2.5 ${
                  isSelected 
                    ? 'border-[#C89299] bg-white dark:bg-neutral-900 shadow-2xs' 
                    : 'border-dashed border-neutral-300 dark:border-neutral-700 opacity-60'
                }`}
              >
                <div className="w-12 h-14 sm:w-14 sm:h-16 rounded-xs overflow-hidden bg-neutral-100 shrink-0 relative">
                  <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                  {isMain && (
                    <span className="absolute top-0.5 left-0.5 text-[8px] bg-black/75 text-white px-1 rounded-2xs">
                      Main
                    </span>
                  )}
                </div>

                <div className="pr-1 text-left min-w-[100px] max-w-[130px]">
                  <p className="text-[10px] sm:text-[11px] font-normal leading-tight line-clamp-1">
                    {item.title}
                  </p>
                  <p className="font-serif text-xs font-semibold mt-0.5 text-[#C89299]">
                    Rs. {item.price.toLocaleString()}
                  </p>
                </div>
              </div>
            </React.Fragment>
          );
        })}
      </div>

      {/* Item Checkboxes */}
      <div className="space-y-1.5 mb-4 text-xs font-light">
        {allItems.map(item => (
          <label key={item.id} className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={!!selectedIds[item.id]}
              onChange={() => toggleItem(item.id)}
              className="accent-[#C89299] w-3.5 h-3.5 cursor-pointer"
            />
            <span className="truncate">
              <strong>{item.id === currentProduct.id ? 'This outfit:' : 'Add-on:'}</strong> {item.title} — <span className="font-serif font-medium">Rs. {item.price.toLocaleString()}</span>
            </span>
          </label>
        ))}
      </div>

      {/* Price Summary & One-Click Add Bundle */}
      <div className="pt-3 border-t border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-xs uppercase tracking-wider text-neutral-500 font-light">
              Combined Total:
            </span>
            <span className="font-serif text-base sm:text-lg font-bold text-neutral-900 dark:text-white">
              Rs. {bundleTotal.toLocaleString()}
            </span>
            {isBundleEligible && bundleDiscount > 0 && (
              <span className="text-xs text-neutral-400 line-through">
                Rs. {rawSubtotal.toLocaleString()}
              </span>
            )}
          </div>
          {isBundleEligible && bundleDiscount > 0 && (
            <p className="text-[11px] text-emerald-600 font-medium">
              You save Rs. {bundleDiscount.toLocaleString()} with {discountPercent}% Atelier Bundle Perk!
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={handleAddBundle}
          disabled={activeItems.length === 0}
          className="px-5 py-2.5 bg-[#C89299] hover:bg-[#B9838A] text-white text-xs uppercase tracking-[0.16em] font-medium transition-colors cursor-pointer flex items-center justify-center gap-1.5 rounded-full shadow-2xs disabled:opacity-50"
        >
          {addedSuccess ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>Bundle Added!</span>
            </>
          ) : (
            <>
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Add {activeItems.length} Items to Bag</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
