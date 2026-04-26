import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try { return JSON.parse(localStorage.getItem('vasavi_cart')) || []; }
    catch { return []; }
  });
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('vasavi_user')) || null; }
    catch { return null; }
  });
  const [wishlist, setWishlist] = useState([]);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    localStorage.setItem('vasavi_cart', JSON.stringify(cart));
  }, [cart]);

  const showNotification = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // ── Cart actions ───────────────────────────────────────
  const addToCart = (product, qty = product.minOrderQty) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) {
        showNotification(`${product.name} quantity updated!`);
        return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + qty } : i);
      }
      showNotification(`${product.name} added to cart!`);
      return [...prev, { ...product, qty }];
    });
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(i => i.id !== id));
    showNotification('Item removed from cart', 'info');
  };

  const updateQty = (id, qty) => {
    if (qty < 1) { removeFromCart(id); return; }
    setCart(prev => prev.map(i => i.id === id ? { ...i, qty } : i));
  };

  const clearCart = () => { setCart([]); };

  // ── Totals ─────────────────────────────────────────────
  const cartTotal = cart.reduce((sum, item) => {
    const discount = item.bulkDiscount || 0;
    const discounted = item.price * (1 - discount / 100);
    return sum + discounted * item.qty;
  }, 0);

  const cartOriginalTotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const cartSavings = cartOriginalTotal - cartTotal;
  const cartCount = cart.reduce((sum, i) => sum + i.qty, 0);

  // ── Auth ───────────────────────────────────────────────
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('vasavi_user', JSON.stringify(userData));
    showNotification(`Welcome back, ${userData.name}!`);
  };
  const logout = () => {
    setUser(null);
    localStorage.removeItem('vasavi_user');
  };

  return (
    <AppContext.Provider value={{
      cart, addToCart, removeFromCart, updateQty, clearCart,
      cartTotal, cartOriginalTotal, cartSavings, cartCount,
      user, login, logout,
      wishlist, setWishlist,
      notification, showNotification,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
export default AppContext;
