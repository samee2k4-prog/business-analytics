import React, { useState } from 'react';
import { formatCurrency } from '../../utils/formatters';

export const LineAreaChart = ({ data = [], height = 240, currency = '₹' }) => {
  const [hoverIndex, setHoverIndex] = useState(null);

  if (!data || data.length === 0) {
    return (
      <div style={{ height, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
        No trend data available.
      </div>
    );
  }

  const padding = { top: 20, right: 24, bottom: 36, left: 48 };
  const width = 640; // Internal SVG coordinate width

  const maxVal = Math.max(...data.map((d) => d.revenue), 1000);
  const minVal = 0;

  // Chart coordinates
  const graphWidth = width - padding.left - padding.right;
  const graphHeight = height - padding.top - padding.bottom;

  const getX = (index) => {
    if (data.length === 1) return padding.left + graphWidth / 2;
    return padding.left + (index / (data.length - 1)) * graphWidth;
  };

  const getY = (val) => {
    const ratio = (val - minVal) / (maxVal - minVal);
    return height - padding.bottom - ratio * graphHeight;
  };

  // Build SVG path
  const points = data.map((d, i) => ({ x: getX(i), y: getY(d.revenue) }));

  // Smooth bezier curve path
  const buildSmoothPath = (pts) => {
    if (pts.length === 0) return '';
    if (pts.length === 1) return `M ${pts[0].x} ${pts[0].y}`;

    let path = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i];
      const p1 = pts[i + 1];
      const cpX1 = p0.x + (p1.x - p0.x) / 2;
      const cpY1 = p0.y;
      const cpX2 = p0.x + (p1.x - p0.x) / 2;
      const cpY2 = p1.y;
      path += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${p1.x} ${p1.y}`;
    }
    return path;
  };

  const linePath = buildSmoothPath(points);
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${height - padding.bottom} L ${points[0].x} ${height - padding.bottom} Z`;

  // Horizontal guide lines (4 lines)
  const yTicks = [0, 0.33, 0.66, 1].map((pct) => ({
    val: Math.round(minVal + pct * (maxVal - minVal)),
    y: getY(minVal + pct * (maxVal - minVal))
  }));

  const activePoint = hoverIndex !== null ? data[hoverIndex] : null;

  return (
    <div style={{ position: 'relative', width: '100%', userSelect: 'none' }}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        style={{ width: '100%', height: 'auto', display: 'block', overflow: 'visible' }}
        onMouseLeave={() => setHoverIndex(null)}
      >
        <defs>
          <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.32" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.0" />
          </linearGradient>
          <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#7c3aed" />
            <stop offset="100%" stopColor="#a78bfa" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {yTicks.map((tick, idx) => (
          <g key={idx}>
            <line
              x1={padding.left}
              y1={tick.y}
              x2={width - padding.right}
              y2={tick.y}
              stroke="var(--border-subtle)"
              strokeDasharray="4 4"
              strokeWidth="1"
            />
            <text
              x={padding.left - 8}
              y={tick.y + 4}
              fontSize="10"
              fill="var(--text-light)"
              textAnchor="end"
              fontFamily="var(--font-sans)"
            >
              {formatCurrency(tick.val, currency)}
            </text>
          </g>
        ))}

        {/* Area fill */}
        <path d={areaPath} fill="url(#areaGradient)" />

        {/* Curve stroke */}
        <path
          d={linePath}
          fill="none"
          stroke="url(#lineGradient)"
          strokeWidth="3.5"
          strokeLinecap="round"
        />

        {/* X-Axis labels & interactive circles */}
        {data.map((d, i) => {
          const pt = points[i];
          const isHovered = hoverIndex === i;

          return (
            <g key={i}>
              <text
                x={pt.x}
                y={height - 12}
                fontSize="11"
                fontWeight={isHovered ? '700' : '500'}
                fill={isHovered ? 'var(--primary-700)' : 'var(--text-muted)'}
                textAnchor="middle"
                fontFamily="var(--font-sans)"
              >
                {d.label}
              </text>

              {/* Invisible wide hit area for easy hover */}
              <circle
                cx={pt.x}
                cy={pt.y}
                r="18"
                fill="transparent"
                style={{ cursor: 'pointer' }}
                onMouseEnter={() => setHoverIndex(i)}
              />

              {/* Visual circle dot */}
              <circle
                cx={pt.x}
                cy={pt.y}
                r={isHovered ? 6 : 4}
                fill="#ffffff"
                stroke="#7c3aed"
                strokeWidth={isHovered ? 3 : 2.5}
                style={{ transition: 'all 0.15s ease' }}
              />
            </g>
          );
        })}
      </svg>

      {/* Floating Tooltip */}
      {activePoint && hoverIndex !== null && (
        <div
          style={{
            position: 'absolute',
            left: `${(points[hoverIndex].x / width) * 100}%`,
            top: `${(points[hoverIndex].y / height) * 100}%`,
            transform: 'translate(-50%, -120%)',
            background: 'var(--text-primary)',
            color: 'white',
            padding: '6px 12px',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.78rem',
            boxShadow: 'var(--shadow-md)',
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
            zIndex: 10
          }}
        >
          <div style={{ fontWeight: 700 }}>{activePoint.label}</div>
          <div style={{ color: '#a78bfa' }}>
            Revenue: {formatCurrency(activePoint.revenue, currency)}
          </div>
          {activePoint.orders !== undefined && (
            <div style={{ fontSize: '0.72rem', color: '#cbd5e1' }}>
              Orders: {activePoint.orders}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
