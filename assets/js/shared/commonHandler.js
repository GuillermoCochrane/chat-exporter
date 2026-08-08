//* Shared Handlers orchestrator

import { themeToggle } from './themeToggle.js';
import { sidebarToggle } from './sidebarToggle.js';
import { intersectionObserver } from './intersectionObserver.js';

export function initCommon() {
  themeToggle();
  sidebarToggle();
  intersectionObserver();
}