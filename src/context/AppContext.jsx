import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  getInitialStore,
  saveData,
  STORAGE_KEYS,
  resetStoreToDefault
} from '../data/storage';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const initial = getInitialStore();

  const [business, setBusiness] = useState(initial.business);
  const [user, setUser] = useState(initial.user);
  const [categories, setCategories] = useState(initial.categories);
  const [products, setProducts] = useState(initial.products);
  const [orders, setOrders] = useState(initial.orders);
  const [expenses, setExpenses] = useState(initial.expenses);

  // Navigation: Login first -> Setup -> Dashboard
  const [activePage, setActivePage] = useState(() => {
    if (!initial.user?.isLoggedIn) return 'login';
    if (!initial.business?.setupCompleted) return 'business-setup';
    return 'dashboard';
  });

  const [selectedPeriod, setSelectedPeriod] = useState('This Month');
  const [customDateRange, setCustomDateRange] = useState({ start: '', end: '' });

  // Modal Visibility State
  const [isAddOrderModalOpen, setIsAddOrderModalOpen] = useState(false);
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);
  const [isAddExpenseModalOpen, setIsAddExpenseModalOpen] = useState(false);

  // Active editing items
  const [editingOrder, setEditingOrder] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);

  // Toast notifications
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Sync state changes with localStorage
  useEffect(() => {
    saveData(STORAGE_KEYS.BUSINESS, business);
  }, [business]);

  useEffect(() => {
    saveData(STORAGE_KEYS.USER, user);
  }, [user]);

  useEffect(() => {
    saveData(STORAGE_KEYS.CATEGORIES, categories);
  }, [categories]);

  useEffect(() => {
    saveData(STORAGE_KEYS.PRODUCTS, products);
  }, [products]);

  useEffect(() => {
    saveData(STORAGE_KEYS.ORDERS, orders);
  }, [orders]);

  useEffect(() => {
    saveData(STORAGE_KEYS.EXPENSES, expenses);
  }, [expenses]);

  // Order Actions with Actual Price & Profit/Loss (NO Quantity)
  const addOrder = (orderData) => {
    const sellingPrice = Number(orderData.sellingPrice) || 0;
    const actualPrice = Number(orderData.actualPrice) || 0;
    const discount = Number(orderData.discount) || 0;
    const shipping = Number(orderData.shippingCharge) || 0;
    const totalAmount = sellingPrice - discount + shipping;
    const profit = totalAmount - actualPrice;

    const newOrder = {
      ...orderData,
      id: `ord_${Date.now()}`,
      sellingPrice,
      actualPrice,
      totalAmount,
      profit,
      createdAt: new Date().toISOString()
    };

    setOrders((prev) => [newOrder, ...prev]);

    try {
      confetti({
        particleCount: 45,
        spread: 55,
        origin: { y: 0.8 }
      });
    } catch (e) {
      // Ignored
    }

    const profitMsg = profit >= 0 ? `+${business.currency}${profit} profit` : `-${business.currency}${Math.abs(profit)} loss`;
    showToast(`Order #${newOrder.orderNumber} added (${profitMsg})!`, 'success');
  };

  const updateOrder = (orderId, updatedFields) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          const sellingPrice = Number(updatedFields.sellingPrice ?? o.sellingPrice);
          const actualPrice = Number(updatedFields.actualPrice ?? o.actualPrice);
          const discount = Number(updatedFields.discount ?? o.discount);
          const shipping = Number(updatedFields.shippingCharge ?? o.shippingCharge);
          const totalAmount = sellingPrice - discount + shipping;
          const profit = totalAmount - actualPrice;

          return {
            ...o,
            ...updatedFields,
            sellingPrice,
            actualPrice,
            totalAmount,
            profit
          };
        }
        return o;
      })
    );
    showToast('Order updated successfully.', 'success');
  };

  const deleteOrder = (orderId) => {
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
    showToast('Order removed.', 'info');
  };

  // Product Catalog Actions (Actual Price + Selling Price)
  const addProduct = (prodData) => {
    const newProd = {
      ...prodData,
      id: `prod_${Date.now()}`,
      actualPrice: Number(prodData.actualPrice) || 0,
      sellingPrice: Number(prodData.sellingPrice) || 0
    };
    setProducts((prev) => [newProd, ...prev]);
    showToast(`Product "${newProd.name}" added to catalog.`, 'success');
  };

  const updateProduct = (prodId, updatedFields) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === prodId ? { ...p, ...updatedFields } : p))
    );
    showToast('Product updated.', 'success');
  };

  const deleteProduct = (prodId) => {
    setProducts((prev) => prev.filter((p) => p.id !== prodId));
    showToast('Product removed.', 'info');
  };

  // Category Actions
  const addCategory = (catData) => {
    const newCat = {
      ...catData,
      id: `cat_${Date.now()}`
    };
    setCategories((prev) => [...prev, newCat]);
    showToast(`Category "${newCat.name}" created.`, 'success');
  };

  const updateCategory = (catId, updatedFields) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === catId ? { ...c, ...updatedFields } : c))
    );
    if (updatedFields.name) {
      setProducts((prev) =>
        prev.map((p) => (p.categoryId === catId ? { ...p, categoryName: updatedFields.name } : p))
      );
      setOrders((prev) =>
        prev.map((o) => (o.categoryId === catId ? { ...o, categoryName: updatedFields.name } : o))
      );
    }
    showToast('Category updated.', 'success');
  };

  const deleteCategory = (catId) => {
    setCategories((prev) => prev.filter((c) => c.id !== catId));
    showToast('Category deleted.', 'info');
  };

  // Expense Actions
  const addExpense = (expData) => {
    const newExp = {
      ...expData,
      id: `exp_${Date.now()}`,
      amount: Number(expData.amount) || 0,
      date: expData.date || new Date().toISOString().split('T')[0]
    };
    setExpenses((prev) => [newExp, ...prev]);
    showToast(`Expense "${newExp.name}" recorded.`, 'success');
  };

  const deleteExpense = (expId) => {
    setExpenses((prev) => prev.filter((e) => e.id !== expId));
    showToast('Expense deleted.', 'info');
  };

  // Business Profile & User Auth Actions
  const updateBusinessProfile = (bizData) => {
    const updated = { ...business, ...bizData, setupCompleted: true };
    setBusiness(updated);
    showToast('Business setup completed!', 'success');
    setActivePage('dashboard');
  };

  const loginUser = (userData) => {
    const updatedUser = { ...userData, isLoggedIn: true };
    setUser(updatedUser);
    showToast(`Welcome, ${userData.name || 'User'}!`, 'success');

    if (!business.setupCompleted) {
      setActivePage('business-setup');
    } else {
      setActivePage('dashboard');
    }
  };

  const logoutUser = () => {
    setUser({ id: '', name: '', email: '', isLoggedIn: false });
    setActivePage('login');
    showToast('Logged out.', 'info');
  };

  const resetAllData = () => {
    const fresh = resetStoreToDefault();
    setBusiness(fresh.business);
    setUser(fresh.user);
    setCategories(fresh.categories);
    setProducts(fresh.products);
    setOrders(fresh.orders);
    setExpenses(fresh.expenses);
    setActivePage('login');
    showToast('Reset to clean state.', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        business,
        user,
        categories,
        products,
        orders,
        expenses,
        activePage,
        setActivePage,
        selectedPeriod,
        setSelectedPeriod,
        customDateRange,
        setCustomDateRange,
        isAddOrderModalOpen,
        setIsAddOrderModalOpen,
        isAddProductModalOpen,
        setIsAddProductModalOpen,
        isAddCategoryModalOpen,
        setIsAddCategoryModalOpen,
        isAddExpenseModalOpen,
        setIsAddExpenseModalOpen,
        editingOrder,
        setEditingOrder,
        editingProduct,
        setEditingProduct,
        editingCategory,
        setEditingCategory,
        toasts,
        showToast,
        removeToast,
        addOrder,
        updateOrder,
        deleteOrder,
        addProduct,
        updateProduct,
        deleteProduct,
        addCategory,
        updateCategory,
        deleteCategory,
        addExpense,
        deleteExpense,
        updateBusinessProfile,
        loginUser,
        logoutUser,
        resetAllData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
