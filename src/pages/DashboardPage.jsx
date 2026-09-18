import React, { useState } from 'react';
import {
  IndianRupee,
  ShoppingBag,
  TrendingUp,
  TrendingDown,
  Award,
  Sparkles,
  ArrowRight,
  Plus,
  DollarSign,
  Receipt
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MetricCard } from '../components/common/MetricCard';
import { LineAreaChart } from '../components/charts/LineAreaChart';
import { BarChart } from '../components/charts/BarChart';
import {
  filterOrdersByPeriod,
  calculateDashboardMetrics,
  getRevenueTrend
} from '../utils/calculations';
import { generateBusinessInsights } from '../utils/insightsEngine';
import { formatCurrency, formatDate } from '../utils/formatters';

export const DashboardPage = () => {
  const {
    orders,
    expenses,
    products,
    business,
    selectedPeriod,
    customDateRange,
    setIsAddOrderModalOpen,
    setActivePage,
    setEditingOrder
  } = useApp();

  const [trendTimeframe, setTrendTimeframe] = useState('Weekly');

  const filteredOrders = filterOrdersByPeriod(
    orders,
    selectedPeriod,
    customDateRange.start,
    customDateRange.end
  );

  const metrics = calculateDashboardMetrics(filteredOrders, expenses, products);
  const trendData = getRevenueTrend(filteredOrders, trendTimeframe);
  const insights = generateBusinessInsights({ metrics });

  const recentOrders = filteredOrders.slice(0, 6);
  const isNetProfitPositive = metrics.estimatedProfit >= 0;

  return (
    <div className="page-container">
      {/* Dynamic Business Insights AI Banner */}
      <div className="insights-banner">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.4rem' }}>🧠</span>
            <h3 style={{ fontSize: '1.2rem', color: 'white' }}>
              Business Intelligence &amp; Profit Analysis
            </h3>
          </div>
          <span
            style={{
              fontSize: '0.74rem',
              background: 'rgba(255, 255, 255, 0.2)',
              padding: '4px 10px',
              borderRadius: 'var(--radius-full)',
              fontWeight: 700
            }}
          >
            Live Profit Calculations
          </span>
        </div>

        <div className="insights-grid">
          {insights.map((ins) => (
            <div key={ins.id} className="insight-item">
              <span className="insight-icon">{ins.icon}</span>
              <div className="insight-text">{ins.text}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Empty State Callout when user starts fresh */}
      {orders.length === 0 && (
        <div
          className="card"
          style={{
            marginBottom: '24px',
            background: 'linear-gradient(135deg, #f5f3ff, #faf5ff)',
            border: '1.5px dashed var(--primary-400)',
            textAlign: 'center',
            padding: '32px 20px'
          }}
        >
          <div style={{ fontSize: '2.4rem', marginBottom: '8px' }}>📦</div>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '6px' }}>Ready for Your First Sale!</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '520px', margin: '0 auto 18px' }}>
            Enter your product sales with Selling Price and Actual Cost to automatically track your real profit or loss.
          </p>
          <button
            className="btn btn-primary"
            onClick={() => setIsAddOrderModalOpen(true)}
            id="dashboard-first-order-btn"
          >
            <Plus size={18} />
            <span>Add Your First Order</span>
          </button>
        </div>
      )}

      {/* Top KPI Metric Cards Grid */}
      <div className="metric-grid">
        <MetricCard
          label="Total Revenue"
          value={formatCurrency(metrics.totalRevenue, business.currency)}
          growthText="gross sales"
          icon={IndianRupee}
          accent="purple"
        />
        <MetricCard
          label="Total Orders"
          value={metrics.totalOrders}
          growthText="sales placed"
          icon={ShoppingBag}
          accent="cyan"
        />
        <MetricCard
          label="Actual Product Cost"
          value={formatCurrency(metrics.totalActualCost, business.currency)}
          growthText="total cost of items"
          icon={Receipt}
          accent="amber"
        />
        <MetricCard
          label="Avg. Order Value"
          value={formatCurrency(metrics.averageOrderValue, business.currency)}
          growthText="per order"
          icon={TrendingUp}
          accent="purple"
        />
        <MetricCard
          label="Total Expenses"
          value={formatCurrency(metrics.totalExpenses, business.currency)}
          growthText="operating costs"
          icon={DollarSign}
          accent="rose"
        />
        <MetricCard
          label={isNetProfitPositive ? 'Estimated Profit' : 'Estimated Loss'}
          value={
            isNetProfitPositive
              ? `+${formatCurrency(metrics.estimatedProfit, business.currency)}`
              : `-${formatCurrency(Math.abs(metrics.estimatedProfit), business.currency)}`
          }
          growthText={isNetProfitPositive ? `${metrics.profitMargin}% net margin` : 'deficit'}
          icon={isNetProfitPositive ? Sparkles : TrendingDown}
          accent={isNetProfitPositive ? 'green' : 'rose'}
        />
      </div>

      {/* Category & Product Highlights */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '16px',
          marginBottom: '24px'
        }}
      >
        <div
          className="card"
          style={{
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            background: 'linear-gradient(135deg, #ffffff, #faf5ff)'
          }}
        >
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: 'var(--radius-md)',
              background: '#f3e8ff',
              color: '#7c3aed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Award size={22} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
              🏆 Top Revenue Category
            </div>
            <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {metrics.bestCategory}
            </div>
          </div>
          <button
            className="btn btn-soft btn-sm"
            onClick={() => setActivePage('categories')}
          >
            View
          </button>
        </div>

        <div
          className="card"
          style={{
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            background: 'linear-gradient(135deg, #ffffff, #fefce8)'
          }}
        >
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: 'var(--radius-md)',
              background: '#fef3c7',
              color: '#d97706',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Sparkles size={22} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
              ⭐ Highest Grossing Product
            </div>
            <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {metrics.bestProduct}
            </div>
          </div>
          <button
            className="btn btn-soft btn-sm"
            onClick={() => setActivePage('products')}
          >
            Catalog
          </button>
        </div>
      </div>

      {/* Charts Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
          gap: '20px',
          marginBottom: '24px'
        }}
      >
        {/* Revenue Trend Chart */}
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">Revenue Trajectory</h3>
              <p className="card-subtitle">Sales over time</p>
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
            height={230}
          />
        </div>

        {/* Revenue By Category */}
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">Revenue by Category</h3>
              <p className="card-subtitle">Sales contribution by department</p>
            </div>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => setActivePage('analytics')}
            >
              Analysis
            </button>
          </div>

          <BarChart
            data={metrics.categoryList}
            metric="revenue"
            currency={business.currency}
            maxItems={5}
          />
        </div>
      </div>

      {/* Recent Orders Section with Profit / Loss Highlight */}
      <div className="card">
        <div className="card-header">
          <div>
            <h3 className="card-title">Recent Orders &amp; Profitability</h3>
            <p className="card-subtitle">
              {orders.length === 0
                ? 'No orders added yet'
                : `Showing latest ${recentOrders.length} orders`}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            {orders.length > 0 && (
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => setActivePage('orders')}
              >
                <span>View All ({orders.length})</span>
                <ArrowRight size={14} />
              </button>
            )}
            <button
              className="btn btn-primary btn-sm"
              onClick={() => setIsAddOrderModalOpen(true)}
            >
              <Plus size={14} />
              <span>Add Order</span>
            </button>
          </div>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Order No.</th>
                <th>Date</th>
                <th>Customer</th>
                <th>Product</th>
                <th>Category</th>
                <th>Actual Cost</th>
                <th>Total Sold</th>
                <th>Profit / Loss</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan="9" style={{ textAlign: 'center', padding: '36px', color: 'var(--text-muted)' }}>
                    No orders entered yet. Click "+ Add Order" to record a sale and see profit calculations!
                  </td>
                </tr>
              ) : (
                recentOrders.map((ord) => {
                  const profitVal = (Number(ord.totalAmount) || 0) - (Number(ord.actualPrice) || 0);
                  const isOrderProfit = profitVal >= 0;

                  return (
                    <tr
                      key={ord.id}
                      style={{ cursor: 'pointer' }}
                      onClick={() => {
                        setEditingOrder(ord);
                        setIsAddOrderModalOpen(true);
                      }}
                      title="Click to view/edit order"
                    >
                      <td style={{ fontWeight: 700, color: 'var(--primary-700)' }}>
                        #{ord.orderNumber}
                      </td>
                      <td>{formatDate(ord.orderDate)}</td>
                      <td>{ord.customerName || '—'}</td>
                      <td style={{ fontWeight: 600 }}>{ord.productName}</td>
                      <td>
                        <span
                          style={{
                            fontSize: '0.75rem',
                            background: 'var(--primary-50)',
                            color: 'var(--primary-700)',
                            padding: '3px 8px',
                            borderRadius: 'var(--radius-sm)',
                            fontWeight: 600
                          }}
                        >
                          {ord.categoryName}
                        </span>
                      </td>
                      <td style={{ color: 'var(--text-muted)' }}>
                        {formatCurrency(ord.actualPrice, business.currency)}
                      </td>
                      <td style={{ fontWeight: 800, color: 'var(--text-primary)' }}>
                        {formatCurrency(ord.totalAmount, business.currency)}
                      </td>
                      <td>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '3px 8px',
                            borderRadius: 'var(--radius-sm)',
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            background: isOrderProfit ? '#ecfdf5' : '#fef2f2',
                            color: isOrderProfit ? '#047857' : '#b91c1c',
                            border: `1px solid ${isOrderProfit ? '#a7f3d0' : '#fecaca'}`
                          }}
                        >
                          {isOrderProfit ? `+${formatCurrency(profitVal, business.currency)}` : `-${formatCurrency(Math.abs(profitVal), business.currency)}`}
                        </span>
                      </td>
                      <td>
                        <span className={`status-pill status-${ord.orderStatus?.toLowerCase() || 'delivered'}`}>
                          {ord.orderStatus || 'Delivered'}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
