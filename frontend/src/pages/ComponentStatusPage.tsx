import { useState, useMemo } from 'react';
import { useRiskData } from '@/hooks/use-csv-data';
import { Search, ChevronLeft, ChevronRight, ArrowUpDown } from 'lucide-react';

const PAGE_SIZE = 20;

export default function ComponentStatusPage() {
  const { data, isLoading } = useRiskData();
  const [search, setSearch] = useState('');
  const [severityFilter, setSeverityFilter] = useState('');
  const [riskTypeFilter, setRiskTypeFilter] = useState('');
  const [sortKey, setSortKey] = useState<string>('');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(0);

  const filtered = useMemo(() => {
    if (!data) return [];
    let rows = data.filter(r => {
      const q = search.toLowerCase();
      const matchSearch = !q || r['Affected Component ID'].toLowerCase().includes(q) || r['Supplier ID'].toLowerCase().includes(q);
      const matchSev = !severityFilter || r['Severity Level (High/Medium/Low)'] === severityFilter;
      const matchType = !riskTypeFilter || r['Risk Type (Shortage / Delay / Shutdown)'] === riskTypeFilter;
      return matchSearch && matchSev && matchType;
    });

    if (sortKey) {
      rows = [...rows].sort((a, b) => {
        const va = (a as any)[sortKey] || '';
        const vb = (b as any)[sortKey] || '';
        const cmp = va.localeCompare(vb);
        return sortDir === 'asc' ? cmp : -cmp;
      });
    }
    return rows;
  }, [data, search, severityFilter, riskTypeFilter, sortKey, sortDir]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const pageData = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const toggleSort = (key: string) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  };

  const severityBadge = (level: string) => {
    const cls = level === 'High' ? 'risk-high' : level === 'Medium' ? 'risk-medium' : 'risk-low';
    return <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium border ${cls}`}>{level}</span>;
  };

  if (isLoading) return <div className="text-muted-foreground">Loading risk data…</div>;

  return (
    <div className="space-y-4 fade-in">
      <h1 className="text-xl font-bold text-foreground">Component Status</h1>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(0); }}
            placeholder="Search component or supplier…"
            className="w-full pl-9 pr-4 py-2 bg-secondary border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>
        <select
          value={severityFilter}
          onChange={e => { setSeverityFilter(e.target.value); setPage(0); }}
          className="px-3 py-2 bg-secondary border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
        >
          <option value="">All Severity</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
        <select
          value={riskTypeFilter}
          onChange={e => { setRiskTypeFilter(e.target.value); setPage(0); }}
          className="px-3 py-2 bg-secondary border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
        >
          <option value="">All Risk Types</option>
          <option value="Shortage">Shortage</option>
          <option value="Delay">Delay</option>
          <option value="Shutdown">Shutdown</option>
        </select>
      </div>

      <div className="glass-card overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr>
              <th className="cursor-pointer" onClick={() => toggleSort('Affected Component ID')}>
                <span className="flex items-center gap-1">Component <ArrowUpDown className="w-3 h-3" /></span>
              </th>
              <th>Supplier</th>
              <th className="cursor-pointer" onClick={() => toggleSort('Risk Type (Shortage / Delay / Shutdown)')}>
                <span className="flex items-center gap-1">Risk Type <ArrowUpDown className="w-3 h-3" /></span>
              </th>
              <th className="cursor-pointer" onClick={() => toggleSort('Severity Level (High/Medium/Low)')}>
                <span className="flex items-center gap-1">Severity <ArrowUpDown className="w-3 h-3" /></span>
              </th>
              <th>Probability</th>
              <th>Recovery</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {pageData.map((r, i) => {
              const isHigh = r['Severity Level (High/Medium/Low)'] === 'High';
              return (
                <tr key={`${r['Risk ID']}-${i}`} className={isHigh ? 'bg-destructive/5' : ''}>
                  <td className="font-mono text-xs text-primary">{r['Affected Component ID']}</td>
                  <td className="font-mono text-xs">{r['Supplier ID']}</td>
                  <td className="text-xs">{r['Risk Type (Shortage / Delay / Shutdown)']}</td>
                  <td>{severityBadge(r['Severity Level (High/Medium/Low)'])}</td>
                  <td className="tabular-nums">{(parseFloat(r['Probability of Occurrence']) * 100).toFixed(0)}%</td>
                  <td className="text-xs text-muted-foreground">{r['Expected Recovery Time']}</td>
                  <td className="text-xs text-muted-foreground">{r['Date of Risk Event']}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>{filtered.length.toLocaleString()} results</span>
        <div className="flex items-center gap-2">
          <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0} className="p-1.5 rounded-md hover:bg-secondary disabled:opacity-30 transition-colors">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="tabular-nums">{page + 1} / {totalPages}</span>
          <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1} className="p-1.5 rounded-md hover:bg-secondary disabled:opacity-30 transition-colors">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
