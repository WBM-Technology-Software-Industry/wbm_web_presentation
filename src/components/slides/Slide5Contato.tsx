import React from 'react';
import { SlideTitle } from '../ui/SlideTitle';
import { slide5Content, contactInfo } from '../../data/presentationData';
import { Mail, Phone, Globe, MessageSquare, ArrowUpRight } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface Slide5Props {
  isVerticalMode?: boolean;
}

export const Slide5Contato: React.FC<Slide5Props> = ({ isVerticalMode = false }) => {
  const { isDark } = useTheme();

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
              <h3
                className={`text-xl sm:text-2xl lg:text-3xl font-extrabold font-heading ${
                  isDark ? 'text-white' : 'text-[#172C22]'
                }`}
              >
                {slide5Content.headline1}
              </h3>
              <h3
                className={`text-xl sm:text-2xl lg:text-3xl font-black font-heading ${
                  isDark
                    ? 'text-[#00DF00] drop-shadow-[0_0_15px_rgba(0,223,0,0.5)]'
                    : 'text-[#087C3B]'
                }`}
              >
                {slide5Content.headline2}
              </h3>
            </div>

            {/* Paragraph 1 */}
            <p
              className={`text-xs sm:text-sm lg:text-base leading-relaxed font-normal ${
                isDark ? 'text-zinc-200' : 'text-[#4A6B5B]'
              }`}
            >
              Da instrumentação à{' '}
              <strong className={`font-bold ${isDark ? 'text-[#00DF00]' : 'text-[#087C3B]'}`}>
                inteligência artificial
              </strong>
              , conectamos equipamentos, dados e pessoas para transformar desafios em{' '}
              <strong className={`font-bold ${isDark ? 'text-[#00DF00]' : 'text-[#087C3B]'}`}>
                oportunidades
              </strong>.
            </p>

            {/* Paragraph 2 */}
            <p
              className={`text-xs sm:text-sm lg:text-base leading-relaxed font-normal ${
                isDark ? 'text-zinc-200' : 'text-[#4A6B5B]'
              }`}
            >
              Vamos descobrir juntos a próxima{' '}
              <strong
                className={`font-bold underline underline-offset-4 ${
                  isDark
                    ? 'text-[#00DF00] decoration-[#00DF00]/50'
                    : 'text-[#087C3B] decoration-[#087C3B]/50'
                }`}
              >
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
                className={`group relative inline-flex items-center justify-center gap-3 w-full sm:w-auto px-6 py-3.5 rounded-xl sm:rounded-2xl font-extrabold text-sm sm:text-base font-heading tracking-wide transition-all duration-300 active:scale-95 ${
                  isDark
                    ? 'bg-[#00DF00] hover:bg-[#00ff00] text-black shadow-[0_0_25px_rgba(0,223,0,0.5)] hover:shadow-[0_0_35px_rgba(0,223,0,0.8)]'
                    : 'bg-[#087C3B] hover:bg-[#06612e] text-white shadow-lg'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    isDark ? 'bg-black/15' : 'bg-white/20'
                  }`}
                >
                  <MessageSquare className={`w-4 h-4 ${isDark ? 'text-black fill-black' : 'text-white fill-white'}`} />
                </div>
                <span>Conversar no WhatsApp</span>
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </div>

            {/* Contact Channels Grid */}
            <div
              className={`grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t ${
                isDark ? 'border-zinc-800' : 'border-[#B8D1C3]'
              }`}
            >
              
              {/* WhatsApp Card */}
              <a
                href={contactInfo.whatsapp.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-3 p-3 rounded-xl border transition-all group ${
                  isDark
                    ? 'bg-zinc-950/80 border-zinc-800 hover:border-[#00DF00]/60 hover:bg-[#00DF00]/5'
                    : 'bg-white border-[#B8D1C3] hover:border-[#087C3B] hover:bg-emerald-50/50 shadow-sm'
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-[#25D366]/20 border border-[#25D366]/40 flex items-center justify-center shrink-0 text-[#25D366]">
                  <MessageSquare className="w-5 h-5 fill-[#25D366]" />
                </div>
                <div className="min-w-0">
                  <span
                    className={`text-[10px] block font-mono ${
                      isDark ? 'text-zinc-400' : 'text-[#4A6B5B]'
                    }`}
                  >
                    WhatsApp
                  </span>
                  <span
                    className={`text-xs sm:text-sm font-bold tracking-tight truncate block transition-colors ${
                      isDark
                        ? 'text-white group-hover:text-[#00DF00]'
                        : 'text-[#172C22] group-hover:text-[#087C3B]'
                    }`}
                  >
                    {contactInfo.whatsapp.display}
                  </span>
                </div>
              </a>

              {/* Email Card */}
              <a
                href={contactInfo.email.url}
                className={`flex items-center gap-3 p-3 rounded-xl border transition-all group ${
                  isDark
                    ? 'bg-zinc-950/80 border-zinc-800 hover:border-[#00DF00]/60 hover:bg-[#00DF00]/5'
                    : 'bg-white border-[#B8D1C3] hover:border-[#087C3B] hover:bg-emerald-50/50 shadow-sm'
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-blue-500/20 border border-blue-500/40 flex items-center justify-center shrink-0 text-blue-400">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <span
                    className={`text-[10px] block font-mono ${
                      isDark ? 'text-zinc-400' : 'text-[#4A6B5B]'
                    }`}
                  >
                    E-mail
                  </span>
                  <span
                    className={`text-xs sm:text-sm font-bold tracking-tight truncate block transition-colors ${
                      isDark
                        ? 'text-white group-hover:text-[#00DF00]'
                        : 'text-[#172C22] group-hover:text-[#087C3B]'
                    }`}
                  >
                    {contactInfo.email.display}
                  </span>
                </div>
              </a>

              {/* Phone Card */}
              <a
                href={contactInfo.phone.url}
                className={`flex items-center gap-3 p-3 rounded-xl border transition-all group ${
                  isDark
                    ? 'bg-zinc-950/80 border-zinc-800 hover:border-[#00DF00]/60 hover:bg-[#00DF00]/5'
                    : 'bg-white border-[#B8D1C3] hover:border-[#087C3B] hover:bg-emerald-50/50 shadow-sm'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full border flex items-center justify-center shrink-0 ${
                    isDark
                      ? 'bg-[#00DF00]/20 border-[#00DF00]/40 text-[#00DF00]'
                      : 'bg-[#D7EBDD] border-[#A5D6A7] text-[#087C3B]'
                  }`}
                >
                  <Phone className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <span
                    className={`text-[10px] block font-mono ${
                      isDark ? 'text-zinc-400' : 'text-[#4A6B5B]'
                    }`}
                  >
                    Telefone
                  </span>
                  <span
                    className={`text-xs sm:text-sm font-bold tracking-tight truncate block transition-colors ${
                      isDark
                        ? 'text-white group-hover:text-[#00DF00]'
                        : 'text-[#172C22] group-hover:text-[#087C3B]'
                    }`}
                  >
                    {contactInfo.phone.display}
                  </span>
                </div>
              </a>

              {/* Website Card */}
              <a
                href={contactInfo.website.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-3 p-3 rounded-xl border transition-all group ${
                  isDark
                    ? 'bg-zinc-950/80 border-zinc-800 hover:border-[#00DF00]/60 hover:bg-[#00DF00]/5'
                    : 'bg-white border-[#B8D1C3] hover:border-[#087C3B] hover:bg-emerald-50/50 shadow-sm'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full border flex items-center justify-center shrink-0 ${
                    isDark
                      ? 'bg-purple-500/20 border-purple-500/40 text-purple-400'
                      : 'bg-purple-100 border-purple-300 text-purple-700'
                  }`}
                >
                  <Globe className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <span
                    className={`text-[10px] block font-mono ${
                      isDark ? 'text-zinc-400' : 'text-[#4A6B5B]'
                    }`}
                  >
                    Website Oficial
                  </span>
                  <span
                    className={`text-xs sm:text-sm font-bold tracking-tight truncate block transition-colors ${
                      isDark
                        ? 'text-white group-hover:text-[#00DF00]'
                        : 'text-[#172C22] group-hover:text-[#087C3B]'
                    }`}
                  >
                    {contactInfo.website.display}
                  </span>
                </div>
              </a>

            </div>

          </div>

          {/* Right Column: Embedded Google Map & Corporate Address */}
          <div className="lg:col-span-6 flex flex-col justify-center space-y-4">
            
            <div
              className={`rounded-2xl sm:rounded-3xl p-4 sm:p-5 border transition-all ${
                isDark
                  ? 'bg-zinc-950/80 border-zinc-800 shadow-xl'
                  : 'bg-white border-[#B8D1C3] shadow-md'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span
                  className={`text-xs font-mono uppercase tracking-wider ${
                    isDark ? 'text-[#00DF00]' : 'text-[#087C3B] font-bold'
                  }`}
                >
                  Localização WBM Technology
                </span>
                <span
                  className={`text-[11px] font-mono ${
                    isDark ? 'text-zinc-500' : 'text-[#4A6B5B]'
                  }`}
                >
                  Belo Horizonte · MG
                </span>
              </div>

              {/* Responsive Google Maps Iframe */}
              <div
                className={`w-full h-56 sm:h-72 lg:h-80 rounded-xl overflow-hidden border ${
                  isDark ? 'border-zinc-800' : 'border-[#B8D1C3]'
                }`}
              >
                <iframe
                  title="WBM Technology - Localização Google Maps"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3751.2789104085933!2d-43.98777172477317!3d-19.912642581471375!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xa697087612f0f9%3A0x8ee787e97aaae2f!2sR.%20Estrada%20do%20Cercado%2C%20220%20-%20Serrano%2C%20Belo%20Horizonte%20-%20MG%2C%2030882-370!5e0!3m2!1spt-BR!2sbr!4v1700000000000!5m2!1spt-BR!2sbr"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className={isDark ? 'opacity-90 contrast-125' : 'opacity-95'}
                />
              </div>

              {/* Address details */}
              <div className="mt-3 pt-3 border-t border-[var(--wbm-border)] flex items-start justify-between gap-3 text-xs">
                <div>
                  <span
                    className={`font-semibold block ${
                      isDark ? 'text-zinc-200' : 'text-[#172C22]'
                    }`}
                  >
                    Rua Estrada do Cercado, 220
                  </span>
                  <span
                    className={`text-[11px] ${
                      isDark ? 'text-zinc-400' : 'text-[#4A6B5B]'
                    }`}
                  >
                    Serrano · Belo Horizonte — MG · CEP 30882-370
                  </span>
                </div>
                <a
                  href="https://maps.google.com/?q=Rua+Estrada+do+Cercado+220+Belo+Horizonte"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-1 font-mono text-[11px] shrink-0 font-bold hover:underline ${
                    isDark ? 'text-[#00DF00]' : 'text-[#087C3B]'
                  }`}
                >
                  <span>Abrir Maps</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
