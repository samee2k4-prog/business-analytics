import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AddCategoryModal = () => {
  const {
    isAddCategoryModalOpen,
    setIsAddCategoryModalOpen,
    editingCategory,
    setEditingCategory,
    addCategory,
    updateCategory
  } = useApp();

  const colorPalette = [
    '#8b5cf6', // Violet / Purple
    '#ec4899', // Pink
    '#3b82f6', // Blue
    '#f59e0b', // Amber
    '#10b981', // Emerald
    '#06b6d4', // Cyan
    '#f43f5e', // Rose
    '#6366f1', // Indigo
    '#64748b'  // Slate
  ];

  const initialForm = {
    name: '',
    color: '#8b5cf6',
    description: '',
    icon: 'Sparkles'
  };

  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    if (editingCategory) {
      setForm({ ...editingCategory });
    } else {
      setForm(initialForm);
    }
  }, [editingCategory, isAddCategoryModalOpen]);

  if (!isAddCategoryModalOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      alert('Please enter a category name.');
      return;
    }

    if (editingCategory) {
      updateCategory(editingCategory.id, form);
      setEditingCategory(null);
    } else {
      addCategory(form);
    }
    setIsAddCategoryModalOpen(false);
  };

  const handleClose = () => {
    setEditingCategory(null);
    setIsAddCategoryModalOpen(false);
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h3 className="card-title">
              {editingCategory ? 'Edit Category' : 'Create Custom Category'}
            </h3>
            <p className="card-subtitle">
              Configure product category names, color badge, and details.
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
                Category Name <span className="req">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Customized Resin Art, Velvet Hampers..."
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Category Theme Color</label>
              <div style={{ display: 'flex', gap: '10px', marginTop: '6px', alignItems: 'center' }}>
                {colorPalette.map((col) => (
                  <button
                    type="button"
                    key={col}
                    onClick={() => setForm({ ...form, color: col })}
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: col,
                      border: form.color === col ? '3px solid #0f172a' : '2px solid transparent',
                      transform: form.color === col ? 'scale(1.15)' : 'scale(1)',
                      transition: 'all 0.15s ease'
                    }}
                  />
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Description (Optional)</label>
              <textarea
                className="form-control"
                rows="2"
                placeholder="Short description for this category"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={handleClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <Check size={16} />
              <span>{editingCategory ? 'Save Changes' : 'Create Category'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
