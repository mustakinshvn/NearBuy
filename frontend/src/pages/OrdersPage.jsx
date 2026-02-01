import React, { useState } from "react";
import {
  Package,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  ShoppingBag,
} from "lucide-react";
import { useOrders } from "../hooks/useOrders";
import { orderAPI, orderItemAPI } from "../services/api";
import ButtonCard from "../component/sharingComponents/Button";
import { toast } from "react-hot-toast";
import { ShowLoading } from "../component/sharingComponents/ShowLoading";

const OrdersPage = () => {
  const { orders, loading, error } = useOrders();
  const [expandedOrders, setExpandedOrders] = useState({});
  const [orderItems, setOrderItems] = useState({});
  const [loadingItems, setLoadingItems] = useState({});

  const toggleOrderExpansion = async (orderId) => {
    const isExpanding = !expandedOrders[orderId];

    setExpandedOrders((prev) => ({
      ...prev,
      [orderId]: isExpanding,
    }));

    if (isExpanding && !orderItems[orderId]) {
      setLoadingItems((prev) => ({ ...prev, [orderId]: true }));
      try {
        const response = await orderItemAPI.getByOrderId(orderId);
        setOrderItems((prev) => ({
          ...prev,
          [orderId]: response.order_items || [],
        }));
      } catch (err) {
        console.error("Error fetching order items:", err);
      } finally {
        setLoadingItems((prev) => ({ ...prev, [orderId]: false }));
      }
    }
  };

  const getStatusBadgeColor = (status) => {
    const colors = {
      Delivered: "bg-green-100 text-green-700",
      Shipped: "bg-blue-100 text-blue-700",
      Confirmed: "bg-yellow-100 text-yellow-700",
      Pending: "bg-orange-100 text-orange-700",
      Cancelled: "bg-red-100 text-red-700",
    };
    return colors[status] || "bg-gray-100 text-gray-700";
  };

  const getPaymentStatusColor = (status) => {
    return status === "Paid" ? "text-green-600" : "text-orange-600";
  };

  const getStatusIcon = (status) => {
    const icons = {
      Delivered: CheckCircle,
      Shipped: Truck,
      Confirmed: Clock,
      Pending: Clock,
      Cancelled: XCircle,
    };
    return icons[status] || Package;
  };

  const getStatusColor = (status) => {
    const map = {
      Delivered: { bg: "bg-green-100", text: "text-green-600" },
      Shipped: { bg: "bg-blue-100", text: "text-blue-600" },
      Confirmed: { bg: "bg-yellow-100", text: "text-yellow-600" },
      Pending: { bg: "bg-orange-100", text: "text-orange-600" },
      Cancelled: { bg: "bg-red-100", text: "text-red-600" },
    };
    return map[status] || { bg: "bg-gray-100", text: "text-gray-600" };
  };

  if (loading) {
    return (
      <ShowLoading
        message="Loading your orders..."
        subMessage="Please wait while we fetch your order history"
      />
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-linear-to-br from-purple-50 to-pink-50">
        <div className="container mx-auto px-4 py-12">
          <div className="bg-white rounded-3xl shadow-xl p-12 text-center max-w-2xl mx-auto">
            <div className="bg-red-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <XCircle className="w-12 h-12 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-red-800 mb-3">
              Unable to Load Orders
            </h2>
            <p className="text-red-600 mb-6">{error}</p>
            <div className="flex gap-4 justify-center">
              <ButtonCard
                onClick={() => window.location.reload()}
                label="Try Again"
              />
              <a
                href="/products"
                className="px-8 py-3 bg-white border-2 border-slate-300 text-slate-700 rounded-xl font-semibold hover:border-green-600 hover:text-blue-600 transition-all"
              >
                Browse Products
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const cancelOrder = async (orderId) => {
    console.log("Cancelling order:", orderId);
    try {
      const response = await orderAPI.delete(orderId);
      console.log("Order cancelled:", response);

      toast.success("Order cancelled successfully");

      setExpandedOrders((prev) => ({
        ...prev,
        [orderId]: false,
      }));

      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (err) {
      console.error("Error cancelling order:", err);
      toast.error("Failed to cancel order. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">My Orders</h1>
          <p className="text-slate-600">Track and manage your orders</p>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-xl p-16 text-center max-w-2xl mx-auto">
            <div className="bg-linear-to-br from-purple-100 to-pink-100 w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package className="w-16 h-16 text-purple-600" />
            </div>
            <h2 className="text-3xl font-bold text-slate-800 mb-3">
              No Orders Yet
            </h2>
            <p className="text-lg text-slate-600 mb-2">
              Looks like you haven't placed any orders yet
            </p>
            <p className="text-slate-500 mb-8">
              Start exploring our amazing products and create your first order!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/products"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-linear-to-r from-green-600 to-blue-600 text-white rounded-xl font-semibold hover:from-green-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <ShoppingBag className="w-5 h-5" />
                Browse Products
              </a>
              <a
                href="/"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white border-2 border-slate-300 text-slate-700 rounded-xl font-semibold hover:border-purple-600 hover:text-purple-600 transition-all"
              >
                Back to Home
              </a>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const IconComponent = getStatusIcon(order.order_status);
              const statusColor = getStatusColor(order.order_status);
              const totalAmount = parseFloat(order.total_amount) || 0;
              const discountAmount = parseFloat(order.discount_amount) || 0;
              const finalAmount = parseFloat(order.final_amount) || 0;
              const shippingCost = parseFloat(order.shipping_cost) || 0;
              return (
                <div
                  key={order.order_id}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div
                        className={`${statusColor.bg} w-12 h-12 rounded-lg flex items-center justify-center shrink-0`}
                      >
                        <IconComponent
                          className={`${statusColor.text} w-6 h-6`}
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-bold text-slate-800 text-lg">
                            Order #{order.order_id}
                          </h3>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadgeColor(order.order_status)}`}
                          >
                            {order.order_status}
                          </span>
                        </div>
                        <div className="space-y-1 text-sm text-slate-600">
                          <p>
                            Placed on{" "}
                            {new Date(order.created_at).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              },
                            )}
                          </p>
                          {order.tracking_number && (
                            <p className="font-medium">
                              Tracking:{" "}
                              <span className="text-blue-600">
                                {order.tracking_number}
                              </span>
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="lg:text-right space-y-2">
                      <div>
                        <p className="text-sm text-slate-500">Total Amount</p>
                        <p className="text-2xl font-bold text-slate-800">
                          ৳{totalAmount.toFixed(2)}
                        </p>
                      </div>
                      {discountAmount > 0 && (
                        <p className="text-sm text-green-600 font-medium">
                          Discount: -৳{discountAmount.toFixed(2)}
                        </p>
                      )}
                      <div className="pt-2 border-t border-slate-200">
                        <p className="text-sm text-slate-600">Final Amount</p>
                        <p className="text-xl font-bold text-blue-600">
                          ৳{finalAmount.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-slate-200 grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <p className="text-xs text-slate-500 mb-1">
                        Payment Method
                      </p>
                      <p className="text-sm font-semibold text-slate-700">
                        {order.payment_method}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">
                        Payment Status
                      </p>
                      <p
                        className={`text-sm font-semibold ${getPaymentStatusColor(order.payment_status)}`}
                      >
                        {order.payment_status}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">
                        Shipping Cost
                      </p>
                      <p className="text-sm font-semibold text-slate-700">
                        ৳{shippingCost.toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Vendor ID</p>
                      <p className="text-sm font-semibold text-slate-700">
                        #{order.vendor_id}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex gap-3">
                    <button
                      onClick={() => toggleOrderExpansion(order.order_id)}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all text-sm flex items-center gap-2"
                    >
                      {expandedOrders[order.order_id] ? (
                        <>
                          <ChevronUp className="w-4 h-4" />
                          Hide Details
                        </>
                      ) : (
                        <>
                          <ChevronDown className="w-4 h-4" />
                          View Details
                        </>
                      )}
                    </button>
                    {order.order_status === "Pending" && (
                      <ButtonCard
                        onClick={() => cancelOrder(order.order_id)}
                        label="Cancel Order"
                        className="px-2 py-2 text-white font-bold"
                      />
                    )}
                  </div>

                  {expandedOrders[order.order_id] && (
                    <div className="mt-4 pt-4 border-t border-slate-200">
                      <h4 className="font-semibold text-slate-800 mb-3">
                        Order Items
                      </h4>
                      {loadingItems[order.order_id] ? (
                        <div className="text-center py-4">
                          <RefreshCw className="w-6 h-6 text-blue-600 animate-spin mx-auto" />
                          <p className="text-sm text-slate-600 mt-2">
                            Loading items...
                          </p>
                        </div>
                      ) : orderItems[order.order_id]?.length > 0 ? (
                        <div className="space-y-3">
                          {orderItems[order.order_id].map((item) => {
                            const unitPrice =
                              parseFloat(
                                item.discount_price ?? item.unit_price,
                              ) || 0;
                            const itemTotal =
                              parseFloat(item.total_price) ||
                              item.quantity * unitPrice;
                            return (
                              <div
                                key={item.order_item_id}
                                className="flex items-center gap-4 p-3 bg-slate-50 rounded-lg"
                              >
                                {item.product_image ? (
                                  <img
                                    src={item.product_image}
                                    alt={item.product_title || "Product"}
                                    className="w-16 h-16 object-cover rounded-md"
                                  />
                                ) : (
                                  <div className="w-16 h-16 bg-slate-200 rounded-md flex items-center justify-center">
                                    <Package className="w-8 h-8 text-slate-400" />
                                  </div>
                                )}
                                <div className="flex-1">
                                  <h5 className="font-semibold text-slate-800">
                                    {item.product_title ||
                                      `Product #${item.product_id}`}
                                  </h5>
                                  <div className="flex items-center gap-4 mt-1 text-sm text-slate-600">
                                    <span>Quantity: {item.quantity}</span>
                                    <span>
                                      Unit Price: ৳
                                      {(
                                        parseFloat(item.unit_price) || 0
                                      ).toFixed(2)}
                                    </span>
                                    {item.discount_price && (
                                      <span className="text-green-600">
                                        Discounted Unit: ৳
                                        {(
                                          parseFloat(item.discount_price) || 0
                                        ).toFixed(2)}
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="font-bold text-slate-800">
                                    ৳{(itemTotal || 0).toFixed(2)}
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <p className="text-sm text-slate-500 py-4 text-center">
                          No items found for this order
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
