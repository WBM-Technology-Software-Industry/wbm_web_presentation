import React, { useState, useEffect } from 'react';
import { SlidersHorizontal, ScrollText, Compass, ArrowRight, ShieldCheck, Cpu, Sparkles } from 'lucide-react';
import { ConnectedNetworkCanvas } from './ui/ConnectedNetworkCanvas';
import { useTheme } from '../context/ThemeContext';

interface HomeSelectorProps {
  onSelectMode: (mode: 'slides' | 'vertical' | 'portfolio') => void;
}

export const HomeSelector: React.FC<HomeSelectorProps> = ({ onSelectMode }) => {
  const [mounted, setMounted] = useState(false);
  const { isDark } = useTheme();

  useEffect(() => {
    // Trigger smooth entrance sequence
    const timer = setTimeout(() => setMounted(true), 40);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative min-h-[calc(100vh-65px)] w-full flex flex-col justify-center items-center px-4 py-8 sm:py-12 bg-[var(--wbm-bg)] text-[var(--wbm-text)] overflow-hidden transition-colors duration-200">
      {/* Dynamic Connected Engineering Network Background */}
      <ConnectedNetworkCanvas />

      {/* Engineering Depth Gradient Overlay in Light Tech / Dark Tech */}
      <div
        className={`absolute inset-0 pointer-events-none z-0 transition-opacity duration-300 ${
          isDark
            ? 'bg-[radial-gradient(circle_at_center,rgba(0,223,0,0.045)_0%,transparent_70%)]'
            : 'bg-[radial-gradient(ellipse_80%_65%_at_50%_35%,#EDF4F0_0%,#E6EFEB_65%,#DFE9E4_100%)]'
        }`}
      />

      {/* Subtle radial emerald depth aura in center */}
      <div
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] sm:w-[950px] h-[520px] pointer-events-none z-0 transition-opacity duration-300 ${
          isDark
            ? 'bg-[radial-gradient(circle_at_center,rgba(0,223,0,0.045)_0%,transparent_70%)]'
            : 'bg-[radial-gradient(circle_at_center,rgba(8,124,59,0.08)_0%,transparent_70%)]'
        }`}
      />

      <div className="relative z-10 max-w-4xl mx-auto w-full text-center space-y-6 sm:space-y-8">
        
        {/* Top Tag - Stagger 1 */}
        <div
          className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono tracking-wider transition-all duration-500 delay-100 ${
            isDark
              ? 'bg-zinc-950/90 border border-[#00DF00]/40 text-[#00DF00] shadow-[0_0_15px_rgba(0,223,0,0.2)] animate-pulse-subtle'
              : 'bg-white border border-[#B8D1C3] text-[#087C3B] shadow-[0_2px_8px_rgba(8,124,59,0.08)]'
          } ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}
        >
          <Cpu className="w-3.5 h-3.5" />
          <span>Apresentação Institucional Digital</span>
        </div>

        {/* Main Logo & Title - Stagger 2 & 3 */}
        <div className="space-y-3 sm:space-y-4">
          <div
            className={`flex justify-center transition-all duration-600 delay-200 ${
              mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`}
          >
            <img
              src="/assets/WBM_LOGO_3D_HORIZONTAL.png"
              alt="WBM Technology"
              className={`h-16 sm:h-20 md:h-24 w-auto object-contain transition-all duration-300 ${
                isDark
                  ? 'drop-shadow-[0_0_25px_rgba(0,223,0,0.5)]'
                  : 'drop-shadow-[0_4px_14px_rgba(8,124,59,0.18)]'
              }`}
            />
          </div>

          <h1
            className={`text-xl sm:text-2xl md:text-4xl lg:text-5xl font-extrabold tracking-tight font-heading max-w-3xl mx-auto leading-tight transition-all duration-600 delay-350 ${
              isDark ? 'text-white' : 'text-[#172C22]'
            } ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}`}
          >
            Transformamos desafios industriais em{' '}
            <span
              className={
                isDark
                  ? 'text-[#00DF00] drop-shadow-[0_0_15px_rgba(0,223,0,0.6)]'
                  : 'text-[#087C3B]'
              }
            >
              soluções inteligentes
            </span>
            .
          </h1>

          <p
            className={`text-xs sm:text-sm md:text-base lg:text-lg max-w-2xl lg:max-w-3xl mx-auto leading-relaxed font-normal transition-all duration-600 delay-500 ${
              isDark ? 'text-zinc-300' : 'text-[#4A6B5B]'
            } ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}
          >
            Ajudamos empresas que enfrentam desafios de monitoramento e controle a ter mais visibilidade, eficiência e domínio de suas operações por meio de soluções próprias de engenharia e tecnologia.
          </p>
        </div>

        {/* Three Choice Cards - Stagger 4, 5 & 6 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 pt-2 max-w-5xl mx-auto text-left">
          
          {/* Option A: Slide Presentation */}
          <button
            onClick={() => onSelectMode('slides')}
            className={`group relative flex flex-col justify-between p-6 sm:p-7 rounded-2xl sm:rounded-3xl border-2 transition-all duration-300 hover:-translate-y-1.5 hover:scale-[1.01] active:scale-98 ${
              isDark
                ? 'bg-gradient-to-b from-zinc-900/90 via-zinc-950/95 to-[#030603] border-[#00DF00]/50 hover:border-[#00DF00] shadow-[0_0_20px_rgba(0,223,0,0.12)] hover:shadow-[0_0_35px_rgba(0,223,0,0.35)]'
                : 'bg-white border-[#B8D1C3] hover:border-[#087C3B] shadow-[0_4px_20px_rgba(8,124,59,0.08)] hover:shadow-[0_10px_32px_rgba(8,124,59,0.18)]'
            } ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            } transition-all duration-600 delay-700`}
          >
            <div>
              <div
                className={`w-12 h-12 rounded-2xl border flex items-center justify-center mb-4 group-hover:scale-110 transition-all duration-300 ${
                  isDark
                    ? 'bg-[#00DF00]/15 border-[#00DF00]/60 text-[#00DF00] group-hover:bg-[#00DF00]/25 group-hover:shadow-[0_0_20px_rgba(0,223,0,0.4)] shadow-[0_0_15px_rgba(0,223,0,0.3)]'
                    : 'bg-[#D7EBDD] border-[#B8D1C3] text-[#087C3B] group-hover:bg-[#C8E4D0] group-hover:border-[#087C3B] group-hover:shadow-[0_0_16px_rgba(8,124,59,0.25)] shadow-sm'
                }`}
              >
                <SlidersHorizontal className="w-6 h-6 stroke-[2.2]" />
              </div>

              <div
                className={`text-[11px] font-mono uppercase tracking-wider mb-1 ${
                  isDark ? 'text-[#00DF00]' : 'text-[#087C3B] font-bold'
                }`}
              >
                Modo A · Dinâmico
              </div>

              <h2
                className={`text-lg sm:text-xl font-extrabold font-heading transition-colors ${
                  isDark
                    ? 'text-white group-hover:text-[#00DF00]'
                    : 'text-[#172C22] group-hover:text-[#087C3B]'
                }`}
              >
                Apresentação em slides
              </h2>

              <p
                className={`text-xs sm:text-sm mt-2 leading-relaxed font-normal ${
                  isDark ? 'text-zinc-400' : 'text-[#4A6B5B]'
                }`}
              >
                Navegação interativa por slides, gestos de deslizar no celular, modo tela cheia e suporte a teclado.
              </p>
            </div>

            <div
              className={`flex items-center gap-2 text-xs font-bold mt-6 pt-4 border-t transition-colors ${
                isDark
                  ? 'border-zinc-800/80 text-[#00DF00]'
                  : 'border-[#E2EDE6] text-[#087C3B] group-hover:text-[#0A9446]'
              }`}
            >
              <span>Iniciar Apresentação</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5" />
            </div>
          </button>

          {/* Option B: Vertical Scroll Presentation */}
          <button
            onClick={() => onSelectMode('vertical')}
            className={`group relative flex flex-col justify-between p-6 sm:p-7 rounded-2xl sm:rounded-3xl border-2 transition-all duration-300 hover:-translate-y-1.5 hover:scale-[1.01] active:scale-98 ${
              isDark
                ? 'bg-gradient-to-b from-zinc-900/90 via-zinc-950/95 to-[#030603] border-zinc-800 hover:border-[#00DF00] shadow-lg hover:shadow-[0_0_35px_rgba(0,223,0,0.35)]'
                : 'bg-white border-[#B8D1C3] hover:border-[#087C3B] shadow-[0_4px_20px_rgba(8,124,59,0.08)] hover:shadow-[0_10px_32px_rgba(8,124,59,0.18)]'
            } ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            } transition-all duration-600 delay-850`}
          >
            <div>
              <div
                className={`w-12 h-12 rounded-2xl border flex items-center justify-center mb-4 group-hover:scale-110 transition-all duration-300 ${
                  isDark
                    ? 'bg-zinc-800/80 border-zinc-700 text-zinc-200 group-hover:border-[#00DF00]/60 group-hover:bg-[#00DF00]/15 group-hover:text-[#00DF00] group-hover:shadow-[0_0_20px_rgba(0,223,0,0.4)]'
                    : 'bg-[#D7EBDD] border-[#B8D1C3] text-[#087C3B] group-hover:bg-[#C8E4D0] group-hover:border-[#087C3B] group-hover:shadow-[0_0_16px_rgba(8,124,59,0.25)] shadow-sm'
                }`}
              >
                <ScrollText className="w-6 h-6 stroke-[2.2]" />
              </div>

              <div
                className={`text-[11px] font-mono uppercase tracking-wider mb-1 transition-colors ${
                  isDark
                    ? 'text-zinc-400 group-hover:text-[#00DF00]'
                    : 'text-[#087C3B] font-bold'
                }`}
              >
                Modo B · Contínuo
              </div>

              <h2
                className={`text-lg sm:text-xl font-extrabold font-heading transition-colors ${
                  isDark
                    ? 'text-white group-hover:text-[#00DF00]'
                    : 'text-[#172C22] group-hover:text-[#087C3B]'
                }`}
              >
                Apresentação vertical
              </h2>

              <p
                className={`text-xs sm:text-sm mt-2 leading-relaxed font-normal ${
                  isDark ? 'text-zinc-400' : 'text-[#4A6B5B]'
                }`}
              >
                Página única com rolagem contínua, leitura fluida otimizada para WhatsApp e botão de contato direto.
              </p>
            </div>

            <div
              className={`flex items-center gap-2 text-xs font-bold mt-6 pt-4 border-t transition-colors ${
                isDark
                  ? 'border-zinc-800/80 text-zinc-300 group-hover:text-[#00DF00]'
                  : 'border-[#E2EDE6] text-[#087C3B] group-hover:text-[#0A9446]'
              }`}
            >
              <span>Explorar Página Única</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5" />
            </div>
          </button>

          {/* Option C: Interactive Cinematic Portfolio */}
          <button
            onClick={() => onSelectMode('portfolio')}
            className={`group relative flex flex-col justify-between p-6 sm:p-7 rounded-2xl sm:rounded-3xl border-2 transition-all duration-300 hover:-translate-y-1.5 hover:scale-[1.01] active:scale-98 ${
              isDark
                ? 'bg-gradient-to-b from-zinc-900/90 via-zinc-950/95 to-[#030603] border-[#00DF00]/50 hover:border-[#00DF00] shadow-[0_0_25px_rgba(0,223,0,0.18)] hover:shadow-[0_0_35px_rgba(0,223,0,0.35)]'
                : 'bg-white border-[#B8D1C3] hover:border-[#087C3B] shadow-[0_4px_20px_rgba(8,124,59,0.08)] hover:shadow-[0_10px_32px_rgba(8,124,59,0.18)]'
            } ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            } transition-all duration-600 delay-1000`}
          >
            <div>
              <div
                className={`w-12 h-12 rounded-2xl border flex items-center justify-center mb-4 group-hover:scale-110 transition-all duration-300 ${
                  isDark
                    ? 'bg-[#00DF00]/15 border-[#00DF00]/60 text-[#00DF00] group-hover:bg-[#00DF00]/25 group-hover:shadow-[0_0_20px_rgba(0,223,0,0.4)] shadow-[0_0_15px_rgba(0,223,0,0.3)]'
                    : 'bg-[#D7EBDD] border-[#B8D1C3] text-[#087C3B] group-hover:bg-[#C8E4D0] group-hover:border-[#087C3B] group-hover:shadow-[0_0_16px_rgba(8,124,59,0.25)] shadow-sm'
                }`}
              >
                <Compass className="w-6 h-6 stroke-[2.2]" />
              </div>

              <div
                className={`text-[11px] font-mono uppercase tracking-wider mb-1 ${
                  isDark ? 'text-[#00DF00]' : 'text-[#087C3B] font-bold'
                }`}
              >
                Modo C · Cinematográfico
              </div>

              <h2
                className={`text-lg sm:text-xl font-extrabold font-heading transition-colors ${
                  isDark
                    ? 'text-white group-hover:text-[#00DF00]'
                    : 'text-[#172C22] group-hover:text-[#087C3B]'
                }`}
              >
                Portfólio interativo
              </h2>

              <p
                className={`text-xs sm:text-sm mt-2 leading-relaxed font-normal ${
                  isDark ? 'text-zinc-400' : 'text-[#4A6B5B]'
                }`}
              >
                Exploração espacial entre 6 setores de mercado e 15 soluções: Desafio → Solução WBM → Resultado.
              </p>
            </div>

            <div
              className={`flex items-center gap-2 text-xs font-bold mt-6 pt-4 border-t transition-colors ${
                isDark
                  ? 'border-zinc-800/80 text-[#00DF00]'
                  : 'border-[#E2EDE6] text-[#087C3B] group-hover:text-[#0A9446]'
              }`}
            >
              <span>Navegar no Portfólio</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5" />
            </div>
          </button>

        </div>

        {/* Footnote reassurance - Stagger 6 */}
        <div
          className={`flex items-center justify-center gap-4 text-[11px] sm:text-xs pt-2 font-mono transition-all duration-500 delay-1000 ${
            isDark ? 'text-zinc-500' : 'text-[#4A6B5B]'
          } ${mounted ? 'opacity-100' : 'opacity-0'}`}
        >
          <span className="flex items-center gap-1.5">
            <ShieldCheck className={`w-3.5 h-3.5 ${isDark ? 'text-[#00DF00]' : 'text-[#087C3B]'}`} />
            Dados reais da WBM
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5">
            <Sparkles className={`w-3.5 h-3.5 ${isDark ? 'text-[#00DF00]' : 'text-[#087C3B]'}`} />
            Design Responsivo Mobile & Desktop
          </span>
        </div>

      </div>
    </div>
  );
};
