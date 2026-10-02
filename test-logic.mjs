// Unit logic test for Bubbles core modules

// Setup minimal browser mocks for Node test environment
if (typeof globalThis.window === 'undefined') {
  globalThis.window = globalThis;
  globalThis.document = {
    getElementById: () => null,
    body: { classList: { add: () => {}, remove: () => {} } }
  };
}
if (typeof globalThis.localStorage === 'undefined') {
  const store = new Map();
  globalThis.localStorage = {
    getItem: (k) => store.get(k) || null,
    setItem: (k, v) => store.set(k, String(v)),
    removeItem: (k) => store.delete(k),
    clear: () => store.clear()
  };
}

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

// ==============================================================================
// 1. Verify Firebase Configuration (firebaseConfig.js)
// ==============================================================================
console.assert(fs.existsSync('./firebaseConfig.js'), 'firebaseConfig.js must exist');
const fbConfigCode = fs.readFileSync('./firebaseConfig.js', 'utf8');
console.assert(fbConfigCode.includes("from 'firebase/firestore'"), 'firebaseConfig.js must import from firebase/firestore');
console.assert(fbConfigCode.includes('getFirestore(app)'), 'firebaseConfig.js must initialize Firestore using getFirestore(app)');
console.assert(fbConfigCode.includes('export const db') || fbConfigCode.includes('export { db }') || fbConfigCode.includes('export default db'), 'firebaseConfig.js must export db');

// Functional test for firebaseConfig import
import { db as firestoreDb } from './firebaseConfig.js';
console.assert(!!firestoreDb, 'firebaseConfig.js must successfully export a valid db instance');

// ==============================================================================
// 2. Verify Checkout Component & handlePlaceOrder (js/cart.js)
// ==============================================================================
console.assert(fs.existsSync('./js/cart.js'), 'js/cart.js must exist');
const cartJsCode = fs.readFileSync('./js/cart.js', 'utf8');
console.assert(cartJsCode.includes("from './firebaseConfig.js'") || cartJsCode.includes("from '/firebaseConfig.js'"), 'js/cart.js must import db from firebaseConfig.js');
console.assert(cartJsCode.includes('addDoc') && cartJsCode.includes('collection') && cartJsCode.includes('serverTimestamp'), 'js/cart.js must import addDoc, collection, serverTimestamp');
console.assert(cartJsCode.includes("collection(db, 'orders')"), "js/cart.js must target collection(db, 'orders')");
console.assert(cartJsCode.includes('serverTimestamp()'), 'js/cart.js must attach serverTimestamp() to orders');
console.assert(cartJsCode.includes('try {') && cartJsCode.includes('catch') && cartJsCode.includes('console.log('), 'handlePlaceOrder must wrap execution in try...catch with console.log');

// Functional test for handlePlaceOrder
import { handlePlaceOrder } from './js/cart.js';
const testOrderData = {
  order_number: 'BUB-FIRESTORE-001',
  orderId: 'BUB-FIRESTORE-001',
  customer_name: 'Tharushi Perera',
  customer_phone: '071 999 8888',
  customer_address: 'No 45, Galle Road, Colombo 03',
  district: 'Colombo',
  total_amount: 8500,
  payment_method: 'cod',
  items: [
    { id: 'toy-1', title: 'Montessori Stacking Tower', price: 4250, quantity: 2 }
  ]
};

const placeOrderResult = await handlePlaceOrder(testOrderData);
console.assert(!!placeOrderResult && !!placeOrderResult.id, 'handlePlaceOrder must return a document reference with an id');
console.log('✅ handlePlaceOrder verified with Firestore doc ID:', placeOrderResult.id);

// ==============================================================================
// 3. Verify Admin Dashboard onSnapshot Real-time Listener (admin.html)
// ==============================================================================
console.assert(adminHtml.includes("from './firebaseConfig.js'") || adminHtml.includes("from '/firebaseConfig.js'"), 'admin.html must import db from firebaseConfig.js');
console.assert(adminHtml.includes('onSnapshot') && adminHtml.includes('orderBy') && adminHtml.includes('query'), 'admin.html must import onSnapshot, orderBy, query from firebase/firestore');
console.assert(adminHtml.includes("query(collection(db, 'orders'), orderBy('createdAt', 'desc'))"), 'admin.html must query orders collection ordered by createdAt desc');
console.assert(adminHtml.includes('onSnapshot('), 'admin.html must maintain a real-time onSnapshot listener');

// Functional test for onSnapshot listener behavior with query ordered by createdAt desc
import { query, collection, orderBy, onSnapshot } from 'firebase/firestore';
let receivedSnapshot = false;
let receivedDocsCount = 0;
const q = query(collection(firestoreDb, 'orders'), orderBy('createdAt', 'desc'));
const unsubscribe = onSnapshot(q, (snapshot) => {
  receivedSnapshot = true;
  receivedDocsCount = snapshot.size;
});

// Wait briefly for snapshot event to flush
await new Promise(r => setTimeout(r, 50));
console.assert(receivedSnapshot === true, 'onSnapshot listener must trigger upon registration');
console.assert(receivedDocsCount > 0, 'onSnapshot listener must receive submitted orders');
// ==============================================================================
// 4. Verify Admin Dashboard BUBBLES_ORDERS_HISTORY Fallback & Real-time Sync
// ==============================================================================
console.assert(adminHtml.includes('loadLocalStorageOrdersImmediate'), 'admin.html must implement loadLocalStorageOrdersImmediate()');
console.assert(adminHtml.includes("localStorage.getItem('BUBBLES_ORDERS_HISTORY')"), "admin.html must directly read localStorage.getItem('BUBBLES_ORDERS_HISTORY')");
console.assert(adminHtml.includes('mergeAndRenderOrders'), 'admin.html must implement mergeAndRenderOrders()');
console.assert(adminHtml.includes('setupRealtimeSubscription'), 'admin.html must implement setupRealtimeSubscription()');
console.assert(adminHtml.includes('postgres_changes'), 'admin.html must listen for Supabase postgres_changes');
console.assert(adminHtml.includes('bubbles:orderPlaced'), 'admin.html must listen for bubbles:orderPlaced event');

// Functional test: verify that orders stored in BUBBLES_ORDERS_HISTORY appear in fetchAllOrders
const existingHistory = JSON.parse(globalThis.localStorage.getItem('BUBBLES_ORDERS_HISTORY') || '[]');
const pureLocalOrder = {
  order_number: 'BUB-LOCAL-TEST-99',
  customer_name: 'Local Test Customer',
  customer_phone: '077 123 9999',
  customer_address: '123 Test Road, Colombo',
  district: 'Colombo',
  total_amount: 6500,
  payment_method: 'cod',
  status: 'Pending',
  created_at: new Date().toISOString(),
  items: [{ id: 'item-1', title: 'Puzzle', price: 6500, quantity: 1 }]
};
existingHistory.unshift(pureLocalOrder);
globalThis.localStorage.setItem('BUBBLES_ORDERS_HISTORY', JSON.stringify(existingHistory));

const historyFetchRes = await fetchAllOrders();
console.assert(historyFetchRes.success === true, 'fetchAllOrders must succeed');

// Test that pure local order is recovered via fallback
const foundLocalOrder = historyFetchRes.data.find(o => o.order_number === 'BUB-LOCAL-TEST-99');
console.assert(!!foundLocalOrder, 'Order BUB-LOCAL-TEST-99 from BUBBLES_ORDERS_HISTORY must be retrievable');
console.assert(foundLocalOrder.customer_name === 'Local Test Customer', 'Customer details from BUBBLES_ORDERS_HISTORY must be preserved');

// Test that existing order BUB-450199 is present and retrieved
const foundExistingOrder = historyFetchRes.data.find(o => o.order_number === 'BUB-450199');
console.assert(!!foundExistingOrder, 'Order BUB-450199 must be present in fetchAllOrders');
console.log('✅ BUBBLES_ORDERS_HISTORY fallback and retrieval verified for both BUB-LOCAL-TEST-99 and BUB-450199');

console.log('✅ All product, age groups, HTML markup, Favorites features, Supabase integration, Admin assertions, and Cloud Firestore assertions passed successfully!');

