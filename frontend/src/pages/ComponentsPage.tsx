import { useState, useMemo } from 'react';
import { useComponentData } from '@/hooks/use-csv-data';
import { Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react';

const PAGE_SIZE = 20;

export default function ComponentsPage() {
  const { data, isLoading } = useComponentData();
  const [search, setSearch] = useState('');
  const [materialFilter, setMaterialFilter] = useState('');
  const [functionFilter, setFunctionFilter] = useState('');
  const [page, setPage] = useState(0);

  const materials = useMemo(() => {
    if (!data) return [];
    return [...new Set(data.map(c => c['Material Type']).filter(Boolean))].sort();
  }, [data]);

  const functions = useMemo(() => {
    if (!data) return [];
    return [...new Set(data.map(c => c['Function Type']).filter(Boolean))].sort();
  }, [data]);

  const filtered = useMemo(() => {
    if (!data) return [];
    return data.filter(c => {
      const q = search.toLowerCase();
      const matchSearch = !q || c['Component ID'].toLowerCase().includes(q) || c['Component Name'].toLowerCase().includes(q);
      const matchMat = !materialFilter || c['Material Type'] === materialFilter;
      const matchFunc = !functionFilter || c['Function Type'] === functionFilter;
      return matchSearch && matchMat && matchFunc;
    });
  }, [data, search, materialFilter, functionFilter]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const pageData = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  if (isLoading) return <div className="text-muted-foreground">Loading components…</div>;

  return (
    <div className="space-y-4 fade-in">
      <h1 className="text-xl font-bold text-foreground">Components</h1>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(0); }}
            placeholder="Search ID or name…"
            className="w-full pl-9 pr-4 py-2 bg-secondary border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>
        <select
          value={materialFilter}
          onChange={e => { setMaterialFilter(e.target.value); setPage(0); }}
          className="px-3 py-2 bg-secondary border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
        >
          <option value="">All Materials</option>
          {materials.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
        <select
          value={functionFilter}
          onChange={e => { setFunctionFilter(e.target.value); setPage(0); }}
          className="px-3 py-2 bg-secondary border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
        >
          <option value="">All Functions</option>
          {functions.map(f => <option key={f} value={f}>{f}</option>)}
        </select>
      </div>

      <div className="glass-card overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr>
              <th>Component ID</th>
              <th>Name</th>
              <th>Function</th>
              <th>Voltage (V)</th>
              <th>Tolerance (%)</th>
              <th>Material</th>
              <th>Package</th>
            </tr>
          </thead>
          <tbody>
            {pageData.map((c, i) => (
              <tr key={`${c['Component ID']}-${i}`}>
                <td className="font-mono text-primary text-xs">{c['Component ID']}</td>
                <td>{c['Component Name']}</td>
                <td className="text-xs text-muted-foreground">{c['Function Type']}</td>
                <td className="tabular-nums">{c['Voltage Rating (V)']}</td>
                <td className="tabular-nums">{c['Tolerance (%)']}</td>
                <td className="text-xs">{c['Material Type']}</td>
                <td className="text-xs text-muted-foreground">{c['Package Type']}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>{filtered.length.toLocaleString()} results</span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage(p => Math.max(0, p - 1))}
            disabled={page === 0}
            className="p-1.5 rounded-md hover:bg-secondary disabled:opacity-30 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="tabular-nums">{page + 1} / {totalPages}</span>
          <button
            onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
            className="p-1.5 rounded-md hover:bg-secondary disabled:opacity-30 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
