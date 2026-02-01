const vendorStatEnum = {
  TOTAL_SALES: "Total Sales",
  TOTAL_ORDERS: "Total Orders",
  PENDING_ORDERS: "Pending Orders",
  PRODUCTS: "Available Products",
  CURRENCY_NAME: "BDT",
};

export const VendorStat = (props) => {
  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-gray-700 font-semibold mb-2">
          {vendorStatEnum.TOTAL_SALES}
        </h3>
        <div className="text-3xl font-bold flex items-center gap-2 ">
          <h1 className="text-gray-500">{vendorStatEnum.CURRENCY_NAME}</h1>
          {props.totalSales}
        </div>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-gray-700 font-semibold mb-2">
          {vendorStatEnum.TOTAL_ORDERS}
        </h3>
        <p className="text-3xl font-bold text-blue-600">{props.totalOrders}</p>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-gray-700 font-semibold mb-2">
          {vendorStatEnum.PENDING_ORDERS}
        </h3>
        <p className="text-3xl font-bold text-blue-600">
          {props.pendingOrders}
        </p>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-gray-700 font-semibold mb-2">
          {vendorStatEnum.PRODUCTS}
        </h3>
        <p className="text-3xl font-bold text-blue-600">
          {props.totalProducts}
        </p>
      </div>
    </div>
  );
};
