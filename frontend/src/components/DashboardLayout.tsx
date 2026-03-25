import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  Info,
  Cpu,
  AlertTriangle,
  BarChart3,
  RefreshCw,
  LogOut,
  Shield,
  Menu,
  X,
} from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { label: 'About', path: '/dashboard', icon: Info, end: true },
  { label: 'Components', path: '/dashboard/components', icon: Cpu },
  { label: 'Component Status', path: '/dashboard/status', icon: AlertTriangle },
  { label: 'Stats', path: '/dashboard/stats', icon: BarChart3 },
  { label: 'Substitution Engine', path: '/dashboard/substitution', icon: RefreshCw },
];

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const sidebarContent = (
    <>
      <div className="p-5 border-b border-sidebar-border">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center">
            <Shield className="w-4 h-4 text-primary" />
          </div>
          <div className="leading-tight">
            <div className="text-sm font-bold text-sidebar-accent-foreground">Supply Chain</div>
            <div className="text-[10px] text-primary font-medium tracking-wider uppercase">BOM Predictor</div>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {navItems.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.end}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                isActive
                  ? 'bg-primary/15 text-primary font-medium'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
              }`
            }
          >
            <item.icon className="w-4 h-4" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-3 border-t border-sidebar-border">
        <div className="flex items-center justify-between px-3 py-2">
          <span className="text-xs text-muted-foreground truncate">{user}</span>
          <button onClick={handleLogout} className="text-muted-foreground hover:text-destructive transition-colors">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </>
  );

  return (
    <div className="min-h-screen flex bg-background">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-60 border-r border-sidebar-border bg-sidebar shrink-0">
        {sidebarContent}
      </aside>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-60 bg-sidebar flex flex-col slide-in-left">
            <button onClick={() => setMobileOpen(false)} className="absolute top-4 right-4 text-muted-foreground">
              <X className="w-5 h-5" />
            </button>
            {sidebarContent}
          </aside>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 min-w-0 flex flex-col">
        <header className="h-14 border-b border-border flex items-center px-4 lg:px-6 shrink-0">
          <button onClick={() => setMobileOpen(true)} className="lg:hidden mr-3 text-muted-foreground">
            <Menu className="w-5 h-5" />
          </button>
          <div className="text-sm text-muted-foreground">Self-Healing Supply Chain Dashboard</div>
        </header>
        <div className="flex-1 overflow-auto p-4 lg:p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
