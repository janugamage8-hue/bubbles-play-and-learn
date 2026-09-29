// Bubbles Toy Co. - Interactive "Build Your Own Box" (5-7 Items)
// Directly implementing the E&J Sri Lanka Business Model & Pricing Strategy (LKR 5,000–6,500)

import { PRODUCTS, generateToySvg, renderProductMedia, getBoxBuilderOptions } from './products.js';
import { cartManager } from './cart.js';

export class BoxBuilder {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.currentStage = '0-1y'; // Default to available 0-1y stage
    this.childName = '';
    this.giftMessage = '';
    this.selectedItems = []; // Array of product objects
    this.minItems = 5;
    this.maxItems = 7;
  }

  init() {
    if (!this.container) return;
    this.render();
  }

  setStage(stage) {
    this.currentStage = stage;
    // Keep only items that match new stage or clear
    this.selectedItems = [];
    this.render();
  }

  toggleItem(productId) {
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) return;

    const existsIndex = this.selectedItems.findIndex(p => p.id === productId);
    if (existsIndex > -1) {
      this.selectedItems.splice(existsIndex, 1);
    } else {
      if (this.selectedItems.length >= this.maxItems) {
        window.cartManager.showToast(`Your box can hold a maximum of ${this.maxItems} items. Remove one to replace!`, 'info');
        return;
      }
      this.selectedItems.push(product);
    }
    this.render();
  }

  calculateBoxPrice() {
    const count = this.selectedItems.length;
    // Individual item retail sum
    const retailSum = this.selectedItems.reduce((sum, item) => sum + item.price, 0);

    // Document pricing strategy: Curated box bundle priced at LKR 5,000 - 6,500
    // 5 items: LKR 5,500
    // 6 items: LKR 6,000
    // 7 items: LKR 6,500
    let boxPrice = 0;
    if (count === 0) boxPrice = 0;
    else if (count < 5) {
      // Dynamic subsidized price until threshold
      boxPrice = Math.round(retailSum * 0.70);
    } else if (count === 5) {
      boxPrice = 5500;
    } else if (count === 6) {
      boxPrice = 6000;
    } else {
      boxPrice = 6500;
    }

    const savings = Math.max(0, retailSum - boxPrice);
    const savingsPercent = retailSum > 0 ? Math.round((savings / retailSum) * 100) : 0;

    return {
      retailSum,
      boxPrice,
      savings,
      savingsPercent,
      canAdd: count >= this.minItems && count <= this.maxItems
    };
  }

  addToCart() {
    const pricing = this.calculateBoxPrice();
    if (!pricing.canAdd) {
      window.cartManager.showToast(`Please choose between ${this.minItems} and ${this.maxItems} developmental items to build your box!`, 'info');
      return;
    }

    const stageNames = {
      '0-12m': '0–12 Months Sensory Box',
      '1-2y': '1–2 Years Explorer Box',
      '2-3y': '2–3 Years Milestone Box',
      '3-4y': '3–4 Years STEAM Box',
      '4-5y': '4–5 Years Pre-School Box'
    };

    const customBoxProduct = {
      id: `custom-box-${this.currentStage}`,
      title: `Curated Bubbles Box for ${this.childName ? this.childName : 'Little Learner'} (${stageNames[this.currentStage]})`,
      price: pricing.boxPrice,
      originalPrice: pricing.retailSum,
      imageSrc: (this.selectedItems[0] && this.selectedItems[0].imageSrc) || '',
      imageType: 'box-milestone',
      ageLabel: this.currentStage,
      category: 'curated-boxes'
    };

    const customData = {
      childName: this.childName || 'Little One',
      stage: this.currentStage,
      items: [...this.selectedItems],
      giftMessage: this.giftMessage
    };

    window.cartManager.addItem(customBoxProduct, 1, customData);
    window.openCartDrawer();
  }

  render() {
    if (!this.container) return;

    const availableProducts = getBoxBuilderOptions(this.currentStage);
    const pricing = this.calculateBoxPrice();
    const count = this.selectedItems.length;

    this.container.innerHTML = `
      <div class="box-builder-wrapper">
        <!-- Left / Top Controls: Stage Selector & Child Personalization -->
        <div class="builder-header-bar">
          <div class="stage-selector-pills">
            <span class="step-badge">Step 1</span>
            <span class="step-label">Select Age Milestone:</span>
            <div class="pill-group">
              <button class="stage-pill ${this.currentStage === '0-12m' ? 'active' : ''}" onclick="window.boxBuilder.setStage('0-12m')">
                🍼 0–12M Senses
              </button>
              <button class="stage-pill ${this.currentStage === '1-2y' ? 'active' : ''}" onclick="window.boxBuilder.setStage('1-2y')">
                🌱 1–2Y Toddler
              </button>
              <button class="stage-pill ${this.currentStage === '2-3y' ? 'active' : ''}" onclick="window.boxBuilder.setStage('2-3y')">
                🧩 2–3Y Milestone Formula
              </button>
              <button class="stage-pill ${this.currentStage === '3-4y' ? 'active' : ''}" onclick="window.boxBuilder.setStage('3-4y')">
                🚀 3–4Y STEAM
              </button>
              <button class="stage-pill ${this.currentStage === '4-5y' ? 'active' : ''}" onclick="window.boxBuilder.setStage('4-5y')">
                🎓 4–5Y Ready
              </button>
            </div>
          </div>

          <div class="child-personalization-inline">
            <input type="text" id="builder-child-name" placeholder="Child's Name (e.g. Maya)" value="${this.childName}" oninput="window.boxBuilder.childName = this.value; window.boxBuilder.updateBoxVisualHeader()" />
          </div>
        </div>

        <div class="builder-main-layout">
          <!-- Item Selection Grid (5-7 Items) -->
          <div class="builder-catalog-column">
            <div class="builder-instruction">
              <div class="instruction-left">
                <span class="step-badge">Step 2</span>
                <h4>Pick 5 to 7 developmental toys & activities</h4>
                <p>Formula based on E&J research: Wooden puzzle + Counting toy + Shape/colour sorter + Fine-motor + Art activity.</p>
              </div>
              <div class="selection-counter-badge ${count >= 5 ? 'good' : ''}">
                <strong>${count}</strong> of 5–7 items picked
              </div>
            </div>

            <div class="builder-grid">
              ${availableProducts.map(prod => {
                const isSelected = this.selectedItems.some(item => item.id === prod.id);
                return `
                  <div class="builder-toy-card ${isSelected ? 'selected' : ''}" onclick="window.boxBuilder.toggleItem('${prod.id}')">
                    <div class="card-check-bubble">
                      <i class="fas ${isSelected ? 'fa-check' : 'fa-plus'}"></i>
                    </div>
                    <div class="toy-card-img">
                      ${renderProductMedia(prod)}
                    </div>
                    <div class="toy-card-info">
                      <span class="toy-category-chip">${prod.tag || 'Developmental'}</span>
                      <h5 class="toy-title">${prod.title}</h5>
                      <div class="toy-price-row">
                        <span class="price-val">LKR ${prod.price.toLocaleString(undefined, { minimumFractionDigits: prod.price % 1 === 0 ? 0 : 2, maximumFractionDigits: 2 })}</span>
                        <span class="item-milestone-hint"><i class="fas fa-brain"></i> ${prod.milestones ? prod.milestones[0] : 'Skill'}</span>
                      </div>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>

          <!-- Live Box Visualizer & Summary Sticky Panel -->
          <div class="builder-summary-column">
            <div class="sticky-box-preview-card">
              <div class="box-preview-top">
                <div class="box-tag-label">Personalized Curated Box</div>
                <h3 id="visual-box-header">Bubbles Box for ${this.childName || 'Your Child'}</h3>
                <span class="box-status-text">
                  ${count < 5 ? `Pick <strong>${5 - count} more item${5 - count > 1 ? 's' : ''}</strong> to unlock the LKR 5,500 bundle deal!` : `✨ Perfect! Your curated box is ready to pack.`}
                </span>
              </div>

              <!-- Visual Box Slots (7 Slots) -->
              <div class="box-visual-slots-grid">
                ${Array.from({ length: 7 }).map((_, i) => {
                  const item = this.selectedItems[i];
                  return `
                    <div class="box-slot ${item ? 'filled' : 'empty'}">
                      ${item ? `
                        <div class="slot-content">
                          ${renderProductMedia(item)}
                          <span class="slot-label" title="${item.title}">${item.title}</span>
                          <button class="remove-slot-item" onclick="event.stopPropagation(); window.boxBuilder.toggleItem('${item.id}')">&times;</button>
                        </div>
                      ` : `
                        <div class="slot-empty-placeholder">
                          <span class="slot-num">${i + 1}</span>
                          <small>Toy Slot</small>
                        </div>
                      `}
                    </div>
                  `;
                }).join('')}
              </div>

              <!-- Price breakdown & Savings -->
              <div class="box-pricing-summary">
                <div class="price-line">
                  <span>Regular Individual Value:</span>
                  <span class="strikethrough">LKR ${pricing.retailSum.toLocaleString()}</span>
                </div>
                <div class="price-line highlight">
                  <span>Curated Box Price:</span>
                  <span class="final-box-price">LKR ${pricing.boxPrice.toLocaleString()}</span>
                </div>
                ${pricing.savings > 0 ? `
                  <div class="bundle-savings-badge">
                    🎉 You Save LKR ${pricing.savings.toLocaleString()} (${pricing.savingsPercent}% OFF)
                  </div>
                ` : ''}
              </div>

              <!-- Action Button -->
              <button 
                class="btn btn-primary btn-block btn-lg ${!pricing.canAdd ? 'disabled' : ''}" 
                onclick="window.boxBuilder.addToCart()"
                ${!pricing.canAdd ? 'disabled' : ''}
              >
                ${count < 5 ? `Select ${5 - count} More Toy${5 - count > 1 ? 's' : ''}` : `Pack Box & Add to Cart (LKR ${pricing.boxPrice.toLocaleString()})`}
              </button>

              <div class="box-perks-list">
                <div><i class="fas fa-gift"></i> Includes free developmental guide & custom box label</div>
                <div><i class="fas fa-shield-alt"></i> 100% Non-toxic Sri Lankan handmade & certified toys</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  updateBoxVisualHeader() {
    const el = document.getElementById('visual-box-header');
    if (el) {
      el.textContent = `Bubbles Box for ${this.childName.trim() || 'Your Child'}`;
    }
  }
}
