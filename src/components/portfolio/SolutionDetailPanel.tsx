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
        className="w-full max-w-xl h-full bg-[#070907] border-l border-zinc-800 text-white flex flex-col shadow-2xl overflow-hidden animate-slideLeft motion-reduce:animate-none select-text"
      >
        {/* A. IDENTIFICAÇÃO (HEADER COMERCIAL) */}
        <header className="relative p-5 sm:p-6 border-b border-zinc-800/80 bg-zinc-950/80">
          <div className="flex items-center justify-between gap-3 mb-2.5">
            {/* Sector Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-medium text-zinc-300">
              <span className="text-[#00DF00]">{renderUniverseIcon(universe.iconName)}</span>
              <span>{universe.name}</span>
            </div>

            {/* Category Badge & Close Button */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono px-2 py-0.5 rounded border border-zinc-800/80 text-zinc-400 bg-zinc-900/40">
                {product.category}
              </span>

              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
                title="Fechar painel (ESC)"
                aria-label="Fechar painel"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Solution Name & Commercial Headline */}
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white font-heading">
            {product.name}
          </h2>
          <p className="mt-1 text-sm text-[#00DF00] font-semibold leading-relaxed">
            {commercialHeadline}
          </p>

          {/* Universe-specific Application Highlight (if applicable) */}
          {context.applicationHighlight && (
            <div className="mt-2.5 inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-zinc-900/80 border border-zinc-800 text-xs text-zinc-300">
              <Sparkles className="w-3.5 h-3.5 text-[#00DF00] shrink-0" />
              <span>{context.applicationHighlight}</span>
            </div>
          )}
        </header>

        {/* CORPO DO PAINEL COMERCIAL */}
        <div ref={contentBodyRef} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 sm:space-y-5">

          {/* B. O DESAFIO (Destaque âmbar discreto) */}
          <section className="p-4 rounded-xl bg-amber-500/[0.04] border border-amber-500/25 transition-all">
            <div className="flex items-center gap-2 mb-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>O Desafio</span>
            </div>
            <p className="text-sm text-zinc-200 leading-relaxed pl-6">
              {context.challenge}
            </p>
          </section>

          {/* C. A SOLUÇÃO (Verde tecnológico da marca) */}
          <section className="p-4 rounded-xl bg-[#00DF00]/[0.04] border border-[#00DF00]/30 shadow-[0_0_15px_rgba(0,223,0,0.04)] transition-all">
            <div className="flex items-center gap-2 mb-2 text-[#00DF00] font-bold text-xs uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4 text-[#00DF00] shrink-0" />
              <span>A Solução WBM</span>
            </div>
            <p className="text-sm text-zinc-100 font-medium leading-relaxed pl-6">
              {context.solution}
            </p>
          </section>

          {/* D. O RESULTADO ESPERADO (Destaque ciano discreto) */}
          <section className="p-4 rounded-xl bg-cyan-500/[0.04] border border-cyan-500/25 transition-all">
            <div className="flex items-center gap-2 mb-2 text-cyan-400 font-bold text-xs uppercase tracking-wider">
              <TrendingUp className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Resultado Esperado</span>
            </div>
            <p className="text-sm text-zinc-200 leading-relaxed pl-6">
              {context.expectedResult}
            </p>
          </section>

          {/* E. COMO FUNCIONA (Diagrama visual compacto) */}
          {product.workflow && product.workflow.length > 0 && (
            <section className="pt-2 border-t border-zinc-900">
              <h3 className="text-xs uppercase tracking-wider font-mono text-zinc-400 mb-3 flex items-center gap-2">
                <Workflow className="w-3.5 h-3.5 text-[#00DF00]" />
                <span>Como Funciona</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 relative">
                {product.workflow.map((item, idx) => (
                  <div
                    key={item.step}
                    className="relative p-3 rounded-xl bg-zinc-950/80 border border-zinc-800/90 flex flex-col justify-between transition-all hover:border-zinc-700"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1.5 mb-2">
                        <span className="text-[10px] font-mono font-bold text-[#00DF00] bg-[#00DF00]/10 px-1.5 py-0.5 rounded border border-[#00DF00]/30">
                          {item.step}
                        </span>
                        <div className="w-6 h-6 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-[#00DF00]">
                          {renderWorkflowIcon(item.iconType, 'w-3.5 h-3.5')}
                        </div>
                      </div>

                      <h4 className="text-xs font-bold text-white mb-1 font-heading leading-tight">
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-zinc-400 leading-snug">
                        {item.description}
                      </p>
                    </div>

                    {/* Connecting Chevron (Desktop only, between steps) */}
                    {idx < product.workflow!.length - 1 && (
                      <div className="hidden sm:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-4 h-4 rounded-full bg-zinc-900 border border-zinc-800 items-center justify-center text-[#00DF00]">
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
            <section className="pt-2 border-t border-zinc-900">
              <button
                type="button"
                onClick={() => setTechDetailsOpen(!techDetailsOpen)}
                className="w-full flex items-center justify-between py-2.5 px-3 rounded-lg bg-zinc-950/60 border border-zinc-900 hover:border-zinc-800 text-left transition-colors cursor-pointer"
                aria-expanded={techDetailsOpen}
              >
                <div className="flex items-center gap-2">
                  <Sliders className="w-3.5 h-3.5 text-[#00DF00]" />
                  <span className="text-xs font-semibold text-zinc-200 uppercase tracking-wide">
                    Detalhes Técnicos
                  </span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-zinc-400 transition-transform duration-200 ${
                    techDetailsOpen ? 'rotate-180 text-[#00DF00]' : ''
                  }`}
                />
              </button>

              {techDetailsOpen && (
                <div className="mt-2.5 p-4 rounded-xl bg-zinc-950/90 border border-zinc-800/80 space-y-3.5 text-xs animate-fadeIn">
                  {context.technicalNote && (
                    <div className="p-3 rounded-lg bg-[#00DF00]/[0.04] border border-[#00DF00]/30">
                      <span className="font-mono text-[10px] uppercase text-[#00DF00] block mb-1 font-bold">
                        Condição Técnica de Aplicação:
                      </span>
                      <p className="text-zinc-200 leading-relaxed font-medium">
                        {context.technicalNote}
                      </p>
                    </div>
                  )}

                  {techSpecs?.parameters && techSpecs.parameters.length > 0 && (
                    <div>
                      <span className="font-mono text-[10px] uppercase text-[#00DF00] block mb-1.5 font-bold">
                        Variáveis & Parâmetros:
                      </span>
                      <ul className="space-y-1 text-zinc-300 pl-3">
                        {techSpecs.parameters.map((param, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="text-[#00DF00] mt-0.5">•</span>
                            <span>{param}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {techSpecs?.installation && (
                    <div>
                      <span className="font-mono text-[10px] uppercase text-[#00DF00] block mb-1 font-bold">
                        Instalação & Campo:
                      </span>
                      <p className="text-zinc-300 leading-relaxed">
                        {techSpecs.installation}
                      </p>
                    </div>
                  )}

                  {techSpecs?.features && techSpecs.features.length > 0 && (
                    <div>
                      <span className="font-mono text-[10px] uppercase text-[#00DF00] block mb-1 font-bold">
                        Características do Equipamento:
                      </span>
                      <ul className="space-y-1 text-zinc-300 pl-3">
                        {techSpecs.features.map((feat, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="text-[#00DF00] mt-0.5">•</span>
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
            <section className="pt-3 border-t border-zinc-900 animate-fadeIn">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-xs uppercase tracking-wider font-mono text-[#00DF00] flex items-center gap-1.5 font-bold">
                  <Compass className="w-3.5 h-3.5 text-[#00DF00]" />
                  <span>Continue explorando</span>
                </h3>
                <span className="text-[10px] font-mono text-zinc-500">
                  {universe.name}
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 mb-3 leading-tight">
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
                    className="p-3 rounded-xl bg-zinc-950/90 border border-zinc-800/90 hover:border-[#00DF00]/70 hover:bg-zinc-900/90 text-left transition-all duration-200 group cursor-pointer flex flex-col justify-between shadow-sm hover:shadow-[0_0_15px_rgba(0,223,0,0.15)] focus:outline-none focus:ring-1 focus:ring-[#00DF00] active:scale-[0.99]"
                    title={`Explorar ${relProduct.name}`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1.5 mb-1.5">
                        <span className="text-[10px] font-mono font-bold text-zinc-400 group-hover:text-[#00DF00] transition-colors truncate">
                          {relProduct.category}
                        </span>
                        <div className="w-5 h-5 rounded-md bg-zinc-900 border border-zinc-800 flex items-center justify-center text-[#00DF00] group-hover:border-[#00DF00]/50 transition-colors shrink-0">
                          <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                        </div>
                      </div>

                      <h4 className="text-xs font-bold text-white group-hover:text-[#00DF00] transition-colors font-heading leading-tight mb-1">
                        {relProduct.name}
                      </h4>
                      <p className="text-[11px] text-zinc-400 leading-snug line-clamp-2">
                        {relContext.shortLabelOverride || relProduct.shortLabel}
                      </p>
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-zinc-900 flex items-center justify-between text-[10px] text-zinc-500 group-hover:text-zinc-300 transition-colors">
                      <span className="font-medium">Conhecer solução</span>
                      <ArrowRight className="w-3 h-3 text-[#00DF00]" />
                    </div>
                  </button>
                ))}
              </div>
            </section>
          )}

          {/* H. APLICAÇÕES EM OUTROS SETORES */}
          {otherUniverses.length > 0 && (
            <section className="pt-2 border-t border-zinc-900">
              <h3 className="text-xs uppercase tracking-wider font-mono text-zinc-400 mb-2">
                Também aplicável em:
              </h3>
              <div className="flex flex-wrap gap-2">
                {otherUniverses.map((other) => (
                  <button
                    key={other.id}
                    onClick={() => onSelectOtherUniverse && onSelectOtherUniverse(other.id)}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-900/80 border border-zinc-800 text-xs text-zinc-300 hover:text-[#00DF00] hover:border-[#00DF00]/50 transition-all cursor-pointer"
                    title={`Ver aplicação no setor ${other.name}`}
                  >
                    {renderUniverseIcon(other.iconName, 'w-3 h-3 text-[#00DF00]')}
                    <span>{other.name}</span>
                    <ChevronRight className="w-3 h-3 opacity-60" />
                  </button>
                ))}
              </div>
            </section>
          )}

        </div>

        {/* H. CHAMADA PARA AÇÃO (STICKY FOOTER COMERCIAL) */}
        <footer className="sticky bottom-0 z-20 p-4 sm:p-5 border-t border-zinc-900 bg-zinc-950/95 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-zinc-800 bg-zinc-900/80 text-xs font-semibold text-zinc-300 hover:text-white hover:border-zinc-700 transition-colors cursor-pointer"
          >
            Voltar ao Mapa
          </button>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#00DF00] text-black text-xs font-black uppercase tracking-wider hover:bg-[#00DF00]/90 transition-all shadow-[0_0_18px_rgba(0,223,0,0.35)] hover:shadow-[0_0_25px_rgba(0,223,0,0.55)] cursor-pointer"
          >
            <MessageSquare className="w-4 h-4 fill-black text-black" />
            <span>Conversar sobre esta solução</span>
          </a>
        </footer>

      </div>
    </div>
  );
};
