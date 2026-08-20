export const CHANGELOGTRANSLATIONS = {
  // Changelog navbar
  "anchor-v142": {
    en: "v1.4.2 — Popup refactor & fix",
    es: "v1.4.2 — Refactor y corrección del popup",
  },
  "anchor-v141": {
    en: "v1.4.1 — Reload warning",
    es: "v1.4.1 — Advertencia de recarga",
  },
  "anchor-v140": {
    en: "v1.4.0 — Official website",
    es: "v1.4.0 — Sitio web oficial",
  },
  "anchor-v131": {
    en: "v1.3.1 — Multi-language",
    es: "v1.3.1 — Multiidioma",
  },
  "anchor-v130": {
    en: "v1.3.0 — Stable release",
    es: "v1.3.0 — Versión estable",
  },
  "anchor-v124": {
    en: "v1.2.4 — Visual redesign",
    es: "v1.2.4 — Rediseño visual",
  },
  "anchor-v123": {
    en: "v1.2.3 — Compact & roles",
    es: "v1.2.3 — Modo compacto y roles",
  },
  "anchor-v122": {
    en: "v1.2.2 — Export options",
    es: "v1.2.2 — Opciones de exportación",
  },
  "anchor-older": {
    en: "Older versions",
    es: "Versiones anteriores",
  },


  // v1.4.2
  "changelog-v142-title": {
    en: " — Popup refactor and conversation recovery",
    es: " — Refactor del popup y recuperación de conversación",
  },
  "changelog-v142-item1": {
    en: "Modularized popup code into reusable handlers (DOM helpers, language management, export flow, format toggle, version handler).",
    es: "Se modularizó el código del popup en handlers reutilizables (helpers de DOM, gestión de idioma, flujo de exportación, toggle de formato, handler de versión).",
  },
  "changelog-v142-item2": {
    en: "Converted popup.js into a lightweight orchestrator.",
    es: "Se convirtió popup.js en un orquestador liviano.",
  },
  "changelog-v142-item3": {
    en: "Fixed consecutive exports without page reload by recovering the conversation from the page if the Service Worker loses state.",
    es: "Se corrigieron las exportaciones consecutivas sin recargar la página, recuperando la conversación desde la página si el Service Worker pierde el estado.",
  },
  "changelog-v142-item4": {
    en: "Removed debug logs from inject.js, content.js, and background.js.",
    es: "Se eliminaron los logs de depuración de inject.js, content.js y background.js.",
  },
  "changelog-v142-item5": {
    en: "Kept existing functionality unchanged for the user.",
    es: "La funcionalidad existente se mantiene sin cambios visibles para el usuario.",
  },
  "changelog-v142-item6": {
    en: "Updated project documentation.",
    es: "Se actualizó la documentación del proyecto.",
  },

  // v1.4.1
  "changelog-v141-title": {
    en: " — Reload warning before export",
    es: " — Advertencia de recarga antes de exportar",
  },
  "changelog-v141-item1": {
    en: "Added an optional warning that appears when clicking Export if no saved preference exists.",
    es: "Se agregó una advertencia opcional que aparece al hacer clic en Exportar si no existe una preferencia guardada.",
  },
  "changelog-v141-item2": {
    en: "The warning pauses the export and allows continuing with the same selected options.",
    es: "La advertencia pausa la exportación y permite continuar con las mismas opciones seleccionadas.",
  },
  "changelog-v141-item3": {
    en: "Added a checkbox to not show the warning again, persisted in chrome.storage.local.",
    es: "Se agregó una casilla para no volver a mostrar la advertencia, que se guarda en chrome.storage.local.",
  },
  "changelog-v141-item4": {
    en: "Added a contextual link to the Troubleshooting section of the FAQ inside the warning.",
    es: "Se agregó un enlace contextual a la sección de Solución de problemas del FAQ dentro de la advertencia.",
  },
  "changelog-v141-item5": {
    en: "Added a discreet help link (?) in the popup footer that also points to the FAQ.",
    es: "Se agregó un enlace discreto de ayuda (?) en el footer del popup que también lleva al FAQ.",
  },
  "changelog-v141-item6": {
    en: "During the warning, export options are temporarily hidden to avoid layout overflow.",
    es: "Durante la advertencia, las opciones de exportación se ocultan temporalmente para evitar el desborde del layout.",
  },
  "changelog-v141-item7": {
    en: "Updated project documentation.",
    es: "Se actualizó la documentación del proyecto.",
  },

  // v1.4.0
  "changelog-v140-title": {
    en: " — Official website & multi-language system",
    es: " — Sitio web oficial y sistema multiidioma",
  },
  "changelog-v140-item1": {
    en: "Created the official project website, hosted on GitHub Pages, with the same cyberpunk visual identity as the extension.",
    es: "Se creó el sitio web oficial del proyecto, alojado en GitHub Pages, con la misma identidad visual cyberpunk de la extensión.",
  },
  "changelog-v140-item2": {
    en: "Implemented the following pages:",
    es: "Se implementaron las siguientes páginas:",
  },
  "changelog-v140-sub1": {
    en: "Landing page.",
    es: "Landing page.",
  },
  "changelog-v140-sub2": {
    en: "Privacy policy page.",
    es: "Página de política de privacidad.",
  },
  "changelog-v140-sub3": {
    en: "FAQ page.",
    es: "Página de preguntas frecuentes.",
  },
  "changelog-v140-sub4": {
    en: "CLI documentation page.",
    es: "Página de documentación de la CLI.",
  },
  "changelog-v140-sub5": {
    en: "Changelog page.",
    es: "Página de historial de cambios.",
  },
  "changelog-v140-sub6": {
    en: "Sitemap page as navigation fallback.",
    es: "Página de mapa del sitio como respaldo de navegación.",
  },
  "changelog-v140-item3": {
    en: "Added a multi-language system (Spanish / English) to all website pages, including translation helpers per page, reusable language handlers, visual language toggle with SVG flags, preference persistence in localStorage, and automatic browser language detection.",
    es: "Se agregó un sistema multiidioma (español / inglés) a todas las páginas del sitio, incluyendo helpers de traducción por página, handlers de idioma reutilizables, toggle visual con banderas SVG, persistencia de preferencias en localStorage y detección automática del idioma del navegador.",
  },
  "changelog-v140-item4": {
    en: "Modularized the site's CSS and JavaScript by responsibility.",
    es: "Se modularizaron el CSS y JavaScript del sitio por responsabilidad.",
  },
  "changelog-v140-item5": {
    en: "Added complete SEO, Open Graph, and Twitter Card meta tags across all pages.",
    es: "Se agregaron meta tags completos de SEO, Open Graph y Twitter Cards en todas las páginas.",
  },
  "changelog-v140-item6": {
    en: "Created the social preview image and its HTML template.",
    es: "Se creó la imagen social de vista previa y su plantilla HTML.",
  },
  "changelog-v140-item7": {
    en: "Added Google Search Console verification meta tag.",
    es: "Se agregó la meta tag de verificación de Google Search Console.",
  },
  "changelog-v140-item8": {
    en: "Implemented page transitions using the View Transitions API.",
    es: "Se implementaron transiciones de página usando la API de View Transitions.",
  },
  "changelog-v140-item9": {
    en: "Improved active section detection in the sidebar during scroll.",
    es: "Se mejoró la detección de la sección activa en la sidebar durante el scroll.",
  },
  "changelog-v140-item10": {
    en: "Fixed multiple responsive, style, and navigation issues.",
    es: "Se corrigieron múltiples problemas de responsive, estilos y navegación.",
  },
  "changelog-v140-item11": {
    en: "Updated general and extension documentation to reflect the new website.",
    es: "Se actualizó la documentación general y de la extensión para reflejar la nueva web.",
  },

  // v1.3.1
  "changelog-title": {
    en: "Changelog",
    es: "Historial de cambios",
  },
  "changelog-subtitle": {
    en: "Every update, improvement, and fix — all in one place.",
    es: "Cada actualización, mejora y corrección — todo en un solo lugar.",
  },
  "changelog-v131-title": {
    en: "— Multi-language system & publication prep",
    es: "— Sistema multidioma y preparación para publicación",
  },
  "changelog-v131-item1": {
    en: "Multi-language translation system in the popup:",
    es: "Sistema de traducción multidioma en el popup:",
  },
  "changelog-v131-sub1-a": {
    en: "Translation helper ",
    es: "Helper de traducción ",
  },
  "changelog-v131-sub1-b": {
    en: " with Spanish and English support.",
    es: " con soporte para español e inglés.",
  },
  "changelog-v131-sub2-a": {
    en: "Decoupled error messages: background sends error codes ",
    es: "Mensajes de error desacoplados: el background envía códigos de error ",
  },
  "changelog-v131-sub2-b": {
    en: " and the popup translates them.",
    es: " y el popup los traduce.",
  },
  "changelog-v131-sub3-a": {
    en: "Automatic browser language detection on popup load ",
    es: "Detección automática del idioma del navegador al cargar el popup ",
  },
  "changelog-v131-sub4": {
    en: "Visual toggle with inline SVG flags (Spain / UK) to switch languages.",
    es: "Toggle visual con banderas SVG inline (España / Reino Unido) para cambiar de idioma.",
  },
  "changelog-v131-sub5-a": {
    en: "Language preference persistence via ",
    es: "Persistencia de la preferencia de idioma mediante ",
  },
  "changelog-v131-item3-a": {
    en: "Added ",
    es: "Se agregó el permiso ",
  },
  "changelog-v131-item3-b": {
    en: " permission to ",
    es: " a ",
  },
  "changelog-v131-item3-c": {
    en: " for saving language preference.",
    es: " para guardar la preferencia de idioma.",
  },
  "changelog-v131-item4": {
    en: "Prepared materials for Chrome Web Store publication:",
    es: "Se prepararon materiales para la publicación en Chrome Web Store:",
  },
  "changelog-v131-sub6": {
    en: "Short and long descriptions.",
    es: "Descripciones corta y larga.",
  },
  "changelog-v131-sub7": {
    en: "Privacy policy.",
    es: "Política de privacidad.",
  },
  "changelog-v131-sub8": {
    en: "Permissions justification.",
    es: "Justificación de permisos.",
  },
  "changelog-v131-item5-a": {
    en: "Reorganized popup scripts into ",
    es: "Se reorganizaron los scripts del popup en la carpeta ",
  },
  "changelog-v131-item5-b": {
    en: " folder (",
    es: " (",
  },
  "changelog-v131-item6-a": {
    en: "Updated extension build to copy ",
    es: "Se actualizó el build de la extensión para copiar la carpeta ",
  },
  "changelog-v131-item6-b": {
    en: " folder to ",
    es: " a ",
  },
  "changelog-v131-item7": {
    en: "Updated general and extension documentation.",
    es: "Se actualizó la documentación general y de la extensión.",
  },

  // v1.3.0
  "changelog-v130-title": {
    en: " — Stable release with visual redesign & distribution prep",
    es: " — Versión estable con rediseño visual y preparación para distribución",
  },
  "changelog-v130-item1": {
    en: "Published stable version 1.3.0 on GitHub.",
    es: "Se publicó la versión estable 1.3.0 en GitHub.",
  },
  "changelog-v130-item2": {
    en: "Includes all features from the 1.2.x series:",
    es: "Incluye todas las funcionalidades de la serie 1.2.x:",
  },
  "changelog-v130-sub1-a": {
    en: "Popup with advanced options ",
    es: "Popup con opciones avanzadas ",
  },
  "changelog-v130-sub2-a": {
    en: "Cyberpunk redesign with ",
    es: "Rediseño cyberpunk con ",
  },
  "changelog-v130-sub3-a": {
    en: "Automated ",
    es: "Generación automática de ",
  },
  "changelog-v130-sub3-b": {
    en: " build.",
    es: ".",
  },
  "changelog-v130-sub4": {
    en: "Final icons in all sizes.",
    es: "Íconos finales en todos los tamaños.",
  },
  "changelog-v130-sub5": {
    en: "Progress indicator and UX improvements.",
    es: "Indicador de progreso y mejoras de UX.",
  },
  "changelog-v130-item3": {
    en: "Updated documentation and preparation for Chrome Web Store publication.",
    es: "Documentación actualizada y preparación para la publicación en Chrome Web Store.",
  },

  // v1.2.4
  "changelog-v124-title": {
    en: " — Visual redesign & UX improvements in the popup",
    es: " — Rediseño visual y mejoras de UX en el popup",
  },
  "changelog-v124-item1-a": {
    en: "Added contextual header to the popup showing the conversation provider ",
    es: "Se agregó un encabezado contextual al popup que muestra el proveedor de la conversación ",
  },
  "changelog-v124-item1-b": {
    en: ", ready for future models.",
    es: ", listo para futuros modelos.",
  },
  "changelog-v124-item2": {
    en: 'Implemented animated CSS spinner as a progress indicator during export, replacing the "Processing..." text.',
    es: 'Se implementó un spinner CSS animado como indicador de progreso durante la exportación, reemplazando el texto "Procesando...".',
  },
  "changelog-v124-item3": {
    en: "Disabled the Export button during processing to prevent multiple clicks.",
    es: "Se deshabilitó el botón Exportar durante el procesamiento para evitar múltiples clics.",
  },
  "changelog-v124-item4": {
    en: "Improved the error message when no conversation is captured, including the provider name.",
    es: "Se mejoró el mensaje de error cuando no hay una conversación capturada, incluyendo el nombre del proveedor.",
  },
  "changelog-v124-item5-a": {
    en: "Added dynamic extension version in the popup footer, retrieved from ",
    es: "Se agregó la versión dinámica de la extensión en el footer del popup, obtenida desde ",
  },
  "changelog-v124-item5-b": {
    en: ".",
    es: ".",
  },
  "changelog-v124-item6": {
    en: "Applied a complete cyberpunk redesign to the popup:",
    es: "Se aplicó un rediseño cyberpunk completo al popup:",
  },
  "changelog-v124-sub1": {
    en: "Dark background with radial gradient.",
    es: "Fondo oscuro con gradiente radial.",
  },
  "changelog-v124-sub2": {
    en: "Glassmorphism effects on surfaces.",
    es: "Efectos de glassmorphism en superficies.",
  },
  "changelog-v124-sub3": {
    en: "Switch and radio buttons with physical hardware look (raised/pressed).",
    es: "Switch y radio buttons con apariencia de hardware físico (elevado/presionado).",
  },
  "changelog-v124-sub4-a": {
    en: "Native select styled with the new ",
    es: "Select nativo estilizado con la nueva ",
  },
  "changelog-v124-sub4-b": {
    en: " API.",
    es: " API.",
  },
  "changelog-v124-item7-a": {
    en: "Implemented a ",
    es: "Se implementó un ",
  },
  "changelog-v124-item7-b": {
    en: " (design variables) with color palette derived from the extension icon.",
    es: " (variables de diseño) con paleta de colores derivada del ícono de la extensión.",
  },
  "changelog-v124-item8-a": {
    en: "Modularized popup CSS by responsibility into independent files ",
    es: "Se modularizó el CSS del popup por responsabilidad en archivos independientes ",
  },
  "changelog-v124-item8-b": {
    en: ".",
    es: ".",
  },
  "changelog-v124-item9-a": {
    en: "Fixed compact mode tests that expected quote formatting ",
    es: "Se corrigieron los tests del modo compacto que esperaban formato de cita ",
  },
  "changelog-v124-item9-b": {
    en: ", which was removed in v1.2.2.",
    es: ", que fue eliminado en v1.2.2.",
  },
  "changelog-v124-item10": {
    en: "Updated general and extension documentation.",
    es: "Se actualizó la documentación general y de la extensión.",
  },

  // v1.2.3
  "changelog-v123-title": {
    en: " — Compact mode & role filters in the extension",
    es: " — Modo compacto y filtros de rol en la extensión",
  },
  "changelog-v123-item1": {
    en: "Added advanced options to the extension popup:",
    es: "Se agregaron opciones avanzadas al popup de la extensión:",
  },
  "changelog-v123-sub1": {
    en: "Checkbox for compact mode.",
    es: "Checkbox para modo compacto.",
  },
  "changelog-v123-sub2-a": {
    en: "Radio buttons to filter by role ",
    es: "Botones de radio para filtrar por rol ",
  },
  "changelog-v123-item3": {
    en: "Markdown-specific options hidden when JSON is selected.",
    es: "Las opciones específicas de Markdown se ocultan cuando se selecciona JSON.",
  },
  "changelog-v123-item4-a": {
    en: "Extracted popup CSS to an independent file ",
    es: "Se extrajo el CSS del popup a un archivo independiente ",
  },
  "changelog-v123-item5-a": {
    en: "Updated ",
    es: "Se actualizó ",
  },
  "changelog-v123-item5-b": {
    en: " to propagate ",
    es: " para propagar ",
  },
  "changelog-v123-item5-c": {
    en: " and ",
    es: " y ",
  },
  "changelog-v123-item5-d": {
    en: " to the pipeline.",
    es: " al pipeline.",
  },
  "changelog-v123-item6-a": {
    en: "Updated extension build to include ",
    es: "Se actualizó el build de la extensión para incluir ",
  },
  "changelog-v123-item7": {
    en: "Updated general and extension documentation.",
    es: "Se actualizó la documentación general y de la extensión.",
  },

  // v1.2.2
  "changelog-v122-title": {
    en: " — Role filter & compact mode improvements in CLI",
    es: " — Filtro por rol y mejoras del modo compacto en la CLI",
  },
  "changelog-v122-item1-a": {
    en: "Extended ",
    es: "Se extendió ",
  },
  "changelog-v122-item1-b": {
    en: " to accept an optional ",
    es: " para aceptar un parámetro opcional ",
  },
  "changelog-v122-item1-c": {
    en: " parameter to filter messages by user, assistant, or keep all.",
    es: " para filtrar mensajes por usuario, asistente o mantener todos.",
  },
  "changelog-v122-item2-a": {
    en: "Integrated role filter into ",
    es: "Se integró el filtro por rol en ",
  },
  "changelog-v122-item2-b": {
    en: " via ",
    es: " a través de ",
  },
  "changelog-v122-item3-a": {
    en: "Added ",
    es: "Se agregó la opción ",
  },
  "changelog-v122-item3-c": {
    en: " option to CLI with validation in ",
    es: " a la CLI con validación en ",
  },
  "changelog-v122-item4": {
    en: "Improved compact mode in the Markdown generator:",
    es: "Se mejoró el modo compacto en el generador Markdown:",
  },
  "changelog-v122-sub1-a": {
    en: "Now preserves horizontal rules ",
    es: "Ahora conserva las reglas horizontales ",
  },
  "changelog-v122-sub1-b": {
    en: " and lists ",
    es: " y las listas ",
  },
  "changelog-v122-sub1-c": {
    en: " that require specific spacing in Markdown.",
    es: " que requieren un espaciado específico en Markdown.",
  },
  "changelog-v122-sub2-a": {
    en: "Implemented a placeholder technique ",
    es: "Se implementó una técnica de placeholders ",
  },
  "changelog-v122-sub2-b": {
    en: " to handle edge cases like list-to-paragraph transitions.",
    es: " para manejar casos límite como las transiciones lista-párrafo.",
  },
  "changelog-v122-item6": {
    en: "Added automated tests for role filtering.",
    es: "Se agregaron pruebas automatizadas para el filtrado por rol.",
  },
  "changelog-v122-item7": {
    en: "Updated general documentation.",
    es: "Se actualizó la documentación general.",
  },

  // Older versions
  "changelog-older-title": {
    en: "Older versions",
    es: "Versiones anteriores",
  },
  "changelog-older-description": {
    en: "For the complete history from v0.5.0 to v1.2.1, see the full changelog in the project repository.",
    es: "Para el historial completo desde v0.5.0 hasta v1.2.1, consultá el changelog completo en el repositorio del proyecto.",
  },
  "changelog-older-link": {
    en: "View full changelog on GitHub",
    es: "Ver changelog completo en GitHub",
  },
};
