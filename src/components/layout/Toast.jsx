import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ToastContainer = () => {
  const { toasts, removeToast } = useApp();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';
        const isInfo = toast.type === 'info';

        return (
          <div key={toast.id} className={`toast ${toast.type}`}>
            {isSuccess && <CheckCircle2 size={18} />}
            {isError && <AlertCircle size={18} />}
            {isInfo && <Info size={18} />}
            <span style={{ flex: 1 }}>{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              style={{ color: 'white', opacity: 0.8 }}
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
};
