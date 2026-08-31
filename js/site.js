const nav = document.querySelector(".nav");
const toggle = document.querySelector(".nav-toggle");
if (toggle && nav) {
  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    if (typeof trackAudit === "function") {
      trackAudit("menu_mobile", { action: open ? "abrir" : "fechar" });
    }
  });
  nav.querySelectorAll(".nav-links a").forEach((link) => {
    link.addEventListener("click", () => nav.classList.remove("open"));
  });
}

const year = document.querySelector("[data-year]");
if (year) year.textContent = new Date().getFullYear();

window.RODA_ANALYTICS = {
  goatcounter: "roda-do-novo",
  ga4: ""
};

window.dataLayer = window.dataLayer || [];
window.gtag = window.gtag || function gtag() { window.dataLayer.push(arguments); };

function trackAudit(name, params) {
  if (typeof window.gtag !== "function") return;
  if (!window.RODA_ANALYTICS.ga4) return;
  window.gtag("event", name, Object.assign({
    send_to: window.RODA_ANALYTICS.ga4,
    engagement_time_msec: 1
  }, params || {}));
}

(function startAnalytics(cfg) {
  if (cfg.goatcounter) {
    const s = document.createElement("script");
    s.async = true;
    s.src = "https://gc.zgo.at/count.js";
    s.dataset.goatcounter = "https://" + cfg.goatcounter + ".goatcounter.com/count";
    document.head.appendChild(s);
  }

  if (!cfg.ga4 || !/^G-[A-Z0-9]+$/.test(cfg.ga4)) return;

  const g = document.createElement("script");
  g.async = true;
  g.src = "https://www.googletagmanager.com/gtag/js?id=" + cfg.ga4;
  document.head.appendChild(g);

  window.gtag("js", new Date());
  window.gtag("config", cfg.ga4, {
    anonymize_ip: true,
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
    restricted_data_processing: true,
    send_page_view: true,
    page_title: document.title,
    page_location: location.href,
    content_group: "Roda do Novo — site institucional"
  });

  const AUDIT_SECTIONS = {
    inicio: "capa",
    projeto: "identidade",
    justificativa: "justificativa",
    objetivos: "objetivos",
    conceito: "conceito",
    formato: "metodologia",
    noite: "experiencia",
    etapas: "cronograma",
    territorio: "territorio",
    equipe: "equipe",
    orcamento: "orcamento",
    contrapartidas: "contrapartidas",
    impacto: "impacto",
    comunicacao: "comunicacao",
    parceiros: "patrocinio",
    materiais: "materiais",
    contato: "contato"
  };

  document.querySelectorAll("a[href]").forEach((link) => {
    link.addEventListener("click", () => {
      const href = link.getAttribute("href") || "";
      const text = (link.textContent || "").trim().slice(0, 80);
      if (href.indexOf("wa.me") !== -1 || href.indexOf("whatsapp") !== -1) {
        trackAudit("contato_whatsapp", { method: "whatsapp", link_url: href, link_text: text });
        trackAudit("conversao_captacao", { method: "whatsapp" });
        return;
      }
      if (href.indexOf("mailto:") === 0) {
        trackAudit("contato_email", { method: "email", link_url: href, link_text: text });
        trackAudit("conversao_captacao", { method: "email" });
        return;
      }
      if (href.indexOf("instagram.com") !== -1) {
        trackAudit("contato_instagram", { method: "instagram", link_url: href });
        return;
      }
      if (href.indexOf("github.com") !== -1) {
        trackAudit("repositorio_github", { method: "github", link_url: href });
        return;
      }
      if (/\.(pptx|xlsx|pdf|docx|zip)(\?|$)/i.test(href)) {
        trackAudit("file_download", {
          file_name: href.split("/").pop(),
          file_extension: (href.split(".").pop() || "").split("?")[0],
          link_url: href
        });
        return;
      }
      if (href.charAt(0) === "#") {
        const id = href.replace("#", "");
        trackAudit("nav_secao", {
          section_id: id,
          section_group: AUDIT_SECTIONS[id] || "outra"
        });
      }
    });
  });

  const sections = document.querySelectorAll("[id]");
  if ("IntersectionObserver" in window && sections.length) {
    const seen = {};
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = entry.target.id;
        if (!id || seen[id]) return;
        seen[id] = true;
        trackAudit("secao_vista", {
          section_id: id,
          section_group: AUDIT_SECTIONS[id] || "outra"
        });
        if (id === "orcamento") trackAudit("orcamento_visto", { value: 600000, currency: "BRL" });
        if (id === "materiais") trackAudit("materiais_vistos", { content_type: "dossie" });
        if (id === "contato") trackAudit("contato_visto", { content_type: "assinatura" });
      });
    }, { threshold: 0.45 });
    sections.forEach((el) => io.observe(el));
  }

  const scrollMarks = { 25: false, 50: false, 75: false, 90: false };
  window.addEventListener("scroll", function onScroll() {
    const doc = document.documentElement;
    const max = doc.scrollHeight - doc.clientHeight;
    if (max <= 0) return;
    const pct = Math.round((doc.scrollTop / max) * 100);
    Object.keys(scrollMarks).forEach((mark) => {
      const n = Number(mark);
      if (!scrollMarks[n] && pct >= n) {
        scrollMarks[n] = true;
        trackAudit("scroll_marco", { percent_scrolled: n });
        if (n === 90) trackAudit("leitura_profunda", { percent_scrolled: 90 });
      }
    });
  }, { passive: true });

  [30, 60, 180].forEach((sec) => {
    window.setTimeout(() => {
      trackAudit("tempo_permanencia", { duration_sec: sec });
    }, sec * 1000);
  });
})(window.RODA_ANALYTICS);
