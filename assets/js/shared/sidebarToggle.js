//* Sidebar toggle
import { $ } from '../utilities/dom.js';

export function sidebarToggle() {
  const $sidebar = $('#sidebar');
  const $hamburger = $('#hamburger');
  const mediaQuery = window.matchMedia('(max-width: 980px)');
  
  if (!$sidebar || !$hamburger) return;
  
  // Estado inicial según viewport
  $sidebar.hidden = mediaQuery.matches;

  // Escuchar cambios de tamaño de ventana
  mediaQuery.addEventListener('change', (e) => {
    $sidebar.hidden = e.matches;
  });

  // Toggle al hacer clic en el botón hamburguesa
  $hamburger.addEventListener('click', () => {
    $sidebar.hidden = !$sidebar.hidden; });

  // Cerrar sidebar al hacer clic en un enlace (solo mobile)
  $sidebar.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      if (mediaQuery.matches) {
        $sidebar.hidden = true;
      }
    });
  });
}