import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingState: React.FC<{ message?: string }> = ({
  message = 'Calculating retail metrics...',
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
      <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-indigo-400 animate-spin" />
      </div>
      <p className="text-sm font-medium text-slate-300">{message}</p>
      <p className="text-xs text-slate-400">Querying live Neon PostgreSQL database</p>
    </div>
  );
};
