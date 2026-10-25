import React from 'react';
import { 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Phone,
  Ruler
} from 'lucide-react';

interface FooterProps {
  whatsappNumber?: string;
  supportPhoneNumber?: string;
  onOpenSizeGuide?: () => void;
  onOpenTracking?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  whatsappNumber = '03001234567',
  supportPhoneNumber = '0300-1234567',
  onOpenSizeGuide,
  onOpenTracking,
}) => {
  const cleanWhatsApp = whatsappNumber.replace(/[^0-9]/g, '');

  return (
    <footer className="bg-neutral-950 text-neutral-400 pt-16 pb-12 border-t border-neutral-200 dark:border-neutral-800 text-xs font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Top Pillars with Clean Hairlines */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 pb-12 border-b border-neutral-900">
          <div className="space-y-1.5">
            <h4 className="font-serif text-sm text-neutral-200 font-normal">Pure Breathable Cottons</h4>
            <p className="text-[11px] text-neutral-500 font-light leading-relaxed">
              100% natural fibers and scratch-free cotton linings for delicate Pakistani skin.
            </p>
          </div>

          <div className="space-y-1.5">
            <h4 className="font-serif text-sm text-neutral-200 font-normal">Cash on Delivery (COD)</h4>
            <p className="text-[11px] text-neutral-500 font-light leading-relaxed">
              Open parcel check welcomed upon doorstep delivery across 200+ cities.
            </p>
          </div>

          <div className="space-y-1.5">
            <h4 className="font-serif text-sm text-neutral-200 font-normal">Complimentary Exchanges</h4>
            <p className="text-[11px] text-neutral-500 font-light leading-relaxed">
              7-day seamless size replacement via our personal WhatsApp concierge.
            </p>
          </div>

          <div className="space-y-1.5">
            <h4 className="font-serif text-sm text-neutral-200 font-normal">Express Nationwide Dispatch</h4>
            <p className="text-[11px] text-neutral-500 font-light leading-relaxed">
              Fast 2-4 day delivery through premier courier partners TCS & Trax.
            </p>
          </div>
        </div>

        {/* 4 Minimalist Columns */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pt-4">
          {/* Brand */}
          <div className="space-y-3">
            <span className="font-serif text-xl tracking-[0.2em] uppercase text-neutral-100 font-normal block">
              BACHPAN PK
            </span>
            <span className="text-[9px] uppercase tracking-[0.3em] text-neutral-500 font-light block">
              PREMIUM KIDS WEAR • PAKISTAN
            </span>
            <p className="text-[11px] text-neutral-500 font-light leading-relaxed pt-1">
              Hand-tailored festive Baba Suits, fairy-tale chiffon frocks, and organic newborn essentials crafted for childhood celebrations.
            </p>
          </div>

          {/* Categories */}
          <div className="space-y-3">
            <h5 className="text-[10px] uppercase tracking-[0.25em] text-neutral-300 font-light">Collections</h5>
            <ul className="space-y-2 text-[11px] font-light text-neutral-400">
              <li><span className="hover:text-neutral-200 transition-colors">Boys Festive Wear & Waistcoats</span></li>
              <li><span className="hover:text-neutral-200 transition-colors">Girls Party Frocks & Gota Chiffons</span></li>
              <li><span className="hover:text-neutral-200 transition-colors">Baby Boy & Girl Knitwear Sets</span></li>
              <li><span className="hover:text-neutral-200 transition-colors">Organic Newborn Rompers & Welcome Gifts</span></li>
            </ul>
          </div>

          {/* Delivery Hubs */}
          <div className="space-y-3">
            <h5 className="text-[10px] uppercase tracking-[0.25em] text-neutral-300 font-light">Atelier Logistics</h5>
            <ul className="space-y-2 text-[11px] font-light text-neutral-400">
              <li>Karachi Central Distribution Hub</li>
              <li>Lahore Atelier Center (Gulberg III)</li>
              <li>Islamabad & Rawalpindi Express</li>
              <li>TCS & Trax Nationwide Coverage</li>
              {onOpenTracking && (
                <li className="pt-1">
                  <button
                    type="button"
                    onClick={onOpenTracking}
                    className="hover:text-white transition-colors underline underline-offset-2 flex items-center gap-1 cursor-pointer text-neutral-300"
                  >
                    <span>Track Your Parcel Online</span>
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Concierge */}
          <div className="space-y-3">
            <h5 className="text-[10px] uppercase tracking-[0.25em] text-neutral-300 font-light">Size Concierge</h5>
            <div className="space-y-2 text-[11px] font-light text-neutral-400">
              <p>Direct assistance with child sizing and fabric advice:</p>
              <a 
                href={`https://wa.me/${cleanWhatsApp.startsWith('92') ? cleanWhatsApp : `92${cleanWhatsApp.replace(/^0/, '')}`}?text=Assalam-o-Alaikum%20Bachpan%20PK!%20I%20need%20size%20advice.`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-neutral-200 block hover:text-white transition-colors"
              >
                WhatsApp / Helpline: {supportPhoneNumber}
              </a>
              <p className="text-[10px] text-neutral-500 uppercase tracking-wider">Mon - Sat: 10:00 AM - 10:00 PM PKT</p>
              {onOpenSizeGuide && (
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={onOpenSizeGuide}
                    className="text-[11px] uppercase tracking-wider text-neutral-300 hover:text-white underline underline-offset-2 flex items-center gap-1.5 cursor-pointer font-light"
                  >
                    <Ruler className="w-3 h-3 stroke-[1.5]" />
                    <span>View Children's Size Chart Modal</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Line */}
        <div className="pt-8 border-t border-neutral-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] uppercase tracking-[0.2em] text-neutral-500 font-light">
          <p>© {new Date().getFullYear()} Bachpan PK - Premium Kids Wear. All Rights Reserved.</p>
          <p>Cashmirino Inspired Luxury Minimalist Aesthetic</p>
        </div>

      </div>
    </footer>
  );
};
