import { useCart } from '../../hooks/useCart';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useProducts } from '../../hooks/useProducts';
import ProductCard from '../ProductCard';


const FeaturedProducts = () => {
  const { products, loading: productsLoading } = useProducts();
  const featuredProducts = products?.slice(0, 8) || [];
  const { addToCart } = useCart();

  const handleAddToCart = (product) => {

    
    addToCart({
      product_id: product.product_id,
      title: product.title,
      price: product.price,
      discount_price: product.discount_price,
      quantity: 1,
      stock_quantity: product.stock_quantity,
      description: product.description,
      brand: product.brand,
    });

  };
  return (
     <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-16">
            <div>
              <h2 className="text-4xl font-bold text-slate-900 mb-4">Featured Products</h2>
              <p className="text-xl text-slate-600">Discover our most popular and trending products</p>
            </div>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold transition-colors"
            >
              View All
              <ArrowRight size={20} />
            </Link>
          </div>

          {productsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[...Array(8)].map((_, index) => (
                <div key={index} className="bg-slate-100 rounded-2xl p-6 animate-pulse">
                  <div className="w-full h-48 bg-slate-200 rounded-xl mb-4"></div>
                  <div className="h-4 bg-slate-200 rounded mb-2"></div>
                  <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {featuredProducts.map((product) => (
                  <ProductCard key={product.product_id} product={product} mode="featured" onAddToCart={handleAddToCart} />
                ))}
            </div>
          )}
        </div>
  )
}

export default FeaturedProducts