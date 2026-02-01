import { useEffect, useState, Suspense } from "react";
import { AllOrders } from "../component/vendor/AllOrders";
import { useVendorAuthContext } from "../hooks/useVendorAuthContext";
import { orderAPI } from "../services/api";
import { VendorStat } from "../component/vendor/VendorStat";
import { ShowLoading } from "../component/sharingComponents/ShowLoading";
import { ShowError } from "../component/sharingComponents/ShowError";

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
    <div className="min-h-screen bg-gray-50 p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Vendor Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back!</p>
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
