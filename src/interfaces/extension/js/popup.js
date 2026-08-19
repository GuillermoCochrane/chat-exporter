import { TRANSLATIONS } from './languages/translations.js';
import { languageHandler, getCurrentLanguage } from './languages/languageHandler.js';
import { getExportConfig, hideOptions, showOptions, executeExport } from './export/exportHelpers.js';
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