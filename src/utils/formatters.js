/**
 * Givento.in Business Analytics — Formatting Utilities
 */

export const formatCurrency = (amount, currency = '₹') => {
  if (amount === undefined || amount === null || isNaN(amount)) return `${currency}0`;
  const rounded = Math.round(amount);
  return `${currency}${rounded.toLocaleString('en-IN')}`;
};

export const formatNumber = (num) => {
  if (num === undefined || num === null || isNaN(num)) return '0';
  return Number(num).toLocaleString('en-IN');
};

export const formatDate = (dateStr, format = 'short') => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;

  if (format === 'slash') {
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  }

  return d.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};

export const formatPercent = (val) => {
  if (val === undefined || val === null || isNaN(val)) return '0%';
  const prefix = val > 0 ? '+' : '';
  return `${prefix}${Math.round(val)}%`;
};
