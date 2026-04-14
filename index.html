// ============================================
// ANTI-FRANGO - Customizer Logic
// ============================================

function initCustomizer() {
  // Color swatches
  document.querySelectorAll('.color-swatch').forEach(swatch => {
    swatch.addEventListener('click', () => {
      document.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('selected'));
      swatch.classList.add('selected');
      const color = swatch.dataset.color;
      const shirtBody = document.getElementById('shirt-body');
      const sleeves = document.querySelectorAll('#shirt-group path');
      if (shirtBody) shirtBody.setAttribute('fill', color);
      sleeves.forEach(p => { if (p.id !== 'shirt-body') p.setAttribute('fill', color); });
    });
  });

  // Motivational phrase chips
  document.querySelectorAll('.phrase-chip[data-phrase]').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('.phrase-chip[data-phrase]').forEach(c => c.classList.remove('selected'));
      chip.classList.add('selected');
      const input = document.getElementById('custom-text-input');
      if (input) input.value = chip.dataset.phrase;
      updateShirtText(chip.dataset.phrase);
    });
  });

  // Custom text input
  const textInput = document.getElementById('custom-text-input');
  if (textInput) {
    textInput.addEventListener('input', () => updateShirtText(textInput.value));
  }

  // Upload art
  const uploadArea = document.getElementById('upload-area');
  const artUpload  = document.getElementById('art-upload');
  if (uploadArea && artUpload) {
    uploadArea.addEventListener('click', () => artUpload.click());
    uploadArea.addEventListener('dragover', e => { e.preventDefault(); uploadArea.classList.add('drag-over'); });
    uploadArea.addEventListener('dragleave', () => uploadArea.classList.remove('drag-over'));
    uploadArea.addEventListener('drop', e => {
      e.preventDefault();
      uploadArea.classList.remove('drag-over');
      const file = e.dataTransfer.files[0];
      if (file) handleArtUpload(file);
    });
    artUpload.addEventListener('change', () => {
      if (artUpload.files[0]) handleArtUpload(artUpload.files[0]);
    });
  }

  // Product base selector
  document.querySelectorAll('[data-product-base]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-product-base]').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      updateCustomizerPrice();
    });
  });

  // Size selector
  document.querySelectorAll('.size-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
    });
  });

  // Add to cart button
  const addBtn = document.getElementById('add-custom-to-cart-btn');
  if (addBtn) {
    addBtn.addEventListener('click', addCustomToCart);
  }
}

function updateShirtText(text) {
  const el = document.getElementById('shirt-custom-text');
  if (!el) return;
  if (text && text.trim()) {
    el.style.display = 'block';
    el.textContent = text.trim();
  } else {
    el.style.display = 'none';
  }
}

function handleArtUpload(file) {
  if (!file.type.startsWith('image/')) {
    alert('Por favor envie uma imagem (PNG ou JPG).');
    return;
  }
  if (file.size > 5 * 1024 * 1024) {
    alert('Imagem muito grande. Máximo 5MB.');
    return;
  }
  const reader = new FileReader();
  reader.onload = (e) => {
    const wrap = document.getElementById('shirt-custom-img-wrap');
    const img  = document.getElementById('shirt-custom-img');
    if (wrap && img) {
      img.src = e.target.result;
      wrap.style.display = 'block';
    }
    const uploadText = document.querySelector('.upload-text');
    if (uploadText) uploadText.textContent = '✅ ' + file.name;
  };
  reader.readAsDataURL(file);
}

function updateCustomizerPrice() {
  const baseBtn = document.querySelector('[data-product-base].selected');
  const prices  = { 'Camiseta Dry-Fit': 89.90, 'Oversized': 119.90, 'Regata': 69.90, 'Shorts': 99.90 };
  const base    = baseBtn ? (prices[baseBtn.dataset.productBase] || 89.90) : 89.90;
  const total   = base + 20.00;
  const el      = document.getElementById('customizer-total-price');
  if (el) el.textContent = `Total: R$ ${total.toFixed(2).replace('.', ',')}`;
}

function addCustomToCart() {
  const textInput  = document.getElementById('custom-text-input');
  const baseBtn    = document.querySelector('[data-product-base].selected');
  const sizeBtn    = document.querySelector('.size-btn.selected');
  const colorSwatch= document.querySelector('.color-swatch.selected');

  const item = {
    id: 'custom-' + Date.now(),
    name: 'Peça Personalizada Anti-Frango',
    details: `${baseBtn ? baseBtn.dataset.productBase : 'Camiseta'} · ${sizeBtn ? sizeBtn.dataset.size : 'M'} · ${textInput && textInput.value ? '"' + textInput.value + '"' : 'Sem texto'}`,
    price: parseFloat((document.getElementById('customizer-total-price') || {}).textContent?.replace(/[^0-9,]/g,'').replace(',','.')) || 109.90,
    image: colorSwatch ? null : null,
    qty: 1,
    custom: true,
  };

  if (typeof AppState !== 'undefined') {
    AppState.cart.push(item);
    if (typeof updateCartBadge === 'function') updateCartBadge();
    if (typeof showToast === 'function') showToast('Peça adicionada ao carrinho! 🔥');
  }
}
