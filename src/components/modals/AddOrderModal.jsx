import React, { useState, useEffect } from 'react';
import { X, Check, RefreshCw, Calculator, TrendingUp, TrendingDown } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatCurrency } from '../../utils/formatters';

export const AddOrderModal = () => {
  const {
    isAddOrderModalOpen,
    setIsAddOrderModalOpen,
    editingOrder,
    setEditingOrder,
    addOrder,
    updateOrder,
    products,
    categories,
    business
  } = useApp();

  const generateOrderNumber = () => {
    const today = new Date().toISOString().slice(0, 10).replace(/-/g, '').slice(2);
    const rand = Math.floor(100 + Math.random() * 900);
    return `GVT${today}-${rand}`;
  };

  const initialForm = {
    orderNumber: generateOrderNumber(),
    orderDate: new Date().toISOString().split('T')[0],
    customerName: '',
    customerPhone: '',
    productId: '',
    productName: '',
    categoryId: categories[0]?.id || '',
    categoryName: categories[0]?.name || '',
    actualPrice: 180, // Actual / Cost / Purchase Price
    sellingPrice: 399, // Customer Selling Price
    discount: 0,
    shippingCharge: 0,
    paymentMethod: 'UPI',
    paymentStatus: 'Paid',
    orderStatus: 'Delivered',
    notes: ''
  };

  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    if (editingOrder) {
      setForm({ ...editingOrder });
    } else {
      setForm({
        ...initialForm,
        orderNumber: generateOrderNumber(),
        orderDate: new Date().toISOString().split('T')[0],
        categoryId: categories[0]?.id || '',
        categoryName: categories[0]?.name || ''
      });
    }
  }, [editingOrder, isAddOrderModalOpen]);

  if (!isAddOrderModalOpen) return null;

  // When a catalog product is chosen, autofill both selling price and actual cost price!
  const handleProductChange = (e) => {
    const val = e.target.value;
    const selectedProd = products.find((p) => p.id === val);
    if (selectedProd) {
      setForm((prev) => ({
        ...prev,
        productId: selectedProd.id,
        productName: selectedProd.name,
        categoryId: selectedProd.categoryId,
        categoryName: selectedProd.categoryName,
        sellingPrice: selectedProd.sellingPrice || 0,
        actualPrice: selectedProd.actualPrice || Math.round((selectedProd.sellingPrice || 0) * 0.5)
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        productId: '',
        productName: val
      }));
    }
  };

  const handleCategoryChange = (e) => {
    const catId = e.target.value;
    const cat = categories.find((c) => c.id === catId);
    setForm((prev) => ({
      ...prev,
      categoryId: catId,
      categoryName: cat ? cat.name : prev.categoryName
    }));
  };

  // Live calculation without Quantity
  const sellingPrice = Number(form.sellingPrice) || 0;
  const actualPrice = Number(form.actualPrice) || 0;
  const discount = Number(form.discount) || 0;
  const shipping = Number(form.shippingCharge) || 0;

  const liveTotalAmount = Math.max(0, sellingPrice - discount + shipping);
  const liveProfitOrLoss = liveTotalAmount - actualPrice;
  const isProfit = liveProfitOrLoss >= 0;

  const handleSubmit = (addAnother = false) => {
    if (!form.productName.trim()) {
      alert('Please enter or select a product name.');
      return;
    }

    if (editingOrder) {
      updateOrder(editingOrder.id, {
        ...form,
        sellingPrice,
        actualPrice,
        discount,
        shippingCharge: shipping
      });
      setEditingOrder(null);
      setIsAddOrderModalOpen(false);
    } else {
      addOrder({
        ...form,
        sellingPrice,
        actualPrice,
        discount,
        shippingCharge: shipping
      });

      if (addAnother) {
        setForm({
          ...initialForm,
          orderNumber: generateOrderNumber(),
          categoryId: form.categoryId,
          categoryName: form.categoryName,
          customerName: form.customerName
        });
      } else {
        setIsAddOrderModalOpen(false);
      }
    }
  };

  const handleClose = () => {
    setEditingOrder(null);
    setIsAddOrderModalOpen(false);
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '680px' }}
      >
        {/* Header */}
        <div className="modal-header">
          <div>
            <h3 className="card-title">
              {editingOrder ? 'Edit Order' : 'Add New Order'}
            </h3>
            <p className="card-subtitle">
              Enter sales prices and actual cost to calculate automatic profit or loss.
            </p>
          </div>
          <button onClick={handleClose} className="btn-soft" style={{ padding: '6px' }}>
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <div className="modal-body">
          <div className="form-row" style={{ marginBottom: '16px' }}>
            <div className="form-group">
              <label className="form-label">
                Order Number <span className="req">*</span>
              </label>
              <div style={{ display: 'flex', gap: '6px' }}>
                <input
                  type="text"
                  className="form-control"
                  value={form.orderNumber}
                  onChange={(e) => setForm({ ...form, orderNumber: e.target.value })}
                  placeholder="e.g. GVT1025"
                  required
                />
                {!editingOrder && (
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    title="Generate new order number"
                    onClick={() => setForm({ ...form, orderNumber: generateOrderNumber() })}
                  >
                    <RefreshCw size={14} />
                  </button>
                )}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">
                Order Date <span className="req">*</span>
              </label>
              <input
                type="date"
                className="form-control"
                value={form.orderDate}
                onChange={(e) => setForm({ ...form, orderDate: e.target.value })}
                required
              />
            </div>
          </div>

          {/* Customer Info */}
          <div
            style={{
              background: 'var(--bg-subtle)',
              padding: '12px 16px',
              borderRadius: 'var(--radius-md)',
              marginBottom: '16px'
            }}
          >
            <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
              Customer Information (Optional)
            </span>
            <div className="form-row" style={{ marginTop: '8px' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Customer Name (e.g. Riya Sharma)"
                  value={form.customerName}
                  onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <input
                  type="tel"
                  className="form-control"
                  placeholder="Phone Number (e.g. +91 98765 43210)"
                  value={form.customerPhone}
                  onChange={(e) => setForm({ ...form, customerPhone: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Product & Category Selection */}
          <div className="form-row" style={{ marginBottom: '16px' }}>
            <div className="form-group">
              <label className="form-label">
                Select Product or Type Name <span className="req">*</span>
              </label>
              <select
                className="form-control"
                value={form.productId}
                onChange={handleProductChange}
              >
                <option value="">-- Choose from Catalog or Type Below --</option>
                {products.map((prod) => (
                  <option key={prod.id} value={prod.id}>
                    {prod.name} (Selling: {formatCurrency(prod.sellingPrice, business.currency)}, Cost: {formatCurrency(prod.actualPrice, business.currency)})
                  </option>
                ))}
              </select>
              <input
                type="text"
                className="form-control"
                style={{ marginTop: '8px' }}
                placeholder="Product Name (e.g. Stainless Steel Bracelet)"
                value={form.productName}
                onChange={(e) => setForm({ ...form, productName: e.target.value, productId: '' })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                Category <span className="req">*</span>
              </label>
              <select
                className="form-control"
                value={form.categoryId}
                onChange={handleCategoryChange}
                required
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Actual Price, Selling Price, Discount, Shipping */}
          <div className="form-row" style={{ marginBottom: '16px' }}>
            <div className="form-group">
              <label className="form-label" style={{ color: '#0369a1', fontWeight: 700 }}>
                Actual Price (Cost / Buy Price) (₹) <span className="req">*</span>
              </label>
              <input
                type="number"
                min="0"
                className="form-control"
                value={form.actualPrice}
                onChange={(e) => setForm({ ...form, actualPrice: e.target.value })}
                placeholder="e.g. 180"
                required
                style={{ borderColor: '#7dd3fc', background: '#f0f9ff' }}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Selling Price (₹) <span className="req">*</span></label>
              <input
                type="number"
                min="0"
                className="form-control"
                value={form.sellingPrice}
                onChange={(e) => setForm({ ...form, sellingPrice: e.target.value })}
                placeholder="e.g. 399"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Discount (₹)</label>
              <input
                type="number"
                min="0"
                className="form-control"
                value={form.discount}
                onChange={(e) => setForm({ ...form, discount: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Shipping Charge (₹)</label>
              <input
                type="number"
                min="0"
                className="form-control"
                value={form.shippingCharge}
                onChange={(e) => setForm({ ...form, shippingCharge: e.target.value })}
              />
            </div>
          </div>

          {/* Live Automatic Calculation & Profit / Loss Summary Box */}
          <div
            style={{
              background: isProfit ? 'linear-gradient(135deg, #ecfdf5, #f0fdf4)' : 'linear-gradient(135deg, #fef2f2, #fff1f2)',
              border: `1.5px solid ${isProfit ? '#a7f3d0' : '#fecaca'}`,
              borderRadius: 'var(--radius-lg)',
              padding: '16px 20px',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  background: isProfit ? '#059669' : '#dc2626',
                  color: 'white',
                  width: '40px',
                  height: '40px',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {isProfit ? <TrendingUp size={22} /> : <TrendingDown size={22} />}
              </div>
              <div>
                <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                  Automatic Calculation
                </div>
                <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
                  Total: {formatCurrency(sellingPrice)} - {formatCurrency(discount)} + {formatCurrency(shipping)}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '20px', textAlign: 'right', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '0.74rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                  Total Amount
                </div>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  {formatCurrency(liveTotalAmount, business.currency)}
                </div>
              </div>

              <div
                style={{
                  background: isProfit ? '#dcfce7' : '#fee2e2',
                  padding: '8px 14px',
                  borderRadius: 'var(--radius-md)',
                  border: `1px solid ${isProfit ? '#86efac' : '#fca5a5'}`
                }}
              >
                <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: isProfit ? '#15803d' : '#b91c1c' }}>
                  {isProfit ? 'Estimated Profit' : 'Estimated Loss'}
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '1.45rem',
                    fontWeight: 800,
                    color: isProfit ? '#15803d' : '#b91c1c'
                  }}
                >
                  {isProfit ? `+${formatCurrency(liveProfitOrLoss, business.currency)}` : `-${formatCurrency(Math.abs(liveProfitOrLoss), business.currency)}`}
                </div>
              </div>
            </div>
          </div>

          {/* Payment & Order Status */}
          <div className="form-row" style={{ marginBottom: '16px' }}>
            <div className="form-group">
              <label className="form-label">Payment Method</label>
              <select
                className="form-control"
                value={form.paymentMethod}
                onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}
              >
                <option value="UPI">UPI (GPay / PhonePe / Paytm)</option>
                <option value="COD">Cash on Delivery (COD)</option>
                <option value="Card">Debit / Credit Card</option>
                <option value="NetBanking">NetBanking</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Payment Status</label>
              <select
                className="form-control"
                value={form.paymentStatus}
                onChange={(e) => setForm({ ...form, paymentStatus: e.target.value })}
              >
                <option value="Paid">Paid</option>
                <option value="Pending">Pending</option>
                <option value="Refunded">Refunded</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Order Status</label>
              <select
                className="form-control"
                value={form.orderStatus}
                onChange={(e) => setForm({ ...form, orderStatus: e.target.value })}
              >
                <option value="Delivered">Delivered</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Pending">Pending</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Notes */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Notes (Optional)</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Gift wrapping requested, customer notes"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={handleClose}>
            Cancel
          </button>
          {!editingOrder && (
            <button
              type="button"
              className="btn btn-soft"
              onClick={() => handleSubmit(true)}
            >
              Save & Add Another
            </button>
          )}
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => handleSubmit(false)}
            id="save-order-submit-btn"
          >
            <Check size={16} />
            <span>{editingOrder ? 'Update Order' : 'Save Order'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
