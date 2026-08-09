//* Shared Handlers orchestrator

import { themeToggle } from './themeToggle.js';
import { sidebarToggle } from './sidebarToggle.js';
import { intersectionObserver } from './intersectionObserver.js';
import { footerVersion } from './versionHandler.js';

export function initCommon() {
  themeToggle();
  sidebarToggle();
  intersectionObserver();
  footerVersion();
}