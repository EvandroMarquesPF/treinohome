import React from 'react';

interface BrandLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  withBackground?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ 
  className = '', 
  size = 'md',
  withBackground = true
}) => {
  const sizeMap = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
    '2xl': 'w-24 h-24'
  };

  const containerClass = `${sizeMap[size]} ${className} relative inline-flex items-center justify-center select-none shrink-0`;

  return (
    <div className={containerClass}>
      <svg 
        viewBox="0 0 512 512" 
        className="w-full h-full drop-shadow-md"
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {withBackground && (
          <rect 
            x="16" 
            y="16" 
            width="480" 
            height="480" 
            rx="110" 
            ry="110" 
            fill="#7ab81e" 
            stroke="#000000" 
            strokeWidth="16" 
          />
        )}
        
        <g stroke="#000000" strokeLinecap="round" strokeLinejoin="round">
          {/* Chimney */}
          <path d="M350 130 V200 H385 V130 Z" fill={withBackground ? "#7ab81e" : "currentColor"} strokeWidth="22" />

          {/* House Roof */}
          <path d="M105 245 L256 95 L407 245" fill="none" strokeWidth="26" />

          {/* House Walls & Floor */}
          <path d="M135 270 V405 H377 V270" fill="none" strokeWidth="26" />

          {/* Dumbbell Top Weight Stack */}
          <rect x="238" y="180" width="36" height="16" rx="6" fill={withBackground ? "#7ab81e" : "currentColor"} strokeWidth="16" />
          <rect x="200" y="196" width="112" height="34" rx="10" fill={withBackground ? "#7ab81e" : "currentColor"} strokeWidth="18" />

          {/* Dumbbell Center Bar / Handle */}
          <rect x="236" y="230" width="40" height="85" rx="8" fill={withBackground ? "#7ab81e" : "currentColor"} strokeWidth="18" />

          {/* Dumbbell Bottom Weight Stack */}
          <rect x="200" y="315" width="112" height="34" rx="10" fill={withBackground ? "#7ab81e" : "currentColor"} strokeWidth="18" />
          <rect x="216" y="349" width="80" height="18" rx="6" fill={withBackground ? "#7ab81e" : "currentColor"} strokeWidth="16" />
        </g>
      </svg>
    </div>
  );
};
