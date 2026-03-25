import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Shield, Zap, AlertTriangle } from 'lucide-react';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(username, password)) {
      navigate('/dashboard');
    } else {
      setError('Please enter valid credentials');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />

      <div className="glass-card p-8 w-full max-w-md fade-in-up relative z-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-primary/15 flex items-center justify-center">
            <Shield className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground leading-tight">Supply Chain</h1>
            <p className="text-xs text-primary font-medium tracking-wide uppercase">BOM Shock Predictor</p>
          </div>
        </div>

        <p className="text-muted-foreground text-sm mt-4 mb-6">
          Sign in to access the intelligent supply chain risk dashboard.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">Username</label>
            <input
              type="text"
              value={username}
              onChange={e => { setUsername(e.target.value); setError(''); }}
              className="w-full px-4 py-2.5 bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-shadow"
              placeholder="Enter username"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => { setPassword(e.target.value); setError(''); }}
              className="w-full px-4 py-2.5 bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-shadow"
              placeholder="Enter password"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 text-destructive text-sm">
              <AlertTriangle className="w-4 h-4" />
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full py-2.5 bg-primary text-primary-foreground font-semibold rounded-lg hover:brightness-110 active:scale-[0.98] transition-all"
          >
            Sign In
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-border flex items-center gap-2 text-xs text-muted-foreground">
          <Zap className="w-3 h-3 text-primary" />
          <span>ML-powered risk prediction & component substitution</span>
        </div>
      </div>
    </div>
  );
}
