import React, { useEffect, useState } from 'react';
import { Slide1Cenario } from './slides/Slide1Cenario';
import { Slide2Desafios } from './slides/Slide2Desafios';
import { Slide3Wbm } from './slides/Slide3Wbm';
import { Slide4Clientes } from './slides/Slide4Clientes';
import { Slide5Contato } from './slides/Slide5Contato';
import { NetworkMeshBg } from './ui/NetworkMeshBg';
import { slidesMeta, contactInfo } from '../data/presentationData';
import { MessageSquare, ArrowUp, ChevronDown } from 'lucide-react';

export const VerticalMode: React.FC = () => {
  const [activeSection, setActiveSection] = useState(1);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }

      // Check which section is in view
      slidesMeta.forEach((item) => {
        const el = document.getElementById(item.hash);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= window.innerHeight * 0.4 && rect.bottom >= window.innerHeight * 0.4) {
            setActiveSection(item.id);
          }
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (hash: string) => {
    const el = document.getElementById(hash);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="relative w-full bg-black min-h-screen text-white select-none">
      
      {/* Floating Side Dot Navigation for Desktop */}
      <nav className="fixed right-4 sm:right-6 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col gap-3.5 bg-black/70 backdrop-blur-md p-2.5 rounded-full border border-zinc-800 shadow-xl">
        {slidesMeta.map((slide) => (
          <button
            key={slide.id}
            onClick={() => scrollToSection(slide.hash)}
            className="group relative flex items-center justify-end"
            title={slide.title}
          >
            {/* Tooltip on hover */}
            <span className="absolute right-7 bg-zinc-950 border border-zinc-700 text-white text-xs px-2.5 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg">
              {slide.title}
            </span>

            {/* Dot */}
            <div
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                activeSection === slide.id
                  ? 'bg-[#00DF00] scale-125 shadow-[0_0_10px_rgba(0,223,0,0.8)]'
                  : 'bg-zinc-700 hover:bg-zinc-400'
              }`}
            />
          </button>
        ))}
      </nav>

      {/* Floating WhatsApp Action Button */}
      <aside aria-label="Contato direto" className="fixed bottom-6 right-4 sm:right-6 z-40 flex flex-col items-end gap-2">
        <a
          href={contactInfo.whatsapp.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative flex items-center gap-2.5 bg-[#25D366] hover:bg-[#20ba59] text-black font-extrabold px-4 py-3 rounded-full shadow-[0_4px_25px_rgba(37,211,102,0.4)] hover:shadow-[0_4px_30px_rgba(37,211,102,0.7)] transition-all duration-300 active:scale-95"
          title="Falar no WhatsApp"
        >
          {/* Animated pulse ring */}
          <span className="absolute -inset-1 rounded-full bg-[#25D366]/40 animate-ping pointer-events-none" />

          <MessageSquare className="w-5 h-5 fill-black relative z-10" />
          <span className="text-xs sm:text-sm tracking-wide font-heading relative z-10 hidden sm:inline">
            Fale Conosco
          </span>
        </a>

        {/* Scroll To Top Button */}
        {showScrollTop && (
          <button
            onClick={scrollToTop}
            className="p-2.5 rounded-full bg-zinc-900/90 border border-zinc-700 text-zinc-300 hover:text-white hover:border-[#00DF00] transition-all shadow-lg active:scale-90"
            title="Voltar ao topo"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        )}
      </aside>

      {/* SECTION 1: CENÁRIO */}
      <section
        id={slidesMeta[0].hash}
        className="relative min-h-screen flex flex-col justify-center px-4 sm:px-8 md:px-12 lg:px-16 py-12 sm:py-16 border-b border-zinc-900 overflow-hidden"
      >
        <NetworkMeshBg />
        <div className="relative z-10 max-w-7xl mx-auto w-full">
          <Slide1Cenario isVerticalMode={true} />

          {/* Scroll Down Prompt for First Section */}
          <div className="flex justify-center mt-6">
            <button
              onClick={() => scrollToSection(slidesMeta[1].hash)}
              className="flex flex-col items-center gap-1 text-zinc-500 hover:text-[#00DF00] transition-colors text-xs font-mono group"
            >
              <span>Explorar Desafios</span>
              <ChevronDown className="w-4 h-4 animate-bounce text-[#00DF00]" />
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 2: COMO SUPERAR ESSES DESAFIOS */}
      <section
        id={slidesMeta[1].hash}
        className="relative min-h-screen flex flex-col justify-center px-4 sm:px-8 md:px-12 lg:px-16 py-12 sm:py-16 border-b border-zinc-900 overflow-hidden"
      >
        <NetworkMeshBg />
        <div className="relative z-10 max-w-7xl mx-auto w-full">
          <Slide2Desafios isVerticalMode={true} />
        </div>
      </section>

      {/* SECTION 3: WBM TECHNOLOGY */}
      <section
        id={slidesMeta[2].hash}
        className="relative min-h-screen flex flex-col justify-center px-4 sm:px-8 md:px-12 lg:px-16 py-12 sm:py-16 border-b border-zinc-900 overflow-hidden"
      >
        <NetworkMeshBg />
        <div className="relative z-10 max-w-7xl mx-auto w-full">
          <Slide3Wbm isVerticalMode={true} />
        </div>
      </section>

      {/* SECTION 4: CLIENTES E PARCEIROS */}
      <section
        id={slidesMeta[3].hash}
        className="relative min-h-screen flex flex-col justify-center px-4 sm:px-8 md:px-12 lg:px-16 py-12 sm:py-16 border-b border-zinc-900 overflow-hidden"
      >
        <NetworkMeshBg />
        <div className="relative z-10 max-w-7xl mx-auto w-full">
          <Slide4Clientes isVerticalMode={true} />
        </div>
      </section>

      {/* SECTION 5: VAMOS CONVERSAR? */}
      <section
        id={slidesMeta[4].hash}
        className="relative min-h-screen flex flex-col justify-center px-4 sm:px-8 md:px-12 lg:px-16 py-12 sm:py-16 overflow-hidden"
      >
        <NetworkMeshBg />
        <div className="relative z-10 max-w-7xl mx-auto w-full">
          <Slide5Contato isVerticalMode={true} />
        </div>
      </section>

    </div>
  );
};
