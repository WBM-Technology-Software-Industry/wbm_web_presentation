import React from 'react';
import { SlideTitle } from '../ui/SlideTitle';
import { ImpactFooter } from '../ui/ImpactFooter';
import { slide1Stats } from '../../data/presentationData';
import { Users, BarChart3, Network, BarChart } from 'lucide-react';
import { TechHexagon } from '../ui/TechHexagon';

interface Slide1Props {
  isVerticalMode?: boolean;
}

export const Slide1Cenario: React.FC<Slide1Props> = ({ isVerticalMode = false }) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'users':
        return <Users className="w-6 h-6 sm:w-8 sm:h-8 text-white stroke-[2.2]" />;
      case 'chart':
        return <BarChart3 className="w-6 h-6 sm:w-8 sm:h-8 text-white stroke-[2.2]" />;
      case 'integration':
        return (
          <img
            src="/assets/icon-integration.png"
            alt="Integração"
            className="w-8 h-8 sm:w-10 sm:h-10 object-contain drop-shadow-[0_0_8px_rgba(0,223,0,0.4)]"
          />
        );
      default:
        return <Network className="w-6 h-6 text-white" />;
    }
  };

  return (
    <div className={`w-full flex flex-col justify-between ${isVerticalMode ? 'py-8' : 'h-full max-h-full py-4 sm:py-6'}`}>
      <SlideTitle title="CENÁRIO" />

      {/* Main Content Area */}
      <div className="my-auto py-4 sm:py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 lg:gap-8 max-w-6xl mx-auto">
          {slide1Stats.map((stat) => (
            <div
              key={stat.id}
              className="group relative flex flex-col items-center justify-between p-5 sm:p-6 lg:p-7 rounded-2xl sm:rounded-3xl bg-gradient-to-b from-[#0a100a] via-[#050805] to-[#020302] border-2 border-[#00DF00]/40 hover:border-[#00DF00] transition-all duration-300 shadow-[0_0_20px_rgba(0,223,0,0.12)] hover:shadow-[0_0_30px_rgba(0,223,0,0.3)]"
            >
              {/* Hexagonal Top Badge with Icon */}
              <div className="-mt-11 sm:-mt-12 mb-3">
                <TechHexagon size="md">
                  {getIcon(stat.iconName)}
                </TechHexagon>
              </div>

              {/* Title */}
              <h3 className="text-base sm:text-lg lg:text-xl font-extrabold text-white tracking-wider text-center uppercase mb-2 sm:mb-3 font-heading">
                {stat.title}
              </h3>

              {/* Big Metric Highlight */}
              <div className="my-1 sm:my-2">
                <span className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#00DF00] tracking-tight font-heading drop-shadow-[0_0_18px_rgba(0,223,0,0.55)]">
                  {stat.metric}
                </span>
              </div>

              {/* Description Text */}
              <p className="text-xs sm:text-sm lg:text-base text-zinc-300 text-center leading-relaxed font-normal my-3 sm:my-4 flex-grow">
                {stat.description}
              </p>

              {/* Divider & Source */}
              <div className="w-full pt-3 sm:pt-4 border-t border-zinc-800/80 flex items-center justify-start gap-2 mt-auto">
                <BarChart className="w-4 h-4 text-[#00DF00] shrink-0" />
                <span className="text-[11px] sm:text-xs text-zinc-400 font-medium tracking-wide">
                  {stat.source}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <ImpactFooter
        topLine="O desafio não é apenas ter dados."
        bottomLine="É transformá-los em decisões que geram resultados."
      />
    </div>
  );
};
