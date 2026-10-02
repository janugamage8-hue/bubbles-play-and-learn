import { generateToySvg, renderProductMedia, PRODUCTS, getProductById } from './products.js';
import { db } from './firebaseConfig.js';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const CART_STORAGE_KEY = 'bubbles_cart_v1';
const PROMO_CODES = {
  'WELCOME10': { discount: 0.10, label: '10% Welcome Discount' },
  'FREESHIP': { freeShipping: true, label: 'Free Islandwide Sri Lanka Delivery' }
};

class CartManager {
  constructor() {
    this.cart = this.loadCart();
    this.promoCode = null;
    this.appliedPromo = null;
    this.isGiftWrap = false;
    this.giftMessage = '';
    this.listeners = [];
  }

  loadCart() {
    try {
      if (typeof localStorage === 'undefined') return [];
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      const items = saved ? JSON.parse(saved) : [];
      return items.map(item => {
        if (!item.imageSrc && !item.isCustomBox) {
          const fullProd = typeof getProductById === 'function' ? getProductById(item.id) : ((typeof window !== 'undefined' && window.PRODUCTS) && window.PRODUCTS.find(p => p.id === item.id));
          if (fullProd && fullProd.imageSrc) {
            item.imageSrc = fullProd.imageSrc;
          }
        } else if (!item.imageSrc && item.isCustomBox && item.customData && item.customData.items && item.customData.items[0]) {
          item.imageSrc = item.customData.items[0].imageSrc || '';
        }
        return item;
      });
    } catch (e) {
      console.warn('Failed to parse cart from storage', e);
      return [];
    }
  }

  saveCart() {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(this.cart));
      }
      this.notify();
    } catch (e) {
      console.error('Failed to save cart to storage', e);
    }
  }

  subscribe(listener) {
    this.listeners.push(listener);
    listener(this.getState());
  }

  notify() {
    const state = this.getState();
    this.listeners.forEach(fn => fn(state));
  }

  addItem(product, quantity = 1, customData = null) {
    // If it's a custom box, make sure it has a unique key or unique custom ID
    const cartId = customData ? `custom-box-${Date.now()}` : product.id;
    const existingIndex = this.cart.findIndex(item => item.cartId === cartId);

    if (existingIndex > -1 && !customData) {
      this.cart[existingIndex].quantity += quantity;
    } else {
      const fullProd = product.imageSrc ? product : ((typeof getProductById === 'function' ? getProductById(product.id) : null) || product);
      const resolvedImg = product.imageSrc || fullProd.imageSrc || (customData && customData.items && customData.items[0]?.imageSrc) || '';

      this.cart.push({
        cartId: cartId,
        id: product.id,
        title: product.title,
        price: product.price,
        originalPrice: product.originalPrice || product.price,
        imageSrc: resolvedImg,
        imageType: product.imageType || fullProd.imageType || 'wooden-blocks',
        ageLabel: product.ageLabel || fullProd.ageLabel || '',
        category: product.category || fullProd.category,
        quantity: quantity,
        isCustomBox: !!customData,
        customData: customData // items inside custom box, child name, message
      });
    }

    this.saveCart();
    this.showToast(`Added "${product.title}" to your cart!`, 'success');
  }

  removeItem(cartId) {
    const item = this.cart.find(i => i.cartId === cartId);
    this.cart = this.cart.filter(item => item.cartId !== cartId);
    this.saveCart();
    if (item) {
      this.showToast(`Removed "${item.title}" from cart.`, 'info');
    }
  }

  updateQuantity(cartId, quantity) {
    const item = this.cart.find(i => i.cartId === cartId);
    if (item) {
      if (quantity <= 0) {
        this.removeItem(cartId);
      } else {
        item.quantity = quantity;
        this.saveCart();
      }
    }
  }

  clearCart() {
    this.cart = [];
    this.appliedPromo = null;
    this.promoCode = null;
    this.isGiftWrap = false;
    this.giftMessage = '';
    this.saveCart();
  }

  applyPromo(code) {
    const cleanCode = (code || '').trim().toUpperCase();
    if (!cleanCode) {
      return { success: false, message: 'Please enter a coupon code.' };
    }

    if (PROMO_CODES[cleanCode]) {
      this.appliedPromo = PROMO_CODES[cleanCode];
      this.promoCode = cleanCode;
      this.notify();
      this.showToast(`Coupon "${cleanCode}" applied! ${this.appliedPromo.label}`, 'success');
      return { success: true, message: `Coupon applied: ${this.appliedPromo.label}` };
    } else {
      return { success: false, message: 'Invalid coupon code. Try "WELCOME10"!' };
    }
  }

  removePromo() {
    this.appliedPromo = null;
    this.promoCode = null;
    this.notify();
    this.showToast('Coupon code removed.', 'info');
  }

  setGiftWrap(enabled, message = '') {
    this.isGiftWrap = enabled;
    this.giftMessage = message;
    this.notify();
  }

  getState() {
    const count = this.cart.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const originalSubtotal = this.cart.reduce((sum, item) => sum + ((item.originalPrice || item.price) * item.quantity), 0);

    let discount = 0;
    if (this.appliedPromo && this.appliedPromo.discount) {
      discount = Math.round(subtotal * this.appliedPromo.discount);
    }

    const freeShippingThreshold = 8000;
    const isFreeDelivery = subtotal >= freeShippingThreshold || (this.appliedPromo && this.appliedPromo.freeShipping);
    const shippingFee = (count === 0 || isFreeDelivery) ? 0 : 450;
    const giftWrapFee = this.isGiftWrap && count > 0 ? 350 : 0;
    const total = Math.max(0, subtotal - discount + shippingFee + giftWrapFee);
    const totalSavings = (originalSubtotal - subtotal) + discount;

    return {
      items: this.cart,
      count,
      subtotal,
      originalSubtotal,
      discount,
      promoCode: this.promoCode,
      appliedPromo: this.appliedPromo,
      shippingFee,
      isFreeDelivery,
      freeShippingThreshold,
      amountNeededForFreeShipping: Math.max(0, freeShippingThreshold - subtotal),
      isGiftWrap: this.isGiftWrap,
      giftMessage: this.giftMessage,
      giftWrapFee,
      total,
      totalSavings
    };
  }

  showToast(message, type = 'info') {
    window.dispatchEvent(new CustomEvent('bubbles:toast', {
      detail: { message, type }
    }));
  }
}

export const cartManager = new CartManager();

// Render Cart Drawer
export function renderCartDrawer() {
  const drawerContainer = document.getElementById('cart-drawer-container');
  if (!drawerContainer) return;

  const state = cartManager.getState();

  const freeDeliveryProgress = Math.min(100, Math.round((state.subtotal / state.freeShippingThreshold) * 100));

  let itemsHtml = '';
  if (state.items.length === 0) {
    itemsHtml = `
      <div class="cart-empty-state">
        <div class="empty-icon">🫧</div>
        <h3>Your Bubbles Cart is Empty</h3>
        <p>Build your custom developmental box or explore our authentic Sri Lankan wooden toys to fill your child's world with screen-free joy!</p>
        <button class="btn btn-primary" onclick="document.getElementById('cart-drawer').classList.remove('active'); location.href='#build-a-box'">
          Build Your Custom Box
        </button>
      </div>
    `;
  } else {
    itemsHtml = `
      <div class="cart-items-list">
        ${state.items.map(item => {
          let itemImgSrc = item.imageSrc || (typeof getProductById === 'function' && getProductById(item.id)?.imageSrc) || '';
          if (itemImgSrc && !itemImgSrc.startsWith('/') && !itemImgSrc.startsWith('http') && !itemImgSrc.startsWith('data:')) {
            itemImgSrc = '/' + itemImgSrc;
          }
          const isBox = item.isCustomBox && item.customData && item.customData.items && item.customData.items.length > 0;

          return `
          <div class="cart-item-card" data-cart-id="${item.cartId}">
            <div class="cart-item-thumb ${isBox ? 'custom-box-thumb' : ''}">
              ${isBox ? `
                <div class="custom-box-thumb-grid">
                  ${item.customData.items.slice(0, 4).map(sub => {
                    let subImg = sub.imageSrc || '';
                    if (subImg && !subImg.startsWith('/') && !subImg.startsWith('http') && !subImg.startsWith('data:')) subImg = '/' + subImg;
                    return `<img src="${subImg}" alt="${sub.title}" class="cart-mini-thumb" onerror="this.style.display='none'">`;
                  }).join('')}
                </div>
                <span class="custom-box-badge">${item.customData.items.length}</span>
              ` : (itemImgSrc ? `
                <img src="${itemImgSrc}" alt="${item.title}" class="cart-item-img toy-photo" loading="lazy" onerror="this.onerror=null; this.outerHTML=window.generateToySvg ? window.generateToySvg('${item.imageType || 'wooden-blocks'}') : '';" />
              ` : renderProductMedia(item, 'cart-item-img'))}
            </div>
            <div class="cart-item-details">
              <div class="cart-item-head">
                <h4 class="cart-item-title">${item.title}</h4>
                <button class="cart-remove-btn" onclick="window.cartManager.removeItem('${item.cartId}')" title="Remove item">&times;</button>
              </div>
              ${item.ageLabel ? `<span class="cart-item-age"><i class="fas fa-child"></i> ${item.ageLabel}</span>` : ''}
              
              ${item.isCustomBox && item.customData ? `
                <div class="custom-box-summary">
                  <small><strong>Personalized for:</strong> ${item.customData.childName || 'Little One'}</small>
                  <div class="custom-box-tags">
                    ${item.customData.items.map(t => `
                      <span class="tag-pill">
                        ${t.imageSrc ? `<img src="${t.imageSrc}" class="tag-pill-img" alt="">` : ''}
                        ${t.title}
                      </span>
                    `).join('')}
                  </div>
                </div>
              ` : ''}

              <div class="cart-item-actions">
                <div class="qty-selector">
                  <button class="qty-btn" onclick="window.cartManager.updateQuantity('${item.cartId}', ${item.quantity - 1})">-</button>
                  <span class="qty-num">${item.quantity}</span>
                  <button class="qty-btn" onclick="window.cartManager.updateQuantity('${item.cartId}', ${item.quantity + 1})">+</button>
                </div>
                <div class="cart-item-price">
                  <span class="current-price">LKR ${(item.price * item.quantity).toLocaleString(undefined, { minimumFractionDigits: (item.price * item.quantity) % 1 === 0 ? 0 : 2, maximumFractionDigits: 2 })}</span>
                  ${item.originalPrice > item.price ? `
                    <span class="old-price">LKR ${(item.originalPrice * item.quantity).toLocaleString(undefined, { minimumFractionDigits: (item.originalPrice * item.quantity) % 1 === 0 ? 0 : 2, maximumFractionDigits: 2 })}</span>
                  ` : ''}
                </div>
              </div>
            </div>
          </div>
          `;
        }).join('')}
      </div>
    `;
  }

  drawerContainer.innerHTML = `
    <div class="cart-drawer-overlay" id="cart-drawer-overlay" onclick="window.closeCartDrawer()"></div>
    <div class="cart-drawer-panel">
      <div class="cart-drawer-header">
        <div class="header-left">
          <h3>Your Play Basket</h3>
          <span class="cart-badge">${state.count} items</span>
        </div>
        <button class="btn-close-drawer" onclick="window.closeCartDrawer()">&times;</button>
      </div>

      <!-- Free Shipping Bar -->
      <div class="free-shipping-tracker">
        ${state.isFreeDelivery ? `
          <div class="free-shipping-msg success">
            <i class="fas fa-check-circle"></i> <strong>Congratulations!</strong> You get FREE Islandwide Sri Lanka Delivery!
          </div>
        ` : `
          <div class="free-shipping-msg">
            Add <strong>LKR ${state.amountNeededForFreeShipping.toLocaleString()}</strong> more for <strong>FREE Islandwide Delivery</strong>
          </div>
        `}
        <div class="progress-bar-track">
          <div class="progress-bar-fill ${state.isFreeDelivery ? 'complete' : ''}" style="width: ${freeDeliveryProgress}%"></div>
        </div>
      </div>

      <!-- Cart Body -->
      <div class="cart-drawer-body">
        ${itemsHtml}
      </div>

      ${state.items.length > 0 ? `
        <!-- Cart Footer -->
        <div class="cart-drawer-footer">
          <!-- Promo Code Input -->
          <div class="promo-box">
            ${state.promoCode ? `
              <div class="applied-promo-tag">
                <span><i class="fas fa-tag"></i> <strong>${state.promoCode}</strong> (${state.appliedPromo.label})</span>
                <button class="btn-remove-promo" onclick="window.cartManager.removePromo()">&times;</button>
              </div>
            ` : `
              <div class="promo-input-group">
                <input type="text" id="cart-promo-input" placeholder="Enter coupon (e.g. WELCOME10)" />
                <button class="btn btn-secondary btn-sm" onclick="window.applyPromoFromInput()">Apply</button>
              </div>
            `}
          </div>

          <!-- Gift wrap toggle -->
          <div class="gift-wrap-option">
            <label class="custom-checkbox">
              <input type="checkbox" id="cart-gift-wrap" ${state.isGiftWrap ? 'checked' : ''} onchange="window.cartManager.setGiftWrap(this.checked)" />
              <span class="checkmark"></span>
              <span class="label-text">
                🎁 Add Eco-Kraft Gift Packaging & Ribbon (+LKR 350)
              </span>
            </label>
          </div>

          <!-- Pricing Breakdown -->
          <div class="cart-summary-breakdown">
            <div class="summary-row">
              <span>Item Price (${state.count} ${state.count === 1 ? 'item' : 'items'})</span>
              <span class="summary-val">LKR ${state.subtotal.toLocaleString(undefined, { minimumFractionDigits: state.subtotal % 1 === 0 ? 0 : 2, maximumFractionDigits: 2 })}</span>
            </div>
            <div class="summary-row">
              <span>Delivery Charge</span>
              <span class="summary-val">${state.shippingFee === 0 ? '<strong class="free-text">FREE</strong>' : `LKR ${state.shippingFee.toLocaleString(undefined, { minimumFractionDigits: state.shippingFee % 1 === 0 ? 0 : 2, maximumFractionDigits: 2 })}`}</span>
            </div>
            ${state.discount > 0 ? `
              <div class="summary-row discount">
                <span>Discount (${state.promoCode})</span>
                <span class="summary-val">- LKR ${state.discount.toLocaleString(undefined, { minimumFractionDigits: state.discount % 1 === 0 ? 0 : 2, maximumFractionDigits: 2 })}</span>
              </div>
            ` : ''}
            ${state.isGiftWrap ? `
              <div class="summary-row">
                <span>Gift Packaging</span>
                <span class="summary-val">LKR ${state.giftWrapFee.toLocaleString(undefined, { minimumFractionDigits: state.giftWrapFee % 1 === 0 ? 0 : 2, maximumFractionDigits: 2 })}</span>
              </div>
            ` : ''}
            <div class="summary-row total-row">
              <div class="total-label-stack">
                <span class="total-heading">Estimated Total</span>
                <span class="total-calc-formula">Item Price + Delivery Charge</span>
              </div>
              <span class="total-amount">LKR ${state.total.toLocaleString(undefined, { minimumFractionDigits: state.total % 1 === 0 ? 0 : 2, maximumFractionDigits: 2 })}</span>
            </div>
            ${state.totalSavings > 0 ? `
              <div class="savings-alert">
                ✨ You are saving <strong>LKR ${state.totalSavings.toLocaleString(undefined, { minimumFractionDigits: state.totalSavings % 1 === 0 ? 0 : 2, maximumFractionDigits: 2 })}</strong> on this order!
              </div>
            ` : ''}
          </div>

          <!-- Checkout Button -->
          <button class="btn btn-primary btn-block btn-lg" onclick="window.openCheckoutModal()">
            Proceed to Checkout <i class="fas fa-arrow-right"></i>
          </button>
          <div class="secure-badge">
            <i class="fas fa-lock"></i> Safe Islandwide Delivery | Cash on Delivery Available
          </div>
        </div>
      ` : ''}
    </div>
  `;
}

// Attach helpers to window for easy inline event triggers
if (typeof window !== 'undefined') {
  window.cartManager = cartManager;

  window.openCartDrawer = function() {
  const drawer = document.getElementById('cart-drawer');
  if (drawer) {
    drawer.classList.add('active');
    document.body.classList.add('no-scroll');
  }
};

window.closeCartDrawer = function() {
  const drawer = document.getElementById('cart-drawer');
  if (drawer) {
    drawer.classList.remove('active');
    document.body.classList.remove('no-scroll');
  }
};

window.applyPromoFromInput = function() {
  const input = document.getElementById('cart-promo-input');
  if (input) {
    const res = cartManager.applyPromo(input.value);
    if (!res.success) {
      alert(res.message);
    }
  }
};

// Checkout modal trigger & complete checkout flow
window.openCheckoutModal = function() {
  window.closeCartDrawer();
  const modalContainer = document.getElementById('checkout-modal-container');
  if (!modalContainer) return;

  const state = cartManager.getState();
  if (state.items.length === 0) return;

  modalContainer.innerHTML = `
    <div class="modal-backdrop" onclick="window.closeCheckoutModal()"></div>
    <div class="checkout-modal-dialog">
      <div class="checkout-modal-header">
        <div>
          <h2>Order Checkout & Delivery</h2>
          <p>Sri Lanka Islandwide Safe Shipping</p>
        </div>
        <button class="btn-close-modal" onclick="window.closeCheckoutModal()">&times;</button>
      </div>

      <div class="checkout-modal-body">
        <form id="bubbles-checkout-form" onsubmit="window.handleCheckoutSubmit(event)">
          <!-- Customer & Contact Info -->
          <div class="checkout-section">
            <h3 class="section-heading"><i class="fas fa-user-circle"></i> 1. Contact Information</h3>
            <div class="form-grid-2">
              <div class="form-group">
                <label>Parent / Buyer Full Name *</label>
                <input type="text" name="fullName" required placeholder="e.g. Kasun Perera" />
              </div>
              <div class="form-group">
                <label>WhatsApp / Mobile Number *</label>
                <input type="tel" name="phone" required placeholder="e.g. 077 123 4567" />
              </div>
            </div>
            <div class="form-group">
              <label>Email Address (For receipt & tracking updates) *</label>
              <input type="email" name="email" required placeholder="kasun@example.lk" />
            </div>
          </div>

          <!-- Sri Lanka Shipping Address -->
          <div class="checkout-section">
            <h3 class="section-heading"><i class="fas fa-truck"></i> 2. Delivery Address (Islandwide)</h3>
            <div class="form-group">
              <label>Street Address / Apartment / House No *</label>
              <input type="text" name="address" required placeholder="No. 45/2, Flower Road" />
            </div>
            <div class="form-grid-2">
              <div class="form-group">
                <label>City / Town *</label>
                <input type="text" name="city" required placeholder="e.g. Colombo 07 / Kandy / Galle" />
              </div>
              <div class="form-group">
                <label>District *</label>
                <select name="district" required>
                  <option value="">Select Sri Lankan District</option>
                  <option value="Colombo" selected>Colombo</option>
                  <option value="Gampaha">Gampaha</option>
                  <option value="Kalutara">Kalutara</option>
                  <option value="Kandy">Kandy</option>
                  <option value="Matale">Matale</option>
                  <option value="Nuwara Eliya">Nuwara Eliya</option>
                  <option value="Galle">Galle</option>
                  <option value="Matara">Matara</option>
                  <option value="Hambantota">Hambantota</option>
                  <option value="Jaffna">Jaffna</option>
                  <option value="Kurunegala">Kurunegala</option>
                  <option value="Puttalam">Puttalam</option>
                  <option value="Anuradhapura">Anuradhapura</option>
                  <option value="Polonnaruwa">Polonnaruwa</option>
                  <option value="Badulla">Badulla</option>
                  <option value="Monaragala">Monaragala</option>
                  <option value="Ratnapura">Ratnapura</option>
                  <option value="Kegalle">Kegalle</option>
                  <option value="Batticaloa">Batticaloa</option>
                  <option value="Ampara">Ampara</option>
                  <option value="Trincomalee">Trincomalee</option>
                </select>
              </div>
            </div>
            <div class="form-group">
              <label>Delivery Instructions (Optional, e.g. landmark or deliver after 4 PM)</label>
              <input type="text" name="deliveryNotes" placeholder="Near Temple Rd junction / leave at reception" />
            </div>
          </div>

          <!-- Payment Methods tailored for Sri Lanka -->
          <div class="checkout-section">
            <h3 class="section-heading"><i class="fas fa-credit-card"></i> 3. Choose Payment Method</h3>
            
            <div class="payment-options-grid">
              <label class="payment-card">
                <input type="radio" name="paymentMethod" value="cod" checked onchange="window.togglePaymentDetails('cod')" />
                <div class="payment-card-content">
                  <div class="payment-icon"><i class="fas fa-hand-holding-usd"></i></div>
                  <div class="payment-title">Cash on Delivery (COD)</div>
                  <div class="payment-desc">Pay cash when courier delivers to your doorstep anywhere in Sri Lanka.</div>
                </div>
              </label>

              <label class="payment-card">
                <input type="radio" name="paymentMethod" value="bank" onchange="window.togglePaymentDetails('bank')" />
                <div class="payment-card-content">
                  <div class="payment-icon"><i class="fas fa-university"></i></div>
                  <div class="payment-title">Direct Bank Transfer / FriMi</div>
                  <div class="payment-desc">Commercial Bank, Sampath, or FriMi transfer with instant slip upload.</div>
                </div>
              </label>

              <label class="payment-card">
                <input type="radio" name="paymentMethod" value="card" onchange="window.togglePaymentDetails('card')" />
                <div class="payment-card-content">
                  <div class="payment-icon"><i class="fas fa-credit-card"></i></div>
                  <div class="payment-title">Credit / Debit Card / Koko</div>
                  <div class="payment-desc">Visa, Mastercard or Pay in 3 Interest-Free Installments with Koko.</div>
                </div>
              </label>
            </div>

            <!-- Dynamic Payment Instructions -->
            <div id="payment-extra-details" class="payment-extra-box">
              <p><strong><i class="fas fa-info-circle"></i> Cash on Delivery:</strong> Please keep exact change ready for the delivery driver upon arrival.</p>
            </div>
          </div>

          <!-- Order Summary Inside Checkout -->
          <div class="checkout-order-summary-box">
            <div class="summary-line">
              <span>Item Price (${state.count} ${state.count === 1 ? 'item' : 'items'})</span>
              <span>LKR ${state.subtotal.toLocaleString(undefined, { minimumFractionDigits: state.subtotal % 1 === 0 ? 0 : 2, maximumFractionDigits: 2 })}</span>
            </div>
            <div class="summary-line">
              <span>Delivery Charge</span>
              <span>${state.shippingFee === 0 ? '<strong class="free-text">FREE</strong>' : `LKR ${state.shippingFee.toLocaleString(undefined, { minimumFractionDigits: state.shippingFee % 1 === 0 ? 0 : 2, maximumFractionDigits: 2 })}`}</span>
            </div>
            ${state.discount > 0 ? `
              <div class="summary-line discount">
                <span>Coupon Discount (${state.promoCode})</span>
                <span>- LKR ${state.discount.toLocaleString(undefined, { minimumFractionDigits: state.discount % 1 === 0 ? 0 : 2, maximumFractionDigits: 2 })}</span>
              </div>
            ` : ''}
            ${state.isGiftWrap ? `
              <div class="summary-line">
                <span>Eco Gift Wrapping</span>
                <span>LKR ${state.giftWrapFee.toLocaleString(undefined, { minimumFractionDigits: state.giftWrapFee % 1 === 0 ? 0 : 2, maximumFractionDigits: 2 })}</span>
              </div>
            ` : ''}
            <div class="summary-line grand-total">
              <div>
                <span>Estimated Total</span>
                <div style="font-size: 0.72rem; color: var(--color-text-muted); font-weight: 500; text-transform: uppercase;">Item Price + Delivery Charge</div>
              </div>
              <span class="total-val">LKR ${state.total.toLocaleString(undefined, { minimumFractionDigits: state.total % 1 === 0 ? 0 : 2, maximumFractionDigits: 2 })}</span>
            </div>
          </div>

          <button type="submit" class="btn btn-primary btn-block btn-lg" id="btn-place-order">
            <i class="fas fa-check-circle"></i> Confirm & Place Order (LKR ${state.total.toLocaleString()})
          </button>
        </form>
      </div>
    </div>
  `;

  document.getElementById('checkout-modal-container').classList.add('active');
  document.body.classList.add('no-scroll');
};

window.closeCheckoutModal = function() {
  const container = document.getElementById('checkout-modal-container');
  if (container) {
    container.classList.remove('active');
    document.body.classList.remove('no-scroll');
  }
};

window.togglePaymentDetails = function(method) {
  const box = document.getElementById('payment-extra-details');
  if (!box) return;

  if (method === 'cod') {
    box.innerHTML = `
      <p><strong><i class="fas fa-info-circle"></i> Cash on Delivery:</strong> Please keep exact cash ready for the courier driver upon arrival at your doorstep.</p>
    `;
  } else if (method === 'bank') {
    box.innerHTML = `
      <div class="bank-details-card">
        <h4><i class="fas fa-university"></i> Bank Transfer Account Details</h4>
        <div class="bank-row"><strong>Bank:</strong> Commercial Bank of Ceylon PLC</div>
        <div class="bank-row"><strong>Account Name:</strong> Bubbles Play & Learn (Pvt) Ltd</div>
        <div class="bank-row"><strong>Account Number:</strong> 8009214482</div>
        <div class="bank-row"><strong>Branch:</strong> Kollupitiya Premier Branch</div>
        <div class="bank-row"><strong>FriMi / Genie ID:</strong> bubbles@frimi</div>
        <p class="bank-note"><small>After completing your transfer, simply enter your reference number or WhatsApp your payment slip to <strong>+94 77 988 2000</strong>.</small></p>
      </div>
    `;
  } else if (method === 'card') {
    box.innerHTML = `
      <div class="card-simulator-box">
        <p><i class="fas fa-shield-alt"></i> 256-Bit SSL Encrypted Card Gateway Simulator</p>
        <div class="form-group" style="margin-bottom:8px">
          <input type="text" placeholder="Card Number: 4532 •••• •••• 8812" value="4532 8901 2345 6789" />
        </div>
        <div class="form-grid-2">
          <input type="text" placeholder="MM/YY" value="08/28" />
          <input type="text" placeholder="CVV" value="892" />
        </div>
        <small class="text-muted">Koko Pay in 3: 3 monthly interest-free payments of LKR ${Math.round(cartManager.getState().total / 3).toLocaleString()}</small>
      </div>
    `;
  }
  };
}

/**
 * Places an order into Cloud Firestore orders collection.
 * Uses addDoc(collection(db, 'orders'), orderData) with serverTimestamp().
 * Wrapped in a try...catch block with console.log.
 * @param {Object} orderData 
 * @returns {Promise<{success: boolean, id: string, data: Object}>}
 */
export async function handlePlaceOrder(orderData) {
  try {
    const docData = {
      ...orderData,
      createdAt: serverTimestamp()
    };
    const docRef = await addDoc(collection(db, 'orders'), docData);
    console.log('Order successfully placed in Firestore with ID:', docRef.id);
    return { success: true, id: docRef.id, data: docData };
  } catch (error) {
    console.log('Error placing order in Firestore:', error);
    throw error;
  }
}

if (typeof window !== 'undefined') {
  window.handlePlaceOrder = handlePlaceOrder;

  window.handleCheckoutSubmit = async function(e) {
  e.preventDefault();
  const form = e.target;
  const submitBtn = document.getElementById('btn-place-order');
  const originalBtnHtml = submitBtn ? submitBtn.innerHTML : '';

  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting Your Order...';
  }

  const formData = new FormData(form);

  const orderId = 'BUB-' + Math.floor(100000 + Math.random() * 900000);
  const fullName = (formData.get('fullName') || '').trim();
  const phone = (formData.get('phone') || '').trim();
  const email = (formData.get('email') || '').trim();
  const address = (formData.get('address') || '').trim();
  const city = (formData.get('city') || '').trim();
  const district = (formData.get('district') || '').trim();
  const deliveryNotes = (formData.get('deliveryNotes') || '').trim();
  const paymentMethod = formData.get('paymentMethod') || 'cod';
  const cartState = cartManager.getState();

  const formattedItems = cartState.items.map(it => ({
    id: it.id,
    title: it.title,
    price: Number(it.price) || 0,
    quantity: Number(it.quantity) || 1,
    isCustomBox: Boolean(it.isCustomBox),
    customData: it.customData || null,
    imageSrc: it.imageSrc || null,
    ageLabel: it.ageLabel || null
  }));

  const orderData = {
    order_number: orderId,
    orderId: orderId,
    orderDate: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
    customer_name: fullName,
    customer_phone: phone,
    customer_email: email,
    customer_address: `${address}${city ? ', ' + city : ''}`,
    district: district,
    delivery_notes: deliveryNotes,
    customer: {
      fullName,
      phone,
      email,
      address,
      city,
      district,
      deliveryNotes
    },
    items: formattedItems,
    total_amount: Number(cartState.total),
    total: Number(cartState.total),
    payment_method: paymentMethod,
    paymentMethod: paymentMethod,
    status: 'Pending',
    cartState: cartState
  };

  try {
    const result = await handlePlaceOrder(orderData);
    console.log('Checkout completed successfully with Firestore result:', result);

    // Also persist to local backup & Supabase if available
    if (window.bubblesSupabase && typeof window.bubblesSupabase.submitOrderToSupabase === 'function') {
      window.bubblesSupabase.submitOrderToSupabase(orderData).catch(err => console.log('Supabase sync note:', err));
    }

    // Success! Clear cart and display order confirmation modal
    cartManager.clearCart();
    window.renderOrderSuccessModal(orderData, { success: true, id: result.id, isFirestore: true });
  } catch (err) {
    console.log('Checkout submission error:', err);
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnHtml;
    }

    // Friendly fallback alert with option to submit directly via WhatsApp
    const shouldWhatsApp = confirm(
      `⚠️ Notice: Could not save order directly to Firestore (${err.message || 'connection issue'}).\n\n` +
      `Would you like to confirm and place your order directly via WhatsApp right now?`
    );

    if (shouldWhatsApp) {
      const itemsSummary = orderData.cartState.items.map(it => `• ${it.title} x${it.quantity} (LKR ${(it.price * it.quantity).toLocaleString()})`).join('\n');
      const text = encodeURIComponent(
        `Hi Bubbles Play & Learn Co.! 🫧\n\n` +
        `I would like to place an order:\n` +
        `🧾 Order Ref: ${orderData.orderId}\n` +
        `👤 Name: ${orderData.customer.fullName}\n` +
        `📞 Phone: ${orderData.customer.phone}\n` +
        `📍 Delivery: ${orderData.customer.address}, ${orderData.customer.city}, ${orderData.customer.district}\n\n` +
        `📦 Items:\n${itemsSummary}\n\n` +
        `💰 Total: LKR ${orderData.cartState.total.toLocaleString()}\n` +
        `💳 Payment: ${orderData.paymentMethod.toUpperCase()}`
      );
      window.open(`https://wa.me/94779882000?text=${text}`, '_blank');
      window.closeCheckoutModal();
      cartManager.clearCart();
    }
  }
};

window.renderOrderSuccessModal = function(order, supabaseResult = null) {
  const container = document.getElementById('checkout-modal-container');
  if (!container) return;

  const paymentLabels = {
    'cod': 'Cash on Delivery (Islandwide)',
    'bank': 'Direct Bank Transfer / FriMi',
    'card': 'Credit / Debit Card / Koko'
  };

  const isCloudSaved = supabaseResult && !supabaseResult.isDemo && supabaseResult.success;
  const isDemo = supabaseResult && supabaseResult.isDemo;

  container.innerHTML = `
    <div class="modal-backdrop" onclick="window.closeCheckoutModal()"></div>
    <div class="checkout-modal-dialog order-success-dialog">
      <div class="order-success-content">
        <div class="success-animation-bubble">🎉</div>
        <h2 class="success-title">Thank You, ${order.customer.fullName}!</h2>
        <p class="success-subtitle">Your Bubbles developmental play order has been received successfully.</p>

        ${isCloudSaved ? `
          <div style="background: #ECFDF5; border: 1px solid #A7F3D0; color: #065F46; padding: 10px 14px; border-radius: 8px; font-size: 0.85rem; margin: 12px 0 16px 0; display: flex; align-items: center; gap: 8px;">
            <i class="fas fa-check-circle" style="color: #10B981; font-size: 1.1rem;"></i>
            <div>
              <strong>Order Confirmed & Saved to Cloud Database!</strong>
              <div style="font-size: 0.78rem; opacity: 0.9;">Your order is securely registered in our system and ready for processing.</div>
            </div>
          </div>
        ` : ''}

        ${isDemo ? `
          <div style="background: #FEF3C7; border: 1px solid #FDE68A; color: #92400E; padding: 10px 14px; border-radius: 8px; font-size: 0.82rem; margin: 12px 0 16px 0; display: flex; align-items: center; gap: 8px; text-align: left;">
            <i class="fas fa-info-circle" style="color: #D97706; font-size: 1.1rem; flex-shrink: 0;"></i>
            <div>
              <strong>Order Recorded (Demo Mode):</strong> Connect your Supabase credentials in <code>js/supabase-client.js</code> or the Admin Portal for cloud synchronization.
            </div>
          </div>
        ` : ''}

        <div class="order-id-badge">
          <span>Order Reference:</span>
          <strong>${order.orderId}</strong>
        </div>

        <div class="order-receipt-card">
          <div class="receipt-header">
            <h4>Bubbles Play & Learn Co. Sri Lanka</h4>
            <span class="receipt-date">${order.orderDate}</span>
          </div>

          <div class="receipt-items-table">
            ${order.cartState.items.map(item => `
              <div class="receipt-item-row">
                <div class="receipt-item-title">
                  <strong>${item.title}</strong> &times; ${item.quantity}
                  ${item.isCustomBox && item.customData ? `<small><br>Personalized for: ${item.customData.childName}</small>` : ''}
                </div>
                <div class="receipt-item-price">LKR ${(item.price * item.quantity).toLocaleString()}</div>
              </div>
            `).join('')}
          </div>

          <div class="receipt-total-block">
            <div class="receipt-line"><span>Subtotal:</span> <span>LKR ${order.cartState.subtotal.toLocaleString()}</span></div>
            ${order.cartState.discount > 0 ? `
              <div class="receipt-line"><span>Discount (${order.cartState.promoCode}):</span> <span>- LKR ${order.cartState.discount.toLocaleString()}</span></div>
            ` : ''}
            ${order.cartState.isGiftWrap ? `
              <div class="receipt-line"><span>Gift Packaging:</span> <span>LKR ${order.cartState.giftWrapFee.toLocaleString()}</span></div>
            ` : ''}
            <div class="receipt-line"><span>Shipping:</span> <span>${order.cartState.shippingFee === 0 ? 'FREE' : `LKR ${order.cartState.shippingFee.toLocaleString()}`}</span></div>
            <div class="receipt-line total"><span>Total Paid/Payable:</span> <span>LKR ${order.cartState.total.toLocaleString()}</span></div>
          </div>

          <div class="shipping-info-preview">
            <p><strong><i class="fas fa-map-marker-alt"></i> Delivery To:</strong> ${order.customer.address}, ${order.customer.city}, ${order.customer.district}</p>
            <p><strong><i class="fas fa-phone-alt"></i> Contact:</strong> ${order.customer.phone} (${order.customer.email})</p>
            <p><strong><i class="fas fa-money-check-alt"></i> Payment Mode:</strong> ${paymentLabels[order.paymentMethod] || order.paymentMethod}</p>
          </div>
        </div>

        <div class="order-action-buttons">
          <a class="btn btn-whatsapp btn-block" href="https://wa.me/94779882000?text=Hi%20Bubbles%20Toys!%20I%20just%20placed%20order%20${order.orderId}%20for%20LKR%20${order.cartState.total}.%20Can%20you%20confirm%20delivery%20to%20${encodeURIComponent(order.customer.district)}?" target="_blank">
            <i class="fab fa-whatsapp"></i> Chat / Confirm on WhatsApp (+94 77 988 2000)
          </a>
          <button class="btn btn-secondary btn-block" onclick="window.print()">
            <i class="fas fa-print"></i> Print Receipt / Save PDF
          </button>
          <button class="btn btn-outline btn-block" onclick="window.closeCheckoutModal(); location.href='#build-a-box'">
            Continue Exploring Bubbles
          </button>
        </div>
      </div>
    </div>
  `;
};
}
