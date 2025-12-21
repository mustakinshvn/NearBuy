import React from 'react';
import { Star } from 'lucide-react';

const ProductHeader = ({ product }) => {
  return (
    <div className="flex items-start gap-4 sm:gap-6 mb-3 sm:mb-4">
      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-linear-to-br from-blue-100 to-indigo-100 rounded-lg overflow-hidden flex items-center justify-center">
        {product?.main_image_url ? (
          <img src={product.main_image_url} alt={product.title} className="w-full h-full object-cover" />
        ) : (
          <div className="text-blue-400 font-bold">No Image</div>
        )}
      </div>

      <div className="flex-1">
        <div className="flex items-center gap-3">
          <h2 className="text-lg sm:text-xl font-semibold text-slate-800">{product?.title}</h2>
          {product?.brand && <span className="text-xs sm:text-sm text-blue-600 bg-blue-50 px-2 py-0.5 rounded">{product.brand}</span>}
        </div>

        <div className="flex items-center gap-2 mt-1">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <span className="text-sm font-semibold text-slate-800">{product?.average_rating || 0}</span>
          <span className="text-xs text-slate-500">•</span>
          <span className="text-xs text-slate-500">{product?.total_reviews || 0} reviews</span>
        </div>
      </div>
    </div>
  );
};

export default ProductHeader;