import React, { useState } from 'react';
import { formatCurrency, formatPercent } from '../../utils/formatters';

export const DonutChart = ({
  data = [],
  metric = 'revenue',
  currency = '₹',
  size = 200,
  strokeWidth = 32
}) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  if (!data || data.length === 0) {
    return (
      <div style={{ height: size, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
        No distribution data.
      </div>
    );
  }

  const items = data.slice(0, 5);
  const total = items.reduce((acc, item) => acc + (Number(item[metric]) || 0), 0);

  const colors = ['#7c3aed', '#ec4899', '#3b82f6', '#f59e0b', '#10b981', '#64748b'];

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let accumulatedPercent = 0;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '28px', flexWrap: 'wrap', justifyContent: 'center' }}>
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {/* Background track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="var(--bg-subtle)"
            strokeWidth={strokeWidth}
          />

          {/* Slices */}
          {items.map((item, idx) => {
            const val = Number(item[metric]) || 0;
            const pct = total > 0 ? val / total : 0;
            const strokeDasharray = `${pct * circumference} ${circumference}`;
            const strokeDashoffset = -accumulatedPercent * circumference;
            accumulatedPercent += pct;

            const isHovered = hoveredIndex === idx;

            return (
              <circle
                key={idx}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="transparent"
                stroke={colors[idx % colors.length]}
                strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                transform={`rotate(-90 ${size / 2} ${size / 2})`}
                style={{
                  transition: 'stroke-width 0.2s ease, opacity 0.2s ease',
                  cursor: 'pointer',
                  opacity: hoveredIndex === null || isHovered ? 1 : 0.6
                }}
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
              />
            );
          })}
        </svg>

        {/* Center label */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none'
          }}
        >
          <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            {hoveredIndex !== null ? items[hoveredIndex].categoryName : 'Total Share'}
          </span>
          <span style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            {hoveredIndex !== null
              ? metric === 'revenue'
                ? formatCurrency(items[hoveredIndex][metric], currency)
                : `${items[hoveredIndex][metric]} units`
              : metric === 'revenue'
              ? formatCurrency(total, currency)
              : total}
          </span>
        </div>
      </div>

      {/* Legend List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '160px' }}>
        {items.map((item, idx) => {
          const val = Number(item[metric]) || 0;
          const share = total > 0 ? Math.round((val / total) * 100) : 0;
          const isHovered = hoveredIndex === idx;

          return (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '0.8rem',
                cursor: 'pointer',
                padding: '4px 6px',
                borderRadius: 'var(--radius-sm)',
                background: isHovered ? 'var(--primary-50)' : 'transparent',
                transition: 'background 0.15s ease'
              }}
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span
                  style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    background: colors[idx % colors.length]
                  }}
                />
                <span style={{ fontWeight: isHovered ? 700 : 500, color: 'var(--text-secondary)' }}>
                  {item.categoryName}
                </span>
              </div>
              <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{share}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
