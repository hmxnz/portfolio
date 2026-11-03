/* =========================================================
   LÓGICA DEL PORTFOLIO — hmxnz_
   Los textos viven en data.js
   ========================================================= */

const $ = (id) => document.getElementById(id);

// evita que se cuele html en lo que escribe la gente
const limpiar = (t) => t.replace(/</g, "&lt;");

// idioma: el guardado, o el del navegador
let LANG = "es";
try { LANG = localStorage.getItem("lang") || (navigator.language.startsWith("es") ? "es" : "en"); } catch (e) {}

const t = (x) => (x && x.es !== undefined ? x[LANG] : x);
const T = (k) => UI[LANG][k];
const nombreGrupo = (g) => UI[LANG].grupos[g] || g;

const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
const punteroFino = matchMedia("(pointer: fine)").matches;


/* ---------- 1. PINTAR CONTENIDO ---------- */

// inicio
function pintarInicio() {
  $("hero-prompt").textContent = `${PERFIL.alias}@kali: ~ — ${T("sesion")}`;

  // titular: cada línea es un bloque glitch independiente
  const lineas = t(PERFIL.titular);
  const ultima = lineas.length - 1;
  $("hero-titular").innerHTML = lineas
    .map((l, i) => {
      const grad = i === ultima ? " grad" : "";
      const cur = i === ultima ? '<span class="cursor"></span>' : "";
      return `<span class="g-line${grad}" data-text="${l.replace(/"/g, "&quot;")}">${l}${cur}</span>`;
    })
    .join("");

  $("hero-resumen").textContent = t(PERFIL.resumen);
  $("hero-estado").innerHTML = t(PERFIL.estado).map((e) => `<span>${e}</span>`).join("");

  $("hero-botones").innerHTML = `
    <a class="btn magnetic" href="${PERFIL.cv}" download>${T("cv")}</a>
    <a class="btn suave magnetic" href="#proyectos">${T("ver_proyectos")}</a>
    <a class="btn suave magnetic" href="${PERFIL.github}" target="_blank" rel="noopener">GitHub</a>`;

  // footer con textura grande
  $("pie").innerHTML = `
    <div class="pie-grande" aria-hidden="true">hmxnz_</div>
    <div class="pie-fila">
      <span>© 2026 ${PERFIL.nombre}</span>
      <span class="pie-hint">psst… <b>ls -a</b> ↵</span>
      <span>
        <a href="${PERFIL.github}" target="_blank" rel="noopener">GitHub</a>
        <a href="${PERFIL.linkedin}" target="_blank" rel="noopener">LinkedIn</a>
        <a href="mailto:${PERFIL.email}">Email</a>
      </span>
    </div>`;

  activarMagnetic();
}

// proyectos: tarjetas con número, spotlight y tilt
function pintarProyectos() {
  $("lista-proyectos").innerHTML = PROYECTOS.map((p, i) => `
    <article class="proyecto reveal reveal-d${(i % 3) + 1}">
      <div class="proyecto-top">
        <h3>${t(p.nombre)}</h3>
        <span class="idx">/${String(i + 1).padStart(2, "0")}</span>
      </div>
      <div class="mono sub">${t(p.sub)}</div>
      <ul>${t(p.puntos).map((x) => `<li>${x}</li>`).join("")}</ul>
      <div class="pie-card">
        ${p.stack.map((s) => `<span class="tag">${s}</span>`).join("")}
        ${p.enlace ? `<a class="btn suave" href="${p.enlace}" target="_blank" rel="noopener">${T("ver_codigo")}</a>` : ""}
      </div>
    </article>`).join("");

  activarTilt();
  observarReveals();
}

// tabla de writeups
function pintarWriteups() {
  $("tabla-writeups").innerHTML = WRITEUPS.map((w, i) => `
    <tr class="fila reveal" tabindex="0" data-n="${i}">
      <td>${String(i + 1).padStart(2, "0")}</td>
      <td class="titulo">${t(w.titulo)}</td>
      <td><span class="nivel ${w.nivel}">${w.nivel}</span></td>
      <td>${w.tecnicas}</td>
      <td>${w.fecha}</td>
      <td class="flecha">→</td>
    </tr>`).join("");

  document.querySelectorAll(".fila").forEach((fila) => {
    const abrir = () => (location.hash = "post-" + fila.dataset.n);
    fila.onclick = abrir;
    fila.onkeydown = (e) => e.key === "Enter" && abrir();
  });
  observarReveals();
}

// sobre mí (con barras de nivel animadas)
function pintarAbout() {
  $("about-texto").innerHTML = `
    <div class="mono who">$ whoami</div>
    <h2>${PERFIL.nombre}</h2>
    <p>${t(PERFIL.whoami)}</p>
    <div style="margin-top:20px">
      <a class="btn magnetic" href="${PERFIL.cv}" download>${T("cv")}</a>
      <a class="btn suave magnetic" href="mailto:${PERFIL.email}">${T("escribeme")}</a>
      <a class="btn suave magnetic" href="${PERFIL.github}" target="_blank" rel="noopener">GitHub</a>
      <a class="btn suave magnetic" href="${PERFIL.linkedin}" target="_blank" rel="noopener">LinkedIn</a>
    </div>

    <div class="grupo"><div class="mono">${T("formacion")}</div>
    ${FORMACION.map((f) => `<div class="dato"><b>${t(f.t)}</b><span class="mono">${t(f.d)} · ${f.f}</span></div>`).join("")}</div>`;

  // niveles estimados por grupo de skills (solo decorativo)
  const niveles = { pentesting: 85, "redes y tráfico": 80, "código": 88, "sistemas": 82 };
  $("about-datos").innerHTML = `
    ${Object.entries(SKILLS).map(([grupo, lista]) => `
      <div class="grupo reveal">
        <div class="mono">${nombreGrupo(grupo)}</div>
        <div class="skill-barra"><em>${lista[0]}</em><span class="track"><i data-w="${niveles[grupo] || 70}"></i></span></div>
        ${lista.slice(1).map((s) => `<span class="tag">${s}</span>`).join("")}
      </div>`).join("")}

    <div class="grupo reveal"><div class="mono">${T("certs")}</div>
    ${CERTS.map((c) => `<span class="tag">${t(c)}</span>`).join("")}</div>`;

  activarMagnetic();
  animarBarras();
  observarReveals();
}

// anima las barras cuando entran en pantalla
let observadorBarras = null;
function animarBarras() {
  if (observadorBarras) observadorBarras.disconnect();
  observadorBarras = new IntersectionObserver((ents) => {
    ents.forEach((e) => {
      if (e.isIntersecting) {
        e.target.style.width = e.target.dataset.w + "%";
        observadorBarras.unobserve(e.target);
      }
    });
  }, { threshold: .4 });
  document.querySelectorAll(".skill-barra i").forEach((b) => observadorBarras.observe(b));
}

// writeup abierto
function pintarPost(n) {
  const w = WRITEUPS[n];
  if (!w) return (location.hash = "writeups");

  // [[texto]] pasa a ser texto censurado
  const html = t(w.contenido).replace(/\[\[(.+?)\]\]/g, '<span class="censurado" tabindex="0">$1</span>');

  $("post-contenido").innerHTML = `
    <a class="btn suave" href="#writeups">${T("volver")}</a>
    <h1>${t(w.titulo)}</h1>
    <div class="mono">${w.fecha} · <span class="${w.nivel}">${w.nivel}</span> · ${w.tecnicas}</div>

    <div class="spoiler-caja">
      ${T("censurado")}
      <button class="switch" id="switch" aria-label="${T("censurado_aria")}"></button>
      <span>${T("censurado_hint")}</span>
    </div>

    <article id="articulo">${html}</article>`;

  $("post-indice").innerHTML = t(w.indice)
    .map((txt, i) => `<a href="#" data-s="s${i + 1}">${txt}</a>`).join("");

  activarSpoilers();
  activarIndice();
}

function activarSpoilers() {
  document.querySelectorAll(".censurado").forEach((c) => {
    c.onclick = () => c.classList.add("visto");
    c.onkeydown = (e) => e.key === "Enter" && c.classList.add("visto");
  });

  $("switch").onclick = () => {
    $("switch").classList.toggle("on");
    $("articulo").classList.toggle("todo-visible");
  };
}

function activarIndice() {
  document.querySelectorAll("#post-indice a").forEach((a) => {
    a.onclick = (e) => {
      e.preventDefault();
      $(a.dataset.s).scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
    };
  });
}


/* ---------- 2. NAVEGACIÓN ---------- */

function navegar() {
  const hash = location.hash.slice(1) || "home";
  const [vista, n] = hash.split("-");
  const validas = ["home", "proyectos", "writeups", "about", "post"];
  const actual = validas.includes(vista) ? vista : "home";

  document.body.dataset.view = actual;
  document.querySelectorAll(".vista").forEach((v) => v.classList.toggle("activa", v.id === "v-" + actual));

  document.querySelectorAll("nav a").forEach((a) => {
    a.classList.toggle("activo", a.dataset.vista === (actual === "post" ? "writeups" : actual));
  });

  if (actual === "post") pintarPost(Number(n));
  scrollTo(0, 0);
  // al cambiar de vista, re-observamos por si hay reveals sin activar
  requestAnimationFrame(observarReveals);
}

// barra de progreso de scroll en el header
function progresoScroll() {
  const h = document.documentElement;
  const max = h.scrollHeight - h.clientHeight;
  const p = max > 0 ? (h.scrollTop / max) * 100 : 0;
  $("nav-progreso-fill").style.width = p + "%";
}
addEventListener("scroll", progresoScroll, { passive: true });


/* ---------- 3. TEMA / IDIOMA ---------- */

document.documentElement.dataset.tema = "oscuro";

$("btn-tema").onclick = () => {
  const r = document.documentElement;
  r.dataset.tema = r.dataset.tema === "claro" ? "oscuro" : "claro";
};

function aplicarUI() {
  document.documentElement.lang = LANG;
  document.querySelectorAll("[data-i]").forEach((el) => (el.textContent = T(el.dataset.i)));
  $("btn-idioma").textContent = LANG === "es" ? "EN" : "ES";
}

function repintar() {
  aplicarUI();
  pintarInicio();
  pintarProyectos();
  pintarWriteups();
  pintarAbout();
  pintarMarquee();

  const [vista, n] = location.hash.slice(1).split("-");
  if (vista === "post") pintarPost(Number(n));
}

function cambiarIdioma() {
  LANG = LANG === "es" ? "en" : "es";
  try { localStorage.setItem("lang", LANG); } catch (e) {}
  repintar();
}

$("btn-idioma").onclick = cambiarIdioma;


/* ---------- 4. TERMINAL ---------- */

const salida = $("term-salida");
const input  = $("term-input");

function imprimir(html) {
  salida.insertAdjacentHTML("beforeend", html + "\n");
  salida.scrollTop = salida.scrollHeight;
}

const COMANDOS = {
  help:      () => `<span class="ok">${T("cmds")}</span> help, whoami, proyectos, skills, certs, cv, ls, cat, open &lt;n&gt;, contact, theme, lang, clear`,
  whoami:    () => t(PERFIL.whoami),
  proyectos: () => PROYECTOS.map((p) => `• ${t(p.nombre)} — ${t(p.sub)}`).join("\n"),
  skills:    () => Object.entries(SKILLS).map(([g, l]) => `<span class="p">${nombreGrupo(g)}:</span> ${l.join(", ")}`).join("\n"),
  certs:     () => CERTS.map((c) => `• ${t(c)}`).join("\n"),
  contact:   () => `${T("correo")} ${PERFIL.email}\ngithub:   ${PERFIL.github}\nlinkedin: ${PERFIL.linkedin}`,
  theme:     () => { $("btn-tema").click(); return T("tema_ok"); },
  lang:      () => { cambiarIdioma(); return T("lang_ok"); },
  clear:     () => { salida.innerHTML = ""; return ""; },
  cv:        () => { window.open(PERFIL.cv, "_blank"); return T("cv_abriendo"); },
  ls:        (arg) => (arg === "-a" ? "about.txt  proyectos.md  <span class=\"p\">.flag</span>" : "about.txt  proyectos.md"),
  cat:       (arg) => (Object.hasOwn(ARCHIVOS, arg) ? ARCHIVOS[arg]() : `<span class="w">cat:</span> ${limpiar(arg || "…")}: ${T("no_existe")}`),
  flag:      (arg) => (arg === FLAG ? `<span class="ok">${T("flag_ok")}</span> ${T("flag_ok2")} ${PERFIL.email}` : `<span class="w">${T("flag_mal")}</span>`),
  "ls writeups": () => WRITEUPS.map((w, i) => `${i + 1}  <span class="${w.nivel}">${w.nivel}</span>  ${t(w.titulo)}`).join("\n") + "\n" + T("usa_open"),
  sudo:      () => `<span class="w">${T("sudo")}</span>`,
};

const ARCHIVOS = {
  "about.txt":    () => t(PERFIL.whoami),
  "proyectos.md": () => COMANDOS.proyectos(),
  ".flag":        () => `${FLAG_B64}\n<span class="mono">${T("flag_hint")}</span>`,
};

function ejecutar(texto) {
  texto = texto.trim();
  if (!texto) return;

  imprimir(`<span class="p">$</span> ${limpiar(texto)}`);

  const abrir = texto.match(/^open\s+(\d+)$/);
  if (abrir) {
    const n = Number(abrir[1]) - 1;
    if (!WRITEUPS[n]) return imprimir(`<span class="w">error:</span> ${T("no_writeup")} ${n + 1}`);
    imprimir(`<span class="ok">${T("abriendo")}</span> ${t(WRITEUPS[n].titulo)}…`);
    return setTimeout(() => (location.hash = "post-" + n), 500);
  }

  const [nombre, ...resto] = texto.split(" ");
  const comando = Object.hasOwn(COMANDOS, texto) ? COMANDOS[texto] : Object.hasOwn(COMANDOS, nombre) ? COMANDOS[nombre] : null;
  const respuesta = comando ? comando(resto.join(" ")) : `<span class="w">${T("no_encontrado")}</span> ${limpiar(texto)}. ${T("prueba_help")}`;

  if (respuesta) imprimir(respuesta);
}

input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") { ejecutar(input.value); input.value = ""; }
});

// atajos táctiles
$("atajos").innerHTML = ["help", "whoami", "proyectos", "skills", "contact"]
  .map((c) => `<button data-c="${c}" data-hover>${c}</button>`).join("");

document.querySelectorAll("#atajos button").forEach((b) => (b.onclick = () => ejecutar(b.dataset.c)));

// pulsa "/" en cualquier parte para saltar a la terminal
addEventListener("keydown", (e) => {
  if (e.key === "/" && document.activeElement !== input && !e.ctrlKey && !e.metaKey) {
    e.preventDefault();
    location.hash = "home";
    setTimeout(() => input.focus(), 150);
  }
});

async function intro() {
  const lineas = [`<span class="mono">${T("intro1")}</span>`, `<span class="ok">[ok]</span> ${T("intro2")}`, T("intro3")];
  for (const l of lineas) {
    await new Promise((r) => setTimeout(r, reduceMotion ? 0 : 420));
    imprimir(l);
  }
}


/* ---------- 5. MARQUEE ---------- */

function pintarMarquee() {
  const items = [...new Set(Object.values(SKILLS).flat())];
  const grupo = items.map((s) => `<span>${s}</span><i>◆</i>`).join("");
  // se duplica para el bucle infinito
  $("marquee-track").innerHTML = grupo + grupo;
}


/* ---------- 6. EFECTOS: cursor, tilt, magnetic, glitch, reveals ---------- */

// cursor + halo
if (punteroFino && !reduceMotion) {
  document.body.classList.add("has-cursor");
  const dot = document.querySelector(".cursor-dot");
  const ring = document.querySelector(".cursor-ring");
  let rx = -100, ry = -100, tx = -100, ty = -100;

  addEventListener("mousemove", (e) => {
    tx = e.clientX; ty = e.clientY;
    document.documentElement.style.setProperty("--cursor-x", tx + "px");
    document.documentElement.style.setProperty("--cursor-y", ty + "px");
    dot.style.transform = `translate(${tx}px, ${ty}px) translate(-50%,-50%)`;
  });

  (function moverRing() {
    rx += (tx - rx) * 0.16;
    ry += (ty - ry) * 0.16;
    ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%,-50%)`;
    requestAnimationFrame(moverRing);
  })();

  // el anillo se agranda sobre elementos interactivos
  document.addEventListener("mouseover", (e) => {
    if (e.target.closest("a, button, tr.fila, input, .censurado, .tag")) ring.classList.add("grande");
    else ring.classList.remove("grande");
  });
}

// tilt 3D + spotlight en las tarjetas de proyecto
function activarTilt() {
  if (!punteroFino || reduceMotion) return;
  document.querySelectorAll(".proyecto").forEach((card) => {
    card.onpointermove = (e) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      card.style.setProperty("--mx", px * 100 + "%");
      card.style.setProperty("--my", py * 100 + "%");
      card.style.setProperty("--ry", (px - 0.5) * 5 + "deg");
      card.style.setProperty("--rx", (0.5 - py) * 4 + "deg");
    };
    card.onpointerleave = () => {
      card.style.setProperty("--rx", "0deg");
      card.style.setProperty("--ry", "0deg");
    };
  });
}

// botones magnéticos
function activarMagnetic() {
  if (!punteroFino || reduceMotion) return;
  document.querySelectorAll(".magnetic").forEach((el) => {
    el.onpointermove = (e) => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      el.style.transform = `translate(${x * 0.18}px, ${y * 0.28}px)`;
    };
    el.onpointerleave = () => (el.style.transform = "");
  });
}

// glitch aleatorio en el titular
if (!reduceMotion) {
  setInterval(() => {
    const lineas = document.querySelectorAll(".g-line");
    if (!lineas.length || document.body.dataset.view !== "home") return;
    const linea = lineas[(Math.random() * lineas.length) | 0];
    linea.classList.add("glitching");
    setTimeout(() => linea.classList.remove("glitching"), 340);
  }, 3400);
}

// reveals con IntersectionObserver
let observadorReveal = null;
function observarReveals() {
  if (reduceMotion) {
    document.querySelectorAll(".reveal").forEach((el) => el.classList.add("in"));
    return;
  }
  if (!observadorReveal) {
    observadorReveal = new IntersectionObserver((ents) => {
      ents.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          observadorReveal.unobserve(e.target);
        }
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -40px 0px" });
  }
  document.querySelectorAll(".reveal:not(.in)").forEach((el) => observadorReveal.observe(el));
}


/* ---------- 7. FONDO (lluvia tipo cmatrix, en morado) ---------- */

const lienzo = $("fondo");
const ctx = lienzo.getContext("2d");
const TAM = 16;
const LETRAS = "ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉ0123456789ABCDEF<>/{}$#";
let ancho, alto, gotas;

const letra = () => LETRAS[(Math.random() * LETRAS.length) | 0];

function ajustarFondo() {
  ancho = lienzo.width = innerWidth;
  alto = lienzo.height = innerHeight;
  gotas = Array.from({ length: Math.floor(ancho / TAM) }, () => Math.random() * -50);
}

function animarFondo() {
  const css = getComputedStyle(document.documentElement);
  const fondo = css.getPropertyValue("--bg").trim();
  const estela = css.getPropertyValue("--acento").trim();
  const cabeza = css.getPropertyValue("--texto").trim();

  ctx.globalAlpha = 0.1;
  ctx.fillStyle = fondo;
  ctx.fillRect(0, 0, ancho, alto);
  ctx.globalAlpha = 1;
  ctx.font = `${TAM}px "JetBrains Mono", monospace`;

  gotas.forEach((fila, i) => {
    const x = i * TAM;
    const y = fila * TAM;

    ctx.fillStyle = fondo;
    ctx.fillRect(x, y - TAM * 2 + 2, TAM, TAM + 2);
    ctx.fillStyle = estela;
    ctx.fillText(letra(), x, y - TAM);

    ctx.fillStyle = cabeza;
    ctx.fillText(letra(), x, y);

    gotas[i] = y > alto && Math.random() > 0.975 ? 0 : fila + 1;
  });
}


/* ---------- 8. LOADER (boot) ---------- */

async function boot() {
  const loader = $("loader");
  const out = $("loader-out");
  const fill = $("loader-fill");
  const lineas = LANG === "es"
    ? ["> montando /dev/portfolio", "> cargando módulos de seguridad", "> verificando integridad del sistema", "> conexión segura establecida", "> acceso concedido_"]
    : ["> mounting /dev/portfolio", "> loading security modules", "> verifying system integrity", "> secure connection established", "> access granted_"];

  for (let i = 0; i < lineas.length; i++) {
    out.innerHTML += (i === lineas.length - 1 ? `<span class="ok">${lineas[i]}</span>` : lineas[i]) + "\n";
    fill.style.width = ((i + 1) / lineas.length) * 100 + "%";
    await new Promise((r) => setTimeout(r, reduceMotion ? 0 : 210));
  }
  await new Promise((r) => setTimeout(r, reduceMotion ? 0 : 350));
  loader.classList.add("done");
  setTimeout(() => loader.remove(), 800);
}
// por si acaso, nunca dejar el loader pillado
setTimeout(() => { const l = $("loader"); if (l) { l.classList.add("done"); setTimeout(() => l.remove(), 800); } }, 6000);


/* ---------- 9. ARRANQUE ---------- */

aplicarUI();
pintarInicio();
pintarProyectos();
pintarWriteups();
pintarAbout();
pintarMarquee();

addEventListener("hashchange", navegar);
navegar();
progresoScroll();

intro();
boot();

ajustarFondo();
addEventListener("resize", ajustarFondo);
setInterval(animarFondo, 70);
