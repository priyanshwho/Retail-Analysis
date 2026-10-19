import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  TrendingDown,
  PackageX,
  Info,
} from 'lucide-react';
import { api } from '../services/api';
import type { RiskAnalysisResponse } from '../types';
import { ChartCard } from '../components/ui/ChartCard';
import { RiskAnalysisSkeleton } from '../components/ui/Skeleton';

export const RiskAnalysisPage: React.FC = () => {
  const [data, setData] = useState<RiskAnalysisResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'high_sales_low_stock' | 'low_stock' | 'high_sales_low_profit'>('high_sales_low_stock');

  useEffect(() => {
    let isMounted = true;
    api
      .getRiskAnalysis()
      .then((res) => {
        if (isMounted) {
          setData(res);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error('Failed to load risk analysis', err);
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading || !data) {
    return <RiskAnalysisSkeleton />;
  }

  const { high_sales_low_stock, low_stock, high_sales_low_profit } = data;

  const tabs = [
    {
      id: 'high_sales_low_stock' as const,
      label: 'High Demand / Low Stock',
      count: high_sales_low_stock.length,
      icon: PackageX,
      color: 'rose',
      desc: 'Products with sales quantity > median but stock on hand < median. High risk of stockouts and lost revenue.',
    },
    {
      id: 'high_sales_low_profit' as const,
      label: 'High Sales / Low Profit',
      count: high_sales_low_profit.length,
      icon: TrendingDown,
      color: 'amber',
      desc: 'Products with sales > median but profit < median. Margin leaks from heavy discounting or low markup.',
    },
    {
      id: 'low_stock' as const,
      label: 'Below Reorder Point',
      count: low_stock.length,
      icon: AlertTriangle,
      color: 'cyan',
      desc: 'Store inventory items where stock on hand has dropped below the critical reorder point.',
    },
  ];

  const currentTabInfo = tabs.find((t) => t.id === activeTab)!;
  const currentItems = data[activeTab];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Risk Quadrant KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`text-left glass-panel rounded-2xl p-5 border transition-all cursor-pointer ${
                isSelected
                  ? 'border-indigo-500 bg-[#E2ECF5] dark:bg-[#14161F] dark:border-[#4F46E5] shadow-lg shadow-indigo-500/10 -translate-y-1'
                  : 'border-[#CBDCEB] dark:border-[#222634] dark:bg-[#14161F]/60 hover:border-indigo-400 dark:hover:border-[#4F46E5]/60'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-700 dark:text-[#6C7693] uppercase tracking-wide">
                  {tab.label}
                </span>
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                    tab.color === 'rose'
                      ? 'bg-rose-500/10 text-rose-600 dark:text-[#F43F5E]'
                      : tab.color === 'amber'
                      ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                      : 'bg-cyan-500/10 text-cyan-700 dark:text-[#0ea5e9]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-3xl font-extrabold text-slate-900 dark:text-[#F1F3F7]">{tab.count}</span>
                <span className="text-xs text-slate-600 dark:text-[#6C7693] font-medium">SKUs flagged</span>
              </div>

              <p className="text-xs text-slate-600 dark:text-[#6C7693] line-clamp-2 mt-2 leading-relaxed">
                {tab.desc}
              </p>
            </button>
          );
        })}
      </div>

      {/* Explanatory Banner */}
      <div className="glass-panel p-5 rounded-2xl border border-indigo-200 dark:border-[#4F46E5]/30 bg-indigo-50/70 dark:bg-[#4F46E5]/10 flex items-start gap-3.5">
        <Info className="w-5 h-5 text-indigo-600 dark:text-[#4F46E5] shrink-0 mt-0.5" />
        <div className="text-xs space-y-1 text-slate-700 dark:text-[#F1F3F7]">
          <div className="font-bold text-indigo-800 dark:text-[#F1F3F7] text-sm">
            {currentTabInfo.label} Analysis
          </div>
          <p className="text-slate-600 dark:text-[#6C7693] font-medium">{currentTabInfo.desc}</p>
        </div>
      </div>

      {/* Risk Table */}
      <ChartCard
        title={`Flagged Catalog Items (${currentItems.length} SKUs)`}
        subtitle="Ranked priority list for operational replenishment and margin adjustments"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#D9E3EE] dark:border-[#222634] text-slate-700 dark:text-[#6C7693] uppercase tracking-wider font-bold">
                <th className="pb-3 px-2 whitespace-nowrap">SKU ID</th>
                <th className="pb-3 whitespace-nowrap">Product Name</th>
                <th className="pb-3 whitespace-nowrap">Category</th>
                <th className="pb-3 whitespace-nowrap">Brand</th>
                {activeTab !== 'low_stock' && (
                  <>
                    <th className="pb-3 px-3 text-right whitespace-nowrap">Sales Qty</th>
                    <th className="pb-3 px-3 text-right whitespace-nowrap">Revenue</th>
                    <th className="pb-3 px-3 text-right whitespace-nowrap">Profit</th>
                  </>
                )}
                <th className="pb-3 px-3 text-right whitespace-nowrap">Stock</th>
                <th className="pb-3 px-3 text-right whitespace-nowrap">Reorder Point</th>
                <th className="pb-3 px-3 whitespace-nowrap">Diagnostic Reason</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0] dark:divide-[#222634]">
              {currentItems.map((item, idx) => (
                <tr key={`${item.sku_id}-${idx}`} className="hover:bg-[#EBF2F7] dark:hover:bg-[#181B26] transition-colors">
                  <td className="py-3 px-2 font-mono text-slate-600 dark:text-[#6C7693] whitespace-nowrap">#{item.sku_id}</td>
                  <td className="py-3 font-semibold text-slate-900 dark:text-[#F1F3F7] whitespace-nowrap">{item.sku_name}</td>
                  <td className="py-3 whitespace-nowrap">
                    <span className="inline-block whitespace-nowrap px-2.5 py-0.5 rounded-full bg-[#E2ECF5] text-slate-800 border border-[#CBDCEB] dark:bg-[#090A0F] dark:text-[#6C7693] dark:border-[#222634] text-[10px] font-medium">
                      {item.category}
                    </span>
                  </td>
                  <td className="py-3 text-slate-600 dark:text-[#6C7693] font-medium whitespace-nowrap">{item.brand}</td>
                  {activeTab !== 'low_stock' && (
                    <>
                      <td className="py-3 px-3 text-right font-mono font-medium text-slate-900 dark:text-[#F1F3F7] whitespace-nowrap">
                        {item.total_sales_quantity?.toLocaleString()}
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-slate-900 dark:text-[#F1F3F7] font-bold whitespace-nowrap">
                        {item.total_revenue?.toLocaleString()}
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-emerald-600 dark:text-emerald-400 font-semibold whitespace-nowrap">
                        {item.total_profit?.toLocaleString()}
                      </td>
                    </>
                  )}
                  <td className="py-3 px-3 text-right font-mono font-bold text-rose-600 dark:text-[#F43F5E] whitespace-nowrap">
                    {item.stock_on_hand?.toLocaleString()}
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-slate-600 dark:text-[#6C7693] whitespace-nowrap">
                    {item.reorder_point?.toLocaleString()}
                  </td>
                  <td className="py-3 px-3 text-slate-700 dark:text-[#6C7693] max-w-xs text-[11px] leading-tight font-medium">
                    {item.reason}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ChartCard>
    </div>
  );
};
