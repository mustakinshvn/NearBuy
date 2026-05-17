import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  PlusCircle,
  Search,
  Package,
  PencilLine,
  Boxes,
  BadgeCheck,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";
import { useVendorAuthContext } from "../hooks/useVendorAuthContext";
import { productAPI } from "../services/api";
import { ShowLoading } from "../component/sharingComponents/ShowLoading";
import { ShowError } from "../component/sharingComponents/ShowError";
import { ROUTES, getRoutePath } from "../lib/ROUTES";

const VendorProductsPage = () => {
  const { vendor } = useVendorAuthContext();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const vendorId = vendor?.vendor_id ?? vendor?.id ?? vendor?.seller_id ?? null;

  useEffect(() => {
    let active = true;

    const fetchVendorProducts = async () => {
      if (!vendorId) {
        if (active) {
          setProducts([]);
          setLoading(false);
          setError("Vendor profile is missing. Please log in again.");
        }
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await productAPI.getBySeller(vendorId);
        if (!active) return;
        setProducts(response.products || []);
      } catch (err) {
        if (active) setError(err.message || "Failed to load vendor products");
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchVendorProducts();

    return () => {
      active = false;
    };
  }, [vendorId]);

  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return products;

    return products.filter((product) => {
      return (
        product.title?.toLowerCase().includes(query) ||
        product.brand?.toLowerCase().includes(query) ||
        product.description?.toLowerCase().includes(query) ||
        product.category_name?.toLowerCase().includes(query)
      );
    });
  }, [products, searchQuery]);

  const totalProducts = products.length;
  const activeProducts = products.filter((product) => product.is_available).length;
  const lowStockProducts = products.filter(
    (product) => Number(product.stock_quantity || 0) <= 5,
  ).length;

  if (loading) {
    return (
      <ShowLoading
        message="Loading your products..."
        subMessage="We are fetching the products for your shop"
      />
    );
  }

  if (error) {
    return <ShowError message={error} />;
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-100 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="overflow-hidden rounded-3xl border border-white/70 bg-white/80 shadow-xl backdrop-blur">
          <div className="grid gap-6 p-6 lg:grid-cols-[1.4fr_0.9fr] lg:p-8">
            <div className="space-y-4">
              <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">
                <Package className="h-4 w-4" />
                Vendor Product Library
              </span>
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                  Manage only your products
                </h1>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                  Open any product to edit it with the same product form, then
                  keep prices, images, variants, and stock in one place.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  to={ROUTES.VENDOR_ADD_PRODUCTS}
                  className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 hover:bg-slate-800"
                >
                  <PlusCircle className="h-4 w-4" />
                  Add New Product
                </Link>
                <Link
                  to={ROUTES.VENDOR_DASHBOARD}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                >
                  <BadgeCheck className="h-4 w-4" />
                  View Dashboard
                </Link>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
              <div className="rounded-2xl bg-slate-900 p-4 text-white shadow-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-300">Total products</span>
                  <Boxes className="h-5 w-5 text-blue-300" />
                </div>
                <div className="mt-4 text-3xl font-bold">{totalProducts}</div>
              </div>
              <div className="rounded-2xl bg-emerald-50 p-4 text-emerald-900 shadow-sm ring-1 ring-emerald-100">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Available now</span>
                  <BadgeCheck className="h-5 w-5" />
                </div>
                <div className="mt-4 text-3xl font-bold">{activeProducts}</div>
              </div>
              <div className="rounded-2xl bg-amber-50 p-4 text-amber-900 shadow-sm ring-1 ring-amber-100">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Low stock</span>
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <div className="mt-4 text-3xl font-bold">{lowStockProducts}</div>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Your products</h2>
              <p className="mt-1 text-sm text-slate-600">
                Click any product to open the edit form.
              </p>
            </div>
            <div className="relative w-full md:max-w-md">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by title, brand, category..."
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-700 outline-none transition focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100"
              />
            </div>
          </div>

          <div className="mt-6">
            {filteredProducts.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
                <Package className="mx-auto h-10 w-10 text-slate-400" />
                <h3 className="mt-4 text-lg font-semibold text-slate-900">
                  No products found
                </h3>
                <p className="mt-2 text-sm text-slate-600">
                  {searchQuery
                    ? "Try a different keyword or clear the search field."
                    : "Add your first product to start managing your catalog."}
                </p>
                <Link
                  to={ROUTES.VENDOR_ADD_PRODUCTS}
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
                >
                  <PlusCircle className="h-4 w-4" />
                  Add Product
                </Link>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {filteredProducts.map((product) => {
                  const displayPrice = Number(
                    product.discount_price || product.price || 0,
                  ).toFixed(2);
                  const stock = Number(product.stock_quantity || 0);

                  return (
                    <Link
                      key={product.product_id}
                      to={getRoutePath(ROUTES.VENDOR_PRODUCT_EDIT, { productId: product.product_id })}
                      className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
                    >
                      <div className="relative h-52 bg-linear-to-br from-slate-100 to-blue-50">
                        {product.main_image_url ? (
                          <img
                            src={product.main_image_url}
                            alt={product.title}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center">
                            <Package className="h-14 w-14 text-blue-300" />
                          </div>
                        )}
                        <div className="absolute left-4 top-4 flex items-center gap-2">
                          <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm backdrop-blur">
                            {product.category_name || "Uncategorized"}
                          </span>
                          {!product.is_available ? (
                            <span className="rounded-full bg-rose-600 px-3 py-1 text-xs font-semibold text-white shadow-sm">
                              Unavailable
                            </span>
                          ) : null}
                        </div>
                        <div className="absolute bottom-4 right-4 rounded-full bg-slate-900/80 p-3 text-white shadow-lg transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                          <PencilLine className="h-4 w-4" />
                        </div>
                      </div>

                      <div className="space-y-3 p-5">
                        <div>
                          <h3 className="line-clamp-2 text-lg font-semibold text-slate-900 group-hover:text-blue-700">
                            {product.title}
                          </h3>
                          <p className="mt-1 text-sm text-slate-500">
                            {product.brand || "No brand"}
                          </p>
                        </div>

                        <div className="flex items-end justify-between">
                          <div>
                            <p className="text-xs uppercase tracking-wide text-slate-500">
                              Price
                            </p>
                            <p className="text-2xl font-bold text-slate-900">
                              ৳{displayPrice}
                            </p>
                          </div>
                          <div className="text-right text-sm text-slate-600">
                            <p>
                              Stock: <span className="font-semibold">{stock}</span>
                            </p>
                            <p>
                              Reviews: <span className="font-semibold">{product.total_reviews || 0}</span>
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                          <span className="text-sm font-medium text-slate-600">
                            Edit product details
                          </span>
                          <span className="inline-flex items-center gap-1 text-sm font-semibold text-blue-700">
                            Open <ArrowRight className="h-4 w-4" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default VendorProductsPage;
