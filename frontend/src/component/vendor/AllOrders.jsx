import { ChangeOrderStatusDropDown } from "./ChangeOrderStatusDropDown";
import { PaymentStatusDropDown } from "./PaymentStatusDropDown";

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
                <td className="px-6 py-4 text-sm text-gray-900 font-medium flex flex-col gap-2">
                  {order.items.map((item) => (
                    <div
                      key={`${order.order_id}-${item.product_id}-${item.variant_id ?? "base"}`}
                      className="flex items-center gap-2"
                    >
                      {item.product_image && (
                        <img
                          src={item.product_image}
                          alt={item.product_title}
                          className="w-10 h-10 object-cover rounded"
                        />
                      )}
                      <div>
                        <p className="font-medium text-slate-700">
                          {item.product_title}
                        </p>
                        {item.variant_name && (
                          <p className="text-xs text-slate-500">
                            Variant: {item.variant_name}
                          </p>
                        )}
                        <p className="text-xs text-slate-500">
                          Qty: {item.quantity}
                        </p>
                      </div>
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
                  <PaymentStatusDropDown
                    payment_status={order.payment_status}
                    order_id={order.order_id}
                    vendor_id={order.vendor_id}
                    customer_id={order.customer_id}
                  />
                </td>

                <td className="px-6 py-4 text-sm">
                  <ChangeOrderStatusDropDown
                    order_status={order.order_status}
                    order_id={order.order_id}
                    vendor_id={order.vendor_id}
                    customer_id={order.customer_id}
                  />
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
