// ============================================
// ANTI-FRANGO - Admin Panel
// ============================================

function initAdminPanel() {
  const container = document.querySelector('#admin-panel .admin-content');
  if (!container) return;
  container.innerHTML = renderAdminPanel();
  bindAdminEvents();
}

function renderAdminPanel() {
  const products = typeof PRODUCTS !== 'undefined' ? PRODUCTS : [];
  const orders   = typeof ORDERS   !== 'undefined' ? ORDERS   : [];

  const totalRevenue = orders.reduce((s, o) => s + o.total, 0);
  const pendingOrders = orders.filter(o => o.status === 'processing').length;

  return `
    <div class="admin-panel-inner" style="height:100%;display:flex;flex-direction:column;background:var(--color-bg);overflow:hidden;">

      <!-- Header -->
      <div style="background:var(--color-surface);padding:16px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid var(--color-border);">
        <div style="display:flex;align-items:center;gap:10px;">
          <img src="icons/icon-96x96.png" style="width:32px;height:32px;border-radius:8px;">
          <div>
            <div style="font-weight:800;font-size:1rem;">Painel Admin</div>
            <div style="font-size:0.7rem;color:var(--color-primary);">Anti-Frango • Acesso total</div>
          </div>
        </div>
        <button id="admin-close-btn" style="background:none;border:none;color:var(--color-text);font-size:1.3rem;cursor:pointer;padding:4px 8px;">
          <i class="fas fa-times"></i>
        </button>
      </div>

      <!-- Tabs -->
      <div style="display:flex;background:var(--color-surface);border-bottom:1px solid var(--color-border);">
        ${[
          {id:'dashboard', icon:'fa-chart-bar', label:'Dashboard'},
          {id:'orders',    icon:'fa-receipt',   label:'Pedidos'},
          {id:'products',  icon:'fa-tshirt',    label:'Produtos'},
        ].map((tab,i)=>`
          <button class="admin-tab ${i===0?'active':''}" data-tab="${tab.id}"
            style="flex:1;padding:12px 4px;background:none;border:none;color:${i===0?'var(--color-primary)':'var(--color-text-muted)'};font-size:0.78rem;font-weight:600;cursor:pointer;border-bottom:2px solid ${i===0?'var(--color-primary)':'transparent'};transition:all 0.2s;font-family:inherit;">
            <i class="fas ${tab.icon}" style="display:block;margin-bottom:2px;font-size:1rem;"></i>
            ${tab.label}
          </button>
        `).join('')}
      </div>

      <!-- Content area -->
      <div id="admin-tab-content" style="flex:1;overflow-y:auto;padding:16px;">

        <!-- DASHBOARD -->
        <div id="admin-tab-dashboard">
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:20px;">
            ${[
              {label:'Receita Total', value:`R$ ${totalRevenue.toFixed(2).replace('.',',')}`, icon:'fa-dollar-sign', color:'#FF6A00'},
              {label:'Pedidos',       value:orders.length,    icon:'fa-receipt',   color:'#4CAF50'},
              {label:'Pendentes',     value:pendingOrders,    icon:'fa-clock',     color:'#FF9800'},
              {label:'Produtos',      value:products.length,  icon:'fa-tshirt',    color:'#2196F3'},
            ].map(stat=>`
              <div style="background:var(--color-surface);border-radius:12px;padding:14px;">
                <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;">
                  <div style="width:32px;height:32px;border-radius:8px;background:${stat.color}22;display:flex;align-items:center;justify-content:center;">
                    <i class="fas ${stat.icon}" style="color:${stat.color};font-size:0.9rem;"></i>
                  </div>
                  <span style="font-size:0.72rem;color:var(--color-text-muted);">${stat.label}</span>
                </div>
                <div style="font-size:1.3rem;font-weight:800;">${stat.value}</div>
              </div>
            `).join('')}
          </div>

          <h3 style="font-size:0.9rem;font-weight:700;margin-bottom:10px;">Últimos Pedidos</h3>
          ${orders.slice(0,3).map(o=>`
            <div style="background:var(--color-surface);border-radius:10px;padding:12px;margin-bottom:8px;display:flex;align-items:center;gap:10px;">
              <div style="width:40px;height:40px;border-radius:8px;overflow:hidden;flex-shrink:0;">
                <img src="${o.image}" style="width:100%;height:100%;object-fit:cover;" onerror="this.src='icons/icon-96x96.png'">
              </div>
              <div style="flex:1;min-width:0;">
                <div style="font-size:0.82rem;font-weight:600;">${o.id}</div>
                <div style="font-size:0.72rem;color:var(--color-text-muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${o.products[0]}</div>
              </div>
              <div style="text-align:right;flex-shrink:0;">
                <div style="font-size:0.82rem;font-weight:700;color:var(--color-primary);">R$ ${o.total.toFixed(2).replace('.',',')}</div>
                <div style="font-size:0.68rem;padding:2px 6px;border-radius:4px;margin-top:2px;background:${o.status==='delivered'?'#4CAF5022':o.status==='shipped'?'#2196F322':'#FF980022'};color:${o.status==='delivered'?'#4CAF50':o.status==='shipped'?'#2196F3':'#FF9800'};">${o.statusLabel}</div>
              </div>
            </div>
          `).join('')}
        </div>

        <!-- ORDERS -->
        <div id="admin-tab-orders" style="display:none;">
          <h3 style="font-size:0.9rem;font-weight:700;margin-bottom:12px;">Todos os Pedidos</h3>
          ${orders.map(o=>`
            <div style="background:var(--color-surface);border-radius:10px;padding:12px;margin-bottom:8px;">
              <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:6px;">
                <div>
                  <div style="font-weight:700;font-size:0.85rem;">${o.id}</div>
                  <div style="font-size:0.72rem;color:var(--color-text-muted);">${o.date}</div>
                </div>
                <div style="text-align:right;">
                  <div style="font-weight:700;color:var(--color-primary);">R$ ${o.total.toFixed(2).replace('.',',')}</div>
                  <select onchange="updateOrderStatus('${o.id}', this.value)"
                    style="font-size:0.7rem;background:var(--color-bg);color:var(--color-text);border:1px solid var(--color-border);border-radius:4px;padding:2px 4px;margin-top:4px;cursor:pointer;">
                    ${['processing','shipped','delivered'].map(s=>`
                      <option value="${s}" ${o.status===s?'selected':''}>${s==='processing'?'Processando':s==='shipped'?'Enviado':'Entregue'}</option>
                    `).join('')}
                  </select>
                </div>
              </div>
              <div style="font-size:0.78rem;color:var(--color-text-muted);">${o.products.join(', ')}</div>
              ${o.trackingCode ? `<div style="font-size:0.72rem;color:var(--color-primary);margin-top:4px;"><i class="fas fa-truck"></i> ${o.trackingCode}</div>` : ''}
            </div>
          `).join('')}
        </div>

        <!-- PRODUCTS -->
        <div id="admin-tab-products" style="display:none;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
            <h3 style="font-size:0.9rem;font-weight:700;">Produtos (${products.length})</h3>
            <button onclick="showToastAdmin('Em breve: cadastrar produto! 🔥')"
              style="background:var(--color-primary);color:white;border:none;border-radius:8px;padding:6px 12px;font-size:0.78rem;font-weight:600;cursor:pointer;">
              <i class="fas fa-plus"></i> Novo
            </button>
          </div>
          ${products.slice(0,15).map(p=>`
            <div style="background:var(--color-surface);border-radius:10px;padding:10px;margin-bottom:8px;display:flex;align-items:center;gap:10px;">
              <img src="${p.images?.[0]||'icons/icon-96x96.png'}" style="width:44px;height:44px;border-radius:8px;object-fit:cover;flex-shrink:0;" onerror="this.src='icons/icon-96x96.png'">
              <div style="flex:1;min-width:0;">
                <div style="font-size:0.82rem;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${p.name}</div>
                <div style="font-size:0.72rem;color:var(--color-text-muted);">${p.category} · ${p.gender || 'Unissex'}</div>
              </div>
              <div style="text-align:right;flex-shrink:0;">
                <div style="font-weight:700;color:var(--color-primary);font-size:0.85rem;">R$ ${p.price?.toFixed(2).replace('.',',') || '0,00'}</div>
                <div style="font-size:0.68rem;color:${p.badge?'#4CAF50':'var(--color-text-muted)'};">${p.badge || 'Ativo'}</div>
              </div>
            </div>
          `).join('')}
        </div>

      </div>
    </div>
  `;
}

function bindAdminEvents() {
  // Close button
  document.getElementById('admin-close-btn')?.addEventListener('click', () => {
    document.getElementById('admin-panel').style.display = 'none';
  });

  // Tab navigation
  document.querySelectorAll('.admin-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.admin-tab').forEach(t => {
        t.classList.remove('active');
        t.style.color = 'var(--color-text-muted)';
        t.style.borderBottom = '2px solid transparent';
      });
      tab.classList.add('active');
      tab.style.color = 'var(--color-primary)';
      tab.style.borderBottom = '2px solid var(--color-primary)';

      ['dashboard','orders','products'].forEach(id => {
        const el = document.getElementById('admin-tab-' + id);
        if (el) el.style.display = id === tab.dataset.tab ? 'block' : 'none';
      });
    });
  });
}

function updateOrderStatus(orderId, newStatus) {
  const order = (typeof ORDERS !== 'undefined') ? ORDERS.find(o => o.id === orderId) : null;
  if (order) {
    order.status = newStatus;
    order.statusLabel = newStatus === 'processing' ? 'Processando' : newStatus === 'shipped' ? 'Enviado' : 'Entregue';
  }
  showToastAdmin('Status atualizado! ✅');
}

function showToastAdmin(msg) {
  if (typeof showToast === 'function') { showToast(msg); return; }
  const t = document.createElement('div');
  t.textContent = msg;
  Object.assign(t.style, {
    position:'fixed',bottom:'80px',left:'50%',transform:'translateX(-50%)',
    background:'#FF6A00',color:'white',padding:'10px 20px',borderRadius:'20px',
    zIndex:'9999',fontWeight:'600',fontSize:'0.85rem',whiteSpace:'nowrap'
  });
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 2500);
}
