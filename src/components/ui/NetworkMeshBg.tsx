import React from 'react';
import { useTheme } from '../../context/ThemeContext';

export const NetworkMeshBg: React.FC = () => {
  const { isDark } = useTheme();
  const meshColor = isDark ? '#00DF00' : '#087C3B';
  const meshOpacity = isDark ? 'opacity-70' : 'opacity-40';

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0 transition-opacity duration-300">
      {/* Top-Right Cyber Network Nodes */}
      <svg
        className={`absolute -top-12 -right-12 w-80 h-80 sm:w-96 sm:h-96 md:w-[480px] md:h-[480px] ${meshOpacity}`}
        viewBox="0 0 400 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="meshGlow" cx="70%" cy="30%" r="60%">
            <stop offset="0%" stopColor={meshColor} stopOpacity={isDark ? "0.4" : "0.22"} />
            <stop offset="100%" stopColor={isDark ? "#000000" : "#E6EFEB"} stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="280" cy="120" r="180" fill="url(#meshGlow)" />

        {/* Network connections */}
        <g stroke={meshColor} strokeWidth={isDark ? "1.2" : "1.3"} strokeOpacity={isDark ? "0.65" : "0.55"}>
          <line x1="380" y1="20" x2="330" y2="70" />
          <line x1="330" y1="70" x2="280" y2="40" />
          <line x1="330" y1="70" x2="350" y2="140" />
          <line x1="280" y1="40" x2="230" y2="90" />
          <line x1="280" y1="40" x2="290" y2="130" />
          <line x1="230" y1="90" x2="180" y2="60" />
          <line x1="230" y1="90" x2="250" y2="160" />
          <line x1="350" y1="140" x2="290" y2="130" />
          <line x1="290" y1="130" x2="250" y2="160" />
          <line x1="350" y1="140" x2="380" y2="210" />
          <line x1="250" y1="160" x2="210" y2="220" />
          <line x1="290" y1="130" x2="320" y2="200" />
          <line x1="320" y1="200" x2="380" y2="210" />
          <line x1="320" y1="200" x2="260" y2="260" />
          <line x1="210" y1="220" x2="260" y2="260" />
          <line x1="180" y1="60" x2="140" y2="110" />
          <line x1="140" y1="110" x2="210" y2="220" />
        </g>

        {/* Network Nodes */}
        <g fill={meshColor}>
          <circle cx="380" cy="20" r="4" filter={isDark ? "drop-shadow(0 0 6px #00DF00)" : "drop-shadow(0 0 4px rgba(8,124,59,0.45))"} />
          <circle cx="330" cy="70" r="5" filter={isDark ? "drop-shadow(0 0 6px #00DF00)" : "drop-shadow(0 0 4px rgba(8,124,59,0.45))"} />
          <circle cx="280" cy="40" r="4.5" />
          <circle cx="230" cy="90" r="4" />
          <circle cx="350" cy="140" r="5.5" filter={isDark ? "drop-shadow(0 0 8px #00DF00)" : "drop-shadow(0 0 5px rgba(8,124,59,0.5))"} />
          <circle cx="290" cy="130" r="4" />
          <circle cx="250" cy="160" r="4.5" />
          <circle cx="380" cy="210" r="4" />
          <circle cx="320" cy="200" r="5" />
          <circle cx="260" cy="260" r="4" />
          <circle cx="210" cy="220" r="4.5" />
          <circle cx="180" cy="60" r="3.5" />
          <circle cx="140" cy="110" r="3" />
        </g>
      </svg>

      {/* Bottom-Left Cyber Network Nodes */}
      <svg
        className={`absolute -bottom-16 -left-16 w-72 h-72 sm:w-80 sm:h-80 md:w-96 md:h-96 ${meshOpacity}`}
        viewBox="0 0 350 350"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g stroke={meshColor} strokeWidth={isDark ? "1.2" : "1.3"} strokeOpacity={isDark ? "0.55" : "0.45"}>
          <line x1="20" y1="330" x2="70" y2="270" />
          <line x1="70" y1="270" x2="40" y2="220" />
          <line x1="70" y1="270" x2="130" y2="290" />
          <line x1="40" y1="220" x2="110" y2="200" />
          <line x1="130" y1="290" x2="170" y2="250" />
          <line x1="110" y1="200" x2="170" y2="250" />
          <line x1="110" y1="200" x2="140" y2="140" />
          <line x1="170" y1="250" x2="220" y2="280" />
          <line x1="140" y1="140" x2="200" y2="170" />
          <line x1="200" y1="170" x2="250" y2="220" />
          <line x1="220" y1="280" x2="250" y2="220" />
        </g>
        <g fill={meshColor}>
          <circle cx="20" cy="330" r="4" />
          <circle cx="70" cy="270" r="4.5" />
          <circle cx="40" cy="220" r="3.5" />
          <circle cx="130" cy="290" r="4" />
          <circle cx="110" cy="200" r="5" filter={isDark ? "drop-shadow(0 0 6px #00DF00)" : "drop-shadow(0 0 4px rgba(8,124,59,0.45))"} />
          <circle cx="170" cy="250" r="4.5" />
          <circle cx="140" cy="140" r="3.5" />
          <circle cx="200" cy="170" r="4" />
          <circle cx="220" cy="280" r="3.5" />
          <circle cx="250" cy="220" r="4" />
        </g>
      </svg>

      {/* Subtle radial glow in the center for depth */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] pointer-events-none ${isDark
          ? 'bg-[radial-gradient(circle_at_center,rgba(0,223,0,0.04)_0%,transparent_70%)]'
          : 'bg-[radial-gradient(circle_at_center,rgba(8,124,59,0.06)_0%,transparent_70%)]'
        }`} />
    </div>
  );
};
