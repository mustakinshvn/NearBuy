import { useContext } from 'react';
import { VendorOrderContext } from '../context/VendorOrderContextObject';

export const useVendorOrder = () => {
  const context = useContext(VendorOrderContext);
  if (!context) {
    throw new Error('useVendorOrder must be used within a VendorOrderProvider');
  }
  return context;
};
