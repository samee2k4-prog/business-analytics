import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AddProductModal = () => {
  const {
    isAddProductModalOpen,
    setIsAddProductModalOpen,
    editingProduct,
    setEditingProduct,
    addProduct,
    updateProduct,
    categories
  } = useApp();

  const initialForm = {
    name: '',
    sku: `GVT-PRD-${Math.floor(100 + Math.random() * 900)}`,
    categoryId: categories[0]?.id || '',
    categoryName: categories[0]?.name || '',
    actualPrice: 150, // Cost / Buy Price
    sellingPrice: 399 // Store Selling Price
  };

  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    if (editingProduct) {
      setForm({ ...editingProduct });
    } else {
      setForm({
        ...initialForm,
        sku: `GVT-PRD-${Math.floor(100 + Math.random() * 900)}`,
        categoryId: categories[0]?.id || '',
        categoryName: categories[0]?.name || ''
      });
    }
  }, [editingProduct, isAddProductModalOpen]);

  if (!isAddProductModalOpen) return null;

  const handleCategorySelect = (e) => {
    const catId = e.target.value;
    const cat = categories.find((c) => c.id === catId);
    setForm((prev) => ({
      ...prev,
      categoryId: catId,
      categoryName: cat ? cat.name : prev.categoryName
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      alert('Please enter a product name.');
      return;
    }

    if (editingProduct) {
      updateProduct(editingProduct.id, form);
      setEditingProduct(null);
    } else {
      addProduct(form);
    }
    setIsAddProductModalOpen(false);
  };

  const handleClose = () => {
    setEditingProduct(null);
    setIsAddProductModalOpen(false);
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h3 className="card-title">
              {editingProduct ? 'Edit Product' : 'Add Product to Catalog'}
            </h3>
            <p className="card-subtitle">
              Configure product details, actual cost price, and customer selling price.
            </p>
          </div>
          <button onClick={handleClose} className="btn-soft" style={{ padding: '6px' }}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">
                Product Name <span className="req">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Stainless Steel Bracelet"
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
                  value={form.categoryId}
                  onChange={handleCategorySelect}
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">SKU / Code</label>
                <input
                  type="text"
                  className="form-control"
                  value={form.sku}
                  onChange={(e) => setForm({ ...form, sku: e.target.value })}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label" style={{ color: '#0369a1', fontWeight: 700 }}>
                  Actual Price (Buy / Cost) (₹) <span className="req">*</span>
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
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={handleClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <Check size={16} />
              <span>{editingProduct ? 'Save Changes' : 'Save Product'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
