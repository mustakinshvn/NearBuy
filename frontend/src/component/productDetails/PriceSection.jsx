import React from 'react';

const PriceSection = ({ product }) => {
  const price = parseFloat(product.price) || 0;
  const discountPrice = product.discount_price ? parseFloat(product.discount_price) : null;
  const displayPrice = discountPrice || price;
  const hasDiscount = discountPrice && discountPrice < price;

  return (
    <div className="mb-4 sm:mb-6">
      <div className="flex items-baseline gap-2 sm:gap-3 mb-1 sm:mb-2 flex-wrap">
        <span className="text-2xl sm:text-4xl font-bold text-blue-600">৳{displayPrice.toFixed(2)}</span>
        {hasDiscount && (
          <>
            <span className="text-lg sm:text-2xl text-slate-400 line-through">৳{price.toFixed(2)}</span>
            <span className="px-2 sm:px-3 py-0.5 sm:py-1 bg-green-100 text-green-700 font-semibold rounded-lg text-xs sm:text-base">
              Save ৳{(price - discountPrice).toFixed(2)}
            </span>
          </>
        )}
      </div>
      <p className="text-xs sm:text-sm text-slate-500">Price in {product.currency || 'BDT'}</p>
    </div>
  );
};

export default PriceSection;
