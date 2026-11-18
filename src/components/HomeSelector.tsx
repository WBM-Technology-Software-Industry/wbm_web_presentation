import React, { useState, useEffect } from 'react';
import { SlidersHorizontal, ScrollText, ArrowRight, ShieldCheck, Cpu, Sparkles } from 'lucide-react';
import { ConnectedNetworkCanvas } from './ui/ConnectedNetworkCanvas';

interface HomeSelectorProps {
  onSelectMode: (mode: 'slides' | 'vertical') => void;
}

export const HomeSelector: React.FC<HomeSelectorProps> = ({ onSelectMode }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Trigger smooth entrance sequence
    const timer = setTimeout(() => setMounted(true), 40);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative min-h-[calc(100vh-65px)] w-full flex flex-col justify-center items-center px-4 py-8 sm:py-12 bg-black overflow-hidden">
      {/* Dynamic Connected Engineering Network Background */}
      <ConnectedNetworkCanvas />

      {/* Subtle radial depth aura in background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] sm:w-[900px] h-[500px] bg-[radial-gradient(circle_at_center,rgba(0,223,0,0.045)_0%,transparent_70%)] pointer-events-none z-0" />

      <div className="relative z-10 max-w-4xl mx-auto w-full text-center space-y-6 sm:space-y-8">
        
        {/* Top Tag - Stagger 1 */}
        <div
          className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-950/90 border border-[#00DF00]/40 text-[#00DF00] text-xs font-mono tracking-wider shadow-[0_0_15px_rgba(0,223,0,0.2)] animate-pulse-subtle transition-all duration-500 delay-100 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
          }`}
        >
          <Cpu className="w-3.5 h-3.5" />
          <span>Apresentação Institucional Digital</span>
        </div>

        {/* Main Logo & Title - Stagger 2 & 3 */}
        <div className="space-y-4">
          <div
            className={`flex justify-center transition-all duration-600 delay-200 ${
              mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`}
          >
            <img
              src="/assets/wbm-logo-clean.png"
              alt="WBM Technology"
              className="h-16 sm:h-20 md:h-24 w-auto object-contain drop-shadow-[0_0_25px_rgba(0,223,0,0.5)]"
            />
          </div>

          <h1
            className={`text-xl sm:text-2xl md:text-4xl lg:text-5xl font-extrabold text-white tracking-tight font-heading max-w-3xl mx-auto leading-tight transition-all duration-600 delay-350 ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
            }`}
          >
            Transformamos desafios industriais em{' '}
            <span className="text-[#00DF00] drop-shadow-[0_0_15px_rgba(0,223,0,0.6)]">
              soluções inteligentes
            </span>
            .
          </h1>

          <p
            className={`text-xs sm:text-sm md:text-base lg:text-lg text-zinc-300 max-w-2xl mx-auto leading-relaxed font-normal transition-all duration-600 delay-500 ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
            }`}
          >
            Ajudamos empresas a melhorar o desempenho de suas operações por meio de engenharia, automação e tecnologias conectadas.
          </p>
        </div>

        {/* Two Choice Cards - Stagger 4 & 5 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 pt-2 max-w-3xl mx-auto text-left">
          
          {/* Option A: Slide Presentation */}
          <button
            onClick={() => onSelectMode('slides')}
            className={`group relative flex flex-col justify-between p-6 sm:p-7 rounded-2xl sm:rounded-3xl bg-gradient-to-b from-zinc-900/90 via-zinc-950/95 to-[#030603] border-2 border-[#00DF00]/50 hover:border-[#00DF00] transition-all duration-300 shadow-[0_0_20px_rgba(0,223,0,0.12)] hover:shadow-[0_0_35px_rgba(0,223,0,0.35)] hover:-translate-y-1.5 hover:scale-[1.01] active:scale-98 ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            } transition-all duration-600 delay-700`}
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#00DF00]/15 border border-[#00DF00]/60 flex items-center justify-center text-[#00DF00] mb-4 group-hover:scale-110 group-hover:bg-[#00DF00]/25 group-hover:shadow-[0_0_20px_rgba(0,223,0,0.4)] transition-all duration-300 shadow-[0_0_15px_rgba(0,223,0,0.3)]">
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

            <div className="flex items-center gap-2 text-xs font-bold text-[#00DF00] mt-6 pt-4 border-t border-zinc-800/80">
              <span>Iniciar Apresentação</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5" />
            </div>
          </button>

          {/* Option B: Vertical Scroll Presentation */}
          <button
            onClick={() => onSelectMode('vertical')}
            className={`group relative flex flex-col justify-between p-6 sm:p-7 rounded-2xl sm:rounded-3xl bg-gradient-to-b from-zinc-900/90 via-zinc-950/95 to-[#030603] border-2 border-zinc-800 hover:border-[#00DF00] transition-all duration-300 shadow-lg hover:shadow-[0_0_35px_rgba(0,223,0,0.35)] hover:-translate-y-1.5 hover:scale-[1.01] active:scale-98 ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            } transition-all duration-600 delay-850`}
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-zinc-800/80 border border-zinc-700 group-hover:border-[#00DF00]/60 group-hover:bg-[#00DF00]/15 flex items-center justify-center text-zinc-200 group-hover:text-[#00DF00] mb-4 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(0,223,0,0.4)] transition-all duration-300">
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

            <div className="flex items-center gap-2 text-xs font-bold text-zinc-300 group-hover:text-[#00DF00] mt-6 pt-4 border-t border-zinc-800/80 transition-colors">
              <span>Explorar Página Única</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5" />
            </div>
          </button>

        </div>

        {/* Footnote reassurance - Stagger 6 */}
        <div
          className={`flex items-center justify-center gap-4 text-[11px] sm:text-xs text-zinc-500 pt-2 font-mono transition-all duration-500 delay-1000 ${
            mounted ? 'opacity-100' : 'opacity-0'
          }`}
        >
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
