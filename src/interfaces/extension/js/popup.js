import { TRANSLATIONS } from './languages/translations.js';
import { languageHandler } from './languages/languageHandler.js';
import { exportHandler } from './export/exportHandler.js';
import { formatHandler } from './export/formatHandler.js';
import { versionHandler } from './versionHandler.js';
import { updateNotificationHandler } from './updateNotification.js';
import { providerHandler } from './providerHandler.js';

// Inicializamos el handler de versión
versionHandler();

// Inicializamos el handler de formato de exportación
formatHandler();

// Inicializamos el handler de idioma
languageHandler(TRANSLATIONS);

// Inicializamos el handler de exportación
exportHandler();

// Inicializamos el handler de notificación de actualizaciones
updateNotificationHandler();

// Inicializamos el handler de proveedor dinámico
providerHandler();