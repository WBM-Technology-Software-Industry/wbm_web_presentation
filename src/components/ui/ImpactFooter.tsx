import React from 'react';

interface ImpactFooterProps {
  topLine: string;
  bottomLine: string;
  className?: string;
}

export const ImpactFooter: React.FC<ImpactFooterProps> = ({
  topLine,
  bottomLine,
  className = '',
}) => {
  return (
    <div className={`w-full relative mt-auto pt-4 sm:pt-6 pb-2 text-center ${className}`}>
      {/* 3D Polygon Accent in bottom-right corner for desktop */}
      <div className="absolute right-0 bottom-0 pointer-events-none select-none hidden md:block opacity-85">
        <svg width="64" height="64" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <polygon points="40,5 75,25 75,65 40,85 5,65 5,25" fill="#00DF00" />
          <polygon points="40,5 75,25 75,65 40,45" fill="#009900" opacity="0.7" />
          <polygon points="40,45 75,65 40,85 5,65" fill="#222222" opacity="0.9" />
        </svg>
      </div>

      <div className="inline-flex flex-col items-center justify-center max-w-3xl px-4">
        <p className="text-sm sm:text-base md:text-xl lg:text-2xl font-normal text-white tracking-wide">
          {topLine}
        </p>
        <p className="text-base sm:text-lg md:text-2xl lg:text-3xl font-extrabold text-[#00DF00] tracking-wide mt-0.5 sm:mt-1 drop-shadow-[0_0_15px_rgba(0,223,0,0.5)]">
          {bottomLine}
        </p>
      </div>
    </div>
  );
};
