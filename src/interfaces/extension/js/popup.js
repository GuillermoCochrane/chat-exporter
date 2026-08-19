import { TRANSLATIONS } from './languages/translations.js';
import { languageHandler } from './languages/languageHandler.js';
import { exportHandler } from './export/exportHandler.js';
import { formatHandler } from './export/formatHandler.js';
import { versionHandler } from './versionHandler.js';


// Inicializamos el handler de versión  
versionHandler();

// Inicializamos el handler de formato de exportación
formatHandler();

// Inicializamos el handler de idioma
languageHandler(TRANSLATIONS);

// Inicializamos el handler de exportación
exportHandler();