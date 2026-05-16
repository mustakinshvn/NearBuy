import React from "react";
import { MapPin } from "lucide-react";
import { useFormContext } from "react-hook-form";

const ShippingSection = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-2 mb-6">
        <MapPin className="text-blue-600" size={24} />
        <h2 className="text-2xl font-bold text-slate-800">Shipping Address</h2>
      </div>
      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Street Address
          </label>
          <input
            type="text"
            name="street"
            {...register("street")}
            required
            placeholder="House/Flat no, Road no"
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {errors.street?.message && (
            <p className="text-red-600 text-sm mt-1">{errors.street.message}</p>
          )}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Area
            </label>
            <input
              type="text"
              name="area"
              {...register("area")}
              required
              placeholder="e.g., Dhanmondi, Gulshan"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {errors.area?.message && (
              <p className="text-red-600 text-sm mt-1">{errors.area.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              City
            </label>
            <input
              type="text"
              name="city"
              {...register("city")}
              required
              placeholder="e.g., Dhaka"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {errors.city?.message && (
              <p className="text-red-600 text-sm mt-1">{errors.city.message}</p>
            )}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Postal Code
          </label>
          <input
            type="text"
            name="postal_code"
            {...register("postal_code")}
            required
            placeholder="e.g., 1205"
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {errors.postal_code?.message && (
            <p className="text-red-600 text-sm mt-1">
              {errors.postal_code.message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShippingSection;
