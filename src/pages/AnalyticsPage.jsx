import React, { useState } from 'react';
import {
  TrendingUp,
  BarChart3,
  PieChart,
  ShoppingBag,
  Award,
  Layers,
  Calendar,
  IndianRupee,
  Package,
  Receipt,
  Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { LineAreaChart } from '../components/charts/LineAreaChart';
import { BarChart } from '../components/charts/BarChart';
import { DonutChart } from '../components/charts/DonutChart';
import {
  filterOrdersByPeriod,
  calculateDashboardMetrics,
  getRevenueTrend
} from '../utils/calculations';
import { formatCurrency, formatNumber } from '../utils/formatters';

export const AnalyticsPage = () => {
  const {
    orders,
    expenses,
    products,
    business,
    selectedPeriod,
    customDateRange
  } = useApp();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'revenue' | 'categories' | 'products'
  const [trendTimeframe, setTrendTimeframe] = useState('Weekly');
  const [categoryMetric, setCategoryMetric] = useState('revenue'); // 'revenue' | 'profit' | 'orders'

  const filteredOrders = filterOrdersByPeriod(
    orders,
    selectedPeriod,
    customDateRange.start,
    customDateRange.end
  );

  const metrics = calculateDashboardMetrics(filteredOrders, expenses, products);
  const trendData = getRevenueTrend(filteredOrders, trendTimeframe);

  return (
    <div className="page-container">
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '20px',
          flexWrap: 'wrap',
          gap: '12px'
        }}
      >
        <div>
          <h2>Business &amp; Profit Analytics</h2>
          <p className="card-subtitle">
            Sales trends, profit margin breakdowns, and product profitability rankings.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="pill-group">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'revenue', label: 'Revenue Trends' },
            { id: 'categories', label: 'Category Analysis' },
            { id: 'products', label: 'Product Profitability' }
          ].map((tab) => (
            <button
              key={tab.id}
              className={`pill-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Top Statistics Bar */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '14px',
          marginBottom: '24px'
        }}
      >
        <div className="card" style={{ padding: '16px' }}>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
            Total Revenue
          </div>
          <div style={{ fontSize: '1.45rem', fontWeight: 800, marginTop: '4px' }}>
            {formatCurrency(metrics.totalRevenue, business.currency)}
          </div>
        </div>

        <div className="card" style={{ padding: '16px' }}>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
            Actual Product Cost
          </div>
          <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#d97706', marginTop: '4px' }}>
            {formatCurrency(metrics.totalActualCost, business.currency)}
          </div>
        </div>

        <div className="card" style={{ padding: '16px' }}>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
            Estimated Net Profit
          </div>
          <div style={{ fontSize: '1.45rem', fontWeight: 800, color: metrics.estimatedProfit >= 0 ? '#047857' : '#dc2626', marginTop: '4px' }}>
            {metrics.estimatedProfit >= 0 ? `+${formatCurrency(metrics.estimatedProfit, business.currency)}` : `-${formatCurrency(Math.abs(metrics.estimatedProfit), business.currency)}`}
          </div>
        </div>

        <div className="card" style={{ padding: '16px' }}>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
            Net Profit Margin
          </div>
          <div style={{ fontSize: '1.45rem', fontWeight: 800, marginTop: '4px' }}>
            {metrics.profitMargin}%
          </div>
        </div>
      </div>

      {/* TAB 1: OVERVIEW & REVENUE */}
      {(activeTab === 'overview' || activeTab === 'revenue') && (
        <div className="card" style={{ marginBottom: '24px' }}>
          <div className="card-header">
            <div>
              <h3 className="card-title">Revenue Trajectory</h3>
              <p className="card-subtitle">Interactive sales progression</p>
            </div>
            <div className="pill-group">
              {['Daily', 'Weekly', 'Monthly', 'Yearly'].map((tf) => (
                <button
                  key={tf}
                  className={`pill-btn ${trendTimeframe === tf ? 'active' : ''}`}
                  onClick={() => setTrendTimeframe(tf)}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>

          <LineAreaChart
            data={trendData}
            currency={business.currency}
            height={260}
          />
        </div>
      )}

      {/* TAB 2: CATEGORY ANALYSIS */}
      {(activeTab === 'overview' || activeTab === 'categories') && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
            gap: '20px',
            marginBottom: '24px'
          }}
        >
          {/* Category Bar Chart */}
          <div className="card">
            <div className="card-header">
              <div>
                <h3 className="card-title">Category Performance</h3>
                <p className="card-subtitle">Switch metric to compare</p>
              </div>

              {/* Metric switcher: Revenue | Profit | Orders */}
              <div className="pill-group">
                {[
                  { id: 'revenue', label: 'Revenue' },
                  { id: 'profit', label: 'Profit' },
                  { id: 'orders', label: 'Orders' }
                ].map((m) => (
                  <button
                    key={m.id}
                    className={`pill-btn ${categoryMetric === m.id ? 'active' : ''}`}
                    onClick={() => setCategoryMetric(m.id)}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            <BarChart
              data={metrics.categoryList}
              metric={categoryMetric}
              currency={business.currency}
              maxItems={6}
            />
          </div>

          {/* Category Share Donut */}
          <div className="card">
            <div className="card-header">
              <div>
                <h3 className="card-title">Sales Share Distribution</h3>
                <p className="card-subtitle">Share of total store performance</p>
              </div>
            </div>

            <DonutChart
              data={metrics.categoryList}
              metric={categoryMetric}
              currency={business.currency}
              size={200}
            />
          </div>
        </div>
      )}

      {/* Category Performance Table */}
      {(activeTab === 'categories' || activeTab === 'overview') && (
        <div className="card" style={{ padding: 0, marginBottom: '24px' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-color)' }}>
            <h3 className="card-title" style={{ fontSize: '1rem' }}>
              Category Profitability Breakdown
            </h3>
          </div>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Orders</th>
                  <th>Total Revenue</th>
                  <th>Actual Cost</th>
                  <th>Category Profit</th>
                </tr>
              </thead>
              <tbody>
                {metrics.categoryList.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>
                      No category data available yet.
                    </td>
                  </tr>
                ) : (
                  metrics.categoryList.map((cat) => {
                    const isProf = (cat.profit || 0) >= 0;

                    return (
                      <tr key={cat.categoryId || cat.categoryName}>
                        <td style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                          {cat.categoryName}
                        </td>
                        <td>{cat.orders}</td>
                        <td style={{ fontWeight: 800, color: 'var(--primary-700)' }}>
                          {formatCurrency(cat.revenue, business.currency)}
                        </td>
                        <td style={{ color: 'var(--text-muted)' }}>
                          {formatCurrency(cat.actualCost || 0, business.currency)}
                        </td>
                        <td style={{ fontWeight: 800, color: isProf ? '#047857' : '#b91c1c' }}>
                          {isProf ? `+${formatCurrency(cat.profit, business.currency)}` : `-${formatCurrency(Math.abs(cat.profit), business.currency)}`}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: PRODUCT PROFITABILITY */}
      {(activeTab === 'products' || activeTab === 'overview') && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
            gap: '20px',
            marginBottom: '24px'
          }}
        >
          {/* Highest Revenue Products */}
          <div className="card">
            <div className="card-header">
              <div>
                <h3 className="card-title">Top Revenue Products</h3>
                <p className="card-subtitle">Highest gross sales contributors</p>
              </div>
            </div>

            {metrics.topProductsByRevenue.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', padding: '20px 0' }}>
                No product sales recorded yet.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {metrics.topProductsByRevenue.slice(0, 6).map((prod, idx) => (
                  <div
                    key={prod.name}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-md)',
                      background: idx === 0 ? 'var(--primary-50)' : 'var(--bg-subtle)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span
                        style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          background: idx === 0 ? 'var(--primary-600)' : 'var(--border-color)',
                          color: idx === 0 ? 'white' : 'var(--text-secondary)',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        {idx + 1}
                      </span>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>{prod.name}</div>
                        <div style={{ fontSize: '0.74rem', color: 'var(--text-light)' }}>
                          {prod.category}
                        </div>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--primary-700)' }}>
                        {formatCurrency(prod.revenue, business.currency)}
                      </div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                        {prod.orderCount} sales
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Highest Profit Products */}
          <div className="card">
            <div className="card-header">
              <div>
                <h3 className="card-title">Most Profitable Products</h3>
                <p className="card-subtitle">Highest net profit generated (Revenue − Cost)</p>
              </div>
            </div>

            {metrics.topProductsByProfit.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', padding: '20px 0' }}>
                No product profit data yet.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {metrics.topProductsByProfit.slice(0, 6).map((prod, idx) => {
                  const isProf = (prod.profit || 0) >= 0;

                  return (
                    <div
                      key={prod.name}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '10px 14px',
                        borderRadius: 'var(--radius-md)',
                        background: idx === 0 ? '#ecfdf5' : 'var(--bg-subtle)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span
                          style={{
                            width: '24px',
                            height: '24px',
                            borderRadius: '50%',
                            background: idx === 0 ? '#059669' : 'var(--border-color)',
                            color: idx === 0 ? 'white' : 'var(--text-secondary)',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          {idx + 1}
                        </span>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>{prod.name}</div>
                          <div style={{ fontSize: '0.74rem', color: 'var(--text-light)' }}>
                            {prod.category}
                          </div>
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: 800, fontSize: '0.95rem', color: isProf ? '#047857' : '#b91c1c' }}>
                          {isProf ? `+${formatCurrency(prod.profit, business.currency)}` : `-${formatCurrency(Math.abs(prod.profit), business.currency)}`}
                        </div>
                        <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                          Cost: {formatCurrency(prod.actualCost, business.currency)}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
