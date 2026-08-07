//* Sidebar toggle
import { $ } from '../utilities/dom.js';

export function sidebarToggle() {
  const $sidebar = $('#sidebar');
  const $hamburger = $('#hamburger');
  const isntDesktop = window.innerWidth <= 980;
  console.log("Sidebar", $sidebar);
  console.log("Hamburger", $hamburger);
  if (!$sidebar || !$hamburger) return;

  // Estado inicial según viewport
  $sidebar.hidden = isntDesktop;

  // Toggle al hacer clic en el botón hamburguesa
  $hamburger.addEventListener('click', () => {
    console.log($sidebar.hidden);
    console.log('hizo clic en el botón hamburguesa');
    $sidebar.hidden = !$sidebar.hidden; });

  // Cerrar sidebar al hacer clic en un enlace (solo mobile)
  $sidebar.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      if (isntDesktop) {
        $sidebar.hidden = true;
      }
    });
  });
}