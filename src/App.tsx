import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { SlideMode } from './components/SlideMode';
import { VerticalMode } from './components/VerticalMode';
import { HomeSelector } from './components/HomeSelector';

export function App() {
  const [currentMode, setCurrentMode] = useState<'home' | 'slides' | 'vertical'>(() => {
    // Check URL search params for direct mode links e.g. ?mode=slides or ?mode=vertical
    const params = new URLSearchParams(window.location.search);
    const modeParam = params.get('mode');
    if (modeParam === 'slides' || modeParam === 'vertical') {
      return modeParam;
    }
    return 'home';
  });

  const [slideSessionKey, setSlideSessionKey] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Sync browser back/forward buttons (History API)
  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const modeParam = params.get('mode');
      if (modeParam === 'slides' || modeParam === 'vertical') {
        setCurrentMode(modeParam);
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

  const handleModeChange = (mode: 'slides' | 'vertical') => {
    setCurrentMode(mode);
    setSlideSessionKey((prev) => prev + 1);
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
    <div className="min-h-screen bg-black text-white flex flex-col font-sans selection:bg-[#00DF00] selection:text-black">
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
      </div>
    </div>
  );
}

export default App;
