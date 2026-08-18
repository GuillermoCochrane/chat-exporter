//* Language handler orquestrators

import { setStartingFlag, flagHandler } from './flaghandler.js';
import { setLanguage, loadLanguage, saveLanguagePreference } from './languageSettings.js';
import {$} from '../utilities/dom.js';

let currentLanguage = "en";

// handler del idioma inicial
async function startingLanguage(translations) {
  const language = await loadLanguage();
  currentLanguage = language;
  setLanguage(language, translations);
  setStartingFlag(language);
  return language;
}

// Handler del cambio de idioma
async function languageToggler(translations) {

  const nextLanguage = flagHandler();
  if (!nextLanguage) return currentLanguage;

  setLanguage(nextLanguage, translations);
  await saveLanguagePreference(nextLanguage);
  currentLanguage = nextLanguage;

  return nextLanguage;
}

// orquestador de los cambios de idioma
export async function languageHandler(translations) {
  const $langToggle = $("#langToggle");
  if (!$langToggle) return;

  currentLanguage = await startingLanguage(translations);

  $langToggle.addEventListener("click", async() => {
    currentLanguage = await languageToggler(translations);
  });
}

// Obtener el idioma actual
export function getCurrentLanguage() {
  return currentLanguage;
}