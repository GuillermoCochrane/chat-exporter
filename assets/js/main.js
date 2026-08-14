//*  Home Page orchestrator

import { initCommon } from './shared/commonHandler.js';
import { carouselHandler } from './carouselHandler.js';
import { languageHandler } from './shared/languageHandler.js';
import { COMMONTRANSLATIONS } from './languages/common.js';
import { HOMETRANSLATIONS } from './languages/home.js';

const TRANSLATIONS = { ...COMMONTRANSLATIONS, ...HOMETRANSLATIONS };

initCommon();
carouselHandler();
languageHandler(TRANSLATIONS);