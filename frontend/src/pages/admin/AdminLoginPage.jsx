import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import Button from '../../component/sharingComponents/Button';
import { useAdminAuth } from '../../hooks/useAdminAuth';
import { ROUTES } from '../../lib/ROUTES';

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const { login, loading } = useAdminAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const result = await login(form.email, form.password);

    if (result.success) {
      navigate(ROUTES.ADMIN, { replace: true });
    } else {
      setError(result.error || 'Unable to sign in.');
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-emerald-950 px-4 py-10 text-white">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-6xl items-center">
        <div className="grid w-full gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="flex flex-col justify-center rounded-4xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/20 backdrop-blur-xl lg:p-12">
            <div className="inline-flex w-fit items-center gap-3 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 text-sm text-emerald-200">
              <Shield className="h-4 w-4" />
              Dedicated admin route
            </div>
            <h1 className="mt-6 text-4xl font-bold leading-tight lg:text-5xl">Sign in to the NearBuy admin panel</h1>
            <p className="mt-4 max-w-xl text-base text-slate-300">
              Manage configuration, vendors, customers, products, orders, and notifications from a separate secured area.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {[
                ['Configuration', 'Update store settings and banner content'],
                ['Operations', 'Review and manage merchants and orders'],
                ['Catalog', 'Audit product inventory and content'],
                ['Notifications', 'Monitor customer and vendor activity'],
              ].map(([title, text]) => (
                <div key={title} className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
                  <p className="font-semibold text-white">{title}</p>
                  <p className="mt-1 text-sm text-slate-400">{text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-4xl border border-white/10 bg-white p-8 text-slate-900 shadow-2xl shadow-black/20 lg:p-10">
            <h2 className="text-2xl font-bold text-slate-950">Admin login</h2>
            <p className="mt-2 text-sm text-slate-600">Use the dedicated admin credentials to access the panel.</p>

            {error && (
              <div className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">Email</span>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-slate-900 outline-none transition focus:border-emerald-500 focus:bg-white"
                    placeholder="admin@nearbuy.com"
                    autoComplete="email"
                  />
                </div>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">Password</span>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-12 text-slate-900 outline-none transition focus:border-emerald-500 focus:bg-white"
                    placeholder="Enter your password"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </label>

              <Button
                label="Sign in"
                type="submit"
                loading={loading}
                loadingLabel="Signing in..."
                className="mt-2 bg-linear-to-r from-emerald-500 to-cyan-500 text-white shadow-xl shadow-emerald-500/20"
              />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;