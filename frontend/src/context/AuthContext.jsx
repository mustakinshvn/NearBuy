import React, { useState, useEffect } from 'react';
import { AuthContext } from './AuthContextObject';
import { customerAPI } from '../services/api';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('user') !== null;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsAuthenticated(user !== null);
  }, [user]);

  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await customerAPI.login(email, password);
      
      const userData = response.customer;
      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(userData));
      
      return { success: true, user: userData };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
    localStorage.removeItem('cart');
  };

  const signup = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await customerAPI.register(userData);
      
      const newUser = response.customer;
      setUser(newUser);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(newUser));
      
      return { success: true, user: newUser };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, signup, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
};