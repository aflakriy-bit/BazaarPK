import React from 'react';
import { Banknote, Truck, Camera, CheckCircle2 } from 'lucide-react';

interface TrustBadgesBarProps {
  onOpenTracking?: () => void;
  whatsappNumber?: string;
  badge1Title?: string;
  badge1Subtitle?: string;
  badge2Title?: string;
  badge2Subtitle?: string;
  badge3Title?: string;
  badge3Subtitle?: string;
  isDarkMode?: boolean;
}

export const TrustBadgesBar: React.FC<TrustBadgesBarProps> = ({
  onOpenTracking,
  whatsappNumber = '03001234567',
  badge1Title = 'COD Available',
  badge1Subtitle = 'Pay cash when it arrives at your doorstep',
  badge2Title = 'PostEx Tracking',
  badge2Subtitle = 'Follow every step via SMS & Rider Portal',
  badge3Title = 'Real Photo on Request',
  badge3Subtitle = 'See real unedited outfit photos before it ships',
  isDarkMode = false,
}) => {
  const handlePhotoRequest = () => {
    const cleanNumber = whatsappNumber.replace(/\D/g, '');
    const message = encodeURIComponent(
      'Salam Bachpan PK! I would like to request real studio/fabric photos of an outfit before placing my order.'
    );
    window.open(`https://wa.me/${cleanNumber.startsWith('92') ? cleanNumber : `92${cleanNumber.replace(/^0/, '')}`}?text=${message}`, '_blank');
  };

  return (
    <section className={`w-full py-4 sm:py-5 px-4 transition-colors duration-300 border-b ${
      isDarkMode 
        ? 'bg-[#18181b] border-neutral-800 text-neutral-100' 
        : 'bg-[#FAF6F0] border-neutral-200 text-neutral-900'
    }`}>
      <div className="max-w-7xl mx-auto">
        <div className={`grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x gap-3 md:gap-0 ${
          isDarkMode ? 'divide-neutral-800' : 'divide-neutral-200'
        }`}>
          
          {/* 1. COD Available */}
          <div className="flex items-center justify-center gap-3.5 py-2 md:py-0 px-4 group select-none">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform duration-200 border ${
              isDarkMode 
                ? 'bg-neutral-800 border-neutral-700 text-[#C89299]' 
                : 'bg-white border-[#E4DCD0] text-[#C89299]'
            }`}>
              <Banknote className="w-4 h-4 stroke-[1.8]" />
            </div>
            <div className="text-left">
              <p className={`font-serif text-sm sm:text-base font-medium tracking-wide leading-tight ${
                isDarkMode ? 'text-white' : 'text-neutral-900'
              }`}>
                {badge1Title}
              </p>
              <p className={`text-[11px] sm:text-xs font-light tracking-wide mt-0.5 ${
                isDarkMode ? 'text-neutral-400' : 'text-neutral-500'
              }`}>
                {badge1Subtitle}
              </p>
            </div>
          </div>

          {/* 2. PostEx Tracking */}
          <div 
            onClick={onOpenTracking}
            className="flex items-center justify-center gap-3.5 py-2 md:py-0 px-4 group cursor-pointer select-none"
            title="Click to track your parcel live"
          >
            <div className={`w-9 h-9 rounded-full flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform duration-200 border ${
              isDarkMode 
                ? 'bg-neutral-800 border-neutral-700 text-[#C89299]' 
                : 'bg-white border-[#E4DCD0] text-[#C89299]'
            }`}>
              <Truck className="w-4 h-4 stroke-[1.8]" />
            </div>
            <div className="text-left">
              <div className="flex items-center gap-1.5">
                <p className={`font-serif text-sm sm:text-base font-medium tracking-wide leading-tight ${
                  isDarkMode ? 'text-white' : 'text-neutral-900'
                }`}>
                  {badge2Title}
                </p>
                <span className={`text-[9px] uppercase tracking-widest px-1.5 py-0.2 rounded-full border font-semibold ${
                  isDarkMode 
                    ? 'bg-neutral-800 text-[#C89299] border-neutral-700' 
                    : 'bg-white text-[#C89299] border-[#E4DCD0]'
                }`}>
                  Live
                </span>
              </div>
              <p className={`text-[11px] sm:text-xs font-light tracking-wide mt-0.5 ${
                isDarkMode ? 'text-neutral-400' : 'text-neutral-500'
              }`}>
                {badge2Subtitle}
              </p>
            </div>
          </div>

          {/* 3. Real Photo on Request */}
          <div 
            onClick={handlePhotoRequest}
            className="flex items-center justify-center gap-3.5 py-2 md:py-0 px-4 group cursor-pointer select-none"
            title="Chat on WhatsApp to see live studio pictures"
          >
            <div className={`w-9 h-9 rounded-full flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform duration-200 border ${
              isDarkMode 
                ? 'bg-neutral-800 border-neutral-700 text-[#C89299]' 
                : 'bg-white border-[#E4DCD0] text-[#C89299]'
            }`}>
              <Camera className="w-4 h-4 stroke-[1.8]" />
            </div>
            <div className="text-left">
              <div className="flex items-center gap-1.5">
                <p className={`font-serif text-sm sm:text-base font-medium tracking-wide leading-tight ${
                  isDarkMode ? 'text-white' : 'text-neutral-900'
                }`}>
                  {badge3Title}
                </p>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 stroke-[2]" />
              </div>
              <p className={`text-[11px] sm:text-xs font-light tracking-wide mt-0.5 ${
                isDarkMode ? 'text-neutral-400' : 'text-neutral-500'
              }`}>
                {badge3Subtitle}
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
