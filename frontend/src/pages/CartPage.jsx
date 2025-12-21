import React, { useEffect } from 'react';
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  const cartTotal = getCartTotal();
  const shippingCost = cartTotal > 0 ? 60 : 0;
  const finalTotal = cartTotal + shippingCost;

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingCart className="w-32 h-32 text-slate-300 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-slate-700 mb-4">Your cart is empty</h2>
          <p className="text-slate-500 mb-8">Add some products to get started!</p>
          <button
            onClick={() => navigate('/products')}
            className="px-8 py-3 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg"
          >
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-blue-50 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-slate-800">Shopping Cart</h1>
          <button
            onClick={clearCart}
            className="text-red-600 hover:text-red-700 font-medium flex items-center gap-2"
          >
            <Trash2 size={20} />
            Clear Cart
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <div key={item.product_id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex gap-6">
                  <Link to={`/products/${item.product_id}`} className="shrink-0 hover:opacity-90 transition-all">
                    {item.main_image_url || item.image_urls?.[0] ? (
                      <img
                        src={item.main_image_url || item.image_urls?.[0]}
                        alt={item.title}
                        className="w-32 h-32 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-32 h-32 bg-linear-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center">
                        <ShoppingCart className="w-12 h-12 text-blue-600" />
                      </div>
                    )}
                  </Link>
                  
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-xl font-semibold text-slate-800">
                          <Link to={`/products/${item.product_id}`} className="hover:underline">{item.title}</Link>
                        </h3>
                        {item.brand && (
                          <p className="text-sm text-blue-600 font-medium">{item.brand}</p>
                        )}
                      </div>
                      <button
                        onClick={() => removeFromCart(item.product_id)}
                        className="text-red-500 hover:text-red-700 p-2"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                    
                    <p className="text-slate-600 mb-4 line-clamp-2">{item.description}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => updateQuantity(item.product_id, Math.max(1, item.quantity - 1))}
                          className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 flex items-center justify-center transition-colors"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="text-lg font-semibold w-12 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product_id, Math.min(item.stock_quantity, item.quantity + 1))}
                          className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 flex items-center justify-center transition-colors"
                          disabled={item.quantity >= item.stock_quantity}
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-600">
                          ৳{((parseFloat(item.discount_price) || parseFloat(item.price)) * item.quantity).toFixed(2)}
                        </div>
                        {item.discount_price && (
                          <div className="text-sm text-slate-400">
                            ৳{parseFloat(item.price).toFixed(2)} × {item.quantity}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-2xl font-bold text-slate-800 mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal ({cart.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                  <span className="font-semibold">৳{cartTotal.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between text-slate-600">
                  <span>Shipping</span>
                  <span className="font-semibold">
                    {shippingCost === 0 ? 'FREE' : `৳${shippingCost.toFixed(2)}`}
                  </span>
                </div>
                
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-slate-800">Total</span>
                    <span className="text-2xl font-bold text-blue-600">৳{finalTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => navigate('/checkout')}
                className="w-full bg-linear-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-lg font-bold text-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                Proceed to Checkout
                <ArrowRight size={20} />
              </button>

              <button
                onClick={() => navigate('/products')}
                className="w-full mt-4 border-2 border-blue-600 text-blue-600 py-3 rounded-lg font-medium hover:bg-blue-50 transition-all"
              >
                Continue Shopping
              </button>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Free Shipping</strong> on orders over ৳5000
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
