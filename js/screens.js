// ============================================
// ANTI-FRANGO - Screen Renderers
// All 6 main screens rendered as HTML strings
// ============================================

// ============================================
// SCREEN 1: HOME
// ============================================

function renderHomeScreen() {
  const featuredProducts = PRODUCTS.filter(p => p.featured).slice(0, 6);
  const newProducts = PRODUCTS.filter(p => p.badge === 'new').slice(0, 6);

  return `
    <section class="home-screen">

      <!-- Banner Carousel -->
      <div class="banner-carousel">
        <div class="banner-slides">
          ${BANNERS.map((banner, i) => `
            <div class="banner-slide">
              <img src="${banner.image}" alt="${banner.title}" loading="${i === 0 ? 'eager' : 'lazy'}"
                onerror="this.style.display='none';this.nextElementSibling.style.background='${banner.bgGradient}'">
              <div class="banner-overlay">
                <span class="banner-tag">${banner.tag}</span>
                <h2 class="banner-title">${banner.title.replace('\n', '<br>')}</h2>
                <p class="banner-sub">${banner.subtitle}</p>
                <button class="banner-btn" data-product-id="${banner.productId}">${banner.btnText} →</button>
              </div>
            </div>
          `).join('')}
        </div>
        <div class="banner-dots">
          ${BANNERS.map((_, i) => `<button class="banner-dot ${i === 0 ? 'active' : ''}" data-slide="${i}"></button>`).join('')}
        </div>
      </div>

      <!-- Stats Banner -->
      <div class="stats-banner">
        <div class="stat-item">
          <div class="stat-number">12k+</div>
          <div class="stat-label">Atletas</div>
        </div>
        <div class="stat-item">
          <div class="stat-number">4.9★</div>
          <div class="stat-label">Avaliação</div>
        </div>
        <div class="stat-item">
          <div class="stat-number">48h</div>
          <div class="stat-label">Entrega</div>
        </div>
      </div>

      <!-- Category Pills -->
      <div class="category-pills">
        ${CATEGORIES.map(cat => `
          <button class="category-pill ${AppState.filters.category === cat.id ? 'active' : ''}" data-cat="${cat.id}">
            <i class="${cat.icon}"></i>
            ${cat.label}
          </button>
        `).join('')}
      </div>

      <!-- Drop da Semana -->
      <div class="section-mb">
        <div class="section-header">
          <h2 class="section-title"><i class="fas fa-fire fire-icon"></i> Drop da Semana</h2>
          <button class="section-link" onclick="navigateTo('shop')">Ver todos</button>
        </div>
        <div class="h-scroll-wrap">
          <div class="h-scroll-row">
            ${featuredProducts.map(p => renderProductCard(p)).join('')}
          </div>
        </div>
      </div>

      <!-- Flame Divider -->
      <div class="flame-divider"><i class="fas fa-fire"></i></div>

      <!-- Novidades -->
      <div class="section-mb">
        <div class="section-header">
          <h2 class="section-title">⚡ Novidades</h2>
          <button class="section-link" onclick="navigateTo('shop')">Ver todos</button>
        </div>
        <div class="h-scroll-wrap">
          <div class="h-scroll-row">
            ${newProducts.map(p => renderProductCard(p)).join('')}
          </div>
        </div>
      </div>

      <!-- Community Feed Preview -->
      <div class="section-mb">
        <div class="section-header">
          <h2 class="section-title">👊 Anti-Frango Gang</h2>
          <button class="section-link" onclick="navigateTo('community')">Ver tudo</button>
        </div>
        <div class="feed-section">
          <div class="feed-grid">
            ${FEED_POSTS.map(post => `
              <div class="feed-post-card">
                <img src="${post.image}" alt="${post.username}" loading="lazy"
                  onerror="this.src='https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&q=80'">
                <div class="feed-post-overlay">
                  <div class="feed-post-user">
                    <div class="feed-user-avatar-sm"></div>
                    <span class="feed-post-username">@${post.username}</span>
                  </div>
                  <div class="feed-post-likes">
                    <i class="fas fa-heart"></i>
                    ${post.likes.toLocaleString('pt-BR')}
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>

      <!-- CTA Banner Customizar -->
      <div style="margin:0 16px 24px;">
        <div style="background:var(--gradient-fire);border-radius:16px;padding:24px 20px;text-align:center;position:relative;overflow:hidden;">
          <div style="position:absolute;top:-20px;right:-20px;font-size:6rem;opacity:0.1;">🔥</div>
          <h3 style="font-size:1.1rem;font-weight:900;color:white;margin-bottom:6px;">Cria a sua, única!</h3>
          <p style="font-size:0.82rem;color:rgba(255,255,255,0.85);margin-bottom:14px;">Customiza sua peça com seu nome, frase ou arte</p>
          <button class="btn" style="background:white;color:#FF6A00;font-weight:800;border-radius:25px;padding:10px 24px;font-size:0.85rem;" onclick="navigateTo('customize')">
            <i class="fas fa-paint-brush"></i> Começar a Customizar
          </button>
        </div>
      </div>

      <!-- Brand Statement -->
      <div style="text-align:center;padding:16px 24px 32px;">
        <img src="https://www.genspark.ai/api/files/s/Owkk8pvM" alt="Anti-Frango" style="height:60px;margin-bottom:12px;filter:drop-shadow(0 0 12px rgba(255,106,0,0.4));">
        <p style="font-size:0.82rem;color:var(--color-text-secondary);font-style:italic;">
          "A marca de treino feita por atletas comuns"
        </p>
      </div>

    </section>
  `;
}

// ============================================
// SCREEN 2: SHOP
// ============================================

function renderShopScreen() {
  const products = getFilteredProducts();
  const activeFiltersCount = AppState.filters.gender.length + AppState.filters.type.length + AppState.filters.sizes.length;

  return `
    <section class="shop-screen">

      <!-- Category Tabs -->
      <div class="shop-category-tabs">
        ${CATEGORIES.map(cat => `
          <button class="tab-btn ${AppState.filters.category === cat.id ? 'active' : ''}" data-cat="${cat.id}">
            ${cat.label}
          </button>
        `).join('')}
      </div>

      <!-- Toolbar -->
      <div class="shop-toolbar">
        <button class="filter-btn ${activeFiltersCount > 0 ? 'active' : ''}" id="filter-btn">
          <i class="fas fa-sliders-h"></i>
          Filtros
          ${activeFiltersCount > 0 ? `<span class="filter-count">${activeFiltersCount}</span>` : ''}
        </button>

        <select class="sort-select" id="sort-select">
          <option value="featured">Destaque</option>
          <option value="newest">Novidades</option>
          <option value="price-asc">Menor Preço</option>
          <option value="price-desc">Maior Preço</option>
          <option value="rating">Mais Avaliados</option>
        </select>
      </div>

      <!-- Products Count -->
      <p class="products-count" id="products-count">${products.length} produtos encontrados</p>

      <!-- Products Grid -->
      <div class="shop-products-grid" id="products-grid">
        ${renderProductGrid(products)}
      </div>

    </section>
  `;
}

// ============================================
// SCREEN 3: CUSTOMIZE
// ============================================

function renderCustomizeScreen() {
  return `
    <section class="customize-screen">

      <div class="customizer-header">
        <h2 class="customizer-title">🔥 Crie sua Peça</h2>
        <p class="customizer-sub">Personaliza com seu nome, frase ou arte única</p>
      </div>

      <!-- Shirt Preview -->
      <div class="shirt-preview-section">
        <div class="shirt-canvas-wrap" id="shirt-canvas-wrap">
          <svg class="shirt-svg" viewBox="0 0 240 280" id="shirt-svg" xmlns="http://www.w3.org/2000/svg">
            <!-- Shirt Shape -->
            <g id="shirt-group">
              <!-- Main body -->
              <path id="shirt-body" d="M60 60 L20 100 L50 115 L50 240 L190 240 L190 115 L220 100 L180 60 L155 75 C155 75 140 85 120 85 C100 85 85 75 85 75 Z" 
                fill="#1A1A1A" stroke="#383838" stroke-width="2"/>
              <!-- Left sleeve -->
              <path d="M60 60 L85 75 L50 115 L20 100 Z" fill="#1A1A1A" stroke="#383838" stroke-width="2"/>
              <!-- Right sleeve -->
              <path d="M180 60 L155 75 L190 115 L220 100 Z" fill="#1A1A1A" stroke="#383838" stroke-width="2"/>
              <!-- Collar -->
              <path d="M85 75 C85 75 100 85 120 85 C140 85 155 75 155 75 L150 65 C150 65 140 72 120 72 C100 72 90 65 90 65 Z" 
                fill="#2A2A2A" stroke="#383838" stroke-width="1.5"/>
            </g>
            <!-- Logo on shirt -->
            <image href="https://www.genspark.ai/api/files/s/Owkk8pvM" x="80" y="105" width="80" height="60" id="shirt-logo" opacity="0.9"/>
          </svg>
          <!-- Custom text overlay -->
          <div class="shirt-custom-text" id="shirt-custom-text" style="display:none;"></div>
          <!-- Custom image overlay -->
          <div id="shirt-custom-img-wrap" style="display:none;position:absolute;top:40%;left:50%;transform:translate(-50%,-50%);max-width:100px;max-height:80px;overflow:hidden;border-radius:4px;">
            <img id="shirt-custom-img" src="" alt="Custom art" style="max-width:100px;max-height:80px;object-fit:contain;">
          </div>
        </div>
      </div>

      <!-- Customizer Controls -->
      <div class="customizer-controls">

        <!-- Shirt Color -->
        <div class="control-group">
          <p class="control-label"><i class="fas fa-palette"></i> Cor da Camiseta</p>
          <div class="color-swatches" id="shirt-color-swatches">
            ${SHIRT_COLORS.map((c, i) => `
              <div class="color-swatch ${i === 0 ? 'selected' : ''}" 
                style="background:${c.hex};width:36px;height:36px;" 
                data-color="${c.hex}" 
                title="${c.label}">
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Motivational Phrases -->
        <div class="control-group">
          <p class="control-label"><i class="fas fa-bolt"></i> Frases Motivacionais</p>
          <div class="phrase-chips" id="phrase-chips">
            ${MOTIVATIONAL_PHRASES.map(phrase => `
              <button class="phrase-chip" data-phrase="${phrase}">${phrase}</button>
            `).join('')}
          </div>
        </div>

        <!-- Custom Name/Text -->
        <div class="control-group">
          <p class="control-label"><i class="fas fa-font"></i> Seu nome ou texto personalizado</p>
          <input type="text" 
            class="custom-text-input" 
            id="custom-text-input" 
            placeholder="Ex: João Beast, Time Cobra..." 
            maxlength="30">
          <p style="font-size:0.7rem;color:var(--color-text-muted);margin-top:4px;">Máx. 30 caracteres</p>
        </div>

        <!-- Upload Art -->
        <div class="control-group">
          <p class="control-label"><i class="fas fa-image"></i> Upload de arte (PNG/JPG)</p>
          <div class="upload-area" id="upload-area">
            <div class="upload-icon"><i class="fas fa-cloud-upload-alt"></i></div>
            <p class="upload-text">Clique ou arraste sua arte aqui</p>
            <p class="upload-hint">PNG, JPG até 5MB · Fundo transparente é melhor!</p>
            <input type="file" id="art-upload" accept="image/*" style="display:none;">
          </div>
        </div>

        <!-- Base Product Selection -->
        <div class="control-group">
          <p class="control-label"><i class="fas fa-tshirt"></i> Produto Base</p>
          <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px;">
            ${['Camiseta Dry-Fit', 'Oversized', 'Regata', 'Shorts'].map((item, i) => `
              <button class="phrase-chip ${i === 0 ? 'selected' : ''}" data-product-base="${item}" style="text-align:left;">
                ${item}
              </button>
            `).join('')}
          </div>
        </div>

        <!-- Size Selector -->
        <div class="control-group">
          <p class="control-label"><i class="fas fa-ruler"></i> Tamanho</p>
          <div class="size-options">
            ${['P', 'M', 'G', 'GG', 'XGG'].map((s, i) => `
              <button class="size-btn ${i === 1 ? 'selected' : ''}" data-size="${s}">${s}</button>
            `).join('')}
          </div>
        </div>

      </div>

      <!-- Price Bar -->
      <div class="customizer-price-bar">
        <div class="price-breakdown">
          <span style="font-size:0.75rem;">Base R$89,90 + Customização R$20,00</span>
          <span class="total-price" id="customizer-total-price">Total: R$ 109,90</span>
        </div>
        <button class="btn btn-primary" id="add-custom-to-cart-btn">
          <i class="fas fa-shopping-bag"></i> Adicionar
        </button>
      </div>

    </section>
  `;
}

// ============================================
// SCREEN 4: COMMUNITY
// ============================================

function renderCommunityScreen() {
  return `
    <section class="community-screen">

      <!-- Community Tabs -->
      <div class="community-tabs">
        ${[
          { id: 'em-alta', label: '🔥 Em Alta' },
          { id: 'seguindo', label: '👥 Seguindo' },
          { id: 'gang', label: '💪 AF Gang' },
        ].map(tab => `
          <button class="tab-btn ${AppState.communityTab === tab.id ? 'active' : ''}" data-tab="${tab.id}">
            ${tab.label}
          </button>
        `).join('')}
      </div>

      <!-- Posts Feed -->
      <div id="community-feed">
        ${COMMUNITY_POSTS.map(post => renderCommunityPost(post)).join('')}
      </div>

    </section>

    <!-- FAB: Post -->
    <button class="community-fab" aria-label="Publicar">
      <i class="fas fa-plus"></i>
    </button>
  `;
}

function renderCommunityPost(post) {
  const levelColors = {
    'Avançado': '#FF6A00',
    'Intermediário': '#FFC300',
    'Iniciante': '#4ADE80',
  };
  const levelColor = levelColors[post.level] || '#FF6A00';

  return `
    <article class="community-post-card">
      <div class="post-header">
        <div class="user-avatar">
          <img src="${post.avatar}" alt="${post.displayName}" 
            onerror="this.parentElement.innerHTML='${post.displayName.charAt(0)}'">
        </div>
        <div class="post-user-info">
          <p class="post-username">@${post.username}</p>
          <div class="post-meta">
            <span class="post-badge" style="background:${levelColor}">${post.level}</span>
            <span>${post.time}</span>
          </div>
        </div>
        <button class="post-follow-btn ${post.following ? 'following' : ''}">${post.following ? 'Seguindo' : 'Seguir'}</button>
      </div>

      <img src="${post.image}" alt="Post ${post.id}" class="post-image" loading="lazy"
        onerror="this.className='post-image-placeholder';this.outerHTML='<div class=&quot;post-image-placeholder&quot;><i class=&quot;fas fa-dumbbell&quot;></i><span>Treino épico!</span></div>'">

      <p class="post-caption">${post.caption}</p>

      <div class="post-tags">
        ${post.tags.map(tag => `<span class="post-tag">${tag}</span>`).join('')}
      </div>

      <div class="post-actions">
        <button class="post-action-btn ${post.liked ? 'liked' : ''}" data-action="like" data-post-id="${post.id}">
          <i class="${post.liked ? 'fas' : 'far'} fa-heart"></i>
          <span class="like-count">${post.likes.toLocaleString('pt-BR')}</span>
        </button>
        <button class="post-action-btn" data-action="comment">
          <i class="far fa-comment"></i>
          <span>${post.comments}</span>
        </button>
        <button class="post-action-btn post-share-btn" data-action="share" onclick="showToast('info','🔗 Link copiado!')">
          <i class="far fa-paper-plane"></i>
          Compartilhar
        </button>
      </div>
    </article>
  `;
}

// ============================================
// SCREEN 5: PROFILE
// ============================================

function renderProfileScreen() {
  const user = AppState.user;
  const levelIcons = { 'Iniciante': '🌱', 'Intermediário': '🔥', 'Avançado': '💪' };
  const icon = levelIcons[user.level] || '🔥';

  return `
    <section class="profile-screen">

      <!-- Header Background -->
      <div class="profile-header-bg"></div>

      <!-- Avatar -->
      <div class="profile-avatar-wrap">
        <div class="profile-avatar">
          <i class="fas fa-user" style="font-size:2rem;"></i>
        </div>
        <div class="profile-edit-avatar"><i class="fas fa-camera"></i></div>
      </div>

      <!-- Profile Info -->
      <div class="profile-info">
        <h2 class="profile-name">${user.name}</h2>
        <p class="profile-email">${user.email}</p>
        <span class="fitness-level-badge">${icon} ${user.level}</span>
      </div>

      <!-- Stats -->
      <div class="profile-stats">
        <div class="profile-stat">
          <div class="profile-stat-number">${user.orders}</div>
          <div class="profile-stat-label">Pedidos</div>
        </div>
        <div class="profile-stat">
          <div class="profile-stat-number">${user.favorites}</div>
          <div class="profile-stat-label">Favoritos</div>
        </div>
        <div class="profile-stat">
          <div class="profile-stat-number">${user.points.toLocaleString('pt-BR')}</div>
          <div class="profile-stat-label">Pontos</div>
        </div>
      </div>

      <!-- Measurements Section -->
      <div class="profile-section">
        <p class="profile-section-title">
          <i class="fas fa-ruler-combined"></i> Minhas Medidas
          <button id="edit-measurements-btn" class="btn btn-sm btn-ghost" style="margin-left:auto;padding:4px 10px;font-size:0.72rem;">
            <i class="fas fa-edit"></i> Editar
          </button>
        </p>

        <div class="measurements-grid">
          ${[
            { icon: 'fas fa-arrows-alt-v', label: 'Altura', value: user.measurements.altura },
            { icon: 'fas fa-weight', label: 'Peso', value: user.measurements.peso },
            { icon: 'fas fa-circle-notch', label: 'Peito', value: user.measurements.peito },
            { icon: 'fas fa-compress-alt', label: 'Cintura', value: user.measurements.cintura },
          ].map(m => `
            <div class="measurement-card">
              <div class="measurement-icon"><i class="${m.icon}"></i></div>
              <div>
                <div class="measurement-value">${m.value}</div>
                <div class="measurement-label">${m.label}</div>
              </div>
            </div>
          `).join('')}
        </div>

        <div class="ai-size-suggestion">
          <div class="ai-icon"><i class="fas fa-robot"></i></div>
          <div class="ai-suggestion-text">
            🤖 <strong>IA sugere Tamanho G</strong> para suas medidas. Ideal para Oversized, use <strong>GG</strong>. Vai cair perfeito! 💪
          </div>
        </div>
      </div>

      <!-- Orders Section -->
      <div class="profile-section">
        <p class="profile-section-title"><i class="fas fa-box"></i> Últimos Pedidos</p>
        ${ORDERS.map(order => `
          <div class="order-item" data-order-id="${order.id}">
            <div class="order-thumb">
              <img src="${order.image}" alt="Pedido" onerror="this.src='https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=100&q=80'">
            </div>
            <div class="order-info">
              <p class="order-name">${order.products[0]}${order.products.length > 1 ? ` +${order.products.length - 1}` : ''}</p>
              <p class="order-date">${order.date} · #${order.id}</p>
              <p class="order-price">${formatPrice(order.total)}</p>
            </div>
            <span class="order-status status-${order.status}">${order.statusLabel}</span>
          </div>
        `).join('')}
      </div>

      <!-- Menu Items -->
      <div class="profile-section">
        <p class="profile-section-title"><i class="fas fa-cog"></i> Conta</p>
        ${[
          { icon: 'fas fa-map-marker-alt', title: 'Endereços', sub: 'Gerencie seus endereços', action: 'address' },
          { icon: 'fas fa-bell', title: 'Notificações', sub: 'Configure seus alertas', action: 'notifications' },
          { icon: 'fas fa-headset', title: 'Suporte', sub: 'Atendimento via WhatsApp', action: 'help' },
          { icon: 'fas fa-sign-out-alt', title: 'Sair', sub: 'Encerrar sessão', action: 'logout' },
        ].map(item => `
          <button class="profile-menu-item" data-action="${item.action}">
            <div class="profile-menu-icon"><i class="${item.icon}"></i></div>
            <div class="profile-menu-text">
              <div class="profile-menu-title">${item.title}</div>
              <div class="profile-menu-sub">${item.sub}</div>
            </div>
            <i class="fas fa-chevron-right profile-menu-arrow"></i>
          </button>
        `).join('')}
      </div>

      <!-- Footer -->
      <div style="text-align:center;padding:16px;color:var(--color-text-muted);font-size:0.72rem;">
        Anti-Frango v1.0.0 · "A marca de treino feita por atletas comuns"
      </div>

    </section>
  `;
}

// ============================================
// SCREEN 6: CART
// ============================================

function renderCartScreen() {
  if (AppState.cart.length === 0) {
    return `
      <section class="cart-screen">
        <div style="padding:16px;">
          <h2 style="font-size:1.1rem;font-weight:800;margin-bottom:2px;">Meu Carrinho</h2>
          <p style="font-size:0.78rem;color:var(--color-text-secondary);">${getCartItemCount()} ${getCartItemCount() === 1 ? 'item' : 'itens'}</p>
        </div>
        <div class="cart-empty">
          <div class="cart-empty-icon"><i class="fas fa-shopping-bag"></i></div>
          <h3>Carrinho vazio 😢</h3>
          <p>Que tal adicionar umas peças Anti-Frango?</p>
          <button class="btn btn-primary" onclick="navigateTo('shop')">
            <i class="fas fa-tshirt"></i> Explorar Loja
          </button>
        </div>
      </section>
    `;
  }

  const subtotal = getCartTotal();
  const frete = subtotal >= 199.90 ? 0 : 19.90;
  const total = subtotal + frete;

  return `
    <section class="cart-screen">
      <div style="padding:16px 16px 0;">
        <h2 style="font-size:1.1rem;font-weight:800;margin-bottom:2px;">Meu Carrinho</h2>
        <p style="font-size:0.78rem;color:var(--color-text-secondary);">${getCartItemCount()} ${getCartItemCount() === 1 ? 'item' : 'itens'}</p>
      </div>

      <!-- Cart Items -->
      <div style="padding:0 16px;">
        ${AppState.cart.map((item, i) => `
          <div class="cart-item">
            <img src="${item.image}" alt="${item.name}" class="cart-item-img"
              onerror="this.src='https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200&q=80'">
            <div class="cart-item-details">
              <p class="cart-item-name">${item.name}</p>
              <p class="cart-item-variant">Tam: ${item.size}${item.isCustom ? ' · <span style="color:var(--color-primary)">Customizado</span>' : ''}</p>
              <p class="cart-item-price">${formatPrice(item.price)}</p>
              <div class="qty-control">
                <button class="qty-btn" data-cart-index="${i}" data-action="minus"><i class="fas fa-minus"></i></button>
                <span class="qty-value">${item.qty}</span>
                <button class="qty-btn" data-cart-index="${i}" data-action="plus"><i class="fas fa-plus"></i></button>
                <button class="cart-item-remove" data-cart-index="${i}"><i class="fas fa-trash"></i></button>
              </div>
            </div>
          </div>
        `).join('')}
      </div>

      <!-- Coupon -->
      <div style="padding:0 16px;">
        <div class="coupon-input-wrap">
          <input type="text" id="coupon-input" placeholder="CÓDIGO DE CUPOM" autocomplete="off">
          <button class="btn btn-outline btn-sm" id="apply-coupon-btn">Aplicar</button>
        </div>
      </div>

      <!-- Totals -->
      <div style="padding:0 16px;">
        <div class="cart-totals" id="cart-totals">
          ${renderCartTotalsContent()}
        </div>
      </div>

      <!-- Frete Info -->
      ${frete > 0 ? `
        <div style="margin:8px 16px;background:rgba(255,106,0,0.1);border:1px solid rgba(255,106,0,0.25);border-radius:8px;padding:10px 14px;font-size:0.78rem;color:var(--color-text-secondary);">
          <i class="fas fa-truck" style="color:var(--color-primary);margin-right:6px;"></i>
          Adicione mais <strong style="color:var(--color-primary)">${formatPrice(199.90 - subtotal)}</strong> para frete grátis!
        </div>
      ` : `
        <div style="margin:8px 16px;background:rgba(74,222,128,0.1);border:1px solid rgba(74,222,128,0.25);border-radius:8px;padding:10px 14px;font-size:0.78rem;color:#4ADE80;">
          <i class="fas fa-check-circle" style="margin-right:6px;"></i>
          Frete grátis aplicado! 🎉
        </div>
      `}

      <!-- Checkout Button -->
      <div style="padding:16px;">
        <button class="btn btn-primary btn-full" id="checkout-btn">
          <i class="fas fa-lock"></i> Finalizar Compra · ${formatPrice(total)}
        </button>
        <button class="btn btn-ghost btn-full btn-sm" style="margin-top:8px;" onclick="navigateTo('shop')">
          <i class="fas fa-plus"></i> Continuar Comprando
        </button>
      </div>

    </section>
  `;
}
