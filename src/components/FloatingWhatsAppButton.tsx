import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';

interface FloatingWhatsAppButtonProps {
  phoneNumber?: string;
  defaultMessage?: string;
  buttonLabel?: string;
}

export const FloatingWhatsAppButton: React.FC<FloatingWhatsAppButtonProps> = ({
  phoneNumber = '923001234567',
  defaultMessage = 'Assalam-o-Alaikum! I have a question about Bachpan PK collection.',
  buttonLabel = 'Size Concierge · WhatsApp Advice',
}) => {
  const [showTooltip, setShowTooltip] = useState(true);

  const handleOpenWhatsApp = () => {
    const cleanNumber = phoneNumber.replace(/\D/g, '');
    const fullNumber = cleanNumber.startsWith('92') ? cleanNumber : `92${cleanNumber.replace(/^0/, '')}`;
    const encoded = encodeURIComponent(defaultMessage);
    window.open(`https://wa.me/${fullNumber}?text=${encoded}`, '_blank');
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex items-center gap-3">
      {/* Subtle Concierge Tooltip for Mothers */}
      {showTooltip && (
        <div className="hidden sm:flex items-center gap-3 bg-white text-neutral-800 text-xs font-light py-2 px-4 shadow-xl border border-neutral-200 animate-fadeIn">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span className="tracking-wide">{buttonLabel}</span>
          <button
            onClick={() => setShowTooltip(false)}
            className="text-neutral-400 hover:text-black ml-1 p-0.5 cursor-pointer"
            title="Dismiss message"
          >
            <X className="w-3 h-3 stroke-[1.5]" />
          </button>
        </div>
      )}

      {/* Boutique Concierge Button */}
      <button
        onClick={handleOpenWhatsApp}
        className="group relative w-12 h-12 rounded-full bg-neutral-900 hover:bg-black text-white flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer border border-neutral-800"
        title="Chat with size concierge on WhatsApp"
        aria-label="WhatsApp Concierge Support"
      >
        <MessageCircle className="w-5 h-5 stroke-[1.5]" />
      </button>
    </div>
  );
};
