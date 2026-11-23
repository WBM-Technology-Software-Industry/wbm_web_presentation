import React from 'react';
import { useTheme } from '../../context/ThemeContext';

interface TechHexagonProps {
  children?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  glow?: boolean;
}

export const TechHexagon: React.FC<TechHexagonProps> = ({
  children,
  size = 'md',
  className = '',
  glow = true,
}) => {
  const { isDark } = useTheme();

  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-14 h-14 sm:w-16 sm:h-16',
    lg: 'w-20 h-20 sm:w-24 sm:h-24',
    xl: 'w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44',
  };

  const glowClass = glow
    ? isDark
      ? 'drop-shadow-[0_0_12px_rgba(0,223,0,0.5)]'
      : 'drop-shadow-[0_2px_8px_rgba(8,124,59,0.3)]'
    : '';

  return (
    <div
      className={`relative flex items-center justify-center shrink-0 ${sizeClasses[size]} ${glowClass} ${className}`}
    >
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Hexagon polygon background */}
        <polygon
          points="50,3 93,26 93,74 50,97 7,74 7,26"
          fill={isDark ? '#080c08' : '#ffffff'}
          stroke={isDark ? '#00DF00' : '#087C3B'}
          strokeWidth="3.5"
        />
        {/* Inner thin contour */}
        <polygon
          points="50,8 88,29 88,71 50,92 12,71 12,29"
          fill="none"
          stroke={isDark ? '#00DF00' : '#087C3B'}
          strokeWidth="0.75"
          strokeDasharray="4 2"
          opacity={isDark ? 0.4 : 0.3}
        />
      </svg>
      <div className="relative z-10 flex items-center justify-center">
        {children}
      </div>
    </div>
  );
};
