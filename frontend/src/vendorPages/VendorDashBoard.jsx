import { useEffect, useState, Suspense } from "react";
import { AllOrders } from "../component/vendor/AllOrders";
import { useVendorAuthContext } from "../hooks/useVendorAuthContext";
import { orderAPI } from "../services/api";

const stats = {
  totalSales: 45230,
  totalOrders: 128,
  pendingOrders: 12,
  totalProducts: 45,
  revenue: 32450,
};

const VendorDashBoard = () => {
  const { vendor } = useVendorAuthContext();
  const [vendorOrders, setVendorOrders] = useState([]);

  useEffect(() => {
    async function fetchVendorOrders() {
      setVendorOrders(await orderAPI.getByVendor(vendor.vendor_id));
    }
    fetchVendorOrders();
  }, [vendor]);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Vendor Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back!</p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-700 font-semibold mb-2">Total Sales</h3>
          <p className="text-3xl font-bold text-blue-600">
            ${stats.totalSales}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-700 font-semibold mb-2">Total Orders</h3>
          <p className="text-3xl font-bold text-blue-600">
            {stats.totalOrders}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-700 font-semibold mb-2">Pending Orders</h3>
          <p className="text-3xl font-bold text-blue-600">
            {stats.pendingOrders}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-700 font-semibold mb-2">Products</h3>
          <p className="text-3xl font-bold text-blue-600">
            {stats.totalProducts}
          </p>
        </div>
      </section>

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
