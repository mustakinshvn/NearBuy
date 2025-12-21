import { useState, useEffect } from 'react';
import { vendorAPI } from '../services/api';

export const useVendors = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await vendorAPI.getAll();
        setVendors(response.vendors || []);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching vendors:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchVendors();
  }, []);

  const getVendorById = async (vendorId) => {
    try {
      const response = await vendorAPI.getById(vendorId);
      return { success: true, vendor: response.vendor };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const getVendorByEmail = async (email) => {
    try {
      const response = await vendorAPI.getByEmail(email);
      return { success: true, vendor: response.vendor };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const getVendorByPhone = async (phone) => {
    try {
      const response = await vendorAPI.getByPhone(phone);
      return { success: true, vendor: response.vendor };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const getVendorsByType = async (shopType) => {
    try {
      const response = await vendorAPI.getByType(shopType);
      return { success: true, vendors: response.vendors };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const createVendor = async (vendorData) => {
    try {
      const response = await vendorAPI.register(vendorData);
      setVendors([...vendors, response.vendor]);
      return { success: true, vendor: response.vendor };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const updateVendor = async (vendorId, updateData) => {
    try {
      const response = await vendorAPI.update(vendorId, updateData);
      setVendors(vendors.map(v => v.vendor_id === vendorId ? response.vendor : v));
      return { success: true, vendor: response.vendor };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const deleteVendor = async (vendorId) => {
    try {
      await vendorAPI.delete(vendorId);
      setVendors(vendors.filter(v => v.vendor_id !== vendorId));
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  return {
    vendors,
    loading,
    error,
    getVendorById,
    getVendorByEmail,
    getVendorByPhone,
    getVendorsByType,
    createVendor,
    updateVendor,
    deleteVendor,
  };
};
