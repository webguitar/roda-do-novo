const nav = document.querySelector(".nav");
const toggle = document.querySelector(".nav-toggle");
if (toggle && nav) {
  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
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

(function startAnalytics(cfg) {
  if (cfg.goatcounter) {
    const s = document.createElement("script");
    s.async = true;
    s.src = "https://gc.zgo.at/count.js";
    s.dataset.goatcounter = "https://" + cfg.goatcounter + ".goatcounter.com/count";
    document.head.appendChild(s);
  }
  if (cfg.ga4 && /^G-[A-Z0-9]+$/.test(cfg.ga4)) {
    const g = document.createElement("script");
    g.async = true;
    g.src = "https://www.googletagmanager.com/gtag/js?id=" + cfg.ga4;
    document.head.appendChild(g);
    window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }
    gtag("js", new Date());
    gtag("config", cfg.ga4, { anonymize_ip: true });
  }
})(window.RODA_ANALYTICS);
