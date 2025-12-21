
const OrderSummaryCard = ({ cart, cartTotal, shippingCost, finalTotal }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Order Summary</h2>

      <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
        {cart.map((item) => (
          <div key={item.product_id} className="flex justify-between text-sm">
            <div className="flex-1">
              <p className="font-medium text-slate-700 line-clamp-1">{item.title}</p>
              <p className="text-slate-500">Qty: {item.quantity}</p>
            </div>
            <p className="font-semibold text-slate-700">৳{((item.discount_price || item.price) * item.quantity).toFixed(2)}</p>
          </div>
        ))}
      </div>

      <div className="border-t pt-4 space-y-3">
        <div className="flex justify-between text-slate-600">
          <span>Subtotal</span>
          <span className="font-semibold">৳{cartTotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-slate-600">
          <span>Shipping</span>
          <span className="font-semibold">৳{shippingCost.toFixed(2)}</span>
        </div>
        <div className="border-t pt-3">
          <div className="flex justify-between items-center">
            <span className="text-xl font-bold text-slate-800">Total</span>
            <span className="text-2xl font-bold text-blue-600">৳{finalTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default OrderSummaryCard;
