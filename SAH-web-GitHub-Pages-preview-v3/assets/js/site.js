/* ============================================================
   SAH — Servicio Austral de Hemodinamia
   Lógica compartida del sitio (sin dependencias externas)
   ============================================================ */
(function () {
  "use strict";

  /* ---- 1. Inyectar header y footer compartidos ---- */
  function loadPartial(selector, url, done) {
    var el = document.querySelector(selector);
    if (!el) return;
    fetch(url)
      .then(function (r) { if (!r.ok) throw new Error(url); return r.text(); })
      .then(function (html) { el.innerHTML = html; if (done) done(); })
      .catch(function () {
        el.innerHTML = '<p style="padding:1rem;color:#a33;">No se pudo cargar la navegación. Si estás probando el sitio en tu computadora, abrilo con un servidor local (por ejemplo, la extensión "Live Server" de VS Code) en vez de hacer doble clic en el archivo.</p>';
      });
  }

  document.addEventListener("DOMContentLoaded", function () {
    /* Los partials de header/footer también están traducidos: las páginas
       en inglés (data-lang="en") cargan la versión de /en/partials/. */
    var lang = document.body.getAttribute("data-lang") || "es";
    var headerUrl = lang === "en" ? "/kit-web-scrolling/en/partials/header.html" : "/kit-web-scrolling/partials/header.html";
    var footerUrl = lang === "en" ? "/kit-web-scrolling/en/partials/footer.html" : "/kit-web-scrolling/partials/footer.html";
    loadPartial("#site-header", headerUrl, initHeader);
    loadPartial("#site-footer", footerUrl, initFooter);
    initReveal();
    initFaq();
    initForms();
  });

  /* ---- 2. Header: nav activo, menú móvil, sombra al scrollear ---- */
  function initHeader() {
    var body = document.body;
    var current = body.getAttribute("data-nav");
    if (current) {
      document.querySelectorAll('[data-nav="' + current + '"]').forEach(function (a) {
        a.setAttribute("aria-current", "page");
      });
    }

    var nav = document.getElementById("site-nav");
    var onScroll = function () {
      if (window.scrollY > 12) { nav.classList.add("scrolled"); }
      else { nav.classList.remove("scrolled"); }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    var toggle = document.getElementById("nav-toggle");
    var mobile = document.getElementById("nav-mobile");
    if (toggle && mobile) {
      toggle.addEventListener("click", function () {
        var open = mobile.classList.toggle("open");
        toggle.setAttribute("aria-expanded", open ? "true" : "false");
      });
      mobile.querySelectorAll("a").forEach(function (a) {
        a.addEventListener("click", function () {
          mobile.classList.remove("open");
          toggle.setAttribute("aria-expanded", "false");
        });
      });
    }

    /* Selector de idioma: cada página declara su par en data-alt-href */
    var altHref = body.getAttribute("data-alt-href");
    var lang = body.getAttribute("data-lang") || "es";
    var esLink = document.getElementById("lang-es");
    var enLink = document.getElementById("lang-en");
    if (esLink && enLink) {
      if (lang === "en") {
        enLink.setAttribute("aria-current", "true");
        esLink.removeAttribute("aria-current");
        esLink.href = altHref || "/kit-web-scrolling/index.html";
        enLink.href = "#";
      } else {
        esLink.setAttribute("aria-current", "true");
        enLink.removeAttribute("aria-current");
        enLink.href = altHref || "/kit-web-scrolling/en/index.html";
        esLink.href = "#";
      }
    }
  }

  function initFooter() {
    var y = document.getElementById("footer-year");
    if (y) y.textContent = new Date().getFullYear();
  }

  /* ---- 3. Animación de aparición al scrollear ---- */
  function initReveal() {
    var items = document.querySelectorAll(".reveal");
    if (!items.length) return;
    if (!("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("visible"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    items.forEach(function (el) { io.observe(el); });
  }

  /* ---- 4. Acordeón de preguntas frecuentes ---- */
  function initFaq() {
    document.querySelectorAll(".faq-q").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var item = btn.closest(".faq-item");
        var wasOpen = item.classList.contains("open");
        item.parentElement.querySelectorAll(".faq-item.open").forEach(function (i) { i.classList.remove("open"); });
        if (!wasOpen) item.classList.add("open");
        btn.setAttribute("aria-expanded", String(!wasOpen));
      });
    });
  }

  /* ---- 5. Formularios: validación básica, antispam, estados ---- */
  function initForms() {
    document.querySelectorAll("form[data-sah-form]").forEach(function (form) {
      form.addEventListener("submit", function (ev) {
        ev.preventDefault();
        var status = form.querySelector(".form-status");
        var honeypot = form.querySelector('input[name="empresa_web"]');

        /* Antispam: campo oculto — si un bot lo completa, se descarta silenciosamente */
        if (honeypot && honeypot.value) { return; }

        if (!form.checkValidity()) {
          form.reportValidity();
          return;
        }

        if (status) {
          status.className = "form-status loading";
          status.textContent = "Enviando...";
        }

        /* NOTA PARA SAH: este formulario todavía no está conectado a un envío real.
           [DATO PENDIENTE] falta definir el sistema de recepción seguro (backend/API
           de Hostinger o servicio de formularios) que reciba estos datos — ver
           INSTRUCCIONES-TECNICAS.md. Por ahora solo simula el envío para poder
           revisar el diseño y los estados de carga/éxito/error. */
        window.setTimeout(function () {
          if (status) {
            status.className = "form-status success";
            status.textContent = "Recibimos tu solicitud. En breve nos pondremos en contacto. Recordá que este formulario no confirma un turno: la gestión final se coordina con la clínica.";
          }
          form.reset();
        }, 700);
      });
    });

    /* Preseleccionar motivo de consulta si viene por URL (?motivo=derivacion) */
    var params = new URLSearchParams(window.location.search);
    var motivo = params.get("motivo");
    if (motivo) {
      var select = document.querySelector('select[name="motivo"]');
      if (select) {
        var opt = select.querySelector('option[value="' + motivo + '"]');
        if (opt) select.value = motivo;
      }
    }
  }
})();
