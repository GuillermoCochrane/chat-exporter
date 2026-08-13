//* Language Flag Handler
import { $,  $$} from '../utilities/dom.js';

// Handler de banderas de la UI
export function flagHandler() {
  const $langToggle = $('#langToggle');
  if (!$langToggle) return null;

  const $currentFlag = $langToggle.querySelector(".flag.active");
  const $nextFlag = $langToggle.querySelector(".flag:not(.active)");
  if (!$currentFlag || !$nextFlag) return null;

console.log("activeFlag", $currentFlag);
console.log("nextFlag", $nextFlag);

  const nextLang = $nextFlag.dataset.lang;

// Intercambiar visibilidad usando atributos (SVG)
  $currentFlag.classList.remove('active');
  $currentFlag.setAttribute('hidden', '');

  $nextFlag.classList.add('active');
  $nextFlag.removeAttribute('hidden');

  return nextLang;
}
