import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../../services/api';
import { BarChart3, Package, ShoppingCart, Store, Users, BellRing, SlidersHorizontal } from 'lucide-react';

const cards = [
  { key: 'totalAdmins', label: 'Admins', icon: SlidersHorizontal, accent: 'from-emerald-500 to-teal-500' },
  { key: 'totalVendors', label: 'Vendors', icon: Store, accent: 'from-sky-500 to-cyan-500' },
  { key: 'totalCustomers', label: 'Customers', icon: Users, accent: 'from-fuchsia-500 to-pink-500' },
  { key: 'totalProducts', label: 'Products', icon: Package, accent: 'from-amber-500 to-orange-500' },
  { key: 'totalOrders', label: 'Orders', icon: ShoppingCart, accent: 'from-violet-500 to-indigo-500' },
  { key: 'totalNotifications', label: 'Notifications', icon: BellRing, accent: 'from-rose-500 to-red-500' },
];

const quickLinks = [
  { to: '/admin/vendors', label: 'Manage vendors' },
  { to: '/admin/customers', label: 'Manage customers' },
  { to: '/admin/products', label: 'Manage products' },
  { to: '/admin/orders', label: 'Manage orders' },
  { to: '/admin/configuration', label: 'Edit configuration' },
];

const AdminDashboardPage = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    const loadSummary = async () => {
      try {
        const response = await adminAPI.getSummary();
        if (active) setSummary(response.summary);
      } catch (err) {
        if (active) setError(err.message || 'Unable to load summary.');
      } finally {
        if (active) setLoading(false);
      }
    };

    loadSummary();
    return () => {
      active = false;
    };
  }, []);

  const maintenanceMode = summary?.settings?.maintenance_mode?.value === 'true';
  const commissionRate = summary?.settings?.default_commission_rate?.value || '0';
  const appName = summary?.settings?.app_name?.value || 'NearBuy';

  return (
    <div className="space-y-8 text-white">
      <section className=" rounded-4xl border border-white/10 bg-linear-to-br from-slate-900 via-slate-900 to-emerald-950 p-6 shadow-2xl shadow-black/20 lg:p-8">
        <div className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr] lg:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300">
              <BarChart3 className="h-4 w-4" />
              Operational overview
            </div>
            <h1 className="mt-4 text-3xl font-bold lg:text-4xl">{appName} admin dashboard</h1>
            <p className="mt-3 max-w-2xl text-slate-300">
              Monitor the marketplace and manage the core business settings from one dedicated panel.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <p className="text-sm text-slate-400">Platform mode</p>
            <p className={`mt-2 text-2xl font-bold ${maintenanceMode ? 'text-amber-300' : 'text-emerald-300'}`}>
              {maintenanceMode ? 'Maintenance enabled' : 'Live mode'}
            </p>
            <p className="mt-2 text-sm text-slate-300">Default commission: {commissionRate}%</p>
          </div>
        </div>
      </section>

      {error && (
        <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{error}</div>
      )}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => (
          <div key={card.key} className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-lg shadow-black/10">
            <div className={`inline-flex rounded-2xl bg-linear-to-r ${card.accent} p-3 text-white`}>
              <card.icon className="h-5 w-5" />
            </div>
            <p className="mt-4 text-sm text-slate-400">{card.label}</p>
            <p className="mt-2 text-3xl font-bold text-white">{loading ? '...' : Number(summary?.[card.key] || 0).toLocaleString()}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-xl font-semibold text-white">Key controls</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {quickLinks.map((link) => (
              <Link key={link.to} to={link.to} className="rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3 text-sm text-slate-200 transition hover:border-emerald-400/40 hover:bg-emerald-500/10 hover:text-white">
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-xl font-semibold text-white">Latest configuration</h2>
          <div className="mt-4 space-y-3 text-sm text-slate-300">
            <div className="rounded-2xl bg-slate-950/40 px-4 py-3">App name: {summary?.settings?.app_name?.value || 'NearBuy'}</div>
            <div className="rounded-2xl bg-slate-950/40 px-4 py-3">Support email: {summary?.settings?.support_email?.value || 'support@nearbuy.com'}</div>
            <div className="rounded-2xl bg-slate-950/40 px-4 py-3">Banner: {summary?.settings?.banner_message?.value || 'Welcome to NearBuy'}</div>
            <div className="rounded-2xl bg-slate-950/40 px-4 py-3">Unread notifications: {summary?.unreadNotifications ?? 0}</div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboardPage;