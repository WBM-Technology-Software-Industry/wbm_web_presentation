import React from 'react';

interface SlideTitleProps {
  title: string;
  subtitle?: string;
  showLogo?: boolean;
  className?: string;
}

export const SlideTitle: React.FC<SlideTitleProps> = ({
  title,
  subtitle,
  showLogo = true,
  className = '',
}) => {
  return (
    <div className={`w-full flex items-center justify-between pb-4 sm:pb-6 border-b border-zinc-800 relative z-10 ${className}`}>
      {/* Left: Polygonal Chevron + Title */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* WBM Green Chevron Flag */}
        <div className="relative flex items-center justify-center shrink-0">
          <svg
            className="w-7 h-9 sm:w-10 sm:h-12 drop-shadow-[0_0_12px_rgba(0,223,0,0.6)]"
            viewBox="0 0 40 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Darker faceted polygon */}
            <path
              d="M0 0H24L38 24L24 48H0L14 24L0 0Z"
              fill="#00DF00"
            />
            {/* 3D darker edge */}
            <path
              d="M0 0L14 24L0 48H8L20 24L8 0H0Z"
              fill="#007700"
              opacity="0.6"
            />
          </svg>
        </div>

        <div>
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight text-[#00DF00] uppercase font-heading drop-shadow-[0_0_14px_rgba(0,223,0,0.4)]">
            {title}
          </h2>
          {subtitle && (
            <p className="text-xs sm:text-sm text-zinc-400 font-medium tracking-wide mt-0.5">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Right: WBM Logo */}
      {showLogo && (
        <div className="hidden sm:flex items-center gap-2 shrink-0">
          <img
            src="/assets/wbm-logo-clean.png"
            alt="WBM Technology"
            className="h-8 sm:h-10 md:h-11 w-auto object-contain drop-shadow-[0_0_10px_rgba(0,223,0,0.35)]"
          />
        </div>
      )}
    </div>
  );
};
