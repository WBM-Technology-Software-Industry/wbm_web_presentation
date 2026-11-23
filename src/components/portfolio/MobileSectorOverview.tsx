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
    setTimeout(() => {
      onSelectUniverse(uId);
    }, 180);
  };

  // Structured sector list:
  // Top: Saneamento, Indústria
  // Middle: Piscicultura, Bioflorestal
  // Bottom: Energia, Pesquisa e Laboratórios
  const topSectors: UniverseId[] = ['saneamento', 'industria'];
  const midSectors: UniverseId[] = ['piscicultura', 'bioflorestal'];
  const bottomSectors: UniverseId[] = ['energia', 'pesquisa-laboratorios'];

  // Landscape columns (3 on left, 3 on right, core in center)
  const leftLandscapeSectors: UniverseId[] = ['saneamento', 'energia', 'pesquisa-laboratorios'];
  const rightLandscapeSectors: UniverseId[] = ['industria', 'piscicultura', 'bioflorestal'];

  const renderSectorButton = (uId: UniverseId, isCompact = false) => {
    const u = UNIVERSES[uId];
    const count = getProductsByUniverse(uId).length;
    const isSelected = selectedSector === uId;
    const isIndustria = uId === 'industria';

    return (
      <button
        key={uId}
        onClick={() => handleSectorClick(uId)}
        className={`group relative flex items-center gap-2.5 ${
          isCompact ? 'p-2 sm:p-2.5' : 'p-2.5 sm:p-3'
        } rounded-xl sm:rounded-2xl border text-left transition-all duration-200 active:scale-95 cursor-pointer shadow-md outline-none w-full min-h-[52px] ${
          isSelected
            ? isDark
              ? 'border-[#00DF00] ring-2 ring-[#00DF00]/60 shadow-[0_0_20px_rgba(0,223,0,0.5)] bg-zinc-900'
              : 'border-[#087C3B] ring-2 ring-[#087C3B]/60 shadow-[0_4px_16px_rgba(8,124,59,0.3)] bg-[#D7EBDD]'
            : isIndustria
            ? isDark
              ? 'bg-gradient-to-b from-zinc-900/90 via-zinc-950/95 to-black/95 border-[#00DF00]/45 hover:border-[#00DF00] hover:shadow-[0_0_15px_rgba(0,223,0,0.25)]'
              : 'bg-white border-[#087C3B]/50 hover:border-[#087C3B] hover:shadow-md'
            : isDark
            ? 'bg-gradient-to-b from-zinc-900/90 via-zinc-950/95 to-black/95 border-zinc-800/90 hover:border-[#00DF00]/70 hover:shadow-[0_0_15px_rgba(0,223,0,0.2)]'
            : 'bg-white border-[#B8D1C3] hover:border-[#087C3B]/70 hover:shadow-md'
        }`}
        aria-label={`Entrar no setor ${u.name}. ${count} soluções disponíveis.`}
      >
        {/* Icon Frame */}
        <div
          className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center shrink-0 border transition-all ${
            isSelected
              ? isDark
                ? 'bg-[#00DF00] text-black border-[#00DF00] shadow-[0_0_10px_#00DF00]'
                : 'bg-[#087C3B] text-white border-[#087C3B] shadow-[0_2px_8px_rgba(8,124,59,0.3)]'
              : isIndustria
              ? isDark
                ? 'bg-[#00DF00]/15 text-[#00DF00] border-[#00DF00]/50 group-hover:bg-[#00DF00] group-hover:text-black shadow-[0_0_10px_rgba(0,223,0,0.2)]'
                : 'bg-[#D7EBDD] text-[#087C3B] border-[#087C3B]/50 group-hover:bg-[#087C3B] group-hover:text-white'
              : isDark
              ? 'bg-zinc-900/90 text-[#00DF00] border-zinc-800 group-hover:border-[#00DF00]/50 group-hover:scale-105'
              : 'bg-[#D7EBDD] text-[#087C3B] border-[#B8D1C3] group-hover:border-[#087C3B] group-hover:scale-105'
          }`}
        >
          {renderIcon(u.iconName, 'w-4 h-4')}
        </div>

        {/* Sector Metadata */}
        <div className="flex-1 min-w-0 pr-1">
          <h2
            className={`text-xs sm:text-sm font-bold font-heading tracking-tight leading-snug transition-colors break-normal ${
              isDark ? 'text-white group-hover:text-[#00DF00]' : 'text-[#172C22] group-hover:text-[#087C3B]'
            }`}
          >
            {u.name}
          </h2>
          <span
            className={`text-[10px] font-mono font-medium flex items-center gap-1 mt-0.5 ${
              isDark ? 'text-zinc-400' : 'text-[#4A6B5B]'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isDark ? 'bg-[#00DF00]' : 'bg-[#087C3B]'
              } ${isIndustria ? 'animate-pulse' : ''}`}
            />
            <span className={isIndustria ? (isDark ? 'text-zinc-300 font-semibold' : 'text-[#172C22] font-semibold') : ''}>
              {count} {count === 1 ? 'solução' : 'soluções'}
            </span>
          </span>
        </div>

        {/* Arrow Cue */}
        <ChevronRight
          className={`w-4 h-4 transition-all shrink-0 ${
            isDark
              ? 'text-zinc-500 group-hover:text-[#00DF00] group-hover:translate-x-0.5'
              : 'text-[#6B8B7B] group-hover:text-[#087C3B] group-hover:translate-x-0.5'
          }`}
        />
      </button>
    );
  };

  return (
    <section
      aria-label="Visão Geral dos Setores de Mercado"
      className={`relative flex-1 w-full min-h-[calc(100dvh-60px)] overflow-y-auto overflow-x-hidden flex flex-col justify-between select-none px-3 sm:px-4 py-2 sm:py-3 transition-colors duration-200 ${
        isDark ? 'bg-[#0B1115] text-white' : 'bg-[#E6EFEB] text-[#172C22]'
      }`}
    >
      {/* Background Cyber Glow */}
      <div
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] pointer-events-none ${
          isDark
            ? 'bg-[radial-gradient(circle_at_center,rgba(0,223,0,0.08)_0%,transparent_75%)]'
            : 'bg-[radial-gradient(circle_at_center,rgba(8,124,59,0.06)_0%,transparent_75%)]'
        }`}
      />

      {/* 1. HEADER SECTION */}
      <div className="text-center pt-1 pb-1.5 px-2 z-20 shrink-0 max-w-md mx-auto w-full">
        <div
          className={`inline-flex items-center gap-2 px-3 py-0.5 rounded-full text-[10px] font-mono font-semibold uppercase tracking-wider mb-1 ${
            isDark
              ? 'bg-zinc-950/90 border border-[#00DF00]/40 text-[#00DF00] shadow-[0_0_12px_rgba(0,223,0,0.2)]'
              : 'bg-white border border-[#B8D1C3] text-[#087C3B] shadow-sm'
          }`}
        >
          <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${isDark ? 'bg-[#00DF00]' : 'bg-[#087C3B]'}`} />
          <span>PORTFÓLIO INTERATIVO</span>
          <span className={isDark ? 'text-zinc-600' : 'text-zinc-300'}>|</span>
          <span className={isDark ? 'text-zinc-400' : 'text-[#4A6B5B]'}>6 SETORES</span>
        </div>

        <h1
          className={`text-lg sm:text-2xl font-black font-heading tracking-tight leading-tight ${
            isDark ? 'text-white' : 'text-[#172C22]'
          }`}
        >
          Explore nossas tecnologias
        </h1>

        <p
          className={`text-[11px] sm:text-xs mt-0.5 max-w-xs mx-auto leading-relaxed ${
            isDark ? 'text-zinc-400' : 'text-[#4A6B5B]'
          }`}
        >
          Selecione um setor para conhecer nossas soluções conectadas.
        </p>
      </div>

      {/* 2. CENTRAL TECHNOLOGICAL NETWORK & SECTOR CARDS */}
      <div className="relative z-20 flex-1 flex flex-col items-center justify-center max-w-md mx-auto w-full my-auto px-1">
        
        {/* ======================================================== */}
        {/* A) PORTRAIT VIEW (Default on phones: 2-column balanced) */}
        {/* ======================================================== */}
        <div className="flex flex-col gap-2 sm:gap-2.5 w-full landscape:hidden">
          
          {/* TOP PAIR (Saneamento & Indústria) */}
          <div className="grid grid-cols-2 gap-2 sm:gap-2.5 w-full">
            {topSectors.map((uId) => renderSectorButton(uId))}
          </div>

          {/* CENTRAL PROMINENT WBM TECHNOLOGY NUCLEUS */}
          <div className="relative w-full my-0.5 flex flex-col items-center justify-center">
            {/* Ambient Pulse Halo */}
            <div
              className={`absolute w-44 h-12 rounded-full blur-lg pointer-events-none animate-pulse-subtle ${
                isDark ? 'bg-[#00DF00]/15' : 'bg-[#087C3B]/10'
              }`}
            />

            {/* Central Core Card */}
            <div
              data-testid="wbm-central-nucleus"
              className={`relative z-10 w-full max-w-[280px] sm:max-w-xs px-3 sm:px-4 py-2 sm:py-2.5 rounded-2xl border flex items-center justify-between gap-2 shadow-lg transition-all ${
                isDark
                  ? 'bg-gradient-to-r from-[#131F24] via-[#19282E] to-[#131F24] border-[#00DF00]/60 shadow-[0_0_25px_rgba(0,223,0,0.25)]'
                  : 'bg-white border-[#087C3B] shadow-[0_4px_18px_rgba(8,124,59,0.2)]'
              }`}
            >
              {/* Left Beacon */}
              <div className="flex items-center gap-1.5 shrink-0">
                <span className={`w-2 h-2 rounded-full animate-ping ${isDark ? 'bg-[#00DF00]' : 'bg-[#087C3B]'}`} />
                <span className={`w-1.5 h-1.5 rounded-full ${isDark ? 'bg-[#00DF00]' : 'bg-[#087C3B]'}`} />
              </div>

              {/* Official WBM 3D Logo */}
              <div className="flex-1 flex items-center justify-center px-1">
                <img
                  src="/assets/WBM_LOGO_3D_HORIZONTAL.png"
                  alt="WBM Technology"
                  className={`h-5 sm:h-6.5 w-auto object-contain transition-all ${
                    isDark
                      ? 'drop-shadow-[0_0_8px_rgba(0,223,0,0.6)]'
                      : 'drop-shadow-[0_1px_4px_rgba(8,124,59,0.35)]'
                  }`}
                />
              </div>

              {/* Right IoT Badge */}
              <div
                className={`text-[8.5px] sm:text-[9.5px] font-mono font-bold tracking-wider uppercase px-2 py-0.5 rounded-full border shrink-0 ${
                  isDark
                    ? 'bg-black/60 border-[#00DF00]/40 text-[#00DF00]'
                    : 'bg-[#D7EBDD] border-[#B8D1C3] text-[#087C3B]'
                }`}
              >
                NÚCLEO IoT
              </div>
            </div>

            {/* Glowing Tech Conduits (connecting Core to Top & Bottom rows) */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none -z-10 overflow-visible"
              viewBox="0 0 320 60"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Conduits to Top Left (Saneamento) & Top Right (Indústria) */}
              <line x1="80" y1="0" x2="130" y2="30" stroke={isDark ? '#00DF00' : '#087C3B'} strokeWidth="1.2" strokeOpacity={isDark ? "0.4" : "0.35"} strokeDasharray="3 2" />
              <line x1="240" y1="0" x2="190" y2="30" stroke={isDark ? '#00DF00' : '#087C3B'} strokeWidth="1.2" strokeOpacity={isDark ? "0.4" : "0.35"} strokeDasharray="3 2" />
              {/* Conduits to Bottom Left (Piscicultura) & Bottom Right (Bioflorestal) */}
              <line x1="130" y1="30" x2="80" y2="60" stroke={isDark ? '#00DF00' : '#087C3B'} strokeWidth="1.2" strokeOpacity={isDark ? "0.4" : "0.35"} strokeDasharray="3 2" />
              <line x1="190" y1="30" x2="240" y2="60" stroke={isDark ? '#00DF00' : '#087C3B'} strokeWidth="1.2" strokeOpacity={isDark ? "0.4" : "0.35"} strokeDasharray="3 2" />
            </svg>
          </div>

          {/* MIDDLE PAIR (Piscicultura & Bioflorestal) */}
          <div className="grid grid-cols-2 gap-2 sm:gap-2.5 w-full">
            {midSectors.map((uId) => renderSectorButton(uId))}
          </div>

          {/* BOTTOM PAIR (Energia & Pesquisa e Laboratórios) */}
          <div className="grid grid-cols-2 gap-2 sm:gap-2.5 w-full">
            {bottomSectors.map((uId) => renderSectorButton(uId))}
          </div>

        </div>

        {/* ======================================================== */}
        {/* B) LANDSCAPE VIEW (Optimized for short height: 3-column)  */}
        {/* ======================================================== */}
        <div className="hidden landscape:grid landscape:grid-cols-[1fr_210px_1fr] landscape:gap-3.5 w-full max-w-5xl items-center px-2">
          
          {/* Left Column (3 sectors) */}
          <div className="flex flex-col gap-2">
            {leftLandscapeSectors.map((uId) => renderSectorButton(uId, true))}
          </div>

          {/* Center Column: WBM Technology Core */}
          <div className="flex flex-col items-center justify-center p-1 text-center">
            <div
              className={`w-full max-w-[200px] p-3 rounded-2xl border flex flex-col items-center justify-center gap-2 shadow-lg ${
                isDark
                  ? 'bg-gradient-to-b from-[#131F24] via-[#19282E] to-[#0B1115] border-[#00DF00]/60 shadow-[0_0_25px_rgba(0,223,0,0.3)]'
                  : 'bg-white border-[#087C3B] shadow-[0_4px_20px_rgba(8,124,59,0.2)]'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full animate-ping ${isDark ? 'bg-[#00DF00]' : 'bg-[#087C3B]'}`} />
                <span className={`text-[8.5px] font-mono font-bold uppercase tracking-wider ${isDark ? 'text-[#00DF00]' : 'text-[#087C3B]'}`}>
                  NÚCLEO IoT & CONTROLE
                </span>
              </div>

              <img
                src="/assets/WBM_LOGO_3D_HORIZONTAL.png"
                alt="WBM Technology"
                className={`h-5 sm:h-6 w-auto object-contain transition-all ${
                  isDark
                    ? 'drop-shadow-[0_0_10px_rgba(0,223,0,0.6)]'
                    : 'drop-shadow-[0_1px_5px_rgba(8,124,59,0.35)]'
                }`}
              />

              <span className={`text-[9px] font-medium leading-tight ${isDark ? 'text-zinc-400' : 'text-[#4A6B5B]'}`}>
                Da Informação ao Controle
              </span>
            </div>
          </div>

          {/* Right Column (3 sectors) */}
          <div className="flex flex-col gap-2">
            {rightLandscapeSectors.map((uId) => renderSectorButton(uId, true))}
          </div>

        </div>

      </div>

      {/* 3. FOOTER GUIDANCE HINT */}
      <div className="relative z-20 text-center py-1 shrink-0 max-w-md mx-auto w-full">
        <p className={`text-[10px] sm:text-[11px] font-mono flex items-center justify-center gap-1.5 ${isDark ? 'text-zinc-400' : 'text-[#4A6B5B]'}`}>
          <span className={`w-1.5 h-1.5 rounded-full animate-ping ${isDark ? 'bg-[#00DF00]/70' : 'bg-[#087C3B]/70'}`} />
          <span>Toque em um setor para explorar o ecossistema</span>
        </p>
      </div>
    </section>
  );
};
