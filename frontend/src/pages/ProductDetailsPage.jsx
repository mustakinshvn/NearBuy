import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ImageGallery from '../component/productDetails/ImageGallery';
import ProductHeader from '../component/productDetails/ProductHeader';
import PriceSection from '../component/productDetails/PriceSection';
import QuantitySelector from '../component/productDetails/QuantitySelectorCard';
import PrimaryActions from '../component/productDetails/PrimaryActions';
import SecondaryActions from '../component/productDetails/SecondaryActions';
import StockStatus from '../component/productDetails/StockStatus';
import TrustIndicators from '../component/productDetails/TrustIndicators';

import { productAPI } from '../services/api';
import { useCart } from '../hooks/useCart';

const ProductDetailsPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  const { cart, addToCart } = useCart();

  useEffect(() => {
    let mounted = true;

    const loadProduct = async () => {
      try {
        const res = await productAPI.getById(productId);
        if (mounted) {
          setProduct(res.product || res);
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


  const isInCart = Boolean(
    product &&
      cart?.some(
        (item) => item.product_id === product.product_id
      )
  );

 
  const handleAddToCart = (qty) => {
    if (!product || isInCart) return;
    addToCart(product, qty);
  };

  const handleBuyNow = (qty) => {
    if (!product) return;

    if (isInCart) {
      navigate('/cart');
      return;
    }

    const added = addToCart(product, qty);
    if (added) navigate('/checkout');
    else navigate('/cart');
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
        alert('Link copied to clipboard');
      }
    } catch (err) {
      console.error('Share failed', err);
    }
  };


  if (!product) {
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
            <p className="text-sm text-slate-600">
              {product.description}
            </p>

            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-slate-600">
              <div>
                <div className="font-semibold">Brand</div>
                <div>{product.brand || '—'}</div>
              </div>
              <div>
                <div className="font-semibold">Model</div>
                <div>{product.model_number || '—'}</div>
              </div>
              <div>
                <div className="font-semibold">Weight</div>
                <div>{product.weight || '—'}</div>
              </div>
              <div>
                <div className="font-semibold">Dimensions</div>
                <div>{product.dimensions || '—'}</div>
              </div>
            </div>
          </div>
        </div>

       
        <aside className="lg:col-span-1">
          <div className="p-4 bg-white rounded-xl shadow-sm">
            <ProductHeader product={product} />
            <PriceSection product={product} />
            <StockStatus product={product} />

            <QuantitySelector
              product={product}
              quantity={quantity}
              setQuantity={setQuantity}
            />

            <PrimaryActions
              product={product}
              isInCart={isInCart}
              quantity={quantity}
              onAddToCart={handleAddToCart}
              onBuyNow={handleBuyNow}
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
