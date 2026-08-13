import { $, setText, setValue } from "../utilities/dom.js";

// Idiomas soportados
const SUPPORTED_LANGS = ["es", "en"];

// Obtiene el idioma del navegador
function getBrowserLanguage() {
  return (navigator.language || "en").slice(0, 2).toLowerCase();
}

// Devuelve el idioma por defecto
export function loadLanguage() {
  const stored = localStorage.getItem("language");
  if (stored && SUPPORTED_LANGS.includes(stored)) return stored;

  const browserLang = getBrowserLanguage();
  return SUPPORTED_LANGS.includes(browserLang) ? browserLang : "en";
}

// Guarda la preferencia de idioma elegida por el usuario
export function saveLanguage(lang) {
  localStorage.setItem("language", lang);
}
