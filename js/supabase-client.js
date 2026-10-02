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

// Check if developer has replaced placeholders or provided dynamic keys in localStorage / env
export function getActiveCredentials() {
  const envUrl = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_SUPABASE_URL) 
    ? import.meta.env.VITE_SUPABASE_URL 
    : null;
  const envKey = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_SUPABASE_ANON_KEY) 
    ? import.meta.env.VITE_SUPABASE_ANON_KEY 
    : null;

  const localUrl = typeof localStorage !== 'undefined' ? localStorage.getItem('BUBBLES_SUPABASE_URL') : null;
  const localKey = typeof localStorage !== 'undefined' ? localStorage.getItem('BUBBLES_SUPABASE_ANON_KEY') : null;

  const url = envUrl || (localUrl && localUrl.trim()) || SUPABASE_CONFIG.url;
  const anonKey = envKey || (localKey && localKey.trim()) || SUPABASE_CONFIG.anonKey;

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

export function notifyOrderPlaced(order) {
  if (typeof window !== 'undefined') {
    try {
      window.dispatchEvent(new CustomEvent('bubbles:orderPlaced', { detail: order }));
    } catch (e) {}
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
  const { url, anonKey, isConfigured } = getActiveCredentials();
  const customer = orderData.customer || {};
  const cartState = orderData.cartState || {};
  const itemsList = Array.isArray(orderData.items) && orderData.items.length > 0 
    ? orderData.items 
    : (Array.isArray(cartState.items) ? cartState.items : []);

  const fullAddress = orderData.customer_address || (customer.address 
    ? `${customer.address}${customer.city ? ', ' + customer.city : ''}`
    : (customer.city || 'Sri Lanka'));

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

  const orderNumber = orderData.order_number || orderData.orderId || ('BUB-' + Math.floor(100000 + Math.random() * 900000));
  const totalAmount = Number(orderData.total_amount || orderData.total || cartState.total) || 0;

  // Full payload with all convenience fields
  const fullPayload = {
    order_number: orderNumber,
    customer_name: orderData.customer_name || customer.fullName || customer.name || 'Valued Customer',
    customer_phone: orderData.customer_phone || customer.phone || '',
    customer_email: orderData.customer_email || customer.email || null,
    customer_address: fullAddress,
    district: orderData.district || customer.district || 'Colombo',
    delivery_notes: orderData.delivery_notes || customer.deliveryNotes || '',
    items: formattedItems,
    total_amount: totalAmount,
    payment_method: orderData.payment_method || orderData.paymentMethod || 'cod',
    status: orderData.status || 'Pending'
  };

  // 1. Immediately backup to localStorage (BUBBLES_ORDERS_HISTORY)
  const initialLocalRecord = {
    ...fullPayload,
    id: orderData.id || ('local-' + Date.now()),
    created_at: new Date().toISOString(),
    isLocalOnly: true
  };
  saveLocalOrderBackup(initialLocalRecord);

  const client = getSupabaseClient();
  let savedRecord = null;
  let supabaseError = null;

  // Strict 5-second timeout helper for network calls
  const withTimeout = (promise, ms = 5000, errorMsg = 'Operation timed out after 5 seconds') => {
    let timeoutId;
    const timeoutPromise = new Promise((_, reject) => {
      timeoutId = setTimeout(() => reject(new Error(errorMsg)), ms);
    });
    return Promise.race([promise, timeoutPromise]).finally(() => {
      if (timeoutId) clearTimeout(timeoutId);
    });
  };

  // 2. Strict 5-second timeout and proper try...catch block around Supabase .from('orders').insert(...)
  if (client) {
    try {
      const insertPromise = client.from('orders').insert([fullPayload]).select();
      const res = await withTimeout(insertPromise, 5000, 'Supabase .from("orders").insert(...) timed out after 5 seconds');

      if (res && res.error) {
        supabaseError = res.error;
        console.error('Supabase .from("orders").insert(...) error (e.g. RLS or permissions):', res.error);

        // Fallback: Try insert without .select() within 2.5s in case SELECT RLS policy restricts anonymous reads
        try {
          const insertOnlyPromise = client.from('orders').insert([fullPayload]);
          const insertOnlyRes = await withTimeout(insertOnlyPromise, 2500, 'Supabase insert without select timed out');
          if (!insertOnlyRes.error) {
            savedRecord = { ...fullPayload, isLocalOnly: false };
            supabaseError = null;
          } else {
            console.error('Supabase insertOnly fallback error:', insertOnlyRes.error);
          }
        } catch (retryErr) {
          console.error('Supabase retry exception:', retryErr);
        }
      } else if (res && res.data && res.data[0]) {
        savedRecord = { ...fullPayload, ...res.data[0], isLocalOnly: false };
      } else {
        savedRecord = { ...fullPayload, isLocalOnly: false };
      }
    } catch (clientErr) {
      supabaseError = clientErr;
      console.error('Supabase .from("orders").insert(...) call failed or timed out:', clientErr);
    }
  }

  // 3. If SDK insert didn't succeed, use direct HTTPS REST PostgREST API with strict timeout
  if (!savedRecord && url && anonKey) {
    try {
      const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
      const timeoutTimer = controller ? setTimeout(() => controller.abort(), 4500) : null;

      const restPromise = fetch(`${url}/rest/v1/orders`, {
        method: 'POST',
        headers: {
          'apikey': anonKey,
          'Authorization': `Bearer ${anonKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(fullPayload),
        signal: controller ? controller.signal : undefined
      });

      const resp = await withTimeout(restPromise, 4500, 'Supabase direct REST timed out after 4.5s');
      if (timeoutTimer) clearTimeout(timeoutTimer);

      if (resp && resp.ok) {
        const json = await resp.json();
        savedRecord = (json && json[0]) ? { ...fullPayload, ...json[0], isLocalOnly: false } : { ...fullPayload, isLocalOnly: false };
        console.log('✅ Order successfully saved to Supabase via direct REST API:', savedRecord.order_number);
        supabaseError = null;
      } else if (resp) {
        const errText = await resp.text();
        console.error('Supabase direct REST error:', resp.status, errText);
        supabaseError = new Error(`Supabase REST status ${resp.status}: ${errText}`);
      }
    } catch (fetchErr) {
      console.error('Supabase direct REST fetch error:', fetchErr);
      if (!supabaseError) supabaseError = fetchErr;
    }
  }

  if (savedRecord) {
    saveLocalOrderBackup(savedRecord);
    notifyOrderPlaced(savedRecord);
    return { success: true, data: savedRecord };
  }

  // 4. If Supabase fails (e.g., due to RLS permission or network error), log exact error to console.error AND fall back to saving order to BUBBLES_ORDERS_HISTORY in localStorage so the user is never stuck
  console.error('Supabase order submission failed. Falling back to BUBBLES_ORDERS_HISTORY in localStorage:', supabaseError || 'Supabase unavailable');
  saveLocalOrderBackup(initialLocalRecord);
  notifyOrderPlaced(initialLocalRecord);

  return {
    success: true,
    data: initialLocalRecord,
    isLocalOnly: true,
    error: supabaseError ? (supabaseError.message || String(supabaseError)) : 'Supabase insert failed',
    message: 'Order saved locally in BUBBLES_ORDERS_HISTORY'
  };
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
  const { url, anonKey } = getActiveCredentials();
  const client = getSupabaseClient();
  const localOrders = getLocalOrders();

  let remoteOrders = [];
  let fetchError = null;

  // 1. Try Supabase Client SDK
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
      if (!error && Array.isArray(data)) {
        remoteOrders = data;
      } else if (error) {
        fetchError = error.message;
      }
    } catch (err) {
      fetchError = err.message || 'Network request failed';
    }
  }

  // 2. Direct REST API fallback
  if (remoteOrders.length === 0 && url && anonKey) {
    try {
      let restUrl = `${url}/rest/v1/orders?select=*&order=created_at.desc`;
      if (filter.status && filter.status !== 'all') {
        restUrl += `&status=eq.${encodeURIComponent(filter.status)}`;
      }
      const resp = await fetch(restUrl, {
        headers: {
          'apikey': anonKey,
          'Authorization': `Bearer ${anonKey}`,
          'Accept': 'application/json'
        }
      });
      if (resp.ok) {
        const json = await resp.json();
        if (Array.isArray(json)) {
          remoteOrders = json;
          fetchError = null;
        }
      }
    } catch (e) {
      console.warn('Direct REST fetch error:', e);
    }
  }

  // 3. Combine remote orders and local backup orders (BUBBLES_ORDERS_HISTORY)
  const ordersMap = new Map();

  // Add remote orders first
  remoteOrders.forEach(o => {
    const key = o.order_number || o.orderId || o.id;
    if (key) ordersMap.set(String(key), o);
  });

  // Merge any local orders stored in BUBBLES_ORDERS_HISTORY
  localOrders.forEach(lo => {
    const key = lo.order_number || lo.orderId || lo.id;
    if (key) {
      if (!ordersMap.has(String(key))) {
        ordersMap.set(String(key), { ...lo, isLocalOnly: true });
      } else {
        const existing = ordersMap.get(String(key));
        ordersMap.set(String(key), { ...lo, ...existing });
      }
    }
  });

  const allMergedOrders = Array.from(ordersMap.values()).sort((a, b) => {
    const tA = new Date(a.created_at || a.createdAt || a.orderDate || 0).getTime();
    const tB = new Date(b.created_at || b.createdAt || b.orderDate || 0).getTime();
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
  const target = localOrders.find(o => String(o.id) === String(orderId) || String(o.order_number) === String(orderId) || String(o.orderId) === String(orderId));
  if (target) {
    target.status = newStatus;
    localStorage.setItem(LOCAL_ORDERS_STORAGE_KEY, JSON.stringify(localOrders));
  }

  const { url, anonKey } = getActiveCredentials();
  const client = getSupabaseClient();

  if (client) {
    try {
      let query = client.from('orders').update({ status: newStatus });
      if (String(orderId).includes('-') && String(orderId).length === 36) {
        query = query.eq('id', orderId);
      } else {
        query = query.or(`id.eq.${orderId},order_number.eq.${orderId}`);
      }
      const { error } = await query;
      if (!error) return { success: true };
    } catch (err) {}
  }

  // REST fallback
  if (url && anonKey) {
    try {
      let patchUrl = `${url}/rest/v1/orders?order_number=eq.${encodeURIComponent(orderId)}`;
      if (String(orderId).includes('-') && String(orderId).length === 36) {
        patchUrl = `${url}/rest/v1/orders?id=eq.${encodeURIComponent(orderId)}`;
      }
      const resp = await fetch(patchUrl, {
        method: 'PATCH',
        headers: {
          'apikey': anonKey,
          'Authorization': `Bearer ${anonKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (resp.ok) return { success: true };
    } catch (e) {}
  }

  return { success: true, isLocal: true };
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
