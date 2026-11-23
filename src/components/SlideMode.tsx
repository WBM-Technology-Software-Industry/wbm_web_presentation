import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Slide1Cenario } from './slides/Slide1Cenario';
import { Slide2Desafios } from './slides/Slide2Desafios';
import { Slide3Wbm } from './slides/Slide3Wbm';
import { Slide4Clientes } from './slides/Slide4Clientes';
import { Slide5Contato } from './slides/Slide5Contato';
import { NetworkMeshBg } from './ui/NetworkMeshBg';
import { ChevronLeft, ChevronRight, HelpCircle } from 'lucide-react';
import { slidesMeta } from '../data/presentationData';
import { useTheme } from '../context/ThemeContext';

interface SlideModeProps {
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
}

export const SlideMode: React.FC<SlideModeProps> = ({ isFullscreen, onToggleFullscreen }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [showKeyboardHelp, setShowKeyboardHelp] = useState(false);
  const slideContainerRef = useRef<HTMLDivElement>(null);
  const { isDark } = useTheme();

  const totalSlides = 5;

  const goToSlide = useCallback((index: number) => {
    if (index >= 0 && index < totalSlides) {
      setCurrentSlide(index);
    }
  }, [totalSlides]);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev < totalSlides - 1 ? prev + 1 : prev));
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev > 0 ? prev - 1 : prev));
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowDown':
        case ' ':
        case 'PageDown':
          e.preventDefault();
          nextSlide();
          break;
        case 'ArrowLeft':
        case 'ArrowUp':
        case 'PageUp':
          e.preventDefault();
          prevSlide();
          break;
        case 'Home':
          e.preventDefault();
          goToSlide(0);
          break;
        case 'End':
          e.preventDefault();
          goToSlide(totalSlides - 1);
          break;
        case 'f':
        case 'F':
          e.preventDefault();
          onToggleFullscreen();
          break;
        case '?':
          setShowKeyboardHelp((prev) => !prev);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide, goToSlide, totalSlides, onToggleFullscreen]);

  // Touch Swipe Handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    // Prevent navigation if user is actively selecting text
    const selection = window.getSelection();
    if (selection && selection.toString().trim().length > 0) {
      return;
    }

    const distance = touchStart - touchEnd;
    const minSwipeDistance = 50;

    if (distance > minSwipeDistance) {
      // Swiped Left -> Next Slide
      nextSlide();
    } else if (distance < -minSwipeDistance) {
      // Swiped Right -> Previous Slide
      prevSlide();
    }
  };

  const renderCurrentSlide = () => {
    switch (currentSlide) {
      case 0:
        return <Slide1Cenario />;
      case 1:
        return <Slide2Desafios />;
      case 2:
        return <Slide3Wbm />;
      case 3:
        return <Slide4Clientes />;
      case 4:
        return <Slide5Contato />;
      default:
        return <Slide1Cenario />;
    }
  };

  const progressPercentage = ((currentSlide + 1) / totalSlides) * 100;

  return (
    <div
      ref={slideContainerRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className={`relative w-full flex flex-col justify-between overflow-x-hidden transition-colors duration-200 ${
        isFullscreen ? 'h-screen' : 'min-h-[calc(100vh-65px)]'
      } ${isDark ? 'bg-black text-white' : 'bg-[#E6EFEB] text-[#172C22]'}`}
    >
      {/* Background Cyber Network */}
      <NetworkMeshBg />

      {/* Top Progress Bar */}
      <div className={`w-full h-1 relative z-20 ${isDark ? 'bg-zinc-900' : 'bg-[#D7EBDD]'}`}>
        <div
          className={`h-full transition-all duration-300 ease-out ${
            isDark
              ? 'bg-gradient-to-r from-[#00aa00] via-[#00DF00] to-[#55ff55] shadow-[0_0_10px_rgba(0,223,0,0.8)]'
              : 'bg-[#087C3B] shadow-[0_2px_6px_rgba(8,124,59,0.4)]'
          }`}
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      {/* Main Slide Content Area */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center p-3 sm:p-6 md:p-8 lg:p-10 max-w-7xl mx-auto w-full">
        {/* Animated Slide Wrapper */}
        <div
          key={currentSlide}
          className="w-full h-full flex flex-col justify-between animate-fadeIn transition-opacity duration-300"
        >
          {renderCurrentSlide()}
        </div>
      </main>

      {/* Navigation Controls Bar */}
      <footer
        className={`relative z-20 w-full backdrop-blur-md py-2 sm:py-3 px-3 sm:px-6 select-none border-t transition-colors duration-200 ${
          isDark
            ? 'bg-black/80 border-zinc-900 text-white'
            : 'bg-white/90 border-[#B8D1C3] text-[#172C22]'
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
          
          {/* Left: Previous Slide Button */}
          <button
            onClick={prevSlide}
            disabled={currentSlide === 0}
            className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 border ${
              currentSlide === 0
                ? isDark
                  ? 'opacity-30 cursor-not-allowed border-zinc-800 text-zinc-500'
                  : 'opacity-30 cursor-not-allowed border-[#B8D1C3] text-zinc-400'
                : isDark
                ? 'border-zinc-800 bg-zinc-950 text-white hover:border-[#00DF00] hover:text-[#00DF00] hover:shadow-[0_0_12px_rgba(0,223,0,0.3)] active:scale-95'
                : 'border-[#B8D1C3] bg-white text-[#172C22] hover:border-[#087C3B] hover:text-[#087C3B] hover:shadow-md active:scale-95'
            }`}
            title="Slide anterior (Seta esquerda)"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Anterior</span>
          </button>

          {/* Center: Slide Bullets / Pagination */}
          <div className="flex items-center gap-2 sm:gap-3">
            {slidesMeta.map((slide, idx) => (
              <button
                key={slide.id}
                onClick={() => goToSlide(idx)}
                className={`group relative flex items-center justify-center transition-all duration-300 ${
                  currentSlide === idx
                    ? isDark
                      ? 'w-8 sm:w-10 h-7 sm:h-8 rounded-lg bg-[#00DF00] text-black font-extrabold text-xs shadow-[0_0_15px_rgba(0,223,0,0.6)]'
                      : 'w-8 sm:w-10 h-7 sm:h-8 rounded-lg bg-[#087C3B] text-white font-extrabold text-xs shadow-md'
                    : isDark
                    ? 'w-7 sm:w-8 h-7 sm:h-8 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 text-xs font-semibold'
                    : 'w-7 sm:w-8 h-7 sm:h-8 rounded-lg bg-white border border-[#B8D1C3] text-[#4A6B5B] hover:text-[#172C22] hover:border-[#087C3B] text-xs font-semibold shadow-sm'
                }`}
                title={`Ir para Slide ${idx + 1}: ${slide.title}`}
              >
                <span>{idx + 1}</span>
                {/* Tooltip on hover */}
                <span
                  className={`absolute bottom-full mb-2 hidden group-hover:block border text-[10px] px-2 py-1 rounded shadow-lg whitespace-nowrap z-30 ${
                    isDark
                      ? 'bg-zinc-900 border-zinc-700 text-white'
                      : 'bg-white border-[#B8D1C3] text-[#172C22]'
                  }`}
                >
                  {slide.title}
                </span>
              </button>
            ))}

            <span
              className={`text-xs font-mono ml-1 hidden md:inline ${
                isDark ? 'text-zinc-500' : 'text-[#6B8B7B]'
              }`}
            >
              ({currentSlide + 1} / {totalSlides})
            </span>
          </div>

          {/* Right: Next Slide Button & Keyboard Help */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowKeyboardHelp(true)}
              className={`p-2 rounded-xl border transition-colors hidden sm:flex ${
                isDark
                  ? 'border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
                  : 'border-[#B8D1C3] text-[#4A6B5B] hover:text-[#172C22] hover:border-[#087C3B] bg-white'
              }`}
              title="Atalhos do teclado (?)"
            >
              <HelpCircle className="w-4 h-4" />
            </button>

            <button
              onClick={nextSlide}
              disabled={currentSlide === totalSlides - 1}
              className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 border ${
                currentSlide === totalSlides - 1
                  ? isDark
                    ? 'opacity-30 cursor-not-allowed border-zinc-800 text-zinc-500'
                    : 'opacity-30 cursor-not-allowed border-[#B8D1C3] text-zinc-400'
                  : isDark
                  ? 'border-[#00DF00]/60 bg-[#00DF00] text-black hover:bg-[#00ff00] hover:shadow-[0_0_15px_rgba(0,223,0,0.5)] active:scale-95'
                  : 'border-[#087C3B] bg-[#087C3B] text-white hover:bg-[#06612e] hover:shadow-md active:scale-95'
              }`}
              title="Próximo slide (Seta direita / Espaço)"
            >
              <span className="hidden sm:inline">Próximo</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </footer>

      {/* Keyboard Shortcuts Modal */}
      {showKeyboardHelp && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div
            className={`border rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-2xl ${
              isDark
                ? 'bg-zinc-950 border-zinc-800 text-zinc-300'
                : 'bg-white border-[#B8D1C3] text-[#172C22]'
            }`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[var(--wbm-border)]">
              <h4 className="text-base font-bold font-heading">
                Atalhos do Teclado
              </h4>
              <button
                onClick={() => setShowKeyboardHelp(false)}
                className="text-zinc-400 hover:text-zinc-600 dark:hover:text-white text-sm"
              >
                ✕
              </button>
            </div>
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between items-center">
                <span>Próximo slide</span>
                <kbd
                  className={`px-2 py-1 border rounded font-mono ${
                    isDark
                      ? 'bg-zinc-900 border-zinc-700 text-zinc-200'
                      : 'bg-zinc-100 border-[#B8D1C3] text-[#172C22]'
                  }`}
                >
                  → / Espaço
                </kbd>
              </div>
              <div className="flex justify-between items-center">
                <span>Slide anterior</span>
                <kbd
                  className={`px-2 py-1 border rounded font-mono ${
                    isDark
                      ? 'bg-zinc-900 border-zinc-700 text-zinc-200'
                      : 'bg-zinc-100 border-[#B8D1C3] text-[#172C22]'
                  }`}
                >
                  ←
                </kbd>
              </div>
              <div className="flex justify-between items-center">
                <span>Primeiro / Último</span>
                <kbd
                  className={`px-2 py-1 border rounded font-mono ${
                    isDark
                      ? 'bg-zinc-900 border-zinc-700 text-zinc-200'
                      : 'bg-zinc-100 border-[#B8D1C3] text-[#172C22]'
                  }`}
                >
                  Home / End
                </kbd>
              </div>
              <div className="flex justify-between items-center">
                <span>Alternar Tela Cheia</span>
                <kbd
                  className={`px-2 py-1 border rounded font-mono ${
                    isDark
                      ? 'bg-zinc-900 border-zinc-700 text-zinc-200'
                      : 'bg-zinc-100 border-[#B8D1C3] text-[#172C22]'
                  }`}
                >
                  F
                </kbd>
              </div>
              <div className="flex justify-between items-center">
                <span>Celular / Touch</span>
                <span className={isDark ? 'text-[#00DF00] font-medium' : 'text-[#087C3B] font-medium'}>
                  Deslize o dedo
                </span>
              </div>
            </div>
            <button
              onClick={() => setShowKeyboardHelp(false)}
              className={`w-full py-2 rounded-xl text-xs font-semibold transition-colors mt-2 ${
                isDark
                  ? 'bg-zinc-900 hover:bg-zinc-800 text-white'
                  : 'bg-[#D7EBDD] hover:bg-[#C8E6C9] text-[#087C3B]'
              }`}
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
