import React from 'react';
import {
  LayoutDashboard,
  PlusCircle,
  ShoppingBag,
  Package,
  Layers,
  BarChart3,
  FileText,
  DollarSign,
  Settings,
  Store,
  LogOut
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Sidebar = () => {
  const {
    activePage,
    setActivePage,
    setIsAddOrderModalOpen,
    orders,
    user,
    logoutUser,
    business
  } = useApp();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'orders', label: 'Orders', icon: ShoppingBag, badge: orders.length > 0 ? orders.length : null },
    { id: 'categories', label: 'Categories', icon: Layers },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'expenses', label: 'Expenses & Profit', icon: DollarSign },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'reports', label: 'Reports & Insights', icon: FileText },
    { id: 'business-setup', label: 'Business Profile', icon: Store },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <aside className="sidebar">
      {/* Brand Header */}
      <div className="sidebar-brand">
        <div className="brand-icon">
          <Package size={22} strokeWidth={2.5} />
        </div>
        <div>
          <div className="brand-title">{business.name || 'Givento.in'}</div>
          <div className="brand-subtitle">{business.tagline || 'Business Analytics'}</div>
        </div>
      </div>

      {/* Quick Action Button */}
      <div style={{ padding: '16px 14px 4px' }}>
        <button
          className="btn btn-primary"
          style={{ width: '100%', padding: '10px 14px', fontSize: '0.85rem' }}
          onClick={() => setIsAddOrderModalOpen(true)}
          id="sidebar-add-order-btn"
        >
          <PlusCircle size={18} />
          <span>Add New Order</span>
        </button>
      </div>

      {/* Nav List */}
      <nav className="sidebar-nav">
        <div className="nav-category-title">Analytics Navigation</div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              className={`nav-item ${isActive ? 'active' : ''}`}
              onClick={() => setActivePage(item.id)}
              id={`nav-${item.id}`}
            >
              <Icon size={19} />
              <span>{item.label}</span>
              {item.badge && <span className="badge">{item.badge}</span>}
            </button>
          );
        })}
      </nav>

      {/* Footer Profile */}
      <div className="sidebar-footer">
        <div className="user-avatar" style={{ background: user.avatarColor || '#7c3aed' }}>
          {user.name ? user.name.charAt(0) : 'U'}
        </div>
        <div className="user-info">
          <div className="user-name">{user.name || 'Store Owner'}</div>
          <div className="user-role">{user.role || 'Admin'}</div>
        </div>
        <button
          onClick={logoutUser}
          title="Sign out"
          style={{ color: 'var(--text-muted)', padding: '6px', borderRadius: '6px' }}
          className="btn-soft"
        >
          <LogOut size={16} />
        </button>
      </div>
    </aside>
  );
};
