import { TRANSLATIONS } from './languages.js';

// Helpers
const $ = (selector) => document.querySelector(selector);
const setText = (selector, text) => { ($(selector)) && ($(selector).textContent = text); };
const currentLang = "es";

// Elementos estáticos
const $formatSelect = $("#format");
const $exportBtn = $("#exportBtn");
const $spinner = $(".spinner");
const $statusText = $("#statusText");
const $mdOptions = $("#mdOptions");
const $compactCheck = $("#compact");
const $roleRadios = document.getElementsByName("role");
const $modelName = $("#modelName");

// Elementos dinámicos (para traducción)
function setlanguage(lang, translations) {
  for (const entry in translations) {
    const value = translations[entry];
    const selector = `#${entry}`;
    const element = $(selector);
    element && setText(selector, value[lang] || value.en);
  }
}

setText('aside.version', `v${chrome.runtime.getManifest().version}`);


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