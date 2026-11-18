import React from 'react';
import { SlideTitle } from '../ui/SlideTitle';
import { ImpactFooter } from '../ui/ImpactFooter';
import { slide2Steps } from '../../data/presentationData';
import { Radio, Brain, Sliders, TrendingUp, ArrowRight } from 'lucide-react';
import { TechHexagon } from '../ui/TechHexagon';

interface Slide2Props {
  isVerticalMode?: boolean;
}

export const Slide2Desafios: React.FC<Slide2Props> = ({ isVerticalMode = false }) => {
  const getStepIcon = (iconName: string) => {
    switch (iconName) {
      case 'antenna':
        return <Radio className="w-6 h-6 sm:w-8 sm:h-8 text-white stroke-[2.2]" />;
      case 'brain':
        return <Brain className="w-6 h-6 sm:w-8 sm:h-8 text-white stroke-[2.2]" />;
      case 'control':
        return <Sliders className="w-6 h-6 sm:w-8 sm:h-8 text-white stroke-[2.2]" />;
      case 'decision':
        return <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-white stroke-[2.2]" />;
      default:
        return <Radio className="w-6 h-6 text-white" />;
    }
  };

  return (
    <div className={`w-full flex flex-col justify-between ${isVerticalMode ? 'py-8' : 'h-full max-h-full py-4 sm:py-6'}`}>
      <SlideTitle title="COMO SUPERAR ESSES DESAFIOS" />

      {/* 4 Process Cards */}
      <div className="my-auto py-4 sm:py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-4 lg:gap-6 max-w-7xl mx-auto relative">
          {slide2Steps.map((step, idx) => (
            <div
              key={step.id}
              className="group relative flex flex-col items-center justify-between p-5 sm:p-5 lg:p-6 rounded-2xl sm:rounded-3xl bg-gradient-to-b from-[#091009] via-[#050805] to-[#020302] border-2 border-[#00DF00]/40 hover:border-[#00DF00] transition-all duration-300 shadow-[0_0_20px_rgba(0,223,0,0.12)] hover:shadow-[0_0_30px_rgba(0,223,0,0.3)]"
            >
              {/* Connector Arrow for Desktop */}
              {idx < slide2Steps.length - 1 && (
                <div className="hidden lg:block absolute -right-3.5 top-1/2 -translate-y-1/2 z-20 pointer-events-none">
                  <div className="w-7 h-7 rounded-full bg-black border border-[#00DF00]/60 flex items-center justify-center text-[#00DF00] shadow-[0_0_10px_rgba(0,223,0,0.3)]">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              )}

              {/* Hexagonal Top Badge with Icon */}
              <div className="-mt-11 sm:-mt-12 mb-3">
                <TechHexagon size="md">
                  {getStepIcon(step.iconName)}
                </TechHexagon>
              </div>

              {/* Step Title */}
              <h3 className="text-sm sm:text-base lg:text-lg font-extrabold text-white tracking-wider text-center uppercase min-h-[2.5rem] flex items-center justify-center font-heading">
                {step.title}
              </h3>

              {/* Subtle green line */}
              <div className="w-12 h-0.5 bg-[#00DF00]/60 my-2 group-hover:w-20 transition-all duration-300" />

              {/* Step Description */}
              <p className="text-xs sm:text-sm text-zinc-300 text-center leading-relaxed font-normal my-2 sm:my-3 flex-grow">
                {step.description}
              </p>

              {/* Step Number Badge */}
              <div className="w-full pt-2 flex items-center justify-center mt-auto">
                <span className="text-[10px] sm:text-xs font-mono font-bold text-[#00DF00]/60 uppercase tracking-widest bg-zinc-950/80 px-2.5 py-0.5 rounded-full border border-zinc-800">
                  Etapa {step.number}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <ImpactFooter
        topLine="Um ciclo integrado, do dado à decisão"
        bottomLine="Para aumentar a eficiência e os resultados da operação."
      />
    </div>
  );
};
