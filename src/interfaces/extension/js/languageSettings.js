// Detecta el idioma inicial soportado a partir de las preferencias del navegador.
const SUPPORTED_LANGS = ["es", "en"];

export function getInitialLanguage() {
  // Extraemos el código principal (ej: "es-AR" → "es")
  const browserLang = (navigator.language || "en").slice(0, 2).toLowerCase();
  return SUPPORTED_LANGS.includes(browserLang) ? browserLang : "en";
}