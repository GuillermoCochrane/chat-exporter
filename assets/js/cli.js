//*  CLI Page orchestrator

import { initCommon } from './shared/commonHandler.js';
import { languageHandler } from './shared/languageHandler.js';
import { COMMONTRANSLATIONS } from './languages/common.js';
import { CLITRANSLATIONS } from './languages/cli.js';

const TRANSLATIONS = { ...COMMONTRANSLATIONS, ...CLITRANSLATIONS };

initCommon();
languageHandler(TRANSLATIONS);