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

// Traducción dinámica de textos en el DOM
export function setLanguage(lang, translations) {
  for (const entry in translations) {
    const value = translations[entry];
    const selector = `#${entry}`;
    const element = $(selector);
    const property = element?.hasAttribute("title") ? "title" : "textContent";
    element && setValue(selector, property, value[lang] || value.en);
  }
}