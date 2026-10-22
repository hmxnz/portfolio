/* ==========================================
   LÓGICA DEL PORTFOLIO
   Los textos viven en data.js
   ========================================== */

// atajo para buscar elementos
const $ = (id) => document.getElementById(id);

// evita que se cuele html en lo que escribe la gente
const limpiar = (t) => t.replace(/</g, "&lt;");

// idioma: el guardado, o el del navegador
let LANG = "es";
try { LANG = localStorage.getItem("lang") || (navigator.language.startsWith("es") ? "es" : "en"); } catch (e) {}

const t = (x) => (x && x.es !== undefined ? x[LANG] : x);    // texto de los datos según idioma
const T = (k) => UI[LANG][k];                                // texto de la interfaz
const nombreGrupo = (g) => UI[LANG].grupos[g] || g;          // nombre del grupo de skills


/* ---------- 1. PINTAR CONTENIDO ---------- */

// inicio
function pintarInicio() {
  $("hero-prompt").textContent  = `${PERFIL.alias}@kali: ~ — ${T("sesion")}`;
  // la última línea del titular va con degradado + cursor
  const ultima = t(PERFIL.titular).length - 1;
  $("hero-titular").innerHTML = t(PERFIL.titular)
    .map((l, i) => (i === ultima ? `<span class="grad">${l}</span><span class="cursor"></span>` : l))
    .join("<br>");
  $("hero-resumen").textContent = t(PERFIL.resumen);
  $("hero-estado").innerHTML    = t(PERFIL.estado).map((e) => `<span>${e}</span>`).join("");
  $("pie").textContent          = `© 2026 ${PERFIL.nombre}`;

  $("hero-botones").innerHTML = `
    <a class="btn" href="${PERFIL.cv}" download>${T("cv")}</a>
    <a class="btn suave" href="#proyectos">${T("ver_proyectos")}</a>
    <a class="btn suave" href="${PERFIL.github}" target="_blank" rel="noopener">GitHub</a>`;
}

// proyectos
function pintarProyectos() {
  $("lista-proyectos").innerHTML = PROYECTOS.map((p) => `
    <div class="proyecto">
      <h3>${t(p.nombre)}</h3>
      <div class="mono">${t(p.sub)}</div>
      <ul>${t(p.puntos).map((x) => `<li>${x}</li>`).join("")}</ul>
      ${p.stack.map((s) => `<span class="tag">${s}</span>`).join("")}
      ${p.enlace ? `<a class="btn suave" href="${p.enlace}" target="_blank" rel="noopener">${T("ver_codigo")}</a>` : ""}
    </div>`).join("");
}

// tabla de writeups
function pintarWriteups() {
  $("tabla-writeups").innerHTML = WRITEUPS.map((w, i) => `
    <tr class="fila" tabindex="0" data-n="${i}">
      <td>${i + 1}</td>
      <td class="titulo">${t(w.titulo)}</td>
      <td><span class="nivel ${w.nivel}">${w.nivel}</span></td>
      <td>${w.tecnicas}</td>
      <td>${w.fecha}</td>
    </tr>`).join("");

  // click o enter en una fila abre el writeup
  document.querySelectorAll(".fila").forEach((fila) => {
    const abrir = () => (location.hash = "post-" + fila.dataset.n);
    fila.onclick = abrir;
    fila.onkeydown = (e) => e.key === "Enter" && abrir();
  });
}

// sobre mí
function pintarAbout() {
  $("about-texto").innerHTML = `
    <div class="mono">whoami</div>
    <h2>${PERFIL.nombre}</h2>
    <p>${t(PERFIL.whoami)}</p>
    <a class="btn" href="${PERFIL.cv}" download>${T("cv")}</a>
    <a class="btn suave" href="mailto:${PERFIL.email}">${T("escribeme")}</a>
    <a class="btn suave" href="${PERFIL.github}" target="_blank" rel="noopener">GitHub</a>
    <a class="btn suave" href="${PERFIL.linkedin}" target="_blank" rel="noopener">LinkedIn</a>

    <div class="grupo mono">${T("formacion")}</div>
    ${FORMACION.map((f) => `<div class="dato"><b>${t(f.t)}</b><span class="mono">${t(f.d)} · ${f.f}</span></div>`).join("")}`;

  $("about-datos").innerHTML = `
    ${Object.entries(SKILLS).map(([grupo, lista]) => `
      <div class="grupo"><div class="mono">${nombreGrupo(grupo)}</div>
      ${lista.map((s) => `<span class="tag">${s}</span>`).join("")}</div>`).join("")}

    <div class="grupo"><div class="mono">${T("certs")}</div>
    ${CERTS.map((c) => `<span class="tag">${t(c)}</span>`).join("")}</div>`;
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
    .map((t, i) => `<a href="#" data-s="s${i + 1}">${t}</a>`).join("");

  activarSpoilers();
  activarIndice();
}

// spoilers: uno a uno o todos con el switch
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

// índice lateral: scroll suave a cada sección
function activarIndice() {
  document.querySelectorAll("#post-indice a").forEach((a) => {
    a.onclick = (e) => {
      e.preventDefault();
      $(a.dataset.s).scrollIntoView({ behavior: "smooth" });
    };
  });
}


/* ---------- 2. NAVEGACIÓN ---------- */

// según el hash de la url enseñamos una vista u otra
function navegar() {
  const hash = location.hash.slice(1) || "home";
  const [vista, n] = hash.split("-");   // "post-0" -> ["post", "0"]
  const validas = ["home", "proyectos", "writeups", "about", "post"];
  const actual = validas.includes(vista) ? vista : "home";

  document.querySelectorAll(".vista").forEach((v) => v.classList.toggle("activa", v.id === "v-" + actual));

  // marcamos el link del menú (el post cuenta como writeups)
  document.querySelectorAll("nav a").forEach((a) => {
    a.classList.toggle("activo", a.dataset.vista === (actual === "post" ? "writeups" : actual));
  });

  if (actual === "post") pintarPost(Number(n));
  scrollTo(0, 0);
}


/* ---------- 3. TEMA CLARO / OSCURO ---------- */

// siempre arranca en oscuro; el claro solo con el botón ◐
document.documentElement.dataset.tema = "oscuro";

$("btn-tema").onclick = () => {
  const r = document.documentElement;
  r.dataset.tema = r.dataset.tema === "claro" ? "oscuro" : "claro";
};


/* ---------- 3b. IDIOMA ---------- */

// rellena los textos fijos del html (los que llevan data-i)
function aplicarUI() {
  document.documentElement.lang = LANG;
  document.querySelectorAll("[data-i]").forEach((el) => (el.textContent = T(el.dataset.i)));
  $("btn-idioma").textContent = LANG === "es" ? "EN" : "ES";
}

// vuelve a pintar todo en el idioma actual
function repintar() {
  aplicarUI();
  pintarInicio();
  pintarProyectos();
  pintarWriteups();
  pintarAbout();

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

// escribe una línea en la terminal
function imprimir(html) {
  salida.insertAdjacentHTML("beforeend", html + "\n");
  salida.scrollTop = salida.scrollHeight;
}

// añade aquí comandos nuevos (cada uno devuelve texto)
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

// archivos "falsos" para el comando cat
const ARCHIVOS = {
  "about.txt":    () => t(PERFIL.whoami),
  "proyectos.md": () => COMANDOS.proyectos(),
  ".flag":        () => `${FLAG_B64}\n<span class="mono">${T("flag_hint")}</span>`,
};

// ejecuta lo que escribe la persona
function ejecutar(texto) {
  texto = texto.trim();
  if (!texto) return;

  imprimir(`<span class="p">$</span> ${limpiar(texto)}`);

  // caso especial: open 1
  const abrir = texto.match(/^open\s+(\d+)$/);
  if (abrir) {
    const n = Number(abrir[1]) - 1;
    if (!WRITEUPS[n]) return imprimir(`<span class="w">error:</span> ${T("no_writeup")} ${n + 1}`);
    imprimir(`<span class="ok">${T("abriendo")}</span> ${t(WRITEUPS[n].titulo)}…`);
    return setTimeout(() => (location.hash = "post-" + n), 500);
  }

  // separamos nombre y argumento: "cat .flag" -> "cat" + ".flag"
  const [nombre, ...resto] = texto.split(" ");
  const comando = Object.hasOwn(COMANDOS, texto) ? COMANDOS[texto] : Object.hasOwn(COMANDOS, nombre) ? COMANDOS[nombre] : null;
  const respuesta = comando ? comando(resto.join(" ")) : `<span class="w">${T("no_encontrado")}</span> ${limpiar(texto)}. ${T("prueba_help")}`;

  if (respuesta) imprimir(respuesta);
}

input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") { ejecutar(input.value); input.value = ""; }
});

// botones de atajo (para móvil)
$("atajos").innerHTML = ["help", "whoami", "proyectos", "skills", "contact"]
  .map((c) => `<button data-c="${c}">${c}</button>`).join("");

document.querySelectorAll("#atajos button").forEach((b) => (b.onclick = () => ejecutar(b.dataset.c)));

// mensaje de bienvenida, línea a línea
async function intro() {
  const lineas = [`<span class="mono">${T("intro1")}</span>`, `<span class="ok">[ok]</span> ${T("intro2")}`, T("intro3")];
  const sinAnimar = matchMedia("(prefers-reduced-motion: reduce)").matches;

  for (const l of lineas) {
    await new Promise((r) => setTimeout(r, sinAnimar ? 0 : 450));
    imprimir(l);
  }
}


/* ---------- 5. FONDO (lluvia tipo cmatrix, en morado) ---------- */

const lienzo = $("fondo");
const ctx = lienzo.getContext("2d");

const TAM = 16;   // tamaño de cada letra (px)
const LETRAS = "ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉ0123456789";

let ancho, alto, gotas;

// letra al azar
const letra = () => LETRAS[(Math.random() * LETRAS.length) | 0];

// ajusta el canvas a la ventana y reinicia las gotas
function ajustarFondo() {
  ancho = lienzo.width  = innerWidth;
  alto  = lienzo.height = innerHeight;

  // una gota por columna, cada una empieza en una fila distinta
  gotas = Array.from({ length: Math.floor(ancho / TAM) }, () => Math.random() * -50);
}

// cada frame: cae una fila. cabeza clara, estela morada
function animarFondo() {
  const css    = getComputedStyle(document.documentElement);
  const fondo  = css.getPropertyValue("--bg").trim();
  const estela = css.getPropertyValue("--acento").trim();
  const cabeza = css.getPropertyValue("--texto").trim();

  // velo para que lo anterior se vaya apagando
  ctx.globalAlpha = 0.1;
  ctx.fillStyle = fondo;
  ctx.fillRect(0, 0, ancho, alto);
  ctx.globalAlpha = 1;

  ctx.font = `${TAM}px "JetBrains Mono", monospace`;

  gotas.forEach((fila, i) => {
    const x = i * TAM;
    const y = fila * TAM;

    // la cabeza anterior pasa a ser estela (borramos su celda y la repintamos)
    ctx.fillStyle = fondo;
    ctx.fillRect(x, y - TAM * 2 + 2, TAM, TAM + 2);
    ctx.fillStyle = estela;
    ctx.fillText(letra(), x, y - TAM);

    // cabeza nueva
    ctx.fillStyle = cabeza;
    ctx.fillText(letra(), x, y);

    // al salir de la pantalla, a veces reaparece arriba
    gotas[i] = y > alto && Math.random() > 0.975 ? 0 : fila + 1;
  });
}


/* ---------- 6. ARRANQUE ---------- */

aplicarUI();
pintarInicio();
pintarProyectos();
pintarWriteups();
pintarAbout();

addEventListener("hashchange", navegar);
navegar();

intro();

ajustarFondo();
addEventListener("resize", ajustarFondo);
setInterval(animarFondo, 70);
