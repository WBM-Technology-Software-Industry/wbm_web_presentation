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
  Plus,
  Minus,
  RotateCcw,
} from 'lucide-react';
import { NetworkMeshBg } from '../ui/NetworkMeshBg';
import { SolutionDetailPanel } from './SolutionDetailPanel';
import { MobileGuidedExperience } from './MobileGuidedExperience';
import { MobileSectorOverview } from './MobileSectorOverview';

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

  // Active product featured in mobile Industria guided experience
  const [guidedProductId, setGuidedProductId] = useState<ProductId | null>(() => {
    if (typeof window === 'undefined') return null;
    const params = new URLSearchParams(window.location.search);
    const prod = params.get('product');
    return prod ? (prod as ProductId) : null;
  });

  // View mode for mobile Industria: 'guided' (default) vs 'orbital' (free map)
  const [mobileViewMode, setMobileViewMode] = useState<'guided' | 'orbital'>(() => {
    if (typeof window === 'undefined') return 'guided';
    const params = new URLSearchParams(window.location.search);
    const v = params.get('view');
    return v === 'orbital' ? 'orbital' : 'guided';
  });

  // Hover and focus state for coordinated interactive luminous feedback (supports ?hover= for testing/deep-linking)
  const [hoveredProductId, setHoveredProductId] = useState<ProductId | null>(() => {
    if (typeof window === 'undefined') return null;
    const params = new URLSearchParams(window.location.search);
    const h = params.get('hover');
    return h ? (h as ProductId) : null;
  });

  // Touch and Drag Panning State for fluid spatial navigation (supports ?panX= & ?panY= for testing/deep-linking)
  const [panOffset, setPanOffset] = useState(() => {
    if (typeof window === 'undefined') return { x: 0, y: 0 };
    const params = new URLSearchParams(window.location.search);
    const px = parseFloat(params.get('panX') || '0');
    const py = parseFloat(params.get('panY') || '0');
    return { x: isNaN(px) ? 0 : px, y: isNaN(py) ? 0 : py };
  });
  const [isDragging, setIsDragging] = useState(false);
  const isDraggingRef = useRef(false);
  const dragDistanceRef = useRef(0);
  const dragStartRef = useRef({ x: 0, y: 0, panX: 0, panY: 0 });

  // User zoom scale multiplier (supports ?zoom= for testing/deep-linking)
  const [userZoom, setUserZoom] = useState<number>(() => {
    if (typeof window === 'undefined') return 1.0;
    const params = new URLSearchParams(window.location.search);
    const z = parseFloat(params.get('zoom') || '1.0');
    return !isNaN(z) && z > 0 ? z : 1.0;
  });
  const userZoomRef = useRef<number>(userZoom);
  userZoomRef.current = userZoom;

  // Multi-touch pinch-to-zoom tracking refs
  const isPinchingRef = useRef(false);
  const wasPinchingRef = useRef(false);
  const pinchStartDistRef = useRef(0);
  const pinchStartMidpointRef = useRef({ x: 0, y: 0 });
  const pinchStartZoomRef = useRef(1.0);
  const pinchStartPanRef = useRef({ x: 0, y: 0 });

  // Dynamic viewport measurement for exact bounding box framing
  const containerRef = useRef<HTMLDivElement>(null);
  const [viewportSize, setViewportSize] = useState(() => ({
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
    height: typeof window !== 'undefined' ? window.innerHeight : 700,
  }));

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
    setPanOffset({ x: 0, y: 0 });
    setUserZoom(1.0);
    userZoomRef.current = 1.0;
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
    setPanOffset({ x: 0, y: 0 });
    setUserZoom(1.0);
    userZoomRef.current = 1.0;
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
      setGuidedProductId(productId);
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

  // Handlers for switching between Guided Experience and Free Orbital Map in mobile Industria
  const handleSwitchToOrbital = useCallback(() => {
    setMobileViewMode('orbital');
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('view', 'orbital');
      window.history.pushState({ view: 'orbital', sector: selectedUniverseId, product: selectedProductId }, '', url.toString());
    }
  }, [selectedUniverseId, selectedProductId]);

  const handleSwitchToGuided = useCallback(() => {
    setMobileViewMode('guided');
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('view', 'guided');
      window.history.pushState({ view: 'guided', sector: selectedUniverseId, product: selectedProductId }, '', url.toString());
    }
  }, [selectedUniverseId, selectedProductId]);

  // Sync with browser back/forward buttons (PopState)
  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const sector = params.get('sector');
      const prod = params.get('product');
      const v = params.get('view');
      if (sector && sector in UNIVERSES) {
        setSelectedUniverseId(sector as UniverseId);
      } else {
        setSelectedUniverseId(null);
      }
      if (prod) {
        setSelectedProductId(prod as ProductId);
        setGuidedProductId(prod as ProductId);
      } else {
        setSelectedProductId(null);
      }
      if (v === 'orbital' || v === 'guided') {
        setMobileViewMode(v);
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

  const isMobile = viewportSize.width < 768;

  // Mobile Overview Coordinates for the 6 Universes (Vertical Ellipse around IoT nucleus at 0, 0)
  const MOBILE_OVERVIEW_COORDS: Record<UniverseId, { x: number; y: number }> = {
    saneamento: { x: 0, y: -195 },
    industria: { x: 80, y: -95 },
    piscicultura: { x: 80, y: 95 },
    bioflorestal: { x: 0, y: 195 },
    energia: { x: -80, y: 95 },
    'pesquisa-laboratorios': { x: -80, y: -95 },
  };

  // Universe position resolver based on device mode and selection state
  const getUniverseCoords = (uId: UniverseId) => {
    if (isMobile) {
      if (selectedUniverseId === uId) {
        const count = getProductsByUniverse(uId).length;
        return { x: 0, y: count <= 4 ? -75 : -105 };
      }
      return MOBILE_OVERVIEW_COORDS[uId];
    }
    return UNIVERSES[uId].coord;
  };

  // Mobile Orbital Exploratory Layout for Child Solutions:
  // Dynamically arranges solutions vertically and radially below the active universe core.
  // Guarantees zero cutoff on portrait phone screens (360px - 430px), natural touch flow, and clear hierarchy.
  const getSolutionMobileOrbitalPosition = (
    idx: number,
    total: number,
    center: { x: number; y: number }
  ) => {
    const pillHalfWidth = 78; // w-[156px]
    const pillHalfHeight = 21;

    if (total <= 4) {
      if (total === 3) {
        // 3 items (Energia)
        if (idx === 0) {
          const x = -80;
          const y = center.y + 75;
          return { x, y, isLeft: true, edgeX: x + pillHalfWidth, edgeY: y };
        } else if (idx === 1) {
          const x = 80;
          const y = center.y + 75;
          return { x, y, isLeft: false, edgeX: x - pillHalfWidth, edgeY: y };
        } else {
          const x = 0;
          const y = center.y + 152;
          return { x, y, isLeft: false, edgeX: x, edgeY: y - pillHalfHeight };
        }
      } else {
        // 4 items (Pesquisa, Bioflorestal, Piscicultura)
        const row = Math.floor(idx / 2);
        const isLeft = idx % 2 === 0;
        const x = isLeft ? -80 : 80;
        const y = center.y + 72 + row * 78;
        const edgeX = isLeft ? x + pillHalfWidth : x - pillHalfWidth;
        return { x, y, isLeft, edgeX, edgeY: y };
      }
    }

    // High product count (11 in Saneamento, 13 in Indústria)
    const row = Math.floor(idx / 2);
    const isLastOdd = idx === total - 1 && total % 2 !== 0;

    if (isLastOdd) {
      const x = 0;
      const y = center.y + 72 + row * 76;
      return {
        x,
        y,
        isLeft: false,
        edgeX: x,
        edgeY: y - pillHalfHeight,
      };
    }

    const isLeft = idx % 2 === 0;
    const x = isLeft ? -80 : 80;
    const y = center.y + 72 + row * 76;
    const edgeX = isLeft ? x + pillHalfWidth : x - pillHalfWidth;

    return {
      x,
      y,
      isLeft,
      edgeX,
      edgeY: y,
    };
  };

  // Desktop Adaptive Bilateral Layout for Child Solutions (PRESERVED UNCHANGED):
  // Distributes products in symmetrical Left and Right flanking columns anchored to the universe node.
  // Guarantees ZERO collision between labels, generous clearance with the universe node, and fits any screen.
  const getSolutionBilateralPosition = (idx: number, total: number, center: { x: number; y: number }) => {
    const totalLeft = Math.ceil(total / 2);
    const totalRight = Math.floor(total / 2);
    const isLeft = idx < totalLeft;

    const colOffsetX = 295;
    const pillHalfWidth = 132;

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
  // Computes exact scale based on real container viewport to guarantee zero clipping.
  const safeW = Math.max(320, viewportSize.width - (isMobile ? 24 : 60));
  const safeH = Math.max(300, viewportSize.height - (isMobile ? 70 : 60));

  let baseCameraScale = 1;
  let baseTranslateX = 0;
  let baseTranslateY = 0;

  if (!selectedUniverseId) {
    if (isMobile) {
      // Mobile Overview: cluster fits comfortably within portrait boundaries (cluster width: 320px, height: 450px)
      const fitW = (safeW - 16) / 320;
      const fitH = (safeH - 24) / 450;
      baseCameraScale = Math.min(fitW, fitH, 0.95);
      baseCameraScale = Math.max(0.78, baseCameraScale);
    } else {
      const fitW = safeW / 680;
      const fitH = safeH / 470;
      baseCameraScale = Math.min(fitW, fitH, 1.12);
      baseCameraScale = Math.max(0.65, baseCameraScale);
    }
    baseTranslateX = 0;
    baseTranslateY = 0;
  } else if (activeUniverse) {
    if (isMobile) {
      // Mobile Focused Universe: scale to comfortably fit 320px cluster width with safe margins
      const fitW = (safeW - 16) / 330;
      baseCameraScale = Math.min(fitW, 0.95);
      baseCameraScale = Math.max(0.82, baseCameraScale);
      baseTranslateX = 0;
      baseTranslateY = 0;
    } else {
      const fitW = safeW / 890;
      const fitH = safeH / 430;
      baseCameraScale = Math.min(fitW, fitH, 1.05);
      baseCameraScale = Math.max(0.65, baseCameraScale);
      baseTranslateX = -activeUniverse.coord.x;
      baseTranslateY = -activeUniverse.coord.y;
    }
  }

  // Scale Limits (Etapa C.2)
  const MIN_SCALE = 0.65;
  const MAX_SCALE = 1.80;

  // Effective camera scale
  const cameraScale = isMobile
    ? Math.max(MIN_SCALE, Math.min(MAX_SCALE, baseCameraScale * userZoom))
    : baseCameraScale;

  const cameraTranslateX = baseTranslateX + panOffset.x;
  const cameraTranslateY = baseTranslateY + panOffset.y;

  // Dynamic pan bounds responsive to current scale
  const getPanBounds = useCallback(
    (scale: number) => {
      const zoomFactor = Math.max(1, scale / baseCameraScale);
      let maxPanX = 300;
      let minPanY = -240;
      let maxPanY = 240;

      if (selectedUniverseId) {
        if (isMobile) {
          maxPanX = 75 + (zoomFactor - 1) * 110;
          const total = activeProducts.length;
          const maxRows = Math.ceil(total / 2);
          const maxDown = total <= 4 ? 50 : Math.max(130, maxRows * 76 - 170);
          minPanY = -(maxDown + (zoomFactor - 1) * 160);
          maxPanY = 50 + (zoomFactor - 1) * 80;
        } else {
          maxPanX = 450;
          minPanY = -320;
          maxPanY = 320;
        }
      } else {
        if (isMobile) {
          maxPanX = 50 + (zoomFactor - 1) * 100;
          minPanY = -(60 + (zoomFactor - 1) * 120);
          maxPanY = 60 + (zoomFactor - 1) * 120;
        } else {
          maxPanX = 300;
          minPanY = -240;
          maxPanY = 240;
        }
      }

      return { maxPanX, minPanY, maxPanY };
    },
    [baseCameraScale, selectedUniverseId, isMobile, activeProducts.length]
  );

  const applyPan = useCallback(
    (targetX: number, targetY: number, scale = cameraScale) => {
      const { maxPanX, minPanY, maxPanY } = getPanBounds(scale);
      const clampedX = Math.max(-maxPanX, Math.min(maxPanX, targetX));
      const clampedY = Math.max(minPanY, Math.min(maxPanY, targetY));
      setPanOffset({ x: clampedX, y: clampedY });
    },
    [getPanBounds, cameraScale]
  );

  // Multi-Touch Handlers for 1-finger Pan and 2-finger Pinch-to-Zoom
  const handleTouchStart = (e: React.TouchEvent<HTMLElement>) => {
    if (e.touches.length === 1) {
      // 1 Finger: Smooth spatial drag
      isDraggingRef.current = true;
      setIsDragging(true);
      dragDistanceRef.current = 0;
      dragStartRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
        panX: panOffset.x,
        panY: panOffset.y,
      };
    } else if (e.touches.length >= 2) {
      // 2 Fingers: Pinch-to-zoom with focal point invariant tracking
      isPinchingRef.current = true;
      wasPinchingRef.current = true;
      isDraggingRef.current = true;
      setIsDragging(true);

      const t1 = e.touches[0];
      const t2 = e.touches[1];
      const dist = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
      pinchStartDistRef.current = Math.max(10, dist);

      const rect = containerRef.current?.getBoundingClientRect() || {
        left: 0,
        top: 0,
        width: viewportSize.width,
        height: viewportSize.height,
      };
      const midX = (t1.clientX + t2.clientX) / 2 - rect.left;
      const midY = (t1.clientY + t2.clientY) / 2 - rect.top;

      pinchStartMidpointRef.current = { x: midX, y: midY };
      pinchStartZoomRef.current = userZoomRef.current;
      pinchStartPanRef.current = { x: panOffset.x, y: panOffset.y };
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLElement>) => {
    if (e.touches.length === 1 && !isPinchingRef.current) {
      // 1-Finger Pan
      if (!isDraggingRef.current) return;
      const clientX = e.touches[0].clientX;
      const clientY = e.touches[0].clientY;
      const dx = (clientX - dragStartRef.current.x) / cameraScale;
      const dy = (clientY - dragStartRef.current.y) / cameraScale;
      dragDistanceRef.current = Math.hypot(
        clientX - dragStartRef.current.x,
        clientY - dragStartRef.current.y
      );

      applyPan(dragStartRef.current.panX + dx, dragStartRef.current.panY + dy, cameraScale);
    } else if (e.touches.length >= 2 && isPinchingRef.current) {
      // 2-Finger Pinch-to-Zoom + Pan
      const t1 = e.touches[0];
      const t2 = e.touches[1];
      const currentDist = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
      dragDistanceRef.current = 100; // Invalidate click on solutions

      const scaleRatio = currentDist / pinchStartDistRef.current;
      const rawUserZoom = pinchStartZoomRef.current * scaleRatio;
      const minUserZoom = MIN_SCALE / baseCameraScale;
      const maxUserZoom = MAX_SCALE / baseCameraScale;
      const newUserZoom = Math.max(minUserZoom, Math.min(maxUserZoom, rawUserZoom));

      const rect = containerRef.current?.getBoundingClientRect() || {
        left: 0,
        top: 0,
        width: viewportSize.width,
        height: viewportSize.height,
      };
      const currentMidX = (t1.clientX + t2.clientX) / 2 - rect.left;
      const currentMidY = (t1.clientY + t2.clientY) / 2 - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const sOld = baseCameraScale * pinchStartZoomRef.current;
      const sNew = baseCameraScale * newUserZoom;

      // Focal Point Invariant:
      // panNew = panStart + (midCurrent - center)/sNew - (midStart - center)/sOld
      const panNewX =
        pinchStartPanRef.current.x +
        (currentMidX - centerX) / sNew -
        (pinchStartMidpointRef.current.x - centerX) / sOld;
      const panNewY =
        pinchStartPanRef.current.y +
        (currentMidY - centerY) / sNew -
        (pinchStartMidpointRef.current.y - centerY) / sOld;

      setUserZoom(newUserZoom);
      userZoomRef.current = newUserZoom;
      applyPan(panNewX, panNewY, sNew);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLElement>) => {
    if (e.touches.length === 1 && isPinchingRef.current) {
      // Transition from 2 fingers to 1 finger smoothly without jumping
      isPinchingRef.current = false;
      dragStartRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
        panX: panOffset.x,
        panY: panOffset.y,
      };
    } else if (e.touches.length === 0) {
      // All touches finished
      isDraggingRef.current = false;
      isPinchingRef.current = false;
      setIsDragging(false);

      // Keep wasPinchingRef true for 250ms to prevent accidental product clicks
      setTimeout(() => {
        wasPinchingRef.current = false;
      }, 250);
    }
  };

  // Mouse handlers for desktop and laptop
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    isDraggingRef.current = true;
    setIsDragging(true);
    dragDistanceRef.current = 0;
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      panX: panOffset.x,
      panY: panOffset.y,
    };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    const dx = (e.clientX - dragStartRef.current.x) / cameraScale;
    const dy = (e.clientY - dragStartRef.current.y) / cameraScale;
    dragDistanceRef.current = Math.hypot(
      e.clientX - dragStartRef.current.x,
      e.clientY - dragStartRef.current.y
    );

    applyPan(dragStartRef.current.panX + dx, dragStartRef.current.panY + dy, cameraScale);
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
    setIsDragging(false);
  };

  // Discreet Zoom Controls Handlers
  const handleZoomIn = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const maxZoom = MAX_SCALE / baseCameraScale;
    const nextZoom = Math.min(maxZoom, userZoomRef.current * 1.25);
    setUserZoom(nextZoom);
    userZoomRef.current = nextZoom;
    applyPan(panOffset.x, panOffset.y, baseCameraScale * nextZoom);
  };

  const handleZoomOut = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const minZoom = MIN_SCALE / baseCameraScale;
    const nextZoom = Math.max(minZoom, userZoomRef.current * 0.8);
    setUserZoom(nextZoom);
    userZoomRef.current = nextZoom;
    applyPan(panOffset.x, panOffset.y, baseCameraScale * nextZoom);
  };

  const handleResetView = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setUserZoom(1.0);
    userZoomRef.current = 1.0;
    setPanOffset({ x: 0, y: 0 });
  };

  const isViewModified =
    Math.abs(userZoom - 1.0) > 0.04 ||
    Math.abs(panOffset.x) > 15 ||
    Math.abs(panOffset.y) > 15;

  // Non-passive native event listener to strictly prevent browser whole-page pinch zoom
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onTouchMoveNative = (e: TouchEvent) => {
      if (e.touches.length > 1) {
        if (e.cancelable) e.preventDefault();
      }
    };

    const onWheelNative = (e: WheelEvent) => {
      if (e.ctrlKey) {
        if (e.cancelable) e.preventDefault();
        const zoomDelta = e.deltaY > 0 ? 0.92 : 1.08;
        const minUserZoom = MIN_SCALE / baseCameraScale;
        const maxUserZoom = MAX_SCALE / baseCameraScale;
        const nextZoom = Math.max(minUserZoom, Math.min(maxUserZoom, userZoomRef.current * zoomDelta));
        setUserZoom(nextZoom);
        userZoomRef.current = nextZoom;
        applyPan(panOffset.x, panOffset.y, baseCameraScale * nextZoom);
      }
    };

    container.addEventListener('touchmove', onTouchMoveNative, { passive: false });
    container.addEventListener('wheel', onWheelNative, { passive: false });

    return () => {
      container.removeEventListener('touchmove', onTouchMoveNative);
      container.removeEventListener('wheel', onWheelNative);
    };
  }, [baseCameraScale, applyPan, panOffset.x, panOffset.y]);

  // Flag indicating if the new mobile guided experience prototype is active for Industria
  const isIndustriaGuided =
    isMobile &&
    selectedUniverseId === 'industria' &&
    mobileViewMode === 'guided';

  return (
    <div className="relative w-full min-h-[calc(100vh-65px)] bg-black text-white flex flex-col justify-between overflow-hidden select-text">
      {/* Background Cyber Mesh */}
      <NetworkMeshBg />

      {/* Top Breadcrumb & Controls Bar (Hidden on Mobile Overview since MobileSectorOverview provides its own rich header) */}
      <header className={`relative z-30 w-full max-w-full bg-black/85 backdrop-blur-md border-b border-zinc-900 px-3 sm:px-8 py-2 sm:py-2.5 overflow-hidden ${
        isMobile && !selectedUniverseId ? 'hidden' : 'block'
      }`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-3 min-w-0">
          
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
              <span className="hidden sm:inline">Portfólio de Universos</span>
              <span className="sm:hidden">Universos</span>
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
                <span>Visão Geral</span>
              </button>
            )}
          </div>

        </div>
      </header>

      {/* Mobile Sector Overview (6 Setores) or Mobile Guided Experience (Indústria) or Spatial Orbital Stage */}
      {isMobile && !selectedUniverseId ? (
        <MobileSectorOverview onSelectUniverse={handleSelectUniverse} />
      ) : isIndustriaGuided ? (
        <MobileGuidedExperience
          products={activeProducts}
          activeProductId={guidedProductId || activeProducts[0]?.product.id || null}
          onSelectProduct={(prodId) => {
            setGuidedProductId(prodId);
            if (typeof window !== 'undefined') {
              const url = new URL(window.location.href);
              url.searchParams.set('product', prodId);
              window.history.replaceState({ sector: selectedUniverseId, product: prodId }, '', url.toString());
            }
          }}
          onOpenProductDetail={(prodId) => {
            handleSelectProduct(prodId);
          }}
          onSwitchToOrbitalMap={handleSwitchToOrbital}
          onBackToOverview={handleBackToOverview}
        />
      ) : (
        <>
          {/* Main Interactive Stage with Touch and Mouse Panning */}
          <main
        ref={containerRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className={`relative flex-1 w-full overflow-hidden touch-none select-none ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
      >
        {/* CINEMATIC CONTINUOUS SPATIAL CANVAS */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Spatial World Container with Smooth Dynamic Camera Pan and Zoom */}
          <div
            className="absolute select-none pointer-events-auto"
            style={{
              width: '1000px',
              height: '750px',
              left: 'calc(50% - 500px)',
              top: 'calc(50% - 375px)',
              transform: `scale(${cameraScale}) translate3d(${cameraTranslateX}px, ${cameraTranslateY}px, 0px)`,
              transformOrigin: '500px 375px',
              transition: isDragging
                ? 'none'
                : prefersReducedMotion
                ? 'none'
                : 'transform 650ms cubic-bezier(0.16, 1, 0.3, 1)',
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
                    const coord = getUniverseCoords(uId);
                    return (
                      <g key={`conn-${uId}`}>
                        <line
                          x1="0"
                          y1="0"
                          x2={coord.x}
                          y2={coord.y}
                          stroke="#00DF00"
                          strokeWidth="1.2"
                          strokeOpacity="0.35"
                          strokeDasharray="4 3"
                        />

                        {/* Data particle (rendered in overview) */}
                        {!prefersReducedMotion && (
                          <circle r="2" fill="#00DF00">
                            <animateMotion
                              path={`M 0 0 L ${coord.x} ${coord.y}`}
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

              {/* 2. Focused Universe: Smooth Cybernetic Branching Lines to Solutions */}
              {selectedUniverseId && activeUniverse && (
                <g className="animate-fadeIn">
                  {activeProducts.map(({ product }, idx) => {
                    const total = activeProducts.length;
                    const center = getUniverseCoords(activeUniverse.id);
                    const pos = isMobile
                      ? getSolutionMobileOrbitalPosition(idx, total, center)
                      : getSolutionBilateralPosition(idx, total, center);
                    const isSolSelected = selectedProductId === product.id;
                    const isHovered = hoveredProductId === product.id;
                    const isTargeted = isSolSelected || isHovered;
                    const isOtherHovered = Boolean(hoveredProductId && hoveredProductId !== product.id);

                    let originX = center.x;
                    let originY = center.y;
                    let destX = pos.edgeX;
                    let destY = pos.edgeY;
                    let curvePath = '';

                    if (isMobile) {
                      // Mobile Orbital Port Routing: exits from bottom ports of active universe node
                      if (pos.x < -20) {
                        originX = center.x - 45;
                        originY = center.y + 24;
                      } else if (pos.x > 20) {
                        originX = center.x + 45;
                        originY = center.y + 24;
                      } else {
                        originX = center.x;
                        originY = center.y + 24;
                      }
                      const midY = (originY + destY) / 2;
                      curvePath = `M ${originX} ${originY} C ${originX} ${midY}, ${destX} ${midY}, ${destX} ${destY}`;
                    } else {
                      // Desktop Bilateral Port Routing (Unchanged!)
                      const universeHalfWidth = 105;
                      originX = pos.isLeft ? center.x - universeHalfWidth : center.x + universeHalfWidth;
                      originY = center.y;
                      destX = pos.edgeX;
                      destY = pos.edgeY;
                      const controlOffset = 30;
                      const controlX1 = pos.isLeft ? originX - controlOffset : originX + controlOffset;
                      const controlX2 = pos.isLeft ? destX + controlOffset : destX - controlOffset;
                      curvePath = `M ${originX} ${originY} C ${controlX1} ${originY}, ${controlX2} ${destY}, ${destX} ${destY}`;
                    }

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
              onClick={() => {
                if (dragDistanceRef.current > 8 || wasPinchingRef.current) return;
                handleBackToOverview();
              }}
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
              <div className="absolute w-36 sm:w-40 h-36 sm:h-40 rounded-full bg-[#00DF00]/10 blur-xl pointer-events-none animate-pulse-subtle" />
              <div className="relative w-22 sm:w-28 h-22 sm:h-28 rounded-2xl sm:rounded-3xl bg-gradient-to-b from-zinc-900 via-zinc-950 to-black border-2 border-[#00DF00] flex flex-col items-center justify-center p-2.5 sm:p-3 shadow-[0_0_35px_rgba(0,223,0,0.4)] hover:shadow-[0_0_45px_rgba(0,223,0,0.65)] hover:border-[#00ff00] transition-all duration-300">
                <img
                  src="/assets/wbm-logo-clean.png"
                  alt="WBM Technology"
                  className="w-16 sm:w-20 h-auto object-contain drop-shadow-[0_0_12px_rgba(0,223,0,0.5)]"
                />
                <span className="text-[8px] sm:text-[9px] font-mono tracking-widest text-[#00DF00] uppercase mt-0.5 sm:mt-1">
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
              const coord = getUniverseCoords(uId);

              return (
                <div
                  key={uId}
                  onClick={() => {
                    if (dragDistanceRef.current > 8 || wasPinchingRef.current) return;
                    handleSelectUniverse(uId);
                  }}
                  style={{
                    left: `${500 + coord.x}px`,
                    top: `${375 + coord.y}px`,
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
                      className={`relative flex items-center gap-2 sm:gap-3 px-2 sm:px-3.5 py-1.5 sm:py-2.5 rounded-2xl backdrop-blur-md border transition-all duration-300 shadow-xl ${
                        isMobile
                          ? isSelected
                            ? 'w-[172px] min-w-[172px]'
                            : 'w-[152px] min-w-[152px]'
                          : 'w-[210px] min-w-[210px]'
                      } ${
                        isSelected
                          ? 'bg-zinc-900 border-[#00DF00] shadow-[0_0_30px_rgba(0,223,0,0.5)]'
                          : 'bg-zinc-950/95 border-zinc-800 group-hover:border-[#00DF00]/70'
                      }`}
                    >
                      <div
                        className={`rounded-xl flex items-center justify-center shrink-0 transition-transform duration-300 ${
                          isMobile ? 'w-7 h-7' : 'w-10 h-10'
                        } ${
                          isSelected
                            ? 'bg-[#00DF00] text-black shadow-[0_0_15px_rgba(0,223,0,0.6)]'
                            : 'bg-[#00DF00]/15 text-[#00DF00] border border-[#00DF00]/40 group-hover:scale-110'
                        }`}
                      >
                        {renderUniverseIcon(u.iconName, isMobile ? 'w-3.5 h-3.5' : 'w-5 h-5')}
                      </div>

                      <div className="text-left flex-1 min-w-0">
                        <h3 className="text-[11px] sm:text-sm font-extrabold text-white font-heading tracking-wide leading-tight line-clamp-2">
                          {u.name}
                        </h3>
                        <p className="text-[9px] sm:text-[10px] text-zinc-400 font-mono mt-0.5">
                          {count} {count === 1 ? 'Solução' : 'Soluções'}
                        </p>
                      </div>

                      <ChevronRight
                        className={`w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#00DF00] shrink-0 transition-transform duration-300 ${
                          isSelected ? 'rotate-90' : 'group-hover:translate-x-0.5'
                        }`}
                      />
                    </div>
                  </div>
                </div>
              );
            })}

            {/* ADAPTIVE NON-OVERLAPPING CHILD SOLUTION NODES */}
            {selectedUniverseId && activeUniverse && (
              <div className="animate-fadeIn">
                {activeProducts.map(({ product, context }, idx) => {
                  const total = activeProducts.length;
                  const center = getUniverseCoords(activeUniverse.id);
                  const pos = isMobile
                    ? getSolutionMobileOrbitalPosition(idx, total, center)
                    : getSolutionBilateralPosition(idx, total, center);
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
                        if (dragDistanceRef.current > 8 || wasPinchingRef.current) return;
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
                        className={`relative flex items-center justify-between gap-1.5 px-2 sm:px-3 py-1.5 rounded-xl border backdrop-blur-md transition-all duration-300 shadow-md ${
                          isMobile ? 'w-[156px] min-w-[156px]' : 'w-[264px] min-w-[264px]'
                        } ${
                          isSolSelected
                            ? 'bg-[#00DF00] text-black border-[#00DF00] shadow-[0_0_22px_rgba(0,223,0,0.65)] scale-105'
                            : isHovered
                            ? 'bg-zinc-900/95 text-white border-[#00DF00] shadow-[0_0_16px_rgba(0,223,0,0.35)] scale-102 ring-1 ring-[#00DF00]/50'
                            : isOtherHovered
                            ? 'bg-zinc-950/85 border-zinc-800/60 text-zinc-400 opacity-65 scale-98'
                            : 'bg-zinc-950/95 border-zinc-700/80 text-zinc-200 hover:border-[#00DF00] hover:text-white hover:scale-102 hover:shadow-[0_0_12px_rgba(0,223,0,0.25)]'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 min-w-0 flex-1">
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
                              className={`text-[10.5px] sm:text-xs font-bold tracking-tight block truncate font-heading transition-colors ${
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
                              className={`text-[9px] sm:text-[10px] block truncate font-medium tracking-tight transition-colors ${
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

        {/* Switch back to Guided Experience when inside mobile Industria orbital map */}
        {isMobile && selectedUniverseId === 'industria' && mobileViewMode === 'orbital' && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleSwitchToGuided();
            }}
            className="absolute top-2.5 left-3 z-50 px-3 py-1 rounded-full bg-zinc-950/95 border border-[#00DF00]/60 text-white text-[10px] font-mono uppercase tracking-wider flex items-center gap-1.5 shadow-[0_0_15px_rgba(0,223,0,0.3)] backdrop-blur-md active:scale-95 transition-all"
            title="Voltar à exploração guiada de Indústria"
            aria-label="Voltar à exploração guiada"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#00DF00]" />
            <span>Exploração guiada</span>
          </button>
        )}

        {/* Mobile Navigation & Off-Screen Guidance HUD */}
        {isMobile && selectedUniverseId && activeUniverse && isViewModified && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleResetView();
            }}
            className="absolute top-2.5 left-1/2 -translate-x-1/2 z-50 px-3 py-1 rounded-full bg-zinc-950/95 border border-[#00DF00] text-white text-[10px] font-mono uppercase tracking-wider flex items-center gap-1.5 shadow-[0_0_15px_rgba(0,223,0,0.5)] backdrop-blur-md active:scale-95 transition-all"
            title="Recentralizar universo"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#00DF00]" />
            <span>Centralizar {activeUniverse.name}</span>
          </button>
        )}

        {/* Discreet Mobile Overview Hint */}
        {isMobile && !selectedUniverseId && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-40 pointer-events-none px-3 py-1 rounded-full bg-zinc-950/80 border border-zinc-800/80 text-zinc-400 text-[10px] font-mono tracking-wide flex items-center gap-1.5 backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00DF00] animate-pulse" />
            <span>Toque em um setor para explorar</span>
          </div>
        )}

        {/* Mobile Tactile Zoom Controls HUD */}
        {isMobile && (
          <div
            className="absolute right-3.5 bottom-6 z-40 flex flex-col items-center bg-zinc-950/90 border border-zinc-800/90 rounded-2xl p-1 shadow-[0_4px_20px_rgba(0,0,0,0.8)] backdrop-blur-md gap-1 select-none"
            onClick={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
          >
            {/* Zoom In Button */}
            <button
              onClick={handleZoomIn}
              disabled={cameraScale >= MAX_SCALE - 0.02}
              className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold transition-all active:scale-90 ${
                cameraScale >= MAX_SCALE - 0.02
                  ? 'text-zinc-600 cursor-not-allowed'
                  : 'text-zinc-300 hover:text-[#00DF00] hover:bg-zinc-900 active:bg-zinc-800'
              }`}
              title="Aproximar mapa (+)"
              aria-label="Aproximar zoom"
            >
              <Plus className="w-4 h-4" />
            </button>

            {/* Reset / Center Framing Button */}
            <button
              onClick={handleResetView}
              className={`w-8 h-8 rounded-xl flex items-center justify-center text-[10px] font-mono transition-all active:scale-90 ${
                isViewModified
                  ? 'text-[#00DF00] bg-[#00DF00]/15 border border-[#00DF00]/40 shadow-[0_0_10px_rgba(0,223,0,0.3)] animate-pulse-subtle'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
              title="Restaurar enquadramento inicial"
              aria-label="Centralizar e restaurar enquadramento"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            {/* Zoom Out Button */}
            <button
              onClick={handleZoomOut}
              disabled={cameraScale <= MIN_SCALE + 0.02}
              className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold transition-all active:scale-90 ${
                cameraScale <= MIN_SCALE + 0.02
                  ? 'text-zinc-600 cursor-not-allowed'
                  : 'text-zinc-300 hover:text-[#00DF00] hover:bg-zinc-900 active:bg-zinc-800'
              }`}
              title="Afastar mapa (−)"
              aria-label="Afastar zoom"
            >
              <Minus className="w-4 h-4" />
            </button>
          </div>
        )}
      </main>

      {/* Mobile Bottom Quick-Select Dock (Horizontal Scroll) */}
      {isMobile && selectedUniverseId && activeUniverse && (
        <div className="relative z-30 w-full bg-black/95 border-t border-zinc-900 px-3 py-1.5">
          <div className="flex items-center justify-between text-[10px] text-zinc-400 font-mono mb-1 px-0.5">
            <span className="text-[#00DF00] flex items-center gap-1 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00DF00] animate-pulse" />
              SOLUÇÕES ({activeProducts.length})
            </span>
            <span className="text-zinc-500">Toque para focar</span>
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden py-0.5">
            {activeProducts.map(({ product }, idx) => {
              const center = getUniverseCoords(activeUniverse.id);
              const pos = getSolutionMobileOrbitalPosition(idx, activeProducts.length, center);
              const isCurrent = selectedProductId === product.id;

              return (
                <button
                  key={`dock-${product.id}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    const total = activeProducts.length;
                    const maxRows = Math.ceil(total / 2);
                    const maxDown = total <= 4 ? 40 : Math.max(120, maxRows * 76 - 180);
                    const targetPanY = Math.max(-maxDown, Math.min(50, -(pos.y - center.y - 70)));
                    setPanOffset({ x: 0, y: targetPanY });
                    handleSelectProduct(product.id);
                  }}
                  className={`shrink-0 px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-all flex items-center gap-1.5 ${
                    isCurrent
                      ? 'bg-[#00DF00] text-black border-[#00DF00] font-bold shadow-[0_0_10px_rgba(0,223,0,0.5)]'
                      : 'bg-zinc-900/90 text-zinc-300 border-zinc-800 hover:border-[#00DF00]/60 active:scale-95'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                      isCurrent ? 'bg-black' : 'bg-[#00DF00]'
                    }`}
                  />
                  <span className="truncate max-w-[130px] font-heading">{product.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </>
  )}

      {/* Bottom Informational Bar / Selected Solution Context */}
      <footer className={`relative z-30 w-full bg-black/90 backdrop-blur-md border-t border-zinc-900 px-4 sm:px-8 py-2.5 select-text ${
        isMobile && selectedUniverseId ? 'hidden' : 'block'
      }`}>
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
