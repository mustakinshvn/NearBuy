import { Link } from 'react-router-dom'
import { Package, Heart, Star, ShoppingCart, ShoppingBag } from 'lucide-react'
import ButtonCard from './sharingComponents/Button'

const ProductCard = ({ product, mode = 'featured', onAddToCart }) => {
  const price = parseFloat(product.price) || 0;
  const discountPrice = product.discount_price ? parseFloat(product.discount_price) : null;
  const displayPrice = discountPrice || price;
  const hasDiscount = discountPrice && discountPrice < price;

  const handleAdd = (e) => {
    if (e && e.preventDefault) { e.preventDefault(); e.stopPropagation(); }
    if (onAddToCart) onAddToCart(product);
  }

  if (mode === 'grid') {
    return (
      <Link 
        to={`/products/${product.product_id}`}
        className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 overflow-hidden block"
      >
        <div className="h-48 bg-linear-to-br from-blue-100 to-indigo-100 flex items-center justify-center relative overflow-hidden">
          {product.main_image_url ? (
            <img 
              src={product.main_image_url} 
              alt={product.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <ShoppingBag className="w-16 h-16 text-blue-400" />
          )}
          {!product.is_available && (
            <span className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
              Out of Stock
            </span>
          )}
          {hasDiscount && product.is_available && (
            <span className="absolute top-3 left-3 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
              {Math.round(((price - discountPrice) / price) * 100)}% OFF
            </span>
          )}
        </div>
        <div className="p-4">
          {product.brand && (
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded">
                {product.brand}
              </span>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-semibold text-slate-700">{product.average_rating}</span>
              </div>
            </div>
          )}
          <h3 className="font-semibold text-slate-800 mb-2 line-clamp-2">{product.title}</h3>
          <p className="text-slate-600 text-sm mb-2 line-clamp-2">{product.description}</p>
          <p className="text-xs text-slate-500 mb-3">{product.total_reviews} reviews • Stock: {product.stock_quantity}</p>
          <div className="flex items-center justify-between mb-3">
            <div>
              {hasDiscount ? (
                <div>
                  <span className="text-lg font-bold text-blue-600">৳{displayPrice.toFixed(2)}</span>
                  <span className="text-sm text-slate-400 line-through ml-2">৳{price.toFixed(2)}</span>
                </div>
              ) : (
                <span className="text-lg font-bold text-blue-600">৳{displayPrice.toFixed(2)}</span>
              )}
            </div>
          </div>
          <button 
            onClick={handleAdd}
            disabled={!product.is_available}
            className={`w-full px-4 py-2 rounded-lg transition-all text-sm font-medium ${
              product.is_available
                ? 'bg-linear-to-r from-green-600 to-blue-600 text-white hover:from-green-700 hover:to-blue-700'
                : 'bg-slate-300 text-slate-500 cursor-not-allowed'
            }`}
          >
            {product.is_available ? 'Add to Cart' : 'Unavailable'}
          </button>
        </div>
      </Link>
    )
  }

  return (
    <Link
      to={`/products/${product.product_id}`}
      className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 overflow-hidden block"
    >
      <div className="relative overflow-hidden">
        <div className="w-full h-48 bg-linear-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
          {product.main_image_url || (product.image_urls && product.image_urls[0]) ? (
            <img
              src={product.main_image_url || product.image_urls?.[0]}
              alt={product.title}
              className="w-full h-48 object-cover"
            />
          ) : (
            <Package className="w-16 h-16 text-blue-400" />
          )}
        </div>
        {product.discount_price && (
          <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-lg text-xs font-semibold">
            {Math.round(((parseFloat(product.price) - parseFloat(product.discount_price)) / parseFloat(product.price)) * 100)}% OFF
          </div>
        )}
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={(e)=>{e.preventDefault(); e.stopPropagation();}} className="p-2 bg-white/80 hover:bg-white rounded-full shadow-lg">
            <Heart size={16} className="text-slate-600" />
          </button>
        </div>
      </div>

      <div className="p-6">
        <div className="mb-2">
          <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
            {product.brand || 'Brand'}
          </span>
        </div>

        <h3 className="font-semibold text-slate-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {product.title}
        </h3>

        <p className="text-slate-600 text-sm mb-4 line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-slate-900">
              ৳{parseFloat(product.discount_price || product.price).toFixed(2)}
            </span>
            {product.discount_price && (
              <span className="text-sm text-slate-400 line-through">
                ৳{parseFloat(product.price).toFixed(2)}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            <Star size={14} className="text-yellow-400 fill-current" />
            <span className="text-sm text-slate-600">4.5</span>
          </div>
        </div>
        <ButtonCard onClick={handleAdd} icon={<ShoppingCart size={16} />} label={"Add to cart"} />
      </div>
    </Link>
  )
}

export default ProductCard
