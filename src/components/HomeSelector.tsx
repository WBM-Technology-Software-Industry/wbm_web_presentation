import React from 'react';
import { SlidersHorizontal, ScrollText, ArrowRight, ShieldCheck, Cpu, Sparkles } from 'lucide-react';
import { NetworkMeshBg } from './ui/NetworkMeshBg';

interface HomeSelectorProps {
  onSelectMode: (mode: 'slides' | 'vertical') => void;
}

export const HomeSelector: React.FC<HomeSelectorProps> = ({ onSelectMode }) => {
  return (
    <div className="relative min-h-[calc(100vh-65px)] w-full flex flex-col justify-center items-center px-4 py-8 sm:py-12 bg-black select-none overflow-hidden">
      <NetworkMeshBg />

      <div className="relative z-10 max-w-4xl mx-auto w-full text-center space-y-6 sm:space-y-8">
        
        {/* Top Tag */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-950/90 border border-[#00DF00]/40 text-[#00DF00] text-xs font-mono tracking-wider shadow-[0_0_15px_rgba(0,223,0,0.2)] animate-pulse-subtle">
          <Cpu className="w-3.5 h-3.5" />
          <span>Apresentação Institucional Digital</span>
        </div>

        {/* Main Logo & Title */}
        <div className="space-y-3">
          <div className="flex justify-center">
            <img
              src="/assets/wbm-logo-clean.png"
              alt="WBM Technology"
              className="h-16 sm:h-20 md:h-24 w-auto object-contain drop-shadow-[0_0_25px_rgba(0,223,0,0.5)]"
            />
          </div>

          <h1 className="text-xl sm:text-2xl md:text-4xl font-extrabold text-white tracking-tight font-heading">
            Da informação ao controle.{' '}
            <span className="text-[#00DF00] drop-shadow-[0_0_15px_rgba(0,223,0,0.6)]">
              Do controle ao resultado.
            </span>
          </h1>

          <p className="text-xs sm:text-sm md:text-base text-zinc-400 max-w-xl mx-auto leading-relaxed">
            Soluções completas de instrumentação, automação e IoT para a Indústria 4.0.
            Escolha o formato que deseja explorar:
          </p>
        </div>

        {/* Two Choice Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 pt-4 max-w-3xl mx-auto text-left">
          
          {/* Option A: Slide Presentation */}
          <button
            onClick={() => onSelectMode('slides')}
            className="group relative flex flex-col justify-between p-6 sm:p-7 rounded-2xl sm:rounded-3xl bg-gradient-to-b from-zinc-900/90 via-zinc-950 to-black border-2 border-[#00DF00]/50 hover:border-[#00DF00] transition-all duration-300 shadow-[0_0_25px_rgba(0,223,0,0.15)] hover:shadow-[0_0_35px_rgba(0,223,0,0.4)] hover:-translate-y-1 active:scale-98"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#00DF00]/15 border border-[#00DF00]/60 flex items-center justify-center text-[#00DF00] mb-4 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(0,223,0,0.3)]">
                <SlidersHorizontal className="w-6 h-6 stroke-[2.2]" />
              </div>

              <div className="text-[11px] font-mono text-[#00DF00] uppercase tracking-wider mb-1">
                Modo A · Dinâmico
              </div>

              <h2 className="text-lg sm:text-xl font-extrabold text-white font-heading group-hover:text-[#00DF00] transition-colors">
                Ver apresentação em slides
              </h2>

              <p className="text-xs sm:text-sm text-zinc-400 mt-2 leading-relaxed font-normal">
                Navegação interativa por slides, gestos de deslizar no celular, modo tela cheia e suporte a teclado.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs font-bold text-[#00DF00] mt-6 pt-4 border-t border-zinc-800">
              <span>Iniciar Apresentação</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </div>
          </button>

          {/* Option B: Vertical Scroll Presentation */}
          <button
            onClick={() => onSelectMode('vertical')}
            className="group relative flex flex-col justify-between p-6 sm:p-7 rounded-2xl sm:rounded-3xl bg-gradient-to-b from-zinc-900/90 via-zinc-950 to-black border-2 border-zinc-700 hover:border-[#00DF00] transition-all duration-300 shadow-lg hover:shadow-[0_0_35px_rgba(0,223,0,0.4)] hover:-translate-y-1 active:scale-98"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-zinc-800 border border-zinc-700 group-hover:border-[#00DF00]/60 group-hover:bg-[#00DF00]/15 flex items-center justify-center text-zinc-200 group-hover:text-[#00DF00] mb-4 group-hover:scale-110 transition-transform">
                <ScrollText className="w-6 h-6 stroke-[2.2]" />
              </div>

              <div className="text-[11px] font-mono text-zinc-400 group-hover:text-[#00DF00] uppercase tracking-wider mb-1 transition-colors">
                Modo B · Contínuo
              </div>

              <h2 className="text-lg sm:text-xl font-extrabold text-white font-heading group-hover:text-[#00DF00] transition-colors">
                Explorar apresentação vertical
              </h2>

              <p className="text-xs sm:text-sm text-zinc-400 mt-2 leading-relaxed font-normal">
                Página única com rolagem contínua, leitura fluida otimizada para WhatsApp e botão de contato direto.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs font-bold text-zinc-300 group-hover:text-[#00DF00] mt-6 pt-4 border-t border-zinc-800 transition-colors">
              <span>Explorar Página Única</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </div>
          </button>

        </div>

        {/* Footnote reassurance */}
        <div className="flex items-center justify-center gap-4 text-[11px] sm:text-xs text-zinc-500 pt-2 font-mono">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#00DF00]" />
            Dados reais da WBM
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#00DF00]" />
            Design Responsivo Mobile & Desktop
          </span>
        </div>

      </div>
    </div>
  );
};
