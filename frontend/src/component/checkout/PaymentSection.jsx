import React from "react";
import { CreditCard } from "lucide-react";
import { useFormContext, useWatch } from "react-hook-form";

const PaymentSection = () => {
  const {
    register,
    formState: { errors },
    control,
  } = useFormContext();

  const paymentMethod = useWatch({
    control,
    name: "payment_method",
  });

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-2 mb-6">
        <CreditCard className="text-blue-600" size={24} />
        <h2 className="text-2xl font-bold text-slate-800">Payment Method</h2>
      </div>
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <input
            type="radio"
            id="cod"
            name="payment_method"
            value="cash_on_delivery"
            {...register("payment_method")}
            className="w-4 h-4 text-blue-600"
          />
          <label
            htmlFor="cod"
            className="text-slate-700 font-medium cursor-pointer"
          >
            Cash on Delivery
          </label>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="radio"
            id="card"
            name="payment_method"
            value="credit_card"
            {...register("payment_method")}
            className="w-4 h-4 text-blue-600"
          />
          <label
            htmlFor="card"
            className="text-slate-700 font-medium cursor-pointer"
          >
            Credit/Debit Card
          </label>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="radio"
            id="bkash"
            name="payment_method"
            value="bkash"
            {...register("payment_method")}
            className="w-4 h-4 text-blue-600"
          />
          <label
            htmlFor="bkash"
            className="text-slate-700 font-medium cursor-pointer"
          >
            bKash
          </label>
        </div>

        {paymentMethod === "credit_card" && (
          <div className="mt-4 p-4 bg-slate-50 rounded-lg space-y-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Card Number
              </label>
              <input
                type="text"
                name="card_number"
                {...register("card_number")}
                placeholder="1234 5678 9012 3456"
                maxLength="19"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              {errors.card_number?.message && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.card_number.message}
                </p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Expiry Date
                </label>
                <input
                  type="text"
                  name="card_expiry"
                  {...register("card_expiry")}
                  placeholder="MM/YY"
                  maxLength="5"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                {errors.card_expiry?.message && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.card_expiry.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  CVV
                </label>
                <input
                  type="text"
                  name="card_cvv"
                  {...register("card_cvv")}
                  placeholder="123"
                  maxLength="3"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                {errors.card_cvv?.message && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.card_cvv.message}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentSection;
