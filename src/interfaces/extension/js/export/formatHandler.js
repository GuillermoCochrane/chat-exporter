import { $, showTag, hideTag } from '../utilities/dom.js';

// Handler de formato de exportación
export function formatHandler() {
  const $formatSelect = $('#format');

  $formatSelect.addEventListener('change', () => {
    $formatSelect.value === 'md' ? showTag('#mdOptions') : hideTag('#mdOptions');
  });
}