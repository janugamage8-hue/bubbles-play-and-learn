// ==============================================================================
// Bubbles Play & Learn Co. - Supabase Client & Order Service
// ==============================================================================

// ------------------------------------------------------------------------------
// 🔑 SUPABASE CREDENTIALS CONFIGURATION
// Replace the placeholders below with your Supabase Project credentials:
// 1. Go to https://supabase.com/dashboard and select your project.
// 2. Open Project Settings -> API.
// 3. Copy the "Project URL" into SUPABASE_URL.
// 4. Copy the "anon public" key into SUPABASE_ANON_KEY.
// ------------------------------------------------------------------------------
export const SUPABASE_CONFIG = {
  // Replace with your Supabase Project URL (e.g. 'https://xyzabcdef.supabase.co')
  url: 'https://pneehcnweuvsyjtkvkwp.supabase.co',

  // Replace with your Supabase anon/public key (long string starting with eyJhbGci...)
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBuZWVoY253ZXV2c3lqdGt2a3dwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA3NDI4NTIsImV4cCI6MjEwNjMxODg1Mn0.Zlfk7A5mKy8MqV5GWtwYcJrLqfTbAl_8LNPDPwPuH-o'
};

// Check if developer has replaced placeholders or provided dynamic keys in localStorage
export function getActiveCredentials() {
  const localUrl = typeof localStorage !== 'undefined' ? localStorage.getItem('BUBBLES_SUPABASE_URL') : null;
  const localKey = typeof localStorage !== 'undefined' ? localStorage.getItem('BUBBLES_SUPABASE_ANON_KEY') : null;

  const url = (localUrl && localUrl.trim()) || SUPABASE_CONFIG.url;
  const anonKey = (localKey && localKey.trim()) || SUPABASE_CONFIG.anonKey;

  const isConfigured = 
    Boolean(url) && 
    !url.includes('YOUR_SUPABASE_PROJECT_ID') &&
    Boolean(anonKey) && 
    !anonKey.includes('YOUR_SUPABASE_ANON_KEY');

  return { url, anonKey, isConfigured };
}

export function isSupabaseConfigured() {
  return getActiveCredentials().isConfigured;
}

// Global Supabase client instance singleton
let clientInstance = null;

export function getSupabaseClient() {
  if (clientInstance) return clientInstance;

  const { url, anonKey, isConfigured } = getActiveCredentials();
  if (!isConfigured) return null;

  // Resolve createClient function from window.supabase or ESM
  const createClientFn = (typeof window !== 'undefined' && window.supabase && window.supabase.createClient) 
    ? window.supabase.createClient 
    : null;

  if (createClientFn) {
    try {
      clientInstance = createClientFn(url, anonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true
        }
      });
      return clientInstance;
    } catch (err) {
      console.error('Failed to create Supabase client instance:', err);
      return null;
    }
  }

  console.warn('⚠️ Supabase JS library not loaded yet. Make sure the Supabase CDN script is present in <head>.');
  return null;
}

// ==============================================================================
// 💾 PERSISTENT LOCAL ORDER BACKUP (Ensures no order is ever lost)
// ==============================================================================

const LOCAL_ORDERS_STORAGE_KEY = 'BUBBLES_ORDERS_HISTORY';

export function getLocalOrders() {
  if (typeof localStorage === 'undefined') return [];
  try {
    const raw = localStorage.getItem(LOCAL_ORDERS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.warn('Failed to parse local orders history:', e);
    return [];
  }
}

export function saveLocalOrderBackup(orderRecord) {
  if (typeof localStorage === 'undefined' || !orderRecord) return;
  try {
    const current = getLocalOrders();
    const orderKey = orderRecord.order_number || orderRecord.id;
    // Check if already stored
    const existingIndex = current.findIndex(o => (o.order_number && o.order_number === orderKey) || (o.id && o.id === orderKey));
    if (existingIndex >= 0) {
      current[existingIndex] = { ...current[existingIndex], ...orderRecord };
    } else {
      current.unshift(orderRecord);
    }
    // Limit to latest 100 orders in localStorage
    localStorage.setItem(LOCAL_ORDERS_STORAGE_KEY, JSON.stringify(current.slice(0, 100)));
  } catch (e) {
    console.warn('Failed to save order to local storage backup:', e);
  }
}

// ==============================================================================
// 📦 ORDERS SERVICE API
// ==============================================================================

/**
 * Inserts a customer order into the Supabase `orders` table.
 * @param {Object} orderData Formatted order object
 * @returns {Promise<{success: boolean, data?: Object, error?: string, isDemo?: boolean}>}
 */
export async function submitOrderToSupabase(orderData) {
  const client = getSupabaseClient();
  const customer = orderData.customer || {};
  const cartState = orderData.cartState || {};
  const itemsList = Array.isArray(cartState.items) ? cartState.items : [];

  const fullAddress = customer.address 
    ? `${customer.address}${customer.city ? ', ' + customer.city : ''}`
    : (customer.city || 'Sri Lanka');

  const formattedItems = itemsList.map(item => ({
    id: item.id || 'item',
    title: item.title || 'Educational Toy',
    price: Number(item.price) || 0,
    quantity: Number(item.quantity) || 1,
    isCustomBox: Boolean(item.isCustomBox),
    customData: item.customData || null,
    imageSrc: item.imageSrc || null,
    ageLabel: item.ageLabel || null
  }));

  const orderNumber = orderData.orderId || ('BUB-' + Math.floor(100000 + Math.random() * 900000));

  // Full payload with all convenience fields
  const fullPayload = {
    order_number: orderNumber,
    customer_name: customer.fullName || customer.name || 'Valued Customer',
    customer_phone: customer.phone || '',
    customer_email: customer.email || null,
    customer_address: fullAddress,
    district: customer.district || 'Colombo',
    delivery_notes: customer.deliveryNotes || '',
    items: formattedItems,
    total_amount: Number(cartState.total) || 0,
    payment_method: orderData.paymentMethod || 'cod',
    status: 'Pending'
  };

  // Minimal core payload (in case user table only has basic schema without order_number)
  const corePayload = {
    customer_name: fullPayload.customer_name,
    customer_phone: fullPayload.customer_phone,
    customer_address: fullPayload.customer_address,
    district: fullPayload.district,
    items: fullPayload.items,
    total_amount: fullPayload.total_amount,
    payment_method: fullPayload.payment_method,
    status: fullPayload.status
  };

  if (!client) {
    console.info('ℹ️ Supabase credentials not set or client unavailable. Storing order locally.');
    const demoOrder = {
      ...fullPayload,
      id: 'local-' + Date.now(),
      created_at: new Date().toISOString(),
      isLocalOnly: true
    };
    saveLocalOrderBackup(demoOrder);
    return {
      success: true,
      isDemo: true,
      data: demoOrder,
      order: orderData,
      message: 'Demo Mode: Order placed locally. Connect Supabase credentials in js/supabase-client.js for cloud persistence.'
    };
  }

  try {
    // Helper to insert with select/minimal fallback
    async function tryInsert(p) {
      const res = await client.from('orders').insert([p]).select();
      if (!res.error) return res;

      // If select failed (often due to RLS select restrictions on anon), try minimal insert
      if (res.error && res.error.code !== 'PGRST204') {
        const minRes = await client.from('orders').insert([p]);
        if (!minRes.error) return { data: [p], error: null };
      }
      return res;
    }

    let insertRes = await tryInsert(fullPayload);

    // If failed due to a missing column (e.g. order_number or customer_email not yet migrated in Supabase):
    if (insertRes.error && (insertRes.error.code === 'PGRST204' || (insertRes.error.message && insertRes.error.message.includes('column')))) {
      console.warn('Full schema insert failed due to column mismatch. Retrying with core schema columns...');
      insertRes = await tryInsert(corePayload);
    }

    if (insertRes.error) {
      console.error('❌ Supabase order submission error:', insertRes.error);
      // Preserve order in local storage backup so the customer/store never loses it!
      const offlineRecord = {
        ...fullPayload,
        id: 'offline-' + Date.now(),
        created_at: new Date().toISOString(),
        isLocalOnly: true,
        syncStatus: 'pending_sync',
        errorNotice: insertRes.error.message
      };
      saveLocalOrderBackup(offlineRecord);
      return { success: false, error: insertRes.error.message, data: offlineRecord };
    }

    const savedOrderData = (insertRes.data && insertRes.data[0]) 
      ? { ...fullPayload, ...insertRes.data[0] }
      : { ...fullPayload, id: 'supa-' + Date.now(), created_at: new Date().toISOString() };

    // Persist to local backup history as verified saved
    saveLocalOrderBackup(savedOrderData);

    return { success: true, data: savedOrderData };
  } catch (err) {
    console.error('❌ Unexpected error submitting order:', err);
    const offlineRecord = {
      ...fullPayload,
      id: 'offline-' + Date.now(),
      created_at: new Date().toISOString(),
      isLocalOnly: true,
      syncStatus: 'pending_sync'
    };
    saveLocalOrderBackup(offlineRecord);
    return { success: false, error: err.message || 'Network connection failed', data: offlineRecord };
  }
}

/**
 * Synchronizes any pending local offline orders to Supabase cloud.
 * @returns {Promise<{synced: number, failed: number}>}
 */
export async function syncPendingLocalOrders() {
  const client = getSupabaseClient();
  if (!client) return { synced: 0, failed: 0 };

  const localOrders = getLocalOrders();
  let synced = 0;
  let failed = 0;

  for (const order of localOrders) {
    if (order.isLocalOnly || order.syncStatus === 'pending_sync') {
      try {
        const payload = {
          order_number: order.order_number,
          customer_name: order.customer_name,
          customer_phone: order.customer_phone,
          customer_email: order.customer_email || null,
          customer_address: order.customer_address,
          district: order.district,
          delivery_notes: order.delivery_notes || '',
          items: order.items,
          total_amount: Number(order.total_amount) || 0,
          payment_method: order.payment_method || 'cod',
          status: order.status || 'Pending'
        };

        const { error } = await client.from('orders').insert([payload]);
        if (!error) {
          order.isLocalOnly = false;
          order.syncStatus = 'synced';
          synced++;
        } else {
          failed++;
        }
      } catch (e) {
        failed++;
      }
    }
  }

  if (synced > 0) {
    localStorage.setItem(LOCAL_ORDERS_STORAGE_KEY, JSON.stringify(localOrders));
  }

  return { synced, failed };
}

/**
 * Fetches all orders for the Admin Dashboard.
 * Merges orders from Supabase cloud database and persistent local backups.
 * @param {Object} [filter] Optional filter { status, searchQuery }
 * @returns {Promise<{success: boolean, data?: Array, error?: string, isLocalOnly?: boolean}>}
 */
export async function fetchAllOrders(filter = {}) {
  const client = getSupabaseClient();
  const localOrders = getLocalOrders();

  let remoteOrders = [];
  let fetchError = null;

  if (client) {
    try {
      let query = client
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (filter.status && filter.status !== 'all') {
        query = query.eq('status', filter.status);
      }

      if (filter.searchQuery && filter.searchQuery.trim()) {
        const q = filter.searchQuery.trim();
        query = query.or(`customer_name.ilike.%${q}%,customer_phone.ilike.%${q}%,order_number.ilike.%${q}%,district.ilike.%${q}%`);
      }

      const { data, error } = await query;
      if (error) {
        console.warn('Supabase fetch orders notice:', error.message);
        fetchError = error.message;
      } else if (Array.isArray(data)) {
        remoteOrders = data;
      }
    } catch (err) {
      console.warn('Network error fetching orders from Supabase:', err);
      fetchError = err.message || 'Network request failed';
    }
  }

  // Combine remote orders and local backup orders
  const ordersMap = new Map();

  // Add remote orders first
  remoteOrders.forEach(o => {
    const key = o.order_number || o.id;
    if (key) ordersMap.set(String(key), o);
  });

  // Merge any local orders that are not yet in Supabase
  localOrders.forEach(lo => {
    const key = lo.order_number || lo.id;
    if (key && !ordersMap.has(String(key))) {
      ordersMap.set(String(key), lo);
    }
  });

  const allMergedOrders = Array.from(ordersMap.values()).sort((a, b) => {
    const tA = new Date(a.created_at || 0).getTime();
    const tB = new Date(b.created_at || 0).getTime();
    return tB - tA;
  });

  return {
    success: true,
    data: allMergedOrders,
    remoteCount: remoteOrders.length,
    localCount: localOrders.length,
    error: fetchError
  };
}

/**
 * Updates an order status (e.g. 'Pending' -> 'Packed' -> 'Handed to Courier' -> 'Delivered').
 * @param {string} orderId UUID or order reference of the order
 * @param {string} newStatus New status string
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export async function updateOrderStatus(orderId, newStatus) {
  // Update local storage backup first
  const localOrders = getLocalOrders();
  const target = localOrders.find(o => o.id === orderId || o.order_number === orderId);
  if (target) {
    target.status = newStatus;
    localStorage.setItem(LOCAL_ORDERS_STORAGE_KEY, JSON.stringify(localOrders));
  }

  const client = getSupabaseClient();
  if (!client) {
    return { success: true, isLocal: true };
  }

  try {
    // If orderId is a UUID
    let query = client
      .from('orders')
      .update({ status: newStatus });

    if (String(orderId).includes('-') && String(orderId).length === 36) {
      query = query.eq('id', orderId);
    } else {
      query = query.or(`id.eq.${orderId},order_number.eq.${orderId}`);
    }

    const { error } = await query;
    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

// ==============================================================================
// 🔐 AUTHENTICATION SERVICE (Admin Login / Logout)
// ==============================================================================

export async function loginAdmin(email, password) {
  const client = getSupabaseClient();
  if (!client) {
    return { success: false, error: 'Supabase is not configured yet. Please configure your URL & Key.' };
  }

  try {
    const { data, error } = await client.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true, user: data.user, session: data.session };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

export async function logoutAdmin() {
  const client = getSupabaseClient();
  if (!client) return { success: true };

  try {
    const { error } = await client.auth.signOut();
    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

export async function getAdminSession() {
  const client = getSupabaseClient();
  if (!client) return null;

  try {
    const { data } = await client.auth.getSession();
    return data && data.session ? data.session : null;
  } catch (err) {
    return null;
  }
}

// Attach helper functions to window for universal access across legacy scripts and modules
if (typeof window !== 'undefined') {
  window.bubblesSupabase = {
    SUPABASE_CONFIG,
    getActiveCredentials,
    isSupabaseConfigured,
    getSupabaseClient,
    submitOrderToSupabase,
    fetchAllOrders,
    updateOrderStatus,
    loginAdmin,
    logoutAdmin,
    getAdminSession,
    getLocalOrders,
    saveLocalOrderBackup
  };
}
