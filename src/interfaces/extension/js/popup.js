import { TRANSLATIONS } from './languages.js';

// Helpers
const $ = (selector) => document.querySelector(selector);
const setText = (selector, text) => { ($(selector)) && ($(selector).textContent = text); };
let currentLang = "es";

// Elementos estáticos
const $formatSelect = $("#format");
const $exportBtn = $("#exportBtn");
const $spinner = $(".spinner");
const $statusText = $("#statusText");
const $mdOptions = $("#mdOptions");
const $compactCheck = $("#compact");
const $roleRadios = document.getElementsByName("role");
const $modelName = $("#modelName");
const $langToggle = $("#langToggle");
const $flags = $langToggle.querySelectorAll(".flag");

// Elementos dinámicos (para traducción)
function setlanguage(lang, translations) {
  for (const entry in translations) {
    const value = translations[entry];
    const selector = `#${entry}`;
    const element = $(selector);
    element && setText(selector, value[lang] || value.en);
  }
}

// Versión dinámica de la extensión
setText('aside.version', `v${chrome.runtime.getManifest().version}`);

// Toggle de idioma
$langToggle.addEventListener("click", () => {
  const currentFlag = $langToggle.querySelector(".flag.active");
  const nextFlag = $langToggle.querySelector(".flag:not(.active)");
  const nextLang = nextFlag.dataset.lang;

  // Intercambiar visibilidad
  currentFlag.classList.remove("active");
  currentFlag.hidden = true;
  nextFlag.classList.add("active");
  nextFlag.hidden = false;

  // Aplicar efecto de rotación
  $langToggle.classList.add("rotated");
  setTimeout(() => $langToggle.classList.remove("rotated"), 400);

  // Actualizar idioma
  currentLang = nextLang;
  setlanguage(currentLang, TRANSLATIONS);
});


// Mostrar / ocultar opciones de Markdown según el formato
$formatSelect.addEventListener("change", () => {
  $formatSelect.value === "md" ? $mdOptions.hidden = false : $mdOptions.hidden = true;
});

$exportBtn.addEventListener("click", () => {
  const format = $formatSelect.value;
  const compact = $compactCheck.checked;
  const roleFilter = [...$roleRadios].find((r) => r.checked).value;

  // Estado de carga
  $exportBtn.disabled = true;
  $statusText.textContent = "";
  $spinner.style.display = "inline-block";

  chrome.runtime.sendMessage(
    { type: "EXPORT", format, compact, roleFilter },
    (response) => {
      // Restaurar estado
      $spinner.style.display = "none";
      $exportBtn.disabled = false;

      if (chrome.runtime.lastError) {
        $statusText.textContent = "⚠️ " + chrome.runtime.lastError.message;
        return;
      }

    if (response && response.success === false) {
      const errorPrefix = TRANSLATIONS[response.errorCode]?.[currentLang] 
                          ?? TRANSLATIONS[response.errorCode]?.en 
                          ?? "";
      const errorParam = Object.values(response.params ?? {})[0] ?? "";
      $statusText.textContent = "⚠️ " + errorPrefix + errorParam;
      return;
    }

      $statusText.textContent = `✔️ ${format.toUpperCase()}${TRANSLATIONS.success[currentLang]}`;
    }
  );
});