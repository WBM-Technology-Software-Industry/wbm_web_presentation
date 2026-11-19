import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  UNIVERSES,
  UniverseId,
  ProductId,
  getProductsByUniverse,
  Universe,
} from '../../data/portfolioData';
import {
  Droplets,
  Factory,
  Fish,
  Trees,
  Zap,
  FlaskConical,
  ArrowLeft,
  Compass,
  ChevronRight,
} from 'lucide-react';
import { NetworkMeshBg } from '../ui/NetworkMeshBg';
import { SolutionDetailPanel } from './SolutionDetailPanel';

interface PortfolioModeProps {
  onReturnHome: () => void;
  onSelectSolutionDetail?: (productId: ProductId, universeId: UniverseId) => void;
}

export const PortfolioMode: React.FC<PortfolioModeProps> = ({
  onReturnHome,
  onSelectSolutionDetail,
}) => {
  // Navigation State with URL parameter support for direct sharing/testing
  const [selectedUniverseId, setSelectedUniverseId] = useState<UniverseId | null>(() => {
    if (typeof window === 'undefined') return null;
    const params = new URLSearchParams(window.location.search);
    const sector = params.get('sector');
    if (sector && sector in UNIVERSES) {
      return sector as UniverseId;
    }
    return null;
  });

  const [selectedProductId, setSelectedProductId] = useState<ProductId | null>(() => {
    if (typeof window === 'undefined') return null;
    const params = new URLSearchParams(window.location.search);
    const prod = params.get('product');
    return prod ? (prod as ProductId) : null;
  });

  // Hover and focus state for coordinated interactive luminous feedback (supports ?hover= for testing/deep-linking)
  const [hoveredProductId, setHoveredProductId] = useState<ProductId | null>(() => {
    if (typeof window === 'undefined') return null;
    const params = new URLSearchParams(window.location.search);
    const h = params.get('hover');
    return h ? (h as ProductId) : null;
  });

  // Default to list view on small mobile viewports
  const [mobileTab, setMobileTab] = useState<'map' | 'list'>(() => {
    return typeof window !== 'undefined' && window.innerWidth < 768 ? 'list' : 'map';
  });

  // Dynamic viewport measurement for exact bounding box framing
  const containerRef = useRef<HTMLDivElement>(null);
  const [viewportSize, setViewportSize] = useState({ width: 1200, height: 700 });

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setViewportSize({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        });
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Motion preference hook
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  // Handle Universe Selection
  const handleSelectUniverse = useCallback((universeId: UniverseId) => {
    setSelectedUniverseId(universeId);
    setSelectedProductId(null);
    setHoveredProductId(null);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('sector', universeId);
      url.searchParams.delete('product');
      window.history.pushState({ sector: universeId }, '', url.toString());
    }
  }, []);

  // Return to Macro Overview
  const handleBackToOverview = useCallback(() => {
    setSelectedUniverseId(null);
    setSelectedProductId(null);
    setHoveredProductId(null);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.delete('sector');
      url.searchParams.delete('product');
      window.history.pushState({}, '', url.toString());
    }
  }, []);

  // Handle Product Selection & Direct Switching (preserves sector, updates history)
  const handleSelectProduct = useCallback(
    (productId: ProductId) => {
      setSelectedProductId(productId);
      setHoveredProductId(null);
      if (onSelectSolutionDetail && selectedUniverseId) {
        onSelectSolutionDetail(productId, selectedUniverseId);
      }
      if (typeof window !== 'undefined') {
        const url = new URL(window.location.href);
        url.searchParams.set('product', productId);
        if (selectedUniverseId) {
          url.searchParams.set('sector', selectedUniverseId);
        }
        window.history.pushState({ sector: selectedUniverseId, product: productId }, '', url.toString());
      }
    },
    [selectedUniverseId, onSelectSolutionDetail]
  );

  // Close Product Detail Panel
  const handleCloseProduct = useCallback(() => {
    setSelectedProductId(null);
    setHoveredProductId(null);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.delete('product');
      window.history.pushState({ sector: selectedUniverseId }, '', url.toString());
    }
  }, [selectedUniverseId]);

  // Sync with browser back/forward buttons (PopState)
  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const sector = params.get('sector');
      const prod = params.get('product');
      if (sector && sector in UNIVERSES) {
        setSelectedUniverseId(sector as UniverseId);
      } else {
        setSelectedUniverseId(null);
      }
      if (prod) {
        setSelectedProductId(prod as ProductId);
      } else {
        setSelectedProductId(null);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Keyboard navigation (ESC returns back step-by-step)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (selectedProductId) {
          handleCloseProduct();
        } else if (selectedUniverseId) {
          handleBackToOverview();
        } else {
          onReturnHome();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedProductId, selectedUniverseId, handleCloseProduct, handleBackToOverview, onReturnHome]);

  const activeUniverse: Universe | null = selectedUniverseId ? UNIVERSES[selectedUniverseId] : null;
  const activeProducts = selectedUniverseId ? getProductsByUniverse(selectedUniverseId) : [];

  // Helper icon renderer
  const renderUniverseIcon = (iconName: string, className = 'w-6 h-6') => {
    switch (iconName) {
      case 'Droplets':
        return <Droplets className={className} />;
      case 'Factory':
        return <Factory className={className} />;
      case 'Fish':
        return <Fish className={className} />;
      case 'Trees':
        return <Trees className={className} />;
      case 'Zap':
        return <Zap className={className} />;
      case 'FlaskConical':
        return <FlaskConical className={className} />;
      default:
        return <Compass className={className} />;
    }
  };

  // Adaptive Bilateral Layout for Child Solutions:
  // Distributes products in symmetrical Left and Right flanking columns anchored to the universe node.
  // Guarantees ZERO collision between labels, generous clearance with the universe node, and fits any screen.
  const getSolutionBilateralPosition = (idx: number, total: number, center: { x: number; y: number }) => {
    const totalLeft = Math.ceil(total / 2);
    const totalRight = Math.floor(total / 2);
    const isLeft = idx < totalLeft;

    // Symmetrical column offsets:
    // With card width of 264px (half-width = 132px):
    // colOffsetX = 295px provides 58px clearance from universe central node (w-[210px], half-width = 105px).
    const colOffsetX = 295;
    const pillHalfWidth = 132;

    // Harmonious vertical spacing adapting to item count per column:
    const maxItems = Math.max(totalLeft, totalRight);
    const stepY = maxItems <= 2 ? 70 : maxItems <= 4 ? 64 : maxItems <= 6 ? 56 : 52;

    if (isLeft) {
      const i = idx;
      const offsetY = (i - (totalLeft - 1) / 2) * stepY;
      return {
        x: center.x - colOffsetX,
        y: center.y + offsetY,
        isLeft: true,
        edgeX: center.x - colOffsetX + pillHalfWidth, // inner right edge of left pill
        edgeY: center.y + offsetY,
      };
    } else {
      const j = idx - totalLeft;
      const offsetY = (j - (totalRight - 1) / 2) * stepY;
      return {
        x: center.x + colOffsetX,
        y: center.y + offsetY,
        isLeft: false,
        edgeX: center.x + colOffsetX - pillHalfWidth, // inner left edge of right pill
        edgeY: center.y + offsetY,
      };
    }
  };

  // Dynamic Camera Zoom & Framing Computation:
  // Computes exact scale based on real container viewport to guarantee zero clipping of Saneamento, Bioflorestal, or solutions.
  const safeW = Math.max(320, viewportSize.width - 60);
  const safeH = Math.max(300, viewportSize.height - 60);

  let cameraTranslateX = 0;
  let cameraTranslateY = 0;
  let cameraScale = 1;

  if (!selectedUniverseId) {
    // Overview mode: Scene dimensions are approx 650px wide x 440px high
    const fitW = safeW / 680;
    const fitH = safeH / 470;
    cameraScale = Math.min(fitW, fitH, 1.12);
    cameraScale = Math.max(0.65, cameraScale);
    cameraTranslateX = 0;
    cameraTranslateY = 0;
  } else if (activeUniverse) {
    // Focused Universe mode: Symmetrical cluster is approx 860px wide x 400px high
    const fitW = safeW / 890;
    const fitH = safeH / 430;
    cameraScale = Math.min(fitW, fitH, 1.05);
    cameraScale = Math.max(0.65, cameraScale);
    // Center the camera directly on the active universe
    cameraTranslateX = -activeUniverse.coord.x;
    cameraTranslateY = -activeUniverse.coord.y;
  }

  return (
    <div className="relative w-full min-h-[calc(100vh-65px)] bg-black text-white flex flex-col justify-between overflow-hidden select-text">
      {/* Background Cyber Mesh */}
      <NetworkMeshBg />

      {/* Top Breadcrumb & Controls Bar */}
      <header className="relative z-30 w-full bg-black/85 backdrop-blur-md border-b border-zinc-900 px-4 sm:px-8 py-2.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          
          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm font-medium">
            <button
              onClick={onReturnHome}
              className="text-zinc-400 hover:text-white transition-colors flex items-center gap-1.5"
              title="Voltar à tela inicial"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#00DF00]" />
              <span className="hidden sm:inline">Início</span>
            </button>

            <span className="text-zinc-600">/</span>

            <button
              onClick={handleBackToOverview}
              className={`transition-colors flex items-center gap-1.5 ${
                !selectedUniverseId ? 'text-[#00DF00] font-bold' : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Portfólio de Universos</span>
            </button>

            {activeUniverse && (
              <>
                <span className="text-zinc-600">/</span>
                <span className="text-[#00DF00] font-bold flex items-center gap-1.5 truncate">
                  {renderUniverseIcon(activeUniverse.iconName, 'w-3.5 h-3.5')}
                  <span>{activeUniverse.name}</span>
                </span>
              </>
            )}

            {selectedProductId && (
              <>
                <span className="text-zinc-600">/</span>
                <span className="text-white font-semibold truncate">
                  {activeProducts.find((p) => p.product.id === selectedProductId)?.product.name}
                </span>
              </>
            )}
          </div>

          {/* Right Mode Controls */}
          <div className="flex items-center gap-2">
            {selectedUniverseId && (
              <button
                onClick={handleBackToOverview}
                className="px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 hover:text-white hover:border-[#00DF00]/60 transition-all flex items-center gap-1.5 shadow-sm"
                title="Voltar à visão geral dos 6 universos"
              >
                <Compass className="w-3.5 h-3.5 text-[#00DF00]" />
                <span className="hidden sm:inline">Visão Geral</span>
              </button>
            )}

            {/* Mobile View Toggle */}
            <div className="flex md:hidden bg-zinc-950 p-0.5 rounded-lg border border-zinc-800">
              <button
                onClick={() => setMobileTab('list')}
                className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-all ${
                  mobileTab === 'list' ? 'bg-[#00DF00] text-black font-bold' : 'text-zinc-400 hover:text-white'
                }`}
              >
                Lista
              </button>
              <button
                onClick={() => setMobileTab('map')}
                className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-all ${
                  mobileTab === 'map' ? 'bg-[#00DF00] text-black font-bold' : 'text-zinc-400 hover:text-white'
                }`}
              >
                Mapa
              </button>
            </div>
          </div>

        </div>
      </header>

      {/* Main Interactive Stage */}
      <main
        ref={containerRef}
        className="relative flex-1 w-full flex items-center justify-center overflow-hidden"
      >
        
        {/* MOBILE VIEW ALTERNATIVE (Optimized list presentation for 390x844 & 430x932) */}
        {mobileTab === 'list' && (
          <div className="md:hidden relative z-20 w-full h-full p-4 overflow-y-auto space-y-4">
            <div className="text-center pb-2">
              <h2 className="text-lg font-bold text-white font-heading">
                Universos de Atuação
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Selecione um setor para explorar os desafios e soluções WBM
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {(Object.keys(UNIVERSES) as UniverseId[]).map((uId) => {
                const u = UNIVERSES[uId];
                const count = getProductsByUniverse(uId).length;
                const isSelected = selectedUniverseId === uId;
                const sectorProducts = getProductsByUniverse(uId);

                return (
                  <div
                    key={uId}
                    className={`rounded-xl p-4 border transition-all ${
                      isSelected
                        ? 'bg-zinc-900 border-[#00DF00] shadow-[0_0_20px_rgba(0,223,0,0.25)]'
                        : 'bg-zinc-950/90 border-zinc-800 hover:border-zinc-700'
                    }`}
                  >
                    <div
                      onClick={() => handleSelectUniverse(uId)}
                      className="flex items-center justify-between cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#00DF00]/15 border border-[#00DF00]/50 flex items-center justify-center text-[#00DF00]">
                          {renderUniverseIcon(u.iconName, 'w-5 h-5')}
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-white font-heading">{u.name}</h3>
                          <p className="text-[11px] text-zinc-400">{u.tagline}</p>
                        </div>
                      </div>
                      <span className="text-xs font-mono text-[#00DF00] bg-black/60 px-2 py-0.5 rounded-full border border-zinc-800">
                        {count} soluções
                      </span>
                    </div>

                    {isSelected && (
                      <div className="mt-3 pt-3 border-t border-zinc-800/80 space-y-3">
                        <p className="text-xs text-zinc-300 leading-relaxed">{u.description}</p>
                        <div>
                          <span className="text-[10px] font-mono uppercase tracking-wider text-[#00DF00] block mb-2">
                            Soluções disponíveis ({count}):
                          </span>
                          <div className="grid grid-cols-1 gap-2">
                            {sectorProducts.map(({ product, context }) => (
                              <button
                                key={product.id}
                                onClick={() => {
                                  handleSelectProduct(product.id);
                                }}
                                className={`w-full p-2.5 rounded-lg text-left text-xs border transition-all flex items-center justify-between gap-2 ${
                                  selectedProductId === product.id
                                    ? 'bg-[#00DF00] text-black border-[#00DF00] font-bold shadow-[0_0_12px_rgba(0,223,0,0.4)]'
                                    : 'bg-black/90 border-zinc-800 text-zinc-200 hover:border-[#00DF00]/60'
                                }`}
                              >
                                <div>
                                  <div className="font-bold font-heading">{product.name}</div>
                                  <div className={`text-[10px] truncate font-medium ${selectedProductId === product.id ? 'text-black/85 font-semibold' : 'text-[#00DF00]'}`}>
                                    {context.shortLabelOverride || product.shortLabel}
                                  </div>
                                </div>
                                <ChevronRight className={`w-4 h-4 shrink-0 ${selectedProductId === product.id ? 'text-black' : 'text-[#00DF00]'}`} />
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* CINEMATIC CONTINUOUS SPATIAL CANVAS (Desktop & Tablet & Full Map View) */}
        <div
          className={`relative w-full h-full flex items-center justify-center ${
            mobileTab === 'list' ? 'hidden md:flex' : 'flex'
          }`}
        >
          {/* Spatial World Container with Smooth Dynamic Camera Pan and Zoom */}
          <div
            className="absolute select-none pointer-events-auto"
            style={{
              width: '1000px',
              height: '750px',
              left: 'calc(50% - 500px)',
              top: 'calc(50% - 375px)',
              transform: `scale(${cameraScale}) translate3d(${cameraTranslateX}px, ${cameraTranslateY}px, 0px)`,
              transformOrigin: 'center center',
              transition: prefersReducedMotion ? 'none' : 'transform 750ms cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            {/* SVG Vector Connections Layer */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none z-0"
              viewBox="-500 -375 1000 750"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <filter id="neonFilter" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* 1. Global Connections from Central Nucleus to 6 Universes (Visible ONLY in Macro Overview) */}
              {!selectedUniverseId && (
                <g className="transition-opacity duration-500">
                  {(Object.keys(UNIVERSES) as UniverseId[]).map((uId) => {
                    const u = UNIVERSES[uId];
                    return (
                      <g key={`conn-${uId}`}>
                        <line
                          x1="0"
                          y1="0"
                          x2={u.coord.x}
                          y2={u.coord.y}
                          stroke="#00DF00"
                          strokeWidth="1.2"
                          strokeOpacity="0.35"
                          strokeDasharray="4 3"
                        />

                        {/* Data particle (rendered in overview) */}
                        {!prefersReducedMotion && (
                          <circle r="2" fill="#00DF00">
                            <animateMotion
                              path={`M 0 0 L ${u.coord.x} ${u.coord.y}`}
                              dur="4s"
                              repeatCount="indefinite"
                            />
                          </circle>
                        )}
                      </g>
                    );
                  })}
                </g>
              )}

              {/* 2. Focused Universe: Smooth Bilateral Cybernetic Branching Lines to Solutions */}
              {selectedUniverseId && activeUniverse && (
                <g className="animate-fadeIn">
                  {activeProducts.map(({ product }, idx) => {
                    const total = activeProducts.length;
                    const pos = getSolutionBilateralPosition(idx, total, activeUniverse.coord);
                    const isSolSelected = selectedProductId === product.id;
                    const isHovered = hoveredProductId === product.id;
                    const isTargeted = isSolSelected || isHovered;
                    const isOtherHovered = Boolean(hoveredProductId && hoveredProductId !== product.id);

                    // Compute smooth curved bus from universe edge (half-width = 105px) to solution edge
                    const originX = pos.isLeft ? activeUniverse.coord.x - 105 : activeUniverse.coord.x + 105;
                    const originY = activeUniverse.coord.y;
                    const destX = pos.edgeX;
                    const destY = pos.edgeY;
                    const controlX1 = pos.isLeft ? originX - 30 : originX + 30;
                    const controlX2 = pos.isLeft ? destX + 30 : destX - 30;

                    const curvePath = `M ${originX} ${originY} C ${controlX1} ${originY}, ${controlX2} ${destY}, ${destX} ${destY}`;

                    // Dynamic stroke styling based on interaction state
                    let strokeWidth = '1.2';
                    let strokeOpacity = '0.35';
                    if (isSolSelected) {
                      strokeWidth = '2.5';
                      strokeOpacity = '0.95';
                    } else if (isHovered) {
                      strokeWidth = '2.2';
                      strokeOpacity = '0.9';
                    } else if (isOtherHovered) {
                      strokeWidth = '0.9';
                      strokeOpacity = '0.15';
                    }

                    return (
                      <g key={`link-${product.id}`} className="transition-all duration-300">
                        {/* Curved Data Bus */}
                        <path
                          d={curvePath}
                          stroke="#00DF00"
                          strokeWidth={strokeWidth}
                          strokeOpacity={strokeOpacity}
                          fill="none"
                          filter={isTargeted ? 'url(#neonFilter)' : undefined}
                          className="transition-all duration-300"
                        />

                        {/* Origin Anchor Port (at Universe edge) */}
                        <circle
                          cx={originX}
                          cy={originY}
                          r={isTargeted ? 3 : 1.5}
                          fill="#00DF00"
                          fillOpacity={isTargeted ? 0.9 : isOtherHovered ? 0.15 : 0.35}
                          className="transition-all duration-300"
                        />

                        {/* Terminal Anchor Port (at Solution Card edge) */}
                        <circle
                          cx={destX}
                          cy={destY}
                          r={isTargeted ? 3.5 : 2}
                          fill="#00DF00"
                          fillOpacity={isTargeted ? 1 : isOtherHovered ? 0.15 : 0.45}
                          filter={isTargeted ? 'url(#neonFilter)' : undefined}
                          className="transition-all duration-300"
                        />

                        {/* Luminous Data Pulse travelling along curve */}
                        {!prefersReducedMotion && (
                          <>
                            {isTargeted ? (
                              <g>
                                {/* Quick energetic pulse circle on targeted / hovered connection */}
                                <circle r={isHovered ? '2.8' : '2.4'} fill="#00FF00" filter="url(#neonFilter)">
                                  <animateMotion
                                    path={curvePath}
                                    dur={isHovered ? '1.1s' : '1.5s'}
                                    repeatCount="indefinite"
                                  />
                                </circle>
                                {/* Soft glow aura halo */}
                                <circle r="4.5" fill="#00DF00" opacity="0.35" filter="url(#neonFilter)">
                                  <animateMotion
                                    path={curvePath}
                                    dur={isHovered ? '1.1s' : '1.5s'}
                                    repeatCount="indefinite"
                                  />
                                </circle>
                              </g>
                            ) : !isOtherHovered ? (
                              /* Gentle ambient pulse when idle */
                              <circle r="1.6" fill="#00DF00" opacity="0.4">
                                <animateMotion
                                  path={curvePath}
                                  dur="3.2s"
                                  repeatCount="indefinite"
                                />
                              </circle>
                            ) : null}
                          </>
                        )}
                      </g>
                    );
                  })}
                </g>
              )}
            </svg>

            {/* CENTRAL HUB: WBM TECHNOLOGY NUCLEUS (Coordinates 0, 0) */}
            <div
              onClick={handleBackToOverview}
              style={{
                left: '500px',
                top: '375px',
              }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center justify-center transition-all duration-500 ${
                selectedUniverseId
                  ? 'opacity-0 pointer-events-none scale-50 invisible'
                  : 'opacity-100 scale-100 cursor-pointer'
              }`}
            >
              <div className="absolute w-40 h-40 rounded-full bg-[#00DF00]/10 blur-xl pointer-events-none animate-pulse-subtle" />
              <div className="relative w-28 h-28 rounded-3xl bg-gradient-to-b from-zinc-900 via-zinc-950 to-black border-2 border-[#00DF00] flex flex-col items-center justify-center p-3 shadow-[0_0_35px_rgba(0,223,0,0.4)] hover:shadow-[0_0_45px_rgba(0,223,0,0.65)] hover:border-[#00ff00] transition-all duration-300">
                <img
                  src="/assets/wbm-logo-clean.png"
                  alt="WBM Technology"
                  className="w-20 h-auto object-contain drop-shadow-[0_0_12px_rgba(0,223,0,0.5)]"
                />
                <span className="text-[9px] font-mono tracking-widest text-[#00DF00] uppercase mt-1">
                  NÚCLEO IoT
                </span>
              </div>
            </div>

            {/* THE 6 UNIVERSES OF MARKET */}
            {(Object.keys(UNIVERSES) as UniverseId[]).map((uId) => {
              const u = UNIVERSES[uId];
              const isSelected = selectedUniverseId === uId;
              const isDimmed = selectedUniverseId !== null && !isSelected;
              const count = getProductsByUniverse(uId).length;

              return (
                <div
                  key={uId}
                  onClick={() => handleSelectUniverse(uId)}
                  style={{
                    left: `${500 + u.coord.x}px`,
                    top: `${375 + u.coord.y}px`,
                  }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-500 ${
                    isDimmed
                      ? 'opacity-0 pointer-events-none scale-50 invisible'
                      : isSelected
                      ? 'opacity-100 scale-105 z-30'
                      : 'opacity-100 hover:scale-105 z-20 cursor-pointer'
                  }`}
                >
                  <div className="group relative flex flex-col items-center">
                    {/* Glowing outer halo */}
                    <div
                      className={`absolute -inset-2 rounded-2xl transition-all duration-300 pointer-events-none ${
                        isSelected
                          ? 'bg-[#00DF00]/25 blur-md'
                          : 'group-hover:bg-[#00DF00]/15 group-hover:blur-sm'
                      }`}
                    />

                    {/* Universe Node Card */}
                    <div
                      className={`relative flex items-center gap-3 px-3.5 py-2.5 rounded-2xl backdrop-blur-md border transition-all duration-300 shadow-xl w-[210px] min-w-[210px] ${
                        isSelected
                          ? 'bg-zinc-900 border-[#00DF00] shadow-[0_0_30px_rgba(0,223,0,0.5)]'
                          : 'bg-zinc-950/95 border-zinc-800 group-hover:border-[#00DF00]/70'
                      }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-300 ${
                          isSelected
                            ? 'bg-[#00DF00] text-black shadow-[0_0_15px_rgba(0,223,0,0.6)]'
                            : 'bg-[#00DF00]/15 text-[#00DF00] border border-[#00DF00]/40 group-hover:scale-110'
                        }`}
                      >
                        {renderUniverseIcon(u.iconName, 'w-5 h-5')}
                      </div>

                      <div className="text-left flex-1 min-w-0">
                        <h3 className="text-xs sm:text-sm font-extrabold text-white font-heading tracking-wide leading-tight line-clamp-2">
                          {u.name}
                        </h3>
                        <p className="text-[10px] text-zinc-400 font-mono mt-0.5">
                          {count} {count === 1 ? 'Solução' : 'Soluções'}
                        </p>
                      </div>

                      <ChevronRight
                        className={`w-4 h-4 text-[#00DF00] shrink-0 transition-transform duration-300 ${
                          isSelected ? 'rotate-90' : 'group-hover:translate-x-0.5'
                        }`}
                      />
                    </div>
                  </div>
                </div>
              );
            })}

            {/* ADAPTIVE NON-OVERLAPPING CHILD SOLUTION NODES (Bilateral Wings) */}
            {selectedUniverseId && activeUniverse && (
              <div className="animate-fadeIn">
                {activeProducts.map(({ product, context }, idx) => {
                  const total = activeProducts.length;
                  const pos = getSolutionBilateralPosition(idx, total, activeUniverse.coord);
                  const isSolSelected = selectedProductId === product.id;
                  const isHovered = hoveredProductId === product.id;
                  const isOtherHovered = Boolean(hoveredProductId && hoveredProductId !== product.id);

                  return (
                    <div
                      key={`sol-node-${product.id}`}
                      style={{
                        left: `${500 + pos.x}px`,
                        top: `${375 + pos.y}px`,
                      }}
                      tabIndex={0}
                      role="button"
                      aria-label={`Solução ${product.name}: ${context.shortLabelOverride || product.shortLabel}`}
                      onMouseEnter={() => setHoveredProductId(product.id)}
                      onMouseLeave={() => setHoveredProductId(null)}
                      onFocus={() => setHoveredProductId(product.id)}
                      onBlur={() => setHoveredProductId(null)}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectProduct(product.id);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handleSelectProduct(product.id);
                        }
                      }}
                      className="absolute -translate-x-1/2 -translate-y-1/2 z-30 cursor-pointer group outline-none"
                    >
                      <div
                        className={`relative flex items-center justify-between gap-2 px-3 py-1.5 rounded-xl border backdrop-blur-md transition-all duration-300 shadow-md w-[264px] min-w-[264px] ${
                          isSolSelected
                            ? 'bg-[#00DF00] text-black border-[#00DF00] shadow-[0_0_22px_rgba(0,223,0,0.65)] scale-105'
                            : isHovered
                            ? 'bg-zinc-900/95 text-white border-[#00DF00] shadow-[0_0_16px_rgba(0,223,0,0.35)] scale-102 ring-1 ring-[#00DF00]/50'
                            : isOtherHovered
                            ? 'bg-zinc-950/85 border-zinc-800/60 text-zinc-400 opacity-65 scale-98'
                            : 'bg-zinc-950/95 border-zinc-700/80 text-zinc-200 hover:border-[#00DF00] hover:text-white hover:scale-102 hover:shadow-[0_0_12px_rgba(0,223,0,0.25)]'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <div
                            className={`w-1.5 h-1.5 rounded-full shrink-0 transition-all duration-300 ${
                              isSolSelected
                                ? 'bg-black shadow-[0_0_6px_#000000]'
                                : isHovered
                                ? 'bg-[#00DF00] shadow-[0_0_8px_#00FF00] scale-125'
                                : 'bg-[#00DF00]/70 shadow-[0_0_4px_#00DF00]'
                            }`}
                          />
                          <div className="min-w-0 flex-1 text-left">
                            <span
                              className={`text-xs font-bold tracking-tight block truncate font-heading transition-colors ${
                                isSolSelected
                                  ? 'text-black'
                                  : isHovered
                                  ? 'text-white'
                                  : 'text-zinc-200'
                              }`}
                            >
                              {product.name}
                            </span>
                            <span
                              className={`text-[10px] block truncate font-medium tracking-tight transition-colors ${
                                isSolSelected
                                  ? 'text-black/85 font-semibold'
                                  : isHovered
                                  ? 'text-[#00DF00] font-semibold'
                                  : 'text-[#00DF00]/90'
                              }`}
                            >
                              {context.shortLabelOverride || product.shortLabel}
                            </span>
                          </div>
                        </div>

                        <ChevronRight
                          className={`w-3 h-3 shrink-0 transition-all duration-300 ${
                            isSolSelected
                              ? 'text-black opacity-90'
                              : isHovered
                              ? 'text-[#00DF00] opacity-100 translate-x-0.5'
                              : 'text-[#00DF00] opacity-50 group-hover:opacity-100'
                          }`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

          </div>
        </div>

      </main>

      {/* Bottom Informational Bar / Selected Solution Context */}
      <footer className="relative z-30 w-full bg-black/90 backdrop-blur-md border-t border-zinc-900 px-4 sm:px-8 py-2.5 select-text">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2.5 text-xs">
          
          {/* Status and Active Context Summary */}
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 font-mono">
              <span className="w-2 h-2 rounded-full bg-[#00DF00] animate-pulse" />
              {activeUniverse ? activeUniverse.name.toUpperCase() : 'MAPA DE UNIVERSOS'}
            </span>

            <p className="text-zinc-400 hidden sm:inline truncate max-w-xl">
              {activeUniverse
                ? activeUniverse.description
                : 'Selecione um universo para explorar os desafios operacionais e as soluções WBM'}
            </p>
          </div>

          {/* Solution Count & Guidance */}
          <div className="flex items-center gap-4 text-zinc-400">
            {selectedUniverseId ? (
              <span>
                {activeProducts.length} soluções mapeadas para {activeUniverse?.name}
              </span>
            ) : (
              <span>6 universos de mercado disponíveis</span>
            )}

            {selectedUniverseId && (
              <button
                onClick={handleBackToOverview}
                className="text-[#00DF00] hover:underline font-medium"
              >
                Voltar ao mapa geral
              </button>
            )}
          </div>

        </div>
      </footer>

      {/* Solution Commercial & Technical Detail Panel Drawer */}
      {selectedProductId && selectedUniverseId && (
        <SolutionDetailPanel
          productId={selectedProductId}
          universeId={selectedUniverseId}
          onClose={handleCloseProduct}
          onSelectOtherUniverse={(newUniverseId) => {
            handleSelectUniverse(newUniverseId);
          }}
          onSelectProduct={handleSelectProduct}
        />
      )}
    </div>
  );
};
