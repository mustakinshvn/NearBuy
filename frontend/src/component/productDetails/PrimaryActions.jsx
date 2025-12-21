import React from 'react';
import { ShoppingBag, Check } from 'lucide-react';

const PrimaryActions = ({ product, isInCart, quantity, onAddToCart, onBuyNow }) => {
  return (
    <div className="flex gap-2 sm:gap-3 mb-4 sm:mb-6 flex-col sm:flex-row">
      <button
        onClick={() => onAddToCart && onAddToCart(quantity)}
        disabled={!product.is_available || isInCart}
        className={`flex-1 py-3 sm:py-4 rounded-lg sm:rounded-xl font-semibold transition-all flex items-center justify-center gap-2 text-sm sm:text-base ${
          product.is_available && !isInCart
            ? 'bg-linear-to-r from-green-600 to-blue-600 text-white hover:from-green-700 hover:to-blue-700 shadow-lg hover:shadow-xl transform hover:scale-105'
            : 'bg-slate-300 text-slate-500 cursor-not-allowed'
        }`}
      >
        {isInCart ? (
          <>
            <Check className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>In Cart</span>
          </>
        ) : (
          <>
            <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Add to Cart</span>
          </>
        )}
      </button>
      <button
        onClick={() => onBuyNow && onBuyNow(quantity)}
        disabled={!product.is_available}
        className={`flex-1 py-3 sm:py-4 rounded-lg sm:rounded-xl font-semibold transition-all text-sm sm:text-base ${
          product.is_available
            ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl transform hover:scale-105'
            : 'bg-slate-300 text-slate-500 cursor-not-allowed'
        }`}
      >
        {isInCart ? 'View Cart' : 'Buy Now'}
      </button>
    </div>
  );
};

export default PrimaryActions;
