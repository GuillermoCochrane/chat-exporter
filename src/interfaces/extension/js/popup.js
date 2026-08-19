import { TRANSLATIONS } from './languages/translations.js';
import { languageHandler } from './languages/languageHandler.js';
import { exportHandler } from './export/exportHandler.js';
import { $ , setText } from './utilities/dom.js';

// Elementos estáticos
const $formatSelect = $("#format");
const $mdOptions = $("#mdOptions");

// Versión dinámica
setText('#versionText', `v${chrome.runtime.getManifest().version}`);

// Mostrar / ocultar opciones de Markdown según el formato
$formatSelect.addEventListener("change", () => {
  $formatSelect.value === "md" ? $mdOptions.hidden = false : $mdOptions.hidden = true;
});

// Inicializamos el handler de idioma
languageHandler(TRANSLATIONS);

// Iniciamos el handler de exportación
exportHandler();