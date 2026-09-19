import React from 'react';

interface LogoProps {
  variant?: 'full' | 'icon' | 'wordmark';
  size?: number;
  className?: string;
}

/**
 * AquaSense Logo Component
 * 
 * A scalable SVG logo component with three variants:
 * - full: Complete logo with icon and wordmark
 * - icon: Logo symbol only
 * - wordmark: Text branding with wave decoration
 * 
 * @param variant - Logo variant to display (default: 'full')
 * @param size - Size in pixels for width (height scales proportionally)
 * @param className - Additional CSS classes
 * 
 * **Validates: Requirements 1.5, 4.5, 24.1**
 */
export const Logo: React.FC<LogoProps> = ({ 
  variant = 'full', 
  size,
  className = '' 
}) => {
  // Determine dimensions based on variant
  const getViewBox = () => {
    switch (variant) {
      case 'icon':
        return '0 0 48 48';
      case 'wordmark':
        return '0 0 140 48';
      case 'full':
      default:
        return '0 0 200 48';
    }
  };

  const getDefaultSize = () => {
    switch (variant) {
      case 'icon':
        return 48;
      case 'wordmark':
        return 140;
      case 'full':
      default:
        return 200;
    }
  };

  const getAspectRatio = () => {
    switch (variant) {
      case 'icon':
        return 1; // 48:48 = 1:1
      case 'wordmark':
        return 140 / 48; // ~2.917:1
      case 'full':
      default:
        return 200 / 48; // ~4.167:1
    }
  };

  const width = size !== undefined ? size : getDefaultSize();
  const height = width / getAspectRatio();

  // Icon Only variant (48x48)
  if (variant === 'icon') {
    return (
      <svg
        width={width}
        height={height}
        viewBox={getViewBox()}
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-label="AquaSense Logo"
        role="img"
      >
        <defs>
          <linearGradient id="gi" x1="24" y1="4" x2="24" y2="44">
            <stop offset="0" stopColor="#1B7FBD" />
            <stop offset="1" stopColor="#4DD0E1" />
          </linearGradient>
        </defs>
        <circle 
          cx="24" 
          cy="24" 
          r="22" 
          stroke="#4DD0E1" 
          strokeWidth="1.5" 
          opacity=".3" 
          fill="none" 
        />
        <circle 
          cx="24" 
          cy="24" 
          r="18" 
          stroke="#4DD0E1" 
          strokeWidth="1.5" 
          opacity=".5" 
          fill="none" 
        />
        <path 
          d="M24 4c-7.732 0-14 6.268-14 14 0 7.732 14 26 14 26s14-18.268 14-26c0-7.732-6.268-14-14-14Z" 
          fill="url(#gi)" 
          stroke="#0A3D62" 
          strokeWidth="1.5" 
        />
        <path 
          d="m24 12-6 14h2.5l1.5-3h4l1.5 3H30L24 12Z" 
          fill="#fff" 
          stroke="#fff" 
          strokeWidth=".5" 
          strokeLinejoin="round" 
        />
        <path 
          d="M22.5 21 24 17l1.5 4h-3Z" 
          fill="#0A3D62" 
        />
        <path 
          d="M14 18s2 2 4 2 4-2 6-2 4 2 6 2 4-2 4-2" 
          stroke="#1B7FBD" 
          strokeWidth="1.5" 
          fill="none" 
          strokeLinecap="round" 
        />
      </svg>
    );
  }

  // Wordmark variant (140x48)
  if (variant === 'wordmark') {
    return (
      <svg
        width={width}
        height={height}
        viewBox={getViewBox()}
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-label="AquaSense"
        role="img"
      >
        <text 
          x="0" 
          y="22" 
          fontFamily="Inter,system-ui,sans-serif" 
          fontSize="20" 
          fontWeight="700" 
          fill="#0A3D62" 
          letterSpacing="-.02em"
        >
          Aqua
        </text>
        <text 
          x="0" 
          y="42" 
          fontFamily="Inter,system-ui,sans-serif" 
          fontSize="18" 
          fontWeight="500" 
          fill="#1B7FBD" 
          letterSpacing="-.01em"
        >
          Sense
        </text>
        <path 
          d="M0 28c4 0 6 2 10 2s6-2 10-2 6 2 10 2 6-2 10-2 6 2 10 2 6-2 10-2" 
          stroke="#4DD0E1" 
          strokeWidth="1.5" 
          fill="none" 
          strokeLinecap="round" 
          opacity=".4" 
        />
      </svg>
    );
  }

  // Full logo variant (200x48) - default
  return (
    <svg
      width={width}
      height={height}
      viewBox={getViewBox()}
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="AquaSense"
      role="img"
    >
      <defs>
        <linearGradient id="g1" x1="24" y1="4" x2="24" y2="44">
          <stop offset="0" stopColor="#1B7FBD" />
          <stop offset="1" stopColor="#4DD0E1" />
        </linearGradient>
      </defs>
      <circle 
        cx="24" 
        cy="24" 
        r="22" 
        stroke="#4DD0E1" 
        strokeWidth="1.5" 
        opacity=".3" 
        fill="none" 
      />
      <circle 
        cx="24" 
        cy="24" 
        r="18" 
        stroke="#4DD0E1" 
        strokeWidth="1.5" 
        opacity=".5" 
        fill="none" 
      />
      <path 
        d="M24 4c-7.732 0-14 6.268-14 14 0 7.732 14 26 14 26s14-18.268 14-26c0-7.732-6.268-14-14-14Z" 
        fill="url(#g1)" 
        stroke="#0A3D62" 
        strokeWidth="1.5" 
      />
      <path 
        d="m24 12-6 14h2.5l1.5-3h4l1.5 3H30L24 12Z" 
        fill="#fff" 
        stroke="#fff" 
        strokeWidth=".5" 
        strokeLinejoin="round" 
      />
      <path 
        d="M22.5 21 24 17l1.5 4h-3Z" 
        fill="#0A3D62" 
      />
      <path 
        d="M14 18s2 2 4 2 4-2 6-2 4 2 6 2 4-2 4-2" 
        stroke="#1B7FBD" 
        strokeWidth="1.5" 
        fill="none" 
        strokeLinecap="round" 
      />
      <g fontFamily="Inter,system-ui,sans-serif">
        <text 
          x="52" 
          y="20" 
          fontSize="18" 
          fontWeight="700" 
          fill="#0A3D62"
        >
          Aqua
        </text>
        <text 
          x="52" 
          y="38" 
          fontSize="16" 
          fontWeight="500" 
          fill="#1B7FBD"
        >
          Sense
        </text>
      </g>
    </svg>
  );
};

export default Logo;
