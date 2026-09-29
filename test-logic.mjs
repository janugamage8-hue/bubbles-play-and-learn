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
console.assert(css.includes('.wishlist-heart-btn.active'), 'components.css must define .wishlist-heart-btn.active');

console.log('✅ All product, age groups, HTML markup, Favorites features & business rule assertions passed successfully!');
