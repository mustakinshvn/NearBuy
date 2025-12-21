import React from 'react';
import { Package } from 'lucide-react';

const StockStatus = ({ product }) => {
  return (
    <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-slate-50 rounded-lg sm:rounded-xl">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <Package className={`w-4 h-4 sm:w-5 sm:h-5 ${product.is_available ? 'text-green-600' : 'text-red-600'}`} />
          <span className={`font-semibold text-sm sm:text-base ${product.is_available ? 'text-green-700' : 'text-red-700'}`}>
            {product.is_available ? 'In Stock' : 'Out of Stock'}
          </span>
        </div>
        {product.is_available && (
          <span className="text-xs sm:text-sm text-slate-600">{product.stock_quantity} units available</span>
        )}
      </div>
    </div>
  );
};

export default StockStatus;
