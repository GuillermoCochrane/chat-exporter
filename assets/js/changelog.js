//*  Changelog Page orchestrator

import { initCommon } from './shared/commonHandler.js';
import { languageHandler } from './shared/languageHandler.js';
import { COMMONTRANSLATIONS } from './languages/common.js';
import { CHANGELOGTRANSLATIONS } from './languages/changelog.js';

const TRANSLATIONS = { ...COMMONTRANSLATIONS, ...CHANGELOGTRANSLATIONS };

initCommon();
languageHandler(TRANSLATIONS);