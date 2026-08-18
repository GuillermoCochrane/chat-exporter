import { TRANSLATIONS } from './languages/translations.js';
import { languageHandler, getCurrentLanguage } from './languages/languageHandler.js';
import { $, setText } from './utilities/dom.js';

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
const $captureWarning = $("#captureWarning");
const $dismissWarning = $("#dismissWarning");
const $continueExportBtn = $("#continueExportBtn");
const $formatLabel = $("#formatLabel");

// Versión dinámica
setText('#versionText', `v${chrome.runtime.getManifest().version}`);

// Mostrar / ocultar opciones de Markdown según el formato
$formatSelect.addEventListener("change", () => {
  $formatSelect.value === "md" ? $mdOptions.hidden = false : $mdOptions.hidden = true;
});

// Iniclizamos el handler de idioma 
languageHandler(TRANSLATIONS);


// Oculta temporalmente las opciones de exportación
function hideOptions() {
  $formatLabel.hidden = true;
  $formatSelect.hidden = true;
  $mdOptions.hidden = true;
  $exportBtn.hidden = true;
}

// Muestra nuevamente las opciones de exportación
function showOptions() {
  $formatLabel.hidden = false;
  $formatSelect.hidden = false;
  $mdOptions.hidden = false;
  $exportBtn.hidden = false;
}

// Obtener configuración actual de exportación
function getExportConfig() {
  return {
    format: $formatSelect.value,
    compact: $compactCheck.checked,
    roleFilter: [...$roleRadios].find((r) => r.checked).value,
  };
}

// Ejecutar exportación real con la configuración dada
function executeExport(config) {
  $exportBtn.disabled = true;
  $statusText.textContent = "";
  $spinner.style.display = "inline-block";

  chrome.runtime.sendMessage(
    { type: "EXPORT", ...config },
    (response) => {
      // Restaurar estado
      $spinner.style.display = "none";
      $exportBtn.disabled = false;

      if (chrome.runtime.lastError) {
        $statusText.textContent = "⚠️ " + chrome.runtime.lastError.message;
        return;
      }

      const currentLang = getCurrentLanguage();

      if (response && response.success === false) {
        const errorPrefix = TRANSLATIONS[response.errorCode]?.[currentLang] 
                            ?? TRANSLATIONS[response.errorCode]?.en 
                            ?? "";
        const errorParam = Object.values(response.params ?? {})[0] ?? "";
        $statusText.textContent = "⚠️ " + errorPrefix + errorParam;
        return;
      }

      $statusText.textContent = `✔️ ${config.format.toUpperCase()}${TRANSLATIONS.success[currentLang]}`;
    }
  );
}

// Exportar conversación (con posible pausa por advertencia)
$exportBtn.addEventListener("click", async () => {
  const config = getExportConfig();

  try {
    const result = await chrome.storage.local.get("captureWarningDismissed");
    if (result.captureWarningDismissed) {
      // Preferencia guardada: exportar directo
      executeExport(config);
    } else {
      // Pausar, ocultar opciones y mostrar advertencia
      hideOptions();
      $captureWarning.hidden = false;
      // Guardar config temporalmente para continuar
      window.__pendingExportConfig = config;
    }
  } catch {
    // Si falla storage, mostrar advertencia por seguridad
    $captureWarning.hidden = false;
    window.__pendingExportConfig = config;
  }
});

// Continuar con la exportación
$continueExportBtn.addEventListener("click", async () => {
  const config = window.__pendingExportConfig;
  if (!config) return;

  // Persistir preferencia si se tildó "no volver a mostrar"
  if ($dismissWarning.checked) {
    try {
      await chrome.storage.local.set({ captureWarningDismissed: true });
    } catch {
      // No bloquear la exportación si falla el guardado
    }
  }

  // Ocultar advertencia y restaurar opciones
  $captureWarning.hidden = true;
  showOptions();
  executeExport(config);
});