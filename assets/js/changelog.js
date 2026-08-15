//*  Changelog Page orchestrator

import { initCommon } from './shared/commonHandler.js';
import { languageHandler } from './shared/languageHandler.js';
import { COMMONTRANSLATIONS } from './languages/common.js';

const TRANSLATIONS = { ...COMMONTRANSLATIONS, };

initCommon();
languageHandler(TRANSLATIONS);