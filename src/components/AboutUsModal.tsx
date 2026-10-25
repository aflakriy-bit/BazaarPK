import React from 'react';
import { X } from 'lucide-react';

interface AboutUsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutUsModal: React.FC<AboutUsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div 
        className="relative bg-white max-w-2xl w-full p-8 sm:p-12 max-h-[90vh] overflow-y-auto space-y-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-neutral-400 hover:text-black transition-colors p-1 cursor-pointer"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5 stroke-[1.5]" />
        </button>

        <div className="text-center space-y-2">
          <p className="text-[10px] uppercase tracking-[0.3em] font-light text-neutral-400">
            The Philosophy
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl text-neutral-900 tracking-wide font-normal">
            Bachpan Atelier
          </h2>
          <p className="text-xs uppercase tracking-[0.2em] text-neutral-500 font-light">
            Inspired by Cashmirino & European Haute Enfant Traditions
          </p>
        </div>

        <div className="space-y-4 text-xs sm:text-sm font-light text-neutral-600 leading-relaxed pt-4 border-t border-neutral-100">
          <p>
            At Bachpan Atelier, we believe that childhood deserves garments of quiet beauty, unmatched gentleness, and enduring quality. Each festive Baba Suit, party frock, and organic cotton romper is tailored with obsessive care for delicate Pakistani skin.
          </p>
          <p>
            We banish scratching inner tags, stiff seams, and synthetic polyesters in favor of cloud-soft mulmul cotton linings, authentic hand-spun lawn, and hand-embroidered silks.
          </p>
          <p>
            With prompt nationwide Cash on Delivery (COD) and open-doorstep inspection via TCS & Trax, we bring the boutique shopping experience directly into your family home.
          </p>
        </div>

        <div className="pt-6 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-400 uppercase tracking-widest font-light">
          <span>Karachi · Lahore · Islamabad</span>
          <span>Since 2024</span>
        </div>
      </div>
    </div>
  );
};
