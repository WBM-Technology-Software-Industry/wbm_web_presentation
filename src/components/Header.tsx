import React, { useState } from 'react';
import {
  SlidersHorizontal,
  ScrollText,
  Compass,
  Maximize2,
  Minimize2,
  Share2,
  MessageSquare,
  Check,
  ArrowLeft,
  Sun,
  Moon,
} from 'lucide-react';
import { contactInfo } from '../data/presentationData';
import { getIsFullscreenSupported } from './ImmersiveEntryExperience';
import { useTheme } from '../context/ThemeContext';

interface HeaderProps {
  currentMode: 'home' | 'slides' | 'vertical' | 'portfolio';
  onToggleMode: (mode: 'slides' | 'vertical' | 'portfolio') => void;
  onReturnHome: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentMode,
  onToggleMode,
  onReturnHome,
  isFullscreen,
  onToggleFullscreen,
}) => {
  const [copied, setCopied] = useState(false);
  const { isDark, toggleTheme } = useTheme();

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
    <header className="sticky top-0 z-50 w-full max-w-full bg-[var(--wbm-bg)]/95 backdrop-blur-md border-b border-[var(--wbm-border)] px-2.5 sm:px-6 py-1.5 sm:py-2 select-none overflow-x-hidden transition-colors duration-200">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Left: Home Return Button & Brand Logo */}
        <div className="flex items-center gap-2 sm:gap-3">
          {currentMode !== 'home' && (
            <button
              onClick={onReturnHome}
              className={`flex items-center gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-all active:scale-95 group shadow-sm shrink-0 border ${
                isDark
                  ? 'bg-zinc-900/90 hover:bg-zinc-800 border-zinc-800 hover:border-[#00DF00]/60 text-zinc-300 hover:text-white'
                  : 'bg-white hover:bg-zinc-50 border-[#B8D1C3] hover:border-[#087C3B] text-[#172C22]'
              }`}
              title="Retornar à tela inicial de seleção"
            >
              <ArrowLeft className={`w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:-translate-x-0.5 transition-transform shrink-0 ${
                isDark ? 'text-[#00DF00]' : 'text-[#087C3B]'
              }`} />
              <span className="hidden sm:inline">Início</span>
            </button>
          )}

          <button
            onClick={onReturnHome}
            className="flex items-center gap-2 group text-left focus:outline-none"
            title="WBM Technology — Tela Inicial"
          >
            <img
              src="/assets/WBM_LOGO_3D_HORIZONTAL.png"
              alt="WBM Technology"
              className={`h-7 sm:h-8.5 md:h-9 w-auto object-contain transition-all ${
                isDark
                  ? 'drop-shadow-[0_0_10px_rgba(0,223,0,0.35)] group-hover:drop-shadow-[0_0_15px_rgba(0,223,0,0.6)]'
                  : 'drop-shadow-[0_1px_4px_rgba(8,124,59,0.25)] group-hover:drop-shadow-[0_2px_8px_rgba(8,124,59,0.4)]'
              }`}
            />
          </button>
        </div>

        {/* Center: Mode Switcher (Pill) */}
        <div className={`flex items-center p-1 rounded-full border shadow-inner transition-colors duration-200 ${
          isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-[#D7EBDD] border-[#B8D1C3]'
        }`}>
          <button
            onClick={() => onToggleMode('slides')}
            className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-4 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 ${
              currentMode === 'slides'
                ? isDark
                  ? 'bg-[#00DF00] text-black shadow-[0_0_12px_rgba(0,223,0,0.5)]'
                  : 'bg-[#087C3B] text-white shadow-[0_2px_8px_rgba(8,124,59,0.3)]'
                : isDark
                ? 'text-zinc-400 hover:text-white'
                : 'text-[#4A6B5B] hover:text-[#172C22]'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Slides</span>
          </button>

          <button
            onClick={() => onToggleMode('vertical')}
            className={`flex items-center gap-1.5 px-2.5 sm:px-4 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 ${
              currentMode === 'vertical'
                ? isDark
                  ? 'bg-[#00DF00] text-black shadow-[0_0_12px_rgba(0,223,0,0.5)]'
                  : 'bg-[#087C3B] text-white shadow-[0_2px_8px_rgba(8,124,59,0.3)]'
                : isDark
                ? 'text-zinc-400 hover:text-white'
                : 'text-[#4A6B5B] hover:text-[#172C22]'
            }`}
          >
            <ScrollText className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Vertical</span>
          </button>

          <button
            onClick={() => onToggleMode('portfolio')}
            className={`flex items-center gap-1.5 px-2.5 sm:px-4 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 ${
              currentMode === 'portfolio'
                ? isDark
                  ? 'bg-[#00DF00] text-black shadow-[0_0_12px_rgba(0,223,0,0.5)]'
                  : 'bg-[#087C3B] text-white shadow-[0_2px_8px_rgba(8,124,59,0.3)]'
                : isDark
                ? 'text-zinc-400 hover:text-white'
                : 'text-[#4A6B5B] hover:text-[#172C22]'
            }`}
          >
            <Compass className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Portfólio</span>
          </button>
        </div>

        {/* Right: Quick Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          
          {/* Theme Switcher (Dark Tech / Light Tech) */}
          <button
            onClick={toggleTheme}
            data-testid="theme-toggle"
            className={`p-2 sm:px-2.5 sm:py-1.5 rounded-lg sm:rounded-xl border transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer ${
              isDark
                ? 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:text-white hover:border-[#00DF00]/60'
                : 'bg-white border-[#B8D1C3] text-[#172C22] hover:border-[#087C3B] shadow-sm'
            }`}
            title={isDark ? 'Alternar para tema claro (Light Tech)' : 'Alternar para tema escuro (Dark Tech)'}
            aria-label={isDark ? 'Alternar para tema claro' : 'Alternar para tema escuro'}
          >
            {isDark ? (
              <>
                <Sun className="w-4 h-4 text-amber-400 animate-pulse-subtle" />
                <span className="hidden lg:inline text-xs font-medium text-zinc-300">Claro</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-[#087C3B]" />
                <span className="hidden lg:inline text-xs font-medium text-[#172C22]">Escuro</span>
              </>
            )}
          </button>

          {/* Share Button */}
          <button
            onClick={handleShare}
            className={`relative p-2 sm:px-3 sm:py-1.5 rounded-lg sm:rounded-xl border transition-all text-xs font-medium flex items-center gap-1.5 active:scale-95 ${
              isDark
                ? 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:text-white hover:border-[#00DF00]/60'
                : 'bg-white border-[#B8D1C3] text-[#172C22] hover:border-[#087C3B] shadow-sm'
            }`}
            title="Compartilhar apresentação"
          >
            {copied ? (
              <>
                <Check className={`w-4 h-4 ${isDark ? 'text-[#00DF00]' : 'text-[#087C3B]'}`} />
                <span className={`hidden md:inline font-semibold ${isDark ? 'text-[#00DF00]' : 'text-[#087C3B]'}`}>Copiado!</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4" />
                <span className="hidden md:inline">Compartilhar</span>
              </>
            )}
          </button>

          {/* Fullscreen Toggle */}
          {getIsFullscreenSupported() && (
            <button
              onClick={onToggleFullscreen}
              className={`p-2 sm:px-2.5 sm:py-1.5 rounded-lg sm:rounded-xl border transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer ${
                isDark
                  ? 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:text-white hover:border-[#00DF00]/60'
                  : 'bg-white border-[#B8D1C3] text-[#172C22] hover:border-[#087C3B] shadow-sm'
              }`}
              title={isFullscreen ? 'Sair da tela cheia' : 'Modo tela cheia'}
              aria-label={isFullscreen ? 'Sair da tela cheia' : 'Modo tela cheia'}
            >
              {isFullscreen ? (
                <>
                  <Minimize2 className={`w-4 h-4 ${isDark ? 'text-[#00DF00]' : 'text-[#087C3B]'}`} />
                  <span className={`hidden md:inline text-[11px] font-mono font-bold ${isDark ? 'text-[#00DF00]' : 'text-[#087C3B]'}`}>Sair</span>
                </>
              ) : (
                <>
                  <Maximize2 className="w-4 h-4" />
                  <span className="hidden md:inline text-[11px] font-mono">Tela cheia</span>
                </>
              )}
            </button>
          )}

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
