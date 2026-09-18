import React, { useState } from 'react';
import { X, Check } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AddExpenseModal = () => {
  const {
    isAddExpenseModalOpen,
    setIsAddExpenseModalOpen,
    addExpense
  } = useApp();

  const expenseCategories = [
    'Product Purchase',
    'Packaging',
    'Delivery / Shipping',
    'Marketing / Ads',
    'Travel',
    'Rent & Utilities',
    'Other'
  ];

  const initialForm = {
    name: '',
    category: 'Product Purchase',
    amount: '',
    date: '2026-09-18',
    paymentMethod: 'UPI',
    notes: ''
  };

  const [form, setForm] = useState(initialForm);

  if (!isAddExpenseModalOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.amount) {
      alert('Please fill in expense title and amount.');
      return;
    }

    addExpense({
      ...form,
      amount: Number(form.amount)
    });

    setIsAddExpenseModalOpen(false);
    setForm(initialForm);
  };

  return (
    <div className="modal-overlay" onClick={() => setIsAddExpenseModalOpen(false)}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h3 className="card-title">Log Business Expense</h3>
            <p className="card-subtitle">
              Record business costs to calculate accurate net profit margins.
            </p>
          </div>
          <button
            onClick={() => setIsAddExpenseModalOpen(false)}
            className="btn-soft"
            style={{ padding: '6px' }}
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">
                Expense Title / Description <span className="req">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Bulk Velvet Boxes, Instagram Ads, Delhi Wholesale"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Category</label>
                <select
                  className="form-control"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                >
                  {expenseCategories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">
                  Amount (₹) <span className="req">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  className="form-control"
                  placeholder="e.g. 2500"
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Payment Method</label>
                <select
                  className="form-control"
                  value={form.paymentMethod}
                  onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}
                >
                  <option value="UPI">UPI</option>
                  <option value="NetBanking">NetBanking</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="Cash">Cash</option>
                </select>
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Notes (Optional)</label>
              <input
                type="text"
                className="form-control"
                placeholder="Vendor details or invoice reference"
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setIsAddExpenseModalOpen(false)}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <Check size={16} />
              <span>Record Expense</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
