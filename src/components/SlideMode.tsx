import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Slide1Cenario } from './slides/Slide1Cenario';
import { Slide2Desafios } from './slides/Slide2Desafios';
import { Slide3Wbm } from './slides/Slide3Wbm';
import { Slide4Clientes } from './slides/Slide4Clientes';
import { Slide5Contato } from './slides/Slide5Contato';
import { NetworkMeshBg } from './ui/NetworkMeshBg';
import { ChevronLeft, ChevronRight, HelpCircle } from 'lucide-react';
import { slidesMeta } from '../data/presentationData';

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
      className={`relative w-full flex flex-col justify-between overflow-x-hidden ${
        isFullscreen ? 'h-screen bg-black' : 'min-h-[calc(100vh-65px)] bg-black'
      }`}
    >
      {/* Background Cyber Network */}
      <NetworkMeshBg />

      {/* Top Progress Bar */}
      <div className="w-full h-1 bg-zinc-900 relative z-20">
        <div
          className="h-full bg-gradient-to-r from-[#00aa00] via-[#00DF00] to-[#55ff55] shadow-[0_0_10px_rgba(0,223,0,0.8)] transition-all duration-300 ease-out"
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
      <footer className="relative z-20 w-full bg-black/80 backdrop-blur-md border-t border-zinc-900 py-2 sm:py-3 px-3 sm:px-6 select-none">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
          
          {/* Left: Previous Slide Button */}
          <button
            onClick={prevSlide}
            disabled={currentSlide === 0}
            className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 border ${
              currentSlide === 0
                ? 'opacity-30 cursor-not-allowed border-zinc-800 text-zinc-500'
                : 'border-zinc-800 bg-zinc-950 text-white hover:border-[#00DF00] hover:text-[#00DF00] hover:shadow-[0_0_12px_rgba(0,223,0,0.3)] active:scale-95'
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
                    ? 'w-8 sm:w-10 h-7 sm:h-8 rounded-lg bg-[#00DF00] text-black font-extrabold text-xs shadow-[0_0_15px_rgba(0,223,0,0.6)]'
                    : 'w-7 sm:w-8 h-7 sm:h-8 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 text-xs font-semibold'
                }`}
                title={`Ir para Slide ${idx + 1}: ${slide.title}`}
              >
                <span>{idx + 1}</span>
                {/* Tooltip on hover */}
                <span className="absolute bottom-full mb-2 hidden group-hover:block bg-zinc-900 border border-zinc-700 text-white text-[10px] px-2 py-1 rounded shadow-lg whitespace-nowrap z-30">
                  {slide.title}
                </span>
              </button>
            ))}

            <span className="text-zinc-500 text-xs font-mono ml-1 hidden md:inline">
              ({currentSlide + 1} / {totalSlides})
            </span>
          </div>

          {/* Right: Next Slide Button & Keyboard Help */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowKeyboardHelp(true)}
              className="p-2 rounded-xl border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 transition-colors hidden sm:flex"
              title="Atalhos do teclado (?)"
            >
              <HelpCircle className="w-4 h-4" />
            </button>

            <button
              onClick={nextSlide}
              disabled={currentSlide === totalSlides - 1}
              className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 border ${
                currentSlide === totalSlides - 1
                  ? 'opacity-30 cursor-not-allowed border-zinc-800 text-zinc-500'
                  : 'border-[#00DF00]/60 bg-[#00DF00] text-black hover:bg-[#00ff00] hover:shadow-[0_0_15px_rgba(0,223,0,0.5)] active:scale-95'
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
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <h4 className="text-base font-bold text-white font-heading">
                Atalhos do Teclado
              </h4>
              <button
                onClick={() => setShowKeyboardHelp(false)}
                className="text-zinc-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>
            <div className="space-y-2.5 text-xs text-zinc-300">
              <div className="flex justify-between items-center">
                <span>Próximo slide</span>
                <kbd className="px-2 py-1 bg-zinc-900 border border-zinc-700 rounded text-zinc-200 font-mono">
                  → / Espaço
                </kbd>
              </div>
              <div className="flex justify-between items-center">
                <span>Slide anterior</span>
                <kbd className="px-2 py-1 bg-zinc-900 border border-zinc-700 rounded text-zinc-200 font-mono">
                  ←
                </kbd>
              </div>
              <div className="flex justify-between items-center">
                <span>Primeiro / Último</span>
                <kbd className="px-2 py-1 bg-zinc-900 border border-zinc-700 rounded text-zinc-200 font-mono">
                  Home / End
                </kbd>
              </div>
              <div className="flex justify-between items-center">
                <span>Alternar Tela Cheia</span>
                <kbd className="px-2 py-1 bg-zinc-900 border border-zinc-700 rounded text-zinc-200 font-mono">
                  F
                </kbd>
              </div>
              <div className="flex justify-between items-center">
                <span>Celular / Touch</span>
                <span className="text-[#00DF00] font-medium">Deslize o dedo</span>
              </div>
            </div>
            <button
              onClick={() => setShowKeyboardHelp(false)}
              className="w-full py-2 bg-zinc-900 hover:bg-zinc-800 rounded-xl text-white text-xs font-semibold transition-colors mt-2"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
