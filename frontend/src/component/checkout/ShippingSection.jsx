import React from 'react';
import { MapPin } from 'lucide-react';

const ShippingSection = ({ formData, onChange }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-2 mb-6">
        <MapPin className="text-blue-600" size={24} />
        <h2 className="text-2xl font-bold text-slate-800">Shipping Address</h2>
      </div>
      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Street Address</label>
          <input
            type="text"
            name="street"
            value={formData.street}
            onChange={onChange}
            required
            placeholder="House/Flat no, Road no"
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Area</label>
            <input
              type="text"
              name="area"
              value={formData.area}
              onChange={onChange}
              required
              placeholder="e.g., Dhanmondi, Gulshan"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">City</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={onChange}
              required
              placeholder="e.g., Dhaka"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Postal Code</label>
          <input
            type="text"
            name="postal_code"
            value={formData.postal_code}
            onChange={onChange}
            required
            placeholder="e.g., 1205"
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
    </div>
  );
};

export default ShippingSection;
