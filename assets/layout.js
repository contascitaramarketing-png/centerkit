// Shared layout: top bar, header (with mega-menu), footer, WhatsApp float, cart drawer
// Each page calls CK.render({ active: 'home' }) after icons.js + data.js loaded.

(function () {
  const $ = (sel, root = document) => root.querySelector(sel);
  const I = (k) => window.CK_ICONS[k] || "";
  const D = window.CK_DATA;

  // Cart state in localStorage
  function getCart() { try { return JSON.parse(localStorage.getItem("ck_cart") || "[]"); } catch { return []; } }
  function setCart(c) { localStorage.setItem("ck_cart", JSON.stringify(c)); updateCartUI(); }
  function addToCart(p, qty = 1) {
    const c = getCart();
    const existing = c.find(i => i.sku === p.sku);
    if (existing) existing.qty += qty;
    else c.push({ sku: p.sku, title: p.title, cat: p.cat, qty });
    setCart(c);
    showToast(`${p.title} adicionado à lista de cotação`);
  }
  function removeFromCart(sku) { setCart(getCart().filter(i => i.sku !== sku)); }
  function updateCartQty(sku, qty) {
    const c = getCart();
    const it = c.find(i => i.sku === sku);
    if (it) { it.qty = Math.max(1, qty); setCart(c); }
  }
  function cartCount() { return getCart().reduce((s, i) => s + i.qty, 0); }

  function showToast(msg) {
    let t = $(".toast");
    if (!t) { t = document.createElement("div"); t.className = "toast"; document.body.appendChild(t); }
    t.innerHTML = `<span class="ok">${I("check")}</span><span>${msg}</span>`;
    t.classList.add("show");
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => t.classList.remove("show"), 2400);
  }

  function updateCartUI() {
    const n = cartCount();
    document.querySelectorAll(".cart-count").forEach(el => {
      el.textContent = n;
      el.style.display = n > 0 ? "inline-flex" : "none";
    });
    renderCartDrawer();
  }

  function renderCartDrawer() {
    const body = $("#cartDrawerBody");
    if (!body) return;
    const c = getCart();
    if (c.length === 0) {
      body.innerHTML = `<div class="cart-empty">${I("bagx")}<p>Sua lista de cotação está vazia.</p><p style="font-size:12.5px">Adicione produtos para solicitar um orçamento.</p></div>`;
      return;
    }
    body.innerHTML = c.map(it => `
      <div class="cart-item">
        <div class="ci-img">${(window.CK_PRODUCT_IMG ? window.CK_PRODUCT_IMG(it.sku, it.catId) : "")}</div>
        <div class="ci-info">
          <h6>${it.title}</h6>
          <span>${it.cat} · SKU ${it.sku}</span>
          <div class="ci-qty">
            <button class="qty-dec" data-sku="${it.sku}" style="width:22px;height:22px;border:1px solid var(--ck-line);background:#fff;border-radius:4px;cursor:pointer">−</button>
            <span style="font-weight:600;color:var(--ck-dark)">${it.qty}</span>
            <button class="qty-inc" data-sku="${it.sku}" style="width:22px;height:22px;border:1px solid var(--ck-line);background:#fff;border-radius:4px;cursor:pointer">+</button>
          </div>
        </div>
        <button class="ci-rm" data-sku="${it.sku}" title="Remover">${I("trash")}</button>
      </div>
    `).join("");
    body.querySelectorAll(".ci-rm").forEach(b => b.onclick = () => removeFromCart(b.dataset.sku));
    body.querySelectorAll(".qty-inc").forEach(b => b.onclick = () => {
      const it = getCart().find(i => i.sku === b.dataset.sku);
      updateCartQty(b.dataset.sku, (it?.qty || 1) + 1);
    });
    body.querySelectorAll(".qty-dec").forEach(b => b.onclick = () => {
      const it = getCart().find(i => i.sku === b.dataset.sku);
      updateCartQty(b.dataset.sku, (it?.qty || 1) - 1);
    });
  }

  function openCart() { $(".cart-drawer")?.classList.add("open"); $(".drawer-backdrop")?.classList.add("open"); }
  function closeCart() { $(".cart-drawer")?.classList.remove("open"); $(".drawer-backdrop")?.classList.remove("open"); }

  // Build the header HTML
  function headerHTML(active = "") {
    const productCols = chunk(D.productCategories, Math.ceil(D.productCategories.length / 3));
    const renderCatLink = (c) => `
      <a class="cat-link ${c.vet ? "vet" : ""}" href="categoria.html?id=${c.id}&nome=${encodeURIComponent(c.name)}">
        <span class="ic">${I(c.icon || "flask")}</span>
        <span>${c.name}</span>
      </a>`;

    return `
      <div class="topbar">
        <div class="container">
          <div class="tb-left">
            <span class="dot"></span>
            <span class="hide-sm">Mais de 30 anos em soluções laboratoriais</span>
          </div>
          <div class="tb-right">
            <a href="tel:${D.phoneRaw}">${I("phone")} ${D.phone}</a>
            <a href="https://wa.me/${D.whatsappRaw}" class="hide-sm" target="_blank">${I("whatsapp")} WhatsApp</a>
            <a href="admin.html" class="hide-sm">${I("user")} Área do Cliente</a>
          </div>
        </div>
      </div>

      <header class="header">
        <div class="container header-inner">
          <a href="index.html" class="brand" aria-label="CenterKit">
            <img src="https://www.centerkit.com.br/Centerkit%20Logo%20Completo_Prancheta%201.png" alt="CenterKit Logo">
          </a>

          <div class="search-wrap">
            <span class="ico">${I("search")}</span>
            <input type="text" placeholder="Buscar produtos, categorias, equipamentos…" id="globalSearch">
          </div>

          <div class="header-actions">
            <a href="tel:${D.phoneRaw}" class="header-cta">
              <span class="phone-circle">${I("phone")}</span>
              <span class="ph-num"><small>Fale Conosco</small><strong>${D.phone}</strong></span>
            </a>
            <button class="icon-btn" id="cartBtn" aria-label="Lista de cotação">
              ${I("bag")}
              <span class="badge-dot cart-count" style="display:none">0</span>
            </button>
            <button class="menu-toggle" id="menuToggle" aria-label="Menu">${I("menu")}</button>
          </div>
        </div>

        <div class="nav-row" id="navRow">
          <div class="container">
            <ul class="nav-list">
              <li><a href="index.html" class="${active === "home" ? "active" : ""}">Home</a></li>
              <li><a href="empresa.html" class="${active === "empresa" ? "active" : ""}">A Empresa</a></li>
              <li class="has-mega">
                <a href="produtos.html" class="${active === "produtos" ? "active" : ""}">Produtos <span class="chev">${I("chevDown")}</span></a>
                <div class="mega" style="min-width:780px">
                  <div class="mega-grid">
                    <h6>Catálogo de Produtos</h6>
                    ${productCols.map(col => `<div>${col.map(renderCatLink).join("")}</div>`).join("")}
                  </div>
                </div>
              </li>
              <li class="has-mega">
                <a href="equipamentos.html" class="${active === "equipamentos" ? "active" : ""}">Equipamentos <span class="chev">${I("chevDown")}</span></a>
                <div class="mega narrow" style="min-width:340px">
                  <div class="mega-grid" style="grid-template-columns:1fr">
                    <h6>Linha de Equipamentos</h6>
                    ${D.equipmentCategories.map(c => `
                      <a class="cat-link" href="categoria.html?id=${c.id}&nome=${encodeURIComponent(c.name)}">
                        <span class="ic">${I(c.icon)}</span><span>${c.short}</span>
                      </a>`).join("")}
                  </div>
                </div>
              </li>
              <li class="has-mega">
                <a href="#" class="${active === "servicos" ? "active" : ""}">Serviços <span class="chev">${I("chevDown")}</span></a>
                <div class="mega narrow" style="min-width:280px">
                  <div class="mega-grid" style="grid-template-columns:1fr">
                    <h6>Nossos Serviços</h6>
                    <a class="cat-link" href="assessoria-cientifica.html"><span class="ic">${I("microscope")}</span><span>Assessoria Científica</span></a>
                    <a class="cat-link" href="assessoria-tecnica.html"><span class="ic">${I("headset")}</span><span>Assessoria Técnica</span></a>
                  </div>
                </div>
              </li>
              <li><a href="fale-conosco.html" class="${active === "contato" ? "active" : ""}">Fale Conosco</a></li>
            </ul>
          </div>
        </div>
      </header>
    `;
  }

  function footerHTML() {
    return `
      <footer class="footer">
        <div class="container">
          <div class="footer-grid">
            <div class="footer-brand">
              <img src="https://www.centerkit.com.br/Centerkit%20Logo%20Completo_Prancheta%201.png" alt="CenterKit">
              <p>Excelência em soluções laboratoriais há mais de 30 anos. Distribuição nacional de produtos e equipamentos para análises clínicas com qualidade certificada.</p>
              <div class="social-row">
                <a href="#" aria-label="Instagram">${I("instagram")}</a>
                <a href="#" aria-label="Facebook">${I("facebook")}</a>
                <a href="#" aria-label="LinkedIn">${I("linkedin")}</a>
                <a href="https://wa.me/${D.whatsappRaw}" target="_blank" aria-label="WhatsApp">${I("whatsapp")}</a>
              </div>
            </div>
            <div>
              <h5>Institucional</h5>
              <ul class="footer-list">
                <li><a href="index.html">Home</a></li>
                <li><a href="empresa.html">A Empresa</a></li>
                <li><a href="assessoria-cientifica.html">Assessoria Científica</a></li>
                <li><a href="assessoria-tecnica.html">Assessoria Técnica</a></li>
                <li><a href="admin.html">Área do Cliente</a></li>
              </ul>
            </div>
            <div>
              <h5>Catálogo</h5>
              <ul class="footer-list">
                <li><a href="produtos.html">Todos os Produtos</a></li>
                <li><a href="equipamentos.html">Equipamentos</a></li>
                <li><a href="produtos.html#vet">Linha Veterinária</a></li>
                <li><a href="carrinho.html">Lista de Cotação</a></li>
                <li><a href="fale-conosco.html">Solicitar Orçamento</a></li>
              </ul>
            </div>
            <div class="footer-contact">
              <h5>Contato</h5>
              <div class="ct-row">
                <span class="ic">${I("pin")}</span>
                <div><strong>Endereço</strong><span>${D.address}</span></div>
              </div>
              <div class="ct-row">
                <span class="ic">${I("phone")}</span>
                <div><strong>Telefone</strong><span><a href="tel:${D.phoneRaw}" style="color:inherit">${D.phone}</a></span></div>
              </div>
              <div class="ct-row">
                <span class="ic">${I("whatsapp")}</span>
                <div><strong>WhatsApp</strong><span><a href="https://wa.me/${D.whatsappRaw}" style="color:inherit" target="_blank">${D.whatsapp}</a></span></div>
              </div>
              <div class="ct-row">
                <span class="ic">${I("email")}</span>
                <div><strong>E-mail</strong><span><a href="mailto:${D.email}" style="color:inherit">${D.email}</a></span></div>
              </div>
            </div>
          </div>
          <div class="footer-bottom">
            <small>© 2025 CenterKit Soluções. Todos os direitos reservados.</small>
            <small><a href="#">Política de Privacidade</a> · <a href="#">Termos de Uso</a></small>
          </div>
        </div>
      </footer>

      <a href="https://wa.me/${D.whatsappRaw}" class="wa-float" target="_blank" title="Fale conosco no WhatsApp">${I("whatsapp")}</a>

      <div class="drawer-backdrop"></div>
      <aside class="cart-drawer" id="cartDrawer">
        <div class="cart-head">
          <h3>${I("bag")} Lista de Cotação</h3>
          <button id="cartClose" aria-label="Fechar">${I("x")}</button>
        </div>
        <div class="cart-body" id="cartDrawerBody"></div>
        <div class="cart-foot">
          <a href="carrinho.html" class="btn btn-secondary btn-block mb-8" style="margin-bottom:8px">Ver lista completa</a>
          <a href="https://wa.me/${D.whatsappRaw}" target="_blank" class="btn btn-whats btn-block">${I("whatsapp")} Solicitar Orçamento</a>
        </div>
      </aside>
    `;
  }

  function chunk(arr, n) {
    const out = []; for (let i = 0; i < arr.length; i += n) out.push(arr.slice(i, i + n)); return out;
  }

  function bindUI() {
    $("#cartBtn")?.addEventListener("click", openCart);
    $("#cartClose")?.addEventListener("click", closeCart);
    $(".drawer-backdrop")?.addEventListener("click", closeCart);
    $("#menuToggle")?.addEventListener("click", () => $("#navRow")?.classList.toggle("open"));
    // Mobile mega-menu toggle
    document.querySelectorAll(".has-mega > a").forEach(a => {
      a.addEventListener("click", (e) => {
        if (window.innerWidth <= 980) {
          e.preventDefault();
          a.parentElement.classList.toggle("open");
        }
      });
    });
    // Search submit -> redirect to produtos.html
    $("#globalSearch")?.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const q = e.target.value.trim();
        if (q) location.href = `produtos.html?busca=${encodeURIComponent(q)}`;
      }
    });
  }

  window.CK = {
    render({ active = "" } = {}) {
      const headerSlot = document.getElementById("ck-header");
      const footerSlot = document.getElementById("ck-footer");
      if (headerSlot) headerSlot.innerHTML = headerHTML(active);
      if (footerSlot) footerSlot.innerHTML = footerHTML();
      bindUI();
      updateCartUI();
    },
    addToCart, removeFromCart, getCart, openCart, closeCart, showToast, updateCartUI,
    I, D
  };
})();
