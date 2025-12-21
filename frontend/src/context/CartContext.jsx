import React, { useState, useEffect } from 'react';
import { CartContext } from './CartContextObject';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const { success, warning } = useToast();
  const [cartItems, setCartItems] = useState(() => {
    if (typeof window !== 'undefined' && isAuthenticated) {
      const storedCart = localStorage.getItem('cart');
      return storedCart ? JSON.parse(storedCart) : [];
    }
    return [];
  });

  useEffect(() => {
    if (isAuthenticated && cartItems.length > 0) {
      localStorage.setItem('cart', JSON.stringify(cartItems));
    } else if (!isAuthenticated) {
      localStorage.removeItem('cart');
    }
  }, [cartItems, isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated && cartItems.length > 0) {
      localStorage.setItem('cart', JSON.stringify(cartItems));
    }
  }, [cartItems, isAuthenticated]);

  const addToCart = (product, quantity = 1) => {
    const existingItem = cartItems.find(item => item.product_id === product.product_id);
    
    if (existingItem) {
      warning(
        `"${product.title}" is already in your cart. Please update the quantity from the cart page.`,
        'Already in Cart'
      );
      return false;
    }
    
    setCartItems(prevItems => [...prevItems, { ...product, quantity }]);
    success(
      `"${product.title}" has been added to your cart!`,
      'Added to Cart'
    );
    return true;
  };

  const removeFromCart = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item.product_id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.product_id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cart');
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = item.discount_price || item.price;
      return total + (price * item.quantity);
    }, 0);
  };

  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{
      cart: cartItems,
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getCartTotal,
      getCartCount
    }}>
      {children}
    </CartContext.Provider>
  );
};