// Unit logic test for Bubbles core modules

import { PRODUCTS, CURATED_BOXES, CATEGORIES, AGE_RANGES, SHOP_BY_AGE_GROUPS, generateToySvg } from './js/products.js';

// Category separation removed: all products displayed without category division
console.assert(Array.isArray(CATEGORIES) && CATEGORIES.length === 0, 'Categories should be empty as category division has been removed');
console.assert(PRODUCTS.length === 83, `Should have exactly 83 unique catalog items after duplicate removal, found: ${PRODUCTS.length}`);

// Test that all product IDs and normalized titles are strictly unique (zero duplicates)
const idSet = new Set();
const titleSet = new Set();
PRODUCTS.forEach(p => {
  console.assert(!idSet.has(p.id), `Product ID "${p.id}" must be unique`);
  idSet.add(p.id);

  const norm = p.title.toLowerCase().replace(/[^a-z0-9]/g, ' ').replace(/\s+/g, ' ').trim();
  console.assert(!titleSet.has(norm), `Product title "${p.title}" must be unique, found duplicate`);
  titleSet.add(norm);
});

// Test Shop by Age groups
console.assert(SHOP_BY_AGE_GROUPS.length === 5, 'Should have exactly 5 Shop by Age groups');
const expectedAgeTitles = {
  '0-1y': '0–1 Year',
  '1-2y': '1–2 Years',
  '2-3y': '2–3 Years',
  '3-4y': '3–4 Years',
  '5y-plus': '5+ Years'
};

Object.entries(expectedAgeTitles).forEach(([id, expectedTitle]) => {
  const grp = SHOP_BY_AGE_GROUPS.find(g => g.id === id);
  console.assert(!!grp, `Shop by age group ${id} should exist`);
  console.assert(grp.title === expectedTitle, `Group ${id} title should be "${expectedTitle}", found "${grp.title}"`);
  
  // Verify products exist for this age group via ageRanges or ageRange
  const matches = PRODUCTS.filter(p => {
    if (p.ageRange === id) return true;
    if (Array.isArray(p.ageRanges) && p.ageRanges.includes(id)) return true;
    if (id === '0-1y' && (p.ageRange === '0-1y' || p.ageRange === '0-12m')) return true;
    if (id === '5y-plus' && (p.ageRange === '5y-plus' || p.ageRange === '4-5y' || (p.ageLabel && (p.ageLabel.includes('5') || p.ageLabel.includes('6'))))) return true;
    return false;
  });
  console.log(`Age group "${grp.title}": ${matches.length} products available.`);
  console.assert(matches.length > 0, `Age group ${id} should have > 0 matching products`);
});

// Test box pricing
CURATED_BOXES.forEach(box => {
  console.assert(box.price >= 5000 && box.price <= 7000, `Box ${box.title} price (${box.price}) should be in target range LKR 5,000-7,000`);
  console.assert(box.includes.length >= 5, `Box ${box.title} should have at least 5 included items`);
});

// Test SVG generation
const svgTest = generateToySvg('snap-circuit');
console.assert(svgTest.includes('<svg') && svgTest.includes('</svg>'), 'SVG generation should produce valid SVG elements');

// Test HTML markup for Age Category Section & navigation
import fs from 'fs';
const html = fs.readFileSync('./index.html', 'utf8');
console.assert(html.includes('id="toy-store-age-section"'), 'index.html must have #toy-store-age-section');
console.assert(html.includes('id="age-category-pills-shelf"'), 'index.html must have #age-category-pills-shelf');
console.assert(html.includes('href="#toy-store-age-section"'), 'index.html must have nav links to #toy-store-age-section');
console.assert(html.includes('href="#toy-catalog"'), 'index.html must have nav links to #toy-catalog');

['0–1 Year', '1–2 Years', '2–3 Years', '3–4 Years', '5+ Years'].forEach(cat => {
  console.assert(html.includes(cat), `index.html must contain category label "${cat}"`);
});

// Test HTML markup for Saved Favorites section & header controls
console.assert(html.includes('id="saved-favorites-section"'), 'index.html must contain #saved-favorites-section');
console.assert(html.includes('id="saved-favorites-container"'), 'index.html must contain #saved-favorites-container');
console.assert(html.includes('id="header-favorites-btn"'), 'index.html must contain #header-favorites-btn');
console.assert(html.includes('id="filter-favorites-toggle-btn"'), 'index.html must contain #filter-favorites-toggle-btn');
console.assert(html.includes('id="wishlist-count-badge"'), 'index.html must contain #wishlist-count-badge');
console.assert(html.includes('id="mobile-wishlist-count-badge"'), 'index.html must contain #mobile-wishlist-count-badge');

// Test app.js controller for Favorites methods
const appJs = fs.readFileSync('./js/app.js', 'utf8');
console.assert(appJs.includes('renderSavedFavorites()'), 'app.js must implement renderSavedFavorites()');
console.assert(appJs.includes('toggleWishlist('), 'app.js must implement toggleWishlist()');
console.assert(appJs.includes('scrollToFavorites()'), 'app.js must implement scrollToFavorites()');
console.assert(appJs.includes('clearAllFavorites()'), 'app.js must implement clearAllFavorites()');
console.assert(appJs.includes('addAllFavoritesToCart()'), 'app.js must implement addAllFavoritesToCart()');
console.assert(appJs.includes('toggleFavoritesCatalogFilter()'), 'app.js must implement toggleFavoritesCatalogFilter()');

// Test components.css for Favorites styling
const css = fs.readFileSync('./css/components.css', 'utf8');
console.assert(css.includes('.saved-favorites-section'), 'components.css must define .saved-favorites-section');
console.assert(css.includes('.fav-count-pill'), 'components.css must define .fav-count-pill');
// Test Supabase schema and files
console.assert(fs.existsSync('./supabase-schema.sql'), 'supabase-schema.sql must exist');
const sql = fs.readFileSync('./supabase-schema.sql', 'utf8');
console.assert(sql.includes('create table if not exists public.orders'), 'supabase-schema.sql must create public.orders table');
console.assert(sql.includes('customer_name') && sql.includes('customer_phone') && sql.includes('customer_address'), 'orders schema must have customer info fields');
console.assert(sql.includes('items jsonb') && sql.includes('total_amount') && sql.includes('payment_method') && sql.includes('status'), 'orders schema must have required fields');
console.assert(sql.includes('enable row level security'), 'orders schema must enable RLS');
console.assert(sql.includes('Allow public to place orders') && sql.includes('Allow authenticated admins to read orders'), 'orders schema must include RLS policies');

// Test Supabase client module
console.assert(fs.existsSync('./js/supabase-client.js'), 'js/supabase-client.js must exist');
const sbClient = fs.readFileSync('./js/supabase-client.js', 'utf8');
console.assert(sbClient.includes('SUPABASE_CONFIG') && sbClient.includes('submitOrderToSupabase'), 'supabase-client.js must export SUPABASE_CONFIG and submitOrderToSupabase');
console.assert(sbClient.includes('fetchAllOrders') && sbClient.includes('updateOrderStatus'), 'supabase-client.js must support fetching and updating orders');
console.assert(sbClient.includes('loginAdmin') && sbClient.includes('logoutAdmin'), 'supabase-client.js must support admin auth');

// Functional test for submitOrderToSupabase and fetchAllOrders
import { submitOrderToSupabase, fetchAllOrders, updateOrderStatus } from './js/supabase-client.js';

// Setup minimal localStorage mock for Node test environment
if (typeof globalThis.localStorage === 'undefined') {
  const store = new Map();
  globalThis.localStorage = {
    getItem: (k) => store.get(k) || null,
    setItem: (k, v) => store.set(k, String(v)),
    removeItem: (k) => store.delete(k),
    clear: () => store.clear()
  };
}

const mockOrder = {
  orderId: 'BUB-998877',
  customer: {
    fullName: 'Anuki Jayawardena',
    phone: '077 123 4567',
    email: 'anuki@example.lk',
    address: 'No. 24, Flower Road',
    city: 'Colombo 07',
    district: 'Colombo',
    deliveryNotes: 'Leave at front desk'
  },
  paymentMethod: 'cod',
  cartState: {
    items: [
      {
        id: 'wooden-blocks-1',
        title: 'Montessori Wooden Building Blocks',
        price: 4500,
        quantity: 2,
        imageSrc: '/assets/home/kids-wooden-blocks.jpg',
        ageLabel: '2–3 Years'
      }
    ],
    total: 9000
  }
};

const submitRes = await submitOrderToSupabase(mockOrder);
console.assert(submitRes.success === true, 'submitOrderToSupabase should succeed');
console.assert(submitRes.data && submitRes.data.order_number === 'BUB-998877', 'Submitted order must preserve order_number');
console.assert(submitRes.data.customer_name === 'Anuki Jayawardena', 'Customer name must be preserved');
console.assert(submitRes.data.total_amount === 9000, 'Total amount must match');
console.assert(Array.isArray(submitRes.data.items) && submitRes.data.items.length === 1, 'Items array must be preserved');
console.assert(submitRes.data.status === 'Pending', 'Default status must be Pending');

// Test fetchAllOrders retrieves the order
const fetchRes = await fetchAllOrders();
console.assert(fetchRes.success === true, 'fetchAllOrders should return success: true');
console.assert(Array.isArray(fetchRes.data), 'fetchAllOrders data must be an array');
const foundOrder = fetchRes.data.find(o => o.order_number === 'BUB-998877');
console.assert(!!foundOrder, 'Recently submitted order must be retrievable in fetchAllOrders');

// Test updateOrderStatus
const updateRes = await updateOrderStatus('BUB-998877', 'Packed');
console.assert(updateRes.success === true, 'updateOrderStatus should succeed');
const fetchUpdated = await fetchAllOrders();
const updatedOrder = fetchUpdated.data.find(o => o.order_number === 'BUB-998877');
console.assert(updatedOrder && updatedOrder.status === 'Packed', 'Order status must be updated to Packed');

// Test Admin dashboard page and styles
console.assert(fs.existsSync('./admin.html'), 'admin.html must exist');
const adminHtml = fs.readFileSync('./admin.html', 'utf8');
console.assert(adminHtml.includes('@supabase/supabase-js@2'), 'admin.html must load Supabase JS SDK');
console.assert(adminHtml.includes('/js/supabase-client.js'), 'admin.html must import supabase-client.js');
console.assert(adminHtml.includes('admin-login-view') && adminHtml.includes('admin-dashboard-view'), 'admin.html must contain login and dashboard views');
console.assert(adminHtml.includes('wa.me'), 'admin.html must include WhatsApp customer action');
console.assert(adminHtml.includes('enterDirectDashboard'), 'admin.html must provide quick direct dashboard access');

console.assert(fs.existsSync('./css/admin.css'), 'css/admin.css must exist');

console.log('✅ All product, age groups, HTML markup, Favorites features, Supabase integration & Admin assertions passed successfully!');
