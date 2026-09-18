/**
 * Givento.in Business Analytics — Dynamic Insights Engine
 * Translates sales data into actionable, executive business recommendations.
 */

import { formatCurrency } from './formatters';

export const generateBusinessInsights = ({
  metrics,
  previousMetrics = { revenue: 0, orders: 0, aov: 0 }
}) => {
  const insights = [];

  const currentRev = metrics.totalRevenue || 0;
  const currentOrders = metrics.totalOrders || 0;

  // Empty state insights when user hasn't added orders yet
  if (currentOrders === 0) {
    return [
      {
        id: 'start_prompt',
        type: 'opportunity',
        icon: '🚀',
        text: 'Welcome to your dashboard! Click "+ Add New Order" above to log your first sale and watch your analytics come to life.'
      },
      {
        id: 'categories_tip',
        type: 'info',
        icon: '🏷️',
        text: 'Customise your product categories under "Categories" anytime to tailor the dashboard to your products.'
      }
    ];
  }

  // 1. Revenue velocity insight
  const prevRev = previousMetrics.revenue || 0;
  if (prevRev > 0) {
    const revGrowth = Math.round(((currentRev - prevRev) / prevRev) * 100);
    if (revGrowth >= 0) {
      insights.push({
        id: 'rev_growth',
        type: 'growth',
        icon: '📈',
        text: `Revenue increased ${revGrowth}% compared with previous period (${formatCurrency(currentRev)} vs ${formatCurrency(prevRev)}).`
      });
    } else {
      insights.push({
        id: 'rev_drop',
        type: 'warning',
        icon: '📉',
        text: `Revenue contracted by ${Math.abs(revGrowth)}% compared with the previous period. Consider promotional campaigns.`
      });
    }
  } else {
    insights.push({
      id: 'rev_started',
      type: 'growth',
      icon: '📈',
      text: `Total revenue generated so far is ${formatCurrency(currentRev)} across ${currentOrders} orders.`
    });
  }

  // 2. Best Category by Revenue
  if (metrics.categoryList && metrics.categoryList.length > 0) {
    const topCat = metrics.categoryList[0];
    insights.push({
      id: 'top_cat',
      type: 'trophy',
      icon: '🏆',
      text: `${topCat.categoryName} generated the highest revenue with ${formatCurrency(topCat.revenue)} across ${topCat.orders} orders.`
    });
  }

  // 3. Category with highest volume / units sold
  if (metrics.categoryList && metrics.categoryList.length > 1) {
    const sortedByUnits = [...metrics.categoryList].sort((a, b) => b.quantity - a.quantity);
    const topVolumeCat = sortedByUnits[0];
    if (topVolumeCat && topVolumeCat.quantity > 0) {
      insights.push({
        id: 'top_units',
        type: 'volume',
        icon: '📦',
        text: `${topVolumeCat.categoryName} had the highest number of units sold (${topVolumeCat.quantity} units).`
      });
    }
  }

  // 4. AOV Progression
  const currentAov = metrics.averageOrderValue || 0;
  if (currentAov > 0) {
    insights.push({
      id: 'aov_current',
      type: 'opportunity',
      icon: '💡',
      text: `Your average order value currently stands at ${formatCurrency(currentAov)} per order.`
    });
  }

  return insights;
};
