import React from 'react';
import { Plus, Minus } from 'lucide-react';

const QuantitySelector = ({ product, quantity, setQuantity }) => {
  const handleChange = (delta) => {
    const next = quantity + delta;
    if (next >= 1 && next <= product.stock_quantity) setQuantity(next);
  };

  return (
    product.is_available && (
      <div className="mb-4 sm:mb-6">
        <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">Quantity</label>
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <button
            onClick={() => handleChange(-1)}
            disabled={quantity <= 1}
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:bg-slate-50 disabled:text-slate-300 flex items-center justify-center font-bold transition-all"
          >
            <Minus className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <input
            type="number"
            value={quantity}
            onChange={(e) => {
              const val = parseInt(e.target.value) || 1;
              if (val >= 1 && val <= product.stock_quantity) setQuantity(val);
            }}
            className="w-16 sm:w-20 h-10 sm:h-12 text-center border-2 border-slate-200 rounded-lg font-semibold text-base sm:text-lg focus:border-blue-500 outline-none"
          />
          <button
            onClick={() => handleChange(1)}
            disabled={quantity >= product.stock_quantity}
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:bg-slate-50 disabled:text-slate-300 flex items-center justify-center font-bold transition-all"
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <span className="text-xs sm:text-sm text-slate-500">Max: {product.stock_quantity}</span>
        </div>
      </div>
    )
  );
};

export default QuantitySelector;
