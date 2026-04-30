// Tweaks panel for CenterKit prototype — persists across pages via localStorage
(function () {
  const KEY = "ck_tweaks";
  const DEFAULTS = {
    accent: "green",        // green | teal | navy | rose
    headerStyle: "default", // default | minimal | bold
    cardStyle: "soft",      // soft | flat | elevated
    radius: "md",           // sm | md | lg
    showBadges: true,
    showTopbar: true,
    density: "comfy",       // comfy | compact
    heroVariant: "carousel" // carousel | gradient | split
  };
  const ACCENTS = {
    green: { deep: "#0E5E3F", main: "#1F8B5F", soft: "#E8F5EE", mist: "#F4FAF6" },
    teal:  { deep: "#0B5A66", main: "#0E8B97", soft: "#E2F4F6", mist: "#F1FAFB" },
    navy:  { deep: "#0F2A5C", main: "#2456B5", soft: "#E5EDFB", mist: "#F2F6FD" },
    rose:  { deep: "#7C1D4E", main: "#C13B7E", soft: "#FBE5EE", mist: "#FDF1F6" },
  };
  const RADII = {
    sm: { sm: "4px", md: "6px", lg: "10px" },
    md: { sm: "8px", md: "14px", lg: "20px" },
    lg: { sm: "12px", md: "20px", lg: "32px" },
  };

  function load() { try { return { ...DEFAULTS, ...JSON.parse(localStorage.getItem(KEY) || "{}") }; } catch { return { ...DEFAULTS }; } }
  function save(t) { localStorage.setItem(KEY, JSON.stringify(t)); }

  function apply(t) {
    const r = document.documentElement;
    const a = ACCENTS[t.accent] || ACCENTS.green;
    r.style.setProperty("--ck-green-deep", a.deep);
    r.style.setProperty("--ck-green", a.main);
    r.style.setProperty("--ck-green-soft", a.soft);
    r.style.setProperty("--ck-green-mist", a.mist);
    const rad = RADII[t.radius] || RADII.md;
    r.style.setProperty("--radius-sm", rad.sm);
    r.style.setProperty("--radius-md", rad.md);
    r.style.setProperty("--radius-lg", rad.lg);
    document.body.dataset.cardStyle = t.cardStyle;
    document.body.dataset.density = t.density;
    document.body.dataset.headerStyle = t.headerStyle;
    document.body.classList.toggle("hide-badges", !t.showBadges);
    document.body.classList.toggle("hide-topbar", !t.showTopbar);
    // hero variant — only matters on index.html
    document.querySelectorAll("[data-hero-variant]").forEach(el => el.dataset.heroVariant = t.heroVariant);
  }

  let state = load();
  apply(state);

  function buildPanel() {
    const wrap = document.createElement("div");
    wrap.className = "ck-tweaks";
    wrap.innerHTML = `
      <button class="ck-tweaks-toggle" id="ckTweakBtn" aria-label="Abrir Tweaks">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h0a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v0a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
      </button>
      <div class="ck-tweaks-panel" id="ckTweakPanel">
        <header>
          <div>
            <strong>Tweaks</strong>
            <span>Personalize a aparência do site</span>
          </div>
          <button id="ckTweakClose" aria-label="Fechar">×</button>
        </header>
        <div class="ck-tweaks-body">

          <div class="tw-group">
            <label>Cor de destaque</label>
            <div class="tw-swatches" data-key="accent">
              <button data-v="green" style="--c:#1F8B5F"></button>
              <button data-v="teal" style="--c:#0E8B97"></button>
              <button data-v="navy" style="--c:#2456B5"></button>
              <button data-v="rose" style="--c:#C13B7E"></button>
            </div>
          </div>

          <div class="tw-group">
            <label>Variante do hero</label>
            <div class="tw-seg" data-key="heroVariant">
              <button data-v="carousel">Carrossel</button>
              <button data-v="gradient">Gradiente</button>
              <button data-v="split">Split</button>
            </div>
          </div>

          <div class="tw-group">
            <label>Estilo dos cards</label>
            <div class="tw-seg" data-key="cardStyle">
              <button data-v="soft">Suave</button>
              <button data-v="flat">Plano</button>
              <button data-v="elevated">Elevado</button>
            </div>
          </div>

          <div class="tw-group">
            <label>Raio dos cantos</label>
            <div class="tw-seg" data-key="radius">
              <button data-v="sm">Suave</button>
              <button data-v="md">Médio</button>
              <button data-v="lg">Grande</button>
            </div>
          </div>

          <div class="tw-group">
            <label>Densidade</label>
            <div class="tw-seg" data-key="density">
              <button data-v="comfy">Confortável</button>
              <button data-v="compact">Compacto</button>
            </div>
          </div>

          <div class="tw-group">
            <label>Estilo do header</label>
            <div class="tw-seg" data-key="headerStyle">
              <button data-v="default">Padrão</button>
              <button data-v="minimal">Minimal</button>
              <button data-v="bold">Bold</button>
            </div>
          </div>

          <div class="tw-group">
            <label class="tw-toggle">
              <input type="checkbox" data-key="showTopbar" ${state.showTopbar?"checked":""}>
              <span>Mostrar barra superior</span>
            </label>
            <label class="tw-toggle">
              <input type="checkbox" data-key="showBadges" ${state.showBadges?"checked":""}>
              <span>Mostrar selos nos produtos</span>
            </label>
          </div>

          <button class="tw-reset" id="ckTweakReset">Restaurar padrão</button>
        </div>
      </div>`;
    document.body.appendChild(wrap);

    function paint() {
      wrap.querySelectorAll(".tw-swatches").forEach(g => {
        const k = g.dataset.key;
        g.querySelectorAll("button").forEach(b => b.classList.toggle("active", b.dataset.v === state[k]));
      });
      wrap.querySelectorAll(".tw-seg").forEach(g => {
        const k = g.dataset.key;
        g.querySelectorAll("button").forEach(b => b.classList.toggle("active", b.dataset.v === state[k]));
      });
    }

    wrap.querySelectorAll(".tw-swatches button, .tw-seg button").forEach(b => {
      b.onclick = () => {
        const key = b.parentElement.dataset.key;
        state[key] = b.dataset.v;
        save(state); apply(state); paint();
      };
    });
    wrap.querySelectorAll('input[type="checkbox"]').forEach(c => {
      c.onchange = () => { state[c.dataset.key] = c.checked; save(state); apply(state); };
    });

    document.getElementById("ckTweakBtn").onclick = () => wrap.classList.toggle("open");
    document.getElementById("ckTweakClose").onclick = () => wrap.classList.remove("open");
    document.getElementById("ckTweakReset").onclick = () => {
      state = { ...DEFAULTS };
      save(state); apply(state); paint();
      wrap.querySelectorAll('input[type="checkbox"]').forEach(c => c.checked = state[c.dataset.key]);
    };

    paint();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", buildPanel);
  else buildPanel();
})();
