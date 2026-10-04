// Bubbles Play & Learn Co. - Main Application Controller

import { CATEGORIES, AGE_RANGES, SHOP_BY_AGE_GROUPS, CURATED_BOXES, PRODUCTS, generateToySvg, renderProductMedia, getProductById } from './products.js';
import { cartManager, renderCartDrawer } from './cart.js';
import { BoxBuilder } from './box-builder.js';
import { ParentQuiz } from './quiz.js';
import { ParentSurvey } from './survey.js';

class BubblesApp {
  constructor() {
    this.currentCategory = 'all';
    this.currentAge = 'all';
    this.searchQuery = '';
    this.sortOption = 'featured';
    this.showFavoritesOnly = false;
    this.wishlist = this.loadWishlist();
  }

  init() {
    // 1. Read URL query parameters on initial page load (e.g. ?age=0-1y, ?search=puzzle, ?filter=favorites)
    if (typeof window !== 'undefined' && window.location && window.location.search) {
      const params = new URLSearchParams(window.location.search);
      const ageParam = params.get('age');
      if (ageParam) {
        this.currentAge = ageParam;
      }
      const searchParam = params.get('search');
      if (searchParam) {
        this.searchQuery = searchParam.toLowerCase().trim();
      }
      if (params.get('filter') === 'favorites' || (window.location.hash && window.location.hash.includes('favorites'))) {
        this.showFavoritesOnly = true;
      }
    }

    this.renderHeaderNav();
    this.renderShopByAgeSection();
    this.renderAgeCategorySection();
    this.renderCuratedBoxes();
    this.renderProductsCatalog();
    this.renderFeaturedProducts();
    this.renderSavedFavorites();
    this.setupEventListeners();

    // Sync input fields if populated via query params
    if (this.searchQuery) {
      const searchInput = document.getElementById('search-catalog-input');
      if (searchInput) searchInput.value = this.searchQuery;
    }
    if (this.currentAge !== 'all') {
      const ageSelect = document.getElementById('age-filter-select');
      if (ageSelect) ageSelect.value = this.currentAge;
    }
    if (this.showFavoritesOnly) {
      const favBtn = document.getElementById('filter-favorites-toggle-btn');
      if (favBtn) {
        favBtn.classList.add('active');
        favBtn.innerHTML = `<i class="fas fa-heart"></i> Showing Favorites (<span class="fav-count-badge-inline">${this.wishlist.length}</span>)`;
      }
    }

    // Initialize Submodules safely if containers exist
    if (document.getElementById('box-builder-app')) {
      window.boxBuilder = new BoxBuilder('box-builder-app');
      window.boxBuilder.init();
    }

    if (document.getElementById('quiz-app')) {
      window.parentQuiz = new ParentQuiz('quiz-app');
      window.parentQuiz.init();
    }

    if (document.getElementById('parent-survey-app')) {
      window.parentSurvey = new ParentSurvey('parent-survey-app');
      window.parentSurvey.init();
    }

    // Cart Drawer subscription
    cartManager.subscribe(state => {
      this.updateCartBadge(state.count);
      renderCartDrawer();
    });

    // Toast listener
    window.addEventListener('bubbles:toast', (e) => {
      this.renderToast(e.detail.message, e.detail.type);
    });

    // Auto-scroll to hash if specified
    if (typeof window !== 'undefined' && window.location && window.location.hash) {
      const hashEl = document.querySelector(window.location.hash);
      if (hashEl) {
        setTimeout(() => hashEl.scrollIntoView({ behavior: 'smooth' }), 150);
      }
    }

    console.log('🫧 Bubbles Play & Learn Co. initialized successfully.');
  }

  loadWishlist() {
    try {
      const saved = localStorage.getItem('bubbles_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  }

  toggleWishlist(productId) {
    const idx = this.wishlist.indexOf(productId);
    if (idx > -1) {
      this.wishlist.splice(idx, 1);
      this.renderToast('Removed from favorites.', 'info');
    } else {
      this.wishlist.push(productId);
      this.renderToast('Saved to your favorites! ❤️', 'success');
    }
    localStorage.setItem('bubbles_wishlist', JSON.stringify(this.wishlist));
    this.updateWishlistCount();
    this.renderProductsCatalog();
    this.renderFeaturedProducts();
    this.renderSavedFavorites();
    this.updateQuickViewFavBtn(productId);
  }

  updateWishlistCount() {
    const count = this.wishlist.length;
    const badge = document.getElementById('wishlist-count-badge');
    const headerBtn = document.getElementById('header-favorites-btn');
    if (badge) {
      badge.textContent = count;
      badge.style.display = count > 0 ? 'inline-flex' : 'none';
    }
    if (headerBtn) {
      const icon = headerBtn.querySelector('i');
      if (icon) {
        if (count > 0) {
          icon.className = 'fas fa-heart text-danger';
        } else {
          icon.className = 'far fa-heart';
        }
      }
    }
    const mobileBadge = document.getElementById('mobile-wishlist-count-badge');
    if (mobileBadge) {
      mobileBadge.textContent = count;
    }
    const inlineBadges = document.querySelectorAll('.fav-count-badge-inline');
    inlineBadges.forEach(b => {
      b.textContent = count;
    });
  }

  renderSavedFavorites() {
    const container = document.getElementById('saved-favorites-container');
    if (!container) return;

    if (this.wishlist.length === 0) {
      container.innerHTML = `
        <div class="saved-favorites-empty-card">
          <div class="empty-fav-bubble">
            <i class="far fa-heart"></i>
          </div>
          <h3 class="empty-fav-title">Your Saved Favorites is Empty</h3>
          <p class="empty-fav-desc">
            Tap the heart icon on any toy or stage box in our collection to save it here. You can easily compare developmental toys, build your child's wishlist, or add all items directly to your cart!
          </p>
          <button class="btn btn-primary" onclick="document.getElementById('toy-catalog').scrollIntoView({ behavior: 'smooth' })">
            <i class="fas fa-cubes"></i> Browse Montessori Toys
          </button>
        </div>
      `;
      return;
    }

    const favItems = this.wishlist.map(id => getProductById(id)).filter(Boolean);

    container.innerHTML = `
      <div class="saved-favorites-toolbar">
        <div class="fav-toolbar-info">
          <span class="fav-count-pill">
            <i class="fas fa-heart"></i> ${favItems.length} ${favItems.length === 1 ? 'Item' : 'Items'} Saved
          </span>
          <span class="fav-toolbar-hint">Saved securely in your browser for easy review and one-click checkout.</span>
        </div>
        <div class="fav-toolbar-actions">
          <button class="btn btn-sm btn-outline" onclick="window.app.clearAllFavorites()" title="Remove all saved favorites">
            <i class="far fa-trash-alt"></i> Clear All
          </button>
          <button class="btn btn-sm btn-primary" onclick="window.app.addAllFavoritesToCart()" title="Add all saved favorites to cart">
            <i class="fas fa-cart-plus"></i> Add All to Cart
          </button>
        </div>
      </div>

      <div class="products-grid">
        ${favItems.map(item => `
          <div class="product-card" data-id="${item.id}">
            <button class="wishlist-heart-btn active" onclick="window.app.toggleWishlist('${item.id}')" title="Remove from favorites">
              <i class="fas fa-heart text-danger"></i>
            </button>

            ${item.tag ? `<span class="prod-badge-tag">${item.tag}</span>` : ''}

            <div class="prod-img-box" onclick="window.app.openQuickView('${item.id}')">
              ${renderProductMedia(item)}
              <span class="quick-view-overlay"><i class="fas fa-search-plus"></i> Quick View</span>
            </div>

            <div class="prod-details">
              <div class="prod-age-chip">${item.ageLabel || 'Montessori Toy'}</div>
              <h4 class="prod-title" onclick="window.app.openQuickView('${item.id}')">${item.title}</h4>
              
              <div class="prod-meta-row">
                <span class="prod-origin"><i class="fas fa-map-marker-alt"></i> ${item.madeIn || 'Safety Certified'}</span>
              </div>

              <div class="prod-rating-row">
                <span class="stars">★★★★★</span>
                <span class="reviews">(${item.reviewsCount || 25})</span>
              </div>

              <div class="prod-card-bottom">
                <div class="prod-pricing">
                  <span class="current-price">LKR ${item.price.toLocaleString(undefined, { minimumFractionDigits: item.price % 1 === 0 ? 0 : 2, maximumFractionDigits: 2 })}</span>
                  ${item.originalPrice && item.originalPrice > item.price ? `
                    <span class="original-price">LKR ${item.originalPrice.toLocaleString(undefined, { minimumFractionDigits: item.originalPrice % 1 === 0 ? 0 : 2, maximumFractionDigits: 2 })}</span>
                  ` : ''}
                </div>
                <button class="btn btn-sm btn-primary add-to-cart-btn" onclick="window.cartManager.addItem(window.app.getProductOrBox('${item.id}'), 1)">
                  <i class="fas fa-cart-plus"></i> Add
                </button>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  scrollToFavorites() {
    const section = document.getElementById('saved-favorites-section');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
      section.classList.remove('fav-section-pulse');
      void section.offsetWidth;
      section.classList.add('fav-section-pulse');
    } else if (typeof window !== 'undefined' && window.location) {
      window.location.href = '/shop.html#saved-favorites-section';
    }
  }

  clearAllFavorites() {
    if (this.wishlist.length === 0) return;
    this.wishlist = [];
    localStorage.setItem('bubbles_wishlist', JSON.stringify(this.wishlist));
    this.updateWishlistCount();
    this.renderProductsCatalog();
    this.renderSavedFavorites();
    this.updateQuickViewFavBtn('');
    this.renderToast('All favorites cleared.', 'info');
  }

  addAllFavoritesToCart() {
    if (this.wishlist.length === 0) return;
    let addedCount = 0;
    this.wishlist.forEach(id => {
      const item = getProductById(id);
      if (item) {
        cartManager.addItem(item, 1);
        addedCount++;
      }
    });
    if (addedCount > 0) {
      this.renderToast(`Added ${addedCount} favorites to your cart! 🛍️`, 'success');
      if (typeof window.openCartDrawer === 'function') {
        window.openCartDrawer();
      }
    }
  }

  toggleFavoritesCatalogFilter() {
    this.showFavoritesOnly = !this.showFavoritesOnly;
    const btn = document.getElementById('filter-favorites-toggle-btn');
    if (btn) {
      if (this.showFavoritesOnly) {
        btn.classList.add('active');
        btn.innerHTML = `<i class="fas fa-heart"></i> Showing Favorites (<span class="fav-count-badge-inline">${this.wishlist.length}</span>)`;
      } else {
        btn.classList.remove('active');
        btn.innerHTML = `<i class="far fa-heart"></i> <span id="catalog-fav-btn-label">Favorites</span> (<span class="fav-count-badge-inline">${this.wishlist.length}</span>)`;
      }
    }
    this.renderProductsCatalog();
  }

  updateQuickViewFavBtn(productId) {
    const btn = document.getElementById('qv-fav-toggle-btn');
    if (!btn) return;
    const currentId = btn.getAttribute('data-product-id');
    const targetId = productId || currentId;
    if (targetId && (currentId === targetId || !productId)) {
      const isWishlisted = this.wishlist.includes(targetId);
      if (isWishlisted) {
        btn.classList.add('active');
        btn.innerHTML = `<i class="fas fa-heart text-danger"></i> Saved in Favorites`;
      } else {
        btn.classList.remove('active');
        btn.innerHTML = `<i class="far fa-heart"></i> Save to Favorites`;
      }
    }
  }

  updateCartBadge(count) {
    const badges = document.querySelectorAll('.cart-count-badge');
    badges.forEach(b => {
      b.textContent = count;
      b.style.display = count > 0 ? 'inline-flex' : 'none';
    });
  }

  renderHeaderNav() {
    this.updateWishlistCount();
  }

  renderCategoryChips() {
    // Category division removed as requested
  }

  setCategory() {
    this.renderProductsCatalog();
  }

  getAgeProductCount(ageId) {
    if (ageId === 'all') return PRODUCTS.length;
    return PRODUCTS.filter(prod => {
      if (prod.ageRange === ageId) return true;
      if (Array.isArray(prod.ageRanges) && prod.ageRanges.includes(ageId)) return true;
      if (ageId === '0-1y' && (prod.ageRange === '0-1y' || prod.ageRange === '0-12m' || (prod.ageRanges && prod.ageRanges.includes('0-1y')))) return true;
      if (ageId === '5y-plus' && (prod.ageRange === '5y-plus' || (prod.ageRanges && prod.ageRanges.includes('5y-plus')) || prod.ageRange === '4-5y' || (prod.ageLabel && (prod.ageLabel.includes('5') || prod.ageLabel.includes('6') || prod.ageLabel.includes('7'))))) return true;
      return false;
    }).length;
  }

  renderAgeCategorySection() {
    const container = document.getElementById('age-category-pills-shelf');
    if (!container) return;

    const ageCategories = [
      { id: 'all', title: 'All Toys', icon: '✨', badgeText: `${PRODUCTS.length} Toys` },
      { id: '0-1y', title: '0–1 Year', icon: '🍼', badgeText: `${this.getAgeProductCount('0-1y')} Toys` },
      { id: '1-2y', title: '1–2 Years', icon: '🌱', badgeText: `${this.getAgeProductCount('1-2y')} Toys` },
      { id: '2-3y', title: '2–3 Years', icon: '🧩', badgeText: `${this.getAgeProductCount('2-3y')} Toys` },
      { id: '3-4y', title: '3–4 Years', icon: '🚀', badgeText: `${this.getAgeProductCount('3-4y')} Toys` },
      { id: '5y-plus', title: '5+ Years', icon: '🎓', badgeText: `${this.getAgeProductCount('5y-plus')} Toys` }
    ];

    container.innerHTML = ageCategories.map(cat => {
      const isActive = this.currentAge === cat.id;
      return `
        <button 
          type="button" 
          class="age-category-card-btn ${isActive ? 'active' : ''}" 
          onclick="window.app.filterByAgeGroup('${cat.id}')"
          aria-pressed="${isActive}"
          data-age="${cat.id}"
        >
          <span class="age-cat-icon">${cat.icon}</span>
          <div class="age-cat-details">
            <span class="age-cat-title">${cat.title}</span>
            <span class="age-cat-count">${cat.badgeText}</span>
          </div>
          ${isActive ? '<span class="age-cat-check"><i class="fas fa-check-circle"></i></span>' : ''}
        </button>
      `;
    }).join('');
  }

  renderShopByAgeSection() {
    const container = document.getElementById('shop-by-age-grid');
    if (!container) return;

    container.innerHTML = SHOP_BY_AGE_GROUPS.map(group => {
      const isActive = this.currentAge === group.id;
      const matchCount = this.getAgeProductCount(group.id);

      return `
        <div class="age-group-card ${group.themeClass} ${isActive ? 'active' : ''}" data-age="${group.id}">
          <div class="age-card-header">
            <div class="age-card-icon">${group.icon}</div>
            <div class="age-card-badge-pill">${group.badge}</div>
          </div>

          <h3 class="age-card-title">${group.title}</h3>
          <h4 class="age-card-focus">${group.focus}</h4>
          <p class="age-card-desc">${group.description}</p>

          <div class="age-card-milestones">
            ${group.milestones.map(m => `<span class="milestone-chip"><i class="fas fa-check"></i> ${m}</span>`).join('')}
          </div>

          <div class="age-card-sample-toys">
            <small><strong>Top Toys:</strong> ${group.sampleToys}</small>
          </div>

          <div class="age-card-footer">
            <span class="age-toy-count"><i class="fas fa-cubes"></i> ${matchCount} Educational Toys</span>
            <button class="btn btn-sm btn-primary age-cta-btn" onclick="window.app.filterByAgeGroup('${group.id}')">
              Explore ${group.title} <i class="fas fa-arrow-right"></i>
            </button>
          </div>
        </div>
      `;
    }).join('');
  }

  filterByAgeGroup(ageId, shouldScroll = true) {
    const catalogContainer = document.getElementById('products-grid');
    if (!catalogContainer && typeof window !== 'undefined' && window.location) {
      window.location.href = `/shop.html?age=${encodeURIComponent(ageId)}`;
      return;
    }

    this.currentAge = ageId;
    
    // Update select element if present
    const select = document.getElementById('age-filter-select');
    if (select) {
      select.value = ageId;
    }

    // Update active class on age cards in shop-by-age section
    const cards = document.querySelectorAll('.age-group-card');
    cards.forEach(c => {
      if (c.getAttribute('data-age') === ageId) {
        c.classList.add('active');
      } else {
        c.classList.remove('active');
      }
    });

    // Re-render age category shelf buttons to reflect active state
    this.renderAgeCategorySection();

    // Re-render products catalog
    this.renderProductsCatalog();

    // Smooth scroll to catalog or age section if requested
    if (shouldScroll) {
      const targetEl = document.getElementById('toy-store-age-section') || document.getElementById('toy-catalog');
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth' });
      }
    }

    const group = SHOP_BY_AGE_GROUPS.find(g => g.id === ageId);
    if (group) {
      this.renderToast(`Showing toys for ${group.title} (${this.getAgeProductCount(ageId)} available)`, 'info');
    } else if (ageId === 'all') {
      this.renderToast(`Showing all ${PRODUCTS.length} educational toys`, 'info');
    }
  }

  renderFeaturedProducts() {
    const container = document.getElementById('featured-products-grid');
    if (!container) return;

    // Handpicked top Montessori bestsellers across different developmental stages
    const featuredIds = ['preschool-29', 'fiveplus-07', 'fiveplus-05', 'preschool-28'];
    let featuredList = featuredIds.map(id => getProductById(id)).filter(Boolean);
    if (featuredList.length < 4) {
      featuredList = PRODUCTS.slice(0, 4);
    }

    container.innerHTML = featuredList.map(prod => {
      const isWishlisted = this.wishlist.includes(prod.id);
      return `
        <div class="product-card" data-id="${prod.id}">
          <button class="wishlist-heart-btn ${isWishlisted ? 'active' : ''}" onclick="window.app.toggleWishlist('${prod.id}')" title="Save to favorites">
            <i class="${isWishlisted ? 'fas fa-heart text-danger' : 'far fa-heart'}"></i>
          </button>

          ${prod.tag ? `<span class="prod-badge-tag">${prod.tag}</span>` : '<span class="prod-badge-tag">Top Pick</span>'}

          <div class="prod-img-box" onclick="window.app.openQuickView('${prod.id}')">
            ${renderProductMedia(prod)}
            <span class="quick-view-overlay"><i class="fas fa-search-plus"></i> Quick View</span>
          </div>

          <div class="prod-details">
            <div class="prod-age-chip">${prod.ageLabel || 'Montessori Toy'}</div>
            <h4 class="prod-title" onclick="window.app.openQuickView('${prod.id}')">${prod.title}</h4>
            
            <div class="prod-meta-row">
              <span class="prod-origin"><i class="fas fa-map-marker-alt"></i> ${prod.madeIn || 'Sri Lanka Handcrafted'}</span>
            </div>

            <div class="prod-rating-row">
              <span class="stars">★★★★★</span>
              <span class="reviews">(${prod.reviewsCount || 28})</span>
            </div>

            <div class="prod-card-bottom">
              <div class="prod-pricing">
                <span class="current-price">LKR ${prod.price.toLocaleString(undefined, { minimumFractionDigits: prod.price % 1 === 0 ? 0 : 2, maximumFractionDigits: 2 })}</span>
                ${prod.originalPrice > prod.price ? `
                  <span class="original-price">LKR ${prod.originalPrice.toLocaleString(undefined, { minimumFractionDigits: prod.originalPrice % 1 === 0 ? 0 : 2, maximumFractionDigits: 2 })}</span>
                ` : ''}
              </div>
              <button class="btn btn-sm btn-primary add-to-cart-btn" onclick="window.cartManager.addItem(window.app.getProductItem('${prod.id}'), 1)">
                <i class="fas fa-cart-plus"></i> Add
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  setAgeFilter(ageId) {
    this.filterByAgeGroup(ageId, false);
  }

  setSearch(query) {
    this.searchQuery = (query || '').toLowerCase().trim();
    this.renderProductsCatalog();
  }

  setSorting(sortVal) {
    this.sortOption = sortVal;
    this.renderProductsCatalog();
  }

  renderCuratedBoxes() {
    const container = document.getElementById('curated-boxes-grid');
    if (!container) return;

    container.innerHTML = CURATED_BOXES.map(box => `
      <div class="box-card" data-id="${box.id}">
        <div class="box-card-badge">${box.badge}</div>
        <div class="box-visual-wrap" onclick="window.app.openQuickView('${box.id}')">
          ${renderProductMedia(box)}
          <span class="view-overlay-btn"><i class="fas fa-eye"></i> View Box Details</span>
        </div>
        <div class="box-card-content">
          <div class="box-age-pill"><i class="fas fa-baby"></i> ${box.ageLabel}</div>
          <h3 class="box-title" onclick="window.app.openQuickView('${box.id}')">${box.title}</h3>
          <p class="box-tagline">${box.tagline}</p>

          <div class="box-rating-row">
            <span class="stars">★★★★★</span>
            <span class="rating-num">${box.rating} (${box.reviewsCount} Sri Lankan parents)</span>
          </div>

          <div class="box-highlights">
            ${box.milestones.slice(0, 3).map(m => `<span class="milestone-tag">✓ ${m}</span>`).join('')}
          </div>

          <div class="box-pricing-bottom">
            <div class="price-stack">
              <span class="curr-price">LKR ${box.price.toLocaleString()}</span>
              <span class="strike-price">LKR ${box.originalPrice.toLocaleString()}</span>
              <span class="savings-tag">${box.savings}</span>
            </div>
            <button class="btn btn-primary btn-add-box" onclick="window.cartManager.addItem(window.app.getBoxItem('${box.id}'), 1); window.openCartDrawer();">
              <i class="fas fa-shopping-basket"></i> Add Box
            </button>
          </div>
        </div>
      </div>
    `).join('');
  }

  getBoxItem(id) {
    return CURATED_BOXES.find(b => b.id === id);
  }

  renderProductsCatalog() {
    const container = document.getElementById('products-grid');
    const resultsCountEl = document.getElementById('catalog-results-count');
    if (!container) return;

    let filtered = PRODUCTS.filter(prod => {
      // Favorites only filter
      if (this.showFavoritesOnly && !this.wishlist.includes(prod.id)) {
        return false;
      }

      // Age match
      const matchAge = this.currentAge === 'all' || 
                       prod.ageRange === this.currentAge || 
                       (Array.isArray(prod.ageRanges) && prod.ageRanges.includes(this.currentAge)) ||
                       (this.currentAge === '0-1y' && (prod.ageRange === '0-1y' || prod.ageRange === '0-12m' || (prod.ageRanges && prod.ageRanges.includes('0-1y')))) ||
                       (this.currentAge === '5y-plus' && (prod.ageRange === '5y-plus' || (prod.ageRanges && prod.ageRanges.includes('5y-plus')) || prod.ageRange === '4-5y' || (prod.ageLabel && (prod.ageLabel.includes('5') || prod.ageLabel.includes('6') || prod.ageLabel.includes('7'))))) ||
                       prod.ageRange === 'all';

      // Search match
      const matchSearch = !this.searchQuery || 
                          prod.title.toLowerCase().includes(this.searchQuery) ||
                          prod.description.toLowerCase().includes(this.searchQuery) ||
                          (prod.material && prod.material.toLowerCase().includes(this.searchQuery)) ||
                          (prod.tag && prod.tag.toLowerCase().includes(this.searchQuery));

      return matchAge && matchSearch;
    });

    // Sorting
    if (this.sortOption === 'price-low') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (this.sortOption === 'price-high') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (this.sortOption === 'rating') {
      filtered.sort((a, b) => b.rating - a.rating);
    }

    if (resultsCountEl) {
      if (this.showFavoritesOnly) {
        resultsCountEl.textContent = `Showing ${filtered.length} favorited toys`;
      } else {
        resultsCountEl.textContent = `Showing ${filtered.length} educational toys`;
      }
    }

    if (filtered.length === 0) {
      if (this.showFavoritesOnly) {
        container.innerHTML = `
          <div class="empty-catalog-state">
            <div class="empty-icon">❤️</div>
            <h3>No favorited toys match your filters</h3>
            <p>You haven't added any matching toys to your favorites yet. Tap the heart on toys to save them!</p>
            <button class="btn btn-secondary" onclick="window.app.toggleFavoritesCatalogFilter()">Show All Toys</button>
          </div>
        `;
      } else {
        container.innerHTML = `
          <div class="empty-catalog-state">
            <div class="empty-icon">🔍</div>
            <h3>No matching toys found</h3>
            <p>Try clearing filters or search terms to see our full Montessori collection.</p>
            <button class="btn btn-secondary" onclick="window.app.resetFilters()">Reset All Filters</button>
          </div>
        `;
      }
      return;
    }

    container.innerHTML = filtered.map(prod => {
      const isWishlisted = this.wishlist.includes(prod.id);
      return `
        <div class="product-card" data-id="${prod.id}">
          <button class="wishlist-heart-btn ${isWishlisted ? 'active' : ''}" onclick="window.app.toggleWishlist('${prod.id}')" title="Save to favorites">
            <i class="${isWishlisted ? 'fas fa-heart text-danger' : 'far fa-heart'}"></i>
          </button>

          ${prod.tag ? `<span class="prod-badge-tag">${prod.tag}</span>` : ''}

          <div class="prod-img-box" onclick="window.app.openQuickView('${prod.id}')">
            ${renderProductMedia(prod)}
            <span class="quick-view-overlay"><i class="fas fa-search-plus"></i> Quick View</span>
          </div>

          <div class="prod-details">
            <div class="prod-age-chip">${prod.ageLabel}</div>
            <h4 class="prod-title" onclick="window.app.openQuickView('${prod.id}')">${prod.title}</h4>
            
            <div class="prod-meta-row">
              <span class="prod-origin"><i class="fas fa-map-marker-alt"></i> ${prod.madeIn}</span>
            </div>

            <div class="prod-rating-row">
              <span class="stars">★★★★★</span>
              <span class="reviews">(${prod.reviewsCount})</span>
            </div>

            <div class="prod-card-bottom">
              <div class="prod-pricing">
                <span class="current-price">LKR ${prod.price.toLocaleString(undefined, { minimumFractionDigits: prod.price % 1 === 0 ? 0 : 2, maximumFractionDigits: 2 })}</span>
                ${prod.originalPrice > prod.price ? `
                  <span class="original-price">LKR ${prod.originalPrice.toLocaleString(undefined, { minimumFractionDigits: prod.originalPrice % 1 === 0 ? 0 : 2, maximumFractionDigits: 2 })}</span>
                ` : ''}
              </div>
              <button class="btn btn-sm btn-primary add-to-cart-btn" onclick="window.cartManager.addItem(window.app.getProductItem('${prod.id}'), 1)">
                <i class="fas fa-cart-plus"></i> Add
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  getProductItem(id) {
    return PRODUCTS.find(p => p.id === id);
  }

  resetFilters() {
    this.currentAge = 'all';
    this.searchQuery = '';
    this.showFavoritesOnly = false;
    const favBtn = document.getElementById('filter-favorites-toggle-btn');
    if (favBtn) {
      favBtn.classList.remove('active');
      favBtn.innerHTML = `<i class="far fa-heart"></i> <span id="catalog-fav-btn-label">Favorites</span> (<span class="fav-count-badge-inline">${this.wishlist.length}</span>)`;
    }
    const sInput = document.getElementById('search-catalog-input');
    if (sInput) sInput.value = '';
    const aSelect = document.getElementById('age-filter-select');
    if (aSelect) aSelect.value = 'all';
    this.renderAgeCategorySection();
    this.renderProductsCatalog();
  }

  openQuickView(productId) {
    const item = getProductById(productId);
    if (!item) return;

    const modal = document.getElementById('quick-view-modal');
    const content = document.getElementById('quick-view-content');
    if (!modal || !content) return;

    const isWishlisted = this.wishlist.includes(item.id);

    content.innerHTML = `
      <div class="quick-view-grid">
        <div class="qv-media" id="qv-media-container">
          ${item.ageLabel ? `<div class="qv-age-tag"><i class="fas fa-child"></i> ${item.ageLabel}</div>` : ''}
          ${renderProductMedia(item, 'qv-photo')}
          ${item.badge ? `<span class="qv-badge">${item.badge}</span>` : ''}
          <div class="qv-zoom-hint"><i class="fas fa-search-plus"></i> High-Resolution Photo</div>
        </div>
        <div class="qv-info">
          <div class="qv-header">
            <span class="qv-category">${(item.category || '').replace('-', ' ').toUpperCase()}</span>
            <h2>${item.title}</h2>
            <div class="qv-rating">
              <span class="stars">★★★★★</span>
              <span>${item.rating} (${item.reviewsCount} verified parents)</span>
            </div>
          </div>

          <div class="qv-price-block">
            <span class="qv-price">LKR ${item.price.toLocaleString(undefined, { minimumFractionDigits: item.price % 1 === 0 ? 0 : 2, maximumFractionDigits: 2 })}</span>
            ${item.originalPrice > item.price ? `
              <span class="qv-old-price">LKR ${item.originalPrice.toLocaleString(undefined, { minimumFractionDigits: item.originalPrice % 1 === 0 ? 0 : 2, maximumFractionDigits: 2 })}</span>
            ` : ''}
            ${item.savings ? `<span class="qv-savings">${item.savings}</span>` : ''}
          </div>

          <p class="qv-desc">${item.description}</p>

          ${item.material ? `
            <div class="qv-spec-row">
              <strong>Materials:</strong>
              <span>${item.material}</span>
            </div>
          ` : ''}

          ${item.madeIn ? `
            <div class="qv-spec-row">
              <strong>Origin:</strong>
              <span>${item.madeIn}</span>
            </div>
          ` : ''}

          ${item.milestones ? `
            <div class="qv-milestones-box">
              <h5><i class="fas fa-brain"></i> Developmental Milestones Supported:</h5>
              <ul>
                ${item.milestones.map(m => `<li><i class="fas fa-check-circle text-success"></i> ${m}</li>`).join('')}
              </ul>
            </div>
          ` : ''}

          ${item.includes ? `
            <div class="qv-includes-box">
              <h5><i class="fas fa-box-open"></i> What's Inside This Curated Box:</h5>
              <ul>
                ${item.includes.map(inc => `<li><i class="fas fa-star text-warning"></i> ${inc}</li>`).join('')}
              </ul>
            </div>
          ` : ''}

          <div class="qv-actions-row">
            <button class="btn btn-primary btn-lg qv-add-cart-btn" onclick="window.cartManager.addItem(window.app.getProductOrBox('${item.id}'), 1); window.app.closeQuickView(); window.openCartDrawer();">
              <i class="fas fa-shopping-basket"></i> Add to Cart (LKR ${item.price.toLocaleString(undefined, { minimumFractionDigits: item.price % 1 === 0 ? 0 : 2, maximumFractionDigits: 2 })})
            </button>
            <button class="btn btn-outline qv-fav-btn ${isWishlisted ? 'active' : ''}" id="qv-fav-toggle-btn" data-product-id="${item.id}" onclick="window.app.toggleWishlist('${item.id}')">
              <i class="${isWishlisted ? 'fas fa-heart text-danger' : 'far fa-heart'}"></i> ${isWishlisted ? 'Saved in Favorites' : 'Save to Favorites'}
            </button>
          </div>
        </div>
      </div>
    `;

    modal.classList.add('active');
    document.body.classList.add('no-scroll');
  }

  getProductOrBox(id) {
    return getProductById(id);
  }

  closeQuickView() {
    const modal = document.getElementById('quick-view-modal');
    if (modal) {
      modal.classList.remove('active');
      document.body.classList.remove('no-scroll');
    }
  }

  renderToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `bubbles-toast toast-${type}`;
    toast.innerHTML = `
      <div class="toast-icon">
        ${type === 'success' ? '✨' : type === 'warning' ? '⚠️' : '🫧'}
      </div>
      <div class="toast-msg">${message}</div>
      <button class="toast-close" onclick="this.parentElement.remove()">&times;</button>
    `;

    container.appendChild(toast);
    setTimeout(() => {
      toast.classList.add('fade-out');
      setTimeout(() => toast.remove(), 400);
    }, 3800);
  }

  setupEventListeners() {
    // Quick search bar
    const searchInput = document.getElementById('search-catalog-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.setSearch(e.target.value);
      });
    }

    // Age dropdown
    const ageSelect = document.getElementById('age-filter-select');
    if (ageSelect) {
      ageSelect.addEventListener('change', (e) => {
        this.setAgeFilter(e.target.value);
      });
    }

    // Sort dropdown
    const sortSelect = document.getElementById('sort-catalog-select');
    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        this.setSorting(e.target.value);
      });
    }

    // Mobile nav toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-toggle');
    const mobileNavDrawer = document.getElementById('mobile-nav-drawer');
    if (mobileMenuBtn && mobileNavDrawer) {
      mobileMenuBtn.addEventListener('click', () => {
        mobileNavDrawer.classList.toggle('active');
      });
    }

    // Modal close backdrop
    const modal = document.getElementById('quick-view-modal');
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target.classList.contains('modal-backdrop')) {
          this.closeQuickView();
        }
      });
    }

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeQuickView();
      }
    });
  }
}

window.app = new BubblesApp();

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.app.init();
  });
} else {
  window.app.init();
}

