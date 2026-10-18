import React, { useState, useEffect, useCallback, Suspense, lazy } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import type { NavTab } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { FilterBar } from './components/ui/FilterBar';
import { LoadingState } from './components/ui/LoadingState';
import { ErrorBoundary } from './components/ui/ErrorBoundary';
import { AlertTriangle, RotateCcw } from 'lucide-react';

import { OverviewPage } from './pages/OverviewPage';

// Route-level code-splitting for high performance bundle optimization
const SalesAnalyticsPage = lazy(() =>
  import('./pages/SalesAnalyticsPage').then((m) => ({ default: m.SalesAnalyticsPage }))
);
const StoreCategoryPage = lazy(() =>
  import('./pages/StoreCategoryPage').then((m) => ({ default: m.StoreCategoryPage }))
);
const RiskAnalysisPage = lazy(() =>
  import('./pages/RiskAnalysisPage').then((m) => ({ default: m.RiskAnalysisPage }))
);
const ParetoPage = lazy(() =>
  import('./pages/ParetoPage').then((m) => ({ default: m.ParetoPage }))
);
const DataExplorerPage = lazy(() =>
  import('./pages/DataExplorerPage').then((m) => ({ default: m.DataExplorerPage }))
);

import { api } from './services/api';
import type {
  DashboardOverview,
  FilterOptions,
  ActiveFilters,
  HealthStatus,
} from './types';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<NavTab>('overview');
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [isMobileOpen, setIsMobileOpen] = useState<boolean>(false);

  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [overviewData, setOverviewData] = useState<DashboardOverview | null>(null);
  const [filterOptions, setFilterOptions] = useState<FilterOptions | null>(null);
  const [filters, setFilters] = useState<ActiveFilters>({});
  const [showFilters, setShowFilters] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Fetch initial health and filter options
  useEffect(() => {
    let isMounted = true;
    api
      .getHealth()
      .then((h) => isMounted && setHealth(h))
      .catch((e) => console.error('Health check failed', e));

    api
      .getFilters()
      .then((f) => isMounted && setFilterOptions(f))
      .catch((e) => console.error('Filters check failed', e));

    return () => {
      isMounted = false;
    };
  }, []);

  // Fetch overview data when filters change or when refreshed
  const loadOverview = useCallback(() => {
    api
      .getOverview(filters)
      .then((data) => {
        setOverviewData(data);
        setError(null);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load overview data', err);
        setError(err?.message || 'Database connection timeout.');
        setIsLoading(false);
      });
  }, [filters]);

  useEffect(() => {
    loadOverview();
  }, [loadOverview]);

  const handleFilterChange = (key: keyof ActiveFilters, value: string | number | undefined) => {
    setIsLoading(true);
    setError(null);
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleResetFilters = () => {
    setIsLoading(true);
    setError(null);
    setFilters({});
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setError(null);
    loadOverview();
  };

  const activeFilterCount = Object.values(filters).filter(
    (v) => v !== undefined && v !== ''
  ).length;

  return (
    <div className="flex min-h-screen bg-[#0b0f19] text-slate-100 font-sans selection:bg-indigo-500/30">
      {/* Collapsible and Responsive Sidebar with sticky vertical scroll */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        healthConnected={health?.database === 'connected'}
        totalRows={health?.counts?.sales || 641843}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <Header
          activeTab={activeTab}
          onRefresh={handleRefresh}
          isLoading={isLoading}
          filterCount={activeFilterCount}
          toggleFilterBar={() => setShowFilters(!showFilters)}
          showFilters={showFilters}
          onOpenMobileNav={() => setIsMobileOpen(true)}
        />

        <FilterBar
          options={filterOptions}
          filters={filters}
          onFilterChange={handleFilterChange}
          onReset={handleResetFilters}
          isOpen={showFilters}
        />

        <main className="flex-1 p-4 sm:p-8">
          <ErrorBoundary>
            <Suspense fallback={<LoadingState message="Loading view module..." />}>
              {activeTab === 'overview' &&
                (overviewData ? (
                  <OverviewPage data={overviewData} />
                ) : error ? (
                  <div className="flex flex-col items-center justify-center min-h-[420px] text-center p-8 bg-slate-900/60 border border-slate-800 rounded-2xl max-w-lg mx-auto mt-12 shadow-xl shadow-black/40">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-4">
                      <AlertTriangle className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">Cloud Database Connection Error</h3>
                    <p className="text-sm text-slate-400 mb-6 leading-relaxed">
                      {error}
                      <br />
                      <span className="text-xs text-slate-400 mt-2 block">
                        If you are connected to a restricted Wi-Fi network, outbound PostgreSQL port 5432 may be blocked. Switching to mobile hotspot or allowing port 5432 restores full connectivity.
                      </span>
                    </p>
                    <button
                      onClick={handleRefresh}
                      className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-medium transition-all shadow-lg shadow-indigo-600/25 flex items-center gap-2 cursor-pointer"
                    >
                      <RotateCcw className="w-4 h-4" />
                      Retry Connection
                    </button>
                  </div>
                ) : (
                  <LoadingState message="Connecting to Neon & compiling overview..." />
                ))}

              {activeTab === 'sales' && <SalesAnalyticsPage filters={filters} />}

              {activeTab === 'stores' && <StoreCategoryPage filters={filters} />}

              {activeTab === 'risk' && <RiskAnalysisPage />}

              {activeTab === 'pareto' && <ParetoPage filters={filters} />}

              {activeTab === 'explorer' && <DataExplorerPage filters={filters} />}
            </Suspense>
          </ErrorBoundary>
        </main>
      </div>
    </div>
  );
};

export default App;