import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (product, quantity, replace = false) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find(item => item.pro_codigo === product.pro_codigo);
      if (existingItem) {
        return prevItems.map(item => 
          item.pro_codigo === product.pro_codigo
            ? { ...item, quantity: replace ? quantity : item.quantity + quantity }
            : item
        );
      } else {
        return [...prevItems, { ...product, quantity }];
      }
    });
  };

  const removeFromCart = (productId) => {
    setCartItems((prevItems) => prevItems.filter(item => item.pro_codigo !== productId));
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
