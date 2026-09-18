import React from 'react';
import { Plus } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Header = () => {
  const {
    user,
    business,
    selectedPeriod,
    setSelectedPeriod,
    setIsAddOrderModalOpen
  } = useApp();

  const periods = ['Today', 'This Week', 'This Month', 'This Year', 'Custom'];

  return (
    <header className="header">
      <div className="header-greeting">
        <h2>
          <span>Good evening, {user.name ? user.name.split(' ')[0] : 'Owner'}</span>
          <span style={{ fontSize: '1.2rem' }}>👋</span>
        </h2>
        <p>{business.name || 'Givento.in'} • {business.subtitle || 'Business Analytics'}</p>
      </div>

      <div className="header-actions">
        {/* Quick Date Range Pills */}
        <div className="pill-group">
          {periods.map((period) => (
            <button
              key={period}
              className={`pill-btn ${selectedPeriod === period ? 'active' : ''}`}
              onClick={() => setSelectedPeriod(period)}
              id={`filter-${period.toLowerCase().replace(' ', '-')}`}
            >
              {period}
            </button>
          ))}
        </div>

        {/* Add Order Button */}
        <button
          className="btn btn-primary btn-sm"
          onClick={() => setIsAddOrderModalOpen(true)}
          id="header-add-order-btn"
        >
          <Plus size={16} />
          <span>Add Order</span>
        </button>
      </div>
    </header>
  );
};
