import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone, Store } from 'lucide-react';

const ShopVendorCard = ({ vendor }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 overflow-hidden group">
      <div className="h-32 bg-linear-to-r from-blue-500 to-indigo-600 flex items-center justify-center relative overflow-hidden">
        <Store className="w-16 h-16 text-white/80 group-hover:scale-110 transition-transform duration-300" />
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-slate-800 mb-1 group-hover:text-blue-600 transition-colors">
          {vendor.shop_name}
        </h3>
        <p className="text-sm text-slate-500 mb-3">Owner: {vendor.name}</p>
        <p className="text-slate-600 text-sm mb-4 line-clamp-2">{vendor.description}</p>

        <div className="flex items-start gap-2 mb-3 p-3 bg-slate-50 rounded-lg">
          <MapPin className="w-4 h-4 text-blue-600 mt-1 shrink-0" />
          <div className="text-sm text-slate-700">
            <p className="font-medium">
              {vendor.area}, {vendor.city}
            </p>
            <p className="text-slate-500">{vendor.street}</p>
            <p className="text-slate-500">
              {vendor.postal_code}, {vendor.country}
            </p>
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Phone className="w-4 h-4 text-green-600" />
            <span className="font-medium">{vendor.phone}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Mail className="w-4 h-4 text-red-600" />
            <span className="font-medium">{vendor.email}</span>
          </div>
        </div>

        <Link
          to={`/shops/${vendor.vendor_id}`}
          className="inline-flex w-full items-center justify-center rounded-lg bg-linear-to-r from-green-500 to-blue-500 py-3 font-semibold text-white shadow-md transition-all hover:from-green-600 hover:to-blue-600 hover:shadow-lg active:scale-95"
        >
          Visit Shop
        </Link>
      </div>
    </div>
  );
};

export default ShopVendorCard;