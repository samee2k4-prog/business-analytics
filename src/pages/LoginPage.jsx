import React, { useState } from 'react';
import { Package, Mail, Lock, User, ArrowRight, Check, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const LoginPage = () => {
  const { loginUser } = useApp();
  // Default to Create Account first as requested
  const [isSignUp, setIsSignUp] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Google Modal State (in-app elegant dialog, no browser prompts!)
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);
  const [googleCustomEmail, setGoogleCustomEmail] = useState('');
  const [googleCustomName, setGoogleCustomName] = useState('');

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      alert('Please enter your email and password.');
      return;
    }

    loginUser({
      id: 'usr_' + Date.now(),
      name: isSignUp ? (name.trim() || 'Store Owner') : (email.split('@')[0] || 'Store Owner'),
      email: email.trim(),
      role: 'Owner & Founder',
      avatarColor: '#7c3aed'
    });
  };

  const handleGoogleSelect = (gName, gEmail) => {
    loginUser({
      id: 'usr_google_' + Date.now(),
      name: gName,
      email: gEmail,
      role: 'Owner & Founder',
      avatarColor: '#4285f4'
    });
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 50%, #fdf4ff 100%)',
        padding: '20px'
      }}
    >
      {/* Brand Top Header */}
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <div
          style={{
            width: '52px',
            height: '52px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 10px',
            boxShadow: '0 8px 20px rgba(124, 58, 237, 0.28)'
          }}
        >
          <Package size={26} strokeWidth={2.5} />
        </div>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)' }}>
          Givento.in
        </h1>
        <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
          Business Analytics &amp; Profit Tracking
        </p>
      </div>

      {/* Auth Card */}
      <div
        style={{
          width: '100%',
          maxWidth: '420px',
          background: '#ffffff',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-xl)',
          padding: '32px 28px'
        }}
      >
        {/* Toggle Tabs: Create Account (First) vs Log In */}
        <div
          style={{
            display: 'flex',
            background: 'var(--bg-subtle)',
            padding: '4px',
            borderRadius: 'var(--radius-md)',
            marginBottom: '22px'
          }}
        >
          <button
            type="button"
            className={`pill-btn ${isSignUp ? 'active' : ''}`}
            style={{ flex: 1, textAlign: 'center', padding: '8px 12px' }}
            onClick={() => setIsSignUp(true)}
          >
            Create Account
          </button>
          <button
            type="button"
            className={`pill-btn ${!isSignUp ? 'active' : ''}`}
            style={{ flex: 1, textAlign: 'center', padding: '8px 12px' }}
            onClick={() => setIsSignUp(false)}
          >
            Log In
          </button>
        </div>

        {/* Continue with Google Button */}
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => setIsGoogleModalOpen(true)}
          id="google-signin-btn"
          style={{
            width: '100%',
            padding: '11px',
            fontSize: '0.9rem',
            marginBottom: '18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            fontWeight: 600
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.16 0 9.97 0 12s.45 3.84 1.25 5.42l4.03-3.15z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
            />
          </svg>
          <span>Continue with Google</span>
        </button>

        {/* Divider */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '18px',
            color: 'var(--text-light)',
            fontSize: '0.76rem',
            textTransform: 'uppercase',
            fontWeight: 600
          }}
        >
          <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }} />
          <span>or continue with email</span>
          <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }} />
        </div>

        {/* Form */}
        <form onSubmit={handleFormSubmit}>
          {isSignUp && (
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <div className="input-with-icon">
                <User size={16} className="icon" />
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Sameeha Mubarak"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div className="input-with-icon">
              <Mail size={16} className="icon" />
              <input
                type="email"
                className="form-control"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <label className="form-label" style={{ marginBottom: 0 }}>Password</label>
              {!isSignUp && (
                <button
                  type="button"
                  onClick={() => alert('Password reset link will be sent to your email.')}
                  style={{ fontSize: '0.76rem', color: 'var(--primary-600)', fontWeight: 600 }}
                >
                  Forgot password?
                </button>
              )}
            </div>
            <div className="input-with-icon">
              <Lock size={16} className="icon" />
              <input
                type="password"
                className="form-control"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '12px', fontSize: '0.92rem', marginTop: '6px' }}
            id="auth-submit-btn"
          >
            <span>{isSignUp ? 'Create Account & Continue' : 'Log In & Continue'}</span>
            <ArrowRight size={16} />
          </button>
        </form>

        {/* Footer Toggle text */}
        <div style={{ textAlign: 'center', marginTop: '18px', fontSize: '0.82rem' }}>
          <span style={{ color: 'var(--text-muted)' }}>
            {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
          </span>
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            style={{ color: 'var(--primary-700)', fontWeight: 700 }}
          >
            {isSignUp ? 'Log in' : 'Create account'}
          </button>
        </div>
      </div>

      {/* Sleek In-App Google Account Selection Dialog (No browser prompts!) */}
      {isGoogleModalOpen && (
        <div className="modal-overlay" onClick={() => setIsGoogleModalOpen(false)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '400px', padding: '24px' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.16 0 9.97 0 12s.45 3.84 1.25 5.42l4.03-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                  />
                </svg>
                <h3 style={{ fontSize: '1.05rem', margin: 0 }}>Sign in with Google</h3>
              </div>
              <button
                className="btn-soft"
                style={{ padding: '4px' }}
                onClick={() => setIsGoogleModalOpen(false)}
              >
                <X size={16} />
              </button>
            </div>

            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
              Choose an account to continue to Givento.in Analytics:
            </p>

            {/* Account Option 1: Fast 1-click */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                cursor: 'pointer',
                marginBottom: '10px',
                transition: 'background 0.15s ease'
              }}
              className="btn-soft"
              onClick={() => {
                setIsGoogleModalOpen(false);
                handleGoogleSelect('Sameeha Mubarak', 'sameeha@givento.in');
              }}
            >
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700
                }}
              >
                S
              </div>
              <div style={{ textAlign: 'left', flex: 1 }}>
                <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Sameeha Mubarak
                </div>
                <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                  sameeha@givento.in
                </div>
              </div>
              <Check size={16} style={{ color: 'var(--primary-600)' }} />
            </div>

            {/* Account Option 2: Custom Google Account */}
            <div
              style={{
                background: 'var(--bg-subtle)',
                padding: '12px',
                borderRadius: 'var(--radius-md)',
                marginTop: '12px'
              }}
            >
              <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                Or use another Google email:
              </div>
              <input
                type="email"
                className="form-control"
                placeholder="your.google.account@gmail.com"
                value={googleCustomEmail}
                onChange={(e) => setGoogleCustomEmail(e.target.value)}
                style={{ marginBottom: '8px', fontSize: '0.85rem' }}
              />
              <button
                type="button"
                className="btn btn-primary btn-sm"
                style={{ width: '100%' }}
                onClick={() => {
                  if (!googleCustomEmail) {
                    alert('Please enter your email.');
                    return;
                  }
                  setIsGoogleModalOpen(false);
                  const namePart = googleCustomEmail.split('@')[0];
                  handleGoogleSelect(namePart, googleCustomEmail);
                }}
              >
                Continue with this account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
