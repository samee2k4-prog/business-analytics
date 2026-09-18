import React, { useState } from 'react';
import {
  Printer,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Award,
  Calendar,
  Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { calculateDashboardMetrics } from '../utils/calculations';
import { generateBusinessInsights } from '../utils/insightsEngine';
import { formatCurrency } from '../utils/formatters';

export const ReportsPage = () => {
  const { orders, expenses, products, business } = useApp();
  const [selectedMonth, setSelectedMonth] = useState('Current Period');

  const metrics = calculateDashboardMetrics(orders, expenses, products);
  const insights = generateBusinessInsights({ metrics });
  const isNetProfit = metrics.estimatedProfit >= 0;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="page-container" style={{ maxWidth: '1080px' }}>
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
          <h2>Executive Business &amp; Profit Reports</h2>
          <p className="card-subtitle">
            Sales overview, cost structure, and net profit report.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <select
            className="form-control"
            style={{ width: 'auto', minWidth: '170px' }}
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            <option value="Current Period">Current Period</option>
            <option value="This Month">This Month</option>
            <option value="Last 30 Days">Last 30 Days</option>
            <option value="All Time">All Time</option>
          </select>

          <button className="btn btn-secondary btn-sm" onClick={handlePrint}>
            <Printer size={15} />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Printable Report Sheet */}
      <div className="card" style={{ padding: '36px', marginBottom: '24px' }}>
        {/* Report Top Branding */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            borderBottom: '2px solid var(--border-color)',
            paddingBottom: '20px',
            marginBottom: '24px'
          }}
        >
          <div>
            <h1 style={{ fontSize: '1.6rem', color: 'var(--text-primary)' }}>
              {business.name || 'Givento.in'}
            </h1>
            <p style={{ color: 'var(--primary-700)', fontWeight: 600, fontSize: '0.9rem' }}>
              Business Profitability &amp; Analytics Report • {selectedMonth}
            </p>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Generated on {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span
              style={{
                background: isNetProfit ? '#ecfdf5' : '#fef2f2',
                color: isNetProfit ? '#047857' : '#b91c1c',
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                fontWeight: 700,
                fontSize: '0.84rem'
              }}
            >
              {isNetProfit ? `Net Profit: +${formatCurrency(metrics.estimatedProfit, business.currency)}` : `Net Deficit: -${formatCurrency(Math.abs(metrics.estimatedProfit), business.currency)}`}
            </span>
          </div>
        </div>

        {/* Executive Summary Cards */}
        <h3 style={{ fontSize: '1.1rem', marginBottom: '16px' }}>Financial Summary</h3>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '14px',
            marginBottom: '28px'
          }}
        >
          <div style={{ background: 'var(--bg-subtle)', padding: '16px', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
              Orders Placed
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, marginTop: '2px' }}>
              {metrics.totalOrders}
            </div>
          </div>

          <div style={{ background: 'var(--bg-subtle)', padding: '16px', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
              Total Revenue
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, marginTop: '2px', color: 'var(--primary-700)' }}>
              {formatCurrency(metrics.totalRevenue, business.currency)}
            </div>
          </div>

          <div style={{ background: 'var(--bg-subtle)', padding: '16px', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
              Actual Product Cost
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, marginTop: '2px', color: '#d97706' }}>
              {formatCurrency(metrics.totalActualCost, business.currency)}
            </div>
          </div>

          <div style={{ background: 'var(--bg-subtle)', padding: '16px', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
              Operating Expenses
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, marginTop: '2px', color: '#dc2626' }}>
              {formatCurrency(metrics.totalExpenses, business.currency)}
            </div>
          </div>

          <div style={{ background: isNetProfit ? '#ecfdf5' : '#fef2f2', padding: '16px', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: '0.74rem', color: isNetProfit ? '#047857' : '#b91c1c', fontWeight: 700, textTransform: 'uppercase' }}>
              Estimated Net Profit
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, marginTop: '2px', color: isNetProfit ? '#047857' : '#b91c1c' }}>
              {isNetProfit ? `+${formatCurrency(metrics.estimatedProfit, business.currency)}` : `-${formatCurrency(Math.abs(metrics.estimatedProfit), business.currency)}`}
            </div>
          </div>
        </div>

        {/* Top Product & Category Spotlight */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '16px',
            marginBottom: '32px'
          }}
        >
          <div style={{ border: '1px solid var(--border-color)', padding: '16px', borderRadius: 'var(--radius-md)' }}>
            <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
              Top Revenue Category
            </span>
            <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--primary-700)', marginTop: '4px' }}>
              🏆 {metrics.bestCategory}
            </div>
          </div>

          <div style={{ border: '1px solid var(--border-color)', padding: '16px', borderRadius: 'var(--radius-md)' }}>
            <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
              Top Revenue Product
            </span>
            <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>
              ⭐ {metrics.bestProduct}
            </div>
          </div>
        </div>

        {/* Automated Business Insights */}
        <h3 style={{ fontSize: '1.1rem', marginBottom: '16px' }}>
          Executive Insights &amp; Takeaways
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {insights.map((ins) => (
            <div
              key={ins.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-subtle)',
                border: '1px solid var(--border-subtle)'
              }}
            >
              <span style={{ fontSize: '1.2rem' }}>{ins.icon}</span>
              <span style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                {ins.text}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
