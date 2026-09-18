import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { ToastContainer } from './components/layout/Toast';

// Pages
import { LoginPage } from './pages/LoginPage';
import { BusinessSetupPage } from './pages/BusinessSetupPage';
import { DashboardPage } from './pages/DashboardPage';
import { OrdersPage } from './pages/OrdersPage';
import { ProductsPage } from './pages/ProductsPage';
import { CategoriesPage } from './pages/CategoriesPage';
import { ExpensesPage } from './pages/ExpensesPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { ReportsPage } from './pages/ReportsPage';
import { SettingsPage } from './pages/SettingsPage';

// Modals
import { AddOrderModal } from './components/modals/AddOrderModal';
import { AddProductModal } from './components/modals/AddProductModal';
import { AddCategoryModal } from './components/modals/AddCategoryModal';
import { AddExpenseModal } from './components/modals/AddExpenseModal';

const MainApp = () => {
  const { user, activePage } = useApp();

  // If user is not logged in or activePage is 'login', show LoginPage
  if (!user || !user.isLoggedIn || activePage === 'login') {
    return (
      <>
        <LoginPage />
        <ToastContainer />
      </>
    );
  }

  return (
    <div className="app-layout">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="main-content">
        <Header />

        <main>
          {activePage === 'dashboard' && <DashboardPage />}
          {activePage === 'orders' && <OrdersPage />}
          {activePage === 'products' && <ProductsPage />}
          {activePage === 'categories' && <CategoriesPage />}
          {activePage === 'expenses' && <ExpensesPage />}
          {activePage === 'analytics' && <AnalyticsPage />}
          {activePage === 'reports' && <ReportsPage />}
          {activePage === 'business-setup' && <BusinessSetupPage />}
          {activePage === 'settings' && <SettingsPage />}
        </main>
      </div>

      {/* Global Modals */}
      <AddOrderModal />
      <AddProductModal />
      <AddCategoryModal />
      <AddExpenseModal />

      {/* Toast Notification Container */}
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
