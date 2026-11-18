import React, { useState } from 'react';
import { SlidersHorizontal, ScrollText, Maximize2, Minimize2, Share2, MessageSquare, Check } from 'lucide-react';
import { contactInfo } from '../data/presentationData';

interface HeaderProps {
  currentMode: 'slides' | 'vertical';
  onToggleMode: (mode: 'slides' | 'vertical') => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentMode,
  onToggleMode,
  isFullscreen,
  onToggleFullscreen,
}) => {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'WBM Technology — Apresentação Institucional',
          text: 'Conheça as soluções de instrumentação, automação e IoT da WBM Technology.',
          url: window.location.href,
        });
        return;
      } catch (err) {
        // Fallback to clipboard
      }
    }
    
    // Fallback: Copy URL
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Ignored
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-black/90 backdrop-blur-md border-b border-zinc-800/80 px-3 sm:px-6 py-2.5 sm:py-3 select-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Left: Brand Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onToggleMode('slides')}
            className="flex items-center gap-2 group text-left focus:outline-none"
            title="WBM Technology"
          >
            <img
              src="/assets/wbm-logo-clean.png"
              alt="WBM Technology"
              className="h-7 sm:h-9 w-auto object-contain drop-shadow-[0_0_8px_rgba(0,223,0,0.4)] group-hover:drop-shadow-[0_0_12px_rgba(0,223,0,0.7)] transition-all"
            />
          </button>
        </div>

        {/* Center: Mode Switcher (Pill) */}
        <div className="flex items-center bg-zinc-950 p-1 rounded-full border border-zinc-800 shadow-inner">
          <button
            onClick={() => onToggleMode('slides')}
            className={`flex items-center gap-1.5 px-2.5 sm:px-4 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 ${
              currentMode === 'slides'
                ? 'bg-[#00DF00] text-black shadow-[0_0_12px_rgba(0,223,0,0.5)]'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>Slides</span>
          </button>

          <button
            onClick={() => onToggleMode('vertical')}
            className={`flex items-center gap-1.5 px-2.5 sm:px-4 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 ${
              currentMode === 'vertical'
                ? 'bg-[#00DF00] text-black shadow-[0_0_12px_rgba(0,223,0,0.5)]'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <ScrollText className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>Vertical</span>
          </button>
        </div>

        {/* Right: Quick Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          
          {/* Share Button */}
          <button
            onClick={handleShare}
            className="relative p-2 sm:px-3 sm:py-1.5 rounded-lg sm:rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:border-[#00DF00]/60 transition-all text-xs font-medium flex items-center gap-1.5 active:scale-95"
            title="Compartilhar apresentação"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-[#00DF00]" />
                <span className="hidden md:inline text-[#00DF00]">Copiado!</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4" />
                <span className="hidden md:inline">Compartilhar</span>
              </>
            )}
          </button>

          {/* Fullscreen Toggle (mainly for slide mode) */}
          <button
            onClick={onToggleFullscreen}
            className="p-2 sm:p-2 rounded-lg sm:rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:border-[#00DF00]/60 transition-all active:scale-95 hidden sm:flex"
            title={isFullscreen ? 'Sair da tela cheia' : 'Modo tela cheia'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* Direct WhatsApp Call-to-action */}
          <a
            href={contactInfo.whatsapp.url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 sm:px-3.5 sm:py-1.5 rounded-lg sm:rounded-xl bg-[#25D366]/15 border border-[#25D366]/40 text-[#25D366] hover:bg-[#25D366] hover:text-black font-semibold text-xs sm:text-sm flex items-center gap-1.5 transition-all shadow-[0_0_12px_rgba(37,211,102,0.2)] active:scale-95"
            title="Fale conosco no WhatsApp"
          >
            <MessageSquare className="w-4 h-4 fill-current" />
            <span className="hidden sm:inline">WhatsApp</span>
          </a>

        </div>

      </div>
    </header>
  );
};
