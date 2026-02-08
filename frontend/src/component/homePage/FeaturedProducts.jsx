import { useState } from "react";
import { useCart } from "../../hooks/useCart";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useProducts } from "../../hooks/useProducts";
import ProductCard from "../ProductCard";
import { ConfirmAlert } from "../sharingComponents/ConfirmAlert";

const FeaturedProducts = () => {
  const { products, loading: productsLoading } = useProducts();
  const featuredProducts = products?.slice(0, 8) || [];
  const { cart, addToCart, clearCart } = useCart();
  const [pendingProduct, setPendingProduct] = useState(null);
  const [showVendorConfirm, setShowVendorConfirm] = useState(false);

  const handleAddToCart = (product) => {
    const existingVendorId = cart[0]?.seller_id ?? null;
    const newVendorId = product.seller_id ?? null;

    if (
      !existingVendorId ||
      cart.length === 0 ||
      existingVendorId === newVendorId
    ) {
      addToCart(product, 1);
      return;
    }

    setPendingProduct(product);
    setShowVendorConfirm(true);
  };
  return (
    <>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-16">
          <div>
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Featured Products
            </h2>
            <p className="text-xl text-slate-600">
              Discover our most popular and trending products
            </p>
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
              <div
                key={index}
                className="bg-slate-100 rounded-2xl p-6 animate-pulse"
              >
                <div className="w-full h-48 bg-slate-200 rounded-xl mb-4"></div>
                <div className="h-4 bg-slate-200 rounded mb-2"></div>
                <div className="h-4 bg-slate-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.product_id}
                product={product}
                mode="featured"
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        )}
      </div>
      <ConfirmAlert
        isOpen={showVendorConfirm}
        onClose={() => {
          setShowVendorConfirm(false);
          setPendingProduct(null);
        }}
        onConfirm={() => {
          if (!pendingProduct) return;
          clearCart();
          addToCart(pendingProduct, 1);
          setPendingProduct(null);
        }}
        title="Start a new cart with this shop?"
        message="Your cart currently contains items from another shop. If you continue, we'll clear your existing cart and add this product from the new vendor."
      />
    </>
  );
};

export default FeaturedProducts;
