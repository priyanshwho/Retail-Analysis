import React from 'react';

export const LoadingState: React.FC<{ message?: string }> = ({
  message = 'Calculating retail metrics...',
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[380px] p-8 animate-fadeIn">
      <div className="relative flex items-center justify-center mb-6">
        {/* Soft Ambient Glow Halo */}
        <div className="absolute w-24 h-24 rounded-full bg-blue-500/20 dark:bg-blue-600/20 blur-xl animate-pulse" />

        {/* Outer Counter-Clockwise Orbit Ring */}
        <div className="w-16 h-16 rounded-full border-2 border-blue-200/40 dark:border-blue-900/30 border-t-blue-600 dark:border-t-blue-400 border-r-sky-500 animate-spin [animation-duration:2.5s]" />

        {/* Inner Clockwise Orbit Ring */}
        <div className="absolute w-11 h-11 rounded-full border-2 border-transparent border-b-blue-600 dark:border-b-blue-300 border-l-sky-400 animate-spin [animation-duration:1.2s] [animation-direction:reverse]" />

        {/* Center BlueMart Monogram Node */}
        <div className="absolute w-7 h-7 rounded-lg bg-gradient-to-tr from-blue-600 to-sky-500 flex items-center justify-center shadow-md shadow-blue-500/30">
          <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
        </div>
      </div>

      {/* Primary Message */}
      <h4 className="text-sm font-bold text-slate-800 dark:text-[#F1F3F7] tracking-tight text-center">
        {message}
      </h4>

      {/* Live Query Subtitle with Pulsing Indicator */}
      <div className="flex items-center gap-2 mt-2 px-3 py-1 rounded-full bg-blue-50/80 dark:bg-[#14161F] border border-blue-200/60 dark:border-[#222634] text-xs font-medium text-blue-700 dark:text-[#0ea5e9]">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600 dark:bg-[#4F46E5]" />
        </span>
        <span>Querying live Neon PostgreSQL</span>
      </div>

      <p className="text-[11px] text-slate-500 dark:text-[#6C7693] mt-2 font-medium">
        Aggregating granular transaction ledger in real-time
      </p>
    </div>
  );
};
