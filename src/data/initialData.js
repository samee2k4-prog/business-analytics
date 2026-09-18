/**
 * Givento.in Business Analytics — Initial Configuration
 * Clean-slate configuration with Actual Price (Cost) & Selling Price support
 * for instant profit or loss calculations.
 */

export const initialBusiness = {
  id: 'biz_default',
  name: 'Givento.in',
  subtitle: 'Handmade & Handpicked Gifts',
  tagline: 'Track • Analyze • Grow',
  currency: '₹',
  category: 'Gifts & Lifestyle',
  location: 'Bengaluru, India',
  phone: '',
  email: '',
  logoIcon: 'gift',
  setupCompleted: false,
  createdAt: new Date().toISOString()
};

export const initialUser = {
  id: '',
  name: '',
  email: '',
  role: 'Owner & Founder',
  avatarColor: '#7c3aed',
  isLoggedIn: false
};

// Default starter categories
export const initialCategories = [
  { id: 'cat_ss', name: 'Stainless Steel Jewellery', color: '#8b5cf6', icon: 'Sparkles', description: 'Anti-tarnish waterproof stainless steel jewellery' },
  { id: 'cat_hair', name: 'Hair Accessories', color: '#ec4899', icon: 'Scissors', description: 'Korean hair clips, claw clips and scrunchies' },
  { id: 'cat_keys', name: 'Keychains', color: '#3b82f6', icon: 'Key', description: 'Personalized and aesthetic keychains' },
  { id: 'cat_hamper', name: 'Hampers', color: '#f59e0b', icon: 'Gift', description: 'Curated gift hampers for birthdays and occasions' },
  { id: 'cat_frame', name: 'Frames', color: '#10b981', icon: 'Image', description: 'Customized photo frames and polaroids' },
  { id: 'cat_gift', name: 'Gift Items', color: '#06b6d4', icon: 'Package', description: 'Novelty and keepsake gift items' },
  { id: 'cat_bouquet', name: 'Bouquets', color: '#f43f5e', icon: 'Heart', description: 'Handmade crochet and satin flower bouquets' },
  { id: 'cat_dress', name: 'Dresses', color: '#a855f7', icon: 'ShoppingBag', description: 'Boutique dresses and accessories' },
  { id: 'cat_pack', name: 'Packaging', color: '#64748b', icon: 'Box', description: 'Gift packaging materials' },
  { id: 'cat_other', name: 'Other', color: '#94a3b8', icon: 'MoreHorizontal', description: 'Miscellaneous custom products' }
];

// Product catalog with both Selling Price and Actual Price (Cost)
export const initialProducts = [
  { id: 'prod_001', name: 'SS Butterfly Bracelet', sku: 'GVT-SS-001', categoryId: 'cat_ss', categoryName: 'Stainless Steel Jewellery', actualPrice: 160, sellingPrice: 399 },
  { id: 'prod_002', name: 'SS Cuban Chain', sku: 'GVT-SS-002', categoryId: 'cat_ss', categoryName: 'Stainless Steel Jewellery', actualPrice: 210, sellingPrice: 499 },
  { id: 'prod_003', name: 'Korean Pearl Hair Clip', sku: 'GVT-HA-001', categoryId: 'cat_hair', categoryName: 'Hair Accessories', actualPrice: 80, sellingPrice: 250 },
  { id: 'prod_004', name: 'Velvet Bow Scrunchie', sku: 'GVT-HA-002', categoryId: 'cat_hair', categoryName: 'Hair Accessories', actualPrice: 65, sellingPrice: 199 },
  { id: 'prod_005', name: 'Personalized Keychain', sku: 'GVT-KC-001', categoryId: 'cat_keys', categoryName: 'Keychains', actualPrice: 50, sellingPrice: 150 },
  { id: 'prod_006', name: 'Royal Birthday Gift Hamper', sku: 'GVT-HM-001', categoryId: 'cat_hamper', categoryName: 'Hampers', actualPrice: 590, sellingPrice: 1299 },
  { id: 'prod_007', name: 'Customized Photo Frame', sku: 'GVT-FR-001', categoryId: 'cat_frame', categoryName: 'Frames', actualPrice: 190, sellingPrice: 450 }
];

export const initialOrders = [];
export const initialExpenses = [];
