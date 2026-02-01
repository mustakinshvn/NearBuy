import { useEffect, useState, Suspense } from "react";
import { AllOrders } from "../component/vendor/AllOrders";
import { useVendorAuthContext } from "../hooks/useVendorAuthContext";
import { orderAPI } from "../services/api";
import { VendorStat } from "../component/vendor/VendorStat";

const VendorDashBoard = () => {
  const { vendor } = useVendorAuthContext();
  const [vendorOrders, setVendorOrders] = useState([]);

  useEffect(() => {
    async function fetchVendorOrders() {
      setVendorOrders(await orderAPI.getByVendor(vendor.vendor_id));
    }
    fetchVendorOrders();
  }, [vendor]);

  console.log("VendorDashBoard vendorOrders:", vendorOrders);
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
