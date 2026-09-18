import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

export const MetricCard = ({
  label,
  value,
  icon: Icon,
  growth,
  growthText = 'vs last month',
  accent = 'purple',
  isTextValue = false
}) => {
  const isPositive = growth > 0;
  const isNegative = growth < 0;
  const hasGrowth = growth !== undefined && growth !== null;

  return (
    <div className={`metric-card accent-${accent}`}>
      <div className="metric-header">
        <span className="metric-label">{label}</span>
        {Icon && (
          <div className="metric-icon-box">
            <Icon size={18} />
          </div>
        )}
      </div>

      <div
        className="metric-value"
        style={isTextValue ? { fontSize: '1.35rem', fontWeight: 700 } : undefined}
      >
        {value}
      </div>

      <div className="metric-footer">
        {hasGrowth ? (
          <>
            <span className={isPositive ? 'badge-growth-up' : isNegative ? 'badge-growth-down' : ''}>
              {isPositive && <ArrowUpRight size={13} />}
              {isNegative && <ArrowDownRight size={13} />}
              {growth === 0 && <Minus size={13} />}
              {growth > 0 ? `+${growth}%` : `${growth}%`}
            </span>
            <span className="metric-comparison">{growthText}</span>
          </>
        ) : (
          <span className="metric-comparison">{growthText}</span>
        )}
      </div>
    </div>
  );
};
