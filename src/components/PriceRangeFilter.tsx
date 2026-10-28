import React from 'react';
import { SlidersHorizontal, RotateCcw, Tag } from 'lucide-react';

interface PriceRangeFilterProps {
  minPrice: number;
  maxPrice: number;
  currentMaxPrice: number;
  onChangeMaxPrice: (val: number) => void;
  onReset: () => void;
  matchingCount: number;
  totalCount: number;
  isDarkMode?: boolean;
}

export const PriceRangeFilter: React.FC<PriceRangeFilterProps> = ({
  minPrice,
  maxPrice,
  currentMaxPrice,
  onChangeMaxPrice,
  onReset,
  matchingCount,
  totalCount,
  isDarkMode = false,
}) => {
  const isFiltered = currentMaxPrice < maxPrice;

  // Preset quick budgets in PKR
  const budgetPresets = [
    { label: 'All', value: maxPrice },
    { label: 'Under 2k', value: 2000 },
    { label: 'Under 3k', value: 3000 },
    { label: 'Under 4k', value: 4000 },
  ].filter(p => p.value === maxPrice || (p.value >= minPrice && p.value <= maxPrice));

  return (
    <div className={`p-4 sm:p-5 border rounded-xl sm:rounded-2xl transition-all duration-300 my-4 ${
      isDarkMode 
        ? 'bg-[#18181b]/90 border-neutral-800 text-white shadow-sm' 
        : 'bg-white/90 border-neutral-200/90 text-neutral-900 shadow-2xs'
    }`}>
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        
        {/* Left: Label & Current Budget Metric */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#C89299]/15 text-[#C89299] flex items-center justify-center shrink-0">
            <SlidersHorizontal className="w-4 h-4 stroke-[1.8]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-neutral-400 dark:text-neutral-500">
                Filter By Budget
              </span>
              {isFiltered && (
                <span className="text-[9px] px-2 py-0.5 rounded-full font-semibold bg-[#C89299]/15 text-[#C89299]">
                  Active Filter
                </span>
              )}
            </div>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className={`font-serif text-lg sm:text-xl font-medium tracking-tight ${
                isDarkMode ? 'text-white' : 'text-neutral-950'
              }`}>
                {isFiltered ? `Up to Rs. ${currentMaxPrice.toLocaleString()}` : `All Outfits (Rs. ${minPrice.toLocaleString()} - ${maxPrice.toLocaleString()})`}
              </span>
              <span className="text-xs text-neutral-500 dark:text-neutral-400 font-light">
                ({matchingCount} of {totalCount} matching)
              </span>
            </div>
          </div>
        </div>

        {/* Center: Slider Bar */}
        <div className="flex-1 max-w-md w-full px-1">
          <div className="flex justify-between items-center text-[10px] text-neutral-400 mb-1.5 font-mono">
            <span>Rs. {minPrice.toLocaleString()}</span>
            <span className="text-[#C89299] font-bold">Max: Rs. {currentMaxPrice.toLocaleString()}</span>
            <span>Rs. {maxPrice.toLocaleString()}</span>
          </div>

          <div className="relative flex items-center">
            <input
              type="range"
              min={minPrice}
              max={maxPrice}
              step={50}
              value={currentMaxPrice}
              onChange={(e) => onChangeMaxPrice(Number(e.target.value))}
              className="w-full h-2 rounded-lg bg-neutral-200 dark:bg-neutral-800 accent-[#C89299] cursor-pointer focus:outline-hidden"
              aria-label="Price range budget slider"
            />
          </div>
        </div>

        {/* Right: Quick Budget Presets & Reset Action */}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap shrink-0">
          <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-light hidden sm:inline mr-1">
            Presets:
          </span>
          {budgetPresets.map((preset) => {
            const isPresetActive = preset.value === maxPrice 
              ? !isFiltered 
              : currentMaxPrice === preset.value;

            return (
              <button
                key={preset.label}
                type="button"
                onClick={() => onChangeMaxPrice(preset.value)}
                className={`px-3 py-1.5 rounded-full text-[11px] font-medium transition-all cursor-pointer ${
                  isPresetActive
                    ? 'bg-[#C89299] text-white shadow-2xs font-semibold'
                    : (isDarkMode 
                        ? 'bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-700' 
                        : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700 border border-neutral-200/80')
                }`}
              >
                {preset.label}
              </button>
            );
          })}

          {isFiltered && (
            <button
              type="button"
              onClick={onReset}
              className={`p-1.5 rounded-full text-xs transition-colors cursor-pointer flex items-center gap-1 ${
                isDarkMode 
                  ? 'text-neutral-400 hover:text-white hover:bg-neutral-800' 
                  : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100'
              }`}
              title="Reset price filter to show all products"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="text-[10px] uppercase tracking-wider font-light">Reset</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
