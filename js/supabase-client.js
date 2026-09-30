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
    clientInstance = createClientFn(url, anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true
      }
    });
    return clientInstance;
  }

  console.warn('⚠️ Supabase JS library not loaded yet. Make sure the Supabase CDN script is present in <head>.');
  return null;
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

  if (!client) {
    console.info('ℹ️ Supabase credentials not set or client unavailable. Falling back to local offline order receipt.');
    return {
      success: true,
      isDemo: true,
      order: orderData,
      message: 'Demo Mode: Order placed locally. Connect Supabase credentials in js/supabase-client.js for cloud persistence.'
    };
  }

  try {
    // Map application order format to database schema columns
    const payload = {
      order_number: orderData.orderId,
      customer_name: orderData.customer.fullName,
      customer_phone: orderData.customer.phone,
      customer_email: orderData.customer.email || null,
      customer_address: `${orderData.customer.address}, ${orderData.customer.city}`,
      district: orderData.customer.district,
      delivery_notes: orderData.customer.deliveryNotes || '',
      items: orderData.cartState.items.map(item => ({
        id: item.id,
        title: item.title,
        price: item.price,
        quantity: item.quantity,
        isCustomBox: Boolean(item.isCustomBox),
        customData: item.customData || null,
        imageSrc: item.imageSrc || null,
        ageLabel: item.ageLabel || null
      })),
      total_amount: Number(orderData.cartState.total),
      payment_method: orderData.paymentMethod,
      status: 'Pending'
    };

    const { data, error } = await client
      .from('orders')
      .insert([payload])
      .select()
      .single();

    if (error) {
      console.error('❌ Supabase order submission error:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (err) {
    console.error('❌ Unexpected error submitting order:', err);
    return { success: false, error: err.message || 'Network connection failed' };
  }
}

/**
 * Fetches all orders for the Admin Dashboard (requires authenticated admin).
 * @param {Object} [filter] Optional filter { status, searchQuery }
 * @returns {Promise<{success: boolean, data?: Array, error?: string}>}
 */
export async function fetchAllOrders(filter = {}) {
  const client = getSupabaseClient();
  if (!client) {
    return { success: false, error: 'Supabase client is not configured. Please enter your credentials.' };
  }

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
      return { success: false, error: error.message };
    }
    return { success: true, data: data || [] };
  } catch (err) {
    return { success: false, error: err.message || 'Failed to fetch orders' };
  }
}

/**
 * Updates an order status (e.g. 'Pending' -> 'Packed' -> 'Handed to Courier' -> 'Delivered').
 * @param {string} orderId UUID of the order
 * @param {string} newStatus New status string
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export async function updateOrderStatus(orderId, newStatus) {
  const client = getSupabaseClient();
  if (!client) {
    return { success: false, error: 'Supabase client is not configured' };
  }

  try {
    const { error } = await client
      .from('orders')
      .update({ status: newStatus })
      .eq('id', orderId);

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
    getAdminSession
  };
}
