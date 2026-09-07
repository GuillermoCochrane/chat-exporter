import { executeExport, getExportConfig, hideOptions, showOptions } from './exportHelpers.js';
import { $, hideTag, showTag } from '../utilities/dom.js';

const $exportBtn = $("#exportBtn");
const $continueExportBtn = $("#continueExportBtn");
const $dismissWarning = $("#dismissWarning");

export function exportHandler() {
  // --------------------------------------------------------------------
  // Flujo principal de exportación
  // --------------------------------------------------------------------

  $exportBtn.addEventListener("click", () => {
    const config = getExportConfig();
    executeExport(config);
  });

  // --------------------------------------------------------------------
  // Advertencia de recarga
  // --------------------------------------------------------------------
  // Actualmente deshabilitada porque la captura activa (scroll + SSE)
  // recupera la conversación completa antes de exportar.
  //
  // La lógica se conserva como referencia para futuros proveedores
  // donde la captura parcial sí pueda requerir una advertencia.
  //
  // --------------------------------------------------------------------

  // $exportBtn.addEventListener("click", async () => {
  //   const config = getExportConfig();
  //
  //   try {
  //     const result = await chrome.storage.local.get("captureWarningDismissed");
  //     if (result.captureWarningDismissed) {
  //       executeExport(config);
  //     } else {
  //       hideOptions();
  //       showTag("#captureWarning");
  //       window.__pendingExportConfig = config;
  //     }
  //   } catch {
  //     showTag("#captureWarning");
  //     window.__pendingExportConfig = config;
  //   }
  // });

  // --------------------------------------------------------------------
  // Continuar con la exportación (solo si se reactiva la advertencia)
  // --------------------------------------------------------------------

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
}