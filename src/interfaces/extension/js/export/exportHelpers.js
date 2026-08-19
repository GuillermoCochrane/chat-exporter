import { $, $$, setValue , setText, hideTag, showTag } from '../utilities/dom.js';
import { getCurrentLanguage } from '../languages/languageHandler.js';
import { TRANSLATIONS } from '../languages/translations.js';

const $formatSelect = $("#format");
const $compactCheck = $("#compact");
const $$roleRadios = $$('[name="role"]');
const optionSelectors = ["#formatLabel", "#format", "#mdOptions", "#exportBtn"  ]

// Mensajes de estado de exportación
const statusMessages = {
  error: () => `⚠️ ${chrome.runtime.lastError?.message ?? ""}`,
  responseFailed: ({ errorPrefix, errorParam }) => `⚠️ ${errorPrefix} ${errorParam}`,
  responseSuccess: (format, lang) => `✔️ ${format.toUpperCase()}${TRANSLATIONS.success[lang]}`,
};

// Oculta temporalmente las opciones de exportación
export function hideOptions() {
  for (const option of optionSelectors) {
    hideTag(option)
  }
}

// Muestra nuevamente las opciones de exportación
export function showOptions() {
  for (const option of optionSelectors) {
    showTag(option)
  }
}

// Obtener configuración actual de exportación
export function getExportConfig() {
  return {
    format: $formatSelect.value,
    compact: $compactCheck.checked,
    roleFilter: [...$$roleRadios].find((radio) => radio.checked).value,
  };
}

// Estado inicial de exportación
export function beginExport() {
  setValue("#exportBtn", "disabled", true);
  setValue("#statusText", "textContent", "");
  setValue(".spinner", "style.display", "inline-block");
}

// Restaurar estado previo a exportación
function restoreExportState() {
  setValue("#exportBtn", "disabled", false);
  setValue(".spinner", "style.display", "none");
}

// Ejecutar exportación real con la configuración dada
export function executeExport(config) {
  beginExport();

  chrome.runtime.sendMessage(
    { type: "EXPORT", ...config },
    (response) => {
      // Restaurar estado
      restoreExportState();

      if (chrome.runtime.lastError) {
        setText("#statusText", statusMessages.error());
        return;
      }

      const currentLang = getCurrentLanguage();

      if (response && response.success === false) {
        const errorPrefix = TRANSLATIONS[response.errorCode]?.[currentLang] 
                            ?? TRANSLATIONS[response.errorCode]?.en 
                            ?? "";
        const errorParam = Object.values(response.params ?? {})[0] ?? "";
        setText("#statusText", statusMessages.responseFailed({ errorPrefix, errorParam }));
        return;
      }

      setText("#statusText", statusMessages.responseSuccess(config.format, currentLang));
    }
  );
}