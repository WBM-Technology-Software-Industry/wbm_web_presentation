import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X } from 'lucide-react';

interface OrientationHintModalProps {
  currentMode: 'home' | 'slides' | 'vertical' | 'portfolio';
}

const STORAGE_KEY = 'wbm_orientation_hint_dismissed';

export const OrientationHintModal: React.FC<OrientationHintModalProps> = ({ currentMode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const actionBtnRef = useRef<HTMLButtonElement>(null);
  const previouslyFocusedElementRef = useRef<HTMLElement | null>(null);

  // Helper to determine if the device has smartphone viewport characteristics
  const checkIsSmartphonePortrait = useCallback(() => {
    if (typeof window === 'undefined') return false;

    // Check if dismissed in this browser session
    try {
      if (sessionStorage.getItem(STORAGE_KEY) === 'true') {
        return false;
      }
    } catch {
      // Storage unavailable or blocked, proceed with detection
    }

    // Only eligible in 'slides' and 'portfolio' modes
    if (currentMode !== 'slides' && currentMode !== 'portfolio') {
      return false;
    }

    // Must be in portrait orientation
    const isPortrait = window.innerHeight > window.innerWidth;
    if (!isPortrait) return false;

    // In smartphones, portrait width (shortest dimension) is <= 520px
    // (iPhone SE is 375px, iPhone Pro is 390px, iPhone Pro Max is 430px, Android is 360-412px)
    // Tablets (iPad Mini, etc.) have portrait width >= 768px
    // Laptops/Desktops have shortest dimension >= 768px
    const shortestDimension = Math.min(window.innerWidth, window.innerHeight);
    const isSmartphoneSize = shortestDimension <= 520 && window.innerWidth <= 520;
    if (!isSmartphoneSize) return false;

    // Check touch capabilities or mobile viewport characteristics
    const isTouchOrMobile =
      (window.matchMedia && window.matchMedia('(pointer: coarse)').matches) ||
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      window.innerWidth <= 500;

    return isTouchOrMobile;
  }, [currentMode]);

  // Handle dismissal
  const handleDismiss = useCallback(() => {
    setIsOpen(false);
    try {
      sessionStorage.setItem(STORAGE_KEY, 'true');
    } catch {
      // Ignored
    }

    // Restore focus to previous element if available
    if (previouslyFocusedElementRef.current) {
      previouslyFocusedElementRef.current.focus();
    }
  }, []);

  // Check orientation on mount, mode change, and resize/orientationchange
  useEffect(() => {
    const evaluateOrientation = () => {
      // If currently open and user rotated to landscape, auto-dismiss
      const isLandscape = window.innerWidth > window.innerHeight;
      if (isLandscape && isOpen) {
        handleDismiss();
        return;
      }

      const shouldShow = checkIsSmartphonePortrait();
      if (shouldShow && !isOpen) {
        // Save previously focused element before opening
        previouslyFocusedElementRef.current = document.activeElement as HTMLElement;
        setIsOpen(true);
      }
    };

    evaluateOrientation();

    window.addEventListener('resize', evaluateOrientation);
    window.addEventListener('orientationchange', evaluateOrientation);

    return () => {
      window.removeEventListener('resize', evaluateOrientation);
      window.removeEventListener('orientationchange', evaluateOrientation);
    };
  }, [checkIsSmartphonePortrait, isOpen, handleDismiss]);

  // Focus trap & Escape key handler
  useEffect(() => {
    if (!isOpen) return;

    // Auto-focus primary CTA button
    const timer = setTimeout(() => {
      actionBtnRef.current?.focus();
    }, 50);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        handleDismiss();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, handleDismiss]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn motion-reduce:animate-none select-none"
      role="dialog"
      aria-modal="true"
      aria-labelledby="orientation-hint-title"
      aria-describedby="orientation-hint-desc"
    >
      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-[340px] sm:max-w-sm bg-gradient-to-b from-zinc-900/98 via-zinc-950/98 to-black/98 border border-[#00DF00]/50 rounded-3xl p-6 sm:p-7 shadow-[0_0_50px_rgba(0,223,0,0.25)] text-center overflow-hidden">
        {/* Subtle Ambient Cyber Glow */}
        <div className="absolute -top-12 -left-12 w-32 h-32 bg-[#00DF00]/15 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-[#00DF00]/10 rounded-full blur-2xl pointer-events-none" />

        {/* Close Button (X) */}
        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 p-2 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800/80 transition-colors active:scale-95 cursor-pointer z-10"
          title="Fechar recomendação"
          aria-label="Fechar recomendação"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Animated Smartphone Illustration (SVG + CSS) */}
        <div className="relative w-44 h-36 mx-auto flex items-center justify-center my-1">
          <svg
            viewBox="0 0 160 130"
            className="w-full h-full overflow-visible"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <filter id="phoneGlow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="3.2" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <linearGradient id="phoneBorderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00DF00" />
                <stop offset="50%" stopColor="#00FF00" />
                <stop offset="100%" stopColor="#00AA00" />
              </linearGradient>
            </defs>

            {/* Rotation Guide Arc with Arrow (clockwise rotation indicator) */}
            <g className="opacity-80">
              <path
                d="M 80 18 A 44 44 0 0 1 126 64"
                stroke="#00DF00"
                strokeWidth="1.8"
                strokeDasharray="3 3"
                fill="none"
              />
              {/* Arrow head at (126, 64) pointing downwards */}
              <polygon
                points="126,64 120,56 130,56"
                fill="#00DF00"
                transform="rotate(65, 126, 64)"
              />
            </g>

            {/* Rotating Smartphone (Pivot: 80px, 64px) */}
            <g
              style={{
                transformOrigin: '80px 64px',
              }}
              className="animate-[orientationRotatePhone_3.2s_cubic-bezier(0.4,0,0.2,1)_infinite] motion-reduce:animate-none"
            >
              {/* Phone Outer Chassis with Glow */}
              <rect
                x="57"
                y="24"
                width="46"
                height="80"
                rx="10"
                fill="#070b07"
                stroke="url(#phoneBorderGrad)"
                strokeWidth="2.2"
                filter="url(#phoneGlow)"
              />

              {/* Phone Inner Screen */}
              <rect
                x="60.5"
                y="29"
                width="39"
                height="70"
                rx="6"
                fill="#000000"
                stroke="#00DF00"
                strokeOpacity="0.35"
                strokeWidth="0.8"
              />

              {/* Speaker / Camera Notch */}
              <rect x="73" y="26.5" width="14" height="2" rx="1" fill="#27272a" />

              {/* Micro Technology Network Displayed inside the Screen */}
              <g transform="translate(80, 64)">
                {/* Core Node */}
                <circle r="4" fill="#00DF00" filter="url(#phoneGlow)" />
                <circle r="1.8" fill="#FFFFFF" />

                {/* Satellite Nodes & Connecting Beams */}
                <line x1="0" y1="0" x2="-12" y2="-15" stroke="#00DF00" strokeOpacity="0.6" strokeWidth="0.9" />
                <circle cx="-12" cy="-15" r="2.2" fill="#00DF00" />

                <line x1="0" y1="0" x2="13" y2="-12" stroke="#00DF00" strokeOpacity="0.6" strokeWidth="0.9" />
                <circle cx="13" cy="-12" r="2.2" fill="#00DF00" />

                <line x1="0" y1="0" x2="-11" y2="16" stroke="#00DF00" strokeOpacity="0.6" strokeWidth="0.9" />
                <circle cx="-11" cy="16" r="2.2" fill="#00DF00" />

                <line x1="0" y1="0" x2="12" y2="14" stroke="#00DF00" strokeOpacity="0.6" strokeWidth="0.9" />
                <circle cx="12" cy="14" r="2.2" fill="#00DF00" />
              </g>

              {/* Bottom Home Indicator Bar */}
              <rect x="72" y="93" width="16" height="2" rx="1" fill="#3f3f46" />
            </g>
          </svg>
        </div>

        {/* Title */}
        <h2
          id="orientation-hint-title"
          className="text-xl sm:text-2xl font-black text-white font-heading tracking-tight mt-1"
        >
          Explore em tela cheia
        </h2>

        {/* Message */}
        <p
          id="orientation-hint-desc"
          className="text-xs sm:text-sm text-zinc-300 leading-relaxed mt-2 max-w-[280px] mx-auto font-sans"
        >
          Gire seu celular na horizontal para uma experiência mais imersiva.
        </p>

        {/* Primary Action Button */}
        <button
          ref={actionBtnRef}
          onClick={handleDismiss}
          className="w-full mt-5 py-3 px-6 rounded-xl bg-[#00DF00] hover:bg-[#00FF00] active:scale-[0.98] text-black font-extrabold text-sm tracking-wide shadow-[0_0_20px_rgba(0,223,0,0.4)] hover:shadow-[0_0_30px_rgba(0,223,0,0.6)] transition-all font-heading cursor-pointer"
        >
          Entendi
        </button>

        {/* Complementary Message */}
        <p className="text-[11px] text-zinc-500 font-sans mt-3">
          Você também pode continuar na vertical.
        </p>
      </div>
    </div>
  );
};
