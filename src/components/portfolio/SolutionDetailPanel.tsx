import React, { useState, useEffect, useRef } from 'react';
import {
  ProductId,
  UniverseId,
  PRODUCTS,
  UNIVERSES,
  getProductUniverseContext,
  getUniversesForProduct,
  getRelatedProductsForContext,
} from '../../data/portfolioData';
import {
  X,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  MessageSquare,
  ChevronRight,
  ChevronDown,
  Workflow,
  Sliders,
  Gauge,
  Cpu,
  LayoutDashboard,
  Cog,
  Droplets,
  Factory,
  Fish,
  Trees,
  Zap,
  FlaskConical,
  Compass,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface SolutionDetailPanelProps {
  productId: ProductId | null;
  universeId: UniverseId | null;
  onClose: () => void;
  onSelectOtherUniverse?: (universeId: UniverseId) => void;
  onSelectProduct?: (productId: ProductId) => void;
}

export const SolutionDetailPanel: React.FC<SolutionDetailPanelProps> = ({
  productId,
  universeId,
  onClose,
  onSelectOtherUniverse,
  onSelectProduct,
}) => {
  const { isDark } = useTheme();
  const panelRef = useRef<HTMLDivElement>(null);
  const contentBodyRef = useRef<HTMLDivElement>(null);
  const [techDetailsOpen, setTechDetailsOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      return new URLSearchParams(window.location.search).get('tech') === 'open';
    }
    return false;
  });

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Reset technical details accordion whenever product or universe changes (unless forced by URL)
  useEffect(() => {
    if (typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('tech') === 'open') {
      setTechDetailsOpen(true);
      return;
    }
    setTechDetailsOpen(false);
  }, [productId, universeId]);

  // Scroll panel content to top whenever a new product is selected
  useEffect(() => {
    if (contentBodyRef.current) {
      contentBodyRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [productId]);

  if (!productId || !universeId) return null;

  const product = PRODUCTS[productId];
  const universe = UNIVERSES[universeId];
  const context = getProductUniverseContext(productId, universeId);

  if (!product || !universe || !context) return null;

  // Related products within the same universe (max 2)
  const relatedProducts = getRelatedProductsForContext(productId, universeId);

  // Other universes where this product is also applied
  const otherUniverses = getUniversesForProduct(productId).filter((u) => u.id !== universeId);

  // Universe icon helper
  const renderUniverseIcon = (iconName: string, className = 'w-4 h-4') => {
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

  // Workflow step icon helper
  const renderWorkflowIcon = (iconType: string, className = 'w-4 h-4') => {
    switch (iconType) {
      case 'measure':
        return <Gauge className={className} />;
      case 'device':
        return <Cpu className={className} />;
      case 'platform':
        return <LayoutDashboard className={className} />;
      case 'control':
        return <Sliders className={className} />;
      case 'actuator':
        return <Cog className={className} />;
      case 'sample':
        return <Droplets className={className} />;
      default:
        return <Workflow className={className} />;
    }
  };

  // WhatsApp contextualized contact link
  const whatsappNumber = '5531995660752';
  const whatsappMessage = encodeURIComponent(
    `Olá! Gostaria de conversar com a equipe da WBM Technology sobre a solução ${product.name} aplicada ao setor de ${universe.name}.`
  );
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  // Commercial short value headline
  const commercialHeadline = context.shortLabelOverride || product.shortLabel;

  // Technical specifications if available and confirmed
  const techSpecs = product.technicalSpecs;
  const hasTechDetails = Boolean(
    context.technicalNote ||
    (techSpecs && (techSpecs.parameters?.length || techSpecs.installation || techSpecs.features?.length))
  );

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/65 backdrop-blur-sm animate-fadeIn motion-reduce:animate-none"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label={`Detalhes da solução ${product.name}`}
    >
      <div
        ref={panelRef}
        className={`w-full max-w-xl h-full max-h-[100dvh] border-l flex flex-col shadow-2xl overflow-hidden animate-slideLeft motion-reduce:animate-none select-text ${
          isDark ? 'bg-[#0B1115] border-zinc-800 text-white' : 'bg-[#F4F8F6] border-[#B8D1C3] text-[#172C22]'
        }`}
      >
        {/* A. IDENTIFICAÇÃO (HEADER COMERCIAL) */}
        <header className={`relative p-4 sm:p-6 border-b shrink-0 ${
          isDark ? 'bg-[#131F24] border-zinc-800/80' : 'bg-white border-[#B8D1C3] shadow-sm'
        }`}>
          <div className="flex items-center justify-between gap-3 mb-2">
            {/* Sector Badge */}
            <div className={`inline-flex items-center gap-2 px-2.5 sm:px-3 py-1 rounded-full border text-xs font-medium ${
              isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-300' : 'bg-[#D7EBDD] border-[#B8D1C3] text-[#172C22]'
            }`}>
              <span className={isDark ? 'text-[#00DF00]' : 'text-[#087C3B]'}>{renderUniverseIcon(universe.iconName)}</span>
              <span className="truncate max-w-[150px] sm:max-w-none">{universe.name}</span>
            </div>

            {/* Category Badge & Close Button */}
            <div className="flex items-center gap-2">
              <span className={`text-[10.5px] sm:text-[11px] font-mono px-2 py-0.5 rounded border ${
                isDark ? 'border-zinc-800/80 text-zinc-400 bg-zinc-900/40' : 'border-[#B8D1C3] text-[#4A6B5B] bg-[#D7EBDD]'
              }`}>
                {product.category}
              </span>

              <button
                onClick={onClose}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  isDark ? 'text-zinc-400 hover:text-white hover:bg-zinc-800' : 'text-[#4A6B5B] hover:text-[#172C22] hover:bg-zinc-100'
                }`}
                title="Fechar painel (ESC)"
                aria-label="Fechar painel"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Solution Name & Commercial Headline */}
          <h2 className={`text-xl sm:text-3xl font-black tracking-tight font-heading leading-tight ${
            isDark ? 'text-white' : 'text-[#172C22]'
          }`}>
            {product.name}
          </h2>
          <p className={`mt-1 text-xs sm:text-sm font-semibold leading-relaxed ${
            isDark ? 'text-[#00DF00]' : 'text-[#087C3B]'
          }`}>
            {commercialHeadline}
          </p>

          {/* Universe-specific Application Highlight (if applicable) */}
          {context.applicationHighlight && (
            <div className={`mt-2.5 inline-flex items-center gap-2 px-3 py-1 rounded-lg border text-xs ${
              isDark ? 'bg-zinc-900/80 border-zinc-800 text-zinc-300' : 'bg-white border-[#B8D1C3] text-[#172C22] shadow-sm'
            }`}>
              <Sparkles className={`w-3.5 h-3.5 shrink-0 ${isDark ? 'text-[#00DF00]' : 'text-[#087C3B]'}`} />
              <span>{context.applicationHighlight}</span>
            </div>
          )}
        </header>

        {/* CORPO DO PAINEL COMERCIAL */}
        <div ref={contentBodyRef} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 sm:space-y-5">

          {/* B. O DESAFIO (Destaque âmbar discreto) */}
          <section className={`p-4 rounded-xl border transition-all ${
            isDark ? 'bg-amber-500/[0.05] border-amber-500/25 text-zinc-200' : 'bg-amber-50 border-amber-300 text-amber-950'
          }`}>
            <div className="flex items-center gap-2 mb-2 text-amber-600 dark:text-amber-400 font-bold text-xs uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
              <span>O Desafio</span>
            </div>
            <p className={`text-sm leading-relaxed pl-6 ${isDark ? 'text-zinc-200' : 'text-[#2D4539]'}`}>
              {context.challenge}
            </p>
          </section>

          {/* C. A SOLUÇÃO (Verde tecnológico da marca) */}
          <section className={`p-4 rounded-xl border transition-all ${
            isDark ? 'bg-[#00DF00]/[0.05] border-[#00DF00]/30 shadow-[0_0_15px_rgba(0,223,0,0.04)] text-zinc-100' : 'bg-emerald-50 border-emerald-300 text-emerald-950 shadow-sm'
          }`}>
            <div className={`flex items-center gap-2 mb-2 font-bold text-xs uppercase tracking-wider ${
              isDark ? 'text-[#00DF00]' : 'text-[#087C3B]'
            }`}>
              <CheckCircle2 className={`w-4 h-4 shrink-0 ${isDark ? 'text-[#00DF00]' : 'text-[#087C3B]'}`} />
              <span>A Solução WBM</span>
            </div>
            <p className={`text-sm font-medium leading-relaxed pl-6 ${isDark ? 'text-zinc-100' : 'text-[#172C22]'}`}>
              {context.solution}
            </p>
          </section>

          {/* D. O RESULTADO ESPERADO (Destaque ciano discreto) */}
          <section className={`p-4 rounded-xl border transition-all ${
            isDark ? 'bg-cyan-500/[0.05] border-cyan-500/25 text-zinc-200' : 'bg-sky-50 border-sky-300 text-sky-950 shadow-sm'
          }`}>
            <div className="flex items-center gap-2 mb-2 text-sky-600 dark:text-cyan-400 font-bold text-xs uppercase tracking-wider">
              <TrendingUp className="w-4 h-4 text-sky-500 dark:text-cyan-400 shrink-0" />
              <span>Resultado Esperado</span>
            </div>
            <p className={`text-sm leading-relaxed pl-6 ${isDark ? 'text-zinc-200' : 'text-[#2D4539]'}`}>
              {context.expectedResult}
            </p>
          </section>

          {/* E. COMO FUNCIONA (Diagrama visual compacto) */}
          {product.workflow && product.workflow.length > 0 && (
            <section className={`pt-2 border-t ${isDark ? 'border-zinc-900' : 'border-[#B8D1C3]'}`}>
              <h3 className={`text-xs uppercase tracking-wider font-mono mb-3 flex items-center gap-2 ${
                isDark ? 'text-zinc-400' : 'text-[#4A6B5B]'
              }`}>
                <Workflow className={`w-3.5 h-3.5 ${isDark ? 'text-[#00DF00]' : 'text-[#087C3B]'}`} />
                <span>Como Funciona</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 relative">
                {product.workflow.map((item, idx) => (
                  <div
                    key={item.step}
                    className={`relative p-3 rounded-xl border flex flex-col justify-between transition-all ${
                      isDark
                        ? 'bg-zinc-950/80 border-zinc-800/90 hover:border-zinc-700'
                        : 'bg-white border-[#B8D1C3] hover:border-[#087C3B] shadow-sm'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1.5 mb-2">
                        <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border ${
                          isDark
                            ? 'text-[#00DF00] bg-[#00DF00]/10 border-[#00DF00]/30'
                            : 'text-[#087C3B] bg-[#D7EBDD] border-[#B8D1C3]'
                        }`}>
                          {item.step}
                        </span>
                        <div className={`w-6 h-6 rounded-lg border flex items-center justify-center ${
                          isDark
                            ? 'bg-zinc-900 border-zinc-800 text-[#00DF00]'
                            : 'bg-[#D7EBDD] border-[#B8D1C3] text-[#087C3B]'
                        }`}>
                          {renderWorkflowIcon(item.iconType, 'w-3.5 h-3.5')}
                        </div>
                      </div>

                      <h4 className={`text-xs font-bold mb-1 font-heading leading-tight ${
                        isDark ? 'text-white' : 'text-[#172C22]'
                      }`}>
                        {item.title}
                      </h4>
                      <p className={`text-[11px] leading-snug ${isDark ? 'text-zinc-400' : 'text-[#4A6B5B]'}`}>
                        {item.description}
                      </p>
                    </div>

                    {/* Connecting Chevron (Desktop only, between steps) */}
                    {idx < product.workflow!.length - 1 && (
                      <div className={`hidden sm:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-4 h-4 rounded-full border items-center justify-center ${
                        isDark
                          ? 'bg-zinc-900 border-zinc-800 text-[#00DF00]'
                          : 'bg-white border-[#B8D1C3] text-[#087C3B] shadow-sm'
                      }`}>
                        <ChevronRight className="w-3 h-3" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* F. DETALHES TÉCNICOS (Seção expansível, fechada por padrão) */}
          {hasTechDetails && (
            <section className={`pt-2 border-t ${isDark ? 'border-zinc-900' : 'border-[#B8D1C3]'}`}>
              <button
                type="button"
                onClick={() => setTechDetailsOpen(!techDetailsOpen)}
                className={`w-full flex items-center justify-between py-2.5 px-3 rounded-lg border text-left transition-colors cursor-pointer ${
                  isDark
                    ? 'bg-zinc-950/60 border-zinc-900 hover:border-zinc-800'
                    : 'bg-white border-[#B8D1C3] hover:border-[#087C3B] shadow-sm'
                }`}
                aria-expanded={techDetailsOpen}
              >
                <div className="flex items-center gap-2">
                  <Sliders className={`w-3.5 h-3.5 ${isDark ? 'text-[#00DF00]' : 'text-[#087C3B]'}`} />
                  <span className={`text-xs font-semibold uppercase tracking-wide ${
                    isDark ? 'text-zinc-200' : 'text-[#172C22]'
                  }`}>
                    Detalhes Técnicos
                  </span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    techDetailsOpen
                      ? isDark ? 'rotate-180 text-[#00DF00]' : 'rotate-180 text-[#087C3B]'
                      : isDark ? 'text-zinc-400' : 'text-[#4A6B5B]'
                  }`}
                />
              </button>

              {techDetailsOpen && (
                <div className={`mt-2.5 p-4 rounded-xl border space-y-3.5 text-xs animate-fadeIn ${
                  isDark ? 'bg-zinc-950/90 border-zinc-800/80' : 'bg-white border-[#B8D1C3] shadow-sm'
                }`}>
                  {context.technicalNote && (
                    <div className={`p-3 rounded-lg border ${
                      isDark ? 'bg-[#00DF00]/[0.04] border-[#00DF00]/30' : 'bg-[#D7EBDD] border-[#B8D1C3]'
                    }`}>
                      <span className={`font-mono text-[10px] uppercase block mb-1 font-bold ${
                        isDark ? 'text-[#00DF00]' : 'text-[#087C3B]'
                      }`}>
                        Condição Técnica de Aplicação:
                      </span>
                      <p className={`leading-relaxed font-medium ${isDark ? 'text-zinc-200' : 'text-[#172C22]'}`}>
                        {context.technicalNote}
                      </p>
                    </div>
                  )}

                  {techSpecs?.parameters && techSpecs.parameters.length > 0 && (
                    <div>
                      <span className={`font-mono text-[10px] uppercase block mb-1.5 font-bold ${
                        isDark ? 'text-[#00DF00]' : 'text-[#087C3B]'
                      }`}>
                        Variáveis & Parâmetros:
                      </span>
                      <ul className={`space-y-1 pl-3 ${isDark ? 'text-zinc-300' : 'text-[#2D4539]'}`}>
                        {techSpecs.parameters.map((param, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className={isDark ? 'text-[#00DF00] mt-0.5' : 'text-[#087C3B] mt-0.5'}>•</span>
                            <span>{param}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {techSpecs?.installation && (
                    <div>
                      <span className={`font-mono text-[10px] uppercase block mb-1 font-bold ${
                        isDark ? 'text-[#00DF00]' : 'text-[#087C3B]'
                      }`}>
                        Instalação & Campo:
                      </span>
                      <p className={`leading-relaxed ${isDark ? 'text-zinc-300' : 'text-[#2D4539]'}`}>
                        {techSpecs.installation}
                      </p>
                    </div>
                  )}

                  {techSpecs?.features && techSpecs.features.length > 0 && (
                    <div>
                      <span className={`font-mono text-[10px] uppercase block mb-1 font-bold ${
                        isDark ? 'text-[#00DF00]' : 'text-[#087C3B]'
                      }`}>
                        Características do Equipamento:
                      </span>
                      <ul className={`space-y-1 pl-3 ${isDark ? 'text-zinc-300' : 'text-[#2D4539]'}`}>
                        {techSpecs.features.map((feat, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className={isDark ? 'text-[#00DF00] mt-0.5' : 'text-[#087C3B] mt-0.5'}>•</span>
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </section>
          )}

          {/* G. CONTINUE EXPLORANDO (Descoberta Inteligente de Soluções Complementares) */}
          {relatedProducts.length > 0 && (
            <section className={`pt-3 border-t animate-fadeIn ${isDark ? 'border-zinc-900' : 'border-[#B8D1C3]'}`}>
              <div className="flex items-center justify-between mb-1">
                <h3 className={`text-xs uppercase tracking-wider font-mono flex items-center gap-1.5 font-bold ${
                  isDark ? 'text-[#00DF00]' : 'text-[#087C3B]'
                }`}>
                  <Compass className={`w-3.5 h-3.5 ${isDark ? 'text-[#00DF00]' : 'text-[#087C3B]'}`} />
                  <span>Continue explorando</span>
                </h3>
                <span className={`text-[10px] font-mono ${isDark ? 'text-zinc-500' : 'text-[#6B8B7B]'}`}>
                  {universe.name}
                </span>
              </div>
              <p className={`text-[11px] mb-3 leading-tight ${isDark ? 'text-zinc-400' : 'text-[#4A6B5B]'}`}>
                Descubra outras tecnologias que podem complementar sua operação.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {relatedProducts.map(({ product: relProduct, context: relContext }) => (
                  <button
                    key={relProduct.id}
                    type="button"
                    onClick={() => {
                      if (onSelectProduct) {
                        onSelectProduct(relProduct.id);
                      }
                    }}
                    className={`p-3 rounded-xl border text-left transition-all duration-200 group cursor-pointer flex flex-col justify-between shadow-sm focus:outline-none active:scale-[0.99] ${
                      isDark
                        ? 'bg-zinc-950/90 border-zinc-800/90 hover:border-[#00DF00]/70 hover:bg-zinc-900/90 hover:shadow-[0_0_15px_rgba(0,223,0,0.15)] focus:ring-1 focus:ring-[#00DF00]'
                        : 'bg-white border-[#B8D1C3] hover:border-[#087C3B] hover:bg-[#F8FCFA] hover:shadow-[0_2px_12px_rgba(8,124,59,0.15)] focus:ring-1 focus:ring-[#087C3B]'
                    }`}
                    title={`Explorar ${relProduct.name}`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1.5 mb-1.5">
                        <span className={`text-[10px] font-mono font-bold transition-colors truncate ${
                          isDark ? 'text-zinc-400 group-hover:text-[#00DF00]' : 'text-[#4A6B5B] group-hover:text-[#087C3B]'
                        }`}>
                          {relProduct.category}
                        </span>
                        <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors shrink-0 ${
                          isDark
                            ? 'bg-zinc-900 border-zinc-800 text-[#00DF00] group-hover:border-[#00DF00]/50'
                            : 'bg-[#D7EBDD] border-[#B8D1C3] text-[#087C3B] group-hover:border-[#087C3B]'
                        }`}>
                          <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                        </div>
                      </div>

                      <h4 className={`text-xs font-bold transition-colors font-heading leading-tight mb-1 ${
                        isDark ? 'text-white group-hover:text-[#00DF00]' : 'text-[#172C22] group-hover:text-[#087C3B]'
                      }`}>
                        {relProduct.name}
                      </h4>
                      <p className={`text-[11px] leading-snug line-clamp-2 ${isDark ? 'text-zinc-400' : 'text-[#4A6B5B]'}`}>
                        {relContext.shortLabelOverride || relProduct.shortLabel}
                      </p>
                    </div>

                    <div className={`mt-2.5 pt-2 border-t flex items-center justify-between text-[10px] transition-colors ${
                      isDark ? 'border-zinc-900 text-zinc-500 group-hover:text-zinc-300' : 'border-[#B8D1C3] text-[#6B8B7B] group-hover:text-[#172C22]'
                    }`}>
                      <span className="font-medium">Conhecer solução</span>
                      <ArrowRight className={`w-3 h-3 ${isDark ? 'text-[#00DF00]' : 'text-[#087C3B]'}`} />
                    </div>
                  </button>
                ))}
              </div>
            </section>
          )}

          {/* H. APLICAÇÕES EM OUTROS SETORES */}
          {otherUniverses.length > 0 && (
            <section className={`pt-2 border-t ${isDark ? 'border-zinc-900' : 'border-[#B8D1C3]'}`}>
              <h3 className={`text-xs uppercase tracking-wider font-mono mb-2 ${
                isDark ? 'text-zinc-400' : 'text-[#4A6B5B]'
              }`}>
                Também aplicável em:
              </h3>
              <div className="flex flex-wrap gap-2">
                {otherUniverses.map((other) => (
                  <button
                    key={other.id}
                    onClick={() => onSelectOtherUniverse && onSelectOtherUniverse(other.id)}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs transition-all cursor-pointer ${
                      isDark
                        ? 'bg-zinc-900/80 border-zinc-800 text-zinc-300 hover:text-[#00DF00] hover:border-[#00DF00]/50'
                        : 'bg-white border-[#B8D1C3] text-[#172C22] hover:text-[#087C3B] hover:border-[#087C3B] shadow-sm'
                    }`}
                    title={`Ver aplicação no setor ${other.name}`}
                  >
                    {renderUniverseIcon(other.iconName, `w-3 h-3 ${isDark ? 'text-[#00DF00]' : 'text-[#087C3B]'}`)}
                    <span>{other.name}</span>
                    <ChevronRight className="w-3 h-3 opacity-60" />
                  </button>
                ))}
              </div>
            </section>
          )}

        </div>

        {/* H. CHAMADA PARA AÇÃO (STICKY FOOTER COMERCIAL) */}
        <footer className={`sticky bottom-0 z-20 p-3.5 sm:p-5 pb-[max(0.875rem,env(safe-area-inset-bottom))] border-t backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-2.5 sm:gap-3 shrink-0 ${
          isDark ? 'border-zinc-900 bg-zinc-950/95' : 'border-[#B8D1C3] bg-white/95'
        }`}>
          <button
            onClick={onClose}
            className={`w-full sm:w-auto px-4 py-2.5 rounded-xl border text-xs font-semibold transition-colors cursor-pointer ${
              isDark
                ? 'border-zinc-800 bg-zinc-900/80 text-zinc-300 hover:text-white hover:border-zinc-700'
                : 'border-[#B8D1C3] bg-[#D7EBDD] text-[#172C22] hover:bg-zinc-100'
            }`}
          >
            Voltar ao Mapa
          </button>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
              isDark
                ? 'bg-[#00DF00] text-black hover:bg-[#00DF00]/90 shadow-[0_0_18px_rgba(0,223,0,0.35)] hover:shadow-[0_0_25px_rgba(0,223,0,0.55)]'
                : 'bg-[#087C3B] text-white hover:bg-[#0A9446] shadow-[0_2px_14px_rgba(8,124,59,0.3)] hover:shadow-[0_4px_18px_rgba(8,124,59,0.45)]'
            }`}
          >
            <MessageSquare className={`w-4 h-4 fill-current ${isDark ? 'text-black' : 'text-white'}`} />
            <span>Conversar sobre esta solução</span>
          </a>
        </footer>

      </div>
    </div>
  );
};
