import {
  initialBusiness,
  initialUser,
  initialCategories,
  initialProducts,
  initialOrders,
  initialExpenses
} from './initialData';

// Version 2 storage keys ensuring clean state without previous mock data
const STORAGE_KEYS = {
  BUSINESS: 'givento_v2_business',
  USER: 'givento_v2_user',
  CATEGORIES: 'givento_v2_categories',
  PRODUCTS: 'givento_v2_products',
  ORDERS: 'givento_v2_orders',
  EXPENSES: 'givento_v2_expenses'
};

export const loadData = (key, fallback) => {
  try {
    const item = localStorage.getItem(key);
    if (item) {
      return JSON.parse(item);
    }
  } catch (err) {
    console.error(`Error loading ${key} from storage:`, err);
  }
  return fallback;
};

export const saveData = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`Error saving ${key} to storage:`, err);
  }
};

export const getInitialStore = () => {
  const business = loadData(STORAGE_KEYS.BUSINESS, initialBusiness);
  const user = loadData(STORAGE_KEYS.USER, initialUser);
  const categories = loadData(STORAGE_KEYS.CATEGORIES, initialCategories);
  const products = loadData(STORAGE_KEYS.PRODUCTS, initialProducts);
  const orders = loadData(STORAGE_KEYS.ORDERS, initialOrders);
  const expenses = loadData(STORAGE_KEYS.EXPENSES, initialExpenses);

  return { business, user, categories, products, orders, expenses };
};

export const resetStoreToDefault = () => {
  try {
    Object.values(STORAGE_KEYS).forEach((k) => localStorage.removeItem(k));
    // Also clean up old v1 keys if any
    ['givento_business_v1', 'givento_user_v1', 'givento_categories_v1', 'givento_products_v1', 'givento_orders_v1', 'givento_expenses_v1'].forEach((k) => localStorage.removeItem(k));
  } catch (e) {
    console.error('Error clearing localStorage', e);
  }
  return getInitialStore();
};

export const exportStoreAsJSON = () => {
  const data = {
    exportDate: new Date().toISOString(),
    version: '2.0',
    business: loadData(STORAGE_KEYS.BUSINESS, initialBusiness),
    categories: loadData(STORAGE_KEYS.CATEGORIES, initialCategories),
    products: loadData(STORAGE_KEYS.PRODUCTS, initialProducts),
    orders: loadData(STORAGE_KEYS.ORDERS, []),
    expenses: loadData(STORAGE_KEYS.EXPENSES, [])
  };
  return JSON.stringify(data, null, 2);
};

export { STORAGE_KEYS };
