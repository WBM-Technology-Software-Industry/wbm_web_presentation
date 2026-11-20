import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, Maximize2 } from 'lucide-react';

interface ImmersiveEntryExperienceProps {
  currentMode: 'home' | 'slides' | 'vertical' | 'portfolio';
  entryId: number;
}

type ExperienceStep = 'orientation' | 'fullscreen' | 'completed';

// Detect whether the Fullscreen API is natively supported on this browser/device
export const getIsFullscreenSupported = () => {
  if (typeof document === 'undefined') return false;
  return Boolean(
    document.fullscreenEnabled ||
    (document as any).webkitFullscreenEnabled ||
    (document as any).mozFullScreenEnabled ||
    (document as any).msFullscreenEnabled
  );
};

// Detect whether the document is currently in fullscreen
export const getIsFullscreenActive = () => {
  if (typeof document === 'undefined') return false;
  return Boolean(
    document.fullscreenElement ||
    (document as any).webkitFullscreenElement ||
    (document as any).mozFullScreenElement ||
    (document as any).msFullscreenElement
  );
};

export const ImmersiveEntryExperience: React.FC<ImmersiveEntryExperienceProps> = ({
  currentMode,
  entryId,
}) => {
  const [step, setStep] = useState<ExperienceStep>('completed');
  const actionBtnRef = useRef<HTMLButtonElement>(null);
  const previouslyFocusedElementRef = useRef<HTMLElement | null>(null);

  // Helper: check if device has physical smartphone dimensions (shortestDimension <= 500px)
  // Smartphones have shortestDimension between 360px and 430px in portrait and landscape
  // Tablets (iPad Mini, iPad Air, Galaxy Tab) have shortestDimension >= 768px
  // Laptops and desktops have shortestDimension >= 768px
  const isSmartphoneDevice = useCallback(() => {
    if (typeof window === 'undefined') return false;
    const shortestDimension = Math.min(window.innerWidth, window.innerHeight);
    return shortestDimension <= 500;
  }, []);

  // Initialize or re-trigger the flow upon every new entry (entryId change)
  useEffect(() => {
    // Only eligible in 'slides' and 'portfolio' modes
    if (currentMode !== 'slides' && currentMode !== 'portfolio') {
      setStep('completed');
      return;
    }

    // Never trigger on desktops or tablets
    if (!isSmartphoneDevice()) {
      setStep('completed');
      return;
    }

    // Save previous active element for focus restoration
    previouslyFocusedElementRef.current = document.activeElement as HTMLElement;

    // Check orientation:
    // If portrait -> start at step 1 ('orientation')
    // If already in landscape -> jump directly to step 2 ('fullscreen' if supported, else 'completed')
    const isPortrait = window.innerHeight > window.innerWidth;
    if (isPortrait) {
      setStep('orientation');
    } else {
      const canFullscreen = getIsFullscreenSupported() && !getIsFullscreenActive();
      setStep(canFullscreen ? 'fullscreen' : 'completed');
    }
  }, [entryId, currentMode, isSmartphoneDevice]);

  // Handle transition from Step 1 (Orientation) to Step 2 (Fullscreen) or Completion
  const advanceFromOrientation = useCallback(() => {
    const canFullscreen = getIsFullscreenSupported() && !getIsFullscreenActive();
    if (canFullscreen) {
      setStep('fullscreen');
    } else {
      setStep('completed');
      if (previouslyFocusedElementRef.current) {
        previouslyFocusedElementRef.current.focus();
      }
    }
  }, []);

  // Handle completion from Step 2 (Fullscreen)
  const completeFlow = useCallback(() => {
    setStep('completed');
    if (previouslyFocusedElementRef.current) {
      previouslyFocusedElementRef.current.focus();
    }
  }, []);

  // Request fullscreen on user tap
  const handleRequestFullscreen = async () => {
    try {
      if (document.documentElement && !getIsFullscreenActive()) {
        if (document.documentElement.requestFullscreen) {
          await document.documentElement.requestFullscreen();
        } else if ((document.documentElement as any).webkitRequestFullscreen) {
          await (document.documentElement as any).webkitRequestFullscreen();
        }
      }
    } catch {
      // Rejection or error handled gracefully without breaking experience
    }
    completeFlow();
  };

  // Monitor device rotation in real-time
  useEffect(() => {
    const handleOrientationChange = () => {
      // If user rotates to landscape while on Step 1 ('orientation'):
      // Automatically advance to Step 2 ('fullscreen' if supported, or complete)
      if (step === 'orientation') {
        const isLandscape = window.innerWidth > window.innerHeight;
        if (isLandscape) {
          advanceFromOrientation();
        }
      }
    };

    window.addEventListener('resize', handleOrientationChange);
    window.addEventListener('orientationchange', handleOrientationChange);

    return () => {
      window.removeEventListener('resize', handleOrientationChange);
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, [step, advanceFromOrientation]);

  // Accessibility: Focus trap & Escape key handler
  useEffect(() => {
    if (step === 'completed') return;

    const timer = setTimeout(() => {
      actionBtnRef.current?.focus();
    }, 50);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        if (step === 'orientation') {
          advanceFromOrientation();
        } else if (step === 'fullscreen') {
          completeFlow();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [step, advanceFromOrientation, completeFlow]);

  if (step === 'completed') return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn motion-reduce:animate-none select-none"
      role="dialog"
      aria-modal="true"
      aria-labelledby="immersive-modal-title"
      aria-describedby="immersive-modal-desc"
    >
      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-[340px] sm:max-w-sm bg-gradient-to-b from-zinc-900/98 via-zinc-950/98 to-black/98 border border-[#00DF00]/50 rounded-3xl p-6 sm:p-7 shadow-[0_0_50px_rgba(0,223,0,0.25)] text-center overflow-hidden">
        {/* Subtle Ambient Cyber Glow */}
        <div className="absolute -top-12 -left-12 w-32 h-32 bg-[#00DF00]/15 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-[#00DF00]/10 rounded-full blur-2xl pointer-events-none" />

        {/* Step Indicator Badges (when fullscreen step is available) */}
        {getIsFullscreenSupported() && (
          <div className="flex items-center justify-center gap-1.5 mb-3">
            <span
              className={`h-1.5 rounded-full transition-all duration-300 ${
                step === 'orientation'
                  ? 'w-6 bg-[#00DF00] shadow-[0_0_8px_#00DF00]'
                  : 'w-2 bg-zinc-700'
              }`}
            />
            <span
              className={`h-1.5 rounded-full transition-all duration-300 ${
                step === 'fullscreen'
                  ? 'w-6 bg-[#00DF00] shadow-[0_0_8px_#00DF00]'
                  : 'w-2 bg-zinc-700'
              }`}
            />
          </div>
        )}

        {/* Close Button (X) */}
        <button
          onClick={step === 'orientation' ? advanceFromOrientation : completeFlow}
          className="absolute top-4 right-4 p-2 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800/80 transition-colors active:scale-95 cursor-pointer z-10"
          title="Fechar"
          aria-label="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        {/* =========================================================================
            ETAPA 1: ORIENTAÇÃO (RECOMENDAÇÃO DE ROTAÇÃO)
            ========================================================================= */}
        {step === 'orientation' && (
          <div className="flex flex-col items-center">
            {/* Animated Smartphone Illustration */}
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

                {/* Rotation Guide Arc with Arrow */}
                <g className="opacity-80">
                  <path
                    d="M 80 18 A 44 44 0 0 1 126 64"
                    stroke="#00DF00"
                    strokeWidth="1.8"
                    strokeDasharray="3 3"
                    fill="none"
                  />
                  <polygon
                    points="126,64 120,56 130,56"
                    fill="#00DF00"
                    transform="rotate(65, 126, 64)"
                  />
                </g>

                {/* Rotating Smartphone (Pivot: 80px, 64px) */}
                <g
                  style={{ transformOrigin: '80px 64px' }}
                  className="animate-[orientationRotatePhone_3.2s_cubic-bezier(0.4,0,0.2,1)_infinite] motion-reduce:animate-none"
                >
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
                  <rect x="73" y="26.5" width="14" height="2" rx="1" fill="#27272a" />

                  {/* Tech Constellation inside Phone Screen */}
                  <g transform="translate(80, 64)">
                    <circle r="4" fill="#00DF00" filter="url(#phoneGlow)" />
                    <circle r="1.8" fill="#FFFFFF" />

                    <line x1="0" y1="0" x2="-12" y2="-15" stroke="#00DF00" strokeOpacity="0.6" strokeWidth="0.9" />
                    <circle cx="-12" cy="-15" r="2.2" fill="#00DF00" />

                    <line x1="0" y1="0" x2="13" y2="-12" stroke="#00DF00" strokeOpacity="0.6" strokeWidth="0.9" />
                    <circle cx="13" cy="-12" r="2.2" fill="#00DF00" />

                    <line x1="0" y1="0" x2="-11" y2="16" stroke="#00DF00" strokeOpacity="0.6" strokeWidth="0.9" />
                    <circle cx="-11" cy="16" r="2.2" fill="#00DF00" />

                    <line x1="0" y1="0" x2="12" y2="14" stroke="#00DF00" strokeOpacity="0.6" strokeWidth="0.9" />
                    <circle cx="12" cy="14" r="2.2" fill="#00DF00" />
                  </g>
                  <rect x="72" y="93" width="16" height="2" rx="1" fill="#3f3f46" />
                </g>
              </svg>
            </div>

            {/* Title */}
            <h2
              id="immersive-modal-title"
              className="text-xl sm:text-2xl font-black text-white font-heading tracking-tight mt-1"
            >
              Explore em tela cheia
            </h2>

            {/* Message */}
            <p
              id="immersive-modal-desc"
              className="text-xs sm:text-sm text-zinc-300 leading-relaxed mt-2 max-w-[280px] mx-auto font-sans"
            >
              Gire seu celular na horizontal para uma experiência mais imersiva.
            </p>

            {/* Primary Action Button */}
            <button
              ref={actionBtnRef}
              onClick={advanceFromOrientation}
              className="w-full mt-5 py-3 px-6 rounded-xl bg-[#00DF00] hover:bg-[#00FF00] active:scale-[0.98] text-black font-extrabold text-sm tracking-wide shadow-[0_0_20px_rgba(0,223,0,0.4)] hover:shadow-[0_0_30px_rgba(0,223,0,0.6)] transition-all font-heading cursor-pointer"
            >
              Entendi
            </button>

            {/* Complementary Message */}
            <p className="text-[11px] text-zinc-500 font-sans mt-3">
              Você também pode continuar na vertical.
            </p>
          </div>
        )}

        {/* =========================================================================
            ETAPA 2: TELA CHEIA (CONVITE DE IMERSÃO)
            ========================================================================= */}
        {step === 'fullscreen' && (
          <div className="flex flex-col items-center">
            {/* Animated Fullscreen Expansion Illustration */}
            <div className="relative w-44 h-36 mx-auto flex items-center justify-center my-1">
              <svg
                viewBox="0 0 160 120"
                className="w-full h-full overflow-visible"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <filter id="fsGlow" x="-30%" y="-30%" width="160%" height="160%">
                    <feGaussianBlur stdDeviation="3.5" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                  <linearGradient id="fsGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#00DF00" />
                    <stop offset="50%" stopColor="#00FF00" />
                    <stop offset="100%" stopColor="#00DF00" />
                  </linearGradient>
                </defs>

                {/* 4 Corner Fullscreen Expand Brackets */}
                <g className="animate-[cornerArrowPulse_3.2s_ease-in-out_infinite] motion-reduce:animate-none opacity-80" stroke="#00DF00" strokeWidth="2">
                  {/* Top-Left */}
                  <path d="M 16 32 L 16 20 L 28 20" />
                  {/* Top-Right */}
                  <path d="M 132 20 L 144 20 L 144 32" />
                  {/* Bottom-Left */}
                  <path d="M 16 88 L 16 100 L 28 100" />
                  {/* Bottom-Right */}
                  <path d="M 132 100 L 144 100 L 144 88" />
                </g>

                {/* Expanding Window Frame (Pivot: 80px, 60px) */}
                <g
                  style={{ transformOrigin: '80px 60px' }}
                  className="animate-[fullscreenExpandWindow_3.2s_cubic-bezier(0.4,0,0.2,1)_infinite] motion-reduce:animate-none"
                >
                  {/* Main Display Area */}
                  <rect
                    x="20"
                    y="24"
                    width="120"
                    height="72"
                    rx="8"
                    fill="#050805"
                    stroke="url(#fsGrad)"
                    strokeWidth="2.2"
                    filter="url(#fsGlow)"
                  />

                  {/* Browser Window Bar (fades out as screen expands) */}
                  <g className="animate-[browserBarFade_3.2s_ease-in-out_infinite] motion-reduce:animate-none">
                    <rect x="22" y="26" width="116" height="13" rx="6" fill="#18181b" />
                    <circle cx="28" cy="32.5" r="2" fill="#ef4444" />
                    <circle cx="34" cy="32.5" r="2" fill="#eab308" />
                    <circle cx="40" cy="32.5" r="2" fill="#22c55e" />
                    <rect x="48" y="29.5" width="56" height="6" rx="3" fill="#27272a" />
                  </g>

                  {/* Tech Constellation Expanding inside the Canvas */}
                  <g transform="translate(80, 64)">
                    <circle r="4.5" fill="#00DF00" filter="url(#fsGlow)" />
                    <circle r="2.2" fill="#FFFFFF" />

                    <line x1="0" y1="0" x2="-24" y2="-12" stroke="#00DF00" strokeOpacity="0.7" strokeWidth="1.2" />
                    <circle cx="-24" cy="-12" r="3" fill="#00DF00" />

                    <line x1="0" y1="0" x2="24" y2="-12" stroke="#00DF00" strokeOpacity="0.7" strokeWidth="1.2" />
                    <circle cx="24" cy="-12" r="3" fill="#00DF00" />

                    <line x1="0" y1="0" x2="-20" y2="14" stroke="#00DF00" strokeOpacity="0.7" strokeWidth="1.2" />
                    <circle cx="-20" cy="14" r="3" fill="#00DF00" />

                    <line x1="0" y1="0" x2="22" y2="14" stroke="#00DF00" strokeOpacity="0.7" strokeWidth="1.2" />
                    <circle cx="22" cy="14" r="3" fill="#00DF00" />
                  </g>
                </g>
              </svg>
            </div>

            {/* Title */}
            <h2
              id="immersive-modal-title"
              className="text-xl sm:text-2xl font-black text-white font-heading tracking-tight mt-1"
            >
              Uma experiência mais imersiva
            </h2>

            {/* Description */}
            <p
              id="immersive-modal-desc"
              className="text-xs sm:text-sm text-zinc-300 leading-relaxed mt-2 max-w-[280px] mx-auto font-sans"
            >
              Ative a tela cheia para explorar nossas tecnologias com mais espaço e menos distrações.
            </p>

            {/* Primary Action Button: Request Fullscreen */}
            <button
              ref={actionBtnRef}
              onClick={handleRequestFullscreen}
              className="w-full mt-5 py-3 px-6 rounded-xl bg-[#00DF00] hover:bg-[#00FF00] active:scale-[0.98] text-black font-extrabold text-sm tracking-wide shadow-[0_0_20px_rgba(0,223,0,0.4)] hover:shadow-[0_0_30px_rgba(0,223,0,0.6)] transition-all font-heading flex items-center justify-center gap-2 cursor-pointer"
            >
              <Maximize2 className="w-4 h-4" />
              <span>Ativar tela cheia</span>
            </button>

            {/* Secondary Action: Continue Normally */}
            <button
              onClick={completeFlow}
              className="w-full mt-2.5 py-2 text-xs font-semibold text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              Continuar normalmente
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
