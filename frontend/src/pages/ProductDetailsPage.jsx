import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ImageGallery from "../component/productDetails/ImageGallery";
import ProductHeader from "../component/productDetails/ProductHeader";
import PriceSection from "../component/productDetails/PriceSection";
import QuantitySelector from "../component/productDetails/QuantitySelectorCard";
import PrimaryActions from "../component/productDetails/PrimaryActions";
import SecondaryActions from "../component/productDetails/SecondaryActions";
import StockStatus from "../component/productDetails/StockStatus";
import TrustIndicators from "../component/productDetails/TrustIndicators";
import { ShowLoading } from "../component/sharingComponents/ShowLoading";

import { productAPI } from "../services/api";
import { useCart } from "../hooks/useCart";
import { ConfirmAlert } from "../component/sharingComponents/ConfirmAlert";

const ProductDetailsPage = () => {
  const { id, productId } = useParams();
  const pid = id || productId;
  const navigate = useNavigate();
  const { cartItems: cart, addToCart, clearCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedVariantId, setSelectedVariantId] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [showVendorConfirm, setShowVendorConfirm] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const [pendingQuantity, setPendingQuantity] = useState(1);

  useEffect(() => {
    if (!pid) return;
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await productAPI.getById(pid);
        const loaded = res.product || res;
        if (loaded && !loaded.variants) loaded.variants = [];
        setProduct(loaded);
        setSelectedImage((loaded.images && loaded.images[0]) || null);
      } catch (err) {
        setError(err.message || "Failed to load product");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [pid]);

  const variants = useMemo(() => product?.variants || [], [product]);
  const requiresVariantSelection = variants.length > 0;
  const hasSelectedVariant =
    selectedVariantId !== null && selectedVariantId !== undefined;

  const displayProduct = useMemo(() => {
    if (!product) return null;
    if (hasSelectedVariant) {
      const v = variants.find((x) => x.variant_id === selectedVariantId);
      return v ? { ...product, ...v } : product;
    }
    return product;
  }, [product, variants, selectedVariantId, hasSelectedVariant]);

  if (loading || !product || !displayProduct) {
    return <ShowLoading message="Loading product details..." />;
  }

  const canAdjustQuantity =
    displayProduct && typeof displayProduct.stock !== "undefined"
      ? displayProduct.stock > 0
      : true;

  const isInCart = cart.some(
    (item) =>
      item.product_id === displayProduct.product_id &&
      (item.variant_id ?? null) === (displayProduct.variant_id ?? null),
  );

  const handleAddToCart = () => {
    if (!displayProduct) return;
    if (cart.length > 0 && cart[0].vendor_id !== displayProduct.vendor_id) {
      setPendingAction("add");
      setPendingQuantity(quantity);
      setShowVendorConfirm(true);
      return;
    }
    addToCart(displayProduct, quantity);
  };

  const handleBuyNow = () => {
    if (!displayProduct) return;
    if (cart.length > 0 && cart[0].vendor_id !== displayProduct.vendor_id) {
      setPendingAction("buy");
      setPendingQuantity(quantity);
      setShowVendorConfirm(true);
      return;
    }
    const added = addToCart(displayProduct, quantity);
    if (added) navigate("/checkout");
    else navigate("/cart");
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({ title: product.title, url: window.location.href })
        .catch(() => {});
    }
  };

  const pendingConfirm = () => {
    if (!displayProduct || !pendingAction) return;
    clearCart();
    const added = addToCart(displayProduct, pendingQuantity);
    if (pendingAction === "buy") {
      if (added) navigate("/checkout");
      else navigate("/cart");
    }
    setPendingAction(null);
    setPendingQuantity(1);
  };

  return (
    <>
      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ImageGallery
              product={product}
              selectedImage={selectedImage}
              onSelectImage={setSelectedImage}
            />

            <div className="mt-4 p-4 bg-white rounded-lg shadow-sm">
              <h3 className="text-sm font-semibold text-slate-700 mb-2">
                Description
              </h3>
              <p className="text-sm text-slate-600">{product.description}</p>

              <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-slate-600">
                <div>
                  <div className="font-semibold">Brand</div>
                  <div>{product.brand || "—"}</div>
                </div>
                <div>
                  <div className="font-semibold">Model</div>
                  <div>{product.model_number || "—"}</div>
                </div>
                <div>
                  <div className="font-semibold">Weight</div>
                  <div>{product.weight || "—"}</div>
                </div>
                <div>
                  <div className="font-semibold">Dimensions</div>
                  <div>{product.dimensions || "—"}</div>
                </div>
              </div>
            </div>
          </div>

          <aside className="lg:col-span-1">
            <div className="p-4 bg-white rounded-xl shadow-sm">
              <ProductHeader product={product} />
              {variants.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-slate-700 mb-1">
                    Select Variant
                  </h3>
                  <select
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={selectedVariantId ?? ""}
                    onChange={(e) =>
                      setSelectedVariantId(
                        e.target.value ? Number(e.target.value) : null,
                      )
                    }
                  >
                    {variants.length > 0 && (
                      <option value="" disabled>
                        -- Select a variant --
                      </option>
                    )}
                    {variants.map((variant) => (
                      <option
                        key={variant.variant_id}
                        value={variant.variant_id}
                      >
                        {variant.variant_name || variant.sku || "Variant"}
                      </option>
                    ))}
                  </select>
                  {requiresVariantSelection && !hasSelectedVariant && (
                    <p className="mt-1 text-xs text-red-500">
                      Please select a variant before adding to cart.
                    </p>
                  )}
                </div>
              )}

              <PriceSection product={displayProduct} />
              <StockStatus product={displayProduct} />

              {canAdjustQuantity && (
                <QuantitySelector
                  product={displayProduct}
                  quantity={quantity}
                  setQuantity={setQuantity}
                />
              )}

              <PrimaryActions
                product={displayProduct}
                isInCart={isInCart}
                quantity={quantity}
                onAddToCart={handleAddToCart}
                onBuyNow={handleBuyNow}
                canPurchase={
                  requiresVariantSelection ? hasSelectedVariant : true
                }
              />

              <SecondaryActions onShare={handleShare} />

              <div className="mt-4">
                <TrustIndicators />
              </div>
            </div>
          </aside>
        </div>
      </div>
      <ConfirmAlert
        isOpen={showVendorConfirm}
        onClose={() => {
          setShowVendorConfirm(false);
          setPendingAction(null);
          setPendingQuantity(1);
        }}
        onConfirm={pendingConfirm}
        title="Start a new cart with this shop?"
        message="Your cart currently contains items from another shop. If you continue, we'll clear your existing cart and add this product from the new vendor."
      />
    </>
  );
};

export default ProductDetailsPage;
