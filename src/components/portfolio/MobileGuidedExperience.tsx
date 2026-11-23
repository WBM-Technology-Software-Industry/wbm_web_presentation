import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Product,
  ProductUniverseContext,
  ProductId,
} from '../../data/portfolioData';
import {
  Factory,
  ChevronLeft,
  ChevronRight,
  Compass,
  ArrowRight,
  ArrowLeft,
  Sliders,
  Gauge,
  Cpu,
  Sparkles,
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface MobileGuidedExperienceProps {
  products: { product: Product; context: ProductUniverseContext }[];
  activeProductId: ProductId | null;
  onSelectProduct: (productId: ProductId) => void;
  onOpenProductDetail: (productId: ProductId) => void;
  onSwitchToOrbitalMap: () => void;
  onBackToOverview: () => void;
}

export const MobileGuidedExperience: React.FC<MobileGuidedExperienceProps> = ({
  products,
  activeProductId,
  onSelectProduct,
  onOpenProductDetail,
  onSwitchToOrbitalMap,
  onBackToOverview,
}) => {
  const { isDark } = useTheme();
  // Active product index (default to the provided activeProductId or 0)
  const initialIndex = Math.max(
    0,
    products.findIndex((p) => p.product.id === activeProductId)
  );
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [slideDirection, setSlideDirection] = useState<'left' | 'right' | null>(null);

  // Microanimation of discovery: slight nudge to the left on first mount
  const hasNudgedRef = useRef(false);
  const [nudgeOffset, setNudgeOffset] = useState(0);

  // Synchronize when external activeProductId changes (e.g. from drawer, popstate, or orbital mode)
  useEffect(() => {
    if (!activeProductId) return;
    const idx = products.findIndex((p) => p.product.id === activeProductId);
    if (idx !== -1) {
      setCurrentIndex((prev) => (prev !== idx ? idx : prev));
    }
  }, [activeProductId, products]);

  // Touch swipe gesture handling
  const touchStartXRef = useRef(0);
  const touchStartYRef = useRef(0);
  const touchDeltaXRef = useRef(0);
  const isSwipingRef = useRef(false);
  const [dragOffset, setDragOffset] = useState(0);

  // Discovery Microanimation: nudges 22px to the left to reveal next card peek, then returns
  useEffect(() => {
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (hasNudgedRef.current || prefersReduced) return;

    const timer = setTimeout(() => {
      if (hasNudgedRef.current || isSwipingRef.current) return;
      hasNudgedRef.current = true;
      setNudgeOffset(-22);
      setTimeout(() => {
        setNudgeOffset(0);
      }, 420);
    }, 650);

    return () => clearTimeout(timer);
  }, []);

  const activeItem = products[currentIndex] || products[0];
  const { product, context } = activeItem;

  // Next and Previous products (cyclical)
  const nextIndex = (currentIndex + 1) % products.length;
  const prevIndex = (currentIndex - 1 + products.length) % products.length;
  const nextItem = products[nextIndex] || products[0];
  const prevItem = products[prevIndex] || products[0];

  // Safe navigation between products with cyclical progression
  const goToIndex = useCallback(
    (nextIdx: number, direction: 'left' | 'right') => {
      if (isTransitioning) return;
      setIsTransitioning(true);
      setSlideDirection(direction);
      hasNudgedRef.current = true;
      setNudgeOffset(0);

      const targetIdx = (nextIdx + products.length) % products.length;
      setCurrentIndex(targetIdx);
      onSelectProduct(products[targetIdx].product.id);

      setTimeout(() => {
        setIsTransitioning(false);
        setSlideDirection(null);
        setDragOffset(0);
      }, 300);
    },
    [isTransitioning, products, onSelectProduct]
  );

  const handleNext = useCallback(() => {
    goToIndex(currentIndex + 1, 'left');
  }, [goToIndex, currentIndex]);

  const handlePrev = useCallback(() => {
    goToIndex(currentIndex - 1, 'right');
  }, [goToIndex, currentIndex]);

  // Keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'Enter' || e.key === ' ') {
        onOpenProductDetail(product.id);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev, onOpenProductDetail, product.id]);

  // Touch Swipe Handlers for Hero Card
  const handleTouchStart = (e: React.TouchEvent) => {
    hasNudgedRef.current = true;
    setNudgeOffset(0);
    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
    touchDeltaXRef.current = 0;
    isSwipingRef.current = true;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isSwipingRef.current) return;
    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const deltaX = currentX - touchStartXRef.current;
    const deltaY = currentY - touchStartYRef.current;

    // If gesture is predominantly horizontal, track drag with elastic resistance
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      touchDeltaXRef.current = deltaX;
      setDragOffset(deltaX * 0.45);
    }
  };

  const handleTouchEnd = () => {
    if (!isSwipingRef.current) return;
    isSwipingRef.current = false;
    const deltaX = touchDeltaXRef.current;

    if (deltaX < -38) {
      // Swiped Left -> Advance to next
      handleNext();
    } else if (deltaX > 38) {
      // Swiped Right -> Return to prev
      handlePrev();
    } else {
      // Snap back if swipe threshold not met
      setDragOffset(0);
    }
  };

  const handleCardClick = () => {
    if (Math.abs(touchDeltaXRef.current) > 10) return;
    onOpenProductDetail(product.id);
  };

  // Helper icon for technology type
  const getProductCategoryIcon = (category: string) => {
    if (category.toLowerCase().includes('controle') || category.toLowerCase().includes('automação')) {
      return <Sliders className="w-3.5 h-3.5 text-[#00DF00]" />;
    }
    if (category.toLowerCase().includes('instrumentação') || category.toLowerCase().includes('monitoramento')) {
      return <Gauge className="w-3.5 h-3.5 text-[#00DF00]" />;
    }
    return <Cpu className="w-3.5 h-3.5 text-[#00DF00]" />;
  };

  // SVG Constellation Geometry for the 13 nodes (viewBox 0 0 390 115)
  // The main card occupies 0 to 344px (88% of width), and the peek tab occupies 344 to 390px
  const cardWidthCoord = 344;
  const coreX = 172;
  const coreY = 18;

  const nodePositions = products.map((_, i) => {
    const total = products.length; // 13
    const t = i / (total - 1); // 0 to 1
    // Graceful curved arch spanning across width (22px to 322px, aligned directly above the main card)
    const x = 22 + t * 300;
    // Parabolic arch:
    const y = 60 + Math.sin(t * Math.PI) * 16;
    return { x, y };
  });

  const activePos = nodePositions[currentIndex] || { x: 172, y: 76 };

  // Calculate percentage of activePos relative to card width for perfect vertical alignment
  const rawPct = (activePos.x / cardWidthCoord) * 100;
  // Clamped between 6% and 94% so docking pin always rests securely on the card's top edge
  const dockingLeftPct = Math.max(6, Math.min(94, rawPct));

  return (
    <section
      aria-label="Experiência Guiada do Universo Indústria"
      className={`relative flex-1 w-full overflow-hidden flex flex-col justify-between select-none px-2.5 sm:px-3 pt-1.5 pb-2 transition-colors duration-300 ${isDark ? 'bg-[#0B1115] text-[#F5FAF7]' : 'bg-[#E6EFEB] text-[#172C22]'
        }`}
    >
      {/* Ambient Cyber Background Glow */}
      <div
        className={`absolute top-0 left-1/2 -translate-x-1/2 w-[340px] h-[220px] pointer-events-none transition-opacity duration-300 ${isDark
          ? 'bg-[radial-gradient(circle_at_center,rgba(0,223,0,0.12)_0%,transparent_75%)] opacity-80'
          : 'bg-[radial-gradient(circle_at_center,rgba(8,124,59,0.08)_0%,transparent_75%)] opacity-70'
          }`}
      />

      {/* 1. TOP BAR: UNIVERSE IDENTITY & ORBITAL MAP TOGGLE */}
      <div className="relative z-20 flex items-center justify-between gap-2 shrink-0 max-w-md mx-auto w-full px-1">
        {/* Left: Sector Identity Badge */}
        <button
          onClick={onBackToOverview}
          className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 shadow-md transition-all active:scale-95 text-left group border ${isDark
            ? 'bg-[#131F24]/90 hover:bg-[#19282E] border-[#2A423A] hover:border-[#00DF00]/60 text-white'
            : 'bg-white hover:bg-zinc-50 border-[#B8D1C3] hover:border-[#087C3B]/60 text-[#172C22]'
            }`}
          title="Retornar à visão geral dos 6 setores"
          aria-label="Voltar aos setores"
        >
          <ArrowLeft className={`w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform shrink-0 ${isDark ? 'text-[#00DF00]' : 'text-[#087C3B]'}`} />
          <span className={`text-xs font-black tracking-wider font-heading uppercase ${isDark ? 'text-white' : 'text-[#172C22]'}`}>
            INDÚSTRIA
          </span>
          <span className={isDark ? 'text-zinc-600' : 'text-zinc-400'}>|</span>
          <span className={`text-[10px] font-mono ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
            {products.length} soluções
          </span>
        </button>

        {/* Right: Switch to Free Orbital Map Mode */}
        <button
          onClick={onSwitchToOrbitalMap}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-medium transition-all active:scale-95 shadow-sm group ${isDark
            ? 'bg-[#131F24]/90 hover:bg-[#19282E] border-[#2A423A] hover:border-[#00DF00]/60 text-zinc-300 hover:text-white'
            : 'bg-white hover:bg-zinc-50 border-[#B8D1C3] hover:border-[#087C3B]/60 text-[#172C22]'
            }`}
          title="Alternar para o mapa orbital livre com zoom e arraste"
          aria-label="Abrir mapa orbital livre"
        >
          <Compass className={`w-3.5 h-3.5 group-hover:rotate-45 transition-transform duration-300 ${isDark ? 'text-[#00DF00]' : 'text-[#087C3B]'}`} />
          <span>Explorar mapa</span>
        </button>
      </div>

      {/* 2. DYNAMIC NETWORK CONSTELLATION STAGE (SVG Core + 13 Nodes + Active Conduit) */}
      <div className="relative z-10 w-full max-w-md mx-auto h-[115px] shrink-0 my-0.5">
        <svg
          viewBox="0 0 390 115"
          className="w-full h-full overflow-visible"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <filter id="guidedGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation={isDark ? "3" : "1.5"} result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <linearGradient id="activeBeamGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={isDark ? "#00DF00" : "#087C3B"} stopOpacity="0.85" />
              <stop offset="60%" stopColor={isDark ? "#00FF00" : "#0A9446"} stopOpacity="1" />
              <stop offset="100%" stopColor={isDark ? "#00DF00" : "#087C3B"} stopOpacity="0.9" />
            </linearGradient>
            <linearGradient id="inactiveLineGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={isDark ? "#00DF00" : "#087C3B"} stopOpacity={isDark ? "0.38" : "0.32"} />
              <stop offset="100%" stopColor={isDark ? "#00DF00" : "#087C3B"} stopOpacity={isDark ? "0.18" : "0.14"} />
            </linearGradient>
          </defs>

          {/* Inactive Connection Beams from Core to all Satellite Nodes (Distinct & Visible) */}
          {nodePositions.map((pos, i) => {
            if (i === currentIndex) return null;
            return (
              <line
                key={`inactive-line-${i}`}
                x1={coreX}
                y1={coreY + 12}
                x2={pos.x}
                y2={pos.y}
                stroke="url(#inactiveLineGrad)"
                strokeWidth="1.2"
                strokeDasharray="2.5 3"
              />
            );
          })}

          {/* Active Glowing Connection Beam targeting current solution */}
          <path
            d={`M ${coreX} ${coreY + 14} Q ${(coreX + activePos.x) / 2} ${(coreY + activePos.y) / 2 - 6} ${activePos.x} ${activePos.y}`}
            stroke="url(#activeBeamGrad)"
            strokeWidth="2.8"
            filter="url(#guidedGlow)"
            className="transition-all duration-300"
          />

          {/* Animated traveling data pulse along the active beam from Core to Node */}
          <circle r="3.2" fill="#FFFFFF" filter="url(#guidedGlow)">
            <animateMotion
              path={`M ${coreX} ${coreY + 14} Q ${(coreX + activePos.x) / 2} ${(coreY + activePos.y) / 2 - 6} ${activePos.x} ${activePos.y}`}
              dur="1.4s"
              repeatCount="indefinite"
            />
          </circle>

          {/* Active downward energy beam from Node to the Hero Card docking point */}
          <path
            d={`M ${activePos.x} ${activePos.y + 7} L ${activePos.x} 115`}
            stroke="url(#activeBeamGrad)"
            strokeWidth="2.4"
            filter="url(#guidedGlow)"
            className="transition-all duration-300"
          />

          {/* Animated data pulse flowing down into the card */}
          <circle r="2.8" fill="#00FF00" filter="url(#guidedGlow)">
            <animateMotion
              path={`M ${activePos.x} ${activePos.y + 7} L ${activePos.x} 115`}
              dur="0.8s"
              repeatCount="indefinite"
            />
          </circle>

          {/* Secondary Satellite Nodes */}
          {nodePositions.map((pos, i) => {
            const isCurrent = i === currentIndex;
            const pName = products[i].product.name;
            const accentCol = isDark ? '#00DF00' : '#087C3B';
            const accentActiveCol = isDark ? '#00FF00' : '#0A9446';
            return (
              <g
                key={`satellite-${i}`}
                className="cursor-pointer group"
                onClick={() => goToIndex(i, i > currentIndex ? 'left' : 'right')}
              >
                <title>{pName}</title>
                {/* Hitbox target */}
                <circle cx={pos.x} cy={pos.y} r="14" fill="transparent" />

                {isCurrent ? (
                  <>
                    {/* Active Satellite Node: Halo + Glowing Center */}
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r="10.5"
                      fill={accentCol}
                      fillOpacity="0.3"
                      filter="url(#guidedGlow)"
                    />
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r="6"
                      fill={accentActiveCol}
                      stroke="#FFFFFF"
                      strokeWidth="1.8"
                      className="drop-shadow-[0_0_8px_rgba(0,223,0,0.6)]"
                    />
                    <circle cx={pos.x} cy={pos.y} r="2" fill={isDark ? "#000000" : "#FFFFFF"} />
                  </>
                ) : (
                  <>
                    {/* Inactive Satellite Node (Visible Cyber Dot) */}
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r="4.5"
                      fill={isDark ? "#18181b" : "#E2EBE5"}
                      stroke={accentCol}
                      strokeOpacity={isDark ? "0.65" : "0.5"}
                      strokeWidth="1.2"
                      className="group-hover:scale-125 transition-transform"
                    />
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r="1.8"
                      fill={accentCol}
                      fillOpacity={isDark ? "0.8" : "0.7"}
                    />
                  </>
                )}
              </g>
            );
          })}

          {/* Central Indústria Nucleus Node */}
          <g transform={`translate(${coreX}, ${coreY})`} className="cursor-default">
            {/* Outer soft glow */}
            <circle
              r="22"
              fill={isDark ? "#00DF00" : "#087C3B"}
              fillOpacity={isDark ? "0.16" : "0.12"}
              filter="url(#guidedGlow)"
            />
            {/* Core Badge */}
            <rect
              x="-28"
              y="-13"
              width="56"
              height="26"
              rx="13"
              fill={isDark ? "#09090b" : "#FFFFFF"}
              stroke={isDark ? "#00DF00" : "#087C3B"}
              strokeWidth="1.6"
              className={isDark ? "drop-shadow-[0_0_12px_rgba(0,223,0,0.5)]" : "drop-shadow-md"}
            />
            {/* Icon + Label */}
            <g transform="translate(-19, -6)">
              <Factory className={`w-3 h-3 ${isDark ? 'text-[#00DF00]' : 'text-[#087C3B]'}`} />
            </g>
            <text
              x="5"
              y="4"
              fill={isDark ? "#FFFFFF" : "#172C22"}
              fontSize="8.5"
              fontWeight="bold"
              fontFamily="sans-serif"
              letterSpacing="0.8"
              textAnchor="middle"
            >
              INDÚSTRIA
            </text>
          </g>
        </svg>
      </div>

      {/* 3. HERO PROTAGONIST CARD WITH LATERAL NEXT-PRODUCT PEEK TAB */}
      <div className="relative z-20 flex-1 flex flex-col justify-center max-w-md mx-auto w-full px-1">
        <div className="relative flex items-stretch gap-2 w-full">
          {/* Main Protagonist Card */}
          <div
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onClick={handleCardClick}
            tabIndex={0}
            role="button"
            aria-label={`Solução em destaque: ${product.name}. ${context.shortLabelOverride || product.shortLabel}. Toque para abrir detalhes comerciais e técnicos.`}
            style={{
              transform: `translateX(${dragOffset + nudgeOffset}px)`,
              transition: isSwipingRef.current
                ? 'none'
                : 'transform 280ms cubic-bezier(0.16, 1, 0.3, 1)',
            }}
            className={`group relative flex-1 rounded-2xl p-4 sm:p-5 transition-all cursor-pointer outline-none active:scale-[0.99] border ${isDark
              ? 'bg-gradient-to-b from-[#131F24] via-[#19282E] to-[#0B1115] border-[#2A423A] hover:border-[#00DF00] shadow-[0_0_30px_rgba(0,223,0,0.18)] hover:shadow-[0_0_40px_rgba(0,223,0,0.3)]'
              : 'bg-white border-[#B8D1C3] hover:border-[#087C3B] shadow-lg shadow-emerald-950/5 hover:shadow-xl'
              } ${isTransitioning
                ? slideDirection === 'left'
                  ? 'opacity-85 translate-x-1.5'
                  : 'opacity-85 -translate-x-1.5'
                : 'opacity-100 translate-x-0'
              }`}
          >
            {/* Integrated Optical Receptor Docking Pin on Top Border */}
            <div
              data-testid="docking-pin"
              style={{
                left: `${dockingLeftPct}%`,
                transition: isSwipingRef.current
                  ? 'none'
                  : 'left 300ms cubic-bezier(0.16, 1, 0.3, 1)',
              }}
              className="absolute -top-2.5 -translate-x-1/2 flex flex-col items-center pointer-events-none z-30"
            >
              {/* Luminous Core Pip */}
              <div
                className={`w-4 h-4 rounded-full border-2 border-white flex items-center justify-center ${isDark
                  ? 'bg-[#00FF00] shadow-[0_0_12px_#00DF00]'
                  : 'bg-[#087C3B] shadow-[0_0_10px_rgba(8,124,59,0.4)]'
                  }`}
              >
                <div className={`w-1.5 h-1.5 rounded-full ${isDark ? 'bg-black' : 'bg-white'}`} />
              </div>
              {/* Pulse Halo */}
              <div className={`absolute -inset-1 rounded-full animate-ping ${isDark ? 'bg-[#00DF00]/40' : 'bg-[#087C3B]/30'}`} />
              {/* Micro Beam Segment into Card */}
              <div
                className={`w-[2px] h-3.5 shadow-sm ${isDark
                  ? 'bg-gradient-to-b from-[#00FF00] to-transparent shadow-[0_0_6px_#00DF00]'
                  : 'bg-gradient-to-b from-[#087C3B] to-transparent shadow-[0_0_6px_rgba(8,124,59,0.5)]'
                  }`}
              />
            </div>

            {/* Top Info Row: Category & Counter */}
            <div className="flex items-center justify-between gap-2 mb-2">
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold uppercase tracking-wider border ${isDark
                  ? 'bg-[#00DF00]/10 border-[#00DF00]/30 text-[#00DF00]'
                  : 'bg-[#087C3B]/10 border-[#087C3B]/30 text-[#087C3B]'
                  }`}
              >
                {getProductCategoryIcon(product.category)}
                <span>{product.category}</span>
              </span>

              <span
                className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-md border ${isDark
                  ? 'text-zinc-400 bg-zinc-900/80 border-zinc-800'
                  : 'text-zinc-600 bg-zinc-100 border-zinc-200'
                  }`}
              >
                <span className={isDark ? 'text-[#00DF00]' : 'text-[#087C3B]'}>
                  {String(currentIndex + 1).padStart(2, '0')}
                </span>{' '}
                / {products.length}
              </span>
            </div>

            {/* Solution Name */}
            <h2
              className={`text-xl sm:text-2xl font-black font-heading tracking-tight leading-tight transition-colors ${isDark ? 'text-white group-hover:text-[#00DF00]' : 'text-[#172C22] group-hover:text-[#087C3B]'
                }`}
            >
              {product.name}
            </h2>

            {/* Commercial Short Headline */}
            <p
              className={`text-sm font-semibold mt-1 font-sans flex items-center gap-1.5 ${isDark ? 'text-[#00DF00]' : 'text-[#087C3B]'
                }`}
            >
              <Sparkles className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{context.shortLabelOverride || product.shortLabel}</span>
            </p>

            {/* Commercial Challenge / Problem Resolution Description */}
            <div
              className={`mt-2.5 p-2.5 rounded-xl border ${isDark
                ? 'bg-[#0B1115]/80 border-[#2A423A]'
                : 'bg-zinc-50 border-[#B8D1C3]'
                }`}
            >
              <div
                className={`text-[10px] font-mono uppercase tracking-wider mb-0.5 flex items-center gap-1 ${isDark ? 'text-zinc-400' : 'text-zinc-600'
                  }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${isDark ? 'bg-[#00DF00]' : 'bg-[#087C3B]'}`} />
                <span>Desafio Operacional</span>
              </div>
              <p className={`text-xs leading-snug line-clamp-2 ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>
                {context.challenge}
              </p>
            </div>

            {/* Bottom Action Footer with CTA */}
            <div
              className={`mt-3.5 pt-2.5 border-t flex items-center justify-between text-xs ${isDark ? 'border-[#2A423A] text-zinc-300' : 'border-[#B8D1C3] text-zinc-700'
                }`}
            >
              <span
                className={`inline-flex items-center gap-1.5 font-bold group-hover:underline ${isDark ? 'text-[#00DF00]' : 'text-[#087C3B]'
                  }`}
              >
                <span>Conhecer tecnologia</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </span>

              <span className={`text-[10px] font-mono ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
                Toque para detalhes
              </span>
            </div>
          </div>

          {/* Next Card Lateral Preview Tab (Peek Next Card) */}
          <button
            onClick={handleNext}
            aria-label={`Ver próxima tecnologia: ${nextItem.product.name}`}
            title={`Próxima solução: ${nextItem.product.name}`}
            className={`group/peek relative w-9 sm:w-10 rounded-2xl border flex flex-col items-center justify-between py-3 transition-all shrink-0 active:scale-95 overflow-hidden ${isDark
              ? 'bg-gradient-to-b from-zinc-900/80 via-zinc-950/90 to-black/90 border-zinc-800/90 hover:border-[#00DF00]/60 shadow-[0_0_20px_rgba(0,0,0,0.8)]'
              : 'bg-white border-[#B8D1C3] hover:border-[#087C3B]/60 shadow-sm'
              }`}
          >
            {/* Subtle neon glowing accent on left edge */}
            <div
              className={`absolute left-0 top-0 bottom-0 w-[2px] transition-colors ${isDark
                ? 'bg-[#00DF00]/35 group-hover/peek:bg-[#00DF00]'
                : 'bg-[#087C3B]/35 group-hover/peek:bg-[#087C3B]'
                }`}
            />

            {/* Top Indicator */}
            <div className="flex flex-col items-center gap-1">
              <span
                className={`w-1.5 h-1.5 rounded-full transition-all ${isDark
                  ? 'bg-[#00DF00]/70 group-hover/peek:bg-[#00DF00] group-hover/peek:scale-125'
                  : 'bg-[#087C3B]/70 group-hover/peek:bg-[#087C3B] group-hover/peek:scale-125'
                  }`}
              />
              <span className={`text-[8px] font-mono uppercase tracking-tighter ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
                PRÓX
              </span>
            </div>

            {/* Vertical rotated text of next product name */}
            <div className="flex-1 flex items-center justify-center my-2 [writing-mode:vertical-rl] rotate-180">
              <span
                className={`text-[11px] font-bold font-heading transition-colors tracking-tight line-clamp-1 max-h-[140px] truncate ${isDark
                  ? 'text-zinc-400 group-hover/peek:text-[#00DF00]'
                  : 'text-zinc-600 group-hover/peek:text-[#087C3B]'
                  }`}
              >
                {nextItem.product.name}
              </span>
            </div>

            {/* Arrow Icon */}
            <ChevronRight
              className={`w-4 h-4 transition-all ${isDark
                ? 'text-zinc-500 group-hover/peek:text-[#00DF00] group-hover/peek:translate-x-0.5'
                : 'text-zinc-400 group-hover/peek:text-[#087C3B] group-hover/peek:translate-x-0.5'
                }`}
            />
          </button>
        </div>

        {/* Gesture Instruction Hint */}
        <div
          className={`flex items-center justify-center gap-2 py-1 text-[11px] font-mono select-none ${isDark ? 'text-zinc-400' : 'text-zinc-600'
            }`}
        >
          <span className={`font-bold animate-pulse ${isDark ? 'text-[#00DF00]' : 'text-[#087C3B]'}`}>←</span>
          <span className={`tracking-wide font-medium ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>Deslize para explorar</span>
          <span className={`font-bold animate-pulse ${isDark ? 'text-[#00DF00]' : 'text-[#087C3B]'}`}>→</span>
        </div>
      </div>

      {/* 4. BOTTOM CONTROLS & PROGRESSION (PREV / NEXT / DOTS TRACK / DYNAMIC NEXT LABEL) */}
      <div className="relative z-20 shrink-0 max-w-md mx-auto w-full pt-0.5">
        <div className="flex items-center justify-between gap-3">
          {/* Previous Solution Button */}
          <button
            onClick={handlePrev}
            className={`w-11 h-11 rounded-full border flex items-center justify-center active:scale-90 transition-all shadow-md group ${isDark
              ? 'bg-[#131F24] border-[#2A423A] hover:border-[#00DF00]/70 text-zinc-200 hover:text-white'
              : 'bg-white border-[#B8D1C3] hover:border-[#087C3B]/70 text-[#172C22]'
              }`}
            title={`Solução anterior: ${prevItem.product.name}`}
            aria-label={`Solução anterior (${prevItem.product.name})`}
          >
            <ChevronLeft className={`w-5 h-5 group-hover:-translate-x-0.5 transition-transform ${isDark ? 'text-[#00DF00]' : 'text-[#087C3B]'}`} />
          </button>

          {/* Center Progress Dots Track & Dynamic Indicator */}
          <div className="flex flex-col items-center gap-1.5 flex-1 min-w-0">
            <div className="flex items-center justify-center gap-1 w-full overflow-hidden px-1">
              {products.map((p, idx) => {
                const isCur = idx === currentIndex;
                return (
                  <button
                    key={`dot-${p.product.id}`}
                    onClick={() => goToIndex(idx, idx > currentIndex ? 'left' : 'right')}
                    aria-label={`Ir para ${p.product.name}`}
                    className={`h-1.5 rounded-full transition-all duration-300 ${isCur
                      ? isDark
                        ? 'w-5 bg-[#00DF00] shadow-[0_0_8px_#00DF00]'
                        : 'w-5 bg-[#087C3B] shadow-[0_0_8px_rgba(8,124,59,0.5)]'
                      : isDark
                        ? 'w-1.5 bg-zinc-700 hover:bg-zinc-500'
                        : 'w-1.5 bg-zinc-300 hover:bg-zinc-400'
                      }`}
                  />
                );
              })}
            </div>

            {/* Counter and Next Solution Indicator */}
            <div className={`flex items-center justify-center gap-2 text-[10px] font-mono ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
              <span>
                <strong className={isDark ? 'text-[#00DF00]' : 'text-[#087C3B]'}>
                  {String(currentIndex + 1).padStart(2, '0')}
                </strong>{' '}
                de {products.length} soluções
              </span>
              <span className={isDark ? 'text-zinc-600' : 'text-zinc-400'}>|</span>
              <span className="truncate max-w-[130px] sm:max-w-[160px]">
                <span className={isDark ? 'text-zinc-500' : 'text-zinc-400'}>Próx:</span>{' '}
                <span className={`font-semibold ${isDark ? 'text-zinc-200' : 'text-[#172C22]'}`}>{nextItem.product.name}</span>
              </span>
            </div>
          </div>

          {/* Next Solution Button */}
          <button
            onClick={handleNext}
            className={`w-11 h-11 rounded-full border flex items-center justify-center active:scale-90 transition-all shadow-md group ${isDark
              ? 'bg-[#131F24] border-[#2A423A] hover:border-[#00DF00]/70 text-zinc-200 hover:text-white'
              : 'bg-white border-[#B8D1C3] hover:border-[#087C3B]/70 text-[#172C22]'
              }`}
            title={`Próxima solução: ${nextItem.product.name}`}
            aria-label={`Próxima solução (${nextItem.product.name})`}
          >
            <ChevronRight className={`w-5 h-5 group-hover:translate-x-0.5 transition-transform ${isDark ? 'text-[#00DF00]' : 'text-[#087C3B]'}`} />
          </button>
        </div>
      </div>
    </section>
  );
};
