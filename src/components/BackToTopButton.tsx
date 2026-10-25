import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

interface BackToTopButtonProps {
  threshold?: number;
  className?: string;
}

export const BackToTopButton: React.FC<BackToTopButtonProps> = ({
  threshold = 500,
  className = '',
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > threshold) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    // Check initial scroll position
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [threshold]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Scroll back to top"
      title="Back to top"
      className={`fixed bottom-22 right-6 z-40 w-11 h-11 rounded-full bg-white/95 hover:bg-neutral-900 text-neutral-700 hover:text-white border border-neutral-300 hover:border-black shadow-lg backdrop-blur-xs flex items-center justify-center transition-all duration-300 ease-out cursor-pointer group hover:scale-105 active:scale-95 ${
        isVisible
          ? 'opacity-100 translate-y-0 pointer-events-auto'
          : 'opacity-0 translate-y-3 pointer-events-none'
      } ${className}`}
    >
      <ArrowUp className="w-4 h-4 stroke-[1.75] transition-transform duration-200 group-hover:-translate-y-0.5" />
      <span className="sr-only">Back to top</span>
    </button>
  );
};
