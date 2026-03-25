import { Shield, Zap, Brain, AlertTriangle, RefreshCw, BarChart3 } from 'lucide-react';

const features = [
  {
    icon: AlertTriangle,
    title: 'Risk Prediction',
    desc: 'Analyze supplier reliability, historical disruptions, and severity levels to predict component supply risks before they impact production.',
  },
  {
    icon: Brain,
    title: 'ML-Powered Substitution',
    desc: 'Cosine similarity engine compares voltage, tolerance, material, and function type to find technically equivalent replacement components.',
  },
  {
    icon: RefreshCw,
    title: 'Self-Healing BOM',
    desc: 'Automatically recommend substitutes when a component faces supply disruption, keeping your bill of materials resilient.',
  },
  {
    icon: BarChart3,
    title: 'Supply Chain Analytics',
    desc: 'Visualize risk distributions, component usage frequency, and supplier performance across your entire component ecosystem.',
  },
];

export default function AboutPage() {
  return (
    <div className="max-w-4xl space-y-8">
      <div className="fade-in-up">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center">
            <Shield className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Self-Healing Supply Chain</h1>
            <p className="text-primary text-sm font-medium">Intelligent BOM Shock Predictor</p>
          </div>
        </div>
      </div>

      <div className="glass-card p-6 fade-in-up" style={{ animationDelay: '100ms' }}>
        <h2 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
          <Zap className="w-4 h-4 text-primary" /> The Problem
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          Modern electronics manufacturing depends on complex, multi-tiered bills of materials with hundreds of components sourced from global suppliers. A single disruption — a factory shutdown, shortage, or logistics delay — can cascade through the BOM hierarchy, halting entire production lines. Traditional approaches react after disruption occurs, costing time and revenue.
        </p>
      </div>

      <div className="glass-card p-6 fade-in-up" style={{ animationDelay: '200ms' }}>
        <h2 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
          <Brain className="w-4 h-4 text-accent" /> The Solution
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          This system uses machine learning to <strong className="text-foreground">predict supply risks</strong> and <strong className="text-foreground">recommend substitute components</strong> using technical equivalency scoring. By analyzing voltage ratings, tolerances, materials, and function types, the cosine similarity engine identifies drop-in replacements — enabling a self-healing supply chain that adapts before disruptions impact production.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {features.map((f, i) => (
          <div key={f.title} className="stat-card fade-in-up" style={{ animationDelay: `${300 + i * 80}ms` }}>
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
              <f.icon className="w-4.5 h-4.5 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground mb-1.5">{f.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
