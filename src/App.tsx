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

  const [isFullscreen, setIsFullscreen] = useState(false);

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
    // Update URL param without page reload
    const url = new URL(window.location.href);
    url.searchParams.set('mode', mode);
    window.history.replaceState({}, '', url.toString());
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans selection:bg-[#00DF00] selection:text-black">
      {/* Top Navigation Bar */}
      <Header
        currentMode={currentMode === 'home' ? 'slides' : currentMode}
        onToggleMode={handleModeChange}
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
            isFullscreen={isFullscreen}
            onToggleFullscreen={toggleFullscreen}
          />
        )}

        {currentMode === 'vertical' && (
          <VerticalMode />
        )}
      </div>
    </div>
  );
}

export default App;
