import React from 'react';
import { formatCurrency, formatNumber } from '../../utils/formatters';

export const BarChart = ({
  data = [],
  metric = 'revenue', // 'revenue' | 'orders' | 'quantity'
  currency = '₹',
  maxItems = 6
}) => {
  if (!data || data.length === 0) {
    return (
      <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)' }}>
        No category data available for this range.
      </div>
    );
  }

  const items = data.slice(0, maxItems);
  const maxValue = Math.max(...items.map((item) => Number(item[metric]) || 0), 1);

  const colors = [
    'linear-gradient(90deg, #7c3aed, #9333ea)',
    'linear-gradient(90deg, #ec4899, #f43f5e)',
    'linear-gradient(90deg, #3b82f6, #06b6d4)',
    'linear-gradient(90deg, #f59e0b, #fbbf24)',
    'linear-gradient(90deg, #10b981, #34d399)',
    'linear-gradient(90deg, #8b5cf6, #c084fc)'
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', width: '100%' }}>
      {items.map((item, idx) => {
        const val = Number(item[metric]) || 0;
        const pct = Math.max(4, Math.round((val / maxValue) * 100));
        const formattedVal =
          metric === 'revenue'
            ? formatCurrency(val, currency)
            : `${formatNumber(val)} ${metric === 'quantity' ? 'units' : 'orders'}`;

        return (
          <div key={item.categoryId || item.categoryName || idx}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '0.84rem',
                fontWeight: 600,
                marginBottom: '6px'
              }}
            >
              <span style={{ color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: colors[idx % colors.length]
                  }}
                />
                {item.categoryName || item.name}
              </span>
              <span style={{ color: 'var(--text-secondary)', fontWeight: 700 }}>
                {formattedVal}
              </span>
            </div>

            {/* Bar track and fill */}
            <div
              style={{
                height: '8px',
                width: '100%',
                background: 'var(--bg-subtle)',
                borderRadius: 'var(--radius-full)',
                overflow: 'hidden'
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: `${pct}%`,
                  background: colors[idx % colors.length],
                  borderRadius: 'var(--radius-full)',
                  transition: 'width 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};
