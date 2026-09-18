import React, { useState } from 'react';
import { Store, Check, ArrowRight, Sparkles, MapPin, DollarSign, Mail, Phone } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const BusinessSetupPage = () => {
  const { business, updateBusinessProfile, setActivePage } = useApp();

  const [form, setForm] = useState({
    name: business.name || 'Givento.in',
    subtitle: business.subtitle || 'Handmade & Handpicked Gifts',
    tagline: business.tagline || 'Track • Analyze • Grow',
    currency: business.currency || '₹',
    category: business.category || 'Gifts & Lifestyle',
    location: business.location || 'Bengaluru, India',
    phone: business.phone || '',
    email: business.email || ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      alert('Please enter your business name.');
      return;
    }
    updateBusinessProfile({ ...form, setupCompleted: true });
    setActivePage('dashboard');
  };

  return (
    <div className="page-container" style={{ maxWidth: '780px', marginTop: '16px' }}>
      {/* Step Progress Pill */}
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: 'white',
          padding: '6px 16px',
          borderRadius: 'var(--radius-full)',
          marginBottom: '20px',
          fontSize: '0.82rem',
          fontWeight: 600,
          color: 'var(--primary-700)',
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-xs)'
        }}
      >
        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} />
        <span>Step 2 of 2: Customise Your Business Account</span>
      </div>

      <div className="card" style={{ padding: '36px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '24px' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #7c3aed, #8b5cf6)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Store size={24} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.45rem' }}>Customise Your Business Account</h2>
            <p className="card-subtitle">
              Set up your business name, currency, and categories before starting dashboard analysis.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">
                Business Name <span className="req">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Givento.in"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Subtitle / Tagline</label>
              <input
                type="text"
                className="form-control"
                value={form.subtitle}
                onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                placeholder="e.g. Handmade & Handpicked Gifts"
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
              <label className="form-label">Primary Business Category</label>
              <select
                className="form-control"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                <option value="Gifts & Lifestyle">Gifts & Lifestyle</option>
                <option value="Handmade Jewellery">Handmade Jewellery</option>
                <option value="Accessories & Hampers">Accessories & Hampers</option>
                <option value="Fashion & Apparel">Fashion & Apparel</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Business Location (Optional)</label>
              <input
                type="text"
                className="form-control"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                placeholder="e.g. Bengaluru, India"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Business Email (Optional)</label>
              <input
                type="email"
                className="form-control"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="contact@givento.in"
              />
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '12px',
              marginTop: '28px',
              borderTop: '1px solid var(--border-color)',
              paddingTop: '20px'
            }}
          >
            <button
              type="submit"
              className="btn btn-primary btn-lg"
              id="save-business-profile-btn"
            >
              <Check size={18} />
              <span>Save & Launch Dashboard</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
