const enumVendorOrderTable = {
  order_id: "Order ID",
  product_title: "Products",
  name: "Customer",
  amount: "Amount",
  payment_status: "Payment Status",
  order_status: "Order Status",
  phone: "Mobile",
};

export const AllOrders = (props) => {
  const orders = Array.isArray(props.orders) ? props.orders : [];
  console.log("AllOrders received orders:", orders);

  return (
    <div>
      <table className="w-full">
        <thead className="bg-gray-100 border-b border-gray-200 ">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-bold text-gray-700">
              {enumVendorOrderTable.order_id}
            </th>
            <th className="px-6 py-3 text-left text-sm font-bold text-gray-700">
              {enumVendorOrderTable.product_title}
            </th>
            <th className="px-6 py-3 text-left text-sm font-bold text-gray-700">
              {enumVendorOrderTable.name}
            </th>
            <th className="px-6 py-3 text-left text-sm font-bold text-gray-700">
              {enumVendorOrderTable.phone}
            </th>
            <th className="px-6 py-3 text-left text-sm font-bold text-gray-700">
              {enumVendorOrderTable.amount}
            </th>
            <th className="px-6 py-3 text-left text-sm font-bold text-gray-700">
              {enumVendorOrderTable.payment_status}
            </th>
            <th className="px-6 py-3 text-left text-sm font-bold text-gray-700">
              {enumVendorOrderTable.order_status}
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
                <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                  {order.items.map((item) => (
                    <div key={item.product_id} className="flex  gap-2">
                      <img
                        src={item.product_image}
                        alt={item.product_title}
                        className="w-10 h-10 object-cover rounded-md"
                      />
                      {item.product_title}
                      <h1 className="font-bold"> (x{item.quantity})</h1>
                    </div>
                  ))}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {order.customer.name}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {order.customer.phone}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  ${order.final_amount}
                </td>

                <td className="px-6 py-4 text-sm">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                      order.payment_status === "Pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : order.payment_status === "Shipped"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-green-100 text-green-800"
                    }`}
                  >
                    {order.payment_status}
                  </span>
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
