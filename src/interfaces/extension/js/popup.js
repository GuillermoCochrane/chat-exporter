import { TRANSLATIONS } from './languages/translations.js';
import { languageHandler } from './languages/languageHandler.js';
import { exportHandler } from './export/exportHandler.js';
import { formatHandler } from './export/formatHandler.js';
import { setText } from './utilities/dom.js';


// Versión dinámica
setText('#versionText', `v${chrome.runtime.getManifest().version}`);

// Inicializamos el handler de formato de exportación
formatHandler();

// Inicializamos el handler de idioma
languageHandler(TRANSLATIONS);

// Iniciamos el handler de exportación
exportHandler();