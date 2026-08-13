import { $, setText, setValue } from "../utilities/dom.js";

// Idiomas soportados
const SUPPORTED_LANGS = ["es", "en"];

// Obtiene el idioma del navegador
function getBrowserLanguage() {
  return (navigator.language || "en").slice(0, 2).toLowerCase();
}