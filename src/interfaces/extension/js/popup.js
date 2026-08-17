import { TRANSLATIONS } from './languages.js';
import { loadLanguage, saveLanguagePreference } from './languageSettings.js';

// Helpers
const $ = (selector) => document.querySelector(selector);
const setText = (selector, text) => { ($(selector)) && ($(selector).textContent = text); };

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

// Traducción dinámica de textos en el DOM
function setlanguage(lang, translations) {
  for (const entry in translations) {
    const value = translations[entry];
    const selector = `#${entry}`;
    const element = $(selector);
    if (!element) continue;

    const property = element.hasAttribute("title") ? "title" : "textContent";
    element[property] = value[lang] || value.en;
  }
}

// Versión dinámica
setText('#versionText', `v${chrome.runtime.getManifest().version}`);

// Idioma actual (se cargará de forma asíncrona)
let currentLang;

async function initLanguage() {
  currentLang = await loadLanguage();
  setlanguage(currentLang, TRANSLATIONS);
  // Mostrar la bandera correcta según el idioma inicial
  const flags = $langToggle.querySelectorAll(".flag");
  flags.forEach(flag => {
    const isActive = flag.dataset.lang === currentLang;
    flag.classList.toggle("active", isActive);
    flag.hidden = !isActive;
  });
}

// Inicializar idioma al cargar el popup
initLanguage();

// Mostrar / ocultar opciones de Markdown según el formato
$formatSelect.addEventListener("change", () => {
  $formatSelect.value === "md" ? $mdOptions.hidden = false : $mdOptions.hidden = true;
});

// Toggle de idioma
$langToggle.addEventListener("click", () => {
  const currentFlag = $langToggle.querySelector(".flag.active");
  const nextFlag = $langToggle.querySelector(".flag:not(.active)");
  const nextLang = nextFlag.dataset.lang;

  // Intercambiar visibilidad
  currentFlag.classList.remove("active");
  currentFlag.hidden = true;
  nextFlag.classList.add("active");
  nextFlag.hidden = false;

  // Efecto de rotación
  $langToggle.classList.add("rotated");
  setTimeout(() => $langToggle.classList.remove("rotated"), 400);

  // Actualizar idioma
  currentLang = nextLang;
  setlanguage(currentLang, TRANSLATIONS);

  // Persistir preferencia
  saveLanguagePreference(currentLang);
});

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