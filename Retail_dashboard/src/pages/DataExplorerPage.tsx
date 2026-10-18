import React, { useState, useEffect } from 'react';
import {
  Download,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  ChevronDown,
} from 'lucide-react';
import { api } from '../services/api';
import type {
  SalesRecord,
  InventoryRecord,
  PaginatedResponse,
  ActiveFilters,
} from '../types';
import { ChartCard } from '../components/ui/ChartCard';
import { LoadingState } from '../components/ui/LoadingState';

interface DataExplorerPageProps {
  filters: ActiveFilters;
}

export const DataExplorerPage: React.FC<DataExplorerPageProps> = ({ filters }) => {
  const [view, setView] = useState<'sales' | 'inventory'>('sales');

  // Sales state
  const [salesData, setSalesData] = useState<PaginatedResponse<SalesRecord> | null>(null);
  const [salesPage, setSalesPage] = useState(1);
  const salesPageSize = 50;
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Inventory state
  const [invData, setInvData] = useState<PaginatedResponse<InventoryRecord> | null>(null);
  const [invPage, setInvPage] = useState(1);
  const invPageSize = 50;
  const [invStatus, setInvStatus] = useState<string>('');

  const [loading, setLoading] = useState(true);

  // Fetch sales
  useEffect(() => {
    if (view !== 'sales') return;
    let isMounted = true;
    api
      .getSalesRecords(salesPage, salesPageSize, sortBy, sortOrder, filters)
      .then((res) => {
        if (isMounted) {
          setSalesData(res);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error('Failed to load sales data', err);
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [view, salesPage, salesPageSize, sortBy, sortOrder, filters]);

  // Fetch inventory
  useEffect(() => {
    if (view !== 'inventory') return;
    let isMounted = true;
    api
      .getInventoryRecords(
        invPage,
        invPageSize,
        filters.store_id,
        filters.category,
        invStatus || undefined
      )
      .then((res) => {
        if (isMounted) {
          setInvData(res);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error('Failed to load inventory data', err);
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [view, invPage, invPageSize, invStatus, filters]);

  const handleSort = (col: string) => {
    if (sortBy === col) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(col);
      setSortOrder('desc');
    }
    setSalesPage(1);
  };

  const exportCurrentTable = () => {
    if (view === 'sales' && salesData) {
      const headers = ['ID,Date,Store,SKU,Category,Quantity,Unit Price,Total Revenue,Profit,Channel,Discount %'];
      const rows = salesData.items.map(
        (s) =>
          `${s.id},${s.date},"${s.store_name}","${s.sku_name}","${s.category}",${s.quantity},${s.unit_price},${s.total_value},${s.profit},${s.channel},${s.discount_pct ?? ''}`
      );
      const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `bluemart_sales_page_${salesPage}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (view === 'inventory' && invData) {
      const headers = ['Store,City,SKU,Category,Stock On Hand,Reorder Point,Safety Stock,Status'];
      const rows = invData.items.map(
        (i) =>
          `"${i.store_name}","${i.city}","${i.sku_name}","${i.category}",${i.stock_on_hand},${i.reorder_point},${i.safety_stock},${i.status}`
      );
      const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `bluemart_inventory_page_${invPage}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* View Switcher & Action Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-[#DCE5EF] dark:border-[#222634] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 bg-[#E2ECF5] dark:bg-[#090A0F] p-1 rounded-xl border border-[#CBDCEB] dark:border-[#222634]">
          <button
            onClick={() => setView('sales')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              view === 'sales'
                ? 'bg-blue-600 dark:bg-[#4F46E5] text-white shadow-sm'
                : 'text-slate-700 hover:text-slate-950 dark:text-[#6C7693] dark:hover:text-[#F1F3F7]'
            }`}
          >
            Sales Transactions (641K)
          </button>
          <button
            onClick={() => setView('inventory')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              view === 'inventory'
                ? 'bg-blue-600 dark:bg-[#4F46E5] text-white shadow-sm'
                : 'text-slate-700 hover:text-slate-950 dark:text-[#6C7693] dark:hover:text-[#F1F3F7]'
            }`}
          >
            Inventory Snapshots (8.7K)
          </button>
        </div>

        <div className="flex items-center gap-3">
          {view === 'inventory' && (
            <div className="relative inline-flex items-center">
              <select
                value={invStatus}
                onChange={(e) => {
                  setInvStatus(e.target.value);
                  setInvPage(1);
                }}
                className="appearance-none bg-white dark:bg-[#090A0F] border border-[#CBDCEB] dark:border-[#222634] rounded-lg pl-3 pr-8 py-1.5 text-xs text-slate-800 dark:text-[#F1F3F7] focus:outline-none focus:border-indigo-500 dark:focus:border-[#4F46E5] font-medium cursor-pointer"
              >
                <option value="">All Health Statuses</option>
                <option value="Critical">Critical (≤ Safety)</option>
                <option value="Warning">Warning (&lt; Reorder)</option>
                <option value="Normal">Normal</option>
                <option value="Overstocked">Overstocked (&gt; 3x Reorder)</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500 dark:text-[#6C7693] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          )}

          <button
            onClick={exportCurrentTable}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-[#E2ECF5] text-slate-700 hover:text-slate-950 hover:bg-[#D4E3F0] transition-colors border border-[#CBDCEB] dark:bg-[#14161F] dark:text-[#F1F3F7] dark:hover:bg-[#181B26] dark:border-[#222634] cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Main Table Content */}
      {loading ? (
        <LoadingState message={`Fetching ${view} records from Neon database...`} />
      ) : view === 'sales' && salesData ? (
        <ChartCard
          title={`Sales Transaction Ledger (${salesData.total.toLocaleString()} total entries)`}
          subtitle={`Showing page ${salesData.page} of ${salesData.total_pages}`}
        >
          <div className="overflow-x-auto min-h-[460px]">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F0F4F8] dark:bg-[#090A0F] border-b border-[#D9E3EE] dark:border-[#222634] text-slate-700 dark:text-[#6C7693] uppercase tracking-wider font-bold">
                <tr>
                  <th className="py-3 px-2 cursor-pointer hover:text-slate-950 dark:hover:text-[#F1F3F7]" onClick={() => handleSort('id')}>
                    <span className="flex items-center gap-1">ID <ArrowUpDown className="w-3 h-3" /></span>
                  </th>
                  <th className="py-3 cursor-pointer hover:text-slate-950 dark:hover:text-[#F1F3F7]" onClick={() => handleSort('date')}>
                    <span className="flex items-center gap-1">Date <ArrowUpDown className="w-3 h-3" /></span>
                  </th>
                  <th className="py-3">Store</th>
                  <th className="py-3">Product SKU</th>
                  <th className="py-3">Category</th>
                  <th className="py-3 text-right cursor-pointer hover:text-slate-950 dark:hover:text-[#F1F3F7]" onClick={() => handleSort('quantity')}>
                    <span className="flex items-center justify-end gap-1">Qty <ArrowUpDown className="w-3 h-3" /></span>
                  </th>
                  <th className="py-3 text-right">Unit Price</th>
                  <th className="py-3 text-right cursor-pointer hover:text-slate-950 dark:hover:text-[#F1F3F7]" onClick={() => handleSort('total_value')}>
                    <span className="flex items-center justify-end gap-1">Total Rev <ArrowUpDown className="w-3 h-3" /></span>
                  </th>
                  <th className="py-3 text-right cursor-pointer hover:text-slate-950 dark:hover:text-[#F1F3F7]" onClick={() => handleSort('profit')}>
                    <span className="flex items-center justify-end gap-1">Profit <ArrowUpDown className="w-3 h-3" /></span>
                  </th>
                  <th className="py-3">Channel</th>
                  <th className="py-3 text-right px-2">Disc %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0] dark:divide-[#222634]">
                {salesData.items.map((row) => (
                  <tr key={row.id} className="hover:bg-[#EBF2F7] dark:hover:bg-[#181B26] transition-colors">
                    <td className="py-2.5 px-2 font-mono text-slate-600 dark:text-[#6C7693]">#{row.id}</td>
                    <td className="py-2.5 font-mono text-slate-700 dark:text-[#6C7693]">{row.date}</td>
                    <td className="py-2.5 font-semibold text-slate-900 dark:text-[#F1F3F7]">{row.store_name}</td>
                    <td className="py-2.5 font-semibold text-slate-900 dark:text-[#F1F3F7]">{row.sku_name}</td>
                    <td className="py-2.5 text-slate-700 dark:text-[#6C7693] whitespace-nowrap">
                      <span className="inline-block whitespace-nowrap px-2.5 py-0.5 rounded-full bg-[#E2ECF5] border border-[#CBDCEB] dark:bg-[#090A0F] dark:border-[#222634] dark:text-[#6C7693] text-[10px] font-medium">
                        {row.category}
                      </span>
                    </td>
                    <td className="py-2.5 text-right font-mono text-slate-700 dark:text-[#F1F3F7]">{row.quantity}</td>
                    <td className="py-2.5 text-right font-mono text-slate-600 dark:text-[#6C7693]">{row.unit_price}</td>
                    <td className="py-2.5 text-right font-mono font-bold text-slate-900 dark:text-[#F1F3F7]">{row.total_value}</td>
                    <td className="py-2.5 text-right font-mono text-emerald-600 dark:text-emerald-400 font-bold">{row.profit}</td>
                    <td className="py-2.5 text-slate-700 dark:text-[#6C7693]">{row.channel}</td>
                    <td className="py-2.5 text-right px-2 font-mono text-slate-600 dark:text-[#6C7693]">
                      {row.discount_pct !== null ? `${row.discount_pct}%` : '0%'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination bar */}
          <div className="flex items-center justify-between pt-4 mt-4 border-t border-[#D9E3EE] dark:border-[#222634] text-xs text-slate-600 dark:text-[#6C7693] font-medium">
            <div>
              Page <span className="font-bold text-slate-900 dark:text-[#F1F3F7]">{salesData.page}</span> of{' '}
              <span className="font-bold text-slate-900 dark:text-[#F1F3F7]">{salesData.total_pages}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                disabled={salesData.page <= 1}
                onClick={() => setSalesPage(salesData.page - 1)}
                className="p-1.5 rounded-lg bg-[#E2ECF5] hover:bg-[#D4E3F0] text-slate-700 dark:bg-[#090A0F] dark:hover:bg-[#181B26] dark:border dark:border-[#222634] dark:text-[#F1F3F7] disabled:opacity-40 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={salesData.page >= salesData.total_pages}
                onClick={() => setSalesPage(salesData.page + 1)}
                className="p-1.5 rounded-lg bg-[#E2ECF5] hover:bg-[#D4E3F0] text-slate-700 dark:bg-[#090A0F] dark:hover:bg-[#181B26] dark:border dark:border-[#222634] dark:text-[#F1F3F7] disabled:opacity-40 transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </ChartCard>
      ) : invData ? (
        <ChartCard
          title={`Store Inventory Snapshots (${invData.total.toLocaleString()} records)`}
          subtitle={`Showing page ${invData.page} of ${invData.total_pages}`}
        >
          <div className="overflow-x-auto min-h-[460px]">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F0F4F8] dark:bg-[#090A0F] border-b border-[#D9E3EE] dark:border-[#222634] text-slate-700 dark:text-[#6C7693] uppercase tracking-wider font-bold">
                <tr>
                  <th className="py-3 px-2">Store</th>
                  <th className="py-3">City</th>
                  <th className="py-3">SKU</th>
                  <th className="py-3">Category</th>
                  <th className="py-3 text-right">Stock On Hand</th>
                  <th className="py-3 text-right">Reorder Point</th>
                  <th className="py-3 text-right">Safety Stock</th>
                  <th className="py-3 text-center px-2">Stock Health</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0] dark:divide-[#222634]">
                {invData.items.map((row, idx) => (
                  <tr key={`${row.store_id}-${row.sku_id}-${idx}`} className="hover:bg-[#EBF2F7] dark:hover:bg-[#181B26] transition-colors">
                    <td className="py-2.5 px-2 font-semibold text-slate-900 dark:text-[#F1F3F7]">{row.store_name}</td>
                    <td className="py-2.5 text-slate-600 dark:text-[#6C7693] font-medium">{row.city}</td>
                    <td className="py-2.5 font-semibold text-slate-900 dark:text-[#F1F3F7]">{row.sku_name}</td>
                    <td className="py-2.5 text-slate-700 dark:text-[#6C7693] whitespace-nowrap">
                      <span className="inline-block whitespace-nowrap px-2.5 py-0.5 rounded-full bg-[#E2ECF5] border border-[#CBDCEB] dark:bg-[#090A0F] dark:border-[#222634] dark:text-[#6C7693] text-[10px] font-medium">
                        {row.category}
                      </span>
                    </td>
                    <td className="py-2.5 text-right font-mono font-bold text-slate-900 dark:text-[#F1F3F7] whitespace-nowrap">{row.stock_on_hand}</td>
                    <td className="py-2.5 text-right font-mono text-slate-600 dark:text-[#6C7693] whitespace-nowrap">{row.reorder_point}</td>
                    <td className="py-2.5 text-right font-mono text-slate-600 dark:text-[#6C7693] whitespace-nowrap">{row.safety_stock}</td>
                    <td className="py-2.5 text-center px-2 whitespace-nowrap">
                      <span
                        className={`inline-block whitespace-nowrap px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                          row.status === 'Critical'
                            ? 'bg-rose-500/10 text-rose-700 border-rose-500/20 dark:bg-[#F43F5E]/10 dark:text-[#F43F5E] dark:border-[#F43F5E]/30'
                            : row.status === 'Warning'
                            ? 'bg-amber-500/10 text-amber-700 border-amber-500/20 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/30'
                            : row.status === 'Overstocked'
                            ? 'bg-purple-500/10 text-purple-700 border-purple-500/20 dark:bg-purple-500/20 dark:text-purple-300 dark:border-purple-500/30'
                            : 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-500/30'
                        }`}
                      >
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination bar */}
          <div className="flex items-center justify-between pt-4 mt-4 border-t border-[#D9E3EE] dark:border-[#222634] text-xs text-slate-600 dark:text-[#6C7693] font-medium">
            <div>
              Page <span className="font-bold text-slate-900 dark:text-[#F1F3F7]">{invData.page}</span> of{' '}
              <span className="font-bold text-slate-900 dark:text-[#F1F3F7]">{invData.total_pages}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                disabled={invData.page <= 1}
                onClick={() => setInvPage(invData.page - 1)}
                className="p-1.5 rounded-lg bg-[#E2ECF5] hover:bg-[#D4E3F0] text-slate-700 dark:bg-[#090A0F] dark:hover:bg-[#181B26] dark:border dark:border-[#222634] dark:text-[#F1F3F7] disabled:opacity-40 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={invData.page >= invData.total_pages}
                onClick={() => setInvPage(invData.page + 1)}
                className="p-1.5 rounded-lg bg-[#E2ECF5] hover:bg-[#D4E3F0] text-slate-700 dark:bg-[#090A0F] dark:hover:bg-[#181B26] dark:border dark:border-[#222634] dark:text-[#F1F3F7] disabled:opacity-40 transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </ChartCard>
      ) : null}
    </div>
  );
};
