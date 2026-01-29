const enumVendorOrderTable = {
  order_id: "Order ID",
  product_title: "Product",
  name: "Customer",
  amount: "Amount",
  status: "Status",
};

export const AllOrders = (props) => {
  const orders = Array.isArray(props.orders) ? props.orders : [];
  console.log("AllOrders received orders:", orders);

  return (
    <div>
      <table className="w-full">
        <thead className="bg-gray-100 border-b border-gray-200">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
              {enumVendorOrderTable.order_id}
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
              {enumVendorOrderTable.product_title}
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
              {enumVendorOrderTable.name}
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
              {enumVendorOrderTable.amount}
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
              {enumVendorOrderTable.status}
            </th>
          </tr>
        </thead>
        {orders.length > 0 ? (
          <tbody>
            {orders.map((order) => (
              <tr
                key={order.order_id}
                className="border-b border-gray-200 hover:bg-gray-50"
              >
                <td className="px-6 py-4 text-sm text-gray-900">
                  #{order.order_id}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {order.product_title}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {order.name}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  ${order.unit_price}
                </td>
                <td className="px-6 py-4 text-sm">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                      order.order_status === "Pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : order.order_status === "Shipped"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-green-100 text-green-800"
                    }`}
                  >
                    {order.order_status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        ) : (
          <tbody>
            <tr>
              <td
                colSpan="5"
                className="px-6 py-4 text-center text-sm text-gray-500"
              >
                No orders found.
              </td>
            </tr>
          </tbody>
        )}
      </table>
    </div>
  );
};
