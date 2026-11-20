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

interface MobileSectorOverviewProps {
  onSelectUniverse: (universeId: UniverseId) => void;
}

export const MobileSectorOverview: React.FC<MobileSectorOverviewProps> = ({
  onSelectUniverse,
}) => {
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
      className="relative flex-1 w-full overflow-hidden flex flex-col justify-between select-none bg-black text-white px-3 py-2"
    >
      {/* Background Cyber Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] bg-[radial-gradient(circle_at_center,rgba(0,223,0,0.08)_0%,transparent_75%)] pointer-events-none" />

      {/* 1. HEADER SECTION (Título e Descrição do Usuário) */}
      <div className="text-center pt-1.5 pb-2 px-2 z-20 shrink-0 max-w-md mx-auto w-full">
        <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-zinc-950/90 border border-[#00DF00]/40 text-[10px] font-mono font-semibold text-[#00DF00] uppercase tracking-wider mb-1.5 shadow-[0_0_12px_rgba(0,223,0,0.2)]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00DF00] animate-pulse" />
          <span>PORTFÓLIO INTERATIVO</span>
          <span className="text-zinc-600">|</span>
          <span className="text-zinc-400">6 SETORES</span>
        </div>

        <h1 className="text-xl sm:text-2xl font-black font-heading text-white tracking-tight leading-tight">
          Explore nossas tecnologias
        </h1>

        <p className="text-xs text-zinc-400 mt-1 max-w-xs mx-auto leading-relaxed">
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
            stroke="#00DF00"
            strokeWidth={selectedSector === 'saneamento' ? '2.5' : '1.2'}
            strokeOpacity={selectedSector === 'saneamento' ? '0.9' : '0.28'}
            strokeDasharray={selectedSector === 'saneamento' ? 'none' : '3 3'}
            filter={selectedSector === 'saneamento' ? 'url(#overviewGlow)' : undefined}
          />
          {/* Left Mid: Energia (95, 170) */}
          <path
            d="M 190 170 L 95 170"
            stroke="#00DF00"
            strokeWidth={selectedSector === 'energia' ? '2.5' : '1.2'}
            strokeOpacity={selectedSector === 'energia' ? '0.9' : '0.28'}
            strokeDasharray={selectedSector === 'energia' ? 'none' : '3 3'}
            filter={selectedSector === 'energia' ? 'url(#overviewGlow)' : undefined}
          />
          {/* Left Bottom: Pesquisa (95, 285) */}
          <path
            d="M 190 170 Q 140 230 95 285"
            stroke="#00DF00"
            strokeWidth={selectedSector === 'pesquisa-laboratorios' ? '2.5' : '1.2'}
            strokeOpacity={selectedSector === 'pesquisa-laboratorios' ? '0.9' : '0.28'}
            strokeDasharray={selectedSector === 'pesquisa-laboratorios' ? 'none' : '3 3'}
            filter={selectedSector === 'pesquisa-laboratorios' ? 'url(#overviewGlow)' : undefined}
          />

          {/* Right Top: Indústria (285, 55) */}
          <path
            d="M 190 170 Q 240 110 285 55"
            stroke="#00DF00"
            strokeWidth={selectedSector === 'industria' ? '2.5' : '1.4'}
            strokeOpacity={selectedSector === 'industria' ? '0.95' : '0.35'}
            strokeDasharray={selectedSector === 'industria' ? 'none' : '3 3'}
            filter={selectedSector === 'industria' ? 'url(#overviewGlow)' : undefined}
          />
          {/* Right Mid: Piscicultura (285, 170) */}
          <path
            d="M 190 170 L 285 170"
            stroke="#00DF00"
            strokeWidth={selectedSector === 'piscicultura' ? '2.5' : '1.2'}
            strokeOpacity={selectedSector === 'piscicultura' ? '0.9' : '0.28'}
            strokeDasharray={selectedSector === 'piscicultura' ? 'none' : '3 3'}
            filter={selectedSector === 'piscicultura' ? 'url(#overviewGlow)' : undefined}
          />
          {/* Right Bottom: Bioflorestal (285, 285) */}
          <path
            d="M 190 170 Q 240 230 285 285"
            stroke="#00DF00"
            strokeWidth={selectedSector === 'bioflorestal' ? '2.5' : '1.2'}
            strokeOpacity={selectedSector === 'bioflorestal' ? '0.9' : '0.28'}
            strokeDasharray={selectedSector === 'bioflorestal' ? 'none' : '3 3'}
            filter={selectedSector === 'bioflorestal' ? 'url(#overviewGlow)' : undefined}
          />

          {/* Animated Pulses on Indústria & Saneamento main conduits */}
          <circle r="2.8" fill="#FFFFFF" filter="url(#overviewGlow)">
            <animateMotion
              path="M 190 170 Q 240 110 285 55"
              dur="1.8s"
              repeatCount="indefinite"
            />
          </circle>
          <circle r="2.5" fill="#00FF00" filter="url(#overviewGlow)">
            <animateMotion
              path="M 190 170 Q 140 110 95 55"
              dur="2.2s"
              repeatCount="indefinite"
            />
          </circle>

          {/* Center Nucleus Graphic in SVG */}
          <g transform="translate(190, 170)">
            <circle r="22" fill="#00DF00" fillOpacity="0.12" filter="url(#overviewGlow)" />
            <circle r="16" fill="#090d09" stroke="#00DF00" strokeWidth="1.5" />
            <circle r="3" fill="#00FF00" />
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
                  className={`group relative flex items-center gap-2.5 p-3 sm:p-3.5 rounded-2xl bg-gradient-to-b from-zinc-900/90 via-zinc-950/95 to-black/95 border text-left transition-all duration-200 active:scale-95 cursor-pointer shadow-lg outline-none ${
                    isSelected
                      ? 'border-[#00DF00] ring-2 ring-[#00DF00]/60 shadow-[0_0_25px_rgba(0,223,0,0.5)] bg-zinc-900'
                      : 'border-zinc-800/90 hover:border-[#00DF00]/70 hover:shadow-[0_0_20px_rgba(0,223,0,0.2)]'
                  }`}
                  aria-label={`Entrar no setor ${u.name}. ${count} soluções disponíveis.`}
                >
                  {/* Icon Frame */}
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border transition-all ${
                      isSelected
                        ? 'bg-[#00DF00] text-black border-[#00DF00] shadow-[0_0_12px_#00DF00]'
                        : 'bg-zinc-900/90 text-[#00DF00] border-zinc-800 group-hover:border-[#00DF00]/50 group-hover:scale-105'
                    }`}
                  >
                    {renderIcon(u.iconName, 'w-4 h-4')}
                  </div>

                  {/* Sector Metadata */}
                  <div className="flex-1 min-w-0">
                    <h2 className="text-xs sm:text-sm font-bold text-white font-heading tracking-tight leading-snug truncate group-hover:text-[#00DF00] transition-colors">
                      {u.name}
                    </h2>
                    <span className="text-[10px] font-mono font-medium text-zinc-400 flex items-center gap-1 mt-0.5">
                      <span className="w-1 h-1 rounded-full bg-[#00DF00]" />
                      <span>{count} soluções</span>
                    </span>
                  </div>

                  {/* Arrow Cue */}
                  <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-[#00DF00] group-hover:translate-x-0.5 transition-all shrink-0" />
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
                  className={`group relative flex items-center gap-2.5 p-3 sm:p-3.5 rounded-2xl bg-gradient-to-b from-zinc-900/90 via-zinc-950/95 to-black/95 border text-left transition-all duration-200 active:scale-95 cursor-pointer shadow-lg outline-none ${
                    isSelected
                      ? 'border-[#00DF00] ring-2 ring-[#00DF00]/60 shadow-[0_0_25px_rgba(0,223,0,0.5)] bg-zinc-900'
                      : isIndustria
                      ? 'border-[#00DF00]/45 hover:border-[#00DF00] hover:shadow-[0_0_25px_rgba(0,223,0,0.3)]'
                      : 'border-zinc-800/90 hover:border-[#00DF00]/70 hover:shadow-[0_0_20px_rgba(0,223,0,0.2)]'
                  }`}
                  aria-label={`Entrar no setor ${u.name}. ${count} soluções disponíveis.`}
                >
                  {/* Icon Frame */}
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border transition-all ${
                      isSelected
                        ? 'bg-[#00DF00] text-black border-[#00DF00] shadow-[0_0_12px_#00DF00]'
                        : isIndustria
                        ? 'bg-[#00DF00]/15 text-[#00DF00] border-[#00DF00]/50 group-hover:bg-[#00DF00] group-hover:text-black group-hover:scale-105 shadow-[0_0_10px_rgba(0,223,0,0.25)]'
                        : 'bg-zinc-900/90 text-[#00DF00] border-zinc-800 group-hover:border-[#00DF00]/50 group-hover:scale-105'
                    }`}
                  >
                    {renderIcon(u.iconName, 'w-4 h-4')}
                  </div>

                  {/* Sector Metadata */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h2 className="text-xs sm:text-sm font-bold text-white font-heading tracking-tight leading-snug truncate group-hover:text-[#00DF00] transition-colors">
                        {u.name}
                      </h2>
                    </div>
                    <span className="text-[10px] font-mono font-medium text-zinc-400 flex items-center gap-1 mt-0.5">
                      <span className={`w-1 h-1 rounded-full ${isIndustria ? 'bg-[#00DF00] animate-pulse' : 'bg-[#00DF00]'}`} />
                      <span className={isIndustria ? 'text-zinc-300 font-semibold' : ''}>{count} soluções</span>
                    </span>
                  </div>

                  {/* Arrow Cue */}
                  <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-[#00DF00] group-hover:translate-x-0.5 transition-all shrink-0" />
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
