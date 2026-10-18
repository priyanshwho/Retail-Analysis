import React from 'react';

export const BlueMartLogo: React.FC<{ className?: string; size?: number }> = ({
  className = 'w-10 h-10',
  size = 40,
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 transition-transform duration-300 group-hover:scale-105 shadow-md shadow-indigo-600/20 ${className}`}
    >
      <defs>
        <linearGradient id="bluemart-logo-bg" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#3730A3" />
          <stop offset="50%" stopColor="#4F46E5" />
          <stop offset="100%" stopColor="#0EA5E9" />
        </linearGradient>
        <linearGradient id="bluemart-logo-spark" x1="18" y1="32" x2="48" y2="50" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="100%" stopColor="#34D399" />
        </linearGradient>
      </defs>

      {/* Outer Squircle Badge */}
      <rect width="64" height="64" rx="16" fill="url(#bluemart-logo-bg)" />

      {/* Inner Highlight Border */}
      <rect x="1" y="1" width="62" height="62" rx="15" stroke="rgba(255, 255, 255, 0.25)" strokeWidth="1.5" />

      {/* 2D Monogram "B" + Retail Analytics Bars */}
      {/* Left Spine Bar */}
      <rect x="15" y="14" width="6.5" height="36" rx="3.25" fill="#FFFFFF" />

      {/* Top Loop (Retail Cart Handle & Upper Lobe) */}
      <path
        d="M20 17.5 H33 C37.6944 17.5 41.5 21.3056 41.5 26 C41.5 30.6944 37.6944 34.5 33 34.5 H20"
        stroke="#FFFFFF"
        strokeWidth="6.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Bottom Loop (Dynamic Analytics Wave & Growth Momentum) */}
      <path
        d="M20 34.5 H35.5 C40.7467 34.5 45 38.7533 45 43.5 C45 47.5 41.5 49.5 36 49.5 H20"
        stroke="url(#bluemart-logo-spark)"
        strokeWidth="6.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Analytics Data Point Indicator */}
      <circle cx="33" cy="26" r="3" fill="#38BDF8" />
    </svg>
  );
};
