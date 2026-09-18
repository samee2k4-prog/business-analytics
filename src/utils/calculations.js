/**
 * Givento.in Business Analytics — Calculations Engine
 * Computes live revenue, actual costs, and profit/loss from real user orders.
 */

export const filterOrdersByPeriod = (orders = [], period, customStart, customEnd) => {
  if (!orders || !orders.length) return [];
  const now = new Date();

  return orders.filter((order) => {
    if (!order.orderDate) return false;
    const orderDate = new Date(order.orderDate);

    switch (period) {
      case 'Today': {
        const todayStr = new Date().toISOString().split('T')[0];
        return order.orderDate === todayStr;
      }
      case 'This Week': {
        const sevenDaysAgo = new Date(now);
        sevenDaysAgo.setDate(now.getDate() - 7);
        return orderDate >= sevenDaysAgo;
      }
      case 'This Month': {
        return (
          orderDate.getFullYear() === now.getFullYear() &&
          orderDate.getMonth() === now.getMonth()
        );
      }
      case 'This Year': {
        return orderDate.getFullYear() === now.getFullYear();
      }
      case 'Custom': {
        if (!customStart && !customEnd) return true;
        const start = customStart ? new Date(customStart) : new Date('2020-01-01');
        const end = customEnd ? new Date(customEnd + 'T23:59:59') : new Date('2030-01-01');
        return orderDate >= start && orderDate <= end;
      }
      default:
        return true;
    }
  });
};

export const calculateDashboardMetrics = (orders = [], expenses = [], products = []) => {
  const validOrders = orders.filter((o) => o.orderStatus !== 'Cancelled');

  const totalRevenue = validOrders.reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0);
  const totalOrders = validOrders.length;
  const averageOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

  // Actual cost & profit calculation
  const totalActualCost = validOrders.reduce((sum, o) => sum + (Number(o.actualPrice) || 0), 0);
  const grossProfit = totalRevenue - totalActualCost;

  const totalExpenses = expenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
  const estimatedProfit = grossProfit - totalExpenses;
  const profitMargin = totalRevenue > 0 ? Math.round((estimatedProfit / totalRevenue) * 100) : 0;

  // Category analysis
  const categoryStats = {};
  validOrders.forEach((o) => {
    const catName = o.categoryName || 'Other';
    if (!categoryStats[catName]) {
      categoryStats[catName] = {
        categoryName: catName,
        categoryId: o.categoryId,
        revenue: 0,
        actualCost: 0,
        profit: 0,
        orders: 0
      };
    }
    const amt = Number(o.totalAmount) || 0;
    const cost = Number(o.actualPrice) || 0;

    categoryStats[catName].revenue += amt;
    categoryStats[catName].actualCost += cost;
    categoryStats[catName].profit += (amt - cost);
    categoryStats[catName].orders += 1;
  });

  const categoryList = Object.values(categoryStats).sort((a, b) => b.revenue - a.revenue);
  const bestCategory = categoryList.length > 0 ? categoryList[0].categoryName : 'None yet';

  // Product analysis
  const productStats = {};
  validOrders.forEach((o) => {
    const prodName = o.productName || 'Custom Product';
    if (!productStats[prodName]) {
      productStats[prodName] = {
        name: prodName,
        category: o.categoryName,
        revenue: 0,
        actualCost: 0,
        profit: 0,
        orderCount: 0
      };
    }
    const amt = Number(o.totalAmount) || 0;
    const cost = Number(o.actualPrice) || 0;

    productStats[prodName].revenue += amt;
    productStats[prodName].actualCost += cost;
    productStats[prodName].profit += (amt - cost);
    productStats[prodName].orderCount += 1;
  });

  const productsList = Object.values(productStats);
  const topProductsByRevenue = [...productsList].sort((a, b) => b.revenue - a.revenue);
  const topProductsByProfit = [...productsList].sort((a, b) => b.profit - a.profit);
  const bestProduct = topProductsByRevenue.length > 0 ? topProductsByRevenue[0].name : 'None yet';

  return {
    totalRevenue,
    totalOrders,
    averageOrderValue,
    totalActualCost,
    grossProfit,
    totalExpenses,
    estimatedProfit,
    profitMargin,
    bestCategory,
    bestProduct,
    categoryList,
    topProductsByRevenue,
    topProductsByProfit
  };
};

export const getRevenueTrend = (orders = [], timeframe = 'Weekly') => {
  const validOrders = orders.filter((o) => o.orderStatus !== 'Cancelled');

  if (timeframe === 'Weekly') {
    const weeks = [
      { label: 'Week 1', revenue: 0, orders: 0 },
      { label: 'Week 2', revenue: 0, orders: 0 },
      { label: 'Week 3', revenue: 0, orders: 0 },
      { label: 'Week 4', revenue: 0, orders: 0 }
    ];

    validOrders.forEach((o) => {
      const d = new Date(o.orderDate);
      const day = d.getDate();
      const amt = Number(o.totalAmount) || 0;
      if (day <= 7) {
        weeks[0].revenue += amt;
        weeks[0].orders += 1;
      } else if (day <= 14) {
        weeks[1].revenue += amt;
        weeks[1].orders += 1;
      } else if (day <= 21) {
        weeks[2].revenue += amt;
        weeks[2].orders += 1;
      } else {
        weeks[3].revenue += amt;
        weeks[3].orders += 1;
      }
    });

    return weeks;
  }

  if (timeframe === 'Daily') {
    const daysMap = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split('T')[0];
      const label = d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric' });
      daysMap[key] = { label, revenue: 0, orders: 0 };
    }

    validOrders.forEach((o) => {
      if (daysMap[o.orderDate]) {
        daysMap[o.orderDate].revenue += Number(o.totalAmount) || 0;
        daysMap[o.orderDate].orders += 1;
      }
    });

    return Object.values(daysMap);
  }

  if (timeframe === 'Monthly') {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonthIdx = new Date().getMonth();
    const recent = [];
    for (let i = 4; i >= 0; i--) {
      const idx = (currentMonthIdx - i + 12) % 12;
      recent.push({ label: months[idx], revenue: 0, orders: 0, monthIdx: idx });
    }

    validOrders.forEach((o) => {
      const mIdx = new Date(o.orderDate).getMonth();
      const target = recent.find((r) => r.monthIdx === mIdx);
      if (target) {
        target.revenue += Number(o.totalAmount) || 0;
        target.orders += 1;
      }
    });

    return recent.map(({ label, revenue, orders }) => ({ label, revenue, orders }));
  }

  if (timeframe === 'Yearly') {
    const currentYear = new Date().getFullYear();
    const years = [
      { label: String(currentYear - 2), revenue: 0, orders: 0 },
      { label: String(currentYear - 1), revenue: 0, orders: 0 },
      { label: String(currentYear), revenue: 0, orders: 0 }
    ];

    validOrders.forEach((o) => {
      const yr = String(new Date(o.orderDate).getFullYear());
      const target = years.find((y) => y.label === yr);
      if (target) {
        target.revenue += Number(o.totalAmount) || 0;
        target.orders += 1;
      }
    });

    return years;
  }

  return [];
};
