import React, { useState, useEffect, useCallback } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import type { NavTab } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { FilterBar } from './components/ui/FilterBar';
import { LoadingState } from './components/ui/LoadingState';

import { OverviewPage } from './pages/OverviewPage';
import { SalesAnalyticsPage } from './pages/SalesAnalyticsPage';
import { StoreCategoryPage } from './pages/StoreCategoryPage';
import { RiskAnalysisPage } from './pages/RiskAnalysisPage';
import { ParetoPage } from './pages/ParetoPage';
import { DataExplorerPage } from './pages/DataExplorerPage';

import { api } from './services/api';
import type {
  DashboardOverview,
  FilterOptions,
  ActiveFilters,
  HealthStatus,
} from './types';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<NavTab>('overview');
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [overviewData, setOverviewData] = useState<DashboardOverview | null>(null);
  const [filterOptions, setFilterOptions] = useState<FilterOptions | null>(null);
  const [filters, setFilters] = useState<ActiveFilters>({});
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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
    setIsLoading(true);
    api
      .getOverview(filters)
      .then((data) => {
        setOverviewData(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load overview data', err);
        setIsLoading(false);
      });
  }, [filters]);

  useEffect(() => {
    loadOverview();
  }, [loadOverview]);

  const handleFilterChange = (key: keyof ActiveFilters, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleResetFilters = () => {
    setFilters({});
  };

  const activeFilterCount = Object.values(filters).filter(
    (v) => v !== undefined && v !== ''
  ).length;

  return (
    <div className="flex min-h-screen bg-[#0b0f19] text-slate-100 font-sans selection:bg-indigo-500/30">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        healthConnected={health?.database === 'connected'}
        totalRows={health?.counts?.sales || 641843}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          activeTab={activeTab}
          onRefresh={loadOverview}
          isLoading={isLoading}
          filterCount={activeFilterCount}
          toggleFilterBar={() => setShowFilters(!showFilters)}
          showFilters={showFilters}
        />

        <FilterBar
          options={filterOptions}
          filters={filters}
          onFilterChange={handleFilterChange}
          onReset={handleResetFilters}
          isOpen={showFilters}
        />

        <main className="flex-1 p-8 overflow-y-auto">
          {activeTab === 'overview' &&
            (overviewData ? (
              <OverviewPage data={overviewData} />
            ) : (
              <LoadingState message="Connecting to Neon & compiling overview..." />
            ))}

          {activeTab === 'sales' && <SalesAnalyticsPage filters={filters} />}

          {activeTab === 'stores' && <StoreCategoryPage filters={filters} />}

          {activeTab === 'risk' && <RiskAnalysisPage />}

          {activeTab === 'pareto' && <ParetoPage filters={filters} />}

          {activeTab === 'explorer' && <DataExplorerPage filters={filters} />}
        </main>
      </div>
    </div>
  );
};

export default App;