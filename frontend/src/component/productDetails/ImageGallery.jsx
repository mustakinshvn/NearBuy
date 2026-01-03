import React, { useEffect, useState } from 'react';
import { ShoppingBag } from 'lucide-react';

const ImageGallery = ({ product, selectedImage, onSelectImage }) => {
  
  const price = parseFloat(product.price) || 0;
  const discountPrice = product.discount_price ? parseFloat(product.discount_price) : null;
  const hasDiscount = discountPrice && discountPrice < price;
  const discountPercentage = hasDiscount ? Math.round(((price - discountPrice) / price) * 100) : 0;

  const allImages = product.main_image_url
    ? [
        product.main_image_url,
        ...(product.image_urls || []).filter((url) => url !== product.main_image_url),
      ]
    : product.image_urls || [];

  const [internalIndex, setInternalIndex] = useState(selectedImage || 0);

  useEffect(() => {
    setInternalIndex(typeof selectedImage === 'number' ? selectedImage : 0);
  }, [selectedImage]);

  const handleImageSelect = (idx) => {
    setInternalIndex(idx);
    if (typeof onSelectImage === 'function') onSelectImage(idx);
  };

  return (
    <div className="space-y-2 sm:space-y-3">
      <div className="relative aspect-[4/3] sm:aspect-[3/2] bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg sm:rounded-xl overflow-hidden">
        {allImages.length > 0 ? (
          <img
            key={`main-${internalIndex}`}
            src={allImages[internalIndex]}
            alt={product.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ShoppingBag className="w-16 sm:w-32 h-16 sm:h-32 text-blue-400" />
          </div>
        )}
        {hasDiscount && product.is_available && (
          <div className="absolute top-2 left-2 sm:top-4 sm:left-4 bg-green-500 text-white px-2 py-1 sm:px-4 sm:py-2 rounded-full font-bold shadow-lg text-xs sm:text-base">
            {discountPercentage}% OFF
          </div>
        )}
        {!product.is_available && (
          <div className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-red-500 text-white px-2 py-1 sm:px-4 sm:py-2 rounded-full font-bold shadow-lg text-xs sm:text-base">
            Out of Stock
          </div>
        )}
      </div>

      {allImages.length > 1 && (
        <div className="flex gap-1 sm:gap-2 overflow-x-auto pb-2">
          {allImages.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleImageSelect(idx)}
              className={`shrink-0 w-12 h-12 sm:w-16 sm:h-16 rounded-md overflow-hidden border-2 transition-all ${
                internalIndex === idx
                  ? 'border-blue-600 scale-105'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <img src={img} alt={`${product.title} ${idx + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageGallery;