import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { SlideMode } from './components/SlideMode';
import { VerticalMode } from './components/VerticalMode';
import { HomeSelector } from './components/HomeSelector';
import { PortfolioMode } from './components/portfolio/PortfolioMode';
import { ImmersiveEntryExperience } from './components/ImmersiveEntryExperience';
import { ThemeProvider } from './context/ThemeContext';

function AppContent() {
  const [currentMode, setCurrentMode] = useState<'home' | 'slides' | 'vertical' | 'portfolio'>(() => {
    // Check URL search params for direct mode links e.g. ?mode=slides, ?mode=vertical or ?mode=portfolio
    const params = new URLSearchParams(window.location.search);
    const modeParam = params.get('mode');
    if (modeParam === 'slides' || modeParam === 'vertical' || modeParam === 'portfolio') {
      return modeParam;
    }
    return 'home';
  });

  const [slideSessionKey, setSlideSessionKey] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Unique presentation entry counter to restart immersive entry experience on each new entry
  const [presentationEntryId, setPresentationEntryId] = useState<number>(() => {
    const params = new URLSearchParams(window.location.search);
    const m = params.get('mode');
    return (m === 'slides' || m === 'portfolio') ? 1 : 0;
  });

  // Sync browser back/forward buttons (History API)
  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const modeParam = params.get('mode');
      if (modeParam === 'slides' || modeParam === 'vertical' || modeParam === 'portfolio') {
        setCurrentMode(modeParam);
        if (modeParam === 'slides' || modeParam === 'portfolio') {
          setPresentationEntryId((prev) => prev + 1);
        }
      } else {
        setCurrentMode('home');
        setSlideSessionKey((prev) => prev + 1);
      }
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Sync fullscreen state
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {
        // Fullscreen not supported or allowed
      });
    } else {
      document.exitFullscreen().catch(() => {
        // Ignored
      });
    }
  };

  const handleModeChange = (mode: 'slides' | 'vertical' | 'portfolio') => {
    setCurrentMode(mode);
    setSlideSessionKey((prev) => prev + 1);
    if (mode === 'slides' || mode === 'portfolio') {
      setPresentationEntryId((prev) => prev + 1);
    }
    const url = new URL(window.location.href);
    url.searchParams.set('mode', mode);
    window.history.pushState({ mode }, '', url.toString());
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  };

  const handleReturnHome = () => {
    setCurrentMode('home');
    setSlideSessionKey((prev) => prev + 1);
    const url = new URL(window.location.href);
    url.searchParams.delete('mode');
    window.history.pushState({ mode: 'home' }, '', url.pathname + (url.search ? url.search : '') + url.hash);
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  };

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-[var(--wbm-bg)] text-[var(--wbm-text)] flex flex-col font-sans transition-colors duration-200">
      {/* Top Navigation Bar */}
      <Header
        currentMode={currentMode}
        onToggleMode={handleModeChange}
        onReturnHome={handleReturnHome}
        isFullscreen={isFullscreen}
        onToggleFullscreen={toggleFullscreen}
      />

      {/* Main Content View */}
      <div className="flex-1 flex flex-col">
        {currentMode === 'home' && (
          <HomeSelector onSelectMode={handleModeChange} />
        )}

        {currentMode === 'slides' && (
          <SlideMode
            key={`slide-session-${slideSessionKey}`}
            isFullscreen={isFullscreen}
            onToggleFullscreen={toggleFullscreen}
          />
        )}

        {currentMode === 'vertical' && (
          <VerticalMode key={`vertical-session-${slideSessionKey}`} />
        )}

        {currentMode === 'portfolio' && (
          <PortfolioMode
            key={`portfolio-session-${slideSessionKey}`}
            onReturnHome={handleReturnHome}
          />
        )}
      </div>

      {/* Immersive Entry Experience: Orientation + Fullscreen for Smartphones */}
      <ImmersiveEntryExperience
        currentMode={currentMode}
        entryId={presentationEntryId}
      />
    </div>
  );
}

export function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
