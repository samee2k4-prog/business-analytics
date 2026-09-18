import React, { useState } from 'react';
import {
  Plus,
  Search,
  Package,
  Edit2,
  Trash2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatCurrency } from '../utils/formatters';

export const ProductsPage = () => {
  const {
    products,
    categories,
    deleteProduct,
    setEditingProduct,
    setIsAddProductModalOpen,
    business
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCat = categoryFilter === 'All' || p.categoryId === categoryFilter;
    return matchesSearch && matchesCat;
  });

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
          <h2>Products Catalog</h2>
          <p className="card-subtitle">
            Manage your store's products and standard selling prices for fast order logging.
          </p>
        </div>

        <button
          className="btn btn-primary btn-sm"
          onClick={() => {
            setEditingProduct(null);
            setIsAddProductModalOpen(true);
          }}
          id="add-product-btn"
        >
          <Plus size={16} />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="card" style={{ padding: '16px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <div className="input-with-icon" style={{ flex: '1 1 240px' }}>
            <Search size={16} className="icon" />
            <input
              type="text"
              className="form-control"
              placeholder="Search product name or SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            className="form-control"
            style={{ width: 'auto', minWidth: '180px' }}
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
        </div>
      </div>

      {/* Products Table */}
      <div className="card" style={{ padding: 0 }}>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Category</th>
                <th>SKU</th>
                <th>Selling Price</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '36px', color: 'var(--text-muted)' }}>
                    No products found. Click "+ Add New Product" to add items to your catalog.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{p.name}</div>
                    </td>
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
                        {p.categoryName}
                      </span>
                    </td>
                    <td style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {p.sku || '—'}
                    </td>
                    <td style={{ fontWeight: 700 }}>
                      {formatCurrency(p.sellingPrice, business.currency)}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '6px' }}>
                        <button
                          className="btn-soft"
                          style={{ padding: '6px', borderRadius: '6px' }}
                          title="Edit Product"
                          onClick={() => {
                            setEditingProduct(p);
                            setIsAddProductModalOpen(true);
                          }}
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          className="btn-soft"
                          style={{ padding: '6px', borderRadius: '6px', color: 'var(--danger-solid)' }}
                          title="Delete Product"
                          onClick={() => {
                            if (window.confirm(`Delete product "${p.name}"?`)) {
                              deleteProduct(p.id);
                            }
                          }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
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
