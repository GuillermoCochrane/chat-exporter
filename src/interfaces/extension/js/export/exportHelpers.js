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
    `${TRANSLATIONS.collecting[lang]} ${data?.pageCount ?? ""}...`,

  processing: (lang) =>
    `${TRANSLATIONS.processing[lang]}`,

  generating: (lang, data) =>
    `${TRANSLATIONS.generating[lang]} ${data?.format ?? ""}...`,

  downloading: (lang) =>
    `${TRANSLATIONS.downloading[lang]}`,
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
  setValue("#format", "disabled", true);
  setValue("#compact", "disabled", true);

  for (const radio of $$roleRadios) {
    radio.disabled = true;
  }

  setText("#statusText", "");
  setStyle(".spinner", "display", "inline-block");
}

// Restaurar estado previo a exportación
function restoreExportState() {
  setValue("#exportBtn", "disabled", false);
  setValue("#format", "disabled", false);
  setValue("#compact", "disabled", false);

  for (const radio of $$roleRadios) {
    radio.disabled = false;
  }

  setStyle(".spinner", "display", "none");
}

// Ejecutar exportación real con la configuración dada
export function executeExport(config) {
  beginExport();

  let inactivityTimeout = null;
  let responded = false;

  const cleanup = () => {
    clearTimeout(inactivityTimeout);
    chrome.runtime.onMessage.removeListener(progressListener);
  };

  const handleTimeout = () => {
    responded = true;
    cleanup();
    restoreExportState();

    const currentLang = getCurrentLanguage();
    setText("#statusText", TRANSLATIONS.EXPORT_TIMEOUT[currentLang] ?? TRANSLATIONS.EXPORT_TIMEOUT.en);
  };

  const resetInactivityTimeout = () => {
    clearTimeout(inactivityTimeout);
    inactivityTimeout = setTimeout(handleTimeout, 300000);
  };

  const progressListener = (message) => {
    if (message.type !== "PROGRESS") return;

    const handler = statusMessages[message.stage];
    if (!handler) return;

    const currentLang = getCurrentLanguage();
    setText("#statusText", handler(currentLang, message.data));
    resetInactivityTimeout();
  };

  chrome.runtime.onMessage.addListener(progressListener);
  resetInactivityTimeout();

  chrome.runtime.sendMessage(
    { type: "EXPORT", ...config },
    (response) => {
      if (responded) return;
      responded = true;

      cleanup();
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