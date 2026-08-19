import { getExportConfig, hideOptions, showOptions, executeExport } from './exportHelpers.js';
import { $, showTag, hideTag } from '../utilities/dom.js';

const $exportBtn = $("#exportBtn");
const $continueExportBtn = $("#continueExportBtn");
const $dismissWarning = $("#dismissWarning");

export function exportHandler() {

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
        showTag("#captureWarning");

        // Guardar config temporalmente para continuar
        window.__pendingExportConfig = config;
      }
    } catch {
      // Si falla storage, mostrar advertencia por seguridad
      showTag("#captureWarning");
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
    hideTag("#captureWarning");
    showOptions();
    executeExport(config);
  });
}; 