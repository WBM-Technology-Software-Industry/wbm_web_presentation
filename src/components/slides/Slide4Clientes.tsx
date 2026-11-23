import React from 'react';
import { SlideTitle } from '../ui/SlideTitle';
import { slide4Content } from '../../data/presentationData';
import { Building2, Handshake } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface Slide4Props {
  isVerticalMode?: boolean;
}

export const Slide4Clientes: React.FC<Slide4Props> = ({ isVerticalMode = false }) => {
  const { isDark } = useTheme();

  return (
    <div className={`w-full flex flex-col justify-between ${isVerticalMode ? 'py-8' : 'h-full max-h-full py-4 sm:py-6'}`}>
      <SlideTitle title={slide4Content.title} />

      {/* Main Content Area */}
      <div className="my-auto py-3 sm:py-5 max-w-6xl mx-auto w-full space-y-5 sm:space-y-6">
        
        {/* SECTION 1: CLIENTES */}
        <div>
          <div className="flex items-center gap-2.5 mb-2.5 sm:mb-3">
            <Building2 className={`w-5 h-5 sm:w-6 sm:h-6 ${isDark ? 'text-[#00DF00]' : 'text-[#087C3B]'}`} />
            <h3
              className={`text-base sm:text-lg lg:text-xl font-bold tracking-wider uppercase font-heading flex items-center gap-2 ${
                isDark ? 'text-white' : 'text-[#172C22]'
              }`}
            >
              <span>{slide4Content.clientsTitle}</span>
              <div className={`h-0.5 w-16 sm:w-28 ${isDark ? 'bg-[#00DF00]' : 'bg-[#087C3B]'}`} />
            </h3>
          </div>

          {/* White Card with original client logos */}
          <div
            className={`w-full bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 border flex items-center justify-center transition-all ${
              isDark
                ? 'shadow-[0_4px_25px_rgba(0,0,0,0.5)] border-zinc-200'
                : 'shadow-md border-[#B8D1C3]'
            }`}
          >
            <img
              src={slide4Content.clientsImage}
              alt="Clientes WBM Technology: ArcelorMittal, UFMG, Grupo Maringá, 3D Aqua, Ceva, INCT, UFRJ, UFPR, VEOLIA, COPASA, UFPE, IGUÁ, UnB, LabLAAE"
              className="w-full max-h-36 sm:max-h-48 md:max-h-60 object-contain"
            />
          </div>
        </div>

        {/* SECTION 2: PARCEIROS */}
        <div>
          <div className="flex items-center gap-2.5 mb-2.5 sm:mb-3">
            <Handshake className={`w-5 h-5 sm:w-6 sm:h-6 ${isDark ? 'text-[#00DF00]' : 'text-[#087C3B]'}`} />
            <h3
              className={`text-base sm:text-lg lg:text-xl font-bold tracking-wider uppercase font-heading flex items-center gap-2 ${
                isDark ? 'text-white' : 'text-[#172C22]'
              }`}
            >
              <span>{slide4Content.partnersTitle}</span>
              <div className={`h-0.5 w-16 sm:w-28 ${isDark ? 'bg-[#00DF00]' : 'bg-[#087C3B]'}`} />
            </h3>
          </div>

          {/* Two White Cards with Green Borders */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            
            {/* Partner 1: AQUALABO */}
            <div
              className={`bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 border-2 flex flex-col items-center justify-center min-h-[110px] sm:min-h-[130px] transition-all ${
                isDark
                  ? 'border-[#00DF00] shadow-[0_0_20px_rgba(0,223,0,0.2)] hover:shadow-[0_0_28px_rgba(0,223,0,0.4)]'
                  : 'border-[#087C3B] shadow-md hover:shadow-xl'
              }`}
            >
              <img
                src="/assets/partner-aqualabo.png"
                alt="Aqualabo - Smart water solutions"
                className="max-h-14 sm:max-h-16 w-auto object-contain"
              />
            </div>

            {/* Partner 2: TESTARI with Sub-Brands */}
            <div
              className={`bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 border-2 flex items-center justify-between gap-4 min-h-[110px] sm:min-h-[130px] transition-all ${
                isDark
                  ? 'border-[#00DF00] shadow-[0_0_20px_rgba(0,223,0,0.2)] hover:shadow-[0_0_28px_rgba(0,223,0,0.4)]'
                  : 'border-[#087C3B] shadow-md hover:shadow-xl'
              }`}
            >
              {/* Main Testari Logo */}
              <div className="flex-1 flex items-center justify-center border-r border-zinc-200 pr-3 sm:pr-4">
                <img
                  src="/assets/partner-testari.png"
                  alt="Testari"
                  className="max-h-12 sm:max-h-14 w-auto object-contain"
                />
              </div>

              {/* Associated Logos: GWF, KELLER, GUTERMANN */}
              <div className="flex flex-col items-center justify-center gap-2 shrink-0 pl-2">
                {/* GWF Vector representation */}
                <div className="text-[12px] sm:text-sm font-black font-heading tracking-widest text-zinc-900 flex items-center gap-1">
                  <span className="text-[#0055aa]">G</span>
                  <span className="text-[#0077cc]">W</span>
                  <span className="text-[#0099ff]">F</span>
                </div>

                {/* Keller Logo */}
                <img
                  src="/assets/partner-keller.png"
                  alt="Keller"
                  className="h-4 sm:h-5 w-auto object-contain"
                />

                {/* Gutermann Logo */}
                <img
                  src="/assets/partner-gutermann.png"
                  alt="Gutermann"
                  className="h-4 sm:h-5 w-auto object-contain"
                />
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
