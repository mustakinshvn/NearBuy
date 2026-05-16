import { useEffect, useState } from 'react';
import { productAPI } from '../services/api';

export const useShopDetails = (vendorId) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isActive = true;

    const loadShopDetails = async () => {
      if (!vendorId) {
        setProducts([]);
        setError(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const productResponse = await productAPI.getBySeller(vendorId);

        if (!isActive) return;

        setProducts(productResponse.products || []);
      } catch (shopError) {
        if (!isActive) return;
        setProducts([]);
        setError(shopError.message || 'Unable to load shop details');
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    loadShopDetails();

    return () => {
      isActive = false;
    };
  }, [vendorId]);

  return {
    products,
    loading,
    error,
  };
};