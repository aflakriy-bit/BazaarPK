import React, { useState } from 'react';
import { X, Ruler, HelpCircle, MessageCircle, Check, Sparkles } from 'lucide-react';
import { Product } from '../types';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product | null;
  whatsappNumber?: string;
}

type AgeTab = 'girls' | 'boys' | 'newborn' | 'festive_guide';
type UnitType = 'in' | 'cm';

interface SizeRow {
  size: string;
  age: string;
  heightIn: string;
  heightCm: string;
  weightLbs: string;
  weightKg: string;
  chestIn: string;
  chestCm: string;
  lengthIn: string;
  lengthCm: string;
  waistIn: string;
  waistCm: string;
}

const GIRLS_SIZES: SizeRow[] = [
  { size: '1-2 Y', age: '12-24 Months', heightIn: '31 - 34"', heightCm: '80 - 86 cm', weightLbs: '22 - 27 lbs', weightKg: '10 - 12 kg', chestIn: '20 - 21"', chestCm: '51 - 53 cm', lengthIn: '18 - 20"', lengthCm: '46 - 51 cm', waistIn: '19.5 - 20"', waistCm: '50 - 51 cm' },
  { size: '2-3 Y', age: '2 - 3 Years', heightIn: '35 - 38"', heightCm: '88 - 96 cm', weightLbs: '27 - 32 lbs', weightKg: '12 - 14.5 kg', chestIn: '21 - 22"', chestCm: '53 - 56 cm', lengthIn: '21 - 23"', lengthCm: '53 - 58 cm', waistIn: '20 - 20.5"', waistCm: '51 - 52 cm' },
  { size: '3-4 Y', age: '3 - 4 Years', heightIn: '39 - 41"', heightCm: '98 - 104 cm', weightLbs: '32 - 37 lbs', weightKg: '14.5 - 17 kg', chestIn: '22 - 23"', chestCm: '56 - 58.5 cm', lengthIn: '23 - 25"', lengthCm: '58 - 63.5 cm', waistIn: '20.5 - 21"', waistCm: '52 - 53.5 cm' },
  { size: '4-5 Y', age: '4 - 5 Years', heightIn: '42 - 44"', heightCm: '106 - 112 cm', weightLbs: '37 - 42 lbs', weightKg: '17 - 19 kg', chestIn: '23 - 24"', chestCm: '58.5 - 61 cm', lengthIn: '25 - 27"', lengthCm: '63.5 - 68.5 cm', waistIn: '21 - 22"', waistCm: '53.5 - 56 cm' },
  { size: '5-6 Y', age: '5 - 6 Years', heightIn: '45 - 47"', heightCm: '114 - 120 cm', weightLbs: '42 - 48 lbs', weightKg: '19 - 22 kg', chestIn: '24 - 25"', chestCm: '61 - 63.5 cm', lengthIn: '27 - 29"', lengthCm: '68.5 - 74 cm', waistIn: '22 - 22.5"', waistCm: '56 - 57 cm' },
  { size: '7-8 Y', age: '7 - 8 Years', heightIn: '48 - 51"', heightCm: '122 - 130 cm', weightLbs: '50 - 60 lbs', weightKg: '23 - 27 kg', chestIn: '26 - 27"', chestCm: '66 - 68.5 cm', lengthIn: '30 - 32"', lengthCm: '76 - 81 cm', waistIn: '23 - 24"', waistCm: '58.5 - 61 cm' },
];

const BOYS_SIZES: SizeRow[] = [
  { size: '1-2 Y', age: '12-24 Months', heightIn: '31 - 34"', heightCm: '80 - 86 cm', weightLbs: '22 - 27 lbs', weightKg: '10 - 12 kg', chestIn: '20.5 - 21.5"', chestCm: '52 - 55 cm', lengthIn: '18 - 20"', lengthCm: '46 - 51 cm', waistIn: '19.5 - 20.5"', waistCm: '50 - 52 cm' },
  { size: '2-3 Y', age: '2 - 3 Years', heightIn: '35 - 38"', heightCm: '88 - 96 cm', weightLbs: '27 - 33 lbs', weightKg: '12 - 15 kg', chestIn: '21.5 - 22.5"', chestCm: '55 - 57 cm', lengthIn: '21 - 23"', lengthCm: '53 - 58 cm', waistIn: '20.5 - 21"', waistCm: '52 - 53 cm' },
  { size: '3-4 Y', age: '3 - 4 Years', heightIn: '39 - 41"', heightCm: '98 - 104 cm', weightLbs: '33 - 38 lbs', weightKg: '15 - 17.5 kg', chestIn: '22.5 - 23.5"', chestCm: '57 - 60 cm', lengthIn: '23 - 25"', lengthCm: '58 - 63.5 cm', waistIn: '21 - 21.5"', waistCm: '53 - 55 cm' },
  { size: '4-5 Y', age: '4 - 5 Years', heightIn: '42 - 44"', heightCm: '106 - 112 cm', weightLbs: '38 - 44 lbs', weightKg: '17.5 - 20 kg', chestIn: '23.5 - 24.5"', chestCm: '60 - 62 cm', lengthIn: '25 - 27"', lengthCm: '63.5 - 68.5 cm', waistIn: '21.5 - 22.5"', waistCm: '55 - 57 cm' },
  { size: '5-6 Y', age: '5 - 6 Years', heightIn: '45 - 47"', heightCm: '114 - 120 cm', weightLbs: '44 - 50 lbs', weightKg: '20 - 23 kg', chestIn: '24.5 - 25.5"', chestCm: '62 - 65 cm', lengthIn: '27 - 29"', lengthCm: '68.5 - 74 cm', waistIn: '22.5 - 23.5"', waistCm: '57 - 60 cm' },
];

const NEWBORN_SIZES: SizeRow[] = [
  { size: '0-3 M', age: '0 - 3 Months', heightIn: '19 - 23"', heightCm: '48 - 58 cm', weightLbs: '6 - 11 lbs', weightKg: '2.7 - 5 kg', chestIn: '15 - 17"', chestCm: '38 - 43 cm', lengthIn: '14 - 16"', lengthCm: '35 - 40 cm', waistIn: '15 - 16"', waistCm: '38 - 40 cm' },
  { size: '3-6 M', age: '3 - 6 Months', heightIn: '23 - 26"', heightCm: '58 - 66 cm', weightLbs: '11 - 16 lbs', weightKg: '5 - 7.5 kg', chestIn: '17 - 18"', chestCm: '43 - 46 cm', lengthIn: '16 - 18"', lengthCm: '40 - 46 cm', waistIn: '16 - 17.5"', waistCm: '40 - 44 cm' },
  { size: '6-9 M', age: '6 - 9 Months', heightIn: '26 - 28"', heightCm: '66 - 71 cm', weightLbs: '16 - 20 lbs', weightKg: '7.5 - 9 kg', chestIn: '18 - 19"', chestCm: '46 - 48 cm', lengthIn: '18 - 20"', lengthCm: '46 - 51 cm', waistIn: '17.5 - 18.5"', waistCm: '44 - 47 cm' },
  { size: '9-12 M', age: '9 - 12 Months', heightIn: '28 - 30"', heightCm: '71 - 76 cm', weightLbs: '20 - 24 lbs', weightKg: '9 - 11 kg', chestIn: '19 - 20"', chestCm: '48 - 51 cm', lengthIn: '20 - 22"', lengthCm: '51 - 56 cm', waistIn: '18.5 - 19.5"', waistCm: '47 - 50 cm' },
];

export const SizeGuideModal: React.FC<SizeGuideModalProps> = ({
  isOpen,
  onClose,
  product,
  whatsappNumber,
}) => {
  // Determine default active tab based on passed product category
  const getDefaultTab = (): AgeTab => {
    if (!product) return 'girls';
    const cat = (product.category || '').toLowerCase();
    const sub = (product.subCategory || '').toLowerCase();
    if (cat.includes('newborn') || sub.includes('newborn')) return 'newborn';
    if (cat.includes('boy') || sub.includes('boy') || cat.includes('baba')) return 'boys';
    return 'girls';
  };

  const [activeTab, setActiveTab] = useState<AgeTab>(getDefaultTab());
  const [unit, setUnit] = useState<UnitType>('in');

  if (!isOpen) return null;

  const rawNumber = (whatsappNumber || '03001234567').replace(/\D/g, '');
  const cleanNumber = rawNumber.startsWith('92') 
    ? rawNumber 
    : (rawNumber.startsWith('0') ? `92${rawNumber.slice(1)}` : `92${rawNumber}`);

  const handleConciergeChat = () => {
    const itemContext = product ? ` regarding "${product.title}" (Code: #${product.id})` : '';
    const msg = encodeURIComponent(
      `Assalam-o-Alaikum Bachpan PK! I need personalized sizing guidance${itemContext}. My child is [Age / Height] and I want to ensure the perfect comfortable fit. Could you please advise me?`
    );
    window.open(`https://wa.me/${cleanNumber}?text=${msg}`, '_blank');
  };

  const getActiveRows = () => {
    if (activeTab === 'boys') return BOYS_SIZES;
    if (activeTab === 'newborn') return NEWBORN_SIZES;
    return GIRLS_SIZES;
  };

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fadeIn font-sans"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-4xl bg-white border border-neutral-200 shadow-2xl my-8 flex flex-col max-h-[92vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-neutral-100 flex items-center justify-between bg-white shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-[0.25em] font-light text-neutral-400">
                Bachpan PK Atelier
              </span>
              <span className="inline-flex items-center gap-1 text-[9px] uppercase tracking-wider text-neutral-600 bg-neutral-100 px-2 py-0.5">
                <Ruler className="w-2.5 h-2.5 stroke-[1.5]" />
                Standard Fit Chart
              </span>
            </div>
            <h2 className="font-serif text-xl sm:text-2xl text-neutral-900 font-normal tracking-wide mt-1">
              Children's Size & Fit Guide
            </h2>
            {product && (
              <p className="text-xs text-neutral-500 font-light mt-0.5 truncate max-w-md">
                Viewing measurements for: <span className="font-normal text-neutral-800">{product.title}</span>
              </p>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* Unit Switcher */}
            <div className="flex items-center border border-neutral-200 p-0.5 text-xs">
              <button
                type="button"
                onClick={() => setUnit('in')}
                className={`px-2.5 py-1 text-[11px] uppercase tracking-wider transition-colors cursor-pointer ${
                  unit === 'in' ? 'bg-neutral-900 text-white font-medium' : 'text-neutral-500 hover:text-black'
                }`}
              >
                Inches (in)
              </button>
              <button
                type="button"
                onClick={() => setUnit('cm')}
                className={`px-2.5 py-1 text-[11px] uppercase tracking-wider transition-colors cursor-pointer ${
                  unit === 'cm' ? 'bg-neutral-900 text-white font-medium' : 'text-neutral-500 hover:text-black'
                }`}
              >
                Centimeters (cm)
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-neutral-400 hover:text-black transition-colors cursor-pointer"
              aria-label="Close size guide"
            >
              <X className="w-5 h-5 stroke-[1.5]" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-[#FAF9F8] border-b border-neutral-200 px-6 py-2 flex items-center gap-2 overflow-x-auto shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('girls')}
            className={`px-4 py-2 text-xs uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer border-b-2 ${
              activeTab === 'girls'
                ? 'border-neutral-900 text-neutral-950 font-medium'
                : 'border-transparent text-neutral-500 hover:text-neutral-800'
            }`}
          >
            Girls & Baby Girl (1 - 8 Y)
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('boys')}
            className={`px-4 py-2 text-xs uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer border-b-2 ${
              activeTab === 'boys'
                ? 'border-neutral-900 text-neutral-950 font-medium'
                : 'border-transparent text-neutral-500 hover:text-neutral-800'
            }`}
          >
            Boys & Baba Suits (1 - 6 Y)
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('newborn')}
            className={`px-4 py-2 text-xs uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer border-b-2 ${
              activeTab === 'newborn'
                ? 'border-neutral-900 text-neutral-950 font-medium'
                : 'border-transparent text-neutral-500 hover:text-neutral-800'
            }`}
          >
            Newborn & Infant (0 - 12 M)
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('festive_guide')}
            className={`px-4 py-2 text-xs uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer border-b-2 flex items-center gap-1.5 ${
              activeTab === 'festive_guide'
                ? 'border-neutral-900 text-neutral-950 font-medium'
                : 'border-transparent text-neutral-500 hover:text-neutral-800'
            }`}
          >
            <Sparkles className="w-3 h-3 text-amber-600 stroke-[1.5]" />
            <span>Festive Fit Tips</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="overflow-y-auto p-6 sm:p-8 space-y-8 flex-1">
          {activeTab !== 'festive_guide' ? (
            <div className="space-y-6">
              {/* Table */}
              <div className="border border-neutral-200 overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#F8F7F5] border-b border-neutral-200 text-neutral-700 font-medium text-[11px] uppercase tracking-wider">
                      <th className="py-3 px-4">Size Tag</th>
                      <th className="py-3 px-4">Approx. Age</th>
                      <th className="py-3 px-4">Child Height</th>
                      <th className="py-3 px-4">Weight</th>
                      <th className="py-3 px-4">Chest</th>
                      <th className="py-3 px-4">Outfit Length</th>
                      <th className="py-3 px-4">Waist / Bottom</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100 text-neutral-800">
                    {getActiveRows().map((row) => (
                      <tr 
                        key={row.size}
                        className={`hover:bg-[#FCFBF9] transition-colors ${
                          product?.sizes?.includes(row.size.replace(' ', '')) ? 'bg-amber-50/40 font-medium' : ''
                        }`}
                      >
                        <td className="py-3.5 px-4 font-serif text-sm font-medium text-neutral-900 flex items-center gap-2">
                          <span>{row.size}</span>
                          {product?.sizes?.includes(row.size.replace(' ', '')) && (
                            <span className="text-[9px] uppercase tracking-wider bg-neutral-900 text-white px-1.5 py-0.5 rounded-xs font-sans">
                              Available
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-neutral-600">{row.age}</td>
                        <td className="py-3.5 px-4 font-mono text-[11px] text-neutral-700">
                          {unit === 'in' ? row.heightIn : row.heightCm}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-[11px] text-neutral-700">
                          {unit === 'in' ? row.weightLbs : row.weightKg}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-[11px] text-neutral-900 font-medium">
                          {unit === 'in' ? row.chestIn : row.chestCm}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-[11px] text-neutral-700">
                          {unit === 'in' ? row.lengthIn : row.lengthCm}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-[11px] text-neutral-700">
                          {unit === 'in' ? row.waistIn : row.waistCm}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Measuring Guidelines */}
              <div className="bg-[#FAF9F8] border border-neutral-200/80 p-5 space-y-4">
                <div className="flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-neutral-700 stroke-[1.5]" />
                  <h4 className="font-serif text-sm text-neutral-900 font-normal tracking-wide">
                    How To Measure Your Child for Cashmirino-Quality Fit
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-neutral-600">
                  <div className="space-y-1">
                    <span className="font-medium text-neutral-900 block text-[11px] uppercase tracking-wider">
                      1. Chest Circumference
                    </span>
                    <p className="leading-relaxed font-light text-[11px]">
                      Wrap a soft measuring tape under your child's arms across the fullest point of the chest. Allow 1-2 fingers of breathing room.
                    </p>
                  </div>

                  <div className="space-y-1">
                    <span className="font-medium text-neutral-900 block text-[11px] uppercase tracking-wider">
                      2. Outfit Hem Length
                    </span>
                    <p className="leading-relaxed font-light text-[11px]">
                      For frocks and kurtas, measure straight down from the highest point of the shoulder down to the knee or desired hemline.
                    </p>
                  </div>

                  <div className="space-y-1">
                    <span className="font-medium text-neutral-900 block text-[11px] uppercase tracking-wider">
                      3. Bottom / Shalwar
                    </span>
                    <p className="leading-relaxed font-light text-[11px]">
                      Measure along the outer leg from the natural waistline down to the ankle bone. Shalwars feature comfortable elastic waistbands.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Festive Fit Guide Tab */
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-neutral-200 p-6 space-y-3 bg-[#FAF9F8]">
                  <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-neutral-500 block">
                    Boys Festive Baba Suits
                  </span>
                  <h3 className="font-serif text-lg text-neutral-900 font-normal">
                    Waistcoat & Kurta Shalwar Fit
                  </h3>
                  <ul className="space-y-2 text-xs text-neutral-600 leading-relaxed font-light list-disc list-inside">
                    <li>
                      <strong className="font-medium text-neutral-900">Kurta Sizing:</strong> Cut with relaxed breathing room across the shoulders so active boys can move freely.
                    </li>
                    <li>
                      <strong className="font-medium text-neutral-900">Detachable Jacquard Waistcoat:</strong> Tailored to fit snugly over the kurta with working brass/metallic buttons.
                    </li>
                    <li>
                      <strong className="font-medium text-neutral-900">Shalwar Waistband:</strong> Stitched with soft, premium gentle elastic that will not pinch sensitive waistlines.
                    </li>
                    <li>
                      <strong className="font-medium text-neutral-900">Sizing Tip:</strong> If your boy is in between sizes or on the taller side, select the higher size (e.g., 3-4Y instead of 2-3Y) for longer wear across multiple family functions.
                    </li>
                  </ul>
                </div>

                <div className="border border-neutral-200 p-6 space-y-3 bg-[#FAF9F8]">
                  <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-neutral-500 block">
                    Girls Party Frocks & Guriya Sets
                  </span>
                  <h3 className="font-serif text-lg text-neutral-900 font-normal">
                    Twirl Frocks & Lawn Coordinates
                  </h3>
                  <ul className="space-y-2 text-xs text-neutral-600 leading-relaxed font-light list-disc list-inside">
                    <li>
                      <strong className="font-medium text-neutral-900">Soft Cotton Linings:</strong> Every net or chiffon frock has 100% combed cotton lining touching the skin to avoid irritation.
                    </li>
                    <li>
                      <strong className="font-medium text-neutral-900">Back Zipper & Sashes:</strong> Features hidden smooth back zippers with satin waist ties to cinch the silhouette gently.
                    </li>
                    <li>
                      <strong className="font-medium text-neutral-900">Twirl Flare:</strong> Multi-tiered crinoline or layered flare designed to sit comfortably mid-calf or at the knee.
                    </li>
                    <li>
                      <strong className="font-medium text-neutral-900">Wash & Care:</strong> Mild hand wash or gentle cycle; steam iron on reverse side to preserve gota lace details.
                    </li>
                  </ul>
                </div>
              </div>

              {/* Newborn note */}
              <div className="border border-neutral-200 p-5 bg-white flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-4 h-4 text-neutral-800" />
                </div>
                <div>
                  <h4 className="font-medium text-xs text-neutral-900">
                    Newborn & Gift Box Sizing Guarantee
                  </h4>
                  <p className="text-xs text-neutral-500 font-light mt-0.5 leading-relaxed">
                    All Bachpan PK Newborn items are crafted from combed, chemical-free 100% natural cottons with tag-free necks and nickel-free crotch snap buttons for effortless diaper changes.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Concierge Assistance Banner */}
          <div className="border-t border-neutral-100 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white">
            <div className="text-center sm:text-left">
              <span className="font-serif text-base text-neutral-900 font-normal block">
                Still unsure of the exact size?
              </span>
              <p className="text-xs text-neutral-500 font-light mt-0.5">
                Share your child's age or current weight with our Karachi & Lahore sizing atelier team.
              </p>
            </div>

            <button
              type="button"
              onClick={handleConciergeChat}
              className="px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs uppercase tracking-wider flex items-center gap-2 transition-colors cursor-pointer shrink-0"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-400 stroke-[1.5]" />
              <span>Ask Size Concierge (WhatsApp)</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#FAF9F8] border-t border-neutral-200 flex items-center justify-between text-xs text-neutral-500 shrink-0">
          <span className="text-[11px] font-light">
            Pakistan Standard Delivery with Open Parcel Inspection
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 border border-neutral-300 text-neutral-700 hover:text-black hover:border-black text-[11px] uppercase tracking-wider transition-colors cursor-pointer bg-white"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
