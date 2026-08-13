//* Language handler orquestrators

import { setStartingFlag, flagHandler } from './flaghandler.js';
import { setLanguage, loadLanguage, saveLanguage } from './languageSettings.js';

// Handler del idioma inicial
export function startingLanguage(translations) {

  const language = loadLanguage();
  setLanguage(language, translations);
  setStartingFlag(language);

  return language;
};

