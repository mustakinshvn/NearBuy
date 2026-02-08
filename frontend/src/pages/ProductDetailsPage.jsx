import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ImageGallery from "../component/productDetails/ImageGallery";
import ProductHeader from "../component/productDetails/ProductHeader";
import PriceSection from "../component/productDetails/PriceSection";
import QuantitySelector from "../component/productDetails/QuantitySelectorCard";
import PrimaryActions from "../component/productDetails/PrimaryActions";
import SecondaryActions from "../component/productDetails/SecondaryActions";
import StockStatus from "../component/productDetails/StockStatus";
import TrustIndicators from "../component/productDetails/TrustIndicators";

import { productAPI } from "../services/api";
import { useCart } from "../hooks/useCart";

const ProductDetailsPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariantId, setSelectedVariantId] = useState(null);

  const { cart, addToCart } = useCart();

  useEffect(() => {
    let mounted = true;

    const loadProduct = async () => {
      try {
        const res = await productAPI.getById(productId);
        if (mounted) {
          const loadedProduct = res.product || res;
          setProduct(loadedProduct);

          const variants = loadedProduct?.variants || [];

          // If there is exactly one variant, select it by default.
          // If there are multiple variants, force the user to choose.
          if (variants.length === 1) {
            setSelectedVariantId(variants[0].variant_id);
          } else {
            setSelectedVariantId(null);
          }
        }
      } catch {
        if (mounted) setProduct(null);
      }
    };

    loadProduct();
    return () => {
      mounted = false;
    };
  }, [productId]);

  useEffect(() => {
    if (product) {
      document.title = `${product.title} • Product`;
    }
  }, [product]);

  const variants = product?.variants || [];

  const selectedVariant = variants.find(
    (v) => v.variant_id === selectedVariantId,
  );

  const displayProduct = (() => {
    if (!product) return null;
    if (!selectedVariant) return product;

    return {
      ...product,
      // Variant identity
      variant_id: selectedVariant.variant_id,
      variant_name: selectedVariant.variant_name,
      variant_sku: selectedVariant.sku,
      // Overrides
      price: selectedVariant.price ?? product.price,
      discount_price: selectedVariant.discount_price ?? product.discount_price,
      stock_quantity: selectedVariant.stock_quantity ?? product.stock_quantity,
      is_available: selectedVariant.is_available ?? product.is_available,
      main_image_url: selectedVariant.image_url || product.main_image_url,
      weight: selectedVariant.weight ?? product.weight,
      dimensions: selectedVariant.dimensions ?? product.dimensions,
      color: selectedVariant.color ?? product.color,
      material: selectedVariant.material ?? product.material,
    };
  })();

  // Only require explicit selection when there are multiple variants.
  const requiresVariantSelection = variants.length > 1;
  const hasSelectedVariant = variants.length === 0 || !!selectedVariant;

  // Quantity should be limited by the selected variant's stock when applicable.
  const canAdjustQuantity = variants.length === 0 || !!selectedVariant;

  const isInCart = Boolean(
    displayProduct &&
    hasSelectedVariant &&
    cart?.some(
      (item) =>
        item.product_id === displayProduct.product_id &&
        (item.variant_id ?? null) === (displayProduct.variant_id ?? null),
    ),
  );

  const handleAddToCart = (qty) => {
    if (!displayProduct || isInCart) return;
    if (requiresVariantSelection && !hasSelectedVariant) return;
    addToCart(displayProduct, qty);
  };

  const handleBuyNow = (qty) => {
    if (!displayProduct) return;
    if (requiresVariantSelection && !hasSelectedVariant) return;

    if (isInCart) {
      navigate("/cart");
      return;
    }

    const added = addToCart(displayProduct, qty);
    if (added) navigate("/checkout");
    else navigate("/cart");
  };

  const handleShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({
          title: product.title,
          url,
        });
      } else {
        await navigator.clipboard.writeText(url);
        alert("Link copied to clipboard");
      }
    } catch (err) {
      console.error("Share failed", err);
    }
  };

  if (!product || !displayProduct) {
    return <div className="p-6">Loading...</div>;
  }

  return (
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
                  {variants.length > 1 && (
                    <option value="" disabled>
                      -- Select a variant --
                    </option>
                  )}
                  {variants.map((variant) => (
                    <option key={variant.variant_id} value={variant.variant_id}>
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
              canPurchase={hasSelectedVariant}
            />

            <SecondaryActions onShare={handleShare} />

            <div className="mt-4">
              <TrustIndicators />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
