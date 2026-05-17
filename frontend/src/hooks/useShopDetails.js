import { useEffect, useMemo, useState } from 'react';
import { productAPI } from '../services/api';

export const useShopDetails = (vendorId, params = {}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);
  const serializedParams = useMemo(() => JSON.stringify(params || {}), [params]);

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
        const parsedParams = serializedParams ? JSON.parse(serializedParams) : {};
        const productResponse = await productAPI.getBySeller(vendorId, parsedParams);

        if (!isActive) return;

        setProducts(productResponse.products || []);
        setPagination(productResponse.pagination || null);
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
  }, [vendorId, serializedParams]);

  return {
    products,
    pagination,
    loading,
    error,
  };
};