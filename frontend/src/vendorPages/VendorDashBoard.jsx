import { useEffect, useState, Suspense } from "react";
import { AllOrders } from "../component/vendor/AllOrders";
import { useVendorAuthContext } from "../hooks/useVendorAuthContext";
import { orderAPI } from "../services/api";
import { VendorStat } from "../component/vendor/VendorStat";
import { ShowLoading } from "../component/sharingComponents/ShowLoading";
import { ShowError } from "../component/sharingComponents/ShowError";
import { Link } from "react-router-dom";
import { PlusIcon, ShoppingBag, LayoutGrid } from "lucide-react";

const VendorDashBoard = () => {
  const { vendor } = useVendorAuthContext();
  const [vendorOrders, setVendorOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchVendorOrders() {
      setLoading(true);
      setError(null);
      try {
        setVendorOrders(await orderAPI.getByVendor(vendor.vendor_id));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchVendorOrders();
  }, [vendor]);

  if (loading) {
    return (
      <ShowLoading
        message="Loading vendor orders..."
        subMessage="Please wait while we fetch your vendor orders"
      />
    );
  }

  if (error) {
    return <ShowError message={error} />;
  }

  return (
    <div className=" bg-gray-50 px-2 lg:p-8">
      <header className="my-4 flex flex-col md:flex-row md:justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Vendor Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back!</p>
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            to="/vendor/products"
            className="inline-flex bg-white text-gray-700 px-4 py-2 rounded border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors font-semibold items-center"
          >
            <LayoutGrid className="inline-block w-4 h-4 mr-2" />
            My Products
          </Link>
          <Link
            to="/vendor/add-products"
            className="inline-flex bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors font-semibold items-center"
          >
            <PlusIcon className="inline-block w-4 h-4 mr-2" />
            Add New Product
          </Link>
        </div>
      </header>

      <Suspense fallback={<div>Loading stats...</div>}>
        <VendorStat
          totalOrders={vendorOrders.orderCount}
          totalSales={vendorOrders.totalSales}
          pendingOrders={vendorOrders.pendingCount}
          deliveredOrders={vendorOrders.deliveredCount}
          totalProducts={vendorOrders.totalAvaibleProducts}
        />
      </Suspense>

      <section className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Recent Orders</h2>
        </div>
        <div className="overflow-x-auto">
          <Suspense fallback={<div>Loading...</div>}>
            <AllOrders orders={vendorOrders.orders || []} />
          </Suspense>
        </div>
      </section>
    </div>
  );
};

export default VendorDashBoard;
