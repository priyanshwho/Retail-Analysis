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
        {/* Light Mode Theme Gradients */}
        <linearGradient id="bm-logo-bg-light" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#312E81" />
          <stop offset="45%" stopColor="#4F46E5" />
          <stop offset="100%" stopColor="#0EA5E9" />
        </linearGradient>

        <linearGradient id="bm-logo-wave" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="100%" stopColor="#0EA5E9" />
        </linearGradient>

        <linearGradient id="bm-logo-ring" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#818CF8" stopOpacity="0.6" />
          <stop offset="50%" stopColor="#38BDF8" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#0EA5E9" stopOpacity="0.7" />
        </linearGradient>
      </defs>

      {/* Ambient Outer Ring */}
      <rect
        x="1"
        y="1"
        width="62"
        height="62"
        rx="17"
        strokeWidth="1.75"
        className="stroke-white/30 dark:stroke-[url(#bm-logo-ring)]"
        fill="none"
      />

      {/* Main Squircle Body */}
      <rect
        x="2"
        y="2"
        width="60"
        height="60"
        rx="16"
        fill="url(#bm-logo-bg-light)"
      />

      {/* Inner Soft Bevel Highlight */}
      <rect
        x="3"
        y="3"
        width="58"
        height="58"
        rx="15"
        stroke="rgba(255, 255, 255, 0.16)"
        strokeWidth="1"
        fill="none"
      />

      {/* 2D Monogram B with Integrated Retail Analytics Flow */}
      {/* Left Vertical Spine */}
      <rect x="16" y="15" width="6.5" height="34" rx="3.25" fill="#FFFFFF" />

      {/* Top Retail Cart / Upper Lobe */}
      <path
        d="M21 18.5 H32.5 C37.1944 18.5 41 22.3056 41 27 C41 31.6944 37.1944 35.5 32.5 35.5 H21"
        stroke="#FFFFFF"
        strokeWidth="6.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Bottom Analytics Wave / Growth Curve */}
      <path
        d="M21 35.5 H34.5 C39.4706 35.5 43.5 39.5294 43.5 44.5 C43.5 46.8 41.5 48.5 36.5 48.5 H21"
        stroke="url(#bm-logo-wave)"
        strokeWidth="6.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Center Analytics Focal Data Point */}
      <circle cx="32.5" cy="27" r="3.25" fill="#38BDF8" />
      <circle cx="32.5" cy="27" r="1.25" fill="#FFFFFF" />
    </svg>
  );
};
