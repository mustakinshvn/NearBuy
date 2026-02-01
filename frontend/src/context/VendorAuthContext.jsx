import React, { useState, useEffect } from "react";
import { VendorAuthContext } from "./VendorAuthContextObject";
import { vendorAPI } from "../services/api";

export const VendorAuthProvider = ({ children }) => {
  const [vendor, setVendor] = useState(() => {
    const storedVendor = localStorage.getItem("vendor");
    return storedVendor ? JSON.parse(storedVendor) : null;
  });
  const [isVendorAuthenticated, setIsVendorAuthenticated] = useState(() => {
    return localStorage.getItem("vendor") !== null;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsVendorAuthenticated(vendor !== null);
  }, [vendor]);

  const vendorLogin = async (email, password) => {
    try {
      setLoading(true);
      setError(null);

      const response = await vendorAPI.vendorLogin(email, password);

      const vendorData = response.vendor;
      setVendor(vendorData);
      setIsVendorAuthenticated((prev) => !prev);
      localStorage.setItem("vendor", JSON.stringify(vendorData));

      return { success: true, vendor: vendorData };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const vendorLogout = () => {
    setVendor(null);
    setIsVendorAuthenticated(false);
    localStorage.removeItem("vendor");
  };

  const vendorSignup = async (vendorData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await vendorAPI.register(vendorData);

      const newVendor = response.vendor;
      setVendor(newVendor);
      setIsVendorAuthenticated(true);
      localStorage.setItem("vendor", JSON.stringify(newVendor));

      return { success: true, vendor: newVendor };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  return (
    <VendorAuthContext.Provider
      value={{
        vendor,
        isVendorAuthenticated,
        vendorLogin,
        vendorLogout,
        vendorSignup,
        loading,
        error,
      }}
    >
      {children}
    </VendorAuthContext.Provider>
  );
};
