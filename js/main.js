/* ==========================================================================
   Refoxo Xestión — sitio de demostración (negocio ficticio)
   Concepto «Cinta sumadora». GSAP, ScrollTrigger y Lenis por CDN; sin ellos la
   página se lee entera y el contenido (calendario, contadores) sigue siendo
   correcto, solo que sin animar.
   ========================================================================== */

(function () {
  "use strict";

  var raiz = document.documentElement;
  var mqReducido = window.matchMedia("(prefers-reduced-motion: reduce)");
  var reducido = mqReducido.matches;
  var gsapListo = !!(window.gsap && window.ScrollTrigger);
  var movimiento = gsapListo && !reducido;

  if (gsapListo) { window.gsap.registerPlugin(window.ScrollTrigger); }
  if (movimiento) { raiz.classList.add("has-motion"); }

  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ======================================================================
     1. CONTENIDO — funciona igual con o sin GSAP
     ====================================================================== */

  (function menu() {
    var boton = $("#hamburguesa"), nav = $("#nav");
    if (!boton || !nav) { return; }
    function cerrar() {
      boton.setAttribute("aria-expanded", "false");
      boton.setAttribute("aria-label", "Abrir el menú");
      nav.classList.remove("esta-abierto");
    }
    boton.addEventListener("click", function () {
      var abierto = boton.getAttribute("aria-expanded") === "true";
      boton.setAttribute("aria-expanded", abierto ? "false" : "true");
      boton.setAttribute("aria-label", abierto ? "Abrir el menú" : "Cerrar el menú");
      nav.classList.toggle("esta-abierto", !abierto);
    });
    $$("a", nav).forEach(function (a) { a.addEventListener("click", cerrar); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("esta-abierto")) { cerrar(); boton.focus(); }
    });
  })();

  (function cookies() {
    var banner = $("#cookieBanner"), ok = $("#cookieOk");
    if (!banner || !ok) { return; }
    var CLAVE = "refoxo-cookies";
    var aceptado = false;
    try { aceptado = localStorage.getItem(CLAVE) === "1"; } catch (e) {}
    if (!aceptado) { banner.hidden = false; }
    ok.addEventListener("click", function () {
      banner.hidden = true;
      try { localStorage.setItem(CLAVE, "1"); } catch (e) {}
    });
  })();

  (function mapa() {
    var boton = $("#mapaBoton"), caja = $("#mapa");
    if (!boton || !caja) { return; }
    boton.addEventListener("click", function () {
      var marco = document.createElement("iframe");
      marco.src = "https://www.google.com/maps?q=Noia+A+Coru%C3%B1a&output=embed";
      marco.title = "Mapa de Noia, A Coruña (la dirección del despacho es ficticia)";
      marco.loading = "lazy";
      marco.referrerPolicy = "no-referrer-when-downgrade";
      marco.setAttribute("width", "600");
      marco.setAttribute("height", "300");
      caja.insertBefore(marco, boton.nextSibling);
      boton.remove();
    });
  })();

  (function formulario() {
    var form = $("#formulario"), salida = $("#formularioRespuesta");
    if (!form || !salida) { return; }
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var nombre = $("#fNombre").value.trim();
      var tel = $("#fTelefono").value.trim();
      if (!nombre || !tel || !$("#fOk").checked) {
        salida.textContent = "Faltan el nombre, el teléfono o el aviso de privacidad.";
        return;
      }
      salida.textContent = "Demostración: no se envía nada. Te llamaríamos, " + nombre + ".";
      form.reset();
    });
  })();

  /* ---------- calendario fiscal: se calcula con la fecha real del sistema ---------- */
  (function calendarioFiscal() {
    var filas = $$(".calendario-fila:not(.calendario-fila--cab)");
    if (!filas.length) { return; }
    var hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    var datos = filas.map(function (fila) {
      var mes = parseInt(fila.dataset.mes, 10);
      var dia = parseInt(fila.dataset.dia, 10);
      var anio = hoy.getFullYear();
      var fecha = new Date(anio, mes - 1, dia);
      if (fecha < hoy) { fecha = new Date(anio + 1, mes - 1, dia); }
      var dias = Math.round((fecha - hoy) / 86400000);
      return { fila: fila, fecha: fecha, dias: dias };
    });

    var proxima = datos.reduce(function (a, b) { return b.dias < a.dias ? b : a; });

    datos.forEach(function (d) {
      var salida = $('[data-cal="dias"]', d.fila);
      if (!salida) { return; }
      salida.setAttribute("data-etq", "Días:");
      if (d === proxima) {
        d.fila.classList.add("es-proxima");
        d.fila.setAttribute("aria-current", "true");
      }
      /* el valor final vive siempre en el DOM: si no hay movimiento, se pinta
         directamente; si lo hay, lo "imprime" la función de abajo. */
      salida.dataset.diasFinal = String(d.dias);
      salida.textContent = d.dias + (d.dias === 1 ? " día" : " días");
    });

    /* etiquetas de fila para el volcado en columna del móvil */
    filas.forEach(function (fila) {
      $$("[data-cal]", fila).forEach(function (celda) {
        var mapa = { mes: "Mes:", tramite: "Trámite:", modelos: "Modelos:", plazo: "Plazo:" };
        var clave = celda.dataset.cal;
        if (mapa[clave] && !celda.hasAttribute("data-etq")) { celda.setAttribute("data-etq", mapa[clave]); }
      });
    });

    window.__proximaFila = proxima.fila;
  })();

  /* ---------- valoración y cinta de servicios: contenido garantizado ---------- */
  (function contenidoEstable() {
    /* si no hay movimiento, se fija el valor final de una vez (sin animación) */
    if (movimiento) { return; }
    $$(".contador-cifra[data-hasta]").forEach(function (el) {
      var dec = parseInt(el.dataset.decimales || "0", 10);
      var val = parseFloat(el.dataset.hasta);
      el.textContent = val.toFixed(dec).replace(".", ",");
    });
    $$(".cinta-linea").forEach(function (li) { li.classList.add("esta-sumada"); });
    var contador = $("#cintaContador");
    if (contador) { contador.textContent = "06"; }
  })();

  /* --- Contenedores con scroll accesibles por teclado (por si alguno desborda) ---- */
  (function scrollAccesible() {
    var cajas = $$("[data-scroll-teclado]");
    if (!cajas.length) { return; }
    function revisar() {
      cajas.forEach(function (c) {
        var desborda = (c.scrollWidth > c.clientWidth + 4) || (c.scrollHeight > c.clientHeight + 4);
        if (desborda) { c.setAttribute("tabindex", "0"); }
        else { c.removeAttribute("tabindex"); }
      });
    }
    revisar();
    window.addEventListener("resize", revisar);
    window.addEventListener("load", revisar);
  })();

  /* ---------- el rollo de la izquierda: progreso + nombre de sección ----------
     Es contenido (indica en qué sección estás), no solo movimiento: se monta
     con IntersectionObserver y funciona igual con reduced-motion o sin GSAP
     (la CSS ya apaga la transición de altura bajo reduced-motion). ---------- */
  (function rollo() {
    var relleno = $("#rolloRelleno");
    var etiqueta = $("#rolloEtiqueta");
    if (!relleno || !etiqueta) { return; }
    var secciones = [
      { id: "portada", nombre: "Portada" },
      { id: "areas", nombre: "Áreas" },
      { id: "servicios", nombre: "Servicios" },
      { id: "confianza", nombre: "Confianza" },
      { id: "equipo", nombre: "Equipo" },
      { id: "calendario", nombre: "Calendario" },
      { id: "resenas", nombre: "Reseñas" },
      { id: "contacto", nombre: "Contacto" }
    ].map(function (s) { return { el: document.getElementById(s.id), nombre: s.nombre }; })
     .filter(function (s) { return s.el; });

    if (!("IntersectionObserver" in window) || !secciones.length) { return; }
    var io = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (entrada) {
        if (!entrada.isIntersecting) { return; }
        var i = secciones.findIndex(function (s) { return s.el === entrada.target; });
        if (i < 0) { return; }
        relleno.style.height = (secciones.length === 1 ? 100 : (i / (secciones.length - 1)) * 100) + "%";
        etiqueta.textContent = secciones[i].nombre;
      });
    }, { rootMargin: "-45% 0px -45% 0px", threshold: 0 });
    secciones.forEach(function (s) { io.observe(s.el); });
  })();

  /* ======================================================================
     2. MOVIMIENTO
     ====================================================================== */
  if (!movimiento) {
    var cortinaSinMotion = $("#cortina");
    if (cortinaSinMotion) { cortinaSinMotion.style.display = "none"; }
    return;
  }

  var gsap = window.gsap;
  var ScrollTrigger = window.ScrollTrigger;

  var lenis = null;
  if (window.Lenis) {
    lenis = new window.Lenis({ lerp: 0.14, smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
    gsap.ticker.lagSmoothing(0);
    $$('a[href^="#"]').forEach(function (a) {
      a.addEventListener("click", function (e) {
        var destino = document.querySelector(a.getAttribute("href"));
        if (!destino) { return; }
        e.preventDefault();
        lenis.scrollTo(destino, { offset: -70 });
      });
    });
  }

  function alEntrar(el, hacer) {
    if (!("IntersectionObserver" in window)) { hacer(); return; }
    var io = new IntersectionObserver(function (ent) {
      ent.forEach(function (e) { if (e.isIntersecting) { io.disconnect(); hacer(); } });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.04 });
    io.observe(el);
  }

  /* ---------- cortina: el rollo se desenrolla de golpe y se retira ---------- */
  function cortina() {
    var caja = $("#cortina");
    if (!caja) { return; }
    var cifra = $("#cortinaCifra");
    var papel = $(".cortina-papel", caja);
    document.body.style.overflow = "hidden";

    function quitar() {
      caja.style.display = "none";
      document.body.style.overflow = "";
    }
    var seguridad = setTimeout(quitar, 4500);

    var tl = gsap.timeline({
      onComplete: function () { clearTimeout(seguridad); quitar(); }
    });

    /* la cinta "imprime" cifras al azar, como si la sumadora tecleara sola */
    var vueltas = { n: 0 };
    tl.to(vueltas, {
      n: 14, duration: 1, ease: "power1.in", roundProps: "n",
      onUpdate: function () {
        if (!cifra) { return; }
        var azar = (Math.random() * 9000 + 100).toFixed(2).replace(".", ",");
        cifra.textContent = azar;
      }
    });
    tl.call(function () { if (cifra) { cifra.textContent = "1.247,50"; } });
    tl.fromTo(papel, { scale: 1 }, { scale: 1.06, duration: .12, ease: "power1.out" });
    tl.to(papel, { scale: 1, duration: .28, ease: "back.out(3)" });
    tl.to(caja, {
      yPercent: -100, duration: .9, ease: "expo.inOut", delay: .15,
      onStart: function () { caja.style.pointerEvents = "none"; }
    });
  }
  cortina();

  /* ---------- titulares: char-reveal con el golpe de la sumadora ---------- */
  function titulares() {
    $$("[data-revelar]").forEach(function (el) {
      var texto = (el.textContent || "").replace(/\s+/g, " ").trim();
      el.setAttribute("aria-label", texto);
      el.textContent = "";
      var frag = document.createDocumentFragment();
      var partes = [];
      texto.split(" ").forEach(function (palabra) {
        var caja = document.createElement("span");
        caja.className = "palabra";
        caja.setAttribute("aria-hidden", "true");
        var dentro = document.createElement("i");
        dentro.textContent = palabra;
        caja.appendChild(dentro);
        frag.appendChild(caja);
        frag.appendChild(document.createTextNode(" "));
        partes.push(dentro);
      });
      el.appendChild(frag);
      /* y:0 explícito: GSAP lee el translate3d del CSS como `y`, no como yPercent */
      gsap.set(partes, { y: 0, yPercent: 120 });
      alEntrar(el, function () {
        gsap.to(partes, { yPercent: 0, duration: .62, ease: "back.out(1.9)", stagger: .05 });
      });
    });
  }

  /* ---------- franja: velocidad ligada a la velocidad del scroll ---------- */
  function franja() {
    var pista = $("#franjaPista");
    if (!pista) { return; }
    var bucle = gsap.to(pista, { xPercent: -50, duration: 22, ease: "none", repeat: -1 });
    var vuelta;
    ScrollTrigger.create({
      onUpdate: function (self) {
        bucle.timeScale(1 + Math.min(Math.abs(self.getVelocity()) / 700, 5));
        clearTimeout(vuelta);
        vuelta = setTimeout(function () { gsap.to(bucle, { timeScale: 1, duration: .8 }); }, 140);
      }
    });
  }

  /* ---------- servicios: la cinta se suma línea a línea ---------- */
  function cintaServicios() {
    var lineas = $$(".cinta-linea");
    var contador = $("#cintaContador");
    if (!lineas.length) { return; }
    gsap.set(lineas, { opacity: 0, y: 24 });
    lineas.forEach(function (li, i) {
      alEntrar(li, function () {
        gsap.to(li, {
          opacity: 1, y: 0, duration: .55, ease: "power2.out",
          onStart: function () {
            li.classList.add("esta-sumada");
            if (contador) { contador.textContent = String(i + 1).padStart(2, "0"); }
          }
        });
      });
    });
  }

  /* ---------- contadores: se imprimen cifra a cifra, como la sumadora ---------- */
  function contadoresImpresos() {
    $$(".contador-cifra[data-hasta]").forEach(function (el) {
      var dec = parseInt(el.dataset.decimales || "0", 10);
      var hasta = parseFloat(el.dataset.hasta);
      var estado = { v: 0 };
      el.textContent = (0).toFixed(dec).replace(".", ",");
      alEntrar(el, function () {
        gsap.to(estado, {
          v: hasta, duration: 1.1, ease: "steps(18)",
          onUpdate: function () { el.textContent = estado.v.toFixed(dec).replace(".", ","); },
          onComplete: function () { el.textContent = hasta.toFixed(dec).replace(".", ","); }
        });
      });
    });

    /* los días del trámite próximo también se imprimen dígito a dígito */
    var proxima = window.__proximaFila;
    if (proxima) {
      var celda = $('[data-cal="dias"]', proxima);
      if (celda) {
        var total = parseInt(celda.dataset.diasFinal, 10);
        var sufijo = total === 1 ? " día" : " días";
        var estado = { v: 0 };
        alEntrar(celda, function () {
          celda.textContent = "0" + sufijo;
          gsap.to(estado, {
            v: total, duration: .9, ease: "steps(" + Math.max(total, 6) + ")",
            onUpdate: function () { celda.textContent = Math.round(estado.v) + sufijo; },
            onComplete: function () { celda.textContent = total + sufijo; }
          });
        });
      }
    }
  }

  /* ---------- botones magnéticos: CTA y WhatsApp ---------- */
  function imanes() {
    if (!window.matchMedia("(hover:hover)").matches) { return; }
    $$("[data-iman]").forEach(function (el) {
      var aX = gsap.quickTo(el, "x", { duration: .4, ease: "power3.out" });
      var aY = gsap.quickTo(el, "y", { duration: .4, ease: "power3.out" });
      el.addEventListener("mousemove", function (e) {
        var c = el.getBoundingClientRect();
        aX((e.clientX - (c.left + c.width / 2)) * .32);
        aY((e.clientY - (c.top + c.height / 2)) * .38);
      });
      el.addEventListener("mouseleave", function () { aX(0); aY(0); });
    });
  }

  function arrancar() {
    titulares();
    franja();
    cintaServicios();
    contadoresImpresos();
    imanes();
    ScrollTrigger.refresh();
  }

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(arrancar);
  } else {
    window.addEventListener("load", arrancar);
  }

  if (mqReducido.addEventListener) {
    mqReducido.addEventListener("change", function () { window.location.reload(); });
  }
})();
