import { useContext } from 'react';
import { VendorAuthContext } from '../context/VendorAuthContextObject';

export const useVendorAuthContext = () => {
  const context = useContext(VendorAuthContext);
  if (!context) {
    throw new Error('useVendorAuthContext must be used within a VendorAuthProvider');
  }
  return context;
};
