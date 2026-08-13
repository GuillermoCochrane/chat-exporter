//* Language handler orquestrators

import { setStartingFlag, flagHandler } from './flaghandler.js';
import { setLanguage, loadLanguage, saveLanguage } from './languageSettings.js';

// handler del idioma inicial
export function startingLanguage(translations) {

  const language = loadLanguage();
  setLanguage(language, translations);
  setStartingFlag(language);

  return language;
};

// Handler del cambio de idioma
export function languageHandler(translations) {

  const nextLanguage = flagHandler();
  setLanguage(nextLanguage, translations);
  saveLanguage(nextLanguage);

  return nextLanguage;
}