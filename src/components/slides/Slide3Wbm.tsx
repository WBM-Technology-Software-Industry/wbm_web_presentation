import React from 'react';
import { SlideTitle } from '../ui/SlideTitle';
import { ImpactFooter } from '../ui/ImpactFooter';
import { slide3Content } from '../../data/presentationData';
import { Target } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface Slide3Props {
  isVerticalMode?: boolean;
}

export const Slide3Wbm: React.FC<Slide3Props> = ({ isVerticalMode = false }) => {
  const { isDark } = useTheme();

  return (
    <div className={`w-full flex flex-col justify-between ${isVerticalMode ? 'py-8' : 'h-full max-h-full py-4 sm:py-6'}`}>
      <SlideTitle title={slide3Content.title} />

      {/* Main Grid: Photo in Hexagon (Left) + Text Blocks (Right) */}
      <div className="my-auto py-4 sm:py-6 max-w-6xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left: Team Photo framed in Cyber Hexagon */}
          <div className="lg:col-span-5 flex justify-center items-center">
            <div className="relative group w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 flex items-center justify-center">
              {/* Animated green pulse behind */}
              <div
                className={`absolute inset-0 rounded-full blur-2xl transition-all duration-500 pointer-events-none ${
                  isDark
                    ? 'bg-[#00DF00]/20 group-hover:bg-[#00DF00]/30'
                    : 'bg-[#087C3B]/15 group-hover:bg-[#087C3B]/25'
                }`}
              />

              {/* Hexagonal container with SVG mask */}
              <div className="relative w-full h-full flex items-center justify-center">
                <svg
                  className={`w-full h-full ${
                    isDark
                      ? 'drop-shadow-[0_0_25px_rgba(0,223,0,0.45)]'
                      : 'drop-shadow-[0_4px_16px_rgba(8,124,59,0.3)]'
                  }`}
                  viewBox="0 0 400 400"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <clipPath id="hexClipWbm">
                      <polygon points="200,12 370,105 370,295 200,388 30,295 30,105" />
                    </clipPath>
                  </defs>

                  {/* Outer Hexagon border */}
                  <polygon
                    points="200,8 375,103 375,297 200,392 25,297 25,103"
                    fill="none"
                    stroke={isDark ? '#00DF00' : '#087C3B'}
                    strokeWidth="6"
                  />

                  {/* Inner Photo clipped in hexagon */}
                  <image
                    href={slide3Content.teamImage}
                    x="25"
                    y="10"
                    width="350"
                    height="380"
                    preserveAspectRatio="xMidYMid slice"
                    clipPath="url(#hexClipWbm)"
                  />
                </svg>

                {/* Subtitle tag below image */}
                <div
                  className={`absolute -bottom-2 px-3 py-1 rounded-full text-[11px] sm:text-xs font-mono tracking-wider shadow-md ${
                    isDark
                      ? 'bg-black/90 border border-[#00DF00]/50 text-[#00DF00]'
                      : 'bg-white border border-[#B8D1C3] text-[#087C3B]'
                  }`}
                >
                  Laboratório & Operações WBM
                </div>
              </div>
            </div>
          </div>

          {/* Right: Institutional Text with Green Neon Accents */}
          <div
            className={`lg:col-span-7 flex flex-col justify-center space-y-6 sm:space-y-8 pl-0 lg:pl-6 border-l-0 lg:border-l-4 ${
              isDark ? 'lg:border-[#00DF00]/80' : 'lg:border-[#087C3B]'
            }`}
          >
            
            {/* Paragraph 1 */}
            <div className="relative">
              <p
                className={`text-base sm:text-lg lg:text-xl xl:text-2xl font-normal leading-relaxed ${
                  isDark ? 'text-zinc-100' : 'text-[#172C22]'
                }`}
              >
                {slide3Content.p1Prefix}
                <strong
                  className={`font-extrabold ${
                    isDark
                      ? 'text-[#00DF00] drop-shadow-[0_0_8px_rgba(0,223,0,0.35)]'
                      : 'text-[#087C3B]'
                  }`}
                >
                  {slide3Content.p1Highlight1}
                </strong>
                {slide3Content.p1Middle}
                <strong
                  className={`font-extrabold ${
                    isDark
                      ? 'text-[#00DF00] drop-shadow-[0_0_8px_rgba(0,223,0,0.35)]'
                      : 'text-[#087C3B]'
                  }`}
                >
                  {slide3Content.p1Highlight2}
                </strong>
                {slide3Content.p1Suffix}
              </p>
            </div>

            {/* Subtle Divider */}
            <div
              className={`w-full h-px ${
                isDark
                  ? 'bg-gradient-to-r from-[#00DF00]/40 via-zinc-800 to-transparent'
                  : 'bg-gradient-to-r from-[#087C3B]/40 via-[#B8D1C3] to-transparent'
              }`}
            />

            {/* Paragraph 2 with Target Icon */}
            <div className="flex items-start gap-4 sm:gap-5">
              <div className="shrink-0 mt-1">
                <div
                  className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full border flex items-center justify-center ${
                    isDark
                      ? 'bg-gradient-to-br from-[#00DF00]/20 to-black border-[#00DF00]/60 text-[#00DF00] shadow-[0_0_15px_rgba(0,223,0,0.25)]'
                      : 'bg-[#D7EBDD] border-[#087C3B] text-[#087C3B] shadow-sm'
                  }`}
                >
                  <Target className="w-6 h-6 sm:w-7 sm:h-7 stroke-[2.2]" />
                </div>
              </div>

              <div>
                <p
                  className={`text-base sm:text-lg lg:text-xl xl:text-2xl font-normal leading-relaxed ${
                    isDark ? 'text-zinc-100' : 'text-[#172C22]'
                  }`}
                >
                  <strong
                    className={`font-extrabold ${
                      isDark
                        ? 'text-[#00DF00] drop-shadow-[0_0_8px_rgba(0,223,0,0.35)]'
                        : 'text-[#087C3B]'
                    }`}
                  >
                    {slide3Content.p2Highlight1}
                  </strong>
                  {slide3Content.p2Middle1}
                  <strong
                    className={`font-extrabold ${
                      isDark
                        ? 'text-[#00DF00] drop-shadow-[0_0_8px_rgba(0,223,0,0.35)]'
                        : 'text-[#087C3B]'
                    }`}
                  >
                    {slide3Content.p2Highlight2}
                  </strong>
                  {slide3Content.p2Middle2}
                  <strong
                    className={`font-extrabold ${
                      isDark
                        ? 'text-[#00DF00] drop-shadow-[0_0_8px_rgba(0,223,0,0.35)]'
                        : 'text-[#087C3B]'
                    }`}
                  >
                    {slide3Content.p2Highlight3}
                  </strong>
                </p>
              </div>
            </div>

          </div>

        </div>
      </div>

      <ImpactFooter
        topLine={slide3Content.footerTop}
        bottomLine={slide3Content.footerBottom}
      />
    </div>
  );
};
