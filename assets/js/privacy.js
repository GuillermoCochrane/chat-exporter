//*  Privacy Page orchestrator

import { initCommon } from './shared/commonHandler.js';
import { languageHandler } from './shared/languageHandler.js';
import { COMMONTRANSLATIONS } from './languages/common.js';
import { PRIVACYTRANSLATIONS } from './languages/privacy.js';

const TRANSLATIONS = { ...COMMONTRANSLATIONS, ...PRIVACYTRANSLATIONS };

initCommon();
languageHandler(TRANSLATIONS);