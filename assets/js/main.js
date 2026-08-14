//*  Home Page orchestrator

import { initCommon } from './shared/commonHandler.js';
import { carouselHandler } from './carouselHandler.js';
import { languageHandler } from './shared/languageHandler.js';
import { COMMONTRANSLATIONS } from './languages/common.js';

initCommon();
carouselHandler();
languageHandler(COMMONTRANSLATIONS);