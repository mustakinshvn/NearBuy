import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Store, Package, ClipboardList, BellRing, SlidersHorizontal, LogOut } from 'lucide-react';
import { useAdminAuth } from '../../hooks/useAdminAuth';

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/vendors', label: 'Vendors', icon: Store },
  { to: '/admin/customers', label: 'Customers', icon: Users },
  { to: '/admin/products', label: 'Products', icon: Package },
  { to: '/admin/orders', label: 'Orders', icon: ClipboardList },
  { to: '/admin/notifications', label: 'Notifications', icon: BellRing },
  { to: '/admin/configuration', label: 'Configuration', icon: SlidersHorizontal },
];

const AdminLayout = () => {
  const navigate = useNavigate();
  const { admin, logout } = useAdminAuth();

  const handleLogout = () => {
    logout();
    navigate('/admin/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="grid min-h-screen lg:grid-cols-[280px_1fr]">
        <aside className="border-r border-white/10 bg-slate-900/95 px-5 py-6 backdrop-blur">
          <div className="mb-8 rounded-3xl border border-white/10 bg-linear-to-br from-emerald-500/20 to-cyan-500/10 p-5 shadow-2xl shadow-emerald-500/10">
            <p className="text-xs uppercase tracking-[0.35em] text-emerald-300">NearBuy</p>
            <h1 className="mt-2 text-2xl font-bold text-white">Admin Panel</h1>
            <p className="mt-2 text-sm text-slate-300">Manage configuration, vendors, customers, products, orders, and notifications.</p>
          </div>

          <nav className="space-y-2">
            {navItems.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                      : 'text-slate-300 hover:bg-white/5 hover:text-white'
                  }`
                }
              >
                <Icon className="h-4 w-4" />
                {label}
              </NavLink>
            ))}
          </nav>

          <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Signed in as</p>
            <p className="mt-2 font-semibold text-white">{admin?.name || 'Admin'}</p>
            <p className="text-sm text-slate-400">{admin?.email || 'admin'}</p>
            <button
              type="button"
              onClick={handleLogout}
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/15"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </div>
        </aside>

        <main className="bg-slate-950">
          <div className="border-b border-white/10 bg-slate-950/90 px-6 py-5 backdrop-blur">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-slate-400">Admin workspace</p>
                <h2 className="text-2xl font-semibold text-white">Operational control center</h2>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300">
                {admin?.role || 'superadmin'}
              </div>
            </div>
          </div>

          <div className="p-6 lg:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;