# SAH — Notas técnicas del sitio

Este archivo documenta cómo está armado el sitio y cómo seguir trabajando sobre él. Es un sitio **estático** (HTML, CSS y JavaScript planos, sin paso de build), pensado para subirse tal cual a Hostinger.

## Estructura de carpetas

```
/
├── index.html                       Inicio (ES)
├── cardio-medicina.html             [PENDIENTE de crear]
├── dra-corina-biagioni.html
├── contacto.html
├── hemodinamia/
│   ├── index.html                   Hub de Hemodinamia
│   ├── angioplastia-coronaria.html  Ficha de procedimiento (plantilla)
│   └── ...                          [otras 5 fichas: PENDIENTES]
├── pacientes/
│   ├── index.html
│   ├── preparacion-para-estudios.html
│   ├── preguntas-frecuentes.html
│   └── derivaciones-medicas.html    Con formulario de derivación
├── legal/                           [PENDIENTE de crear — 8 páginas]
├── blog/                            [PENDIENTE de crear]
├── en/                               Réplica en inglés [PENDIENTE de crear]
├── partials/
│   ├── header.html                  Menú y logo — se edita UNA sola vez
│   └── footer.html                  Pie de página — se edita UNA sola vez
└── assets/
    ├── css/style.css                Sistema visual compartido (colores, tipografía, componentes)
    ├── js/site.js                   Menú, formularios, animaciones, FAQ
    └── (imágenes)
```

## Cómo se arma cada página nueva

Cada página HTML incluye, en el `<body>`:

```html
<div id="site-header"></div>
...contenido de la página...
<div id="site-footer"></div>
<script src="/assets/js/site.js" defer></script>
```

`site.js` inyecta automáticamente `partials/header.html` y `partials/footer.html` dentro de esos `<div>`. Esto evita repetir el menú y el pie de página en cada uno de los ~50 archivos del sitio: **para cambiar un link del menú o el pie, se edita un solo archivo** (`partials/header.html` o `partials/footer.html`) y el cambio aplica a todo el sitio.

El `<body>` de cada página lleva estos atributos, que usa `site.js`:

- `data-nav="hemodinamia"` (o el que corresponda): resalta el link activo en el menú.
- `data-lang="es"` o `"en"`: indica el idioma de la página.
- `data-alt-href="/en/..."`: la URL de la versión en el otro idioma, para el selector ES/EN.

## Cómo previsualizar el sitio en tu computadora

**Importante:** como el menú y el pie se cargan con JavaScript (`fetch`), **no funciona abrir el archivo `index.html` con doble clic** (el navegador bloquea esas cargas por seguridad en archivos locales `file://`). Hay que verlo a través de un servidor local:

- En VS Code: instalá la extensión **"Live Server"**, clic derecho sobre `index.html` → "Open with Live Server".
- O por terminal, parado en la carpeta del proyecto: `python3 -m http.server 8080` y abrir `http://localhost:8080` en el navegador.

Cuando subas los archivos a Hostinger, esto no es necesario — un sitio en un hosting real siempre se sirve así.

## Sistema visual

Todos los colores, tipografías y componentes (botones, tarjetas, formularios, FAQ, avisos) están centralizados en `assets/css/style.css`, usando variables CSS (`:root { ... }`) para que sea fácil ajustar la paleta en un solo lugar si hace falta.

**Paleta actual (a pedido de Lucas, 31/08): fondo azul marino, acentos dorados, rojo exclusivo para el botón de acción principal.**

- `--navy` / `--navy-2` / `--navy-3`: tres tonos de azul marino para fondo de página, header/footer/menú móvil, y superficies elevadas (tarjetas, secciones "soft"), respectivamente.
- `--white` / `--ink` / `--ink-soft`: texto principal y secundario, en tonos claros (el sitio es de fondo oscuro).
- `--gold` / `--gold-600`: dorado — para eyebrows, links, iconografía, bordes sutiles y la marca "SAH" en el header. Nunca se usa para el botón de acción principal.
- `--red` / `--red-600`: rojo — reservado **exclusivamente** para `.btn-primary` (el botón de acción principal, ej. "Solicitar información" / "Enviar solicitud de derivación"). No se usa en ningún otro lugar del sitio.
- Tipografía: los títulos (`.sec-title`, `h1`/`h2` de héroes, páginas legales, blog) usan **Cormorant Garamond** (serif); el texto de cuerpo sigue en **Inter** (sans-serif).
- Los formularios (`<input>`, `<select>`, `<textarea>`) usan fondo claro con texto oscuro — decisión deliberada por legibilidad y contraste, ya que son formularios médicos y la accesibilidad WCAG 2.1 AA es un requisito no negociable del brief. El resto del sitio es de fondo oscuro.
- Nombres de variables históricos (`--petrol`, `--petrol-700`, `--teal`, `--bg-soft`, etc.) se mantuvieron como alias apuntando a los nuevos tokens, para no tener que reescribir cada archivo HTML — sus valores ya resuelven al color correcto de la paleta nueva.
- La paleta anterior (blanco predominante / azul petróleo — la que pedía el brief original) quedó guardada en `_backups/style-paleta-clara-original.css` por si en algún momento se quiere volver a ella o comparar.
- Se verificó con una fórmula de contraste WCAG que todos los pares texto/fondo principales superan 4.5:1 (la mayoría supera 7:1 — nivel AAA).

## Formularios

Los formularios (`contacto.html`, `pacientes/derivaciones-medicas.html`) tienen validación básica en el navegador y un campo antispam oculto (honeypot), pero **todavía no están conectados a un envío real** — por ahora solo simulan el envío para poder revisar el diseño. Falta definir e implementar el sistema de recepción (backend/API en Hostinger, o un servicio de formularios) — queda anotado como [DATO PENDIENTE].

## Contenido marcado como [DATO PENDIENTE]

Buscá `[DATO PENDIENTE]` en el código para encontrar todos los datos que faltan confirmar (dirección, teléfono, email, horarios, CV de la Dra. Biagioni, fotografía profesional, confirmación de atención de urgencias, etc.). No se inventó ningún dato institucional, profesional ni de contacto.

## Versión en inglés (`/en/...`)

El sitio es bilingüe: cada página ES tiene su par en `/en/...`, con `hreflang` cruzado, `canonical` propio y el mismo `data-nav`. Los nombres de archivo en inglés no son traducciones literales de los nombres en español (por ejemplo, `hemodinamia/` en inglés es `en/interventional-cardiology/`, y `pacientes/` es `en/patients/`) — son las rutas que ya estaban declaradas en `hreflang` desde el primer lote de construcción.

El header y el footer también están traducidos: existen `en/partials/header.html` y `en/partials/footer.html`, con los mismos componentes visuales pero en inglés. `assets/js/site.js` elige automáticamente qué partial cargar según el atributo `data-lang` del `<body>` de cada página — no hace falta tocar el JS al agregar páginas nuevas, alcanza con darle a cada página en inglés `data-lang="en"` y `data-alt-href="/ruta-a-la-version-en-espanol.html"` (y viceversa en la versión en español).

Selector de idioma (ES/EN) en el header: es el mismo componente en ambos idiomas: el JS decide el link activo y hacia dónde apunta el otro idioma usando `data-lang` + `data-alt-href`, así que no requiere mantenimiento aparte.

## Estado actual (última actualización de esta nota)

Construidas en español: Inicio, Cardio Medicina, Hemodinamia (hub + las 6 fichas de procedimiento), Dra. Corina Biagioni, Pacientes (hub + preparación + FAQ + derivaciones con formulario), Contacto, Blog (portada vacía + plantilla de artículo en `blog/plantilla-de-articulo.html`, sin publicar), las 8 páginas legales, `404.html`, `sitemap.xml` y `robots.txt`.

Construidas en inglés — **versión bilingüe completa**: Home, Cardio Medicine, Interventional Cardiology (hub + las 6 fichas de procedimiento), Dr. Corina Biagioni, Patients (hub + preparación + FAQ + derivaciones con formulario), Contact, Blog (portada + `en/blog/article-template.html`), las 8 páginas legales y `en/404.html`. 25 páginas en total, verificadas sin errores de consola con servidor local + Playwright, con los 48 links cruzados ES↔EN (selector de idioma) probados uno por uno.

Pendientes: artículos reales del blog en ambos idiomas (revisados médicamente), conexión real de los formularios a un sistema de recepción, y todos los `[DATO PENDIENTE]` / `[PENDING INFORMATION]` que aparecen en el código (buscalos con Ctrl+F en el editor).

## Cambio de paleta (31/08) — fondo navy, dorado, rojo

A pedido de Lucas se rediseñó el sistema visual completo (ver sección "Sistema visual" más arriba) para volver a los tonos azul marino / dorado / rojo del borrador original, en vez de la paleta blanco/petróleo del brief. El cambio se aplicó a las 52 páginas reales del sitio (ES + EN) editando los tokens centrales en `assets/css/style.css` y corrigiendo puntualmente los pocos lugares donde un color se usaba con un rol distinto al de texto/heading (fondos de hero, tarjetas destacadas, insignias numeradas) para que el contraste siguiera siendo correcto en el fondo oscuro.

De paso se encontró y corrigió un bug real (no relacionado con el color) en el menú móvil: `header.site-nav` usa `backdrop-filter`, lo que convierte al header en el "contenedor de referencia" para elementos con `position:fixed` anidados adentro — por eso el menú móvil (`#nav-mobile`) quedaba comprimido a la altura del header en vez de cubrir toda la pantalla. Se movió el menú móvil para que sea hermano de `<header>` en vez de estar anidado adentro (`partials/header.html` y `en/partials/header.html`). Este bug ya existía en la versión anterior (paleta clara) — no lo introdujo el cambio de color, pero se corrigió de paso al verificar.

Verificación: Playwright sobre las 52 páginas reales (status 200, header/footer inyectado, fondo correcto, sin errores de consola reales), capturas visuales de las páginas principales, apertura del menú móvil, y cálculo de contraste WCAG para los pares de color principales (texto sobre fondo, botones, formularios, avisos) — todos por encima de 4.5:1.
