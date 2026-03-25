import { useState, useMemo } from 'react';
import { useComponentData } from '@/hooks/use-csv-data';
import { findSubstitutes, type SubstitutionResult } from '@/lib/substitution-engine';
import { Search, RefreshCw, CheckCircle, XCircle, Download } from 'lucide-react';

export default function SubstitutionPage() {
  const { data: components, isLoading } = useComponentData();
  const [componentId, setComponentId] = useState('');
  const [results, setResults] = useState<SubstitutionResult[] | null>(null);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState('');

  const targetComponent = useMemo(() => {
    if (!components || !results) return null;
    return components.find(c => c['Component ID'] === componentId.toUpperCase());
  }, [components, results, componentId]);

  const handleSearch = () => {
    if (!components || !componentId.trim()) return;
    const id = componentId.trim().toUpperCase();
    const exists = components.find(c => c['Component ID'] === id);
    if (!exists) {
      setError(`Component ${id} not found in dataset`);
      setResults(null);
      return;
    }
    setSearching(true);
    setError('');
    // Simulate brief computation time
    setTimeout(() => {
      const subs = findSubstitutes(id, components, 5);
      setResults(subs);
      setSearching(false);
    }, 400);
  };

  const exportCSV = () => {
    if (!results) return;
    const header = 'Component ID,Name,Match Score (%),Voltage Match,Material Match,Category Match,Explanation\n';
    const rows = results.map(r =>
      `${r.componentId},${r.componentName},${r.matchScore},${r.voltageMatch},${r.materialMatch},${r.categoryMatch},"${r.explanation}"`
    ).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `substitutes_${componentId}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const BoolIcon = ({ val }: { val: boolean }) =>
    val ? <CheckCircle className="w-4 h-4 text-primary" /> : <XCircle className="w-4 h-4 text-destructive/60" />;

  if (isLoading) return <div className="text-muted-foreground">Loading component data…</div>;

  return (
    <div className="max-w-5xl space-y-6 fade-in">
      <div>
        <h1 className="text-xl font-bold text-foreground">Substitution Engine</h1>
        <p className="text-sm text-muted-foreground mt-1">Enter a Component ID to find technically equivalent substitutes using ML-powered cosine similarity.</p>
      </div>

      <div className="glass-card p-6">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              value={componentId}
              onChange={e => { setComponentId(e.target.value); setError(''); }}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              placeholder="e.g. COMP0051"
              className="w-full pl-9 pr-4 py-2.5 bg-secondary border border-border rounded-lg text-sm text-foreground font-mono placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={searching || !componentId.trim()}
            className="px-5 py-2.5 bg-primary text-primary-foreground font-semibold rounded-lg hover:brightness-110 active:scale-[0.97] disabled:opacity-50 transition-all flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${searching ? 'animate-spin' : ''}`} />
            Find Substitutes
          </button>
        </div>
        {error && <p className="text-destructive text-sm mt-3">{error}</p>}
      </div>

      {targetComponent && (
        <div className="glass-card p-5 fade-in-up">
          <h2 className="text-sm font-semibold text-foreground mb-3">Target Component</h2>
          <div className="grid sm:grid-cols-3 lg:grid-cols-5 gap-4 text-sm">
            <div>
              <span className="text-xs text-muted-foreground block">ID</span>
              <span className="font-mono text-primary">{targetComponent['Component ID']}</span>
            </div>
            <div>
              <span className="text-xs text-muted-foreground block">Name</span>
              <span>{targetComponent['Component Name']}</span>
            </div>
            <div>
              <span className="text-xs text-muted-foreground block">Voltage</span>
              <span className="tabular-nums">{targetComponent['Voltage Rating (V)']} V</span>
            </div>
            <div>
              <span className="text-xs text-muted-foreground block">Tolerance</span>
              <span className="tabular-nums">±{targetComponent['Tolerance (%)']}%</span>
            </div>
            <div>
              <span className="text-xs text-muted-foreground block">Material</span>
              <span>{targetComponent['Material Type']}</span>
            </div>
          </div>
        </div>
      )}

      {results && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground">Top {results.length} Substitutes</h2>
            <button onClick={exportCSV} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
              <Download className="w-3.5 h-3.5" /> Export CSV
            </button>
          </div>

          <div className="space-y-3">
            {results.map((r, i) => (
              <div key={r.componentId} className="glass-card p-5 fade-in-up" style={{ animationDelay: `${i * 80}ms` }}>
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-muted-foreground w-6">#{i + 1}</span>
                      <span className="font-mono text-primary text-sm">{r.componentId}</span>
                      <span className="text-sm text-foreground">{r.componentName}</span>
                    </div>
                    <p className="text-xs text-muted-foreground ml-9">{r.explanation}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold tabular-nums text-foreground">{r.matchScore}%</div>
                    <div className="text-xs text-muted-foreground">match</div>
                  </div>
                </div>

                <div className="flex gap-4 mt-3 ml-9 flex-wrap">
                  <div className="flex items-center gap-1.5 text-xs">
                    <BoolIcon val={r.voltageMatch} /> <span className="text-muted-foreground">Voltage</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs">
                    <BoolIcon val={r.toleranceMatch} /> <span className="text-muted-foreground">Tolerance</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs">
                    <BoolIcon val={r.materialMatch} /> <span className="text-muted-foreground">Material</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs">
                    <BoolIcon val={r.categoryMatch} /> <span className="text-muted-foreground">Category</span>
                  </div>
                </div>

                {/* Score bar */}
                <div className="mt-3 ml-9 h-1.5 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-700"
                    style={{ width: `${r.matchScore}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
