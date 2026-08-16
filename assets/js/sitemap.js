//*  Sitemap Page orchestrator

import { initCommon } from './shared/commonHandler.js';
import { languageHandler } from './shared/languageHandler.js';
import { COMMONTRANSLATIONS } from './languages/common.js';
import { SITEMAPTRANSLATIONS } from './languages/sitemap.js';

const TRANSLATIONS = { ...COMMONTRANSLATIONS, ...SITEMAPTRANSLATIONS };

initCommon();
languageHandler(TRANSLATIONS);