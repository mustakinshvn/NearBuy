import { useContext } from 'react';
import { VendorAuthContext } from '../context/VendorAuthContextObject';

export const useVendorAuth = () => {
  const context = useContext(VendorAuthContext);
  if (!context) {
    throw new Error('useVendorAuth must be used within a VendorAuthProvider');
  }
  return context;
};
