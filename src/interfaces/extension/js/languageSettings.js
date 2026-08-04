// Detecta el idioma inicial considerando la preferencia guardada
// y la configuración del navegador.
// Guarda la preferencia cuando el usuario cambia el idioma.

const SUPPORTED_LANGS = ["es", "en"];

function getBrowserLanguage() {
  return (navigator.language || "en").slice(0, 2).toLowerCase();
}

// Obtiene el idioma que debe usarse al cargar el popup.
// 1. Preferencia guardada en chrome.storage.local.
// 2. Idioma del navegador.
// 3. Fallback a "en".
export async function loadLanguage() {
  try {
    const result = await chrome.storage.local.get("language");
    if (result.language && SUPPORTED_LANGS.includes(result.language)) {
      return result.language;
    }
  } catch {
    // Si falla el storage, continuamos con el idioma del navegador
  }
  const browserLang = getBrowserLanguage();
  return SUPPORTED_LANGS.includes(browserLang) ? browserLang : "en";
}

// Guarda la preferencia de idioma elegida por el usuario.
export async function saveLanguagePreference(lang) {
  try {
    await chrome.storage.local.set({ language: lang });
  } catch {
    // Si falla, simplemente no se persiste (el popup seguirá funcionando)
  }
}