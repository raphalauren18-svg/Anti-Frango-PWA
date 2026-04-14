// ============================================
// ANTI-FRANGO - Main App Controller
// SPA Navigation & State Management
// ============================================

// ---- App State ----
const AppState = {
  currentScreen: 'home',
  cart: [],
  wishlist: [],
  user: {
    name: 'Atleta Anti-Frango',
    email: 'atleta@antifrango.com',
    level: 'Intermediário',
    avatar: null,
    measurements: {
      altura: '178 cm',
      peso: '82 kg',
      peito: '96 cm',
      cintura: '80 cm',
    },
    points: 1240,
    orders: ORDERS.length,
    favorites: 5,
  },
  filters: {
    gender: [],
    type: [],
    sizes: [],
    category: 'todos',
  },
  sortBy: 'featured',
  communityTab: 'em-alta',
  bannerIndex: 0,
};

// ---- DOM References ----
const DOM = {
  splash: document.getElementById('splash-screen'),
  app: document.getElementById('app'),
  screenContent: document.getElementById('screen-content'),
  bottomNav: document.getElementById('bottom-nav'),
  cartBadge: document.getElementById('cart-badge'),
  cartBtn: document.getElementById('cart-btn'),
  menuBtn: document.getElementById('menu-btn'),
  searchBtn: document.getElementById('search-btn'),
  searchModal: document.getElementById('search-modal'),
  filterModal: document.getElementById('filter-modal'),
  productModal: document.getElementById('product-modal'),
  cartDrawer: document.getElementById('cart-drawer'),
  sideMenu: document.getElementById('side-menu'),
  adminPanel: document.getElementById('admin-panel'),
  toastContainer: document.getElementById('toast-container'),
};

// ============================================
// INITIALIZATION
// ============================================

window.addEventListener('DOMContentLoaded', () => {
  initApp();
});

async function initApp() {
  // Load state from localStorage
  loadState();

  // Show splash then load app
  setTimeout(() => {
    hideSplash();
    bindEvents();
    handleUrlParams();
    navigateTo(AppState.currentScreen);
    registerServiceWorker();
  }, 1800);
}

function hideSplash() {
  DOM.splash.style.opacity = '0';
  DOM.splash.style.transition = 'opacity 0.5s ease';
  setTimeout(() => {
    DOM.splash.style.display = 'none';
    DOM.app.style.display = 'flex';
  }, 500);
}

function handleUrlParams() {
  const params = new URLSearchParams(window.location.search);
  const screen = params.get('screen');
  if (screen && ['home', 'shop', 'customize', 'community', 'profile', 'cart'].includes(screen)) {
    AppState.currentScreen = screen;
  }
}

function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').then(reg => {
      console.log('[App] Service Worker registered:', reg.scope);
    }).catch(err => {
      console.warn('[App] SW registration failed:', err);
    });
  }
}

// ============================================
// NAVIGATION
// ============================================

function navigateTo(screen) {
  AppState.currentScreen = screen;

  // Update bottom nav
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.screen === screen);
  });

  // Render screen
  const content = DOM.screenContent;
  content.innerHTML = '';

  const screenDiv = document.createElement('div');
  screenDiv.className = 'screen-enter';

  switch (screen) {
    case 'home':
      screenDiv.innerHTML = renderHomeScreen();
      break;
    case 'shop':
      screenDiv.innerHTML = renderShopScreen();
      break;
    case 'customize':
      screenDiv.innerHTML = renderCustomizeScreen();
      break;
    case 'community':
      screenDiv.innerHTML = renderCommunityScreen();
      break;
    case 'profile':
      screenDiv.innerHTML = renderProfileScreen();
      break;
    case 'cart':
      screenDiv.innerHTML = renderCartScreen();
      break;
    default:
      screenDiv.innerHTML = renderHomeScreen();
  }

  content.appendChild(screenDiv);
  content.scrollTop = 0;

  // Bind screen-specific events after render
  setTimeout(() => bindScreenEvents(screen), 50);
}

function bindScreenEvents(screen) {
  switch (screen) {
    case 'home': bindHomeEvents(); break;
    case 'shop': bindShopEvents(); break;
    case 'customize': bindCustomizeEvents(); break;
    case 'community': bindCommunityEvents(); break;
    case 'profile': bindProfileEvents(); break;
    case 'cart': bindCartEvents(); break;
  }
}

// ============================================
// EVENT BINDINGS
// ============================================

function bindEvents() {
  // Bottom nav
  DOM.bottomNav.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const screen = btn.dataset.screen;
      if (screen) navigateTo(screen);
    });
  });

  // Cart icon in header
  DOM.cartBtn.addEventListener('click', openCartDrawer);

  // Menu button
  DOM.menuBtn.addEventListener('click', openSideMenu);

  // Search button
  DOM.searchBtn.addEventListener('click', openSearchModal);

  // Modal overlays close on backdrop click
  [DOM.searchModal, DOM.filterModal, DOM.productModal].forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal(modal);
    });
  });

  [DOM.cartDrawer, DOM.sideMenu].forEach(drawer => {
    drawer.addEventListener('click', (e) => {
      if (e.target === drawer) closeDrawer(drawer);
    });
  });

  // Close buttons
  document.getElementById('close-search').addEventListener('click', () => closeModal(DOM.searchModal));
  document.getElementById('close-filter').addEventListener('click', () => closeModal(DOM.filterModal));
  document.getElementById('close-product').addEventListener('click', () => closeModal(DOM.productModal));
  document.getElementById('close-cart').addEventListener('click', () => closeDrawer(DOM.cartDrawer));
  document.getElementById('close-menu').addEventListener('click', () => closeDrawer(DOM.sideMenu));

  // Side menu nav items
  DOM.sideMenu.querySelectorAll('.side-nav-item').forEach(item => {
    item.addEventListener('click', () => {
      const screen = item.dataset.screen;
      const action = item.dataset.action;
      closeDrawer(DOM.sideMenu);
      if (screen) navigateTo(screen);
      if (action === 'admin') openAdmin();
      if (action === 'about') showAboutToast();
    });
  });

  // Search input
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('input', debounce(handleSearch, 300));
  }

  // Filter apply/clear
  document.getElementById('apply-filters-btn').addEventListener('click', applyFilters);
  document.getElementById('clear-filters-btn').addEventListener('click', clearFilters);
}

function bindHomeEvents() {
  // Banner carousel
  initBannerCarousel();

  // Category pills
  document.querySelectorAll('.category-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('.category-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      const cat = pill.dataset.cat;
      AppState.filters.category = cat;
      navigateTo('shop');
    });
  });

  // Product cards
  bindProductCards();

  // Feed posts
  document.querySelectorAll('.feed-post-card').forEach(card => {
    card.addEventListener('click', () => navigateTo('community'));
  });
}

function bindShopEvents() {
  // Category tabs
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      AppState.filters.category = btn.dataset.cat;
      const grid = document.getElementById('products-grid');
      if (grid) {
        grid.innerHTML = renderProductGrid(getFilteredProducts());
        bindProductCards();
      }
    });
  });

  // Filter button
  const filterBtn = document.getElementById('filter-btn');
  if (filterBtn) filterBtn.addEventListener('click', openFilterModal);

  // Sort select
  const sortSelect = document.getElementById('sort-select');
  if (sortSelect) {
    sortSelect.value = AppState.sortBy;
    sortSelect.addEventListener('change', (e) => {
      AppState.sortBy = e.target.value;
      const grid = document.getElementById('products-grid');
      if (grid) {
        grid.innerHTML = renderProductGrid(getFilteredProducts());
        bindProductCards();
      }
    });
  }

  bindProductCards();
}

function bindCommunityEvents() {
  // Community tabs
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      AppState.communityTab = btn.dataset.tab;
    });
  });

  // Like buttons
  document.querySelectorAll('.post-action-btn[data-action="like"]').forEach(btn => {
    btn.addEventListener('click', () => {
      const postId = btn.dataset.postId;
      const post = COMMUNITY_POSTS.find(p => p.id === postId);
      if (post) {
        post.liked = !post.liked;
        post.likes += post.liked ? 1 : -1;
        btn.classList.toggle('liked', post.liked);
        const likeCount = btn.querySelector('.like-count');
        if (likeCount) likeCount.textContent = post.likes.toLocaleString('pt-BR');
        btn.querySelector('i').className = post.liked ? 'fas fa-heart' : 'far fa-heart';
      }
    });
  });

  // Follow buttons
  document.querySelectorAll('.post-follow-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const following = btn.classList.contains('following');
      btn.classList.toggle('following', !following);
      btn.textContent = following ? 'Seguir' : 'Seguindo';
    });
  });

  // FAB post button
  const fab = document.querySelector('.community-fab');
  if (fab) {
    fab.addEventListener('click', () => showToast('info', '📸 Funcionalidade de publicação em breve!'));
  }
}

function bindProfileEvents() {
  // Order items
  document.querySelectorAll('.order-item').forEach(item => {
    item.addEventListener('click', () => {
      const orderId = item.dataset.orderId;
      const order = ORDERS.find(o => o.id === orderId);
      if (order) showOrderDetail(order);
    });
  });

  // Measurements edit
  const editMeasurementsBtn = document.getElementById('edit-measurements-btn');
  if (editMeasurementsBtn) {
    editMeasurementsBtn.addEventListener('click', showMeasurementsModal);
  }

  // Profile menu items
  document.querySelectorAll('.profile-menu-item').forEach(item => {
    item.addEventListener('click', () => {
      const action = item.dataset.action;
      handleProfileAction(action);
    });
  });
}

function bindCartEvents() {
  const cartScreen = document.querySelector('.cart-screen');
  if (!cartScreen) return;

  // Qty +/- buttons
  cartScreen.querySelectorAll('.qty-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const cartIndex = parseInt(btn.dataset.cartIndex);
      const delta = btn.dataset.action === 'plus' ? 1 : -1;
      changeCartItemQty(cartIndex, delta);
    });
  });

  // Remove buttons
  cartScreen.querySelectorAll('.cart-item-remove').forEach(btn => {
    btn.addEventListener('click', () => {
      const cartIndex = parseInt(btn.dataset.cartIndex);
      removeFromCart(cartIndex);
    });
  });

  // Coupon
  const applyCoupon = document.getElementById('apply-coupon-btn');
  if (applyCoupon) {
    applyCoupon.addEventListener('click', handleCoupon);
  }

  // Checkout button
  const checkoutBtn = document.getElementById('checkout-btn');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      if (AppState.cart.length === 0) {
        showToast('error', 'Adicione produtos ao carrinho primeiro!');
        return;
      }
      // Navigate to checkout within cart screen
      const cartScreen = document.querySelector('.cart-screen');
      if (cartScreen) {
        cartScreen.innerHTML = renderCheckoutFlow();
        bindCheckoutEvents();
      }
    });
  }
}

function bindCustomizeEvents() {
  initCustomizer();
}

function bindProductCards() {
  // Product card click -> open detail
  document.querySelectorAll('.product-card').forEach(card => {
    const productId = card.dataset.productId;
    if (!productId) return;

    card.addEventListener('click', (e) => {
      // Quick-add button takes priority
      if (e.target.closest('.product-quick-add')) return;
      openProductDetail(productId);
    });
  });

  // Quick-add buttons
  document.querySelectorAll('.product-quick-add').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const productId = btn.dataset.productId;
      const product = PRODUCTS.find(p => p.id === productId);
      if (product) {
        addToCart(product, { size: product.sizes[0], color: product.colors[0] });
      }
    });
  });
}

// ============================================
// BANNER CAROUSEL
// ============================================

function initBannerCarousel() {
  const slides = document.querySelector('.banner-slides');
  const dots = document.querySelectorAll('.banner-dot');
  if (!slides) return;

  let currentIndex = 0;
  const totalSlides = BANNERS.length;

  function goToSlide(index) {
    currentIndex = (index + totalSlides) % totalSlides;
    slides.style.transform = `translateX(-${currentIndex * 100}%)`;
    dots.forEach((dot, i) => dot.classList.toggle('active', i === currentIndex));
    AppState.bannerIndex = currentIndex;
  }

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => goToSlide(i));
  });

  // Banner CTA buttons
  document.querySelectorAll('.banner-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const productId = btn.dataset.productId;
      if (productId) openProductDetail(productId);
    });
  });

  // Auto-play
  const autoPlay = setInterval(() => goToSlide(currentIndex + 1), 4000);

  // Touch swipe
  let touchStartX = 0;
  slides.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; });
  slides.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) goToSlide(diff > 0 ? currentIndex + 1 : currentIndex - 1);
  });

  goToSlide(AppState.bannerIndex);
}

// ============================================
// CART MANAGEMENT
// ============================================

function addToCart(product, options = {}) {
  const size = options.size || (product.sizes && product.sizes[0]) || 'M';
  const color = options.color || (product.colors && product.colors[0]) || '#1A1A1A';

  const existingIndex = AppState.cart.findIndex(
    item => item.id === product.id && item.size === size && item.color === color
  );

  if (existingIndex >= 0) {
    AppState.cart[existingIndex].qty += 1;
  } else {
    AppState.cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      size,
      color,
      qty: 1,
      isCustom: options.isCustom || false,
      customData: options.customData || null,
    });
  }

  updateCartBadge();
  saveState();
  showToast('success', `<strong>${product.name}</strong> adicionado ao carrinho! 🔥`);
}

function removeFromCart(index) {
  AppState.cart.splice(index, 1);
  updateCartBadge();
  saveState();
  // Re-render if in cart screen
  const cartScreen = document.querySelector('.cart-screen');
  if (cartScreen) {
    navigateTo('cart');
  }
  // Re-render if cart drawer open
  const cartDrawer = document.getElementById('cart-items-list');
  if (cartDrawer && document.getElementById('cart-drawer').style.display !== 'none') {
    renderCartDrawerContent();
  }
}

function changeCartItemQty(index, delta) {
  const newQty = AppState.cart[index].qty + delta;
  if (newQty <= 0) {
    removeFromCart(index);
    return;
  }
  AppState.cart[index].qty = newQty;
  updateCartBadge();
  saveState();
  // Refresh totals
  refreshCartTotals();
}

function getCartTotal() {
  return AppState.cart.reduce((sum, item) => sum + item.price * item.qty, 0);
}

function getCartItemCount() {
  return AppState.cart.reduce((sum, item) => sum + item.qty, 0);
}

function updateCartBadge() {
  const count = getCartItemCount();
  DOM.cartBadge.textContent = count;
  DOM.cartBadge.style.display = count > 0 ? 'flex' : 'none';
}

function refreshCartTotals() {
  const totalsEl = document.getElementById('cart-totals');
  if (totalsEl) totalsEl.innerHTML = renderCartTotalsContent();

  const qtyEls = document.querySelectorAll('.qty-value');
  qtyEls.forEach((el, i) => {
    if (AppState.cart[i]) el.textContent = AppState.cart[i].qty;
  });
}

// ============================================
// PRODUCT DETAIL
// ============================================

function openProductDetail(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  const content = document.getElementById('product-detail-content');
  content.innerHTML = renderProductDetail(product);
  DOM.productModal.style.display = 'flex';
  document.body.style.overflow = 'hidden';

  // Size selector
  content.querySelectorAll('.size-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      content.querySelectorAll('.size-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
    });
  });

  // Wishlist
  const wishlistBtn = content.querySelector('.wishlist-btn');
  if (wishlistBtn) {
    wishlistBtn.addEventListener('click', () => {
      const inWishlist = AppState.wishlist.includes(productId);
      if (inWishlist) {
        AppState.wishlist = AppState.wishlist.filter(id => id !== productId);
        wishlistBtn.classList.remove('active');
        wishlistBtn.innerHTML = '<i class="far fa-heart"></i>';
        showToast('info', 'Removido dos favoritos');
      } else {
        AppState.wishlist.push(productId);
        wishlistBtn.classList.add('active');
        wishlistBtn.innerHTML = '<i class="fas fa-heart"></i>';
        showToast('success', 'Adicionado aos favoritos! ❤️');
      }
      saveState();
    });
  }

  // Add to cart
  const addToCartBtn = content.querySelector('.add-to-cart-detail-btn');
  if (addToCartBtn) {
    addToCartBtn.addEventListener('click', () => {
      const selectedSize = content.querySelector('.size-btn.selected');
      const size = selectedSize ? selectedSize.dataset.size : product.sizes[0];
      addToCart(product, { size });
      closeModal(DOM.productModal);
    });
  }

  // Customize this product
  const customizeBtn = content.querySelector('.customize-product-btn');
  if (customizeBtn) {
    customizeBtn.addEventListener('click', () => {
      closeModal(DOM.productModal);
      navigateTo('customize');
    });
  }
}

function renderProductDetail(product) {
  const isWishlisted = AppState.wishlist.includes(product.id);
  const inWishlist = isWishlisted ? 'active' : '';
  const heartIcon = isWishlisted ? 'fas' : 'far';

  return `
    <img src="${product.image}" alt="${product.name}" class="product-detail-img" onerror="this.src='https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80'">
    <div class="product-detail-info">
      <p class="product-detail-category">${getCategoryLabel(product.category)} · ${getGenderLabel(product.gender)}</p>
      <h2 class="product-detail-name">${product.name}</h2>
      <div class="product-detail-price-wrap">
        <span class="product-detail-price">${formatPrice(product.price)}</span>
        ${product.originalPrice ? `<span class="product-detail-old-price">${formatPrice(product.originalPrice)}</span>` : ''}
      </div>
      <div style="display:flex;align-items:center;gap:6px;margin-bottom:12px;">
        <div class="product-rating">
          ${'<i class="fas fa-star"></i>'.repeat(Math.floor(product.rating))}
          ${product.rating % 1 >= 0.5 ? '<i class="fas fa-star-half-alt"></i>' : ''}
        </div>
        <span style="font-size:0.78rem;color:var(--color-text-secondary)">${product.rating} (${product.reviews} avaliações)</span>
      </div>
      <p class="product-detail-description">${product.description}</p>
      
      <div class="size-selector">
        <p class="size-label">Tamanho:</p>
        <div class="size-options">
          ${product.sizes.map((size, i) => `
            <button class="size-btn ${i === 0 ? 'selected' : ''}" data-size="${size}">${size}</button>
          `).join('')}
        </div>
      </div>

      <div class="color-selector-row">
        <p class="detail-label">Cores disponíveis:</p>
        <div class="color-swatches">
          ${product.colors.map((c, i) => `
            <div class="color-swatch ${i === 0 ? 'selected' : ''}" style="background:${c};width:28px;height:28px;" title="${c}"></div>
          `).join('')}
        </div>
      </div>

      <div style="display:flex;align-items:center;gap:8px;padding:8px 0;margin-bottom:12px;background:var(--color-card);border-radius:8px;padding:10px;">
        <i class="fas fa-truck" style="color:var(--color-primary);font-size:0.9rem;margin-left:8px;"></i>
        <span style="font-size:0.78rem;color:var(--color-text-secondary)">Frete grátis acima de R$ 199,90</span>
      </div>
    </div>
    <div class="product-detail-actions">
      <button class="wishlist-btn ${inWishlist}">
        <i class="${heartIcon} fa-heart"></i>
      </button>
      <button class="btn btn-outline btn-sm customize-product-btn" style="flex:1;">
        <i class="fas fa-paint-brush"></i> Customizar
      </button>
      <button class="btn btn-primary add-to-cart-detail-btn" style="flex:2;">
        <i class="fas fa-shopping-bag"></i> Adicionar
      </button>
    </div>
  `;
}

// ============================================
// CART DRAWER
// ============================================

function openCartDrawer() {
  renderCartDrawerContent();
  DOM.cartDrawer.style.display = 'flex';
  document.body.style.overflow = 'hidden';

  // Bind drawer cart events
  setTimeout(() => bindCartDrawerEvents(), 50);
}

function renderCartDrawerContent() {
  const itemsList = document.getElementById('cart-items-list');
  const footer = document.getElementById('cart-footer');

  if (AppState.cart.length === 0) {
    itemsList.innerHTML = `
      <div class="cart-empty" style="padding:40px 16px;">
        <div class="cart-empty-icon"><i class="fas fa-shopping-bag"></i></div>
        <h3>Carrinho vazio</h3>
        <p>Adicione produtos e arrasar nos treinos!</p>
      </div>
    `;
    footer.innerHTML = '';
    return;
  }

  itemsList.innerHTML = AppState.cart.map((item, i) => `
    <div class="cart-item">
      <img src="${item.image}" alt="${item.name}" class="cart-item-img" onerror="this.src='https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200&q=80'">
      <div class="cart-item-details">
        <p class="cart-item-name">${item.name}</p>
        <p class="cart-item-variant">Tam: ${item.size} ${item.isCustom ? '· Personalizado' : ''}</p>
        <p class="cart-item-price">${formatPrice(item.price * item.qty)}</p>
        <div class="qty-control">
          <button class="qty-btn drawer-qty-btn" data-cart-index="${i}" data-action="minus"><i class="fas fa-minus"></i></button>
          <span class="qty-value">${item.qty}</span>
          <button class="qty-btn drawer-qty-btn" data-cart-index="${i}" data-action="plus"><i class="fas fa-plus"></i></button>
          <button class="cart-item-remove drawer-remove-btn" data-cart-index="${i}"><i class="fas fa-trash"></i></button>
        </div>
      </div>
    </div>
  `).join('');

  const total = getCartTotal();
  footer.innerHTML = `
    <div class="cart-total-row total">
      <span>Total:</span>
      <span class="price">${formatPrice(total)}</span>
    </div>
    <button class="btn btn-primary btn-full" style="margin-top:12px;" id="drawer-checkout-btn">
      <i class="fas fa-lock"></i> Finalizar Compra
    </button>
    <button class="btn btn-ghost btn-full btn-sm" style="margin-top:8px;" id="drawer-view-cart-btn">
      Ver Carrinho Completo
    </button>
  `;
}

function bindCartDrawerEvents() {
  document.querySelectorAll('.drawer-qty-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const index = parseInt(btn.dataset.cartIndex);
      const delta = btn.dataset.action === 'plus' ? 1 : -1;
      changeCartItemQty(index, delta);
      renderCartDrawerContent();
      bindCartDrawerEvents();
    });
  });

  document.querySelectorAll('.drawer-remove-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const index = parseInt(btn.dataset.cartIndex);
      AppState.cart.splice(index, 1);
      updateCartBadge();
      saveState();
      renderCartDrawerContent();
      bindCartDrawerEvents();
    });
  });

  const checkoutBtn = document.getElementById('drawer-checkout-btn');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      closeDrawer(DOM.cartDrawer);
      navigateTo('cart');
      setTimeout(() => {
        const checkoutBtn2 = document.getElementById('checkout-btn');
        if (checkoutBtn2) checkoutBtn2.click();
      }, 300);
    });
  }

  const viewCartBtn = document.getElementById('drawer-view-cart-btn');
  if (viewCartBtn) {
    viewCartBtn.addEventListener('click', () => {
      closeDrawer(DOM.cartDrawer);
      navigateTo('cart');
    });
  }
}

// ============================================
// FILTERS
// ============================================

function openFilterModal() {
  const body = document.getElementById('filter-body');
  body.innerHTML = renderFilterContent();
  DOM.filterModal.style.display = 'flex';
  document.body.style.overflow = 'hidden';

  // Filter option toggles
  body.querySelectorAll('.filter-option').forEach(opt => {
    opt.addEventListener('click', () => {
      opt.classList.toggle('selected');
    });
  });
}

function renderFilterContent() {
  return `
    <div class="filter-section">
      <p class="filter-section-title">Gênero</p>
      <div class="filter-options">
        ${['Masculino', 'Feminino', 'Unissex'].map(g => `
          <button class="filter-option ${AppState.filters.gender.includes(g.toLowerCase()) ? 'selected' : ''}" data-filter-type="gender" data-filter-value="${g.toLowerCase()}">${g}</button>
        `).join('')}
      </div>
    </div>
    <div class="filter-section">
      <p class="filter-section-title">Tipo de Treino</p>
      <div class="filter-options">
        ${[['treino-pesado', 'Treino Pesado'], ['cardio', 'Cardio'], ['lifestyle', 'Lifestyle']].map(([val, label]) => `
          <button class="filter-option ${AppState.filters.type.includes(val) ? 'selected' : ''}" data-filter-type="type" data-filter-value="${val}">${label}</button>
        `).join('')}
      </div>
    </div>
    <div class="filter-section">
      <p class="filter-section-title">Tamanho</p>
      <div class="filter-options">
        ${['PP', 'P', 'M', 'G', 'GG', 'XGG', 'Único'].map(s => `
          <button class="filter-option ${AppState.filters.sizes.includes(s) ? 'selected' : ''}" data-filter-type="size" data-filter-value="${s}">${s}</button>
        `).join('')}
      </div>
    </div>
  `;
}

function applyFilters() {
  const selectedOpts = document.querySelectorAll('.filter-option.selected');
  const newFilters = { gender: [], type: [], sizes: [] };

  selectedOpts.forEach(opt => {
    const type = opt.dataset.filterType;
    const value = opt.dataset.filterValue;
    if (type === 'gender') newFilters.gender.push(value);
    if (type === 'type') newFilters.type.push(value);
    if (type === 'size') newFilters.sizes.push(value);
  });

  AppState.filters = { ...AppState.filters, ...newFilters };
  closeModal(DOM.filterModal);

  if (AppState.currentScreen === 'shop') {
    const grid = document.getElementById('products-grid');
    const count = document.getElementById('products-count');
    const filtered = getFilteredProducts();
    if (grid) {
      grid.innerHTML = renderProductGrid(filtered);
      bindProductCards();
    }
    if (count) count.textContent = `${filtered.length} produtos`;

    const filterBtn = document.getElementById('filter-btn');
    const totalActive = newFilters.gender.length + newFilters.type.length + newFilters.sizes.length;
    if (filterBtn) filterBtn.classList.toggle('active', totalActive > 0);
  } else {
    navigateTo('shop');
  }
}

function clearFilters() {
  AppState.filters = { gender: [], type: [], sizes: [], category: 'todos' };
  document.querySelectorAll('.filter-option').forEach(opt => opt.classList.remove('selected'));
}

function getFilteredProducts() {
  let products = [...PRODUCTS];

  if (AppState.filters.category && AppState.filters.category !== 'todos') {
    products = products.filter(p => p.category === AppState.filters.category);
  }
  if (AppState.filters.gender.length > 0) {
    products = products.filter(p => AppState.filters.gender.includes(p.gender));
  }
  if (AppState.filters.type.length > 0) {
    products = products.filter(p => AppState.filters.type.includes(p.type));
  }
  if (AppState.filters.sizes.length > 0) {
    products = products.filter(p => p.sizes.some(s => AppState.filters.sizes.includes(s)));
  }

  // Sort
  switch (AppState.sortBy) {
    case 'price-asc': products.sort((a, b) => a.price - b.price); break;
    case 'price-desc': products.sort((a, b) => b.price - a.price); break;
    case 'rating': products.sort((a, b) => b.rating - a.rating); break;
    case 'newest': products.sort((a, b) => (b.badge === 'new' ? 1 : 0) - (a.badge === 'new' ? 1 : 0)); break;
    default: products.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0)); break;
  }

  return products;
}

// ============================================
// SEARCH
// ============================================

function openSearchModal() {
  DOM.searchModal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
  setTimeout(() => document.getElementById('search-input').focus(), 100);
  document.getElementById('search-results').innerHTML = renderSearchSuggestions();
}

function handleSearch(e) {
  const query = e.target.value.trim().toLowerCase();
  const resultsEl = document.getElementById('search-results');

  if (!query) {
    resultsEl.innerHTML = renderSearchSuggestions();
    return;
  }

  const results = PRODUCTS.filter(p =>
    p.name.toLowerCase().includes(query) ||
    p.category.toLowerCase().includes(query) ||
    p.tags.some(t => t.toLowerCase().includes(query))
  );

  if (results.length === 0) {
    resultsEl.innerHTML = `<p style="text-align:center;padding:24px;color:var(--color-text-secondary)">Nenhum resultado para "${query}"</p>`;
    return;
  }

  resultsEl.innerHTML = results.map(p => `
    <div class="search-result-item" data-product-id="${p.id}">
      <img src="${p.image}" alt="${p.name}" class="search-result-thumb" onerror="this.src='https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=100&q=80'">
      <div class="search-result-info">
        <p class="product-name">${p.name}</p>
        <p class="product-price">${formatPrice(p.price)}</p>
      </div>
    </div>
  `).join('');

  resultsEl.querySelectorAll('.search-result-item').forEach(item => {
    item.addEventListener('click', () => {
      closeModal(DOM.searchModal);
      openProductDetail(item.dataset.productId);
    });
  });
}

function renderSearchSuggestions() {
  return `
    <div style="padding:12px 0;">
      <p style="font-size:0.75rem;color:var(--color-text-secondary);font-weight:600;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:10px;padding:0 4px;">Em alta</p>
      ${['Camiseta Dry-Fit', 'Oversized', 'Beast Mode', 'Shorts', 'Boné'].map(term => `
        <div class="search-result-item" style="cursor:pointer;" onclick="document.getElementById('search-input').value='${term}';handleSearchManual('${term}')">
          <i class="fas fa-fire" style="color:var(--color-primary);font-size:1rem;width:48px;text-align:center;flex-shrink:0;"></i>
          <span style="font-size:0.88rem;">${term}</span>
        </div>
      `).join('')}
    </div>
  `;
}

function handleSearchManual(query) {
  const resultsEl = document.getElementById('search-results');
  const results = PRODUCTS.filter(p =>
    p.name.toLowerCase().includes(query.toLowerCase()) ||
    p.category.toLowerCase().includes(query.toLowerCase())
  );

  resultsEl.innerHTML = results.map(p => `
    <div class="search-result-item" data-product-id="${p.id}">
      <img src="${p.image}" alt="${p.name}" class="search-result-thumb">
      <div class="search-result-info">
        <p class="product-name">${p.name}</p>
        <p class="product-price">${formatPrice(p.price)}</p>
      </div>
    </div>
  `).join('');

  resultsEl.querySelectorAll('.search-result-item').forEach(item => {
    item.addEventListener('click', () => {
      closeModal(DOM.searchModal);
      openProductDetail(item.dataset.productId);
    });
  });
}

// ============================================
// MODAL / DRAWER HELPERS
// ============================================

function closeModal(modal) {
  modal.style.display = 'none';
  document.body.style.overflow = '';
}

function closeDrawer(drawer) {
  drawer.style.display = 'none';
  document.body.style.overflow = '';
}

function openSideMenu() {
  DOM.sideMenu.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

// ============================================
// PROFILE ACTIONS
// ============================================

function handleProfileAction(action) {
  switch (action) {
    case 'orders': showToast('info', 'Seus pedidos estão logo abaixo!'); break;
    case 'address': showToast('info', '📍 Gerenciar endereços em breve!'); break;
    case 'notifications': showToast('info', '🔔 Configurar notificações em breve!'); break;
    case 'help': showToast('info', '💬 Atendimento via WhatsApp em breve!'); break;
    case 'logout': showToast('info', '👋 Até logo, atleta!'); break;
    default: break;
  }
}

function showOrderDetail(order) {
  showToast('info', `Pedido ${order.id} · Status: ${order.statusLabel}`);
}

function showMeasurementsModal() {
  showToast('info', '📏 Editor de medidas em breve com IA de sugestão de tamanho!');
}

function showAboutToast() {
  showToast('info', '🔥 Anti-Frango - A marca de treino feita por atletas comuns!');
}

// ============================================
// COUPON
// ============================================

function handleCoupon() {
  const input = document.getElementById('coupon-input');
  if (!input) return;
  const code = input.value.trim().toUpperCase();

  const coupons = { 'ANTIFRANGO10': 10, 'GANG20': 20, 'FRETE0': 0 };

  if (coupons.hasOwnProperty(code)) {
    showToast('success', `✅ Cupom "${code}" aplicado!`);
    input.style.borderColor = '#4ADE80';
  } else {
    showToast('error', `❌ Cupom "${code}" inválido ou expirado.`);
    input.style.borderColor = '#F87171';
  }
}

// ============================================
// TOAST NOTIFICATIONS
// ============================================

function showToast(type = 'info', message = '') {
  const icons = { success: 'fas fa-check-circle', error: 'fas fa-times-circle', info: 'fas fa-info-circle' };
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `<i class="${icons[type]}"></i><span>${message}</span>`;
  DOM.toastContainer.appendChild(toast);
  setTimeout(() => toast.remove(), 3100);
}

// ============================================
// ADMIN PANEL
// ============================================

function openAdmin() {
  initAdminPanel();
  DOM.adminPanel.style.display = 'block';
  document.body.style.overflow = 'hidden';
}

function closeAdmin() {
  DOM.adminPanel.style.display = 'none';
  document.body.style.overflow = '';
}

// ============================================
// STATE PERSISTENCE
// ============================================

function saveState() {
  try {
    localStorage.setItem('antifrango_cart', JSON.stringify(AppState.cart));
    localStorage.setItem('antifrango_wishlist', JSON.stringify(AppState.wishlist));
  } catch (e) {
    console.warn('State save failed:', e);
  }
}

function loadState() {
  try {
    const cart = localStorage.getItem('antifrango_cart');
    const wishlist = localStorage.getItem('antifrango_wishlist');
    if (cart) AppState.cart = JSON.parse(cart);
    if (wishlist) AppState.wishlist = JSON.parse(wishlist);
    updateCartBadge();
  } catch (e) {
    console.warn('State load failed:', e);
  }
}

// ============================================
// UTILITY HELPERS
// ============================================

function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

function getCategoryLabel(cat) {
  const labels = {
    camisetas: 'Camiseta',
    regatas: 'Regata',
    shorts: 'Shorts/Legging',
    bones: 'Boné',
  };
  return labels[cat] || cat;
}

function getGenderLabel(gender) {
  const labels = { masculino: 'Masculino', feminino: 'Feminino', unissex: 'Unissex' };
  return labels[gender] || gender;
}

function getBadgeHTML(badge) {
  if (!badge) return '';
  const labels = { new: 'Novo', sale: 'Sale', drop: 'Drop 🔥' };
  const types = { new: 'badge-new', sale: 'badge-sale', drop: 'badge-drop' };
  return `<span class="product-badge ${types[badge]}">${labels[badge]}</span>`;
}

function renderProductGrid(products) {
  if (products.length === 0) {
    return `<div style="grid-column:1/-1;text-align:center;padding:40px;color:var(--color-text-secondary)">
      <i class="fas fa-search" style="font-size:2rem;margin-bottom:12px;color:var(--color-text-muted);display:block;"></i>
      Nenhum produto encontrado
    </div>`;
  }
  return products.map(p => renderProductCard(p)).join('');
}

function renderProductCard(product) {
  return `
    <div class="product-card" data-product-id="${product.id}">
      <div class="product-image-wrap">
        ${getBadgeHTML(product.badge)}
        <img src="${product.image}" alt="${product.name}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=80'">
        <button class="product-quick-add" data-product-id="${product.id}" aria-label="Adicionar ao carrinho">
          <i class="fas fa-plus"></i>
        </button>
      </div>
      <div class="product-info">
        <p class="product-name">${product.name}</p>
        <p class="product-sub">${getCategoryLabel(product.category)}</p>
        <div class="product-price-row">
          <span class="product-price">${formatPrice(product.price)}</span>
          <div class="product-rating">
            <i class="fas fa-star"></i>
            <span>${product.rating}</span>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderCartTotalsContent() {
  const subtotal = getCartTotal();
  const frete = subtotal >= 199.90 ? 0 : 19.90;
  const total = subtotal + frete;
  return `
    <div class="cart-total-row"><span>Subtotal:</span><span>${formatPrice(subtotal)}</span></div>
    <div class="cart-total-row"><span>Frete:</span><span>${frete === 0 ? '<span style="color:#4ADE80">Grátis</span>' : formatPrice(frete)}</span></div>
    <div class="cart-total-row total"><span>Total:</span><span class="price">${formatPrice(total)}</span></div>
  `;
}
