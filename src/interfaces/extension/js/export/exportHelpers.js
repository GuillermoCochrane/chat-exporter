import { $, $$, setValue, setText, hideTag, showTag, setStyle } from "../utilities/dom.js";
import { getCurrentLanguage } from "../languages/languageHandler.js";
import { TRANSLATIONS } from "../languages/translations.js";

const $formatSelect = $("#format");
const $compactCheck = $("#compact");
const $$roleRadios = $$('[name="role"]');
const optionSelectors = ["#formatLabel", "#format", "#mdOptions", "#exportBtn"];

// Mensajes de estado de exportación
const statusMessages = {
  error: () => `⚠️ ${chrome.runtime.lastError?.message ?? ""}`,
  responseFailed: ({ errorPrefix, errorParam }) => `⚠️ ${errorPrefix} ${errorParam}`,
  responseSuccess: (format, lang) => `✔️ ${format.toUpperCase()}${TRANSLATIONS.success[lang]}`,

  collecting: (lang, data) =>
    `⏳ ${TRANSLATIONS.collecting[lang]} ${data?.pageCount ?? ""}...`,

  processing: (lang) =>
    `⏳ ${TRANSLATIONS.processing[lang]}`,

  generating: (lang, data) =>
    `⏳ ${TRANSLATIONS.generating[lang]} ${data?.format ?? ""}...`,

  downloading: (lang) =>
    `⏳ ${TRANSLATIONS.downloading[lang]}`,
};

// Oculta temporalmente las opciones de exportación
export function hideOptions() {
  for (const option of optionSelectors) {
    hideTag(option);
  }
}

// Muestra nuevamente las opciones de exportación
export function showOptions() {
  for (const option of optionSelectors) {
    showTag(option);
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
  setStyle(".spinner", "display", "inline-block");
}

// Restaurar estado previo a exportación
function restoreExportState() {
  setValue("#exportBtn", "disabled", false);
  setStyle(".spinner", "display", "none");
}

// Escucha los mensajes de progreso enviados por el background
export function listenForProgress() {
  chrome.runtime.onMessage.addListener((message) => {
    if (message.type !== "PROGRESS") return;

    const handler = statusMessages[message.stage];
    if (!handler) return;

    const currentLang = getCurrentLanguage();
    setText("#statusText", handler(currentLang, message.data));
  });
}

// Ejecutar exportación real con la configuración dada
export function executeExport(config) {
  beginExport();

  const progressListener = (message) => {
    if (message.type !== "PROGRESS") return;

    const handler = statusMessages[message.stage];
    if (!handler) return;

    const currentLang = getCurrentLanguage();
    setText("#statusText", handler(currentLang, message.data));
  };

  chrome.runtime.onMessage.addListener(progressListener);

  chrome.runtime.sendMessage(
    { type: "EXPORT", ...config },
    (response) => {
      chrome.runtime.onMessage.removeListener(progressListener);
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