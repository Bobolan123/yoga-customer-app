import { IYogaClass } from '@/common/interface';
import React, { createContext, ReactNode, useContext, useState } from 'react';

interface ICartItem {
  classId: number;
  classData: IYogaClass;
}

interface ICartContext {
  cart: ICartItem[];
  addToCart: (item: ICartItem) => void;
  removeFromCart: (classId: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<ICartContext | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<ICartItem[]>([]);

  const addToCart = (item: ICartItem) => {
    setCart((prev) => {
      if (prev.find((i) => i.classId === item.classId)) return prev;
      return [...prev, item];
    });
  };

  const removeFromCart = (classId: number) => {
    setCart((prev) => prev.filter((item) => item.classId !== classId));
  };

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};
