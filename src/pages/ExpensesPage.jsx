import React, { useState } from 'react';
import { Plus, DollarSign, TrendingUp, TrendingDown, Trash2, Tag, Calendar, Receipt } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatCurrency, formatDate } from '../utils/formatters';

export const ExpensesPage = () => {
  const {
    expenses,
    orders,
    deleteExpense,
    setIsAddExpenseModalOpen,
    business
  } = useApp();

  const [categoryFilter, setCategoryFilter] = useState('All');

  const validOrders = orders.filter((o) => o.orderStatus !== 'Cancelled');
  const totalRevenue = validOrders.reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0);
  const totalActualCost = validOrders.reduce((sum, o) => sum + (Number(o.actualPrice) || 0), 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);

  const grossProfit = totalRevenue - totalActualCost;
  const netProfit = grossProfit - totalExpenses;
  const isNetProfit = netProfit >= 0;
  const profitMargin = totalRevenue > 0 ? Math.round((netProfit / totalRevenue) * 100) : 0;

  // Expense categories breakdown
  const expenseByCategory = {};
  expenses.forEach((e) => {
    expenseByCategory[e.category] = (expenseByCategory[e.category] || 0) + (Number(e.amount) || 0);
  });

  const filteredExpenses = expenses.filter(
    (e) => categoryFilter === 'All' || e.category === categoryFilter
  );

  return (
    <div className="page-container">
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '24px',
          flexWrap: 'wrap',
          gap: '12px'
        }}
      >
        <div>
          <h2>Expenses &amp; Net Profitability</h2>
          <p className="card-subtitle">
            Track business operating costs, product procurement, and final net profit or loss.
          </p>
        </div>

        <button
          className="btn btn-primary btn-sm"
          onClick={() => setIsAddExpenseModalOpen(true)}
          id="add-expense-btn"
        >
          <Plus size={16} />
          <span>Add Expense</span>
        </button>
      </div>

      {/* Financial Summary Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
          marginBottom: '24px'
        }}
      >
        <div className="card" style={{ borderTop: '4px solid #8b5cf6' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
            Total Revenue
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>
            {formatCurrency(totalRevenue, business.currency)}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginTop: '4px' }}>
            From {validOrders.length} sales
          </div>
        </div>

        <div className="card" style={{ borderTop: '4px solid #f59e0b' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
            Actual Product Cost
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#d97706', marginTop: '4px' }}>
            {formatCurrency(totalActualCost, business.currency)}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginTop: '4px' }}>
            Cost of items sold
          </div>
        </div>

        <div className="card" style={{ borderTop: '4px solid #ef4444' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
            Operating Expenses
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#dc2626', marginTop: '4px' }}>
            {formatCurrency(totalExpenses, business.currency)}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginTop: '4px' }}>
            {expenses.length} expense items
          </div>
        </div>

        <div className="card" style={{ borderTop: `4px solid ${isNetProfit ? '#10b981' : '#ef4444'}` }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
            {isNetProfit ? 'Estimated Net Profit' : 'Estimated Net Loss'}
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: isNetProfit ? '#047857' : '#b91c1c', marginTop: '4px' }}>
            {isNetProfit ? `+${formatCurrency(netProfit, business.currency)}` : `-${formatCurrency(Math.abs(netProfit), business.currency)}`}
          </div>
          <div style={{ fontSize: '0.75rem', color: isNetProfit ? 'var(--success-text)' : '#b91c1c', marginTop: '4px' }}>
            {profitMargin}% net margin
          </div>
        </div>
      </div>

      {/* Breakdown by Category */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <h3 className="card-title" style={{ marginBottom: '16px' }}>
          Expense Breakdown by Category
        </h3>
        {Object.keys(expenseByCategory).length === 0 ? (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            No expenses recorded yet. Click "+ Add Expense" to log costs.
          </p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
            {Object.entries(expenseByCategory).map(([cat, amount]) => {
              const pct = totalExpenses > 0 ? Math.round((amount / totalExpenses) * 100) : 0;
              return (
                <div
                  key={cat}
                  style={{
                    background: 'var(--bg-subtle)',
                    padding: '14px',
                    borderRadius: 'var(--radius-md)'
                  }}
                >
                  <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                    {cat}
                  </div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, marginTop: '4px' }}>
                    {formatCurrency(amount, business.currency)}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginTop: '2px' }}>
                    {pct}% of total expenses
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Expenses Table */}
      <div className="card" style={{ padding: 0 }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 className="card-title" style={{ fontSize: '1rem' }}>Expense Log</h3>
          <select
            className="form-control"
            style={{ width: 'auto', minWidth: '160px' }}
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="All">All Expense Types</option>
            {Object.keys(expenseByCategory).map((k) => (
              <option key={k} value={k}>
                {k}
              </option>
            ))}
          </select>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Expense Name / Description</th>
                <th>Category</th>
                <th>Payment Method</th>
                <th>Amount</th>
                <th>Notes</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredExpenses.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '36px', color: 'var(--text-muted)' }}>
                    No expenses logged yet.
                  </td>
                </tr>
              ) : (
                filteredExpenses.map((exp) => (
                  <tr key={exp.id}>
                    <td>{formatDate(exp.date)}</td>
                    <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{exp.name}</td>
                    <td>
                      <span
                        style={{
                          fontSize: '0.74rem',
                          background: 'var(--bg-subtle)',
                          color: 'var(--text-secondary)',
                          padding: '3px 8px',
                          borderRadius: 'var(--radius-sm)',
                          fontWeight: 600
                        }}
                      >
                        {exp.category}
                      </span>
                    </td>
                    <td>{exp.paymentMethod || 'UPI'}</td>
                    <td style={{ fontWeight: 800, color: '#dc2626' }}>
                      {formatCurrency(exp.amount, business.currency)}
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                      {exp.notes || '—'}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        className="btn-soft"
                        style={{ padding: '6px', borderRadius: '6px', color: 'var(--danger-solid)' }}
                        title="Delete Expense"
                        onClick={() => {
                          if (window.confirm(`Delete expense "${exp.name}"?`)) {
                            deleteExpense(exp.id);
                          }
                        }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
