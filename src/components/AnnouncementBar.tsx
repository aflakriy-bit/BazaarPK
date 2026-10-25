import React from 'react';
import { Truck, ShieldCheck } from 'lucide-react';

interface AnnouncementBarProps {
  announcementText?: string;
  supportPhone?: string;
}

export const AnnouncementBar: React.FC<AnnouncementBarProps> = ({
  announcementText,
  supportPhone = '0300-1234567',
}) => {
  const displayText = announcementText?.trim();
  if (!displayText) {
    return null;
  }

  return (
    <div className="bg-neutral-900 text-neutral-200 text-[11px] tracking-[0.16em] uppercase font-light py-2 px-4 border-b border-neutral-800 animate-fadeIn">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
        {/* Dynamic header announcement ticker */}
        <div className="flex items-center justify-center sm:justify-start gap-2.5">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          <span className="flex items-center gap-1.5 font-normal text-white tracking-[0.18em]">
            <Truck className="w-3.5 h-3.5 text-neutral-400 stroke-[1.5] shrink-0" />
            <span>{displayText}</span>
          </span>
        </div>

        {/* Right guarantees & helpline */}
        <div className="flex items-center justify-center gap-4 text-[10px] text-neutral-400 tracking-[0.14em]">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3 h-3 text-neutral-300 stroke-[1.5]" />
            Cash On Delivery Nationwide
          </span>
          <span className="hidden md:inline text-neutral-600">·</span>
          <span className="hidden md:inline">
            100% Breathable Cotton & Silk
          </span>
          <span className="hidden lg:inline text-neutral-600">·</span>
          <span className="hidden lg:inline">
            Helpline: {supportPhone}
          </span>
        </div>
      </div>
    </div>
  );
};

