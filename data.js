/* ==========================================
   DATOS DEL PORTFOLIO
   Lo que tiene { es, en } se traduce solo.
   ========================================== */

// datos personales
const PERFIL = {
  alias: "hmxnz",
  nombre: "Hugo Martínez Segura",
  titular: {
    es: ["Rompo sistemas", "para que dejen", "de romperse."],
    en: ["I break systems", "so they stop", "breaking."],
  },
  resumen: {
    es: "Estudiante de máster en ciberseguridad. Me muevo entre pentesting, seguridad de aplicaciones y análisis de tráfico. Busco prácticas o puesto junior.",
    en: "Master's student in cybersecurity. I work across pentesting, application security and traffic analysis. Looking for an internship or junior role.",
  },
  whoami: {
    es: "Hugo, 23. Máster en Ciberseguridad (UCM). Me va el pentesting web, Python ofensivo y entender cómo se defiende lo que luego intento romper.",
    en: "Hugo, 23. MSc in Cybersecurity (UCM). I'm into web pentesting, offensive Python, and understanding how to defend what I then try to break.",
  },
  email: "h.mxn.segura@gmail.com",
  github: "https://github.com/hmxnz",
  linkedin: "https://linkedin.com/in/hugomseg",
  cv: "CV_Hugo_Martinez_Segura.pdf",
  estado: {
    es: ["máster en curso", "eJPTv2 en preparación", "busco prácticas"],
    en: ["master's in progress", "eJPTv2 in preparation", "open to internships"],
  },
};

// proyectos (de mi CV)
const PROYECTOS = [
  {
    nombre: "NEXUM",
    sub: { es: "TFG · Matrícula de Honor (9,4) · 2025–2026", en: "Final degree project · Highest honors (9.4) · 2025–2026" },
    stack: ["React", "Node.js", "SPARQL", "Docker", "JWT", "bcrypt"],
    puntos: {
      es: [
        "App full-stack para cargar, consultar y visualizar ontologías RDF/OWL, desplegada con Docker Compose.",
        "Modelo de seguridad propio: JWT, bcrypt, control de acceso por roles y datos aislados por usuario.",
        "Módulo contra inyección SPARQL: bloquea escrituras, previene SSRF y limita el tamaño de consulta.",
      ],
      en: [
        "Full-stack app to load, query and visualize RDF/OWL ontologies, deployed with Docker Compose.",
        "Custom security model: JWT, bcrypt, role-based access control and per-user data isolation.",
        "SPARQL injection defense module: blocks writes, prevents SSRF and limits query size.",
      ],
    },
    enlace: "https://github.com/hmxnz/Nexum-TFG",
  },
  {
    nombre: "Offensive Python Toolkit",
    sub: { es: "Python · Redes · 2024–2025", en: "Python · Networking · 2024–2025" },
    stack: ["Python", "Scapy", "Impacket"],
    puntos: {
      es: ["Herramientas propias: escáner de puertos, sniffers, forward shells y enumeración.", "Captura y análisis de paquetes con Scapy e Impacket."],
      en: ["Custom tools: port scanner, sniffers, forward shells and enumeration.", "Packet capture and analysis with Scapy and Impacket."],
    },
    enlace: "",
  },
  {
    nombre: { es: "Laboratorios", en: "Labs" },
    sub: { es: "TryHackMe · HackTheBox · Hack4u · 2025–hoy", en: "TryHackMe · HackTheBox · Hack4u · 2025–present" },
    stack: ["Nmap", "Burp Suite", "SQLi", "privesc"],
    puntos: {
      es: ["Escenarios ofensivos y defensivos: tráfico, explotación web, enumeración y detección."],
      en: ["Offensive and defensive scenarios: traffic, web exploitation, enumeration and detection."],
    },
    enlace: "",
  },
];

// writeups (los que pongas aquí salen solos en la tabla)
// lo que va entre [[ ]] sale censurado hasta que lo pulsas
const WRITEUPS = [
  {
    titulo: { es: "BigBank (ejemplo)", en: "BigBank (example)" },
    nivel: "med",
    tecnicas: "android, idor, cron",
    fecha: "2026-10-18",
    contenido: {
      es: `
      <h3 id="s1">Resumen</h3>
      <p>Máquina media con una API REST. Al descompilar la app aparece tráfico sin cifrar y un <code>IDOR</code> que permite cambiar contraseñas ajenas.</p>

      <h3 id="s2">1. Reconocimiento</h3>
      <pre>nmap -p- --min-rate 5000 -sV 172.17.0.2</pre>

      <h3 id="s3">2. Acceso inicial</h3>
      <p>Con la cuenta <code>admin</code> se descarga <code>/api/admin/backup</code>. Contraseña SSH: [[S3cr3t_ejemplo]]</p>

      <h3 id="s4">3. Escalada</h3>
      <p>Un script con permisos <code>777</code> corre como root cada 5 segundos. Flag: [[flag{ejemplo}]]</p>

      <h3 id="s5">4. Cómo se corrige</h3>
      <p>TLS obligatorio, validar la identidad en el servidor y permisos mínimos en tareas programadas.</p>`,
      en: `
      <h3 id="s1">Summary</h3>
      <p>Medium machine with a REST API. Decompiling the app reveals unencrypted traffic and an <code>IDOR</code> that lets you change other users' passwords.</p>

      <h3 id="s2">1. Recon</h3>
      <pre>nmap -p- --min-rate 5000 -sV 172.17.0.2</pre>

      <h3 id="s3">2. Initial access</h3>
      <p>With the <code>admin</code> account you can download <code>/api/admin/backup</code>. SSH password: [[S3cr3t_example]]</p>

      <h3 id="s4">3. Privilege escalation</h3>
      <p>A script with <code>777</code> permissions runs as root every 5 seconds. Flag: [[flag{example}]]</p>

      <h3 id="s5">4. How to fix it</h3>
      <p>Enforce TLS, validate identity server-side and use least-privilege permissions on scheduled tasks.</p>`,
    },
    indice: {
      es: ["Resumen", "Reconocimiento", "Acceso inicial", "Escalada", "Cómo se corrige"],
      en: ["Summary", "Recon", "Initial access", "Escalation", "How to fix it"],
    },
  },
];

// formación
const FORMACION = [
  {
    t: { es: "Máster en Ciberseguridad", en: "MSc in Cybersecurity" },
    d: { es: "Universidad Complutense de Madrid · online", en: "Complutense University of Madrid · online" },
    f: "2026–2027",
  },
  {
    t: { es: "Grado en Gestión de Información y Contenidos Digitales", en: "BSc in Digital Information and Content Management" },
    d: { es: "Universidad de Murcia", en: "University of Murcia" },
    f: "2022–2026",
  },
];

// certificaciones
const CERTS = [
  "TryHackMe Cybersecurity 101",
  "Hack4u Python Ofensivo",
  "Fortinet Certified Associate",
  "Google Advanced Data Analytics",
  { es: "Inglés C1 Cambridge", en: "English C1 Cambridge" },
  { es: "eJPTv2 (en preparación)", en: "eJPTv2 (in progress)" },
  { es: "CCNA (en preparación)", en: "CCNA (in progress)" },
];

// habilidades por grupo (el nombre en inglés está en UI.en.grupos)
const SKILLS = {
  pentesting: ["Nmap", "Burp Suite", "Metasploit", "Kali", "Nessus"],
  "redes y tráfico": ["Wireshark", "tcpdump", "Scapy", "TCP/IP"],
  "código": ["Python", "Bash", "SQL", "JavaScript", "React", "Node.js"],
  "sistemas": ["Linux", "Windows", "Docker", "Git", "Active Directory"],
};

// textos de la interfaz (menú, botones, terminal...)
const UI = {
  es: {
    nav_home: "inicio", nav_proyectos: "proyectos", nav_writeups: "writeups", nav_about: "sobre mí",
    term_barra: "bash — escribe un comando",
    h_proyectos: "Proyectos", h_writeups: "Writeups",
    writeups_lead: "Máquinas y laboratorios que voy resolviendo.",
    th_titulo: "título", th_nivel: "nivel", th_tecnicas: "técnicas", th_fecha: "fecha",
    sesion: "sesión activa", volver: "← volver",
    censurado: "contenido censurado:", censurado_aria: "Mostrar soluciones", censurado_hint: "Pulsa una barra negra para verla.",
    ver_codigo: "Ver código", cv: "Descargar CV", ver_proyectos: "Ver proyectos", escribeme: "Escríbeme",
    formacion: "formación", certs: "certificaciones", grupos: {},
    intro1: "conectando…", intro2: "sesión iniciada",
    intro3: `Hola, soy Hugo. Escribe <span class="p">help</span> o pulsa un atajo.`,
    cmds: "comandos:", correo: "correo:  ", tema_ok: "tema cambiado", lang_ok: "idioma: español", cv_abriendo: "abriendo CV…",
    abriendo: "abriendo", no_writeup: "no existe el writeup", no_encontrado: "no encontrado:", prueba_help: "Prueba help",
    usa_open: "usa: open 1", no_existe: "no existe",
    flag_ok: "[+] flag correcta.", flag_ok2: "Si has llegado hasta aquí, escríbeme:", flag_mal: "esa no es. sigue mirando.",
    flag_hint: "(eso no es texto normal… decodifícalo y envíalo con: flag &lt;valor&gt;)",
    sudo: "buen intento. aquí no hay root (todavía).",
  },
  en: {
    nav_home: "home", nav_proyectos: "projects", nav_writeups: "writeups", nav_about: "about",
    term_barra: "bash — type a command",
    h_proyectos: "Projects", h_writeups: "Writeups",
    writeups_lead: "Machines and labs I'm working through.",
    th_titulo: "title", th_nivel: "level", th_tecnicas: "techniques", th_fecha: "date",
    sesion: "active session", volver: "← back",
    censurado: "redacted content:", censurado_aria: "Show solutions", censurado_hint: "Click a black bar to reveal it.",
    ver_codigo: "View code", cv: "Download CV", ver_proyectos: "View projects", escribeme: "Get in touch",
    formacion: "education", certs: "certifications",
    grupos: { "redes y tráfico": "networking & traffic", "código": "code", "sistemas": "systems" },
    intro1: "connecting…", intro2: "session started",
    intro3: `Hi, I'm Hugo. Type <span class="p">help</span> or tap a shortcut.`,
    cmds: "commands:", correo: "email:   ", tema_ok: "theme changed", lang_ok: "language: english", cv_abriendo: "opening CV…",
    abriendo: "opening", no_writeup: "no such writeup", no_encontrado: "not found:", prueba_help: "Try help",
    usa_open: "use: open 1", no_existe: "no such file",
    flag_ok: "[+] correct flag.", flag_ok2: "If you got this far, write to me:", flag_mal: "not that one. keep looking.",
    flag_hint: "(that's not plain text… decode it and submit it with: flag &lt;value&gt;)",
    sudo: "nice try. no root here (yet).",
  },
};

// mini CTF escondido (se encuentra con "ls -a" en la terminal)
const FLAG     = "flag{hmxnz_bienvenido_al_nodo}";
const FLAG_B64 = "ZmxhZ3tobXhuel9iaWVudmVuaWRvX2FsX25vZG99";
