import React from 'react';
import { SlideTitle } from '../ui/SlideTitle';
import { slide5Content, contactInfo } from '../../data/presentationData';
import { Mail, Phone, Globe, MessageSquare, ArrowUpRight } from 'lucide-react';

interface Slide5Props {
  isVerticalMode?: boolean;
}

export const Slide5Contato: React.FC<Slide5Props> = ({ isVerticalMode = false }) => {
  return (
    <div className={`w-full flex flex-col justify-between ${isVerticalMode ? 'py-8' : 'h-full max-h-full py-4 sm:py-6'}`}>
      <SlideTitle title={slide5Content.title} />

      {/* Main Grid */}
      <div className="my-auto py-4 sm:py-6 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center">
          
          {/* Left Column: Proposals & Direct Contact Channels */}
          <div className="lg:col-span-6 flex flex-col justify-center space-y-5 sm:space-y-6">
            
            {/* Headlines */}
            <div className="space-y-1">
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white font-heading">
                {slide5Content.headline1}
              </h3>
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-[#00DF00] font-heading drop-shadow-[0_0_15px_rgba(0,223,0,0.5)]">
                {slide5Content.headline2}
              </h3>
            </div>

            {/* Paragraph 1 */}
            <p className="text-xs sm:text-sm lg:text-base text-zinc-200 leading-relaxed font-normal">
              Da instrumentação à{' '}
              <strong className="text-[#00DF00] font-bold">inteligência artificial</strong>
              , conectamos equipamentos, dados e pessoas para transformar desafios em{' '}
              <strong className="text-[#00DF00] font-bold">oportunidades</strong>.
            </p>

            {/* Paragraph 2 */}
            <p className="text-xs sm:text-sm lg:text-base text-zinc-200 leading-relaxed font-normal">
              Vamos descobrir juntos a próxima{' '}
              <strong className="text-[#00DF00] font-bold underline decoration-[#00DF00]/50 underline-offset-4">
                oportunidade de melhoria
              </strong>{' '}
              da sua operação?
            </p>

            {/* Primary Action Button (WhatsApp Direct) */}
            <div className="pt-1">
              <a
                href={contactInfo.whatsapp.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative inline-flex items-center justify-center gap-3 w-full sm:w-auto px-6 py-3.5 rounded-xl sm:rounded-2xl bg-[#00DF00] hover:bg-[#00ff00] text-black font-extrabold text-sm sm:text-base font-heading tracking-wide transition-all duration-300 shadow-[0_0_25px_rgba(0,223,0,0.5)] hover:shadow-[0_0_35px_rgba(0,223,0,0.8)] active:scale-95"
              >
                <div className="w-6 h-6 rounded-full bg-black/15 flex items-center justify-center">
                  <MessageSquare className="w-4 h-4 text-black fill-black" />
                </div>
                <span>Conversar no WhatsApp</span>
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </div>

            {/* Contact Channels Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-zinc-800">
              
              {/* WhatsApp Card */}
              <a
                href={contactInfo.whatsapp.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-xl bg-zinc-950/80 border border-zinc-800 hover:border-[#00DF00]/60 hover:bg-[#00DF00]/5 transition-all group"
              >
                <div className="w-10 h-10 rounded-full bg-[#25D366]/20 border border-[#25D366]/40 flex items-center justify-center shrink-0 text-[#25D366]">
                  <MessageSquare className="w-5 h-5 fill-[#25D366]" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] text-zinc-400 block font-mono">WhatsApp</span>
                  <span className="text-xs sm:text-sm text-white font-bold tracking-tight truncate block group-hover:text-[#00DF00] transition-colors">
                    {contactInfo.whatsapp.display}
                  </span>
                </div>
              </a>

              {/* Email Card */}
              <a
                href={contactInfo.email.url}
                className="flex items-center gap-3 p-3 rounded-xl bg-zinc-950/80 border border-zinc-800 hover:border-[#00DF00]/60 hover:bg-[#00DF00]/5 transition-all group"
              >
                <div className="w-10 h-10 rounded-full bg-blue-500/20 border border-blue-500/40 flex items-center justify-center shrink-0 text-blue-400">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] text-zinc-400 block font-mono">E-mail</span>
                  <span className="text-xs sm:text-sm text-white font-bold tracking-tight truncate block group-hover:text-[#00DF00] transition-colors">
                    {contactInfo.email.display}
                  </span>
                </div>
              </a>

              {/* Phone Card */}
              <a
                href={contactInfo.phone.url}
                className="flex items-center gap-3 p-3 rounded-xl bg-zinc-950/80 border border-zinc-800 hover:border-[#00DF00]/60 hover:bg-[#00DF00]/5 transition-all group"
              >
                <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shrink-0 text-amber-400">
                  <Phone className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] text-zinc-400 block font-mono">Telefone</span>
                  <span className="text-xs sm:text-sm text-white font-bold tracking-tight truncate block group-hover:text-[#00DF00] transition-colors">
                    {contactInfo.phone.display}
                  </span>
                </div>
              </a>

              {/* Website Card */}
              <a
                href={contactInfo.website.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-xl bg-zinc-950/80 border border-zinc-800 hover:border-[#00DF00]/60 hover:bg-[#00DF00]/5 transition-all group"
              >
                <div className="w-10 h-10 rounded-full bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center shrink-0 text-indigo-400">
                  <Globe className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] text-zinc-400 block font-mono">Website</span>
                  <span className="text-xs sm:text-sm text-white font-bold tracking-tight truncate block group-hover:text-[#00DF00] transition-colors">
                    {contactInfo.website.display}
                  </span>
                </div>
              </a>

            </div>

          </div>

          {/* Right Column: VCR & Deni AI Diagram */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center">
            <div className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden border-2 border-[#00DF00]/50 shadow-[0_0_35px_rgba(0,223,0,0.25)] bg-[#040704]">
              <img
                src={slide5Content.diagramImage}
                alt="WBM Technology - Virtual Control Room (VCR), Deni AI e IoT Control LINetwork"
                className="w-full h-auto object-cover hover:scale-[1.02] transition-transform duration-500"
              />
              <div className="absolute bottom-2 right-2 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-md text-[10px] sm:text-xs text-[#00DF00] font-mono border border-[#00DF00]/40">
                Solução Integrada WBM
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Slide 5 Footer Info */}
      <div className="w-full text-center py-2 border-t border-zinc-900 mt-auto">
        <p className="text-xs text-zinc-500">
          WBM Technology © Todos os direitos reservados.
        </p>
      </div>
    </div>
  );
};
