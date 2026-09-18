import React from 'react';
import { Plus, Edit2, Trash2, Layers, IndianRupee, TrendingUp } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatCurrency } from '../utils/formatters';

export const CategoriesPage = () => {
  const {
    categories,
    deleteCategory,
    setEditingCategory,
    setIsAddCategoryModalOpen,
    orders,
    business
  } = useApp();

  // Compute category statistics from orders
  const getCategoryStats = (catId, catName) => {
    const matchingOrders = orders.filter(
      (o) => (o.categoryId === catId || o.categoryName === catName) && o.orderStatus !== 'Cancelled'
    );
    const orderCount = matchingOrders.length;
    const revenue = matchingOrders.reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0);
    const actualCost = matchingOrders.reduce((sum, o) => sum + (Number(o.actualPrice) || 0), 0);
    const profit = revenue - actualCost;

    return { orderCount, revenue, profit };
  };

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
          <h2>Product Categories</h2>
          <p className="card-subtitle">
            Configure, rename, and track sales revenue and profitability per category.
          </p>
        </div>

        <button
          className="btn btn-primary btn-sm"
          onClick={() => {
            setEditingCategory(null);
            setIsAddCategoryModalOpen(true);
          }}
          id="add-category-btn"
        >
          <Plus size={16} />
          <span>Add Category</span>
        </button>
      </div>

      {/* Categories Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '20px'
        }}
      >
        {categories.map((cat) => {
          const stats = getCategoryStats(cat.id, cat.name);
          const isProfit = stats.profit >= 0;

          return (
            <div
              key={cat.id}
              className="card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                borderTop: `4px solid ${cat.color || '#7c3aed'}`
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: 'var(--radius-md)',
                        background: `${cat.color || '#7c3aed'}20`,
                        color: cat.color || '#7c3aed',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Layers size={18} />
                    </div>
                    <div>
                      <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>{cat.name}</h4>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '4px' }}>
                    <button
                      className="btn-soft"
                      style={{ padding: '6px', borderRadius: '6px' }}
                      title="Edit Category"
                      onClick={() => {
                        setEditingCategory(cat);
                        setIsAddCategoryModalOpen(true);
                      }}
                    >
                      <Edit2 size={13} />
                    </button>
                    <button
                      className="btn-soft"
                      style={{ padding: '6px', borderRadius: '6px', color: 'var(--danger-solid)' }}
                      title="Delete Category"
                      onClick={() => {
                        if (window.confirm(`Delete "${cat.name}" category?`)) {
                          deleteCategory(cat.id);
                        }
                      }}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '18px', minHeight: '36px' }}>
                  {cat.description || 'Custom category for store products.'}
                </p>
              </div>

              {/* Performance Stats */}
              <div
                style={{
                  background: 'var(--bg-subtle)',
                  padding: '12px 14px',
                  borderRadius: 'var(--radius-md)',
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr',
                  gap: '8px',
                  textAlign: 'center'
                }}
              >
                <div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-light)', fontWeight: 600, textTransform: 'uppercase' }}>
                    Orders
                  </div>
                  <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>{stats.orderCount}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-light)', fontWeight: 600, textTransform: 'uppercase' }}>
                    Revenue
                  </div>
                  <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--primary-700)' }}>
                    {formatCurrency(stats.revenue, business.currency)}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-light)', fontWeight: 600, textTransform: 'uppercase' }}>
                    Profit
                  </div>
                  <div style={{ fontWeight: 800, fontSize: '0.95rem', color: isProfit ? '#047857' : '#b91c1c' }}>
                    {formatCurrency(stats.profit, business.currency)}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
