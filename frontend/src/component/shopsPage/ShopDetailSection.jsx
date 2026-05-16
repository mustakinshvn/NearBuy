import { useMemo, useState } from 'react';
import {
  BadgeCheck,
  Mail,
  MapPin,
  Phone,
  Search,
  Send,
  Store,
} from 'lucide-react';
import ProductCard from '../ProductCard';
import { useShopDetails } from '../../hooks/useShopDetails';
import { ShowLoading } from '../sharingComponents/ShowLoading';
import { useAuth } from '../../hooks/useAuth';
import { notificationAPI } from '../../services/api';
import { useCart } from '../../hooks/useCart';
import { ConfirmAlert } from '../sharingComponents/ConfirmAlert';

const AskForProductForm = ({ vendor }) => {
  const { user } = useAuth();
  const [productName, setProductName] = useState('');
  const [details, setDetails] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!productName.trim()) {
      setStatus({ type: 'error', text: 'Please enter the product name.' });
      return;
    }

    if (!user) {
      setStatus({ type: 'error', text: 'Please log in to send the request.' });
      return;
    }

    setSubmitting(true);
    setStatus(null);

    try {
      const payload = {
        title: `Product request: ${productName}`,
        message: details || `Customer requested: ${productName}`,
        vendor_id: vendor.vendor_id,
        customer_id: user?.customer_id || user?.id || null,
      };

      await notificationAPI.createNotification(payload);

      setStatus({ type: 'success', text: 'Your request has been sent to the vendor.' });
      setProductName('');
      setDetails('');
    } catch (err) {
      setStatus({ type: 'error', text: err?.message || 'Failed to send request.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {!user && (
        <div className="rounded-md border border-yellow-200 bg-yellow-50 p-3 text-sm text-yellow-800">
          Please log in to send product requests. You can still fill the form, but you'll be prompted to sign in.
        </div>
      )}

      <div>
        <label className="flex items-center justify-between text-sm font-semibold text-slate-700">
          <div className="flex items-center gap-1">
            <span>Product name</span>
            <span className="text-rose-600">*</span>
          </div>
          <span className="text-xs text-slate-400">Required</span>
        </label>
        <input
          type="text"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          placeholder="e.g., Blue denim jacket, size M"
          required
          aria-required="true"
          className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-400"
          disabled={!user || submitting}
        />
        <p className="mt-1 text-xs text-slate-400">Include size, color or any specifics to help the vendor.</p>
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700">Additional details (optional)</label>
        <textarea
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          placeholder="Any preferences, sizes, colors, or extra info"
          rows={3}
          className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-400"
          disabled={!user || submitting}
        />
      </div>

      {status && (
        <div className={`rounded-md p-3 text-sm ${status.type === 'error' ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'}`}>
          <div className="inline-flex items-center gap-2">
            {status.type === 'success' && <BadgeCheck className="h-4 w-4 text-emerald-600" />}
            <span>{status.text}</span>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <button
          type="submit"
          disabled={!user || submitting}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
        >
          <Send className="h-4 w-4 text-white" />
          {submitting ? 'Sending…' : 'Send request'}
        </button>
        <div className="text-xs text-slate-500">We will notify the vendor about your request.</div>
      </div>
    </form>
  );
};

const ShopDetailSection = ({ vendor }) => {
  const { products, loading, error } = useShopDetails(vendor?.vendor_id);
  const [searchQuery, setSearchQuery] = useState('');
  const { cart, addToCart, clearCart } = useCart();
  const [pendingProduct, setPendingProduct] = useState(null);
  const [showVendorConfirm, setShowVendorConfirm] = useState(false);

  const handleAddToCart = (product) => {
    const existingVendorId = cart[0]?.seller_id ?? null;
    const newVendorId = product.seller_id ?? null;

    if (
      !existingVendorId ||
      cart.length === 0 ||
      existingVendorId === newVendorId
    ) {
      addToCart(product, 1);
      return;
    }

    setPendingProduct(product);
    setShowVendorConfirm(true);
  };

  const shopLogo = vendor?.logo || vendor?.image || vendor?.avatar || vendor?.profile_image_url || null;
  const shopInitials = (vendor?.shop_name || vendor?.name || 'Shop')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();

  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return products;

    return products.filter((product) => {
      return (
        product.title?.toLowerCase().includes(query) ||
        product.description?.toLowerCase().includes(query) ||
        product.brand?.toLowerCase().includes(query)
      );
    });
  }, [products, searchQuery]);

  if (!vendor) return null;

  return (
    <section id="shop-details" className="overflow-hidden rounded-4xl bg-white shadow-2xl">
      <div className="bg-linear-to-br from-slate-950 via-slate-900 to-indigo-950 px-6 py-8 text-white md:px-10">
        <div className="flex flex-col gap-6">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-white/80">
            <BadgeCheck className="h-4 w-4 text-cyan-300" />
            Verified shop profile
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/15 bg-white/10 shadow-lg ring-1 ring-white/10">
              {shopLogo ? (
                <img src={shopLogo} alt={vendor.shop_name || vendor.name} className="h-full w-full object-cover" />
              ) : (
                <span className="text-2xl font-bold tracking-wide text-white">{shopInitials}</span>
              )}
            </div>

            <div>
              <h2 className="text-3xl font-bold tracking-tight md:text-5xl">{vendor.shop_name}</h2>
              <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-white/75">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1">
                  <Store className="h-4 w-4 text-cyan-300" />
                  {vendor.name}
                </span>
                {vendor.shop_type && (
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1">
                    <BadgeCheck className="h-4 w-4 text-cyan-300" />
                    {vendor.shop_type}
                  </span>
                )}
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1">
                  <MapPin className="h-4 w-4 text-cyan-300" />
                  {vendor.area}, {vendor.city}
                </span>
              </div>
            </div>
          </div>

          <p className="max-w-3xl text-sm leading-7 text-white/75 md:text-base">
            {vendor.description || 'This shop profile does not have a description yet.'}
          </p>
        </div>
      </div>

      <div className="grid gap-8 p-6 md:p-10">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm ring-1 ring-slate-100">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <h3 className="text-2xl font-bold text-slate-900">Shop information</h3>
                <p className="mt-1 text-sm text-slate-500">Key details about the vendor and shop location.</p>
              </div>
              <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
                Open for orders
              </span>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5 transition-shadow hover:shadow-sm">
                <div className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                  <Store className="h-5 w-5" />
                </div>
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Owner</div>
                <div className="mt-1 text-lg font-semibold text-slate-900">{vendor.name}</div>
              </div>

              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5 transition-shadow hover:shadow-sm">
                <div className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                  <Phone className="h-5 w-5" />
                </div>
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Contact</div>
                <div className="mt-1 text-lg font-semibold text-slate-900">{vendor.phone || 'No phone added'}</div>
              </div>

              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5 md:col-span-2 transition-shadow hover:shadow-sm">
                <div className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-rose-100 text-rose-700">
                  <MapPin className="h-5 w-5" />
                </div>
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Address</div>
                <div className="mt-1 text-base font-semibold text-slate-900">{vendor.street}</div>
                <div className="mt-1 text-sm text-slate-500">
                  {vendor.area}, {vendor.city} · {vendor.postal_code}, {vendor.country}
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-4xl border border-slate-200 bg-linear-to-br from-slate-50 to-white p-6 shadow-sm ring-1 ring-slate-100">
            <div className="mb-5 flex items-center justify-between">
              <span className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Ask for a product</span>
              <BadgeCheck className="h-5 w-5 text-green-600" />
            </div>

            <AskForProductForm vendor={vendor} />
          </div>
        </div>

        <div className="w-full rounded-3xl border border-slate-200 bg-slate-50 p-6 md:p-8">
          <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h3 className="text-2xl font-bold text-slate-800">Products</h3>
              <p className="text-sm text-slate-500">All products currently listed by this vendor.</p>
            </div>
            <span className="w-fit rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm">
              {filteredProducts.length} item{filteredProducts.length === 1 ? '' : 's'}
            </span>
          </div>

          <div className="relative mb-6 max-w-2xl">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products by title, brand, or description..."
              className="w-full rounded-2xl border border-slate-200 bg-white py-4 pl-12 pr-4 text-slate-700 shadow-sm outline-none transition-all focus:border-blue-400 focus:shadow-md"
            />
          </div>

          {loading ? (
            <ShowLoading
              message="Loading shop products..."
              subMessage="Fetching the latest items from this vendor"
            />
          ) : error ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700">{error}</div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.product_id}
                  product={product}
                  mode="featured"
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl bg-white p-8 text-center text-slate-500 shadow-sm">
              {searchQuery
                ? 'No products match your search.'
                : 'No products have been published by this vendor yet.'}
            </div>
          )}
        </div>
      </div>
      <ConfirmAlert
        isOpen={showVendorConfirm}
        onClose={() => {
          setShowVendorConfirm(false);
          setPendingProduct(null);
        }}
        onConfirm={() => {
          if (!pendingProduct) return;
          clearCart();
          addToCart(pendingProduct, 1);
          setPendingProduct(null);
        }}
        title="Start a new cart with this shop?"
        message="Your cart currently contains items from another shop. If you continue, we'll clear your existing cart and add this product from the new vendor."
      />
    </section>
  );
};

export default ShopDetailSection;
