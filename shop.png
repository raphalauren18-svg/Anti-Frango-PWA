// ============================================
// ANTI-FRANGO - Checkout Flow
// ============================================

function renderCheckoutFlow() {
  const cart = (typeof AppState !== 'undefined') ? AppState.cart : [];
  const total = cart.reduce((s, i) => s + (i.price * (i.qty || 1)), 0);

  return `
    <div class="checkout-flow">
      <div class="checkout-header">
        <button class="btn-back-checkout icon-btn" id="back-to-cart-btn">
          <i class="fas fa-arrow-left"></i>
        </button>
        <h2 style="font-size:1.1rem;font-weight:700;">Finalizar Pedido</h2>
        <span></span>
      </div>

      <!-- Progress steps -->
      <div class="checkout-steps">
        <div class="step active" id="step-indicator-1">1 Endereço</div>
        <div class="step-line"></div>
        <div class="step" id="step-indicator-2">2 Pagamento</div>
        <div class="step-line"></div>
        <div class="step" id="step-indicator-3">3 Confirmação</div>
      </div>

      <div class="checkout-body">

        <!-- Step 1: Address -->
        <div id="checkout-step-1">
          <h3 class="checkout-section-title"><i class="fas fa-map-marker-alt"></i> Endereço de Entrega</h3>
          <div class="checkout-form">
            <div class="form-group">
              <label>CEP</label>
              <input type="text" id="cep-input" placeholder="00000-000" maxlength="9" inputmode="numeric"
                style="background:var(--color-surface);color:var(--color-text);border:1px solid var(--color-border);border-radius:8px;padding:12px;width:100%;font-size:1rem;">
            </div>
            <div style="display:grid;grid-template-columns:2fr 1fr;gap:8px;">
              <div class="form-group">
                <label>Rua</label>
                <input type="text" id="rua-input" placeholder="Nome da rua"
                  style="background:var(--color-surface);color:var(--color-text);border:1px solid var(--color-border);border-radius:8px;padding:12px;width:100%;font-size:1rem;">
              </div>
              <div class="form-group">
                <label>Número</label>
                <input type="text" id="num-input" placeholder="Nº"
                  style="background:var(--color-surface);color:var(--color-text);border:1px solid var(--color-border);border-radius:8px;padding:12px;width:100%;font-size:1rem;">
              </div>
            </div>
            <div class="form-group">
              <label>Complemento (opcional)</label>
              <input type="text" id="comp-input" placeholder="Apto, bloco..."
                style="background:var(--color-surface);color:var(--color-text);border:1px solid var(--color-border);border-radius:8px;padding:12px;width:100%;font-size:1rem;">
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
              <div class="form-group">
                <label>Cidade</label>
                <input type="text" id="cidade-input" placeholder="Cidade"
                  style="background:var(--color-surface);color:var(--color-text);border:1px solid var(--color-border);border-radius:8px;padding:12px;width:100%;font-size:1rem;">
              </div>
              <div class="form-group">
                <label>Estado</label>
                <select id="estado-input"
                  style="background:var(--color-surface);color:var(--color-text);border:1px solid var(--color-border);border-radius:8px;padding:12px;width:100%;font-size:1rem;">
                  ${['SP','RJ','MG','RS','PR','SC','BA','GO','DF','PE','CE','AM','PA','MT','MS','ES','RN','PB','AL','SE','PI','MA','TO','RO','AC','RR','AP'].map(s=>`<option>${s}</option>`).join('')}
                </select>
              </div>
            </div>
          </div>

          <!-- Shipping options -->
          <h3 class="checkout-section-title" style="margin-top:16px;"><i class="fas fa-truck"></i> Frete</h3>
          <div style="display:flex;flex-direction:column;gap:8px;">
            ${[
              {id:'pac',label:'PAC — Correios', days:'5-8 dias úteis', price:'R$ 18,90'},
              {id:'sedex',label:'SEDEX — Correios', days:'2-3 dias úteis', price:'R$ 34,90'},
              {id:'free',label:'🔥 Frete Grátis', days:'7-10 dias úteis', price:'GRÁTIS (acima de R$199)'},
            ].map((opt,i)=>`
              <label style="display:flex;align-items:center;gap:12px;background:var(--color-surface);border:1px solid ${i===0?'var(--color-primary)':'var(--color-border)'};border-radius:10px;padding:12px;cursor:pointer;">
                <input type="radio" name="frete" value="${opt.id}" ${i===0?'checked':''} style="accent-color:var(--color-primary);">
                <div style="flex:1;">
                  <div style="font-weight:600;font-size:0.9rem;">${opt.label}</div>
                  <div style="font-size:0.75rem;color:var(--color-text-muted);">${opt.days}</div>
                </div>
                <div style="font-weight:700;color:var(--color-primary);font-size:0.9rem;">${opt.price}</div>
              </label>
            `).join('')}
          </div>

          <button class="btn btn-primary btn-full" id="go-to-payment-btn" style="margin-top:16px;">
            Continuar para Pagamento <i class="fas fa-arrow-right"></i>
          </button>
        </div>

        <!-- Step 2: Payment (hidden initially) -->
        <div id="checkout-step-2" style="display:none;">
          <h3 class="checkout-section-title"><i class="fas fa-credit-card"></i> Pagamento</h3>
          <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:16px;">
            ${[
              {id:'pix',icon:'fas fa-qrcode',label:'PIX',sub:'Aprovação instantânea · 5% de desconto'},
              {id:'credit',icon:'fas fa-credit-card',label:'Cartão de Crédito',sub:'Até 12x sem juros'},
              {id:'boleto',icon:'fas fa-barcode',label:'Boleto Bancário',sub:'Vencimento em 3 dias úteis'},
            ].map((opt,i)=>`
              <label style="display:flex;align-items:center;gap:12px;background:var(--color-surface);border:1px solid ${i===0?'var(--color-primary)':'var(--color-border)'};border-radius:10px;padding:12px;cursor:pointer;">
                <input type="radio" name="payment" value="${opt.id}" ${i===0?'checked':''} style="accent-color:var(--color-primary);">
                <i class="${opt.icon}" style="color:var(--color-primary);width:20px;text-align:center;"></i>
                <div style="flex:1;">
                  <div style="font-weight:600;font-size:0.9rem;">${opt.label}</div>
                  <div style="font-size:0.75rem;color:var(--color-text-muted);">${opt.sub}</div>
                </div>
              </label>
            `).join('')}
          </div>

          <!-- Order summary -->
          <div style="background:var(--color-surface);border-radius:12px;padding:16px;margin-bottom:16px;">
            <h4 style="margin-bottom:12px;font-size:0.9rem;">Resumo do Pedido</h4>
            ${cart.map(item=>`
              <div style="display:flex;justify-content:space-between;font-size:0.85rem;margin-bottom:6px;">
                <span>${item.name} ${item.qty > 1 ? 'x'+item.qty : ''}</span>
                <span style="color:var(--color-primary);">R$ ${(item.price*(item.qty||1)).toFixed(2).replace('.',',')}</span>
              </div>
            `).join('')}
            <div style="border-top:1px solid var(--color-border);margin-top:8px;padding-top:8px;display:flex;justify-content:space-between;font-weight:700;">
              <span>Total</span>
              <span style="color:var(--color-primary);">R$ ${total.toFixed(2).replace('.',',')}</span>
            </div>
          </div>

          <div style="display:flex;gap:8px;">
            <button class="btn btn-secondary" id="back-to-address-btn" style="flex:1;">
              <i class="fas fa-arrow-left"></i> Voltar
            </button>
            <button class="btn btn-primary" id="confirm-order-btn" style="flex:2;">
              <i class="fas fa-lock"></i> Confirmar Pedido
            </button>
          </div>
        </div>

        <!-- Step 3: Confirmation (hidden initially) -->
        <div id="checkout-step-3" style="display:none;text-align:center;padding:32px 16px;">
          <div style="font-size:4rem;margin-bottom:16px;">🔥</div>
          <h2 style="color:var(--color-primary);margin-bottom:8px;">Pedido Confirmado!</h2>
          <p style="color:var(--color-text-muted);margin-bottom:24px;">
            Em breve você receberá um e-mail de confirmação.<br>Seu pedido está sendo preparado!
          </p>
          <div style="background:var(--color-surface);border-radius:12px;padding:16px;margin-bottom:24px;">
            <div style="font-size:0.85rem;color:var(--color-text-muted);">Código do pedido</div>
            <div id="order-code" style="font-size:1.2rem;font-weight:700;color:var(--color-primary);margin-top:4px;"></div>
          </div>
          <button class="btn btn-primary btn-full" id="back-to-home-btn">
            Continuar Comprando <i class="fas fa-arrow-right"></i>
          </button>
        </div>

      </div>
    </div>
  `;
}

function bindCheckoutEvents() {
  // Back to cart
  const backCart = document.getElementById('back-to-cart-btn');
  if (backCart) backCart.addEventListener('click', () => {
    if (typeof navigateTo === 'function') navigateTo('cart');
  });

  // Step 1 → 2
  const goPayment = document.getElementById('go-to-payment-btn');
  if (goPayment) goPayment.addEventListener('click', () => {
    goToCheckoutStep(2);
  });

  // Step 2 back → 1
  const backAddr = document.getElementById('back-to-address-btn');
  if (backAddr) backAddr.addEventListener('click', () => goToCheckoutStep(1));

  // Confirm order
  const confirmBtn = document.getElementById('confirm-order-btn');
  if (confirmBtn) confirmBtn.addEventListener('click', () => {
    const code = 'ORD-' + Date.now().toString().slice(-8);
    const el = document.getElementById('order-code');
    if (el) el.textContent = '#' + code;
    if (typeof AppState !== 'undefined') AppState.cart = [];
    if (typeof updateCartBadge === 'function') updateCartBadge();
    goToCheckoutStep(3);
  });

  // Back to home
  const homeBtn = document.getElementById('back-to-home-btn');
  if (homeBtn) homeBtn.addEventListener('click', () => {
    if (typeof navigateTo === 'function') navigateTo('home');
    const cartPanel = document.getElementById('cart-panel');
    if (cartPanel) cartPanel.style.display = 'none';
  });

  // Payment method visual feedback
  document.querySelectorAll('input[name="payment"]').forEach(radio => {
    radio.addEventListener('change', () => {
      document.querySelectorAll('label:has(input[name="payment"])').forEach(l =>
        l.style.borderColor = 'var(--color-border)');
      radio.closest('label').style.borderColor = 'var(--color-primary)';
    });
  });

  document.querySelectorAll('input[name="frete"]').forEach(radio => {
    radio.addEventListener('change', () => {
      document.querySelectorAll('label:has(input[name="frete"])').forEach(l =>
        l.style.borderColor = 'var(--color-border)');
      radio.closest('label').style.borderColor = 'var(--color-primary)';
    });
  });
}

function goToCheckoutStep(step) {
  [1,2,3].forEach(n => {
    const el = document.getElementById('checkout-step-' + n);
    const ind = document.getElementById('step-indicator-' + n);
    if (el) el.style.display = n === step ? 'block' : 'none';
    if (ind) ind.classList.toggle('active', n <= step);
  });
  const body = document.querySelector('.checkout-body');
  if (body) body.scrollTop = 0;
}
