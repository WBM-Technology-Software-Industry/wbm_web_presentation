import React, { useState } from 'react';
import {
  UniverseId,
  UNIVERSES,
  getProductsByUniverse,
} from '../../data/portfolioData';
import {
  Droplets,
  Factory,
  Zap,
  Fish,
  Trees,
  FlaskConical,
  ChevronRight,
  Cpu,
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface MobileSectorOverviewProps {
  onSelectUniverse: (universeId: UniverseId) => void;
}

export const MobileSectorOverview: React.FC<MobileSectorOverviewProps> = ({
  onSelectUniverse,
}) => {
  const { isDark } = useTheme();
  const [selectedSector, setSelectedSector] = useState<UniverseId | null>(null);

  const renderIcon = (iconName: string, className = 'w-5 h-5') => {
    switch (iconName) {
      case 'Droplets':
        return <Droplets className={className} />;
      case 'Factory':
        return <Factory className={className} />;
      case 'Zap':
        return <Zap className={className} />;
      case 'Fish':
        return <Fish className={className} />;
      case 'Trees':
        return <Trees className={className} />;
      case 'FlaskConical':
        return <FlaskConical className={className} />;
      default:
        return <Cpu className={className} />;
    }
  };

  const handleSectorClick = (uId: UniverseId) => {
    setSelectedSector(uId);
    // Smooth transition feedback before entering universe
    setTimeout(() => {
      onSelectUniverse(uId);
    }, 180);
  };

  // Structured in 2 columns: Left Column (3 sectors) and Right Column (3 sectors)
  const leftSectors: UniverseId[] = ['saneamento', 'energia', 'pesquisa-laboratorios'];
  const rightSectors: UniverseId[] = ['industria', 'piscicultura', 'bioflorestal'];

  return (
    <section
      aria-label="Visão Geral dos Setores de Mercado"
      className={`relative flex-1 w-full overflow-hidden flex flex-col justify-between select-none px-3 py-2 transition-colors duration-200 ${
        isDark ? 'bg-[#0B1115] text-white' : 'bg-[#E6EFEB] text-[#172C22]'
      }`}
    >
      {/* Background Cyber Glow */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] pointer-events-none ${
        isDark
          ? 'bg-[radial-gradient(circle_at_center,rgba(0,223,0,0.08)_0%,transparent_75%)]'
          : 'bg-[radial-gradient(circle_at_center,rgba(8,124,59,0.06)_0%,transparent_75%)]'
      }`} />

      {/* 1. HEADER SECTION (Título e Descrição do Usuário) */}
      <div className="text-center pt-1.5 pb-2 px-2 z-20 shrink-0 max-w-md mx-auto w-full">
        <div className={`inline-flex items-center gap-2 px-3 py-0.5 rounded-full text-[10px] font-mono font-semibold uppercase tracking-wider mb-1.5 ${
          isDark
            ? 'bg-zinc-950/90 border border-[#00DF00]/40 text-[#00DF00] shadow-[0_0_12px_rgba(0,223,0,0.2)]'
            : 'bg-white border border-[#B8D1C3] text-[#087C3B] shadow-sm'
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${isDark ? 'bg-[#00DF00]' : 'bg-[#087C3B]'}`} />
          <span>PORTFÓLIO INTERATIVO</span>
          <span className={isDark ? 'text-zinc-600' : 'text-zinc-300'}>|</span>
          <span className={isDark ? 'text-zinc-400' : 'text-[#4A6B5B]'}>6 SETORES</span>
        </div>

        <h1 className={`text-xl sm:text-2xl font-black font-heading tracking-tight leading-tight ${
          isDark ? 'text-white' : 'text-[#172C22]'
        }`}>
          Explore nossas tecnologias
        </h1>

        <p className={`text-xs mt-1 max-w-xs mx-auto leading-relaxed ${
          isDark ? 'text-zinc-400' : 'text-[#4A6B5B]'
        }`}>
          Selecione um setor para conhecer nossas soluções conectadas.
        </p>
      </div>

      {/* 2. CENTRAL TECHNOLOGICAL NETWORK & SECTOR CARDS */}
      <div className="relative z-20 flex-1 flex items-center justify-center max-w-md mx-auto w-full px-1 my-auto">
        {/* SVG Optical Beams connecting Central Nucleus to the 6 Sector Cards */}
        <svg
          viewBox="0 0 380 340"
          className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <filter id="overviewGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <linearGradient id="beamGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00DF00" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#00DF00" stopOpacity="0.2" />
            </linearGradient>
          </defs>

          {/* Optical Lines from Center Nucleus (190, 170) to 6 Sector anchors */}
          {/* Left Top: Saneamento (95, 55) */}
          <path
            d="M 190 170 Q 140 110 95 55"
            stroke={isDark ? '#00DF00' : '#087C3B'}
            strokeWidth={selectedSector === 'saneamento' ? '2.5' : '1.2'}
            strokeOpacity={selectedSector === 'saneamento' ? '0.9' : isDark ? '0.28' : '0.35'}
            strokeDasharray={selectedSector === 'saneamento' ? 'none' : '3 3'}
            filter={selectedSector === 'saneamento' && isDark ? 'url(#overviewGlow)' : undefined}
          />
          {/* Left Mid: Energia (95, 170) */}
          <path
            d="M 190 170 L 95 170"
            stroke={isDark ? '#00DF00' : '#087C3B'}
            strokeWidth={selectedSector === 'energia' ? '2.5' : '1.2'}
            strokeOpacity={selectedSector === 'energia' ? '0.9' : isDark ? '0.28' : '0.35'}
            strokeDasharray={selectedSector === 'energia' ? 'none' : '3 3'}
            filter={selectedSector === 'energia' && isDark ? 'url(#overviewGlow)' : undefined}
          />
          {/* Left Bottom: Pesquisa (95, 285) */}
          <path
            d="M 190 170 Q 140 230 95 285"
            stroke={isDark ? '#00DF00' : '#087C3B'}
            strokeWidth={selectedSector === 'pesquisa-laboratorios' ? '2.5' : '1.2'}
            strokeOpacity={selectedSector === 'pesquisa-laboratorios' ? '0.9' : isDark ? '0.28' : '0.35'}
            strokeDasharray={selectedSector === 'pesquisa-laboratorios' ? 'none' : '3 3'}
            filter={selectedSector === 'pesquisa-laboratorios' && isDark ? 'url(#overviewGlow)' : undefined}
          />

          {/* Right Top: Indústria (285, 55) */}
          <path
            d="M 190 170 Q 240 110 285 55"
            stroke={isDark ? '#00DF00' : '#087C3B'}
            strokeWidth={selectedSector === 'industria' ? '2.5' : '1.4'}
            strokeOpacity={selectedSector === 'industria' ? '0.95' : isDark ? '0.35' : '0.40'}
            strokeDasharray={selectedSector === 'industria' ? 'none' : '3 3'}
            filter={selectedSector === 'industria' && isDark ? 'url(#overviewGlow)' : undefined}
          />
          {/* Right Mid: Piscicultura (285, 170) */}
          <path
            d="M 190 170 L 285 170"
            stroke={isDark ? '#00DF00' : '#087C3B'}
            strokeWidth={selectedSector === 'piscicultura' ? '2.5' : '1.2'}
            strokeOpacity={selectedSector === 'piscicultura' ? '0.9' : isDark ? '0.28' : '0.35'}
            strokeDasharray={selectedSector === 'piscicultura' ? 'none' : '3 3'}
            filter={selectedSector === 'piscicultura' && isDark ? 'url(#overviewGlow)' : undefined}
          />
          {/* Right Bottom: Bioflorestal (285, 285) */}
          <path
            d="M 190 170 Q 240 230 285 285"
            stroke={isDark ? '#00DF00' : '#087C3B'}
            strokeWidth={selectedSector === 'bioflorestal' ? '2.5' : '1.2'}
            strokeOpacity={selectedSector === 'bioflorestal' ? '0.9' : isDark ? '0.28' : '0.35'}
            strokeDasharray={selectedSector === 'bioflorestal' ? 'none' : '3 3'}
            filter={selectedSector === 'bioflorestal' && isDark ? 'url(#overviewGlow)' : undefined}
          />

          {/* Animated Pulses on Indústria & Saneamento main conduits */}
          <circle r="2.8" fill={isDark ? '#FFFFFF' : '#087C3B'} filter={isDark ? 'url(#overviewGlow)' : undefined}>
            <animateMotion
              path="M 190 170 Q 240 110 285 55"
              dur="1.8s"
              repeatCount="indefinite"
            />
          </circle>
          <circle r="2.5" fill={isDark ? '#00FF00' : '#087C3B'} filter={isDark ? 'url(#overviewGlow)' : undefined}>
            <animateMotion
              path="M 190 170 Q 140 110 95 55"
              dur="2.2s"
              repeatCount="indefinite"
            />
          </circle>

          {/* Center Nucleus Graphic in SVG */}
          <g transform="translate(190, 170)">
            <circle r="22" fill={isDark ? '#00DF00' : '#087C3B'} fillOpacity={isDark ? '0.12' : '0.15'} filter={isDark ? 'url(#overviewGlow)' : undefined} />
            <circle r="16" fill={isDark ? '#090d09' : '#FFFFFF'} stroke={isDark ? '#00DF00' : '#087C3B'} strokeWidth="1.5" />
            <circle r="3" fill={isDark ? '#00FF00' : '#087C3B'} />
          </g>
        </svg>

        {/* 2-Column Grid of Sector Cards */}
        <div className="grid grid-cols-2 gap-2.5 sm:gap-3.5 w-full relative z-10">
          {/* LEFT COLUMN */}
          <div className="flex flex-col gap-2.5 sm:gap-3">
            {leftSectors.map((uId) => {
              const u = UNIVERSES[uId];
              const count = getProductsByUniverse(uId).length;
              const isSelected = selectedSector === uId;

              return (
                <button
                  key={uId}
                  onClick={() => handleSectorClick(uId)}
                  className={`group relative flex items-center gap-2.5 p-3 sm:p-3.5 rounded-2xl border text-left transition-all duration-200 active:scale-95 cursor-pointer shadow-lg outline-none ${
                    isSelected
                      ? isDark
                        ? 'border-[#00DF00] ring-2 ring-[#00DF00]/60 shadow-[0_0_25px_rgba(0,223,0,0.5)] bg-zinc-900'
                        : 'border-[#087C3B] ring-2 ring-[#087C3B]/60 shadow-[0_4px_20px_rgba(8,124,59,0.3)] bg-[#D7EBDD]'
                      : isDark
                      ? 'bg-gradient-to-b from-zinc-900/90 via-zinc-950/95 to-black/95 border-zinc-800/90 hover:border-[#00DF00]/70 hover:shadow-[0_0_20px_rgba(0,223,0,0.2)]'
                      : 'bg-white border-[#B8D1C3] hover:border-[#087C3B]/70 hover:shadow-md'
                  }`}
                  aria-label={`Entrar no setor ${u.name}. ${count} soluções disponíveis.`}
                >
                  {/* Icon Frame */}
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border transition-all ${
                      isSelected
                        ? isDark
                          ? 'bg-[#00DF00] text-black border-[#00DF00] shadow-[0_0_12px_#00DF00]'
                          : 'bg-[#087C3B] text-white border-[#087C3B] shadow-[0_2px_8px_rgba(8,124,59,0.3)]'
                        : isDark
                        ? 'bg-zinc-900/90 text-[#00DF00] border-zinc-800 group-hover:border-[#00DF00]/50 group-hover:scale-105'
                        : 'bg-[#D7EBDD] text-[#087C3B] border-[#B8D1C3] group-hover:border-[#087C3B] group-hover:scale-105'
                    }`}
                  >
                    {renderIcon(u.iconName, 'w-4 h-4')}
                  </div>

                  {/* Sector Metadata */}
                  <div className="flex-1 min-w-0">
                    <h2 className={`text-xs sm:text-sm font-bold font-heading tracking-tight leading-snug truncate transition-colors ${
                      isDark ? 'text-white group-hover:text-[#00DF00]' : 'text-[#172C22] group-hover:text-[#087C3B]'
                    }`}>
                      {u.name}
                    </h2>
                    <span className={`text-[10px] font-mono font-medium flex items-center gap-1 mt-0.5 ${
                      isDark ? 'text-zinc-400' : 'text-[#4A6B5B]'
                    }`}>
                      <span className={`w-1 h-1 rounded-full ${isDark ? 'bg-[#00DF00]' : 'bg-[#087C3B]'}`} />
                      <span>{count} soluções</span>
                    </span>
                  </div>

                  {/* Arrow Cue */}
                  <ChevronRight className={`w-4 h-4 transition-all shrink-0 ${
                    isDark ? 'text-zinc-500 group-hover:text-[#00DF00] group-hover:translate-x-0.5' : 'text-[#6B8B7B] group-hover:text-[#087C3B] group-hover:translate-x-0.5'
                  }`} />
                </button>
              );
            })}
          </div>

          {/* RIGHT COLUMN */}
          <div className="flex flex-col gap-2.5 sm:gap-3">
            {rightSectors.map((uId) => {
              const u = UNIVERSES[uId];
              const count = getProductsByUniverse(uId).length;
              const isSelected = selectedSector === uId;
              const isIndustria = uId === 'industria';

              return (
                <button
                  key={uId}
                  onClick={() => handleSectorClick(uId)}
                  className={`group relative flex items-center gap-2.5 p-3 sm:p-3.5 rounded-2xl border text-left transition-all duration-200 active:scale-95 cursor-pointer shadow-lg outline-none ${
                    isSelected
                      ? isDark
                        ? 'border-[#00DF00] ring-2 ring-[#00DF00]/60 shadow-[0_0_25px_rgba(0,223,0,0.5)] bg-zinc-900'
                        : 'border-[#087C3B] ring-2 ring-[#087C3B]/60 shadow-[0_4px_20px_rgba(8,124,59,0.3)] bg-[#D7EBDD]'
                      : isIndustria
                      ? isDark
                        ? 'bg-gradient-to-b from-zinc-900/90 via-zinc-950/95 to-black/95 border-[#00DF00]/45 hover:border-[#00DF00] hover:shadow-[0_0_25px_rgba(0,223,0,0.3)]'
                        : 'bg-white border-[#087C3B]/50 hover:border-[#087C3B] hover:shadow-md'
                      : isDark
                      ? 'bg-gradient-to-b from-zinc-900/90 via-zinc-950/95 to-black/95 border-zinc-800/90 hover:border-[#00DF00]/70 hover:shadow-[0_0_20px_rgba(0,223,0,0.2)]'
                      : 'bg-white border-[#B8D1C3] hover:border-[#087C3B]/70 hover:shadow-md'
                  }`}
                  aria-label={`Entrar no setor ${u.name}. ${count} soluções disponíveis.`}
                >
                  {/* Icon Frame */}
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border transition-all ${
                      isSelected
                        ? isDark
                          ? 'bg-[#00DF00] text-black border-[#00DF00] shadow-[0_0_12px_#00DF00]'
                          : 'bg-[#087C3B] text-white border-[#087C3B] shadow-[0_2px_8px_rgba(8,124,59,0.3)]'
                        : isIndustria
                        ? isDark
                          ? 'bg-[#00DF00]/15 text-[#00DF00] border-[#00DF00]/50 group-hover:bg-[#00DF00] group-hover:text-black group-hover:scale-105 shadow-[0_0_10px_rgba(0,223,0,0.25)]'
                          : 'bg-[#D7EBDD] text-[#087C3B] border-[#087C3B]/50 group-hover:bg-[#087C3B] group-hover:text-white group-hover:scale-105'
                        : isDark
                        ? 'bg-zinc-900/90 text-[#00DF00] border-zinc-800 group-hover:border-[#00DF00]/50 group-hover:scale-105'
                        : 'bg-[#D7EBDD] text-[#087C3B] border-[#B8D1C3] group-hover:border-[#087C3B] group-hover:scale-105'
                    }`}
                  >
                    {renderIcon(u.iconName, 'w-4 h-4')}
                  </div>

                  {/* Sector Metadata */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h2 className={`text-xs sm:text-sm font-bold font-heading tracking-tight leading-snug truncate transition-colors ${
                        isDark ? 'text-white group-hover:text-[#00DF00]' : 'text-[#172C22] group-hover:text-[#087C3B]'
                      }`}>
                        {u.name}
                      </h2>
                    </div>
                    <span className={`text-[10px] font-mono font-medium flex items-center gap-1 mt-0.5 ${
                      isDark ? 'text-zinc-400' : 'text-[#4A6B5B]'
                    }`}>
                      <span className={`w-1 h-1 rounded-full ${
                        isDark ? 'bg-[#00DF00]' : 'bg-[#087C3B]'
                      } ${isIndustria ? 'animate-pulse' : ''}`} />
                      <span className={isIndustria ? isDark ? 'text-zinc-300 font-semibold' : 'text-[#172C22] font-semibold' : ''}>{count} soluções</span>
                    </span>
                  </div>

                  {/* Arrow Cue */}
                  <ChevronRight className={`w-4 h-4 transition-all shrink-0 ${
                    isDark ? 'text-zinc-500 group-hover:text-[#00DF00] group-hover:translate-x-0.5' : 'text-[#6B8B7B] group-hover:text-[#087C3B] group-hover:translate-x-0.5'
                  }`} />
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. FOOTER GUIDANCE HINT */}
      <div className="relative z-20 text-center py-1.5 shrink-0 max-w-md mx-auto w-full">
        <p className="text-[11px] font-mono text-zinc-500 flex items-center justify-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00DF00]/60 animate-ping" />
          <span>Toque em um setor para explorar o ecossistema</span>
        </p>
      </div>
    </section>
  );
};
