import { setText } from "./utilities/dom.js";

export function versionHandler() {
  setText('#versionText', `v${chrome.runtime.getManifest().version}`);
}