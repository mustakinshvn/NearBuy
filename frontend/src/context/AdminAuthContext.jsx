import React, { useEffect, useState } from 'react';
import { AdminAuthContext } from './AdminAuthContextObject';
import { adminAPI } from '../services/api';

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(() => {
    const storedAdmin = localStorage.getItem('admin');
    return storedAdmin ? JSON.parse(storedAdmin) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('adminToken') || '');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => Boolean(localStorage.getItem('adminToken')));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsAdminAuthenticated(Boolean(token));
  }, [token]);

  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);

      const response = await adminAPI.login(email, password);
      const adminData = response.admin;

      setAdmin(adminData);
      setToken(response.token || '');
      setIsAdminAuthenticated(true);
      localStorage.setItem('admin', JSON.stringify(adminData));
      localStorage.setItem('adminToken', response.token || '');

      return { success: true, admin: adminData };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setAdmin(null);
    setToken('');
    setIsAdminAuthenticated(false);
    localStorage.removeItem('admin');
    localStorage.removeItem('adminToken');
  };

  return (
    <AdminAuthContext.Provider
      value={{
        admin,
        token,
        isAdminAuthenticated,
        login,
        logout,
        loading,
        error,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};