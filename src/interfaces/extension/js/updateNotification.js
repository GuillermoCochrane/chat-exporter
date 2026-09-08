import { hideTag, showTag } from './utilities/dom.js';
import { hideOptions, showOptions } from './export/exportHelpers.js';
import { TRANSLATIONS } from './languages/translations.js';
import { getCurrentLanguage } from './languages/languageHandler.js';

const AUTO_HIDE_MS = 15000;

export async function updateNotificationHandler() {
  const currentVersion = chrome.runtime.getManifest().version;
  const { lastSeenVersion } = await chrome.storage.local.get('lastSeenVersion');

  if (lastSeenVersion === currentVersion) return;

  const $banner = document.querySelector('#updateBanner');
  const $title = document.querySelector('#updateAvailable');
  const $link = document.querySelector('#updateLink');
  const $dismiss = document.querySelector('#updateDismiss');

  if (!$banner || !$title || !$link || !$dismiss) return;

  const lang = getCurrentLanguage();

  $title.textContent = TRANSLATIONS.updateAvailable[lang] ?? TRANSLATIONS.updateAvailable.en;
  $link.textContent = TRANSLATIONS.updateLink[lang] ?? TRANSLATIONS.updateLink.en;
  $link.href = 'https://guillermocochrane.github.io/chat-exporter/pages/changelog/';
  $link.target = '_blank';
  $link.rel = 'noopener';

  hideOptions();
  showTag('#updateBanner');

  let timer = null;

  const dismiss = async () => {
    clearTimeout(timer);
    await chrome.storage.local.set({ lastSeenVersion: currentVersion });
    hideTag('#updateBanner');
    showOptions();
  };

  $dismiss.addEventListener('click', dismiss);
  timer = setTimeout(dismiss, AUTO_HIDE_MS);
}