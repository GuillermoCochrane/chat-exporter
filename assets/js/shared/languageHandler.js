//* Language handler orquestrators

import { setStartingFlag, flagHandler } from './flaghandler.js';
import { setLanguage, loadLanguage, saveLanguage } from './languageSettings.js';
import {$} from '../utilities/dom.js';

let currentLanguage = "en";

// handler del idioma inicial
function startingLanguage(translations) {

  const language = loadLanguage();
  setLanguage(language, translations);
  setStartingFlag(language);

  return language;
};

// Handler del cambio de idioma
function languageToggler(translations) {

  const nextLanguage = flagHandler();
  if (!nextLanguage) return currentLanguage;


  setLanguage(nextLanguage, translations);
  saveLanguage(nextLanguage);

  return nextLanguage;
}

// orquestador de los cambios de idioma
export function languageHandler(translations) {
  const $langToggle = $("#langToggle");

  if (!$langToggle) return;

  currentLanguage = startingLanguage(translations);

  $langToggle.addEventListener("click", () => {
    currentLanguage = languageToggler(translations);
  });
}