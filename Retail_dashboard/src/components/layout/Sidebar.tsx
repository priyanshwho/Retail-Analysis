import React from 'react';
import {
  LayoutDashboard,
  TrendingUp,
  Store,
  AlertTriangle,
  PieChart,
  Database,
  ChevronRight,
  DatabaseZap,
  PanelLeftClose,
  PanelLeftOpen,
  X,
} from 'lucide-react';
import { BlueMartLogo } from '../ui/BlueMartLogo';

export type NavTab = 'overview' | 'sales' | 'stores' | 'risk' | 'pareto' | 'explorer';

interface SidebarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  healthConnected: boolean;
  totalRows?: number;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

const navItems: { id: NavTab; label: string; icon: React.ElementType; badge?: string }[] = [
  { id: 'overview', label: 'Executive Overview', icon: LayoutDashboard },
  { id: 'sales', label: 'Sales & Trends', icon: TrendingUp },
  { id: 'stores', label: 'Stores & Categories', icon: Store },
  { id: 'risk', label: 'Risk Analysis', icon: AlertTriangle, badge: 'Crucial' },
  { id: 'pareto', label: 'Pareto (80/20)', icon: PieChart },
  { id: 'explorer', label: 'Data Explorer', icon: Database },
];

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  healthConnected,
  totalRows = 641843,
  isCollapsed,
  setIsCollapsed,
  isMobileOpen,
  setIsMobileOpen,
}) => {
  const handleNavClick = (tab: NavTab) => {
    setActiveTab(tab);
    setIsMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={() => setIsMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Main Sidebar Element */}
      <aside
        className={`fixed lg:sticky top-0 h-screen max-h-screen bg-[#F4F1EA]/95 dark:bg-slate-900/95 border-r border-[#E2DDD2] dark:border-slate-800 flex flex-col justify-between shrink-0 z-50 transition-all duration-300 ease-in-out overflow-y-auto overflow-x-hidden ${
          /* Mobile positioning */
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } ${
          /* Desktop collapsed vs expanded width */
          isCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        <div>
          {/* Brand Header */}
          <div className="p-4 border-b border-[#E2DDD2] dark:border-slate-800/80 flex items-center justify-between">
            <button
              onClick={() => handleNavClick('overview')}
              className="group flex items-center gap-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-xl cursor-pointer"
              title="BlueMart Retail Intelligence"
            >
              <BlueMartLogo size={38} className="w-9.5 h-9.5" />
              {!isCollapsed && (
                <div className="overflow-hidden">
                  <h1 className="text-base font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                    BlueMart
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-400 border border-indigo-500/20 font-medium">
                      BI
                    </span>
                  </h1>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">Retail Intelligence</p>
                </div>
              )}
            </button>

            {/* Desktop Collapse Toggle */}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden lg:flex p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-[#EAE5DC] dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 cursor-pointer"
              title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {isCollapsed ? (
                <PanelLeftOpen className="w-4 h-4" />
              ) : (
                <PanelLeftClose className="w-4 h-4" />
              )}
            </button>

            {/* Mobile Close Button */}
            <button
              onClick={() => setIsMobileOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-[#EAE5DC] dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 transition-colors"
              aria-label="Close navigation"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="p-3 space-y-1.5" aria-label="Main Navigation">
            {!isCollapsed && (
              <div className="px-3 pb-2 pt-2 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Analytics Views
              </div>
            )}
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  title={isCollapsed ? item.label : undefined}
                  className={`w-full flex items-center ${
                    isCollapsed ? 'justify-center px-2 py-3' : 'justify-between px-3.5 py-2.5'
                  } rounded-xl text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md shadow-indigo-600/25 border border-indigo-500/40 font-semibold'
                      : 'text-slate-700 hover:text-slate-950 hover:bg-[#EAE5DC] dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`} />
                    {!isCollapsed && <span className="truncate">{item.label}</span>}
                  </div>
                  {!isCollapsed && (
                    <div className="flex items-center gap-1.5 shrink-0">
                      {item.badge && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-rose-500/10 text-rose-700 border border-rose-500/20 dark:bg-rose-500/20 dark:text-rose-300 dark:border-rose-500/30 font-semibold">
                          {item.badge}
                        </span>
                      )}
                      {isActive && <ChevronRight className="w-3.5 h-3.5 text-indigo-200" />}
                    </div>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Database Live Status Widget */}
        <div className={`p-3 m-2 rounded-xl bg-[#EFEAE0] border border-[#DDD6C8] dark:bg-slate-950/70 dark:border-slate-800/80 transition-all ${isCollapsed ? 'text-center' : ''}`}>
          {isCollapsed ? (
            <div
              className="flex flex-col items-center gap-1 py-1"
              title={`Neon PostgreSQL: ${healthConnected ? 'Live' : 'Offline'} (${totalRows.toLocaleString()} rows)`}
            >
              <DatabaseZap className={`w-4 h-4 ${healthConnected ? 'text-cyan-600 dark:text-cyan-400' : 'text-rose-600 dark:text-rose-400'}`} />
              <span
                className={`w-2 h-2 rounded-full ${
                  healthConnected ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'
                }`}
              />
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-800 dark:text-slate-300">
                  <DatabaseZap className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400 shrink-0" />
                  <span className="truncate">Neon PostgreSQL</span>
                </div>
                <span className="flex items-center gap-1.5 text-[10px] shrink-0">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      healthConnected ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'
                    }`}
                  />
                  <span className={healthConnected ? 'text-emerald-700 dark:text-emerald-400 font-medium' : 'text-rose-700 dark:text-rose-400 font-medium'}>
                    {healthConnected ? 'Live' : 'Offline'}
                  </span>
                </span>
              </div>
              <div className="space-y-1 text-[11px] text-slate-600 dark:text-slate-400">
                <div className="flex justify-between">
                  <span>Branch</span>
                  <span className="font-mono text-slate-800 dark:text-slate-300 font-medium">production</span>
                </div>
                <div className="flex justify-between">
                  <span>Sales Ledger</span>
                  <span className="font-mono text-slate-800 dark:text-slate-300 font-medium">{totalRows.toLocaleString()}</span>
                </div>
              </div>
            </>
          )}
        </div>
      </aside>
    </>
  );
};
