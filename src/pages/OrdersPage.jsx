import React, { useState } from 'react';
import {
  Search,
  Filter,
  Plus,
  Trash2,
  Edit2,
  FileSpreadsheet,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatCurrency, formatDate } from '../utils/formatters';

export const OrdersPage = () => {
  const {
    orders,
    deleteOrder,
    setEditingOrder,
    setIsAddOrderModalOpen,
    categories,
    business,
    showToast
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [paymentFilter, setPaymentFilter] = useState('All');

  // Filtered orders
  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customerName?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'All' || o.orderStatus === statusFilter;
    const matchesCategory = categoryFilter === 'All' || o.categoryId === categoryFilter;
    const matchesPayment = paymentFilter === 'All' || o.paymentStatus === paymentFilter;

    return matchesSearch && matchesStatus && matchesCategory && matchesPayment;
  });

  // Export to CSV
  const handleExportCSV = () => {
    if (filteredOrders.length === 0) {
      showToast('No orders to export.', 'info');
      return;
    }

    const headers = [
      'Order Number',
      'Date',
      'Customer Name',
      'Customer Phone',
      'Product Name',
      'Category',
      'Actual Cost',
      'Selling Price',
      'Discount',
      'Shipping Charge',
      'Total Amount',
      'Profit Or Loss',
      'Payment Status',
      'Payment Method',
      'Order Status',
      'Notes'
    ];

    const rows = filteredOrders.map((o) => {
      const profit = (Number(o.totalAmount) || 0) - (Number(o.actualPrice) || 0);
      return [
        o.orderNumber,
        o.orderDate,
        `"${o.customerName || ''}"`,
        `"${o.customerPhone || ''}"`,
        `"${o.productName || ''}"`,
        `"${o.categoryName || ''}"`,
        o.actualPrice || 0,
        o.sellingPrice || 0,
        o.discount || 0,
        o.shippingCharge || 0,
        o.totalAmount || 0,
        profit,
        o.paymentStatus,
        o.paymentMethod,
        o.orderStatus,
        `"${o.notes || ''}"`
      ];
    });

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Givento_Orders_Analytics_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Orders exported as CSV.', 'success');
  };

  return (
    <div className="page-container">
      {/* Top Header */}
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
          <h2>Orders &amp; Sales Management</h2>
          <p className="card-subtitle">
            Search, filter, edit, and track sales revenue and profit margins
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn btn-secondary btn-sm" onClick={handleExportCSV}>
            <FileSpreadsheet size={15} />
            <span>Export CSV</span>
          </button>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => {
              setEditingOrder(null);
              setIsAddOrderModalOpen(true);
            }}
            id="orders-page-add-order-btn"
          >
            <Plus size={15} />
            <span>Add New Order</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="card" style={{ padding: '16px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Search Box */}
          <div className="input-with-icon" style={{ flex: '1 1 240px' }}>
            <Search size={16} className="icon" />
            <input
              type="text"
              className="form-control"
              placeholder="Search by Order #, Customer, or Product..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Category Filter */}
          <select
            className="form-control"
            style={{ width: 'auto', minWidth: '160px' }}
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="All">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Order Status Filter */}
          <select
            className="form-control"
            style={{ width: 'auto', minWidth: '140px' }}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="Delivered">Delivered</option>
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Pending">Pending</option>
            <option value="Cancelled">Cancelled</option>
          </select>

          {/* Payment Status Filter */}
          <select
            className="form-control"
            style={{ width: 'auto', minWidth: '140px' }}
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
          >
            <option value="All">All Payments</option>
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
            <option value="Refunded">Refunded</option>
          </select>
        </div>
      </div>

      {/* Orders Data Table with Actual Cost and Profit/Loss */}
      <div className="card" style={{ padding: 0 }}>
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
                <th>Selling Price</th>
                <th>Total Sold</th>
                <th>Profit / Loss</th>
                <th>Payment</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="12" style={{ textAlign: 'center', padding: '36px', color: 'var(--text-muted)' }}>
                    No matching orders found. Click "+ Add New Order" to record sales.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((ord) => {
                  const profitVal = (Number(ord.totalAmount) || 0) - (Number(ord.actualPrice) || 0);
                  const isOrderProfit = profitVal >= 0;

                  return (
                    <tr key={ord.id}>
                      <td style={{ fontWeight: 700, color: 'var(--primary-700)' }}>
                        #{ord.orderNumber}
                      </td>
                      <td>{formatDate(ord.orderDate)}</td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{ord.customerName || 'Walk-in Customer'}</div>
                        {ord.customerPhone && (
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-light)' }}>
                            {ord.customerPhone}
                          </div>
                        )}
                      </td>
                      <td style={{ fontWeight: 600 }}>{ord.productName}</td>
                      <td>
                        <span
                          style={{
                            fontSize: '0.74rem',
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
                      <td>{formatCurrency(ord.sellingPrice, business.currency)}</td>
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
                        <span className={`status-pill status-${ord.paymentStatus?.toLowerCase() || 'paid'}`}>
                          {ord.paymentStatus || 'Paid'}
                        </span>
                      </td>
                      <td>
                        <span className={`status-pill status-${ord.orderStatus?.toLowerCase() || 'delivered'}`}>
                          {ord.orderStatus || 'Delivered'}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '6px' }}>
                          <button
                            className="btn-soft"
                            style={{ padding: '6px', borderRadius: '6px' }}
                            title="Edit Order"
                            onClick={() => {
                              setEditingOrder(ord);
                              setIsAddOrderModalOpen(true);
                            }}
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            className="btn-soft"
                            style={{ padding: '6px', borderRadius: '6px', color: 'var(--danger-solid)' }}
                            title="Delete Order"
                            onClick={() => {
                              if (window.confirm(`Delete order #${ord.orderNumber}?`)) {
                                deleteOrder(ord.id);
                              }
                            }}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
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
