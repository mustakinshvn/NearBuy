import { useEffect, useState } from 'react';
import Button from '../../component/sharingComponents/Button';
import { adminAPI } from '../../services/api';

const defaultFields = {
  app_name: 'NearBuy',
  support_email: 'support@nearbuy.com',
  currency: 'BDT',
  maintenance_mode: 'false',
  banner_message: 'Welcome to the NearBuy admin panel',
  default_commission_rate: '0',
  products_page_size: '12',
};

const AdminConfigurationPage = () => {
  const [form, setForm] = useState(defaultFields);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    const loadConfiguration = async () => {
      try {
        const response = await adminAPI.getConfiguration();
        const settings = response.settings || {};

        if (active) {
          setForm((prev) => ({
            ...prev,
            ...Object.fromEntries(
              Object.entries(defaultFields).map(([key, fallback]) => [key, settings[key]?.value ?? fallback]),
            ),
          }));
        }
      } catch (err) {
        if (active) setError(err.message || 'Unable to load configuration.');
      } finally {
        if (active) setLoading(false);
      }
    };

    loadConfiguration();
    return () => {
      active = false;
    };
  }, []);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? String(checked) : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setSaving(true);
      setMessage('');
      setError('');
      await adminAPI.updateConfiguration(form);
      setMessage('Configuration updated successfully.');
    } catch (err) {
      setError(err.message || 'Unable to save configuration.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-5 text-slate-300">Loading configuration...</div>;
  }

  return (
    <div className="space-y-6 text-white">
      <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <h1 className="text-3xl font-bold">Configuration</h1>
        <p className="mt-2 max-w-3xl text-sm text-slate-300">
          Update global platform values without touching the codebase.
        </p>
      </section>

      {message && <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">{message}</div>}
      {error && <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{error}</div>}

      <form onSubmit={handleSubmit} className="grid gap-4 rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-2xl shadow-black/10 lg:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-sm text-slate-300">App name</span>
          <input name="app_name" value={form.app_name} onChange={handleChange} className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-emerald-400" />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm text-slate-300">Support email</span>
          <input name="support_email" value={form.support_email} onChange={handleChange} className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-emerald-400" />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm text-slate-300">Currency</span>
          <input name="currency" value={form.currency} onChange={handleChange} className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-emerald-400" />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm text-slate-300">Default commission rate</span>
          <input name="default_commission_rate" value={form.default_commission_rate} onChange={handleChange} className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-emerald-400" />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm text-slate-300">Products per page</span>
          <input name="products_page_size" type="number" min="1" value={form.products_page_size} onChange={handleChange} className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-emerald-400" />
        </label>

        <label className="block lg:col-span-2">
          <span className="mb-2 block text-sm text-slate-300">Banner message</span>
          <textarea name="banner_message" rows="4" value={form.banner_message} onChange={handleChange} className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-emerald-400" />
        </label>

        <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 lg:col-span-2">
          <input name="maintenance_mode" type="checkbox" checked={form.maintenance_mode === 'true'} onChange={handleChange} className="h-4 w-4 rounded border-white/20 bg-slate-900 text-emerald-500" />
          <span className="text-sm text-slate-300">Enable maintenance mode</span>
        </label>

        <div className="lg:col-span-2">
          <Button
            label="Save configuration"
            type="submit"
            loading={saving}
            loadingLabel="Saving..."
            className="bg-linear-to-r from-emerald-500 to-cyan-500 text-white shadow-xl shadow-emerald-500/20"
          />
        </div>
      </form>
    </div>
  );
};

export default AdminConfigurationPage;