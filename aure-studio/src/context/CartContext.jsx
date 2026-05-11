import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { db } from '../firebase/config';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const CartContext = createContext();

export function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children }) {
  const { currentUser } = useAuth();
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // 1. Handle Initial Loading (Guest or User)
  useEffect(() => {
    setIsInitialLoad(true); // Reset state when user changes
    const loadCart = async () => {
      if (currentUser) {
        // Load from Firestore for logged-in user
        try {
          const cartDoc = await getDoc(doc(db, 'carts', currentUser.uid));
          if (cartDoc.exists()) {
            setCartItems(cartDoc.data().items || []);
          } else {
            // Check if there's a guest cart to sync
            const guestCart = localStorage.getItem('cart_guest');
            if (guestCart) {
              const items = JSON.parse(guestCart);
              setCartItems(items);
              // Save to Firestore immediately
              await setDoc(doc(db, 'carts', currentUser.uid), { items });
              localStorage.removeItem('cart_guest');
            } else {
              setCartItems([]);
            }
          }
        } catch (error) {
          console.error("Error loading cart from Firestore:", error);
        }
      } else {
        // Load from LocalStorage for guest
        const savedCart = localStorage.getItem('cart_guest');
        setCartItems(savedCart ? JSON.parse(savedCart) : []);
      }
      setIsInitialLoad(false);
    };

    loadCart();
  }, [currentUser]);

  // 2. Persist Cart Changes
  useEffect(() => {
    if (isInitialLoad) return;

    const persistCart = async () => {
      if (currentUser) {
        // Save to Firestore
        try {
          await setDoc(doc(db, 'carts', currentUser.uid), {
            items: cartItems,
            updatedAt: new Date().toISOString()
          });
        } catch (error) {
          console.error("Error saving cart to Firestore:", error);
        }
      } else {
        // Save to LocalStorage for guest
        localStorage.setItem('cart_guest', JSON.stringify(cartItems));
      }
    };

    persistCart();
  }, [cartItems, currentUser, isInitialLoad]);

  // 3. Clear Cart on Logout (Handled by useEffect #1 because currentUser changes)
  // However, we should explicitly clear the state when currentUser becomes null to avoid flicker
  useEffect(() => {
    if (!currentUser && !isInitialLoad) {
      // We just logged out
      setCartItems([]);
      localStorage.removeItem('cart_guest'); // Optional: clear guest cart too on logout for full reset
    }
  }, [currentUser]);

  const addToCart = (product) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      if (existingItem) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: (item.quantity || 1) + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setCartOpen(true);
  };

  const removeFromCart = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id, amount) => {
    setCartItems(prev => {
      return prev.map(item => {
        if (item.id === id) {
          const newQuantity = Math.max(1, (item.quantity || 1) + amount);
          return { ...item, quantity: newQuantity };
        }
        return item;
      });
    });
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartCount = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const cartTotal = cartItems.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);

  const value = {
    cartOpen,
    setCartOpen,
    cartItems,
    cartCount,
    cartTotal,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

