import { useMemo } from 'react';
import { useBOMData, useRiskData } from '@/hooks/use-csv-data';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const PIE_COLORS = ['hsl(0,72%,55%)', 'hsl(38,92%,50%)', 'hsl(142,60%,45%)'];

export default function StatsPage() {
  const { data: bomData, isLoading: bomLoading } = useBOMData();
  const { data: riskData, isLoading: riskLoading } = useRiskData();

  const usageData = useMemo(() => {
    if (!bomData) return [];
    const counts: Record<string, number> = {};
    bomData.forEach(b => {
      const id = b['Component ID'];
      counts[id] = (counts[id] || 0) + parseInt(b.Quantity || '1');
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 15)
      .map(([id, count]) => ({ id, count }));
  }, [bomData]);

  const riskDistribution = useMemo(() => {
    if (!riskData) return [];
    const counts = { High: 0, Medium: 0, Low: 0 };
    riskData.forEach(r => {
      const level = r['Severity Level (High/Medium/Low)'] as keyof typeof counts;
      if (counts[level] !== undefined) counts[level]++;
    });
    return [
      { name: 'High', value: counts.High },
      { name: 'Medium', value: counts.Medium },
      { name: 'Low', value: counts.Low },
    ];
  }, [riskData]);

  const riskTypeData = useMemo(() => {
    if (!riskData) return [];
    const counts: Record<string, number> = {};
    riskData.forEach(r => {
      const t = r['Risk Type (Shortage / Delay / Shutdown)'];
      counts[t] = (counts[t] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [riskData]);

  if (bomLoading || riskLoading) return <div className="text-muted-foreground">Loading stats…</div>;

  return (
    <div className="space-y-6 fade-in">
      <h1 className="text-xl font-bold text-foreground">Supply Chain Statistics</h1>

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="stat-card">
          <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Total BOM Entries</div>
          <div className="text-2xl font-bold text-foreground tabular-nums">{bomData?.length.toLocaleString()}</div>
        </div>
        <div className="stat-card">
          <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Risk Events</div>
          <div className="text-2xl font-bold text-foreground tabular-nums">{riskData?.length.toLocaleString()}</div>
        </div>
        <div className="stat-card">
          <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">High Risk</div>
          <div className="text-2xl font-bold text-destructive tabular-nums">
            {riskDistribution.find(r => r.name === 'High')?.value.toLocaleString()}
          </div>
        </div>
      </div>

      <div className="glass-card p-6 fade-in-up" style={{ animationDelay: '150ms' }}>
        <h2 className="text-sm font-semibold text-foreground mb-4">Top 15 Components by Usage (BOM Quantity)</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={usageData} margin={{ left: 10, right: 10, bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(222,20%,18%)" />
              <XAxis dataKey="id" tick={{ fill: 'hsl(215,16%,52%)', fontSize: 10 }} angle={-45} textAnchor="end" />
              <YAxis tick={{ fill: 'hsl(215,16%,52%)', fontSize: 11 }} />
              <Tooltip contentStyle={{ backgroundColor: 'hsl(222,44%,9%)', border: '1px solid hsl(222,20%,18%)', borderRadius: 8, color: 'hsl(210,40%,93%)' }} />
              <Bar dataKey="count" fill="hsl(142,60%,45%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="glass-card p-6 fade-in-up" style={{ animationDelay: '250ms' }}>
          <h2 className="text-sm font-semibold text-foreground mb-4">Risk Severity Distribution</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={riskDistribution} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {riskDistribution.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: 'hsl(222,44%,9%)', border: '1px solid hsl(222,20%,18%)', borderRadius: 8, color: 'hsl(210,40%,93%)' }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card p-6 fade-in-up" style={{ animationDelay: '350ms' }}>
          <h2 className="text-sm font-semibold text-foreground mb-4">Risk Type Breakdown</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={riskTypeData} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  <Cell fill="hsl(200,80%,50%)" />
                  <Cell fill="hsl(38,92%,50%)" />
                  <Cell fill="hsl(0,72%,55%)" />
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: 'hsl(222,44%,9%)', border: '1px solid hsl(222,20%,18%)', borderRadius: 8, color: 'hsl(210,40%,93%)' }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
