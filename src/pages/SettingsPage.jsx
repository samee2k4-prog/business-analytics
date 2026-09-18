import React, { useState } from 'react';
import {
  Settings,
  Download,
  Upload,
  RotateCcw,
  Store,
  Shield,
  Check,
  AlertTriangle,
  Info
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { exportStoreAsJSON } from '../data/storage';

export const SettingsPage = () => {
  const {
    business,
    updateBusinessProfile,
    resetAllData,
    showToast,
    orders,
    products,
    categories,
    expenses
  } = useApp();

  const [form, setForm] = useState({
    name: business.name || 'Givento.in',
    subtitle: business.subtitle || 'Handmade & Handpicked Gifts',
    tagline: business.tagline || 'Track • Analyze • Grow',
    currency: business.currency || '₹',
    category: business.category || 'Gifts & Lifestyle',
    location: business.location || 'Bengaluru, India',
    phone: business.phone || '+91 98765 43210',
    email: business.email || 'hello@givento.in'
  });

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateBusinessProfile(form);
  };

  const handleExportJSON = () => {
    const jsonString = exportStoreAsJSON();
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Givento_Store_Backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Full store backup exported successfully.', 'success');
  };

  const handleResetData = () => {
    if (
      window.confirm(
        'Are you sure you want to reset all data back to the Givento.in demo dataset? This will restore sample orders, categories, and products.'
      )
    ) {
      resetAllData();
    }
  };

  return (
    <div className="page-container" style={{ maxWidth: '840px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h2>Store Settings & System Management</h2>
        <p className="card-subtitle">
          Manage store information, export backups, or restore seed datasets.
        </p>
      </div>

      {/* Profile Settings */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <h3 className="card-title" style={{ marginBottom: '16px' }}>
          Business Profile
        </h3>

        <form onSubmit={handleSaveProfile}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Store Name</label>
              <input
                type="text"
                className="form-control"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Store Subtitle</label>
              <input
                type="text"
                className="form-control"
                value={form.subtitle}
                onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Currency</label>
              <select
                className="form-control"
                value={form.currency}
                onChange={(e) => setForm({ ...form, currency: e.target.value })}
              >
                <option value="₹">INR (₹)</option>
                <option value="$">USD ($)</option>
                <option value="€">EUR (€)</option>
                <option value="£">GBP (£)</option>
                <option value="AED">AED (AED)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Location</label>
              <input
                type="text"
                className="form-control"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }}>
            <button type="submit" className="btn btn-primary btn-sm">
              <Check size={15} />
              <span>Save Profile Changes</span>
            </button>
          </div>
        </form>
      </div>

      {/* Data Management & Backup */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <h3 className="card-title" style={{ marginBottom: '12px' }}>
          Data Backup & Export
        </h3>
        <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginBottom: '18px' }}>
          Export your complete business database (including all {orders.length} orders, {products.length} products, {categories.length} categories, and {expenses.length} expenses) as a portable JSON file.
        </p>

        <button className="btn btn-secondary btn-sm" onClick={handleExportJSON}>
          <Download size={15} />
          <span>Export Store Database (JSON)</span>
        </button>
      </div>

      {/* Danger Zone / Reset */}
      <div className="card" style={{ border: '1px solid #fecaca', background: '#fffafa' }}>
        <h3 className="card-title" style={{ color: '#b91c1c', marginBottom: '8px' }}>
          Reset Demo Data
        </h3>
        <p style={{ fontSize: '0.84rem', color: '#7f1d1d', marginBottom: '16px' }}>
          Need a fresh start? Reset all orders, stock quantities, and expenses back to the official Givento.in seed state (127 orders, ₹45,850 revenue, SS Jewellery catalog).
        </p>

        <button
          className="btn btn-danger btn-sm"
          onClick={handleResetData}
          id="reset-demo-data-btn"
        >
          <RotateCcw size={15} />
          <span>Reset All Data to Demo Defaults</span>
        </button>
      </div>
    </div>
  );
};
